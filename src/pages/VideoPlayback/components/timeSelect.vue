<template>
  <div class='timeSelect'
       ref='timeSelect'>
    <!-- 缩放系数 -->
    <div class="timeBG"
         :style="{'left':left+'%','width':panleWidth+'%'}"
         ref='timeBG'>
      <div class="timeBlock"
           v-for="(item,index) in blockArr"
           :key="index"
           @click='chooseTime(index,$event)'
           @mousemove="mouseMove(item.left,index,$event)"
           @mouseout="mouseout"
           :style="{'left':item.left+'%','width':item.width+'%'}">
        <!-- 用于点击选择时间的白线 -->

      </div>
      <div class="whiteLine"
           :style="{'left':lineLeft}"
           :class="{'show':show}">
      </div>
      <div class="timemask"
           v-show="show"
           :style="{'left':whiteLeft}">
        <!-- {{time.split(" ")[0]}}
        <br> -->
        {{time.split(" ")[1]}}
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "timeSelect",
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
        return "2019-10-15 00:00:00";
      }
    },
    scale: {
      type: Number,
      default() {
        return 1;
      }
    },
    index: {
      type: Number,
      default() {
        return 1;
      }
    },
    timeData: {
      type: Array,
      default() {
        return [];
      }
    },
    move: {
      type: Number,
      default() {
        return 0;
      }
    },
    left: {
      type: Number,
      default() {
        return 1;
      }
    }
  },
  data() {
    return {
      blockArr: [
        // {
        //   left: "", // 偏移量
        //   width: "" // 长度
        // }
      ],
      oneday: 86400, // 一天总共的秒数
      show: false, // 是否展示选择时间白线，只有在可以选择的区域在展示
      whiteLeft: 0, // 选择时间白线的向左的偏移量
      time: "01:00:00",
      lineLeft: 0
    };
  },
  computed: {
    panleWidth() {
      return Math.pow(2, this.scale - 1) * 100;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    mouseout(e) {
      this.show = false;
    },
    mouseMove(left, index, e) {
      this.show = true;
      // 这里需要判断时间在右边会被遮挡的情况
      let allWidth = this.$refs.timeBG.clientWidth;
      let moveWidth = e.offsetX;
      console.log(allWidth);
      console.log();
      let left1 = e.target.getBoundingClientRect().left;
      let left2 = this.$refs.timeBG.getBoundingClientRect().left;
      let cha = left1 - left2;
      if (cha + 60 > allWidth) {
        moveWidth = left - 60;
        this.whiteLeft = `calc(${left}% - ${e.target.clientWidth -
          e.offsetX +
          60}px)`;
      } else {
        this.whiteLeft = `calc(${left}% + ${moveWidth}px)`;
      }
      this.lineLeft = `calc(${left}% + ${e.offsetX}px)`;
      this.time = this.calcTime(index, e.offsetX / e.target.clientWidth);
      // console.log(this.time);
    },
    chooseTime(index, e) {
      this.time = this.calcTime(index, e.offsetX / e.target.clientWidth);
      this.$emit("chooseTime", this.index, this.time);
    },
    getFormatTime(t) {
      const change = t => {
        return ("0" + t).slice(-2);
      };
      const d = new Date(t);
      let year = d.getFullYear();
      let month = change(d.getMonth() + 1);
      let day = change(d.getDate());
      let hour = change(d.getHours());
      let minute = change(d.getMinutes());
      let second = change(d.getSeconds());
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    turnTotime(timestamp) {
      const fixZero = n => ("00" + n).slice(-2);
      return `${fixZero(~~(timestamp / 3600))}:${fixZero(
        ~~((timestamp % 3600) / 60)
      )}:${fixZero(timestamp % 60)}`;
    },
    getTime(t) {
      return new Date(t).getTime();
    },
    calcTime(index, fenlv) {
      // 点击计算时间
      let start = this.getTime(this.timeData[index].startTime);
      let end = this.getTime(this.timeData[index].endTime);
      console.log(this.timeData[index].startTime);
      console.log(this.timeData[index].endTime);
      let now = this.getFormatTime(
        parseInt(start) + Math.floor((end - start) * fenlv)
      );
      return now;
    },
    turnTime(time) {
      // 将时分秒转换总共的秒数,便于后面的操作
      let arr = time.split(":");
      return (
        parseInt(arr[0] * 60 * 60) + parseInt(arr[1] * 60) + parseInt(arr[2])
      );
    },
    getSconds(time) {
      // 根据时间来获取时间戳
      return new Date(time).getTime() - new Date(this.startTime).getTime();
    },
    getTotal() {
      //
      return (
        new Date(this.endTime).getTime() - new Date(this.startTime).getTime()
      );
    },
    init() {
      // 这里计算时间块
      let data = [];
      for (let i = 0, len = this.timeData.length; i < len; i++) {
        let start = this.getSconds(this.timeData[i].startTime);
        let end = this.getSconds(this.timeData[i].endTime);
        // 这里不是oneDay，使用总共的时间长度
        let totalTime = this.getTotal();
        data.push({
          left: (start / totalTime) * 100,
          width: ((end - start) / totalTime) * 100
        });
      }
      this.blockArr = data;
    }
  },
  watch: {
    startTime() {
      this.init();
    },
    endTime() {
      this.init();
    },
    timeData() {
      this.init();
    }
  }
};
</script>

<style lang="scss" scoped>
.timeSelect {
  height: 34px;
  margin: 3px;
  width: 100%;
  overflow: hidden;
  // background-color: #242527;
  .timeBG {
    position: relative;
    height: 100%;
    background-color: #242527;
    .timeBlock {
      position: absolute;
      top: 0px;
      height: 100%;
      background: rgb(36, 71, 62);
      cursor: pointer;
    }
    .whiteLine {
      display: none;
      position: absolute;
      top: 0px;
      left: 0px;
      width: 1px;
      height: 100%;
      background-color: #fff;
      pointer-events: none;
    }
    .timemask {
      position: absolute;
      top: 0px;
      left: 0px;
      text-align: center;
      width: 100px;
      line-height: 34px;
      color: #fff;
      pointer-events: none;
      font-size: 12px;
      word-wrap: break-word;
    }
    .show {
      display: block;
    }
  }
}
</style>
