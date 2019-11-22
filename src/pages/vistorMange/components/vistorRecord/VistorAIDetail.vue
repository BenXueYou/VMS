<template>
	<el-dialog
		:title="title"
		:width="width"
		class="VistorAIDetail"
		:visible.sync="dialogVisible"
		:before-close="close"
		v-loading="showLoading"
	>
		<div class="body">
			<div class="body_box" style="border-top:0px;">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:right;" :span="6">
						<p>姓名：</p>
						<p>性别：</p>
						<p>证件号：</p>
						<p>手机号：</p>
						<p>车牌号：</p>
					</el-col>
					<el-col :span="8">
						<p>{{vistorAIDetail.visitorName}}</p>
						<p>{{$common.getEnumItemName("gender", vistorAIDetail.gender)}}</p>
						<p>{{vistorAIDetail.certificateNo}}</p>
						<p>{{vistorAIDetail.phoneNo}}</p>
						<p>{{vistorAIDetail.plateNo}}</p>
					</el-col>
					<el-col style="text-align:right;margin-right:-15px;" :span="5">
						<div v-if="showImg" class="imgBox">
							<img
								:src="vistorAIDetail.certificatePhotoUri? imageUrl+vistorAIDetail.certificatePhotoUri : require('@/assets/images/user.png')"
								alt
								srcset
							/>
						</div>
					</el-col>
					<el-col style="text-align:right;" :span="5">
						<div class="imgBox">
							<img
								:src="vistorAIDetail.snapPhotoUri? imageUrl+vistorAIDetail.snapPhotoUri : require('@/assets/images/user.png')"
								alt
								srcset
							/>
						</div>
						<p style="text-align:center;margin-bottom:0">
							<span class="activeFontClass" @click="showImg = !showImg">查看证件照</span>
						</p>
					</el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:right;" :span="6">访客单位：</el-col>
					<el-col :span="18">{{vistorAIDetail.company}}</el-col>
				</el-row>
			</div>
			<div class="body_box">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:right;" :span="6">
						<p>来访状态：</p>
						<p>预约/邀请时间：</p>
						<p>预计到达时间：</p>
						<p>预计离开时间：</p>
						<p>预约设备：</p>
						<p>预约途径：</p>
						<p>被访人员：</p>
						<p>被访人手机：</p>
						<p>来访事由：</p>
						<p>审批状态：</p>
					</el-col>
					<el-col :span="19">
						<p>{{$common.getEnumItemName("visitor_record_s", vistorAIDetail.visitState) || ''}}</p>
						<p>{{vistorAIDetail.reservationDatetime || ''}}</p>
						<p>{{vistorAIDetail.estimatedDatetimeArrive || ''}}</p>
						<p>{{vistorAIDetail.estimatedDatetimeLeave || ''}}</p>
						<p>{{vistorAIDetail.deviceName || ''}}</p>
						<p>{{$common.getEnumItemName("visitor_singon_ways", vistorAIDetail.source) || ''}}</p>
						<p>
							<span
								class="activeFontClass"
								@click="transferVistorList()"
							>{{vistorAIDetail.staffName || ''}}</span>
						</p>
						<p>{{vistorAIDetail.staffPhoneNo || ''}}</p>
						<p>{{vistorAIDetail.reason || ''}}</p>
						<p>
							{{$common.getEnumItemName("reservation_record_s", vistorAIDetail.approveState) || ''}}
							{{vistorAIDetail.bracketContext}}
						</p>
					</el-col>
				</el-row>
			</div>
			<div class="body_box">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:right;" :span="6">
						<p>访客开门记录：</p>
					</el-col>
					<el-col :span="18">
						<p
							v-for="(item,index) in openDoorRecord"
							:key="index"
							@click="transferVistorOpenRecord(item)"
						>
							<span class="activeFontClass">{{item.time}}</span>
							<span class="activeFontClass">{{item.channelName}}</span>
							<span class="activeFontClass">{{$common.getEnumItemName("chn_d", item.direction)}}</span>
							<span class="activeFontClass">{{$common.getEnumItemName("pass", item.recognitionMode)}}</span>
						</p>
					</el-col>
				</el-row>
			</div>
		</div>
		<div slot="footer" class="dialogHeaderClass">
			<el-row type="flex" justify="center">
				<div v-if="vistorAIDetail.black !== 2 && vistorAIDetail.visitState">
					<el-button
						v-if="vistorAIDetail.black"
						class="deleteBtn"
						@click="addToBlacklistAct"
						type="primary"
					>拉黑</el-button>
					<el-button
						v-if="vistorAIDetail.black"
						class="deleteBtn"
						@click="addToWhitelistAct"
						type="primary"
					>解除拉黑</el-button>
				</div>
				<el-button
					class="deleteBtn"
					v-if="vistorAIDetail.forbid && vistorAIDetail.visitState"
					@click="forbidBtnAct"
					type="primary"
				>收回通行权限</el-button>
				<div v-if="!vistorAIDetail.visitState">
					<el-button v-if="vistorAIDetail.signOff" @click="confirm" type="primary">签离</el-button>
				</div>
				<el-button @click="close" type="primary">关闭</el-button>
			</el-row>
		</div>
	</el-dialog>
