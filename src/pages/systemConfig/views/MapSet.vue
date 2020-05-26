<template>
  <div class="map-set">
    <div class="set-main">
      <div class="main-title">
        <div class="title-split"></div>
        <span>地图设置</span>
      </div>
      <div class="main-container">
        <div>GIS地图供应商</div>
        <div class="map-res">
          <template v-for="(item, index) in mapResArr">
            <div :key="index"
                 class="map-block"
                 @click="clickBlock(item)"
                 :style="setBlockStyle(item)">
              <img src="@/assets/images/sys/selected.png"
                   class="select-icon"
                   v-if="item.selected">
              <div>
                <img :src="item.icon">
              </div>
              <div class="item-text">{{item.name}}</div>
            </div>
          </template>
        </div>
        <div class="line-item">
          <div>离线地图</div>
          <el-switch v-model="isOffLine"
                     active-color="rgba(32,204,150,0.2)"
                     inactive-color="rgba(255,255,255,0.2)"
                     :active-value="1"
                     :disabled="!OwnAuthDisabled"
                     :inactive-value="0"
                     style="margin-left: 40px;"></el-switch>
        </div>
        <div style="margin-top: 40px;"
             v-show="isOffLine">请选择离线地图包</div>
        <div style="margin-top: 30px;"
             v-show="isOffLine">
          <el-input class="search-input"
                    :value="filename"
                    readonly
                    :disabled="!OwnAuthDisabled"
                    id="fileSelect"
                    ref="fileSelect"
                    size="small"
                    style="width: 280px;"
                    placeholder="请选择文件">
          </el-input>
          <el-button @click="upload"
                     type="primary"
                     :disabled="!OwnAuthDisabled"
                     :loading="onSubmitLoading"
                     style="margin-left: 8px;"
                     size="small">
            上传
          </el-button>
        </div>
        <el-progress :percentage="percentage"
                     class="progressbar"
                     color="#26D39D"
                     v-show="isOffLine && isShowPerc"
                     style=""></el-progress>
        <div style="margin-top: 80px;">
          <el-button @click="save"
                     type="primary"
                     :disabled="!OwnAuthDisabled"
                     size="small">
            保存
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RestApi from "@/utils/RestApi";

