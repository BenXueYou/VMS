<template>
	<div class="SearchLog">
		<div class="form-item">
			<label for>门名称：</label>
			<el-input class="input" v-model="SearchObj.deviceName"></el-input>
		</div>
		<div class="form-item">
			<label for>验证类型：</label>
			<!-- <el-input class="input" v-model="gender"></el-input> -->
			<el-select v-model="SearchObj.recognitionMode" placeholder="请选择验证">
				<el-option
					v-for="item in recognitionModeOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
		</div>
		<div class="form-item">
			<label for>访客类型：</label>
			<el-select v-model="SearchObj.reservationType" placeholder="请选择访客类型">
				<el-option
					v-for="item in reservationTypeOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
		</div>
		<div class="form-item">
			<label for>验证结果：</label>
			<el-select v-model="SearchObj.verifyResult" placeholder="请选择验证结果">
				<el-option
					v-for="item in resultOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
		</div>
		<div class="form-item">
			<label for>开门结果：</label>
			<el-select v-model="SearchObj.openDoorResult" placeholder="请选择开门结果">
				<el-option
					v-for="item in resultOptions"
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
  name: "SearchLog",
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
      registerTime: "",
      recognitionModeOptions: [],
      reservationTypeOptions: [],
      resultOptions: [
        { typeName: "全部", typeStr: null },
        { typeName: "成功", typeStr: 0 },
        { typeName: "失败", typeStr: 1 }
      ],
      SearchObj: {
        deviceName: null,
        recognitionMode: null,
        reservationType: null,
        openDoorResult: null,
        verifyResult: null
      }
    };
  },
  mounted() {
    this.SearchObj.verifyResult = this.resultOptions[0].typeStr;
    this.SearchObj.openDoorResult = this.resultOptions[0].typeStr;
    this.recognitionModeOptions = this.$common.getEnumByGroupStr("pass");
    this.recognitionModeOptions.unshift({ typeName: "全部", typeStr: null });
    this.SearchObj.recognitionMode = this.recognitionModeOptions[0].typeStr;
    this.reservationTypeOptions = this.$common.getEnumByGroupStr(
      "visitor_type"
    );
    this.reservationTypeOptions.unshift({ typeName: "全部", typeStr: null });
    this.SearchObj.reservationType = this.reservationTypeOptions[0].typeStr;
  },
  methods: {
    query() {
      console.log("搜索条件：", this.SearchObj);
      this.$emit("query", this.SearchObj);
    },
    resetValue() {
      this.SearchObj = {
        deviceName: null,
        recognitionMode: this.recognitionModeOptions[0].typeStr,
        reservationType: this.reservationTypeOptions[0].typeStr,
        verifyResult: this.resultOptions[0].typeStr,
        openDoorResult: this.resultOptions[0].typeStr
      };
      this.$emit("query", this.SearchObj);
    }
  }
};
</script>

<style lang='scss'>
@import "@/style/variables.scss";
.SearchLog {
	.input {
		input {
			@include input30;
		}
	}
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.SearchLog {
	background: #2a2e31;
	padding: 10px 20px 10px;
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
			width: 80px;
			text-align: right;
			@include font-s;
		}
		.el-select,
		.input {
			width: calc(100% - 100px);
			margin-left: 10px;
		}
	}
}
</style>
