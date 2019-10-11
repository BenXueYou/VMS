<template>
  <div class='VideoPreviewContent'>
    <left-content orgType="device"
                  needType=""
                  tagType="device"
                  ref='testTree'
                  @playRtsp="playRtsp"
                  @jumpToPlayback="jumpToPlayback"
                  @ctrl="ctrl"
                  @changetab="changetab"
                  @clickNode="clickNode"
                  :deviceUuid="deviceUuid"></left-content>
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
                    :rtspUrl="item.url"
                    :IsShowMenu="!!item.url"
                    @dragstart="dragstart(index)"
                    @drop="drop(index)"
                    @contextmenu="showMenu"
                    @click="ClickViDeoA(index)">
        </video-wrap>
      </div>
      <div class="footer">
        <div class="fenlu">
          <ul>
            <li v-for="(item,index) in fenlu"
                :class="{active:fenluIndex===index}"
                @click="chooseFenlu(index)"
                :key="index">
              {{item}}</li>
          </ul>
        </div>
        <div class="operator">
          <gt-button class='
                    button'
                     :showClose="false">保存视图</gt-button>
          <gt-button class='button'
                     :icon="icons.fullScreen"
                     @click="PreviewAreafullScreen"
                     :showClose="false"
                     :showText="false"></gt-button>
        </div>
      </div>
    </div>
    <video-info-Dialog title="摄像机信息"
                       :visible.sync="videoInfoVisible"></video-info-Dialog>
    <image-adjust-dialog title="画面调节"
                         :visible.sync="imageAdjustVisible">
    </image-adjust-dialog>
    <screenshot-dialog :visible.sync="screenShotVisible"
                       :src="src">

    </screenshot-dialog>
  </div>
</template>

<script>
import LeftContent from "./views/Left";
import VideoWrap from "@/pages/VideoPreview/components/video";
import videoInfoDialog from "@/pages/VideoPreview/components/videoInfoDialog";
import imageAdjustDialog from "@/pages/VideoPreview/components/imageAdjustDialog";
import screenshotDialog from "@/pages/VideoPreview/components/screenshotDialog";
// import * as api from "@/pages/equipmentMange/ajax.js";
import * as api2 from "@/pages/VideoPreview/ajax.js";

import icons from "@/common/icon.js";

