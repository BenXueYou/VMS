<template>
  <el-dialog :title='title+" - "+channelName'
             @close="close"
             width="900px"
             class='remoteControlDialog'
             :modal="false"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :visible.sync='isShow'>
    <div class="wrap">
      <div class="videoWrap"
           ref="VideoWrap">
        <video-wrap v-for="(item,index) in showFenlu"
                    :ref="'video'+index"
                    :key="index"
                    :index="index"
                    :width="item.width"
                    :height="item.height"
                    :rtspUrl="item.rtspUrl"
                    :streamType="item.streamType"
                    :IsShowMenu="!!item.rtspUrl"
                    :position="item.position"
                    :left="item.left"
                    :top="item.top"
                    :isRecord="!!item.isRecord"
                    :isStopVoice="!!item.isStopVoice"
                    :fenlu="fenluIndex+1"
                    :isAutoScreen="isAutoScreen===index"
                    :mode="item.mode"
                    @fullscreen2="fullscreen2"
                    @playRtsp="playRtsp"
                    @dblclickhandler="dblclickhandler"
                    @closeVideo="closeVideo"
                    @startRecord="startRecord"
                    @stopRecord="stopRecord"
                    @openVideoVoice="openVideoVoice"
                    @screenShot="screenShot"
                    @dragstart="dragstart(index)"
                    @drop="drop(index)"
                    @contextmenu="showMenu"
                    @click="ClickViDeoA(index)">
        </video-wrap>
      </div>
      <div class="videoConrol">
        <div v-show="isShowClund"
             class="videoConrol">
          <div class="btngroup">
            <div class="button"
                 v-for='(item,index) in btnGroup'
                 @mousedown="cloundControl(item,index)"
                 @mouseup="cloundControl2(item,index)"
                 :key="index">
              <img :src="icons[item]"
                   alt="">
            </div>
          </div>
          <div class="control">
            <div class="voice"
                 @mouseup="cloundControl2('zoom_in',0)"
                 @mousedown="cloundControl('zoom_in',0)">

              变倍 +
            </div>
            <div class="voice"
                 @mouseup="cloundControl2('zoom_out',2)"
                 @mousedown="cloundControl('zoom_out',2)">
              变倍 -
            </div>
          </div>
          <div class="control">
            <div class="voice"
                 @mouseup="cloundControl2('zoom_in',3)"
                 @mousedown="cloundControl('zoom_in',3)">
              聚集 +
            </div>
            <div class="voice"
                 @mouseup="cloundControl2('zoom_out',5)"
                 @mousedown="cloundControl('zoom_out',5)">
              聚焦 -
            </div>
          </div>
          <div class="control">
            <div class="voice"
                 @mouseup="cloundControl2('zoom_in',6)"
                 @mousedown="cloundControl('zoom_in',6)">
              光圈 +
            </div>
            <div class="voice"
                 @mouseup="cloundControl2('zoom_out',8)"
                 @mousedown="cloundControl('zoom_out',8)">
              光圈 -
            </div>
          </div>
          <div class='stepText'>
            <span>
              歩长：
            </span>
          </div>
          <div class="step">

            <el-slider v-model="steplen"
                       :max="10"
                       :step="1"
                       :show-tooltip="false"
                       class="time-slider"></el-slider>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import VideoWrap from "@/pages/VideoPreview/components/video";
