
<template>
	<div id="home" class="RTask">
		<el-row type="flex" class="row-bg" justify="center" ref="heightBox">
			<el-container style>
				<el-header>
					<el-popover
						ref="popverBox"
						popper-class="elPopoverClass"
						:visible-arrow="false"
						:value="visible_popver"
						@show="popverShow"
						@hide="popverHidden"
						placement="right"
						trigger="click"
						@command="mainHandCommand"
					>
						<!-- 以下iframe标签是为了VLC播放的遮挡 -->
						<iframe class="iframeClass" style="allowTransparency=true;filter='Alpha(style=0,opacity=0)';"></iframe>
						<el-row class="taskParentBox">
							<el-row class="taskParent taskParentPopoverBox">
								<el-tree
									ref="deviceTree"
									:data="deviceTreeList"
									default-expand-all
									:props="defaultProps"
									@node-click="handleNodeClick"
								></el-tree>
							</el-row>
							<el-row class="taskParent taskParentBgClass">
								<div class="checkBoxTitle">
									<el-checkbox
										class="checkBoxClass"
										v-model="checkAll"
										@change="handleCheckAllChange"
									>只呈现单路摄像机</el-checkbox>
								</div>
								<el-radio-group
									v-if="channelInfoList"
									class="taskParent radioGroup"
									v-model="checkedChannel"
									@change="handleCheckedCitiesChange"
								>
									<el-radio
										class="el-radio-myclass"
										v-for="channelItem in channelInfoList"
										:label="channelItem"
										:key="channelItem.id"
									>{{channelItem.label}}</el-radio>
								</el-radio-group>
								<el-row v-else style="margin:15px;color:#ffffff">任务没有关联摄像机</el-row>
							</el-row>
						</el-row>
						<el-row slot="reference">
							<img src="@/assets/sxj.png" alt />
							<el-button class="leftflexButton">选择摄像机</el-button>
							<img src="@/assets/drop-down.png" alt />
						</el-row>
					</el-popover>
				</el-header>
				<el-main style="position: relative;" ref="mainHeightBox">
					<!-- 视频播放区域 -->
					<div
						class="main-box"
						v-loading="mainVideoScreenLoading"
						element-loading-background="rgba(0, 0, 0, 0.8)"
					>
						<div id="poster_img"></div>
						<div id="player"></div>
					</div>
				</el-main>
				<!-- 底部人脸抓拍记录图片list -->
				<el-footer :height="footerHeight">
					<el-row type="flex" justify="space-between" class="footer-top-row">
						<el-col :span="8" class="imgTxtClass" style="min-width: 115px;text-align:left;">
							<img
								style="margin-right:24px"
								:src="footerLiftType?require('@/assets/icon/stream-people.png'):require('@/assets/icon/face-photo.png')"
							/>
							<span>{{!footerLiftType?"人脸抓拍数：":"人流量统计结果"}}</span>
							<span v-if="!footerLiftType">{{todayShootCount}}张</span>
						</el-col>
						<el-col :span="16" class="asidFontColor asidHeaderTxt">
							<!-- 今日次数:<span>{{todayShootCount}}</span>张 -->
							<router-link style="padding:0px 6px 0 30px;font-size:16px" class="fontTheme" to="FaceRecord">
								更多
								<img style="margin-left:6px" src="@/assets/icon/more.png" alt="更多" />
							</router-link>
							<el-switch
								@change="footerTypeAct"
								v-model="footerLiftType"
								active-color="rgb(11,49,49)"
								inactive-color="rgb(11,49,49)"
							></el-switch>
						</el-col>
					</el-row>
					<el-row type="flex" v-show="!footerLiftType" class="footerRowClass" justify="space-between">
						<el-col
							ref="footerCardImgHeight"
							class="footerCardClass"
							:span="3"
							v-for="(o,index) in 9"
							:key="index"
						>
							<img-card :photoItem="photoList[index]" />
						</el-col>
					</el-row>
					<el-row class="bar_botClass" v-show="footerLiftType">
						<el-row
							v-loading="fullscreenLoading"
							element-loading-background="rgba(0, 0, 0, 0.8)"
							ref="canvsWidth"
							id="bar_bot"
						></el-row>
					</el-row>
				</el-footer>
			</el-container>
			<!--- 右侧的识别信息  --->
			<el-aside :width="asideWidth" class="asidClass">
				<el-row type="flex" justify="space-between" class="aside-row">
					<el-col class="textclipsClass fontColor asidHeader asidColumsLeftClass" :span="12">
						<div class="asidColumsLeftClass imgTxtClass" style="min-width:97px">
							<img style="margin-right:12px" src="@/assets/icon/task.png" />
							<span class="el-dropdown-link textclipsClass">订阅任务：</span>
						</div>
						<el-popover
							popper-class="RTreePopoverClass"
							placement="bottom"
							@show="popverShow('tree')"
							@hide="popverHidden('tree')"
							trigger="click"
						>
							<el-checkbox
								:indeterminate="isIndeterminate"
								v-model="checkTaskAll"
								@change="handleTaskCheckAllChange"
							>全选</el-checkbox>
							<el-tree
								ref="tree"
								:data="JSON.parse(JSON.stringify(taskList))"
								show-checkbox
								node-key="taskuuid"
								:props="defaultTreeProps"
								default-expand-all
								@check="checkChanges"
							></el-tree>
							<el-row slot="reference" style="width:100%">
								<el-button
									class="leftflexButton textclipsClass"
									style="width:calc(100% - 15px);padding:10px 4px;!important"
								>
									<span
										class="textclipsClass"
										@mouseover="mymouseover"
										@mouseout="mymouseout"
										@mousemove="mymousemove"
									>{{asidDropdownMednu}}</span>
								</el-button>
								<img src="@/assets/drop-down.png" alt />
							</el-row>
						</el-popover>
					</el-col>
					<el-col :span="12" class="asidFontColor asidColumsRightClass imgTxtClass">
						<span
							class="asidFontColor"
							style="margin-right:12px;"
							@mouseover="mymouseover"
							@mouseout="mymouseout"
							@mousemove="mymousemove"
						>今日次数：{{todayCompareCount}}人</span>
						<router-link class="fontTheme" to="CompareRecord">更多</router-link>
						<img style="padding-right:15px" src="@/assets/icon/more.png" />
					</el-col>
				</el-row>
				<el-row class="asidListBox">
					<div class="asidListRow" v-for="(o,index) in 5" :key="index" @dblclick="dialogAction(index)">
						<recoginize-card :recoginizeItem="comparePhotoList[index]" @detailClick="dothis(index)" />
					</div>
				</el-row>
			</el-aside>
		</el-row>
		<!-- ======================================================= 弹 窗 ========================================================== -->
		<el-dialog class="dialogClass" :visible.sync="dialogVisible" @close="closeDialog">
			<!-- 以下iframe标签是为了VLC播放的遮挡 -->
			<!-- <iframe
				style="position:absolute;
                                visibility:inherit;
                                top:0px; left:0px;
                                width:100%;
                                height:100%;
                                border:0;
                                background:transparent;
                                filter='Alpha(style=0,opacity=0)';"
			></iframe>-->
			<el-row>
				<div class="my_el-dialog__header">
					<span class="el-dialog__title">对比详情</span>
					<button type="button" aria-label="Close" class="el-dialog__headerbtn">
						<i class="el-dialog__close el-icon el-icon-close" @click="dialogVisible = false"></i>
					</button>
				</div>
			</el-row>
			<dialogview
				:dialogParama="dialogParama"
				v-loading="dialogfullscreenLoading"
				element-loading-background="rgba(0, 0, 0, 0.8)"
				:shootPhotoList="shootPhotoList"
				:showImg="showImg"
				@cs="changeShowStatus"
			></dialogview>
		</el-dialog>
		<big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
	</div>
