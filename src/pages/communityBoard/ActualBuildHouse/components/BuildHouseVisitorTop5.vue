<template>
	<div class="BuildHouseVisitorTop5">
		<div class="topClass">
			<span>访客排名TOP5</span>
			<el-radio-group v-model="type" @change="RadioBtnChangeAct" class="radioSel">
				<el-radio-button label="日"></el-radio-button>
				<el-radio-button label="周"></el-radio-button>
			</el-radio-group>
		</div>
		<el-table :data="data" :cell-style='cellStyle'>
			<el-table-column prop="rankOrder" label="排名" width="60"></el-table-column>
			<el-table-column prop="address" show-overflow-tooltip label="地址"></el-table-column>
			<el-table-column prop="visitCount" label="被访次数(次)" width="115"></el-table-column>
		</el-table>
	</div>
</template>
<script>
import * as api from "../ajax";
export default {
  name: "BuildHouseVisitorTop5",
  props: {
    infrastructureId: {
      type: String,
      default: ""
    },
    activeProject: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      type: "日",
      data: [],
      startTime: null,
      endTime: null
    };
  },
  mounted() {
    // this.RadioBtnChangeAct("day3");
    this.startTime = this.$common.getStartTime();
    this.endTime = this.$common.getDayEndTime();
    // this.getInitData();
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
      if (val === "日") {
        this.startTime = this.$common.getStartTime();
        this.endTime = this.$common.getDayEndTime();
        // this.getInitData();
      } else {
        // let weekday3 = new Date().getday3();
        // this.startTime = this.$common.getSpaceDate(-weekday3);
        this.transSelectDate();
      }
      this.getInitData();
    },
    getInitData() {
      let data1 = {
        InfrastructureUuid: this.infrastructureId,
        startTime: this.startTime,
        endTime: this.endTime,
        type: "visitor",
        top: 5
      };
      let data2 = {
        projectUuid: this.projectId
      };
      let data = {
        data1: data1,
        data2: data2
      };
      api
        .getInfrastructureAccessTopApi(data)
        .then(res => {
          if (res.data.success) {
            this.data = res.data.data;
          } else {
          }
        })
        .catch(() => {});
    },
    transSelectDate() {
      // let day3 = new Date();
      var now = new Date(); // 当前日期
      var nowday3OfWeek = now.getDay(); // 今天本周的第几天
      var nowday3 = now.getDate(); // 当前日
      var nowMonth = now.getMonth(); // 当前月
      // var nowYear = now.getYear(); // 当前年
      let day31 = nowday3OfWeek || 7;
      let weektime1 = this.formatDate(new Date(now.getFullYear(), nowMonth, nowday3 + 1 - day31));
      let weektime2 = this.formatDate(new Date(now.getFullYear(), nowMonth, nowday3 + 7 - day31));
      this.startTime = weektime1 + " " + "00:00:00";
      this.endTime = weektime2 + " " + "23:59:59";
      console.log("weektime===", weektime2);
    },
    formatDate: function(date) {
      var myyear = date.getFullYear();
      var mymonth = date.getMonth() + 1;
      var myweekday3 = date.getDate();
      if (mymonth < 10) {
        mymonth = "0" + mymonth;
      }
      if (myweekday3 < 10) {
        myweekday3 = "0" + myweekday3;
      }
      return (myyear + "-" + mymonth + "-" + myweekday3);
    },
  },
  watch: {
    infrastructureId(val) {
      this.getInitData();
    },
    activeProject(val) {
      if (val) {
        this.projectId = val;
        console.log("val===", val);
        setTimeout(() => {
          this.getInitData();
        }, 1000);
      }
    }
  }
};
</script>
<style >
.el-table th.is-leaf,
.el-table td {
	border-color: #2d2f31;
	padding: 8px 0px;
}
 .BuildHouseVisitorTop5 .el-radio-button__orig-radio:checked
  + .el-radio-button__inner {
  color: #ffffff;
  background-color: rgba(40, 255, 187, 0.08);
/*  border: 1px solid rgba(38, 211, 157, 0.5);*/
/*  border-right: 1px solid transparent;*/
  -webkit-box-shadow: none;
  box-shadow: none;
/*  opacity: 0.5;*/
  background: rgba(37,210,152,0.5);
}
.BuildHouseVisitorTop5 .el-radio-button:first-child .el-radio-button__inner:checked {
  border: 0;
  border-radius: 4px 0 0 4px;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
.BuildHouseVisitorTop5 .el-radio-button__inner {
  background: rgba(255, 255, 255, 0.05);
  border: 0;
  /*border-bottom: 1px solid transparent;*/
/*  border-right: 1px solid rgba(255, 255, 255, 0.05);*/
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ffffff;
  text-align: center;
  min-width: 46px;
  height: 32px;
 /* line-height: 32px;*/
  /* display: block; */
 /* padding: 8px 34%;*/
  margin-right: 8px;
 /* display: flex;
  flex-direction: row;
  align-items: center;*/
  box-sizing: border-box;
  overflow: hidden;
}
/*.BuildHouseVisitorTop5 .access-search:first-child {
  margin-bottom: 14px;
}*/
.BuildHouseVisitorTop5 .el-radio-button:first-child .el-radio-button__inner {
  border-left: 0;
  border-radius: 4px 0 0 4px;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
</style>
<style lang="scss" scoped>
.BuildHouseVisitorTop5 {
	width: 370px;
	height: 302px;
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
    position: relative;
    .radioSel {
      position: absolute;
      right: 12px;
      top: 0;
    }
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
.BuildHouseVisitorTop5:before {
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
