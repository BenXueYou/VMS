<template>
  <div class="topic-main"
       :style="`width: ${blockWidth}px; top: ${blockTop}px; left: ${blockLeft}px`">
    <div class="main-container">
      <div class="topic-common"
           v-if="topicType === 'car'">
        <div class="title">
          <img src="@/assets/images/communityBoard/car_feel.png">
          <span style="margin-left: 4px;">车辆感知</span>
        </div>
        <div class="panel">
          <img :src="$common.setPictureShow(topicItem.vehiclePic)"
               height="120px"
               width="213px">
          <div class="panel-info">
            <div class="text-show">车牌号码：{{topicItem.vehicleNo}}</div>
            <div class="text-show">车主：{{$common.getCodeName(topicItem.staffName)}}</div>
            <div class="text-show" :title="topicItem.infrastructureUri">住址：{{topicItem.infrastructureUri}}</div>
            <div class="text-show" :title="topicItem.channelName">地点：{{topicItem.channelName}}</div>
            <div class="text-show">时间：{{topicItem.createTime}}</div>
          </div>
        </div>
      </div>
      <div class="topic-common"
           v-if="topicType === 'door'">
        <div class="title">
          <img src="@/assets/images/communityBoard/door_feel.png">
          <span style="margin-left: 4px;">门禁感知</span>
        </div>
        <div class="panel">
          <img :src="doorPictureShow(topicItem)"
               height="142px"
               width="142px">
          <div class="panel-info">
            <div class="text-show">姓名：{{$common.getCodeName(topicItem.name)}}</div>
            <div class="text-show">人员类型：{{tarnsStaffType(topicItem.staffType)}}</div>
            <div class="text-show" :title="topicItem.liveAddress">住址：{{topicItem.liveAddress}}</div>
            <div class="text-show">验证方式：{{$common.transferValidateType(topicItem.recognitionMode)}}</div>
            <div class="text-show" :title="topicItem.location">地点：{{topicItem.location}}</div>
            <div class="text-show">时间：{{topicItem.verifyDatetime}}</div>
          </div>
        </div>
      </div>
      <div class="topic-common"
           v-if="topicType === 'face'">
        <div class="title">
          <img src="@/assets/images/communityBoard/face_feel.png">
          <span style="margin-left: 4px;">人脸感知</span>
        </div>
        <div class="panel">
          <img :src="$common.setPictureShow(topicItem.faceUrl, 'facelog')"
               height="142px"
               width="142px">
          <div class="panel-info">
            <div class="text-show">姓名：{{$common.getCodeName(topicItem.name)}}</div>
            <div class="text-show">人员类型：{{tarnsStaffType(topicItem.staffType)}}</div>
            <div class="text-show">所属库：{{topicItem.libraryName}}</div>
            <div class="text-show" :title="topicItem.liveAddress">住址：{{topicItem.liveAddress}}</div>
            <div class="text-show" :title="topicItem.location">地点：{{topicItem.location}}</div>
            <div class="text-show">时间：{{topicItem.date}}</div>
          </div>
        </div>
      </div>
      <div class="block-arrow"></div>
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
    blockWidth: {
      type: Number,
      default: 410
    },
    topicType: {
      type: String,
      default: "face"
    },
    topicItem: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {};
  },
  created() {},
  activated() {},
  mounted() {},
  methods: {
    tarnsStaffType(staffTypeArr) {
      let staffType = "";
      if (staffTypeArr) {
        staffTypeArr.forEach((v, i) => {
          if (i === 0) {
            staffType = this.$common.getEnumItemName("staff_t", v);
          } else {
            staffType = staffType + "，" + this.$common.getEnumItemName("staff_t", v);
          }
        });
      }
      return staffType;
    },
    doorPictureShow(item) {
      let srcStr = "";
      if (this.$common.transferValidateType(item.recognitionMode) === "刷脸") {
        srcStr = item.facePicInfo ? item.facePicInfo.capture : "";
      } else {
        if (item.facePicInfo && item.facePicInfo.capture) {
          srcStr = item.facePicInfo.capture;
        } else if (item.facePicInfo && item.facePicInfo.id_card) {
          srcStr = item.facePicInfo.id_card;
        } else if (item.facePicInfo && item.facePicInfo.capture) {
          srcStr = item.facePicInfo.capture;
        }
      }
      return this.$common.setPictureShow(srcStr);
    },
  },
  watch: {},
  deactivated() {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.topic-main {
  position: absolute;
  z-index: 1000;
  height: 220px;
  background: rgba($color: #111111, $alpha: 0.9);
  padding: 10px;
  box-sizing: border-box;
  .main-container {
    height: 100%;
    width: 100%;
    border: 1px solid rgba(37, 210, 152, 0.2);
    border-radius: 1px;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    .topic-common {
      height: 100%;
      .title {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #25d298;
        text-align: justify;
        height: 20px;
        line-height: 20px;
      }
      .panel {
        display: flex;
        align-items: center;
        margin-top: 10px;
        height: calc(100% - 40px);
        .panel-info {
          height: 100%;
          margin-left: 15px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #bbbbbb;
          text-align: justify;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .text-show {
            width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .block-arrow {
      position: absolute;
      top: 209px;
      left: 30px;
      height: 0;
      width: 0;
      overflow: hidden;
      font-size: 0;
      line-height: 0;
      border-color: rgba($color: #111111, $alpha: 0.9) transparent transparent
        transparent;
      border-style: solid dashed dashed dashed;
      border-width: 27px 27px 0 0;
    }
  }
}
</style>
