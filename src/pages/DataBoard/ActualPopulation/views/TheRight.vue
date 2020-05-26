<template>
  <div class="right_wrap">
    <AsideItemHead :options="{ title: '人员活动热力分布', isFullScreen: true }"
                   @handleMapFullScreen="handleMapFullScreen"></AsideItemHead>
    <HotMap :projectUuid="projectUuid"
            :OrgUuid="OrgUuid"
            :toFull="toFull"></HotMap>
    <AsideItemHead :options="{ title: '布控与研判报警', isDayOrWeek: true }"
                   @switch="handleDayWeekChange"></AsideItemHead>
    <CardList :cardType="1"
              :timeRange="AlarmData"
              :projectUuid="projectUuid"></CardList>
  </div>
</template>
<script>
import AsideItemHead from "../components/AsideItemHead";
import HotMap from "../components/HotMap";
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
  components: { AsideItemHead, HotMap, CardList },
  data() {
    return {
      toFull: false,
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      AlarmData: {
        alarmDatetimeBegin: this.$common.getStartTime(),
        alarmDatetimeEnd: this.$common.getCurrentTime()
      }
    };
  },
  activated() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("实有人口", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("实有人口", "isOwn");
  },
  destroyed() {},
  beforeDestroy() {},
  deactivated() {},
  methods: {
    handleDayWeekChange(val) {
      if (!this.ShowAuthDisabled) return;
      // eslint-disable-next-line eqeqeq
      if (val == 1) {
        this.AlarmData = {
          alarmDatetimeBegin: this.$common.getStartTime(),
          alarmDatetimeEnd: this.$common.getCurrentTime()
        };
        // eslint-disable-next-line eqeqeq
      } else if (val == 2) {
        let now = new Date();
        let yy = now.getFullYear();
        let mm = now.getMonth() + 1;
        let dd = now.getDate();
        let wd = now.getDay();
        let wsd = dd - wd + 1;
        this.AlarmData = {
          alarmDatetimeBegin: `${yy}-${mm < 10 ? "0" : ""}${mm}-${
            wsd < 10 ? "0" : ""
          }${wsd} 00:00:00`,
          alarmDatetimeEnd: this.$common.getCurrentTime()
        };
      }
    },
    handleMapFullScreen() {
      this.toFull = !this.toFull;
    }
  },
  watch: {}
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
}
</style>
