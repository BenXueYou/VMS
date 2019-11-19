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
      setTimeout(() => {
        let rectInfo = this.$refs.wrap.getBoundingClientRect();
        console.log(rectInfo);
        let submen = this.$refs.wrap.childNodes[0].childNodes[0].getBoundingClientRect();
        console.log(submen);
        this.top = this.event.clientY;
        let win_h = window.innerHeight;
        let win_w = window.innerWidth;
        if (this.top + submen.height > win_h) {
          this.top = win_h - submen.height;
        }
        if (this.event.clientX + submen.width > win_w) {
          this.left = this.event.clientX - submen.width - 20;
        } else {
          this.left = this.event.clientX + 20 - rectInfo.width * 0.6;
        }
      }, 0);
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

