<template>
	<div class="dialogwrap">
		<el-dialog :title="title" :visible.sync="diglogvisible" @close="close" width="580px" center>
			<el-form ref="form" label-width="150px">
				<el-form-item label="人脸库：">
					<el-select v-model="library" collapse-tags placeholder="请选择" class="myinput">
						<el-option
							v-for="item in libraryarr"
							:key="item.faceLibraryUuid"
							:label="item.faceLibraryName"
							:disabled="Boolean(item.editabled)"
							:value="item.faceLibraryUuid"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="导入类型：">
					<el-select v-model="templatetype" collapse-tags placeholder="请选择" class="myinput">
						<el-option
							v-for="item in templatetypearr"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>

				<div class="daorutips">
					注：格式必须与模板一致
					<span @click="downloadtempalte($event)">
						<a :href="concatLink" download>模板下载</a>
					</span>
				</div>
				<el-form-item label="文件路径：">
					<el-input class="buttoninput" :value="filename" readonly></el-input>
					<el-button id="fileSelect" ref="fileSelect" class="mybutton">浏览</el-button>
				</el-form-item>
			</el-form>
			<span class="dialog-footer button-div btnBox">
				<el-button type="primary" @click="onSubmit">确 定</el-button>
				<el-button type="primary" @click="close">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
export default {
  name: "TheFaceDBDialog",
  props: {
    libraryuuid: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: "新建导库任务"
    },
    faceDBDialogVisible: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    kucolor: {
      type: Array,
      default: function() {
        return [
          "rgb(88,121,253)",
          "rgb(1,181,255)",
          "yellow",
          "rgb(255,295,95)"
        ];
      }
    },
    libraryarr: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  mounted() {
    // this.templatetypearr = window.face.kutemplate;
    this.init();
  },
  data() {
    return {
      diglogvisible: false,
      kuname: "",
      kudescri: "",
      shitu: "",
      kuyanse: "",
      exprotway: "local",
      showcustomize: false,
      mohu: 0.6,
      wanzheng: 1,
      zhedang: 0.6,
      zhuanjiao: 15,
      yangfu: 15,
      qingxie: 15,
      //
      templatetype: "",
      templatetypearr: [],
      library: [],
      uploader: "", // 文件插件实例化对象
      fileIdNum: [], // 用来保存文件数组
      downlink: ""
    };
  },
  computed: {
    concatLink() {
      return `http://${window.config.ip}/mppr-file/v1/file/staffImportTemplate/download/${this.templatetype}`;
    },
    filename() {
      var num = [];
      for (var i = 0; i < this.fileIdNum.length; i++) {
        num.push(this.fileIdNum[i].name);
      }
      return num.join("、");
    }
  },
  watch: {
    faceDBDialogVisible: function(val) {
      this.diglogvisible = this.faceDBDialogVisible;
      this.library = this.libraryuuid;
      if (this.diglogvisible) {
        this.$emit("getstafflirary");
        this.$nextTick(function() {
          this.uploadInit();
        });
      } else {
      }
    },
    diglogvisible() {
      if (this.diglogvisible !== this.faceDBDialogVisible) {
        this.$emit("close");
      }
    }
  },
  methods: {
    downloadtempalte(e) {
      if (!this.templatetype) {
        this.$message.info("请选择模板类型!");
        e.preventDefault();
      } else {
        // api.gettemplate(this.templatetype).then(res => {
        //   alert(res);
        // });
      }
    },
    init() {},

    onSubmit() {
      if (!this.kuname) {
        this.$message.error("请填写任务名称名称");
        return;
      }
      if (!this.templatetype) {
        this.$message.error("请填写导库类型");
        return;
      }
      var num = [];
      for (var i = 0; i < this.fileIdNum.length; i++) {
        num.push({
          fileName: this.fileIdNum[i].name,
          fileSize: this.fileIdNum[i].size
        });
      }
      var shijiancuo = Date.now();
      var data = {
        filepath: shijiancuo,
        ftpaddr: "",
        importFileInfoList: num,
        importmode: this.exprotway,
        // libraryuuid: "1",//测试固定导这个库
        libraryuuid: this.library,
        taskname: this.kuname,
        templatetype: this.templatetype,
        updatemode: ""
      };
      console.log(data);
      this.$emit("addDaoKuTask", {
        time: shijiancuo,
        data: data,
        num: this.fileIdNum,
        uploader: this.uploader
      });
    },
    uploadInit() {
      const _this = this;
      this.fileIdNum = [];
      // var el = this.$refs.fileSelect;
      if (this.uploader) {
        return;
      }
      /* eslint-disable */
			this.uploader = new plupload.Uploader({
				browse_button: "fileSelect", // 这里填写触发元素的按钮ID
				url: `http://${window.config.ip}/mppr-file/v1/file/import/pluploadUpload`, // 上传的地址
				// url: "http://192.168.9.166:9220/v1/face/escaped/pluploadUpload",
				headers: {
					token: window.config.token
				}, // token值
				chunk_size: "1mb", // 分段上传，每个小段的大小
				filters: {
					max_file_size: "2000000mb"
				},
				init: {
					FileFiltered(up, file) {
						console.log(file);
					},
					FilesAdded: function(up, files) {
						for (var i = 0; i < _this.fileIdNum.length; i++) {
							_this.uploader.removeFile(_this.fileIdNum[i].id);
						}
						_this.fileIdNum = [];
						/* eslint-disable */
						plupload.each(files, function(file) {
							file.percent = 0;
							_this.fileIdNum.push(file); // 这里在外面使用个全局的数组来记录上传了多少个文件然后进行处理操作。
							// console.log(_this.fileIdNum);
						});
						alert("文件选择成功");
					},

					UploadProgress: function(up, file) {},
					/**
					 * 队列某个文件上传完成进行的回调
					 *  @param    uploader        为当前的plupload实例对象
					 *  @param    file            触发此事件的文件对象
					 *  @param    responseObject  服务器返回的信息对象
					 */
					FileUploaded(uploader, file, responseObject) {
						console.log(file);
						console.log(responseObject);
					},
					/**
					 * 所有文件上传完成回调函数
					 * @param   uploader  当前uploader的实例对象
					 * @param   files     上传完成的所有文件对象
					 */
					UploadComplete(uploader, files) {},
					Error: function(up, err) {
						console.log("\nError #" + err.code + ": " + err.message);
					}
				}
			});
			this.uploader.init();
		},
		clearallData() {
			this.kuname = "";
			this.library = "";
			this.exprotway = "local";
			this.templatetype = "";
			this.fileIdNum = [];
			console.log(this.uploader);
		},
		close() {
			this.$emit("close");
			this.clearallData();
		},
		changequality(val) {
			console.log(val);
			if (val === "自定义") {
				this.showcustom();
			} else {
				this.hidecustom();
			}
		},
		hidecustom() {
			this.showcustomize = false;
		},
		showcustom() {
			this.mohu = 0.6;
			this.wanzheng = 1;
			this.zhedang = 0.6;
			this.zhuanjiao = 15;
			this.yangfu = 15;
			this.qingxie = 15;
			this.showcustomize = true;
		}
	}
};
</script>

