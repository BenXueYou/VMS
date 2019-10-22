<template>
  <div class='VideoPlaybackContent'>
    <left-content @playRtsp="playRtsp"
                  @updateView="updateView"
                  ref="leftTree"
                  @openView="openView"></left-content>
    <div class='right'
         ref='rigth'>
      <div class='vedioWrap'
           ref='vedioWrap'>
        <video-wrap v-for="(item,index) in videoArr"
                    :ref="'video'+index"
                    :key="index"
                    :index="index"
                    :isActive="operatorIndex===index"
                    :width="videoWidth"
                    :height="videoHeight"
                    :IsShowMenu="!!item.url"
                    :rtspUrl="item.url"
                    :streamType="item.streamType"
                    action="playback"
                    :position="item.position"
                    :fenlu="fenluIndex+1"
                    @contextmenu="showMenu"
                    @click="ClickViDeoA(index)">
        </video-wrap>
      </div>
      <div class="footer">
        <control-panel @download="download"
                       @saveView="saveView"
                       @choosetime="choosetime"
                       @chooseFenlu="chooseFenlu"
                       :fenlu="fenlu"
                       :data="videoArr">

        </control-panel>
      </div>
    </div>
    <video-info-Dialog title="摄像机信息"
                       :visible.sync="videoInfoVisible"></video-info-Dialog>
    <image-adjust-dialog title="画面调节"
                         :visible.sync="imageAdjustVisible">
    </image-adjust-dialog>
    <screenshot-dialog :visible.sync="screenShotVisible">

    </screenshot-dialog>
    <download-dialog :visible.sync="downloadVisible"></download-dialog>
    <local-broadcast-dialog></local-broadcast-dialog>
    <tree-append-tag-dialog @confirm="addView"
                            title="添加视图"
                            labelName="视图名称"
                            :visible.sync="appendViewVisible"></tree-append-tag-dialog>
    <download-dialog :visible.sync="downloadVisible"></download-dialog>
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

