<template>
  <div class="dialogwrap">
    <el-dialog :title="title"
               :visible.sync="diglogvisible"
               :before-close="close"
               width="580px"
               center>
      <el-form ref="form"
               label-width="150px">
        <el-form-item label="请选择模版类型：">
          <el-select v-model="templatetype"
                     collapse-tags
                     placeholder="请选择"
                     class="myinput">
            <el-option v-for="item in templatetypearr"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr"></el-option>
          </el-select>
        </el-form-item>

        <div class="daorutips">
          注：格式必须与模板一致
          <span @click="downloadtempalte($event)" style="cursor: pointer;">
            <!-- <a id="alink"
               download>模板下载</a> -->
            模板下载
          </span>
        </div>
        <el-form-item label="文件路径：">
          <el-input class="buttoninput"
                    :value="filename"
                    readonly></el-input>
          <el-button id="fileSelect"
                     ref="fileSelect"
                     class="mybutton">浏览</el-button>
        </el-form-item>
      </el-form>
      <span class="dialog-footer button-div btnBox">
        <el-button type="primary"
                   @click="onSubmit">确 定</el-button>
        <el-button type="primary"
                   @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import RestApi from "@/utils/RestApi";

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
  },
  mounted() {
    // this.templatetypearr = window.face.kutemplate;
    this.init();
  },
  data() {
    return {
      diglogvisible: false,
      templatetype: "",
      templatetypearr: [],
      uploader: "", // 文件插件实例化对象
      fileIdNum: [], // 用来保存文件数组
      libraryarr: [],
      RestApi,
      concatLink: ""
    };
  },
  computed: {
    // concatLink() {
    //   return RestApi.api.faceModuleAPi.faceDBApi.downloadDBTemp(this.$store.state.home.projectUuid) + "?templateType=" + this.templatetype;
    // },
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
      if (this.diglogvisible) {
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
        let alink = document.createElement("a");
        alink.download = "person.xlsx";
        alink.href = RestApi.api.faceModuleAPi.faceDBApi.downloadDBTemp(this.$store.state.home.projectUuid) + "?templateType=" + this.templatetype;
        alink.click();
      }
    },
    init() {
      this.templatetypearr = this.$common.getEnumByGroupStr("staff_temp");
    },
    onSubmit() {
      if (!this.templatetype) {
        this.$message.error("请选择模板类型");
        return;
      }
      if (this.fileIdNum.length) {
        this.uploader.settings.multipart_params.templateType = this.templatetype;
        this.uploader.start();
      } else {
        this.$message.error("请上传文件！");
      }
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
        url: RestApi.api.faceModuleAPi.faceDBApi.addDaoKuTask(_this.$store.state.home.projectUuid, this.libraryuuid), // 上传的地址
        // url: "http://192.168.9.166:9220/v1/face/escaped/pluploadUpload",
        headers: {
          Authorization: _this.$store.state.home.Authorization
        }, //token值
        // chunk_size: "1mb", // 分段上传，每个小段的大小
        filters: {
          max_file_size: "2000000mb"
        },
        multipart_params: {
          templateType: _this.templatetype
        },
        file_data_name: "multipartFile",
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

          /**
           * 队列某个文件上传完成进行的回调
           *  @param    uploader        为当前的plupload实例对象
           *  @param    file            触发此事件的文件对象
           *  @param    responseObject  服务器返回的信息对象
           */
          FileUploaded(uploader, file, responseObject) {
            let res = JSON.parse(responseObject.response);
            if (res.success) {
              _this.$message.success("文件导入成功！");
              _this.confirm();
            } else {
              _this.$message.error(res.msg);
            }
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
      this.templatetype = "";
      this.fileIdNum = [];
    },
    close() {
      this.clearallData();
      this.$emit("close");
    },
    confirm() {
      this.clearallData();
      this.$emit("confirm");
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
  height: 32px;
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
