<template>
	<div class="main">
		<el-container class="main-container">
			<el-header class="main-container-header">
				<div class="header-title">
					<img src="@/assets/images/logo.png" />
				</div>
				<tag-view />

				<el-dropdown trigger="click" @command="handleCommand" class="quit-btn">
					<span class="el-dropdown-link myAccountHeader">
						<img src="@/assets/images/header.png" alt />
						<span class="userName">{{username}}</span>
						<i class="el-icon-caret-bottom el-icon--right" style="color:#FFF;"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item class="dropdown-li" disabled command="xiugai">
							<span class="myAccountItem">
								<img src="@/assets/images/mima.png" class="normal" width="14px" height="14px" />
								<img src="@/assets/images/mima_l.png" class="active" width="14px" height="14px" />
								<span>修改密码</span>
							</span>
						</el-dropdown-item>
						<el-dropdown-item class="dropdown-li" command="qiehuan">
							<span class="myAccountItem">
								<img src="@/assets/images/qiehuan.png" class="normal" width="14px" height="14px" />
								<img src="@/assets/images/qiehuan_l.png" width="14px" class="active" height="14px" />
								<span>切换项目</span>
							</span>
						</el-dropdown-item>
						<el-dropdown-item class="dropdown-li" command="tuichu">
							<span class="myAccountItem">
								<img src="@/assets/images/tuichu.png" class="normal" width="14px" height="14px" />
								<img src="@/assets/images/tuichu_l.png" class="active" width="14px" height="14px" />
								<span>退出</span>
							</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-header>
			<el-main class="main-container-main">
				<!-- <router-view></router-view> -->
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</el-main>
		</el-container>
		<template v-for="(dialogParama,index) in GlobalAlarmList">
			<global-alarm-dialog :key="index" :dialogParama="dialogParama" />
		</template>
	</div>
