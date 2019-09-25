<template>
  <div class="menu-item"
       @click="onClickMenu">
    <img v-if="item&&item.icon"
         :src="require(`@/assets/images/${item.icon}.png`)">
    <div v-if="item"
         class="item-title">{{item.title}}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    item: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    onClickMenu() {
      this.$emit("onClickMenu");
    }
  },
  watch: {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.menu-item {
  // width: 6.3vw;
  // height: 12.5vh;
  width: 120px;
  height: 120px;
  cursor: pointer;
  background: #282828;
  border-radius: 16px;
  margin: 35px 1% 5px 1%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
}
.item-title {
  margin-top: 16px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0;
}
</style>
