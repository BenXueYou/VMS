<template>
	<el-dialog
		class="GlobalAlarmDialogClass"
		:visible.sync="isShow"
		@close="closeDialog"
		:title="dialogParama.faceMonitorName||'布控报警'"
		v-dialogDrag
	>
		<div class="GlobalAlarmDialog">
			<el-row type="flex" justify="flex-start" class="GlobalAlarmDialogBodyClass" :gutter="5">
				<div>
					<!-- facelog-->
					<div class="leftColBg">
						<!-- <img
							class="GlobalAlarmDialog-card-img"
							:src="$common.setPictureShow(dialogParama.faceCapturePhotoUrl,PicSourceType)"
						/>-->
						<el-image
							class="GlobalAlarmDialog-card-img"
							:src="$common.setPictureShow(dialogParama.faceCapturePhotoUrl,PicSourceType)"
							:preview-src-list="[$common.setPictureShow(dialogParama.faceCapturePhotoUrl,PicSourceType)]"
						></el-image>
					</div>
					<p>抓拍图片</p>
				</div>
				<el-progress
					class="el-progress-class"
					color="#ffffff"
					:stroke-width="2"
					:width="55"
					type="circle"
					:percentage="dialogParama.faceSimilarity?parseInt(dialogParama.faceSimilarity.toFixed(0)):0"
				></el-progress>
				<div class="rightBox">
					<div class="leftColBg">
						<!-- <img
							class="GlobalAlarmDialog-card-img"
							:src="$common.setPictureShow(dialogParama.facePhotoUrl)"
						/>-->
						<el-image
							class="GlobalAlarmDialog-card-img"
							:src="$common.setPictureShow(dialogParama.facePhotoUrl)"
							:preview-src-list="[$common.setPictureShow(dialogParama.facePhotoUrl)]"
						></el-image>
					</div>
					<p>布控图片</p>
				</div>
				<div class="rightTxtBox">
					<div>{{dialogParama.staffName||'姓名'}}</div>
					<div>{{$common.getEnumItemName('staff_t',dialogParama.staffType)||'人员类型'}}</div>
					<div>{{dialogParama.faceLibraryName||'所属库'}}</div>
					<!-- <div>{{dialogParama.householdType||'住户类型'}}</div> -->
					<div>{{dialogParama.channelName||'抓拍通道'}}</div>
					<div>{{dialogParama.captureDatetime||'抓拍时间'}}</div>
					<p style="visibility: hidden">抓拍图片</p>
				</div>
			</el-row>
			<el-row type="flex" justify="flex-start" class="operatorBoxClass">
				<span>操作：</span>
				<el-button @click="preViewVideo">查看视频</el-button>
				<el-button @click="reviewVideo">查看录像</el-button>
				<el-button @click="closeAudio">关闭声音</el-button>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<p class="footerTxtBox">抓拍记录</p>
				<div class="footerBox">
					<div v-for="(item,index) in 8" :key="index" class="cardBox">
						<el-row class="cardBoxHeader" type="flex" justify="center" :gutter="15">
							<el-col class="facePhoto" :span="9">
								<el-image
									v-if="shootPhotoList[index]&&shootPhotoList[index].faceCapturePhotoUrl"
									:src="$common.setPictureShow(shootPhotoList[index].faceCapturePhotoUrl,PicSourceType)"
									:preview-src-list="[$common.setPictureShow(shootPhotoList[index].faceCapturePhotoUrl,PicSourceType)]"
								></el-image>
								<img
									v-else
									:src="shootPhotoList[index]&&shootPhotoList[index].faceCapturePhotoUrl?$common.setPictureShow(shootPhotoList[index].faceCapturePhotoUrl,PicSourceType):require('@/assets/user.png')"
								/>
							</el-col>
							<el-col class="panoramaPhoto" :span="17">
								<el-image
									v-if="shootPhotoList[index]&&shootPhotoList[index].panoramaCapturePhotoUrl"
									:src="$common.setPictureShow(shootPhotoList[index].panoramaCapturePhotoUrl,PicSourceType)"
									:preview-src-list="[$common.setPictureShow(shootPhotoList[index].panoramaCapturePhotoUrl,PicSourceType)]"
								></el-image>
								<img
									v-else
									:src="shootPhotoList[index]&&shootPhotoList[index].panoramaCapturePhotoUrl?$common.setPictureShow(shootPhotoList[index].panoramaCapturePhotoUrl,PicSourceType):require('@/assets/user.png')"
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
								<span>性别：{{shootPhotoList[index]&&$common.getEnumItemName('gender',shootPhotoList[index].genderCapture)}}</span>
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
import * as api from "@/pages/faceModule/http/logSearchHttp.js";
export default {
  name: "GlobalAlarmDialog",
  props: {
    dialogParama: {},
    dialogShow: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      shootPhotoList: [],
      staffInfo: {},
      taskInfo: {},
      imgSrc: "",
      isShow: false,
      imageHeader: RestApi.api.imageUrl,
      PicSourceType: window.config.PicSourceType
    };
  },
  watch: {
    dialogParama: {
      handler: function(newVal, oldVal) {
        this.staffInfo = newVal || {};
        this.getRecoginizedList();
      },
      deep: true,
      immediate: true
    },
    dialogShow: {
      handler: function(val, oldVal) {
        this.isShow = val;
      },
      deep: true
    }
  },
  mounted: function(e) {
    // 父組件向子組件傳值
    console.log("-------------", this.dialogParama);
    this.staffInfo = this.dialogParama || {};
    this.isShow = this.dialogParama.showDialog;
    this.getRecoginizedList();
  },
  activated: function() {
    console.log("刷新页面");
  },
  methods: {
    // 查看视频
    preViewVideo() {
      this.$store.dispatch("addTagViewItem", {
        icon: "VideoPreview",
        name: "VideoPreview",
        title: "视频预览",
        type: "config",
        path: "/VideoPreview"
      });
      this.$store.dispatch("setLocalTag", "VideoPreview");
      this.$bus.$emit("setLocalTag", "VideoPreview");
      this.$router.push({
        path: "../VideoPreview",
        query: {
          dialogParama: this.dialogParama,
          channelUuid: this.dialogParama.channelUuid
        }
      });
    },
    // 查看录像
    reviewVideo() {
      this.$store.dispatch("addTagViewItem", {
        icon: "vistorMange",
        name: "VideoPlayback",
        title: "视频回放",
        type: "config",
        path: "/VideoPlayback"
      });
      this.$store.dispatch("setLocalTag", "VideoPlayback");
      this.$bus.$emit("setLocalTag", "VideoPlayback");
      this.$router.push({
        path: "../VideoPlayback",
        query: {
          dialogParama: this.dialogParama,
          channelUuid: this.dialogParama.channelUuid,
          channelName: this.dialogParama.channelName
        }
      });
    },
    closeAudio() {
      this.$emit("closeAudio");
    },
    // 查询识别记录
    getRecoginizedList() {
      var data = {
        limit: 8, // int每页显示行数是
        page: 1, // int第几页是
        faceUuid: this.dialogParama.faceUuid
      };
      api
        .getRecognizeInfo(data)
        .then(res => {
          if (res.data.success) {
            this.shootPhotoList = res.data.data.list;
          }
        })
        .catch(() => {});
    },
    clickImg(e) {
      this.$emit("cs", true);
      // 获取当前图片地址
      this.imgSrc = e.currentTarget.src;
    },
    mousedown(event) {
      this.selectElement = event.currentTarget;
      var div1 = this.selectElement.parentNode.parentNode.parentNode;
      this.selectElement.style.cursor = "move";
      this.isDowm = true;
      var distanceX = event.clientX - this.selectElement.offsetLeft;
      var distanceY = event.clientY - this.selectElement.offsetTop;
      document.onmousemove = function(ev) {
        var oevent = ev || event;
        div1.style.left = oevent.clientX - distanceX + "px";
        div1.style.top = oevent.clientY - distanceY + "px";
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
        div1.style.cursor = "default";
      };
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
      this.isShow = false;
      this.$emit("close");
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
	color: #bbbbbb;
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
	padding: 0 25px;
	border-bottom: 1px solid rgba(40, 255, 187, 0.1);
	background-color: rgba(255, 0, 0, 0.1);
}
.GlobalAlarmDialogClass .el-dialog__header .el-dialog__title {
	border-left: 3px solid #fd545e;
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
.GlobalAlarmDialog .leftColBg .el-image .el-image-viewer__canvas img,
.GlobalAlarmDialog .cardBox .facePhoto .el-image .el-image-viewer__canvas img {
	width: auto;
	max-width: 100%;
	height: 100%;
}
.GlobalAlarmDialog .leftColBg .GlobalAlarmDialog-card-img.el-image {
	height: 100%;
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
.GlobalAlarmDialogClass.el-dialog__wrapper {
	overflow: auto;
}
</style>
