<template>
	<el-dialog :title="title" :width="width" class="VistorOpenDetail" :visible.sync="dialogVisible">
		<div slot="title" class="dialogTitleClass">
			<el-row type="flex" justify="flex-start">
				<el-col :span="12">
					<div style="border-left:3px solid #26D39D;padding-left:10px;">{{title}}</div>
				</el-col>
				<el-col :span="12" style="text-align:right">
                    <i class="el-icon-close" @click="close"></i>
                </el-col>
			</el-row>
		</div>
		<div class="body">
			<div class="body_box" style="border-top:0px;">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:left;" :span="5">
						<img class="img" src="@/assets/images/vistorManage/open_icon.png" alt srcset>
						开锁图片
					</el-col>
					<el-col :span="14"></el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:left;" :span="5">
						<p>验证时间：</p>
						<p>验证方式：</p>
						<p>验证地址：</p>
						<p>验证设备：</p>
						<p>被访人员：</p>
						<p>被访人手机：</p>
						<p>来访事由：</p>
					</el-col>
					<el-col :span="11">
						<p>{{openDoorDetail.time}}</p>
						<p>{{$common.getEnumItemName("pass", openDoorDetail.recognitionMode)}}</p>
						<p>{{openDoorDetail.address}}</p>
						<p>{{openDoorDetail.device}}</p>
						<p>{{openDoorDetail.staffName}}</p>
						<p>{{openDoorDetail.staffPhoneNo}}</p>
						<p>{{openDoorDetail.reason}}</p>
					</el-col>
					<el-col style="text-align:right;margin-right:-15px;" :span="8">
						<div class="imgBox">
							<img
								:src="openDoorDetail.openDoorPhotoUri? imageUrl+openDoorDetail.openDoorPhotoUri : require('@/assets/images/user.png')"
								alt
								srcset
							>
						</div>
					</el-col>
				</el-row>
			</div>
			<div class="body_box" style="border-bottom:0">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:left;" :span="5">
						<img class="img" src="@/assets/images/vistorManage/vistor_icon.png" alt srcset>
						访客信息
					</el-col>
					<el-col :span="14"></el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:left;" :span="5">
						<p>姓名：</p>
						<p>性别：</p>
						<p>证件号：</p>
						<p>手机号：</p>
						<p>车牌号：</p>
						<p>访客单位：</p>
					</el-col>
					<el-col :span="11">
						<p>{{openDoorDetail.visitorName}}</p>
						<p>{{$common.getEnumItemName("gender", openDoorDetail.gender)}}</p>
						<p>{{openDoorDetail.certificateNo}}</p>
						<p>{{openDoorDetail.phoneNo}}</p>
						<p>{{openDoorDetail.plateNo}}</p>
						<p>{{openDoorDetail.company}}</p>
					</el-col>
					<el-col style="text-align:left ;margin-right:-15px;" :span="8">
						<div class="imgBox">
							<img
								:src="openDoorDetail.snapPhotoUri? imageUrl+openDoorDetail.snapPhotoUri : require('@/assets/images/user.png')"
								alt
								srcset
							>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>
		<div slot="footer" class="dialogFooterClass">
			<!-- <el-row type="flex" justify="flex-start">
				<el-col :span="12"></el-col>
				<el-col :span="12">
					<el-button class="deleteBtn" @click="addToBlacklistAct" type="primary">拉黑</el-button>
					<el-button @click="close" type="primary">关闭</el-button>
				</el-col>
			</el-row>-->
		</div>
	</el-dialog>
</template>

