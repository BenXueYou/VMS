<template>
  <div class='controlPanel'>
    <div class="head">
      <ul>
        <li>
          <img :src="icons.play"
               @play="play"
               alt="">
        </li>
        <li>
          <img :src="icons.stop"
               @click="stop"
               alt="">
        </li>
        <li>
          <img :src="icons.zhen"
               @click="singleFrame"
               alt="">
        </li>
        <div class="splitline">

        </div>
        <li>
          <img :src="icons.forward"
               @click="speedUp"
               alt="">
        </li>
        <li style="width:80px;">
          <el-input class='speed'
                    readonly=""
                    @change="changeSpeed"
                    v-model='speed'></el-input>
        </li>
        <li>
          <img :src="icons.backward"
               @click="slowDown"
               alt="">
        </li>
      </ul>
      <div class="centertime">
        {{centerTime}}
      </div>
      <ul>
        <li style="width:20px;">
          <img :src="icons.voice2"
               alt="">
        </li>
        <li style="width:80px;">
          <el-slider v-model="voice"
                     type="number"
                     class='center'>
          </el-slider>
        </li>
        <li style="width:60px;">
          <!-- <el-input class='speed'
                    v-model='speed'></el-input> -->
          <el-select class='speed'
                     @change="changeFenlu"
                     v-model='chooseFenlu'>
            <el-option v-for="(item,index) in fenlu"
                       :key="index"
                       :value="item">{{item}}</el-option>
          </el-select>
        </li>
        <li style='width:50px;'>
          <div class='center'
               @click="download"
               style='cursor:pointer;'><img :src="icons.download"
                 alt="">
            下载</div>
        </li>
        <li style='width:70px;'>
          <div class='center'
               style='cursor:pointer;'
               @click='saveView'><img :src="icons.save"
                 alt="">
            保存视图</div>
        </li>
        <li>
          <img :src="icons.fullScreen"
               @click="fullScreen"
               alt="">
        </li>
      </ul>
    </div>
    <div class="timePanel">
      <div class="left">
        <div class="zoomPanel">
          <img :src="icons.zoomIn "
               @click="zoomFc(-1)"
               class='cursor'
               alt="">
          <el-slider class="mmm"
                     :min='1'
                     :max='10'
                     :step='1'
                     v-model="zoom"></el-slider>
          <img :src="icons.zoomOut"
               class='cursor'
               @click="zoomFc(1)"
               alt="">
        </div>
        <div class='window'>
          <div class="windowItem"
               v-for="(item,index)  in controlData"
               :key="index">
            {{item.rtspUrl?(item.fileName):('窗口'+(index+1))}}&nbsp;
          </div>
        </div>
      </div>
      <div class="right">
        <div class="leftControl">
          <div class="moveLeft">
            <div class="button"
                 @click='moveTimeLine(-1)'>
              <img :src="icons.doubleLeft"
                   alt="">
            </div>
          </div>
          <div class="moveLeft"
               v-for="(item,index)  in controlData"
               :key="index">
            <div class="button2 cursor">
              <img :src="icons.down"
                   alt="">
            </div>
          </div>
        </div>

        <div class="timeline">
          <!-- 时间轴，小挑战 -->
          <timeline :scale="zoomNow"
                    :left="left"
                    :move="move"
                    :startTime="startTime"
                    :endTime="endTime"
                    @zoomFc="zoomFc"></timeline>
          <time-select v-for="(item,index)  in controlData"
                       :scale="zoomNow"
                       :startTime="startTime"
                       :endTime="endTime"
                       :timeData="item.timeData"
                       @chooseTime="chooseTime"
                       :left="left"
                       :move="move"
                       :index="index"
                       :key="index">

          </time-select>
        </div>
        <div class="leftControl">
          <div class="moveLeft">
            <div class="button cursor"
                 @click='moveTimeLine(1)'>
              <img :src="icons.doubleRight"
                   alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icons from "@/common/icon.js";
