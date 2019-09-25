<template>
	<div class="xydialog">
		<big-img v-if="showImgs" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
		<el-row type="flex" justify="center" class="xydialogBodyClass" :gutter="5">
			<el-col :span="9">
				<p>抓拍图片</p>
				<el-row type="flex" class="leftColBg" justify="center" :gutter="15">
					<el-col :span="10">
						<img
							class="xydialog-card-img"
							:src="dialogParama.imageUri?dialogParama.imageUri:require('@/assets/user.png')"
						/>
					</el-col>
					<el-col :span="14">
						<div class="firstTitle">
							<div>抓拍时间</div>
							<div>特征识别：特征识别</div>
							<div>布控任务：{{dialogParama&&dialogParama.extinfo?shootPhotoList[0].extinfo.taskname:'--'}}</div>
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
					:percentage="dialogParama&&dialogParama.faceRecognization?parseInt(dialogParama.faceRecognization.scores.toFixed(0)):0"
				></el-progress>
			</el-col>
			<el-col :span="13">
				<p>布控图片</p>
				<el-row type="flex" justify="center" :gutter="15" class="leftColBg">
					<el-col :span="7">
						<img
							class="xydialog-card-img"
							:src="dialogParama.staffinfo?dialogParama.staffinfo.facePhotoUrl:require('@/assets/user.png')"
						/>
					</el-col>
					<el-col :span="17">
						<el-row type="flex" justify="space-between" class="rightTxt">
							<el-col :span="10" style="margin-right:8px">
								<div>所属库：{{dialogParama.staffInfo?dialogParama.staffInfo.faceLibraryName:''}}</div>
								<div>姓名：{{dialogParama.staffInfo?dialogParama.staffInfo.staffName:''}}</div>
								<div>性别：{{dialogParama.staffInfo?dialogParama.staffInfo.gender:''}}</div>
								<div>人员类型：{{dialogParama.staffInfo?dialogParama.staffInfo.staffType:''}}</div>
								<div>住户类型：{{dialogParama.staffInfo?dialogParama.staffInfo.householdType:''}}</div>
								<div>户籍：{{dialogParama.staffInfo?dialogParama.staffInfo.householdRegister:''}}</div>
							</el-col>
							<el-col :span="14">
								<div>民族：{{dialogParama.staffInfo?dialogParama.staffInfo.nation:''}}</div>
								<div>出生年月：{{dialogParama.staffInfo?dialogParama.staffInfo.birthday:''}}</div>
								<div>证件类型：{{dialogParama.staffInfo?dialogParama.staffInfo.credentialType:''}}</div>
								<div>证件号码：{{dialogParama.staffInfo?dialogParama.staffInfo.credentialNo:''}}</div>
								<div>住户地址：{{dialogParama.staffInfo?dialogParama.staffInfo.address:''}}</div>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
		<div slot="footer" class="dialog-footer">
			<div class="footerBox">
				<div v-for="(item,index) in 8" :key="index" class="cardBox">
					<el-row class="cardBoxHeader" type="flex" justify="center" :gutter="15">
						<el-col class="facePhoto" :span="9">
							<img
								:src="dialogParama.imageUri?dialogParama.imageUri:require('@/assets/user.png')"
								alt
								srcset
							/>
						</el-col>
						<el-col class="panoramaPhoto" :span="17">
							<img
								:src="dialogParama.imageUri?dialogParama.imageUri:require('@/assets/user.png')"
								alt
								srcset
							/>
						</el-col>
					</el-row>
					<div class="cardBoxFooter">
						<el-row type="flex" justify="space-between">
							<el-col :span="12">{{item.channelName?item.channelName:"通道名称"}}</el-col>
							<el-col :span="12">{{item.captureDatetime?item.captureDatetime:"抓拍时间"}}</el-col>
						</el-row>
						<el-row type="flex" justify="space-around">
							<span>特征：{{item.sunglasses?'戴墨镜 ':" "}} {{item.mask?'戴口罩':""}}</span>
							<span>性别：{{item.genderCapture||''}}</span>
							<span>年龄：{{item.age||''}}</span>
							<span>眼镜：{{item.glasses?'戴眼镜 ':" "}}   </span>
						</el-row>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js";
import BigImg from "./BigImg.vue";
export default {
  name: "xydialog",
  props: {
    dialogParama: {},
    shootPhotoList: null,
    showImg: {
      type: Boolean
    }
  },
  components: { "big-img": BigImg },

  data: function() {
    return {
      comparePhotoListItem: {},
      currentDate: "11:21:13",
      currentDay: "2018.8.9",
      menuType: "",
      showImgs: false,
      imgSrc: "",
      dialogPhotoType: true,
      photoCompareDeals: false,
      scrollValue: 120, // 点击左右箭头，移动的偏移量
      api: this.$store.state.api, // http://172.20.10.11:5000/mppr-face
      socketIP: this.$store.state.socketIP, //
      mainVideoScreenLoading: false,
      updatedFlag: false,
      on_off: false
    };
  },
  watch: {
    showImg: function() {
      this.showImgs = this.showImg;
      // return this.showImg;
    },
    dialogParama: {
      handler: function(val, oldVal) {},
      deep: true
    }
  },

  mounted: function(e) {
    // 父組件向子組件傳值
    console.log(this.dialogParama);
    //  this.shootPhotoList = this.dialogParama.shootPhotoList;
  },
  activated: function() {
    console.log("刷新页面");
    // this.getAlarmShootPhotoList();
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
    // 关于照片类型展示
    photoTypeSwitch(isBool) {
      // console.log(this.on_off,'------点击之前-----', this.dialogParama);

      this.on_off = isBool;

      //  console.log(this.on_off,'------点击之后-----');
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
	font-family: 'PingFangSC-Regular';
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
	font-family: PingFangSC-Regular;
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
	margin: 65% auto  0;
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
	width: 850px;
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
.cardBox .xydialog-card-img {
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
