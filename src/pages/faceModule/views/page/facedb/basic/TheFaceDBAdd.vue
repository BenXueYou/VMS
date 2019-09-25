<template>
	<div class="dialogwrapadd">
		<el-dialog :title="title" :visible.sync="diglogvisible" @close="close" width="680px" center>
			<div class="addWrap">
				<div class="addleft">
					<el-form ref="form" label-width="120px">
						<el-form-item label="所属库：">
							<el-select v-model="form.belongto" collapse-tags placeholder="请选择" class="myinput">
								<el-option
									v-for="item in libraryarr"
									:key="item.libraryuuid"
									:label="item.libraryName"
									:value="item.libraryuuid"
									:disabled="item.dynamicFlag"
								></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="姓名：">
							<el-input v-model="form.name" class="myinput"></el-input>
						</el-form-item>

						<el-form-item label="证件类型：">
							<el-select v-model="form.idtype" collapse-tags placeholder="请选择" class="myinput">
								<el-option
									v-for="item in idtypearr"
									:key="item.typestr"
									:label="item.typename"
									:value="item.typestr"
								></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="证件号：">
							<el-input v-model="form.idcard" class="myinput"></el-input>
						</el-form-item>

						<el-form-item label="年龄：">
							<el-input v-model="form.age" class="myinput"></el-input>
						</el-form-item>

						<el-form-item label="性别：">
							<el-select v-model="form.staffsex" collapse-tags placeholder="请选择" class="myinput">
								<el-option v-for="item in sexarr" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="现在地址：">
							<el-input v-model="form.addressnow" class="myinput"></el-input>
						</el-form-item>

						<el-form-item label="民族：">
							<el-input v-model="form.minzu" class="myinput"></el-input>
						</el-form-item>

						<el-form-item label="联系方式：">
							<el-input v-model="form.phone" class="myinput"></el-input>
						</el-form-item>

						<div class="line"></div>

						<el-form-item label="户籍住址：">
							<el-input v-model="form.homeadress" class="myinput"></el-input>
						</el-form-item>

						<el-form-item label="邮箱：">
							<el-input v-model="form.email" class="myinput"></el-input>
						</el-form-item>

						<el-form-item label="单位：">
							<el-input v-model="form.company" class="myinput"></el-input>
						</el-form-item>

						<el-form-item label="部门：">
							<el-input v-model="form.bumen" class="myinput"></el-input>
						</el-form-item>

						<el-form-item label="职务：">
							<el-input v-model="form.zhiwu" class="myinput"></el-input>
						</el-form-item>

						<el-form-item label="座机：">
							<el-input v-model="form.zuoji" class="myinput"></el-input>
						</el-form-item>

						<el-form-item label="备注：">
							<el-input v-model="form.beizhu" class="myinput"></el-input>
						</el-form-item>
					</el-form>
				</div>

				<div class="addRight">
					<input
						id="selectfile"
						type="file"
						accept="image/jpg, image/png, image/jpeg, image/gif"
						@change="changefile"
						hidden
					/>

					<label
						:for="imageArr[0].base64.length?'':'selectfile'"
						class="mainImage"
						@click="selectImage(0)"
					>
						<img
							v-if="!imageArr[0].base64.length"
							src="@/assets/images/addImg.png"
							class="ovo-card-img add-icon"
						/>
						<i v-if="!imageArr[0].base64.length" class="el-icon-circle-plus-outline font-color">添加图片</i>
						<img v-if="imageArr[0].base64.length" class="allimage" :src="imageArr[0].base64" alt />

						<div class="delete" v-if="imageArr[0].base64.length" @click.prevent="deleteImage(0)">
							<i class="el-icon-delete"></i>
						</div>
					</label>

					<div class="fourImage">
						<label
							:for="item.base64?'':'selectfile'"
							class="smallImage"
							@click="selectImage(index)"
							v-for="(item,index) in imageArr"
							:key="index"
							v-if="index>0"
						>
							<img v-if="item.base64.length" :src="item.base64" alt />
							<span v-else>+</span>

							<div class="delete" v-if="item.base64.length" @click.prevent="deleteImage(index)">
								<i class="el-icon-delete"></i>
							</div>
						</label>
					</div>
				</div>
			</div>
			<div style="height:80px;">
				<span slot="footer" class="dialog-footer button-div">
					<el-button type="primary" @click="onSubmit">确 定</el-button>
					<el-button type="primary" @click="close">取 消</el-button>
				</span>
			</div>
		</el-dialog>
		<el-dialog title="图片详情" width="400px" :visible.sync="showBigImaeDialogVisible">
			<img style="max-width:100%;display:block;margin:0 auto;" :src="dialogImageUrl" alt />
		</el-dialog>
	</div>