</template>

<script>
import icons from "@/common/js/icon.js";
import tagView from "@/common/Tag.vue";
import RestApi from "@/utils/RestApi.js";
import * as api from "../../utils/ajax";
import staffDetailDialog from "@/pages/personMange/components/staffDetailDialog.vue";
import residentDetailDialog from "@/pages/residentManage/components/TheResidentDetailDialog.vue";
export default {
  components: { tagView, staffDetailDialog, residentDetailDialog },
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
        return "访客登记详情";
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
    vistorAIDetail: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      forbidBtnArr: ["uncome", "comed", "unleave", "leave_overtime"],
      signOffBtnArr: ["unleave", "leave_overtime"],
      showImg: false,
      countryOptions: window.config.options,
      countryOption: "",
      maritalOptions: window.config.options,
      maritalOption: "",
      nationOption: "",
      nationOptions: window.config.options,
      educationOptions: window.config.options,
      educationOption: "",
      checkedNodeName: "",
      inputWidth: "30%",
      visible_popver: false,
      checkeTreedNodes: [],
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
      ResidentPopoverClass: "ResidentPopoverClass",
      treeData: window.config.treeData,
      defaultProps: {
        label: "label",
        children: "children"
      },
      filterText: "",
      certificateOptions: window.config.options,
      certificateOption: "",
      imageUrl: RestApi.api.imageUrl,
      staffType: "staff",
      tabMap: {
        staff: "staffDetailDialog",
        resident: "residentDetailDialog"
      },
      isStaffDetailShow: false,
      residentDetail: {},
      showLoading: false
    };
  },
  computed: {
    openDoorRecord: function() {
      if (this.vistorAIDetail.openDoorRecord) {
        return JSON.parse(
          JSON.stringify(this.vistorAIDetail.openDoorRecord)
        ).reverse();
      } else {
        return [];
      }
    }
  },
  mounted() {
    this.dialogVisible = this.visible;
    this.name = this.value;
    this.checkeTreedNodes = this.dynamicTags;
  },
  methods: {
    justifyForbidBtnTxt(rowData) {
      // rowData.validDatetimeEnd
      let validDatetimeEnd = new Date(rowData.estimatedDatetimeLeave).getTime();
      let currentDateTime = new Date().getTime();
      return currentDateTime < validDatetimeEnd;
    },
    transferVistorOpenRecord(data) {
      // 跳转到访客开门记录
      this.$router.push({
        name: "VistorOpenRecord",
        params: { data: this.vistorAIDetail }
      });
      this.close();
    },
    // 显示人员详情
    transferVistorList(data) {
      console.log(this.vistorAIDetail);
      if (this.vistorAIDetail && this.vistorAIDetail.staffType) {
        this.staffType = this.vistorAIDetail.staffType;
      }
      if (this.staffType === "resident") {
        // this.vistorAIDetail.staffUuid = "f5056126f7c14795a276cfab3909867e";
        this.detailResident(this.vistorAIDetail);
      } else {
        this.staffType = "staff";
        this.isStaffDetailShow = true;
        this.residentDetail = this.vistorAIDetail;
        this.residentDetail.addressString = this.vistorAIDetail.address;
        this.$emit(
          "showStaffDetail",
          this.staffType,
          this.residentDetail,
          this.isStaffDetailShow
        );
      }
    },
    // 获取居民详情信息
    detailResident(data) {
      console.log("详情弹窗");
      this.$ResidentManageAjax
        .getResidentDetailApi({ staffUuid: data.staffUuid })
        .then(res => {
          console.log(res.data.data);
          if (res.data.success && res.data.data) {
            this.isStaffDetailShow = true;
            this.residentDetail = res.data.data;
            this.residentDetail.addressString = data.address;
            this.$emit(
              "showStaffDetail",
              this.staffType,
              this.residentDetail,
              this.isStaffDetailShow
            );
          }
        });
    },
    // 解除拉黑
    addToWhitelistAct() {
      var rowData = {};
      rowData.credentialNo = this.vistorAIDetail.certificateNo;
      rowData.credentialType = this.vistorAIDetail.certificateType;
      rowData.visitorRecordUuid = this.vistorAIDetail.visitorRecordUuid;
      if (rowData.credentialNo === "") rowData.certificateNo = null;
      if (rowData.credentialType === "") rowData.certificateType = null;
      if (
        !rowData.credentialType &&
				!rowData.credentialNo &&
				!rowData.visitorRecordUuid
      ) {
        this.$message({ type: "wraning", message: "证件信息为空" });
        return;
      }
      this.$confirm(
        `<span style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;">是否移出黑名单 ？</span>`,
        "",
        {
          confirmButtonText: "否",
          cancelButtonText: "是",
          distinguishCancelAndClose: true,
          confirmButtonClass: "confirm-button",
          cancelButtonClass: "cancel-button",
          center: true,
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          this.$message({ type: "info", message: "取消移出" });
        })
        .catch(action => {
          if (action === "cancel") {
            this.showLoading = !this.showLoading;
            api
              .deleteBlacklistUrl(rowData)
              .then(res => {
                this.showLoading = !this.showLoading;
                if (res.data.success) {
                  this.$message.success("移出成功！");
                  this.$emit("update:visible", false);
                  this.$emit("close", true);
                } else {
                  this.$message.error(res.data.msg);
                }
              })
              .catch(err => {
                this.showLoading = false;
                console.error(err);
              });
          }
        });
    },
    // 添加到黑名单
    addToBlacklistAct() {
      var rowData = JSON.parse(JSON.stringify(this.vistorAIDetail));
      if (this.vistorAIDetail.certificateNo === "") {
        this.vistorAIDetail.certificateNo = null;
      }
      if (this.vistorAIDetail.certificateType === "") {
        this.vistorAIDetail.certificateType = null;
      }
      rowData.snapOriginalPhotoUri = rowData.certificatePhotoUri;
      rowData.snapOriginalPhotoBase = "";
      rowData.blacklistName = rowData.visitorName;
      rowData.credentialNo = rowData.certificateNo;
      rowData.credentialType = rowData.certificateType;
      rowData.blockDatetime = this.$common.getCurrentTime();
      Object.assign(rowData, this.vistorAIDetail);
      rowData.source = "platform_machine";
      rowData.reason = "";
      this.showLoading = !this.showLoading;
      api
        .postBlacklistUrl(rowData)
        .then(res => {
          this.showLoading = !this.showLoading;
          if (res.data.success) {
            this.$message({ type: "success", message: "添加成功" });
            this.$emit("update:visible", false);
            this.$emit("close", true);
          } else {
            this.$message({ type: "error", message: "添加失败" });
          }
        })
        .catch(err => {
          this.showLoading = false;
          console.error(err);
        });
    },
    // 禁止通行
    forbidBtnAct() {
      api
        .putVistorAIForbiddenUrl({
          visitRecordUuid: this.vistorAIDetail.recordUuid,
          operatorType: "prohibit"
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.$message({
              type: "success",
              message: "权限回收成功"
            });
            this.$emit("update:visible", false);
            this.$emit("close", true);
          } else {
            this.$message({
              type: "error",
              message: "权限回收失败"
            });
          }
        });
    },
    // 关闭
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    // 签离
    confirm() {
      api
        .putVistorAISignoffUrl({
          visitRecordUuid: this.vistorAIDetail.recordUuid,
          operatorType: "signoff"
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.$message({
              type: "success",
              message: "签离成功"
            });
            this.$emit("update:visible", false);
            this.$emit("close", true);
          } else {
            this.$message({
              type: "error",
              message: "签离失败"
            });
          }
        });
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
    vistorAIDetail: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    }
  }
};
</script>
<style>
.VistorAIDetail .el-dialog__body {
	overflow-y: auto;
	max-height: 53.7%;
}
.VistorAIDetail .activeFontClass {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #26d39d;
}
.VistorAIDetail .el-dialog {
	position: relative;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	margin: 0px !important;
	background: #25292d;
}
.VistorAIDetail .el-input__icon {
	line-height: 30px;
	color: #26d39d;
}
.VistorAIDetail .el-dialog__headerbtn {
	top: 18px;
	display: none;
}
.VistorAIDetail .el-dialog__header {
	height: 60px;
}
.dialogHeaderClass {
	width: 100%;
	padding: 25px 40px 24px;
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
.VistorAIDetail .dialogHeaderClass .header_left_txt {
	border-left: 2px solid #26d39d;
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #ffffff;
	padding-left: 10px;
}
.VistorAIDetail .pBox {
	display: flex;
	justify-content: flex-start;
	margin: 7px 0 8px;
}
.VistorAIDetail .pBox div {
	width: 50%;
	text-align: left;
}
.VistorAIDetail .header_right_box {
	text-align: center;
}
.VistorAIDetail .header_right_box button {
	height: 32px;
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #ffffff;
	text-align: justify;
	padding: 7px 17px;
}

.VistorAIDetail .imgBox {
	display: inline-block;
	width: 100%;
	height: 100px;
	background: rgba(0, 0, 0, 0.1);
	border: 0 solid rgba(255, 255, 255, 0.1);
	padding: 7px;
	box-sizing: border-box;
}
.VistorAIDetail .imgBox img {
	width: 100%;
	height: 100%;
}
.VistorAIDetail .left_tips_txt {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #26d39d;
}
.VistorAIDetail .el-upload {
	display: inline-block;
	text-align: center;
	width: 100%;
	line-height: 130px;
	cursor: pointer;
	outline: none;
}
.VistorAIDetail .authBox {
	display: flex;
	justify-content: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
}
.VistorAIDetail .el-select {
	display: inline-block;
	position: relative;
	width: 30%;
}
.VistorAIDetail .el-select .el-input {
	width: 100%;
}
.VistorAIDetail .el-select .el-select-dropdown__list {
	width: 100%;
}
.VistorAIDetail .el-input {
	display: inline-block;
	width: 30%;
	height: 30px;
}
.VistorAIDetail .el-input .el-input__inner {
	height: 30px;
	padding-right: 15px;
}
.VistorAIDetail .body_box {
	border-top: 1px dashed rgba(255, 255, 255, 0.1);
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	padding: 15px 0px 20px;
	color: #dddddd;
	font-size: 12px;
}
.el-dialog__wrapper {
	overflow: auto;
}
.VistorAIDetail .time-line {
	display: inline-block;
	border-width: 1px 0px 0px 0px;
	width: 8px;
	border-color: #7a7b7c;
	border-style: solid;
	margin: 0px 3px;
}
.VistorAIDetail .img {
	vertical-align: baseline;
}
.VistorAIDetail {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #dddddd;
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";

@mixin padding {
	padding: 10px 46px 0px;
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
