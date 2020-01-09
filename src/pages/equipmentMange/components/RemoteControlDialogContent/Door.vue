<template>
  <div class='wrap doordutou'>
    <el-form ref="form"
             :rules="rules"
             :model="data"
             class='deviceInfoPanel'
             label-width="260px">

      <el-form-item label="门："
                    prop="door">
        <el-select v-model="door"
                   @change="changeDoor">
          <el-option :label="item.name"
                     v-for="(item,index) in options"
                     :key="index"
                     :value="item.channelUuid"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="打开门磁检测：">
        <el-switch v-model="data.doorContact"
                   @change="changeDoorContact"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <el-form-item label="开门按钮是否启用：">
        <el-switch v-model="data.openDoorButton"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <el-form-item label="门锁动作时间："
                    prop="doorLockTime">
        <el-input v-model='data.doorLockTime'
                  class='interval'
                  type="number">
        </el-input>
        <span class='timetips'>
          秒
        </span>
      </el-form-item>

      <el-form-item label="多次验证失败报警：">
        <el-switch v-model="data.errorTimesAlarmEnable"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <el-form-item label="验证失败次数："
                    prop="errorTimes">
        <el-input v-model='data.errorTimes'
                  class='interval'
                  type="number">
        </el-input>
        <span class='timetips'> 次 </span>
      </el-form-item>

      <el-form-item label="胁迫报警：">
        <el-switch v-model="data.intruderAlarmEnable"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <el-form-item label="门开超时报警：">
        <el-switch v-model="data.openTimeOutAlarmEnable"
                   @change="chaoshi('openTimeOutAlarmEnable')"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <el-form-item label="门开超时报警："
                    prop="openTimeout">
        <el-input v-model='data.openTimeout'
                  class='interval'
                  type="number">
        </el-input>
        <span class='timetips'> 秒 </span>
      </el-form-item>

      <el-form-item label="门异常打开报警：">
        <el-switch v-model="data.abnormalOpenAlarmEnable"
                   @change="chaoshi('abnormalOpenAlarmEnable')"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <el-form-item label="是否启用闭门回锁：">
        <el-switch v-model="data.closedDoorLock"
                   @change="chaoshi('closedDoorLock')"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <el-form-item label="闭门回锁时长："
                    prop="closedDoorLockTime">
        <el-input v-model='data.closedDoorLockTime'
                  class='interval'
                  type="number">
        </el-input>
        <span class='timetips'> 秒 </span>
      </el-form-item>

      <el-form-item label="常开时段："
                    prop="opentime">
        <el-select v-model="data.opentime">
          <el-option :label="item.periodName"
                     v-for="(item,index) in timeoptions"
                     :key="index"
                     :value="item.periodUuid"></el-option>
        </el-select>
        <el-button class='addIcon'
                   type="primary"
                   @click="addTime"
                   size='small'>
          <img :src="icons.tianjia"
               alt="">
          设置时段
        </el-button>
      </el-form-item>

      <el-form-item label="常闭时段："
                    prop="closetime">
        <el-select v-model="data.closetime">
          <el-option :label="item.periodName"
                     v-for="(item,index) in timeoptions"
                     :key="index"
                     :value="item.periodUuid"></el-option>
        </el-select>
      </el-form-item>

      <div class="dash-line"
           style="margin-bottom:15px;"></div>

      <div v-for='(item,index) in data.readheaders'
           :key='index'>
        <el-form-item label="是否启用读头：">
          <span slot="label">
            <span style="float:left;"> {{item.name}} </span>
            是否启用读头：
          </span>
          <el-switch v-model="item.enable"
                     active-color="rgb(38,78,70)"
                     inactive-color="rgb(75,78,82)">
          </el-switch>
        </el-form-item>

        <el-form-item label="读头方向："
                      prop="direction">
          <el-select v-model="item.direction"
                     class='direction'>
            <el-option label="进"
                       value="in"></el-option>
            <el-option label="出"
                       value="out"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="使能防拆检测：">
          <el-switch v-model="item.tamperEnable"
                     active-color="rgb(38,78,70)"
                     inactive-color="rgb(75,78,82)">
          </el-switch>
        </el-form-item>
      </div>

    </el-form>
    <el-button type="primary"
               disabled="!OwnAuthDisabled"
               class="saveBtn button22"
               @click='save'>
      保存
    </el-button>
    <set-time-area-dialog :visible.sync="setTimeDialogVisible"
                          :tableData="timeoptions"
                          :deviceUuid="deviceUuid"
                          @confirm="confirmUpdateTime"
                          :modal="false">

    </set-time-area-dialog>
  </div>
