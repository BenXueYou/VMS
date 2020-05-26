<template>
  <div class="CommunityBoardHome"
       id="BoardHome">
    <div class="Home"
         style="height:100%">
      <data-board-map moduleName="数据看板"
                      :controlRight="mapControlRight"
                      :isShowLayer="true"
                      ref="baseMapCommon"
                      :layerLeft="layerLeft"
                      @fullScreenCall="fullScreenCall"
                      @socketPush="socketPush" />
      <community-board-home-left class="leftboard"
                                 @dragPanel="dragPanelLeft"
                                 ref="boardLeft"></community-board-home-left>
      <community-board-home-right class="rightboard"
                                  @dragPanel="dragPanelRight"
                                  ref="boardRight"></community-board-home-right>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import CommunityBoardHomeLeft from "@/pages/DataBoard/components/CommuintyBoardHomeLeft.vue";
import CommunityBoardHomeRight from "@/pages/DataBoard/components/CommunityBoardHomeRight.vue";
import DataBoardMap from "@/pages/mapOperate/components/DataBoardMap";
export default {
  name: "CommunityBoardHome",
  components: {
    CommunityBoardHomeLeft,
    CommunityBoardHomeRight,
    DataBoardMap
  },
  data() {
    return {
      videoScreenRadio: "1",
      peopleFilesDialogVisiable: false,
      layerLeft: 465,
      mapControlRight: 462
    };
  },
  mounted() {
    console.log("------------home-----mounted---");
  },
  methods: {
    dragPanelLeft(val) {
      if (val === "toLeft") {
        this.layerLeft = 20;
      } else {
        this.layerLeft = 465;
      }
    },
    dragPanelRight(val) {
      if (val === "toLeft") {
        this.mapControlRight = 462;
      } else {
        this.mapControlRight = 42;
      }
    },
    fullScreenCall(val) {
      let element = document.getElementById("BoardHome");
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
    },
    socketPush(paramObj) {}
  }
};
</script>
<style lang="scss">
.CommunityBoardHome {
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
.CommunityBoardHome {
  display: flex;
  height: calc(100% + 5px);
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
    .rightboard {
      height: 100%;
      position: absolute;
      z-index: 100;
      top: 0;
      right: 0;
    }
  }
}
</style>