</template>

<script>
import dialogview from "@/pages/faceModule/components/dialogForm.vue";
import alPopoverTree from "@/pages/faceModule/components/AlElTree.vue";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
import BigImg from "@/pages/faceModule/components/BigImg.vue";
import ImgCard from "@/pages/faceModule/components/ImgCard.vue";
import RecoginizeCard from "@/pages/faceModule/components/RecoginizeCard.vue";
export default {
  name: "home",
  components: {
    dialogview,
    alPopoverTree,
    ImgCard,
    RecoginizeCard,
    "big-img": BigImg
  },
  data: function(argument) {
    return {
      isIndeterminate: false,
      canvsWidth: "300px",
      footerHeight: "60px",
      asideWidth: "60px",
      asidDropdownMednu: "全部任务", // 选中的任务
      deviceTreeList: [], // 设备树
      deviceDataList: [], // 设备树的数据源
      visible_tree_popver: false,
      dialogVisible: false, // 彈窗顯示標記
      dialogParama: "弹窗视图的参数",
      footerLiftType: false, // 抓拍記錄與車流量統計的切換
      taskList: [],
      taskItem: null, // 当前任务
      visible_popver: false, // task弹窗是否弹出，默认隐藏
      rtspAddress:
				"rtsp://admin:abcd1234@172.20.10.190:554/Streaming/tracks/501?starttime=20181121T110831z&endtime=20181121T124543z",
      channelInfoList: [], // 所有通道名称和ID的二元list
      checkedRtspList: [], // 选中的轮询通道Rtsp地址
      channelUuidList: [],
      checkAll: false, // 通道勾选的list的长度
      checkTaskAll: true,
      checkedChannelsUuidList: [], // 当前勾选的通道Id的list
      checkedChannel: "",
      checkedChannelsUuid: "", // 当前轮询的ID
      websocket: null,
      photoList: [], // 抓拍列表
      comparePhotoList: [], // 人臉對比列表
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
      shootPhotoList: [],
      defaultTreeProps: {
        label: "taskname"
      },
      showImg: false,
      imgSrc: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      checkedTaskUUidList: [],
      checkedNodes: [],
      vlcObj: this.$store.state.vlcObj,
      flag: false,
      timer: null,
      timeOuter: null,
      vlc: null,
      options: new Array("rtsp-tcp"),
      dialogfullscreenLoading: false
    };
  },
  computed: {},
  mounted: function() {
    this.vlc = null;
    let w = this.WIDTH();
    let h = this.HEIGHT();
    h = h - 65; // 不知道为什么会差5个像素
    w = w - 120;
    this.$refs.mainHeightBox.$el.style.height = (7 * h) / 10 + "px";
    this.footerHeight = (3 * h) / 10 + "px";
    this.asideWidth = w / 3 - 40 + "px";
    this.$refs.heightBox.$el.style.height = h + "px";

    // 当窗口发生变化时
    let that = this;
    window.addEventListener("resize", function() {
      let w = that.WIDTH();
      let h = that.HEIGHT();
      w = w - 120;
      h = h - 65;
      that.$nextTick(() => {
        that.$refs.mainHeightBox.$el.style.height = (7 * h) / 10 + "px";
        that.$refs.heightBox.$el.style.height = h + "px";
      });
      that.footerHeight = (3 * h) / 10 + "px";
      that.asideWidth = w / 3 - 40 + "px";
      // that.drawLine();
    });
    var player = document.getElementById("player");
    player.innerHTML = this.vlcObj;
    this.vlc = document.getElementById("vlc");
    this.startTime = this.$common.getStartTime();
    this.endTime = this.$common.getCurrentTime();
    this.checkedChannel = this.$store.getters.getCheckedChannel;
    this.rtspAddress = this.$store.getters.getCheckedHMRtspUrl;
  },

  destroyed: function() {
    console.log("关闭页面");
    if (this.websocket) {
      this.websocket.close();
    }
    this.websocket = null;
    clearInterval(this.timer);
    this.timer = null;
    var player = document.getElementById("player");
    player.innerHTML = null;
  },
  watch: {},
  methods: {
    // 点击设备树的事件
    handleNodeClick(data) {
      // id = data.id;
      if (data) {
        this.channelInfoList = [];
        var _this = this;
        _this.getChannelInfoList(_this.deviceDataList, data.id, _this);
      }
    },
    // 递归查找被选择的设备节点的通道列表
    getChannelInfoList(data, id, _this) {
      for (var index = 0; index < data.length; index++) {
        if (data[index].id === id) {
          var arr = data[index].children;
          _this.getChildren(arr, _this.channelInfoList);
          break;
        } else {
          if (!data[index].children || data[index].children.length === 0) {
            continue;
          }
          this.getChannelInfoList(data[index].children, id, _this);
        }
      }
    },
    // 获取子节点的叶子
    getChildren(data, arr) {
      if (!data || data.length === 0) {
        return;
      }
      for (let index = 0; index < data.length; index++) {
        if (data[index].children === null) {
          arr.push(JSON.parse(JSON.stringify(data[index])));
        } else {
          this.getChildren(data[index].children, arr);
        }
      }
    },
    // 获取设备列表
    getDeviceList(isBool) {
      var _this = this;
      _this.$store.dispatch("getDeviceList", false).then(res => {
        if (res.result === 0) {
          var treeArray = res.data;
          _this.deviceTreeList = res.data;
          // 深拷贝保存一份源数据
          _this.deviceDataList = JSON.parse(JSON.stringify(treeArray));
          _this.$store.commit("setDeviceList", _this.deviceDataList);

          _this.channelInfoList = [];
          // 默认通道列表
          _this.getChildren(_this.deviceDataList, _this.channelInfoList);

          // 默认的通道id list
          _this.initChannelInfoList(_this.channelInfoList, isBool);

          if (isBool) {
            _this.getRtspInChannelUuid(_this.channelInfoList[0].id, isBool);
          }
          // 页面刚进入时开启长连接
          _this.initWebSocket();

          // 递归去通道
          _this.hasChildren(_this.deviceTreeList);
        } else {
          _this.$message({ message: "设备列表更新失败", type: "error" });
        }
      });
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

    // 布控任务列表
    getTaskList() {
      this.taskList = [];
      this.checkedTaskUUidList = [];
      this.$store.dispatch("getTaskList", false).then(res => {
        if (res.result === 0) {
          var taskList = res.data.enable;
          console.log(taskList[0], "---", typeof this.taskList);
          this.$store.commit("setTasks", taskList);
          this.taskList = taskList;
          for (var i = 0; i < taskList.length; i++) {
            var temp = taskList[i];
            this.checkedTaskUUidList.push(temp.taskuuid);
          }
          this.todayCompareCount = 0;
          this.getRecongizeList();
          this.getCompareNum();
        } else {
          this.$message({ message: "请求布控任务列表错误", type: "warning" });
        }
      });
    },
    // 点击选中任务树的任务节点
    checkChanges(data, node) {
      this.checkedNodes = node.checkedNodes;
      this.checkedTaskUUidList = node.checkedKeys;
      this.$refs.tree.setCheckedKeys(this.checkedTaskUUidList);
      this.checkTaskAll =
				this.checkedTaskUUidList.length === this.taskList.length;
    },
    // 全部任务选中
    handleTaskCheckAllChange(val) {
      this.checkTaskAll = val;
      if (val) {
        this.checkedTaskUUidList = [];
        for (var i = 0; i < this.taskList.length; i++) {
          var temp = this.taskList[i];
          this.checkedTaskUUidList.push(temp.taskuuid);
        }
      } else {
        this.checkedTaskUUidList = [];
      }
      this.$refs.tree.setCheckedKeys(this.checkedTaskUUidList);
    },
    // 只呈现单路摄像机
    handleCheckAllChange(val) {
      console.log("默认勾选单路摄像机，改变对比列表数据以及抓拍数据", val);
      this.checkAll = val;
      if (val) {
        // 勾了单选
        this.checkedChannelsUuidList = [];
        // this.checkedChannelsUuidList[0] = this.checkedChannelsUuid;
        this.checkedChannelsUuidList[0] = this.checkedChannel.id;
        this.$store.commit("setCheckedChannel", this.checkedChannel);
      } else {
        // 去掉单选
        this.checkedChannelsUuidList = this.channelUuidList;
      }
      // 更新抓拍数据和统计数据
      this.todayShootCount = 0;
      this.getPhotoList();

      if (this.footerLiftType === true) {
        // 获取人脸统计
        this.getPhotoStaticList();
      }
      if (!this.timer) {
        this.getShootPhotoNum();
      }
    },
    // 选中某通道
    handleCheckedCitiesChange(value) {
      console.log("选中某通道------", this.checkedChannel);

      this.$store.commit("setCheckedChannel", this.checkedChannel);

      if (this.checkAll) {
        this.checkedChannelsUuidList = [];
        this.checkedChannelsUuidList[0] = this.checkedChannel.id;
      }
      this.checkedChannelsUuid = this.checkedChannel.id;
      this.getRtspInChannelUuid(this.checkedChannelsUuid, true);
      if (this.checkAll) {
        this.todayShootCount = 0;
        this.getPhotoList();
        if (this.footerLiftType === true) {
          // 获取人脸统计
          this.getPhotoStaticList();
        }
        if (!this.timer) {
          this.getShootPhotoNum();
        }
      }
      this.visible_popver = false;
    },

    // 组建通道树
    initChannelInfoList(channelInfoList, isBool) {
      this.channelUuidList = [];
      for (let j = 0; j < channelInfoList.length; j++) {
        // var channelItem = channelInfoList[j];
        // 默认的全部通道的id list
        this.channelUuidList.push(this.channelInfoList[j].id);
      }
      if (this.checkedChannel === "") {
        this.checkedChannelsUuidList = this.channelUuidList;
        this.checkAll = false;
      } else {
        this.checkAll = true;
        this.initCheckedChannel();
      }

      // 获取抓拍数据
      this.todayShootCount = 0;
      this.getPhotoList();
      if (!this.timer) {
        this.getShootPhotoNum();
      }
      if (this.footerLiftType === true) {
        // 获取人脸统计
        this.getPhotoStaticList();
      }
    },

    // 布控任务通道ID获取码流参数
    getRtspInChannelUuid(channelUuid, isBool) {
      let paramsArray = [];
      let channelIdObj = {
        channeluuid: channelUuid,
        streamType: this.streamType
      };
      paramsArray.push(channelIdObj);
      this.mainVideoScreenLoading = true;
      setTimeout(() => {
        this.mainVideoScreenLoading = false;
      }, 2000);
      this.$store.dispatch("getRTSPAddress", paramsArray).then(res => {
        console.log("获取码流地址：", res);
        if (res.result === 0) {
          for (let i = 0; i < res.data.length; i++) {
            let item = res.data[i];
            this.rtspAddress = item.deviceRtspUrl;
            this.$store.commit("setCheckedHMRtspUrl", this.rtspAddress);
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
    /** *********************************弹窗事件***********************************/

    // 接受子组件的消息，改变子组件的值
    changeShowStatus(flag) {
      this.showImg = flag;
    },
    // 关闭弹窗的回调，得到子组件的参数
    closeDialog(e) {
      this.showImg = false;
      this.dialogVisible = e;
    },
    clickImg(e) {
      this.showImg = true;
      // 获取当前图片地址
      this.imgSrc = e.currentTarget.src;
    },
    viewImg() {
      this.showImg = false;
    },
    /** *************************************抓拍事件*******************************/
    // 获取抓拍记录
    getPhotoList(currentPage = 1, pageSize = 9) {
      this.photoList = []; // 清除记录
      var data = {
        currentPage: currentPage,
        pageSize: pageSize,
        startDate: this.$common.getStartTime(),
        endDate: this.$common.getCurrentTime()
      };

      if (this.checkedChannelsUuidList) {
        data.channelUuids = this.checkedChannelsUuidList;
      }
      this.$store.dispatch("getPhotoList", data).then(res => {
        if (res.result === 0 && res.data) {
          this.photoList = res.data.list;
          this.photoList = this.photoList.reverse();
        } else {
          this.$message({
            message: "没有查找到相关的抓拍记录",
            type: "warning"
          });
        }
      });
    },

    // 获取布控任务对比列表信息
    getRecongizeList() {
      this.mainScreenLoading = true;
      var data = {
        taskUuids: this.checkedTaskUUidList.toString(),
        startTime: this.$common.getStartTime(),
        endTime: this.$common.getCurrentTime()
      };
      this.comparePhotoList = [];
      this.$store.dispatch("getRecongizeList", data).then(res => {
        console.log("获取布控任务对比列表信息:", res);
        this.mainScreenLoading = false;
        if (res.result === 0) {
          for (var i = 0; i < res.data.length; i++) {
            var item = JSON.parse(res.data[i].extinfo);
            this.comparePhotoList.push(item);
          }
        } else {
          this.$message({
            message: "没有查找到相关的识别记录",
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
        console.log("getStaticHourCount==", res);
        this.fullscreenLoading = false;
        if (res.result === 0) {
          for (let index in this.photoStaticList) {
            for (let item of res.data) {
              if (
                parseInt(item.currenttime.substr(11, 2)) === parseInt(index)
              ) {
                this.photoStaticList[index] = item.count;
              }
            }
          }
          console.log(this.photoStaticList);
          this.drawLine();
        } else {
          this.$message({ message: "人流量统计错误", type: "warning" });
        }
      });
    },

    // 对比次数初始化
    getCompareNum() {
      this.$store
        .dispatch("getCompareCount", this.checkedTaskUUidList.toString())
        .then(res => {
          // console.log(this.checkedTaskUUidList, "=================", res);
          if (res.result === 0) {
            this.todayCompareCount += res.data;
          } else {
            this.$message({ message: "获取对比次数失败", type: "warning" });
          }
        });
    },
    // 抓拍次数的初始化
    getShootPhotoNum() {
      var data = {
        channelUuids: this.checkedChannelsUuidList.toString(),
        currentTime: this.$common.getCurrentTime()
      };
      this.$store.dispatch("getShootPhotoCount", data).then(res => {
        // console.log(res, "--getShootPhotoCount--", this.todayShootCount);
        if (res.result === 0) {
          if (res.data.count >= 0) {
            this.todayShootCount = res.data.count;
          } else {
            this.todayShootCount = 0;
          }
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
      console.log("WebSocket连接成功==========================");
      //  this.loadingInstance.close();
    },
    // 连接错误
    websocketonerror(e) {
      // 错误
      console.log("WebSocket连接发生错误");
      //  this.initWebSocket();
    },
    // 数据接收
    websocketonmessage(e) {
      console.log("======================================", e);
      if (!this.checkAll) {
        if (this.flag) {
          return;
        }
        this.flag = true;
        setTimeout(() => {
          this.flag = false;
        }, 300);
      }
      let itemPhoto, itemCompare;
      try {
        // 收到人脸抓拍的消息
        let dataItem = JSON.parse(e.data);
        if (dataItem.topic === "TOPIC_FACE_SHOOT") {
          let itemData = dataItem;
          itemPhoto = JSON.parse(itemData.data);
          // 检查勾选的通道数组中是否包含该通道
          if (
            this.checkedChannelsUuidList.indexOf(itemPhoto.channelUuid) >= 0
          ) {
            this.photoList.unshift(itemPhoto);
            // this.todayShootCount += 1; //抓拍次数
            //  console.log(itemPhoto.channelName, "=======++++++===", itemPhoto);
          } else {
            //  console.log('======其他抓拍',itemPhoto.channelName,'===',itemPhoto);
          }
          if (this.photoList.length > 10) {
            this.photoList.pop();
          }
          // 收到人脸对比的消息
        } else if (dataItem.topic === "v2.0_ctrl_face_info") {
          itemCompare = dataItem.data;
          if (
            itemCompare.faceRecognization &&
						this.checkedTaskUUidList.indexOf(itemCompare.taskuuid) >= 0
          ) {
            this.comparePhotoList.unshift(itemCompare);
            this.todayCompareCount += 1;
          } else {
          }
          if (this.comparePhotoList.length > 5) {
            this.comparePhotoList.pop();
          }
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
      this.vlc = document.getElementById("vlc");
      this.vlc.playlist.items.clear();
      this.vlc.playlist.clear();
      // this.vlc.playlist.items.remove();
      var id = this.vlc.playlist.add(url, "name", this.options);
      this.vlc.playlist.playItem(id);
      this.vlc.playlist.play();
    },

    // 视频选择框显示，右侧按钮显示
    popverShow(e) {
      // debugger;
      if (e === "tree") {
        this.$refs.tree.setCheckedKeys(this.checkedTaskUUidList);
        return;
      } else {
        this.initCheckedChannel();
      }
      this.visible_popver = true;
    },
    // 初始化是否已经有过操作
    initCheckedChannel() {
      if (this.checkedChannel === "") {
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
    popverHidden(e) {
      if (e === "tree") {
        if (this.checkedNodes && this.checkedNodes.length) {
          this.asidDropdownMednu = "";
          for (var i = 0; i < this.checkedNodes.length; i++) {
            this.asidDropdownMednu += this.checkedNodes[i].taskname;
            this.asidDropdownMednu += ",";
          }
        }
        // 预防在接口返回结果前，websocket就有推送数据
        this.todayCompareCount = 0;
        this.getRecongizeList();
        this.getCompareNum();
        return;
      }
      this.visible_popver = false;
    },
    // 弹窗的传值
    dialogAction(e) {
      // this.dothis(e);
      console.log("-----");
      this.dialogVisible = true;
    },
    dothis(e) {
      console.log("右侧的弹窗事件index", e);
      // if (e >= 0 && this.comparePhotoList[e]) {
      // console.log(this.comparePhotoList[e]);
      // this.dialogParama = this.comparePhotoList[e];
      // this.shootPhotoList = [];
      // this.dialogParama.showImg = false;
      this.dialogVisible = true;
      // this.getAlarmShootPhotoList();
      // }
    },

    // 根据客户端的传的人员staffUuid查找抓拍图片
    getAlarmShootPhotoList(currentPage = 1, pageSize = 24) {
      this.updatedFlag = true;
      console.log("========人脸记录照片查找中=======");
      var data = {
        staffUuid: this.dialogParama.faceRecognization.staffinfo.staffUuid,
        scores: this.dialogParama.score
      };
      this.dialogfullscreenLoading = true;
      this.$store.dispatch("getShootPhotosForStaffUuid", data).then(res => {
        this.dialogfullscreenLoading = false;
        console.log(res.data, "==人脸记录照片：====", res);
        if (res.result === 0) {
          this.shootPhotoList = [];
          for (var i = 0; i < res.data.length; i++) {
            var item = res.data[i];
            if (!item.extinfo) return;

            item.extinfo = JSON.parse(item.extinfo);
            item.faceRecognization = item.extinfo.faceRecognization;

            this.shootPhotoList.push(item);
            console.log(item);
          }
          this.dialogParama.showImg = false;
          // this.dialogVisible = true;
        } else {
          this.$message({
            message: "没有找到更多相关的人脸抓拍",
            type: "warning"
          });
        }
      });
    },
    mainHandCommand(e) {
      console.log(e);
    },

    // 左侧的底部的切换按钮,切换人脸抓拍与人流量统计的视图
    footerTypeAct() {
      // debugger;
      if (this.footerLiftType === true) {
        // 获取人脸统计
        this.getPhotoStaticList();
      }
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
      this.$refs.canvsWidth.$el.style.width = (w * 2) / 3 - 120 + "px";
      this.$refs.canvsWidth.$el.style.height = (3 * h) / 10 - 80 + "px";
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
<style>
#player {
	text-align: center;
	height: 100%;
	object-fit: fill;
	width: 100%;
	z-index: 2;
	background: transparent;
}
.el-radio-myclass {
	margin: 10px 0px 9px;
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #aaaaaa;
	letter-spacing: 0;
}
.radioGroup {
	text-align: left;
	margin-left: -225px;
	margin-top: 25px;
	width: 140%;
	overflow: auto;
}
.checkBoxClass {
	padding-left: 15px;
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: #aaaaaa;
	letter-spacing: 0;
}
.iframeClass {
	position: absolute;
	visibility: inherit;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	border: 0;
	background: transparent;
}
iframe html {
	background: #10131a;
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
.RTask .el-tree__empty-block {
	position: relative;
	min-height: 0px;
	text-align: center;
	width: 100%;
	height: 100%;
}
.elPopoverClass .el-tree {
	background: #202124;
}
.elPopoverClass .el-tree-node:focus > .el-tree-node__content {
	background: #202124;
}

.elPopoverClass .el-tree-node__content:focus,
.el-tree-node__content:hover {
	background: #202124;
}
.asidRowProgress {
	margin: auto;
	color: #28ffbb;
	font-size: 14px;
}
.RTask .libImgClass {
	vertical-align: bottom;
	margin-left: 3px;
}
.RTask .asidListBox {
	width: 100%;
	height: calc(100% - 60px);
	overflow: auto;
	min-height: 450px;
}
.RTask .asidListBox .el-progress__text {
	font-size: 14px !important;
	color: rgb(170, 170, 170) !important;
	display: inline-block;
	vertical-align: middle;
	line-height: 1;
}
.RTask .activec .el-progress__text {
	color: #ff5f5f !important;
}

.RTask .asidHeader {
	text-align: left;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
	letter-spacing: 0;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.dialogClass .el-dialog__body {
	padding: 0;
	color: #606266;
	font-size: 14px;
}
.dialogClass {
	text-align: left;
	overflow-y: auto;
}
.my_el-dialog__header {
	padding: 20px 20px 10px;
	height: 58px;
	text-align: left;
	box-sizing: border-box;
	border-bottom: 1px solid rgba(40, 255, 187, 0.2);
}
.RTask .el-dialog__title {
	line-height: 24px;
	font-family: PingFangSC-Regular;
	font-size: 20px;
	color: #ffffff;
	text-align: left;
	margin-left: 11px;
}

.RTask .el-dialog__header {
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
	padding-top: 10px;
	/* padding-left: 12px; */
}
.checkBoxTitle .is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
	background-color: transparent;
	border-color: #28ffbb;
}

#poster_img {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0px;
	left: 0px;
	background: transparent url("../../../assets/poster.png") no-repeat center
		100%;
	background-size: 100% 100%;
	background-clip: content-box;
	background-origin: content-box;
	padding: 22px 27px;
	box-sizing: border-box;
	/* background-color: #FFFFFF; */
}
.RTask .imgTxtClass {
	font-size: 14px;
	display: flex;
	flex-direction: row;
	align-items: center;
	color: #ffffff;
	font-family: "PingFangSC-Medium";
}
.RTask .asidFontColor {
	color: #bbbbbb;
	font-size: 14px;
}
.RTask .HomeFooterChannelName {
	font-size: 12px;
	position: relative;
	color: rgb(128, 130, 132);
	width: 100%;
	height: 17.5%;
}

.elPopoverClass .el-radio {
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

.elPopoverClass .el-input__prefix,
.elPopoverClass .el-input__suffix {
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
.elPopoverClass .el-input__suffix .el-input__icon {
	height: 100%;
	width: 25px;
	text-align: center;
	-webkit-transition: all 0.3s;
	transition: all 0.3s;
	line-height: 0px;
}
.RTask .el-progress-circle__track {
	stroke: rgb(61, 65, 71);
	/* stroke: #28ffbb; */
	fill: none;
}

.elPopoverClass .el-radio + .el-radio {
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
.taskParentBgClass {
	background: rgba(32, 33, 36, 0.1);
}
.taskParentPopoverBox {
	width: 245px;
	border-right: 1px solid rgb(104, 103, 102);
	background: rgba(32, 33, 36, 0.1);
}
.taskParentBox {
	width: 100%;
	height: calc(100% - 18px);
	margin-top: 15px;
	display: flex;
	flex-wrap: nowrap;
	justify-content: flex-start;
	background: rgba(32, 33, 36, 0.1);
}
.RTask .asidClass {
	height: 100%;
	overflow: auto;
	background-image: linear-gradient(-180deg, #343942 4%, #2e3537 100%);
}
.taskParent .el-radio__inner {
	background-color: transparent;
	display: none;
}
.elPopoverClass .el-radio__input.is-checked + .el-radio__label {
	color: #28ffbb;
}
.elPopoverClass .el-radio__input.is-checked .el-radio__inner {
	background-color: transparent;
	color: #28ffbb;
	border-color: #28ffbb;
	display: none;
}
.elPopoverClass .el-radio__input.is-indeterminate .el-radio__inner {
	background-color: transparent;
	border-color: gray;
	display: none;
}
.elPopoverClass .taskItemsBtn:active,
.elPopoverClass .taskItemsBtnActive {
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
	font-family: "PingFangSC-Medium";
}
.RTask .el-dialog {
	width: 920px;
	color: #fff;
	height: 730px;
	position: relative;
	margin: 0 auto 50px;
	background: #24272a;
	border-radius: 3px;

	-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
}
.elPopoverClass {
	width: calc(66.667% - 210px);
	height: calc(70% - 120px);
	position: absolute;
	left: 235px !important;
	top: 125px !important;
	background-color: transparent;
	z-index: 10 !important;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	border: 0px;
	padding: 0px 12px;
}

.RTask a:-webkit-any-link {
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
.RTask .fontTheme {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: rgb(40, 255, 187) !important;
	letter-spacing: 0;
	cursor: pointer;
}
.RTask .fontThemes {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #28ffbb;
	letter-spacing: 0;
	cursor: pointer;
}
.RTask .el-dropdown-link {
	color: #ffffff;
	display: block;
	font-size: 14px;
}
.RTask .asidListRow {
	width: 100%;
	margin-top: 3%;
	/* height: 18%; */
	color: #fff;
	/* background-color: rgb(29, 31, 34); */
	background-color: rgba(0, 0, 0, 0.15);
	border-radius: 3px;
	border: 1px solid rgba(255, 255, 255, 0.09);
	white-space: nowrap;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	box-sizing: border-box;
}
.RTask .textclipsClass,
.RTask .asidListRow span {
	font-family: "PingFangSC-Regular";
	/* display: inline-block; */
	/* width: 100%; */
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1; /*3表示只显示3行*/
	/* autoprefixer: off */
	-webkit-box-orient: vertical;
	/* autoprefixer: on */
}
.RTask .asidCardClass {
	display: flex;
	justify-content: space-between;
	flex-wrap: nowrap;
}

.RTask .el-popover {
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
.RTask .footer-top-row {
	background-color: transparent;
	color: #fff;
	line-height: 60px;
}
.RTask .footerRowClass {
	width: calc(100% + 0px);
	height: calc(100% - 40px);
	line-height: 24px;
	color: #fff;
	display: flex;
	vertical-align: middle;
	align-items: flex-end;
	box-sizing: border-box;
	padding: 1% 0px 1% 15px;
	background: rgba(36, 39, 42, 1);
}
.RTask .footerCardClass {
	margin: auto 3px;
	width: calc((100% - 54px) / 9);
	height: 100%;
	box-sizing: border-box;
	/* padding: 0px 8px; */
	padding-right: 15px;
	vertical-align: middle;
	/* border:1px solid rgb(45, 78, 75); */
	background-color: transparent;
}
.RTask .footerCardImg {
	width: 100%;
	height: 100%;
	-webkit-background-size: cover;
	-webkit-background-origin: content;
	background-origin: content;
	background-size: auto 100%;
	-webkit-background-origin: content;
	background-origin: content;
}
#home {
	font-family: Helvetica, sans-serif;
	text-align: center;
	box-sizing: border-box;
	background-color: rgb(28, 29, 32);
	padding: 0 0 0 2.5%;
}
.RTask .el-header {
	padding-top: 20px;
	text-align: left;
	box-sizing: border-box;
}
.RTask .el-footer {
	color: #333;
	text-align: center;
	line-height: 60px;
	min-height: 60px;
	vertical-align: middle;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	vertical-align: middle;
	padding: 0px 1px 2% 0px;
	box-sizing: border-box;
}

.leftflexButton,
.leftflexButton:focus,
.leftflexButton:hover {
	background-color: transparent;
	color: #ffffff;
	border: 0;
	padding: 10px 14px !important;
}
.font12 {
	font-size: 12px;
}
.RTask .aside-row {
	background-color: transparent;
	/* line-height: 30px; */
	color: #28ffbb;
	/* padding-bottom: 17px; */
	/* border-bottom: 1px dashed rgba(250,250,250,0.1); */
	margin: 2.5% 0px 0px;
}

.font-white {
	color: #fff;
	font-weight: 700;
}
.RTask .el-aside {
	color: #333;
	text-align: center;
	/* background: rgba(0, 0, 0, 0.15); */
	background-color: #212325;
	/* border-left: 1px solid rgba(255, 255, 255, 0.1); */
	box-sizing: border-box;
	padding: 0 2%;
}

.RTask .el-main {
	color: #333;
	text-align: center;
	padding: 0px 0px 1px 0px;
	background: rgba(36, 39, 42, 1);
}

.RTask .main-box {
	position: relative;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	box-sizing: border-box;
	background: transparent;
	/* padding: 0px 20px 15px; */
	background: rgba(36, 39, 42, 1);
}
.RTask .el-container {
	padding-right: 2%;
	box-sizing: border-box;
}
</style>