</template>

<script>
import icons from "@/common/icon.js";
import * as api from "@/pages/equipmentMange/ajax.js";
import SetTimeAreaDialog from "./SetDeviceTimeAreaDialog.vue";
export default {
  name: "doordutou",
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
    }
  },
  data() {
    return {
      icons,
      setTimeDialogVisible: false,
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 4,
            max: 32,
            message: "长度在 4 - 32 个字符串",
            trigger: "blur"
          }
        ],
        outputtime: [
          {
            required: true,
            message: "请输入时间"
          }
        ]
      },
      options: [],
      chanelUuid: "",
      door: "",
      data: {
        doormagnetic: false,
        openDoorButton: false,
        doorLockTime: "",
        openTimeout: "",
        closedDoorLock: false,
        closedDoorLockTime: "",
        opentime: "",
        closetime: "",
        dutou1: false,
        dutou1direction: "",
        dutou1fangchai: false,
        dutou2: false,
        abnormalOpenAlarmEnable: false,
        intruderAlarmEnable: false,
        errorTimesAlarmEnable: false,
        dutou2direction: "",
        dutou2fangchai: false
      },
      timeoptions: []
    };
  },
  methods: {
    addTime() {
      this.setTimeDialogVisible = true;
    },
    chaoshi(key) {
      if (!this.data.doorContact) {
        this.data[key] = false;
        this.$message.error("门磁检测是关闭状态,不可以启用！");
      }
    },
    changeDoorContact(val) {
      if (!val) {
        this.data.openTimeOutAlarmEnable = false;
        this.data.abnormalOpenAlarmEnable = false;
        this.data.closedDoorLock = false;
      }
    },
    getData() {
      // 先获取门列表
      api.getDoorList(this.deviceUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          this.options = res.data.data || [];
          if (res.data.data.length) {
            this.chanelUuid = res.data.data[0].channelUuid;
            this.door = res.data.data[0].channelUuid;
            this.getDoorData();
          }
        }
        // if(res.data.data.)
      });
    },
    getDoorData() {
      let seconds = 1000;
      if (this.chanelUuid) {
        api.getDoorDutou(this.chanelUuid).then(res => {
          console.log(res);
          if (res.data.success) {
            let data = res.data.data;
            data.doorContact = data.doorContact === 1;
            data.intruderAlarmEnable = data.intruderAlarmEnable === 1;
            data.closedDoorLock = data.closedDoorLock === 1;
            data.abnormalOpenAlarmEnable = data.abnormalOpenAlarmEnable === 1;
            data.openDoorButton = data.openDoorButton === 1;
            data.openTimeOutAlarmEnable = data.openTimeOutAlarmEnable === 1;
            data.errorTimesAlarmEnable = data.errorTimesAlarmEnable === 1;
            data.opentime = data.alwaysOpenPeriods.periodUuid;
            data.closetime =
              data.alwaysClosePeriods && data.alwaysClosePeriods.periodUuid;
            data.closedDoorLockTime = data.closedDoorLockTime / seconds;
            data.openTimeout = data.openTimeout / seconds;
            data.doorLockTime = data.doorLockTime / seconds;
            for (let i = 0; i < data.readheaders.length; i++) {
              data.readheaders[i].enable = data.readheaders[i].enable === 1;
              data.readheaders[i].tamperEnable =
                data.readheaders[i].tamperEnable === 1;
            }
            this.data = data;
            console.log(data);
          }
        });
      }
    },
    save() {
      console.log(this.data);
      if (!this.data.opentime) {
        this.$message.error("请选择常开时段！");
        return;
      }
      if (!this.data.closetime) {
        this.$message.error("请选择常闭时段！");
        return;
      }
      // alert(this.data.opentime);
      // if (
      //   this.data.opentime === this.data.closetime
      // ) {
      //   this.$message.error("常开时段和常闭时段重复");
      //   return;
      // }
      let alwaysClosePeriods = "",
        alwaysOpenPeriods = "";
      for (let i = 0; i < this.timeoptions.length; i++) {
        if (this.timeoptions[i].periodUuid === this.data.opentime) {
          alwaysOpenPeriods = this.timeoptions[i];
          delete alwaysOpenPeriods.content;
        }
        if (this.timeoptions[i].periodUuid === this.data.closetime) {
          alwaysClosePeriods = this.timeoptions[i];
          delete alwaysClosePeriods.content;
        }
      }
      let readheaders = JSON.parse(JSON.stringify(this.data.readheaders));
      let seconds = 1000;
      for (let i = 0; i < readheaders.length; i++) {
        readheaders[i].enable = readheaders[i].enable ? 1 : 0;
        readheaders[i].tamperEnable = readheaders[i].tamperEnable ? 1 : 0;
      }
      let data = {
        alwaysClosePeriods,
        alwaysOpenPeriods,
        closedDoorLock: this.data.closedDoorLock ? 1 : 0,
        closedDoorLockTime: this.data.closedDoorLockTime * seconds,
        doorContact: this.data.doorContact ? 1 : 0,
        doorLockTime: this.data.doorLockTime * seconds,
        openDoorButton: this.data.openDoorButton ? 1 : 0,
        openTimeOutAlarmEnable: this.data.openTimeOutAlarmEnable ? 1 : 0,
        intruderAlarmEnable: this.data.intruderAlarmEnable ? 1 : 0,
        errorTimesAlarmEnable: this.data.errorTimesAlarmEnable ? 1 : 0,
        abnormalOpenAlarmEnable: this.data.abnormalOpenAlarmEnable ? 1 : 0,
        openTimeout: this.data.openTimeout * seconds,
        errorTimes: this.data.errorTimes,
        readheaders
      };

      console.log(data);
      api.setDoorDutou(data, this.door, this.deviceUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$message.success("保存成功！");
        }
      });
      // this.$refs.form.validate(valid => {
      // let data = this.data;
      // data.doorContact = data.doorContact ? 1 : 0;
      // data.closedDoorLock = data.closedDoorLock ? 1 : 0;
      // data.openDoorButton = data.openDoorButton ? 1 : 0;
      // data.opentime = data.alwaysOpenPeriods.uuid;
      // data.closetime = data.alwaysClosePeriods.uuid;
      // for (let i = 0; i < data.readheaders.length; i++) {
      //   data.readheaders[i].enable = data.readheaders[i].enable
      //     ? 1
      //     : 0;
      //   data.readheaders[i].tamperEnable = data.readheaders[i].tamperEnable
      //     ? 1
      //     : 0;
      // }
      // });
    },
    confirmUpdateTime() {
      this.getTime();
    },
    changeDoor() {
      // 点击修改了门状态
    },
    getTime() {
      api.getTime({ deviceUuid: this.deviceUuid }).then(res => {
        console.log(res);
        if (res.data.success && res.data.data) {
          this.timeoptions = res.data.data.list || [];
          console.log(this.timeoptions);
        }
      });
    }
  },
  mounted() {
    this.getData();
    this.getTime();
  },
  components: {
    SetTimeAreaDialog
  }
};
</script>

<style lang="scss">
@import "@/style/variables.scss";
.doordutou {
  .el-input {
    width: 60px;
  }

  input {
    width: 60px;
    @include input30;
  }
  .el-select {
    .el-input {
      width: 220px;
    }
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .el-select {
    width: 220px;
    input {
      width: 220px;
    }
  }
  // .direction {
  //   width: 60px;
  //   input {
  //     width: 60px;
  //   }
  // }
  .button22 {
    @include button30;
  }
  .saveBtn {
    width: 66px;
    margin-top: 20px;
    margin-left: 260px;
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
  .addIcon {
    @include buttonnoborder;
  }
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
    height: calc(100% - 50px);
    overflow: auto;
    width: 90%;
    // max-width: 400px;
    margin: 0 auto;
    .timetips {
      display: inline-block;
      @include font-s;
    }
  }
}
</style>
