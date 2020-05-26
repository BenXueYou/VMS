<template>
  <div class="videoWrap"
       ref="vedioWrap">
    <video-wrap v-for="(item,index) in showFenlu"
                :ref="'video'+index"
                :key="index"
                :index="index"
                :width="item.width"
                @fullscreen2="fullscreen2"
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
                :mode="item.mode"
                :IsShowAddIcon="true"
                @playRtsp="playRtsp"
                @click="ClickViDeoA(index)"
                @closeVideo="closeVideo"></video-wrap>
    <select-device-tree :visible.sync="showTree"
                        @playRtsp="playRtsp"></select-device-tree>
  </div>
</template>

<script>
import VideoWrap from "@/pages/VideoPreview/components/video";
import selectDeviceTree from "@/pages/schoolBoard/components/selectDeviceTree";
import * as api2 from "@/pages/VideoPreview/ajax.js";
import icons from "@/common/icon.js";
export default {
  name: "videoBox",
  components: {
    VideoWrap,
    selectDeviceTree
  },
  props: {
    fenluNumber: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  computed: {
    showFenlu() {
      let data = this.videoArr.slice(0, this.fenlu[this.fenluIndex]);
      // console.log(data);
      // console.log(this.fenluIndex);
      return data;
    },
    fenluIndex() {
      console.log(this.fenluNumber);
      if (this.fenluNumber === 1) {
        return 0;
      } else if (this.fenluNumber === 4) {
        return 1;
      } else if (this.fenluNumber === 9) {
        return 2;
      }
    }
  },
  data() {
    return {
      icons,
      showTree: false,
      fenlu: [1, 4, 9],
      operatorIndex: 0,
      videoWidth: 0,
      videoHeight: 0,
      videoArr: Array.from({ length: 9 }, (item, index) => {
        item = {
          width: 0,
          height: 0,
          rtspUrl: "",
          position: index,
          mode: "fullscreen"
        };
        return item;
      }),
      fullscreen: false,
      timer: null,
      ShowAuthDisabled: false,
      OwnAuthDisabled: false
    };
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.playRtsp("862062228CDD7288371713C6AEC2FE83", "main", {});
    // });
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("学校看板", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("学校看板", "isOwn");

    this.jishi();
    this.initDom();
    window.onresize = () => {
      this.initDom();
    };
  },
  methods: {
    checkFull() {
      return (
        window.innerHeight === window.screen.height &&
        window.innerWidth === window.screen.width
      );
    },
    jishi() {
      const that = this;
      // 下面的定时器是为了刷新页面的每个video框，
      this.timer = setInterval(() => {
        // if (
        //   this.$route.fullPath.toLocaleLowerCase().indexOf("videopreview") ===
        //   -1
        // ) {
        //   return;
        // }
        if (this.fullscreen) {
          this.fullscreen = this.checkFull();
        }
        that.initDom();
      }, 100);
    },
    ClickViDeoA(index) {
      // 没有查看权限则不让它显示视频播放
      if (!this.OwnAuthDisabled) {
        this.$message.warning("没有操作权限，无法观看视频");
        return;
      }
      if (this.showFenlu[index].rtspUrl) {
        this.$message.warning("请先关闭视频再选择");
        return;
      }
      this.operatorIndex = index;
      this.showTree = true;
    },
    initDom() {
      if (!this.$refs.vedioWrap) {
        return;
      }
      // console.log(this.$refs.vedioWrap.clientHeight);
      // console.log(this.$refs.vedioWrap.clientWidth);
      let vedioWrapDom = this.$refs.vedioWrap;
      let data = JSON.parse(JSON.stringify(this.videoArr));
      let videoWrapWidth = vedioWrapDom.clientWidth,
        videoWrapHeight = vedioWrapDom.clientHeight;
      let fen = Math.sqrt(this.fenlu[this.fenluIndex]);
      this.videoWidth = Math.floor((videoWrapWidth - 1) / fen);
      this.videoHeight = Math.floor((videoWrapHeight - 1) / fen);
      // console.log(this.videoWidth, this.videoHeight);
      this.videoArr = data.map((item, index) => {
        item.width = this.videoWidth;
        item.height = this.videoHeight;
        item.left = (item.position % fen) * item.width;
        item.top = Math.floor(item.position / fen) * item.height;

        return item;
      });
    },
    closeVideo(index) {
      this.operatorIndex = index;
      this.videoArr[index].rtspUrl = "";
      this.videoArr[index].streamType = "";
      this.videoArr[index].channelUuid = "";
    },
    setData(index, rtspUrl, channelUuid, streamType, operatorData) {
      this.videoArr[index].streamType = streamType;
      this.videoArr[index].operatorData = operatorData;
      this.videoArr[index].channelUuid = channelUuid;
      this.videoArr[index].rtspUrl = rtspUrl;
      this.videoArr.concat();
    },
    playVideo(rtspUrl, channelUuid, streamType, data) {
      this.setData(this.operatorIndex, rtspUrl, channelUuid, streamType, data);
    },
    playRtsp(
      channelUuid,
      streamType = "",
      adata,
      operator = -1,
      isDrag = false
    ) {
      console.log(streamType);
      // 这里做个判断，判断streamType是否为空，为空则判断是不是第一个播放，是则主码流，不是则辅码流
      // if (streamType === "") {
      //   let flag = !!this.videoArr.filter(item => {
      //     return item.rtspUrl !== "";
      //   }).length;
      //   streamType = flag ? "sub" : "main";
      // }
      if (this.operatorIndex === 0) {
        streamType = "main";
      } else {
        streamType = "sub";
      }
      // console.log(channelUuid, streamType, adata, operator);
      // 请求码流地址从而进行播放
      // 两种情况，一种是新的视频播放，另一种是切换码流类型在进行播放
      api2
        .getPreviewInfo({
          channelUuid,
          streamType
        })
        .then(res => {
          // console.log(res);
          let data = res.data.data;
          // 这里会得到rtsp的码流地址，然后进行一些操作,默认是主码流
          this.playVideo(data.rtspUrl, channelUuid, streamType, adata);
        })
        .catch(err => {
          console.log(err);
        });
    },
    fullscreen2(index) {
      this.setFullScreen(this.$refs.video0[index].getCanvas());
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
    },
  },
  watch: {
    fenluNumber(val) {
      console.log(val);
      this.initDom();
    }
  }
};
</script>

<style lang="scss" scoped>
.videoWrap {
  position: relative;
  height: 100%;
}
</style>
