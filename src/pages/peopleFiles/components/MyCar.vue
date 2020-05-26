<template>
  <div class="mycontent">
    <div class="imgWrap">
      <img :src="data.src"
           v-show-bigimage
           alt="">
    </div>
    <div class='info'>
      <p>车牌号码：{{data.carLincese}}</p>
      <p>方向：{{data.carDirection}}</p>
      <!-- <p>关联人：{{hideName(data.staffName,1)}}</p> -->
      <p>过车时间：{{data.passTime?data.passTime.split(' ')[1]:''}}</p>
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
    hideName(str, len) {
      console.log(str);
      if (!str) {
        return "";
      }
      let s = str.substr(0, len);
      s += "*".repeat(str.length - len * 2);
      s += str.substr(str.length - len, len);
      return s;
    },
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
  margin-right: 30px;
  .imgWrap {
    width: 160px;
    height: 90px;
    // background-color: #fff;
    img {
      max-width: 100%;
      max-height: 100%;
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