</template>

<script>
import { uploadbase64, deletepic } from "@/pages/faceModule/api";

export default {
  name: "TheFaceDBDialog",
  props: {
    isUpdate: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    parentForm: {
      type: Object,
      default: function() {
        return {};
      }
    },
    idtypearr: {
      type: Array,
      default: function() {
        return [];
      }
    },
    title: {
      type: String,
      default: "添加人脸"
    },
    libraryuuid: {
      type: String,
      default: ""
    },
    faceDBDialogVisible: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    libraryarr: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },

  data() {
    return {
      showBigImaeDialogVisible: false,
      dialogImageUrl: "",
      diglogvisible: false,
      kuname: "",
      kudescri: "",
      shitu: "",
      kuyanse: "",
      quality: "",
      showcustomize: false,
      mohu: 0.6,
      wanzheng: 1,
      zhedang: 0.6,
      zhuanjiao: 15,
      yangfu: 15,
      qingxie: 15,
      file: "",
      imageArr: [
        {
          base64: "",
          filenmae: "",
          photouuid: ""
        },
        {
          base64: "",
          filenmae: "",
          photouuid: ""
        },
        {
          base64: "",
          filenmae: "",
          photouuid: ""
        },
        {
          base64: "",
          filenmae: "",
          photouuid: ""
        },
        {
          base64: "",
          filenmae: "",
          photouuid: ""
        }
      ],
      sexarr: [
        {
          value: "male",
          label: "男"
        },
        {
          value: "female",
          label: "女"
        }
      ],
      imageIndex: 0,
      form: {
        belongto: "",
        name: "",
        idtype: "",
        idcard: "",
        age: "",
        addressnow: "",
        minzu: "",
        phone: "",
        homeadress: "",
        email: "",
        company: "",
        bumen: "",
        zhiwu: "",
        zuoji: "",
        beizhu: "",
        staffsex: ""
      }
    };
  },
  watch: {
    imageArr() {},
    faceDBDialogVisible: function(val) {
      const _this = this;
      this.diglogvisible = this.faceDBDialogVisible;
      this.$nextTick(function() {
        document.querySelector(".addWrap").scrollTop = 0;
      });
      if (this.diglogvisible && !this.file) {
        this.$nextTick(function() {
          this.file = document.getElementById("selectfile");
          this.file.onchange = function(e) {
            // console.log(e);
            // console.log(_this.file);
            console.log(_this.file.files[0]);
            if (_this.file.files[0]) {
              const that = this;
              var reader = new FileReader();
              reader.readAsDataURL(_this.file.files[0]);
              reader.onload = function(e) {
                var name = _this.file.files[0].name;
                if (!_this.isUpdate) {
                  _this.imageArr.splice(_this.imageIndex, 1, {
                    base64: this.result,
                    filename: _this.file.files[0].name
                  });
                } else {
                  uploadbase64({
                    imageBase64: this.result
                      .replace("data:image/jpeg;base64,", "")
                      .replace("data:image/png;base64,", "")
                      .replace("data:image/jpg;base64,", "")
                  }).then(res => {
                    _this.imageArr.splice(_this.imageIndex, 1, {
                      base64: res.data.data,
                      filename: name,
                      photouuid: ""
                    });
                    console.log(_this.imageArr);
                  });
                }

                that.value = "";
              };
            }
          };
        });
      }
      if (this.diglogvisible) {
        this.$emit("getstafflirary");
      }
      if (!this.isUpdate && this.diglogvisible) {
        this.resetdata();
      }
      if (this.isUpdate && this.diglogvisible) {
        this.resetdata();
        console.log(this.parentForm);
        if (this.parentForm.photos) {
          for (let i = 0; i < this.parentForm.photos.length; i++) {
            this.imageArr[i].base64 = this.parentForm.photos[i].nowUrl;
            this.imageArr[i].photouuid = this.parentForm.photos[i].photouuid;
          }
        }

        this.form = {
          belongto: this.libraryuuid,
          name: this.parentForm.staffName,
          idtype: this.parentForm.credentialtype,
          idcard: this.parentForm.credentialno,
          age: this.parentForm.age,
          addressnow: this.parentForm.address,
          minzu: this.parentForm.nation,
          phone: this.parentForm.contactinfo,
          homeadress: this.parentForm.domicileAddress,
          email: this.parentForm.mailbox,
          company: this.parentForm.company,
          bumen: this.parentForm.department,
          zhiwu: this.parentForm.quarters,
          zuoji: this.parentForm.studioCamera,
          beizhu: this.parentForm.remarks,
          staffsex: this.parentForm.staffsex
        };
      }
    }
  },
  activated() {},
  mounted() {},
  methods: {
    changefile() {
      alert("选择文件成功！");
    },
    deleteImage(index) {
      console.log(index);
      const _this = this;
      var photouuid = this.imageArr[index].photouuid;
      deletepic(photouuid).then(res => {
        console.log(res);
        _this.$message.success("删除成功!");
      });
      this.imageArr.splice(index, 1, {
        base64: "",
        filenmae: "",
        photouuid: ""
      });
    },
    selectImage(index) {
      console.log(index);
      this.imageIndex = index;
      if (this.imageArr[this.imageIndex].base64) {
        this.showBigImaeDialogVisible = true;
        this.dialogImageUrl = this.imageArr[this.imageIndex].base64;
      }
    },
    judge() {
      // 用于判断自定义数字

      if (this.zhuanjiao > 30) {
        this.$message.error("请填写库名称");
        return false;
      }
      return true;
    },
    onSubmit() {
      if (!this.form.belongto) {
        this.$message.error("请选择所属库");
        return;
      }
      if (!this.form.name) {
        this.$message.error("请填写姓名");
        return;
      }
      if (this.form.idcard && !this.form.idtype) {
        this.$message.error("请选择证件类型");
        return;
      }
      var flag = false;
      for (let i = 0, len = this.imageArr.length; i < len; i++) {
        if (this.imageArr[i].base64.length) {
          flag = true;
        }
      }
      if (!flag) {
        this.$message.error("请至少添加一张人员照片");
        return;
      }
      // if(this.form.idcard&&!this.form.staffsex){
      //   this.$message.error("请选择性别");
      //   return;
      // }
      console.log(this.form);
      console.log(this.imageArr);

      var data = {};

      var photoImageList = [];
      if (!this.isUpdate) {
        for (let i = 0, len = this.imageArr.length; i < len; i++) {
          if (this.imageArr[i].base64.length) {
            photoImageList.push(
              this.imageArr[i].base64
                .replace("data:image/jpeg;base64,", "")
                .replace("data:image/png;base64,", "")
                .replace("data:image/jpg;base64,", "")
            );
          }
        }
        Object.assign(data, {
          address: this.form.addressnow,
          age: this.form.age,
          company: this.form.company,
          contactinfo: this.form.phone,
          credentialno: this.form.idcard,
          credentialtype: this.form.idtype,
          department: this.form.bumen,
          domicileAddress: this.form.homeadress,
          libraryuuid: this.form.belongto,
          mailbox: this.form.email,
          nation: this.form.minzu,
          quarters: this.form.zhiwu,
          remarks: this.form.beizhu,
          staffName: this.form.name,
          studioCamera: this.form.zuoji,
          staffsex: this.form.staffsex,
          photoImageList: photoImageList
        });
        this.$emit("submitStaff", data);
      } else {
        for (let i = 0, len = this.imageArr.length; i < len; i++) {
          if (this.imageArr[i].base64.length) {
            photoImageList.push({
              photoUri: this.imageArr[i].base64,
              photouuid: this.imageArr[i].photouuid
            });
          }
        }
        Object.assign(data, {
          staffUuid: this.parentForm.staffUuid,
          address: this.form.addressnow,
          age: this.form.age,
          company: this.form.company,
          contactinfo: this.form.phone,
          credentialno: this.form.idcard,
          credentialtype: this.form.idtype,
          department: this.form.bumen,
          domicileAddress: this.form.homeadress,
          libraryuuid: this.form.belongto,
          mailbox: this.form.email,
          nation: this.form.minzu,
          quarters: this.form.zhiwu,
          remarks: this.form.beizhu,
          staffName: this.form.name,
          studioCamera: this.form.zuoji,
          staffsex: this.form.staffsex,
          photos: photoImageList
        });
        console.log(data);
        this.$emit("updatevip", data);
      }
    },
    close() {
      this.$emit("close");
      this.resetdata();
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
    },
    resetdata() {
      this.form = Object.assign({}, this.form, {
        belongto: this.libraryuuid,
        name: "",
        idtype: "",
        idcard: "",
        age: "",
        addressnow: "",
        minzu: "",
        phone: "",
        homeadress: "",
        email: "",
        company: "",
        bumen: "",
        zhiwu: "",
        zuoji: "",
        beizhu: "",
        staffsex: ""
      });
      this.imageArr = [
        {
          base64: "",
          filenmae: "",
          photouuid: ""
        },
        {
          base64: "",
          filenmae: "",
          photouuid: ""
        },
        {
          base64: "",
          filenmae: "",
          photouuid: ""
        },
        {
          base64: "",
          filenmae: "",
          photouuid: ""
        },
        {
          base64: "",
          filenmae: "",
          photouuid: ""
        }
      ];
    }
  }
};
</script>

