<template>
	<div class="StaffSearchOptionView">
		<div class="form-item">
			<label for>性别：</label>
			<!-- <el-input class="input" v-model="gender"></el-input> -->
			<el-select v-model="gender" placeholder="请选择性别">
				<el-option
					v-for="item in genderOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
		</div>
		<div class="form-item">
			<label for>电话：</label>
			<el-input class="input" v-model="phoneNo"></el-input>
		</div>
		<div class="form-item">
			<label for>证件号：</label>
			<el-input class="input" v-model="credentialNo"></el-input>
		</div>
		<div class="form-item">
			<label for>人员类型：</label>
			<!-- <el-input class="input" v-model="staffType"></el-input> -->
			<el-select v-model="staffType" placeholder="请选择人员类型">
				<el-option
					v-for="item in staffTypeOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
		</div>
		<div class="form-item">
			<label for>注册时间：</label>
			<el-date-picker
				v-model="createTime"
				type="datetime"
				value-format="yyyy-MM-dd HH:mm:ss"
				format="yyyy-MM-dd HH:mm:ss"
				placeholder="选择日期"
				class="input"
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
  name: "StaffSearchOptionView",
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
      phoneNo: "",
      credentialNo: "",
      staffType: "",
      createTime: "",
      genderOptions: [],
      staffTypeOptions: []
    };
  },
  mounted() {
    this.staffTypeOptions = this.$common.getEnumByGroupStr("staff_t");
    this.staffType = this.staffTypeOptions[0].typeStr;
    this.genderOptions = this.$common.getEnumByGroupStr("gender");
    this.genderOptions.unshift({typeStr: null, typeName: '全部'});
  },
  methods: {
    query() {
      console.log("注册时间：", this.createTime);
      var data = {
        credentialNo: this.credentialNo,
        phoneNo: this.phoneNo,
        createTime: this.createTime.split(' ')[0],
        gender: this.gender,
        staffType: this.staffType
      };
      this.$emit("query", data);
    },
    resetValue() {
      this.gender = "";
      this.phoneNo = "";
      this.credentialNo = "";
      this.staffType = this.staffTypeOptions[0].typeStr;
      this.createTime = "";
    }
  }
};
</script>

<style lang='scss'>
@import "@/style/variables.scss";
.StaffSearchOptionView {
	.input {
		input {
			@include input30;
			padding-right: 10px;
		}
		.el-input__prefix {
			left: 110%;
			-webkit-transform: translateX(-200%);
			transform: translateX(-200%);
		}
	}
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.StaffSearchOptionView {
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
			width: calc(100% - 100px);
			margin-left: 10px;
		}
	}
}
</style>