import timeline from "./timeline";
import timeSelect from "./timeSelect";
export default {
  name: "ControlPanel",
  components: {
    timeline,
    timeSelect
  },
  props: {
    startTime: {
      type: String,
      default() {
        return "2019-10-01 00:00:00";
      }
    },
    endTime: {
      type: String,
      default() {
        return "2019-10-16 00:00:00";
      }
    },
    data: {
      type: Array
    },
    fenlu: {
      type: Array
    },
    // 用来表示正在操作的是第几个
    operatorIndex: {
      type: Number,
      default() {
        return 1;
      }
    },
    speed: {
      type: Number,
      default() {
        return 1;
      }
    }
  },
  data() {
    return {
      icons,
      voice: 50,
      zoom: 1, // 时间轴缩放倍数
      move: 0,
      left: 0,
      chooseFenlu: 0,
      controlData: []
    };
  },
  computed: {
    centerTime() {
      // 返回当前时间轴中间的时间的年月日
      let d1 = new Date(this.startTime).getTime();
      let d2 = new Date(this.endTime).getTime();
      let middleValue = d2 - d1;
      let panleWidth = Math.pow(2, this.zoomNow - 1) * 100;
      let nowCenter = Math.abs(this.left) + 50;
      // console.log(nowCenter);
      // console.log(panleWidth);
      let timeNow = ~~((nowCenter / panleWidth) * middleValue);
      let d = new Date(d1 + timeNow);
      const change = t => {
        return ("0" + t).slice(-2);
      };
      let year = d.getFullYear();
      let month = change(d.getMonth() + 1);
      let day = change(d.getDate());
      return `${year}-${month}-${day}`;
    },
    zoomNow() {
      // return Math.pow(2, this.zoom - 1);
      return this.zoom;
    }
  },
  mounted() {
    this.controlData = this.data;
  },
  methods: {
    play() {
      this.$emit("play");
    },
    stop() {
      this.$emit("stop");
    },
    singleFrame() {
      this.$emit("singleFrame");
    },
    speedUp() {
      this.$emit("speedUp");
    },
    slowDown() {
      this.$emit("slowDown");
    },
    changeSpeed() {},
    changeFenlu() {
      for (let i = 0, len = this.fenlu.length; i < len; i++) {
        if (this.chooseFenlu === this.fenlu[i]) {
          this.$emit("chooseFenlu", i);
          break;
        }
      }
    },
    chooseTime(index, chooseTime) {
      console.log(index, chooseTime);
      // this.$emit("update:operatorIndex", index);
      this.$emit("choosetime", index, chooseTime);
    },
    saveView() {
      this.$emit("saveView");
    },
    download() {
      this.$emit("download");
    },
    zoomFc(value) {
      if (value === -1 && this.zoom === 1) {
        return;
      }
      this.zoom += value;
    },
    moveTimeLine(val) {
      // 移动时间轴面板,子组件通过move是增长还是减少来判断
      // 这边根据move的正负判断往哪边移动
      // 如果是向左移动，则left减去10，反之相加
      // 判断移动的边界，left小于0，大于(scale-1)*100
      let left = this.left + (val > 0 ? 40 : -40);
      console.log(left);
      let panleWidth = (Math.pow(2, this.zoomNow - 1) - 1) * 100;
      if (this.zoomNow === 1) {
        panleWidth = 0;
      }
      console.log(panleWidth);
      // if (left <= 0 && left >= -(this.zoom - 1) * 100) {
      if (left <= 0 && left >= -panleWidth) {
        this.left = left;
      } else {
        if (val > 0) {
          this.left = 0;
        } else {
          this.left = -panleWidth;
        }
      }
    },
    fullScreen() {
      this.$emit("PreviewAreafullScreen");
    }
  },
  watch: {
    data(val) {
      console.log(val);
      this.controlData = this.data;
    },
    zoom(newVal, oldVal) {
      console.log(newVal, oldVal);
      // 监听scale缩放系数的变化
      // 如果是放大，left直接加-50%就可以了，没有超出边界的可能
      // 如果是缩小,
      if (newVal > oldVal) {
        this.left -= 50;
      } else {
        this.left = Math.min(
          0,
          Math.max(-(newVal - 1) * 100, this.left + (oldVal - newVal) * 50)
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.controlPanel {
  background: #242527;
  border-radius: 2px;
  height: 100%;
  width: 100%;
  background-color: #1b1b1b;
  .cursor {
    cursor: pointer;
  }
  .timePanel {
    margin-top: 10px;
    height: calc(100% - 60px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    display: flex;
    $leftWidth: 180px;
    overflow: auto;
    .left {
      width: $leftWidth;
      .window {
        .windowItem {
          background: #242527;
          line-height: 34px;
          margin: 3px;
          box-sizing: border-box;
          text-indent: 0px;
          text-align: center;
          font-family: "PingFangSC-Regular";
          font-size: 12px;
          color: #dddddd;
          overflow: auto;
        }
      }
      .mmm {
        display: inline-block;
        width: 100px;
        vertical-align: middle;
      }
      img {
        margin: 0px 10px;
        text-align: center;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .right {
      width: calc(100% - #{$leftWidth});
      display: flex;
      .leftControl {
        width: 40px;
        .moveLeft {
          height: 34px;
          margin: 3px auto;
          overflow: hidden;
          .button2 {
            width: 30px;
            height: 30px;
            border: 1px solid #242527;
            border-radius: 2px;
            position: relative;
            margin: auto;
            box-sizing: border-box;
            img {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          .button {
            width: 30px;
            height: 30px;
            background: rgba(40, 255, 187, 0.1);
            border: 1px solid rgba(38, 211, 157, 0.8);
            border-radius: 2px;
            position: relative;
            box-sizing: border-box;
            margin: 0px auto 0px;
            img {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
      }
      .timeline {
        width: calc(100% - 80px);
        height: 40px;
        background-color: #1b1b1b;
      }
    }
  }
  .head {
    display: flex;
    justify-content: space-between;
    height: 40px;
    background-color: #242527;
    .centertime {
      line-height: 40px;
      color: #fff;
      font-size: 14px;
    }
    ul {
      list-style: none;
      display: flex;
      justify-content: flex-start;
      li {
        position: relative;
        min-width: 30px;
        padding: 0px 10px;
        font-family: "PingFangSC-Regular";
        font-size: 14px;
        color: #26d39d;
        .speed {
          width: 60px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
        .center {
          width: 80px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
        div {
          img {
            display: inline-block;
            vertical-align: middle;
          }
        }
        & > img {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }
      }
      .splitline {
        width: 1px;
      }
    }
  }
}
</style>
