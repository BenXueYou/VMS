<template>
	<div class="mydialog">
		<el-row class="mydialogTitle">对比结果</el-row>
		<big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
		<el-row style="padding-bottom:28px">
			<el-col :span="7">
				<img
					class="mydialog-card-img"
					:src="this.dialogParama.imgUrl?this.dialogParama.imgUrl:require('@/assets/user.png')"
				/>
				<el-progress
					class="el-progress-class"
					color="#ffffff"
					:stroke-width="2"
					:width="50"
					type="circle"
					:percentage="parseInt(this.dialogParama.scores.toFixed(0))"
				></el-progress>
				<img
					class="mydialog-card-img"
					:src="this.dialogParama.primaryImageUrl?this.dialogParama.primaryImageUrl:require('@/assets/user.png')"
				/>
			</el-col>
			<el-col
				:span="17"
				style="background: rgba(255,255,255,0.02);border-radius: 2px;padding:31px 21px 0;"
			>
				<div class="firstTitle">
					<div style="font-size: 16px;color:#ffffff">
						<img src="@/assets/images/address.svg" style="vertical-align: middle;margin-right:13px;" alt />
						<span>{{this.dialogParama.channelName}}</span>
					</div>
					<div
						class="leftTxt"
					>{{this.dialogParama.shotTime.split(" ")[0]}} {{this.dialogParama.shotTime.split(" ")[1]}}</div>
					<div class="rightTxt">特征识别：特征识别</div>
				</div>
				<div style="text-align: left; font-size: 12px; line-height:30px;padding:36px 0px 20px">
					<div>
						<el-row type="flex" justify="space-between" style="line-height: 40px;font-size: 17px">
							<el-col :span="10" class="firstTitle" style="font-size: 16px;color:#ffffff">
								<img src="@/assets/images/name.svg" style="vertical-align: middle;margin-right:13px;" alt />
								<span
									style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden;"
									@mouseover="mymouseover"
									@mouseout="mymouseout"
									@mousemove="mymousemove"
								>姓名：{{this.dialogParama.staffName}}</span>
							</el-col>
							<el-col :span="14" class="firstTitle" style="font-size: 16px;color:#ffffff">
								<img
									src="@/assets/images/libName.svg"
									style="vertical-align: middle;margin-right:13px;"
									alt
								/>
								<span>所属库：{{this.dialogParama.faceLibName}}</span>
							</el-col>
						</el-row>
					</div>

					<div>
						<el-row type="flex" justify="space-between" style="line-height: 25px;font-size: 14px">
							<el-col
								v-if="this.dialogParama.sex"
								:span="10"
								class="rightTxt"
							>性别：{{this.dialogParama.sex === 'male'?'男':"女"}}</el-col>
							<el-col v-else :span="10" class="rightTxt">性别：{{this.dialogParama.sex}}</el-col>
							<el-col :span="14" class="rightTxt">联系方式：{{this.dialogParama.contactNum}}</el-col>
						</el-row>
					</div>
					<div>
						<el-row type="flex" justify="space-between" style="line-height: 25px;font-size: 14px">
							<el-col :span="10" class="rightTxt">户籍：{{this.dialogParama.address}}</el-col>
							<el-col :span="14" class="rightTxt">邮箱：{{this.dialogParama.email}}</el-col>
						</el-row>
					</div>
					<div>
						<el-row type="flex" justify="space-between" style="line-height: 25px;font-size: 14px">
							<el-col :span="10" class="rightTxt">职业：{{this.dialogParama.job}}</el-col>
							<el-col :span="14" class="rightTxt">证件号：{{this.dialogParama.idNum}}</el-col>
						</el-row>
					</div>
					<div>
						<el-row type="flex" justify="space-between" style="line-height: 25px;font-size: 14px">
							<el-col :span="10" class="rightTxt">年龄：{{this.dialogParama.age}}</el-col>
							<el-col :span="14" class="rightTxt">公司：{{this.dialogParama.companyAddress}}</el-col>
						</el-row>
					</div>
					<div>
						<el-row type="flex" justify="space-between" style="line-height: 25px;font-size: 14px">
							<el-col :span="6" class="rightTxt">标签：</el-col>
							<el-col :span="18">
								<!-- <el-tag>标签一</el-tag><el-tag type="success">标签二</el-tag><el-tag type="info">标签三</el-tag><el-tag type="warning">标签四</el-tag> -->
								{{this.dialogParama.tags}}
							</el-col>
						</el-row>
					</div>
				</div>
			</el-col>
		</el-row>

		<!-- ============================="channelName": "string",
      "shootTime": "2018-10-16T06:57:51.962Z",
		"shootUrl": "string"============-->
		<div slot="footer" class="dialog-footer">
			<div class="photoItemClass dialogBodyClass">
				<div class="photoTypeBoxClass">
					<span class="photoTypeBtn" :class="{activeClass:on_off}" @click="on_off=true">人脸图片</span>
					<span class="photoTypeBtn" :class="{activeClass:!on_off}" @click="on_off=false">全景图片</span>
					<!-- <span class="photoTypeBtn" :class="{activeClass:!on_off}" @click="on_off=false">{{dialogParama.shootPhotoList}}</span> -->
				</div>
				<div
					style="display:flex;flex-direction: row;justify-content: space-between;align-items: center;"
				>
					<el-row>
						<i class="el-icon-caret-left" @click="scrollToLeft"></i>
					</el-row>

					<el-row
						:gutter="0"
						id="scrollView"
						class="colBoxClass"
						v-loading.body="mainVideoScreenLoading"
						element-loading-background="rgba(0, 0, 0, 0.8)"
					>
						<el-col
							:class="on_off?'colClass':'colClass169'"
							v-for="(o, index) in shootPhotoList"
							:key="index"
						>
							<div :class="on_off?'dialogImgClass':'dialogImgClass169'">
								<img
									style="width: 100%"
									@click="clickImg($event)"
									:src="on_off==true?o.shootUrl:o.wholeUrl"
									class="image footerCardImg"
								/>
							</div>
							<!-- <div class="dialogImgClass">{{o.shootUrl}}</div> -->
							<span
								class="dialogPhotoItemTxt textclipsClass"
								@mouseover="mymouseover"
								@mouseout="mymouseout"
								@mousemove="mymousemove"
							>{{o.shootTime?o.shootTime.split(" ")[0]:dialogParama.snapShotTime.split(" ")[0]}}</span>
							<span
								class="dialogPhotoItemTxt textclipsClass"
								@mouseover="mymouseover"
								@mouseout="mymouseout"
								@mousemove="mymousemove"
							>{{o.shootTime?o.shootTime.split(" ")[1]:dialogParama.snapShotTime.split(" ")[1]}}</span>
							<span
								class="dialogPhotoItemTxt textclipsClass"
								@mouseover="mymouseover"
								@mouseout="mymouseout"
								@mousemove="mymousemove"
							>{{o.channelName?o.channelName:dialogParama.channelName}}</span>
						</el-col>
					</el-row>
					<el-row>
						<i class="el-icon-caret-right" @click="scrollToRight"></i>
					</el-row>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
