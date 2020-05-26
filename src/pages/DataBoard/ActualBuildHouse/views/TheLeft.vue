<template>
  <div class="left_wrap">
    <AsideItemHead :options="{ title: '房屋统计' }"></AsideItemHead>
    <div class="data_board">
      <div class="board_item">
        <img src="@/assets/images/downTown/plot.png"
             alt />
        <div class="data_block">
          <b style="color:#43FBEF">{{ houseData.area || "0" }}</b>
          <span>小区数</span>
        </div>
      </div>
      <div class="board_item">
        <img src="@/assets/images/downTown/building.png"
             alt />
        <div class="data_block">
          <b style="color:#43FBEF">{{ houseData.building || "0" }}</b>
          <span>楼栋数</span>
        </div>
      </div>
      <div class="board_item">
        <img src="@/assets/images/downTown/house.png"
             alt />
        <div class="data_block">
          <b style="color:#43FBEF">{{ houseData.house || "0" }}</b>
          <span>房屋数</span>
        </div>
      </div>
      <div class="board_item">
        <img src="@/assets/images/downTown/area.png"
             alt />
        <div class="data_block">
          <b style="color:#43FBEF">{{ houseData.acreage || "0" }}</b>
          <span>总面积(㎡)</span>
        </div>
      </div>
    </div>
    <BlockPie :pieData="houseChart"></BlockPie>
    <AsideItemHead :options="{ title: '人均居住面积TOP10', isSort: true }"
                   @sort="handleOrderChange"></AsideItemHead>
    <TopTable :tableData="areaRank"
              :columns="columns"></TopTable>
  </div>
</template>
<script>
import * as Api from "../../utils/town";
import AsideItemHead from "../components/AsideItemHead";
import TopTable from "../components/TopTable";
import BlockPie from "../components/BlockPie";
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
    BlockPie
  },
  data() {
    return {
      order: 1,
      houseData: {},
      houseChart: {},
      areaRank: [],
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      columns: [
        { prop: "address", label: "地址" },
        { prop: "perAcreage", label: "人均居住面积" },
        { prop: "residents", label: "居住人数" }
      ],
      proId: "",
      orgId: ""
    };
  },
  activated() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("实有房屋", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("实有房屋", "isOwn");
    this.initData();
  },
  destroyed() {},
  beforeDestroy() {},
  deactivated() {},
  methods: {
    initData() {
      if (!this.ShowAuthDisabled) return;
      this.handleGetHouseCount();
      this.handleGetLiveRank();
      this.handleGetHouseChart();
    },
    handleGetHouseCount() {
      Api.getActHouseCount({ projectUuid: this.proId, areaOrgUuid: this.orgId })
        .then(res => {
          this.houseData = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGetHouseChart() {
      Api.getActHouseChart({ projectUuid: this.proId, areaOrgUuid: this.orgId })
        .then(res => {
          this.houseChart = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGetLiveRank() {
      Api.getActHouseRank({
        order: this.order,
        projectUuid: this.proId,
        areaOrgUuid: this.orgId
      })
        .then(res => {
          this.areaRank = [...res.data.data.acreageRank];
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleOrderChange(val) {
      this.order = val;
      this.handleGetLiveRank();
    }
  },
  watch: {
    projectUuid: {
      handler(val) {
        if (val) {
          this.proId = val;
          this.orgId = "";
          this.initData();
        }
      }
    },
    OrgUuid: {
      handler(val) {
        if (val) {
          this.proId = "";
          this.orgId = val;
          this.initData();
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
  .data_board {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    .board_item {
      width: 190px;
      height: 100px;
      background-image: url("../../../../assets/images/downTown/house-bg.png");
      background-repeat: no-repeat;
      background-position: 0 0;
      background-size: cover;
      padding: 20px;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
      box-sizing: border-box;
      margin-bottom: 19px;
      &:not(:nth-of-type(2n)) {
        margin-right: 13px;
      }
      img {
        display: block;
        width: 40px;
        margin-right: 15px;
      }
      .data_block {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        text-align: left;
        b {
          margin: 0;
          font-family: "digital";
          font-size: 36px;
          margin-bottom: 5px;
          font-weight: normal;
          text-align: left;
          letter-spacing: 1px;
        }
        span {
          font-size: 12px;
          color: #dddddd;
          text-align: left;
          letter-spacing: 2px;
        }
      }
    }
  }
}
</style>