<style lang='scss' scoped>
.color {
	display: inline-block;
	width: 16px;
	height: 16px;
	vertical-align: middle;
	border-radius: 2px;
	background-color: #fff;
}
.btn-center {
	position: absolute;
	left: 50%;
	height: 50px;
	transform: translateX(-50%);
}
.myinput {
	width: 260px;
}
.daorutips {
	margin: 10px 0px 20px 150px;
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #bbbbbb;
	span {
		color: #28ffbb;
		cursor: pointer;
		a {
			color: #28ffbb;
		}
	}
}
.mybutton {
	width: 80px;
	padding: 6px 27px;
	position: absolute;
	right: 61px;
	border: 0px;
	height: 30px;
	top: 4px;
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #dddddd;
	background: rgba($color: #ffffff, $alpha: 0.1);
	border-radius: 2px;
}
.customize {
	border-top: 1px dashed #666;
	border-bottom: 1px dashed #666;
	height: 150px;
	overflow: hidden;
	.wrap {
		width: 555px;
		margin: 0 auto;
		padding: 20px 0px;
		line-height: 50px;
		font-size: 0px;
		.itemlabel {
			font-family: "PingFangSC-Regular";
			display: inline-block;
			width: 120px;
			font-size: 14px;
			text-align: right;
			color: #aaaaaa;
		}
		.itemInput {
			display: inline-block;
			.el-input {
				width: 65px;
			}
		}
	}
}
</style>

<style lang='scss'>
// 下拉上弹动画
.slideDownOrUp-enter-active {
	transition: all 0.3s;
}
.slideDownOrUp-enter {
	transform: scale(1, 0);
}
.slideDownOrUp-leave-to /* .fade-leave-active below version 2.1.8 */ {
	transform: scale(1, 1);
}

/* 本页面自定义 */
.dialogwrap {
	.el-form-item {
		margin-bottom: 10px;
		.buttoninput {
			width: 400px;
			.el-input__inner {
				width: 320px;
			}
		}
	}
	.el-input__inner {
		padding: 0px 5px 0px 8px;
		border: 1px solid rgba($color: #ffffff, $alpha: 0.15);
		border-radius: 2px;
	}
	.el-form-item__label {
		font-family: "PingFangSC-Regular";
		display: inline-block;
		width: 120px;
		font-size: 14px;
		text-align: right;
		color: #dddddd;
	}
	.btnBox {
		width: 200px;
		display: block;
		overflow: hidden;
		margin: 20px auto;
	}
}
</style>
