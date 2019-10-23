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
      logRoute: "/log/setLog",
      userRoute: "/user/accout"
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
    if (
      this.$route.fullPath.indexOf("/DoorControl") !== -1
    ) {
      this.doorRoute = this.$route.fullPath;
    }
    if (
      this.$route.fullPath.indexOf("/VistorMange") !== -1
    ) {
      this.vistorRoute = this.$route.fullPath;
    }
    if (this.$route.fullPath.indexOf("/log") !== -1) {
      this.logRoute = this.$route.fullPath;
    }
    if (this.$route.fullPath.indexOf("/user") !== -1) {
      this.userRoute = this.$route.fullPath;
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
      if (newVal === "/log") {
        this.$router.push(this.logRoute);
      }
      if (newVal === "/user") {
        this.$router.push(this.userRoute);
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
</style>
