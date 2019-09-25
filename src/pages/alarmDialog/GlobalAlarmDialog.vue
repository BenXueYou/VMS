<template>
	<el-dialog class="GlobalAlarmDialogClass" :visible.sync="dialogVisible" @close="closeDialog">
		<el-row>
			<div class="global_el-dialog__header">
				<span class="el-dialog__title">{{taskInfo.taskName||'布控报警'}}</span>
				<button type="button" aria-label="Close" class="el-dialog__headerbtn">
					<i class="el-dialog__close el-icon el-icon-close" @click="dialogVisible = false"></i>
				</button>
			</div>
		</el-row>
		<div class="GlobalAlarmDialog">
			<big-img v-if="showImgs" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
			<el-row type="flex" justify="flex-start" class="GlobalAlarmDialogBodyClass" :gutter="5">
				<div>
					<div class="leftColBg">
						<img
							class="GlobalAlarmDialog-card-img"
							:src="taskInfo.faceCapturePhotoUrl?imageHeader+taskInfo.faceCapturePhotoUrl:require('@/assets/user.png')"
						/>
					</div>
					<p>抓拍图片</p>
				</div>
				<el-progress
					class="el-progress-class"
					color="#ffffff"
					:stroke-width="2"
					:width="55"
					type="circle"
					:percentage="taskInfo.similarity?parseInt(taskInfo.similarity.toFixed(0)):0"
				></el-progress>

				<div class="rightBox">
					<div class="leftColBg">
						<img
							class="GlobalAlarmDialog-card-img"
							:src="staffInfo.facePhotoUrl?imageHeader+staffInfo.facePhotoUrl:require('@/assets/user.png')"
						/>
					</div>
					<p>布控图片</p>
				</div>
				<div class="rightTxtBox">
					<div>{{staffInfo.staffName||'姓名'}}</div>
					<div>{{staffInfo.staffType||'人员类型'}}</div>
					<div>{{staffInfo.faceLibraryName||'所属库'}}</div>
					<!-- <div>{{staffInfo.householdType||'住户类型'}}</div> -->
					<div>{{staffInfo.channelName||'抓拍通道'}}</div>
					<div>{{taskInfo.captureDatetime||'抓拍时间'}}</div>
					<p style="visibility: hidden">抓拍图片</p>
				</div>
			</el-row>
			<el-row type="flex" justify="flex-start" class="operatorBoxClass">
				<span>操作：</span>
				<el-button>查看视频</el-button>
				<el-button>查看录像</el-button>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<p class="footerTxtBox">抓拍记录</p>
				<div class="footerBox">
					<div v-for="(item,index) in 8" :key="index" class="cardBox">
						<el-row class="cardBoxHeader" type="flex" justify="center" :gutter="15">
							<el-col class="facePhoto" :span="9">
								<img
									:src="shootPhotoList[index]&&shootPhotoList[index].faceCapturePhotoUrl?imageHeader+dialogParama.faceCapturePhotoUrl:require('@/assets/user.png')"
								/>
							</el-col>
							<el-col class="panoramaPhoto" :span="17">
								<img
									:src="shootPhotoList[index]&&shootPhotoList[index].panoramaCapturePhotoUrl?imageHeader+dialogParama.panoramaCapturePhotoUrl:require('@/assets/user.png')"
								/>
							</el-col>
						</el-row>
						<div class="cardBoxFooter">
							<el-row type="flex" justify="space-between">
								<el-col
									:span="12"
								>{{shootPhotoList[index]&&shootPhotoList[index].channelName?shootPhotoList[index].channelName:"通道名称"}}</el-col>
								<el-col
									:span="12"
								>{{shootPhotoList[index]&&shootPhotoList[index].captureDatetime?shootPhotoList[index].captureDatetime:"抓拍时间"}}</el-col>
							</el-row>
							<el-row type="flex" justify="space-around">
								<span>特征：{{shootPhotoList[index]&&shootPhotoList[index].sunglasses?'戴墨镜 ':" "}} {{shootPhotoList[index]&&shootPhotoList[index].mask?'戴口罩':""}}</span>
								<span>性别：{{shootPhotoList[index]&&shootPhotoList[index].genderCapture||''}}</span>
								<span>年龄：{{shootPhotoList[index]&&shootPhotoList[index].age||''}}</span>
								<span>眼镜：{{shootPhotoList[index]&&shootPhotoList[index].glasses?'戴眼镜 ':" "}}</span>
							</el-row>
						</div>
					</div>
				</div>
			</div>
		</div>
	</el-dialog>
