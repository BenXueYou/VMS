<template>
	<div class="appointmentInvite">
		<div class="title">
			<span class="sp1"></span>
			<span>访客预约、邀请配置</span>
		</div>
		<div class="contain">
			<div class="infoWrap">
				<div class="left">预约时是否需要人证核验：</div>
				<div class="right">
					<el-switch
						:width="27"
						v-model="isCheckCard"
						active-color="#26D39D40"
						inactive-color="rgb(72,73,75)"
					></el-switch>
				</div>
			</div>
			<div class="infoWrap height1">
				<div class="left">人证比对阈值：</div>
				<div class="right">
					<el-input
						style="width: 200px;height: 30px;"
						placeholder="1-100"
						type="number"
						v-model="threshold"
					></el-input>
				</div>
			</div>
			<div class="infoWrap">
				<div class="left">访客到达时是否短信通知被访人：</div>
				<div class="right">
					<el-switch
						:width="27"
						v-model="isSendMsg"
						active-color="#26D39D40"
						inactive-color="rgb(72,73,75)"
					></el-switch>
					<!-- <div class="textClips" style="display:none">
						<span
							class="msgText textClips"
							@mouseover="mymouseover"
							@mouseout="mymouseout"
							@mousemove="mymousemove"
						>注意：短信模板由变量和模板内容构成。 在模板中设置变量后，发送短信时指定变量的实际值，短信服务会自动用实际值替换模板变量，并发送短信</span>
						<br>
						<span class="msgText">{{setSendMsg}}</span>
					</div>-->
				</div>
			</div>
			<div class="infoWrap height1">
				<div class="left">短信模板：</div>
				<div class="right">
					<!-- <el-input style="width:100%;max-width:800px;height: 30px;" v-model="msgArriveModelInput"></el-input> -->
					<el-select
						style="width:100%;max-width:800px;height: 30px;"
						v-model="msgArriveModelInput"
						placeholder="请选择"
					>
						<el-option
							v-for="item in msgArriveModelInputOptions"
							:key="item.templateUuid"
							:label="item.content"
							:value="item.templateUuid"
						></el-option>
					</el-select>
				</div>
			</div>
			<div class="infoWrap">
				<div class="left">邀请成功后是否通知访客：</div>
				<div class="right">
					<el-switch
						:width="27"
						v-model="isNoticeVisitor"
						active-color="#26D39D40"
						inactive-color="rgb(72,73,75)"
					></el-switch>
					<!-- <div class="textClips" style="display:none">
						<span class="msgText">{{setNotice}}</span>
					</div>-->
				</div>
			</div>
			<div class="infoWrap height1">
				<div class="left">短信模板：</div>
				<div class="right">
					<!-- <el-input style="width:100%;max-width:800px;height: 30px;" v-model="msgReservationModelInput"></el-input> -->
					<el-select
						style="width:100%;max-width:800px;height: 30px;"
						v-model="msgReservationModelInput"
						placeholder="请选择"
					>
						<el-option
							v-for="item in msgReservationModelInputOptions"
							:key="item.templateUuid"
							:label="item.content"
							:value="item.templateUuid"
						></el-option>
					</el-select>
				</div>
			</div>
			<div class="infoWrap">
				<div class="left">访客预约操作指南：</div>
				<div class="right">
					<el-switch
						:width="27"
						v-model="isInstructions"
						active-color="#26D39D40"
						inactive-color="rgb(72,73,75)"
					></el-switch>
				</div>
			</div>
			<div class="infoTextareaWrap">
				<div class="left">内容编辑：</div>
				<div class="right">
					<el-input class="textArea" type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea"></el-input>
				</div>
			</div>
			<div class="infoWrap">
				<div class="left">限制二维码、临时卡验证次数：</div>
				<div class="right">
					<el-switch
						:width="27"
						v-model="isLimitFrequency"
						active-color="#26D39D40"
						inactive-color="rgb(72,73,75)"
					></el-switch>
				</div>
			</div>
			<div v-if="isLimitFrequency" class="infoWrap height1">
				<div class="left">验证次数：</div>
				<div class="right">
					<el-input type="number" style="width: 100px;height: 30px;" v-model="verifyFrequency"></el-input>
				</div>
			</div>
			<div class="brnWrap">
				<el-button style="width: 66px;" @click="putVistorNotification">确定</el-button>
				<el-button style="width: 66px;" @click="cancelVistorNotification">取消</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import * as api from "../../utils/ajax";
