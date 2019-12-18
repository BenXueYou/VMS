<template>
	<div class="SearchLog">
		<div class="form-item">
			<label for>账号：</label>
			<el-input class="input" v-model="SearchObj.accountName"></el-input>
		</div>
		<div class="form-item">
			<label for>模块：</label>
			<el-select v-model="SearchObj.modelName" placeholder="请选择验证">
				<el-option
					v-for="item in modelNameOptions"
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
      modelNameOptions: [{ typeName: "全部", typeStr: null }],
      eventTypeOptions: [],
      resultOptions: [
        { typeName: "全部", typeStr: null },
        { typeName: "成功", typeStr: 0 },
        { typeName: "失败", typeStr: 1 }
      ],
      SearchObj: {
        IP: null,
        modelName: null,
        eventType: null,
        openDoorResult: null,
        verifyResult: null,
        accountName: null
      },
      setEvents: [
        { typeName: "全部", typeStr: null },
        { typeName: "设备管理", typeStr: "设备管理" },
        { typeName: "单位管理", typeStr: "单位管理" },
        { typeName: "楼栋房屋", typeStr: "楼栋房屋" },
        { typeName: "居民管理", typeStr: "居民管理" },
        { typeName: "员工管理", typeStr: "员工管理" },
        { typeName: "用户管理", typeStr: "用户管理" },
        { typeName: "门禁管理", typeStr: "门禁管理" },
        { typeName: "访客管理", typeStr: "访客管理" },
        { typeName: "视频预览", typeStr: "视频预览" },
        { typeName: "人脸识别", typeStr: "人脸识别" },
        { typeName: "视频回放", typeStr: "视频回放" }
      ],
      operationEvents: [
        { typeName: "全部", typeStr: null },
        { typeName: "视频预览", typeStr: "视频预览" },
        { typeName: "视频回放", typeStr: "视频回放" },
        { typeName: "门禁管理", typeStr: "门禁管理" },
        { typeName: "访客管理", typeStr: "访客管理" },
        { typeName: "人脸识别", typeStr: "人脸识别" }
      ],
      setLogEventEnum: [
        { typeName: "全部", typeStr: null },
        { typeName: "增加", typeStr: "add" },
        { typeName: "修改", typeStr: "edit" },
        { typeName: "删除", typeStr: "delete" },
        { typeName: "查看", typeStr: "query" },
        { typeName: "导入", typeStr: "input" },
        { typeName: "导出", typeStr: "export" },
        { typeName: "移动", typeStr: "move" },
        { typeName: "移出", typeStr: "move_out" },
        { typeName: "下发数据", typeStr: "data_distribution" },
        { typeName: "统计", typeStr: "statistics" },
        { typeName: "批量升级", typeStr: "batch_upgrade" }
      ],
      operationLogEventEnum: [
        { typeName: "全部", typeStr: null },
        { typeName: "查看", typeStr: "query" },
        { typeName: "开关门", typeStr: "open_close_door" },
        { typeName: "消警", typeStr: "remove_alarm" },
        { typeName: "实时预览", typeStr: "real_time_preview" },
        { typeName: "云台控制", typeStr: "pan_tilt_control" },
        { typeName: "本地录像", typeStr: "local_video" },
        { typeName: "图像调节", typeStr: "image_adjustment" },
        { typeName: "抓图", typeStr: "snapshot" },
        { typeName: "码流切换", typeStr: "stream_switching" },
        { typeName: "录像回放", typeStr: "video_replay" },
        { typeName: "录像下载", typeStr: "video_download" },
        { typeName: "常开常闭", typeStr: "normallyopen_normallyclosed" },
        { typeName: "人脸预览", typeStr: "face_preview" },
        { typeName: "订阅", typeStr: "subscribe" }
      ]
    };
  },
  mounted() {
    this.SearchObj.verifyResult = this.resultOptions[0].typeStr;
    this.SearchObj.openDoorResult = this.resultOptions[0].typeStr;
    // this.setLogEventEnum = this.$common.getEnumByGroupStr("auth_door");
    console.log("setLogEventE===", this.$common.getEnumByGroupStr("auth_door"));
    console.log(
      "setLogEventE===",
      this.$common.getEnumByGroupStr("auth_alarm")
    );
    // this.$common.getEnumByGroupStr("nation")
    console.log(this.$common.getEnumByGroupStr("nation"));
    // this.eventTypeOptions = this.$common.getEnumByGroupStr("setLogEventEnum");
    this.eventTypeOptions.unshift({ typeName: "全部", typeStr: null });
    this.SearchObj.modelName = this.modelNameOptions[0].typeStr;
    // this.eventTypeOptions = this.$common.getEnumByGroupStr(
    //   "config"
    // );
    // this.eventTypeOptions.unshift({ typeName: "全部", typeStr: null });
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
        modelName: this.modelNameOptions[0].typeStr,
        eventType: this.eventTypeOptions[0].typeStr,
        verifyResult: this.resultOptions[0].typeStr,
        openDoorResult: this.resultOptions[0].typeStr,
        accountName: this.resultOptions[0].typeStr
      };
      this.$emit("query", this.SearchObj);
    }
  },
  watch: {
    visible(val) {
      if (sessionStorage.getItem("eventType") === "set") {
        this.modelNameOptions = this.setEvents;
        this.eventTypeOptions = this.setLogEventEnum;
        // this.SearchObj.modelName = this.modelNameOptions[0].typeStr;
      } else if (sessionStorage.getItem("eventType") === "operation") {
        this.modelNameOptions = this.operationEvents;
        this.eventTypeOptions = this.operationLogEventEnum;
        // this.SearchObj.modelName = this.modelNameOptions[0].typeStr;
      }
    }
    // initSelectData(val){
    //   this.formatData();
    // },
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
