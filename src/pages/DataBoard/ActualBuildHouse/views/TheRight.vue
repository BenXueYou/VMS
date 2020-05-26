<template>
  <div class="right_wrap">
    <AsideItemHead :options="{ title: '通行排名TOP10', isSort: true, isDayOrWeek: true }"
                   @sort="handlePassSort"
                   @switch="handlePassSwitch"></AsideItemHead>
    <TopTable :tableData="passRank"
              :columns="columns"
              :isPass="true"></TopTable>
    <AsideItemHead :options="{ title: '房屋预警', isDayOrWeek: true }"
                   @switch="handleDayWeekChange"></AsideItemHead>
    <CardList :cardType="2"></CardList>
  </div>
</template>
<script>
import * as Api from "../../utils/town";
// import icons from "@/common/icon.js";
// import RestApi from "@/utils/RestApi.js";
import AsideItemHead from "../components/AsideItemHead";
import TopTable from "../components/TopTable";
import CardList from "../components/CardList";
export default {
  name: "TheRight",
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
  components: { AsideItemHead, TopTable, CardList },
  data() {
    return {
      passRank: [],
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      columns: [
        { prop: "address", label: "地址" },
        { prop: "liveCount", label: "居住人数(人)" },
        { prop: "passCount", label: "通行次数(次)" }
      ],
      order: "desc",
      startTime: this.$common.getStartTime(),
      endTime: this.$common.getDayEndTime(),
      houseAlarm: {
        startTime: "",
        endTime: ""
      },
      proId: "",
      orgId: ""
    };
  },
  activated() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("实有房屋", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("实有房屋", "isOwn");
    this.handleGetPassTop();
  },
  destroyed() {},
  beforeDestroy() {},
  deactivated() {},
  methods: {
    handleGetAlarm() {},
    handleDayWeekChange(val) {
      // eslint-disable-next-line eqeqeq
      if (val == 1) {
        this.houseAlarm.startTime = this.$common.getStartTime();
        this.houseAlarm.endTime = this.$common.getDayEndTime();
        // eslint-disable-next-line eqeqeq
      } else if (val == 2) {
        let now = new Date();
        let yy = now.getFullYear();
        let mm = now.getMonth() + 1;
        let dd = now.getDate();
        let wd = now.getDay();
        let wsd = dd - wd + 1;
        this.houseAlarm.startTime = `${yy}-${mm}-${wsd} 00:00:00`;
        this.houseAlarm.endTime = this.$common.getDayEndTime();
      }
      this.handleGetAlarm();
    },
    handleGetPassTop() {
      if (!this.ShowAuthDisabled) return;
      let params = {
        startTime: this.startTime,
        endTime: this.endTime,
        sort: this.order,
        projectUuid: this.proId,
        areaOrgUuid: this.orgId
      };
      Api.getHousePassTop(params)
        .then(res => {
          this.passRank = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handlePassSort(val) {
      // eslint-disable-next-line eqeqeq
      if (val == 1) {
        this.order = "desc";
        // eslint-disable-next-line eqeqeq
      } else if (val == 0) {
        this.order = "asc";
      }
      this.handleGetPassTop();
    },
    handlePassSwitch(val) {
      // eslint-disable-next-line eqeqeq
      if (val == 1) {
        this.startTime = this.$common.getStartTime();
        this.endTime = this.$common.getDayEndTime();
        // eslint-disable-next-line eqeqeq
      } else if (val == 2) {
        let now = new Date();
        let yy = now.getFullYear();
        let mm = now.getMonth() + 1;
        let dd = now.getDate();
        let wd = now.getDay();
        let wsd = dd - wd + 1;
        this.startTime = `${yy}-${mm < 10 ? "0" : ""}${mm}-${
          wsd < 10 ? "0" : ""
        }${wsd} 00:00:00`;
        this.endTime = this.$common.getDayEndTime();
      }
      this.handleGetPassTop();
    }
  },
  watch: {
    projectUuid: {
      handler(val) {
        if (val) {
          this.proId = val;
          this.orgId = "";
          this.handleGetPassTop();
        }
      }
    },
    OrgUuid: {
      handler(val) {
        if (val) {
          this.proId = "";
          this.orgId = val;
          this.handleGetPassTop();
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.right_wrap {
  height: 100%;
  width: 450px;
  background: rgba(0, 216, 160, 0.1);
  border: 1px solid rgba(0, 87, 58, 0.3);
  padding: 0 25px;
  box-sizing: border-box;
  overflow: auto;
}
</style>
