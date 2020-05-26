<template>
  <div class="mycontent">
    <div class="imgWrap">
      <el-image :src="data.peopleSrc"
                :preview-src-list="[data.peopleSrc]"></el-image>

    </div>
    <div class='info'>
      <p>验证类型：{{$common.transferValidateType(data.recognitionMode)}}</p>
      <p>验证时间：{{data.verifyDatetime}}</p>
      <p class='record'
         @click="playback(data.verifyDatetime)">
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
  computed: {
    peopleSrc() {
      let data = this.data || {};

      return data.verifyHitPhotoUri || "";
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
  padding: 0px 0px 15px;
  margin-right: 5px;
  .imgWrap {
    width: 100px;
    height: 100px;
    // background-color: #fff;
    text-align: center;
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
      line-height: 30px;
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
