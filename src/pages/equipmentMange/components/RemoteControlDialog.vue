<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             class='remoteControlDialog'
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :visible.sync='remoteControlDialogVisiable'>
    <div class="wrap">
      <div class="leftmenu">
        <ul>
          <li v-for="(item,index) in menuData"
              @click="switchMenu(index)"
              :class="{'activeMenu':leftActiveIndex==index}"
              :key="index">
            {{item.label}}
          </li>
        </ul>
      </div>
      <div class="content">
        <!-- <keep-alive> -->
        <component :is='currentComponents'
                   :ShowAuthDisabled="ShowAuthDisabled"
                   :OwnAuthDisabled="OwnAuthDisabled"
                   @onCancel='close'
                   :deviceUuid="deviceUuid">
        </component>
        <!-- </keep-alive> -->
      </div>
    </div>
  </el-dialog>
</template>

<script>
import DeviveInfo from "./RemoteControlDialogContent/DeviceInfo";
import Door from "./RemoteControlDialogContent/Door";
import FaceParam from "./RemoteControlDialogContent/FaceParam";
import NetParam from "./RemoteControlDialogContent/NetParam";
import Relay from "./RemoteControlDialogContent/Relay";
import Vistor from "./RemoteControlDialogContent/Vistor";
import system from "./RemoteControlDialogContent/system";
import WorkStatus from "./RemoteControlDialogContent/WorkStatus";
import Timing from "./RemoteControlDialogContent/Timing";
import alarmSeting from "./RemoteControlDialogContent/alarmSeting";
import callSetting from './RemoteControlDialogContent/callSettting';
import MeasureTemperature from "./RemoteControlDialogContent/MeasureTemperature";

const menuData = [
  {
    label: "设备信息",
    component: "DeviveInfo"
  },
  {
    label: "工作状态",
    component: "WorkStatus"
  },
  {
    label: "门/读头",
    component: "Door"
  },
  {
    component: "system",
    label: "系统升级&维护"
  },
  {
    component: "NetParam",
    label: "网络参数"
  },
  {
    component: "Timing",
    label: "校时"
  },
  {
    component: "FaceParam",
    label: "人脸识别参数"
  },
  {
    component: "Relay",
    label: "继电器参数"
  },
  {
    component: "alarmSeting",
    label: "设备报警配置"
  }
];
const visitorMenuData = [
  {
    label: "设备信息",
    component: "DeviveInfo"
  },
  {
    label: "访客登记配置",
    component: "Vistor"
  },

  {
    component: "NetParam",
    label: "网络参数"
  },
  {
    component: "Timing",
    label: "校时"
  },
  {
    component: "system",
    label: "系统升级&维护"
  }
];
const buildingIntercom = [
  {
    label: "设备信息",
    component: "DeviveInfo"
  },
  {
    label: " 通话设置",
    component: "callSetting"
  },
  {
    component: "NetParam",
    label: "网络参数"
  },
  {
    component: "Timing",
    label: "校时"
  },
  {
    component: "system",
    label: "系统升级&维护"
  }
];
export default {
  name: "RemoteControlDialog",
  components: {
    DeviveInfo,
    WorkStatus,
    Door,
    system,
    NetParam,
    Timing,
    FaceParam,
    Relay,
    alarmSeting,
    Vistor,
    callSetting,
    MeasureTemperature
  },
  props: {
    ShowAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    OwnAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    deviceUuid: {
      type: String,
      default() {
        return "";
      }
    },
    width: {
      type: String,
      default() {
        return "1000px";
      }
    },
    title: {
      type: String,
      default() {
        return "设备配置";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    viewType: {
      type: String,
      default() {
        return "door";
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    },
    bodyTemperature: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      leftActiveIndex: 0,
      remoteControlDialogVisiable: false,
      currentComponents: "DeviveInfo",
      menuData: [],
      testUuid: ""
    };
  },
  methods: {
    switchMenu(index) {
      this.leftActiveIndex = index;
      console.log(this.menuData[index]);
      this.currentComponents = this.menuData[index].component;
    },
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.currentComponents = "DeviveInfo";
        this.leftActiveIndex = 0;
        if (this.viewType === "visitor") {
          this.menuData = JSON.parse(JSON.stringify(visitorMenuData));
        } else if (this.viewType === "door") {
          this.menuData = JSON.parse(JSON.stringify(buildingIntercom));
        } else {
          this.menuData = JSON.parse(JSON.stringify(menuData));
        }
        if (this.bodyTemperature === "1") {
          this.menuData.push({
            component: "MeasureTemperature",
            label: "体温配置"
          });
        }
      } else {
        this.currentComponents = "";
      }
      this.remoteControlDialogVisiable = val;
    }
  }
};
</script>
<style lang='scss'>
.remoteControlDialog {
  .el-form-item__content {
    line-height: 30px;
  }
  .el-form-item__label {
    line-height: 30px;
  }

  .el-form-item__error {
    padding-top: 0px;
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.wrap {
  display: flex;
  $leftmenuwidth: 220px;
  height: 550px;
  .leftmenu {
    width: $leftmenuwidth;
    padding-right: 40px;
    border-right: 1px solid rgb(48, 51, 55);
    box-sizing: border-box;
    ul {
      list-style: none;
      li {
        display: block;
        width: 125px;
        line-height: 30px;
        margin-top: 13px;
        background: rgb(48, 51, 55);
        text-align: center;
        border-radius: 3px;
        color: #fff;
        border: 1px solid transparent;
        @include font-s;
        cursor: pointer;
        &:first-child {
          margin-top: 20px;
        }
      }
    }
  }
  .content {
    width: calc(100% - #{$leftmenuwidth});
  }
}
</style>
