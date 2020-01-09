<template style="background-color:#0C0F1E">
	<el-row ref="compareRecordHeight" class="CompareRecord">
		<el-row class="topBox" type="flex" justify="space-between">
			<div class="topBoxDiv topTitleTxt topBoxTaskBox">
				任务：
				<alPopverTree
					:treeDataList="taskItemList"
					:alPopoverClass="CRTaskPopoverClass"
					:defaultProps="defaultProps"
					nodeKey="faceMonitorUuid"
					inputWidth="160px"
					@transferAct="transferTaskAct"
				></alPopverTree>
			</div>
			<div class="topBoxDeviceBox topBoxDiv topTitleTxt" style="text-align:left;">
				抓拍设备：
				<alPopverTree
					:treeDataList="DeviceTreeList"
					:alPopoverClass="CRTaskPopoverClass"
					:defaultProps="defaultDeviceProps"
					nodeKey="channelUuid"
					inputWidth="160px"
					ref="CPDeviceRef"
					@transferAct="transferCheckedChannel"
				></alPopverTree>
			</div>
			<div class="topBoxDeviceBox topBoxDiv topTitleTxt" style="text-align:left;display:block">
				所属库：
				<alPopverTree
					:treeDataList="faceDBList"
					:alPopoverClass="CRTaskPopoverClass"
					:defaultProps="faceDBDefaultProps"
					nodeKey="faceLibraryUuid"
					inputWidth="160px"
					@transferAct="transferAct"
				></alPopverTree>
			</div>
			<div :span="4" class="topTitleTxt topBoxInputBox" style="text-align:left;display:block">
				姓名：
				<el-input placeholder v-model="staffName" />
			</div>
			<div :span="4" class="topTitleTxt topBoxInputBox" style="text-align:left;display:block">
				证件号：
				<el-input placeholder v-model="certificateNum" />
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
					@change="selectDate=null"
				></el-date-picker>
				<span class="compareRecordTxt">至</span>
				<el-date-picker
					class="left-space"
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="endTime"
					type="datetime"
					placeholder="选择日期"
					@change="selectDate=null"
				></el-date-picker>
				<div class="topBoxDiv topBoxDateRadioBtnBox" style="display:inline-block;padding-bottom:0px">
					<el-radio-group style="margin-right:0px" v-model="selectDate" @change="selectDateAct">
						<el-radio-button label="today">今天</el-radio-button>
						<el-radio-button label="lastday">昨天</el-radio-button>
						<el-radio-button label="thisWeek">本周</el-radio-button>
						<el-radio-button label="thisMonth">本月</el-radio-button>
					</el-radio-group>
				</div>
			</div>
			<div :span="2" style="margin-top:-15px;">
				<el-button icon="el-icon-search" class="search-btn" @click="queryAct" type="primary">查询</el-button>
				<el-button class="search-btn" @click="resetQueryAct" type="primary">重置</el-button>
			</div>
		</el-row>
		<div
			ref="compareMiddleHeight"
			v-loading="mainScreenLoading"
			element-loading-background="rgba(0, 0, 0, 0.8)"
			class="reccordBoxClass"
		>
			<div
				class="elCardBoxClass"
				v-for="(item, index) in totalCompareItemList"
				@dblclick="doComparethis(index)"
				:key="index"
			>
				<recoginize-card
					imgWidth="90"
					:recoginizeItem="totalCompareItemList[index]"
					@detailClick="doComparethis(index)"
				/>
			</div>
		</div>
		<!-- ==========				:close-on-click-modal="false"
		v-dialogdrag============================================= 弹 窗 ==========================================================-->
		<el-dialog
			class="dialogClass"
			:close-on-click-modal="false"
			:visible.sync="dialogVisible"
			@close="closeDialog"
			v-dialogDrag
			title="对比详情"
		>
			<dialogview
				v-loading="dialogfullscreenLoading"
				element-loading-background="rgba(0, 0, 0, 0.8)"
				:dialogParama="dialogParama"
				:shootPhotoList="shootPhotoList"
				:showImg="showImg"
				@cs="changeShowStatus"
			></dialogview>
		</el-dialog>
		<!-- ======================================================= 分页器 ========================================================== -->
		<el-row ref="footerHeight" class="bottomBox" type="flex" justify="flex-end">
			<el-col :span="24" class="footerPages" style="text-align:right">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					layout="total,prev, pager, next,jumper"
					:page-size="pageSize"
					:total="total"
					background
				></el-pagination>
			</el-col>
		</el-row>
	</el-row>
