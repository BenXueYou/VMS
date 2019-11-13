
<template>
  <div id="MBAnalysis" class="MBAnalysisClass">
    <el-row type="flex" class="row-bg" justify="center" ref="heightBox">
      <el-container style>
        <el-header>
          <el-popover
            ref="popverBox"
            popper-class="MBelPopoverClass"
             default-expand-all
            :visible-arrow="false"
            :value="visible_popver"
            @show="popverShow"
            @hide="popverHidden"
            placement="right"
            trigger="click"
          >
            <!-- 以下iframe标签是为了VLC播放的遮挡 -->
            <iframe
              style="position:absolute;
                            visibility:inherit;
                            top:0px; left:0px;
                            width:100%;
                            height:100%;
                            border:0;
                            allowTransparency=true;
                            background:transparent;
                            filter='Alpha(style=0,opacity=0)';"
            ></iframe>
            <el-row
              style="width:100%;height:100%;display:flex;flex-wrap:nowrap;justify-content:flex-start"
            >
              <el-row
                class="taskParent"
                style="width:245px;border-right:1px solid rgb(104,103,102)"
              >
                <el-tree :data="deviceTreeList" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree>
              </el-row>
              <el-row class="taskParent" style>
                <div class="checkBoxTitle">
                  <el-checkbox
                    style="padding-left:15px;color:gray"
                    v-model="checkAll"
                    @change="handleCheckAllChange"
                  >只呈现单路摄像机</el-checkbox>
                </div>
                <el-radio-group
                  v-if="channelInfoList.length"
                  class="taskParent MBelRadioClass"
                  v-model="checkedChannel"
                  @change="handleCheckedChange"
                >
                  <el-radio
                    style="margin:11px 15px 12px"
                    v-for="channelItem in channelInfoList"
                    :label="channelItem"
                    :key="channelItem.id"
                  >{{channelItem.label}}</el-radio>
                </el-radio-group>
                <el-row v-else style="margin:15px;color:#ffffff">任务没有关联摄像机</el-row>
              </el-row>
            </el-row>
            <el-row slot="reference">
              <img src="@/assets/sxj.png" alt>
              <el-button class="leftflexButton">选择摄像机</el-button>
              <img src="@/assets/drop-down.png" alt>
            </el-row>
          </el-popover>
        </el-header>
        <el-main
          style="position: relative;"
          ref="mainHeightBox"
          v-loading="mainVideoScreenLoading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <!-- 视频播放区域 -->
          <div class="main-box">
            <div id="poster_img"></div>
            <div
              id="player"
              style="text-align:center;height:100%;object-fit:fill;width:100%;z-inex:2"
            ></div>
          </div>
        </el-main>
        <!-- 底部人脸抓拍记录图片list -->
        <el-footer :height="footerHeight">
          <el-row type="flex" justify="space-between" class="footer-top-row">
            <el-col :span="8" class="imgTxtClass" style="min-width: 115px;text-align:left;">
              <img
                style="margin-right:24px"
                :src="footerLiftType?require('@/assets/icon/stream-people.png'):require('@/assets/icon/face-photo.png')"
              >
              <span>{{!footerLiftType?"人体抓拍：":"人流量统计结果"}}</span>
              <span v-if="!footerLiftType">{{todayShootCount}}张</span>
            </el-col>
            <el-col
              :span="16"
              style="text-align:right;padding-right:12px;color:#ffffff; font-size:14px;"
              class="asidFontColor"
            >
              <router-link
                class="fontTheme"
                to="MBAnalysisRecord"
                style="padding:0px 6px 0 30px;font-size:14px"
              >
                更多
                <img style="margin-left:6px" src="@/assets/icon/more.png" alt="更多">
              </router-link>
              <el-switch
                @change="footerTypeAct"
                v-model="footerLiftType"
                active-color="rgb(11,49,49)"
                inactive-color="rgb(11,49,49)"
              ></el-switch>
            </el-col>
          </el-row>
          <el-row
            type="flex"
            v-show="!footerLiftType"
            class="footerRowClass"
            justify="space-between"
          >
            <el-col
              ref="footerCardImgHeight"
              class="footerCardClass"
              :span="4"
              v-for="(o,index) in 6"
              :key="index"
            >
              <el-row type="flex" justify="center" style="width:100%;height:45%;" :gutter="10">
                <el-col class="foot-box" :span="16">
                  <img
                    class="foot-img1"
                    :src="(photoList[index])&&(photoList[index].photouri)?photoList[index].photouri:require('@/assets/user.png')"
                  >
                </el-col>
                <el-col class="foot-box" :span="8" style="padding-right:0px">
                  <img
                    class="foot-img2"
                    :src="(photoList[index])&&(photoList[index].bodyuri)?photoList[index].bodyuri:require('@/assets/user.png')"
                  >
                </el-col>
              </el-row>
              <el-row style="width:100%;height:20%;padding:5px 0 0px 0px;display:flex;">
                <el-col :span="10" class="foot-box footer-left-txt">
                  <span>抓拍时间：</span>
                  <span>抓拍地点：</span>
                </el-col>
                <el-col :span="14" class="foot-box foot-box-span">
                  <span
                    style="width:100%"
                    class="footerChannelName textclipsClass"
                    @mouseover="mymouseover"
                    @mouseout="mymouseout"
                    @mousemove="mymousemove"
                  >
                    {{
                    (photoList[index])&&
                    (photoList[index].time)?photoList[index].time:'--'
                    }}
                  </span>
                  <span
                    style="width:100%"
                    class="footerChannelName textclipsClass"
                    @mouseover="mymouseover"
                    @mouseout="mymouseout"
                    @mousemove="mymousemove"
                  >
                    {{
                    (photoList[index])&&
                    (photoList[index].channelName)?photoList[index].channelName:'--'
                    }}
                  </span>
                </el-col>
              </el-row>
              <el-row style="width:100%;height:35%;display:flex;">
                <el-col :span="14" class="foot-box footer-left-txt">
                  <span>性别：</span>
                  <span>是否戴眼镜：</span>
                  <span>上身服饰颜色：</span>
                  <span>下身服饰颜色：</span>
                </el-col>
                <el-col :span="10" class="foot-box foot-box-span">
                  <span style="width:100%">
                    {{
                    (photoList[index])&&
                    (photoList[index].bodyInfo)&&
                    (photoList[index].bodyInfo.gender)?photoList[index].bodyInfo.gender.name:'--'
                    }}
                  </span>
                  <span style="width:100%">
                    {{
                    (photoList[index])&&
                    (photoList[index].bodyInfo)&&
                    (photoList[index].bodyInfo.glasses)?photoList[index].bodyInfo.glasses.name:'--'
                    }}
                  </span>
                  <span style="width:100%">
                    {{
                    (photoList[index])&&
                    (photoList[index].bodyInfo)&&
                    (photoList[index].bodyInfo.upper_color)?photoList[index].bodyInfo.upper_color.name:'--'
                    }}
                  </span>
                  <span style="width:100%">
                    {{
                    (photoList[index])&&
                    (photoList[index].bodyInfo)&&
                    (photoList[index].bodyInfo.lower_color)?photoList[index].bodyInfo.lower_color.name:'--'
                    }}
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row
            class="bar_botClass"
            v-loading.body="fullscreenLoading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            v-show="footerLiftType"
          >
            <el-row ref="canvsWidth" id="bar_bot"></el-row>
          </el-row>
        </el-footer>
      </el-container>
      <!-- 右侧人脸对比card list -->
      <el-aside :width="asideWidth" class="asidClass">
        <el-row type="flex" justify="space-between" class="aside-row">
          <el-col :span="12" class="textclipsClass fontColor asidHeader" style="over-flow:hidden">
            <div class="asidColumsLeftClass imgTxtClass" style="float:left;">
              <img style="margin-right:12px" src="@/assets/sxj.png">
              <span class="el-dropdown-link textclipsClass">抓拍相机：</span>
            </div>
            <div style="min-width:60px;float:left;height:30px;line-height:30px;">
              <!-- <el-tree></el-tree> -->
              <span
                class="textclipsClass"
                @mouseover="mymouseover"
                @mouseout="mymouseout"
                @mousemove="mymousemove"
              >{{checkedChannelName}}</span>
            </div>
          </el-col>
          <el-col :span="12" class="asidFontColor asidColumsRightClass imgTxtClass">
            <span
              class="asidFontColor"
              style="margin-right:12px;"
              @mouseover="mymouseover"
              @mouseout="mymouseout"
              @mousemove="mymousemove"
            >今日人数：{{todayCompareCount}}人</span>
            <router-link class="fontTheme" to="MBAnalysisRecord">更多</router-link>
            <img style="padding-right:15px" src="@/assets/icon/more.png">
          </el-col>
        </el-row>
        <el-row class="asidListBox">
          <div
            class="asidListRow"
            v-for="(o,index) in 2"
            :key="index"
            @dblclick="dialogAction(index)"
          >
            <el-row class="asidListRowHeader">
              <el-col :span="10" class="asidListRowFooter textclipsClass">
                <img style="padding-right:8px" src="@/assets/icon/address.png" alt>
                <span
                  @mouseover="mymouseover"
                  @mouseout="mymouseout"
                  @mousemove="mymousemove"
                  class="textclipsClass"
                  style="font-size:14px;color:#cccccc"
                >
                  {{(comparePhotoList[index])&&
                  (comparePhotoList[index].channelName)?comparePhotoList[index].channelName:'未知任务通道'}}
                </span>
              </el-col>
              <el-col :span="10" class="asidListRowFooter textclipsClass">
                <img style="padding-right:8px" src="@/assets/time.png" alt>
                <span
                  @mouseover="mymouseover"
                  @mouseout="mymouseout"
                  @mousemove="mymousemove"
                  class="textclipsClass"
                  style="font-size:14px;color:#FFFFFF"
                >
                  时间：{{(comparePhotoList[index])&&
                  (comparePhotoList[index].time)?comparePhotoList[index].time.split(" ")[1].substring(0,comparePhotoList[index].time.split(" ")[1].length-2):'----:--:--'}}
                </span>
              </el-col>
              <el-col
                :span="4"
                class="asidListRowFooter imgTxtClass"
                style="justify-content:flex-end;line-height:16px"
              >
                <span class="fontColor fontTheme" @click="dothis(index)">详情</span>
                <img style="margin-left:10px" src="@/assets/icon/details.png">
              </el-col>
            </el-row>

            <el-row class="asidListRowBody" type="flex" justify="space-between" :gutter="10">
              <el-col :span="8" class="asidCompareBox">
                <div class="asidCompareImgBox">
                  <img
                    class="asidCardImg"
                    :src="(comparePhotoList[index])&&
                                        (comparePhotoList[index].faceUrl)?comparePhotoList[index].faceUrl:require('@/assets/user.png')"
                  >
                </div>
              </el-col>
              <el-col :span="4" class="asidCompareBox">
                <div class="asidCompareBodyImgBox">
                  <img
                    class="asidCardImg"
                    :src="(comparePhotoList[index])&&
                                    (comparePhotoList[index].bodyUrl)?comparePhotoList[index].bodyUrl:require('@/assets/user.png')"
                  >
                </div>
              </el-col>
              <el-col :span="4" style="display: flex;text-align:center;width:50px">
                <el-progress
                  style="min-width:50px;margin:auto;color:#28ffbb;font-size:14px;"
                  :stroke-width="2"
                  :width="50"
                  type="circle"
                  color="#ffffff"
                  :percentage="(comparePhotoList[index])&&
                                    (comparePhotoList[index].score)?parseInt(comparePhotoList[index].score.toFixed(0)):0"
                ></el-progress>
              </el-col>
              <el-col :span="8" class="asidCompareBox">
                <div class="asidCompareImgBox">
                  <img
                    class="asidCardImg"
                    :src="(comparePhotoList[index])&&
                                        (comparePhotoList[index].staffInfo)?comparePhotoList[index].staffInfo.photoUri:require('@/assets/user.png')"
                  >
                </div>
              </el-col>
            </el-row>

            <el-row class="asidListRowBottom" type="flex" justify="space-between">
              <el-col :span="12" class="asidCompareTxtClass" style="padding-left:2%;">
                <el-row :gutter="15">
                  <el-col :span="16" class="asid-row-left foot-box">
                    <span>上身服饰：</span>
                    <span>下身服饰：</span>
                    <span>上身服饰颜色：</span>
                    <span>下身服饰颜色：</span>
                    <span>上身服饰纹理：</span>
                    <span>背包：</span>
                    <span>上身服饰细分类：</span>
                    <span>是否戴帽子：</span>
                    <span>是否戴眼镜：</span>
                    <span>身体朝向：</span>
                    <span>是否手提物：</span>
                  </el-col>
                  <el-col
                    :span="8"
                    class="foot-asid-txt foot-box"
                    style="border-right:1px dashed rgba(40,255,187,0.3);"
                  >
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].bodyInfo)&&
                      (comparePhotoList[index].bodyInfo.upper_wear)?comparePhotoList[index].bodyInfo.upper_wear.name:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].bodyInfo)&&
                      (comparePhotoList[index].bodyInfo.lower_wear)?comparePhotoList[index].bodyInfo.lower_wear.name:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].bodyInfo)&&
                      (comparePhotoList[index].bodyInfo.upper_color)?comparePhotoList[index].bodyInfo.upper_color.name:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].bodyInfo)&&
                      (comparePhotoList[index].bodyInfo.lower_color)?comparePhotoList[index].bodyInfo.lower_color.name:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].bodyInfo)&&
                      (comparePhotoList[index].bodyInfo.upper_wear_texture)?comparePhotoList[index].bodyInfo.upper_wear_texture.name:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].bodyInfo)&&
                      (comparePhotoList[index].bodyInfo.bag)?comparePhotoList[index].bodyInfo.bag.name:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].bodyInfo)&&
                      (comparePhotoList[index].bodyInfo.upper_wear_fg)?comparePhotoList[index].bodyInfo.upper_wear_fg.name:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].bodyInfo)&&
                      (comparePhotoList[index].bodyInfo.headwear)?comparePhotoList[index].bodyInfo.headwear.name:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].bodyInfo)&&
                      (comparePhotoList[index].bodyInfo.glasses)?comparePhotoList[index].bodyInfo.glasses.name:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].bodyInfo)&&
                      (comparePhotoList[index].bodyInfo.orientation)?comparePhotoList[index].bodyInfo.orientation.name:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].bodyInfo)&&
                      (comparePhotoList[index].bodyInfo.carrying_item)?comparePhotoList[index].bodyInfo.carrying_item.name:'--'}}
                    </span>
                  </el-col>
                </el-row>
              </el-col>

              <el-col :span="12" class="asidCompareTxtClass" style="padding-left:6%">
                <el-row :gutter="15">
                  <el-col :span="8" class="asid-row-left foot-box">
                    <span>姓名：</span>
                    <span>性别：</span>
                    <span>所属库：</span>
                    <span>出生日期：</span>
                    <span>民族：</span>
                    <span>证件号：</span>
                    <span>籍贯：</span>
                    <span>户籍地址：</span>
                    <span>入库时间：</span>
                    <span>案件编号：</span>
                  </el-col>

                  <el-col :span="16" class="foot-asid-txt foot-box">
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].staffInfo)?comparePhotoList[index].staffInfo.staffName:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].staffInfo)?comparePhotoList[index].staffInfo.staffsex==='female'?'女':'男':'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].staffInfo)?comparePhotoList[index].staffInfo.libraryName:'--'}}
                        <i v-if="(comparePhotoList[index])&&(comparePhotoList[index].staffInfo.librarycolor)"
                          class='el-icon-warning'
                          :style="{'color':comparePhotoList[index].staffInfo.librarycolor}"></i>
                        <i v-else
                          class='el-icon-warning'
                          :style="{'color':'#28FFBB'}"></i>
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].staffInfo)&&
                      (comparePhotoList[index].staffInfo.birthdate)?comparePhotoList[index].staffInfo.birthdate:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].staffInfo)&&
                      (comparePhotoList[index].staffInfo.nation)?comparePhotoList[index].staffInfo.nation:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].staffInfo)&&
                      (comparePhotoList[index].staffInfo.credentialNo)?comparePhotoList[index].staffInfo.credentialNo:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].staffInfo)&&
                      (comparePhotoList[index].staffInfo.nativePlace)?comparePhotoList[index].staffInfo.nativePlace:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].staffInfo)&&
                      (comparePhotoList[index].staffInfo.domicileAddress)?comparePhotoList[index].staffInfo.domicileAddress:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].staffInfo)&&
                      (comparePhotoList[index].staffInfo.staffCreatetime)?comparePhotoList[index].staffInfo.staffCreatetime:'--'}}
                    </span>
                    <span>
                      {{(comparePhotoList[index])&&
                      (comparePhotoList[index].staffInfo)&&
                      (comparePhotoList[index].staffInfo.fugitiveNo)?comparePhotoList[index].staffInfo.fugitiveNo:'--'}}
                    </span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </el-aside>
    </el-row>
  </div>
