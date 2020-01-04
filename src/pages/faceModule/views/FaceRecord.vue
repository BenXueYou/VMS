<template style="background-color:#0C0F1E">
	<el-row ref="faceRecordHeight" class="faceRecord">
		<el-row class="topBox" type="flex" justify="space-between">
			<div class="topBoxDiv topBoxDateTimeBox">
				<span class="topTitleTxt">抓拍时段：</span>
				<el-date-picker
					class="left-space"
					v-model="startTime"
					type="datetime"
					placeholder="选择日期"
					value-format="yyyy-MM-dd HH:mm:ss"
					@change="selectDate=null"
				></el-date-picker>
				<span class="timeText">至</span>
				<el-date-picker
					class="left-space"
					v-model="endTime"
					type="datetime"
					placeholder="选择日期"
					value-format="yyyy-MM-dd HH:mm:ss"
					@change="selectDate=null"
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
			<div class="topBoxDeviceBox topBoxDiv topTitleTxt" style="text-align:left;">
				抓拍设备：
				<elPopverTree
					:channelInfoList="deviceList"
					:elPopoverClass="fRPopoverClass"
					@transferCheckedChannel="transferCheckedChannel"
					inputWidth="75%"
					ref="FRDeviceRef"
					:isCheckedAll="true"
				></elPopverTree>
			</div>
			<div :span="4" class="topBoxDiv topBoxGenderRadioBtnBox">
				<span class="topTitleTxt" style="margin-right:15px;">性别:</span>
				<el-radio-group v-model="genderOption">
					<el-radio-button label>不限</el-radio-button>
					<el-radio-button label="male">男</el-radio-button>
					<el-radio-button label="female">女</el-radio-button>
				</el-radio-group>
			</div>
			<div :span="4" class="topBoxDiv topBoxCheckBox">
				<span class="topTitleTxt" style="margin-right:15px;">属性:</span>
				<el-radio-group v-model="propertyOption">
					<el-radio-button label>不限</el-radio-button>
					<el-radio-button label="glasses">眼镜</el-radio-button>
					<el-radio-button label="sunglasses">墨镜</el-radio-button>
					<el-radio-button label="mask">口罩</el-radio-button>
				</el-radio-group>
			</div>
			<div :span="4" class="topBoxDiv topBoxCheckBox topBoxQualityCheckBox">
				<span class="topTitleTxt" style="margin-right:15px;">图片质量:</span>
				<el-checkbox-group v-model="qualityOption">
					<el-checkbox-button label="HIGH">
						高
						<img
							src="@/assets/images/faceModule/selected.png"
							class="checkBtnImg"
							v-if="qualityOption.indexOf('HIGH')!==-1"
						/>
					</el-checkbox-button>
					<el-checkbox-button label="NORMAL">
						中
						<img
							src="@/assets/images/faceModule/selected.png"
							class="checkBtnImg"
							v-if="qualityOption.indexOf('NORMAL')!==-1"
						/>
					</el-checkbox-button>
					<el-checkbox-button label="LOW">
						低
						<img
							src="@/assets/images/faceModule/selected.png"
							class="checkBtnImg"
							v-if="qualityOption.indexOf('LOW')!==-1"
						/>
					</el-checkbox-button>
					<el-checkbox-button label="LOWER">
						无效
						<img
							src="@/assets/images/faceModule/selected.png"
							class="checkBtnImg"
							v-if="qualityOption.indexOf('LOWER')!==-1"
						/>
					</el-checkbox-button>
				</el-checkbox-group>
				<!-- <pic-qulity-select :selectedButtons.sync="qualityOption" /> -->
			</div>

			<div class="topBoxBtnBox">
				<el-button
					:disabled="!ShowAuthDisabled"
					icon="el-icon-search"
					class="search-btn"
					@click="queryAct"
					type="primary"
				>查询</el-button>
				<el-button
					:disabled="!ShowAuthDisabled"
					class="search-btn"
					@click="resetQueryAct"
					type="primary"
				>重置</el-button>
			</div>
		</el-row>
		<el-row
			ref="middleHeight"
			v-loading="mainScreenLoading"
			element-loading-background="rgba(0, 0, 0, 0.8)"
			class="reccordBoxClass"
		>
			<div
				class="reccordCellClass"
				v-for="(o, index) in totalPhotoItems"
				:key="index"
				@click.native="detailToDesc(o,index)"
			>
				<el-popover
					:visible-arrow="false"
					popper-class="FRelPopoverClass"
					placement="center-center"
					v-model="o.CellVisiblePopver"
					:width="cellwidth"
					trigger="hover"
				>
					<el-row class="FRelPopoverRow" justify="space-between">
						<el-col
							class="FRelPopoverCol"
							:class="OwnAuthDisabled?'cursorClass':'disabled'"
							@click.native="searchImageToFace(o,index,'searchFaceWithFace')"
						>
							<img src="@/assets/images/faceModule/2.png" />
							以脸搜脸
						</el-col>
						<el-col
							:class="OwnAuthDisabled?'cursorClass':'disabled'"
							class="FRelPopoverCol"
							@click.native="analysisAct(o,index,'Companion')"
						>
							<img src="@/assets/images/faceModule/2.png" />
							同行人分析
						</el-col>
						<el-col
							:class="OwnAuthDisabled?'cursorClass':'disabled'"
							class="FRelPopoverCol"
							@click.native="judgeStaffTrace(o,'PersonTrace')"
						>
							<img src="@/assets/images/faceModule/4.png" />
							人员轨迹
						</el-col>
						<el-col
							:class="OwnAuthDisabled?'cursorClass':'disabled'"
							class="FRelPopoverCol"
							@click.native="shoWholeImgUrl(o,index)"
						>
							<img src="@/assets/images/faceModule/3.png" />
							查看大图
						</el-col>
						<el-col
							:class="OwnAuthDisabled?'cursorClass':'disabled'"
							class="FRelPopoverCol"
							@click.native="tempCtrlTask(o,index)"
						>
							<img src="@/assets/images/faceModule/5.png" />
							临时布控
						</el-col>
						<el-col
							:class="OwnAuthDisabled?'cursorClass':'disabled'"
							class="FRelPopoverCol"
							@click.native="downloadImg(o,index)"
						>
							<img src="@/assets/images/faceModule/6.png" />
							导出图片
						</el-col>
					</el-row>
					<el-row slot="reference" class="recordCellImgBox">
						<div class="imgBox">
							<img
								:src="$common.setPictureShow(o.faceCapturePhotoUrl,PicSourceType)"
								class="recordCellImg"
							/>
						</div>
						<el-col class="recordCellFooter">
							<div
								class="textclipClass recordCellFooterTxt"
								@mouseover="mymouseover"
								@mouseout="mymouseout"
								@mousemove="mymousemove"
							>{{o.captureDatetime?o.captureDatetime:'---- --:--:--'}}</div>
							<div
								class="textclipClass recordCellFooterTxt"
								@mouseover="mymouseover"
								@mouseout="mymouseout"
								@mousemove="mymousemove"
							>{{o.channelName?o.channelName:'未知设备通道'}}</div>
						</el-col>
					</el-row>
				</el-popover>
			</div>
		</el-row>
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
		<!-- ======================================================= 人脸 弹 窗 ========================================================== -->
		<el-dialog class="dialogPhotoClass" :visible.sync="dialogVisible" :title="titleTxt">
			<div class="leftImgBox">
				<el-image
					:src="$common.setPictureShow(dialogPhotoImgUrl,PicSourceType)"
					:preview-src-list="[$common.setPictureShow(dialogPhotoImgUrl,PicSourceType)]"
				></el-image>
			</div>
			<div class="rightImgBox">
				<el-image
					:src="$common.setPictureShow(dialogPanoramaImgUrl,PicSourceType)"
					:preview-src-list="[$common.setPictureShow(dialogPanoramaImgUrl,PicSourceType)]"
				></el-image>
			</div>
		</el-dialog>
	</el-row>
