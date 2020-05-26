<template>
  <div class="head_wrap">
    <div class="head_title">
      <img src="@/assets/images/downTown/title-left.png" />
      <span>{{ options.title }}</span>
    </div>
    <div class="head_sort" v-if="options.isSort">
      <div class="sort_up sort_item" v-show="sort == 1" @click="handleSort">
        <img src="@/assets/images/downTown/up.png" alt srcset />
        <span>升序</span>
      </div>
      <div class="sort_down sort_item" v-show="sort == 2" @click="handleSort">
        <img src="@/assets/images/downTown/down.png" alt srcset />
        <span>降序</span>
      </div>
    </div>
    <div class="head_switch" v-if="options.isDayOrWeek">
      <div
        :class="['switch_item', this.switch == 1 ? 'switch_active' : '']"
        @click="handleChangeDayWeek(1)"
      >
        日
      </div>
      <div
        :class="['switch_item', this.switch == 2 ? 'switch_active' : '']"
        @click="handleChangeDayWeek(2)"
      >
        周
      </div>
    </div>
    <div
      class="head_full_screen"
      v-if="options.isFullScreen"
      @click="handleMapFullScreen"
    >
      <img src="@/assets/images/downTown/full-screen.png" alt />
    </div>
    <div class="line"></div>
  </div>
</template>

<script>
export default {
  name: "AsideItemHead",
  props: {
    options: {
      type: Object,
      default() {
        return {
          title: "",
          isSort: false,
          isDayOrWeek: false,
          isFullScreen: false
        };
      }
    }
  },
  data() {
    return {
      sort: 1,
      switch: 1
    };
  },
  mounted() {},
  methods: {
    handleSort() {
      if (this.sort === 1) {
        this.sort = 2;
      } else {
        this.sort = 1;
      }
      this.$emit("sort", this.sort);
    },
    handleChangeDayWeek(type) {
      this.switch = type;
      this.$emit("switch", type);
    },
    handleMapFullScreen() {
      this.$emit("handleMapFullScreen");
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
.head_wrap {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  padding-top: 25px;
  margin-bottom: 25px;
  position: relative;
  .head_title {
    font-size: 16px;
    flex: 1;
    width: 0;
    height: 35px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    background: linear-gradient(
      90deg,
      rgba(23, 237, 172, 0.25) 2%,
      rgba(75, 237, 233, 0.01) 90%
    );
    padding-left: 10px;
    border-radius: 1px;
    img {
      display: block;
      height: 20px;
      margin-right: 14px;
    }
    span {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #ffffff;
      text-align: justify;
    }
  }
  .head_sort {
    margin: 0 8px;
    .sort_item {
      width: 56px;
      height: 28px;
      text-align: center;
      line-height: 28px;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.08);
      cursor: pointer;
      user-select: none;
      img {
        display: block;
        width: 9px;
        margin-right: 5px;
      }
      span {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #dddddd;
        text-align: justify;
      }
    }
  }
  .head_switch {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    .switch_item {
      width: 32px;
      height: 28px;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      text-align: center;
      line-height: 28px;
      font-size: 12px;
      font-family: PingFangSC-Regular;
      user-select: none;
      cursor: pointer;
      &:nth-of-type(1) {
        margin-right: 8px;
      }
    }
    .switch_active {
      background: rgba(37, 210, 152, 0.15);
      border: 1px solid rgba(37, 210, 152, 0.5);
    }
  }
  .head_full_screen {
    width: 32px;
    height: 28px;
    text-align: center;
    line-height: 28px;
    border-radius: 2px;
    background: rgba($color: #ffffff, $alpha: 0.1);
    margin-left: 65px;
    cursor: pointer;
    img {
      display: inline-block;
      width: 12px;
      height: 12px;
    }
  }
  .line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-image: linear-gradient(
      90deg,
      rgba(23, 237, 172, 0) 6%,
      rgba(23, 237, 172, 0.3) 97%
    );
    &:after {
      content: "";
      display: block;
      width: 5px;
      height: 5px;
      border-radius: 5px;
      background: rgba(4, 78, 56, 1);
      position: absolute;
      right: -2px;
      top: 50%;
      transform: translateY(-3px);
      opacity: 1;
    }
  }
}
</style>