export default {
  name: "VideoPreview",
  components: {
    LeftContent,
    VideoWrap,
    videoInfoDialog,
    imageAdjustDialog,
    screenshotDialog,
    tabName: ""
  },
  data() {
    return {
      deviceUuid: "", // 正在操作的通道设备的uuid
      screenShotVisible: false,
      videoInfoVisible: false,
      imageAdjustVisible: false,
      videoArr: [
        {
          url: "test" // 播放的视频 Url
        }
      ],
      icons,
      fenlu: [1, 4, 9, 16, 25, 36],
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
              label: "三码流",
              value: "三码流"
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
      src: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initWrapDom();
    });
    window.addEventListener(
      "resize",
      this.$common.throttle(this.initWrapDom, 300, { trailing: false })
    );
  },
  destroyed() {},
  methods: {
    playRtsp(channelUuid, streamType = "string", operator = -1) {
      // 请求码流地址从而进行播放
      // 两种情况，一种是新的视频播放，另一种是切换码流类型在进行播放
      api2
        .getPreviewInfo({
          channelUuid,
          streamType
        })
        .then(res => {
          console.log(res);
          // 这里会得到rtsp的码流地址，然后进行一些操作
        })
        .catch(err => {
          console.log(err);
          if (operator === -1) {
            this.playVideo(
              "rtsp://admin:a88888888@192.168.9.114/Streaming/Channels/102?transportmode=unicast",
              channelUuid
            );
          } else {
            this.videoArr[operator].url =
              "rtsp://admin:a88888888@192.168.9.114/Streaming/Channels/102?transportmode=unicast" +
              Math.random();
            this.videoArr.concat();
          }
        });
    },
    playVideo(url, channelUuid) {
      // 根据通道获取到了视频流地址，从而进行播放
      // 遍历videoArr数组，看哪个分路的url为空，则在上面播放
      for (let i = 0; i < this.videoArr.length; i++) {
        if (!this.videoArr[i].url) {
          this.videoArr[i].url = url;
          this.videoArr[i].channelUuid = channelUuid;
          break;
        }
      }
      this.videoArr.concat();
    },
    dragstart(index, e) {
      // 拖拽开始
      console.log("dragstart:" + index);
    },
    drop(index, e) {
      // 拖拽结束
      console.log("drop:" + index);
      // 这里用于切换两个视频的拖拽交换逻辑,dragstart记录拖拽的是哪个,drop用于记录放在哪个上面
    },
    clickNode(node) {
      console.log(node);
    },
    changetab(tab) {
      // 左边菜单的切换tab事件
      this.tabName = tab.name;
      console.log(tab);
    },
    initWrapDom() {
      let vedioWrapDom = this.$refs.vedioWrap;
      let fen = Math.sqrt(this.fenlu[this.fenluIndex]);
      this.videoWidth = Math.floor((vedioWrapDom.clientWidth - 1) / fen);
      this.videoHeight = Math.floor((vedioWrapDom.clientHeight - 1) / fen);
    },
    chooseFenlu(index) {
      this.fenluIndex = index;
      this.initWrapDom();
      // 切换分路，还需要保留之前已经打开的视频画面

      let num = Array.from(
        { length: this.fenlu[this.fenluIndex] },
        (item, index) => {
          item = { url: "" };
          if (this.videoArr[index]) {
            item = this.videoArr[index];
          }
          return item;
        }
      );
      this.videoArr = num;
      console.log(num);
    },
    // 控制云台
    ctrl(action, start, speed) {
      api2
        .ctrl({
          action, // 操作类型，必填
          start: "bool", // 开始/结束，必填
          speed: "int" // 速度，必填
        })
        .then(res => {
          console.log(res);
        });
    },
    ClickViDeoA(index) {
      // 选中哪个视频块
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
          // 清空url，则触发video组件stop事件
          this.videoArr[this.operatorIndex].url = "";
          this.videoArr.concat();
          break;
        case "关闭所有窗口":
          // 把所有分路的url都清空
          this.videoArr = this.videoArr.map(item => {
            item.url = "";
            return item;
          });
          break;
        case "摄像机信息":
          this.videoInfoVisible = true;
          break;
        case "抓图":
          this.screenShot();
          break;
        case "全屏":
          this.setFullScreen(this.$refs["video" + this.operatorIndex][0].$el);
          break;
        case "图像调节":
          this.imageAdjustVisible = true;
          break;
        case "开始录像":
          this.jumpToPlayback(this.videoArr[this.operatorIndex].channelUuid);
          break;
        case "主码流":
          this.switchMaLiu(this.operatorIndex, "main");
          break;
        case "辅码流":
          this.switchMaLiu(this.operatorIndex, "sub");
          break;
        case "三码流":
          this.switchMaLiu(this.operatorIndex, "thrid");
          break;
        default:
          break;
      }
    },
    screenShot() {
      // 抓图
      this.screenShotVisible = true;
      let canvas = this.$refs["video" + this.operatorIndex][0].canvas;
      console.log(canvas);
      var dataURL = canvas.toDataURL();
      console.log(dataURL);
      this.src = dataURL;
    },
    jumpToPlayback(channelUuid) {
      this.$router.push({
        name: "VideoPlayback",
        params: { channelUuid: "channelUuid" }
      });
    },
    switchMaLiu(index, streamType) {
      if (!this.videoArr[index].url) {
        this.$message.error("该分路没有视频在播放，切换失败！");
        return;
      }
      this.playRtsp(this.videoArr[index].channelUuid, streamType, index);
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
  }
};
</script>
<style lang="scss" scoped>
@import "@/style/variables.scss";
.VideoPreviewContent {
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
      height: calc(100% - 80px);
      display: flex;
      flex-wrap: wrap;
    }
    .footer {
      height: 60px;
      margin: 10px;
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