</template>
<script>
import TheChangePassWord from "@/common/EditPasswordDialog";
import TagView from "@/pages/main/views/TagView";
import { mapState } from "vuex";
import GlobalAlarmDialog from "@/pages/alarmDialog/GlobalAlarmDialog.vue";
export default {
  components: {
    TagView,
    TheChangePassWord,
    GlobalAlarmDialog
  },
  props: {},
  data() {
    return {
      GlobalAlarmList: [],
      local_enums: null,
      showPassWordDialogVisible: false,
      dialogVisible: true,
      dialogParama: {},
      webSocket: null,
      stompClient: null,
      subCapture: null,
      subRecognization: null,
      subMonitorAlarm: null
    };
  },
  created() {
    // window.config.projectUuid = this.$store.state.home.projectUuid;
    this.queryBaseTypeByGroup();
  },
  mounted() {
    console.log(this.$store);
    this.$store.commit(
      "SET_CERTIFICATE",
      this.$common.getEnumByGroupStr("cred")
    );
    this.$store.commit("SET_EDUOPTIONS", this.$common.getEnumByGroupStr("edu"));
    this.$store.commit(
      "SET_COUNTRY",
      this.$common.getEnumByGroupStr("nationality")
    );
    this.$store.commit("SET_NATION", this.$common.getEnumByGroupStr("nation"));
    this.$store.commit(
      "SET_MARITAL",
      this.$common.getEnumByGroupStr("marital")
    );
    this.$store.commit(
      "SET_GENDEROPTIONS",
      this.$common.getEnumByGroupStr("gender")
    );
    this.$store.commit(
      "SET_STAFFOPTIONS",
      this.$common.getEnumByGroupStr("staff_t")
    );
    this.$store.commit(
      "SET_CARDOPTIONS",
      this.$common.getEnumByGroupStr("card_u")
    );

    this.initWebSocket();
  },
  activated() {
    console.log(this.$store);
  },
  methods: {
    // 建立websocket通知
    initWebSocket() {
      if (this.webSocket) return;
      if (this.stompClient) return;
      /* eslint-disable */
			let url = window.config.protocolHeader + window.config.socketIP;
			this.webSocket = new SockJS(url);
			this.stompClient = Stomp.over(this.webSocket);
			/* eslint-enable */
      this.stompClient.connect(
        { projectUuid: this.$store.state.home.projectUuid },
        frame => {
          console.log("connect success:", frame);
          // 订阅通知
          const subCaptureApi = "/user/topic/face-1.3/client/capture";
          const subRecognizationApi =
						"/user/topic/face-1.3/client/recognization";
          const subMonitorAlarmApi = "/user/topic/face-1.3/client/monitorAlarm";
          this.subCapture = this.stompClient.subscribe(
            subCaptureApi,
            greeting => {
              // console.log("收到抓拍通知：", greeting);
              this.handleSubscribeCapture(JSON.parse(greeting.body));
            }
          );
          this.subRecognization = this.stompClient.subscribe(
            subRecognizationApi,
            greeting => {
              // console.log("收到识别通知：", greeting);
              this.handleSubscribeRecognization(JSON.parse(greeting.body));
            }
          );
          this.subMonitorAlarm = this.stompClient.subscribe(
            subMonitorAlarmApi,
            greeting => {
              console.log("收到报警通知：", greeting);
              this.handleSubscribeMonitorAlarm(JSON.parse(greeting.body));
            }
          );
        },
        err => {
          console.log("error,errMsg:", err);
        }
      );
    },
    // 断开链接
    disConnectSocket() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        console.log("Disconnected");
      }
    },
    // 取消订阅
    disSubcription() {
      this.subCapture.unsubscribe();
      this.subRecognization.unsubscribe();
      this.subMonitorAlarm.unsubscribe();
    },
    handleSubscribeCapture(data) {
      let CapturePhotoArr = this.$store.state.home.CapturePhotoArr;
      let his = data.captureDatetime.split(" ")[1];
      let ymd = data.captureDatetime.split(" ")[0];
      let mdy =
				ymd.split("-")[1] + "-" + ymd.split("-")[2] + "-" + ymd.split("-")[0];
      data.captureDatetime = his + " " + mdy;
      CapturePhotoArr.push(data);
      if (CapturePhotoArr && CapturePhotoArr.length > 10) {
        CapturePhotoArr.shift();
      }
      this.$store.dispatch("setCapturePhotoArr", CapturePhotoArr);
    },
    handleSubscribeRecognization(data) {
      let RecognizationArr = this.$store.state.home.RecognizationArr;
      RecognizationArr.push(data);
      if (RecognizationArr && RecognizationArr.length > 5) {
        RecognizationArr.shift();
      }
      this.$store.dispatch("setRecognizationArr", RecognizationArr);
    },
    handleSubscribeMonitorAlarm(data) {
      this.GlobalAlarmList.push(data);
      if (this.GlobalAlarmList && this.GlobalAlarmList.length > 3) {
        this.GlobalAlarmList.shift();
      }
    },
    // 退出，修改，切换项目账号，菜单选择事件
    handleCommand(command) {
      console.log(this.$store.state);
      if (command === "tuichu") {
        this.onClickQuit();
      } else if (command === "qiehuan") {
        this.$router.push("/projectManage");
      } else if (command === "xiugai") {
        this.showPassWordDialogVisible = true;
      }
    },
    // 退出账号
    onClickQuit() {
      this.$store.dispatch("setAuthorization", "");
      this.$store.dispatch("setProjectUuid", "");
      this.$store.dispatch("setTagViewArr", []);
      this.$store.dispatch("setLocalTag", "Home");
      this.$router.push({
        name: "Login"
      });
    },
    // 获取本地翻译
    queryBaseTypeByGroup() {
      this.$homeAjax.queryBaseTypeByGroup().then(res => {
        let body = res.data;
        this.handleQueryBaseTypeByGroupSuccessResponse(body);
      });
    },
    handleQueryBaseTypeByGroupSuccessResponse(body) {
      this.local_enums = body;
      this.$store.dispatch("setLocalEnums", this.local_enums);
    }
  },
  watch: {},
  destroyed() {},
  computed: {
    ...mapState({
      username: state => {
        return state.home.account;
      }
    }),
    key() {
      return this.$route.fullPath;
    },
    // dialogVisible: {
    //   get: function() {
    //     console.log(Boolean(this.GlobalAlarmList.length));
    //     return Boolean(this.GlobalAlarmList.length);
    //   },
    //   set: function(val) {}
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dropdown-li {
	text-align: left;
	.myAccountItem {
		span {
			padding-left: 4px;
		}
		img {
			width: 11px;
			height: 11px;
		}
		.active {
			display: none;
		}

		vertical-align: top;
	}
	&:hover {
		color: #26d39d;
		.normal {
			display: none !important;
		}
		.active {
			display: inline-block;
		}
	}
}
.main {
	height: 100%;
	.main-container {
		height: 100%;
		.main-container-header {
			background: #222326;
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			background-image: linear-gradient(
				-180deg,
				#353a3f 4%,
				#272a2d 47%,
				#202124 90%
			);
			box-shadow: 0 6px 25px 0 rgba(0, 0, 0, 0.4);
			z-index: 1;
			.header-title {
				margin-right: 20px;
				margin-left: 10px;
				width: 100px;
				height: 33%;
			}
			.el-dropdown-header {
				float: right;
			}
			.myAccountHeader {
				cursor: pointer;
				line-height: 30px;
				font-family: "PingFangSC-Light";
				font-size: 12px;
				color: #dddddd;
				letter-spacing: 0;
				text-align: left;
				span {
					padding-left: 15px;
				}
				img {
					vertical-align: top;
				}
			}
			.quit-btn {
				margin-left: auto;
				margin-right: 1%;
				.quit-btn-icon {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					.quit-btn-text {
						font-family: PingFangSC-Regular;
						font-size: 12px;
						color: #dddddd;
						letter-spacing: 0;
						text-align: right;
						margin-left: 6px;
					}
				}
			}
		}
		.main-container-main {
			height: 95%;
			padding: 0px;
			background: #1b1b1b;
		}
	}
}
</style>