import { mouseover, mouseout, mousemove } from "@/common/mouse.js";
import BigImg from "./BigImg.vue";
export default {
  name: "mydialog",
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
      imgSrc: "",
      dialogPhotoType: true,
      photoCompareDeals: false,
      scrollValue: 120, // 点击左右箭头，移动的偏移量
      api: this.$store.state.api, // http://172.20.10.11:5000/mppr-face
      socketIP: this.$store.state.socketIP, //
      mainVideoScreenLoading: false,
      updatedFlag: false,
      on_off: true
    };
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
      // 获取当前图片地址
      this.$emit("cs", true);
      this.imgSrc = e.currentTarget.src;
    },
    viewImg() {
      this.$emit("cs", false);
      this.showImg = false;
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
    photoTypeSwitch(onOff) {
      this.on_off = onOff;
    },

    closeDialog() {
      this.$emit("transferCloseDialog", false);
    },

    scrollToLeft() {
      let dom = document.getElementById("scrollView");
      console.log(dom, "向左滚动", dom.scrollLeft);
      document.getElementById("scrollView").scrollLeft += this.scrollValue;

      console.log("向左滚动", document.getElementById("scrollView").scrollLeft);
    },
    scrollToRight() {
      console.log("向右滚动");
      let dom = document.getElementById("scrollView");
      console.log(dom, "向右滚动", dom.scrollLeft);
      document.getElementById("scrollView").scrollLeft -= this.scrollValue;

      console.log("向右滚动", document.getElementById("scrollView").scrollLeft);
    }
  }
};
</script>
<style type="text/css">
.mydialog .el-icon-caret-left:before {
	font-size: 25px;
	content: "\E60A";
}
.mydialog .el-icon-caret-right:before {
	font-size: 25px;
	content: "\E60E";
}
.mydialog .el-progress__text {
	font-size: 14px !important;
	color: #fff;
	display: inline-block;
	vertical-align: middle;
	/*margin-left: 10px;*/
	line-height: 1;
}
.dialogPhotoItemTxt {
	opacity: 0.8;
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #ffffff;
	text-align: center;
	line-height: 17px;
}
.mydialog .textclipsClass {
	display: block;
	width: 100%;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.mydialog .dialogImgClass169 {
	width: 177px;
	height: 100px;
	margin-bottom: 13px;
}
.dialogImgClass {
	width: 100px;
	height: 100px;
	margin-bottom: 13px;
}
.dialogImgClass img {
	width: 100%;
	height: 100%;
}
.mydialog .colClass {
	width: 114px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	padding: 0 11px;
}
.mydialog .colClass169 {
	width: 180px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	padding: 0 11px;
}
.mydialog .colBoxClass {
	/* margin-left: -5px;
    margin-right: -5px; */
	width: calc(100% + 15px);
	height: 200px;
	overflow: -webkit-paged-x;
	padding-top: 15px;
	box-sizing: border-box;
}
.photoTypeBtn {
	background: rgba(255, 255, 255, 0.05);
	border-radius: 3px 3px 0 0;

	font-family: PingFangSC-Regular;
	font-size: 16px;
	color: #cccccc;
	text-align: right;
	margin: 20px 20px 10px 0px;
	height: 36px;
	padding: 7px 26px 6px 26px;
}
.photoTypeBoxClass {
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	line-height: 36px;
	text-align: left;
}
.photoTypeBoxClass .activeClass {
	background: rgba(40, 255, 187, 0.05);
	border-radius: 3px 3px 0 0;
	color: #ffffff;
}
.dialogBodyClass {
	padding: 0px 28px 20px 20px;
	box-sizing: border-box;
}
.photoItemClass {
	padding: 0px 28px 0px 32px;
	box-sizing: border-box;
	/* border-bottom: 1px dashed rgba(255, 255, 255, 0.1); */
}
.rightTxt {
	padding-left: 35px;
	margin: 0;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.8);
	letter-spacing: 0;
}
.leftTxt {
	padding-left: 35px;
	margin: 8px 0;
	font-family: PingFangSC-Regular;
	font-size: 16px;
	color: #ffffff;
	letter-spacing: 0;
}
.firstTitle {
	text-align: left;
	font-size: 12px;
	/* padding-left:15px; */
}
.mydialogTitle {
	padding: 17px 48px 17px;
	text-align: left;
	font-family: PingFangSC-Regular;
	font-size: 18px;
	color: #28ffbb;
}
.mydialog .el-progress-circle__track {
	stroke: rgb(61, 65, 71);
	fill: none;
}

