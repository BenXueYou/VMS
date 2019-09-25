<template>
  <div class="vistorSignOff">
    <div class="title">
      <span class="sp1"></span>
      <span>访客签离配置</span>
    </div>
    <div class="contain">
       <div class="infoWrap">
        <div class="left">是否需要签离：</div>
        <div class="right">
          <el-switch :width="27"
                     v-model="needSignOff"
                     active-color="#26D39D40"
                     inactive-color="rgb(72,73,75)"></el-switch>
        </div>
      </div>
      <div class="infoWrap" v-show="needSignOff">
        <div class="left">允许手动签离：</div>
        <div class="right">
          <el-switch :width="27"
                     v-model="manualOff"
                     active-color="#26D39D40"
                     inactive-color="rgb(72,73,75)"></el-switch>
        </div>
      </div>
      <div class="infoWrap" v-show="needSignOff">
        <div class="left">自动签离：</div>
        <div class="right">
          <el-switch :width="27"
                     v-model="autoOff"
                     active-color="#26D39D40"
                     inactive-color="rgb(72,73,75)"></el-switch>
        </div>
      </div>
      <div class="infoWrap">
        <div class="left">访客权限失效/自动签离时间：</div>
        <div class="right">
          <el-time-picker v-model="leaveTimeValue"
                          style="width: 200px;height: 30px;"
                          value-format="HH:mm:ss"
                          format="HH:mm:ss"></el-time-picker>
        </div>
      </div>
      <div class="brnWrap">
        <el-button style="width: 66px;"
                   @click="confirmAct">确定</el-button>
        <el-button style="width: 66px;"
                   @click="cancelAct">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../../utils/ajax";
export default {
  components: {},
  props: {},
  data() {
    return {
      manualOff: true,
      autoOff: false,
      leaveTimeValue: "",
      signOffConfig: {},
      needSignOff: false
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      api.getVistorSignOffUrl().then(res => {
        this.signOffConfig = null;
        if (res.data.success && res.data.data) {
          let data = res.data.data;
          this.manualOff = Boolean(data.manualSignOff);
          this.autoOff = Boolean(data.autoSignOff);
          this.leaveTimeValue = data.autoSignOffTime;
          this.signOffConfig = data;
          this.needSignOff = Boolean(data.needSignOff);
        } else {
          this.$message({ type: "error", message: "出错了" });
        }
      });
    },
    cancelAct() {
      this.initData();
    },
    confirmAct() {
      Object.assign(this.signOffConfig, {
        manualSignOff: Number(this.manualOff), // 允许手动签离
        autoSignOff: Number(this.autoOff), // 自动签离
        needSignOff: Number(this.needSignOff),
        autoSignOffTime: this.leaveTimeValue // 访客权限失效/自动签离时间
      });
      console.log(this.signOffConfig);
      api.putVistorSignOffUrl(this.signOffConfig).then(res => {
        if (res.data.success && res.data.data) {
          this.$message({ type: "success", message: "设置成功" });
        } else {
          this.$message({ type: "error", message: "设置失败" });
        }
      });
    }
  },
  watch: {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "@/style/variables.scss";
.vistorSignOff {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.vistorSignOff .title {
  width: 100%;
  height: 50px;
  background: #212325;
  font-family: 'PingFangSC-Regular';
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 40px;
  box-sizing: border-box;
}
.vistorSignOff .title .sp1 {
  width: 3px;
  height: 14px;
  background: #26d39d;
  margin-right: 9px;
}
.vistorSignOff .contain {
  flex: 1;
  background: #212325;
  margin-top: 16px;
  padding: 41px 0 0 52px;
  box-sizing: border-box;
}
.vistorSignOff .infoWrap {
  width: 100%;
  height: 18px;
  display: flex;
  flex-direction: row;
  font-family: 'PingFangSC-Regular';
  font-size: 13px;
  color: #dddddd;
  margin-bottom: 21px;
}
.vistorSignOff .infoWrap .left {
  width: 220px;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.vistorSignOff .infoWrap .right {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.vistorSignOff .infoWrap .el-switch {
  margin-left: 18px;
}
.vistorSignOff .contain .brnWrap {
  width: 100%;
  height: 32px;
  padding-left: 220px;
  box-sizing: border-box;
  margin-top: 45px;
}
.vistorSignOff .el-button--default,
.vistorSignOff .el-button--default:active,
.vistorSignOff .el-button--default:focus,
.vistorSignOff .el-button--default:hover {
  height: 32px;
  background: rgba(40, 255, 187, 0.1);
  border: 1px solid rgba(40, 255, 187, 0.35);
  border-radius: 2px;
  font-family: 'PingFangSC-Regular';
  font-size: 13px;
  color: #ffffff;
  position: relative;
  padding: 0 0 0 0;
}
.vistorSignOff .el-switch.is-checked .el-switch__core::after {
  left: 100%;
  margin-left: -13px;
  background: #26d39d;
}
.vistorSignOff .el-switch__core:after {
  background: #dddddd;
}
</style>