</template>

<script>
import dialogview from "@/pages/faceModule/components/dialogForm.vue";
import { mouseover, mouseout, mousemove } from "@/common/mouse.js"; // 注意路径
// let id = 1000;
export default {
  name: "MBAnalysis",
  components: { dialogview },
  data: function(argument) {
    return {
      checkedTaskUUidList: [],
      canvsWidth: "300px",
      headHeight: "60px",
      footerHeight: "60px",
      asideWidth: "60px",
      asidDropdownMednu: "任务一", // 选中的任务
      dialogVisible: false, // 彈窗顯示標記
      dialogParama: "弹窗视图的参数",
      footerLiftType: false, // 抓拍記錄與車流量統計的切換
      searchWords: "", // 搜索的關鍵字
      taskItemList: {}, // 布控任務列表
      taskItem: null, // 当前任务
      visible_popver: false, // task弹窗是否弹出，默认隐藏
      rtspAddress: "", // rtsp://admin:gfy12345@192.168.9.200/Streaming/Channels/101
      channelInfoList: [], // 所有通道名称和ID的二元list
      checkedRtspList: new Array(), // 选中的轮询通道Rtsp地址
      channelUuidList: [],
      checkAll: false, // 通道勾选的list的长度
      checkedChannelsUuidList: new Array(), // 当前勾选的通道Id的list
      checkedChannel: "",
      checkedChannelsUuid: "1", // 当前轮询的ID
      websocket: null,
      photoList: new Array(), // 抓拍列表
      comparePhotoList: new Array(), // 人臉對比列表
      photoStaticList: [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ], // 人流量统计
      socketIP: this.$store.state.socketIP, //
      todayShootCount: 0, // 今日抓拍次数
      todayCompareCount: 0, // 今日对比次数
      streamType: "main_stream",
      fullscreenLoading: false, // 局部遮罩是否显示
      mainVideoScreenLoading: false, // 视频遮罩是否显示
      checkTimeConst: 3600000, // 轮询时间1小时获取一次数据统计分布图 3600000
      startTime: "",
      endTime: "",
      shootPhotoList: null,
      deviceTreeList: [],
      deviceDataList: [],
      defaultProps: {
        label: "label"
      },
      vlcObj: this.$store.state.vlcObj,
      checkedChannelName: "全部摄像机",
      outTimer: null,
      MBVlc: false,

    };
  },
  mounted: function() {
    let h =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    let w =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    w = w - 120;
    h = h - 5;
    this.$refs.mainHeightBox.$el.style.height = (7 * h) / 10 + "px";
    this.footerHeight = (3 * h) / 10 + "px";
    this.asideWidth = w / 3 - 40 + "px";

    this.$refs.canvsWidth.$el.style.width = w / 3 - 100 + "px";
    this.$refs.canvsWidth.$el.style.height = (h * 3) / 10 - 100 + "px";
    this.$refs.heightBox.$el.style.height = h + "px";
    // 当窗口发生变化时
    let that = this;
    window.addEventListener("resize", function() {
      let h =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      let w =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      w = w - 120;
      h = h - 5;
      that.$refs.mainHeightBox.$el.style.height = (7 * h) / 10 + "px";
      that.footerHeight = (3 * h) / 10 + "px";
      that.asideWidth = w / 3 - 40 + "px";
      that.$refs.heightBox.$el.style.height = h + "px";
      that.$refs.canvsWidth.$el.style.width = w / 3 - 100 + "px";
      that.$refs.canvsWidth.$el.style.height = (h * 3) / 10 - 100 + "px";
      that.drawLine();
    });

    var player = document.getElementById("player");
    player.innerHTML = this.vlcObj;
    this.MBVlc = document.getElementById("vlc");

    this.startTime = this.$common.getStartTime();
    this.endTime = this.getEndTime();

    this.checkedChannel = this.$store.getters.getCheckedMBChannel;
    this.rtspAddress = this.$store.getters.getCheckedMBRtspUrl;

    if (this.rtspAddress) {
      this.loadVideo(this.rtspAddress);
      this.getBodyDeviceList(false);
    } else {
      // 获取设备列表
      this.getBodyDeviceList(true);
    }
  },

  destroyed: function() {
    console.log("关闭页面");
    this.websocket.close();
    this.websocket = null;
    clearTimeout(this.outTimer);
    // var vlc = document.getElementById("vlc");
    this.MBVlc.playlist.stop();
    // vlc.playlist.items.clear();
    var player = document.getElementById("player");
    player.innerHTML = '';
  },
  watch: {
    checkedChannelsUuidList: {
      handler: function(newVal, oldVal) {
        if (newVal.length === 1) {
          for (var i = 0; i < this.channelInfoList.length; i++) {
            var temp = this.channelInfoList[i];
            if (temp.id === newVal[0]) {
              this.checkedChannelName = temp.label;
              break;
            }
          }
        } else {
          this.channelName = "全部摄像机";
        }
      },
      deep: true
    }
  },
  methods: {
    getBodyDeviceList(isBool) {
      this.$store.dispatch("getBodyDeviceList").then(res => {
        console.log("getBodyDeviceList", res);
        if (res.result === 0) {
          var treeArray = res.data;
          this.deviceTreeList = res.data;
          // 深拷贝保存一份源数据
          this.deviceDataList = JSON.parse(JSON.stringify(treeArray));
          // 默认通道列表
          this.channelInfoList = [];
          this.getChildren(this.deviceDataList, this.channelInfoList);
          // 默认的通道id list
          this.initChannelInfoList(this.channelInfoList, isBool);

          if (isBool) {
            // 默认通道
            this.checkedChannel = this.channelInfoList[0];
            // 默认的码流地址
            this.checkedChannelsUuid = this.channelInfoList[0].id;
            this.getRtspInChannelUuid(this.checkedChannelsUuid, isBool);
          }
          // 页面刚进入时开启长连接
          this.initWebSocket();

          // 递归去通道
          this.hasChildren(this.deviceTreeList);
        } else {
          this.$message({ message: "设备列表更新失败", type: "error" });
        }
      });
    },
    // 递归查找被选择的设备节点的通道列表
    getChannelInfoList(data, id) {
      for (let index = 0; index < data.length; index++) {
        if (data[index].id === id) {
          return data[index].children;
        } else {
          return this.getChannelInfoList(data[index].children, data[index].id);
        }
      }
    },

    // 递归查找所有的设备节点的通道列表
    getChildren(data, arr) {
      if (!data || data.length === 0) {
        return;
      }
      for (let index = 0; index < data.length; index++) {
        if (!data[index].children) {
          arr.push(JSON.parse(JSON.stringify(data[index])));
        } else {
          this.getChildren(data[index].children, arr);
        }
      }
    },
    // 递归去掉设备树的通道节点，建立设备树节点
    hasChildren(data) {
      if (!data && data.length === 0) {
        return;
      }
      for (let index = 0; index < data.length; index++) {
        if (data[index].children === null) {
          data.splice(index, 1);
          index = index - 1;
        } else {
          this.hasChildren(data[index].children);
        }
      }
    },
    // 点击左边设备树的事件
    handleNodeClick(data, node) {
      if (data) {
        this.channelInfoList = [];
        var _this = this;
        _this.getChannelInfoList(_this.deviceDataList, data.id, _this);
      }
    },
    // // 递归查找被选择的设备节点的通道列表
    // getChannelInfoList(data, id, _this) {
    //   for (var index = 0; index < data.length; index++) {
    //     if (data[index].id === id) {
    //       var arr = data[index].children;
    //       _this.getChildren(arr, _this.channelInfoList);
    //       break;
    //     } else {
    //       if (!data[index].children || data[index].children.length === 0) {
    //         continue;
    //       }
    //       this.getChannelInfoList(data[index].children, id, _this);
    //     }
    //   }
    // },
    // // 获取子节点的叶子
    // getChildren(data, arr) {
    //   if (!data || data.length === 0) {
    //     return;
    //   }
    //   for (let index = 0; index < data.length; index++) {
    //     if (data[index].children === null) {
    //       arr.push(JSON.parse(JSON.stringify(data[index])));
    //     } else {
    //       this.getChildren(data[index].children, arr);
    //     }
    //   }
    // },
    // 只呈现单路摄像机
    handleCheckAllChange(val) {
      console.log("默认勾选单路摄像机，改变对比列表数据以及抓拍数据", val);
      this.checkAll = val;
      if (val) {
        // 勾了单选
        this.checkedChannelsUuidList = [];
        this.checkedChannelsUuidList[0] = this.checkedChannelsUuid;
        this.$store.commit("setCheckedMBChannel", this.checkedChannel);
      } else {
        // 去掉单选
        this.checkedChannelsUuidList = this.channelUuidList;
      }
      // 更新抓拍数据和统计数据
      this.todayShootCount = 0;
      this.todayCompareCount = 0;
      this.getPhotoList();
      this.getShootPhotoNum();
      this.getComparePhotoList();
      this.getCompareNum();
      this.getPhotoStaticList();
    },
    // 选中某通道
    handleCheckedChange(value) {
      console.log("选中某通道------", this.checkedChannel);
      this.$store.commit("setCheckedMBChannel", this.checkedChannel);
      if (this.checkAll) {
        this.checkedChannelsUuidList = [];
        this.checkedChannelsUuidList[0] = this.checkedChannel.id;
      }
      this.checkedChannelsUuid = this.checkedChannel.id;
      this.getRtspInChannelUuid(this.checkedChannelsUuid, true);
      this.visible_popver = false;

      if (this.checkAll) {
        this.todayShootCount = 0;
        this.todayCompareCount = 0;
        this.getPhotoList();
        this.getShootPhotoNum();
        this.getComparePhotoList();
        this.getCompareNum();
        this.getPhotoStaticList();
      }
    },

    // 组建通道树
    initChannelInfoList(channelInfoList, isBool) {
      this.channelUuidList = [];

      for (let j = 0; j < channelInfoList.length; j++) {
        // 默认的全部通道的id list
        this.channelUuidList.push(this.channelInfoList[j].id);
      }
      // if (!this.checkAll) {
      //   this.checkedChannelsUuidList = this.channelUuidList;
      // } else {
      //   this.checkedChannelsUuidList = [];
      //   this.checkedChannelsUuidList[0] = this.channelUuidList[0];
      // }

      if (this.checkedChannel === '') {
        this.checkedChannelsUuidList = this.channelUuidList;
        this.checkAll = false;
      } else {
        this.checkAll = true;
        this.initCheckedChannel();
      }

      // 获取抓拍数据

      this.todayShootCount = 0;
      this.todayCompareCount = 0;
      this.getPhotoList();
      this.getShootPhotoNum();
      this.getComparePhotoList();
      this.getCompareNum();
    },

    // 布控任务通道ID获取码流参数
    getRtspInChannelUuid(channelUuidArr, isBool) {
      let paramsArray = [];
      let channelIdObj = {
        channeluuid: this.checkedChannel.id,
        streamType: this.streamType
      };
      paramsArray.push(channelIdObj);

      this.$store.dispatch("getRTSPAddress", paramsArray).then(res => {
        console.log("获取码流地址：", res);
        if (res.result === 0) {
          for (let i = 0; i < res.data.length; i++) {
            let item = res.data[i];
            this.rtspAddress = item.deviceRtspUrl;
            this.$store.commit("setCheckedMBRtspUrl", this.rtspAddress);
          }
          if (isBool) {
            // 视频通道回去完成之后开始播放
            this.loadVideo(this.rtspAddress);
          }
        } else {
          this.$message({ message: "获取码流地址错误", type: "error" });
        }
      });
    },

    // 获取抓拍记录
    getPhotoList(currentPage = 1, pageSize = 6) {
      this.photoList = []; // 清除记录
      this.mainScreenLoading = true;
      var params = {};
      params.pageSize = pageSize;
      params.currentPage = currentPage;
      if (this.startTime) {
        params.starttime = this.$common.getStartTime();
      }
      if (this.endTime) {
        params.overtime = this.$common.getCurrentTime();
      }
      this.$store.dispatch("getMBodyRecordList", params).then(res => {
        this.mainScreenLoading = false;
        if (res.result === 0 && res.data.list && res.data.list.length) {
          // this.photoList = res.data.list;
          for (var i = 0; i < res.data.list.length; i++) {
            var temp = res.data.list[i];
            var tempObj = {
              time: temp.time,
              channelName: temp.channelName,
              bodyInfo: {
                gender: { name: temp.gender },
                glasses: { name: temp.glasses },
                upper_color: { name: temp.uppercolor },
                lower_color: { name: temp.lowercolor }
              },
              photouri: temp.photouri,
              bodyuri: temp.bodyuri
            };
            this.photoList.push(tempObj);
          }
        } else {
          this.$message({ message: "没有查找到相关的记录", type: "warning" });
        }
      });
    },

    // 获取布控任务对比列表信息
    getComparePhotoList() {
      this.mainScreenLoading = true;
      var channeluuid = "";
      if (this.checkedChannelsUuidList && this.checkedChannelsUuidList.length === 1) {
        channeluuid = this.checkedChannelsUuidList[0];
      }
      this.$store.dispatch("getBobyRecList", channeluuid).then(res => {
        this.mainScreenLoading = false;
        // debugger;
        this.comparePhotoList = [];
        if (res.result === 0) {
          this.comparePhotoList = res.data;
        } else {
          this.$message({
            message: "没有查找到相关的对比记录",
            type: "warning"
          });
        }
      });
    },

    // 获取人流量分布统计
    getPhotoStaticList() {
      this.fullscreenLoading = true;

      var data = {
        channelUuids: this.checkedChannelsUuidList,
        currentTime: this.$common.formatDate(new Date()).substr(0, 10)
      };
      this.photoStaticList = [];
      for (let i = 0; i < 25; i++) {
        this.photoStaticList.push(0);
      }
      this.$store.dispatch("getStaticHourCount", data).then(res => {
        this.fullscreenLoading = false;
        if (res.result === 0) {
          for (let index in this.photoStaticList) {
            for (let item of res.data) {
              if (parseInt(item.currenttime.substr(11, 2)) === parseInt(index)) {
                this.photoStaticList[index] = item.count;
              }
            }
          }
          this.drawLine();
        } else {
          this.$message({ message: "人流量统计错误", type: "warning" });
        }
      });
    },

    // 对比次数初始化 GET /v1/face/dispatching/compare/recognized/count
    getCompareNum() {
      var channeluuid = "";
      if (this.checkedChannelsUuidList && this.checkedChannelsUuidList.length === 1) {
        channeluuid = this.checkedChannelsUuidList[0];
      }
      this.$store
        .dispatch("getBobyRecNum", channeluuid)
        .then(res => {
          if (res.result === 0) {
            this.todayCompareCount = res.data;
          } else {
            this.$message({ message: "获取对比次数失败", type: "warning" });
          }
        });
    },
    // 抓拍次数的初始化
    // http://180.167.205.76:9000/v1/face/dispatching/snapshot/count?channelUuid=1
    getShootPhotoNum() {
      var data = {
        channelUuids: this.checkedChannelsUuidList.toString(),
        currentTime: this.$common.getCurrentTime()
      };
      this.$store.dispatch("getShootPhotoCount", data).then(res => {
        if (res.result === 0 && res.data) {
          console.log(res.data.shootNum, "--", this.todayShootCount);
          this.todayShootCount += res.data.count;
          console.log(res.data, "--", this.todayShootCount);
        } else {
          this.$message({ message: "获取抓拍次数失败", type: "warning" });
        }
      });
    },
    initWebSocket() {
      // 初始化weosocket

      if (this.websocket) {
        return;
      }
      this.websocket = new WebSocket(this.socketIP);
      this.websocket.onopen = this.websocketonopen;
      this.websocket.onerror = this.websocketonerror;
      this.websocket.onmessage = this.websocketonmessage;
      this.websocket.onclose = this.websocketclose;
    },
    // 开启链接
    websocketonopen() {
      console.log("WebSocket连接成功==============================");
      //  this.loadingInstance.close();
    },
    // 连接错误
    websocketonerror(e) {
      // 错误
      console.log("WebSocket连接发生错误");
      //  this.initWebSocket();
    },

    // 数据接收
    // 注意：长连接我们是后台直接1秒推送一条数据，
    // 但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
    // 这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
    websocketonmessage(e) {
      let itemPhoto;
      let itemCompare;
      try {
        let itemData = JSON.parse(e.data);
        if (itemData.topic === "TOPIC_FACE_SHOOT") {
          // 收到人脸抓拍的消息
          itemPhoto = JSON.parse(itemData.data);

          if (itemPhoto.isbodyuri) {
            console.log(
              this.checkedChannelsUuidList,
              "-----------------收到人体分析抓拍消息~ ！~",
              itemPhoto
            );
            if (
              this.checkedChannelsUuidList.indexOf(itemPhoto.channelUuid) >= 0
            ) {
              // 检查勾选的通道数组中是否包含该通道
              this.photoList.unshift(itemPhoto);
              this.todayShootCount += 1; // 抓拍次数
              console.log(
                this.photoList,
                "收到相应的人体抓拍消息",
                itemPhoto.channelUuid
              );
            }
            if (this.photoList.length > 6) {
              this.photoList.pop();
            }

            console.log(this.photoList);
          } else {
            // console.log('收到的不是人体分析消息，扔掉~ ！~',itemPhoto);
            return;
          }
        } else if (itemData.topic === "TOPIC_FACE_COMPARE") {
          // 收到人脸对比的消息
          itemCompare = JSON.parse(itemData.data);
          // console.log("收到人体分析对比消息",itemCompare);
          if (itemCompare.bodyUrl && itemCompare.bodyInfo) {
            if (
              this.checkedChannelsUuidList.indexOf(itemCompare.channelUuid) >= 0
            ) {
              // 检查勾选的通道数组中是否包含该通道
              this.comparePhotoList.unshift(itemCompare);
              this.todayCompareCount += 1;
              console.log(
                this.photoList,
                "收到相应的人体抓拍消息",
                itemCompare.channelUuid
              );
            }
            if (this.comparePhotoList.length > 2) {
              this.comparePhotoList.pop();
            }
          }
        } else if (itemData.topic === "TOPIC_ALARM_INFO") {
          console.log("收到报警消息", e);
        } else {
          // 收到其他消息
        }
      } catch (error) {
        console.log("============socket数据错误=============" + error);
      }
    },
    // 数据发送
    websocketsend(agentData) {
      this.websocket.send(agentData);
    },
    // 关闭
    websocketclose(e) {
      // this.initWebSocket();
      console.log("connection closed (" + e.code + ")");
    },
    loadVideo(url) {
      console.log("播放的码流地址：", url);
      // var theHtml = null;
      if (!url) {
        alert("没有码流地址");
        console.log(url);
        return;
      }
      // url = 'rtsp://admin:Admin123456@192.168.9.198:554/Streaming/Channels/101';

      document.getElementById("poster_img").style.display = "none";
      this.MBVlc = document.getElementById("vlc");
      this.MBVlc.playlist.items.clear();
      this.MBVlc.playlist.clear();
      var options = new Array("rtsp-tcp");
      var id = this.MBVlc.playlist.add(url, "name", options);
      this.MBVlc.playlist.playItem(id);
      this.MBVlc.playlist.play();
    },
    // 视频选择框显示，右侧按钮显示
    popverShow() {
      // if(this.checkedChannel==''){
      //     //默认通道
      //     this.checkedChannel = this.channelInfoList[0];
      //     //默认的码流地址
      //     this.checkedChannelsUuid = this.channelInfoList[0].id;

      // }else{
      //     for(var i=0;i<this.channelInfoList.length;i++){
      //       if(this.channelInfoList[i].id === this.checkedChannel.id){
      //         this.checkedChannel = this.channelInfoList[i];
      //         break;
      //       }else{
      //       }
      //     }
      // }
      this.initCheckedChannel();
      this.visible_popver = true;
    },
    // 初始化是否已经有过操作
    initCheckedChannel() {
      if (this.checkedChannel === '') {
        // 默认通道
        this.checkedChannel = this.channelInfoList[0];
        // 默认的码流地址
        this.checkedChannelsUuid = this.channelInfoList[0].id;
      } else {
        for (var i = 0; i < this.channelInfoList.length; i++) {
          if (this.channelInfoList[i].id === this.checkedChannel.id) {
            this.checkedChannel = this.channelInfoList[i];
            break;
          } else {
          }
        }
        this.checkedChannelsUuidList = [];
        this.checkedChannelsUuidList[0] = this.checkedChannel.id;
        this.checkedChannelsUuid = this.checkedChannel.id;
      }
    },
    // 视频选择框隐藏,左侧按钮显示
    popverHidden() {
      this.visible_popver = false;
    },
    // 点击右侧菜单的下拉框的回调
    handleCommand(command) {
      this.$message("click on item " + command);
      this.asidDropdownMednu = command;
    },
    // 弹窗的传值
    dialogAction(e) {
      this.dothis(e);
    },
    dothis(e) {
      console.log("右侧的弹窗事件index", e);
      if (this.comparePhotoList.length - e >= 1) {
        console.log(
          this.comparePhotoList[this.comparePhotoList.length - e - 1]
        );
        let index = this.comparePhotoList.length - e - 1;
        this.dialogParama = this.comparePhotoList[index];
        // this.getAlarmShootPhotoList();
      } else {
      }
    },

    // 根据客户端的传的人员staffUuid查找抓拍图片 //GET /v1/face/dispatching/compare/history/list/staff
    getAlarmShootPhotoList(currentPage = 1, pageSize = 24) {
      console.log("========人脸记录照片查找中=======");
      this.$store
        .dispatch("getShootPhotosForStaffUuid", this.dialogParama.staffUuid)
        .then(res => {
          this.mainVideoScreenLoading = false;
          console.log(res.data, "==人脸记录照片：====", res.data);
          if (res.result === 0) {
            this.dialogParama.shootPhotoList = res.data.list;
            this.dialogParama.aroundPhotoList = res.data.list;
            this.dialogVisible = true;
            this.shootPhotoList = res.data.list;
          } else {
            this.$message({
              message: "没有找到更多相关的人脸抓拍",
              type: "warning"
            });
          }
        });
    },
    // 关闭弹窗的回调，得到子组件的参数
    closeDialog(e) {
      console.log("父組件===" + e);
      this.dialogVisible = e;
    },

    // 左侧的底部的切换按钮,切换人脸抓拍与人流量统计的视图
    footerTypeAct() {
      if (this.footerLiftType === true) {
        // 获取人脸统计
        this.getPhotoStaticList();
      }
    },

    // 变量的重置
    getStartTime() {
      function addZero(num) {
        if (num < 10) return "0" + num;
        return num;
      }
      var new111 = new Date();
      return (
        new111.getFullYear() +
        "-" +
        addZero(new111.getMonth() + 1) +
        "-" +
        addZero(new111.getDate()) +
        " 00:00:00"
      );
    },
    getEndTime() {
      function addZero(num) {
        if (num < 10) return "0" + num;
        return num;
      }
      var new111 = new Date();
      return (
        new111.getFullYear() +
        "-" +
        addZero(new111.getMonth() + 1) +
        "-" +
        addZero(new111.getDate()) +
        " 23:59:59"
      );
    },

    // 画折线图
    drawLine() {
      let dom = document.getElementById("bar_bot");
      let w =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      let h =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      this.$refs.canvsWidth.$el.style.width = (2 * w) / 3 - 100 + "px";
      this.$refs.canvsWidth.$el.style.height = h / 3 - 100 + "px";
      console.log(this.$refs.canvsWidth.$el.style.width);
      if (!dom) {
        return;
      }
      dom.style.width = this.$refs.canvsWidth.$el.style.width;
      dom.style.height = this.$refs.canvsWidth.$el.style.height;

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
          data: [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24"
          ]
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
    // 鼠标划过覆盖的hover弹窗事件
    mymouseover: event => {
      mouseover(event);
    },
    mymouseout(event) {
      mouseout(event);
    },
    mymousemove(event) {
      mousemove(event);
    },
    // 时间戳毫秒数转为时间格式
    timestampToFormatter(timestamp, formdate = "HH:mm:ss") {
      let date = new Date(timestamp);
      var year = date.getFullYear();
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var currentDate =
        date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var ss =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      if (formdate === null || formdate === "yyyy-mm-dd HH:mm:ss") {
        return (
          year +
          "-" +
          month +
          "-" +
          currentDate +
          " " +
          hours +
          ":" +
          minutes +
          ":" +
          ss
        );
      } else if (formdate === "yyyy-mm-dd") {
        return year + "-" + month + "-" + currentDate;
      } else if (formdate === "yyyy-mm") {
        return year + month;
      } else if (formdate === "mm-dd") {
        return month + "-" + currentDate;
      } else if (formdate === "HH:mm") {
        return hours + ":" + minutes;
      } else {
        return hours + ":" + minutes + ":" + ss;
      }
    }
  }
};
</script>
<style>
.taskParent .MBelRadioClass {
  text-align: left;
  margin-left: -225px;
  margin-top: 20px;
  width: 100%;
  overflow: auto;
}

.asidColumsRightClass {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-content: center;
}
.asidColumsLeftClass {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
}
.asidHeaderTxt {
  text-align: right;
  padding-right: 12px;
  color: #ffffff;
  font-size: 14px;
}

.MBAnalysisClass .el-pagination__jump {
  margin-left: 24px;
  font-weight: 400;
  color: #cccccc;
}

.foot-box {
  /* width:100%; */
  height: 100%;
}
.footerRowClass .footer-left-txt span {
  font-family: PingFangSC-Regular;
  font-size: 11px;
  color: #888888;
  letter-spacing: 0;
  line-height: 15px;
}
.foot-img1 {
  width: 100%;
  height: 100%;
}
.foot-img2 {
  width: 100%;
  height: 100%;
}
.footerRowClass .footer-left-txt,
.MBAnalysisClass .foot-box-span,
.asidCompareTxtClass .asid-row-left,
.MBAnalysisClass .foot-asid-txt {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}
.MBAnalysisClass .foot-box-span span {
  font-family: PingFangSC-Regular;
  font-size: 11px;
  color: rgb(180, 180, 182);
  letter-spacing: 0;
  line-height: 15px;
}
.MBAnalysisClass .asid-row-left span {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #888888;
  letter-spacing: 0;
  line-height: 20px;
}
.MBAnalysisClass .foot-asid-txt span {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgba(255, 255, 255, 1);
  letter-spacing: 0;
  line-height: 20px;
}
.dialogClass .el-dialog__body {
  padding: 0;
  color: #606266;
  font-size: 14px;
}

.dialogClass {
  text-align: left;
}
.my_el-dialog__header {
  padding: 20px 20px 10px;
  height: 58px;
  text-align: left;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(40, 255, 187, 0.2);
}
.MBAnalysisClass .el-dialog__title {
  line-height: 24px;
  font-family: PingFangSC-Regular;
  font-size: 20px;
  color: #ffffff;
  text-align: left;
  margin-left: 11px;
}
.MBAnalysisClass .asidListBox {
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  min-height: 450px;
}

.MBAnalysisClass .el-dialog__header {
  display: none;
  padding: 20px 20px 10px;
}

.checkBoxTitle .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #efefef;
  opacity: 0.8;
}
.checkBoxTitle {
  width: 245px;
  display: flex;
  flex-direction: wrap;
  justify-content: flex-start;
  align-items: center;
  /* padding-left: 12px; */
}
.checkBoxTitle .is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: transparent;
  border-color: #28ffbb;
  /* color:#28FFBB; */
}
.checkBoxTitle .el-checkbox__inner {
  display: inline-block;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 14px;
  height: 12px;
  background-color: transparent;
  z-index: 1;
  margin: 12px 0px;
  -webkit-transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
    background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
  transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
    background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}

