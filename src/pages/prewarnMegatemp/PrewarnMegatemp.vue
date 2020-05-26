<template>
  <div class="PrewarnMegatemp">
    <div class="flex_sbw topBox">
      <div class="leftBox">
        <div class="dateTimeBox">
          请选择时间段：
          <el-date-picker type="datetime"
                          placeholder="开始时间"
                          v-model="startTime"
                          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <span>-</span>
          <el-date-picker type="datetime"
                          placeholder="结束时间"
                          v-model="endTime"
                          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </div>
        <div class="radioGroupBox">
          <el-radio-group v-model="typeRadio"
                          @change="typeRadioChangeAct">
            <el-radio label="today">今日</el-radio>
            <el-radio label="lastday">昨日</el-radio>
            <el-radio label="thisWeek">本周</el-radio>
            <el-radio label="thisMonth">本月</el-radio>
          </el-radio-group>
        </div>
        <div class="deviceBox">
          请选择设备：
          <elPopverTree :channelInfoList="deviceList"
                        elPopoverClass="PMPopoverClass BRPopoverClass"
                        @transferCheckedChannel="transferCheckedChannel"
                        inputWidth="55%"
                        ref="PMDeviceRef"
                        shootType="shootType"
                        :isCheckedAll="true"></elPopverTree>
        </div>
        <div class="divBox">
          姓名：
          <el-input v-model="staffName"
                    clearable></el-input>
        </div>
      </div>
      <div class="rightBox">
        <el-button @click="queryBtnAct">查询</el-button>
        <el-button @click="resetBtnAct">重置</el-button>
      </div>
    </div>
    <div class="BodyClass">
      <div class="bodyBox">
        <template v-for="(item, index) in tableData">
          <megatemp-card :defaultItem="item"
                         class="cardClass"
                         :key="index"></megatemp-card>
        </template>
        <div style="color:#DDDDDD;font-size:18px;margin:10% auto 0;"
             v-if="!tableData.length">
          暂无数据
        </div>
      </div>
      <div class="footBox">
        <el-pagination @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       layout="total,prev, pager, next,jumper"
                       :page-size="pageSize"
                       :total="total"
                       background></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import elPopverTree from "@/pages/faceModule/components/ElPopverTree.vue";
import MegatempCard from "./components/MegaTempCard.vue";
export default {
  components: { elPopverTree, MegatempCard },
  props: {},
  data() {
    return {
      ShowAuthDisabled: false,
      OwnAuthDisabled: false,
      startTime: "",
      endTime: "",
      typeRadio: "today",
      deviceList: [],
      checkedChannelsUuidList: [],
      staffName: null,
      pageSize: 20,
      total: 0,
      currentPage: 1,
      tableData: []
    };
  },
  created() {
    this.startTime = this.$common.getStartTime();
    this.endTime = this.$common.getCurrentTime();
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("高温预警", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("高温预警", "isOwn");
    // 当设备列表没加载出来的时候不做初始化
    // this.initData();
  },
  methods: {
    queryBtnAct() {
      this.currentPage = 1;
      this.initData();
    },
    resetBtnAct() {
      this.startTime = this.$common.getStartTime();
      this.endTime = this.$common.getCurrentTime();
      this.staffName = null;
      this.typeRadio = "today";
      this.typeRadioChangeAct(this.typeRadio);
      this.$refs.PMDeviceRef.clearAction();
      this.checkedChannelsUuidList = [];
      this.deviceList = [];
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initData();
    },
    transferCheckedChannel(checkedChannel) {
      this.checkedChannelsUuidList = [];
      for (var i = 0; i < checkedChannel.length; i++) {
        this.checkedChannelsUuidList.push(checkedChannel[i].channelUuid);
      }
      if (this.ShowAuthDisabled) {
        // 当设备列表加载出来，根据设备通道来加载
        this.initData();
      }
    },
    initData() {
      if (!this.ShowAuthDisabled) return;
      if (!this.staffName) this.staffName = null;
      let isValite =
        new Date(this.startTime).getTime() > new Date(this.endTime).getTime();
      if (isValite) {
        this.$message({ type: "warning", message: "开始时间不得早于结束时间" });
        return;
      }
      if (
        new Date(this.endTime).getMonth() === new Date().getMonth() &&
        new Date(this.endTime).getDate() > new Date().getDate()
      ) {
        this.$message({ type: "warning", message: "结束时间不得早于当天" });
        return;
      }
      this.$logSearchHttp
        .getAlarmLog({
          resUuid: this.checkedChannelsUuidList.toString(),
          pageSize: this.pageSize,
          staffName: this.staffName,
          beginTime: this.startTime,
          endTime: this.endTime,
          buessinessType: "VIDEO",
          subtype: "body_temp_abnormal",
          currentPage: this.currentPage
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.tableData = res.data.data.list || [];
            this.total = res.data.data.total;
          } else {
            this.tableData = [];
            this.total = [];
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    typeRadioChangeAct(val) {
      let obj = this.$common.transSelectDate(val);
      console.log(obj);
      this.startTime = obj.startTime;
      this.endTime = obj.endTime;
    }
  },
  watch: {},
  destroyed() {}
};
</script>
<style lang="scss">
.PMPopoverClass {
  width: 600px;
  .popverTreeParent .checkGroupClass {
    margin-left: 0 !important;
  }
}

.PrewarnMegatemp {
  margin: 30px;
  height: calc(100% - 60px);
  overflow-y: auto;
  // max-height: 100%;
  background: #212325;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 2px 2px 2px 2px 0 0;
  border-radius: 2px 2px 2px 2px 0px 0px;
  padding: 30px;
  box-sizing: border-box;
  overflow-y: auto;
  .el-input {
    display: inline-block;
  }
  .flex_sbw {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .topBox {
    font-family: "PingFangSC-Regular";
    font-size: 13px;
    color: #ffffff;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
    padding-bottom: 15px;
    .dateTimeBox {
      min-width: 500px;
      .el-input {
        width: 190px;
      }
      .el-input--suffix .el-input__inner {
        padding-right: 15px;
      }
      span {
        margin: 0 5px;
      }
    }
    .leftBox {
      display: flex;
      // flex-wrap: wrap;
      justify-content: flex-start;
      .radioGroupBox {
        min-width: 255px;
        margin: 0 2%;
        line-height: 40px;
        .el-radio {
          margin-right: 15px;
        }
      }
      .deviceBox {
        min-width: 260px;
      }
      .divBox {
        min-width: 205px;
        .el-input {
          width: 160px;
        }
      }
    }
    .rightBox {
      min-width: 165px;
      .el-button {
        background: rgba(40, 255, 187, 0.08);
        border: 1px solid rgba(38, 211, 157, 0.8);
        border-radius: 2px;
      }
    }
  }
  .BodyClass {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .bodyBox {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-content: flex-start;
      padding-top: 25px;
      height: calc(100vh - 280px);
      overflow-y: auto;
      .cardClass {
        margin: 10px 9px 13px 10px;
        width: 340px;
        box-sizing: border-box;
      }
    }
    .footBox {
      text-align: center;
    }
  }
}
</style>
