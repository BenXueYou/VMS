<template>
  <div class="home-main">
    <div class="app-menu">
      <!-- <div class="type-title">应用业务</div> -->
      <template v-for="(item, index) in menuArr[0].children">
        <menu-item :key="index"
                   @onClickMenu="onClickMenu(item)"
                   :item="item"
                   v-if="item.name !== 'Home'" />
      </template>
      <!-- v-if="item.name !== 'Home' && item.type === 'app'" -->
    </div>
    <!-- <div class="config-menu">
      <div class="type-title">系统配置</div>
      <template v-for="(item, index) in menuArr[0].children">
        <menu-item :key="index"
                   :item="item"
                   @onClickMenu="onClickMenu(item)"
                   v-if="item.name !== 'Home' && item.type === 'config'" />
      </template>
    </div> -->
  </div>
</template>

<script>
import { constantRouterMap } from "@/router";
import MenuItem from "@/pages/home/components/MenuItem";

export default {
  components: {
    MenuItem
  },
  props: {},
  data() {
    return {
      tagViewArr: [],
      menuArr: []
    };
  },
  created() {
    this.initData();
  },
  mounted() {},
  methods: {
    initData() {
      // 这里暂时将访客功能页面给注释掉
      // 解开只需要删掉val.name!=="VistorMange" 这个判断条件 && val.name !== "VistorMange"
      constantRouterMap[0].children = constantRouterMap[0].children.filter(
        val => val.icon !== undefined
      );
      this.menuArr = constantRouterMap;
    },
    onClickMenu(compomentItem) {
      this.$store.dispatch("addTagViewItem", compomentItem);
      this.$store.dispatch("setLocalTag", compomentItem.name);
      this.$bus.$emit("setLocalTag", compomentItem.name);
      this.$router.push({ name: compomentItem.name });
    }
  },
  watch: {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.home-main {
  width: 100%;
  height: 100%;
  padding: 4% 16%;
  box-sizing: border-box;
}
.app-menu {
  width: 100%;
  height: 47%;
  display: flex;
  flex-flow: row wrap;
  padding-top: 10px;
  align-content: flex-start;
  box-sizing: border-box;
  // border-top: {
  //   width: 1px;
  //   style: dashed;
  //   color: #777777;
  // }
  position: relative;
  .type-title {
    position: absolute;
    font-family: "PingFangSC-Regular";
    font-size: 18px;
    text-align: center;
    color: #ffffff;
    letter-spacing: 0;
    width: 120px;
    background: #1b1b1b;
    left: 47%;
    top: -13px;
  }
}
.config-menu {
  width: 100%;
  height: 47%;
  margin-top: 45px;
  display: flex;
  flex-flow: row wrap;
  padding-top: 18px;
  box-sizing: border-box;
  border-top: {
    width: 1px;
    style: dashed;
    color: #777777;
  }
  position: relative;
  .type-title {
    position: absolute;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    text-align: center;
    color: #ffffff;
    letter-spacing: 0;
    width: 120px;
    background: #1b1b1b;
    left: 47%;
    top: -13px;
  }
}
</style>
