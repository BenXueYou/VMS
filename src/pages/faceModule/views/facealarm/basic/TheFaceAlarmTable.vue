<template>
	<div class="tablelist" ref="tablelist">
		<div class="tableListBox">
			<el-table :data="tableData" border v-loading="isloading" style="width: 100%">
				<el-table-column prop="index" label="序号" width="60">
					<template slot-scope="scope">{{("0"+(parseInt(scope.$index)+1)).slice(-2)}}</template>
				</el-table-column>
				<el-table-column prop="faceMonitorName" label="布控任务"></el-table-column>
				<el-table-column prop="captureDatetime" label="报警时间"></el-table-column>
				<el-table-column prop="channelName" label="抓拍摄像机" show-overflow-tooltip></el-table-column>
				<el-table-column prop="staffName" label="人员姓名" width="100"></el-table-column>
				<el-table-column prop="gender" label="性别" width="100">
					<template
						slot-scope="scope"
					>{{scope.row.staffType?$common.getEnumItemName("gender", scope.row.gender):''}}</template>
				</el-table-column>
				<el-table-column prop="credentialNo" label="证件号码" show-overflow-tooltip></el-table-column>
				<el-table-column prop="belong" label="人员类型" width="120">
					<template
						slot-scope="scope"
					>{{scope.row.staffType?$common.getEnumItemName("staff_t", scope.row.staffType):''}}</template>
				</el-table-column>
				<el-table-column prop="libraryName" show-overflow-tooltip label="所属库" width="120"></el-table-column>
				<el-table-column prop="faceSimilarity" label="相似度" width="80"></el-table-column>
				<el-table-column prop="dealState" label="状态">
					<template
						slot-scope="scope"
					>{{scope.row.dealState?$common.getEnumItemName("alarm_r", scope.row.dealState):''}}</template>
				</el-table-column>
				<el-table-column label="操作" width="112">
					<template slot-scope="scope">
						<el-button @click="lookAlarmDetail(scope.row)" type="text" size="small">
							<i class="el-icon-search"></i>
							查看
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="FAMTableListFooter">
			<el-pagination
				@current-change="currentChange"
				:current-page="pageNow"
				layout="total,prev, pager, next,jumper"
				:page-size="pageSize"
				:total="pageCount"
				background
			></el-pagination>
			<!-- <el-pagination
				background
				layout="prev, pager, next"
				:page-size="pageSize"
				:current-page="pageNow"
				@current-change="currentChange"
				:total="pageCount"
			></el-pagination>
			<p class="totalpagetitle">共{{pageCount}}条</p>
			<div class="tiaozhuan">
				<span>跳转至</span>
				<el-input
					class="yeshu"
					onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
					v-model="yeshu"
					@blur="blur"
					@keyup.enter.native="blur"
					type="number"
				></el-input>
			</div> -->
		</div>
	</div>
</template>
<script>
export default {
  name: "facedblist",
  props: {
    tableData: {
      type: Array,
      default: function() {
        var num = [];
        return num;
      }
    },
    pageSize: {
      type: Number,
      default: function() {
        return 12;
      }
    },
    pageNow: {
      type: Number,
      default: function() {
        return 1111;
      }
    },
    pageCount: {
      type: Number,
      default: function() {
        return 1000;
      }
    },
    isloading: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    return {
      multipleSelection: [],
      yeshu: ""
    };
  },
  mounted() {},
  methods: {
    blur() {
      if (this.yeshu !== "") {
        if (this.yeshu > Math.ceil(this.pageCount / this.pageSize)) {
          this.yeshu = Math.ceil(this.pageCount / this.pageSize);
        }
        this.yeshu = parseInt(this.yeshu);
        this.$emit("pagechange", parseInt(this.yeshu));
      }
    },
    lookAlarmDetail(row) {
      this.$emit("lookAlarmDetail", row);
    },
    currentChange(index) {
      this.$emit("pagechange", index);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.tablelist {
	height: calc(100% - 64px);
	overflow: auto;
	.tableListBox {
		height: calc(100% - 45px);
		overflow: auto;
	}
}
.FAMTableListFooter {
	position: relative;
	// margin: 30px 0px 20px;
	.totalpagetitle {
		font-size: 14px;
		color: #fff;
		float: right;
		margin-right: 20px;
		margin-top: 17px;
	}
	.el-pagination {
		margin-right: 2px;
		margin-top: 10px;
		float: right;
	}
	.tiaozhuan {
		position: absolute;
		right: 20px;
		top: 6px;
		span {
			font-size: 14px;
			color: #fff;
			padding-right: 20px;
		}
		.yeshu {
			display: inline-block;
			width: 90px;
			input {
				padding: 0px;
			}
		}
	}
}
</style>
<style lang="scss">
.tablelist .yeshu {
	display: inline-block;
	width: 90px;
	vertical-align: middle;
	height: 40px;
	.el-input__inner {
		margin-top: 5px;
		width: 50px;
		height: 28px;
		line-height: 28px;
		padding: 0px 5px;
	}
}
</style>
