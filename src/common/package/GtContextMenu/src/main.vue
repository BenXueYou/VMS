<template>
  <div class='gt-contextmenu-wrap'
       v-show='isshow'
       :style='{"left":left+"px","top":top+"px"}'
       ref='wrap'>
    <sub-menu :data="data"
              @chooseItem='chooseItem'></sub-menu>
  </div>
</template>

<script>
/*
  

*/
import SubMenu from "./menu";
export default {
  name: "GtContextMenu",
  components: {
    SubMenu
  },
  data() {
    return {
      data: [],
      isshow: false,
      left: 0,
      top: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initDom();
    });
  },
  methods: {
    chooseItem(item) {
      //获取到用户点击的菜单，并且关闭右键菜单。
      this.callback(item);
      this.isshow = false;
    },
    initDom() {
      let rectInfo = this.$refs.wrap.getBoundingClientRect();
      // console.log(rectInfo);
      this.left = this.event.clientX + 20 - rectInfo.width * 0.6;
      this.top = this.event.clientY + 20;
      let win_h = window.innerHeight;
      if (this.top + rectInfo.height > win_h) {
        this.top = win_h - rectInfo.height - 20;
      }
      document.addEventListener("click", this.handerclick);
    },
    handerclick(e) {
      if (this.$refs.wrap.contains(e.target)) {
      } else {
        this.isshow = false;
      }
    }
  },
  watch: {
    isshow() {
      if (!this.isshow) {
        document.removeEventListener("click", this.handerclick);
      }
    }
  }
};
</script>

<style lang="scss">
.gt-contextmenu-wrap {
  position: fixed;
  top: 0px;
  left: 0px;
  background: #2a2e31;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.2);
  z-index: 111111;
}
</style>

