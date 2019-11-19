<template>
	<div class="xydialog">
		<big-img v-if="showImgs" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
		<el-row type="flex" justify="center" class="xydialogBodyClass" :gutter="5">
			<el-col :span="9">
				<p>抓拍图片</p>
				<el-row type="flex" class="leftColBg" justify="center" :gutter="15">
					<el-col :span="10">
						<!-- <img
							class="xydialog-card-img"
							v-image-preview
							:src="$common.setPictureShow(taskInfo.faceCapturePhotoUrl,PicSourceType)"
						/>-->
						<el-image
							class="xydialog-card-img"
							:src="$common.setPictureShow(taskInfo.faceCapturePhotoUrl,PicSourceType)"
							:preview-src-list="[$common.setPictureShow(taskInfo.faceCapturePhotoUrl,PicSourceType)]"
						></el-image>
					</el-col>
					<el-col :span="14">
						<div class="firstTitle">
							<div>{{taskInfo.channelName||'抓拍通道'}}</div>
							<div>{{taskInfo.captureDatetime||'抓拍时间'}}</div>
							<div>特征识别：{{taskInfo.sunglasses?'戴墨镜 ':" "}} {{taskInfo.mask?'戴口罩':""}}</div>
							<div>布控任务：{{taskInfo.taskName}}</div>
						</div>
					</el-col>
				</el-row>
			</el-col>
			<el-col :span="2">
				<el-progress
					class="el-progress-class"
					color="#ffffff"
					:stroke-width="2"
					:width="55"
					type="circle"
					:percentage="taskInfo.similarity?parseInt(taskInfo.similarity.toFixed(0)):0"
				></el-progress>
			</el-col>
			<el-col :span="13">
				<p>布控图片</p>
				<el-row type="flex" justify="center" :gutter="15" class="leftColBg">
					<el-col :span="7">
						<!-- <img
							class="xydialog-card-img"
							v-image-preview
							:src="staffInfo.facePhotoUrl?imageHeader+staffInfo.facePhotoUrl:require('@/assets/user.png')"
						/>-->
						<el-image
							class="xydialog-card-img"
							:src="$common.setPictureShow(staffInfo.facePhotoUrl)"
							:preview-src-list="[$common.setPictureShow(staffInfo.facePhotoUrl)]"
						></el-image>
					</el-col>
					<el-col :span="17">
						<el-row type="flex" justify="space-between" class="rightTxt">
							<el-col :span="10" style="margin-right:8px">
								<div>所属库：{{staffInfo?staffInfo.faceLibraryName:''}}</div>
								<div>姓名：{{staffInfo?staffInfo.staffName:''}}</div>
								<div>性别：{{$common.getEnumItemName('gender',staffInfo.gender)}}</div>
								<div>人员类型：{{$common.getEnumItemName('staff_t',staffInfo.staffType)}}</div>
								<div>住户类型：{{staffInfo?staffInfo.householdType:''}}</div>
								<div>户籍：{{staffInfo?staffInfo.householdRegister:''}}</div>
							</el-col>
							<el-col :span="14">
								<div>民族：{{$common.getEnumItemName('nation',staffInfo.nation)}}</div>
								<div>出生年月：{{staffInfo?staffInfo.birthday:''}}</div>
								<div>证件类型：{{$common.getEnumItemName('cred',staffInfo.credentialType)}}</div>
								<div>证件号码：{{staffInfo?staffInfo.credentialNo:''}}</div>
								<div>住户地址：{{staffInfo?staffInfo.address:''}}</div>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
		<div slot="footer" class="dialog-footer">
			<div class="footerBox">
				<div v-for="(item,index) in 8" :key="index" class="cardBox">
					<el-row class="cardBoxHeader" type="flex" justify="center">
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
							<span>性别：{{$common.getEnumItemName('gender',shootPhotoList[index]&&shootPhotoList[index].genderCapture)}}</span>
							<span>年龄：{{shootPhotoList[index]&&shootPhotoList[index].age||''}}</span>
							<span>眼镜：{{shootPhotoList[index]&&shootPhotoList[index].glasses?'戴眼镜 ':" "}}</span>
						</el-row>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