</template>
<script>
import elPopverTree from "@/pages/faceModule/components/ElPopverTree.vue";
import AlTree from "@/pages/faceModule/components/AlElTree.vue";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
import PicQulitySelect from "@/common/PicQulitySelect";
import * as api from "@/pages/faceModule/http/logSearchHttp.js";
import RestApi from "@/utils/RestApi.js";
export default {
  components: { elPopverTree, AlTree, PicQulitySelect },
  mounted: function() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("抓拍记录", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("抓拍记录", "isOwn");

    let h =
			window.innerHeight ||
			document.documentElement.clientHeight ||
			document.body.clientHeight;
    let w =
			window.innerWidth ||
			document.documentElement.clientWidth ||
			document.body.clientWidth;
    w = w - 320;
    h = h - 65;
    this.$refs.faceRecordHeight.$el.style.height = h + "px";
    this.cellwidth = w / 10 - 40;
    // 当窗口发生变化时
    let that = this;
    window.addEventListener("resize", resizeView);
    function resizeView() {
      let h =
				window.innerHeight ||
				document.documentElement.clientHeight ||
				document.body.clientHeight;
      let w =
				window.innerWidth ||
				document.documentElement.clientWidth ||
				document.body.clientWidth;
      w = w - 320;
      h = h - 65;
      that.cellwidth = w / 10 - 40;
      that.$refs.faceRecordHeight.$el.style.height = h + "px";
    }
    this.startTime = this.$common.getStartTime();
    this.endTime = this.$common.getCurrentTime();
    if (this.ShowAuthDisabled) {
      this.queryAct();
    }
  },
  watch: {},
  activated: function() {
    console.log("抓拍记录刷新页面");
    this.checkNameString = "";
  },
  deactivated: function() {},
  methods: {
    resetQueryAct() {
      this.checkedChannelsUuidList = [];
      this.qualityOption = ["HIGH", "NORMAL", "LOW"];
      this.genderOption = "";
      this.propertyOption = "";
      this.startTime = this.$common.getStartTime();
      this.endTime = this.$common.getCurrentTime();
      this.selectDate = null;
      this.$refs.DeviceRef.clearAction();
      this.queryAct();
    },
    selectDateAct(dateStr) {
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
    onCancelDialog() {
      this.isShow = false;
    },
    // 临时布控
    tempCtrlTask(o, index) {
      console.log(o.faceCapturePhotoUrl);
      if (!this.OwnAuthDisabled) return;
      this.$common.imageToBase64(o.faceCapturePhotoUrl, base64 => {
        api.addTempContrlTask({ imageBase64: base64 }).then(res => {
          if (res.data.success) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
          } else {
            this.$message({
              message: "布控失败，请稍后再试",
              type: "warning"
            });
          }
        });
      });
    },
    // 是否有人员轨迹
    judgeStaffTrace(item, routeName) {
      if (!this.OwnAuthDisabled) return;
      //   this.$router.push({ path: routeName, query: { imgObj: item } });
      let data = {
        faceCaptureRecordUuid: item.faceCaptureUuid,
        captureDatetime: item.captureDatetime
      };
      api
        .photoRecordToAnalysis(data)
        .then(res => {
          if (res.data.success) {
            item.faceUuid = res.data.data;
            this.$set(item, "CellVisiblePopver", false);
            // this.$router.push({ path: routeName, query: { imgObj: item } });
            this.$router.push({
              name: routeName,
              params: { imgObj: item }
            });
          } else {
            this.$message({ type: "warning", message: res.data.msg });
          }
        })
        .catch(() => {});
    },
    // 是否有同行人分析
    analysisAct(o, index, routeName) {
      if (!this.OwnAuthDisabled) return;
      this.mainScreenLoading = true;
      api
        .photoRecordToAnalysis({
          faceCaptureRecordUuid: o.faceCaptureUuid,
          captureDatetime: o.captureDatetime
        })
        .then(res => {
          console.log(res);
          this.mainScreenLoading = false;
          if (res.data.success) {
            o.faceUuid = res.data.data;
            this.$set(o, "CellVisiblePopver", false);
            // this.$router.push({ path: routeName, query: { imgObj: o } });
            this.$router.push({
              name: routeName,
              params: { imgObj: o }
            });
          } else {
            this.$message({
              message: "未找到分析记录",
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.mainScreenLoading = false;
        });
    },
    searchImageToFace(o, index, routeName) {
      if (!this.OwnAuthDisabled) return;
      this.$set(o, "CellVisiblePopver", false);
      // this.$router.push({ path: routeName, query: { imgObj: o } });
      this.$router.push({
        name: routeName,
        params: { imgObj: o }
      });
    },
    // 全景菜单的组件回调，返回选中的对象数组
    transferCheckedChannel(checkedChannel) {
      console.log(checkedChannel);
      this.checkedChannelsUuidList = [];
      for (var i = 0; i < checkedChannel.length; i++) {
        this.checkedChannelsUuidList.push(checkedChannel[i].channelUuid);
      }
      console.log(this.checkedChannelsUuidList);
    },
    // 下载导出图片
    downloadImg(o, index) {
      if (!this.OwnAuthDisabled) return;
      this.$common.exportImageAct(o.faceCapturePhotoUrl, o);
      this.$common.exportImageAct(o.panoramaCapturePhotoUrl, o);
    },
    // 查看大图
    shoWholeImgUrl(o, index) {
      if (!this.OwnAuthDisabled) return;
      this.dialogVisible = !this.dialogVisible;
      this.dialogPhotoImgUrl = o.faceCapturePhotoUrl;
      this.dialogPanoramaImgUrl = o.panoramaCapturePhotoUrl;
      this.titleTxt = o.channelName;
    },
    queryAct() {
      if (!this.ShowAuthDisabled) return;
      if (this.startTime && this.endTime) {
        /* eslint-disable */
				var d1 = new Date(this.startTime.replace(/\-/g, "/"));
				var d2 = new Date(this.endTime.replace(/\-/g, "/"));
				/* eslint-enable */
        if (d1 >= d2) {
          this.$message({
            message: "开始时间必须小于结束时间！",
            type: "warning"
          });
          return;
        }
        this.currentPage = 1;
        this.total = 0;
        this.getPhotoRecordList();
      } else {
        this.$message({
          message: "查询时间不能为空！",
          type: "warning"
        });
      }
    },
    // 按照时间查询抓拍记录
    getPhotoRecordList() {
      this.mainScreenLoading = !this.mainScreenLoading;
      this.totalPhotoItems = []; // 清除记录
      var data = {
        page: this.currentPage,
        limit: this.pageSize,
        channelUuids: this.checkedChannelsUuidList.toString(),
        snapshotTimeStart: this.startTime,
        snapshotTimeEnd: this.endTime,
        faceCapturePhotoQuality: this.qualityOption.toString(),
        genderCapture: this.genderOption
      };
      if (!data.channelUuids) data.channelUuids = null;
      if (!data.faceCapturePhotoQuality) data.faceCapturePhotoQuality = null;
      // 此处处理参数，入参的key值随页面变量的变化而变化
      if (this.propertyOption) {
        data[this.propertyOption] = this.propertyOption;
        data[this.propertyOption] = Number(Boolean(data[this.propertyOption]));
      }
      if (!data.genderCapture) data.genderCapture = null;
      api
        .getSnapshotList(data)
        .then(res => {
          this.mainScreenLoading = !this.mainScreenLoading;
          if (res.data.success) {
            if (res.data.data && res.data.data.list) {
              this.totalPhotoItems = res.data.data.list;
              this.total = res.data.data.total;
            } else {
              this.$message.warning("查询结果为空");
            }
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
      this.currentPage = val;
      this.getPhotoRecordList(false);
    },
    // 获取任务列表
    getDeviceList(isTrue) {
      this.$store.dispatch("getDeviceList", false).then(res => {
        if (res.result === 0) {
          this.deviceList = res.data;
          if (isTrue) {
            this.getPhotoRecordList();
          }
        } else {
          this.$message({ message: "更新设备列表失败", type: "warning" });
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
      PicSourceType: window.config.PicSourceType,
      imageHeader: RestApi.api.imageUrl,
      propertyOption: "",
      selectDate: null,
      inputPlaceholder: "高，中",
      checkedUuid: ["HIGH", "NORMAL"],
      dialogPanoramaImgUrl: false,
      fRPopoverClass: "fRPopoverClass",
      totalPhotoItems: [],
      dialogPhotoImgUrl: false,
      dialogVisible: false, // 彈窗顯示標記
      checkedChannelsNameList: [], // 当前勾选的通道名称list
      checkedChannelsUuidList: [], // 当前勾选的通道Id的list
      channelNameList: [], // 当前任务显示的通道名list称
      channelInfoList: [], // 所有通道名称和ID的二元list
      deviceList: [], // 布控任務列表
      mainScreenLoading: false, // 局部遮罩是否显示
      pageSize: 40,
      total: 0,
      currentPage: 1,
      startTime: "",
      endTime: "",
      checkList: [],
      HEIGHT: 0,
      WIDTH: 0,
      defaultProps: {
        children: "children",
        label: "label"
      },
      checkNameString: "全部任务",
      allChannelUuid: [],
      genderOption: "",
      qualityOption: ["HIGH", "NORMAL", "LOW"],
      titleTxt: "抓拍设备",
      defaultQualityProps: {
        label: "label"
      },
      carFellowDetailList: [],
      isShow: false,
      size: 20,
      cellwidth: 80,
      defaultCheckedChannel: [],
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  }
};
</script>
<style>
.faceRecord .dialogPhotoClass .el-dialog__body {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	padding: 25px 38px;
	box-sizing: border-box;
	width: 100%;
}
.faceRecord .dialogPhotoClass .el-dialog {
	width: 800px;
}
.faceRecord .dialogPhotoClass .leftImgBox {
	width: 35%;
	height: 100%;
}
.faceRecord .dialogPhotoClass .rightImgBox {
	width: 63%;
	height: 100%;
	margin-left: 2%;
}
.faceRecord .dialogPhotoClass .rightImgBox img {
	width: 100%;
	height: 100%;
}
.dialogPhotoClass .rightImgBox .el-image .el-image-viewer__canvas img,
.dialogPhotoClass .leftImgBox .el-image .el-image-viewer__canvas img {
	width: auto;
	max-width: 100%;
	height: 100%;
}
.faceRecord .reccordCellClass .FRelPopoverClass {
	min-width: 112px;
	position: absolute !important;
	bottom: 0px !important;
	color: #ffffff !important;
	border-radius: 0;
	border: 0px;
	background: rgba(5, 5, 6, 0.8);
	box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.2);
	border-radius: 2px;
	padding: 4px 12px;
	font-size: 10px;
}
.faceRecord .checkBtnImg {
	position: absolute;
	right: -5px;
	top: -5px;
}
.fRPopoverClass {
	width: 50%;
	height: 45%;
	position: absolute;
	background: #202127;
	border: 1px solid #ebeef5;
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
.topBoxDateTimeBox .el-input--prefix .el-input__inner {
	padding-left: 10px;
}
.topBoxDateTimeBox .el-input--suffix .el-input__inner {
	padding-right: 10px;
}

.faceRecord .el-button {
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
.faceRecord .el-input__prefix {
	left: 110%;
	-webkit-transform: translateX(-200%);
	transform: translateX(-200%);
}
.faceRecord .topBoxCheckBoxSelectedImg {
	border: 1px solid red;
}
.faceRecord .el-checkbox-button__inner,
.faceRecord .el-radio-button__inner {
	background: rgba(255, 255, 255, 0.1);
	color: #ffffff;
	margin-right: 9px;
	border: 1px solid transparent;
	padding: 8px 20px;
	font-size: 13px;
}
.faceRecord .el-checkbox-button:first-child .el-checkbox-button__inner,
.faceRecord .el-radio-button:first-child .el-radio-button__inner {
	border: 1px solid transparent;
}
.faceRecord .topBoxDateRadioBtnBox {
	min-width: 310px;
}
.faceRecord .topBoxGenderRadioBtnBox {
	min-width: 250px;
}
.faceRecord .el-checkbox-button.is-checked .el-checkbox-button__inner,
.faceRecord .el-radio-button__orig-radio:checked + .el-radio-button__inner {
	background: rgba(40, 255, 187, 0.1);
	border-radius: 2px;
	border-radius: 2px;
	border: 1px solid #26d39d;
	box-shadow: 0px 0 0 0 #26d39d;
}
.faceRecord .topBoxDeviceBox {
	min-width: 310px;
}
.faceRecord .topBoxCheckBox {
	min-width: 360px;
}
.faceRecord .topBoxQualityCheckBox {
	display: flex;
	justify-content: center;
	align-items: center;
}
.faceRecord .el-checkbox-group {
	display: inline-block;
}
.topBoxDiv {
	padding-bottom: 20px;
}
.faceRecord .topBoxBtnBox {
	min-width: 320px;
	padding-bottom: 20px;
}
</style>

<style scoped>
.timeText {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #888888;
}
.recordCellImgBox {
	/* display: inline-block; */
	/* width: 100%; */
	height: 100%;
	padding: 9px 11px 0;
	box-sizing: border-box;
	flex-shrink: 1;
}
.recordCellImg {
	width: 100%;
	height: 100%;
	display: inline-block;
}
.reccordCellClass .el-popover {
	min-width: 0;
}
.imgBox {
	width: 120px;
	height: 120px;
	box-sizing: border-box;
}

.faceRecord .el-dialog__header {
	padding: 30px;
	padding-bottom: 10px;
}
.faceRecord .el-dialog__body {
	padding: 0;
	color: #606266;
	font-size: 14px;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
}
.faceRecord .el-dialog {
	background-image: linear-gradient(-180deg, #16171f 0%, #10131a 100%);
	border-radius: 3px;
	/* -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3); */
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	width: 800px;
	height: 540px;
}
.faceRecord .el-pagination button,
.faceRecord .el-pagination span:not([class*="suffix"]) {
	display: inline-block;
	font-size: 14px;
	min-width: 35.5px;
	height: 28px;
	line-height: 28px;
	vertical-align: top;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	color: #888888;
}
.prefixIcoonClass {
	display: none;
}

.FRelPopoverClass .FRelPopoverRow {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.FRelPopoverClass .FRelPopoverCol {
	display: flex;
	flex-direction: wrap;
	justify-content: flex-start;
	align-content: center;
	align-items: center;
	line-height: 20px;
	font-size: 12px;
	color: #ffffff;
	margin: 2px 0px 2px;
	cursor: pointer;
}
.FRelPopoverClass .FRelPopoverCol:hover {
	background-color: rgba(38, 211, 157, 0.3);
}
.FRelPopoverClass .FRelPopoverCol img {
	margin-right: 8px;
	vertical-align: middle;
}
.FRelPopoverClass a:-webkit-any-link {
	cursor: pointer;
	color: #dddddd !important;
	text-decoration: none;
	font-size: 12px;
}
.faceRecord .el-pagination__jump {
	margin-left: 24px;
	font-weight: 400;
	color: #888888;
	font-size: 14px;
}

.faceRecord .el-date-editor.el-input {
	width: 180px;
}
.faceRecord .el-pagination__editor.el-input .el-input__inner {
	height: 28px;
	padding: 2px;
}
.faceRecord .el-picker-panel__footer {
	border-top: 1px solid #e4e4e4;
	padding: 4px;
	text-align: right;
	background-color: transparent;
	position: relative;
	font-size: 0;
}

.faceRecord .el-progress .el-progress-circle {
	transform: rotate(90deg);
	-ms-transform: rotate(90deg);
	-webkit-transform: rotate(90deg);
}
.faceRecord .el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
	color: #28ffbb;
	background-color: transparent;
}
.faceRecord.el-select-dropdown.is-multiple
	.el-select-dropdown__item.selected.hover {
	background: transparent;
}
.faceRecord
	.el-select-dropdown.is-multiple
	.el-select-dropdown__item.selected.hover {
	background: rgba(40, 255, 187, 0.15);
}
.faceRecord .el-select-dropdown__item.hover,
.faceRecord .el-select-dropdown__item:hover {
	background-color: transparent;
}

.faceRecord .el-select-dropdown__item {
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
.faceRecord .el-select-dropdown {
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
.faceRecord .el-select {
	width: 50%;
	display: inline-block;
	position: relative;
}
.faceRecord .el-select .el-tag {
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	border-color: transparent;
	margin: 2px 0 2px 6px;
	color: #e4e7ed;
	background-color: transparent;
}
.faceRecord .el-picker-panel {
	background: #202127;
	box-shadow: 2px 2px 16px 0 rgba(2, 0, 14, 0.3);
	color: #606266;
	border: 1px solid #e4e7ed;
	-webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	border-radius: 4px;
	line-height: 30px;
	margin: 5px 0;
}
.faceRecord .el-input__inner {
	-webkit-appearance: none;
	background-color: transparent;
	background-image: none;
	border-radius: 4px;
	border: 1px solid rgba(255, 255, 255, 0.4);
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	color: #cccccc;
	display: inline-block;
	font-size: inherit;
	height: 40px;
	line-height: 24px;
	outline: 0;
	padding: 0 0px 0 15px;
	/* text-align: center; */
	transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
	width: 100%;
}
.faceRecord .el-button--primary,
.faceRecord .el-button--primary:hover {
	background: rgba(40, 255, 187, 0.15);
	border: 1px solid rgba(32, 204, 150, 0.8);
	border-radius: 3px;
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
	margin-left: 2.8%;
	width: 80px;
	padding: 9px 20px;
	height: 35px;
}
.recordCellFooterTxt {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #dddddd;
	letter-spacing: 0;
}
.recordCellFooter {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 6px 0px 9px;
	box-sizing: border-box;
}
.faceRecord .reccordBoxClass {
	width: 100%;
	height: 100%;
	overflow: auto;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-start;
	background: rgba(36, 39, 42, 1);
	padding: 10px 0px 0px 1.5%;
	box-sizing: border-box;
	align-content: flex-start;
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
.reccordCellClass {
	display: inline-block;
	border: 1px solid rgba(255, 255, 255, 0.1);
	margin: 7px 8px;
	background: rgba(2, 0, 14, 0.2);
	position: relative;
}
.reccordCellClass span {
	display: inline-block;
}
.faceRecord {
	font-family: Helvetica, sans-serif;
	text-align: center;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	background: rgb(28, 29, 32);
	padding: 1.5% 2% 1%;
	box-sizing: border-box;
}
.bottomBox {
	padding: 0px 27px 10px;
	display: flex;
	align-items: center;
	width: 100%;
	background: rgba(36, 39, 42, 1);
}
.topBox {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	padding: 25px 40px 0px 27px;
	/* height: 140px; */
	background: rgba(36, 39, 42, 1);
	border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
	/* overflow-y: auto; */
	box-sizing: border-box;
}
.topBox .topBoxDateTimeBox {
	min-width: 460px;
	text-align: left;
}
.topBox .bth-title {
	opacity: 0.8;
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #ffffff;
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

.topTitleTxt {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
	vertical-align: center;
	/* padding-top: 10px; */
}
</style>
