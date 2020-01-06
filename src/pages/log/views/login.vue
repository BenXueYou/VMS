<template>
	<div class="loginLogBox" v-loading="showloading">
		<div class="header">
			<div>登陆日志</div>
		</div>
		<div class="loginLogMain">
			<div class="main-header">
				<div class="leftgroup">
					<div class="leftgroupitem">
						<span class="topTitleTxt">事件：</span>
						<el-select class="left-space time-interal" v-model="eventType" clearable size="small">
							<el-option
								v-for="item in eventTypeOptions"
								:key="item.typeStr"
								:label="item.typeName"
								:value="item.typeStr"
							></el-option>
						</el-select>
					</div>
					<div class="leftgroupitem">
						<span class="topTitleTxt">账号：</span>
						<el-input v-model="accountName" class="time-interal" size="small"></el-input>
					</div>
					<div class="leftgroupitem">
						<span class="topTitleTxt">登陆IP：</span>
						<el-input v-model="loginIp" class="time-interal" size="small"></el-input>
					</div>
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
					<el-button :disabled="!ShowAuthDisabled" type="primary" @click="queryBtnAct" icon="el-icon-search" size="small">检索</el-button>
					<!-- <el-button type="primary" v-popover:popover1 size="small">其他条件检索</el-button> -->
					<el-popover
						ref="popover1"
						placement="bottom-end"
						:visible-arrow="false"
						width="270"
						trigger="click"
					>
						<search-option-view @query="queryAct"></search-option-view>
					</el-popover>
				</div>
				<!-- </div> -->
			</div>
			<el-table
				ref="loginLogBoxTable"
				:data="tableData"
				tooltip-effect="dark"
				class="tableBoxClass"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="index" :index="tableIndex" label="序号" width="95"></el-table-column>
				<el-table-column prop="accountName" label="账号" width="120"></el-table-column>
				<el-table-column prop="userName" label="姓名" width="128"></el-table-column>
				<el-table-column prop="clientIp" label="登陆IP"></el-table-column>
				<el-table-column prop="eventTime" label="时间" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="eventType" label="事件">
					<template slot-scope="scope">
						<!--   <span>{{scope.row.invalidTime}}</span> -->
						<span v-if="scope.row.eventType==='login'">登陆</span>
						<span v-if="scope.row.eventType==='logout'">登出</span>
					</template>
				</el-table-column>
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
    SearchOptionView
  },
  props: {},
  data() {
    return {
      eventType: null,
      eventTypeOptions: [
        { typeName: "全部", typeStr: null },
        { typeName: "登陆", typeStr: "login" },
        { typeName: "登出", typeStr: "logout" }
      ],
      accountName: null,
      accountOptions: [],
      loginIp: null,
      tableData: [],
      validateTimeStart: null,
      validateTimeEnd: null,
      currentPage: 1,
      pageSize: 14,
      total: 0,
      isShow: false,
      showloading: false,
      otherSearchData: {},
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("登陆日志", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("登陆日志", "isOwn");

    let h =
			window.innerHeight ||
			document.documentElement.clientHeight ||
			document.body.clientHeight;
    this.$refs.loginLogBoxTable.$el.style.height = h - 315 + "px";
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
      that.$refs.loginLogBoxTable.$el.style.height = h - 315 + "px";
      that.pageSize = parseInt((h - 315) / 50) - 1;
      console.log(that.pageSize);
    });
    // this.initData();
    // this.eventTypeOptions = this.$common.getEnumByGroupStr("config");
  },
  activated() {
    this.currentPage = 1;
    this.initData();
  },
  methods: {
    initData() {
      if (!this.ShowAuthDisabled) return;
      var params = {
        beginTime: this.validateTimeStart,
        endTime: this.validateTimeEnd,
        pageSize: this.pageSize,
        page: this.currentPage,
        accountName: this.accountName,
        logType: "login",
        IP: this.loginIp ? this.loginIp : null,
        modelName: null,
        eventType: this.eventType
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
            this.total = res.data.data.total;
          } else {
            this.$message({ type: "error", message: "没有找到相关记录" });
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
    // 检索按钮事件
    queryAct(value) {
      console.log("接收其他检索条件", value);
      this.currentPage = 1;
      Object.assign(this.otherSearchData, value);
      this.initData();
    },
    queryBtnAct() {
      this.currentPage = 1;
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
  watch: {},
  destroyed() {}
};
</script>
<style>
.loginLogBox .rightgroup .title {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
}
.loginLogBox .el-button--default,
.loginLogBox .el-button--default:hover,
.loginLogBox .el-button--default:active,
.loginLogBox .el-button--default:focus {
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
.loginLogBox .staffNameInput {
	width: 160px;
	display: inline-block;
	margin-right: 15px;
}
.loginLogBox .el-input {
	position: relative;
	font-size: 14px;
	display: inline-block;
	width: 150px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/style/variables.scss";
.loginLogBox {
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
			width: 100%;
			overflow: auto;
			margin-bottom: 18px;
			display: flex;
			justify-content: space-between;
			.leftgroup {
				display: flex;
				justify-content: space-between;
				.leftgroupitem {
					width: 220px;
					margin-right: 25px;
					.el-input {
						display: inline-block;
						width: 150px;
					}
				}
			}
			.rightgroup {
				// min-width: 600px;
			}
		}
		.footer {
			text-align: right;
		}
	}
}
</style>
