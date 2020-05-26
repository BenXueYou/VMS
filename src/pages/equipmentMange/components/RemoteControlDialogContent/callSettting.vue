<template>
  <div class="callSetting">
    <div class="title cube">通话设置</div>
    <el-row type="flex"
            justify="flex-start">
      <el-col class="leftBox"
              :span="12">
        <p>来电时长（来电多久后未接听，自动挂断）</p>
        <p>通话最长时间</p>
        <p>开锁后自动挂机</p>
      </el-col>
      <el-col class="rightBox"
              :span="12">
        <p>
          <el-radio-group v-model="callSettingParams.hungUpTime">
            <el-radio :label="10">10s</el-radio>
            <el-radio :label="30">30s</el-radio>
            <el-radio :label="60">60s</el-radio>
            <el-radio :label="90">90s</el-radio>
            <el-radio :label="120">120</el-radio>
          </el-radio-group>
        </p>
        <p>
          <el-radio-group v-model="callSettingParams.maxHungUpTime">
            <el-radio :label="60">60s</el-radio>
            <el-radio :label="120">120</el-radio>
            <el-radio :label="180">180s</el-radio>
          </el-radio-group>
        </p>
        <p>
          <el-switch v-model="callSettingParams.isHungup"
                     :active-value='1'
                     :inactive-value='0'
                     active-color="rgb(38,75,67)"
                     inactive-color="rgb(72,75,78)"></el-switch>
        </p>
        <p class="footerBtn">
          <el-button type='primary'
                     @click="onSave"
                     size="small">保存</el-button>
          <el-button type='primary'
                     @click="onCancel"
                     size="small">取消</el-button>
        </p>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  name: "callSetting",
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    deviceUuid: {
      type: String,
      default() {
        return {};
      }
    }
  },
  data() {
    return { callSettingParams: {} };
  },
  mounted() {
    this.getCallSettingParams();
  },
  methods: {
    getCallSettingParams() {
      console.log("获取参数");
      api
        .getRoomMachineCallParamUrl(this.deviceUuid)
        .then(res => {
          if (res.data.sucess) {
            this.callSettingParams = res.data.data;
          }
        })
        .catch(() => {});
    },
    onSave() {
      api
        .putRoomMachineCallParamUrl(this.callSettingParams)
        .then(res => {
          if (res.data.sucess) {
            this.$message({ type: "success", message: "保存成功" });
            this.$emit("onCancel");
          }
        })
        .catch(() => {});
    },
    onCancel() {
      this.$emit("onCancel");
    }
  },
  watch: {
    data(val) {
      this.callSettingParams = JSON.parse(JSON.stringify(val)) || {};
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/style/variables.scss";
.callSetting {
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
    margin-bottom: 20px;
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
  .leftBox {
    padding-left: 10%;
    color: #dddddd;
  }
  .el-col {
    p {
      margin-bottom: 30px;
    }
    .footerBtn {
      margin-top: 50px;
    }
  }
}
</style>
