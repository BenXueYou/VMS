<template>
	<div class="VistorOpenRecord" v-loading="showloading">
		<div class="header">
			<div>访客开门记录</div>
		</div>
		<div class="main">
			<div class="main-header">
				<div class="leftgroup">
					<el-radio-group v-model="selectDate" @change="selectDateChangeAct">
						<el-radio-button label="lastday">昨日</el-radio-button>
						<el-radio-button label="today">今日</el-radio-button>
						<el-radio-button label="lastMonth">上月</el-radio-button>
						<el-radio-button label="thisMonth">本月</el-radio-button>
						<el-radio-button label="otherDay" class="otherDay">其他时间段</el-radio-button>
					</el-radio-group>
					<el-date-picker
						v-model="validateTimeStart"
						type="datetime"
						v-if="selectDate==='otherDay'"
						size="small"
						class="time-interal-date"
						style="margin-left: 13px;"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
					<span class="time-line" v-if="selectDate==='otherDay'">-</span>
					<el-date-picker
						v-model="validateTimeEnd"
						type="datetime"
						v-if="selectDate==='otherDay'"
						size="small"
						class="time-interal-date"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
					<el-button
						:disabled="!$common.getAuthIsOwn('访客开门记录', 'isShow')"
						type="primary"
						size="mini"
					>数据统计</el-button>
				</div>
				<!-- <div> -->
				<div class="rightgroup">
					<span class="title">姓名：</span>
					<el-input class="input staffNameInput" v-model="staffName"></el-input>
					<el-button
						:disabled="!$common.getAuthIsOwn('访客开门记录', 'isShow')"
						type="primary"
						@click="queryBtnAct"
						icon="el-icon-search"
						size="small"
					>检索</el-button>
					<el-button
						:disabled="!$common.getAuthIsOwn('访客开门记录', 'isShow')"
						type="primary"
						v-popover:popover1
						size="small"
					>其他条件检索</el-button>
					<el-popover
						ref="popover1"
						placement="bottom-end"
						:visible-arrow="false"
						width="300"
						trigger="click"
					>
						<search-open-record @query="queryAct"></search-open-record>
					</el-popover>
				</div>
				<!-- </div> -->
			</div>
			<el-table
				ref="VistorOpenRecordTable"
				:data="tableData"
				tooltip-effect="dark"
				class="tableBoxClass"
				@sort-change="sortChange"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="index" :index="tableIndex" label="序号" width="55"></el-table-column>
				<el-table-column prop="staffName" label="姓名" width="100"></el-table-column>
				<el-table-column prop="reservationType" label="访客类型">
					<template
						slot-scope="scope"
					>{{$common.getEnumItemName("visitor_type", scope.row.reservationType)}}</template>
				</el-table-column>
				<el-table-column prop="recognitionMode" label="验证类型">
					<template slot-scope="scope">{{$common.getEnumItemName("pass", scope.row.recognitionMode)}}</template>
				</el-table-column>
				<el-table-column prop="channelNickName" label="门"></el-table-column>
				<el-table-column prop="direction" label="方向" sortable="custom">
					<template slot-scope="scope">{{$common.getEnumItemName("chn_d", scope.row.direction)}}</template>
				</el-table-column>
				<el-table-column prop="eventType" label="事件" show-overflow-tooltip>
					<template slot-scope="scope">{{getEventType(scope.row)}}</template>
				</el-table-column>
				<el-table-column prop="verifyDatetime" label="验证时间"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<div class="tableCertificateBtnClass">
							<span
								:class="$common.getAuthIsOwn('访客开门记录', 'isShow')?'cursorClass':'disabled'"
								@click="detailBtnAct(scope.row)"
								class="editFontClass cursorClass"
							>详情</span>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<vistor-open-detail :visible.sync="isShow" :openDoorDetail="openDoorDetail" @close="closeDetail"></vistor-open-detail>
			<!----------------------------------表格分页器---------------------------------->
			<div class="footer">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					layout="total,prev, pager, next,jumper"
					:page-size="pageSize"
					:total="total"
					background
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import SearchOpenRecord from "../../components/vistorRecord/SearchOpenRecord";
import VistorOpenDetail from "../../components/vistorRecord/VistorOpenDetail";
import * as api from "../../utils/ajax";
export default {
  components: { SearchOpenRecord, VistorOpenDetail },
  props: {},
  data() {
    return {
      tableData: window.config.tableData,
      selectDate: "",
      validateTimeStart: null,
      validateTimeEnd: null,
      staffName: "",
      currentPage: 1,
      pageSize: 15,
      total: 0,
      isShow: false,
      openDoorDetail: {},
      showloading: false,
      otherSearchData: {}
    };
  },
  created() {},
  activated() {
    console.log(this.$route.params.data, "---------openDoor-------");
    var params = this.$route.params.data;
    var data = {};
    if (params && params.visitorUuid) {
      data.visitorUuid = params.visitorUuid;
    }
    this.currentPage = 1;
    Object.assign(this.otherSearchData, data);
    this.initData(data);
  },
  mounted() {
    let h =
			window.innerHeight ||
			document.documentElement.clientHeight ||
			document.body.clientHeight;
    this.$refs.VistorOpenRecordTable.$el.style.height = h - 295 + "px";
    // 这里 -1 是为了去掉表头高度
    this.pageSize = parseInt((h - 295) / 50) - 1;
    console.log(this.pageSize);
    // 当窗口发生变化时
    let that = this;
    window.addEventListener("resize", function() {
      let h =
				window.innerHeight ||
				document.documentElement.clientHeight ||
				document.body.clientHeight;
      that.$refs.VistorOpenRecordTable.$el.style.height = h - 295 + "px";
      var pageSize = parseInt((h - 295) / 50) - 1;
      if (pageSize !== that.pageSize) {
        that.pageSize = pageSize;
      }
      console.log(that.pageSize);
    });
  },
  methods: {
    initData() {
      var params = {
        page: this.currentPage,
        limit: this.pageSize
      };
      Object.assign(params, this.otherSearchData);
      this.showloading = !this.showloading;
      api
        .getVistorOpenRecordUrl(params)
        .then(res => {
          this.showloading = !this.showloading;
          if (res.data.success && res.data.data) {
            this.tableData = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            this.$message({ type: "error", message: "没有找到相关的开门记录" });
          }
        })
        .catch(err => {
          this.showloading = false;
          console.log(err);
        });
    },
    selectDateChangeAct(value) {
      console.log(value);
      this.transSelectDate(this.selectDate);
      Object.assign(this.otherSearchData, {
        beginTime: this.validateTimeStart,
        endTime: this.validateTimeEnd
      });
      this.initData();
    },
    transSelectDate(value) {
      let day = new Date();
      switch (value) {
        case "lastday":
          day.setDate(day.getDate() - 1);
          let str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          this.validateTimeStart = str + " " + "00:00:00";
          this.validateTimeEnd = str + " " + "23:59:59";
          break;
        case "today":
          str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          this.validateTimeStart = str + " " + "00:00:00";
          this.validateTimeEnd = str + " " + "23:59:59";
          break;
        case "lastMonth":
          let firstdate = new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            1
          );
          firstdate = this.$common.timestampToFormatter(
            firstdate,
            "yyyy-mm-dd"
          );
          let enddate = new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            new Date(day.getFullYear(), day.getMonth(), 0).getDate()
          );
          enddate = this.$common.timestampToFormatter(enddate, "yyyy-mm-dd");
          this.validateTimeStart = firstdate + " " + "00:00:00";
          this.validateTimeEnd = enddate + " " + "23:59:59";
          break;
        case "thisMonth":
          day.setDate(1);
          firstdate = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          enddate = this.$common.timestampToFormatter(
            new Date().getTime(),
            "yyyy-mm-dd"
          );
          this.validateTimeStart = firstdate + " " + "00:00:00";
          this.validateTimeEnd = enddate + " " + "23:59:59";
          break;
      }
    },
    getEventType(row) {
      let eventStr = "";
      if (row.openDoorResult === 0) {
        eventStr = "开门成功";
      } else if (row.verifyResult === 0) {
        eventStr = "验证成功，开门失败，";
      } else {
        eventStr = "验证失败，";
      }
      if (row.openDoorResult === 1 || row.verifyResult === 1) {
        eventStr =
					eventStr + this.$common.getEnumItemName("verify_t", row.eventType);
      }
      return eventStr;
    },
    queryBtnAct() {
      var data = {};
      if (this.selectDate === "otherDay") {
        data.beginTime = this.validateTimeStart;
        data.endTime = this.validateTimeEnd;
      } else {
        this.selectDate = "";
        data.beginTime = null;
        data.endTime = null;
      }
      if (this.staffName) {
        data.visitorName = this.staffName;
      }
      this.currentPage = 1;
      Object.assign(this.otherSearchData, data);
      this.initData();
    },
    closeDetail() {
      this.isShow = false;
    },
    sortChange(column) {
      console.log(column);
      column.order = column.order === "ascending" ? "asc" : column.order;
      column.order = column.order === "descending" ? "desc" : column.order;
      var data = {
        order: column.prop,
        sort: column.order
      };
      Object.assign(this.otherSearchData, data);
      this.initData(data);
    },
    // 详情
    detailBtnAct(rowData) {
      if (!this.$common.getAuthIsOwn("访客开门记录", "isOwn")) return;
      this.httpOpenDoorDetail(rowData);
    },
    // 开门记录详情
    httpOpenDoorDetail(rowData) {
      this.showloading = !this.showloading;
      api
        .getVistorOpenRecordDetailUrl({ recordUuid: rowData.recordUuid })
        .then(res => {
          this.showloading = !this.showloading;
          if (res.data.success && res.data.data) {
            this.openDoorDetail = res.data.data;
            this.isShow = true;
          } else {
            this.$message({ type: "error", message: "没有找到相关详情" });
          }
        })
        .catch(err => {
          this.showloading = !this.showloading;
          console.error(err);
        });
    },
    // 检索按钮事件
    queryAct(data) {
      this.currentPage = 1;
      data.visitorUuid = null;
      Object.assign(this.otherSearchData, data);
      this.initData();
    },
    handleCurrentChange(val) {
      console.log("当前页面变化的回调函数");
      this.checkedAll = false;
      this.currentPage = val;
      this.initData();
    },
    handleSizeChange() {
      console.log("每一页数量变化时的回调函数");
    },
    // table表格的选择
    handleSelectionChange(val) {
      console.log(val);
    },
    tableIndex(val) {
      val += 1;
      return val < 10 ? "0" + val : val;
    }
  },
  watch: {
    staffName(val) {
      this.otherSearchData.visitorName = val;
    }
  },
  destroyed() {}
};
</script>
<style>
.VistorOpenRecord .editFontClass {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #26d39d;
	margin: 0 10px;
}
.VistorOpenRecord .rightgroup {
	display: inline-block;
}
.VistorOpenRecord .rightgroup .title {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
}
.VistorOpenRecord
	.el-radio-button__orig-radio:checked
	+ .el-radio-button__inner {
	color: #ffffff;
	background-color: rgba(40, 255, 187, 0.08);
	border: 0;
	border-bottom: 1px solid rgba(38, 211, 157, 0.5);
	border-right: 1px solid transparent;
	-webkit-box-shadow: none;
	box-shadow: none;
}
.VistorOpenRecord .el-radio-button__inner {
	background: rgba(255, 255, 255, 0.05);
	border: 0;
	border-bottom: 1px solid transparent;
	border-right: 1px solid rgba(255, 255, 255, 0.05);
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
	text-align: center;
	min-width: 78px;
	/* display: block; */
	padding: 8px 34%;
}
.VistorOpenRecord .otherDay .el-radio-button__inner {
	background: rgba(255, 255, 255, 0.05);
	border: 0;
	border-bottom: 1px solid transparent;
	border-right: 1px solid rgba(255, 255, 255, 0.05);
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
	text-align: center;
	padding: 8px 32px;
}
.VistorOpenRecord .el-radio-button:first-child .el-radio-button__inner {
	border-left: 0;
	border-radius: 4px 0 0 4px;
	-webkit-box-shadow: none !important;
	box-shadow: none !important;
}
.VistorOpenRecord .el-input--prefix .el-input__inner {
	padding-left: 12px;
}
.VistorOpenRecord .el-input--suffix .el-input__inner {
	padding-right: 0px;
}
.VistorOpenRecord .el-date-editor.el-input,
.el-date-editor.el-input__inner {
	width: 180px;
}
.VistorOpenRecord .el-icon-time:before {
	content: "";
	position: absolute;
	top: 50%;
	left: 120%;
}
.VistorOpenRecord .el-button--primary,
.VistorOpenRecord .el-button--primary:hover,
.VistorOpenRecord .el-button--primary:active,
.VistorOpenRecord .el-button--primary:focus {
	font-family: "PingFangSC-Regular";
	font-size: 16px;
	height: 34px;
	background: rgba(40, 255, 187, 0.08);
	border: 0 solid rgba(38, 211, 157, 0.8);
	border-radius: 2px;
	border-radius: 2px;
	margin-left: 20px;
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
}
.VistorOpenRecord .staffNameInput {
	width: 160px;
	display: inline-block;
	margin-right: 15px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/style/variables.scss";
.VistorOpenRecord {
	height: 100%;
	color: #dddddd;
	.header {
		height: 50px;
		padding: 15px 40px;
		background: #212325;
		box-sizing: border-box;
		div {
			font-family: "PingFangSC-Regular";
			font-size: 14px;
			color: #ffffff;
			letter-spacing: 0;
			box-sizing: border-box;
			border-left: 3px solid #26d39d;
			padding-left: 9px;
		}
	}
	.main {
		background: #212325;
		margin-top: 16px;
		padding: 18px 2.4%;
		.time-line {
			border-width: 1px 0px 0px 0px;
			width: 8px;
			color: rgba(255, 255, 255, 0.15);
		}
		.main-header {
			margin-bottom: 18px;
			display: flex;
			justify-content: space-between;
		}
		.footer {
			text-align: right;
		}
	}
}
</style>
