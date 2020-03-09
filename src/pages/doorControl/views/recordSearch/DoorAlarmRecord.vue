<template>
	<div class="access-main">
		<div class="access-search">
			<span class="topTitleTxt">报警源名称：</span>
			<el-input v-model="resName" @keyup.enter.native="queryAct" class="time-interal" size="small"></el-input>
			<el-select
				class="left-space time-interal"
				v-model="subtype"
				clearable
				placeholder="报警类型"
				size="small"
			>
				<el-option
					v-for="item in alarmTypeOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
			<el-select
				class="left-space time-interal"
				v-model="dealState"
				clearable
				placeholder="处理状态"
				size="small"
			>
				<el-option
					v-for="item in handleStatusOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
			<span class="topTitleTxt left-space">时间：</span>
			<el-date-picker
				v-model="beginTime"
				type="datetime"
				class="time-interal-date"
				size="small"
				placeholder="选择日期"
				value-format="yyyy-MM-dd HH:mm:ss"
			></el-date-picker>
			<div class="time-line"></div>
			<el-date-picker
				v-model="endTime"
				type="datetime"
				class="time-interal-date"
				placeholder="选择日期"
				size="small"
				value-format="yyyy-MM-dd HH:mm:ss"
			></el-date-picker>
			<el-button
				:disabled="!ShowAuthDisabled"
				class="search-btn"
				@click="queryAct"
				size="small"
				icon="el-icon-search"
				type="primary"
			>检索</el-button>
		</div>
		<div class="face-table">
			<el-scrollbar style="height: 92%;transition:0.2s">
				<el-table :data="tableData" style="width: 100%">
					<el-table-column type="index" label="序号" :index="indexMethod" width="90"></el-table-column>
					<el-table-column prop="dealState" label="处理状态" show-overflow-tooltip width="120">
						<template slot-scope="scope">{{$common.getEnumItemName("alarm_r", scope.row.dealState)}}</template>
					</el-table-column>
					<el-table-column prop="alarmTime" label="报警时间" show-overflow-tooltip width="220"></el-table-column>
					<el-table-column prop="subType" label="报警类型" show-overflow-tooltip>
						<template slot-scope="scope">{{$common.getEnumItemName("alarm_t", scope.row.subType)}}</template>
					</el-table-column>
					<el-table-column prop="resName" label="地址" show-overflow-tooltip></el-table-column>
					<el-table-column prop="resName" label="报警源" show-overflow-tooltip></el-table-column>
					<el-table-column prop="valided" label="报警有效性" show-overflow-tooltip>
						<template slot-scope="scope">{{scope.row.valided === 0 ? "无效" : "有效"}}</template>
					</el-table-column>
					<el-table-column prop="alarmLevel" label="报警等级" show-overflow-tooltip>
						<template slot-scope="scope">
							<!-- <div
								class="level-div"
								:style="scope.row.alarmLevel? `color: #EDAE22;` : `color: #FF5F5F;`"
							>{{$common.getEnumItemName("alarm_l", scope.row.alarmLevel)}}</div>-->
							<div
								class="level-div"
								style="color: #FF5F5F;"
							>{{scope.row.alarmLevel?$common.getEnumItemName("alarm_l", scope.row.alarmLevel):'紧急'}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="alarmInfo" label="报警信息" show-overflow-tooltip>
						<template slot-scope="scope">
							<div
								v-if="scope.row.extInfo && scope.row.extInfo.temperature"
								style="color: #FF5F5F;"
							>{{scope.row.extInfo.staffName+scope.row.extInfo.temperature+'℃'}}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="text" @click="rowDetailBtnAct(scope.row)" size="mini">详情</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-scrollbar>
			<div class="footer">
				<el-pagination
					background
					layout="total, prev, pager, next, jumper"
					:page-size="pageInfo.pageSize"
					:current-page="pageInfo.currentPage"
					@current-change="handleCurrentChange"
					:total="pageInfo.total"
				></el-pagination>
			</div>
		</div>
		<door-alarm-detail
			:visible.sync="isDoorAlarmDetailVisible"
			:defaultDetail="defaultDetail"
			@close="initData"
		></door-alarm-detail>
	</div>
</template>
<script>
import DoorAlarmDetail from "@/pages/doorControl/components/DoorAlarmDetail.vue";
export default {
  components: { DoorAlarmDetail },
  props: {},
  data() {
    return {
      defaultDetail: {},
      isDoorAlarmDetailVisible: false,
      pageInfo: {
        total: 0,
        pageSize: 13,
        currentPage: 1
      },
      resName: "",
      beginTime: "",
      endTime: "",
      subtype: "",
      alarmTypeOptions: [],
      dealState: "",
      handleStatusOptions: [],
      tableData: [],
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("报警记录", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("报警记录", "isOwn");
    this.initData();
  },
  methods: {
    rowDetailBtnAct(rowData) {
      this.isDoorAlarmDetailVisible = true;
      this.httpAlarmDealAct(rowData);
    },
    httpAlarmDealAct(data) {
      this.$logSearchHttp
        .getAlarmLogDeal({ alarmUuid: data.alarmUuid })
        .then(res => {
          if (res.data.success && res.data.data) {
            res.data.data.extInfo = data.extInfo || {};
            Object.assign(data, res.data.data);
          }
          this.defaultDetail = data;
        })
        .catch(() => {});
    },
    initData() {
      if (!this.ShowAuthDisabled) return;
      this.alarmTypeOptions = this.$common.getEnumByGroupStr("door_alarms");
      //   this.handleStatusOptions = this.$common.getEnumByGroupStr("alarm_r");
      this.handleStatusOptions = [
        {
          typeStr: "processed",
          typeName: "已处理"
        },
        {
          typeStr: "to_be_processed",
          typeName: "待处理"
        }
      ];
      this.getAlarmLog();
    },
    queryAct() {
      this.pageInfo = {
        total: 0,
        pageSize: 13,
        currentPage: 1
      };
      this.getAlarmLog();
    },
    getAlarmLog() {
      this.isLoading = true;
      this.$logSearchHttp
        .getAlarmLog({
          resName: this.resName,
          subtype: this.subtype,
          dealState: this.dealState,
          pageSize: this.pageInfo.pageSize,
          beginTime: this.beginTime,
          endTime: this.endTime,
          currentPage: this.pageInfo.currentPage
        })
        .then(res => {
          let body = res.data;
          this.handleGetAlarmLogSuccessResponse(body.data);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    handleGetAlarmLogSuccessResponse(data) {
      this.tableData = data.list || [];
      this.handlePageInfo(data);
    },
    handlePageInfo(data) {
      let total = 0;
      if (data.total >= 0) {
        total = data.total;
      }
      this.pageInfo.total = total;
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.getAlarmLog();
    },
    formatNumber(num) {
      let numStr = "";
      if (num < 10) {
        numStr = `0${num}`;
      } else {
        numStr = `${num}`;
      }
      return numStr;
    },
    indexMethod(index) {
      return this.formatNumber(
        index + (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize + 1
      );
    }
  },
  watch: {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.access-main {
	width: 100%;
	height: 100%;
	background: #212325;
	padding: 1.8% 2.2%;
	box-sizing: border-box;
	.access-search {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		.topTitleTxt {
			font-family: PingFangSC-Regular;
			font-size: 13px;
			color: #ffffff;
		}
		.time-interal {
			width: 9%;
		}
		.time-interal-date {
			width: 13%;
		}
		.left-space {
			margin-left: 3%;
		}
		.timeText {
			font-size: 32px;
			color: #cccccc;
		}
		.time-line {
			border-width: 1px 0px 0px 0px;
			width: 8px;
			border-color: #7a7b7c;
			border-style: solid;
			margin: 0px 3px;
		}
		.search-btn {
			margin-left: auto;
			margin-right: 0;
		}
	}
	.face-table {
		height: 90%;
		margin-top: 2%;
		.footer {
			margin-top: 30px;
			width: 100%;
			display: flex;
			justify-content: flex-end;
		}
	}
}
</style>
