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
      <div class="videoWrap">
        <video-wrap v-for="(item,index) in showFenlu"
                    :ref="'video'+index"
                    :key="index"
                    :width="900"
                    :height="500"
                    :rtspUrl="item.rtspUrl"
                    :streamType="item.streamType"
                    :IsShowMenu="!!item.rtspUrl"
                    :position="0"
                    :left="0"
                    :top="0"
                    :isRecord="!!item.isRecord"
                    :isStopVoice="!!item.isStopVoice"
                    :fenlu="fenluIndex+1"
                    :isAutoScreen="isAutoScreen===index"
                    :mode="item.mode"
                    @playRtsp="playRtsp"
                    @dblclickhandler="dblclickhandler"
                    @closeVideo="closeVideo"
                    @startRecord="startRecord"
                    @stopRecord="stopRecord"
                    @fullscreen2="fullscreen2"
                    @openVideoVoice="openVideoVoice"
                    @screenShot="screenShot"
                    @dragstart="dragstart(index)"
                    @drop="drop(index)"
                    @contextmenu="showMenu"
                    @setPlayTimeShow="setPlayTimeShow"
                    @click="ClickViDeoA(index)">
        </video-wrap>
      </div>
      <div class="videoConrol">
        <control-panel @setTimeDialog="setPlayTimeShow"
                       @play="pasueVideo"
                       @stop="stopVideo"
                       @speedUp="speedUp"
                       @slowDown="slowDown"
                       @PreviewAreafullScreen="fullscreen2"
                       @choosetime="choosetime"
                       :playStatus="playStatus"
                       :speed="videoSpeed"
                       :data="oneRoad">

        </control-panel>
      </div>
      <set-play-time-dialog :visible.sync="setTimeVisible"
                            @confirm="setPlayTime"></set-play-time-dialog>

    </div>
  </el-dialog>
