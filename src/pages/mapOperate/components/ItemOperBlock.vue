<template>
  <div class="info-block"
       :style="`top: ${data.elementType === 'link' ? blockTop + 140 : blockTop}px; left: ${blockLeft}px`">
    <div class="item-block"
         :style="`height: ${data.elementType === 'link' ? '160' : '300'}px;width: ${data.elementType === 'link' ? '350' : '420'}px`">
      <div class="item-title">
        <div class="option-start"></div>
        <div style="margin-left: 12px;">{{data.elementName}}</div>
      </div>
      <div class="item-container">
        <img :src="data.channelInfo && data.channelInfo.channelUrl ? data.channelInfo.channelUrl : require('@/assets/images/map/camera_dev.png')"
             height="160px"
             v-if="data.elementType !== 'link'"
             width="160px">
        <div class="info-detail"
             v-if="data.elementType !== 'link'"
             style="height: 160px;">
          <div class="detail-item">
            <div class="detail-text">通道类型：</div>
            <div class="info-text">{{$common.getEnumItemName("chn", data.elementThirdType)}}</div>
          </div>
          <div class="detail-item">
            <div class="detail-text">厂商：</div>
            <div class="info-text">{{data.channelInfo ? data.channelInfo.devManuf : ""}}</div>
          </div>
          <div class="detail-item">
            <div class="detail-text">能力集：</div>
            <div class="info-text">{{data.channelInfo ? transformScan(data.channelInfo.scanCollectionList) : ""}}</div>
          </div>
          <div class="detail-item">
            <div class="detail-text">在线状态：</div>
            <div class="info-text">{{data.channelInfo ? $common.getEnumItemName("onoffline", data.channelInfo.onlineStatus) : ""}}</div>
          </div>
          <div class="detail-item">
            <div class="detail-text">{{mapType === 'gis' ? "经度" : "Y"}}：</div>
            <div class="info-text">{{data.elementPointY}}</div>
          </div>
          <div class="detail-item">
            <div class="detail-text">{{mapType === 'gis' ? "纬度" : "X"}}：</div>
            <div class="info-text">{{data.elementPointX}}</div>
          </div>
        </div>
        <div class="info-detail"
             v-if="data.elementType === 'link'"
             style="height: 60px;">
          <div class="detail-item"
               style="width:320px">
            <div class="detail-text">热图链接：</div>
            <div class="info-text"
                 style="cursor: pointer;color: #26CD99"
                 title="单击前往链接地图"
                 @click="turnToLinkMap">{{data.elementInfo.linkAddress}}</div>
          </div>
        </div>
      </div>
      <div class="item-button"
           v-if="data.elementSecondType !== 'link'">
        <el-button type="primary"
                   size="small"
                   @click="doorAction"
                   :disabled="!OwnAuthDisabled"
                   v-if="data.elementSecondType === 'door' && isCanDoorAct">
          <img src="@/assets/images/map/action.png">
          操作
        </el-button>
        <el-button type="primary"
                   size="small"
                   @click="videoLook"
                   :disabled="!OwnAuthDisabled"
                   v-if="data.elementSecondType === 'vc'">
          <img src="@/assets/images/map/vc_look.png">
          视频预览
        </el-button>
        <el-button type="primary"
                   size="small"
                   @click="doorLog"
                   v-if="data.elementSecondType === 'door'">
          <img src="@/assets/images/map/door_log.png">
          开门记录
        </el-button>
        <el-button type="primary"
                   size="small"
                   @click="videoBack"
                   :disabled="!OwnAuthDisabled"
                   v-if="data.elementSecondType === 'vc'">
          <img src="@/assets/images/map/vc_back.png">
          视频回放
        </el-button>
        <el-button type="primary"
                   size="small"
                   v-if="isCanCollect"
                   :disabled="!OwnAuthDisabled"
                   @click="eleCollection">
          <img src="@/assets/images/map/add_collect.png">
          {{data.collectionStatus ? "取消收藏" : "加入收藏"}}
        </el-button>
        <el-button type="primary"
                   size="small"
                   @click="alarmRecord">
          <img src="@/assets/images/map/alarm_log.png">
          报警记录
        </el-button>
      </div>
      <img src="@/assets/images/map/close.png"
           class="block-close"
           width="11px"
           @click="closeBlock">
      <div class="block-arrow"
           :style="`top: ${data.elementType === 'link' ? 160 : 300}px;`"></div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    blockTop: {
      type: Number,
      default: 0
    },
    blockLeft: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    },
    mapType: {
      type: String,
      default: "gis"
    },
    isCanCollect: {
      type: Boolean,
      default: true
    },
    isCanDoorAct: {
      type: Boolean,
      default: true
    },
    moduleName: {
      type: String,
      default: "地图操作"
    },
  },
  data() {
    return {
      elementPointX: "",
      elementPointY: "",
      isShowSector: 0,
      isEdit: false,
      item: null,
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  activated() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn(this.moduleName, "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn(this.moduleName, "isOwn");
  },
  methods: {
    closeBlock() {
      this.$emit("closeBlock");
    },
    transformScan(scanArr) {
      let scanStr = "";
      if (!scanArr) {
        return;
      }
      scanArr.forEach((v, i) => {
        switch (v) {
          case "bodySnap":
            scanStr =
              scanStr + "人体" + `${i === scanArr.length - 1 ? "" : "，"}`;
            break;
          case "faceSnap":
            scanStr =
              scanStr + "人脸" + `${i === scanArr.length - 1 ? "" : "，"}`;
            break;
          case "vehicleSnap":
            scanStr =
              scanStr + "车辆" + `${i === scanArr.length - 1 ? "" : "，"}`;
            break;
        }
      });
      return scanStr;
    },
    eleCollection() {
      this.$emit("eleCollection", this.data);
    },
    doorAction() {
      let inOnLine = this.data.channelInfo ? this.$common.getEnumItemName("onoffline", this.data.channelInfo.onlineStatus) : "离线";
      if (inOnLine === "离线") {
        this.$cToast.warn("设备离线，无法操作");
        return;
      }
      this.$emit("doorAction", this.data);
    },
    videoLook() {
      let inOnLine = this.data.channelInfo ? this.$common.getEnumItemName("onoffline", this.data.channelInfo.onlineStatus) : "离线";
      if (inOnLine === "离线") {
        this.$cToast.warn("设备离线，无法查看");
        return;
      }
      this.$emit("videoLook", this.data);
    },
    doorLog() {
      this.$emit("doorLog", this.data);
    },
    videoBack() {
      let inOnLine = this.data.channelInfo ? this.$common.getEnumItemName("onoffline", this.data.channelInfo.onlineStatus) : "离线";
      if (inOnLine === "离线") {
        this.$cToast.warn("设备离线，无法查看");
        return;
      }
      this.$emit("videoBack", this.data);
    },
    turnToLinkMap() {
      this.$emit("turnToLinkMap", this.data);
    },
    alarmRecord() {
      if (this.data.elementThirdType === "door") {
        this.$emit("alarmRecord", this.data);
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
      },
      deep: true
    }
  },
  deactivated() {},
  destroyed() {}
};
</script>
<style lang="scss">
.info-block {
  .el-button--small {
    padding: 9px 8px;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.info-block {
  position: absolute;
  z-index: 1009;
  .item-block {
    height: 300px;
    position: relative;
    width: 420px;
    background: #2a2e31;
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.5);
    border-radius: 2px;
    .item-title {
      height: 50px;
      border: {
        width: 0 0 1px 0;
        style: solid;
        color: rgba($color: #ffffff, $alpha: 0.06);
      }
      display: flex;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ffffff;
      padding: 24px;
      box-sizing: border-box;
      .option-start {
        height: 14px;
        border: {
          width: 0 0 0 3px;
          style: solid;
          color: #26d39d;
        }
      }
    }
    .item-container {
      padding: 18px 24px;
      box-sizing: border-box;
      display: flex;
      .info-detail {
        height: 100%;
        margin-left: 24px;
        display: flex;
        height: 160px;
        flex-direction: column;
        justify-content: space-around;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #dddddd;
        position: relative;
        .detail-item {
          display: flex;
          width: 180px;
          // overflow: hidden;
          // text-overflow: ellipsis;
          white-space: nowrap;
          align-items: center;
          .detail-text {
            text-align: left;
            margin-right: 10px;
          }
          .info-text {
            width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .detail-button {
          position: absolute;
          bottom: -25px;
          right: -5px;
        }
      }
    }
    .item-button {
      padding: 0 19px;
      box-sizing: border-box;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .block-close {
      position: absolute;
      top: 12px;
      right: 12px;
      cursor: pointer;
    }
    .block-arrow {
      position: absolute;
      top: 300px;
      left: 30px;
      height: 0;
      width: 0;
      overflow: hidden;
      font-size: 0;
      line-height: 0;
      border-color: #2a2e31 transparent transparent transparent;
      border-style: solid dashed dashed dashed;
      border-width: 27px 27px 0 0;
    }
  }
}
</style>
