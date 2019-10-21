<template>
  <div class='timeSelect'
       ref='timeSelect'>
    <!-- 缩放系数 -->
    <div class="timeBG"
         :style="{'left':left+'%','width':100*scale+'%'}"
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
           :style="{'left':whiteLeft}"
           :class="{'show':show}">
      </div>
      <div class="timemask"
           v-show="show"
           :style="{'left':whiteLeft}">
        {{time}}
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "timeSelect",
  props: {
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
      time: "01:00:00"
    };
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
      this.whiteLeft = `calc(${left}% + ${e.offsetX}px)`;
      this.time = this.calcTime(index, e.offsetX / e.target.clientWidth);
      // console.log(this.time);
    },
    chooseTime(index, e) {
      this.time = this.calcTime(index, e.offsetX / e.target.clientWidth);
      this.$emit("chooseTime", this.index, this.time);
    },
    turnTotime(timestamp) {
      const fixZero = n => ("00" + n).slice(-2);
      return `${fixZero(~~(timestamp / 3600))}:${fixZero(
        ~~((timestamp % 3600) / 60)
      )}:${fixZero(timestamp % 60)}`;
    },
    calcTime(index, fenlv) {
      // 点击计算时间
      let start = this.turnTime(this.timeData[index].startTime);
      let end = this.turnTime(this.timeData[index].endTime);
      let now = this.turnTotime(
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
    init() {
      let data = [];
      for (let i = 0, len = this.timeData.length; i < len; i++) {
        let start = this.turnTime(this.timeData[i].startTime);
        let end = this.turnTime(this.timeData[i].endTime);
        data.push({
          left: (start / this.oneday) * 100,
          width: ((end - start) / this.oneday) * 100
        });
      }
      this.blockArr = data;
    }
  },
  watch: {
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
    }
    .show {
      display: block;
    }
  }
}
</style>
