<template>
  <div class='VideoPlaybackContent'>
    <left-content></left-content>
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
                    @contextmenu="showMenu"
                    @click="ClickViDeoA(index)">
        </video-wrap>
      </div>
      <div class="footer">
        <control-panel @download="download">

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
  </div>
</template>

<script>
import LeftContent from "./views/Left";
import VideoWrap from "@/pages/VideoPreview/components/video";
import ControlPanel from "@/pages/VideoPlayback/components/ControlPanel";
import videoInfoDialog from "@/pages/VideoPreview/components/videoInfoDialog";
import imageAdjustDialog from "@/pages/VideoPreview/components/imageAdjustDialog";
import screenshotDialog from "@/pages/VideoPreview/components/screenshotDialog";
import downloadDialog from "@/pages/VideoPlayback/components/downloadDialog";
import localBroadcastDialog from "@/pages/VideoPlayback/components/localBroadcastDialog";

import icons from "@/common/icon.js";

export default {
  name: "VideoPreview",
  components: {
    LeftContent,
    VideoWrap,
    videoInfoDialog,
    imageAdjustDialog,
    screenshotDialog,
    ControlPanel,
    downloadDialog,
    localBroadcastDialog
  },
  data() {
    return {
      downloadVisible: false,
      screenShotVisible: false,
      videoInfoVisible: false,
      imageAdjustVisible: false,
      videoArr: [
        {
          url: "1" // 播放的视频 Url
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
      ]
    };
  },
  mounted() {
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
    download() {
      this.downloadVisible = true;
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
      this.videoArr = Array.from({ length: this.fenlu[this.fenluIndex] }).fill(
        {}
      );
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
        case "摄像机信息":
          this.videoInfoVisible = true;
          break;
        case "抓图":
          this.screenShotVisible = true;
          break;
        case "全屏":
          this.setFullScreen(this.$refs["video" + this.operatorIndex][0].$el);
          break;
        case "图像调节":
          this.imageAdjustVisible = true;
          break;
        default:
          break;
      }
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
      console.log(this.$route);
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
      display: flex;
      flex-wrap: wrap;
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