import RestApi from "@/utils/RestApi.js";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js";
import BigImg from "./BigImg.vue";
export default {
  name: "xydialog",
  props: {
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
      PicSourceType: window.config.PicSourceType
    };
  },
  watch: {
    showImg: function(val) {
      this.showImgs = val;
    },
    dialogParama: {
      handler: function(val, oldVal) {
        console.log(val, oldVal);
        if (!val.list) return;
        this.shootPhotoList = JSON.parse(JSON.stringify(val.list)) || [];
        this.staffInfo = val.staffInfoEntity || {};
        this.taskInfo = this.shootPhotoList[0] || {};
        this.taskInfo.taskName = "";
        this.taskInfo.list.map((item, index) => {
          this.taskInfo.taskName += item.faceMonitorName + ",";
        });
        this.taskInfo.taskName = this.taskInfo.taskName.substr(
          0,
          this.taskInfo.taskName.length - 1
        );
      },
      deep: true
    }
  },

  mounted: function(e) {
    // 父組件向子組件傳值
    console.log(this.dialogParama);
    if (this.dialogParama.list) {
      this.shootPhotoList =
				JSON.parse(JSON.stringify(this.dialogParama.list)) || [];
      this.staffInfo = this.dialogParama.staffInfoEntity || {};
      this.taskInfo = this.shootPhotoList[0] || {};
      this.taskInfo.taskName = "";
      this.taskInfo.list.map((item, index) => {
        this.taskInfo.taskName += item.faceMonitorName + ",";
      });
      this.taskInfo.taskName = this.taskInfo.taskName.substr(
        0,
        this.taskInfo.taskName.length - 1
      );
    }
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
      this.$emit("transferCloseDialog", false);
    }
  }
};
</script>
<style type="text/css">
.xydialog .cardBoxFooter {
	height: 60px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #bbbbbb;
	letter-spacing: 0;
}
.xydialogBodyClass {
	align-items: center;
	box-sizing: border-box;
	padding-bottom: 25px;
}
.xydialogBodyClass p {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #26d39d;
}
.xydialogBodyClass .leftColBg {
	background: rgba(33, 35, 37, 0.8);
	height: 100%;
}
.xydialog .el-icon-caret-left:before {
	font-size: 25px;
	content: "\E60A";
}
.xydialog .el-icon-caret-right:before {
	font-size: 25px;
	content: "\E60E";
}
.xydialog .el-progress__text {
	font-size: 14px !important;
	color: #fff;
	display: inline-block;
	vertical-align: middle;
	line-height: 1;
}
.xydialog .textclipsClass {
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
.rightTxt {
	height: 100%;
}
.rightTxt div {
	text-align: left;
	font-family: "PingFangSC-Regular";
	font-size: 10px !important;
	color: #dddddd;
}
.rightTxt .el-col {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	font-size: 10px;
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
.xydialog .el-dialog__header {
	text-align: left;
	padding: 20px 20px 10px;
}
.xydialog .el-progress-class {
	margin: 65% auto 0;
}
.xydialog {
	text-align: center;
	width: 100%;
	height: calc(100% - 60px);
	padding: 0px 33px 30px 36px;
	box-sizing: border-box;
}
.colBoxClass::-webkit-scrollbar {
	display: none;
}
.xydialog .dialog-footer {
	height: 480px;
	box-sizing: border-box;
	padding-bottom: 30px;
	border-top: 1px dashed rgba(102, 102, 102, 0.6);
	overflow: auto;
}
.xydialog .dialog-footer .footerBox {
	height: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-start;
}
.xydialog .dialog-footer .cardBox {
	width: calc(50% - 18px);
	height: calc(50% - 20px);
	margin-top: 15px;
	margin-right: 15px;
	background-color: rgba(33, 35, 37, 0.8);
	border: 1px solid rgba(255, 255, 255, 0.1);
	padding-top: 10px;
}

.xydialog .cardBox .facePhoto {
	width: 139px;
	height: 139px;
	margin-right: 7.5px;
}
.xydialog .cardBox .panoramaPhoto {
	width: 248px;
	height: 139px;
}
.xydialog .cardBox .facePhoto img,
.xydialog .cardBox .panoramaPhoto img {
	width: 100%;
	height: 100%;
}
.xydialog .xydialog-card-img {
	width: 121px;
	height: 121px;
	-webkit-background-size: cover;
	-webkit-background-origin: content;
	background-origin: content-box;
	background-size: cover;
	-webkit-background-origin: content;
	background-origin: content-box;
	background-clip: content-box;
}
.xydialog .footerCardImg {
	width: 100%;
	height: 100%;
	-webkit-background-size: cover;
	background-origin: content;
	background-size: auto 100%;
	background-origin: content;
}
</style>
