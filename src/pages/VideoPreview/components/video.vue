  <template>
  <div class='displayWrap'
       ref="displayWrap"
       @contextmenu="contextmenu"
       @click="ClickViDeoA"
       @dragstart="dragstart"
       @drop="drop"
       @dragover="dragover"
       @dblclick="dblclickhandler"
       @mouseenter="mouseenter"
       @mouseout="mouseout"
       @mousemove="mousemove"
       draggable="true"
       :class="{'VideoActive':isActive,'isAutoScreen':isAutoScreen,'showMenuFlag':showMenuFlag}"
       :style="{height:height+'px',width:width+'px',left:left+'px',top:top+'px'}">
    <!-- 视频信息展示菜单 -->
    <div class="header"
         v-if='IsShowMenu'>
      <div class="videoinfo">
        {{streamText}}
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
          <span class="el-dropdown-link"
                @click.stop>
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
         v-show="!rtspUrl.length&&!IsShowAddIcon"
         alt="">
    <img src="@/assets/images/addVideo.png"
         v-show="IsAddMenu && IsShowAddIcon"
         class='camera'
         alt="">
    <!-- <div class='tipsText'
         v-show="rtspUrl.length">
      码流请求中
    </div> -->
    <!-- 1 -->
    <gt-loading v-if="isLoadingVideo"
                msg='加载中'></gt-loading>
    <div id='canvasWrap'
         ref='canvasRefs'
         :class="{'fullscreen':mode!='original'}">

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
    left: {
      type: Number
    },
    top: {
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
    IsShowAddIcon: {
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
    isStopVoice: {
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
    mode: {
      type: String,
      default() {
        return "original";
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
    },
    decodeMod: {
      type: String,
      default() {
        return "video";
      }
    },
    playStatus: {
      type: Number,
      default() {
        return 0;
      }
    } // 0待播放 1正在播放 2暂停播放
  },
  data() {
    return {
      isLoadingVideo: false,
      IsAddMenu: true,
      icons,
      ip: "",
      port: "",
      video_mgr: null,
      canvas: null,
      video: null,
      video_list: [],
      speed: 1, // 视频播放速度
      isPause: false, // 0表示正在播放，1表示,
      showMenuFlag: false, // 是否显示菜单
      isInVideo: false, // 鼠标是否在video组件里面
      mouseTimer: null // 鼠标进入计时器
    };
  },
  destroyed() {
    this.stopVideo();
  },
  computed: {
    streamText() {
      let obj = {
        main: "主码流",
        sub: "辅码流",
        third: "第三码流"
      };
      return obj[this.streamType];
    },
    menuData() {
      return [
        {
          icon: this.isStopVoice ? "closevideo" : "voice",
          name: "声音"
        },
        {
          icon: "video",
          name: this.isRecord ? "停止录像" : "录像"
        },
        {
          icon: "screenshot",
          name: "抓图"
        },
        // {
        //   icon: "fullscreen2",
        //   name: "全屏"
        // },
        {
          icon: "close",
          name: "关闭"
        }
      ];
    }
  },
  mounted() {
    /* eslint-disable */
    const _this = this;
    const onStreamBreak = video => {
      // _this.video_mgr.stop(_this.video);
    };
    this.video_mgr = new CVideoMgrSdk(onStreamBreak);
    if (this.rtspUrl) {
      setTimeout(() => {
        this.playVideo();
      }, 500);
    }
  },
  watch: {
    mode(val) {
      // this.calcHeight();
    },
    streamType(val) {
      // 码流切换，则先停掉，在重新播放
      // 判断是否在播放，在切换
    },
    width(val) {
      // 宽度变化 则更新canvas的大小
      this.calcHeight();
      // 宽度和高度变化，不需要重新播放
    },
    height(val) {
      this.calcHeight();
    },
    rtspUrl(val) {
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
    mouseenter() {
      this.isInVideo = true;
      this.showMenuFlag = true;
    },
    mouseout() {
      this.isInVideo = false;
      this.showMenuFlag = false;
      clearTimeout(this.mouseTimer);
    },
    mousemove() {
      if (this.mouseTimer) {
        clearTimeout(this.mouseTimer);
        this.mouseTimer = null;
      }
      this.showMenuFlag = true;
      this.mouseTimer = setTimeout(() => {
        this.showMenuFlag = false;
      }, 3000);
    },
    async speedUp() {
      if (!this.video || !this.video_mgr) {
        this.$message.error("该选中框没有视频在播放！");
        return;
      }
      if (this.speed >= 8) {
        return;
      }
      this.speed = this.speed * 2;
      await this.video_mgr.speedControl(this.video, this.speed);
    },
    async slowDown() {
      if (!this.video || !this.video_mgr) {
        this.$message.error("该选中框没有视频在播放！");
        return;
      }
      if (this.speed <= 1) {
        return;
      }
      this.speed = this.speed / 2;
      await this.video_mgr.speedControl(this.video, this.speed);
    },
    async pause(playStatus) {
      // if (!this.video || !this.video_mgr) {
      //   this.$message.error("该选中框没有视频在播放！");
      //   return;
      // }
      if (!playStatus) {
        playStatus = this.playStatus;
      }
      // alert(playStatus);
      if (playStatus === 0) {
        // 如果按钮待播放，点击这个按钮没有反应
        return;
      } else if (playStatus === 1) {
        // 正在播放就停止
        await this.video_mgr.pause(this.video);
        this.$message.success("暂停视频");
      } else if (playStatus === 2) {
        await this.video_mgr.resume(this.video);
        this.$message.success("继续播放视频");
      }
    },
    async resume() {},
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
      console.log(this.canvas);
      return this.canvas || this.$refs.displayWrap;
    },
    drag(url) {
      // 时间跳转
      // console.log(start);
      // if (!this.canvas) {
      //   this.playVideo();
      // }
      console.log(this.canvas);
      console.log(this.rtspUrl);
      if (this.canvas) {
        console.log(url);
        this.video_mgr.drag(this.video, url);
      } else {
        this.playVideo();
      }
    },
    calcHeight() {
      // 这里让视频的宽高比是*16:9；
      // return this.height;
      if (this.canvas) {
        // 如果视频的mode等于original 则按照下面的比例进行播放
        // 如果是fullscreen则按照充满屏幕来播放
        if (this.mode === "fullscreen" && this.decodeMod !== "video") {
          this.canvas.width = this.width;
          this.canvas.height = this.height;
          return;
        }
        // if (this.decodeMod === "video") {
        //   this.canvas.width = this.width;
        //   this.canvas.height = this.height;
        //   return;
        // }
        // 如果宽高比大于16:9 则按照高计算宽
        if (this.width / this.height >= 16 / 9) {
          let width = this.width;
          // if (this.mode === "fullscreen") {
          //   this.canvas.width = this.width;
          //   let height = ~~((9 / 16) * width);
          //   this.canvas.height = height;
          //   return;
          // } else {
          //   this.canvas.width = width;
          //   this.canvas.height = this.height;
          // }
          this.canvas.width = width;
          this.canvas.height = this.height;
        } else {
          let height = this.height;
          if (this.mode === "fullscreen") {
            this.canvas.height = height;
            let width = ~~((16 / 9) * height);
            this.canvas.width = width;
            return;
          } else {
            this.canvas.width = this.width;
            this.canvas.height = height;
          }
        }
        console.log(this.canvas.width + " " + this.canvas.height);
      }
    },
    async playVideo() {
      this.canvas = document.createElement("video");
      this.calcHeight();
      let { jDescription } = this.$store.getters;
      console.log("jDescription: ", jDescription);
      // let w, h;
      // if (this.streamType === "main") {
      //   w = 1920;
      //   h = 1080;
      // } else if (this.streamType === "sub") {
      //   w = 704;
      //   h = 576;
      // } else {
      //   w = 2560;
      //   h = 1440;
      // }
      // console.log(w, h);
      console.log("播放的url" + this.rtspUrl);
      this.isLoadingVideo = true;
      setTimeout(()=>{
        if(this.isLoadingVideo){
          this.isLoadingVideo = false;
        }
      },60000);
      this.IsAddMenu = false;
      this.video = await this.video_mgr.setup({
        element: this.canvas,
        decodeMod: this.decodeMod,
        jDescription,
        webProtocol: window.location.protocol,
        url: this.rtspUrl,
        protocol: "rtsp",
        action: this.action,
        speed: this.speed,
        file: ""
      });
      if (this.video) {
        await this.video_mgr.play(this.video);
      }
      this.$refs.canvasRefs.appendChild(this.canvas);
      this.isLoadingVideo = false;
    },
    stopVideo() {
      if (this.video && this.video_mgr) {
        this.video_mgr.stop(this.video);
      }
      if (this.canvas && this.$refs.canvasRefs) {
        // 再加一层判断，获取当前canvasRefs下面是否有child
        if (this.$refs.canvasRefs.childNodes.length) {
          this.$refs.canvasRefs.removeChild(this.canvas);
        }
      }
      this.IsAddMenu = true;
      this.canvas = null;
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
        if (operatorData.isOnline) {
          this.$emit(
            "playRtsp",
            channelUuid,
            "",
            operatorData,
            this.index,
            true
          );
        } else {
          this.$message.error("设备不在线！");
        }
      } else if (whereform === "video") {
        this.$emit("drop", this.index);
      }
      // 这里判断下，拖动过来的是树上面的节点还是窗口互换
      e.preventDefault();
    },
    dragover(e) {
      e.preventDefault();
    },
    clickMenu(index, event) {
      if (index === 0) {
        // 声音
        this.$emit("openVideoVoice", this.index);
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
      } else if (index == 3) {
        // 全屏
        // this.$emit("fullscreen2", this.index);
        this.$emit("closeVideo", this.index);
      } else if (index === 4) {
        // 关闭
        this.IsAddMenu = true;
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
  canvas,
  video {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.displayWrap {
  position: absolute;
  background: rgb(22, 22, 22);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  overflow: hidden;
  z-index: 1;
  cursor: pointer;
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
  .camera {
    position: absolute;
    top: calc(50% + 0px);
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 20%;
  }
}
.showMenuFlag {
  .header {
    top: 0px;
  }
}
.VideoActive {
  border: 2px solid rgba(38, 211, 157, 0.5);
}
.isAutoScreen {
  z-index: 100;
}
</style>
