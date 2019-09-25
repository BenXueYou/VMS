<template style="background-color:#0C0F1E">
	<el-row ref="compareRecordHeight" class="CompareRecord">
		<el-row class="topBox" type="flex" justify="space-between">
			<div class="topBoxDiv topTitleTxt topBoxTaskBox">
				任务：
				<alPopverTree
					:treeDataList="taskItemList"
					:alPopoverClass="CRTaskPopoverClass"
					:defaultProps="defaultProps"
					nodeKey="taskuuid"
					@transferAct="transferTaskAct"
				></alPopverTree>
			</div>
			<div class="topBoxDeviceBox topBoxDiv topTitleTxt" style="text-align:left;">
				抓拍设备：
				<elPopverTree
					:channelInfoList="DeviceTreeList"
					:elPopoverClass="CompareRecordPopoverClass"
					@transferCheckedChannel="transferCheckedChannel"
				></elPopverTree>
			</div>
			<div class="topBoxDeviceBox topBoxDiv topTitleTxt" style="text-align:left;display:block">
				所属库：
				<alPopverTree
					:treeDataList="faceDBList"
					:alPopoverClass="CRTaskPopoverClass"
					:defaultProps="faceDBDefaultProps"
					nodeKey="libraryuuid"
					@transferAct="transferAct"
				></alPopverTree>
			</div>
			<div :span="4" class="topTitleTxt topBoxInputBox" style="text-align:center;display:block">
				姓名：
				<el-input placeholder v-model="staffName" />
			</div>
			<div :span="4" class="topTitleTxt topBoxInputBox" style="text-align:center;display:block">
				证件号：
				<el-input placeholder v-model="certificateNum" />
			</div>
			<div class="topBoxDiv topBoxDateTimeBox">
				<span class="topTitleTxt" style="margin-right:15px;">时段：</span>
				<el-date-picker
					class="left-space"
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="startTime"
					type="datetime"
					placeholder="选择日期"
				></el-date-picker>
				<span class="compareRecordTxt">至</span>
				<el-date-picker
					class="left-space"
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="endTime"
					type="datetime"
					placeholder="选择日期"
				></el-date-picker>
			</div>
			<div class="topBoxDiv topBoxDateRadioBtnBox">
				<el-radio-group v-model="selectDate" @change="selectDateAct">
					<el-radio-button label="today">今天</el-radio-button>
					<el-radio-button label="lastday">昨天</el-radio-button>
					<el-radio-button label="thisWeek">本周</el-radio-button>
					<el-radio-button label="thisMonth">本月</el-radio-button>
				</el-radio-group>
			</div>
			<div :span="2">
				<el-button icon="el-icon-search" class="search-btn" @click="queryAct" type="primary">查询</el-button>
				<el-button class="search-btn" @click="queryAct" type="primary">重置</el-button>
			</div>
		</el-row>
		<el-row
			ref="compareMiddleHeight"
			v-loading="mainScreenLoading"
			element-loading-background="rgba(0, 0, 0, 0.8)"
			class="reccordBoxClass"
		>
			<div
				class="elCardBoxClass"
				v-for="(o, index) in pageSize"
				:key="index"
				@click="dialogCompareAction(index)"
			>
				<el-row
					:class="(totalCompareItemList[index])&&
          (totalCompareItemList[index])&&
          (totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.staffinfo.librarycolor === 'red')?'elCardBoxHeaders':'elCardBoxHeader'"
				>
					<el-col :span="18" class="asidListRowFooter textclipsClass">
						<img
							style="padding-right:12px"
							:src="(totalCompareItemList.length>index)&&
              (totalCompareItemList[totalCompareItemList.length-index-1])&&
              (totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.staffinfo.librarycolor === 'red')?require('@/assets/red.png'):require('@/assets/icon/address.png')"
							alt
						/>
						<span
							class="textclipsClass"
							style="font-size:14px;"
							:style="`color:${totalCompareItemList[totalCompareItemList.length-index-1]&&totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.staffinfo.librarycolor=='red' ? '#FF5F5F' : '#CCCCCC'}`"
							@mouseover="mymouseover"
							@mouseout="mymouseout"
							@mousemove="mymousemove"
						>{{totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.channelName:'未知任务通道'}}</span>
					</el-col>
					<el-col :span="6" class="asidListRowFooter imgTxtClass" style="justify-content:flex-end">
						<span
							class="fontColor"
							:class="(totalCompareItemList.length>index)&&
              (totalCompareItemList[totalCompareItemList.length-index-1])&&
              (totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.staffinfo.librarycolor === 'red')?'fontThemes':'fontTheme'"
							@click="doComparethis(index)"
						>详情</span>
						<img
							style="margin-left:10px"
							:src="(totalCompareItemList.length>index)&&(totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.staffinfo.librarycolor === 'red')?require('@/assets/icon/details.png'):require('@/assets/icon/details.png')"
							@click="doComparethis(index)"
						/>
					</el-col>
				</el-row>
				<el-row class="elCardBoxBody" type="flex" justify="space-between">
					<el-col :span="6">
						<div class="asidCompareImgBox">
							<img
								class="asidCardImg"
								:src="totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.photoinfo.imageUri:require('@/assets/user.png')"
							/>
						</div>
					</el-col>
					<el-col :span="4" style="display: flex;text-align: center;width:50px">
						<el-progress
							style="margin:auto;"
							:class="{'activec':totalCompareItemList[totalCompareItemList.length-index-1]&&totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.staffinfo.librarycolor=='red'}"
							:stroke-width="3"
							:width="45"
							type="circle"
							:color="totalCompareItemList[totalCompareItemList.length-index-1]&&totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.staffinfo.librarycolor=='red'?'#FF5F5F':'#28FFBB'"
							:percentage="totalCompareItemList.length>index?parseInt(totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.scores.toFixed(0)):0"
						></el-progress>
					</el-col>
					<el-col :span="6">
						<div class="asidCompareImgBox">
							<img
								class="asidCardImg"
								:src="totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.staffinfo.photoUri:require('@/assets/user.png')"
							/>
						</div>
					</el-col>
					<el-col :span="8" class="asidCompareTxtClass">
						<el-tooltip
							effect="dark"
							:content="totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.time:'抓拍时间'"
							placement="top"
						>
							<span
								class="compareBoxTxt textclipsClass"
							>{{totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.time:'抓拍时间'}}&nbsp;</span>
						</el-tooltip>
						<div
							class="compareBoxTxt"
						>{{totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.staffinfo.staffName:'姓名'}}</div>
						<div class="compareBoxTxt">
							{{totalCompareItemList.length>index?totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.staffinfo.libraryName:'所属库'}}
							<i
								v-if="(totalCompareItemList.length>index)
                &&(totalCompareItemList[totalCompareItemList.length-index-1])
                &&(totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.staffinfo.librarycolor)"
								class="el-icon-warning"
								:style="{'color':totalCompareItemList[totalCompareItemList.length-index-1].faceRecognization.staffinfo.librarycolor}"
							></i>
							<i v-else class="el-icon-warning" :style="{'color':'#28FFBB'}"></i>
						</div>
					</el-col>
				</el-row>
			</div>
		</el-row>
		<!-- ======================================================= 弹 窗 ========================================================== -->
		<el-dialog class="dialogClass" :visible.sync="dialogVisible" @close="closeDialog">
			<el-row>
				<div class="my_el-dialog__header">
					<!-- <img src="@/assets/images/dialogTitle.svg" alt> -->
					<span class="el-dialog__title">对比详情</span>
					<button type="button" aria-label="Close" class="el-dialog__headerbtn">
						<i class="el-dialog__close el-icon el-icon-close" @click="dialogVisible = false"></i>
					</button>
				</div>
			</el-row>
			<keep-alive>
				<dialogview
					v-loading="dialogfullscreenLoading"
					element-loading-background="rgba(0, 0, 0, 0.8)"
					:dialogParama="dialogParama"
					:shootPhotoList="shootPhotoList"
					:showImg="showImg"
					@cs="changeShowStatus"
				></dialogview>
			</keep-alive>
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
import { mouseover, mouseout, mousemove } from "@/common/mouse.js"; // 注意路径
export default {
  components: { dialogview, elPopverTree, alPopverTree },
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
    h = h - 5;
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
      h = h - 5;
      console.log(w);
      that.$refs.compareRecordHeight.$el.style.height = h + "px";
    });
    this.startTime = this.$common.getStartTime();
    this.endTime = this.$common.getCurrentTime();
    this.getTaskList(true);
  },
  activated: function() {
    this.deactivated = false;
    this.getTaskList(false);
  },
  deactivated: function() {
    this.deactivated = true;
    console.log("------deactivated------");
  },
  watch: {},
  methods: {
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
    transferAct(transferArray) {
      this.checkedFaceUuidList = transferArray;
    },
    transferTaskAct(transferArray) {
      this.checkedTaskUuidList = transferArray;
      var _this = this;
      setTimeout(function() {
        _this.getFaceLibsAndDeviceList(_this.checkedTaskUuidList);
      }, 200);
    },
    changeShowStatus(flag) {
      this.showImg = flag;
    },
    // 根据任务id获取设备树和人脸库
    getFaceLibsAndDeviceList(taskuuidList) {
      if (!taskuuidList.length) {
        for (var i = 0; i < this.taskItemList.length; i++) {
          var tempTask = this.taskItemList[i];
          taskuuidList.push(tempTask.taskuuid);
        }
      }
      let _this = this;
      _this.$store
        .dispatch("getFaceLibsAndDeviceList", taskuuidList)
        .then(res => {
          console.log(res);
          if (res.result === 0 && res.data) {
            var arr = [];
            arr.push(res.data.vcDeviceTreeDTO);
            _this.DeviceTreeList = JSON.parse(JSON.stringify(arr));
            _this.faceDBList = res.data.faceLibDTOS;
            _this.checkedFaceUuidList = [];
            for (var i = 0; i < _this.faceDBList.length; i++) {
              var temp = _this.faceDBList[i];
              _this.checkedFaceUuidList.push(temp.libraryuuid);
            }

            // 获取checkedChannelUuidList
            _this.getChildren(
              _this.DeviceTreeList,
              _this.checkedChannelsUuidList
            );
          } else {
            _this.$message({
              message: "没有查找到相关设备",
              type: "warning"
            });
          }
        });
    },
    // 获取所有叶子节点
    getChildren(data, arr) {
      if (!data || data.length === 0) {
        return;
      }
      for (let index = 0; index < data.length; index++) {
        if (data[index].children === null) {
          let channelObj = JSON.parse(JSON.stringify(data[index]));
          arr.push(channelObj.id);
        } else {
          this.getChildren(data[index].children, arr);
        }
      }
    },

    transferCheckedChannel(checkedChannel) {
      this.checkedChannelObj = checkedChannel;
      this.checkedChannelsUuidList = [];
      // 设备树
      if (this.checkedChannelObj && this.checkedChannelObj.length) {
        for (var i = 0; i < this.checkedChannelObj.length; i++) {
          var item = this.checkedChannelObj[i];
          this.checkedChannelsUuidList.push(item.id);
        }
      } else {
        this.checkNameString = "全部设备";
      }
    },
    // 点击查询按钮
    queryAct() {
      /* eslint-disable */
			if (this.startTime.length > 0 && this.endTime.length > 0) {
				var d1 = new Date(this.startTime.replace(/\-/g, "/"));
				var d2 = new Date(this.endTime.replace(/\-/g, "/"));
				if (this.startTime !== "" && this.endTime !== "" && d1 >= d2) {
					this.$message({
						message: "开始时间必须小于结束时间！",
						type: "warning"
					});
					return;
				}
			}
			this.total = 0;
			this.currentPage = 1;
			this.getCompareRecordList();
		},

		// 获取数据
		getCompareRecordList() {
			this.mainScreenLoading = true;

			var data = {
				// taskUuids: this.checkedTaskUuidList.toString(),
				channelIds: this.checkedChannelsUuidList.toString(),
				currentPage: this.currentPage,
				endTime: this.endTime,
				faceLibListUuids: this.checkedFaceUuidList.toString(),
				pageSize: this.pageSize,
				startTime: this.startTime
			};
			this.$store.dispatch("getCompareList", data).then(res => {
				console.log(data, "getCompareList=", res);
				this.mainScreenLoading = false;
				if (res.result === 0 && res.data.list) {
					this.totalCompareItemList = [];
					res.data.list.reverse();
					for (var i = 0; i < res.data.list.length; i++) {
						var item = res.data.list[i];
						if (!item.extinfo) return;
						try {
							item.extinfo = JSON.parse(item.extinfo);
							item.faceRecognization = item.extinfo.faceRecognization;
							item.faceRecognization.photoinfo = JSON.parse(
								item.faceRecognization.photoinfo
							);
							item.faceRecognization.staffinfo = JSON.parse(
								item.faceRecognization.staffinfo
							);
						} catch (error) {
							res.data.list[i];
						}
						// let td = item.faceRecognization.time.split(" ")[0].split("-")[2]+item.faceRecognization.time.split(" ")[0].split("-")[1]+item.faceRecognization.time.split(" ")[0].split("-")[0]
						// item.faceRecognization.time = item.faceRecognization.time.split(" ")[1]+' '+td

						this.totalCompareItemList.push(item);
					}
					this.total = res.data.total;
				} else {
					this.$message({
						message: "没有查找到相关的对比记录",
						type: "warning"
					});
				}
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
		// 弹窗的传值
		dialogCompareAction(e) {
			// this.doComparethis(e);
		},
		// 点击详情的事件
		doComparethis(e) {
			console.log(e);
			if (this.totalCompareItemList.length - e > 0) {
				console.log(
					this.totalCompareItemList[this.totalCompareItemList.length - e - 1]
				);
				this.dialogParama = null;
				this.dialogParama = this.totalCompareItemList[
					this.totalCompareItemList.length - e - 1
				];
				this.dialogVisible = true;
				this.dialogParama.showImg = false;
				this.getAlarmShootPhotoList();
			} else {
			}
		},
		// 根据客户端的传的人员staffUuid查找抓拍图片
		getAlarmShootPhotoList(currentPage = 1, pageSize = 24) {
			this.updatedFlag = true;
			var data = new Object({
				staffUuid: this.dialogParama.faceRecognization.staffinfo.staffUuid,
				scores: this.dialogParama.score
			});
			this.dialogfullscreenLoading = true;
			this.$store.dispatch("getShootPhotosForStaffUuid", data).then(res => {
				this.dialogfullscreenLoading = false;
				console.log("==人脸记录照片：====", res);
				if (res.result === 0 && this.deactivated === false) {
					this.shootPhotoList = [];
					for (var i = 0; i < res.data.length; i++) {
						var item = res.data[i];
						if (!item.extinfo) return;
						item.extinfo = JSON.parse(item.extinfo);
						item.faceRecognization = item.extinfo.faceRecognization;
						this.shootPhotoList.push(item);
					}
					this.dialogParama.showImg = false;
					// this.dialogVisible = true;
				} else {
					this.$message({
						message: "没有找到更多相关的人脸记录",
						type: "warning"
					});
				}
			});
		},
		// 获取任务列表
		getTaskList(isTrue = true) {
			var taskList = this.$store.getters.getTasks;
			this.checkedTaskUuidList = [];
			this.taskItemList = taskList;
			this.$store.dispatch("getTaskList", false).then(res => {
				if (res.result === 0) {
					taskList = res.data.enable;
					for (var i = 0; i < this.taskItemList.length; i++) {
						var tempTask = this.taskItemList[i];
						this.checkedTaskUuidList.push(tempTask.taskuuid);
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
			});
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
				label: "taskname"
			},
			faceDBDefaultProps: {
				label: "libraryname"
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
			certificateNum: null
		};
	}
};
</script>
<style>
.topBoxDateTimeBox .el-input--prefix .el-input__inner {
	padding-left: 10px;
}
.topBoxDateTimeBox .el-input--suffix .el-input__inner {
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
	border: 0;
	padding: 8px 20px;
	font-size: 13px;
}
.CompareRecord .el-checkbox-button:first-child .el-checkbox-button__inner,
.CompareRecord .el-radio-button:first-child .el-radio-button__inner {
	border: 0;
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
	border: 0;
	box-shadow: 0px 0 0 0 #26d39d;
}
.CompareRecord .topBoxDeviceBox {
	min-width: 310px;
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
	font-family: PingFangSC-Regular;
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
	-webkit-transition: -webkit-transform 0.15s ease-in 0.05s;
	transition: -webkit-transform 0.15s ease-in 0.05s;
	transition: transform 0.15s ease-in 0.05s;
	transition: transform 0.15s ease-in 0.05s,
		-webkit-transform 0.15s ease-in 0.05s;
	transition: transform 0.15s ease-in 0.05s,
		-webkit-transform 0.15s ease-in 0.05s;
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
	-webkit-transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
		background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
	transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
		background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
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
.CompareRecord .elCardBoxHeaders {
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	padding-bottom: 12px;
	padding: 9px 15px;
	color: rgba(227, 53, 53, 0.8);
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
/* .CompareRecordPopoverClass .el-tree-node__expand-icon { */
/* color: #28ffbb; */
/* display: none; */
/* } */

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
	/* width: 220px; */
	/* width: 30%; */
	max-width: 220px;
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
	font-family: PingFangSC-Regular;
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
	width: 230px;
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
	font-family: PingFangSC-Regular;
	font-size: 20px;
	color: #ffffff;
	text-align: left;
	margin-left: 11px;
}
.CompareRecord .el-dialog {
	width: 62.5%;
	color: #fff;
	height: 73.5%;
	min-width: 1200px;
	min-height: 760px;
	position: relative;
	margin: 0 auto 50px;
	background: #24272a;
	border-radius: 3px;

	-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
}
.CompareRecord .fontColor {
	font-family: PingFangSC-Regular;
	font-size: 16px;
	color: #cccccc;
	letter-spacing: 0;
}
.CompareRecord .fontTheme {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: rgb(39, 150, 119) !important;
	letter-spacing: 0;
	cursor: pointer;
}
.CompareRecord .fontThemes {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #28ffbb;
	letter-spacing: 0;
	cursor: pointer;
}
.CompareRecord .el-dialog__header {
	display: none;
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
.CompareRecord .elCardBoxClass {
	width: calc((100% - 110px) / 4);
	height: calc((100% - 255px) / 4);
	margin: 20px 20px 0 0;
	color: #ffffff;
	/* padding: 20px 25px; */
	box-sizing: border-box;
	border-radius: 2px;
	overflow: hidden;
	background: rgba(0, 0, 0, 0.13);
	border: 1px solid rgba(40, 255, 187, 0.13);
}

.CompareRecord .elCardBoxHeader {
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	padding: 9px 15px;
	box-sizing: border-box;
}

.CompareRecord .elCardBoxBody {
	padding: 16px 18px 19px;
	box-sizing: border-box;
}
.CompareRecord .asidCompareImgBox {
	width: 100%;
	height: 0px;
	padding-bottom: 100%;
	position: relative;
	max-width: 103px;
	max-height: 103px;
	box-sizing: border-box;
}
.CompareRecord .libImgClass {
	vertical-align: bottom;
	margin-left: 3px;
}
.CompareRecord .asidCompareTxtClass {
	text-align: left;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	padding: 10px 0px 0px 12px;
}

.CompareRecord .asidCardImg {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0px;
	top: 0px;
	-webkit-background-size: cover;
	-webkit-background-origin: content;
	background-origin: content-box;
	background-size: cover;
	-webkit-background-origin: content;
	background-origin: content-box;
	background-clip: content-box;
}
.CompareRecord .asidListRowFooter {
	/* line-height: 35px; */
	font-size: 14px;
	text-align: left;
	display: flex;
	flex-direction: row;
	align-items: center;
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
.el-select-dropdown {
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
.el-select {
	width: 50%;
	display: inline-block;
	position: relative;
}
.el-select .el-tag {
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
	/* border: 1px solid rgba(40,255,187, 1); */
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
.CompareRecord .recordCellFooterTxt {
	/* opacity: 0.8; */
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.8);
	letter-spacing: 0;
}
.CompareRecord .recordCellFooter {
	width: 100%;
	/* height: 80px; */
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 9px;
}
.CompareRecord .reccordBoxClass {
	width: 100%;
	height: 100%;
	overflow: auto;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	background: rgba(36, 39, 42, 1);
	margin-top: 20px;
	box-sizing: border-box;
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
.CompareRecord .recordCellImg {
	width: 150px;
	height: 150px;
}
.CompareRecord .reccordCellClass {
	width: 180px;
	height: 200px;
	border: 1px solid rgba(11, 33, 38, 1);
	margin: 13px 12px 14px;
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
	padding: 40px 50px 30px;
}
.CompareRecord .topBox {
	/* padding: 30px 50px 30px 27px;
	display: flex;
	align-items: center;
	width: 100%;
	height: 100px;
	background: rgb(36, 39, 42); */
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	padding: 25px 40px 0px 27px;
	height: 140px;
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
