<template>
  <div class="mycontent"
       style="background:rgba(255,255,255,.05);">
    <div class="left">
      <div class="imgWrap"><img v-show-bigimage
             :src="data.panoramaCapturePhotoUrl"
             alt=""></div>
      <p>{{data.passTime}}</p>
    </div>
    <div class="right">
      <div class="imgWrap2">
        <img :src="data.faceCapturePhotoUrl"
             v-show-bigimage
             alt="">
      </div>
      <p>相似度：{{data.similar}}%</p>
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
    }
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.mycontent {
  display: flex;
  padding: 10px 12px 5px;
  margin-right: 35px;
  margin-bottom: 15px;
  p {
    margin: 0px;
    font-family: "PingFangSC-Regular";
    font-size: 14px;
    color: #dddddd;
    text-align: center;
    line-height: 30px;
  }
  .left {
    .imgWrap {
      width: 100px;
      height: 100px;
      // background-color: #fff;
      text-align: center;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    margin-right: 15px;
  }
  .right {
    .imgWrap2 {
      width: 178px;
      height: 100px;
      // background-color: #fff;
      text-align: center;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
</style>
