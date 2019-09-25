<template>
  <div class='timelineaa'>
    <div class="timeSelectWrap"
         @mousewheel="mousewheel"
         @mouseup="mouseup"
         @mousemove="mousemove"
         @mousedown="mousedown"
         :style="{'left':left+'%','width':100*scale+'%'}">
      <span class="line"
            v-for="(item,index) in lines"
            :key="index"
            :style="{'left':item.left+'%'}">
        {{item.time}}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "timeline",
  props: {
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
    lines() {
      let gen = 24;
      if (this.scale >= 2) {
        gen = 12;
      }
      let fenshu = this.scale * gen;
      const calcTime = index => {
        let now = ~~((index * this.oneday) / fenshu);
        return this.turnTotime(now);
      };
      let data = new Array(fenshu);
      for (let i = 0, len = data.length; i < len; i++) {
        data[i] = {
          left: (i / data.length) * 100,
          time: calcTime(i)
        };
      }
      return data;
    }
  },
  data() {
    return {
      oneday: 86400
    };
  },
  methods: {
    mouseup(e) {},
    mousemove(e) {},
    mousedown(e) {},
    mousewheel(e) {
      e.preventDefault();
      console.log(e.wheelDelta);
      this.$emit("zoomFc", e.wheelDelta > 0 ? 1 : -1);
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
  margin: 3px;
  overflow: hidden;
  .timeSelectWrap {
    position: relative;
    width: 100%;
    height: 100%;
    .line {
      position: absolute;
      top: 5px;
      width: 1px;
      height: 10px;
      margin-left: 1px;
      font-size: 12px;
      color: #ffffff;
      &::after {
        content: "";
        position: absolute;
        left: 3px;
        bottom: -20px;
        width: 1px;
        height: 10px;
        background-color: #fff;
      }
    }
  }
}
</style>
