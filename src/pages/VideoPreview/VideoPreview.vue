<template>
  <div class="VideoPreviewContent">
    <left-content orgType="device"
                  needType
                  tagType="device"
                  ref="leftTree"
                  :ShowAuthDisabled="ShowAuthDisabled"
                  :OwnAuthDisabled="OwnAuthDisabled"
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
    <div class="right"
         ref="right">
      <!-- :style="{'max-width':maxRightWidth+'px'}" -->
      <div class="vedioWrap"
           :class="{'fullVideoWrap':fullscreen}"
           ref="vedioWrap">
        <video-wrap v-for="(item,index) in showFenlu"
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
                    :left="item.left"
                    :top="item.top"
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
                    @openVideoVoice="openVideoVoice"
                    @screenShot="screenShot"
                    @dragstart="dragstart(index)"
                    @drop="drop(index)"
                    @contextmenu="showMenu"
                    @click="ClickViDeoA(index)"></video-wrap>
      </div>
      <div class="footer">
        <div class="fenlu">
          <ul>
            <li v-for="(item,index) in fenlu"
                :class="{active:fenluIndex===index}"
                @click="chooseFenlu(index)"
                :key="index">{{item}}</li>
          </ul>
        </div>
        <div class="operator">
          <gt-button class="button"
                     @click="saveShiTu"
                     :disabled="!OwnAuthDisabled"
                     :showClose="false">保存视图</gt-button>
          <el-dropdown @command="changeView"
                       trigger="click">
            <gt-button class="button"
                       :showClose="false">
              {{videoMode}}
              <i class="el-icon-caret-bottom"></i>
            </gt-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="original">原始比例</el-dropdown-item>
              <el-dropdown-item command="fullscreen">充满屏幕</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <gt-button class="button"
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
                         :visible.sync="imageAdjustVisible"></image-adjust-dialog>
    <screenshot-dialog :visible.sync="screenShotVisible"
                       :src="src"></screenshot-dialog>
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
  computed: {
    operatorChannelUuid() {
      if (this.videoArr.length) {
        return this.videoArr[this.operatorIndex].channelUuid;
      } else {
        return "";
      }
    },
    showFenlu() {
      return this.videoArr.slice(
        0,
        Math.min(this.fenlu[this.fenluIndex], this.videoArr.length)
      );
    },
    videoMode() {
      let name = {
        original: "原始比例",
        fullscreen: "充满屏幕"
      };
      if (this.operatorIndex >= this.videoArr.length) {
        return "原始比例";
      } else {
        return name[this.videoArr[this.operatorIndex].mode];
      }
    }
  },
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
      tipsFlag: true,
      fullscreen: false,
      ip: "",
      port: "",
      showCloudControl: false,
      videoinfo: {},
      appendViewVisible: false,
      deviceUuid: "", // 正在操作的通道设备的uuid
      screenShotVisible: false,
      videoInfoVisible: false,
      imageAdjustVisible: false,
      isAutoScreen: -1,
      videoArr: Array.from({ length: 36 }, (item, index) => {
        item = {
          width: 0,
          height: 0,
          rtspUrl: "",
          position: index,
          mode: "original"
        };
        return item;
      }),
      icons,
      fenlu: [1, 4, 8, 9, 16, 25, 36],
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
      src: "",
      dragStartIndex: -1,
      dragEndIndex: -1,
      maxRightWidth: 10000,
      parentArr: new Array(36), // 用来记录所有的视频
      timer: null,
      cnt: 0,
      ShowAuthDisabled: false,
      OwnAuthDisabled: false
    };
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("视频预览", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("视频预览", "isOwn");
    // this.OwnAuthDisabled = false;
    // this.ShowAuthDisabled = true;
    // this.OwnAuthDisabled = false;
    // this.OwnAuthDisabled = true;
    this.jugdeJump();
    this.chooseFenlu(1);
    this.jishi();

    // 监听F11事件

    // 下面是MDZZ代码
    this.initWrapDom();
  },
  destroyed() {
    // clearInterval(this.timer);
    // this.timer = null;
    // window.onresize = null;
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
  methods: {
    changeView(val) {
      this.videoArr[this.operatorIndex].mode = val;
      // this.initWrapDom();
      this.videoArr.concat();
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
        that.initWrapDom();
      }, 100);
    },
    checkFull() {
      return (
        window.innerHeight === window.screen.height &&
        window.innerWidth === window.screen.width
      );
    },
    dblclickhandler(index) {
      if (this.fenluIndex === 2) {
        // 在8分格的时候不进行放大缩小的操作
        return;
      }
      if (this.isAutoScreen === index) {
        // 已经满屏则退出满屏
        this.isAutoScreen = -1;
      } else {
        // 设置满屏
        this.isAutoScreen = index;
      }
      this.initWrapDom();
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
      console.log(data);
      // 打开视图之后，默认选中第一分路的视频
      this.operatorIndex = 0;
      let newdata = JSON.parse(JSON.stringify(data));
      let elements = newdata.elements.map((item, index) => {
        item.position = index;
        item.mode = "original";
        return item;
      });
      for (let i = 0, len = elements.length; i < len; i++) {
        this.videoArr[i] = elements[i];
      }
      this.videoArr.concat();
      this.fenluIndex = data.colTotal - 1;
      this.initWrapDom();
      api2.log3(data.viewName);
    },
    updateView(viewData) {
      // console.log(viewData);
      // 首先判断下视图有没有重复的名字
      let da = this.$refs.leftTree.viewTreeData.filter(i => {
        return i.viewName === viewData.viewInfo.view_name;
      });
      if (da.length > 0) {
        this.$message.error("视图名字跟已有的重复!");
        return;
      }
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
      // 首先判断下视图有没有重复的名字
      let da = this.$refs.leftTree.viewTreeData.filter(i => {
        return i.viewName === name;
      });
      if (da.length > 0) {
        this.$message.error("视图名字跟已有的重复!");
        return;
      }
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
      // console.log(this.operatorIndex);
      // console.log(this.videoArr);
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
      // console.log(data);
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
    playRtsp(
      channelUuid,
      streamType = "",
      adata,
      operator = -1,
      isDrag = false
    ) {
      if (!this.ShowAuthDisabled) {
        return;
      }
      console.log(streamType);
      // 这里做个判断，判断streamType是否为空，为空则判断是不是第一个播放，是则主码流，不是则辅码流
      if (streamType === "") {
        let flag = !!this.videoArr.filter(item => {
          return item.rtspUrl !== "";
        }).length;
        streamType = flag ? "sub" : "main";
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
          if (operator === -1) {
            this.playVideo(data.rtspUrl, channelUuid, streamType, adata);
          } else {
            if (isDrag) {
              this.setData(
                operator,
                data.rtspUrl,
                channelUuid,
                streamType,
                adata
              );
            } else {
              this.setData(
                this.operatorIndex,
                data.rtspUrl,
                channelUuid,
                streamType,
                adata
              );
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    setData(index, rtspUrl, channelUuid, streamType, operatorData) {
      this.videoArr[index].streamType = streamType;
      this.videoArr[index].operatorData = operatorData;
      this.videoArr[index].channelUuid = channelUuid;
      this.videoArr[index].rtspUrl = rtspUrl;
      this.showCloudControl = this.updateCloud();
    },
    judgeEnoughBoard() {},
    playVideo(rtspUrl, channelUuid, streamType, data) {
      // 做个判断如果，当前的画面不够播放，则自动扩容
      if (this.operatorIndex + 1 > 36) {
        // alert(1);
        this.tipsFlag = false;
        setTimeout(() => {
          this.tipsFlag = true;
        }, 1000);
        this.operatorIndex = 35;
        if (this.tipsFlag) {
          this.$message.error("超过36路码流播放了！");
        }
        return;
      }
      this.setData(this.operatorIndex, rtspUrl, channelUuid, streamType, data);
      console.log(this.operatorIndex);
      // 这里还要判断如果后面的视频框，如果有打开的视频，则进行跳过,未写
      if (
        ++this.operatorIndex >= this.fenlu[this.fenluIndex] &&
        this.fenluIndex <= 5
      ) {
        this.chooseFenlu(this.fenluIndex + 1);
      }
      if (this.operatorIndex + 1 > 36) {
        this.operatorIndex = 35;
      }
      console.log(this.videoArr);
      this.updateCloud();
      // 逻辑更改，直接根据用户选中的视频进行播放
    },
    dragstart(index, e) {
      // 拖拽开始

      console.log("dragstart:" + index);
      this.dragStartIndex = index;
    },
    drop(index, e) {
      console.log(e);
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
      // 当每个视频的宽度不同的时候，这里也要交换宽高
      // const exchange = (v1, v2) => {
      //   [v1, v2] = [v2, v1];
      // };
      // exchange(
      //   this.videoArr[this.dragStartIndex].position,
      //   this.videoArr[this.dragEndIndex].position
      // );
      // exchange(
      //   this.videoArr[this.dragStartIndex].width,
      //   this.videoArr[this.dragEndIndex].width
      // );
      // exchange(
      //   this.videoArr[this.dragStartIndex].height,
      //   this.videoArr[this.dragEndIndex].height
      // );
      // 这里不交换rtsp的url，
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
    clickNode(node) {
      console.log(node);
    },
    changetab(tab) {
      // 左边菜单的切换tab事件
      this.tabName = tab.name;
      console.log(tab);
    },
    initWrapDom() {
      // 这里要给他16:9的效果
      // 而且right的高度不能超过
      // console.log(this.$refs.right.clientWidth);
      // console.log(this.$refs.right.offsetHeight);
      // if (this.$refs.right) {
      //   const rightRect = this.$refs.right.getBoundingClientRect();
      //   // console.log(rightRect);
      // }
      if (!this.$refs.right) {
        return;
      }
      const rightHeight = ~~(
        this.$refs.right.clientHeight -
        window.innerWidth * 0.03 -
        2
      );
      // alert(rightHeight);
      // 计算16:9的最大高度
      const maxHeight = rightHeight - 20;
      // console.log(maxHeight);
      // 根据最大高度，反推最大宽度
      this.maxRightWidth = ~~(maxHeight * 16) / 9;
      // 根据这个高度算出来他的最大宽度，
      // 获取系统的高度，然后减去多余的部分

      let vedioWrapDom = this.$refs.vedioWrap;

      // this.videoWidth = ~~(
      //   (Math.min(this.$refs.right.clientWidth, this.maxRightWidth) -
      //     window.innerWidth * 0.04 -
      //     -1) /
      //   fen
      // );
      // this.videoHeight = ~~((maxHeight - 60 - 1) / fen);

      // 这里计算每块视频的长高，因为正方形，且等分，所以
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
        } else {
          item.width = videoWrapWidth;
          item.height = videoWrapHeight;
          item.left = 0;
          item.top = 0;
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
    },
    chooseFenlu(index) {
      // this.operatorIndex = 0;
      this.fenluIndex = index;
      this.isAutoScreen = -1; // 切换分路 将单个视频的全屏删除掉
      this.initWrapDom();
      let dataArr = JSON.parse(JSON.stringify(this.videoArr));
      dataArr.sort((a, b) => {
        return a.position - b.position;
      });
      this.videoArr = dataArr;

      // 如果从多路切换到少路的时候，选中的index小于显示的分路，则将他切换到0
      // if (this.operatorIndex > this.fenlu[this.fenluIndex]) {
      //   this.operatorIndex = 0;
      // }

      // 切换分路，还需要保留之前已经打开的视频画面

      // let num = Array.from(
      //   { length: this.fenlu[this.fenluIndex] },
      //   (item, index) => {
      //     item = {
      //       width: this.videoWidth,
      //       height: this.videoHeight,
      //       rtspUrl: "",
      //       position: index
      //     };
      //     if (this.videoArr[index] && this.videoArr[index].rtspUrl) {
      //       item = this.videoArr[index];
      //       item.position = index;
      //     }
      //     return item;
      //   }
      // );
      // this.videoArr = num;
      // console.log(num);
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
      if (!this.OwnAuthDisabled) {
        return;
      }
      console.log(e);
      this.operatorIndex = index;
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
    closeVideo(index) {
      this.operatorIndex = index;
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
    openVideoVoice(index) {
      console.log(index);
      console.log(this.videoArr);
      let item = this.videoArr[index];
      item.isStopVoice = !item.isStopVoice;

      // this.videoArr[index].isStopVoice = !this.videoArr[index].isStopVoice;
      this.videoArr.splice(index, 1, item);
      this.videoArr.concat();
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
    switchLuxiang(channelUuid, channelName) {
      // 判断有没有操作权限，没有则不进行跳转
      // 这里的操作权限是看视频回放的，而不是视频预览的
      if (
        !this.$common.getAuthIsOwn("视频回放", "isShow") ||
        !this.$common.getAuthIsOwn("视频回放", "isOwn")
      ) {
        return;
      }
      this.$store.dispatch("addTagViewItem", {
        icon: "VideoPlayback",
        name: "VideoPlayback",
        title: "视频回放",
        type: "config",
        path: "/VideoPlayback"
      });
      this.$store.dispatch("setLocalTag", "VideoPlayback");
      this.$bus.$emit("setLocalTag", "VideoPlayback");
      this.$router.push({
        name: "VideoPlayback",
        params: { channelUuid, channelName }
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
      var element = document.documentElement;
      // this.setFullScreen(this.$refs.vedioWrap);

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
        // this.fullscreen = !this.fullscreen;
        setTimeout(() => {
          this.fullscreen = true;
          this.initWrapDom();
        }, 100);
      }
      // // 改变当前全屏状态
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
      // this.operatorChannelUuid = this.videoArr[this.operatorIndex].channelUuid;
    },
    updateCloud() {
      if (this.operatorIndex < 0 || !this.videoArr[this.operatorIndex]) {
        return false;
      }
      if (
        !this.videoArr[this.operatorIndex].rtspUrl ||
        !this.videoArr[this.operatorIndex].operatorData
      ) {
        return false;
      }
      return (
        ["bullet_camera_ptz", "ball_camera"].indexOf(
          this.videoArr[this.operatorIndex].operatorData.realType
        ) !== -1
      );
    }
  },
  watch: {
    operatorIndex(val) {
      // console.log(this.videoArr);
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
<style lang="scss">
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
.VideoPreviewContent {
  .el-message-box__title span {
    color: #fff !important;
  }
  .el-message-box__message {
    p {
      text-align: center !important;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.VideoPreviewContent {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;

  .right {
    width: calc(100% - 220px);
    height: 100%;
    // padding: 0px;
    box-sizing: border-box;
    user-select: none;
    padding: 0px;
    box-sizing: border-box;
    .vedioWrap {
      position: relative;
      // height: calc(100% - 80px);
      // padding-top: 56.25%;
      height: calc(100vh - 122px);
      margin: 2px 0px 0px;
    }
    .footer {
      height: 70px;
      // margin: 10px;
      display: flex;
      justify-content: space-between;
      .operator {
        margin-top: 16px;
        margin-right: 40px;
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
    left: 0px;
    top: 0px;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 10;
  }
}
</style>
