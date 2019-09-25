<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             :modal="modal"
             :class="{'dialogCenter':center}"
             :visible.sync="TreechangeNameDialogVisible">
    <div class='c'>
      <div class="body form-item">
        <label class='label'
               for="">导出备份文件：</label>
        <el-input class='input'
                  v-model="fileName"
                  readonly="readonly"></el-input>
        <el-button class='addIcon'
                   type="primary"
                   id="upgradeFile22"
                   size='small'>
          <img :src="icons.selectfile"
               alt="">
          选取文件
        </el-button>

      </div>
      <div class="body form-item">
        <label class='label'
               for="">进度：</label>
        <el-progress :percentage="percentage"
                     class='progressbar'
                     color="#26D39D"></el-progress>

      </div>
      <div class="body">
        <span class='label'></span>
        <div class="input">
          <el-button @click='confirm'
                     class='btn'
                     type="primary">导入</el-button>
          <el-button @click='close'
                     class='btn'
                     type="primary">停止</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import icons from "@/common/icon.js";
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  name: "TreeChangeNameDialog.vue",
  props: {
    width: {
      type: String,
      default() {
        return "600px";
      }
    },
    title: {
      type: String,
      default() {
        return "导入备份";
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    modal: {
      type: Boolean,
      default() {
        return true;
      }
    },
    deviceUuid: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      icons,
      TreechangeNameDialogVisible: false,
      name: "",
      selectValue: "",
      percentage: 0,
      uploader: null, // 实例化文件上传对象
      fileIdNum: [] // 上传存储的文件流
    };
  },
  computed: {
    fileName() {
      let name = this.fileIdNum.length ? this.fileIdNum[0].name : "";
      return name;
    }
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
  },
  methods: {
    uploadInit() {
      /* eslint-disable */
      const _this = this;
      this.fileIdNum = [];
      this.uploader = new plupload.Uploader({
        browse_button: "upgradeFile22", // 这里填写触发元素的按钮ID
        url: api.huanyuanUrl(this.deviceUuid), //上传的地址
        // url: "${window.config.protocolHeader}192.168.9.166:9220/v1/face/escaped/pluploadUpload",
        multi_selection: false,
        headers: {
          Authorization: _this.$store.state.home.Authorization
        },
        // chunk_size: "1mb", //分段上传，每个小段的大小
        multipart_params: {
          // deviceUuidArr: [this.deviceUuid]
        },
        filters: {
          max_file_size: "2000000mb",
          mime_types: [
            //只允许上传图片和zip文件
            { title: "Zip files", extensions: "zip,rar" }
          ]
        },
        file_data_name: "multipartFile",
        init: {
          FileFiltered(up, file) {
            console.log(file);
          },
          FilesAdded: function(up, files) {
            console.log(up);
            console.log(files);
            for (var i = 0; i < _this.fileIdNum.length; i++) {
              _this.uploader.removeFile(_this.fileIdNum[i].id);
            }
            _this.fileIdNum = [];
            plupload.each(files, function(file) {
              file.percent = 0;
              _this.fileIdNum.push(file); //这里在外面使用个全局的数组来记录上传了多少个文件然后进行处理操作。
              console.log(_this.fileIdNum);
            });
            // 选择完文件，进度条清空
            _this.percentage = 0;
            // alert("文件选择成功");
          },

          UploadProgress: function(up, file) {
            console.log(up);
            _this.percentage = file.percent;
          },
          /**
           * 队列某个文件上传完成进行的回调
           *  @param    uploader        为当前的plupload实例对象
           *  @param    file            触发此事件的文件对象
           *  @param    responseObject  服务器返回的信息对象
           */
          FileUploaded(uploader, file, responseObject) {
            console.log(file);
            console.log(responseObject);
            let res = JSON.parse(responseObject.response);
            if (res.success) {
              // _this.$message.success("文件上传成功！");
              // _this.upgradeProgress();
            } else {
              _this.percentage = 0;
              _this.$message.error("文件上传失败！");
            }
          },
          /**
           * 所有文件上传完成回调函数
           * @param   uploader  当前uploader的实例对象
           * @param   files     上传完成的所有文件对象
           */
          UploadComplete(uploader, files) {
            for (var i = 0; i < _this.fileIdNum.length; i++) {
              _this.uploader.removeFile(_this.fileIdNum[i].id);
            }
            _this.fileIdNum = [];
          },
          Error: function(up, err) {
            console.log("\nError #" + err.code + ": " + err.message);
          }
        }
      });
      this.uploader.init();
      /* eslint-enable */
    },
    confirm() {
      if (this.fileIdNum.length) {
        this.percentage = 0;
        this.uploader.start();
        // this.upgradeProgress();
      } else {
        this.$message.error("请选择文件");
      }

      // if (!this.name) {
      //   this.$message.error("名称不可以为空!");
      //   return;
      // }
      // this.$emit("confirm", this.name);
      // this.$emit("update:visible", false);
    },
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible(val) {
      this.name = "";
      this.TreechangeNameDialogVisible = this.visible;
      if (val) {
        this.$nextTick(() => {
          this.uploadInit();
        });
      } else {
        this.uploader.destroy();
      }
    }
  }
};
</script>
<style lang="scss">
$labelwidth: 5em;
.c {
  .input {
    input {
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
$labelwidth: 10em;
.c {
  overflow: hidden;
  .body {
    width: calc(420px + #{$labelwidth});
    margin: 30px auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .addIcon {
      @include buttonnoborder;
    }
    .progressbar {
      width: 280px;
      line-height: 30px;
      display: inline-block;
    }
    .label {
      width: $labelwidth;
      text-align: right;
      line-height: 30px;
      padding-right: 5px;
      box-sizing: border-box;
      font-family: "PingFangSC-Regular";
      font-size: 12px;
      color: #dddddd;
      text-align: right;
    }
    .input {
      width: 300px;
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;

      .btn {
        height: 30px;
        padding: 7px 21px;
        background: rgba(40, 255, 187, 0.12);
        border: 1px solid rgba(40, 255, 187, 0.8);
        border-radius: 2px;
        border-radius: 2px;
        font-family: "PingFangSC-Regular";
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 0;
      }
    }
  }
  .form-item {
    margin: 0px auto;
    margin-top: 20px;
    &:first-child {
      margin-top: 50px;
    }
  }
}
</style>
