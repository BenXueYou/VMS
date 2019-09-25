<template>
	<el-dialog
		:title="title"
		:width="width"
		class="VistorRecordDetail"
		:visible.sync="dialogVisible"
		:before-close="close"
		:v-loading="showLoading"
	>
		<div class="body">
			<div class="body_box" style="border-top:0px;">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:right;" :span="5">
						<p>姓名：</p>
						<p>性别：</p>
						<p>证件号：</p>
						<p>手机号：</p>
						<p>车牌号：</p>
					</el-col>
					<el-col :span="9">
						<p>{{VistorRecordDetail.visitorName}}</p>
						<p>{{$common.getEnumItemName("gender", VistorRecordDetail.gender)}}</p>
						<p>{{VistorRecordDetail.certificateNo}}</p>
						<p>{{VistorRecordDetail.phoneNo}}</p>
						<p>{{VistorRecordDetail.plateNo}}</p>
					</el-col>
					<el-col style="text-align:right;margin-right:-15px;" :span="5">
						<div v-if="showImg" class="imgBox">
							<img
								:src="VistorRecordDetail.certificatePhotoUri? imageUrl+VistorRecordDetail.certificatePhotoUri : require('@/assets/images/user.png')"
								alt
								srcset
							/>
						</div>
					</el-col>
					<el-col style="text-align:right;" :span="5">
						<div class="imgBox">
							<img
								:src="VistorRecordDetail.snapPhotoUri? imageUrl+VistorRecordDetail.snapPhotoUri : require('@/assets/images/user.png')"
								alt
								srcset
							/>
						</div>
						<p style="text-align:center">
							<span class="activeFontClass" @click="showImg = !showImg">查看证件照</span>
						</p>
					</el-col>
				</el-row>
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:right;" :span="5">访客单位：</el-col>
					<el-col :span="14">{{VistorRecordDetail.company}}</el-col>
				</el-row>
			</div>
			<div class="body_box">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:right;" :span="5">
						<p>登记设备：</p>
						<p>登记途径：</p>
						<p>登记人：</p>
						<p>登记时间：</p>
						<p>有效开始时间：</p>
						<p>有效结束时间：</p>
						<p>被访人员：</p>
						<p>被访人手机：</p>
						<p>来访事由：</p>
						<p>访客状态：</p>
					</el-col>
					<el-col :span="19">
						<p>{{VistorRecordDetail.regDeviceNickName || ''}}</p>
						<p>{{$common.getEnumItemName("visitor_singon_ways", VistorRecordDetail.source) || ''}}</p>
						<p>{{VistorRecordDetail.regUserName || ''}}</p>
						<p>{{VistorRecordDetail.regDatetime || ''}}</p>
						<p>{{VistorRecordDetail.validDatetimeBegin || ''}}</p>
						<p>{{VistorRecordDetail.validDatetimeEnd || ''}}</p>
						<p>
							<span
								class="activeFontClass"
								@click="transferVistorList()"
							>{{VistorRecordDetail.staffName || ''}}</span>
						</p>
						<p>{{VistorRecordDetail.staffPhoneNo || ''}}</p>
						<p>{{VistorRecordDetail.reason || ''}}</p>
						<p>
							{{$common.getEnumItemName("visitor_record_s", VistorRecordDetail.visitState)}}
							{{VistorRecordDetail.bracketContext}}
						</p>
					</el-col>
				</el-row>
			</div>
			<div class="body_box">
				<el-row type="flex" justify="flex-start" :gutter="20">
					<el-col style="text-align:right;" :span="5">
						<p>访客开门记录：</p>
					</el-col>
					<el-col :span="19">
						<p
							class="activeFontClass"
							v-for="(item ,index) in openDoorRecord"
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
			<!--black 值为 1 表在黑名单  0 表不在黑名单-->
			<el-row type="flex" justify="center">
				<el-button
					v-if="!VistorRecordDetail.black"
					class="deleteBtn"
					@click="addToBlacklistAct"
					type="primary"
				>拉黑</el-button>
				<el-button v-else class="deleteBtn" @click="addToWhitelistAct" type="primary">解除拉黑</el-button>
				<el-button
					v-if="VistorRecordDetail.forbid"
					class="deleteBtn"
					@click="forbidBtnAct"
					type="primary"
				>回收通行权限</el-button>
				<el-button v-if="VistorRecordDetail.signOff" @click="confirm" type="primary">签离</el-button>
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
    VistorRecordDetail: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      showLoading: false,
      staffType: "staff",
      isStaffDetailShow: false,
      residentDetail: {},
      forbidBtnArr: window.config.forbidBtnArr,
      signOffBtnArr: window.config.signOffBtnArr,
      showImg: false,
      inputWidth: "30%",
      visible_popver: false,
      checkeTreedNodes: [],
      dynamicTags: [],
      myHeaders: {},
      updateFileImage: "",
      icons,
      dialogVisible: false,
      name: "",
      imageUrl: RestApi.api.imageUrl
    };
  },
  computed: {
    openDoorRecord: function() {
      if (this.VistorRecordDetail.openDoorRecord) {
        return JSON.parse(
          JSON.stringify(this.VistorRecordDetail.openDoorRecord)
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
      let validDatetimeEnd = new Date(rowData.validDatetimeEnd).getTime();
      let currentDateTime = new Date().getTime();
      return currentDateTime < validDatetimeEnd;
    },
    transferVistorOpenRecord(data) {
      // 跳转到访客开门记录
      this.$router.push({
        name: "VistorOpenRecord",
        params: { data: this.VistorRecordDetail }
      });
      this.close();
    },
    // 显示人员详情
    transferVistorList(data) {
      console.log(this.VistorRecordDetail);
      if (this.VistorRecordDetail && this.VistorRecordDetail.staffType) {
        this.staffType = this.VistorRecordDetail.staffType;
      }
      if (this.staffType === "resident") {
        // this.VistorRecordDetail.staffUuid = "f5056126f7c14795a276cfab3909867e";
        this.detailResident(this.VistorRecordDetail);
      } else {
        this.staffType = "staff";
        this.isStaffDetailShow = true;
        this.residentDetail = this.VistorRecordDetail;
        this.residentDetail.addressString = this.VistorRecordDetail.address;
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
      this.showLoading = !this.showLoading;
      this.$ResidentManageAjax
        .getResidentDetailApi({ staffUuid: data.staffUuid })
        .then(res => {
          console.log(res.data.data);
          this.showLoading = !this.showLoading;
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
    // 添加到黑名单
    addToBlacklistAct() {
      var rowData = JSON.parse(JSON.stringify(this.VistorRecordDetail));
      if (rowData.certificateNo === "") {
        rowData.certificateNo = null;
      }
      if (rowData.certificateType === "") {
        rowData.certificateType = null;
      }
      rowData.snapOriginalPhotoUri = rowData.certificatePhotoUri;
      rowData.snapOriginalPhotoBase = "";
      rowData.blacklistName = rowData.visitorName;
      rowData.credentialNo = rowData.certificateNo;
      rowData.credentialType = rowData.certificateType;
      rowData.source = "platform_machine";
      rowData.reason = "";
      rowData.blockDatetime = this.$common.getCurrentTime();
      console.log("添加到黑名单", rowData);
      if (!rowData.credentialType && !rowData.credentialNo && !rowData.visitorRecordUuid) {
        this.$message({ type: "wraning", message: "证件信息为空" });
        return;
      }
      this.showLoading = !this.showLoading;
      api
        .postBlacklistUrl(rowData)
        .then(res => {
          console.log(res.data.msg);
          this.showLoading = !this.showLoading;
          if (res.data.success) {
            this.$message({ type: "success", message: "拉黑成功" });
            this.close();
            this.$emit("signOnBlacklistAct");
          } else {
            this.$message({ type: "error", message: res.data.msg });
          }
        })
        .catch(err => {
          console.log(err);
          this.showLoading = false;
        });
    },
    // 解除拉黑
    addToWhitelistAct() {
      let rowData = this.VistorRecordDetail;
      let row = {};
      if (rowData.certificateNo === "") {
        rowData.certificateNo = null;
      }
      if (rowData.certificateType === "") {
        rowData.certificateType = null;
      }
      row.credentialNo = rowData.certificateNo;
      row.credentialType = rowData.certificateType;
      row.visitorRecordUuid = rowData.visitorRecordUuid;
      this.$confirm(
        `<span style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;">是否确认移出 ？</span>`,
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
            if (
              !row.credentialType &&
							!row.credentialNo &&
							!row.visitorRecordUuid
            ) {
              this.$message({ type: "wraning", message: "证件信息为空" });
              return;
            }
            this.showLoading = !this.showLoading;
            api
              .deleteBlacklistUrl(row)
              .then(res => {
                this.showLoading = !this.showLoading;
                if (res.data.success) {
                  this.$message.success("移出成功！");
                  this.close();
                  this.$emit("signOnBlacklistAct");
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
    // 禁止通行
    forbidBtnAct() {
      console.log("禁止通行");
      this.$emit("forbidBtnAct", this.VistorRecordDetail);
      this.close();
    },
    // 签离
    confirm() {
      console.log("签离");
      this.$emit("signoffAct", this.VistorRecordDetail);
      this.close();
    },
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
    VistorRecordDetail: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    }
  }
};
</script>
<style>
.VistorRecordDetail .el-dialog__body {
	overflow-y: auto;
	max-height: 53.7%;
}
.VistorRecordDetail .activeFontClass {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #26d39d;
}
.VistorRecordDetail .el-dialog {
	position: relative;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	margin: 0px !important;
	background: #25292d;
}
.VistorRecordDetail .el-input__icon {
	line-height: 30px;
	color: #26d39d;
}
.VistorRecordDetail .el-dialog__headerbtn {
	top: 18px;
	display: none;
}
.VistorRecordDetail .el-dialog__header {
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
.VistorRecordDetail .dialogHeaderClass .header_left_txt {
	border-left: 2px solid #26d39d;
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #ffffff;
	padding-left: 10px;
}
.VistorRecordDetail .pBox {
	display: flex;
	justify-content: flex-start;
	margin: 7px 0 8px;
}
.VistorRecordDetail .pBox div {
	width: 50%;
	text-align: left;
}
.VistorRecordDetail .header_right_box {
	text-align: center;
}
.VistorRecordDetail .header_right_box button {
	height: 32px;
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #ffffff;
	text-align: justify;
	padding: 7px 17px;
}

.VistorRecordDetail .imgBox {
	display: inline-block;
	width: 100%;
	height: 100px;
	background: rgba(0, 0, 0, 0.1);
	border: 0 solid rgba(255, 255, 255, 0.1);
	padding: 7px;
	box-sizing: border-box;
}
.VistorRecordDetail .imgBox img {
	width: 100%;
	height: 100%;
}
.VistorRecordDetail .left_tips_txt {
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #26d39d;
}
.VistorRecordDetail .el-upload {
	display: inline-block;
	text-align: center;
	width: 100%;
	line-height: 130px;
	cursor: pointer;
	outline: none;
}
.VistorRecordDetail .authBox {
	display: flex;
	justify-content: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
}
.VistorRecordDetail .el-select {
	display: inline-block;
	position: relative;
	width: 30%;
}
.VistorRecordDetail .el-select .el-input {
	width: 100%;
}
.VistorRecordDetail .el-select .el-select-dropdown__list {
	width: 100%;
}
.VistorRecordDetail .el-input {
	display: inline-block;
	width: 30%;
	height: 30px;
}
.VistorRecordDetail .el-input .el-input__inner {
	height: 30px;
	padding-right: 15px;
}
.VistorRecordDetail .body_box {
	border-top: 1px dashed rgba(255, 255, 255, 0.1);
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	padding: 15px 0px 20px;
	color: #dddddd;
	font-size: 12px;
}
.el-dialog__wrapper {
	overflow: auto;
}
.VistorRecordDetail .time-line {
	display: inline-block;
	border-width: 1px 0px 0px 0px;
	width: 8px;
	border-color: #7a7b7c;
	border-style: solid;
	margin: 0px 3px;
}
.VistorRecordDetail .img {
	vertical-align: baseline;
}
.VistorRecordDetail {
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
