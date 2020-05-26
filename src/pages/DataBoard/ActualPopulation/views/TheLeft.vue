<template>
  <div class="left_wrap">
    <AsideItemHead :options="{ title: '人员统计' }"></AsideItemHead>
    <div class="data_board">
      <div class="board_item">
        <img src="@/assets/images/downTown/total.png"
             alt />
        <div class="data_block">
          <b class="first"
             style="color:#00D8A0">{{ peoTotal || "0" }}</b>
          <span>人员总数</span>
        </div>
        <div class="data_block">
          <b style="color:#00D8A0">{{ peoMale || "0" }}</b>
          <span>男</span>
        </div>
        <div class="data_block">
          <b style="color:#00D8A0">{{ peoFemale || "0" }}</b>
          <span>女</span>
        </div>
      </div>
      <div class="board_item">
        <img src="@/assets/images/ActualPopulation/totalPeopele.png"
             alt />
        <div class="data_block">
          <b class="first"
             style="color:#32C5FF">{{ totalPower }}</b>
          <span>实有力量</span>
        </div>
        <div class="data_block">
          <b style="color:#32C5FF">{{ totalPower }}</b>
          <span>在线</span>
        </div>
        <div class="data_block">
          <b style="color:#32C5FF">0</b>
          <span>离线</span>
        </div>
      </div>
      <div class="board_item">
        <img src="@/assets/images/downTown/important.png"
             alt />
        <div class="data_block">
          <b class="first"
             style="color:#FF4545">{{
            focus.focusCount || "00"
          }}</b>
          <span>重点关注人员</span>
        </div>
        <div class="data_block">
          <b style="color:#FF4545">{{ focus.careCount || "0" }}</b>
          <span>关怀人员</span>
        </div>
        <div class="data_block">
          <b style="color:#FF4545">{{ focus.otherCount || "0" }}</b>
          <span>其他</span>
        </div>
      </div>
    </div>
    <BlockPie :pieData="peoType"></BlockPie>
    <AsideItemHead :options="{
        title: '重点人员活跃度排行榜',
        isSort: true,
        isDayOrWeek: true
      }"
                   @sort="handleActiveSort"
                   @switch="handleUpdateDayOrWeek"></AsideItemHead>
    <ActiveBar :barData="barData"
               :isChange="isChange"></ActiveBar>
  </div>
