<template>
  <div class='timelineaa'>
    <div class="timeSelectWrap"
         @mousewheel="mousewheel"
         @mouseup="mouseup"
         @mousemove="mousemove"
         @mousedown="mousedown"
         :style="{'left':left+'%','width':panleWidth+'%'}">
      <span class="line"
            v-for="(item,index) in lines"
            :key="index"
            :style="{'left':item.left+'%'}">
        <!-- <el-tooltip class="item"
                    effect="dark"
                    :content="item.time.ymd"
                    placement="top-start">
          <span> {{item.time.sfm}}</span>
        </el-tooltip> -->
        <el-tooltip class="item"
                    effect="dark"
                    :content="item.time.ymd"
                    placement="top-start">
          <span> {{item.time.sfm}}</span>
        </el-tooltip>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "timeline",
  props: {
    startTime: {
      type: String,
      default() {
        return "2019-10-15 00:00:00";
      }
    },
    endTime: {
      type: String,
      default() {
        return "2019-10-16 00:00:00";
      }
    },
    scale: {
      type: Number,
      default() {
        return 1;
      }
    },
    move: {
      type: Number,
      default() {
        return 1;
      }
    },
    left: {
      type: Number,
      default() {
        return 1;
      }
    }
  },
  computed: {
    panleWidth() {
      return Math.pow(2, this.scale - 1) * 100;
    },
    lines() {
      if (!this.startTime || !this.endTime) {
        return [];
      }
      // 这里需要优化一下，这里的数组不用全部显示出来
      let fenshu = 5 * Math.pow(2, this.scale);
      console.log(fenshu);
      let allTime = this.getAllTime();
      const calcTime = index => {
        let now = ~~((index * allTime) / fenshu);
        return this.getFormatTime(new Date(this.startTime).getTime() + now);
      };
      let data = new Array(fenshu);
      // let scaleNow = Math.pow(2, this.scale - 1);
      let allWidth = Math.pow(2, this.scale - 1) * 100;

      let newDate = [];
      let left = Math.abs(this.left);
      for (let i = 0, len = data.length; i < len; i++) {
        let a = i / data.length;
        let fenshu = a * allWidth;
        let isInMiddle = false;
        // console.log(fenshu + "   " + left);
        if (fenshu >= left && fenshu <= left + 100) {
          isInMiddle = true;
        }
        if (isInMiddle) {
          newDate.push({
            left: a * 100,
            time: calcTime(i)
          });
        }
      }
      return newDate;
    }
  },
  data() {
    return {
      oneday: 86400
    };
  },
  methods: {
    getAllTime() {
      // 获取两个时间的差值
      let d1 = new Date(this.startTime).getTime();
      let d2 = new Date(this.endTime).getTime();
      return d2 - d1;
    },
    mouseup(e) {},
    mousemove(e) {},
    mousedown(e) {},
    mousewheel(e) {
      e.preventDefault();
      console.log(e.wheelDelta);
      this.$emit("zoomFc", e.wheelDelta > 0 ? 1 : -1);
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
      return {
        ymd: `${year}-${month}-${day}`,
        sfm: `${hour}:${minute}:${second}`
      };
    },
    turnTotime(timestamp) {
      if (this.scale === 1) {
        return `${~~(timestamp / 3600)}`;
      } else if (this.scale >= 2) {
        return `${~~(timestamp / 3600)}:${~~(
          (timestamp % 3600) /
          60
        )}:${timestamp % 60}`;
      }
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.timelineaa {
  position: relative;
  height: 36px;
  width: 100%;
  margin: 0px 3px;
  overflow: hidden;
  .timeSelectWrap {
    position: relative;
    width: 100%;
    height: 100%;
    .line {
      position: absolute;
      top: 5px;
      width: 70px;
      white-space: nowrap;
      overflow: hidden;
      height: 30px;
      margin-left: 1px;
      font-size: 12px;
      color: #ffffff;
      &::after {
        content: "";
        position: absolute;
        left: 0px;
        bottom: 0px;
        width: 1px;
        height: 10px;
        background-color: #fff;
      }
    }
  }
}
</style>
