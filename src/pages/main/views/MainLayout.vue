<template>
  <div class="main"
       id='maina'>
    <el-container class="main-container">
      <el-header class="main-container-header">
        <div class="header-title">
          <img src="@/assets/images/logo.png" />
        </div>
        <tag-view />
        <el-dropdown trigger="click"
                     @command="handleCommand"
                     class="quit-btn">
          <span class="el-dropdown-link myAccountHeader">
            <img src="@/assets/images/header.png"
                 alt />
            <span class="userName">{{username}}</span>
            <i class="el-icon-caret-bottom el-icon--right"
               style="color:#FFF;"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="dropdown-li"
                              disabled
                              command="xiugai">
              <span class="myAccountItem">
                <img src="@/assets/images/mima.png"
                     class="normal"
                     width="14px"
                     height="14px" />
                <img src="@/assets/images/mima_l.png"
                     class="active"
                     width="14px"
                     height="14px" />
                <span>修改密码</span>
              </span>
            </el-dropdown-item>
            <el-dropdown-item class="dropdown-li"
                              command="qiehuan">
              <span class="myAccountItem">
                <img src="@/assets/images/qiehuan.png"
                     class="normal"
                     width="14px"
                     height="14px" />
                <img src="@/assets/images/qiehuan_l.png"
                     width="14px"
                     class="active"
                     height="14px" />
                <span>切换项目</span>
              </span>
            </el-dropdown-item>
            <el-dropdown-item class="dropdown-li"
                              command="tuichu">
              <span class="myAccountItem">
                <img src="@/assets/images/tuichu.png"
                     class="normal"
                     width="14px"
                     height="14px" />
                <img src="@/assets/images/tuichu_l.png"
                     class="active"
                     width="14px"
                     height="14px" />
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
      <global-alarm-dialog :key="index"
                           @close="closeDialog(dialogParama,index)"
                           @closeAudio="closeAudio"
                           :dialogParama="dialogParama" />
    </template>
  </div>
</template>

<script>
import TheChangePassWord from "@/common/EditPasswordDialog";
import TagView from "@/pages/main/views/TagView";
import { mapState } from "vuex";

export default {
  components: {
    TagView,
    TheChangePassWord
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
      subMonitorAlarm: null,
      subDeviceOnOff: null,
      audio: null
    };
  },
  created() {
    this.queryBaseTypeByGroup();
  },
  mounted() {
    this.initWebSocket();
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
    // 添加用户交互模拟事件
    var btn = document.createElement("button");
    let event = new MouseEvent("click");
    btn.onclick = function() {
      console.log("模拟点击事件");
    };
    btn.dispatchEvent(event);
    btn.onclick();
    window.addEventListener("beforeunload", e => this.browerStatus(e));
    window.addEventListener("onunload", e => this.browerStatusOff(e));
  },
  activated() {},
  methods: {
    browerStatus(e) {
      e = window.event || e;
      // e.returnValue = "确定离开当前页面吗？";
      console.log("---------------");
    },
    browerStatusOff() {
      console.log("完善登出事件");
    },
    // 关闭报警弹窗
    closeDialog(dialogParama, index) {
      this.$set(this.GlobalAlarmList[index], "showDialog", false);
      this.GlobalAlarmList.splice(index, 1);
      console.log(this.GlobalAlarmList);
    },
    closeAudio() {
      // 关闭音频
      if (this.audio.isPlay) {
        this.audio.pause();
      }
    },
    playAudio(data) {
      // 报警播放音频
      if (!this.audio) {
        this.audio = document.createElement("audio");
        this.audio.autoplay = "autoplay";
        this.audio.isPlay = false;
      }
      if (this.audio.isPlay) {
        this.audio.pause();
      }
      this.audio.src = this.$common.setPictureShow(data.soundUrl);
      this.audio.play();
      this.audio.isPlay = true;
    },
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
          console.log("connect success----------------:", frame);
          const subCaptureApi = "/user/topic/face-1.3/client/capture";
          const subRecognizationApi =
            "/user/topic/face-1.3/client/recognization";
          const subMonitorAlarmApi = "/user/topic/face-1.3/client/monitorAlarm";
          const subDeviceOnOffApi = "/user/topic/status/device";
          // 订阅通知
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
              // console.log("收到报警通知：", greeting);
              this.handleSubscribeMonitorAlarm(JSON.parse(greeting.body));
            }
          );
          this.subDeviceOnOff = this.stompClient.subscribe(
            subDeviceOnOffApi,
            greeting => {
              // console.log("收到设备状态变更通知：", greeting);
              this.handleSubscribeDeviceOnOff(JSON.parse(greeting.body));
            }
          );
        },
        err => {
          console.log("websocket connect error,errMsg:", err);
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
    // 设备状态变更通知
    handleSubscribeDeviceOnOff(data) {
      console.log("设备状态变更通知：", data);
      this.$store.dispatch("setDeviceOnOffArr", data);
    },
    // 抓拍通知
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
    // 识别通知
    handleSubscribeRecognization(data) {
      let RecognizationArr = this.$store.state.home.RecognizationArr;
      RecognizationArr.push(data);
      // 解决字段名称不一致
      data.libraryName = data.faceLibraryName;
      if (RecognizationArr && RecognizationArr.length > 5) {
        RecognizationArr.shift();
      }
      this.$store.dispatch("setRecognizationArr", RecognizationArr);
    },
    // 报警通知
    handleSubscribeMonitorAlarm(data) {
      this.$set(data, "showDialog", true);
      data.showDialog = true;
      this.GlobalAlarmList.push(data);
      this.playAudio(data);
      if (this.GlobalAlarmList && this.GlobalAlarmList.length > 10) {
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
    onClickQuit() {
      this.$loginAjax
        .loginOut()
        .then(res => {
          if (res.data.success) {
            this.$store.dispatch("setAuthorization", "");
            this.$store.dispatch("setProjectUuid", "");
            this.$store.dispatch("setTagViewArr", []);
            this.$store.dispatch("setLocalTag", "Home");
            localStorage.setItem("iccSignalRule", "");
            localStorage.setItem("iccMediaRule", "");
            this.$router.push({
              name: "Login"
            });
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(() => {
          this.$message.error("退出失败");
        });
    },
    queryBaseTypeByGroup() {
      this.$homeAjax.queryBaseTypeByGroup().then(res => {
        let body = res.data;
        this.handleQueryBaseTypeByGroupSuccessResponse(body);
      });
    },
    handleQueryBaseTypeByGroupSuccessResponse(body) {
      this.local_enums = body;
      this.$store.dispatch("setLocalEnums", this.local_enums);
      this.localStorageResidentTypeTransfer();
    },
    // 居民管理模块的部分本地翻译数组
    localStorageResidentTypeTransfer() {
      this.$store.commit(
        "SET_CERTIFICATE",
        this.$common.getEnumByGroupStr("cred")
      );
      this.$store.commit(
        "SET_EDUOPTIONS",
        this.$common.getEnumByGroupStr("edu")
      );
      this.$store.commit(
        "SET_COUNTRY",
        this.$common.getEnumByGroupStr("nationality")
      );
      this.$store.commit(
        "SET_NATION",
        this.$common.getEnumByGroupStr("nation")
      );
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
    }
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
#maina {
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
      height: 50px !important;
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
      height: calc(100% - 50px);
      box-sizing: border-box;
      overflow: hidden;
      padding: 0px;
      background: #1b1b1b;
    }
  }
}
</style>