</template>
<script>
import VideoWrap from "@/pages/VideoPreview/components/video";
import icons from "@/common/icon.js";
import setPlayTimeDialog from "@/pages/VideoPlayback/components/setPlayTimeDialog";
import * as api2 from "@/pages/VideoPreview/ajax.js";
import ControlPanel from "@/pages/mapOperate/components/ControlPanel";
export default {
  name: "videoPreviewDialog",
  components: {
    VideoWrap,
    setPlayTimeDialog,
    ControlPanel
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
        return "回放 ";
      }
    },
    channelName: {
      type: String,
      default() {
        return "";
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
    streamType: {
      type: String,
      default() {
        return "main";
      }
    },
    channelUuid: {
      type: String,
      default() {
        return "86917E94FB85CC1E0C1A15AFC0834571";
      }
    },
    startTime: {
      type: String,
      default() {
        return "2020-02-18 00:00:00";
      }
    },
    endTime: {
      type: String,
      default() {
        return "2020-02-18 14:28:17";
      }
    },
    videoType: {
      type: String,
      default() {
        return "normal_vod";
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
  computed: {
    showFenlu() {
      console.log(this.videoArr[0]);
      return [this.videoArr[0]];
    },
    oneRoad() {
      return [this.videoArr[0]];
    },
    playStatus() {
      if (this.operatorIndex >= this.videoArr.length) {
        return 0;
      }
      // 视频处于播放还是暂停状态
      return Number(this.videoArr[this.operatorIndex].playStatus);
    }
  },
  data() {
    return {
      step: 3,
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
      icons,
      fenluIndex: 1,
      isAutoScreen: -1, // 是否放大
      isShow: false,
      setTimeVisible: false,
      downloadStatus: "",
      videoSpeed: 1,
      videoMode: "original",
      operatorIndex: 0,
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
          label: "加速",
          value: "加速"
        },
        {
          label: "减速",
          value: "减速"
        },
        {
          label: "单帧",
          value: "单帧"
        },
        {
          label: "设置回放时间",
          value: "设置回放时间"
        },
        {
          label: "抓图",
          value: "抓图"
        },
        {
          label: "切换至实时",
          value: "切换至实时"
        },
        {
          label: "下载",
          value: "下载"
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
      videoArr: Array.from({ length: 16 }, (item, index) => {
        item = {
          width: 900,
          height: 500,
          rtspUrl: "",
          position: index,
          fileName: "测试文件名字1",
          // startTime: "2019-11-19 00:00:00",
          // endTime: "2019-11-19 23:59:59",
          startTime: "",
          endTime: "",
          isRecord: false,
          isStopVoice: false,
          streamType: "main",
          mode: "original",
          playStatus: 0,
          timeData: [
            // {
            //   startTime: "2019-11-12 00:00:00", // 开始时间（yyyy-MM-dd hh:mm:ss），必填
            //   endTime: "2019-11-12 15:00:00" // 结束时间（yyyy-MM-dd hh:mm:ss），必填
            // },
            // {
            //   startTime: "2019-11-19 11:59:59", // 开始时间（yyyy-MM-dd hh:mm:ss），必填
            //   endTime: "2019-11-19 23:00:00" // 结束时间（yyyy-MM-dd hh:mm:ss），必填
            // }
          ]
        };
        return item;
      })
    };
  },
  mounted() {
    // this.isShow = true;
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
    PreviewAreafullScreen() {
      // this.setFullScreen(this.$refs.vedioWrap);
      var element = document.documentElement;
      // this.initWrapDom();
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        console.log("已还原！");
      } else {
        // 否则，进入全屏
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
        console.log("已全屏！");
      }
      // // 改变当前全屏状态
      this.fullscreen = !this.fullscreen;
    },
    getVideoSpeed() {
      console.log(this.$refs);
      this.videoSpeed = this.$refs["video0"][0].speed;
    },
    speedUp() {
      this.$refs["video" + this.operatorIndex][0].speedUp();
      this.getVideoSpeed();
    },
    slowDown() {
      this.$refs["video" + this.operatorIndex][0].slowDown();
      this.getVideoSpeed();
    },
    setPlayTimeShow() {
      this.setTimeVisible = true;
    },
    async playVideo(id, channelName, sd, ed, videoType, streamType, isFrist) {
      let data = await this.backup(id, sd, ed, videoType, streamType);
      // videos是录像的信息，现在将这些放倒控制面板中
      // 处理数据
      console.log(data);
      let videos = {};
      // 回放码流地址后面需要添加开始时间
      let rtspUrl = data.rtspUrl;
      // 模拟数据
      data.videos = data.videos || [];
      if (data.videos.length === 0) {
        this.$cToast.warn("没有查询到录像");
        return;
      }
      videos = {
        fileName: channelName, // 文件名
        videoType: videoType, // 录像类型，必填
        streamType: "main", // 码流类型
        rtspUrl,
        startTime: sd,
        endTime: ed,
        channelUuid: id,
        timeData: data.videos,
        playStatus: 1
      };
      // 从选中的框开始播放
      // 往后面放的时候，还要判断后面的框是不是在放
      // let index = -1;
      // if (isFrist) {
      //   for (let i = this.operatorIndex; i < 16; i++) {
      //     if (!this.videoArr[i].rtspUrl) {
      //       index = i;
      //       break;
      //     }
      //   }
      // } else {
      //   index = this.operatorIndex;
      // }
      // console.log(index);
      let index = 0;
      if (index === -1) {
        // 说明后面没有格子可以播放了，则提示用户
        this.$message.error("超过16路码流播放了！");
      } else {
        this.operatorIndex = index;
        let item = this.videoArr[index];
        videos = Object.assign(item, videos);
        this.videoArr.splice(this.operatorIndex, 1, videos);
        // if (
        //   this.operatorIndex >= this.fenlu[this.fenluIndex] &&
        //   this.fenluIndex < 4
        // ) {
        //   this.chooseFenlu(this.fenluIndex + 1);
        // }
        // if (this.operatorIndex >= 16) {
        //   this.operatorIndex = 15;
        // }
      }
      console.log(this.videoArr);
    },
    backup(channelUuid, startTime, endTime, videoType, streamType) {
      return new Promise((resolve, reject) => {
        api2
          .backup(
            {
              channelUuid,
              startTime,
              endTime,
              videoType,
              projectUuid: this.projectUuid,
              streamType
            },
            {
              modelName: this.moduleName,
              type: "录像回放",
              detailContent: `${this.orgName}-录像回放-${this.channelName}`
            }
          )
          .then(res => {
            let data = res.data.data;
            resolve(data);
          });
      });
    },
    setPlayTime(startTime, endTime) {
      this.playVideo(
        this.channelUuid,
        this.channelName,
        startTime,
        endTime,
        this.videoType,
        this.streamType
      );
    },
    download(time) {},
    // 录像播放跳转时间
    async choosetime(index = 0, chooseTime, endTime = "") {
      index = 0;
      // eslint-disable-next-line
      let { channelUuid, videoType, streamType } = this.videoArr[index];
      if (!endTime) {
        endTime = this.videoArr[this.operatorIndex].endTime;
      }
      let data = await this.backup(
        this.channelUuid,
        chooseTime,
        endTime,
        this.videoType,
        this.projectUuid,
        this.streamType
      );
      this.operatorIndex = index;
      this.videoArr[index].rtspUrl = data.rtspUrl;
      this.videoArr[index].playStatus = 1;
      this.videoArr.concat();
      console.log(`index=${index}  拖拽url=${data.rtspUrl}`);
      this.$refs["video" + index][0].drag(data.rtspUrl);
      this.getVideoSpeed();
    },
    saveView() {},
    stopVideo() {
      let item = this.videoArr[this.operatorIndex];
      item.bzRtspUrl = item.rtspUrl; // 备用的url
      item.rtspUrl = "";
      item.playStatus = 0;
      this.videoArr.splice(this.operatorIndex, 1, item);
    },
    videoSingleFrame() {},
    videoSpeedUp() {},
    videoSpeedDown() {},
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
      let item = this.videoArr[this.operatorIndex];
      item.rtspUrl = "";
      item.bzRtspUrl = "";
      item.channelUuid = "";
      item.startTime = "";
      item.endTime = "";
      item.playStatus = 0;
      item.timeData = [];
      this.videoArr.splice(this.operatorIndex, 1, item);
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
      let item = this.videoArr[index];
      item.isRecord = true;
      this.videoArr.splice(index, 1, item);

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
      let item = this.videoArr[index];
      item.isRecord = false;
      this.videoArr.splice(index, 1, item);
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
    dragstart() {},
    drop() {},
    showMenu(e, index) {
      console.log(e);
      // return;
      // this.operatorIndex = index;
      // this.getVideoSpeed();
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
          this.closeVideoAA(this.operatorIndex);
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
                item.timeData = [];
                item.playStatus = 0;
                return item;
              });
            })
            .catch(() => {});

          break;
        case "加速":
          if (!this.videoArr[this.operatorIndex].channelUuid) {
            this.$message.error("该分路上没有通道！");
          } else {
            this.videoSpeedUp();
          }
          break;
        case "减速":
          if (!this.videoArr[this.operatorIndex].channelUuid) {
            this.$message.error("该分路上没有通道！");
          } else {
            this.videoSpeedDown();
          }
          break;
        case "单帧":
          if (!this.videoArr[this.operatorIndex].channelUuid) {
            this.$message.error("该分路上没有通道！");
          } else {
            this.videoSingleFrame();
          }
          break;
        case "设置回放时间":
          if (!this.videoArr[this.operatorIndex].channelUuid) {
            this.$message.error("该分路上没有通道！");
          } else {
            this.setVideoTime();
          }
          break;
        case "切换至实时":
          if (!this.videoArr[this.operatorIndex].channelUuid) {
            this.$message.error("该分路上没有通道！");
          } else {
            this.swithlive(this.videoArr[this.operatorIndex].channelUuid);
          }
          break;
        case "摄像机信息":
          if (!this.videoArr[this.operatorIndex].channelUuid) {
            this.$message.error("该分路上没有通道！");
          } else {
            api2
              .getCameraInfo(this.videoArr[this.operatorIndex].operatorData.parentUuid, {
                channelUuid: this.videoArr[this.operatorIndex].channelUuid
              })
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
          // this.screenShotVisible = true;
          break;
        case "下载":
          this.download();
          break;
        case "开始录像":
          // this.jumpToPlayback();
          this.startRecord(this.operatorIndex);
          break;
        case "停止录像":
          this.stopRecord(this.operatorIndex);
          break;
        case "全屏":
          this.PreviewAreafullScreen();
          break;
        case "打开音频":
          this.openVideoVoice(this.operatorIndex);
          break;
        case "图像调节":
          if (!this.videoArr[this.operatorIndex].channelUuid) {
            this.$message.error("该分路上没有通道！");
          } else {
            this.imageAdjustVisible = true;
          }
          break;
      }
    },
    ClickViDeoA() {},
    pasueVideo() {
      console.log(this.videoArr[this.operatorIndex]);
      this.$refs["video" + this.operatorIndex][0].pause(
        this.videoArr[this.operatorIndex].playStatus
      );
      if (this.videoArr[this.operatorIndex].playStatus === 0) {
        if (this.videoArr[this.operatorIndex].bzRtspUrl) {
          // eslint-disable-next-lineniyeshi
          this.videoArr[this.operatorIndex].rtspUrl = this.videoArr[
            this.operatorIndex
          ].bzRtspUrl;
          this.videoArr[this.operatorIndex].playStatus = 1;
        } else {
          this.$message.error("该分路上面没有正在播放的视频");
        }
        return;
      } else if (this.videoArr[this.operatorIndex].playStatus === 1) {
        this.videoArr[this.operatorIndex].playStatus = 2;
      } else if (this.videoArr[this.operatorIndex].playStatus === 2) {
        this.videoArr[this.operatorIndex].playStatus = 1;
      }
      console.log(this.videoArr);
      this.videoArr.concat();
    },
    getPreviewInfoAA() {
      return new Promise(resolve => {
        api2.getPreviewInfoAA({asgName:this.projectUuid}).then(res => {
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
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getPreviewInfo();
        this.playVideo(
          this.channelUuid,
          this.channelName,
          this.startTime,
          this.endTime,
          this.videoType,
          this.streamType
        );
        // api2
        //   .backup({
        //     channelUuid: this.channelUuid,
        //     startTime: this.startTime,
        //     endTime: this.endTime,
        //     videoType: this.videoType,
        //     streamType: this.streamType
        //   })
        //   .then(res => {
        //     console.log(res);
        //   });
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
    // margin-top: 40px;
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
