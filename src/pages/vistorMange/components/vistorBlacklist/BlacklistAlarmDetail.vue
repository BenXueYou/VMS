<template>
	<el-dialog
		:title="title"
		:width="width"
		class="BlacklistAlarmDetail"
		:visible.sync="dialogVisible"
		:before-close="close"
	>
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
				<el-row type="flex" style="padding-bottom:10px;" justify="flex-start" :gutter="20">
					<el-col style="text-align:left;" :span="6">
						<img class="img" src="@/assets/images/vistorManage/alarm_icon.png" alt srcset />
						报警图片
					</el-col>
					<el-col :span="18"></el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="10">
					<el-col style="text-align:left;" :span="4">
						<p>报警时间：</p>
						<p>报警原因：</p>
						<p>报警地点：</p>
					</el-col>
					<el-col :span="12">
						<p>{{alarmDetail.alarmTime}}</p>
						<p>{{alarmDetail.extInfo&&alarmDetail.extInfo.reason?$common.getEnumItemName("blacklist_trigger_reason",alarmDetail.extInfo.reason):''}}</p>
						<p>{{alarmDetail.extInfo&&alarmDetail.extInfo.deviceName?alarmDetail.extInfo.deviceName:''}}</p>
					</el-col>
					<el-col style="text-align:right;margin-right:-15px;" :span="8">
						<div class="imgBox">
							<img
								:src="alarmDetail.extInfo&&alarmDetail.extInfo.snapPhotoUrl? imageUrl+ alarmDetail.extInfo.snapPhotoUrl : require('@/assets/images/user.png')"
								alt
								srcset
							/>
						</div>
					</el-col>
				</el-row>
			</div>
			<div class="body_box" style="border-bottom:0">
				<el-row type="flex" style="padding-bottom:10px;" justify="flex-start" :gutter="20">
					<el-col style="text-align:left;" :span="7">
						<img class="img" src="@/assets/images/vistorManage/vistor_icon.png" alt srcset />
						黑名单访客信息
					</el-col>
					<el-col :span="17"></el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="10">
					<el-col style="text-align:left;" :span="5">
						<p>姓名：</p>
						<p>性别：</p>
						<p>证件号：</p>
						<p>拉黑时间：</p>
						<p>黑名单来源：</p>
						<p>拉黑原因：</p>
					</el-col>
					<el-col :span="11">
						<p>{{ defaultAlarmDetail.resName}}</p>
						<p>{{$common.getEnumItemName("gender", alarmDetail.gender)}}</p>
						<p>{{ alarmDetail.credentialNo}}</p>
						<p>{{ alarmDetail.createTime}}</p>
						<p>{{ alarmDetail.extInfo && alarmDetail.extInfo.source?$common.getEnumItemName("blacklistSource", alarmDetail.extInfo.source):''}}({{alarmDetail.dealContent?alarmDetail.dealContent.userName:''}})</p>
						<p>{{ alarmDetail.reason}}</p>
					</el-col>
					<el-col style="text-align:left ;margin-right:-15px;" :span="8">
						<div class="imgBox">
							<img
								:src="alarmDetail.extInfo&&alarmDetail.extInfo.certificatePhotoUri? imageUrl+ alarmDetail.extInfo.certificatePhotoUri : require('@/assets/images/user.png')"
								alt
								srcset
							/>
						</div>
					</el-col>
				</el-row>
			</div>
			<div class="body_box" style="border-bottom:0;padding-bottom:10px;">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:left;" :span="5">
						<img class="img" src="@/assets/images/vistorManage/alarm_deteal.png" alt srcset />
						警情处理
					</el-col>
					<el-col :span="18">
						<el-radio-group v-model="alarmDetail.valided">
							<el-radio :label="1">有效</el-radio>
							<el-radio :label="0">误报</el-radio>
						</el-radio-group>
					</el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-input
						type="textarea"
						:rows="2"
						placeholder="处理结论"
						v-model="alarmDetail.dealContent.content"
					></el-input>
				</el-row>
			</div>
		</div>
		<div slot="footer" class="dialogFooterClass">
			<el-row type="flex" justify="flex-start">
				<el-col :span="12"></el-col>
				<el-col :span="12">
					<el-button :loading="isloading" @click="blacklistAlarmDetailAct" type="primary">确定</el-button>
					<el-button @click="close" type="primary">搁置</el-button>
				</el-col>
			</el-row>
		</div>
	</el-dialog>
