<template>
  <el-dialog width="600px"
             :title="title"
             center
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <!--内容-->
    <div class="dialog-content">
      <div class="content-intro">
        <div class="intro-title">批量导入方式：</div>
        <div class="intro-text">
          <div>1.下载人员模板表格</div>
          <div>2.在表格内填写人员信息</div>
          <div>3.将人员照片及表格压缩到一个zip内</div>
          <div>选择zip文件导入</div>
          <div>5.如有未能成功导入的人员，可下载失败日志修改后重新导入</div>
        </div>
        <div class="intro-download"
             @click="onClickDownload">
          <img src="@/assets/images/download_template.png">
          <div class="download-text">下载人员模板</div>
        </div>
      </div>
      <div class="file-import">
        <div class="import-text">导入文件：</div>
        <!-- @click="onClickImportFile" -->
        <div class="import-button"
             type="primary"
             size="small"
             id="importBtnId">
          <img src="@/assets/images/select_file.png">
          <span class="button-text">选择文件</span>
        </div>
        <!-- <div class="import-button">{{fileName}}</div> -->
      </div>
      <div class="file-import">
        <div class="import-text">文件名称：</div>
        <div class="import-text"
             style="width:300px;text-align:left;text-indent:30px;">
          {{fileName || "请选择上传文件"}}
        </div>
      </div>
      <div class="file-import"
           v-if="startProgress">
        <div class="import-text">导入进度：</div>
        <div class="import-text"
             style="width:150px;">
          <el-progress :percentage="percentage"
                       color="#26D39D"></el-progress>
        </div>
      </div>

      <div class="file-import"
           v-if="startProgress">
        <div class="import-text">导入结果：</div>
        <div class="import-text"
             style="width:300px;text-align:left;text-indent:30px;">
          成功{{successPeople}}人 失败{{failPeople}}人
        </div>
        <div class="important-text download-text"
             v-if="failPeople>0"
             @click="downloadLog"
             style="color:#26d39d;cursor:pointer;">
          下载失败日志
        </div>
      </div>

    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="onClickImport">导入</el-button>
      <el-button type="primary"
                 @click="onClickCancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  components: {},
  props: {
    type: {
      tyep: String,
      default() {
        return "resident";
      }
    },
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default() {
        return "Excel批量导入房屋";
      }
    }
  },
  data() {
    return {
      isCurrentShow: false,
      uploader: null, // 实例化文件上传对象
      fileIdNum: [], // 上传存储的文件流
      url: "",
      percentage: 0,
      successPeople: 0, // 成功导入的人
      failPeople: 0, // 失败的人数
      importTaksUuid: "",
      startProgress: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 获取上传的进度
    getProgress() {
      if (!this.importTaksUuid) {
        this.$message.error("请先上传文件");
        return;
      }
      api.exportProgress({ importTaksUuid: this.importTaksUuid }).then(res => {
        console.log(res);
        if (res.data.success) {
          this.percentage = parseInt(res.data.data);
          if (this.percentage < 100) {
            setTimeout(() => {
              this.getProgress();
            }, 2000);
          } else if (this.percentage === 100) {
            this.getResult();
          }
        }
      });
    },
    // 获取导入的结果
    getResult() {
      if (!this.importTaksUuid) {
        this.$message.error("请先上传文件");
        return;
      }
      api.importResult({ importTaksUuid: this.importTaksUuid }).then(res => {
        console.log(res);
        if (res.data.success) {
          this.successPeople = res.data.data.success;
          this.failPeople = res.data.data.fail;
        }
      });
    },
    // 下载失败日志
    downloadLog() {
      if (!this.importTaksUuid) {
        this.$message.error("请先上传文件");
        return;
      }
      var alink = document.createElement("a");
      alink.download = "test.xlsx";
      // 根据blob 创建 url
      alink.href = api.exportsError(this.importTaksUuid);
      // 自动点击
      alink.click();
    },
    // 初始化上传插件，并实例化
    uploadInit() {
      // 选择文件

      /* eslint-disable */
      const _this = this;
      this.fileIdNum = [];
      // if (this.uploader) {
      //   return;
      // }
      this.uploader = new plupload.Uploader({
        browse_button: "importBtnId", // 这里填写触发元素的按钮ID
        url: api.staffExportUrl(this.type), //上传的地址
        // url: "http://192.168.9.166:9220/v1/face/escaped/pluploadUpload",
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
            { title: "Zip files", extensions: "zip" }
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
            _this.importTaksUuid = ""; //重新选取文件的时候，任务uuid清空
            _this.percentage = 0;
            _this.failPeople = 0;
            _this.successPeople = 0;
            _this.startProgress = false;
            for (var i = 0; i < _this.fileIdNum.length; i++) {
              _this.uploader.removeFile(_this.fileIdNum[i].id);
            }
            _this.fileIdNum = [];
            plupload.each(files, function(file) {
              file.percent = 0;
              _this.fileIdNum.push(file); //这里在外面使用个全局的数组来记录上传了多少个文件然后进行处理操作。
              console.log(_this.fileIdNum);
            });
            // alert("文件选择成功");
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
            let res = JSON.parse(responseObject.response);
            console.log(res);
            if (res.success) {
              _this.importTaksUuid = res.data;
              _this.getProgress();
              // _this.$message.success("文件上传成功！");
            } else {
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
    onClickCancel() {
      this.$emit("onCancel");
      this.$emit("update:isShow", false);
    },
    onClickImport() {
      if (this.fileIdNum.length) {
        this.uploader.start();
        this.startProgress = true;
      } else {
        this.$message.error("请选择上传文件！");
      }
      // this.$emit("onCancel");
    },
    onClickDownload() {
      var alink = document.createElement("a");
      alink.download = "test.xlsx";
      // 根据blob 创建 url
      alink.href = api.downloadTempalte(this.type);
      // 自动点击
      alink.click();
      // api.downloadTempalte(this.type).then(res => {
      //   console.log(res);
      //   if (res.data.success) {
      //     let url = res.data.data.url;
      //     if (url) {
      //       // 人员模板下载
      //       // 将返回的数据包装成blob（方法的具体使用参考mdn）；
      //       var xhr = {}; // 模拟数据
      //       var blob = new Blob([xhr.response], {
      //         type: "application/vnd.ms-excel"
      //       });
      //       // 创建a
      //       var alink = document.createElement("a");
      //       alink.download = "test.xlsx";
      //       // 根据blob 创建 url
      //       alink.href = URL.createObjectURL(blob);
      //       // 自动点击
      //       alink.click();
      //     }
      //   }
      // });
    },
    onClickImportFile() {}
  },
  computed: {
    fileName() {
      let name = this.fileIdNum.length ? this.fileIdNum[0].name : "";
      return name;
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
      if (val) {
        this.importTaksUuid = ""; // 重新选取文件的时候，任务uuid清空
        this.percentage = 0;
        this.failPeople = 0;
        this.successPeople = 0;
        this.startProgress = false;
        this.$nextTick(() => {
          this.uploadInit();
        });
      } else {
        this.uploader.destroy();
      }
    }
  },
  destroyed() {}
};
</script>

<style lang="scss" scoped>
.dialog-content {
  width: 100%;
  padding: 2% 2%;
  box-sizing: border-box;
  .content-intro {
    width: 100%;
    display: flex;
    font-family: "PingFangSC-Regular";
    font-size: 12px;
    color: #dddddd;
    .intro-title {
      width: 20%;
      text-align: right;
    }
    .intro-text {
      width: 44%;
      margin-left: 4%;
      border-right: 1px dashed rgba($color: #ffffff, $alpha: 0.15);
      div {
        margin-bottom: 5px;
      }
      &:last-child {
        margin-bottom: 0px;
      }
    }
    .intro-download {
      width: 32%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .download-text {
        font-family: "PingFangSC-Regular";
        font-size: 12px;
        color: #26d39d;
        margin-top: 10px;
      }
    }
  }
  .file-import {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 20px;
    .import-text {
      width: 20%;
      font-family: "PingFangSC-Regular";
      font-size: 12px;
      color: #dddddd;
      text-align: right;
    }
    .import-button {
      margin-left: 4%;
      width: 76%;
      display: flex;
      align-items: center;
      cursor: pointer;
      .button-text {
        font-family: "PingFangSC-Regular";
        margin-left: 5px;
        font-size: 12px;
        color: #26d39d;
        letter-spacing: 0;
      }
    }
  }
}
.dialog-footer {
  padding: 0 0 4% 0;
  box-sizing: border-box;
}
</style>
