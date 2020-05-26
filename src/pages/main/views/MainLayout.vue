<template>
  <div class="main"
       id="maina">
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
            <span class="userName">{{ username }}</span>
            <i class="el-icon-caret-bottom el-icon--right"
               style="color:#FFF;"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="dropdown-li"
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
    <template v-for="(dialogParama, index) in GlobalAlarmList">
      <global-alarm-dialog :key="index"
                           @close="closeDialog(dialogParama, index)"
                           @closeAudio="closeAudio"
                           :dialogParama="dialogParama" />
    </template>
    <template v-for="(dialogParamaPeopele, index) in peopleAlarmList">
      <people-alarm-dialog :key="index"
                           @close="closePeopleDialog(dialogParamaPeopele, index)"
                           @closeAudioPeople="closeAudioPeople"
                           :dialogParamaPeopele="dialogParamaPeopele" />
      <!--   <div style="width: 100px;height: 100px;background: red;z-index: 90000000000;position:absolute;left: 0;top: 0">jhknkklkknklnmllm</div> -->
    </template>

    <!-- 一人一档 -->
    <people-files-dialog :staffUuid="staffUuid"
                         :visible.sync="peopleFilesDialogVisiable"
                         :subModuleName="subModuleName"
                         :moduleName="moduleName"
                         :address="address"
                         :staffName="staffName"
                         :projectUuid='projectUuid'></people-files-dialog>
    <!-- 一房一档 -->
    <build-house-files :visible.sync="isBHFShow"
                       :projectUuid='projectUuid'
                       :subModuleName="subModuleName"
                       :moduleName="moduleName"
                       :address="address"
                       :infrastructureUuid="infrastructureUuid" />
    <!-- 修改密码 -->
    <TheChangePassWord :visible.sync="showPassWordDialogVisible"
                       @onConfirm="confirm"></TheChangePassWord>

  </div>
</template>
<script>
// import TheChangePassWord from "@/common/EditPasswordDialog";
import TheChangePassWord from "@/common/TheChangePassWord";
import TagView from "@/pages/main/views/TagView";
import { mapState } from "vuex";
import GlobalAlarmDialog from "@/pages/alarmDialog/GlobalAlarmDialog.vue";
import PeopleAlarmDialog from "@/pages/alarmDialog/peopleAlarmDialog.vue";
import BuildHouseFiles from "@/pages/BuildHouseFile/BuildHouseFiles";
import peopleFilesDialog from "@/pages/peopleFiles/peopleFilesDialog";
// import * as api2 from "@/pages/VideoPreview/ajax.js";
import RestApi from "@/utils/RestApi";

