<template>
  <div class="mycontent">
    <div class="imgWrap">
      <el-image :src="data.openDoorPhotoUri"
                :preview-src-list="[data.openDoorPhotoUri]"></el-image>
    </div>
    <div class="info">
      <p>住户：{{$common.plusXing(data.staffName,1,1)}}</p>
      <p>验证类型：{{$common.transferValidateType(recognitionMode)}}</p>
      <p>验证时间：{{data.verifyDatetime}}</p>
      <p class="record"
         @click="playback(data.verifyDatetime)">
        <img src="@/assets/images/communityBoard/record.png"
             alt />
        录像
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: "MyName",
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    recognitionMode: {
      type: String,
      default() {
        return "";
      }
    },
    channelName: {
      type: String,
      default() {
        return "";
      }
    },
    channelUuid: {
      type: String,
      default() {
        return "";
      }
    },
    index: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  methods: {
    playback(time) {
      console.log(time);
      // 根据通道名称 id 时间，来进行视频回放
      // this.$emit("playback", time);
    }
  }
};
</script>
<style lang="scss" scoped>
.mycontent {
  display: flex;
  padding: 10px 0px;
  margin-right: 3px;
  .imgWrap {
    width: 100px;
    height: 100px;
    background-color: #fff;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    padding-left: 5px;
    font-family: "PingFangSC-Regular";
    font-size: 14px;
    color: #dddddd;
    text-align: justify;
    margin: 5px;
    p {
      margin: 0px;
      line-height: 24px;
    }
    img {
      width: 10px;
    }
    .record {
      cursor: pointer;
      color: #00d8a0;
    }
  }
}
</style>
