<template>
  <div class="DateRadioBtn">
    <el-radio-group v-model="selectDateStr"
                    @change="selectDateAct">
      <el-radio-button label="today">今天</el-radio-button>
      <el-radio-button label="lastday">昨天</el-radio-button>
      <el-radio-button label="thisWeek">本周</el-radio-button>
      <el-radio-button label="thisMonth">本月</el-radio-button>
    </el-radio-group>
  </div>
</template>
<script>
export default {
  name: "DateRadioBtn",
  components: {},
  props: {
    selectDate: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      selectDateStr: "",
      startTime: null,
      endTime: null
    };
  },
  watch: {
    selectDate(val) {
      this.selectDateStr = val;
    }
  },
  mounted() {},
  methods: {
    selectDateAct(dateStr) {
      let day = new Date();
      switch (dateStr) {
        case "lastday":
          day.setDate(day.getDate() - 1);
          let str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          this.startTime = str + " " + "00:00:00";
          this.endTime = str + " " + "23:59:59";
          break;
        case "today":
          str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          this.startTime = str + " " + "00:00:00";
          this.endTime = str + " " + "23:59:59";
          break;
        case "thisWeek":
          let weekday = day.getDay();
          let today = day.getDate();
          let month = day.getMonth();
          let firstDay = null;
          // month默认从0开始，则判断不是月初，则月份+1
          if (today - weekday) {
            month += 1;
            firstDay = today - weekday;
          } else {
            // 月初 则向前退weekday - today天
            // 判断 月大 月小
            let lastMonthDays =
              [1, 3, 5, 7, 8, 10, 12].indexOf(month + 1) > -1 ? 31 : 30;
            firstDay = lastMonthDays - weekday + today;
          }
          let firstdate = new Date(day.getFullYear(), month - 1, firstDay);
          firstdate = this.$common.timestampToFormatter(
            firstdate,
            "yyyy-mm-dd"
          );
          let enddate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          );
          enddate = this.$common.timestampToFormatter(enddate, "yyyy-mm-dd");
          this.startTime = firstdate + " " + "00:00:00";
          this.endTime = enddate + " " + "23:59:59";
          break;
        case "thisMonth":
          day.setDate(1);
          firstdate = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          enddate = this.$common.timestampToFormatter(
            new Date().getTime(),
            "yyyy-mm-dd"
          );
          this.startTime = firstdate + " " + "00:00:00";
          this.endTime = enddate + " " + "23:59:59";
          break;
      }

      this.$emit("transferDateTimeAct", this.startTime, this.endTime, dateStr);
    }
  }
};
</script>
<style lang="scss">
.DateRadioBtn .el-checkbox-button.is-checked .el-checkbox-button__inner,
.DateRadioBtn .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background: rgba(40, 255, 187, 0.1);
  border-radius: 2px;
  border-radius: 2px;
  border: 1px solid #26d39d;
  -webkit-box-shadow: 0px 0 0 0 #26d39d;
  box-shadow: 0px 0 0 0 #26d39d;
}
// .DateRadioBtn .el-checkbox-button:first-child .el-checkbox-button__inner,
// .DateRadioBtn .el-radio-button:first-child .el-radio-button__inner {
// 	border: 1px solid transparent;
// }
.DateRadioBtn .el-checkbox-button__inner,
.DateRadioBtn .el-radio-button__inner {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  margin-right: 9px;
  border: 1px solid transparent;
  padding: 8px 12px;
  font-size: 13px;
}
</style>
