<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :modal="false"
             :append-to-body="true"
             :visible.sync="TreechangeNameDialogVisible">
    <div class='body'>
      <div class="title">
        <!-- <el-button type="primary"
                   class='researchbutton'
                   size="small"
                   @click="research"
                   icon="el-icon-search">重新搜索</el-button> -->
      </div>
      <el-table ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                max-height="300">

        <el-table-column prop="devName"
                         width='120'
                         label="设备名称">
        </el-table-column>

        <el-table-column prop="ip"
                         label="IP地址">
        </el-table-column>
        <el-table-column prop="macAddress"
                         label="MAC地址">
        </el-table-column>
        <el-table-column prop="devId"
                         label="设备ID">
        </el-table-column>
        <el-table-column prop="progress"
                         label="进度">
          <template slot-scope="scope">

            <el-progress v-if="scope.row.progress>=0"
                         :percentage="scope.row.progress"
                         color="#26D39D"></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div class="succeesTextColor"
                 v-if="scope.row.progress>=1&&scope.row.progress<=99">
              升级中
            </div>
            <div class="succeesTextColor"
                 v-else-if="scope.row.progress==100">
              升级成功
            </div>
            <div class="deleteText"
                 v-else-if="scope.row.progress==-1">
              升级失败
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot='footer'
         class='footer'>
      <div class="selectFile">
        <label>文件路径: </label>
        <el-input class='input'
                  v-model="fileName"
                  readonly="readonly"
                  size="small"></el-input>
        <el-button class='addIcon'
                   type="primary"
                   id="selectFile"
                   size='small'>
          <img :src="icons.selectfile"
               alt="">
          选取文件
        </el-button>
      </div>

      <el-button @click='confirm'
                 type="primary">确定</el-button>
      <el-button @click='close'
                 type="primary">取消</el-button>
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
        return "1000px";
      }
    },
    title: {
      type: String,
      default() {
        return "批量升级";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    },
    data: {
      type: Array,
      default() {
        return [];
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
      tableData: [],
      TreechangeNameDialogVisible: false,
      uploader: null, // 实例化文件上传对象
      fileIdNum: [], // 上传存储的文件流
      url: "",
      timer: null
    };
  },
  mounted() {
    // this.TreechangeNameDialogVisible = this.visible;
    // let arr = [];
    // for (let i = 0; i < 5; i++) {
    //   arr.push({
    //     ip: "192.128.1.1",
    //     devId: "123456789",
    //     devName: "VB510F",
    //     mac: "MAC地址",
    //     progress: ~~(Math.random() * 100),
    //     status: ~~(Math.random() * 3 + 1)
    //   });
    // }
    // this.tableData = arr;
  },
  methods: {
    uploadInit() {
      // 选择文件

      /* eslint-disable */
      const _this = this;
      this.fileIdNum = [];
      // if (this.uploader) {
      //   return;
      // }
      this.uploader = new plupload.Uploader({
        browse_button: "selectFile", // 这里填写触发元素的按钮ID
        url: api.getNewUpgradeUrl(), //上传的地址
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
            { title: "Zip files", extensions: "zip,rar,upf" }
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

          UploadProgress: function(up, file) {
            for (let i = 0; i < _this.tableData.length; i++) {
              _this.tableData[i].progress = parseInt(file.percent * 0.4);
            }
            _this.tableData.concat();
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
              _this.upgradeAfterUp(res.data);
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
    upgradeAfterUp(fileUrl) {
      api
        .getUpgradeUrl({
          deviceUuidArr: this.url,
          fileUrl
        })
        .then();
    },
    research() {
      this.upgradeProgress();
    },
    handleSelectionChange() {},
    upodateItem() {},
    getData() {},
    upgradeProgress() {
      api.upgradeProgress(this.url).then(res => {
        console.log(res);
        if (res.data.success) {
          let data = res.data.data;
          let flag = true;
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              if (data[i] !== 100) {
                flag = false;
              }
              this.tableData[i].progress = data[i];
            }
          }
          if (!flag) {
            this.timer = setTimeout(() => {
              this.upgradeProgress();
            }, 2000);
          }
        }
      });
    },
    confirm() {
      if (this.fileIdNum.length) {
        this.percentage = 0;
        this.uploader.start();
      } else {
        this.$message.error("请选择文件");
      }
      // this.$emit("confirm", this.name);
      // this.$emit("update:visible", false);
    },
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    }
  },
  watch: {
    visible(val) {
      this.TreechangeNameDialogVisible = this.visible;
      if (val) {
        let data = JSON.parse(JSON.stringify(this.data));
        for (let i = 0; i < this.data.length; i++) {
          data[i].progress = 0;
        }
        this.url = this.data.reduce(
          (sum, item, index) =>
            sum + (index === 0 ? "" : ",") + item.deviceUuid,
          ""
        );
        this.tableData = data;
        this.uploadInit();
      } else {
        this.tableData = [];
        clearInterval(this.timer);
        this.uploader.destroy();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/style/variables.scss";

@mixin padding {
  padding: 10px 46px 30px;
  box-sizing: border-box;
}
.researchbutton {
  @include buttonnoborder;
}
.body {
  @include padding;
  .title {
    height: 40px;
    line-height: 30px;
    @include font-s;
  }
  .righttips {
    float: right;
    .test {
      padding-right: 20px;
    }
    .refresh {
      cursor: pointer;
      img {
        display: inline-block;
        vertical-align: middle;
      }
      color: $add-text-color;
    }
  }
}
.selectFile {
  float: left;
  label {
    @include font-s;
  }
  .input {
    width: 300px;
  }
  .addIcon {
    @include buttonnoborder;
  }
}
.footer {
  @include padding;
  overflow: hidden;
  button {
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
</style>