import { mouseover, mouseout, mousemove } from "@/common/mouse.js"; // 注意路径
export default {
  components: {},
  props: {},
  data() {
    return {
      msgArriveModelInputOptions: [],
      msgReservationModelInputOptions: [],
      isCheckCard: true,
      threshold: "",
      isSendMsg: true,
      isNoticeVisitor: true,
      isInstructions: true,
      isEditCon: false,
      isLimitFrequency: true,
      verifyFrequency: 0,
      sendMsgDialog: false,
      noticeDialog: false,
      vistorAIConfigData: {},
      setSendMsg: "变量：访客姓名{{name}}验证时间{{time}}门{{door}}",
      setNotice:
				"变量：预约时间{{appointment}}二维码链接{{qrcode}}有效期{{term}}",
      textarea: "",
      msgArriveModelInput: null,
      msgReservationModelInput: null
    };
  },
  created() {},
  activated() {
    this.getVistorNotification();
    this.getShortMsgOptionsUrl();
  },
  mounted() {
    this.getVistorNotification();
    this.getShortMsgOptionsUrl();
  },
  methods: {
    getShortMsgOptionsUrl() {
      api
        .getShortMsgOptionsUrl()
        .then(res => {
          if (res.data && res.data.success && res.data.data) {
            this.msgArriveModelInputOptions = res.data.data.visitorArrive;
            this.msgReservationModelInputOptions =
							res.data.data.visitorBookSuccess;
          } else {
            this.$message({ type: "warning", message: "没有找到数据" });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({ type: "err", message: "请求失败" });
        });
    },
    // 初始化
    getVistorNotification() {
      api
        .getVistorAIConfigUrl()
        .then(res => {
          if (res.data.success && res.data.data) {
            let data = res.data.data;
            this.isCheckCard = Boolean(data.needCheck); // 预约时是否需要人证核验
            this.threshold = data.checkThreshold; // 人证比对阈值
            this.isSendMsg = Boolean(data.msgToStaffArrive); // 访客到达时是否短信通知被访人
            this.msgArriveModelInput = data.msgTemplateToStaffArrive; // 访客到达短信通知模板
            this.isNoticeVisitor = Boolean(data.msgToVisitorBookSuccess); // 预约成功后是否通知访客
            this.msgReservationModelInput = data.msgTemplateVisitorBookSuccess; // 预约成功短信通知模板
            this.isInstructions = Boolean(data.operationalGuidelines); // 访客预约操作指南
            this.isEditCon = data.context; // 内容编辑
            this.vistorAIConfigData = data;
            this.isLimitFrequency = Boolean(data.limitAllowedCount);
            this.verifyFrequency = data.allowedMax > 0 ? data.allowedMax : 0;
            this.textarea = data.context ? data.context : this.textarea;
          } else {
            this.$message({ type: "error", message: "出错了" });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({ type: "err", message: "请求失败" });
        });
    },
    // 点击页面配置按钮保存信息
    putVistorNotification() {
      var data = {
        allowedMax: this.verifyFrequency,
        limitAllowedCount: Number(this.isLimitFrequency),
        needCheck: Number(this.isCheckCard),
        checkThreshold: this.threshold,
        context: this.textarea,
        visitorArrive: this.msgArriveModelInput,
        visitorBook: this.msgReservationModelInput,
        msgToStaffArrive: Number(this.isSendMsg),
        msgToVisitorBookSuccess: Number(this.isNoticeVisitor),
        operationalGuidelines: Number(this.isInstructions),
        msgTemplateToStaffArrive: this.msgArriveModelInput, /// 模板uuid
        msgTemplateVisitorBookSuccess: this.msgReservationModelInput
      };
      Object.assign(this.vistorAIConfigData, data);
      console.log(this.vistorAIConfigData);
      api
        .putVistorAIConfigUrl(this.vistorAIConfigData)
        .then(res => {
          if (res.data.success) {
            this.$message({ type: "success", message: "已保存" });
          } else {
            this.$message({ type: "error", message: "保存失败" });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({ type: "err", message: "请求失败" });
        });
    },
    cancelVistorNotification() {
      this.getVistorNotification();
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
    }
  },
  watch: {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "@/style/variables.scss";
.appointmentInvite {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}
.appointmentInvite .textArea .el-textarea__inner {
	background-color: transparent;
	border: 1px solid rgba(255, 255, 255, 0.4);
	max-width: 800px;
}
.appointmentInvite .title {
	width: 100%;
	height: 50px;
	background: #212325;
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #ffffff;
	letter-spacing: 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding-left: 40px;
	box-sizing: border-box;
}
.appointmentInvite .title .sp1 {
	width: 3px;
	height: 14px;
	background: #26d39d;
	margin-right: 9px;
}
.appointmentInvite .contain {
	flex: 1;
	background: #212325;
	margin-top: 16px;
	padding: 41px 40px 0 52px;
	box-sizing: border-box;
}
.appointmentInvite .infoWrap {
	width: 100%;
	height: 18px;
	display: flex;
	flex-direction: row;
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #dddddd;
	margin-bottom: 21px;
}
.appointmentInvite .infoTextareaWrap {
	width: 100%;
	display: flex;
	flex-direction: row;
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #dddddd;
	margin-bottom: 21px;
}
.infoTextareaWrap .left,
.appointmentInvite .infoWrap .left {
	width: 220px;
	height: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.infoTextareaWrap .right,
.appointmentInvite .infoWrap .right {
	width: calc(100% - 220px);
	flex: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.appointmentInvite .infoWrap .right .msgText {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #26d39d;
	margin-left: 7px;
}
.appointmentInvite .textClips {
	/* display: inline-block; */
	width: calc(100% - 70px);
	font-family: "PingFangSC-Regular";
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1; /*3表示只显示3行*/
	/* autoprefixer: off */
	-webkit-box-orient: vertical;
	/* autoprefixer: on */
}
.appointmentInvite .infoWrap .el-switch {
	margin: 0 24px 0 18px;
}
.appointmentInvite .infoWrap img {
	width: 12px;
	height: 12px;
}
.appointmentInvite .height1 {
	height: 30px;
}
.appointmentInvite .template {
	width: 100%;
	height: 32px;
	padding-left: 272px;
	box-sizing: border-box;
	margin-bottom: 21px;
}
.appointmentInvite .template .msgCon {
	height: 32px;
	border-radius: 2px;
	background: rgba(255, 255, 255, 0.05);
	font-family: PingFangSC-Regular;
	font-size: 13px;
	color: #dddddd;
	padding-left: 18px;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.appointmentInvite .contain .brnWrap {
	width: 100%;
	height: 32px;
	padding-left: 220px;
	box-sizing: border-box;
	margin-top: 7px;
}
.appointmentInvite .el-button--default,
.appointmentInvite .el-button--default:active,
.appointmentInvite .el-button--default:focus,
.appointmentInvite .el-button--default:hover {
	height: 32px;
	background: rgba(40, 255, 187, 0.1);
	border: 1px solid rgba(40, 255, 187, 0.35);
	border-radius: 2px;
	font-family: 'PingFangSC-Regular';
	font-size: 13px;
	color: #ffffff;
	position: relative;
	padding: 0 0 0 0;
}
.appointmentInvite .el-switch.is-checked .el-switch__core::after {
	left: 100%;
	margin-left: -13px;
	background: #26d39d;
}
.appointmentInvite .el-switch__core:after {
	background: #dddddd;
}
.appointmentInvite .sendMsgDialog input {
	border: none;
	border-bottom: 1px solid rgba(255, 255, 255, 0.15);
	border-radius: unset;
	padding: 0 12px;
}
.appointmentInvite .sendMsgDialog .con {
	width: 100%;
	height: 270px;
	padding: 40px 0 0 36px;
	box-sizing: border-box;
}
.appointmentInvite .sendMsgDialog .con .line {
	width: 100%;
	height: 30px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.appointmentInvite .sendMsgDialog .con .line span {
	font-family: PingFangSC-Regular;
	font-size: 13px;
	color: #ffffff;
}
.appointmentInvite .sendMsgDialog .con .line:first-child {
	margin-bottom: 36px;
}
.appointmentInvite .sendMsgDialog .con .line:first-child span {
	margin: 0 21px;
}
.appointmentInvite .sendMsgDialog .con .line .sp1 {
	margin: 0 11px;
}
.appointmentInvite .sendMsgDialog .con .el-input__inner {
	font-family: PingFangSC-Regular;
	font-size: 13px;
	color: #999999;
}
.appointmentInvite .sendMsgDialog .con .brnWrap {
	width: 100%;
	height: 32px;
	padding-right: 41px;
	box-sizing: border-box;
	margin-top: 65px;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}
</style>