export default {
  components: {
    TagView,
    BuildHouseFiles,
    peopleFilesDialog,
    TheChangePassWord,
    GlobalAlarmDialog,
    PeopleAlarmDialog
  },
  props: {},
  data() {
    return {
      GlobalAlarmList: [],
      local_enums: null,
      staffUuid: null,
      projectUuid: null,
      infrastructureUuid: null,
      peopleFilesDialogVisiable: false,
      isBHFShow: false,
      showPassWordDialogVisible: false,
      dialogVisible: true,
      dialogParama: {},
      webSocket: null,
      stompClient: null,
      subCapture: null,
      mapSetSub: null,
      subRecognization: null,
      subMonitorAlarm: null,
      subDeviceOnOff: null,
      audio: null,
      subBayonet: null,
      subBayonetApi: null,
      stompClientPeople: null,
      subCapturePeople: null,
      local_enumsPeople: null,
      peopleAlarmList: [],
      moduleName: "",
      subModuleName: "",
      staffName: "",
      address: "",
      scriptLoad: null
    };
  },
  created() {
    this.queryBaseTypeByGroup();
    this.setGlobalMapInfo();
  },
  mounted() {
    this.GlobalAlarmList = [];
    this.$store.dispatch("setGlobalAlarm", []);
    this.initWebSocket();
    window.addEventListener("beforeunload", e => this.browerStatus(e));
    window.addEventListener("onunload", e => this.browerStatusOff(e));

    // 注册通知
    this.registerEventbus();
  },
  activated() {},
  methods: {
    registerEventbus() {
      this.$bus.$on("showBuildHouseFiles", obj => {
        this.moduleName = obj.moduleName;
        this.subModuleName = obj.subModuleName;
        this.isBHFShow = true;
        this.address = obj.address;
        this.peopleFilesDialogVisiable = false;
        this.infrastructureUuid = obj.infrastructureUuid;
        this.projectUuid = obj.projectUuid;
      });
      this.$bus.$on("showPersonFiles", obj => {
        this.isBHFShow = false;
        this.projectUuid = obj.projectUuid;
        this.moduleName = obj.moduleName;
        this.subModuleName = obj.subModuleName;
        this.staffUuid = obj.staffUuid;
        this.staffName = obj.staffName;
        this.address = obj.address;
        this.peopleFilesDialogVisiable = true;
      });
    },
    unRegisterEventbus() {
      this.$bus.$off("showBuildHouseFiles");
      this.$bus.$off("showPersonFiles");
    },
    closeAudioPeople() {
      // 关闭音频
      if (this.audio.isPlay) {
        this.audio.pause();
      }
    },
    // 关闭报警弹窗
    closePeopleDialog(dialogParamaPeople, index) {
      this.$set(this.peopleAlarmList[index], "showDialog", false);
      this.peopleAlarmList.splice(index, 1);
      console.log(this.peopleAlarmList);
    },
    confirm(data) {
      this.onClickQuit();
    },
    browerStatus(e) {
      e = window.event || e;
      // e.returnValue = "确定离开当前页面吗？";
    },
    browerStatusOff() {},
    // 关闭报警弹窗
    closeDialog(dialogParama, index) {
      this.$set(this.GlobalAlarmList[index], "showDialog", false);
      this.GlobalAlarmList.splice(index, 1);
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
        { projectUuid: this.$store.state.home.projectUuid,
          accountUuid: this.$store.state.home.userUuid },
        frame => {
          const subCaptureApi = window.config.subCaptureApi;
          const subRecognizationApi = window.config.subRecognizationApi;
          const subMonitorAlarmApi = window.config.subMonitorAlarmApi;
          const subDeviceOnOffApi = window.config.subDeviceOnOffApi;
          const subBayonetApi = window.config.subBayonetApi;
          const subPrewarningApi = window.config.subPrewarningApi;
          const mapSetChangeApi = `/user/topic/map-1.7/client/system/config`;
          // 订阅通知
          this.subBayonet = this.stompClient.subscribe(
            subBayonetApi,
            greeting => {
              this.handleSubscribeBayonetCapture(JSON.parse(greeting.body));
            }
          );
          this.subCapture = this.stompClient.subscribe(
            subCaptureApi,
            greeting => {
              this.handleSubscribeCapture(JSON.parse(greeting.body));
            }
          );
          this.subRecognization = this.stompClient.subscribe(
            subRecognizationApi,
            greeting => {
              this.handleSubscribeRecognization(JSON.parse(greeting.body));
            }
          );
          this.subMonitorAlarm = this.stompClient.subscribe(
            subMonitorAlarmApi,
            greeting => {
              this.handleSubscribeMonitorAlarm(JSON.parse(greeting.body));
            }
          );
          this.subDeviceOnOff = this.stompClient.subscribe(
            subDeviceOnOffApi,
            greeting => {
              this.handleSubscribeDeviceOnOff(JSON.parse(greeting.body));
            }
          );
          this.stompClientPeople = this.stompClient.subscribe(
            subPrewarningApi,
            greeting => {
              this.handlePeopleSubscribe(JSON.parse(greeting.body));
            }
          );
          this.mapSetSub = this.stompClient.subscribe(
            mapSetChangeApi,
            greeting => {
              this.mapSetChangeSubscribe(JSON.parse(greeting.body));
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
      this.subDeviceOnOff.unsubscribe();
      this.subBayonet.unsubscribe();
      this.mapSetSub.unsubscribe();
    },
    // 人员预警弹窗通知
    handlePeopleSubscribe(data) {
      let newList = [];
      newList.push(data);
      this.peopleAlarmList = newList;
    },
    // 车辆抓拍通知
    handleSubscribeBayonetCapture(data) {
      let BayonetShootArr = this.$store.state.bayonet.BayonetShootArr;
      // data.color = data.colour;
      let his = data.createTime.split(" ")[1];
      data.captureDatetime = his;
      BayonetShootArr.push(data);
      console.log(data);
      if (BayonetShootArr && BayonetShootArr.length > 7) {
        BayonetShootArr.shift();
      }
      this.$store.dispatch("setBayonetShootArr", BayonetShootArr);
    },
    // 设备状态变更通知
    handleSubscribeDeviceOnOff(data) {
      this.$store.dispatch("setDeviceOnOffArr", data);
    },
    // 抓拍通知
    handleSubscribeCapture(data) {
      // console.log('抓拍通知');
      let CapturePhotoArr = this.$store.state.home.CapturePhotoArr;
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
      let alarmList = this.$common.copyArray(this.GlobalAlarmList);
      this.$store.dispatch(
        "setGlobalAlarm",
        alarmList.length > 3 ? alarmList.slice(alarmList.length - 3) : alarmList
      );
    },
    // 地图设置变更通知
    async mapSetChangeSubscribe(data) {
      console.log("mapSetChangeSubscribe: ", data);
      await this.getMapSet();
      this.setGlobalMapInfo();
    },
    getMapSet() {
      return new Promise(resolve => {
        this.$sysConfigHttp
          .getMapSet(this.$store.state.home.projectUuid)
          .then(res => {
            if (res.data.data) {
              this.$store.dispatch("setMapSetData", res.data.data);
            } else {
              this.$store.dispatch("setMapSetData", {
                returnVal: "",
                supplier: "baidu"
              });
            }
            resolve();
          })
          .catch(() => {
            this.$store.dispatch("setMapSetData", {
              returnVal: "",
              supplier: "baidu"
            });
            resolve();
          });
      });
    },
    // 退出，修改，切换项目账号，菜单选择事件
    handleCommand(command) {
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
      this.$loginAjax
        .loginOut()
        .then(res => {
          if (res.data.success) {
            this.$store.dispatch("setAuthorization", "");
            this.$store.dispatch("setProjectUuid", "");
            this.$store.dispatch("setTagViewArr", []);
            this.$store.dispatch("setLocalTag", "Home");
            sessionStorage.setItem("jDescription", {});
            this.$router.push({
              name: "Login"
            });
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
          // this.$message.error("退出失败");
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
      this.sessionStorageResidentTypeTransfer();
    },
    // 获取地图样式
    getMapStyle() {
      this.$homeAjax.getMapStyle().then(res => {
        let body = res.data;
        this.$store.dispatch("setMapStyle", body);
      });
    },
    // 获取区行政边界
    getAreaMapBorder() {
      this.$homeAjax.getAreaMapBorder().then(res => {
        let body = res.data;
        this.$store.dispatch("setAreaMapBorder", body);
      });
    },
    // 居民管理模块的部分本地翻译数组
    sessionStorageResidentTypeTransfer() {
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
    },
    setGlobalMapInfo() {
      let tilesReturnObj = {
        getMapInitStyleApi: RestApi.sysApi.mapSetApi.getMapInitStyleApi,
        styleApiVal: RestApi.sysApi.mapSetApi.mapStyleApi,
        returnVal: RestApi.sysApi.mapSetApi.searchMap,
        supplier: this.$store.state.home.mapSetData.supplier
      };
      if (!this.scriptLoad) {
        this.scriptLoad = document.createElement("script");
        let code = `var tilesReturnObj=${JSON.stringify(tilesReturnObj)};`;
        try {
          this.scriptLoad.appendChild(document.createTextNode(code));
        } catch (ex) {
          this.scriptLoad.text = code;
        }
        document.body.appendChild(this.scriptLoad);
      } else {
        this.scriptLoad.text = "";
        let code = `var tilesReturnObj=${JSON.stringify(tilesReturnObj)};`;
        try {
          this.scriptLoad.appendChild(document.createTextNode(code));
        } catch (ex) {
          this.scriptLoad.text = code;
        }
      }
    }
  },
  watch: {
    GlobalAlarmList: {
      handler() {},
      deep: true,
      immediate: true
    }
  },
  destroyed() {
    this.unRegisterEventbus();
  },
  computed: {
    ...mapState({
      username: state => {
        return state.home.account;
      }
    }),
    key() {
      return this.$route.fullPath;
    }
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
