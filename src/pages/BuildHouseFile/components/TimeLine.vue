<template>
  <div class="timelineWrap">
    <div class='oneTimeLeft'
         v-for="(item,index) in data"
         :key="index">
      <div class="time">
        <p>{{item.time}}</p>
        <span>{{item.date}}</span>
      </div>

      <div class="content">
        <div class="flex-st"
             v-for="(im,i) in item.dateChannelArr"
             :key="i">
          <div class="line">
            <div class="circle"></div>
            <div class="line"></div>
          </div>
          <div class="channelList">
            <div class="addressRect">
              {{im.channelName}}
            </div>
            <div class="mywarp">
              <my-name v-for="(it,ix) in im.shootRecord"
                       :recognitionMode="it.recognitionMode"
                       :channelName="it.channelName"
                       :key="ix"
                       :index="ix"
                       :data="it"></my-name>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyName from "./MyName";

export default {
  name: "TimeLine",
  components: {
    MyName
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    playback(index) {
      // staffInfo中第index个数据
      // 进行录像播放
    }
  }
};
</script>

<style lang="scss" scoped>
.oneTimeLeft {
  display: flex;
  padding-top: 20px;
  box-sizing: border-box;
  .time {
    width: 80px;
    text-align: right;
    p {
      font-family: "PingFangSC-Medium";
      font-size: 24px;
      color: #25d298;
      text-align: right;
      margin: 0px;
      padding: 0px;
    }
    span {
      font-family: "PingFangSC-Regular";
      font-size: 12px;
      color: #888888;
      text-align: right;
    }
  }
  .line {
    width: 50px;
    .circle {
      width: 10px;
      height: 10px;
      background: #17edac;
      position: relative;
      border-radius: 50%;
      margin: 0 auto;
      margin-top: 10px;
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 20px;
        width: 20px;
        border-radius: 50%;
        border: 1px solid #17edac;
      }
    }
    .line {
      height: calc(100% - 30px);
      margin: 0 auto;
      margin-top: 15px;
      width: 0px;
      border-right: 1px dashed rgba(37, 210, 152, 0.3);
    }
  }
  .content {
    width: calc(100% - 100px);
    .flex-st {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      .channelList {
        width: calc(100% - 50px);
      }
    }
    .mywarp {
      display: flex;
      flex-wrap: wrap;
    }
    .addressRect {
      height: 35px;
      line-height: 35px;
      margin-bottom: 5px;
      // opacity: 0.1;
      background-image: linear-gradient(
        -90deg,
        rgba(37, 210, 152, 0) 7%,
        rgba(37, 210, 152, 0.1) 77%
      );
      border-radius: 3px;
      font-family: "PingFangSC-Regular";
      font-size: 14px;
      color: #25d298;
      text-align: justify;
      text-indent: 15px;
    }
  }
}
</style>
