<template>
	<div class="BlacklistSearchView">
		<div class="form-item">
			<label for>证件号码：</label>
			<el-input class="input" v-model="SearchObj.credentialNo"></el-input>
		</div>
		<div class="form-item">
			<label for>黑名单来源：</label>
			<el-select v-model="SearchObj.source" placeholder="请选择黑名单来源">
				<el-option
					v-for="item in sourceOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
		</div>
		<div class="form-item">
			<label for>拉黑时间：</label>
			<el-date-picker
				v-model="SearchObj.blockDatetimeBegin"
				type="datetime"
				size="small"
				class="time-interal-date"
				style="margin-left: 13px;"
				placeholder="选择日期"
				value-format="yyyy-MM-dd HH:mm:ss"
			></el-date-picker>
			<span class="time-line">-</span>
			<el-date-picker
				v-model="SearchObj.blockDatetimeEnd"
				type="datetime"
				size="small"
				class="time-interal-date"
				placeholder="选择日期"
				value-format="yyyy-MM-dd HH:mm:ss"
			></el-date-picker>
		</div>
		<div class="btn-group">
			<el-button type="primary" size="small" @click="query">查询</el-button>
			<span class="btn-text" @click="resetValue">重置</span>
		</div>
	</div>
</template>
<script>
export default {
  name: "BlacklistSearchView",
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
      source: "",
      registerTime: "",
      sourceOptions: [],
      SearchObj: {
        blockDatetimeBegin: null,
        blockDatetimeEnd: null,
        source: null,
        credentialNo: null
      }
    };
  },
  mounted() {
    this.sourceOptions = this.$common.getEnumByGroupStr("blacklistSource");
    this.sourceOptions.unshift({ typeName: "全部", typeStr: null });
    this.SearchObj.source = this.sourceOptions[0].typeStr;
  },
  methods: {
    query() {
      console.log("注册时间：", this.SearchObj);
      this.$emit("query", this.SearchObj);
    },
    resetValue() {
      this.SearchObj = {
        blockDatetimeBegin: null,
        blockDatetimeEnd: null,
        source: this.sourceOptions[0].typeStr,
        credentialNo: null
      };
      this.$emit("query", this.SearchObj);
    }
  }
};
</script>

<style lang='scss'>
@import "@/style/variables.scss";
.BlacklistSearchView {
	.input {
		input {
			@include input30;
		}
	}
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.BlacklistSearchView {
	background: #2a2e31;
	padding: 10px 20px 10px;
	box-sizing: border-box;
	.btn-group {
		// float: right;
		text-align: left;
		.btn-text {
			display: inline-block;
			padding: 0px 30px;
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
			width: calc(100% - 340px);
			margin-left: 10px;
		}
	}
}
</style>
