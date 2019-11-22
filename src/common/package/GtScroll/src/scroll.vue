<template>
  <div class='gt-scroll'
       ref="scrollWrap"
       @scroll="scroll">
    <slot></slot>
    <div class="gt-scrollBar"
         :style="{'height':scrollHeight+'px','top':scrollTop+'px'}">

    </div>
  </div>
</template>

<script>
export default {
  name: "GtScroll",
  props: {
  },
  data() {
    return {
      scrollHeight: 0,
      scrollTop: 0
    };
  },
  methods: {
    scroll(e) {
      this.initBar();
      let cha = this.$refs.scrollWrap.scrollHeight - this.scrollHeight;
      this.scrollTop = Math.min(
        (this.$refs.scrollWrap.scrollTop / cha) *
          this.$refs.scrollWrap.clientHeight +
          this.$refs.scrollWrap.scrollTop,
        cha
      );
    },
    initBar() {
      let clientHeight = this.$refs.scrollWrap.clientHeight;
      let scrollHeight = this.$refs.scrollWrap.scrollHeight;
      this.scrollHeight =
        clientHeight >= scrollHeight
          ? 0
          : (clientHeight / scrollHeight) * clientHeight;
    }
  },
  mounted() {
    this.initBar();
  }
};
</script>

<style lang="scss" scoped>
.gt-scroll {
  // test
  // background-color: #212325;
  // margin: 50px auto;

  //
  position: relative;
  // overflow: hidden;
  overflow: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  .gt-scrollBar {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 6px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
  }
}
</style>