</template>
<script>
import dialogview from "@/pages/faceModule/components/dialogForm.vue";
import elPopverTree from "@/pages/faceModule/components/ElPopverTree.vue";
import alPopverTree from "@/pages/faceModule/components/AlElTree.vue";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
import RecoginizeCard from "@/pages/faceModule/components/RecoginizeCard.vue";
import * as api from "@/pages/faceModule/http/logSearchHttp.js";
export default {
  components: { dialogview, elPopverTree, alPopverTree, RecoginizeCard },
  mounted: function() {
    let h =
			window.innerHeight ||
			document.documentElement.clientHeight ||
			document.body.clientHeight;
    let w =
			window.innerWidth ||
			document.documentElement.clientWidth ||
			document.body.clientWidth;
    console.log(w);
    h = h - 65;
    this.$refs.compareRecordHeight.$el.style.height = h + "px";
    // 当窗口发生变化时
    let that = this;
    window.addEventListener("resize", function() {
      let h =
				window.innerHeight ||
				document.documentElement.clientHeight ||
				document.body.clientHeight;
      let w =
				window.innerWidth ||
				document.documentElement.clientWidth ||
				document.body.clientWidth;
      h = h - 65;
      console.log(w);
      that.$refs.compareRecordHeight.$el.style.height = h + "px";
    });
    this.startTime = this.$common.getStartTime();
    this.endTime = this.$common.getCurrentTime();
    this.getTaskList();
  },
  activated: function() {
    this.deactivated = false;
  },
  deactivated: function() {
    this.deactivated = true;
    console.log("------deactivated------");
  },
  watch: {
    DeviceTreeList(val) {
      this.checkedChannelsUuidList = val.map(item => {
        return item.channelUuid;
      });
    },
    faceDBList(val) {
      this.checkedFaceUuidList = val.map(item => {
        return item.faceLibraryUuid;
      });
    }
  },
  methods: {
    resetQueryAct() {
      this.checkedChannelsUuidList = []; // string[]抓拍设备否
      this.checkedTaskUuidList = []; // string[]布控任务否
      this.checkedFaceUuidList = []; // string[]人脸库否
      this.staffName = null; // string人员姓名否
      this.certificateNum = null; // string证件号码否
      this.genderOption = ""; // string抓拍性别否
      this.startTime = this.$common.getStartTime();
      this.endTime = this.$common.getCurrentTime();
      this.selectDate = null;
      this.$refs.DeviceRef.clearAction();
    },
    transferAct(transferArray) {
      this.checkedFaceUuidList = transferArray;
    },
    transferTaskAct(transferArray) {
      this.checkedTaskUuidList = transferArray;
      let arr = JSON.parse(JSON.stringify(transferArray));
      this.getFaceLibsAndDeviceList(arr);
    },
    changeShowStatus(flag) {
      this.showImg = flag;
    },
    // 根据任务id获取设备树和人脸库
    getFaceLibsAndDeviceList(faceMonitorUuidList) {
      if (!faceMonitorUuidList.length) {
        for (var i = 0; i < this.taskItemList.length; i++) {
          var tempTask = this.taskItemList[i];
          faceMonitorUuidList.push(tempTask.faceMonitorUuid);
        }
      }
      this.faceDBList = [];
      this.DeviceTreeList = [];
      faceMonitorUuidList.forEach(faceMonitorUuid => {
        this.getMonitoringTaskDetails(faceMonitorUuid);
      });
    },
    // 查询布控任务详情
    getMonitoringTaskDetails(taskUuid) {
      api
        .getTaskDeatailChannelAndLib(taskUuid)
        .then(res => {
          if (res.data.success && res.data.data) {
            let arr = res.data.data;
            this.faceDBList.push(
              ...arr.libraryList.filter(item => {
                return !this.faceDBList.some(i => {
                  return i.faceLibraryUuid === item.faceLibraryUuid;
                });
              })
            );
            this.DeviceTreeList.push(
              ...arr.channelList.filter(item => {
                return !this.DeviceTreeList.some(im => {
                  return im.channelUuid === item.channelUuid;
                });
              })
            );
          }
        })
        .catch(() => {});
    },
    transferCheckedChannel(checkedChannel) {
      this.checkedChannelsUuidList = checkedChannel;
    },
    // 点击查询按钮
    queryAct() {
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
        this.total = 0;
        this.currentPage = 1;
        this.getCompareRecordList();
      } else {
        this.$message({
          message: "查询时间不能为空！",
          type: "warning"
        });
      }
    },

    // 获取数据
    getCompareRecordList() {
      this.mainScreenLoading = true;
      var data = {
        limit: this.pageSize, // int每页显示行数是
        page: this.currentPage, // int第几页是
        channelUuids: this.checkedChannelsUuidList.toString(), // string[]抓拍设备否
        faceMonitorUuids: this.checkedTaskUuidList.toString(), // string[]布控任务否
        faceLibraryUuids: this.checkedFaceUuidList.toString(), // string[]人脸库否
        staffName: this.staffName, // string人员姓名否
        credentialNo: this.certificateNum, // string证件号码否
        genderCapture: this.genderOption, // string抓拍性别否
        snapshotTimeStart: this.startTime, // string抓拍时间启否
        snapshotTimeEnd: this.endTime
      };
      // 过滤空字符串
      if (!data.channelUuids) data.channelUuids = null;
      if (!data.faceMonitorUuids) data.faceMonitorUuids = null;
      if (!data.faceLibraryUuids) data.faceLibraryUuids = null;
      if (!data.genderCapture) data.genderCapture = null;
      api
        .getRecognizeList(data)
        .then(res => {
          this.mainScreenLoading = !this.mainScreenLoading;
          if (res.data.success && res.data.data && res.data.data.list) {
            this.totalCompareItemList = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(() => {
          this.mainScreenLoading = !this.mainScreenLoading;
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`点击当前页: ${val}`);
      this.currentPage = val;
      this.getCompareRecordList();
    },
    // 关闭详情弹窗的事件
    closeDialog(e) {
      this.showImg = false;
      this.dialogVisible = e;
    },
    // 点击详情的事件
    doComparethis(e) {
      this.getAlarmShootPhotoList(this.totalCompareItemList[e]);
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
          if (res.data.success) {
            console.log(res.data.data);
            this.dialogParama.showImg = false;
            this.dialogParama = res.data.data;
          }
        })
        .catch(() => {
          this.dialogfullscreenLoading = false;
          this.dialogVisible = !this.dialogVisible;
        });
    },
    // 获取任务列表
    getTaskList(isTrue = true) {
      this.checkedTaskUuidList = [];
      api
        .getTaskList()
        .then(res => {
          if (res.data.success) {
            this.taskItemList = res.data.data;
            for (var i = 0; i < this.taskItemList.length; i++) {
              var tempTask = this.taskItemList[i];
              this.checkedTaskUuidList.push(tempTask.faceMonitorUuid);
            }
            this.getFaceLibsAndDeviceList(this.checkedTaskUuidList);
            if (isTrue) {
              this.currentPage = 1;
              this.totalCompareItemList = [];
              this.queryAct(true);
            }
          } else {
            this.$message({ message: "请求布控任务列表错误", type: "warning" });
          }
        })
        .catch(() => {});
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
    // 鼠标划过覆盖的hover弹窗事件
    mymouseover: event => {
      mouseover(event);
    },
    mymouseout(event) {
      mouseout(event);
    },
    mymousemove(event) {
      mousemove(event);
    }
  },
  data() {
    return {
      selectDate: null,
      CRTaskPopoverClass: "CRTaskPopoverClass",
      CompareRecordPopoverClass: "CompareRecordPopoverClass",
      totalCompareItemList: new Array(),
      api: this.$store.state.api, // http://172.20.10.11:5000/mppr-face
      checkedChannelsUuidList: [], // 当前勾选的通道Id的list
      taskItemList: [], // 布控任務列表
      mainScreenLoading: false, // 局部遮罩是否显示
      pageSize: 16,
      total: 0,
      currentPage: 1,
      startTime: "",
      endTime: "",
      dialogVisible: false, // 彈窗顯示標記
      dialogParama: {},
      shootPhotoList: [],
      defaultProps: {
        label: "faceMonitorName"
      },
      faceDBDefaultProps: {
        label: "faceLibraryName"
      },
      defaultDeviceProps: {
        label: "channelName"
      },
      checkedTaskNameString: "",
      checkNameString: "全部设备",
      faceDBList: [],
      checkedFaceDB: [],
      allFaceDBUuid: [],
      checkFaceDBNameString: "对比人脸库",
      checkedTaskUuidList: [],
      checkedFaceUuidList: [],
      checkedFaceLibObj: [],
      checkedChannelObj: [],
      checkedTaskObj: [],
      showImg: false,
      deactivated: false,
      DeviceTreeList: [], // 设备树
      initArr: [],
      isIndeterminate: false,
      checkTaskAll: true,
      checkLibAll: true,
      dialogfullscreenLoading: false,
      staffName: null,
      certificateNum: null,
      genderOption: ""
    };
  }
};
</script>
<style>
.CompareRecord .el-input--prefix .el-input__inner {
	padding-left: 10px;
}
.CompareRecord .el-input--suffix .el-input__inner {
	padding-right: 10px;
}

.CompareRecord .el-button {
	line-height: 1;
	background: transparent;
	border: 0;
	color: #efefef;
	text-align: center;
	box-sizing: border-box;
	outline: 0;
	margin: 0;
	font-weight: 500;
	padding: 12px 20px;
	font-size: 14px;
	border-radius: 4px;
}
.CompareRecord .el-input__prefix {
	left: 110%;
	-webkit-transform: translateX(-200%);
	transform: translateX(-200%);
}
.CompareRecord .el-checkbox-button__inner,
.CompareRecord .el-radio-button__inner {
	background: rgba(255, 255, 255, 0.1);
	color: #ffffff;
	margin-right: 9px;
	border: 1px solid transparent;
	padding: 8px 20px;
	font-size: 13px;
}
.el-checkbox-button.is-focus .el-checkbox-button__inner,
.CompareRecord .el-checkbox-button:first-child .el-checkbox-button__inner,
.CompareRecord .el-radio-button:first-child .el-radio-button__inner {
	border: 1px solid transparent;
}
.CompareRecord .topBoxDateRadioBtnBox {
	min-width: 310px;
}
.CompareRecord .topBoxGenderRadioBtnBox {
	min-width: 250px;
}
.CompareRecord .el-checkbox-button.is-checked .el-checkbox-button__inner,
.CompareRecord .el-radio-button__orig-radio:checked + .el-radio-button__inner {
	background: rgba(40, 255, 187, 0.1);
	border-radius: 2px;
	border-radius: 2px;
	border: 1px solid #26d39d;
	box-shadow: 0px 0 0 0 #26d39d;
}
.CompareRecord .topBoxDeviceBox {
	min-width: 240px;
}
.CompareRecord .topBoxTaskBox {
	min-width: 240px;
}
.CompareRecord .topBoxQualityCheckBox {
	min-width: 360px;
}
.CompareRecord .el-checkbox-group {
	display: inline-block;
}
.topBoxDiv {
	padding-bottom: 20px;
}
.CompareRecord .topBoxBtnBox {
	min-width: 320px;
	padding-bottom: 20px;
}
.CompareRecord .compareBoxTxt {
	font-size: 14px;
	color: #aaaaaa;
}
.CompareRecord.el-pagination__jump {
	margin-left: 24px;
	font-weight: 400;
	color: #cccccc;
}
.compareRecordTxt {
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #888888;
}
.CompareRecordPopoverClass .is-checked .el-checkbox__inner,
.CompareRecordPopoverClass
	.el-checkbox__input.is-indeterminate
	.el-checkbox__inner {
	background-color: transparent;
	border-color: #28ffbb;
	/* color:#28FFBB; */
}
.CompareRecordPopoverClass .el-checkbox__inner::after {
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
	-webkit-transform-origin: center;
	transform-origin: center;
}
.CompareRecordPopoverClass .el-checkbox__inner {
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
	margin: 0px;
}

.CompareRecordPopoverClass
	.el-tree--highlight-current
	.el-tree-node.is-current
	> .el-tree-node__content {
	background-color: transparent;
}
.CRTaskPopoverClass .el-tree,
.CompareRecordPopoverClass .el-tree {
	position: relative;
	cursor: default;
	background: #202127;
	color: #efefee;
}
.CompareRecordPopoverClass .el-tree-node__content:hover {
	background-color: #000000;
	/* color: #; */
}
.CompareRecordPopoverClass .el-tree {
	color: #aaaaaa;
	background: none;
}
.CompareRecordPopoverClass .el-tree-node__content:hover {
	background: none;
}
.CompareRecordPopoverClass .el-tree-node:focus > .el-tree-node__content {
	background: none;
	/* color: #28FFBB; */
}
.CRTaskPopoverClass {
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

.CompareRecordPopoverClass {
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
.CompareRecord .el-date-editor.el-input,
.CompareRecord .el-date-editor.el-input__inner {
	width: 180px;
}
.CompareRecord .dialogClass .el-dialog__body {
	padding: 0;
	color: #606266;
	font-size: 14px;
}
.CompareRecord .textclipsClass {
	display: inline-block;
	/* width: 100%; */
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1; /*3表示只显示3行*/
	/* autoprefixer: off */
	-webkit-box-orient: vertical;
	/* autoprefixer: on */
}
.CompareRecord .el-button--primary {
	background: rgba(40, 255, 187, 0.15);
	border: 1px solid rgba(32, 204, 150, 0.8);
	border-radius: 3px;
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #ffffff;
	/* margin-left: 8%; */
}
.CompareRecord .el-progress .el-progress-circle {
	transform: rotate(90deg);
	-ms-transform: rotate(90deg);
	-webkit-transform: rotate(90deg);
}
.CompareRecord .topBoxInputBox {
	width: 220px;
	padding-bottom: 20px;
}
.CompareRecord .topBoxInputBox .el-input {
	width: 160px;
}
.CompareRecord .dialogClass {
	text-align: left;
}
.my_el-dialog__header {
	padding: 20px 20px 10px;
	height: 58px;
	box-sizing: border-box;
	border-bottom: 1px solid rgba(40, 255, 187, 0.2);
}
.CompareRecord .el-dialog__title {
	line-height: 24px;
	font-family: "PingFangSC-Regular";
	font-size: 20px;
	color: #ffffff;
	text-align: left;
	margin-left: 11px;
}
.CompareRecord .el-dialog {
	width: 920px;
	height: 760px;
	position: relative;
	margin: 0 auto 50px;
	color: #fff;
	background: #24272a;
	border-radius: 3px;
	-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
}
.CompareRecord .fontColor {
	font-family: "PingFangSC-Regular";
	font-size: 16px;
	color: #cccccc;
	letter-spacing: 0;
}
.CompareRecord .fontTheme {
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: rgb(39, 150, 119) !important;
	letter-spacing: 0;
	cursor: pointer;
}
.CompareRecord .fontThemes {
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #28ffbb;
	letter-spacing: 0;
	cursor: pointer;
}
.CompareRecord .el-dialog__header {
	/* display: none; */
	padding: 20px 20px 10px;
}
.CompareRecord .el-progress__text {
	font-size: 14px !important;
	color: #fff;
	display: inline-block;
	vertical-align: middle;
	/*margin-left: 10px;*/
	line-height: 1;
}
.CompareRecord .activec .el-progress__text {
	font-size: 14px !important;
	color: #ff5f5f !important;
	display: inline-block;
	vertical-align: middle;
	/*margin-left: 10px;*/
	line-height: 1;
}
.CompareRecord .el-select-dropdown__item {
	font-size: 14px;
	padding: 0 20px;
	position: relative;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	color: #efefef;
	height: 34px;
	line-height: 34px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	cursor: pointer;
}
.CompareRecord .el-select-dropdown {
	position: absolute;
	z-index: 1001;
	border: 1px solid #e4e7ed;
	border-radius: 4px;
	background: rgba(39, 42, 45, 0.9);
	box-shadow: 2px 2px 16px 0 rgba(2, 0, 14, 0.3);
	-webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	margin: 5px 0;
}
.CompareRecord .el-select {
	width: 50%;
	display: inline-block;
	position: relative;
}
.CompareRecord .el-select .el-tag {
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	border-color: transparent;
	margin: 2px 0 2px 6px;
	color: #e4e7ed;
	background-color: transparent;
}
.el-picker-panel {
	background: #202127;
	box-shadow: 2px 2px 16px 0 rgba(2, 0, 14, 0.3);
	color: #ffffff;
	border: 1px solid #e4e7ed;
	-webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	border-radius: 4px;
	line-height: 30px;
	margin: 5px 0;
}
.el-time-spinner__item.active:not(.disabled) {
	color: #ffffff;
	font-weight: 700;
}
.el-time-panel {
	margin: 5px 0;
	border: 1px solid #e4e7ed;
	background: #202127;
	-webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	border-radius: 2px;
	position: absolute;
	width: 180px;
	left: 0;
	z-index: 1000;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.el-picker-panel__icon-btn {
	font-size: 12px;
	color: #f2f6fc;
	border: 0;
	background: 0 0;
	cursor: pointer;
	outline: 0;
	margin-top: 8px;
}
.CompareRecord .reccordBoxClass {
	width: 100%;
	height: 100%;
	overflow: auto;
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	justify-content: flex-start;
	align-content: flex-start;
	background: rgba(36, 39, 42, 1);
	box-sizing: border-box;
	padding-left: 17px;
	/* padding-right: 15px; */
}
.CompareRecord .elCardBoxClass {
	margin: 16px 2% 0 0;
	color: #ffffff;
	box-sizing: border-box;
	border-radius: 2px;
	overflow: hidden;
}
.textclipClass {
	display: inline-block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1; /*3表示只显示3行*/
	/* autoprefixer: off */
	-webkit-box-orient: vertical;
	/* autoprefixer: on */
}
.CompareRecord {
	font-family: Helvetica, sans-serif;
	text-align: center;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	background: rgb(28, 29, 32);
	padding: 2%;
}
.CompareRecord .topBox {
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
.CompareRecord .bottomBox {
	padding: 25px 27px 20px;
	display: flex;
	align-items: center;
	width: 100%;
	height: 65px;
	background: rgb(36, 39, 42);
}
.topBox .bth-title {
	opacity: 0.8;
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #ffffff;
}
.CompareRecord .topTitleTxt {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
	text-align: left;
}
</style>
