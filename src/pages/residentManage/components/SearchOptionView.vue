<template>
	<div class="SearchOptionView">
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
			<el-input class="input" v-model="phone"></el-input>
		</div>
		<div class="form-item">
			<label for>住址：</label>
			<el-input class="input" v-model="address"></el-input>
		</div>
		<div class="form-item">
			<label for>人员类型：</label>
			<!-- <el-input class="input" v-model="personType"></el-input> -->
			<el-select v-model="personType" placeholder="请选择人员类型">
				<el-option
					v-for="item in personTypeOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
		</div>
		<div class="form-item">
			<label for>注册时间：</label>
			<el-date-picker v-model="registerTime" type="date" value-format="yyyy-MM-dd" format='yyyy-MM-dd' placeholder="选择日期" class="input"></el-date-picker>
		</div>
		<div class="btn-group">
			<el-button type="primary" size="small" @click="query">查询</el-button>
			<span class="btn-text" @click="resetValue">重置</span>
		</div>
	</div>
</template>
<script>
export default {
  name: "SearchOptionView",
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
      personTypeOptions: []
    };
  },
  mounted() {
    this.personTypeOptions = this.$common.getEnumByGroupStr("staff_t");
    this.personType = this.personTypeOptions[0].typeStr;
    this.genderOptions = this.$common.getEnumByGroupStr("gender");
  },
  methods: {
    query() {
      console.log('注册时间：', this.registerTime);

      var createTimeOver = "";
      var createTimeStart = "";
      if (this.registerTime) {
        createTimeOver = `${this.registerTime} 23:59:59`;
        createTimeStart = this.registerTime + " 00:00:00";
        console.log(createTimeStart, typeof createTimeStart);
      }
      var data = {
        address: this.address,
        cellphone: this.phone,
        createTimeOver: createTimeOver,
        createTimeStart: createTimeStart,
        gender: this.gender,
        staffType: this.personType
      };
      this.$emit("query", data);
    },
    resetValue() {
      this.gender = "";
      this.phone = "";
      this.address = "";
      this.personType = this.personTypeOptions[0].typeStr;
      this.registerTime = "";
    }
  }
};
</script>

<style lang='scss'>
@import "@/style/variables.scss";
.SearchOptionView {
	.input {
		input {
			@include input30;
		}
	}
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.SearchOptionView {
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