.mydialog .el-dialog__header {
	text-align: left;
	padding: 20px 20px 10px;
}
.alarminfoid {
	background-color: #141928;
}

.mydialog .el-progress-class {
	margin: 10px 30%;
	color: #0bd1f3;
}
.mydialog .el-progress-class .el-progress__text {
	font-size: 14px;
	color: #ffffff;
	display: inline-block;
	vertical-align: middle;
	line-height: 1;
}
.reccordAsidCardClass {
	min-width: 150px;
	margin: 10px 15px;
	vertical-align: middle;
	background-color: transparent;
	/*height: 180px;*/
	width: 80%;
	border: 1px solid #28ffbb;
}
.mydialog .recordCardImg {
	margin-top: 5px;
	width: 80%;
	min-height: 100px;
	/* background-color: green; */
	-webkit-background-size: cover;
	-webkit-background-origin: content;
	background-origin: content;
	background-size: cover;
	-webkit-background-origin: content;
	background-origin: content;
}
h2 {
	line-height: 40px;
}
.mydialog {
	text-align: center;
}
.colBoxClass::-webkit-scrollbar {
	display: none;
}
.mydialog .el-dialog {
	width: 680px;
	height: 735px;
	margin-top: 108px !important;
}
.dialog-footer {
	margin-bottom: 30px;
}
.asidCardClass {
	display: flex;
	justify-content: space-between;
	flex-wrap: nowrap;
}
.mydialog-card-img {
	width: 136px;
	height: 136px;
	-webkit-background-size: cover;
	-webkit-background-origin: content;
	background-origin: content-box;
	background-size: cover;
	-webkit-background-origin: content;
	background-origin: content-box;
	background-clip: content-box;
	/* background-color: red; */
}
.el-progress-class {
	margin: auto 30% auto;
	color: #0bd1f3;
}
.el-progress-class .el-progress__text {
	font-size: 14px;
	color: #ffffff;
	display: inline-block;
	vertical-align: middle;
	/*margin-left: 10px;*/
	line-height: 1;
	font-family: PingFangSC-Regular;
}
</style>
