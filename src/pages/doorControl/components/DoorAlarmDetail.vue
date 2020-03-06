<template>
	<el-dialog
		class="AlarmDetail"
		:visible.sync="isShow"
		title="报警信息"
		width="550px"
		:before-close="closeBtnAct"
	>
		<div class="alarmBox">
			<div class="topBox">
				<img src="@/assets/images/temperature/temperature_alarm_icon.png" alt srcset />报警图片
			</div>
			<div class="tipsBox">
				<div class="leftImageBox">
					<el-image
						:src="defaultDetail.extInfo?$common.setPictureShow(defaultDetail.extInfo.snapPhotoUrl,'facelog'):$common.setPictureShow(defaultDetail.extInfo)"
					></el-image>
				</div>
				<div class="rightTxtBox">
					<p>
						报警时间：
						<span>{{defaultDetail.alarmTime}}</span>
					</p>
					<p>
						报警类型：
						<span>{{$common.getEnumItemName("alarm_t", defaultDetail.subType)}}</span>
					</p>
					<p>
						报警地点：
						<span>{{defaultDetail.resName}}</span>
					</p>
					<p>
						报警源：
						<span>{{defaultDetail.resName}}</span>
					</p>
					<p v-if="defaultDetail.extInfo && defaultDetail.extInfo.temperature">
						体温：
						<span style="color:#FF5F5F">{{defaultDetail.extInfo?defaultDetail.extInfo.temperature:''}}℃</span>
					</p>
					<p>
						报警等级：
						<span
							style="color: #FF5F5F;"
						>{{defaultDetail.alarmLevel?$common.getEnumItemName("alarm_l", defaultDetail.alarmLevel):'紧急'}}</span>
					</p>
				</div>
			</div>
		</div>
		<div
			class="staffBox"
			v-if="defaultDetail.extInfo && defaultDetail.extInfo.staffUuid && defaultDetail.extInfo.temperature"
		>
			<div class="topBox">
				<img src="@/assets/images/temperature/temperature_staff_icon.png" alt srcset />人员信息
			</div>
			<div class="tipsBox">
				<div class="leftImageBox">
					<el-image
						:src="defaultDetail.extInfo?$common.setPictureShow(defaultDetail.extInfo.certificatePhotoUri):$common.setPictureShow(defaultDetail.extInfo)"
					></el-image>
				</div>
				<div class="rightTxtBox">
					<p>
						姓名：
						<span>{{defaultDetail.extInfo.staffName}}</span>
					</p>
					<p>
						性别：
						<span>{{$common.getEnumItemName('gender',defaultDetail.extInfo.gender)}}</span>
					</p>
					<p>
						证件类型：
						<span>{{$common.getEnumItemName('cred',defaultDetail.extInfo.certificateType)}}</span>
					</p>
					<p>
						证件号：
						<span>{{defaultDetail.extInfo.certificateNo}}</span>
					</p>
					<p>
						手机号：
						<span>{{defaultDetail.extInfo.contactInfo}}</span>
					</p>
					<p>
						住址：
						<span>{{defaultDetail.extInfo.infrastructureUri}}</span>
					</p>
					<p>
						人员类型：
						<span>{{$common.getEnumItemName('staff_t',defaultDetail.extInfo.staffType[0])}}</span>
					</p>
				</div>
			</div>
		</div>
		<div class="detalBox">
			<div class="topBox">
				<div>
					<img src="@/assets/images/temperature/temperature_deteal_icon.png" alt srcset />警情处理
				</div>
				<el-radio-group v-model="valided">
					<el-radio label="1">有效</el-radio>
					<el-radio label="0">误报</el-radio>
				</el-radio-group>
			</div>
			<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea"></el-input>
			<div class="footerBtnBox">
				<el-button type="primary" @click="AlarmDetailBtnAct" size="mini">确认</el-button>
				<el-button type="primary" @click="closeBtnAct" size="mini">取消</el-button>
			</div>
		</div>
	</el-dialog>
</template>
<script>
export default {
  name: "",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    defaultDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      valided: 1,
      textarea: "",
      isShow: false,
      alarmDetail: {}
    };
  },
  methods: {
    AlarmDetailBtnAct() {
      let data = {
        alarmUuid: this.defaultDetail.alarmUuid,
        userUuid: this.$store.state.home.userUuid,
        userName: this.$store.state.home.account,
        valided: this.valided,
        dealState: this.defaultDetail.dealState,
        content: this.textarea,
        dealUuid: this.defaultDetail.dealUuid
      };
      if (this.defaultDetail.dealState === "to_be_processed") {
        this.httpPostAlarmDeteal(data);
      } else {
        this.httpPutAlarmDeteal(data);
      }
    },
    httpPutAlarmDeteal(data) {
      this.$logSearchHttp
        .putAlarmLogDeteal(data)
        .then(res => {
          if (res.data.success) {
            this.$message({ type: "success", message: "报警处理成功" });
            this.$emit("close");
            this.closeBtnAct();
          } else {
          }
        })
        .catch(() => {});
    },
    httpPostAlarmDeteal(data) {
      this.$logSearchHttp
        .postAlarmLogDeteal(data)
        .then(res => {
          if (res.data.success) {
            this.$message({ type: "success", message: "新增报警处理成功" });
            this.$emit("close");
            this.closeBtnAct();
          } else {
          }
        })
        .catch(() => {});
    },
    closeBtnAct() {
      this.isShow = false;
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible(val) {
      this.isShow = val;
      if (!val) {
        this.valided = 1;
        this.textarea = "";
      } else {
        this.valided = String(this.defaultDetail.valided);
        this.textarea = this.defaultDetail.content;
      }
    },
    defaultDetail(val) {
      this.valided = String(val.valided);
      this.textarea = val.content;
    }
  }
};
</script>
<style>
.AlarmDetail .el-dialog__body {
	padding: 20px 35px;
}
.AlarmDetail .el-textarea__inner {
	width: calc(100% - 5px);
	background: transparent !important;
	margin-left: 15px;
	border: 1px solid rgba(255, 255, 255, 0.15);
	border-radius: 2px;
	border-radius: 2px;
	margin-bottom: 18px;
}
</style>
<style lang="scss" scoped>
.AlarmDetail {
	.alarmBox {
		padding-bottom: 20px;
	}
	.topBox {
		padding-bottom: 20px;
		padding-left: 15px;
		font-family: "PingFangSC-Regular";
		font-size: 13px;
		color: #dddddd;
		img {
			margin-right: 7px;
			vertical-align: middle;
		}
	}
	.tipsBox {
		display: flex;
		justify-content: flex-start;
		padding-left: 15px;
		.leftImageBox {
			width: 140px;
			height: 140px;
			.el-image {
				width: 100%;
				height: 100%;
			}
		}
		.rightTxtBox {
			padding-left: 25px;
			font-family: "PingFangSC-Regular";
			font-size: 12px;
			color: #dddddd;
			p {
				margin-top: 0px;
				margin-bottom: 6px;
			}
		}
	}
	.staffBox {
		border-top: 1px dashed rgba(255, 255, 255, 0.15);
		// border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
		padding-top: 20px;
		padding-bottom: 20px;
	}
	.detalBox {
		padding-top: 20px;
		border-top: 1px dashed rgba(255, 255, 255, 0.15);
		padding-right: 15px;
		.topBox {
			display: flex;
			justify-content: space-between;
		}
		.el-textarea__inner {
			color: transparent;
		}
	}
	.footerBtnBox {
		text-align: right;
	}
}
</style>
