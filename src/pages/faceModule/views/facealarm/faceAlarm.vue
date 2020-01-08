<template>
	<div class="faceAlarmBg">
		<div class="facealarm">
			<el-row class="topBox" type="flex" justify="space-between">
				<div class="topBoxDiv topTitleTxt topBoxTaskBox">
					任务：
					<alPopverTree
						:treeDataList="taskItemList"
						:alPopoverClass="facealarmPopoverClass"
						:defaultProps="defaultProps"
						nodeKey="faceMonitorUuid"
						inputWidth="160px"
						@transferAct="transferTaskAct"
						ref="taskMonitorRef"
					></alPopverTree>
				</div>
				<div class="topBoxDeviceBox topBoxDiv topTitleTxt" style="text-align:left;">
					抓拍设备：
					<alPopverTree
						:treeDataList="DeviceTreeList"
						:alPopoverClass="facealarmPopoverClass"
						:defaultProps="defaultDeviceProps"
						nodeKey="channelUuid"
						inputWidth="160px"
						@transferAct="transferCheckedChannel"
						ref="DeviceRef"
					></alPopverTree>
				</div>
				<div class="topBoxDeviceBox topBoxDiv topTitleTxt" style="text-align:left;display:block">
					所属库：
					<alPopverTree
						:treeDataList="faceDBList"
						:alPopoverClass="facealarmPopoverClass"
						:defaultProps="faceDBDefaultProps"
						nodeKey="faceLibraryUuid"
						ref="faceLibRef"
						inputWidth="160px"
						@transferAct="transferCheckedFaceDB"
					></alPopverTree>
				</div>
				<div :span="4" class="topTitleTxt topBoxInputBox" style="text-align:left;display:block">
					姓名：
					<el-input placeholder v-model="staffName" />
				</div>
				<div :span="4" class="topTitleTxt topBoxInputBox" style="text-align:left;display:block">
					证件号：
					<el-input placeholder v-model="credentialNo" />
				</div>
				<div :span="4" class="topBoxDiv topBoxGenderRadioBtnBox">
					<span class="topTitleTxt" style="margin-right:15px;">性别:</span>
					<el-radio-group v-model="genderOption">
						<el-radio-button label>不限</el-radio-button>
						<el-radio-button label="male">男</el-radio-button>
						<el-radio-button label="female">女</el-radio-button>
					</el-radio-group>
				</div>
				<div class="topBoxDiv topBoxDateTimeBox">
					<span class="topTitleTxt" style="margin-right:15px;">时段：</span>
					<el-date-picker
						class="left-space"
						value-format="yyyy-MM-dd HH:mm:ss"
						v-model="startTime"
						type="datetime"
						placeholder="选择日期"
						@change="changeDate"
					></el-date-picker>
					<span class="facealarmTxt">至</span>
					<el-date-picker
						class="left-space"
						value-format="yyyy-MM-dd HH:mm:ss"
						v-model="endTime"
						type="datetime"
						placeholder="选择日期"
						@change="changeDate"
					></el-date-picker>
				</div>
				<div class="topBoxDiv topBoxDateRadioBtnBox">
					<el-radio-group style="margin-right:0px" v-model="selectDate" @change="selectDateAct">
						<el-radio-button label="today">今天</el-radio-button>
						<el-radio-button label="lastday">昨天</el-radio-button>
						<el-radio-button label="thisWeek">本周</el-radio-button>
						<el-radio-button label="thisMonth">本月</el-radio-button>
					</el-radio-group>
				</div>
				<div class="topBoxDeviceBox topBoxDiv topTitleTxt" style="text-align:left;display:block">
					状态：
					<el-select
						v-model="status"
						filterable
						@visible-change="selectvisiblechange"
						@change="selectChange"
						collapse-tags
						placeholder="全部"
						class="header-line-input"
					>
						<el-option
							v-for="item in statusOptions"
							:key="item.typeStr"
							:label="item.typeName"
							:value="item.typeStr"
						></el-option>
					</el-select>
				</div>
				<div :span="2" style="margin-top:-15px;">
					<el-button icon="el-icon-search" class="search-btn" @click="queryBtnAct" type="primary">查询</el-button>
					<el-button class="search-btn" @click="resetData" type="primary">重置</el-button>
				</div>
			</el-row>
			<div class="facealarm-table">
				<el-radio-group class="switchBtn" v-model="showindex" @change="changeIndex">
					<el-radio label="0">图片</el-radio>
					<el-radio label="1">列表</el-radio>
				</el-radio-group>
				<component
					:is="['theFaceAlarmImageTable','faceAlarmTable'][showindex]"
					:pageSize="pageSize"
					:pageNow="pageNow"
					:pageCount="pageCount"
					:tableData="tableData"
					:isloading="isloading"
					@lookAlarmDetail="lookAlarmDetail"
					@pagechange="pagechange"
				></component>
				<el-dialog
					class="dialogClass"
					:close-on-click-modal="false"
					:visible.sync="faceImgDialogVisible"
					@close="faceImgDialogVisible=false"
					v-dialogDrag
					title="报警详情"
				>
					<AlarmDetailDialog
						v-loading="dialogfullscreenLoading"
						element-loading-background="rgba(0, 0, 0, 0.8)"
						:dialogParama="detail"
					></AlarmDetailDialog>
				</el-dialog>
				<!-- <the-face-alarm-dialog
				title="报警详情"
				:detail="detail"
				:detail2="detail2"
				:facearr="facearr"
				:alarminfoid="alarminfoid"
				:faceDBDialogVisible="faceImgDialogVisible"
				@close="facealarmvisible=false"
				></the-face-alarm-dialog>-->
				<!-- <face-img-dialog :visible.sync="faceImgDialogVisible" :faceImgDialogData="detail" /> -->
			</div>
		</div>
	</div>
