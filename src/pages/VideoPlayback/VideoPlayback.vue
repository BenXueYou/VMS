<template>
  <div class='VideoPlaybackContent'>
    <left-content @playRtsp="playRtsp"
                  @updateView="updateView"
                  ref="leftTree"
                  @openView="openView"></left-content>
    <div class='right'
         ref='rigth'>
      <div class='vedioWrap'
           :class="{'fullVideoWrap':fullscreen}"
           ref='vedioWrap'>
        <video-wrap v-for="(item,index) in showFenlu"
                    :ref="'video'+index"
                    :key="index"
                    :index="index"
                    :isActive="operatorIndex===index"
                    :width="item.width"
                    :height="item.height"
                    :IsShowMenu="!!item.rtspUrl"
                    :rtspUrl="item.rtspUrl"
                    :streamType="item.streamType"
                    :left="item.left"
                    :top="item.top"
                    :playStatus="item.playStatus"
                    :mode="item.mode"
                    action="playback"
                    :position="item.position"
                    :fenlu="fenluIndex+1"
                    :isRecord="!!item.isRecord"
                    @closeVideo="closeVideoAA"
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
      <div class="footer"
           v-if="!fullscreen">
        <control-panel @download="download"
                       @saveView="saveView"
                       @choosetime="choosetime"
                       @play="pasueVideo"
                       @stop="stopVideo"
                       @singleFrame="videoSingleFrame"
                       @speedUp="videoSpeedUp"
                       @slowDown="videoSpeedDown"
                       @PreviewAreafullScreen="PreviewAreafullScreen"
                       @chooseFenlu="chooseFenlu"
                       @changeMode="changeMode"
                       :downloadStatus="downloadStatus"
                       :playStatus="playStatus"
                       :mode="videoMode"
                       :speed="videoSpeed"
                       :operatorIndex.sync="operatorIndex"
                       :fenlu="fenlu"
                       :fenlnWW="fenluIndex"
                       :data="oneRoad">

        </control-panel>
      </div>
    </div>
    <video-info-Dialog title="摄像机信息"
                       :videoinfo="videoinfo"
                       :visible.sync="videoInfoVisible"></video-info-Dialog>
    <image-adjust-dialog title="画面调节"
                         :visible.sync="imageAdjustVisible">
    </image-adjust-dialog>
    <screenshot-dialog :visible.sync="screenShotVisible">

    </screenshot-dialog>
    <download-dialog :visible.sync="downloadVisible"
                     @shutdownVideo="stopVideo"
                     :tableData="downloadData"></download-dialog>
    <local-broadcast-dialog :visible.sync="showBroadCastVisible"></local-broadcast-dialog>
    <tree-append-tag-dialog @confirm="addView"
                            title="添加视图"
                            labelName="视图名称"
                            :visible.sync="appendViewVisible"></tree-append-tag-dialog>
    <set-play-time-dialog :visible.sync="setTimeVisible"
                          @confirm="setPlayTime"></set-play-time-dialog>
  </div>
</template>

<script>
import LeftContent from "./views/Left";
import TreeAppendTagDialog from "@/common/TreeAppendTagDialog";
import VideoWrap from "@/pages/VideoPreview/components/video";
import ControlPanel from "@/pages/VideoPlayback/components/ControlPanel";
import videoInfoDialog from "@/pages/VideoPreview/components/videoInfoDialog";
import imageAdjustDialog from "@/pages/VideoPreview/components/imageAdjustDialog";
import screenshotDialog from "@/pages/VideoPreview/components/screenshotDialog";
import downloadDialog from "@/pages/VideoPlayback/components/downloadDialog";
import localBroadcastDialog from "@/pages/VideoPlayback/components/localBroadcastDialog";
import setPlayTimeDialog from "@/pages/VideoPlayback/components/setPlayTimeDialog";

import icons from "@/common/icon.js";
import * as api from "@/pages/equipmentMange/ajax.js";
import * as api2 from "@/pages/VideoPreview/ajax.js";

