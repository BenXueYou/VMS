<template>
  <div class='VideoPreviewContent'>
    <left-content orgType="device"
                  needType=""
                  tagType="device"
                  ref='leftTree'
                  @playRtsp="playRtsp"
                  @jumpToPlayback="jumpToPlayback"
                  @updateView="updateView"
                  @ctrl="ctrl"
                  @openView="openView"
                  @preset="preset"
                  @addPreset="addPreset"
                  @updatePreset="updatePreset"
                  @deletePreset="deletePreset"
                  @changetab="changetab"
                  @clickNode="clickNode"
                  @switchLuxiang="switchLuxiang"
                  :showCloudControl="showCloudControl"
                  :channelUuid="operatorChannelUuid"></left-content>
    <div class='right'
         ref='rigth'>
      <div class='vedioWrap'
           ref='vedioWrap'>
        <video-wrap v-for="(item,index) in videoArr"
                    :ref="'video'+index"
                    :key="index"
                    :index="index"
                    :isActive="operatorIndex===index"
                    :width="item.width"
                    :height="item.height"
                    :rtspUrl="item.rtspUrl"
                    :streamType="item.streamType"
                    :IsShowMenu="!!item.rtspUrl"
                    :position="item.position"
                    :isRecord="!!item.isRecord"
                    :fenlu="fenluIndex+1"
                    :isAutoScreen="isAutoScreen===index"
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
          <gt-button class='button'
                     @click='saveShiTu'
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
                       :videoinfo="videoinfo"
                       :visible.sync="videoInfoVisible"></video-info-Dialog>
    <image-adjust-dialog title="画面调节"
                         :visible.sync="imageAdjustVisible">
    </image-adjust-dialog>
    <screenshot-dialog :visible.sync="screenShotVisible"
                       :src="src">
    </screenshot-dialog>
    <tree-append-tag-dialog @confirm="addView"
                            title="添加视图"
                            labelName="视图名称"
                            :visible.sync="appendViewVisible"></tree-append-tag-dialog>
  </div>
</template>

