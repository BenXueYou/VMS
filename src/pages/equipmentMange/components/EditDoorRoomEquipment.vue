<template>
  <div class="editEquipaa">
    <div class="header">
      <span class="shuline">设备编辑</span>
      <div class="buttongroup">
        <el-button @click="confirm"
                   v-if="isOneProject"
                   :loading="isLoading"
                   class="button"
                   size="small"
                   type="primary">保存</el-button>
        <el-button @click="close"
                   class="button"
                   size="small"
                   type="primary">返回</el-button>
      </div>
    </div>
    <div class="body"
         ref='scroll'>
      <edit-device-base-top :isOneProject='isOneProject'
                            :houseUuid='houseUuid'
                            :houseName='houseName'
                            :orgName="orgName"
                            :orgUuid="orgUuid"
                            :isLocal="isLocal"
                            ref="ruleForm"
                            :deviceTypeArr="deviceTypeArr"
                            :FormData='ruleForm'></edit-device-base-top>
      <el-button type="text"
                 v-if="isLocal && !isOneProject">通道</el-button>
      <el-button type="primary"
                 v-if="isLocal && isOneProject"
                 :disabled="netStatus!='online'"
                 @click="syncChannel">同步通道</el-button>
      <div class="section door"
           v-if="zoneChannelArr.length">

        <div class="head">
          <img :src="icons.door"
               alt>
          防区
        </div>
        <div class="form-item"
             v-for="(item,index) in zoneChannelArr"
             :key="index">
          <label class="label">防区{{index+1}}：</label>
          <el-input :readonly="!isOneProject"
                    v-model="item.nickName"></el-input>
          <label class="label">通道国标码：</label>
          <el-input :readonly="!isOneProject"
                    v-model="item.gBCode"
                    @change="gogo"></el-input>
          <div class="mytagWrap">
            <gt-button class="button"
                       @close="deleteTag(1,index,x)"
                       v-for="(i,x) in item.tagPOList"
                       :key="x">{{i.tagName}}</gt-button>
            <el-button v-if="isOneProject"
                       class="addIcon"
                       type="primary"
                       @click="chooseTag(1,index)"
                       size="small">
              <i class="el-icon-circle-plus-outline"></i>
              选择标签
            </el-button>
          </div>
        </div>
      </div>
      <div class="section door"
           v-if="alarmChannelArr.length">

        <div class="head">
          <img :src="icons.door"
               alt>
          报警输出
        </div>
        <div class="form-item"
             v-for="(item,index) in alarmChannelArr"
             :key="index">
          <label class="label">报警输出：</label>
          <el-input :readonly="!isOneProject"
                    v-model="item.nickName"></el-input>
          <label class="label">输出类型：</label>
          <el-select v-model="item.ability"
                     :disabled="!isOneProject"
                     style='width:230px;'
                     placeholder="请选择"
                     @change="gogo"
                     multiple>
            <el-option v-for="item in abilityOption"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <label class="label">通道国标码：</label>
          <el-input :readonly="!isOneProject"
                    v-model="item.gBCode"
                    @change="gogo"></el-input>
          <div class="mytagWrap">
            <gt-button class="button"
                       @close="deleteTag(1,index,x)"
                       v-for="(i,x) in item.tagPOList"
                       :key="x">{{i.tagName}}</gt-button>
            <el-button v-if="isOneProject"
                       class="addIcon"
                       type="primary"
                       @click="chooseTag(1,index)"
                       size="small">
              <i class="el-icon-circle-plus-outline"></i>
              选择标签
            </el-button>
          </div>
        </div>
      </div>

      <person-tree-tag title="请选择要添加的标签"
                       rightTxt="已选择的标签"
                       :isShow.sync="isShow"
                       :treeType="treeType"
                       :isTag="true"
                       :checkedNodeArr="checkedNode"
                       @onCancel="onCancel"
                       @onConfirm="onConfirm"></person-tree-tag>
    </div>
    <div slot="footer"
         class="footer">
      <el-button @click="confirm"
                 v-if="isOneProject"
                 :loading="isLoading"
                 class='footerBtn'
                 type="primary">保存</el-button>
      <el-button @click="close"
                 class='footerBtn'
                 type="primary">返回</el-button>
    </div>
  </div>
