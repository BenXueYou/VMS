<template>
	<div class="OVO">
		<div class="OVO-bg">
			<el-row class="OVOTitle">
				<el-col :span="20" style="min-width: 115px;text-align:left;">
					<img style="width:16px;height:16px" :src="require('@/assets/icon/face-photo.png')" />
					<span class="fontClass">{{'历史人脸样本(暂存64张)'}}</span>
				</el-col>
				<el-col :span="4" class="asidFontColor fontClass">
					<el-button
						:disabled="!OwnAuthDisabled"
						type="primary plain"
						icon="el-icon-delete"
						@click="deleteImgRecord()"
					>删除</el-button>
				</el-col>
			</el-row>

			<el-row class="colRowBoxClass colRowBorder">
				<el-row>
					<i
						class="el-icon-caret-left"
						@mouseup="mouseUp"
						@mousedown="mouseDown('left')"
						@click="scrollToLeft"
					></i>
				</el-row>
				<el-row
					:gutter="0"
					id="scrollView"
					class="colBoxClass"
					v-loading.body="mainVideoScreenLoading"
					element-loading-background="rgba(0, 0, 0, 0.8)"
				>
					<el-col class="colOVOClass" :span="2.5" v-for="(o, index) in 64" :key="index">
						<div @dblclick="dbclickAct(index)" class="OVOImgClass">
							<img
								style="width: 100%"
								@click="clickImg($event)"
								:src="shootPhotoList[index]?shootPhotoList[index].url:require('@/assets/user.png')"
							/>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<i
						class="el-icon-caret-right"
						@mouseup="mouseUp"
						@mousedown="mouseDown('right')"
						@click="scrollToRight"
					></i>
				</el-row>
			</el-row>

			<el-row class="OVOBodyClass" type="flex" justify="flex-start">
				<el-col :span="4" class="OVOBodyLeft" style="text-align:right">
					<el-upload
						class="avatar-uploader"
						:action="updateFileImage"
						:on-change="statuschange"
						:show-file-list="false"
						:auto-upload="true"
						:http-request="httpRequest1"
						:disabled="!OwnAuthDisabled"
					>
						<div v-if="imageUrl1" class="avatar">
							<img :src="imageUrl1" class="avatar" />
							<i class="el-icon-delete clearImageIcon" @click.stop="deleteUpdateImage('left')"></i>
						</div>
						<div class="avatar" v-else>
							<img src="@/assets/images/addImg.png" class="ovo-card-img add-icon" />
							<i class="el-icon-circle-plus-outline font-color">添加图片</i>
						</div>
					</el-upload>
				</el-col>
				<el-col :span="3" class="OVOBodyMiddle">
					<div class="middleBox">
						<span class="fontClass">相似度</span>
						<el-progress
							style="margin:auto;color:#28ffbb;font-size:14px;"
							:stroke-width="3"
							:width="80"
							type="circle"
							color="#ffffff"
							:percentage="scores"
						></el-progress>
						<el-button
							:disabled="!OwnAuthDisabled"
							type="primary plain"
							:loading="compareBtnLoad"
							@click="compareTwoFacePhoto()"
						>开始比对</el-button>
					</div>
				</el-col>
				<el-col class="OVOBodyRight" :span="3.5" style="text-align:left">
					<el-upload
						class="avatar-uploader"
						:on-change="statuschange"
						:action="updateFileImage"
						:show-file-list="false"
						:headers="myHeaders"
						:auto-upload="true"
						:disabled="!OwnAuthDisabled"
						:http-request="httpRequest2"
					>
						<div v-if="imageUrl2" class="avatar">
							<img :src="imageUrl2" class="avatar" />
							<i class="el-icon-delete clearImageIcon" @click.stop="deleteUpdateImage('right')"></i>
						</div>
						<div class="avatar" v-else>
							<img src="@/assets/images/addImg.png" class="ovo-card-img add-icon" />
							<i class="el-icon-circle-plus-outline font-color">添加图片</i>
						</div>
					</el-upload>
				</el-col>
			</el-row>
		</div>
	</div>
