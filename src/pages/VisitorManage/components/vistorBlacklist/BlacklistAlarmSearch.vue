<template>
	<div class="BlacklistAlarmSearch">
		<div class="form-item">
			<label for>报警地点：</label>
			<el-input class="input" v-model="SearchObj.deviceName"></el-input>
		</div>
		<div class="form-item">
			<label for>报警原因：</label>
			<el-select v-model="SearchObj.reason" placeholder="请选择黑名单来源">
				<el-option
					v-for="item in alarmOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
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
			<label for>处理状态：</label>
			<el-select v-model="SearchObj.dealState" placeholder="请选择处理状态">
				<el-option
					v-for="item in alarmStatusOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
		</div>
		<div class="form-item">
			<label for>有效性：</label>
			<el-select v-model="SearchObj.valided" placeholder="请选择有效性">
				<el-option
					v-for="item in valiteOptions"
					:key="item.typeStr"
					:label="item.typeName"
					:value="item.typeStr"
				></el-option>
			</el-select>
		</div>
		<div class="btn-group">
			<el-button type="primary" size="small" @click="query">查询</el-button>
			<span class="btn-text" @click="resetValue">重置</span>
		</div>
	</div>
</template>
<script>
export default {
  name: "BlacklistAlarmSearch",
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
      alarmStatusOptions: [],
      valiteOptions: [
        { typeName: "全部", typeStr: null },
        { typeName: "有效", typeStr: 1 },
        { typeName: "无效", typeStr: 0 }
      ],
      sourceOptions: [],
      SearchObj: {
        deviceName: null,
        reason: null,
        source: null,
        dealState: null,
        valided: null
      },
      alarmOptions: []
    };
  },
  mounted() {
    this.alarmOptions = this.$common.getEnumByGroupStr(
      "blacklist_trigger_reason"
    );
    this.alarmOptions.unshift({ typeName: "全部", typeStr: null });
    this.SearchObj.reason = this.alarmOptions[0].typeStr;

    this.sourceOptions = this.$common.getEnumByGroupStr("blacklistSource");
    this.sourceOptions.unshift({ typeName: "全部", typeStr: null });
    this.SearchObj.source = this.sourceOptions[0].typeStr;

    this.alarmStatusOptions = this.$common.getEnumByGroupStr("alarm_r");
    this.alarmStatusOptions.unshift({ typeName: "全部", typeStr: null });
    this.SearchObj.dealState = this.alarmStatusOptions[0].typeStr;
  },
  methods: {
    query() {
      console.log("注册时间：", this.SearchObj);
      this.$emit("query", this.SearchObj);
    },
    resetValue() {
      this.SearchObj = {
        deviceName: null,
        reason: null,
        blacklistSource: null,
        dealState: null,
        valided: null
      };
      this.$emit("query", this.SearchObj);
    }
  }
};
</script>

<style lang='scss'>
@import "@/style/variables.scss";
.BlacklistAlarmSearch {
	.input {
		input {
			@include input30;
		}
	}
}
</style>
<style lang="scss" scoped>
@import "@/style/variables.scss";
.BlacklistAlarmSearch {
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
