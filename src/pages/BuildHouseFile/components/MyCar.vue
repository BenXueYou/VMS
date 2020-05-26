<template>
  <div class="mycontent">
    <div class="imgWrap">
      <el-image :src="data.src"
           :preview-src-list="[data.src]"
           alt=""></el-image>
    </div>
    <div class='info'>
      <p>关联人：{{$common.plusXing(data.staffName,1,1)}}</p>
      <p>车牌号码：{{data.carLincese}}</p>
      <p>方向：{{data.carDirection}}</p>
      <p>过车时间：{{data.passTime}}</p>
      <p class='record'
         @click="playback(data.passTime)">
        <img src="@/assets/images/communityBoard/record.png"
             alt="">
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
    channelUuid: {
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
  margin:0px 24px 20px 0;
  .imgWrap {
    width: 190px;
    height: 110px;
    // background-color: #fff;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    padding-left: 10px;
    font-family: "PingFangSC-Regular";
    font-size: 14px;
    color: #dddddd;
    text-align: justify;
    p {
      margin: 0px;
      line-height: 22px;
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
