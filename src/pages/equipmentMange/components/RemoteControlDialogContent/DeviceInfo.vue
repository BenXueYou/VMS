<template>
  <div class='wrap deviceInfo'>
    <div class="title cube">
      显示设备基本信息
    </div>
    <div class="deviceInfoPanel">
      <div class="panelItem"
           v-for="(value,key,index) in data"
           :key="index">
        <label for=""
               class='leftLabel'>{{translation[key]}}：</label>
        <el-input class='rightInput'
                  readonly
                  v-model="data[key]"></el-input>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/pages/equipmentMange/ajax.js";
let translation = {
  devName: "设备名称",
  devModel: "设备型号",
  programVersion: "固件版本",
  appVersion: "应用版本",
  hardwareVersion: "硬件版本",
  devID: "设备ID",
  MAC: "MAC"
};
export default {
  name: "DeviceInfo",
  props: {
    deviceUuid: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      translation,
      data: {
        devName: "",
        devModel: "",
        programVersion: "",
        appVersion: "",
        hardwareVersion: "",
        devID: "",
        MAC: ""
      }
    };
  },
  methods: {
    getDeviceInfo() {
      api.getDeivceInfo(this.deviceUuid).then(res => {
        if (res.data.success) {
          let data = res.data.data;
          data.remarks = data.remarks || {};
          this.data = {
            devName: data.name,
            devModel: data.model,
            programVersion: data.softwareVersion,
            appVersion: data.remarks.appVersion,
            hardwareVersion: data.hardwareVersion,
            devID: data.serialNo,
            MAC: data.mac
          };
          console.log(this.data);
        }
      });
    }
  },
  mounted() {
    this.getDeviceInfo();
  }
};
</script>

<style lang="scss">
@import "@/style/variables.scss";
.deviceInfo {
  input {
    width: 300px;
    @include input30;
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.wrap {
  height: 100%;
  padding: 13px 15px;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  .title {
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    @include font-s;
  }
  .cube {
    position: relative;
    padding-left: 18px;
    box-sizing: border-box;
    &::after {
      content: "";
      position: absolute;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
      width: 5px;
      height: 5px;
      background-color: #aaa;
    }
  }
  .deviceInfoPanel {
    width: 80%;
    max-width: 400px;
    margin: 0 auto;
    .panelItem {
      display: flex;
      flex-wrap: wrap;
      $labelWidth: 100px;
      margin-top: 15px;
      .leftLabel {
        width: $labelWidth;
        text-align: right;
        padding-right: 10px;
        line-height: 30px;
        box-sizing: border-box;
        @include font-s;
      }
      .rightInput {
        width: calc(100% - #{$labelWidth});
      }
    }
  }
}
</style>