<script>
import LeftContent from "./views/Left";
import VideoWrap from "@/pages/VideoPreview/components/video";
import TreeAppendTagDialog from "@/common/TreeAppendTagDialog";
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
    TreeAppendTagDialog,
    videoInfoDialog,
    imageAdjustDialog,
    screenshotDialog,
    tabName: ""
  },
  data() {
    return {
      showCloudControl: false,
      videoinfo: {},
      appendViewVisible: false,
      deviceUuid: "", // 正在操作的通道设备的uuid
      screenShotVisible: false,
      videoInfoVisible: false,
      imageAdjustVisible: false,
      isAutoScreen: -1,
      videoArr: [
        {
          position: 0, // 表示视频的位置，初始化的时候是从0-n的按顺序的，拖动之后position就会变化
          rtspUrl: "", // 播放的视频 Url
          streamType: ""
        }
      ],
      icons,
      fenlu: [1, 4, 9, 16, 25, 36],
      fenluIndex: 0,
      operatorIndex: 0,
      operatorChannelUuid: "",
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
      src: "",
      dragStartIndex: -1,
      dragEndIndex: -1
    };
  },
  mounted() {
    this.jugdeJump();
    this.$nextTick(() => {
      this.initWrapDom();
    });
    window.addEventListener(
      "resize",
      this.$common.throttle(this.initWrapDom, 100, { trailing: false })
    );
  },
  activated() {
    this.initWrapDom();
  },
  destroyed() {},
  methods: {
    dblclickhandler(index) {
      if (this.isAutoScreen === index) {
        // 已经满屏则退出满屏
        this.isAutoScreen = -1;
        this.videoArr[index].width = this.videoWidth;
        this.videoArr[index].height = this.videoHeight;
      } else {
        // 设置满屏
        this.isAutoScreen = index;
        this.videoArr[index].width = this.videoWidth * (this.fenluIndex + 1);
        this.videoArr[index].height = this.videoHeight * (this.fenluIndex + 1);
      }
      this.videoArr.concat();
    },
    jugdeJump() {
      if (
        this.$route.params.channelUuid &&
        this.$route.path === "/VideoPreview"
      ) {
        this.playRtsp(
          this.$route.params.channelUuid,
          "main",
          this.$route.params.data
        );
      }
    },
    openView(data) {
      // 打开视图

      // 打开视图之后，默认选中第一分路的视频
      this.operatorIndex = 0;
      let elements = data.elements.map((item, index) => {
        item.position = index;
        return item;
      });
      console.log(elements);
      this.videoArr = elements;
      this.fenluIndex = data.colTotal - 1;
      this.initWrapDom();
    },
    updateView(viewData) {
      console.log();
      let data = JSON.parse(JSON.stringify(viewData));
      delete data.viewName;
      api2.updateView(data).then(res => {
        if (res.data.success) {
          this.$message.success("保存成功！");
        } else {
          this.$message.error(res.data.msg);
        }
        // 更新视图树结构
        this.$refs.leftTree.getViewTree();
      });
    },
    addView(name) {
      // 保存视图
      // 这里需要将数组按照position重新排序一下，这样打开才会是正确的
      let dataArr = JSON.parse(JSON.stringify(this.videoArr));
      dataArr.sort((a, b) => {
        return a.position - b.position;
      });
      let elements = dataArr.map(item => {
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
        viewType: "preview", // 视图类型
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
    saveShiTu() {
      this.appendViewVisible = true;
    },
    preset(action, index) {
      if (!this.videoArr[this.operatorIndex].channelUuid) {
        this.$message.error("请先选择播放的视频设备！");
        return;
      }
      if (index === "") {
        this.$message.error("请选择预置点再进行操作！");
        return;
      }
      api2
        .preset(this.videoArr[this.operatorIndex].channelUuid, {
          action, // 操作类型，必填
          index // 预置点，必填
        })
        .then(() => {});
    },
    addPreset(data) {
      api2.addPreset(data).then(res => {
        if (res.data.success) {
          this.$message.success("新增预置点成功！");
          // 新增完，
          this.preset("set_preset", data.presetPoisition);
          this.$refs.leftTree.getPreset();
          this.$refs.leftTree.isChoose = false;
        }
      });
    },
    updatePreset(data) {
      console.log(this.operatorIndex);
      console.log(this.videoArr);
      api2.updatePreset(data).then(res => {
        if (res.data.success) {
          this.$message.success("预置点修改成功！");
        }
        this.$refs.leftTree.getPreset();
        this.$refs.leftTree.isChoose = false;
        this.preset("set_preset", data.presetPoisition);
      });
      // if (!this.videoArr[this.operatorIndex].channelUuid) {
      //   this.$emit("该视频分路没有通道");
      //   return;
      // }
      // api2
      //   .getClound(this.videoArr[this.operatorIndex].channelUuid)
      //   .then(res => {
      //     console.log(res);
      //     let rotationAngle = res.data.data.rotationAngle;
      //     data.rotationAngle = rotationAngle;
      //     this.updatePeraaaaaa(data);
      //   });
    },
    updatePeraaaaaa(data) {
      console.log(data);
      api2.updatePreset(data).then(res => {
        if (res.data.success) {
          this.$message.success("预置点修改成功！");
        }
        this.$refs.leftTree.getPreset();
        this.$refs.leftTree.isChoose = false;
      });
    },
    deletePreset(presetPositionUuid) {
      api2.deletePreset(presetPositionUuid).then(res => {
        if (res.data.success) {
          this.$message.success("预置点删除成功！");
        }
        this.$refs.leftTree.getPreset(true);
      });
    },
    playRtsp(channelUuid, streamType = "string", adata, operator = -1) {
      // 请求码流地址从而进行播放
      // 两种情况，一种是新的视频播放，另一种是切换码流类型在进行播放
      api2
        .getPreviewInfo({
          channelUuid,
          streamType
        })
        .then(res => {
          console.log(res);
          let data = res.data.data;
          // 这里会得到rtsp的码流地址，然后进行一些操作,默认是主码流
          if (operator === -1) {
            this.playVideo(data.rtspUrl, channelUuid, streamType, adata);
          } else {
            this.videoArr[operator].rtspUrl = data.rtspUrl;
            this.videoArr[operator].streamType = streamType;
            this.videoArr.concat();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    playVideo(rtspUrl, channelUuid, streamType, data) {
      // 根据通道获取到了视频流地址，从而进行播放
      // 遍历videoArr数组，看哪个分路的rtspUrl为空，则在上面播放
      for (let i = 0; i < this.videoArr.length; i++) {
        if (!this.videoArr[i].rtspUrl) {
          this.videoArr[i].operatorData = data;
          this.videoArr[i].rtspUrl = rtspUrl;
          this.videoArr[i].channelUuid = channelUuid;
          this.videoArr[i].streamType = streamType;
          this.operatorIndex = i;
          // 左边的树添加到右边去播放
          break;
        }
      }
      this.videoArr.concat();
    },
    dragstart(index, e) {
      // 拖拽开始

      console.log("dragstart:" + index);
      this.dragStartIndex = index;
    },
    drop(index, e) {
      // 拖拽结束
      console.log("drop:" + index);
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
      this.videoArr = this.videoArr;
      this.dragStartIndex = -1;
      console.log(this.videoArr);
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
      this.videoArr = this.videoArr.map(item => {
        item.width = this.videoWidth;
        item.height = this.videoHeight;
        return item;
      });
    },
    chooseFenlu(index) {
      this.fenluIndex = index;
      this.isAutoScreen = -1;
      this.initWrapDom();
      // 切换分路，还需要保留之前已经打开的视频画面

      let num = Array.from(
        { length: this.fenlu[this.fenluIndex] },
        (item, index) => {
          item = {
            width: this.videoWidth,
            height: this.videoHeight,
            rtspUrl: "",
            position: index
          };
          if (this.videoArr[index] && this.videoArr[index].rtspUrl) {
            item = this.videoArr[index];
            item.position = index;
          }
          return item;
        }
      );
      this.videoArr = num;
      console.log(num);
    },
    // 控制云台
    ctrl(action, start, speed) {
      // 判断操作的分路视频是否存在
      if (!this.videoArr[this.operatorIndex].channelUuid) {
        this.$message.error("该分路没有视频，请先添加视频");
        return;
      }
      api2
        .ctrl(this.videoArr[this.operatorIndex].channelUuid, {
          action, // 操作类型，必填
          start, // 开始/结束，必填
          speed // 速度，必填
        })
        .then(res => {
          console.log(res);
        });
    },
    ClickViDeoA(index) {
      // 选中哪个视频块
      this.operatorIndex = index;
      this.showCloudControl = this.updateCloud();
      this.getChannleUuid();
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
    closeVideo(index) {
      this.videoArr[index].rtspUrl = "";
      this.videoArr[index].streamType = "";
      this.videoArr[index].channelUuid = "";
    },
    // 处理
    dealContextMenu(value) {
      console.log(value);
      switch (value) {
        case "关闭窗口":
          // 清空rtspUrl，则触发video组件stop事件
          this.closeVideo(this.operatorIndex);

          this.videoArr.concat();
          break;
        case "关闭所有窗口":
          // 把所有分路的rtspUrl都清空
          this.videoArr = this.videoArr.map((item, index) => {
            item.rtspUrl = "";
            item.position = index;
            item.streamType = "";
            item.channelUuid = "";
            return item;
          });
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
          this.screenShot(this.operatorIndex);
          break;
        case "切换至录像":
          if (!this.videoArr[this.operatorIndex].channelUuid) {
            this.$message.error("该分路上没有通道！");
          } else {
            this.switchLuxiang(this.videoArr[this.operatorIndex].channelUuid);
          }
          break;
        case "全屏":
          this.setFullScreen(
            this.$refs["video" + this.operatorIndex][0].getCanvas()
          );
          break;
        case "图像调节":
          this.imageAdjustVisible = true;
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
        case "三码流":
          this.switchMaLiu(this.operatorIndex, "thrid");
          break;
        case "打开音频":
          this.openVideoVoice(this.operatorIndex);
          break;
        default:
          break;
      }
    },
    openVideoVoice(index) {},
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
      this.videoArr[index].isRecord = true;
      this.videoArr.concat();
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

      this.videoArr[index].isRecord = false;
      this.videoArr.concat();
      this.$refs["video" + index][0].stopRecord();
    },
    switchLuxiang(channelUuid) {
      this.$router.push({
        name: "VideoPlayback",
        params: { channelUuid }
      });
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
    jumpToPlayback(channelUuid) {
      // this.$router.push({
      //   name: "VideoPlayback",
      //   params: { channelUuid: "channelUuid" }
      // });
    },
    switchMaLiu(index, streamType) {
      if (!this.videoArr[index].rtspUrl) {
        this.$message.error("该分路没有视频在播放，切换失败！");
        return;
      }
      this.playRtsp(this.videoArr[index].channelUuid, streamType, {}, index);
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
    },
    getChannleUuid() {
      // eslint-disable-next-line
      this.operatorChannelUuid = this.videoArr[this.operatorIndex].channelUuid;
    },
    updateCloud() {
      if (!this.videoArr[this.operatorIndex].operatorData) {
        return false;
      }
      return (
        ["bullet_camera_ptz", "bullet_camera"].indexOf(
          this.videoArr[this.operatorIndex].operatorData.relType
        ) !== -1
      );
    }
  },
  watch: {
    operatorIndex(val) {
      this.showCloudControl = this.updateCloud();
    },
    videoArr(val) {
      this.showCloudControl = this.updateCloud();
    },
    "$route.path": function(newVal, oldVal) {
      // 监听路由，查看params是否携带参数rtsp，从而判断是否跳转播放码流
      this.jugdeJump();
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
      position: relative;
      height: calc(100% - 80px);
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
