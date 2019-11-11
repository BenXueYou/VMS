<template>
	<div class="SearchLog">
		<div class="form-item">
			<label for>账号：</label>
			<el-input class="input" v-model="SearchObj.IP"></el-input>
		</div>
		<div class="form-item">
			<label for>模块：</label>
			<el-select v-model="SearchObj.modelUuid" placeholder="请选择验证">
				<el-option
					v-for="item in modelUuidOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
		</div>
		<div class="form-item">
			<label for>类型：</label>
			<el-select v-model="SearchObj.eventType" placeholder="请选择事件类型">
				<el-option
					v-for="item in eventTypeOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
		</div>
		<div class="form-item">
			<label for>IP：</label>
			<el-input class="input" v-model="SearchObj.IP"></el-input>
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
      modelUuidOptions: [],
      eventTypeOptions: [],
      resultOptions: [
        { typeName: "全部", typeStr: null },
        { typeName: "成功", typeStr: 0 },
        { typeName: "失败", typeStr: 1 }
      ],
      SearchObj: {
        IP: null,
        modelUuid: null,
        eventType: null,
        openDoorResult: null,
        verifyResult: null
      }
    };
  },
  mounted() {
    this.SearchObj.verifyResult = this.resultOptions[0].typeStr;
    this.SearchObj.openDoorResult = this.resultOptions[0].typeStr;
    this.modelUuidOptions = this.$common.getEnumByGroupStr("pass");
    this.modelUuidOptions.unshift({ typeName: "全部", typeStr: null });
    this.SearchObj.modelUuid = this.modelUuidOptions[0].typeStr;
    this.eventTypeOptions = this.$common.getEnumByGroupStr(
      "system_log_event"
    );
    this.eventTypeOptions.unshift({ typeName: "全部", typeStr: null });
    this.SearchObj.eventType = this.eventTypeOptions[0].typeStr;
  },
  methods: {
    query() {
      console.log("搜索条件：", this.SearchObj);
      this.$emit("query", this.SearchObj);
    },
    resetValue() {
      this.SearchObj = {
        IP: null,
        modelUuid: this.modelUuidOptions[0].typeStr,
        eventType: this.eventTypeOptions[0].typeStr,
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