<script>
import icons from "@/common/icon.js";
import tagView from "@/common/Tag.vue";
import RestApi from "@/utils/RestApi.js";
export default {
  components: { tagView },
  props: {
    width: {
      type: String,
      default() {
        return "580px";
      }
    },
    title: {
      type: String,
      default() {
        return "访客开门详情";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    },
    openDoorDetail: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      showImg: false,
      checkedNodeName: "",
      visible_popver: false,
      dynamicTags: [],
      myHeaders: {},
      updateFileImage: "",
      icons,
      dialogVisible: false,
      radioGender: "男",
      phoneNumber: "",
      name: "",
      radioDate: "",
      startTime: "",
      endTime: "",
      tableData: window.config.tableData,
      defaultProps: {
        label: "label",
        children: "children"
      },
      filterText: "",
      imageUrl: RestApi.api.imageUrl
    };
  },
  mounted() {
    this.dialogVisible = this.visible;
    this.name = this.value;
  },
  methods: {
    // 添加到黑名单
    addToBlacklistAct() {},

    // 关闭
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.name = this.value;
      }
      this.dialogVisible = this.visible;
      this.dynamicTags = [];
    },
    openDoorDetail: {
      handler(val, oldVal) {

      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style>
.VistorOpenDetail .el-dialog__body {
	overflow-y: auto;
	max-height: 53.7%;
}
.VistorOpenDetail .activeFontClass {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #26d39d;
}
.VistorOpenDetail .el-dialog {
	position: relative;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	margin: 0px !important;
	background: #25292d;
}
.VistorOpenDetail .el-input__icon {
	line-height: 30px;
	color: #26d39d;
}
.VistorOpenDetail .el-dialog__headerbtn {
	top: 18px;
	display: none;
}
.VistorOpenDetail .el-dialog__header {
	height: 60px;
}
.dialogHeaderClass {
	padding: 25px 40px 24px;
	box-sizing: border-box;
}
.dialogFooterClass{
	padding: 10px 40px 10px;
	box-sizing: border-box;
}
.dialogHeaderClass .el-button {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #ffffff;
	letter-spacing: 0;
	margin: 0 10px;
}
.dialogHeaderClass .deleteBtn {
	background: rgba(253, 84, 94, 0.05);
	border: 1px solid rgba(255, 95, 95, 0.89);
	border-radius: 2px;
	border-radius: 2px;
}
.dialogTitleClass {
	width: 100%;
	padding: 25px 20px 24px 0;
	box-sizing: border-box;
}
.VistorOpenDetail .dialogHeaderClass .header_left_txt {
	border-left: 2px solid #26d39d;
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #ffffff;
	padding-left: 10px;
}
.VistorOpenDetail .pBox {
	display: flex;
	justify-content: flex-start;
	margin: 7px 0 8px;
}
.VistorOpenDetail .pBox div {
	width: 50%;
	text-align: left;
}
.VistorOpenDetail .header_right_box {
	text-align: center;
}
.VistorOpenDetail .header_right_box button {
	height: 32px;
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #ffffff;
	text-align: justify;
	padding: 7px 17px;
}

.VistorOpenDetail .imgBox {
	display: inline-block;
	width: 100%;
	height: 155px;
	background: rgba(0, 0, 0, 0.1);
	border: 0 solid rgba(255, 255, 255, 0.1);
	padding: 7px;
	box-sizing: border-box;
}
.VistorOpenDetail .imgBox img {
	width: 100%;
	height: 100%;
}
.VistorOpenDetail .left_tips_txt {
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #26d39d;
}
.VistorOpenDetail .el-upload {
	display: inline-block;
	text-align: center;
	width: 100%;
	line-height: 130px;
	cursor: pointer;
	outline: none;
}
.VistorOpenDetail .authBox {
	display: flex;
	justify-content: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
}
.VistorOpenDetail .el-select {
	display: inline-block;
	position: relative;
	width: 30%;
}
.VistorOpenDetail .el-select .el-input {
	width: 100%;
}
.VistorOpenDetail .el-select .el-select-dropdown__list {
	width: 100%;
}
.VistorOpenDetail .el-input {
	display: inline-block;
	width: 30%;
	height: 30px;
}
.VistorOpenDetail .el-input .el-input__inner {
	height: 30px;
	padding-right: 15px;
}
.VistorOpenDetail .body_box {
	border-top: 1px dashed rgba(255, 255, 255, 0.1);
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	padding: 15px 12px 20px;
	color: #dddddd;
	font-size: 12px;
}
.el-dialog__wrapper {
	overflow: auto;
}
.VistorOpenDetail .time-line {
	display: inline-block;
	border-width: 1px 0px 0px 0px;
	width: 8px;
	border-color: #7a7b7c;
	border-style: solid;
	margin: 0px 3px;
}
.VistorOpenDetail .img {
	vertical-align: baseline;
}
.VistorOpenDetail {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #dddddd;
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";

@mixin padding {
	padding: 10px 40px 0px;
	box-sizing: border-box;
}
.body {
	@include padding;
	.title {
		height: 40px;
		line-height: 30px;
		@include font-s;
	}
	.righttips {
		float: right;
		.test {
			padding-right: 20px;
		}
		.refresh {
			cursor: pointer;
			img {
				display: inline-block;
				vertical-align: middle;
			}
			color: $add-text-color;
		}
	}
	.body_box {
		p {
			font-family: PingFangSC-Regular;
			font-size: 12px;
			color: #dddddd;
			margin: 7px 0 8px;
			height: 16px;
		}
	}
	.card_icon_class {
		text-align: center;
		p {
			background: rgba(255, 255, 255, 0.03);
			border-radius: 2px;
			border-radius: 2px;
			font-family: PingFangSC-Regular;
			font-size: 12px;
			color: #dddddd;
			line-height: 35px;
			margin: 0 20%;
			padding: 0 20px;
			width: 60%;
			text-align: center;
			display: flex;
			justify-content: space-between;
		}
	}
	.finger_icon_class {
		padding-left: 30px;
	}
}
.footer {
	@include padding;
	overflow: hidden;
	button {
		height: 30px;
		padding: 7px 21px;
		background: rgba(40, 255, 187, 0.12);
		border: 1px solid rgba(40, 255, 187, 0.8);
		border-radius: 2px;
		border-radius: 2px;
		font-family: "PingFangSC-Regular";
		font-size: 12px;
		color: #ffffff;
		letter-spacing: 0;
	}
}
</style>
