<template>
  <el-dialog width="780px"
             title="统计详情"
             class="judge-dialog"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <!-- <div class="content-title">
        <img src="@/assets/images/faceModule/alarm_t.png">
        <span style="margin-left: 10px;">报警类型：{{"疑是黄牛"}}</span>
      </div> -->
      <div class="content-device">
        <span>设备：</span>
        <el-checkbox :indeterminate="isIndeterminate"
                     v-model="checkAll"
                     @change="handleCheckAllChange"
                     style="margin: 0 30px 0 8px">全选</el-checkbox>
        <el-checkbox-group v-model="checkedDevices"
                           @change="handleCheckedDevChange">
          <el-checkbox v-for="dev in devices"
                       :label="dev.channelUuid"
                       :key="dev.channelUuid">
            {{dev.nickName}}
            <div class="device-dot"
                 style="background: #F6C620;"></div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="content-list"
           v-loading="isLoading">
        <template v-for="(item, index) in infoList">
          <div :key="index"
               class="list-item">
            <div class="item-left">
              <div class="item-arrow">
                {{item.captureDatetime ? item.captureDatetime.substr(5, 5) : ""}}
              </div>
            </div>
            <div class="dot"
                 style="background: #F6C620;"></div>
            <div class="item-right">
              <div class="right-item">
                <img :src="$common.setPictureShow(item.faceCapturePhotoUrl, 'facelog')"
                     width="67.7px"
                     height="67.6px"
                     style="margin-left: 6px"
                     class="img-fill">
                <img :src="$common.setPictureShow(item.panoramaCapturePhotoUrl, 'facelog')"
                     width="120.9px"
                     style="margin-left: 6px"
                     height="67.6px"
                     class="img-fill">
                <div class="info-other">
                  <div class="other-span">{{item.captureDatetime}}</div>
                  <div class="other-span">{{item.channelName}}</div>
                  <div class="other-span">{{item.age + "岁" +$common.getEnumItemName("gender", item.genderCapture)}} {{item.mask ? "戴口罩" : "不戴口罩"}}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modelItem: {},
      isCurrentShow: false,
      checkAll: true,
      checkedDevices: [],
      devices: [],
      isIndeterminate: false,
      infoList: [],
      isLoading: false,
      startTime: "",
      endTime: "",
      faceSimilarity: "",
      photoQualitieList: "",
    };
  },
  created() {},
  mounted() {},
  methods: {
    onClickCancel() {
      this.$emit("onCancel");
      this.resetData();
    },
    resetData() {
      this.modelItem = {};
      this.checkAll = true;
      this.checkedDevices = [];
      this.devices = [];
      this.isIndeterminate = false;
      this.infoList = [];
      this.startTime = "";
      this.endTime = "";
    },
    handleCheckAllChange(val) {
      let devIdArr = [];
      if (this.devices) {
        this.devices.forEach(v => {
          devIdArr.push(v.channelUuid);
        });
      }
      this.checkedDevices = val ? devIdArr : [];
      this.isIndeterminate = false;
      this.getJudgeDetails();
    },
    handleCheckedDevChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.devices.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.devices.length;
      this.getJudgeDetails();
    },
    handleChannel() {
      let devIdArr = [];
      if (this.devices) {
        this.devices.forEach(v => {
          devIdArr.push(v.channelUuid);
        });
      }
      this.checkedDevices = devIdArr;
      this.getJudgeDetails();
    },
    getJudgeDetails() {
      this.isLoading = true;
      this.$factTragicHttp.getCompareDetail({
        limit: 100,
        page: 1,
        faceUuid: this.modelItem.faceUuid,
        channelList: this.checkedDevices.toString(),
        snapshotTimeStart: this.startTime,
        snapshotTimeEnd: this.endTime,
        faceSimilarity: this.faceSimilarity,
        photoQualitieList: this.photoQualitieList.toString(),
      }).then(res => {
        let body = res.data;
        this.getCompareDetailSuccess(body);
      })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getCompareDetailSuccess(body) {
      this.isLoading = false;
      this.infoList = body.data.list;
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
      if (val) {
        this.handleChannel();
      }
    }
  }
};
</script>
<style lang="scss">
.judge-dialog {
  .el-textarea__inner {
    background-color: transparent;
  }
  .el-dialog {
    margin-top: 6vh !important;
  }
  .el-textarea__inner {
    border: 1px solid #7c7f81;
  }
}
</style>
<style lang="scss" scoped>
.dialog-content {
  padding: 3% 5% 0 5%;
  box-sizing: border-box;
  height: 570px;
  overflow-y: auto;
  .content-title {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #ffffff;
    display: flex;
    align-items: center;
  }
  .content-device {
    background: rgba($color: #26d39d, $alpha: 0.05);
    height: auto;
    margin-top: 15px;
    padding: 10px 18px;
    box-sizing: border-box;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #ffffff;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    .device-dot {
      border-radius: 55px;
      width: 8px;
      height: 8px;
      display: inline-flex;
    }
  }
  .content-list {
    height: 395px;
    width: 100%;
    border: 1px solid #254a43;
    margin-top: 15px;
    overflow-y: auto;
    &:last-child {
      margin-bottom: 0px;
    }
    .list-item {
      width: 100%;
      position: relative;
      display: flex;
      .item-left {
        width: 22%;
        padding: 23px 15px;
        text-align: center;
        border-right: 1px dashed rgba($color: #26d39d, $alpha: 0.4);
        .item-arrow {
          width: 90px;
          height: 48px;
          background: url("../../../../../assets/images/faceModule/judge_arrow.png")
            center center no-repeat;
          text-align: center;
          line-height: 48px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          display: inline-block;
          position: relative;
          color: #ffffff;
        }
      }
      .dot {
        width: 11px;
        height: 11px;
        border-radius: 100px;
        position: absolute;
        top: 40px;
        left: 178px;
      }
      .item-right {
        display: flex;
        align-items: center;
        justify-content: center;
        .right-item {
          background: rgba($color: #02000e, $alpha: 0.15);
          width: 460px;
          height: 80px;
          margin-left: 35px;
          display: flex;
          align-items: center;
          .info-other {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #dddddd;
            letter-spacing: 0;
            display: flex;
            margin-left: 30px;
            flex-direction: column;
            align-items: flex-start;
            .other-span {
              margin-bottom: 2px;
            }
          }
        }
      }
    }
  }
  .content-status {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #dddddd;
    margin-top: 15px;
    display: flex;
    align-items: center;
  }
}
.dialog-footer {
  padding: 25px 5% 2% 0;
  box-sizing: border-box;
}
</style>
