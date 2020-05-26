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
          <div>3.选择文件导入</div>
        </div>
        <div class="intro-download"
             @click="onClickDownload">
          <img src="@/assets/images/download_template.png">
          <div class="download-text">下载房屋模板</div>
        </div>
      </div>
      <div v-show="!loading"
           class="file-import">
        <div class="import-text">导入文件：</div>
        <!-- @click="onClickImportFile" -->
        <div class="import-button"
             type="primary"
             size="small"
             id="buildingImportBtnId">
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
           v-if="startProgress&&!resultMsg.length">
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
             v-if="resultMsg.length"
             style="width:300px;text-align:left;text-indent:30px;color:rgb(223, 86, 86);">
          成功{{successPeople}} 失败{{failPeople}}
          <!-- {{resultMsg}} -->
        </div>
        <div class="import-text"
             v-if="successResultMsg.length"
             style="width:300px;text-align:left;text-indent:30px;color:rgb(38, 211, 157);">
          成功 {{successPeople}} 间 失败 {{failPeople}} 间
          <!-- {{successResultMsg}} -->
        </div>
        <div class="important-text download-text"
             @click="downloadLog"
             v-if="failPeople>0"
             style="color:#26d39d;cursor:pointer;">
          下载失败日志
        </div>
      </div>

    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button :loading="loading"
                 type="primary"
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
      loading: false,
      isCurrentShow: false,
      uploader: null, // 实例化文件上传对象
      fileIdNum: [], // 上传存储的文件流
      url: "",
      percentage: 0,
      successPeople: 0, // 成功导入的人
      failPeople: 0, // 失败的人数
      importTaksUuid: "",
      startProgress: false,
      resultMsg: "",
      successResultMsg: "",
      fileName: "",
      setT: null
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
      this.loading = true;
      api
        .buildingProgressUrl({ importTaksUuid: this.importTaksUuid })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.percentage = parseInt(res.data.data);
            if (this.percentage < 100) {
              if (this.setT) return;
              this.setT = setTimeout(() => {
                this.getProgress();
              }, 2000);
            } else if (this.percentage === 100) {
              clearTimeout(this.setT);
              this.setT = null;
              this.loading = false;
              this.getResult();
            }
          }
        });
    },
    funBuildFile(url, name) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true); // 也可以使用POST方式，根据接口
      xhr.setRequestHeader(
        "Authorization",
        this.$store.state.home.Authorization
      );
      xhr.responseType = "blob"; // 返回类型blob
      xhr.onload = function() {
        // 请求完成
        if (this.status === 200) {
          // 返回200
          var blob = this.response;
          var reader = new FileReader();
          reader.readAsDataURL(blob); // 转换为base64，可以直接放入a标签
          reader.onload = function(e) {
            // 转换完成，创建一个a标签用于下载
            var a = document.createElement("a");
            a.download = name;
            a.href = e.target.result;
            a.click();
          };
        }
      };
      // 发送ajax请求
      xhr.send();
    },
    // 获取导入的结果
    getResult() {
      if (!this.importTaksUuid) {
        this.$message.error("请先上传文件");
        return;
      }
      // tips:基建没有导入结果，直接去错误日志
      // api
      //   .buildIsHaveErrorFile({ importTaksUuid: this.importTaksUuid })
      //   .then(res => {
      //     console.log(res);
      //     this.failPeople = res.data.success;
      //   }).catch(() => {
      //     this.failPeople = false;
      //   });
      api.getResultImport({ taskUuid: this.importTaksUuid }).then(res => {
        console.log(res);
        let data = res.data.data || {};
        this.successPeople = data.success;
        this.failPeople = data.fail;
      });
    },
    // 下载失败日志
    downloadLog() {
      // if (!this.importTaksUuid) {
      //   this.$message.error("请先上传文件");
      //   return;
      // }
      // api.buildingErrorUrl().then(res => {
      //   console.log(res);
      // });
      api.beforeErrorlogDownload(this.importTaksUuid).then(res => {
        console.log(res);
        if (typeof res.data === "string") {
          this.$common.funBuildFile(
            api.buildingErrorUrl(this.importTaksUuid),
            "房屋批量导入错误日志.xlsx"
          );

          // var alink = document.createElement("a");
          // alink.download = "111.xlsx";
          // // 根据blob 创建 url
          // alink.href = api.buildingErrorUrl(this.importTaksUuid);
          // alert(api.buildingErrorUrl(this.importTaksUuid));
          // // 自动点击
          // alink.click();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 初始化上传插件，并实例化
    uploadInit() {
      // 选择文件

      /* eslint-disable */
      const _this = this;
      this.fileIdNum = [];
      if (this.uploader) {
        return;
      }
      // alert(_this.$store.state.home.Authorization);
      this.uploader = new plupload.Uploader({
        browse_button: "buildingImportBtnId", // 这里填写触发元素的按钮ID
        url: api.buildingExportUrl(), //上传的地址
        // url: "http://192.168.9.166:9220/v1/face/escaped/pluploadUpload",
        multi_selection: true,
        headers: {
          Authorization: _this.$store.state.home.Authorization
        }, //token值
        // chunk_size: "1mb", //分段上传，每个小段的大小
        multipart_params: {
          // deviceUuidArr: [this.deviceUuid]
        },
        filters: {
          max_file_size: "2000000mb",
          mime_types: [
            //只允许上传图片和zip文件
            { title: "xlsx files", extensions: "xlsx,xls" }
          ]
        },
        file_data_name: "file",
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
            _this.resultMsg = "";
            _this.successResultMsg = "";
            for (var i = 0; i < _this.fileIdNum.length; i++) {
              _this.uploader.removeFile(_this.fileIdNum[i].id);
            }
            _this.fileIdNum = [];
            plupload.each(files, function(file) {
              file.percent = 0;
              _this.fileIdNum.push(file); //这里在外面使用个全局的数组来记录上传了多少个文件然后进行处理操作。
              console.log(_this.fileIdNum);
              _this.fileName = _this.fileIdNum.length
                ? _this.fileIdNum[0].name
                : "";
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
              _this.successResultMsg = res.msg;
              // _this.$message.success("文件上传成功！");
            } else {
              _this.resultMsg = res.msg;
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
        this.startProgress = true;
        this.uploader.start();
      } else {
        this.$message.error("请选择上传文件！");
      }
      // this.$emit("onCancel");
    },
    onClickDownload() {
      api.beforeDownloadJugde().then(res => {
        console.log(res);
        console.log(typeof res.data);
        if (typeof res.data === "string") {
          var alink = document.createElement("a");
          alink.download = "基建模板.xlsx";
          // 根据blob 创建 url
          alink.href = api.downloadBuliding();
          // 自动点击
          alink.click();
        } else {
          this.$message.error(res.data.msg);
        }
      });

      // api.downloadBuliding().then(res => {
      //   console.log(res);
      //   if (res.data) {
      //     // let data = res.data;
      //     // data.blob().then(blob => {
      //     //   console.log(blob);
      //     //   // js无法判断文件刘是否存在，只能通过类型
      //     //   // 文件流没有数据的时候转码是/html结尾，我这个直接返回一个对象，方便调用的时候处理
      //     //   if (blob.type.endsWith("/html")) {
      //     //     return {
      //     //       msg: "暂无数据"
      //     //     };
      //     //   }
      //     //   let downloadUrl = window.URL.createObjectURL(blob);
      //     //   let anchor = document.createElement("a");
      //     //   let filename = data.headers.get("Content-Disposition");
      //     //   anchor.href = downloadUrl;
      //     //   anchor.download = filename.replace("filename=", "");
      //     //   anchor.click();
      //     //   window.URL.revokeObjectURL(blob);
      //     // });
      //     let url = window.URL.createObjectURL(res.data);
      //     // 人员模板下载
      //     // 将返回的数据包装成blob（方法的具体使用参考mdn）；
      //     // 创建a
      //     var alink = document.createElement("a");
      //     alink.download = "基建模板.xlsx";
      //     // 根据blob 创建 url
      //     alink.href = url;
      //     // 自动点击
      //     alink.click();
      //     window.URL.revokeObjectURL(url);
      //   }
      // });
    },
    onClickImportFile() {}
  },
  computed: {
    // fileName() {
    //   let name = this.fileIdNum.length ? this.fileIdNum[0].name : "";
    //   return name;
    // }
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
        this.resultMsg = "";
        this.successResultMsg = "";
        this.fileName = "";
        this.$nextTick(() => {
          this.uploadInit();
        });
      } else {
        // if (this.uploader) {
        //   this.uploader.destroy();
        // }
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
