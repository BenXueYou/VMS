<template>
  <div id="app">
    <!-- <router-view v-if="isRouterAlive"/> -->
    <router-view />
  </div>
</template>

<script>
import * as api2 from "@/pages/VideoPreview/ajax.js";
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
    getPreviewInfoAA() {
      return new Promise(resolve => {
        api2.getPreviewInfoAA().then(res => {
          let data = res.data.data || {
            iccSignalRule: {},
            iccMediaRule: {}
          };
          resolve(data);
        });
      });
    },
    async getPreviewInfo() {
      if (this.$route.fullPath.toLocaleLowerCase().indexOf("/login") === -1) {
        const { jSignal, jMedia } = this.$store.getters;
        if (!jSignal.ip || !jMedia.ip) {
          let data = await this.getPreviewInfoAA();
          this.$store.commit("setIccSignalRule", data.iccSignalRule);
          this.$store.commit("setIccMediaRule", data.iccMediaRule);
        }
      }
    }
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
    this.getPreviewInfo();
  },
  watch: {
    "$route.path": function(newVal, oldVal) {
      this.getPreviewInfo();
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
