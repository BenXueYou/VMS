<template>
  <div class='gt-input'
       ref="gtInput">
    <input class="gt-input-inner"
           @click.stop
           @focus.stop="foucs"
           type="text">

    <div v-show="showSelectMenu"
         :style="{'left':left+'px','top':top+'px'}"
         ref="selectMenu"
         class="gt-time-list">
      <div class="srollWrap">
        <ul class="hours"
            :style="{'top':index*36+'px'}"
            @wheel.prevent="scroll">
          <li v-for="(item,index) in Array(24)"
              :key="index">
            {{index}}时
          </li>
        </ul>
      </div>
      <div class="srollWrap">
        <ul class="minutes">
          <li v-for="(item,index) in Array(60)"
              :key="index">
            {{index}}分
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "GtTimePicker",
  data() {
    return {
      showSelectMenu: false,
      left: 0,
      top: 0,
      index: 0
    };
  },
  mounted() {
    document.addEventListener("click", this.handerClick);
  },
  methods: {
    scroll(e) {
      console.log(e);
      // 向上滚动wheelDeltay大于0 等于120
      // 向下滚动wheelDeltay小于0 等于-120
      if (e.wheelDeltaY >= 0 && index < 0) {
        this.index++;
      } else if (e.wheelDeltaY <= 0) {
        this.index--;
      }
      // let cha = this.$refs.body.scrollHeight - this.scrollHeight;
      // this.scrollTop = Math.min(
      //   (this.$refs.body.scrollTop / cha) * this.$refs.body.clientHeight +
      //     this.$refs.body.scrollTop,
      //   cha
      // );
    },
    handerClick(e) {
      console.log(this.$refs.selectMenu);
      if (
        this.showSelectMenu &&
        this.$refs.selectMenu &&
        !this.$refs.selectMenu.contains(e.target)
      ) {
        this.showSelectMenu = false;
      }
    },
    foucs(e) {
      this.left = 0;
      this.top = 0;
      setTimeout(() => {
        this.showSelectMenu = true;
      }, 0);
      setTimeout(() => {
        const r = this.$refs.gtInput.getBoundingClientRect();
        const s = this.$refs.selectMenu.getBoundingClientRect();
        console.log(r);
        console.log(s);
        this.left = r.left - s.left;
        this.top = r.top - s.top + r.height;
      }, 0);
    },
    blur() {
      this.showSelectMenu = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.gt-input {
  display: inline-block;
  width: 60px;
  height: 30px;
  line-height: 30px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  box-sizing: border-box;
  .gt-time-list {
    position: fixed;
    left: 0px;
    top: 30px;
    background: #2a2e31;
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.3);
    z-index: 100000;
    ul {
      position: relative;
      display: inline-block;
      list-style: none;
      padding: 0px;
      margin: 0px;
      width: 60px;
      text-align: center;
      line-height: 36px;
      font-size: 0px;
      vertical-align: top;
      max-height: 180px;
      // overflow: hidden;
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      li {
        font-family: "PingFangSC-Regular";
        font-size: 12px;
        color: #dddddd;
        border-width: 0px;
        cursor: pointer;
      }
    }
  }
  .gt-input-inner {
    width: 100%;
    height: 30px;
    background-color: transparent;
    outline: none;
    border: 0px;
    padding: 5px 15px 5px 5px;
    box-sizing: border-box;
    color: #ddd;
    font-size: 13px;
  }
}
</style>