</template>
<script type="text/javascript">
import * as api from "@/pages/faceModule/http/logSearchHttp.js";
export default {
  name: "ovo",
  props: {
    dialogParama: {}
  },
  components: {},
  data: function() {
    return {
      fileList: [],
      photoCompareDeals: false,
      scrollValue: 180, // 点击左右箭头，移动的偏移量
      mainVideoScreenLoading: false,
      updatedFlag: false,
      shootPhotoList: [],
      imageUrl1: false,
      imageUrl2: false,
      myHeaders: { token: this.$store.state.token },
      updateFileImage:
				this.$store.state.api +
				"/mppr-face/v1/face/image/upload?fileType=full_body_shot",
      leftImg: "",
      rightImg: "",
      scores: 0,
      compareBtnLoad: false,
      mouseDownFlag: false,
      setInt: null,
      imageArr: ["image/jpeg", "image/jpg", "image/png", "image/bmp"],
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  mounted: function(e) {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("1v1对比", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("1v1对比", "isOwn");
  },
  activated: function() {},
  methods: {
    dbclickAct(index) {
      if (index < this.shootPhotoList.length) {
        if (this.imageUrl1) {
          this.imageUrl2 = this.shootPhotoList[index].url;
          this.imageBase642 = this.shootPhotoList[index].base64Url;
        } else {
          this.imageUrl1 = this.shootPhotoList[index].url;
          this.imageBase641 = this.shootPhotoList[index].base64Url;
        }
      }
    },
    mouseDown(lr) {
      // 长按事件
      this.mouseDownFlag = true;
      this.setInt = setInterval(() => {
        if (!this.mouseDownFlag) return;
        if (lr === "right") {
          this.scrollToRight();
        } else {
          this.scrollToLeft();
        }
      }, 200);
    },
    mouseUp() {
      // 结束长按事件
      this.mouseDownFlag = false;
      clearInterval(this.setInt);
    },
    PROGWIDTH() {
      let w =
				document.body.clientWidth ||
				document.documentElement.clientWidth ||
				window.innerWidth;
      if (w > 1400) {
        this.progWidth = 80;
      } else {
        this.progWidth = 50;
      }
    },
    statuschange() {
      //   alert("文件选择成功！");
    },
    httpRequest2(e2) {
      if (this.imageArr.indexOf(e2.file.type) === -1) {
        this.$message({ type: "warning", message: "不支持改图片类型" });
        return;
      }
      this.fileList[1] = e2.file;
      let reader2 = new FileReader();
      reader2.readAsDataURL(this.fileList[1]);
      var _this = this;
      reader2.onload = function(e) {
        _this.imageBase642 = this.result
          .replace("data:image/jpeg;base64,", "jpeg:")
          .replace("data:image/png;base64,", "png:")
          .replace("data:image/bmp;base64,", "bmp:")
          .replace("data:image/jpg;base64,", "jpg:");
      };
      this.imageUrl2 = URL.createObjectURL(e2.file);
    },
    httpRequest1(e1) {
      if (this.imageArr.indexOf(e1.file.type) === -1) {
        this.$message({ type: "warning", message: "不支持改图片类型" });
        return;
      }
      this.fileList[0] = e1.file;
      let reader1 = new FileReader();
      reader1.readAsDataURL(this.fileList[0]);
      var _this = this;
      reader1.onload = function(e) {
        _this.imageBase641 = this.result
          .replace("data:image/jpeg;base64,", "jpeg:")
          .replace("data:image/png;base64,", "png:")
          .replace("data:image/bmp;base64,", "bmp:")
          .replace("data:image/jpg;base64,", "jpg:");
      };
      this.imageUrl1 = URL.createObjectURL(e1.file);
    },
    // 开始对比
    compareTwoFacePhoto() {
      // debugger;
      this.scores = 0;
      if (this.imageBase641 && this.imageBase642) {
        this.sendFileImgToServer();
      } else {
        this.$message({ message: "请上传图片", type: "warning" });
      }
    },
    sendFileImgToServer() {
      this.compareBtnLoad = !this.compareBtnLoad;
      api
        .faceComparison1v1({
          imageBase641: this.imageBase641,
          imageBase642: this.imageBase642
        })
        .then(res => {
          this.compareBtnLoad = !this.compareBtnLoad;
          if (res.data.success && res.data.data) {
            this.scores = parseInt(res.data.data);
          } else {
            this.$message({ message: res.data.msg, type: "warning" });
          }
        })
        .catch(() => {
          this.compareBtnLoad = !this.compareBtnLoad;
        });
    },
    // 删除历史记录
    deleteImgRecord() {
      this.shootPhotoList = [];
    },
    // 删除上传图片
    deleteUpdateImage(e) {
      if (this.compareBtnLoad) {
        this.$message({ message: "正在比对，请稍后", type: "warning" });
        return;
      }
      if (e === "left") {
        this.shootPhotoList.unshift({
          url: this.imageUrl1,
          base64Url: this.imageBase641
        });
        this.imageUrl1 = false;
        this.imageBase641 = false;
      } else {
        this.shootPhotoList.unshift({
          url: this.imageUrl2,
          base64Url: this.imageBase642
        });
        this.imageUrl2 = false;
        this.imageBase642 = false;
      }
      this.scores = 0;
      if (this.shootPhotoList.length > 64) {
        this.shootPhotoList.pop();
      }
      console.log(this.shootPhotoList);
    },
    beforeAvatarUpload(file) {
      console.log(file);
      if (this.compareBtnLoad) {
        this.$message({ message: "正在比对，请稍后", type: "warning" });
        return;
      }
      const isJPEG = file.type === "image/jpeg";
      const isJPG = file.type === "image/jpg";
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isJPG || !isJPEG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
      }
      // return isJPG && isLt10M;
      return isLt10M;
    },
    scrollToRight() {
      let dom = document.getElementById("scrollView");
      console.log(dom, "向左滚动", dom.scrollLeft);
      document.getElementById("scrollView").scrollLeft += this.scrollValue;
    },
    scrollToLeft() {
      let dom = document.getElementById("scrollView");
      console.log(dom, "向右滚动", dom.scrollLeft);
      document.getElementById("scrollView").scrollLeft -= this.scrollValue;
    },
    handleAvatarError(err, file, fileList) {
      console.log(err, "===", file, "====", fileList);
      this.$message.error("图片上传失败!");
    }
  }
};
</script>
<style >
.OVO .el-upload {
	width: 100%;
	height: 100%;
}
</style>
<style type="text/css" scoped>
.OVO .fontClass {
	text-align: right;
}
.OVO .OVO-bg {
	background-color: rgb(32, 35, 38);
	box-sizing: border-box;
	padding: 35px 50px 0;
	height: 100%;
}
.OVO .font-color {
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #cccccc;
	text-align: right;
}
.OVO .fontClass {
	font-family: PingFangSC-Regular;
	font-size: 16px;
	color: #ffffff;
}
.OVOBodyClass {
	height: 49%;
	margin-top: 40px;
	border-top: 1px dashed rgba(100, 100, 100, 1);
	padding: 50px;
}
.OVOBodyLeft,
.OVOBodyRight,
.OVOBodyMiddle {
	width: 220px;
	/* min-width: 165px; */
	height: 280px;
}
.clearImageIcon {
	position: absolute;
	right: 5px;
	top: 5px;
	z-index: 99;
	color: #efefef;
	width: 35px;
	height: 35px;
	background-color: rgba(17, 17, 17, 0.6);
	padding-top: 10px;
	box-sizing: border-box;
	border-radius: 19px;
}
.ovo-card-img {
	margin: 50% 30% 10%;
	vertical-align: middle;
	width: 30%;
	height: 20%;
}
.avatar {
	width: 100%;
	height: 100%;
	position: relative;
	background-color: rgb(27, 30, 33);
	/* padding: 12px; */
	box-sizing: border-box;
}
.avatar-uploader {
	width: 100%;
	height: 100%;
	border: 1px solid rgba(32, 50, 49, 1);
	position: relative;
	background-color: rgb(27, 30, 33);
	padding: 3px 5px;
	box-sizing: border-box;
}
.OVO .el-upload {
	width: 100%;
	height: 100%;
	display: inline-block;
	text-align: center;
	cursor: pointer;
	outline: 0;
}
.middleBox {
	height: 100%;
	padding: 15px 0;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	align-content: space-between;
}
.colRowBorder {
	border: 1px solid rgba(32, 50, 49, 1);
}
.OVO .colRowBoxClass {
	margin: 25px auto 0;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 30px 4px;
	box-sizing: border-box;
	background: rgb(27, 30, 33);
}
.OVO .el-button--primary {
	color: #fff;
	background: rgba(40, 255, 187, 0.15);
	border-color: #28ffbb;
	width: 120px;
	height: 40px;
}
.OVO .el-icon-caret-left:before {
	font-size: 30px;
	color: #ffffff;
}
.OVO .el-icon-caret-right:before {
	font-size: 25px;
	color: #ffffff;
}
.OVO .el-progress__text {
	font-size: 14px !important;
	color: #fff;
	display: inline-block;
	vertical-align: middle;
	/*margin-left: 10px;*/
	line-height: 1;
}
.OVO .dialogPhotoItemTxt {
	opacity: 0.8;
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #ffffff;
	text-align: center;
	line-height: 17px;
}
.OVO .textclipsClass {
	display: block;
	width: 100%;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.OVO .OVOImgClass {
	width: 120px;
	height: 100%;
	margin-bottom: 13px;
}
.OVO .OVOImgClass img {
	width: 100%;
	height: 100%;
}
.OVO .colOVOClass {
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	padding: 0 10px;
	height: 100%;
	flex-shrink: 0;
}
.OVO .colBoxClass {
	width: calc(100% + 15px);
	height: 180px;
	overflow: -webkit-paged-x;
	padding-top: 0px;
	box-sizing: border-box;
	display: flex;
	overflow-x: auto;
	overflow-y: hidden;
}

@media screen and (max-width: 1400px) {
	.OVO .colBoxClass {
		width: calc(100% + 15px);
		height: 130px;
		overflow: -webkit-paged-x;
		padding-top: 0px;
		box-sizing: border-box;
		display: flex;
		overflow-x: auto;
		overflow-y: hidden;
	}
}
@media screen and (max-width: 920px) {
	.OVO .colBoxClass {
		width: calc(100% + 15px);
		height: 130px;
		overflow: -webkit-paged-x;
		padding-top: 0px;
		box-sizing: border-box;
		display: flex;
		overflow-x: auto;
		overflow-y: hidden;
	}
}

.OVO .OVOTitle {
	/* padding: 35px 50px 17px 0px; */
	text-align: left;
	font-family: PingFangSC-Regular;
	font-size: 18px;
	/* color: #28FFBB; */
}
.OVO .el-progress-circle__track {
	stroke: rgb(61, 65, 71);
	fill: none;
}

.OVO .el-progress-class {
	margin: 10px 30%;
	color: #0bd1f3;
}
.OVO .el-progress-class .el-progress__text {
	font-size: 14px;
	color: #ffffff;
	display: inline-block;
	vertical-align: middle;
	line-height: 1;
}
.OVO {
	text-align: center;
	background-color: transparent;

	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 20px 30px;
}
.colBoxClass::-webkit-scrollbar {
	display: none;
}

.dialog-footer {
	margin-bottom: 30px;
}

.OVO-card-img {
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