</template>

<script>
import PopoverTree from "@/common/selectOrgTree";
import EditDeviceBaseTop from "./EditDeviceBaseTop.vue";

// 这是楼栋房屋只到单元的下拉框树
import BuildHousePopoverTree from "@/common/BuildHousePopoverTree2";
import channelSetRow from "@/pages/equipmentMange/components/channelSetRow";
import personTreeTag from "@/common/personTreeTag";
import icons from "@/common/js/icon.js";
import * as api from "../ajax";
export default {
  name: "TreeChangeNameDialog.vue",
  components: {
    PopoverTree,
    personTreeTag,
    channelSetRow,
    EditDeviceBaseTop,
    BuildHousePopoverTree
  },
  props: {
    isVideo: {
      type: Boolean,
      default() {
        return false;
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
        return "添加设备";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    deviceUuid: {
      type: String,
      default() {
        return "";
      }
    },
    netStatus: {
      type: String,
      default() {
        return "";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    deviceTypeArr: {
      type: Array,
      default() {
        return [];
      }
    },
    localService: {
      type: Array,
      default() {
        return [];
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    },
    row: {
      type: Object,
      default() {
        return {};
      }
    },
    update: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  computed: {
    // isOneProject() {
    //   return this.$store.state.home.platformLevel;
    // }
  },
  mounted() {
    let projectType = this.$store.state.home.projectType || {};
    this.isOneProject = Boolean(projectType.platformLevel === "levelOne");
  },
  data() {
    return {
      isLoading: false,
      alarmChannelArr: [],
      orgUuid: "",
      isLocal: false,
      service: "",
      isOneProject: true,
      alarmInOptions: [
        {
          value: "pulse_fence",
          label: "脉冲电子围栏（I/O）"
        },
        {
          value: "touch_net_fence",
          label: "触网脉冲电子围栏（I/O）"
        },
        {
          value: "tension_fence",
          label: "张力围栏（I/O）"
        },
        {
          value: "vibrating_fiber",
          label: "振动光纤（I/O）"
        },
        {
          value: "leaky_cable",
          label: "泄漏电缆（I/O）"
        },
        {
          value: "infrared_detector",
          label: "红外探测器"
        },
        {
          value: "infrared_radiation",
          label: "红外对射"
        },
        {
          value: "temperature_detector",
          label: "温感探测器"
        },
        {
          value: "humidity_detector",
          label: "湿度探测器"
        },
        {
          value: "emergency_button",
          label: "紧急按钮"
        },
        {
          value: "smoke_detector",
          label: "烟感探测器"
        },
        {
          value: "fire_alarm",
          label: "火警"
        },
        {
          value: "other_detector",
          label: "其他探测器"
        }
      ],
      alarmOutOptions: [
        {
          value: "bell",
          label: "警号"
        },
        {
          value: "printer",
          label: "打印机"
        },
        {
          value: "lcm",
          label: "灯控模块（输出）"
        },
        {
          value: "sound_light",
          label: "声光告警器"
        },
        {
          value: "emap",
          label: "电子地图模块"
        },
        {
          value: "aom",
          label: "视频联动模块"
        },
        {
          value: "other_bell",
          label: "其他告警器"
        }
      ],
      options: [
        {
          value: "bullet_camera",
          label: "枪机"
        },
        {
          value: "dome_camera",
          label: "半球机"
        },
        {
          value: "ball_camera",
          label: "球机"
        },
        {
          value: "bullet_camera_ptz",
          label: "带云台的枪机"
        }
      ],
      abilityOption: [
        {
          value: "faceSnap",
          label: "人脸"
        },
        {
          value: "bodySnap",
          label: "人体"
        },
        {
          value: "vehicleSnap",
          label: "车辆"
        }
      ],
      houseUuid: "", // 楼栋房屋的ID
      treeType: window.config.tagType,
      isShow: false,
      icons,
      door: "",
      checkedNode: [],
      ruleForm: {
        ip: "",
        tagSn: "",
        nickName: "",
        deviceType: "",
        oriz: "",
        build: "",
        desc: "",
        gBCode: "",
        deviceIp: "",
        devicePort: "",
        deviceUsername: "",
        productType: "",
        devicePassword: ""
      },
      editEquipmentDialogVisible: false,
      zoneChannelArr: [],
      dutouData: [],
      shuchuData: [],
      shuruData: [],
      ipc: [],
      whichType: 1,
      whichIndex: 0,
      orgName: "",
      houseName: "",
      bullet_camera: []
    };
  },
  methods: {
    updateData(channelType, index, data) {
      console.log(channelType, index, data);
      for (let i = 0; i < this.alarmChannelArr.length; i++) {
        if (this.alarmChannelArr[i].name === channelType) {
          this.alarmChannelArr[i].data = data;
        }
      }
      console.log(this.alarmChannelArr);
    },
    gogo() {
      this.ipc = this.ipc.concat();
      this.bullet_camera = this.bullet_camera.concat();
      this.zoneChannelArr = this.zoneChannelArr.concat();
      this.dutouData = this.dutouData.concat();
      this.shuchuData = this.shuchuData.concat();
      this.shuruData = this.shuruData.concat();
    },
    syncChannel() {
      api.syncChannel(this.deviceUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          // 设备版本号 +1
          this.ruleForm.version += 1;
          this.$message.success("同步通道成功!");
          console.log(this.ruleForm);
          this.$emit("updateEdit", this.deviceUuid, this.netStatus);
        }
      });
    },
    changeOptions(val) {},
    deleteTag(type, i, j) {
      let key = "";
      if (type === 1) {
        key = "zoneChannelArr";
      } else if (type === 2) {
        key = "dutouData";
      } else if (type === 3) {
        key = "shuruData";
      } else if (type === 4) {
        key = "shuchuData";
      } else if (type === 5) {
        key = "ipc";
      } else if (type === 6) {
        key = "bullet_camera";
      }
      console.log(key);
      this[key][i].tagPOList.splice(j, 1);
      console.log(this[key][i]);
      this.delteTagChannel(
        this[key][i].tagPOList,
        this[key][i].channelUuid,
        this[key][i].channelType
      );
      this[key].concat();
    },
    chooseTag(whichType, index, x) {
      this.whichType = whichType;
      this.whichIndex = parseInt(index);
      let data = [],
        key = "zoneChannelArr";
      if (this.whichType === 1) {
        key = "zoneChannelArr";
      } else if (this.whichType === 2) {
        key = "dutouData";
      } else if (this.whichType === 3) {
        key = "shuruData";
      } else if (this.whichType === 4) {
        key = "shuchuData";
      } else if (this.whichType === 5) {
        key = "ipc";
      } else if (this.whichType === 6) {
        key = "bullet_camera";
      }
      console.log(this.whichIndex);
      data = this[key][this.whichIndex].tagPOList;
      for (let i = 0; i < data.length; i++) {
        data[i].id = data[i].tagUuid;
        data[i].label = data[i].tagName;
      }
      this.checkedNode = JSON.parse(JSON.stringify(data));
      this.isShow = true;
    },
    onCancel() {
      this.isShow = false;
    },
    delteTagChannel(data, channelUuid, channelType) {
      api.deleteChannelTagUrl(data, channelUuid, channelType).then(res => {
        console.log(res);
      });
    },
    onConfirm(data) {
      console.log(data);
      let key = "";
      if (this.whichType === 1) {
        key = "zoneChannelArr";
      } else if (this.whichType === 2) {
        key = "dutouData";
      } else if (this.whichType === 3) {
        key = "shuruData";
      } else if (this.whichType === 4) {
        key = "shuchuData";
      } else if (this.whichType === 5) {
        key = "ipc";
      } else if (this.whichType === 6) {
        key = "bullet_camera";
      }

      this[key][this.whichIndex].tagPOList = data;
      this[key].concat();
      let channelUuid = this[key][this.whichIndex].channelUuid;
      let channelType = this[key][this.whichIndex].channelType;
      this.delteTagChannel(data, channelUuid, channelType);
      this.isShow = false;
    },
    saveData() {
      let num = [];
      console.log(this.ipc);
      const getNum = data => {
        data.forEach(item => {
          item.faceSnap = item.ability.indexOf("faceSnap") !== -1 ? 1 : 0;
          item.vehicleSnap = item.ability.indexOf("vehicleSnap") !== -1 ? 1 : 0;
          item.bodySnap = item.ability.indexOf("bodySnap") !== -1 ? 1 : 0;
          delete item.ability;
          item.extInfo.remarks.latitude = item.latitude;
          item.extInfo.remarks.longitude = item.longitude;
          item.extInfo.remarks.gBCode = item.gBCode;
        });
        return data;
      };
      num = num.concat(getNum(this.zoneChannelArr));
      num = num.concat(getNum(this.dutouData));
      num = num.concat(getNum(this.shuruData));
      num = num.concat(getNum(this.shuchuData));
      num = num.concat(getNum(this.ipc));
      num = num.concat(getNum(this.bullet_camera));

      for (let i = 0; i < this.alarmChannelArr.length; i++) {
        num = num.concat(getNum(this.alarmChannelArr[i].data));
      }
      console.log(num);
      let data = {};
      const getServiceNameByUuid = uuid => {
        return this.localService.filter(v => {
          return v.belongServiceUuid === uuid;
        })[0].belongServiceName;
      };
      if (this.isLocal) {
        data = {
          belongServiceName: getServiceNameByUuid(
            this.ruleForm.belongServiceUuid
          ),
          belongServiceUuid: this.ruleForm.belongServiceUuid,
          deviceIp: this.ruleForm.deviceIp,
          devicePassword: this.ruleForm.devicePassword,
          devicePort: this.ruleForm.devicePort,
          deviceType: this.ruleForm.deviceType,
          gBCode: this.ruleForm.gBCode,
          deviceUsername: this.ruleForm.deviceUsername,
          deviceUuid: this.deviceUuid,
          infrastructureUuid: this.ruleForm.build,
          nickName: this.ruleForm.nickName,
          orgUuid: this.ruleForm.oriz,
          remarks: this.ruleForm.remarks,
          productType: this.ruleForm.productType,
          version: this.ruleForm.version,
          channelList: num
        };
      } else {
        data = {
          gBCode: this.ruleForm.gBCode,
          deviceType: this.ruleForm.deviceType,
          orgUuid: this.ruleForm.oriz,
          infrastructureUuid: this.ruleForm.build,
          remarks: this.ruleForm.desc,
          deviceUuid: this.deviceUuid,
          nickName: this.ruleForm.nickName,
          version: this.ruleForm.version,
          productType: this.ruleForm.productType,
          channelList: num
        };
      }
      this.isLoading = true;
      if (this.isLocal) {
        api
          .editManualEquipment(data)
          .then(res => {
            console.log(res);
            this.isLoading = false;
            if (res.data.success) {
              this.$message.success("保存成功！");
              this.$emit("showEdit", true);
            }
          })
          .catch(() => {
            this.isLoading = false;
          });
      } else {
        api
          .saveDevice(data)
          .then(res => {
            console.log(res);
            this.isLoading = false;
            if (res.data.success) {
              this.$message.success("保存成功！");
              this.$emit("showEdit", true);
            }
          })
          .catch(() => {
            this.isLoading = false;
          });
      }
    },
    confirm() {
      // 获取子组件的值以及调用子组件方法
      // console.log(this.$refs.ruleForm.$children[0]);
      this.ruleForm = this.$refs.ruleForm.ruleForm;
      this.$refs.ruleForm.$children[0].validate(valid => {
        if (valid) {
          this.saveData();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    close() {
      this.$emit("showEdit", false);
    },
    getServiceList() {
      api.serviceList().then(res => {
        console.log(res);
        if (res.data.success) {
        }
      });
    }
  },
  watch: {
    update() {
      let val = this.visible;
      this.$nextTick(() => {
        this.$refs.scroll.scrollTop = 0;
      });
      if (val) {
        console.log(this.row);
        this.row.extInfo = this.row.extInfo || {};
        this.ruleForm = {
          belongServiceUuid:
            this.row.extInfo.subService &&
            this.row.extInfo.subService.serviceUuid,
          ip: this.row.deviceIp,
          tagSn: this.row.deviceSn,
          nickName: this.row.nickName,
          deviceType: this.row.deviceType,
          oriz: this.row.org[0].orgUuid,
          build: this.row.infrastructureUuid,
          desc: this.row.remarks,
          gBCode: this.row.extInfo.gBCode || "",
          version: this.row.version,
          deviceIp: this.row.deviceIp,
          devicePort: this.row.devicePort,
          productType: this.row.productType,
          deviceUsername:
            this.row.extInfo.loginInfo && this.row.extInfo.loginInfo.loginName,
          devicePassword:
            this.row.extInfo.loginInfo && this.row.extInfo.loginInfo.loginPwd
        };
        // 标识是不是手动添加的，正向连接则表示local  反向连接则非
        if (this.row.extInfo.source === "local") {
          this.isLocal = true;
        } else {
          this.isLocal = false;
        }
        console.log(this.row.channelMapList);
        // 处理数据格式异常
        this.row.channelMapList = this.row.channelMapList || {};
        // 重组防区数组的字段
        this.zoneChannelArr = (
          this.row.channelMapList.auth_alarm_zone || []
        ).map(val => {
          if (!val.extInfo) {
            val.extInfo = {};
          }
          if (!val.extInfo.remarks) {
            val.extInfo.remarks = {};
          }
          val.gBCode = val.extInfo.remarks.gBCode || "";
          val.latitude = val.extInfo.remarks.latitude || "";
          val.longitude = val.extInfo.remarks.longitude || "";
          val.tagPOList = val.tagPOList || [];
          val.ability = [];
          if (val.extInfo.faceSnap === 1) {
            val.ability.push("faceSnap");
          }
          if (val.extInfo.vehicleSnap === 1) {
            val.ability.push("vehicleSnap");
          }
          if (val.extInfo.bodySnap === 1) {
            val.ability.push("bodySnap");
          }
          return val;
        });
        // 重组报警通道数组的字段
        this.alarmChannelArr = (
          this.row.channelMapList.auth_alarm_io_aoc || []
        ).map(val => {
          if (!val.extInfo) {
            val.extInfo = {};
          }
          if (!val.extInfo.remarks) {
            val.extInfo.remarks = {};
          }
          val.gBCode = val.extInfo.remarks.gBCode || "";
          val.latitude = val.extInfo.remarks.latitude || "";
          val.longitude = val.extInfo.remarks.longitude || "";
          val.tagPOList = val.tagPOList || [];
          val.ability = [];
          if (val.extInfo.faceSnap === 1) {
            val.ability.push("faceSnap");
          }
          if (val.extInfo.vehicleSnap === 1) {
            val.ability.push("vehicleSnap");
          }
          if (val.extInfo.bodySnap === 1) {
            val.ability.push("bodySnap");
          }
          return val;
        });

        // 记录门状态
        if (this.row.org && this.row.org.length) {
          this.orgName = this.row.org[0].orgName;
          this.orgUuid = this.row.org[0].orgUuid;
        }
        this.houseName = this.row.infrastructureName;
        this.houseUuid = this.row.infrastructureUuid;
      } else {
        this.alarmChannelArr = [];
        this.orgName = "";
        this.houseName = "";
        this.$refs.ruleForm.resetFields();
      }
      this.editEquipmentDialogVisible = this.visible;
    }
  }
};
</script>

<style lang="scss">
@import "@/style/variables.scss";
.editEquipaa {
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
    color: rgba(40, 255, 187, 1) !important;
  }
  input {
    @include input30;
  }
  .demo-ruleForm {
    input {
      width: 250px;
    }
  }
  .el-form-item__content {
    line-height: 30px;
  }
  .el-form-item__label {
    line-height: 30px;
  }
  .devIp {
    line-height: 30px;
    @include font-s;
  }
  .el-form-item {
    margin-bottom: 20px;
  }
  .showMsg {
    margin-bottom: 10px;
  }
  .el-select {
    height: 30px;
    .el-input {
      height: 30px;
      line-height: 30px;
      input {
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .el-form-item.is-success .el-input__inner,
  .el-form-item.is-success .el-input__inner:focus,
  .el-form-item.is-success .el-textarea__inner,
  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: $--color-primary;
  }
  .el-dialog__header {
    border-width: 0px;
  }
}
</style>

<style lang="scss" >
@import "@/style/variables.scss";

@mixin padding {
  padding: 10px 30px 30px;
  box-sizing: border-box;
}
$dashline: 1px dashed rgba(255, 255, 255, 0.1);
.editEquipaa {
  width: 1200px;
  background: #212325;
  .header {
    padding-left: 30px;
    .buttongroup {
      float: right;
      margin-right: 30px;
      margin-top: 5px;
      .button {
        min-width: 66px;
        @include button30;
      }
    }
    .shuline {
      position: relative;
      font-family: "PingFangSC-Regular";
      font-size: 14px;
      color: #ffffff;
      line-height: 50px;
      padding-left: 5px;
      &::after {
        content: "";
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        width: 3px;
        height: 14px;
        background: $add-text-color;
      }
    }
  }
  .body {
    height: calc(100vh - 290px);
    overflow-y: auto;
    padding: 20px 0px 10px;
    margin: 0px 30px 30px;
    border-top: $dashline;
    .devIp {
      @include font-s;
    }
    .righttips {
      float: right;
      .test {
        padding-right: 20px;
      }
      .refresh {
        cursor: pointer;
        img {
          display: inline-block;
          vertical-align: middle;
        }
        color: $add-text-color;
      }
    }
    .section {
      border-top: $dashline;
      .form-item {
        padding-left: 100px;
        $mleft: 10px;
        margin-bottom: 15px;
        vertical-align: top;
        color: #fff;
        .el-input {
          display: inline-block;
          width: 160px;
          vertical-align: top;
        }
        .button {
          vertical-align: middle;
          margin-left: $mleft;
          margin-bottom: 10px;
        }
        .addIcon {
          margin-left: $mleft;
          border: none;
          background: none;
          @include font-s;
          color: $add-text-color;
        }
        .label {
          display: inline-block;
          @include font-s;
          width: 80px;
          vertical-align: middle;
        }
        .mytagWrap {
          display: inline-block;
          margin-top: 10px;
          width: calc(100% - 300px);
        }
      }
      .videoSetingaa {
        margin-top: 10px;
      }
      .head {
        padding: 10px 20px;
        @include font-s;
        img {
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }
      }
    }
  }
  .footer {
    @include padding;
    overflow: hidden;
    display: flex;
    justify-content: flex-end;
    .footerBtn {
      min-width: 66px;
      @include button30;
    }
  }
}
</style>
