<template>
  <div class="CommunityBoardHome"
       id="CommunityBoardHome">
    <div class="Home"
         style="height:100%">
      <component :moduleName="isOneProject?'社区看板':'居委看板'"
                 :controlRight="mapControlRight"
                 :isShowLayer="true"
                 :isShowStreetBlock="false"
                 ref="baseMapCommon"
                 :is="isOneProject?'BaseMapCommon':'DataBoardMap'"
                 :layerLeft="layerLeft"
                 @fullScreenCall="fullScreenCall"
                 @socketPush="socketPush"></component>
      <community-board-home-left class="leftboard"
                                 @dragPanel="dragPanelLeft"
                                 ref="boardLeft"></community-board-home-left>
      <community-board-home-right class="rightboard"
                                  :OwnAuthDisabled='OwnAuthDisabled'
                                  :ShowAuthDisabled='ShowAuthDisabled'
                                  @dragPanel="dragPanelRight"
                                  ref="boardRight"></community-board-home-right>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import CommunityBoardHomeLeft from "@/pages/communityBoard/components/CommuintyBoardHomeLeft.vue";
import CommunityBoardHomeRight from "@/pages/communityBoard/components/CommunityBoardHomeRight.vue";
import BaseMapCommon from "@/pages/mapOperate/components/BaseMapCommon";
import DataBoardMap from "@/pages/mapOperate/components/DataBoardMap";
export default {
  name: "CommunityBoardHome",
  components: {
    CommunityBoardHomeLeft,
    CommunityBoardHomeRight,
    BaseMapCommon,
    DataBoardMap
  },
  data() {
    return {
      videoScreenRadio: "1",
      layerLeft: 465,
      mapControlRight: 462,
      projectType: null,
      isOneProject: true,
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {
    this.projectType = this.$store.state.home.projectType || {};
    this.isOneProject = Boolean(this.projectType.platformLevel === "levelOne");
  },
  mounted() {
    if (this.isOneProject) {
      this.ShowAuthDisabled = this.$common.getAuthIsOwn("社区看板", "isShow");
      this.OwnAuthDisabled = this.$common.getAuthIsOwn("社区看板", "isOwn");
    } else {
      this.ShowAuthDisabled = this.$common.getAuthIsOwn("居委看板", "isShow");
      this.OwnAuthDisabled = this.$common.getAuthIsOwn("居委看板", "isOwn");
    }
  },
  computed: {
    moduleName() {
      return this.isOneProject ? "社区看板" : "居委看板";
    }
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
      let element = document.getElementById("CommunityBoardHome");
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
    socketPush(paramObj) {
      switch (paramObj.topicType) {
        case "car":
          if (this.$refs.boardRight.carList.length > 0) {
            this.$refs.boardRight.carList.pop();
          }
          this.$refs.boardRight.carList.unshift(paramObj.topicItem);
          if (paramObj.topicItem.dataType === "register") {
            this.$refs.boardRight.BRData.registerVehicle =
              parseInt(this.$refs.boardRight.BRData.registerVehicle) + 1;
          } else if (paramObj.topicItem.dataType === "temporary") {
            this.$refs.boardRight.BRData.tempVehicle =
              parseInt(this.$refs.boardRight.BRData.tempVehicle) + 1;
          }
          break;
        case "door":
          if (
            paramObj.topicItem.recognitionMode === "button" ||
            paramObj.topicItem.recognitionMode === "platformremote"
          ) {
            return;
          }
          if (this.$refs.boardRight.doorList.length > 2) {
            this.$refs.boardRight.doorList.pop();
          }
          this.$refs.boardRight.doorList.unshift({
            type: paramObj.topicItem.type,
            staffInfo: {
              openDoorUrl: paramObj.topicItem.facePicInfo.capture,
              idCardPictureUrl: paramObj.topicItem.facePicInfo.id_card,
              lifePictureUrl: paramObj.topicItem.facePicInfo.front
            },
            staffName: paramObj.topicItem.name,
            doorName: paramObj.topicItem.location,
            validateType: paramObj.topicItem.recognitionMode,
            validateTime: paramObj.topicItem.verifyDatetime
          });
          if (paramObj.topicItem.type === "resident") {
            this.$refs.boardRight.DRData.resident =
              parseInt(this.$refs.boardRight.DRData.resident) + 1;
          } else if (paramObj.topicItem.type === "visitor") {
            this.$refs.boardRight.DRData.visitor =
              parseInt(this.$refs.boardRight.DRData.visitor) + 1;
          }
          break;
        case "face":
          if (this.$refs.boardRight.faceList.length > 2) {
            this.$refs.boardRight.faceList.pop();
          }
          this.$refs.boardRight.faceList.unshift({
            type: paramObj.topicItem.type,
            faceCapturePhotoUrl: paramObj.topicItem.faceUrl,
            staffName: paramObj.topicItem.name,
            channelName: paramObj.topicItem.location,
            captureDatetime: paramObj.topicItem.date
          });
          if (paramObj.topicItem.type === "resident") {
            this.$refs.boardRight.FRData.resident =
              parseInt(this.$refs.boardRight.FRData.resident) + 1;
          } else if (paramObj.topicItem.type === "focus") {
            this.$refs.boardRight.FRData.focus =
              parseInt(this.$refs.boardRight.FRData.focus) + 1;
          }
          break;
        case "alarm":
          if (this.$refs.boardLeft.tableData.length > 3) {
            this.$refs.boardLeft.tableData.pop();
          }
          this.$refs.boardLeft.tableData.unshift(paramObj.topicItem);
          if (paramObj.topicItem.dealState === "to_be_processed") {
            this.$refs.boardLeft.alarmTotal =
              this.$refs.boardLeft.alarmTotal + 1;
          }
          break;
      }
    }
  }
};
</script>
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
