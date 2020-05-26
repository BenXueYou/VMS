<template>
  <el-row class="bayonetPreview"
          type="flex"
          justify="flex-start">
    <el-container>
      <!-- 设备菜单 -->
      <el-header>
        <bayonet-preview-header :ShowAuthDisabled="ShowAuthDisabled"
                                :OwnAuthDisabled="OwnAuthDisabled"
                                @transferCheckedChannels="transferCheckedChannels" />
      </el-header>
      <el-main style="position: relative;"
               ref="mainHeightBox">
        <!-- 视频播放区域 -->
        <div class="main-box"
             v-loading="mainVideoScreenLoading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
          <div id="poster_img"></div>
          <div ref="canvasRefs"
               id="player"
               class="fill"></div>
        </div>
      </el-main>
      <!-- 底部车辆抓拍记录图片list -->
      <el-footer height="265px">
        <el-row type="flex"
                justify="space-between"
                class="footerTopRow">
          <el-col :span="8">
            <img :src="footerLiftType?require('@/assets/icon/stream-people.png'):require('@/assets/icon/face-photo.png')" />
            <span>{{!footerLiftType?"车辆抓拍数：":"车流量统计结果"}}</span>
            <span v-if="!footerLiftType">{{todayShootCount}}张</span>
          </el-col>
          <el-col :span="16"
                  style="text-align:right">
            <router-link to="/BayonetManage/bayonetRecord">
              更多
              <img style="margin-left:6px"
                   src="@/assets/icon/more.png"
                   alt="更多" />
            </router-link>
            <el-switch @change="footerTypeAct"
                       v-model="footerLiftType"
                       active-color="rgb(11,49,49)"
                       inactive-color="rgb(11,49,49)"></el-switch>
          </el-col>
        </el-row>
        <el-row type="flex"
                v-show="!footerLiftType"
                class="footerRowClass"
                justify="space-between"
                :gutter="15">
          <el-col ref="footerCardImgHeight"
                  class="footerCardClass"
                  :span="4"
                  v-for="(o,index) in 6"
                  :key="index">
            <bayonet-snap-card :photoItem="bayonetSnapShootList.length>index?bayonetSnapShootList[index]:{}" />
          </el-col>
        </el-row>
        <el-row class="bayonetLineBotClass"
                v-show="footerLiftType">
          <el-row v-loading="fullscreenLoading"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  ref="bayonetCanvas"
                  id="bayonet_bar_bot"></el-row>
        </el-row>
      </el-footer>
    </el-container>
    <!-- ======================================================= 右侧识别 ========================================================== -->
    <el-aside width="460px">
      <el-header class="asideHeaderClass">
        <div>
          <img class="img"
               :src="icons.bayonetAsideheaderTopImg"
               alt />
          <span>车辆识别</span>
        </div>
        <div>
          <span>今日次数：{{todayShootCount}}</span>
          <router-link to="/BayonetManage/bayonetRecord">更多</router-link>
          <img style="padding-right:15px"
               :src="icons.moreIcon" />
        </div>
      </el-header>
      <div class="asideBody">
        <div class="asideBodyCell"
             v-for="(item,index) in 4"
             @dblclick="doRecoginizeDetail(index)"
             :key="index">
          <bayonet-recognized-card :recoginizeItem="bayonetRecognizedList[index]"
                                   @clickDetailAct="doRecoginizeDetail(index)" />
        </div>
      </div>
    </el-aside>
    <!-- ======================================================= 弹窗 ========================================================== -->
    <bayonet-card-detail :visible.sync="BRRecordDetailDialogVisable"
                         :BayonetCardDetail="dialogParama" />
  </el-row>
