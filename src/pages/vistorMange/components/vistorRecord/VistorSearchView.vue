<template>
	<div class="VistorSearchView">
		<div class="form-item">
			<label for>手机号码：</label>
			<el-input class="input" v-model="SearchObj.phoneNo"></el-input>
		</div>
		<div class="form-item">
			<label for>访客单位：</label>
			<el-input class="input" v-model="SearchObj.company"></el-input>
		</div>
		<div class="form-item">
			<label for>车牌号码：</label>
			<el-input class="input" v-model="SearchObj.plateNo"></el-input>
		</div>

		<div class="form-item">
			<label for>首次登记时间：</label>
			<!-- <el-input class="input" v-model="gender"></el-input> -->
			<el-date-picker
				v-model="SearchObj.firstRegDatetimeBegin"
				type="datetime"
				size="small"
				class="time-interal-date"
				style="margin-left: 13px;"
				placeholder="选择日期"
				value-format="yyyy-MM-dd HH:mm:ss"
			></el-date-picker>
			<span class="time-line">-</span>
			<el-date-picker
				v-model="SearchObj.firstRegDatetimeEnd"
				type="datetime"
				size="small"
				class="time-interal-date"
				placeholder="选择日期"
				value-format="yyyy-MM-dd HH:mm:ss"
			></el-date-picker>
		</div>
		<div class="form-item">
			<label for>最近登记时间：</label>
			<!-- <el-input class="input" v-model="personType"></el-input> -->
			<el-date-picker
				v-model="SearchObj.lastRegDatetimeBegin"
				type="datetime"
				size="small"
				class="time-interal-date"
				style="margin-left: 13px;"
				placeholder="选择日期"
				value-format="yyyy-MM-dd HH:mm:ss"
			></el-date-picker>
			<span class="time-line">-</span>
			<el-date-picker
				v-model="SearchObj.lastRegDatetimeEnd"
				type="datetime"
				size="small"
				class="time-interal-date"
				placeholder="选择日期"
				value-format="yyyy-MM-dd HH:mm:ss"
			></el-date-picker>
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
  name: "VistorSearchView",
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
      genderOptions: [],
      personTypeOptions: [],
      SearchObj: {
        phoneNo: "",
        plateNo: "",
        company: "",
        firstRegDatetimeBegin: null,
        firstRegDatetimeEnd: null,
        lastRegDatetimeBegin: null,
        lastRegDatetimeEnd: null
      }
    };
  },
  mounted() {},
  methods: {
    query() {
      console.log("注册时间：", this.SearchObj);
      this.$emit("query", this.SearchObj);
    },
    resetValue() {
      this.SearchObj = {
        phoneNo: "",
        plateNo: "",
        company: "",
        firstRegDatetimeBegin: null,
        firstRegDatetimeEnd: null,
        lastRegDatetimeBegin: null,
        lastRegDatetimeEnd: null
      };
      this.$emit("query", this.SearchObj);
    }
  }
};
</script>

<style lang='scss'>
@import "@/style/variables.scss";
.VistorSearchView {
	.input {
		input {
			@include input30;
		}
	}
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.VistorSearchView {
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