.MBAnalysisClass .el-progress .el-progress-circle {
  transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
}
.MBAnalysisClass .el-switch__core:after {
  position: absolute;
  top: -1px;
  left: -1px;
  border-radius: 100%;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  width: 20px;
  height: 20px;
  background-color: #28ffbb;
}
#poster_img {
  width: calc(100% - 50px);
  height: calc(100% - 45px);
  position: absolute;
  top: 0px;
  left: 0px;
  background: transparent url("../../../assets/poster.png") no-repeat center 100%;
  background-size: 100% 100%;
  background-clip: content-box;
  background-origin: content-box;
  margin: 22px 27px;
  box-sizing: border-box;
  /* background-color: #FFFFFF; */
}
.MBAnalysisClass .imgTxtClass {
  font-size: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  line-height: 30px;
}
.MBAnalysisClass .asidFontColor {
  color: #ffffff;
  font-size: 14px;
}
.MBAnalysisClass .asidCompareImgBox {
  width: 100%;
  height: 0px;
  padding-bottom: 100%;
  position: relative;
  box-sizing: border-box;
  /* padding:10px 5px 0px; */
}

.MBAnalysisClass .asidCompareBodyImgBox {
  width: 100%;
  height: 0px;
  padding-bottom: calc(200% + 10px);
  position: relative;
  box-sizing: border-box;
}
.MBAnalysisClass .asidCompareTxtClass {
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  /* padding:10px 0px 0px; */
}
.MBAnalysisClass .footerChannelName {
  font-size: 12px;
  position: relative;
  color: #ffffff;
  width: 100%;
}

