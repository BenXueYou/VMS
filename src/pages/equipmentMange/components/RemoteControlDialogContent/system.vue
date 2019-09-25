<template>
  <div class='wrap system'>

    <div class="deviceInfoPanel">
      <div class="title ">
        系统管理
      </div>
      <div class="dash-line"></div>
      <ul class="operator">
        <li @click='reboot'>重启</li>
        <li @click='backup'>备份数据</li>
        <li @click='importData'>导入数据</li>
        <li @click="saveReset">保留人员数据并恢复默认设置</li>
        <li @click="deleteReset">删除全部数据并恢复出厂设置</li>
      </ul>
      <div class="title ">
        远程升级
      </div>
      <div class="dash-line"></div>
      <ul class="remote">
        <li>
          <label>当前版本：</label>
          <span class="text">{{appVersion}}</span>
        </li>
        <li>
          <label>导入升级文件：</label>
          <el-input class='input'
                    v-model="fileName"
                    readonly></el-input>
          <el-button class='addIcon'
                     type="primary"
                     id="fileSelect"
                     size='small'>
            <img :src="icons.selectfile"
                 alt="">
            选取文件
          </el-button>
          <el-button class='update'
                     size='small'
                     @click="upgrade"
                     type="primary">
            升级
          </el-button>
        </li>
        <li>
          <label>升级进度：</label>
          <el-progress :percentage="percentage"
                       class='progressbar'
                       color="#26D39D"></el-progress>
        </li>
      </ul>

    </div>

    <confirm-dialog :visible.sync="comfirmDialogVisiable"
                    :confirmText="confirmText"
                    :modal="false"
                    @confirm="comfirm"></confirm-dialog>

    <!-- <the-system-backup-dialog :visible.sync="backupDialogVisiable"
                              :modal="false">

    </the-system-backup-dialog> -->

    <the-system-important-dialog :visible.sync="importantDialogVisiable"
                                 :deviceUuid="deviceUuid"
                                 :modal="false">

    </the-system-important-dialog>
  </div>
</template>

<script>
import ConfirmDialog from "@/common/ConfirmDialog.vue";
import TheSystemBackupDialog from "./TheSystemBackupDialog";
import TheSystemImportantDialog from "./TheSystemImportantDialog";
import * as api from "@/pages/equipmentMange/ajax.js";
import icons from "@/common/icon.js";
export default {
  name: "system",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    deviceUuid: {
      type: String,
      default() {
        return "";
      }
    }
  },
  computed: {
    fileName() {
      let name = this.fileIdNum.length ? this.fileIdNum[0].name : "";
      return name;
    }
  },
  data() {
    return {
      icons,
      percentage: 0,
      confirmText: "",
      comfirmDialogVisiable: false,
      backupDialogVisiable: false,
      importantDialogVisiable: false,
      select: 0,
      uploader: null, // 实例化文件上传对象
      fileIdNum: [], // 上传存储的文件流
      appVersion: "",
      destroyed: false
    };
  },
  components: {
    ConfirmDialog,
    TheSystemBackupDialog,
    TheSystemImportantDialog
  },
  mounted() {
    api.getDeivceInfo(this.deviceUuid).then(res => {
      if (res.data.success) {
        let data = res.data.data;
        data.remarks = data.remarks || {};
        this.appVersion = data.remarks.appVersion;
        console.log(this.data);
      }
    });
    this.uploadInit();
  },
  destroyed() {
    this.destroyed = true;
  },
  methods: {
    upgrade() {
      // 升级设备
      console.log(this.fileIdNum);
      if (this.fileIdNum.length) {
        this.percentage = 0;
        this.uploader.start();
      } else {
        this.$message.error("请选择文件");
      }
    },
    upgradeProgress() {
      api.upgradeProgress(this.deviceUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          let data = res.data.data;
          if (data.length) {
            this.percentage = data[0];
            if (this.percentage !== 100 && !this.destroyed) {
              setTimeout(() => {
                this.upgradeProgress();
              }, 1000);
            }
          }
        }
      });
    },
    uploadInit() {
      /* eslint-disable */
      const _this = this;
      this.fileIdNum = [];
      if (this.uploader) {
        return;
      }
      this.uploader = new plupload.Uploader({
        browse_button: "fileSelect", // 这里填写触发元素的按钮ID
        url: api.getUpgradeUrl() + `?deviceUuidArr=${this.deviceUuid}`, //上传的地址
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
            _this.percentage = parseInt(file.percent * 0.4);
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
              _this.upgradeProgress();
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
    comfirm() {
      if (this.select === 1) {
        // 重启设备
        api.restartDevice(this.deviceUuid).then(res => {
          console.log(res);
          if (res.success) {
            this.$message("重启成功！");
          }
        });
      } else if (this.select === 2) {
        // 保留人员恢复
        api.dataReset("setting", this.deviceUuid).then(res => {
          if (res.success) {
            this.$message.success("恢复成功！");
          }
        });
      } else if (this.select === 3) {
        api.dataReset("data", this.deviceUuid).then(res => {
          if (res.success) {
            this.$message.success("恢复成功！");
          }
        });
      }
    },
    reboot() {
      this.confirmText = "是否重启";
      this.select = 1;
      this.comfirmDialogVisiable = true;
    },
    backup() {
      // this.backupDialogVisiable = true;

      api.dataBackup(this.deviceUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          if (!res.data.data.fileUrl) {
            this.$message.error("文件地址为空！");
            return;
          }
          let fileUrl = api.fileByUrl(res.data.data.fileUrl);
          // alert(fileUrl);
          if (fileUrl) {
            window.location.href = fileUrl;
          }
        }
      });
    },
    importData() {
      this.importantDialogVisiable = true;
    },
    saveReset() {
      this.confirmText = "是否保留人员数据并恢复默认设置？";
      this.select = 2;
      this.comfirmDialogVisiable = true;
    },
    deleteReset() {
      this.confirmText = "是否删除全部数据并恢复默认设置？";
      this.select = 3;
      this.comfirmDialogVisiable = true;
    }
  }
};
</script>

<style lang="scss">
@import "@/style/variables.scss";
.system {
  .input {
    width: 320px;
  }
  input {
    @include input30;
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.wrap {
  height: 100%;
  padding: 13px 15px;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  $labelWidth: 110px;
  .remote {
    list-style: none;
    @include font-s;
    li {
      margin-bottom: 15px;
    }
    label {
      display: inline-block;
      width: $labelWidth;
      text-align: right;
      padding-right: 20px;
    }
    .progressbar {
      width: 280px;
      display: inline-block;
    }
  }
  .addIcon {
    @include buttonnoborder;
  }
  .operator {
    list-style: none;
    margin-left: $labelWidth;
    li {
      width: 240px;
      line-height: 32px;
      text-align: center;
      border-radius: 2px;
      font-size: 12px;
      color: #dddddd;
      background-color: rgba(255, 2555, 255, 0.05);
      margin-bottom: 15px;
      cursor: pointer;
      &:hover {
        font-family: PingFangSC-Regular;
        background: rgba(40, 255, 187, 0.05);
        color: #26d39d;
      }
    }
  }
  .dash-line {
    margin-bottom: 15px;
  }
  .title {
    display: block;
    width: 100%;
    height: 50px;
    line-height: 50px;
    @include font-s;
  }
  .cube {
    position: relative;
    padding-left: 18px;
    box-sizing: border-box;
    &::after {
      content: "";
      position: absolute;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
      width: 5px;
      height: 5px;
      background-color: #aaa;
    }
  }
  .deviceInfoPanel {
    padding: 0px 30px;
    box-sizing: border-box;
  }
}
</style>