export default {
  components: {},
  props: {},
  data() {
    return {
      mapResArr: [
        {
          type: "baidu",
          name: "百度地图",
          selected: true,
          icon: require("@/assets/images/sys/baidu.png")
        },
        {
          type: "gaode",
          selected: false,
          name: "高德地图",
          icon: require("@/assets/images/sys/gaode.png")
        },
        {
          type: "google",
          selected: false,
          name: "谷歌地图",
          icon: require("@/assets/images/sys/google.png")
        }
      ],
      percentage: 0,
      uploader: null,
      fileIdNum: [],
      mapSetData: {
        supplier: "baidu",
        onlineMap: 1,
      },
      onSubmitLoading: false,
      isShowPerc: false,
      isOffLine: 0,
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  activated() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("地图设置", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("地图设置", "isOwn");
    if (this.ShowAuthDisabled) {
      this.getMapSet();
      this.$nextTick(() => {
        this.uploadInit();
      });
    }
  },
  methods: {
    setBlockStyle(item) {
      let blockStyle = "";
      if (item.selected) {
        blockStyle =
          "border: 1px solid rgba(37,210,152,0.3); background: rgba(37,210,152,0.05); ";
      } else {
        blockStyle =
          "border: 1px solid rgba(221,221,221,0.15); background: transparent; ";
      }
      if (item.type === "gaode" || item.type === "google") {
        blockStyle = blockStyle + "cursor: not-allowed;";
      }
      return blockStyle;
    },
    clickBlock(item) {
      if (item.type === "gaode" || item.type === "google") {
        return;
      }
      for (let item2 of this.mapResArr) {
        this.$set(item2, "selected", false);
      }
      this.$set(item, "selected", true);
      this.mapSetData.supplier = item.type;
    },
    upload() {
      if (this.fileIdNum.length) {
        // this.uploader.settings.multipart_params.mapPictureFile = this.mapPictureFile;
        this.uploader.settings.multipart_params.tempFileUuid = new Date().getTime();
        this.isShowPerc = true;
        this.uploader.start();
        this.onSubmitLoading = true;
      } else {
        this.isShowPerc = false;
        this.$message.error("请上传文件！");
      }
    },
    save() {
      this.updateMapSet();
    },
    uploadInit() {
      const _this = this;
      this.fileIdNum = [];
      // var el = this.$refs.fileSelect;
      if (this.uploader) {
        return;
      }
      /* eslint-disable */
      let num = new Date().getTime();
      this.uploader = new plupload.Uploader({
        browse_button: "fileSelect", // 这里填写触发元素的按钮ID
        url: RestApi.sysApi.mapSetApi.uploadMap, // 上传的地址
        // url: "http://192.168.9.166:9220/v1/face/escaped/pluploadUpload",
        headers: {
          Authorization: _this.$store.state.home.Authorization
        }, //token值
        chunk_size: "5mb", // 分段上传，每个小段的大小
        filters: {
          max_file_size: "5000000mb"
        },
        multipart_params: {
        //  mapPictureFile: _this.mapPictureFile
          tempFileUuid: num
        },
        file_data_name: "file",
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
            _this.percentage = 0;
            alert("文件选择成功");
          },
          UploadProgress: function(up, file) {
            _this.percentage = file.percent;
            if (file.percent == 100) {
              _this.onSubmitLoading = false;
              _this.$mapConfigHttp.setMapSysLog({
                logType: "config",
                moduleName: "系统配置",
                logEvent: "input",
                detail: "上传离线地图包"
              });
            }
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
    getMapSet() {
      this.$sysConfigHttp.getMapSet().then(res => {
        if (res.data.data) {
          this.mapSetData = res.data.data;
          this.isOffLine = this.mapSetData.onlineMap ? 0 : 1;
          this.mapResArr.forEach(v => {
            this.$set(v, "selected", false);
            if (v.type === this.mapSetData.supplier) {
              this.$set(v, "selected", true);
            }
          });
        } else {
          this.mapSetData = {
            supplier: "baidu",
            onlineMap: 1
          }
        }
      });
    },
    updateMapSet() {
      this.mapSetData.onlineMap = this.isOffLine ? 0 : 1;
      this.$sysConfigHttp.updateMapSet(this.mapSetData).then(res => {
        this.$cToast.success(res.data.msg);
        this.$mapConfigHttp.setMapSysLog({
          logType: "config",
          moduleName: "系统配置",
          logEvent: "edit",
          detail: "修改地图配置"
        });
        this.getMapSet();
      });
    },
  },
  watch: {},
  deactivated() {},
  destroyed() {},
  computed: {
    filename() {
      var num = [];
      for (var i = 0; i < this.fileIdNum.length; i++) {
        num.push(this.fileIdNum[i].name);
      }
      return num.join("、");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.map-set {
  padding: 30px;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  .set-main {
    background: #212325;
    width: 100%;
    height: 100%;
    padding: 0px 30px;
    box-sizing: border-box;
    .main-title {
      width: 100%;
      height: 61px;
      border: {
        width: 0 0 1px 0;
        style: dashed;
        color: rgba($color: #ffffff, $alpha: 0.2);
      }
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #dddddd;
      display: flex;
      align-items: center;
      .title-split {
        height: 16px;
        border: {
          width: 0 2px;
          style: solid;
          color: #25d298;
        }
        margin-right: 10px;
        border-radius: 1px;
        margin-left: 3px;
      }
    }
    .main-container {
      padding: 40px;
      height: 80%;
      overflow: auto;
      box-sizing: border-box;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #dddddd;
      .map-res {
        margin-top: 24px;
        display: flex;
        .map-block {
          width: 220px;
          height: 130px;
          margin-right: 30px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          position: relative;
          .select-icon {
            position: absolute;
            bottom: 5px;
            right: 5px;
          }
          .item-text {
            margin-top: 18px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: rgba($color: #dddddd, $alpha: 0.8);
          }
        }
      }
      .line-item {
        margin-top: 40px;
        display: flex;
      }
      .progressbar {
        width: 280px;
        line-height: 30px;
        display: inline-block;
        margin-top: 30px;
      }
    }
  }
}
</style>