</template>
<script type="text/javascript">
import RestApi from "@/utils/RestApi.js";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js";
import BigImg from "@/pages/faceModule/components/BigImg.vue";
export default {
  name: "GlobalAlarmDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dialogParama: {},
    showImg: {
      type: Boolean
    }
  },
  components: { "big-img": BigImg },
  data: function() {
    return {
      shootPhotoList: [],
      staffInfo: {},
      taskInfo: {},
      showImgs: false,
      imgSrc: "",
      imageHeader: RestApi.api.imageUrl,
      dialogVisible: false
    };
  },
  watch: {
    showImg: function() {
      this.showImgs = this.showImg;
    },
    dialogParama: {
      handler: function(val, oldVal) {
        this.shootPhotoList = JSON.parse(JSON.stringify(val.list)) || [];
        this.staffInfo = val.staffInfo || {};
        this.taskInfo = this.shootPhotoList[0] || {};
        this.taskInfo.taskName = this.taskInfo.taskList.join("，");
      },
      deep: true
    },
    visible(val) {
      this.dialogVisible = val;
    }
  },

  mounted: function(e) {
    // 父組件向子組件傳值
    console.log(this.dialogParama);
  },
  activated: function() {
    console.log("刷新页面");
  },
  methods: {
    clickImg(e) {
      this.$emit("cs", true);
      // 获取当前图片地址
      this.imgSrc = e.currentTarget.src;
    },
    viewImg() {
      this.$emit("cs", false);
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
    },
    closeDialog() {
      this.$emit("update:visible", false);
    }
  }
};
</script>
<style type="text/css">
.GlobalAlarmDialog .cardBoxFooter {
	height: 60px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #bbbbbb;
	letter-spacing: 0;
}
.GlobalAlarmDialogBodyClass {
	align-items: center;
	box-sizing: border-box;
    padding: 19px 20px 12px;
	background: rgba(0, 0, 0, 0.21);
	border-radius: 3px;
}
.GlobalAlarmDialogBodyClass p {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #BBBBBB;
}
.GlobalAlarmDialogBodyClass .leftColBg {
	background: rgba(33, 35, 37, 0.8);
	width: 139px;
	height: 139px;
}
.GlobalAlarmDialogBodyClass .leftColBg img {
	width: 100%;
	height: 100%;
}
.GlobalAlarmDialog .el-icon-caret-left:before {
	font-size: 25px;
	content: "\E60A";
}
.GlobalAlarmDialog .el-icon-caret-right:before {
	font-size: 25px;
	content: "\E60E";
}
.GlobalAlarmDialog .el-progress__text {
	font-size: 14px !important;
	color: #fff;
	display: inline-block;
	vertical-align: middle;
	line-height: 1;
}
.global_el-dialog__header {
	padding: 0 25px;
	border-bottom: 1px solid rgba(40, 255, 187, 0.1);
}
.GlobalAlarmDialog .textclipsClass {
	display: block;
	width: 100%;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	font-size: 12px;
	font-family: "PingFangSC-Regular";
	color: rgba(255, 255, 255, 0.6);
	letter-spacing: 0;
}
.GlobalAlarmDialogClass .el-dialog__header {
	display: none;
	padding: 20px 20px 10px;
}
.GlobalAlarmDialog .rightTxtBox {
	padding-left: 35px;
	height: 100%;
}
.GlobalAlarmDialog .rightTxtBox div {
	text-align: left;
	font-family: "PingFangSC-Regular";
	font-size: 12px !important;
	color: #bbbbbb;
	line-height: 27px;
}
.GlobalAlarmDialog .rightTxtBox .el-col {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	font-size: 12px;
}
.firstTitle {
	text-align: left;
	font-size: 12px;
	color: #dddddd;
	margin: auto;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}
.GlobalAlarmDialog .el-dialog__header {
	text-align: left;
	padding: 20px 20px 10px;
}
.GlobalAlarmDialog .el-progress-class {
	margin: 0 30px;
}
.GlobalAlarmDialog {
	text-align: center;
	width: 100%;
	height: calc(100% - 60px);
	padding: 0px 33px 30px 36px;
	box-sizing: border-box;
}
.colBoxClass::-webkit-scrollbar {
	display: none;
}
.GlobalAlarmDialog .dialog-footer {
	height: 480px;
	box-sizing: border-box;
	padding-bottom: 30px;
	border-top: 1px dashed rgba(102, 102, 102, 0.6);
	overflow: auto;
}
.GlobalAlarmDialog .dialog-footer .footerBox {
	height: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-start;
}
.GlobalAlarmDialog .dialog-footer .cardBox {
	width: calc(50% - 18px);
	height: calc(50% - 20px);
	margin-top: 15px;
	margin: 15px 7.5px 0;
	background-color: rgba(33, 35, 37, 0.8);
	border: 1px solid rgba(255, 255, 255, 0.1);
	padding: 10px 10px 0;
	box-sizing: border-box;
}

.GlobalAlarmDialog .cardBox .facePhoto {
	width: 139px;
	height: 139px;
}
.GlobalAlarmDialog .cardBox .panoramaPhoto {
	width: 248px;
	height: 139px;
}
.GlobalAlarmDialog .cardBox .facePhoto img,
.GlobalAlarmDialog .cardBox .panoramaPhoto img {
	width: 100%;
	height: 100%;
}
.cardBox .GlobalAlarmDialog-card-img {
	width: 139px;
	height: 139px;
	-webkit-background-size: cover;
	-webkit-background-origin: content;
	background-origin: content-box;
	background-size: cover;
	-webkit-background-origin: content;
	background-origin: content-box;
	background-clip: content-box;
}
.GlobalAlarmDialog .footerCardImg {
	width: 100%;
	height: 100%;
	-webkit-background-size: cover;
	background-origin: content;
	background-size: auto 100%;
	background-origin: content;
}
.GlobalAlarmDialog .operatorBoxClass {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #dddddd;
	text-align: right;
	line-height: 35px;
	margin: 15px 0;
}
.GlobalAlarmDialog .operatorBoxClass .el-button {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
	text-align: justify;
	background: rgba(40, 255, 187, 0.08);
	border: 0 solid rgba(38, 211, 157, 0.8);
	border-radius: 2px;
	margin-left: 15px;
}
.GlobalAlarmDialog .footerTxtBox {
	border-left: 2px solid #28ffbb;
	text-align: left;
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #dddddd;
	padding-left: 8px;
}
.GlobalAlarmDialogClass.el-dialog__wrapper{
	overflow:auto;
}
</style>
