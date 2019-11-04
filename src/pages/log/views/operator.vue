<template>
	<div class="operatorLogBox" v-loading="showloading">
		<div class="header">
			<div>操作日志</div>
		</div>
		<div class="loginLogMain">
			<div class="main-header">
				<div class="leftgroup">
					<el-button type="default" size="mini">导出</el-button>
				</div>
				<!-- <div> -->
				<div class="rightgroup">
					<span class="title">时间：</span>
					<el-date-picker
						v-model="validateTimeStart"
						type="datetime"
						size="small"
						class="time-interal-date"
						style="margin-left: 13px;"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
					<span class="time-line">-</span>
					<el-date-picker
						v-model="validateTimeEnd"
						type="datetime"
						size="small"
						class="time-interal-date"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
					<el-button type="primary" @click="queryBtnAct" icon="el-icon-search" size="small">检索</el-button>
					<el-button type="primary" v-popover:popover1 size="small">其他条件检索</el-button>
					<el-popover
						ref="popover1"
						placement="bottom-end"
						:visible-arrow="false"
						width="300"
						trigger="click"
					>
						<search-option-view @query="queryAct"></search-option-view>
					</el-popover>
				</div>
				<!-- </div> -->
			</div>
			<el-table
				ref="operatorLogBoxTable"
				:data="tableData"
				tooltip-effect="dark"
				class="tableBoxClass"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="index" :index="tableIndex" label="序号" width="95"></el-table-column>
				<el-table-column prop="visitorName" label="账号" width="120"></el-table-column>
				<el-table-column prop="gender" label="姓名" width="128">
					<template slot-scope="scope">{{$common.getEnumItemName("gender", scope.row.gender)}}</template>
				</el-table-column>
				<el-table-column prop="phoneNo" label="登陆IP"></el-table-column>
				<el-table-column prop="plateNo" label="模块" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="reason" label="类型"></el-table-column>
				<el-table-column prop="reason" label="操作内容"></el-table-column>
				<el-table-column prop="reason" label="操作时间"></el-table-column>
			</el-table>
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
import SearchOptionView from "@/pages/log/components/SearchLog";
import * as api from "../http/logHttp";
export default {
  components: {
    SearchOptionView,
  },
  props: {},
  data() {
    return {
      tableData: [],
      selectDate: "",
      validateTimeStart: null,
      validateTimeEnd: null,
      staffName: null,
      currentPage: 1,
      pageSize: 14,
      total: 0,
      isShow: false,
      operatorLogBoxDetail: {},
      showloading: false,
      staffType: "staff",
      otherSearchData: {}
    };
  },
  created() {},
  mounted() {
    let h =
			window.innerHeight ||
			document.documentElement.clientHeight ||
			document.body.clientHeight;
    this.$refs.operatorLogBoxTable.$el.style.height = h - 315 + "px";
    // 这里 -1 是为了去掉表头高度
    this.pageSize = parseInt((h - 315) / 50) - 1;
    console.log(this.pageSize);
    // 当窗口发生变化时
    let that = this;
    window.addEventListener("resize", function() {
      let h =
				window.innerHeight ||
				document.documentElement.clientHeight ||
				document.body.clientHeight;
      that.$refs.operatorLogBoxTable.$el.style.height = h - 315 + "px";
      that.pageSize = parseInt((h - 315) / 50) - 1;
      console.log(that.pageSize);
    });
    // this.initData();
  },
  activated() {
    console.log(this.$route.params.data, "---------openDoor-------");
    var params = this.$route.params.data;
    var data = {};
    if (params && params.visitorUuid) {
      data.visitorUuid = params.visitorUuid;
    }
    this.currentPage = 1;
    Object.assign(this.otherSearchData, data);
    // this.initData();
  },
  methods: {
    justifyForbidBtnTxt(rowData) {
      // rowData.validDatetimeEnd
      let validDatetimeEnd = new Date(rowData.validDatetimeEnd).getTime();
      let currentDateTime = new Date().getTime();
      return currentDateTime < validDatetimeEnd;
    },
    showStaffDetail(type, data, isBool) {
      console.log(type, data, isBool);
      this.isStaffDetailShow = isBool;
      this.staffType = type;
      this.residentDetail = data;
      this.residentDetail.addressString = data.address;
    },
    closeStaffDetail() {
      this.isStaffDetailShow = false;
    },
    initData() {
      var params = {
        limit: this.pageSize,
        page: this.currentPage
      };
      Object.assign(params, this.otherSearchData);
      console.log(params);
      this.showloading = !this.showloading;
      // 查询数据的接口函数
      api
        .getLogList(params)
        .then(res => {
          this.showloading = false;
          if (res.data.success && res.data.data) {
            this.tableData = res.data.data.list;
            for (let i = 0; i < this.tableData.length; i++) {
              let item = this.tableData[i];
              // 判断是否需要签离 处理已到访，超出有效期后 权限回收的问题
              item.signOff =
								item.manualSignOff &&
								Boolean(this.signOffBtnArr.indexOf(item.visitState) !== -1);
              let isOvertime = this.justifyForbidBtnTxt(item);
              item.forbid =
								Boolean(this.forbidBtnArr.indexOf(item.visitState) !== -1) ||
								(Boolean(item.visitState === "comed") && isOvertime);
            }
            this.total = res.data.data.total;
          } else {
            this.$message({ type: "error", message: "没有找到相关访客记录" });
          }
        })
        .catch(err => {
          this.showloading = false;
          console.error(err);
        });
    },
    closeDetail() {
      this.isShow = !this.isShow;
      this.isStaffDetailShow = false;
    },
    // 详情
    detailBtnAct(rowData) {
      console.log(rowData);
      // 请求数据
      this.showloading = !this.showloading;
      api
        .getLogList({ recordUuid: rowData.recordUuid })
        .then(res => {
          this.showloading = false;
          if (res.data && res.data.success && res.data.data) {
            this.operatorLogBoxDetail = res.data.data;
            this.operatorLogBoxDetail.vistorState = rowData.visitState;
            this.operatorLogBoxDetail.recordUuid = rowData.recordUuid;
            this.operatorLogBoxDetail.signOff = rowData.signOff;
            this.operatorLogBoxDetail.forbid = rowData.forbid;
            console.log(this.operatorLogBoxDetail);
            this.isShow = !this.isShow;
          } else {
            this.$message({ type: "warning", message: "没有找到访客记录详情" });
          }
        })
        .catch(err => {
          this.showloading = !this.showloading;
          console.error(err);
        });
    },
    // 禁止通行
    forbidBtnAct(rowData) {
      console.log("禁止通信");
    },
    // 签离
    signOffBtnAct(rowData) {

    },
    // 检索按钮事件
    queryAct(value) {
      console.log("接收其他检索条件", value);
      this.currentPage = 1;
      value.visitorUuid = null;
      Object.assign(this.otherSearchData, value);
      this.initData();
    },
    queryBtnAct() {
      var data = {};
      if (this.selectDate === "otherDay") {
        data.regDatetimeBegin = this.validateTimeStart;
        data.regDatetimeEnd = this.validateTimeEnd;
      } else {
        this.selectDate = "";
      }
      if (this.staffName) {
        data.visitorName = this.staffName;
      }
      this.currentPage = 1;
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
.operatorLogBox .editFontClass {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #26d39d;
	margin: 0 10px;
}
.operatorLogBox .deleteBtnClass {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ff5f5f;
}
.operatorLogBox .rightgroup {
	display: inline-block;
}
.operatorLogBox .rightgroup .title {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
}
.operatorLogBox .el-radio-button__orig-radio:checked + .el-radio-button__inner {
	color: #ffffff;
	background-color: rgba(40, 255, 187, 0.08);
	border: 0;
	border-bottom: 1px solid rgba(38, 211, 157, 0.5);
	border-right: 1px solid transparent;
	-webkit-box-shadow: none;
	box-shadow: none;
}
.operatorLogBox .el-radio-button__inner {
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
.operatorLogBox .otherDay .el-radio-button__inner {
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
.operatorLogBox .el-radio-button:first-child .el-radio-button__inner {
	border-left: 0;
	border-radius: 4px 0 0 4px;
	-webkit-box-shadow: none !important;
	box-shadow: none !important;
}
.operatorLogBox .el-input--prefix .el-input__inner {
	padding-left: 12px;
}
.operatorLogBox .el-input--suffix .el-input__inner {
	padding-right: 0px;
}
.operatorLogBox .el-date-editor.el-input,
.el-date-editor.el-input__inner {
	width: 180px;
}
.operatorLogBox .el-icon-time:before {
	content: "";
	position: absolute;
	top: 50%;
	left: 120%;
}
.operatorLogBox .el-button--default,
.operatorLogBox .el-button--default:hover,
.operatorLogBox .el-button--default:active,
.operatorLogBox .el-button--default:focus {
	font-family: "PingFangSC-Regular";
	font-size: 16px;
	height: 34px;
	background: rgba(40, 255, 187, 0.08);
	border: 0 solid rgba(38, 211, 157, 0.8);
	border-radius: 2px;
	border-radius: 2px;
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
}
.operatorLogBox .staffNameInput {
	width: 160px;
	display: inline-block;
	margin-right: 15px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/style/variables.scss";
.operatorLogBox {
	height: 100%;
	color: #dddddd;
	.header {
		height: 50px;
		padding: 15px 40px;
		background: #212325;
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
	.loginLogMain {
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