</template>
<script>
import * as Api from "../../utils/town";
// import icons from "@/common/icon.js";
// import RestApi from "@/utils/RestApi.js";
import AsideItemHead from "../components/AsideItemHead";
import TopTable from "../components/TopTable";
import BlockPie from "../components/BlockPie";
import ActiveBar from "../components/ActiveBar";
export default {
  name: "TheLeft",
  props: {
    projectUuid: {
      type: String,
      default: ""
    },
    OrgUuid: {
      type: String,
      default: ""
    }
  },
  components: {
    AsideItemHead,
    TopTable,
    BlockPie,
    ActiveBar
  },
  data() {
    return {
      focus: {},
      totalPower: "0",
      peoTotal: "0",
      peoMale: "0",
      peoFemale: "0",
      peoType: {},
      // 重点人员活跃度
      focusActive: {
        startTime: this.$common.getStartTime(),
        endTime: this.$common.getDayEndTime(),
        sort: "asc"
      },
      barData: [],
      isChange: 0,
      proId: "",
      orgId: "",
      OwnAuthDisabled: true,
      ShowAuthDisabled: true
    };
  },
  activated() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("实有人口", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("实有人口", "isOwn");
    this.handleInitData();
  },
  destroyed() {},
  beforeDestroy() {},
  deactivated() {},
  methods: {
    handleInitData() {
      if (!this.ShowAuthDisabled) return;
      this.handleGetFocus();
      this.handleGetActPower();
      this.handleGetPopTotal();
      this.handleGetPopType();
      this.handleGetFocusActive();
    },
    handleGetPopTotal() {
      Api.getPopulationTotal({
        projectUuid: this.proId,
        areaOrgUuid: this.orgId
      })
        .then(res => {
          let data = res.data.data;
          let total = 0;
          let totalMale = 0;
          let totalFeMale = 0;
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const e = data[key];
              total += Number(e);
              if (key.indexOf("female") !== -1) {
                totalFeMale += Number(e);
              } else {
                totalMale += Number(e);
              }
            }
          }
          this.peoTotal = total;
          this.peoFemale = totalFeMale;
          this.peoMale = totalMale;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGetPopType() {
      Api.getRealPopTypes({
        projectUuid: this.proId,
        areaOrgUuid: this.orgId
      })
        .then(res => {
          let data = res.data.data;
          this.peoType = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGetFocus() {
      Api.getFocusPeople({
        projectUuid: this.proId,
        areaOrgUuid: this.orgId
      })
        .then(res => {
          let data = res.data.data;
          this.focus = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGetActPower() {
      Api.getActPower({
        projectUuid: this.proId,
        areaOrgUuid: this.orgId
      })
        .then(res => {
          this.totalPower = res.data.data.total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGetFocusActive() {
      Api.getFocusActive({
        ...this.focusActive,
        projectUuid: this.proId,
        areaOrgUuid: this.orgId
      })
        .then(res => {
          let data = res.data.data;
          this.barData = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleUpdateDayOrWeek(val) {
      // eslint-disable-next-line eqeqeq
      if (val == 1) {
        this.focusActive.startTime = this.$common.getStartTime();
        this.focusActive.endTime = this.$common.getDayEndTime();
        // eslint-disable-next-line eqeqeq
      } else if (val == 2) {
        let now = new Date();
        let yy = now.getFullYear();
        let mm = now.getMonth() + 1;
        let dd = now.getDate();
        let wd = now.getDay();
        let wsd = dd - wd + 1;
        this.focusActive.startTime = `${yy}-${mm < 10 ? "0" : ""}${mm}-${
          wsd < 10 ? "0" : ""
        }${wsd} 00:00:00`;
        this.focusActive.endTime = this.$common.getDayEndTime();
      }
      this.isChange += 1;
      this.handleGetFocusActive();
    },
    handleActiveSort(val) {
      // eslint-disable-next-line eqeqeq
      if (val == 1) {
        this.focusActive.sort = "asc";
        // eslint-disable-next-line eqeqeq
      } else if (val == 2) {
        this.focusActive.sort = "desc";
      }
      this.isChange += 1;
      this.handleGetFocusActive();
    }
  },
  watch: {
    projectUuid: {
      handler(val, oldVal) {
        if (val) {
          console.log(val, "----监听projectUuid----", oldVal);
          this.isChange += 1;
          this.proId = val;
          this.orgId = "";
          this.handleInitData();
        }
      }
    },
    OrgUuid: {
      handler(val, oldVal) {
        if (val) {
          console.log(val, "----监听OrgUuid----", oldVal);
          this.proId = "";
          this.orgId = val;
          this.isChange += 1;
          this.handleInitData();
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.left_wrap {
  height: 100%;
  width: 450px;
  background: rgba(0, 216, 160, 0.1);
  border: 1px solid rgba(0, 87, 58, 0.3);
  box-sizing: border-box;
  padding: 25px;
  padding-top: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  .data_board {
    width: 100%;
    .board_item {
      width: 100%;
      padding: 13px 20px;
      background: rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(23, 237, 172, 0.15);
      border-radius: 2px;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
      box-sizing: border-box;
      margin-bottom: 15px;
      img {
        display: block;
        width: 26px;
        margin-right: 21px;
      }
      .data_block {
        width: 100px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        text-align: left;
        &:not(:last-of-type) {
          margin-right: 10px;
        }
        b {
          font-family: "digital";
          font-size: 32px;
          margin-bottom: 5px;
          font-weight: normal;
          text-align: left;
        }
        span {
          font-size: 10px;
          color: #dddddd;
          text-align: left;
        }
      }
    }
  }
}
</style>