</template>
<script>
import icons from "@/common/js/icon.js";
import BayonetPreviewHeader from "../components/BayonetPreviewHeader";
import BayonetRecognizedCard from "../components/BayonetRecognizedCard";
import BayonetSnapCard from "../components/BayonetSnapCard";
import * as api2 from "@/pages/VideoPreview/ajax.js";
import * as api from "../http/ajax.js";
import BayonetCardDetail from "../components/BayonetCardDetail";
import { mapState } from "vuex";
export default {
  name: "bayonetPreview",
  components: {
    BayonetCardDetail,
    BayonetPreviewHeader,
    BayonetRecognizedCard,
    BayonetSnapCard
  },
  activated() {
    // if (!this.ShowAuthDisabled) return;
    this.$nextTick(() => {
      if (this.video_mgr && this.video) {
        this.video_mgr.stop(this.video);
      }
      if (this.canvas) {
        console.log(this.$refs.canvasRefs);
        this.$refs.canvasRefs.removeChild(this.canvas);
        this.canvas = null;
      }
      if (this.lastRstpUrl) {
        this.loadVideo();
      }
    });
  },
  mounted() {
    let projectType = this.$store.state.home.projectType || {};
    this.isOneProject = Boolean(projectType.platformLevel === "levelOne");

    this.ShowAuthDisabled = this.$common.getAuthIsOwn("车辆识别", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("车辆识别", "isOwn");
  },
  data() {
    return {
      bayonetPopoverClass: "bayonetPopoverClass",
      BRRecordDetailDialogVisable: false,
      fullscreenLoading: false,
      mainVideoScreenLoading: false,
      icons,
      footerLiftType: false,
      todayShootCount: 0,
      todayRecognizedCount: 0,
      bayonetRecognizedList: [],
      bayonetSnapShootList: [],
      checkedChannelsUuidsList: [],
      streamType: "main",
      streamTypeOptions: [
        { typeStr: "main", typeName: "主码流" },
        { typeStr: "sub", typeName: "辅码流" },
        { typeStr: "thrid", typeName: "第三码流" }
      ],
      dialogParama: {},
      video_mgr: null,
      lastRstpUrl: "",
      showSingleChannel: false,
      checkedChannel: null,
      projectType: null,
      isOneProject: true,
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  computed: {
    ...mapState({
      BayonetShootArr: state => {
        return state.bayonet.BayonetShootArr;
      }
    })
  },
  watch: {
    BayonetShootArr(val) {
      console.log(val);
      console.log(this.checkedChannel);
      if (!this.ShowAuthDisabled) return;
      if (val.length) {
        let channelUuid = val[val.length - 1].channelUuid;
        // this.checkedChannelsUuidsList.indexOf(channelUuid) !== -1
        if (
          !this.showSingleChannel ||
          (this.showSingleChannel &&
            this.checkedChannel.channelUuid === channelUuid)
        ) {
          // 显示的是单通道
          this.todayRecognizedCount++;
          this.todayShootCount++;
          this.bayonetSnapShootList.unshift(val[val.length - 1]);
          if (this.bayonetSnapShootList.length > 6) {
            this.bayonetSnapShootList.pop();
          }
          this.bayonetRecognizedList = this.bayonetSnapShootList;
        }
      }
    }
  },
  methods: {
    getBayonetRecordList() {
      let data = {
        page: 1,
        limit: 6,
        startTime: this.$common.getStartTime(),
        endTime: this.$common.getCurrentTime()
      };
      if (this.showSingleChannel) {
        data.channelUuids = this.checkedChannel.channelUuid;
      }
      this.bayonetRecognizedList = [];
      this.todayRecognizedCount = 0;
      api
        .getBayonetRecordList(data, {
          modelName: "车辆识别",
          type: "查看",
          detailContent: "查看过车记录"
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.bayonetRecognizedList = res.data.data.list || [];
            this.bayonetSnapShootList = res.data.data.list || [];
            this.todayRecognizedCount = res.data.data.total;
            this.todayShootCount = res.data.data.total;
          }
        })
        .catch(() => {});
    },
    // 获取人流量分布统计，判断参数是否单一相机
    getPhotoStaticList() {
      if (!this.showSingleChannel) {
        this.getStaticsPeopleAPi({
          channelUuid: this.checkedChannelsUuidsList.toString()
        });
      } else {
        this.getStaticsPeopleAPi({
          channelUuid: this.checkedChannelsUuidList[0]
        });
      }
    },
    // 车流量抓拍ＨＴＴＰ统计
    getStaticsPeopleAPi(data) {
      this.fullscreenLoading = !this.fullscreenLoading;
      data.startTime = this.$common.getStartTime();
      data.endTime = this.$common.getCurrentTime();
      api
        .getBayonetRecordStatics(data, {
          modelName: "车辆识别",
          detailContent: "查看车流量统计"
        })
        .then(res => {
          this.fullscreenLoading = !this.fullscreenLoading;
          let body = res.data;
          if (body.data) {
            let arr = body.data || [];
            let num = [];
            arr.forEach((item, index) => {
              item.hours = Number(item.hours);
              num[item.hours] = item.snapCount;
            });
            this.photoStaticList = num;
          }
          this.drawLine();
        })
        .catch(() => {
          this.fullscreenLoading = !this.fullscreenLoading;
        });
    },
    footerTypeAct() {
      if (this.footerLiftType === true) {
        // 获取人脸统计
        this.getPhotoStaticList();
      }
    },
    doRecoginizeDetail(e) {
      this.BRRecordDetailDialogVisable = !this.BRRecordDetailDialogVisable;
      if (e >= 0 && this.bayonetRecognizedList[e]) {
        console.log(this.bayonetRecognizedList[e]);
        this.dialogParama = this.bayonetRecognizedList[e];
      }
    },
    transferCheckedChannels(
      checkedChannelsUuidsList,
      checkedChannel,
      notCheckAll
    ) {
      console.log(checkedChannel);
      this.showSingleChannel = notCheckAll;
      this.checkedChannelsUuidsList = checkedChannelsUuidsList;
      this.getBayonetRecordList();
      if (!checkedChannel) {
        this.$message.warning("该节点没有找到设备");
        return;
      }
      if (checkedChannel && checkedChannel.chnOnlineOrNot === "offline") {
        this.$message.warning("设备离线");
        return;
      }
      if (
        !this.checkedChannel ||
        checkedChannel.channelUuid !== this.checkedChannel.channelUuid
      ) {
        this.checkedChannel = checkedChannel;
        this.getRtspInChannelUuid(checkedChannel.channelUuid, true);
      }
    },
    // 布控任务通道ID获取码流参数
    getRtspInChannelUuid(channelUuid, isBool) {
      let data = {
        channelUuid: channelUuid,
        projectUuid: this.checkedChannel.projectUuid,
        streamType: this.streamType
      };
      // 停止上一个视频的播放
      if (this.video) {
        this.video_mgr.stop(this.video);
        this.canvas = null;
        this.$refs.canvasRefs.innerHTML = "";
        document.getElementById("poster_img").style.display = "block";
        document.getElementById("player").style.display = "none";
      }
      api2
        .getPreviewInfo(data, {
          modelName: "车辆识别",
          type: "过车预览",
          detailContent: `过车预览-${this.checkedChannel.nickName}`
        })
        .then(res => {
          if (res.data.success) {
            let data = res.data.data;
            Object.assign(this.checkedChannel, data);
            this.loadVideo(this.checkedChannel);
          }
        })
        .catch(() => {});
    },
    getPreviewInfoAA(data) {
      return new Promise(resolve => {
        api2.getPreviewInfoAA(data).then(res => {
          let data = res.data.data || {};
          resolve(data);
        });
      });
    },
    async loadVideo(data) {
      if (!this.OwnAuthDisabled) return;
      if (data) {
        this.lastRstpUrl = data.rtspUrl;
      } else {
        data = {
          rtspUrl: this.lastRstpUrl
        };
      }
      // 获取流媒体服务地址参数
      let { jDescription } = this.$store.getters;
      if (jDescription && !jDescription.list) {
        console.log(data.projectUuid);
        let signData = await this.getPreviewInfoAA({
          asgName: this.checkedChannel.projectUuid
        });
        console.log(signData);
        this.$store.commit("setJDescription", signData);
        jDescription = signData;
      }
      if (!this.video_mgr) {
        // eslint-disable-next-line
        this.video_mgr = new CVideoMgrSdk();
      }
      if (!this.canvas) {
        this.canvas = document.createElement("video");
      }
      // 设置新的视频对象播放参数
      console.log(jDescription);
      this.video = await this.video_mgr.setup({
        element: this.canvas,
        decodeMod: "video",
        jDescription,
        webProtocol: window.location.protocol,
        url: data.rtspUrl,
        protocol: "rtsp",
        action: "preview",
        speed: 1,
        file: ""
      });
      // 检测到新的播放视频对象
      if (this.video) {
        await this.video_mgr.play(this.video);
      }
      if (document.getElementById("poster_img")) {
        document.getElementById("poster_img").style.display = "none";
        document.getElementById("player").style.display = "block";
      }
      this.$refs.canvasRefs.innerHTML = "";
      this.$refs.canvasRefs.appendChild(this.canvas);
    },
    // 画折线图
    drawLine() {
      let dom = document.getElementById("bayonet_bar_bot");
      let w = this.WIDTH();
      w = w - 200;
      this.$refs.bayonetCanvas.$el.style.width = w - 520 + "px";
      this.$refs.bayonetCanvas.$el.style.height = 200 + "px";
      console.log(this.$refs.bayonetCanvas.$el.style.width);
      if (!dom) {
        return;
      }
      dom.style.width = this.$refs.bayonetCanvas.$el.style.width;
      dom.style.height = this.$refs.bayonetCanvas.$el.style.height;

      let myChart = this.$echarts.init(dom);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
      let app = {};
      let option = null;
      app.title = "坐标轴刻度与标签对齐";
      option = {
        tooltip: {
          trigger: "axis",
          show: true,
          axisPointer: {
            type: "none"
          }
        },
        textStyle: {
          color: "#666666"
        },
        grid: {
          left: "4%",
          right: "3%",
          top: "10",
          bottom: "20"
        },
        xAxis: {
          type: "category",
          // interval: 10,
          boundaryGap: false,
          splitLine: {
            show: false,
            lineStyle: {
              color: ["#666666"],
              opacity: 0.6
            }
          },
          data: Array.from({ length: 24 }, (v, i) => i)
        },
        yAxis: {
          // name: '车流量统计结果(日)',
          type: "value",
          boundaryGap: true,
          axisLabel: {
            formatter: "{value}"
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#666666"],
              opacity: 0.6
            }
          }
        },
        series: [
          {
            type: "line",
            color: ["#28FFBB"],
            smooth: false,
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#28FFBB" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(40,253,186,0.00)" // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#28FFBB" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(40,253,186,0.00)" // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            data: this.photoStaticList
          }
        ]
      };

      if (option && typeof option === "object") {
        myChart.setOption(option, true);
        // myChart.resize();
      }
    },
    WIDTH: function() {
      return (
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      );
    },
    HEIGHT: function() {
      return (
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      );
    }
  }
};
</script>
<style lang="scss">
.bayonetPopoverClass {
  width: 500px;
  height: 230px;
  position: absolute;
  background: #202127;
  min-width: 150px;
  border: 1px solid #ebeef5;
  padding: 12px;
  z-index: 2000;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-height: 80%;
  overflow: auto;
}
#player video {
  width: 100%;
  height: 100%;
}
.bayonetPreview #bayonet_bar_bot {
  background: rgba(33, 35, 37, 1);
  padding: 10px 20px;
  box-sizing: border-box;
  height: 200px;
}
.bayonetPreview a:-webkit-any-link {
  cursor: pointer;
  color: #28ffbb !important;
  text-decoration: none;
  margin-left: 10px;
}
.bayonetPreview .el-button--text {
  color: #dddddd;
  margin: 0 13px;
}
</style>
<style lang="scss" scoped>
.bayonetPreview {
  height: 100%;
  .el-container {
    height: 100%;
    padding: 0 30px 30px;
    .main-box {
      position: relative;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      box-sizing: border-box;
      background: transparent;
      background: rgba(36, 39, 42, 1);
      #poster_img {
        width: 100%;
        height: 100%;
        background: transparent url("../../../assets/poster.png") no-repeat
          center 100%;
        background-size: 100% 100%;
        background-clip: content-box;
        background-origin: content-box;
        box-sizing: border-box;
      }
    }
    .footerTopRow {
      width: 100%;
      height: 60px;
      line-height: 60px;
      font-size: 14px;
      color: #dddddd;
      padding: 0 15px;
      .el-col {
        img {
          width: 14px;
          height: 14px;
          margin-right: 15px;
        }
      }
    }
    .footerRowClass {
      margin: 0 !important;
      height: 200px;
      background: #212325;
      box-sizing: border-box;
      padding: 27px 15px 25px;
    }
    .el-footer {
      padding: 0;
    }
  }
  .el-aside {
    height: 100%;
    background: #212325;
    line-height: 60px;
    .asideHeaderClass {
      display: flex;
      justify-content: space-between;
      button {
        margin-left: 10px;
        background-color: transparent;
        font-family: "PingFangSC-Regular";
        font-size: 14px;
        color: #26d39d;
        letter-spacing: 0;
        color: #26d39d;
        border: none;
      }
    }
    .asideBody {
      height: calc(100% - 60px);
      padding-left: 25px;
      padding-right: 35px;
      padding-bottom: 10px;
      box-sizing: border-box;
      .asideBodyCell {
        height: calc((100% - 80px) / 4);
        margin-bottom: 20px;
      }
    }
  }
}
</style>
