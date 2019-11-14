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
      vistorRoute: "/VistorMange/VistorRecord",
      faceRoute: "/FaceManage/FaceHome"
    };
  },
  methods: {
    // reload() {
    //   this.isRouterAlive = false;
    //   this.$nextTick(function() {
    //     this.isRouterAlive = true;
    //   });
    // }
  },
  mounted() {
    console.log(this.$route);
    if (this.$route.fullPath.indexOf("/DoorControl") !== -1) {
      this.doorRoute = this.$route.fullPath;
    }
    if (
      this.$route.fullPath.toLocaleLowerCase().indexOf("/vistormange") !== -1
    ) {
      this.vistorRoute = this.$route.fullPath;
    }
  },
  watch: {
    "$route.path": function(newVal, oldVal) {
      console.log(newVal);
      // 添加门禁控制的默认路径
      if (newVal === "/DoorControl") {
        this.$router.push(this.doorRoute);
      }
      // 添加访客管理的默认路径
      if (newVal === "/VistorMange") {
        this.$router.push(this.vistorRoute);
      }
      if (newVal === "/FaceManage") {
        this.$router.push(this.faceRoute);
      }
      // 回复门禁控制的上一次的操作路径
      if (newVal.indexOf("/DoorControl") !== -1) {
        this.doorRoute = newVal;
      }
      // 回复访客管理的上一次的操作路径
      if (newVal.toLocaleLowerCase().indexOf("/vistormange") !== -1) {
        this.vistorRoute = newVal;
      }
      if (newVal.toLocaleLowerCase().indexOf("/facemanage") !== -1) {
        this.faceRoute = newVal;
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
}
</style>