</template>

<script>
import elPopverTree from "@/pages/faceModule/components/ElPopverTree.vue";
import FaceImgDialog from "@/pages/faceModule/components/FaceImgDialog.vue";
import alPopverTree from "@/pages/faceModule/components/AlElTree.vue";
import AlarmDetailDialog from "@/pages/faceModule/components/AlarmDetailDialog.vue";
import TheFaceAlarmDialog from "@/pages/faceModule/views/facealarm/basic/TheFaceAlarmDialog.vue";
import faceAlarmTable from "@/pages/faceModule/views/facealarm/basic/TheFaceAlarmTable.vue";
import theFaceAlarmImageTable from "@/pages/faceModule/views/facealarm/basic/TheFaceAlarmImageTable.vue";
import * as api from "@/pages/faceModule/http/logSearchHttp.js";
import RestApi from "@/utils/RestApi.js";
export default {
  name: "facealarm",
  components: {
    faceAlarmTable,
    theFaceAlarmImageTable,
    TheFaceAlarmDialog,
    elPopverTree,
    alPopverTree,
    FaceImgDialog,
    AlarmDetailDialog
  },
  data() {
    return {
      dialogfullscreenLoading: false,
      imageHeader: RestApi.api.imageUrl,
      isIndeterminate: false,
      checkTaskAll: true,
      faceImgDialogVisible: false,
      checkLibAll: true,
      facealarmPopoverClass: "facealarmPopoverClass",
      faceDBDefaultProps: {
        label: "faceLibraryName",
        children: "children"
      },
      defaultProps: {
        children: "children",
        label: "faceMonitorName"
      },
      defaultDeviceProps: { children: "children", label: "channelName" },
      alarminfoid: "",
      startTime: null,
      endTime: null,
      devicearr: [],
      devicename: [],
      alarmtype: [],
      belongtoarr: [],
      belongto: [],
      statusarr: [],
      status: null,
      pageSize: 12,
      pageNow: 1,
      pageCount: 0,
      imagePageSize: 12,
      imagePageNow: 1,
      tableData: [],
      showindex: "0",
      statusOptions: [],
      staffName: null,
      credentialNo: null,
      isloading: false,
      facealarmvisible: false,
      genderOption: null,
      detail: {
        zhuapaiurl: null,
        zhuapaiaddress: null,
        zhuapaitime: null,
        tezheng: null,
        taskName: null,
        jindu: 80,
        kuurl: null,
        belong: null,
        staffName: null,
        sex: null,
        huji: null,
        minzu: null,
        bir: null,
        cardtype: null,
        credentialNo: null
      },
      detail2: {},
      defaultHeader: require("@/assets/user.png"),
      facearr: [],
      idtypetranslatearr: [],
      taskItemList: [], // 布控任務列表
      checkedTaskUuidList: [],
      checkedTaskObj: [],
      checkedTaskNameString: "",
      DeviceTreeList: [],
      checkedChannelsUuidList: [],
      faceDBList: [],
      checkedFaceUuidList: [],
      checkedFaceLibObj: [],
      checkFaceDBNameString: "对比人脸库",
      selectDate: null
    };
  },
  fiters: {},
  activated() {
    console.log("activated");
    this.getTaskList();
  },
  mounted() {
    console.log("mounted");
    this.startTime = this.$common.getStartTime();
    this.endTime = this.$common.getCurrentTime();
    this.statusOptions = this.$common.getEnumByGroupStr("alarm_r");
    this.getTaskList(false);
  },
  watch: {
    checkedTaskUuidList: function(newVal, oldVal) {
      if (!newVal) return;
      this.checkTaskAll = newVal.length === this.taskItemList.length;
    },
    checkedFaceUuidList: function(newVal, oldVal) {
      if (!newVal) return;
      this.checkLibAll = newVal.length === this.faceDBList.length;
    }
  },
  methods: {
    // 获取布控任务
    getTaskList(isTrue) {
      api
        .getTaskList()
        .then(res => {
          if (res.data.success) {
            this.taskItemList = res.data.data || [];
            this.checkedTaskUuidList = [];
            for (var i = 0; i < this.taskItemList.length; i++) {
              var tempTask = this.taskItemList[i];
              this.checkedTaskUuidList.push(tempTask.faceMonitorUuid);
            }
            this.getFaceLibsAndDeviceList(this.checkedTaskUuidList);
            if (!isTrue) {
              this.currentPage = 1;
              this.queryBtnAct(true);
            }
          } else {
            this.$message({ message: "请求布控任务列表错误", type: "warning" });
          }
        })
        .catch(() => {});
    },
    changeDate() {
      this.selectDate = null;
    },
    selectDateAct(dateStr) {
      console.log(dateStr);
      let day = new Date();
      switch (dateStr) {
        case "lastday":
          day.setDate(day.getDate() - 1);
          let str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          this.startTime = str + " " + "00:00:00";
          this.endTime = str + " " + "23:59:59";
          break;
        case "today":
          str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          this.startTime = str + " " + "00:00:00";
          this.endTime = str + " " + "23:59:59";
          break;
        case "thisWeek":
          let weekday = day.getDay();
          let today = day.getDate();
          let month = day.getMonth();
          let firstDay = null;
          // month默认从0开始，则判断不是月初，则月份+1
          if (today - weekday) {
            month += 1;
            firstDay = today - weekday;
          } else {
            // 月初 则向前退weekday - today天
            // 判断 月大 月小
            let lastMonthDays =
							[1, 3, 5, 7, 8, 10, 12].indexOf(month + 1) > -1 ? 31 : 30;
            firstDay = lastMonthDays - weekday + today;
          }
          let firstdate = new Date(day.getFullYear(), month - 1, firstDay);
          firstdate = this.$common.timestampToFormatter(
            firstdate,
            "yyyy-mm-dd"
          );
          let enddate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          );
          enddate = this.$common.timestampToFormatter(enddate, "yyyy-mm-dd");
          this.startTime = firstdate + " " + "00:00:00";
          this.endTime = enddate + " " + "23:59:59";
          break;
        case "thisMonth":
          day.setDate(1);
          firstdate = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          enddate = this.$common.timestampToFormatter(
            new Date().getTime(),
            "yyyy-mm-dd"
          );
          this.startTime = firstdate + " " + "00:00:00";
          this.endTime = enddate + " " + "23:59:59";
          break;
      }
      console.log(this.startTime, "-----", this.endTime);
    },
    transferCheckedFaceDB(val) {
      console.log("人脸库：", val);
      this.checkedFaceUuidList = val;
    },
    transferTaskAct(val) {
      console.log("布控任务：", val);
      this.checkedTaskUuidList = val;
      let arr = JSON.parse(JSON.stringify(val));
      this.getFaceLibsAndDeviceList(arr);
    },
    transferCheckedChannel(checkedChannel) {
      console.log("设备列表：", checkedChannel);
      this.checkedChannelsUuidList = checkedChannel;
    },
    // 根据布控Uuid查询相关的人脸库和设备通道
    getFaceLibsAndDeviceList(taskuuidList) {
      console.log(taskuuidList);
      if (!taskuuidList.length) {
        for (var i = 0; i < this.taskItemList.length; i++) {
          var tempTask = this.taskItemList[i];
          taskuuidList.push(tempTask.faceMonitorUuid);
        }
      }
      this.faceDBList = [];
      this.DeviceTreeList = [];
      taskuuidList.forEach(item => {
        console.log("------", item);
        this.getMonitoringTaskDetails(item);
      });
    },
    // 查询布控任务详情
    getMonitoringTaskDetails(faceMonitorUuid) {
      api
        .getTaskDeatailChannelAndLib(faceMonitorUuid)
        .then(res => {
          if (res.data.success && res.data.data) {
            console.log(res.data.data);
            this.faceDBList.push(
              ...res.data.data.libraryList.filter(item => {
                return !this.faceDBList.some(iObj => {
                  return iObj.faceLibraryUuid === item.faceLibraryUuid;
                });
              })
            );
            this.DeviceTreeList.push(
              ...res.data.data.channelList.filter(item => {
                return !this.DeviceTreeList.some(iObj => {
                  return iObj.channelUuid === item.channelUuid;
                });
              })
            );
          }
        })
        .catch(() => {});
    },
    // 查询按钮响应事件
    queryBtnAct() {
      this.init();
      if (this.startTime && this.endTime) {
        /* eslint-disable */
				var d1 = new Date(this.startTime.replace(/\-/g, "/"));
				var d2 = new Date(this.endTime.replace(/\-/g, "/"));
				/* eslint-enable */
        if (this.startTime !== "" && this.endTime !== "" && d1 >= d2) {
          this.$message({
            message: "开始时间必须小于结束时间！",
            type: "warning"
          });
          return;
        }
        this.pageNow = 1; // 点击搜索条件变更,当前页设置为第一页
        this.ajaxdata();
      } else {
        this.$message({
          message: "查询时间不能为空！",
          type: "warning"
        });
      }
    },
    // 条件重置
    resetData() {
      this.staffName = null;
      this.credentialNo = null;
      this.status = null;
      this.checkedTaskUuidList = [];
      this.checkedFaceUuidList = [];
      this.checkedChannelsUuidList = [];
      this.genderOption = null;
      this.startTime = this.$common.getStartTime();
      this.endTime = this.$common.getCurrentTime();
      this.selectDate = null;
      this.$refs.taskMonitorRef.clearAction();
      this.$refs.DeviceRef.clearAction();
      this.$refs.faceLibRef.clearAction();
    },
    lookAlarmDetail(detail) {
      this.detail = detail;
      this.getAlarmShootPhotoList(detail);
    },
    // 根据客户端的传的人员staffUuid查找抓拍图片
    getAlarmShootPhotoList(rowData, currentPage = 1, pageSize = 24) {
      this.updatedFlag = true;
      var data = {
        faceUuid: rowData.faceUuid,
        triggerFaceMonitor: 1,
        limit: 8,
        page: 1
      };
      this.dialogfullscreenLoading = true;
      this.dialogVisible = !this.dialogVisible;
      api
        .getRecognizeInfo(data)
        .then(res => {
          this.dialogfullscreenLoading = false;
          this.faceImgDialogVisible = !this.faceImgDialogVisible;
          if (res.data.success) {
            console.log(res.data.data);
            this.detail.showImg = false;
            this.detail = res.data.data;
          }
        })
        .catch(() => {
          this.dialogfullscreenLoading = false;
          this.faceImgDialogVisible = !this.faceImgDialogVisible;
        });
    },
    changeIndex(index) {
      this.showindex = index;
      this.pageSize = index === "1" ? 13 : 12;
      this.ajaxdata();
    },
    init() {},
    ajaxdata() {
      this.isloading = true;
      let data = {
        staffName: this.staffName,
        credentialNo: this.credentialNo,
        dealState: this.status,
        faceMonitorUuid: this.checkedTaskUuidList.toString(),
        faceLibraryUuids: this.checkedFaceUuidList.toString(),
        channelUuid: this.checkedChannelsUuidList.toString(),
        alarmDatetimeBegin: this.startTime,
        alarmDatetimeEnd: this.endTime,
        page: this.pageNow,
        limit: this.pageSize,
        gender: this.genderOption,
        credentialType: null
      };
      // 过滤空字符串
      if (!data.channelUuids) data.channelUuids = null;
      if (!data.faceMonitorUuid) data.faceMonitorUuid = null;
      if (!data.faceLibraryUuids) data.faceLibraryUuids = null;
      if (!data.gender) data.gender = null;
      if (!data.staffName) data.staffName = null;
      if (!data.credentialNo) data.credentialNo = null;
      api
        .getAlarmList(data)
        .then(res => {
          this.isloading = false;
          this.tableData = [];
          this.pageCount = 0;
          if (res.data.success && res.data.data && res.data.data.list) {
            this.pageCount = res.data.data.total;
            this.tableData = res.data.data.list;
          }
        })
        .catch(err => {
          console.log(err);
          this.isloading = false;
        });
    },
    pagechange(index) {
      this.pageNow = index;
      this.ajaxdata();
    },
    selectvisiblechange() {},
    selectChange() {
      this.ajaxdata();
    },
    getStartTime() {
      var new111 = new Date();
      var hours = new111.getHours();
      if (hours > 1) {
        return (
          new111.getFullYear() +
					"-" +
					addZero(new111.getMonth() + 1) +
					"-" +
					addZero(new111.getDate()) +
					" " +
					addZero(hours - 1) +
					":" +
					addZero(new111.getMinutes()) +
					":" +
					addZero(new111.getSeconds())
        );
      } else {
        return (
          new111.getFullYear() +
					"-" +
					addZero(new111.getMonth() + 1) +
					"-" +
					addZero(new111.getDate()) +
					" " +
					"00:00:00"
        );
      }
      function addZero(num) {
        if (num < 10) return "0" + num;
        return num;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>

<style>
.facealarm .topBoxInputBox {
	width: 220px;
	padding-bottom: 20px;
}
.facealarm .topBoxInputBox .el-input {
	width: 160px;
}
.facealarm .el-input--prefix .el-input__inner {
	padding-left: 10px;
}
.facealarm .el-input--suffix .el-input__inner {
	padding-right: 10px;
}

.facealarm .el-button {
	line-height: 1;
	background: transparent;
	border: 0;
	/* color: #efefef; */
	color: #26d39d;
	text-align: center;
	box-sizing: border-box;
	outline: 0;
	margin: 0;
	font-weight: 500;
	padding: 12px 20px;
	font-size: 14px;
	border-radius: 4px;
}
.facealarm .el-input__prefix {
	left: 110%;
	-webkit-transform: translateX(-200%);
	transform: translateX(-200%);
}
.facealarm .facealarmTxt {
	color: rgba(255, 255, 255, 0.15);
}
.facealarm .el-checkbox-button__inner,
.facealarm .el-radio-button__inner {
	background: rgba(255, 255, 255, 0.1);
	color: #ffffff;
	margin-right: 9px;
	border: 0;
	padding: 8px 20px;
	font-size: 13px;
}
.facealarm .el-checkbox-button:first-child .el-checkbox-button__inner,
.facealarm .el-radio-button:first-child .el-radio-button__inner {
	border: 0;
	/* margin-left: 30px; */
}
.facealarm .el-button--primary {
	background: rgba(40, 255, 187, 0.15);
	border: 1px solid rgba(32, 204, 150, 0.8);
	border-radius: 3px;
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #ffffff;
	/* margin-left: 8%; */
}
.facealarm .topBoxDateRadioBtnBox {
	min-width: 310px;
}
.facealarm .topBoxGenderRadioBtnBox {
	min-width: 250px;
}
.facealarm .el-checkbox-button.is-checked .el-checkbox-button__inner,
.facealarm .el-radio-button__orig-radio:checked + .el-radio-button__inner {
	background: rgba(40, 255, 187, 0.1);
	border-radius: 2px;
	border-radius: 2px;
	border: 0;
	box-shadow: 0px 0 0 0 #26d39d;
}
.facealarm .topBoxDeviceBox {
	min-width: 240px;
}
.facealarm .topBoxTaskBox {
	min-width: 240px;
}
.facealarm .topBoxQualityCheckBox {
	min-width: 360px;
}
.facealarm .el-checkbox-group {
	display: inline-block;
}
.facealarm .topTitleTxt {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
	text-align: left;
}
.facealarm .topBoxDiv {
	padding-bottom: 20px;
}
.facealarm .topBox {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	padding: 25px 40px 0px 27px;
	background: rgba(36, 39, 42, 1);
	border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
	/* overflow-y: auto; */
	box-sizing: border-box;
}
.facealarm .el-input--prefix .el-input__inner {
	padding: 0px 10px;
}
.facealarmPopoverClass .is-checked .el-checkbox__inner,
.facealarmPopoverClass
	.el-checkbox__input.is-indeterminate
	.el-checkbox__inner {
	background-color: transparent;
	border-color: #28ffbb;
	/* color:#28FFBB; */
}
.facealarmPopoverClass .el-checkbox__inner::after {
	-webkit-box-sizing: content-box;
	box-sizing: content-box;
	content: "";
	border: 1px solid #28ffbb;
	border-left: 0;
	border-top: 0;
	height: 7px;
	left: 4px;
	position: absolute;
	top: 1px;
	-webkit-transform: rotate(45deg) scaleY(0);
	transform: rotate(45deg) scaleY(0);
	width: 3px;
	transform-origin: center;
}
.facealarmPopoverClass .el-checkbox__inner {
	display: inline-block;
	position: relative;
	border: 1px solid #dcdfe6;
	border-radius: 2px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	width: 14px;
	height: 12px;
	background-color: transparent;
	z-index: 1;
}

.facealarmPopoverClass
	.el-tree--highlight-current
	.el-tree-node.is-current
	> .el-tree-node__content {
	background-color: transparent;
}
.facealarmPopoverClass .el-tree,
.facealarmPopoverClass .el-tree {
	position: relative;
	cursor: default;
	background: #202127;
	color: #efefee;
}
.facealarmPopoverClass {
	position: absolute;
	background: #202127;
	min-width: 150px;
	/* border: 1px solid rgba(40,255,187, 1); */
	padding: 12px;
	z-index: 2000;
	color: #606266;
	line-height: 1.4;
	text-align: justify;
	font-size: 14px;
	-webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	max-height: 80%;
	overflow: auto;
}

.facealarmPopoverClass .el-tree-node__content:hover {
	background-color: #000000;
	/* color: #; */
}
.facealarm .elCardBoxHeaders {
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	padding-bottom: 12px;
	padding: 9px 15px;
	/* background: rgba(227, 53, 53, 0.8); */
}
.facealarmPopoverClass .el-tree {
	color: #aaaaaa;
	background: none;
}
.facealarmPopoverClass .el-tree-node__content:hover {
	background: none;
}
.facealarmPopoverClass .el-tree-node:focus > .el-tree-node__content {
	background: none;
	/* color: #28FFBB; */
}
.facealarmPopoverClass {
	width: 50%;
	height: 50%;
	position: absolute;
	background: #202127;
	min-width: 150px;
	/* border: 1px solid rgba(40,255,187, 1); */
	padding: 12px;
	z-index: 2000;
	color: #606266;
	line-height: 1.4;
	text-align: justify;
	font-size: 14px;
	-webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	max-height: 80%;
	overflow: auto;
}
</style>