.MBelPopoverClass .el-radio {
  color: #ffffff;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  /* padding-top: 15px; */
}

.taskParent .el-radio__inner:after {
  box-sizing: content-box;
  content: "";
  border: 1px solid #28ffbb;
  border-left: 0;
  border-top: 0;
  height: 7px;
  left: 4px;
  position: absolute;
  top: 1px;
  transform: rotate(45deg) scaleY(0);
  width: 3px;
  transition: transform 0.15s ease-in 0.05s;
  transform-origin: center;
}
.MBelPopoverClass .el-input__prefix,
.MBelPopoverClass .el-input__suffix {
  padding: 0px 5px;
  height: calc(100% - 14px);
  color: #ffffff;
  /* opacity: 0.7; */
  background: rgba(32, 204, 150, 0.7);
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-right: -5px;
  margin-top: 7px;
  border-radius: 3px;
}
.MBelPopoverClass .el-input__suffix .el-input__icon {
  height: 100%;
  width: 25px;
  text-align: center;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  line-height: 0px;
}
.MBAnalysisClass .el-progress-circle__track {
  stroke: rgb(61, 65, 71);
  fill: none;
}

.MBelPopoverClass .el-radio + .el-radio {
  margin-left: 0px;
}
.taskParent {
  width: 50%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 0px 8px;
  padding-top: 10px;
}
.MBAnalysisClass .asidClass {
  overflow: auto;
  background-image: linear-gradient(-180deg, #343942 4%, #2e3537 100%);
}
.taskParent .el-radio__inner {
  background-color: transparent;
  display: none;
}
.MBelPopoverClass .el-radio__input.is-checked + .el-radio__label {
  color: #28ffbb;
}
.MBelPopoverClass .el-radio__input.is-checked .el-radio__inner {
  background-color: transparent;
  color: #28ffbb;
  border-color: #28ffbb;
  display: none;
}
.MBelPopoverClass .el-radio__input.is-indeterminate .el-radio__inner {
  background-color: transparent;
  border-color: gray;
  display: none;
}
.MBelPopoverClass .taskItemsBtn:active,
.MBelPopoverClass .taskItemsBtnActive {
  color: #ffffff;
  border: 1px solid rgba(32, 204, 150, 0.8);
  opacity: 0.8;
  background-color: rgb(41, 63, 48);
}

.taskItemsBtn {
  width: 60%;
  padding: 7px 15px;
  color: #cccccc;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  margin: 5px auto;
  font-family: 'PingFangSC-Medium';
}
.MBAnalysisClass .el-dialog {
  position: relative;
  margin: 0 auto 50px;
  background-image: linear-gradient(-180deg, #16171f 0%, #10131a 100%);
  border-radius: 3px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  /* width: 50%; */
  color: #fff;
}
.MBelPopoverClass {
  width: calc(66.667% - 144px);
  height: calc(70% - 70px);
  position: absolute;
  left: 160px !important;
  top: 60px !important;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 10 !important;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 0px;
  padding: 0px 12px;
}

.MBAnalysisClass a:-webkit-any-link {
  cursor: pointer;
  color: #28ffbb !important;
  text-decoration: none;
}
.fontColor {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #cccccc;
  letter-spacing: 0;
}
.fontTheme {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #28ffbb !important;
  letter-spacing: 0;
  cursor: pointer;
}
.MBAnalysisClass .el-dropdown-link {
  color: #ffffff;
  display: block;
}
.MBAnalysisClass .el-button {
  padding: 7px 0px;
}

.MBAnalysisClass button + .el-button {
  margin: 10px;
}
.MBAnalysisClass .asidListRowFooter {
  /* width: 100%; */
  /* height: 35px; */
  font-size: 14px;
  text-align: left;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.MBAnalysisClass .asidListRow {
  margin-top: 3.5%;
  height: 47.5%;
  color: #fff;
  background-color: #272a2d;
  border-radius: 3px;
  /* border: 1px solid rgb(45, 78, 75); */
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  box-sizing: border-box;
  padding: 0px 20px 20px;
}
.MBAnalysisClass .textclipsClass,
.MBAnalysisClass span {
  display: inline-block;
  /* width: 100%; */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  -webkit-line-clamp: 1; /*3表示只显示3行*/
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
}
.asidListRow .el-progress__text {
  font-size: 14px !important;
  color: #fff;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}
.MBAnalysisClass .asidCardClass {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
}

.MBAnalysisClass .el-popover {
  position: absolute;
  background: transparent !important;
  min-width: 150px;
  border-radius: 4px;
  border: 0;
  padding: 12px;
  z-index: 2000;
  color: #aaaaaa;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.MBAnalysisClass .asidCardImg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  -webkit-background-size: cover;
  -webkit-background-origin: content;
  background-origin: content-box;
  background-size: cover;
  -webkit-background-origin: content;
  background-origin: content-box;
  background-clip: content-box;
}
.MBAnalysisClass .footer-top-row {
  background-color: transparent;
  color: #fff;
  line-height: 60px;
}
.MBAnalysisClass .footerRowClass {
  width: calc(100% + 15px);
  height: calc(100% - 60px);
  line-height: 20px;
  color: #fff;
  display: flex;
  vertical-align: middle;
  align-items: flex-end;
  box-sizing: border-box;
  padding-top: 8px;
  /* background: rgba(36, 39, 42,  1); */
  /* margin-left: 5px; */
}
.MBAnalysisClass .asidListRowHeader {
  width: calc(100% - 2px);
  height: calc(12% - 2px);
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  padding: 14px 5px;
}
.MBAnalysisClass .asidListRowBody {
  width: calc(100% - 2px);
  height: calc(33% - 2px);
  padding: 15px 10px 12px;
  box-sizing: border-box;
}
.MBAnalysisClass .asidListRowBottom {
  width: calc(100% - 2px);
  height: calc(55% - 2px);
  padding-top: 15px;
}

.MBAnalysisClass .footerCardClass {
  height: 100%;
  box-sizing: border-box;
  padding: 9px 12px 0px 12px;
  vertical-align: middle;
  /* border:1px solid rgb(45, 78, 75); */
  background-color: transparent;
  margin-right: 20px;
  background: rgb(36, 39, 42);
}
.MBAnalysisClass .footerCardImg {
  width: 100%;
  height: 100%;
  -webkit-background-size: cover;
  -webkit-background-origin: content;
  background-origin: content;
  background-size: auto 100%;
  -webkit-background-origin: content;
  background-origin: content;
}
#MBAnalysis {
  font-family: Helvetica, sans-serif;
  text-align: center;
  box-sizing: border-box;
  background-color: rgb(28, 29, 32);
  padding: 0 0 0 50px;
}
.MBAnalysisClass .el-header {
  padding-top: 20px;
  text-align: left;
}
.MBAnalysisClass .el-footer {
  color: #333;
  text-align: center;
  line-height: 60px;
  min-height: 60px;
  vertical-align: middle;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  vertical-align: middle;
  padding: 0px 1px 30px 0px;
  box-sizing: border-box;
}
.MBAnalysisClass .leftflexButton,
.leftflexButton:focus,
.leftflexButton:hover {
  background-color: transparent;
  color: #ffffff;
  border: 0;
  padding: 10px 14px !important;
}
/* .leftflexButton .el-icon-caret-top,
.leftflexButton .el-icon-caret-bottom{
    opacity: 1;
    color: #fff;
    position: absolute;
    right: 7px;
    top: 43px;
} */

.font12 {
  font-size: 12px;
}

.font-white {
  color: #fff;
  font-weight: 700;
}
.MBAnalysisClass .el-aside {
  height: 100%;
  color: #333;
  text-align: center;
  background: rgba(0, 0, 0, 0.15);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  padding: 0 2%;
}

.MBAnalysisClass .el-main {
  color: #333;
  text-align: center;
  padding: 0px 0px 1px 0px;
  background: rgba(36, 39, 42, 1);
}
.main-box {
  position: relative;
  width: 100%;
  height: calc(100% - 62px);
  box-sizing: border-box;
  /* border: 1px solid rgb(45, 78, 75); */
  box-sizing: border-box;
  background: transparent;
  padding: 0px 20px 15px;
}
.MBAnalysisClass .el-container {
  padding-right: 50px;
}

.MBAnalysisClass .el-tree__empty-block {
  position: relative;
  min-height: 30px;
  text-align: center;
  width: 100%;
  height: 100%;
  font-size: 14px;
  background: transparent;
}
.MBAnalysisClass .el-tree {
  position: relative;
  cursor: default;
  background: transparent;
  color: #606266;
}
</style>
