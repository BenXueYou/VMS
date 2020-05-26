<template>
  <div class="sys-config">
    <div class="left-side">
      <el-menu :default-active="$route.path"
               :router="true">
        <el-menu-item index="/SystemConfig/MapSet">
          <img src="@/assets/images/sys/conf_icon.png">
          <span slot="title" style="margin-left: 10px;">地图设置</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right-main">
      <keep-alive>
				<router-view v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
			<router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  created() {},
  activated() {},
  mounted() {},
  methods: {},
  watch: {},
  deactivated() {},
  destroyed() {}
};
</script>

<style lang="scss">
.left-side{
  .el-menu-item {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #FFFFFF;
    letter-spacing: 0;
  }
  .el-menu-item:hover, .el-menu-item:focus {
    background-color: rgba($color: #26D39D, $alpha: 0.1)
  }
  .el-menu-item.is-active {
    background-color: rgba($color: #26D39D, $alpha: 0.6);
    color: #FFFFFF;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.sys-config {
  display: flex;
  width: 100%;
  height: 100%;
  .left-side {
    height: 100%;
    width: 220px;
    background: #212326;
  }
  .right-main {
    height: 100%;
    width: calc(100% - 220px);
  }
}
</style>
