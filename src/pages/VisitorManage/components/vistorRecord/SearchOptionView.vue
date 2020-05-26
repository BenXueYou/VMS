<template>
	<div class="SearchOptionView">
		<div class="form-item">
			<label for>登记设备：</label>
			<el-input class="input" v-model="SearchObj.regDeviceNickName"></el-input>
		</div>
		<div class="form-item">
			<label for>被访人员：</label>
			<el-input class="input" v-model="SearchObj.staffName"></el-input>
		</div>
		<div class="form-item">
			<label for>来访事由：</label>
			<el-input class="input" v-model="SearchObj.reason"></el-input>
		</div>
		<div class="form-item">
			<label for>访客状态：</label>
			<!-- <el-input class="input" v-model="personType"></el-input> -->
			<el-select v-model="SearchObj.visitState" placeholder="请选择访客状态">
				<el-option
					v-for="item in vistorStatuseOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
		</div>
		<div class="form-item">
			<label for>登记途径：</label>
			<!-- <el-input class="input" v-model="gender"></el-input> -->
			<el-select v-model="SearchObj.source" placeholder="请选择登记途径">
				<el-option
					v-for="item in registerWayOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
		</div>
		<div class="form-item">
			<label for>手机号码：</label>
			<el-input class="input" v-model="SearchObj.phoneNo"></el-input>
		</div>
		<div class="form-item">
			<label for>车牌号码：</label>
			<el-input class="input" v-model="SearchObj.plateNo"></el-input>
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
      registerWayOptions: [],
      vistorStatuseOptions: [],
      SearchObj: {
        plateNo: null,
        phoneNo: null,
        source: null,
        visitState: null,
        regDeviceNickName: null,
        staffName: null,
        reason: null
      }
    };
  },
  mounted() {
    this.vistorStatuseOptions = this.$common.getEnumByGroupStr(
      "visitor_record_s"
    );
    this.vistorStatuseOptions.unshift({ typeStr: null, typeName: "全部" });
    this.SearchObj.visitState = this.vistorStatuseOptions[0].typeStr;
    this.registerWayOptions = this.$common.getEnumByGroupStr(
      "visitor_singon_ways"
    );
    this.registerWayOptions.unshift({ typeStr: null, typeName: "全部" });
    this.SearchObj.source = this.registerWayOptions[0].typeStr;
  },
  methods: {
    query() {
      //   var data = {
      //     plateNumber: this.plateNumber,
      //     vistorPhone: this.vistorPhone,
      //     registerWay: this.registerWay,
      //     vistorStatus: this.vistorStatus,
      //     registerDevice: this.registerDevice,
      //     vistorReason: this.vistorReason
      //   };
      this.$emit("query", this.SearchObj);
    },
    resetValue() {
      this.SearchObj = {
        plateNo: null,
        phoneNo: null,
        source: this.registerWayOptions[0].typeStr,
        visitState: this.vistorStatuseOptions[0].typeStr,
        regDeviceNickName: null,
        staffName: null,
        reason: null
      };
      this.$emit("query", this.SearchObj);
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