export default {
  name: "VideoPreview",
  components: {
    LeftContent,
    VideoWrap,
    TreeAppendTagDialog,
    videoInfoDialog,
    imageAdjustDialog,
    screenshotDialog,
    ControlPanel,
    downloadDialog,
    setPlayTimeDialog,
    localBroadcastDialog
  },
  data() {
    return {
      startTime: "2019-11-19 00:00:00",
      endTime: "2019-11-19 23:59:59",
      videoSpeed: 1,
      videoinfo: {},
      appendViewVisible: false,
      showBroadCastVisible: false,
      setTimeVisible: false,
      controlData: new Array(4).fill({
        fileName: "",
        timeData: []
      }),
      downloadVisible: false,
      screenShotVisible: false,
      fullscreen: false,
      videoInfoVisible: false,
      imageAdjustVisible: false,
      videoArr: Array.from({ length: 16 }, (item, index) => {
        item = {
          width: 0,
          height: 0,
          rtspUrl: "",
          position: index,
          fileName: "测试文件名字1",
          // startTime: "2019-11-19 00:00:00",
          // endTime: "2019-11-19 23:59:59",
          startTime: "",
          endTime: "",
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
      }),
      icons,
      fenlu: [1, 4, 8, 9, 16],
      fenluIndex: 0,
      operatorIndex: 0,
      videoWidth: 0,
      videoHeight: 0,
      timer: null,
      cnt: 0,
      downloadData: [],
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
      ]
    };
  },
  computed: {
    downloadStatus() {
      if (!this.showFenlu.length) {
        return "下载";
      }
      if (this.showFenlu[0].isRecord) {
        return "停止下载";
      } else {
        return "下载";
      }
    },
    showFenlu() {
      if (this.operatorIndex >= this.videoArr.length) {
        return [];
      }
      return this.videoArr.slice(0, this.fenlu[this.fenluIndex]);
    },
    oneRoad() {
      if (this.operatorIndex >= this.videoArr.length) {
        return [];
      }
      let data = [this.videoArr[this.operatorIndex]];
      data[0].myIndex = this.operatorIndex;
      return data;
    },
    videoMode() {
      if (this.operatorIndex >= this.videoArr.length) {
        return "original";
      }
      return this.videoArr[this.operatorIndex].mode;
    },
    playStatus() {
      if (this.operatorIndex >= this.videoArr.length) {
        return 0;
      }
      // 视频处于播放还是暂停状态
      return Number(this.videoArr[this.operatorIndex].playStatus);
    }
  },
  mounted() {
    this.jugdeJump();
    this.$nextTick(() => {
      this.chooseFenlu(1);
    });
    window.addEventListener("resize", this.initWrapDom);
    const that = this;
    window.onresize = function() {
      that.jishi();
    };
  },
  activated() {
    this.$nextTick(() => {
      let data = JSON.parse(JSON.stringify(this.videoArr));
      this.videoArr = [];
      setTimeout(() => {
        this.videoArr = data;
      }, 0);
      this.initWrapDom();
    });
  },
  destroyed() {
    // clearInterval(this.timer);
    // this.timer = null;
    // window.onresize = null;
  },
  methods: {
    changeMode(mode) {
      this.videoArr[this.operatorIndex].mode = mode;
      this.videoArr.concat();
    },
    jishi() {
      const that = this;
      // 下面的定时器是为了刷新页面的每个video框，
      this.timer = setInterval(() => {
        if (
          this.$route.fullPath.toLocaleLowerCase().indexOf("videoplayback") ===
          -1
        ) {
          return;
        }
        if (this.fullscreen) {
          this.fullscreen = this.checkFull();
        }
        that.initWrapDom();
      }, 100);
    },
    checkFull() {
      return (
        window.innerHeight === window.screen.height &&
        window.innerWidth === window.screen.width
      );
    },
    setPlayTime(startTime, endTime) {
      // 设置回放时间
      this.choosetime(this.operatorIndex, startTime, endTime);
      // this.$refs["video" + this.operatorIndex][0].setPlayTime(
      //   startTime,
      //   endTime
      // );
    },
    closeVideo(index) {
      this.videoArr[index].rtspUrl = "";
      this.videoArr[index].streamType = "";
      this.videoArr[index].channelUuid = "";
    },
    openVideo() {},
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
    dragstart(index, e) {
      // 拖拽开始

      console.log("dragstart:" + index);
      this.dragStartIndex = index;
    },
    drop(index, e) {
      // 拖拽结束
      console.log("drop:" + index);
      console.log(this.videoArr);
      this.dragEndIndex = index;

      // 这里用于切换两个视频的拖拽交换逻辑,dragstart记录拖拽的是哪个,drop用于记录放在哪个上面
      // 这里直接修改数组中的url来达到视频交换的效果。这样会重新停止并且重新播放视频
      // 优化，每个video的位置应该是fixed，这样交换两个video的postiion就可以了。
      // [this.videoArr[this.dragStartIndex], this.videoArr[this.dragEndIndex]] = [
      //   this.videoArr[this.dragEndIndex],
      //   this.videoArr[this.dragStartIndex]
      // ];
      // 优化之后的写法
      [
        this.videoArr[this.dragStartIndex].position,
        this.videoArr[this.dragEndIndex].position
      ] = [
        this.videoArr[this.dragEndIndex].position,
        this.videoArr[this.dragStartIndex].position
      ];
      this.videoArr.concat();
      this.initWrapDom();
      this.dragStartIndex = -1;
      console.log(this.videoArr);
    },
    jugdeJump() {
      console.log(this.$route);
      // 判断$route有没有channelUuid，有表示是跳转过来播放视频的
      if (
        this.$route.params.channelUuid &&
        this.$route.path === "/VideoPlayback"
      ) {
        this.jumpVideo(
          this.$route.params.channelUuid,
          this.$route.params.channelName
        );
      }
    },
    jumpVideo(id, name) {
      let d = new Date();
      let ymd = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      let hms = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      this.$refs.leftTree.setKeys(id);
      this.playVideo(
        id,
        name,
        ymd + " 00:00:00",
        ymd + " " + hms,
        "normal_vod",
        "main"
      );
    },
    // 录像播放跳转时间
    async choosetime(index, chooseTime, endTime = "") {
      // eslint-disable-next-line
      let { channelUuid, videoType, streamType } = this.videoArr[index];
      if (!endTime) {
        endTime = this.videoArr[this.operatorIndex].endTime;
      }
      let data = await this.backup(
        channelUuid,
        chooseTime,
        endTime,
        videoType,
        streamType
      );
      this.operatorIndex = index;
      this.videoArr[index].rtspUrl = data.rtspUrl;
      this.videoArr[index].playStatus = 1;
      this.videoArr.concat();
      console.log(`index=${index}  拖拽url=${data.rtspUrl}`);
      this.$refs["video" + index][0].drag(data.rtspUrl);
      this.getVideoSpeed();
    },
    updateView(viewData) {
      api2.updateView(viewData).then(res => {
        if (res.data.success) {
          this.$message.success("保存成功！");
        } else {
          this.$message.error(res.data.msg);
        }
        // 更新视图树结构
        this.$refs.leftTree.getViewTree();
      });
    },
    openView(data) {
      // 打开视图之后，默认选中第一分路的视频
      this.operatorIndex = 0;
      let newdata = JSON.parse(JSON.stringify(data));
      // let elements = newdata.elements.map((item, index) => {
      //   item.position = index;
      //   item.mode = "original";
      //   item.playStatus = 1;
      //   return item;
      // });
      let extra = newdata.extra || {};
      let videoArr = extra.videoArr || [];
      this.videoArr = videoArr;
      // for (let i = 0, len = elements.length; i < len; i++) {
      //   this.videoArr[i] = elements[i];
      //   if (videoArr.length) {
      //     this.videoArr[i].timeData = videoArr[i].timeData;
      //     this.videoArr[i].fileName = videoArr[i].fileName;
      //   }
      // }
      console.log(this.videoArr);
      this.videoArr.concat();
      this.fenluIndex = data.colTotal - 1;
      this.initWrapDom();
    },
    addView(name) {
      // 保存视图
      console.log(this.videoArr);
      let elements = this.videoArr.map(item => {
        return {
          position: {
            // 元素位置
            row: 0, // 行索引
            col: 0 // 列索引
          },
          channelUuid: item.channelUuid, // 通道uuid
          rtspUrl: item.rtspUrl, // rtsp rtspUrl
          streamType: item.streamType,
          timeData: item.timeData // 流类型
        };
      });
      // 存储每个视频分路的名字
      let extra = {};
      extra.videoArr = this.videoArr;
      console.log(JSON.stringify(extra));
      let data = {
        viewType: "playback", // 视图类型
        viewInfo: {
          view_name: name // 视图名称
        },
        rowTotal: this.fenluIndex + 1, // 行总数
        colTotal: this.fenluIndex + 1, // 列总数
        elements,
        videoRadio: {
          // 视频比例
          width: 0, // 宽度
          height: 0 // 高度
        },
        parentUuid: "", // 父节点uuid
        extra // 存储一些自己的格外节点
      };

      api2.addView(data).then(res => {
        if (res.data.success) {
          this.$message.success("保存视图成功！");
        } else {
          this.$message.error(res.data.msg);
        }
        this.$refs.leftTree.getViewTree();
      });
    },
    saveView() {
      this.appendViewVisible = true;
    },
    playRtsp(arr, sd, ed, videoType, streamType) {
      // this.startTime = sd;
      // this.endTime = ed;
      // 播放rtsp,传过来的可能是多个通道id
      for (let i = 0; i < arr.length; i++) {
        // nodeType: "chnNode"
        // 判断传过来的数据，类型是不是通道
        if (
          arr[i].nodeType === "chnNode" ||
          arr[i].hasOwnProperty("channelType")
        ) {
          this.playVideo(
            arr[i].id || arr[i].channelUuid,
            arr[i].label,
            sd,
            ed,
            videoType,
            streamType,
            i === 0
          );
        }
      }
    },
    async playVideo(id, channelName, sd, ed, videoType, streamType, isFrist) {
      let data = await this.backup(id, sd, ed, videoType, streamType);
      // videos是录像的信息，现在将这些放倒控制面板中
      // {
      //       "rtspUrl" : "string", // 回放RtspUrl
      //       "localId": "string", // 本地流媒体服务智能组件id
      //       "videos":
      //           [
      //               {
      //                   "fileName":"string", //文件名
      //                   "startTime":"string", // 开始时间（yyyy-MM-dd hh:mm:ss），必填
      //                   "endTime":"string", // 结束时间（yyyy-MM-dd hh:mm:ss），必填
      //                   "videoType":"string", // 录像类型，必填
      //                   "streamType":"string"	// 码流类型
      //               }
      //           ]
      //   }
      // 处理数据
      console.log(data);
      let videos = {};
      // let timeData = videos.map(item => {
      //   let startTime = item.startTime.split(" ")[1];
      //   let endTime = item.endTime.split(" ")[1];
      //   if (sd.split(" ")[0] !== item.startTime.split(" ")[0]) {
      //     // 返回来的第一个时间为前一天
      //     startTime = "00:00:00";
      //   }
      //   if (ed.split(" ")[0] !== item.endTime.split(" ")[0]) {
      //     // 返回来的第一个时间为前一天
      //     endTime = "24:00:00";
      //   }
      //   return {
      //     startTime,
      //     endTime,
      //     videoType: item.videoType,
      //     fileName: item.fileName
      //   };
      // });
      // console.log(timeData);
      // if(timeData.length){
      //   // 如果没有时间段，则表示没有录像
      //   this.$messge.error('该通道')
      //   return ;
      // }
      // 回放码流地址后面需要添加开始时间
      let rtspUrl = data.rtspUrl;
      // if(rtspUrl.indexOf("?"))
      // if (timeData.length) {
      //   rtspUrl += "?starttime=" + sd.split(" ")[0] + timeData[0].startTime;
      // }
      // 模拟数据
      data.videos = data.videos || [];
      videos = {
        fileName: channelName, // 文件名
        videoType: videoType, // 录像类型，必填
        streamType, // 码流类型
        rtspUrl,
        startTime: sd,
        endTime: ed,
        channelUuid: id,
        timeData: data.videos,
        playStatus: 1
      };
      // 从选中的框开始播放
      // 往后面放的时候，还要判断后面的框是不是在放
      let index = -1;
      if (isFrist) {
        for (let i = this.operatorIndex; i < 16; i++) {
          if (!this.videoArr[i].rtspUrl) {
            index = i;
            break;
          }
        }
      } else {
        index = this.operatorIndex;
      }
      console.log(index);
      if (index === -1) {
        // 说明后面没有格子可以播放了，则提示用户
        this.$message.error("超过16路码流播放了！");
      } else {
        this.operatorIndex = index;
        let item = this.videoArr[index];
        videos = Object.assign(item, videos);
        this.videoArr.splice(this.operatorIndex++, 1, videos);
        if (
          this.operatorIndex >= this.fenlu[this.fenluIndex] &&
          this.fenluIndex < 4
        ) {
          this.chooseFenlu(this.fenluIndex + 1);
        }
        if (this.operatorIndex >= 16) {
          this.operatorIndex = 15;
        }
      }
      console.log(this.videoArr);
    },
    records(channelUuid, startTime, endTime, videoType, streamType) {
      return new Promise((resolve, reject) => {
        api2
          .records({
            channelUuid,
            startTime,
            endTime,
            videoType,
            streamType
          })
          .then(res => {
            console.log(res);
            // let data = res.data.data;
            // let videos = (data && data.videos) || [] || [];
            resolve(res.data.data);
          })
          .catch(() => {
            resolve([]);
          });
      });
    },
    backup(channelUuid, startTime, endTime, videoType, streamType) {
      return new Promise((resolve, reject) => {
        api2
          .backup({
            channelUuid,
            startTime,
            endTime,
            videoType,
            streamType
          })
          .then(res => {
            let data = res.data.data;
            resolve(data);
          });
      });
    },
    initWrapDom() {
      let vedioWrapDom = this.$refs.vedioWrap;
      if (!vedioWrapDom) {
        return;
      }
      let fen = 1,
        fenlu = this.fenlu[this.fenluIndex];
      if (fenlu === 8) {
        fen = 3;
      } else {
        fen = Math.sqrt(fenlu);
      }
      let videoWrapWidth = vedioWrapDom.clientWidth,
        videoWrapHeight = vedioWrapDom.clientHeight;
      this.videoWidth = Math.floor((videoWrapWidth - 1) / fen);
      this.videoHeight = Math.floor((videoWrapHeight - 1) / fen);
      let data = JSON.parse(JSON.stringify(this.videoArr));
      this.videoArr = data.map((item, index) => {
        if (index !== this.isAutoScreen) {
          item.width = this.videoWidth;
          item.height = this.videoHeight;
          item.left = (item.position % fen) * item.width;
          item.top = Math.floor(item.position / fen) * item.height;
        }
        // 这里8分路视频的布局不是等分的，所以需要不同的计算方式
        // 中间一个大视频，围绕7个小视频，默认中间大视频的宽高占比70%;
        if (fenlu === 8) {
          let percent = 0.75;
          if (item.position === 0) {
            item.width = videoWrapWidth * percent;
            // item.height = ~~((videoWrapHeight * 9) / 16);
            item.height = videoWrapHeight * percent;
            item.left = 0;
            item.top = 0;
          } else {
            item.width = videoWrapWidth * (1 - percent);
            // item.height = ~~((item.width * 9) / 16);
            item.height = videoWrapHeight * (1 - percent);
            if (item.position < 5) {
              item.left = videoWrapWidth * percent;
              item.top = ~~(
                videoWrapHeight *
                (1 - percent) *
                (item.position - 1)
              );
            } else {
              item.left = (item.position - 5) * item.width;
              item.top = videoWrapHeight - item.height;
            }
          }
        }
        return item;
      });
      // console.log(this.videoArr);
    },
    chooseFenlu(index) {
      console.log(index);
      this.fenluIndex = index;
      this.initWrapDom();
      let dataArr = JSON.parse(JSON.stringify(this.videoArr));
      dataArr.sort((a, b) => {
        return a.position - b.position;
      });
      this.videoArr = dataArr;
      // 切换分路，还需要保留之前已经打开的视频画面

      // let num = Array.from(
      //   { length: this.fenlu[this.fenluIndex] },
      //   (item, index) => {
      //     item = { rtspUrl: "", position: index };
      //     if (this.videoArr[index] && this.videoArr[index].rtspUrl) {
      //       item = this.videoArr[index];
      //     }
      //     return item;
      //   }
      // );
      // this.videoArr = num;
      // console.log(num);
    },
    ClickViDeoA(index) {
      this.operatorIndex = index;
      this.getVideoSpeed();
    },
    showMenu(e, index) {
      console.log(e);
      this.operatorIndex = index;
      this.getVideoSpeed();
      const _this = this;
      e.preventDefault();
      this.$ContextMenu({
        data: this.menuData,
        event: e,
        target: this.$refs.vedioWrap,
        callback(value) {
          // value表示点击按钮的value
          _this.dealContextMenu(value);
        }
      });
    },
    closeVideoAA(index) {
      if (index !== undefined) {
        this.operatorIndex = index;
      }
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
            this.shutdownVideo();
          })
          .catch(() => {});
      }
    },
    shutdownVideo() {
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
              .getCameraInfo({
                channelUuid: this.videoArr[this.operatorIndex].channelUuid
              })
              .then(res => {
                /* eslint-disable */
                let data = res.data.data || {};
                let channelTyepCN =
                  JSON.parse(localStorage.getItem("localEnums"))["chn"][
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
    startRecord(index) {
      if (!this.videoArr[index].channelUuid) {
        this.$message.error("该分路上没有播放的视频");
        return;
      }
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
      if (!this.videoArr[index].channelUuid) {
        this.$message.error("该分路上没有播放的视频");
        return;
      }
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
    openVideoVoice(index) {},
    getVideoSpeed() {
      this.videoSpeed = this.$refs["video" + this.operatorIndex][0].speed;
      console.log(this.videoSpeed);
    },
    videoSpeedUp() {
      this.$refs["video" + this.operatorIndex][0].speedUp();
      this.getVideoSpeed();
    },
    videoSpeedDown() {
      this.$refs["video" + this.operatorIndex][0].slowDown();
      this.getVideoSpeed();
    },
    pasueVideo() {
      if (this.videoArr[this.operatorIndex].playStatus === 0) {
        if (this.videoArr[this.operatorIndex].bzRtspUrl) {
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
      this.$refs["video" + this.operatorIndex][0].pause();
      this.videoArr.concat();
    },
    stopVideo() {
      let item = this.videoArr[this.operatorIndex];
      item.bzRtspUrl = item.rtspUrl; // 备用的url
      item.rtspUrl = "";
      item.playStatus = 0;
      this.videoArr.splice(this.operatorIndex, 1, item);
    },
    videoSingleFrame() {
      this.$refs["video" + this.operatorIndex][0].singleFrame();
    },
    setVideoTime() {
      this.setTimeVisible = true;
    },
    swithlive(channelUuid) {
      this.$store.dispatch("addTagViewItem", {
        icon: "VideoPreview",
        name: "VideoPreview",
        title: "视频预览",
        type: "config",
        path: "/VideoPreview"
      });
      this.$store.dispatch("setLocalTag", "VideoPreview");
      this.$bus.$emit("setLocalTag", "VideoPreview");
      this.$router.push({
        name: "VideoPreview",
        params: { channelUuid }
      });
    },
    getFormatTime(t) {
      const change = t => {
        return ("0" + t).slice(-2);
      };
      const d = new Date(t);
      let year = d.getFullYear();
      let month = change(d.getMonth() + 1);
      let day = change(d.getDate());
      let hour = change(d.getHours());
      let minute = change(d.getMinutes());
      let second = change(d.getSeconds());
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    getDeviceInfoByChannel(channelUuid) {
      return new Promise(resolve => {
        api.getDeviceInfoByChannel(channelUuid).then(res => {
          console.log(res);
          if (res.data.success) {
            resolve(res.data.data.deviceType);
          }
        });
      });
    },
    async download() {
      if (!this.videoArr[this.operatorIndex].rtspUrl) {
        this.$message.error("该分路上没有通道！");
        return;
      }
      console.log(this.videoArr[this.operatorIndex]);
      //
      let { fileName, channelUuid, streamType, videoType } = this.videoArr[
        this.operatorIndex
      ];
      let deviceType = await this.getDeviceInfoByChannel(channelUuid);
      let timeData = (this.videoArr[this.operatorIndex].timeData || []).map(
        item => {
          item.deviceType = deviceType;
          item.streamType = streamType;
          item.videoType = videoType;
          item.devicename = fileName;
          item.channelUuid = channelUuid;
          item.videoPeriod = `${item.startTime} ${item.endTime}`;
          item.progress = 0;
          item.status = "done";
          item.taskAddTime = this.getFormatTime(new Date().getTime());
          return item;
        }
      );
      this.downloadData = timeData;
      console.log(this.downloadData);
      // 下载
      this.downloadVisible = true;
      // if (this.videoArr[this.operatorIndex].isRecord) {
      //   this.startRecord(this.operatorIndex);
      // } else {
      //   this.stopRecord(this.operatorIndex);
      // }
    },
    switchMaLiu(index, streamType) {
      if (!this.videoArr[index].rtspUrl) {
        this.$message.error("该分路没有视频在播放，切换失败！");
        return;
      }
      this.videoArr[index].streamType = streamType;
      this.videoArr.concat();
    },
    PreviewAreafullScreen() {
      // this.setFullScreen(this.$refs.vedioWrap);
      var element = document.documentElement;
      this.initWrapDom();
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
    }
  },
  watch: {
    "$route.path": function(newVal, oldVal) {
      // 监听路由，查看params是否携带参数rtsp，从而判断是否跳转播放码流
      this.jugdeJump();
      if (
        this.$route.fullPath.toLocaleLowerCase().indexOf("/videoplayback") !==
        -1
      ) {
        clearInterval(this.timer);
      }
    }
  }
};
</script>
<style lang="scss">
// .el-tree-node {
//   overflow: auto !important;
// }
.isCloseDialog {
  .el-message-box__btns {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    button {
      margin-right: 30px;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.VideoPlaybackContent {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;

  .right {
    width: calc(100% - 220px);
    height: 100%;
    // padding: 2px 0px;
    // padding-top: 2px;
    padding: 0px;
    box-sizing: border-box;
    user-select: none;
    box-sizing: border-box;
    .vedioWrap {
      height: calc(100% - 120px);
      position: relative;
    }
    .footer {
      height: 120px;
      // padding-top: 4px;
      display: flex;
      justify-content: space-between;
      .operator {
        .button {
          background: rgba(40, 255, 187, 0.2);
          border: 0 solid rgba(38, 211, 157, 0.8);
          border-radius: 2px;
          vertical-align: middle;
          cursor: pointer;
        }
      }
      .fenlu {
        ul {
          list-style: none;
          display: flex;
          justify-content: space-around;
          li {
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background-color: rgba(255, 255, 255, 0.151);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 3px;
            @include font-s;
            cursor: pointer;
            margin-right: 10px;
          }
          .active {
            opacity: 0.8;
            background: rgba(40, 255, 187, 0.15);
            border: 1px solid rgba(32, 204, 150, 0.8);
          }
        }
      }
    }
  }
  .fullVideoWrap {
    position: fixed !important;
    padding: 0px !important;
    margin: 0px !important;
    left: 0px !important;
    top: 0px !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 10 !important;
  }
}
</style>
