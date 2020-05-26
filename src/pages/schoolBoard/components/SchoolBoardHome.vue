<template>
  <div class="SchoolBoardHome"
       id="SchoolBoardHome">
    <div class="Home"
         style="height:100%">
      <base-map-common moduleName="学校看板"
                       :controlRight="mapControlRight"
                       :isShowLayer="true"
                       ref="baseMapCommon"
                       v-if="!showVideoRow"
                       :layerLeft="layerLeft"
                       @fullScreenCall="fullScreenCall" />
      <school-board-home-left v-show="!showVideoRow"
                              class="leftBoard"
                              @dragPanel="dragPanelLeft"
                              ref="boardLeft"
                              @SwitchBtnAct="showVideoRow = !showVideoRow"></school-board-home-left>
      <school-board-video-row v-show="showVideoRow"
                              @SwitchBtnAct="showVideoRow = !showVideoRow"></school-board-video-row>
      <school-board-home-right :showVideoRow="showVideoRow"
                               class="rightBoard"
                               @dragPanel="dragPanelRight"></school-board-home-right>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SchoolBoardHomeLeft from "@/pages/schoolBoard/components/SchoolBoardHomeLeft.vue";
import SchoolBoardHomeRight from "@/pages/schoolBoard/components/SchoolBoardHomeRight.vue";
import SchoolBoardVideoRow from "@/pages/schoolBoard/components/SchoolBoardVideoRow.vue";
import BaseMapCommon from "@/pages/mapOperate/components/BaseMapCommon";
export default {
  name: "SchoolBoardHome",
  components: {
    SchoolBoardHomeLeft,
    SchoolBoardHomeRight,
    SchoolBoardVideoRow,
    BaseMapCommon
  },
  data() {
    return {
      showVideoRow: false,
      layerLeft: 465,
      mapControlRight: 462,
      leftShowStatus: "show",
      rightShowStatus: "show"
    };
  },
  destroyed() {},
  methods: {
    dragPanelLeft(val) {
      if (val === "toLeft") {
        this.layerLeft = 20;
        this.leftShowStatus = "hide";
      } else {
        this.layerLeft = 465;
        this.leftShowStatus = "show";
      }
    },
    dragPanelRight(val) {
      if (val === "toLeft") {
        this.mapControlRight = 462;
        this.rightShowStatus = "show";
      } else {
        this.mapControlRight = 42;
        this.rightShowStatus = "hide";
      }
    },
    fullScreenCall(val) {
      let element = document.getElementById("SchoolBoardHome");
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        // current working methods
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        this.$refs.baseMapCommon.screenText = "退出全屏";
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        this.$refs.baseMapCommon.screenText = "全屏";
      }
    }
  }
};
</script>
<style lang="scss">
.SchoolBoardHome {
  .el-checkbox {
    display: flex;
    align-items: center;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background: #26d39d;
  }
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background: #26d39d;
  }
  .el-checkbox__label {
    font-size: 14px;
    display: flex;
    align-items: center;
  }
}
</style>
<style lang="scss" scoped>
.SchoolBoardHome {
  display: flex;
  height: 100%;
  overflow: hidden;
  .Home {
    width: 100%;
    display: flex;
    height: 100%;
    flex-direction: wrap;
    justify-content: space-between;
    position: relative;
    .leftBoard {
      height: 100%;
      overflow: auto;
      position: absolute;
      z-index: 100;
      top: 0;
      left: 0;
    }
    .rightBoard {
      height: 100%;
      position: absolute;
      z-index: 100;
      top: 0;
      right: 0;
    }
  }
}
</style>
