<template>
  <div id="app">
    <!-- <router-view v-if="isRouterAlive"/> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  // provide() {
  //   return {
  //     reload: this.reload
  //   };
  // },
  data() {
    return {
      // isRouterAlive: true,
      doorRoute: "/DoorControl/AccessGroupConfig",
      vistorRoute: "/VisitorManage/VistorRecord",
      faceRoute: "/FaceManage/FaceHome",
      isGetIpOnce: false,
      logRoute: "/log/setLog",
      userRoute: "/user/accout",
      sysRoute: "/SystemConfig/MapSet",
      bayonetRoute: "/BayonetManage/bayonetPreview"
    };
  },
  methods: {
    handleRouteMounted() {
      if (this.$route.fullPath.indexOf("/DoorControl") !== -1) {
        this.doorRoute = this.$route.fullPath;
      }
      if (this.$route.fullPath.indexOf("/VisitorManage") !== -1) {
        this.vistorRoute = this.$route.fullPath;
      }
      if (this.$route.fullPath.indexOf("/FaceHome") !== -1) {
        this.faceRoute = this.$route.fullPath;
      }
      if (this.$route.fullPath.indexOf("/log") !== -1) {
        this.logRoute = this.$route.fullPath;
      }
      if (this.$route.fullPath.indexOf("/user") !== -1) {
        this.userRoute = this.$route.fullPath;
      }
      if (this.$route.fullPath.indexOf("/MapSet") !== -1) {
        this.userRoute = this.$route.fullPath;
      }
      if (this.$route.fullPath.indexOf("/BayonetManage") !== -1) {
        this.bayonetRoute = this.$route.fullPath;
      }
    }
  },
  mounted() {
    this.handleRouteMounted();
  },
  watch: {
    "$route.path": function(newVal, oldVal) {
      // 添加门禁控制的默认路径
      if (newVal === "/DoorControl") {
        this.$router.push(this.doorRoute);
      }
      // 添加访客管理的默认路径
      if (newVal === "/VisitorManage") {
        this.$router.push(this.vistorRoute);
      }
      if (newVal === "/log") {
        this.$router.push(this.logRoute);
      }
      if (newVal === "/FaceManage") {
        this.$router.push(this.faceRoute);
      }
      if (newVal === "/SystemConfig") {
        this.$router.push(this.sysRoute);
      }
      if (newVal === "/BayonetManage") {
        this.$router.push(this.bayonetRoute);
      }
      // 恢复门禁控制的上一次的操作路径
      if (newVal.indexOf("/DoorControl") !== -1) {
        this.doorRoute = newVal;
      }
      if (newVal === "/user") {
        this.$router.push(this.userRoute);
      }
      // 恢复访客管理的上一次的操作路径
      if (newVal.toLocaleLowerCase().indexOf("/visitormanage") !== -1) {
        this.vistorRoute = newVal;
      }
      if (newVal.indexOf("/FaceManage") !== -1) {
        this.faceRoute = newVal;
      }
      if (newVal.indexOf("/BayonetManage") !== -1) {
        this.bayonetRoute = newVal;
      }
    }
  }
};
</script>

<style>
html,
body {
  padding: 0px;
  margin: 0px;
  height: 100%;
}
#app {
  height: 100%;
  /* min-width: 1920px; */
  overflow-x: auto;
  margin: auto;
  background: #1b1b1b;
}
.anchorBL {
  display: none;
}
</style>