<style lang='scss' scoped>
.dialogwrapadd {
	.addWrap {
		font-size: 0px;
		width: 100%;
		max-height: 520px;
		overflow-y: auto;
	}
	.addleft {
		position: relative;
		float: left;
		width: 420px;
	}
	.addRight {
		position: relative;
		float: right;
		width: 200px;
		vertical-align: top;
		.fourImage {
			margin: 15px auto;
			width: 80%;
			height: 40px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			.smallImage {
				position: relative;
				display: inline-block;
				width: 30px;
				height: 30px;
				border: 1px solid rgba(255, 255, 255, 0.13);
				color: rgba(255, 255, 255, 0.3);
				line-height: 30px;
				text-align: center;
				font-size: 20px;
				cursor: pointer;
				overflow: hidden;
				img {
					width: 100%;
					height: 100%;
				}
				&:hover .delete {
					display: block;
				}
				.delete {
					display: none;
					position: absolute;
					right: -10px;
					top: -6px;
					width: 27px;
					height: 18px;
					background: #de3c25;
					transform: rotate(45deg);
					i {
						position: absolute;
						right: 5px;
						top: 5px;
						transform: rotate(-45deg) scale(0.8);
						font-size: 12px;
						color: #fff;
					}
				}
			}
		}
		.mainImage {
			position: relative;
			display: block;
			text-align: center;
			width: 120px;
			height: 146px;
			border: 1px dashed rgba(255, 255, 255, 0.13);
			background: rgb(31, 33, 36);
			margin: 0px auto;
			overflow: hidden;
			cursor: pointer;
			&:hover .delete {
				display: block;
			}
			.delete {
				display: none;
				position: absolute;
				right: -16px;
				top: -10px;
				width: 40px;
				height: 30px;
				background: #de3c25;
				transform: rotate(45deg);
				i {
					position: absolute;
					right: 14px;
					top: 16px;
					transform: rotate(-45deg);
					color: #fff;
				}
			}
			.add-icon {
				display: block;
				margin: 30px auto;
				width: 40.5px;
				height: 35.6px;
			}
			.allimage {
				width: 100%;
				height: 100%;
			}
			i {
				opacity: 0.5;
				font-family: PingFangSC-Regular;
				font-size: 12px;
				color: #28ffbb;
				text-align: right;
			}
		}
	}
	.line {
		width: 600px;
		height: 1px;
		margin-bottom: 15px;
		background: linear-gradient(
			to right,
			rgba(255, 255, 255, 0.15) 0%,
			rgba(255, 255, 255, 0.15) 50%,
			rgba(255, 255, 255, 0) 50%,
			rgba(255, 255, 255, 0) 100%
		);
		background-size: 10px 1px;
		background-repeat: repeat-x;
	}
	.button-div {
		position: absolute;
		width: 260px;
		left: 60px;
		// left:50%;
		// transform: translate(-50%);
		padding: 30px 0px 30px 93px;
		button {
			width: 113px;
		}
	}
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
		margin: 50px;
		transform: translateX(-50%);
	}
	.myinput {
		width: 260px;
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
			.itemInput {
				display: inline-block;
				.el-input {
					width: 65px;
				}
			}
		}
	}
}
</style>

<style lang='scss'>
/* 本页面自定义 */
.dialogwrapadd {
	.el-dialog {
		overflow-y: auto;
	}
	.el-form-item {
		margin-bottom: 10px;
	}
	.el-input__inner {
		padding: 0px 5px 0px 8px;
	}
	.el-form-item__label {
		font-family: "PingFangSC-Regular";
		display: inline-block;
		width: 120px;
		font-size: 14px;
		text-align: right;
		color: #aaaaaa;
	}
}
</style>