import icons from "@/common/icon.js";
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
    localBroadcastDialog
  },
  data() {
    return {
      appendViewVisible: false,
      controlData: new Array(4).fill({
        fileName: "",
        timeData: []
      }),
      downloadVisible: false,
      screenShotVisible: false,
      videoInfoVisible: false,
      imageAdjustVisible: false,
      videoArr: [
        {
          position: 0, // 表示视频的位置，初始化的时候是从0-n的按顺序的，拖动之后position就会变化
          rtspUrl: "", // 播放的视频 Url
          streamType: "",
          fileName: "",
          timeData: []
        }
      ],
      icons,
      fenlu: [1, 4, 9, 16],
      fenluIndex: 0,
      operatorIndex: 0,
      videoWidth: 0,
      videoHeight: 0,
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
  mounted() {
    this.jugdeJump();
    this.$nextTick(() => {
      this.chooseFenlu(1);
    });
    window.addEventListener(
      "resize",
      this.$common.throttle(this.initWrapDom, 300, { trailing: false })
    );
  },
  destroyed() {},
  methods: {
    jugdeJump() {
      console.log(this.$route);
      // 判断$route有没有channelUuid，有表示是跳转过来播放视频的
      if (
        this.$route.params.channelUuid &&
        this.$route.path === "/VideoPlayback"
      ) {
        this.jumpVideo(this.$route.params.channelUuid);
      }
    },
    jumpVideo(id) {
      let d = new Date();
      let ymd = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay();
      let hms = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      this.playVideo(
        id,
        ymd + " 00:00:00",
        ymd + " " + hms,
        "normal_vod",
        "main"
      );
    },
    // 录像播放跳转时间
    choosetime(index, chooseTime) {
      this.videoArr[index].rtspUrl = this.controlData[index].rtspUrl;
      this.$refs["video" + index][0].drag(chooseTime);
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
      // 打开视图
      this.fenluIndex = data.colTotal - 1;
      this.initWrapDom();
      // 打开视图之后，默认选中第一分路的视频
      this.operatorIndex = 0;
      this.videoArr = data.elements;
    },
    addView(name) {
      // 保存视图
      let elements = this.videoArr.map(item => {
        return {
          position: {
            // 元素位置
            row: 0, // 行索引
            col: 0 // 列索引
          },
          channelUuid: item.channelUuid, // 通道uuid
          rtspUrl: item.rtspUrl, // rtsp rtspUrl
          streamType: item.streamType // 流类型
        };
      });
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
        parentUuid: "" // 父节点uuid
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
      // 播放rtsp,传过来的可能是多个通道id
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].h5Type === "channel") {
          this.playVideo(arr[i].id, sd, ed, videoType, streamType);
        }
      }
    },
    async playVideo(id, sd, ed, videoType, streamType) {
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
      let videos = data.videos;
      let timeData = videos.map(item => {
        return {
          date: item.startTime.split(" ")[0],
          startTime: item.startTime.split(" ")[1],
          endTime: item.endTime.split(" ")[1]
        };
      });
      console.log(timeData);
      // 模拟数据
      videos = {
        fileName: "string", // 文件名
        videoType: "string", // 录像类型，必填
        streamType: "string", // 码流类型
        rtspUrl: "",
        ymd: "", // 用于记录年月日
        timeData: [
          {
            startTime: "00:00:00",
            endTime: "02:00:00"
          },
          {
            startTime: "11:00:00",
            endTime: "13:00:00"
          },
          {
            startTime: "22:00:00",
            endTime: "24:00:00"
          }
        ]
      };
      for (let i = 0; i < this.videoArr.length; i++) {
        // 如果controlData哪个没有数据则找到它添加他
        if (!this.videoArr[i].rtspUrl) {
          this.videoArr.splice(i, 1, videos);
          break;
        }
      }
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
            resolve(data.rtspUrl);
          });
      });
    },
    initWrapDom() {
      let vedioWrapDom = this.$refs.vedioWrap;
      let fen = Math.sqrt(this.fenlu[this.fenluIndex]);
      this.videoWidth = Math.floor((vedioWrapDom.clientWidth - 1) / fen);
      this.videoHeight = Math.floor((vedioWrapDom.clientHeight - 1) / fen);
    },
    chooseFenlu(index) {
      console.log(index);
      this.fenluIndex = index;
      this.initWrapDom();
      // 切换分路，还需要保留之前已经打开的视频画面

      let num = Array.from(
        { length: this.fenlu[this.fenluIndex] },
        (item, index) => {
          item = { rtspUrl: "", position: index };
          if (this.videoArr[index] && this.videoArr[index].rtspUrl) {
            item = this.videoArr[index];
          }
          return item;
        }
      );
      this.videoArr = num;
      console.log(num);
    },
    ClickViDeoA(index) {
      this.operatorIndex = index;
    },
    showMenu(e, index) {
      console.log(e);
      this.operatorIndex = index;
      const _this = this;
      e.preventDefault();
      this.$ContextMenu({
        data: this.menuData,
        event: e,
        callback(value) {
          // value表示点击按钮的value
          _this.dealContextMenu(value);
        }
      });
    },
    // 处理
    dealContextMenu(value) {
      console.log(value);
      switch (value) {
        case "关闭窗口":
          // 清空rtspUrl，则触发video组件stop事件
          this.videoArr[this.operatorIndex].rtspUrl = "";
          this.videoArr.concat();
          break;
        case "关闭所有窗口":
          // 把所有分路的rtspUrl都清空
          this.videoArr = this.videoArr.map(item => {
            item.rtspUrl = "";
            return item;
          });
          break;
        case "加速":
          this.videoSpeedUp();
          break;
        case "减速":
          this.videoSpeedDown();
          break;
        case "单帧":
          this.videoSingleFrame();
          break;
        case "设置回访时间":
          this.setVideoTime();
          break;
        case "切换至实时":
          if (!this.videoArr[this.operatorIndex].channelUuid) {
            this.$message.error("该分路上没有通道！");
          } else {
            this.swithlive(this.videoArr[this.operatorIndex].channelUuid);
          }
          break;
        case "摄像机信息":
          this.videoInfoVisible = true;
          break;
        case "抓图":
          this.screenShotVisible = true;
          break;
        case "下载":
          this.download();
          break;
        case "全屏":
          this.setFullScreen(this.$refs["video" + this.operatorIndex][0].$el);
          break;
        case "图像调节":
          this.imageAdjustVisible = true;
          break;
      }
    },
    videoSpeedUp() {},
    videoSpeedDown() {},
    videoSingleFrame() {},
    setVideoTime() {},
    swithlive(channelUuid) {
      this.$router.push({
        name: "VideoPreview",
        params: { channelUuid }
      });
    },
    download() {
      this.downloadVisible = true;
    },
    switchMaLiu(index, streamType) {
      if (!this.videoArr[index].url) {
        this.$message.error("该分路没有视频在播放，切换失败！");
        return;
      }
      this.videoArr[index].streamType = streamType;
      this.videoArr.concat();
    },
    PreviewAreafullScreen() {
      this.setFullScreen(this.$refs.vedioWrap);
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
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/style/variables.scss";
.VideoPlaybackContent {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  .right {
    width: calc(100% - #{$equLeftMenuWidth});
    height: 100%;
    padding: $rightContentMargin;
    box-sizing: border-box;
    user-select: none;
    .vedioWrap {
      height: calc(100% - 240px);
      position: relative;
    }
    .footer {
      height: 240px;
      margin: 10px 0px 0px;
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
}
</style>