</template>
<script>
import icons from "@/common/js/icon.js";
import tagView from "@/common/Tag.vue";
import RestApi from "@/utils/RestApi.js";
import * as api from "../../utils/ajax";
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
        return "黑名单报警详情";
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
    defaultAlarmDetail: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      isloading: false,
      showImg: false,
      visible_popver: false,
      myHeaders: {},
      updateFileImage: "",
      icons,
      dialogVisible: false,
      radioGender: "男",
      phoneNumber: "",
      name: "",
      defaultProps: {
        label: "label",
        children: "children"
      },
      filterText: "",
      imageUrl: RestApi.api.imageUrl,
      alarmDetail: {
        dealContent: {},
        extInfo: {},
        valided: 1
      }
    };
  },
  mounted() {
    this.dialogVisible = this.visible;
    this.name = this.value;
  },
  //    "alarmUuid": "string",
  //   "content": "string",
  //   "dealState": "string",
  //   "dealTime": "string",
  //   "dealUuid": "string",
  //   "extInfo": {
  //     "additionalProp1": {},
  //     "additionalProp2": {},
  //     "additionalProp3": {}
  //   },
  //   "remarks": "string",
  //   "userName": "string",
  //   "userUuid": "string",
  //   "valided": 0
  methods: {
    // 详情处理
    blacklistAlarmDetailAct() {
      this.isloading = true;
      var data = JSON.parse(JSON.stringify(this.defaultAlarmDetail));
      Object.assign(data, this.alarmDetail);
      this.alarmDetail.dealContent = this.alarmDetail.dealContent || {};
      this.alarmDetail.content = this.alarmDetail.dealContent.content;
      this.alarmDetail.dealTime = this.$common.getCurrentTime();
      console.log(this.alarmDetail);
      api
        .postBlacklistAlarmDealUrl(this.alarmDetail)
        .then(res => {
          this.isloading = false;
          if (res.data.success) {
            this.$message({ type: "success", message: res.data.msg });
            this.close('init');
          } else {
            this.$message({ type: "error", message: res.data.msg });
          }
        })
        .catch(() => {
          this.isloading = false;
        });
    },

    // 关闭
    close(evt) {
      this.$emit("update:visible", false);
      this.$emit("close", evt);
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.name = this.value;
      }
      this.dialogVisible = this.visible;
    },
    defaultAlarmDetail: {
      handler(val, oldVal) {
        Object.assign(this.alarmDetail, this.defaultAlarmDetail);
        this.alarmDetail.dealContent = this.alarmDetail.dealContent || {};
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style>
.BlacklistAlarmDetail .el-dialog__body {
	overflow-y: auto;
	max-height: 53.7%;
}
.BlacklistAlarmDetail .activeFontClass {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #26d39d;
}
.BlacklistAlarmDetail .el-dialog {
	position: relative;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	margin: 0px !important;
	background: #25292d;
}
.BlacklistAlarmDetail .el-textarea__inner {
	border: 1px solid rgba(255, 255, 255, 0.15);
	border-radius: 2px;
	border-radius: 2px;
	background-color: transparent;
	height: 80px;
}
.BlacklistAlarmDetail .el-textarea {
	display: inline-block;
	width: 100%;
	vertical-align: bottom;
	font-size: 14px;
	padding: 15px 0 10px 15px;
	box-sizing: border-box;
}
.BlacklistAlarmDetail .el-input__icon {
	line-height: 30px;
	color: #26d39d;
}
.BlacklistAlarmDetail .el-dialog__headerbtn {
	top: 18px;
	display: none;
}
.BlacklistAlarmDetail .el-dialog__header {
	height: 60px;
}
.dialogHeaderClass {
	padding: 25px 40px 24px;
	box-sizing: border-box;
}
.dialogFooterClass {
	padding: 10px 40px 25px;
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
.BlacklistAlarmDetail .dialogHeaderClass .header_left_txt {
	border-left: 2px solid #26d39d;
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #ffffff;
	padding-left: 10px;
}
.BlacklistAlarmDetail .pBox {
	display: flex;
	justify-content: flex-start;
	margin: 7px 0 8px;
}
.BlacklistAlarmDetail .pBox div {
	width: 50%;
	text-align: left;
}
.BlacklistAlarmDetail .header_right_box {
	text-align: center;
}
.BlacklistAlarmDetail .header_right_box button {
	height: 32px;
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #ffffff;
	text-align: justify;
	padding: 7px 17px;
}

.BlacklistAlarmDetail .imgBox {
	display: inline-block;
	width: 100%;
	height: 155px;
	background: rgba(0, 0, 0, 0.1);
	border: 0 solid rgba(255, 255, 255, 0.1);
	padding: 7px;
	box-sizing: border-box;
}
.BlacklistAlarmDetail .imgBox img {
	width: 100%;
	height: 100%;
}
.BlacklistAlarmDetail .left_tips_txt {
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #26d39d;
}
.BlacklistAlarmDetail .el-upload {
	display: inline-block;
	text-align: center;
	width: 100%;
	line-height: 130px;
	cursor: pointer;
	outline: none;
}
.BlacklistAlarmDetail .authBox {
	display: flex;
	justify-content: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
}
.BlacklistAlarmDetail .el-select {
	display: inline-block;
	position: relative;
	width: 30%;
}
.BlacklistAlarmDetail .el-select .el-input {
	width: 100%;
}
.BlacklistAlarmDetail .el-select .el-select-dropdown__list {
	width: 100%;
}
.BlacklistAlarmDetail .el-input {
	display: inline-block;
	width: 30%;
	height: 30px;
}
.BlacklistAlarmDetail .el-input .el-input__inner {
	height: 30px;
	padding-right: 15px;
}
.BlacklistAlarmDetail .body_box {
	border-top: 1px dashed rgba(255, 255, 255, 0.1);
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	padding: 20px 12px 20px;
	color: #dddddd;
	font-size: 12px;
}
.el-dialog__wrapper {
	overflow: auto;
}
.BlacklistAlarmDetail .time-line {
	display: inline-block;
	border-width: 1px 0px 0px 0px;
	width: 8px;
	border-color: #7a7b7c;
	border-style: solid;
	margin: 0px 3px;
}
.BlacklistAlarmDetail .img {
	vertical-align: baseline;
}
.BlacklistAlarmDetail {
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
