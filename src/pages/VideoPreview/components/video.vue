<template>
  <div class='displayWrap'
       ref="displayWrap"
       @contextmenu="contextmenu"
       @click="ClickViDeoA"
       @dragstart="dragstart"
       @drop="drop"
       @dragover="dragover"
       @dblclick="dblclickhandler"
       draggable="true"
       :class="{'VideoActive':isActive,'isAutoScreen':isAutoScreen}"
       :style="{height:height+'px',width:width+'px',left:left+'px',top:top+'px'}">
    <!-- 视频信息展示菜单 -->
    <div class="header"
         v-if='IsShowMenu'>
      <div class="videoinfo">
        码流类型、码率、大小
      </div>
      <div class="menu"
           v-if="width>500">
        <ul>
          <li v-for="(item,index) in menuData"
              @click.stop='clickMenu(index)'
              :key='index'>
            <img :src="icons[item.icon]"
                 alt="">
            {{item.name}}</li>
        </ul>
      </div>
      <div class="menu"
           v-else>
        <el-dropdown style='margin:13px 30px 0px 0px;'
                     @command='clickMenu'
                     trigger="click">
          <span class="el-dropdown-link">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAAAXNSR0IArs4c6QAAAGxJREFUGBmlj7EJgEAQBPf8F+ENTBQMbEBsytRm7EQwF0sxMREzG/hbv4SD33h2YGTksRMywLACvDxQLSViY+ChwGfh8hhJDWtS9DaN3L6A24jYWg6Eey1cHiMTz1khnUUj0McrGAitLYfUEH75HhuBIHOOjAAAAABJRU5ErkJggg=="
                 alt="">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="index"
                              v-for="(item,index) in menuData"
                              :key='index'>{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 默认摄像头图片 -->
    <img class='camera'
         :src="icons.defaultIcon"
         v-show="!rtspUrl.length"
         alt="">
    <!-- <div class='tipsText'
         v-show="rtspUrl.length">
      码流请求中
    </div> -->
    <!-- 1 -->
    <div id='canvasWrap'
         ref='canvasRefs'>

    </div>
  </div>
</template>

<script>
import icons from "@/common/icon.js";
export default {
  name: "VideoWrap",
  props: {
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    fenlu: {
      type: Number
    },
    position: {
      type: Number
    },
    index: {
      type: Number
    },
    isActive: {
      type: Boolean
    },
    IsShowMenu: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isAutoScreen: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isRecord: {
      type: Boolean,
      default() {
        return false;
      }
    },
    rtspUrl: {
      type: String,
      default() {
        return "";
      }
    },
    action: {
      type: String,
      default() {
        return "preview";
      }
    },
    streamType: {
      type: String,
      default() {
        return "main";
      }
    }
  },
  data() {
    return {
      icons,
      menuData: [
        {
          icon: "voice",
          name: "声音"
        },
        {
          icon: "video",
          name: "录像"
        },
        {
          icon: "screenshot",
          name: "抓图"
        },
        {
          icon: "close",
          name: "关闭"
        }
      ],
      ip: "",
      port: "",
      video_mgr: null,
      canvas: null,
      video: null,
      video_list: [],
      speed: 1 // 视频播放速度
    };
  },
  computed: {
    left() {
      // console.log((this.index % this.fenlu) * this.width);
      if (this.isAutoScreen) {
        return 0;
      }
      return (this.position % this.fenlu) * this.width;
    },
    top() {
      if (this.isAutoScreen) {
        return 0;
      }
      // console.log((this.index % this.fenlu) * this.height);
      return Math.floor(this.position / this.fenlu) * this.height;
    }
  },
  mounted() {
    /* eslint-disable */
    this.video_mgr = new CVideoMgrSdk();
    if (this.rtspUrl) {
      setTimeout(() => {
        this.playVideo();
      }, 500);
    }
  },
  watch: {
    isRecord(val) {
      if (val) {
        this.menuData = [
          {
            icon: "voice",
            name: "声音"
          },
          {
            icon: "video",
            name: "停止录像"
          },
          {
            icon: "screenshot",
            name: "抓图"
          },
          {
            icon: "close",
            name: "关闭"
          }
        ];
      } else {
        this.menuData = [
          {
            icon: "voice",
            name: "声音"
          },
          {
            icon: "video",
            name: "录像"
          },
          {
            icon: "screenshot",
            name: "抓图"
          },
          {
            icon: "close",
            name: "关闭"
          }
        ];
      }
    },
    position(val) {
      console.log(val);
    },
    streamType(val) {
      // 码流切换，则先停掉，在重新播放
      // 判断是否在播放，在切换
    },
    width(val) {
      // 宽度变化 则更新canvas的大小
      if (this.width && this.canvas) {
        this.canvas.width = this.width;
        this.canvas.height = this.calcHeight;
      }
      // 宽度和高度变化，不需要重新播放
    },
    height(val) {
      if (this.height && this.canvas) {
        // this.canvas.height = this.calcHeight;
      }
    },
    rtspUrl(val) {
      console.log("码流的视频url改变了：   " + val);
      if (val) {
        // 播放之前判断是否已经在播放了，如果有则删除掉
        if (this.canvas) {
          this.stopVideo();
        }
        this.playVideo();
      } else {
        this.stopVideo();
      }
    }
  },
  methods: {
    async speedUp() {
      await this.video_mgr.speedControl(this.video, ++this.speed);
    },
    async slowDown() {
      if (this.speed <= 1) {
        return;
      }
      await this.video_mgr.speedControl(this.video, --this.speed);
    },
    async pause() {
      await this.video_mgr.pause(this.video);
    },
    async resume() {
      await this.video_mgr.resume(this.video);
    },
    async singleFrame() {},
    setPlayTime(startTime, endTime) {},
    dblclickhandler() {
      this.$emit("dblclickhandler", this.index);
    },
    record() {
      this.video_mgr.record(this.video);
    },
    stopRecord() {
      this.video_mgr.stopRecord(this.video);
    },
    getCanvas() {
      return this.canvas || this.$refs.displayWrap;
    },
    drag(start) {
      // 时间跳转
      // console.log(start);
      // if (!this.canvas) {
      //   this.playVideo();
      // }
      console.log(this.rtspUrl);
      console.log(this.drag);
      this.video_mgr.drag(this.video, start);
    },
    calcHeight() {
      // 这里让视频的宽高比是*16:9；
      // return this.height;
      return ~~((9 / 16) * this.width);
    },
    async playVideo() {
      this.canvas = document.createElement("canvas");
      this.canvas.width = this.width;
      this.canvas.height = this.calcHeight();
      let { jMedia, jSignal } = this.$store.getters;
      console.log(jMedia, jSignal);
      let w, h;
      if (this.streamType === "main") {
        w = 1920;
        h = 1080;
      } else if (this.streamType === "sub") {
        w = 704;
        h = 576;
      } else {
        w = 2560;
        h = 1440;
      }
      console.log(w, h);
      console.log("播放的url" + this.rtspUrl);
      console.log(this.action);
      this.video = await this.video_mgr.setup(
        JSON.stringify(jSignal),
        JSON.stringify(jMedia),
        this.rtspUrl,
        "rtsp",
        this.action,
        this.speed,
        this.canvas,
        w,
        h
      );
      if (this.video) {
        await this.video_mgr.play(this.video);
      }
      this.$refs.canvasRefs.appendChild(this.canvas);
    },
    stopVideo() {
      this.video_mgr.stop(this.video);
      if (this.canvas) {
        this.$refs.canvasRefs.removeChild(this.canvas);
        this.canvas = null;
      }
    },
    dragstart(e) {
      e.dataTransfer.setData("whereform", "video");
      this.$emit("dragstart", this.index, e);
    },
    drop(e) {
      console.log(e);
      let whereform = e.dataTransfer.getData("whereform");
      console.log(whereform);
      if (whereform === "tree") {
        let operatorData = JSON.parse(e.dataTransfer.getData("operatorData"));
        let channelUuid = operatorData.id;
        console.log(operatorData);
        this.$emit("playRtsp", channelUuid, "main", operatorData);
      } else if (whereform === "video") {
        this.$emit("drop", this.index);
      }
      // 这里判断下，拖动过来的是树上面的节点还是窗口互换
      e.preventDefault();
    },
    dragover(e) {
      e.preventDefault();
    },
    clickMenu(index) {
      console.log(index);
      console.log(this.menuData[index].name);
      if (index === 0) {
        // 声音
        this.$emit("openVideoVoice");
      } else if (index === 1) {
        // 录像
        if (!this.isRecord) {
          this.$emit("startRecord", this.index);
        } else {
          this.$emit("stopRecord", this.index);
        }
      } else if (index === 2) {
        // 抓图
        this.$emit("screenShot", this.index);
      } else if (index === 3) {
        // 关闭
        this.$emit("closeVideo", this.index);
      }
    },
    contextmenu(e) {
      this.$emit("contextmenu", e, this.index);
    },
    ClickViDeoA(e) {
      this.$emit("click", this.index);
    }
  }
};
</script>
<style lang="scss">
#canvasWrap {
  //让canvas垂直居中
  canvas {
    position: absolute;
    top: 50%;
    left: 0px;
    transform: translateY(-50%);
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.displayWrap {
  position: absolute;
  background: #242527;
  border: 2px solid #1b1b1b;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 1;
  #canvasWrap {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 111;
    pointer-events: none;
  }
  .tipsText {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #fff;
    font-size: 2em;
    z-index: 1;
  }
  .header {
    position: absolute;
    top: -46px;
    left: 0px;
    width: 100%;
    height: 46px;
    background-color: rgba(0, 0, 0, 0.66);
    display: flex;
    justify-content: space-between;
    transition: top ease-out 0.3s;
    z-index: 1111;
    .menu {
      ul {
        list-style: none;
        display: flex;
        font-family: "PingFangSC-Regular";
        font-size: 14px;
        color: #26d39d;
        li {
          vertical-align: middle;
          cursor: pointer;
          img {
            vertical-align: middle;
            display: inline-block;
            padding: 0px 5px;
          }
          padding-right: 15px;
        }
      }
    }
    .videoinfo {
      @include font-s;
      line-height: 46px;
      color: #fff;
      padding-left: 35px;
      &:after {
        content: "";
        width: 4px;
        height: 14px;
        background: #26d39d;
        border-radius: 1px;
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
      }
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      /* width: 46px; */
      max-width: 80%;
    }
  }

  &:hover .header {
    top: 0px;
  }
  .camera {
    position: absolute;
    top: calc(50% + 0px);
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 20%;
  }
}
.VideoActive {
  border: 2px solid rgba(38, 211, 157, 0.5);
}
.isAutoScreen {
  z-index: 100;
}
</style>