import icons from "@/common/icon.js";
import * as api2 from "@/pages/VideoPreview/ajax.js";
export default {
  name: "videoPreviewDialog",
  components: {
    VideoWrap
  },
  props: {
    moduleName: {
      type: String,
      default: ""
    },
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    title: {
      type: String,
      default() {
        return "预览 ";
      }
    },
    center: {
      type: Boolean,
      default() {
        return false;
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    channelUuid: {
      type: String,
      default() {
        return "EAFD862A8EDD54184CA429045401159B";
      }
    },
    channelName: {
      type: String,
      default() {
        return "通道名称";
      }
    },
    channelType: {
      type: String,
      default() {
        return "";
      }
    },
    orgName: {
      type: String,
      default() {
        return "";
      }
    },
    projectUuid: {
      type: String,
      default() {
        return this.$store.state.home.projectUuid;
      }
    }
  },
  data() {
    return {
      steplen: 3,
      btnGroup: [
        "up_left",
        "up",
        "up_right",
        "left",
        "center",
        "right",
        "down_left",
        "down",
        "down_right"
      ],
      showFenlu: [],
      menuData: [
        {
          label: "关闭窗口",
          value: "关闭窗口"
        },
        {
          label: "关闭所有窗口",
          value: "关闭所有窗口"
        },
        {
          label: "抓图",
          value: "抓图"
        },
        {
          label: "码流切换",
          value: "码流切换",
          children: [
            {
              label: "主码流",
              value: "主码流"
            },
            {
              label: "辅码流",
              value: "辅码流"
            },
            {
              label: "第三码流",
              value: "第三码流"
            }
          ]
        },
        {
          label: "切换至录像",
          value: "切换至录像"
        },
        {
          label: "开始录像",
          value: "开始录像"
        },
        {
          label: "图像调节",
          value: "图像调节"
        },
        {
          label: "打开音频",
          value: "打开音频"
        },
        {
          label: "摄像机信息",
          value: "摄像机信息"
        },
        {
          label: "全屏",
          value: "全屏"
        }
      ],
      icons,
      fenluIndex: 1,
      isAutoScreen: -1, // 是否放大
      isShow: false
    };
  },
  computed: {
    isShowClund() {
      return (
        ["bullet_camera_ptz", "ball_camera"].indexOf(this.channelType) !== -1
      );
    }
  },
  mounted() {
    // this.isShow = true;
    // let _this = this;
    // window.onresize = function() {
    //   var ch = document.body.clientHeight;
    //   var sh = window.screen.height;
    //   console.log(ch + "  " + sh);
    //   // if (ch === sh) {
    //   //   // 表示全屏了，则使用主码流播放
    //   //   _this.playVideo("main");
    //   // } else {
    //   //   _this.playVideo("sub");
    //   // }
    // };
  },
  methods: {
    setFullScreen(target) {
      if (target.requestFullscreen) {
        target.requestFullscreen();
      }
      if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen();
      }
      if (target.mozRequestFullScreen) {
        target.mozRequestFullScreen();
      }
      if (target.msRequestFullscreen) {
        target.msRequestFullscreen();
      }
    },
    close() {
      this.$emit("update:visible", false);
    },
    playRtsp() {},
    dblclickhandler() {},
    fullscreen2() {
      console.log(this.$refs.video0[0].getCanvas());
      this.setFullScreen(this.$refs.video0[0].getCanvas());
    },
    closeVideo() {
      let index = 0;
      this.operatorIndex = index;
      this.showFenlu[index].rtspUrl = "";
      this.showFenlu[index].streamType = "";
      this.showFenlu[index].channelUuid = "";
      this.showFenlu.concat();
    },
    screenShot(index) {
      // 抓图
      // 判断该分路有没有canvas,从而是否显示弹窗
      let canvas = this.$refs["video" + index][0].canvas;
      if (canvas) {
        // 抓图由webplay控制
        // this.screenShotVisible = true;
        // console.log(canvas);
        // var dataURL = canvas.toDataURL("image/png");
        // console.log(dataURL);
        // this.src = dataURL;
      } else {
        this.$message.error("该分路没有视频在播放，请先添加视频！");
      }
    },
    startRecord(index) {
      this.menuData = this.menuData.map(item => {
        if (item.label === "开始录像") {
          return {
            value: "停止录像",
            label: "停止录像"
          };
        }
        return item;
      });
      let item = this.showFenlu[index];
      item.isRecord = true;
      this.showFenlu.splice(index, 1, item);
      this.$refs["video" + index][0].record();
    },
    stopRecord(index) {
      this.menuData = this.menuData.map(item => {
        if (item.label === "停止录像") {
          return {
            value: "开始录像",
            label: "开始录像"
          };
        }
        return item;
      });
      let item = this.showFenlu[index];
      item.isRecord = false;
      this.showFenlu.splice(index, 1, item);
      this.$refs["video" + index][0].stopRecord();
    },
    openVideoVoice(index) {
      console.log(index);
      console.log(this.showFenlu);
      let item = this.showFenlu[index];
      item.isStopVoice = !item.isStopVoice;

      // this.showFenlu[index].isStopVoice = !this.showFenlu[index].isStopVoice;
      this.showFenlu.splice(index, 1, item);
      this.showFenlu.concat();
    },
    showMenu(e, index) {
      // this.operatorIndex = index;
      // const _this = this;
      // e.preventDefault();
      // this.$ContextMenu({
      //   data: this.menuData,
      //   event: e,
      //   target: this.$refs.vedioWrap,
      //   callback(value) {
      //     // value表示点击按钮的value
      //     _this.dealContextMenu(value);
      //   }
      // });
    },
    // 处理
    dealContextMenu(value) {
      console.log(value);
      switch (value) {
        case "关闭窗口":
          // 清空rtspUrl，则触发video组件stop事件
          if (!this.videoArr[this.operatorIndex].channelUuid) {
            this.$message.error("该分路上没有通道！");
          } else {
            this.$confirm(
              `<span style="font-family: "PingFangSC-Regular";font-size: 14px;color: #FFFFFF;">是否关闭该窗口?</span>`,
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                distinguishCancelAndClose: true,
                confirmButtonClass: "confirm-button",
                cancelButtonClass: "cancel-button",
                center: true,
                dangerouslyUseHTMLString: true,
                customClass: "isCloseDialog"
              }
            )
              .then(() => {
                this.videoArr[this.operatorIndex].rtspUrl = "";
                this.videoArr[this.operatorIndex].channelUuid = "";
                this.videoArr[this.operatorIndex].startTime = "";
                this.videoArr[this.operatorIndex].endTime = "";
                this.videoArr[this.operatorIndex].mode = "original";
                this.videoArr[this.operatorIndex].timeData = [];
                this.videoArr.concat();
              })
              .catch(() => {});
          }

          break;
        case "关闭所有窗口":
          this.$confirm(
            `<span style="font-family: "PingFangSC-Regular";font-size: 14px;color: #FFFFFF;">是否关闭所有的窗口?</span>`,
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              distinguishCancelAndClose: true,
              confirmButtonClass: "confirm-button",
              cancelButtonClass: "cancel-button",
              center: true,
              dangerouslyUseHTMLString: true,
              customClass: "isCloseDialog"
            }
          )
            .then(() => {
              this.videoArr = this.videoArr.map(item => {
                item.rtspUrl = "";
                item.startTime = "";
                item.endTime = "";
                item.mode = "original";
                item.timeData = [];
                return item;
              });
            })
            .catch(() => {});

          break;
        case "摄像机信息":
          if (!this.videoArr[this.operatorIndex].channelUuid) {
            this.$message.error("该分路上没有通道！");
          } else {
            api2
              .getCameraInfo(
                this.videoArr[this.operatorIndex].operatorData.parentUuid,
                {
                  channelUuid: this.videoArr[this.operatorIndex].channelUuid
                }
              )
              .then(res => {
                /* eslint-disable */
                let data = res.data.data || {};
                let channelTyepCN =
                  JSON.parse(sessionStorage.getItem("localEnums"))["chn"][
                    data.channelType
                  ] || data.channelType;
                data.channelType = channelTyepCN;
                this.videoinfo = data;
                this.videoInfoVisible = true;
                /* eslint-disable */
              });
          }
          break;
        case "抓图":
          this.screenShot(this.operatorIndex);
          break;
        case "切换至录像":
          if (!this.videoArr[this.operatorIndex].channelUuid) {
            this.$message.error("该分路上没有通道！");
          } else {
            this.switchLuxiang(
              this.videoArr[this.operatorIndex].channelUuid,
              this.videoArr[this.operatorIndex].operatorData.label
            );
          }
          break;
        case "全屏":
          // this.setFullScreen(
          //   this.$refs["video" + this.operatorIndex][0].getCanvas()
          // );
          this.PreviewAreafullScreen();
          break;
        case "图像调节":
          if (!this.videoArr[this.operatorIndex].channelUuid) {
            this.$message.error("该分路上没有通道！");
          } else {
            this.imageAdjustVisible = true;
          }
          break;
        case "开始录像":
          // this.jumpToPlayback();
          this.startRecord(this.operatorIndex);
          break;
        case "停止录像":
          this.stopRecord(this.operatorIndex);
          break;
        case "主码流":
          this.switchMaLiu(this.operatorIndex, "main");
          break;
        case "辅码流":
          this.switchMaLiu(this.operatorIndex, "sub");
          break;
        case "第三码流":
          this.switchMaLiu(this.operatorIndex, "thrid");
          break;
        case "打开音频":
          this.openVideoVoice(this.operatorIndex);
          break;
        default:
          break;
      }
    },
    dragstart() {},
    drop() {},
    ClickViDeoA() {},
    cloundControl(name, index) {
      console.log(name, index);
      // 判断是否可以操作摄像机
      if (!this.isShowClund) {
        console.log(this.channelType);
        this.$message.warning("非球机和带枪机的云台，不可以操作!");
        return;
      }
      if (
        name === "fangda" ||
        name === "centerbig" ||
        name === "quan" ||
        name === "center"
      ) {
        return;
      }
      let action = "";
      if (name === "zoom_in") {
        action = "zoom_in";
        if (index === 0) {
          action = "zoom_in";
        } else if (index === 3) {
          action = "focus_near";
        } else if (index === 6) {
          action = "iris_open";
        }
      } else if (name === "zoom_out") {
        if (index === 2) {
          action = "zoom_out";
        } else if (index === 5) {
          action = "focus_far";
        } else if (index === 8) {
          action = "iris_close";
        }
      } else {
        action = name;
      }
      api2
        .ctrl(
          this.channelUuid,
          {
            action, // 操作类型，必填
            start: true, // 开始/结束，必填
            speed: this.steplen, // 速度，必填
            projectUuid: this.projectUuid
          },
          {
            modelName: this.moduleName,
            type: "云台控制",
            detailContent: `${this.orgName}-云台控制-${this.channelName}`
          }
        )
        .then(res => {
          console.log(res);
        });
    },
    cloundControl2(name, index) {
      let action = "";
      if (
        name === "fangda" ||
        name === "centerbig" ||
        name === "quan" ||
        name === "center"
      ) {
        return;
      }
      if (name === "zoom_in") {
        action = "zoom_in";
        if (index === 0) {
          action = "zoom_in";
        } else if (index === 3) {
          action = "focus_near";
        } else if (index === 6) {
          action = "iris_open";
        }
      } else if (name === "zoom_out") {
        if (index === 2) {
          action = "zoom_out";
        } else if (index === 5) {
          action = "focus_far";
        } else if (index === 8) {
          action = "iris_close";
        }
      } else {
        action = name;
      }
      // this.$emit("ctrl", action, false, this.steplen);
      api2
        .ctrl(this.channelUuid, {
          action, // 操作类型，必填
          start: false, // 开始/结束，必填
          speed: this.steplen, // 速度，必填
          projectUuid: this.projectUuid
        },{
            modelName: this.moduleName,
            type: "云台控制",
            detailContent: `${this.orgName}-云台控制-${this.channelName}`
          })
        .then(res => {
          console.log(res);
        });
    },
    getPreviewInfoAA() {
      return new Promise(resolve => {
        api2.getPreviewInfoAA({ asgName: this.projectUuid }).then(res => {
          let data = res.data.data || {};
          resolve(data);
        });
      });
    },
    async getPreviewInfo() {
      // const { jDescription } = this.$store.getters;
      // if (!jSignal.srcUuid || !jMedia.srcUuid) {
      let data = await this.getPreviewInfoAA();
      this.$store.commit("setJDescription", data);
      // }
    },
    playVideo(streamType) {
      this.showFenlu = [];
      this.showFenlu.push({
        width: 900,
        height: 500,
        rtspUrl: "",
        streamType: streamType,
        position: 0,
        left: 0,
        top: 0,
        isRecord: false,
        isStopVoice: false,
        mode: "original"
      });
      api2
        .getPreviewInfo(
          {
            channelUuid: this.channelUuid,
            projectUuid: this.projectUuid,
            streamType: streamType
          },
          {
            modelName: this.moduleName,
            type: "实时预览",
            detailContent: `${this.orgName}-预览-${this.channelName}`
          }
        )
        .then(res => {
          let data = res.data.data;
          this.showFenlu[0].rtspUrl = data.rtspUrl;
          // this.showFenlu[0].rtspUrl =
          //   "rtsp://admin:Admin123456@192.168.9.25:554/Streaming/Channels/101";
          this.showFenlu.concat();
        });
    }
  },
  watch: {
    visible(val) {
      if (val) {
        console.log(this.channelType);
        let projectType = this.$store.state.home.projectType || {};
        this.getPreviewInfo();
        this.playVideo("main");
      } else {
        this.closeVideo();
      }
      this.isShow = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  .videoWrap {
    position: relative;
    width: 900px;
    height: 500px;
  }
  .videoConrol {
    background: #25292d;
    display: flex;
    box-sizing: border-box;
    padding: 15px;
    .btngroup {
      display: flex;
      width: 90px;
      flex-wrap: wrap;
      .button {
        width: 25px;
        height: 25px;
        text-align: center;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 2px;
        margin: 2px;
        img {
          cursor: pointer;
        }
      }
    }
  }
  .control {
    .voice {
      width: 70px;
      height: 30px;
      line-height: 30px;
      font-family: "PingFangSC-Regular";
      font-size: 12px;
      color: #dddddd;
      text-align: justify;
      text-align: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      margin: 10px 20px;
      cursor: pointer;
    }
  }
  .stepText {
    font-family: "PingFangSC-Regular";
    font-size: 12px;
    color: #dddddd;
    line-height: 40px;
    padding: 0px 20px 0px 10px;
  }
  .step {
    width: 300px;
    padding-top: 5px;
  }
}
</style>
