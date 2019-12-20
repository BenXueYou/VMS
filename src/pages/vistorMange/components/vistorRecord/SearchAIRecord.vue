<template>
	<div class="SearchAIRecord">
		<div class="form-item">
			<label for>访客手机：</label>
			<el-input class="input" v-model="SearchObj.visitorPhoneNo"></el-input>
		</div>
		<div class="form-item">
			<label for>访客车牌：</label>
			<el-input class="input" v-model="SearchObj.visitorPlateNo"></el-input>
		</div>
		<div class="form-item">
			<label for>被访人姓名：</label>
			<el-input class="input" v-model="SearchObj.staffName"></el-input>
		</div>
		<div class="form-item">
			<label for>被访人手机号：</label>
			<el-input class="input" v-model="SearchObj.staffPhoneNo"></el-input>
		</div>

		<div class="form-item">
			<label for>预计到达时间：</label>
			<!-- <el-input class="input" v-model="gender"></el-input> -->
			<el-date-picker
				v-model="SearchObj.estimatedDatetimeArriveBegin"
				type="datetime"
				size="small"
				class="time-interal-date"
				style="margin-left: 13px;"
				placeholder="选择日期"
				value-format="yyyy-MM-dd HH:mm:ss"
			></el-date-picker>
			<span class="time-line">-</span>
			<el-date-picker
				v-model="SearchObj.estimatedDatetimeArriveEnd"
				type="datetime"
				size="small"
				class="time-interal-date"
				placeholder="选择日期"
				value-format="yyyy-MM-dd HH:mm:ss"
			></el-date-picker>
		</div>
		<div class="form-item">
			<label for>预计离开时间：</label>
			<!-- <el-input class="input" v-model="personType"></el-input> -->
			<el-date-picker
				v-model="SearchObj.estimatedDatetimeLeaveBegin"
				type="datetime"
				size="small"
				class="time-interal-date"
				style="margin-left: 13px;"
				placeholder="选择日期"
				value-format="yyyy-MM-dd HH:mm:ss"
			></el-date-picker>
			<span class="time-line">-</span>
			<el-date-picker
				v-model="SearchObj.estimatedDatetimeLeaveEnd"
				type="datetime"
				size="small"
				class="time-interal-date"
				placeholder="选择日期"
				value-format="yyyy-MM-dd HH:mm:ss"
			></el-date-picker>
		</div>
		<div class="form-item">
			<label for>审批状态：</label>
			<el-select v-model="SearchObj.approveState" placeholder="请选择审批状态">
				<el-option
					v-for="item in approveStateOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
		</div>
		<div class="form-item">
			<label for>来访状态：</label>
			<el-select v-model="SearchObj.visitState" placeholder="请选择来访状态">
				<el-option
					v-for="item in visitStateOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
		</div>
		<div class="btn-group">
			<!-- <el-button type="primary" size="small" @click="query">查询</el-button> -->
			<span class="btn-text" @click="query">查询</span>
			<span class="btn-text" @click="resetValue">重置</span>
		</div>
	</div>
</template>
<script>
export default {
  name: "SearchAIRecord",
  props: {
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      gender: "",
      phone: "",
      address: "",
      personType: "",
      registerTime: "",
      visitStateOptions: [],
      approveStateOptions: [],
      SearchObj: {
        visitorPlateNo: null,
        visitorPhoneNo: null,
        staffName: null,
        staffPhoneNo: null,
        estimatedDatetimeArriveBegin: null,
        estimatedDatetimeArriveEnd: null,
        estimatedDatetimeLeaveBegin: null,
        estimatedDatetimeLeaveEnd: null,
        visitState: null,
        approveState: null
      }
    };
  },
  mounted() {
    this.approveStateOptions = this.$common.getEnumByGroupStr(
      "reservation_record_s"
    );
    this.approveStateOptions.unshift({ typeName: "全部", typeStr: null });
    this.SearchObj.approveState = this.approveStateOptions[0].typeStr;
    this.visitStateOptions = this.$common.getEnumByGroupStr("visitor_record_s");
    this.visitStateOptions.unshift({ typeName: "全部", typeStr: null });
    this.SearchObj.visitState = this.visitStateOptions[0].typeStr;
  },
  methods: {
    query() {
      console.log("注册时间：", this.SearchObj);
      this.$emit("query", this.SearchObj);
    },
    resetValue() {
      this.SearchObj = {
        visitorPlateNo: null,
        visitorPhoneNo: null,
        staffName: null,
        staffPhoneNo: null,
        estimatedDatetimeArriveBegin: null,
        estimatedDatetimeArriveEnd: null,
        estimatedDatetimeLeaveBegin: null,
        estimatedDatetimeLeaveEnd: null,
        visitState: null,
        approveState: null
      };
      this.$emit("query", this.SearchObj);
    }
  }
};
</script>

<style lang='scss'>
@import "@/style/variables.scss";
.SearchAIRecord {
	.input {
		input {
			@include input30;
		}
	}
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.SearchAIRecord {
	background: #2a2e31;
	padding: 10px 10px 10px;
	box-sizing: border-box;
	.btn-group {
		// float: right;
		text-align: left;
		.btn-text {
			display: inline-block;
			padding-left: 30px;
			color: $add-text-color;
			cursor: pointer;
		}
		margin-top: 25px;
		padding-left: 100px;
	}
	.form-item {
		margin-bottom: 15px;
		label {
			display: inline-block;
			width: 100px;
			text-align: right;
			@include font-s;
		}
		.el-select,
		.input {
			width: calc(100% - 360px);
			margin-left: 10px;
		}
	}
}
</style>
