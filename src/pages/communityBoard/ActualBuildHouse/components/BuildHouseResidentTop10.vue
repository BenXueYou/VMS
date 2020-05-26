<template>
	<div class="BuildHouseResidentTop10">
		<div class="topClass">房屋居住人数TOP10</div>
		<el-table :data="residentData" :cell-style='cellStyle'>
			<el-table-column prop="rankOrder" label="排名" width="60"></el-table-column>
			<el-table-column prop="address" show-overflow-tooltip label="地址"></el-table-column>
			<el-table-column prop="residents" label="居住人数" width="115"></el-table-column>
			</el-table>
	</div>
</template>
<script>
import * as api from "../ajax";
export default {
  name: "BuildHouseResidentTop10",
  props: {
    residentData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // residentData: new Array(10).fill({
      //   address: '1号楼/3层/305室',
      //   times: '20',
      // }),
      // residentData: [],
      type: "day",
      startTime1: null,
      endTime1: null
    };
  },
  mounted() {
    // this.getInitData1();
  },
  methods: {
    cellStyle({row, column, rowIndex, columnIndex}) {
      if ((rowIndex % 2) === 1) {
        return "background:rgba(255,255,255,0.05);";
      } else {
        // return "background:rgba(255,255,255,0.05);"
      }
    },
    RadioBtnChangeAct(val) {
      if (val === "day") {
        this.startTime1 = this.$common.getstartTime1();
        this.endTime1 = this.$common.getCurrentTime();
      // this.getInitData1();
      } else {
      // let weekDay = new Date().getDay();
      // this.startTime1 = this.$common.getSpaceDate(-weekDay);
        this.transSelectDate();
      }
      this.getInitData1();
    },
    getInitData1() {
      let data = {
        InfrastructureUuid: this.infrastructureId,
        startTime1: this.startTime1,
        endTime1: this.endTime1,
        type: "resident",
        top: 10
      };
      api
        .getInfrastructureAccessTopApi(data)
        .then(res => {
          if (res.data.success) {
            this.residentData = res.data.data;
          } else {
          }
        })
        .catch(() => {});
    },
    transSelectDate() {
    // let day = new Date();
      var now = new Date(); // 当前日期
      var nowDayOfWeek = now.getDay(); // 今天本周的第几天
      var nowDay = now.getDate(); // 当前日
      var nowMonth = now.getMonth(); // 当前月
      // var nowYear = now.getYear(); // 当前年
      let day1 = nowDayOfWeek || 7;
      let weektime1 = this.formatDate(new Date(now.getFullYear(), nowMonth, nowDay + 1 - day1));
      let weektime2 = this.formatDate(new Date(now.getFullYear(), nowMonth, nowDay + 7 - day1));
      this.startTime1 = weektime1 + " " + "00:00:00";
      this.endTime1 = weektime2 + " " + "23:59:59";
      console.log("weektime===", weektime2);
    },
    formatDate: function(date) {
      var myyear = date.getFullYear();
      var mymonth = date.getMonth() + 1;
      var myweekday = date.getDate();
      if (mymonth < 10) {
        mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
        myweekday = "0" + myweekday;
      }
      return (myyear + "-" + mymonth + "-" + myweekday);
    },
  },
  watch: {
    // infrastructureId(val) {
    //   this.getInitData1();
    // },
    residentData(val) {
      console.log("val===", val);
    }
  }
};
</script>
<style lang="scss" scoped>
.BuildHouseResidentTop10 {
	width: 370px;
	height: 520px;
	opacity: 0.8;
	background: rgba(67, 251, 239, 0.07);
	border: 1px solid rgba(37, 210, 152, 0.3);
	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
	border-radius: 2px;
	position: relative;
	padding: 15px 10px;
	box-sizing: border-box;
	.topClass {
		padding-left: 8px;
		margin-bottom: 15px;
		box-sizing: border-box;
		font-family: PingFangSC-Medium;
		font-size: 18px;
		color: #25d298;
		text-align: justify;
	}
	.topClass:before {
		content: "";
		height: 16px;
		padding-left: 4px;
		margin-right: 8px;
		font-size: 12px;
		background: #25d298;
	}
}
.BuildHouseResidentTop10:before {
	content: "";
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
	background: linear-gradient(to left, #25d298, #25d298) left top no-repeat,
		linear-gradient(to bottom, #25d298, #25d298) left top no-repeat,
		linear-gradient(to left, #25d298, #25d298) right top no-repeat,
		linear-gradient(to bottom, #25d298, #25d298) right top no-repeat,
		linear-gradient(to left, #25d298, #25d298) left bottom no-repeat,
		linear-gradient(to bottom, #25d298, #25d298) left bottom no-repeat,
		linear-gradient(to left, #25d298, #25d298) right bottom no-repeat,
		linear-gradient(to left, #25d298, #25d298) right bottom no-repeat;
	background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
}
</style>
