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
						placement="right"
						trigger="click"
					>
						<el-row class="taskParentBox">
							<el-row class="taskParent taskParentPopoverBox">
								<el-tree
									ref="deviceTree"
									:props="defaultProps"
									:check-strictly="true"
									:highlight-current="true"
									:indent="10"
									:expand-on-click-node="false"
									:data="deviceTreeList"
									lazy
									:load="loadNode"
									node-key="id"
									:default-expanded-keys="defaultExpandedKeys"
									@node-click="handleNodeClick"
								></el-tree>
							</el-row>
							<el-row class="taskParent taskParentBgClass">
								<div class="checkBoxTitle">
									<el-checkbox
										class="checkBoxClass"
										v-model="notCheckAll"
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
										v-for="(channelItem,index) in channelInfoList"
										:label="channelItem"
										:key="index"
									>{{channelItem.nickName}}</el-radio>
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
						<div ref="canvasRefs" id="player"></div>
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
								:data="taskList"
								show-checkbox
								node-key="faceMonitorUuid"
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
					<div class="asidListRow" v-for="(o,index) in 5" :key="index">
						<recoginize-card
							imgWidth="99"
							:recoginizeItem="comparePhotoList[index]"
							@detailClick="doRecoginizeDetail(index)"
						/>
					</div>
				</el-row>
			</el-aside>
		</el-row>
		<!-- ======================================================= 弹 窗 ========================================================== -->
		<el-dialog class="dialogClass" :visible.sync="dialogVisible" @close="closeDialog">
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
			></dialogview>
		</el-dialog>
	</div>
</template>
<script>
import RestApi from "@/utils/RestApi.js";
import dialogview from "@/pages/faceModule/components/dialogForm.vue";
import alPopoverTree from "@/pages/faceModule/components/AlElTree.vue";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
import BigImg from "@/pages/faceModule/components/BigImg.vue";
import ImgCard from "@/pages/faceModule/components/ImgCard.vue";
import RecoginizeCard from "@/pages/faceModule/components/RecoginizeCard.vue";
import * as api from "@/pages/faceModule/http/homeBaseHttp.js";
import * as logApi from "@/pages/faceModule/http/logSearchHttp.js";
import { mapState } from "vuex";
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
      imageHeader: RestApi.api.imageUrl,
      isIndeterminate: false,
      canvsWidth: "300px",
      footerHeight: "60px",
      asideWidth: "60px",
      asidDropdownMednu: "全部任务", // 选中的任务
      deviceTreeList: [], // 设备树
      dialogVisible: false, // 彈窗顯示標記
      dialogParama: null,
      footerLiftType: false, // 抓拍記錄與車流量統計的切換
      taskList: [],
      visible_popver: false, // task弹窗是否弹出，默认隐藏
      rtspAddress: "",
      channelInfoList: [], // 所有通道名称和ID的二元list
      notCheckAll: true, // 通道勾选的list的长度
      checkTaskAll: true,
      checkedChannelsUuidList: [], // 当前勾选的通道Id的list
      checkedChannel: "",
      checkedChannelsUuid: "", // 当前轮询的ID
      websocket: null,
      photoList: [], // 抓拍列表
      comparePhotoList: [], // 人臉對比列表
      photoStaticList: Array.from({ length: 24 }, () => 0), // 人流量统计
      socketIP: this.$store.state.socketIP, //
      todayShootCount: 0, // 今日抓拍次数
      todayCompareCount: 0, // 今日对比次数
      streamType: "main",
      streamTypeOptions: [
        { typeStr: "main", typeName: "主码流" },
        { typeStr: "sub", typeName: "辅码流" },
        { typeStr: "thrid", typeName: "三码流" }
      ],
      fullscreenLoading: false, // 局部遮罩是否显示
      mainVideoScreenLoading: false, // 视频遮罩是否显示
      checkTimeConst: 3600000, // 轮询时间1小时获取一次数据统计分布图 3600000
      startTime: "",
      endTime: "",
      shootPhotoList: [],
      defaultTreeProps: {
        label: "faceMonitorName",
        id: "faceMonitorUuid"
      },
      showImg: false,
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "isLeaf"
      },
      checkedTaskUUidList: [],
      checkedNodes: [],
      dialogfullscreenLoading: false,
      stompClient: null,
      defaultExpandedKeys: [],
      video_mgr: null
    };
  },
  computed: {
    ...mapState({
      CapturePhotoArr: state => {
        return state.home.CapturePhotoArr;
      },
      RecognizationArr: state => {
        return state.home.RecognizationArr;
      }
    })
  },
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
      // that.$nextTick(() => {
      //   that.$refs.mainHeightBox.$el.style.height = (7 * h) / 10 + "px";
      //   that.$refs.heightBox.$el.style.height = h + "px";
      // });
      that.footerHeight = (3 * h) / 10 + "px";
      that.asideWidth = w / 3 - 40 + "px";
    });
    this.startTime = this.$common.getStartTime();
    this.endTime = this.$common.getCurrentTime();
    this.getDeviceList();
    this.getTaskList();
  },

  destroyed: function() {
    console.log("关闭页面");
    if (this.websocket) {
      this.websocket.close();
    }
    this.stompClient = null;
    this.websocket = null;
  },
  watch: {
    CapturePhotoArr(val) {
      // console.log(val);
      let arr = [];
      val.map(item => {
        if (this.checkedChannelsUuidList.indexOf(item.channelUuid) !== -1) {
          arr.push(item);
          this.todayShootCount += 1;
        }
      });
      this.photoList = arr;
    },
    RecognizationArr(val) {
      console.log(val);
      let arr = [];
      val.map(item => {
        if (this.checkedTaskUUidList.indexOf(item.faceMonitorUuid) !== -1) {
          arr.push(item);
          this.todayCompareCount += 1;
        }
      });
      this.comparePhotoList = arr;
    }
  },
  methods: {
    loadNode(node, resolve) {
      api
        .getFaceDeviceList({ parentOrgUuid: node.data.id })
        .then(res => {
          if (res.data.success && res.data.data) {
            let data = res.data.data;
            for (let i = 0, len = data.length; i < len; i++) {
              if (parseInt(data[i].nextCount) === 0) {
                data[i].isLeaf = true;
                this.$set(data[i], "isLeaf", true);
              }
            }
            resolve(data);
          } else {
            resolve([]);
          }
        })
        .catch(() => {
          resolve([]);
        });
    },
    // 点击设备树的事件
    /**
     *  "channelUuid": "string",  通道UUID
        "channelName": "string",通道名称
    		"nickName": "string",昵称
    		"channelType": "int",通道类型
    		"deviceUuid": "string",设备UUID
     */
    handleNodeClick(data) {
      api
        .getDeviceChannelList({ parentOrgUuid: data.id })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.channelInfoList = res.data.data;
            this.checkedChannel = this.channelInfoList[0];
            if (this.notCheckAll) {
              // 勾了单选
              this.checkedChannelsUuidList = [];
              this.checkedChannelsUuidList[0] = this.checkedChannel.channelUuid;
            } else {
              // 去掉单选
              this.checkedChannelsUuidList = [];
              this.channelInfoList.forEach(item => {
                this.checkedChannelsUuidList.push(item.channelUuid);
              });
            }
            this.getPhotoList();
            this.getRtspInChannelUuid(this.channelInfoList[0].channelUuid);
          } else {
            console.log(res.data.data);
            this.$message({ type: "warning", message: "查询数据为空" });
          }
        })
        .catch(() => {});
    },

    // 获取设备列表
    getDeviceList(uuid) {
      let data = { parentOrgUuid: uuid };
      api
        .getFaceDeviceList(data)
        .then(res => {
          api
            .getFaceDeviceList(data)
            .then(res => {
              if (res.data.success && res.data.data) {
                this.deviceTreeList = res.data.data;
                this.defaultExpandedKeys = [];
                this.defaultExpandedKeys.push(this.deviceTreeList[0].id);
                this.handleNodeClick(this.deviceTreeList[0]);
              } else {
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    // 布控任务列表
    getTaskList() {
      this.taskList = [];
      this.checkedTaskUUidList = [];
      logApi
        .getTaskList({ enabled: 1 })
        .then(res => {
          if (res.data.success) {
            var taskList = res.data.data;
            this.taskList = taskList;
            taskList.forEach(item => {
              this.checkedTaskUUidList.push(item.faceMonitorUuid);
            });
            this.todayCompareCount = 0;
            this.getRecongizeList();
          } else {
            this.$message({ message: "请求布控任务列表错误", type: "warning" });
          }
        })
        .catch(() => {});
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
      this.notCheckAll = val;
      if (val) {
        // 勾了单选
        this.checkedChannelsUuidList = [];
        this.checkedChannelsUuidList[0] = this.checkedChannel.channelUuid;
      } else {
        // 去掉单选
        this.checkedChannelsUuidList = [];
        this.channelInfoList.forEach(item => {
          this.checkedChannelsUuidList.push(item.channelUuid);
        });
      }
      // 更新抓拍数据和统计数据
      this.todayShootCount = 0;
      this.getPhotoList();
      if (this.footerLiftType) {
        // 获取人脸统计
        this.getPhotoStaticList();
      }
    },
    // 选中某通道
    handleCheckedCitiesChange(value) {
      console.log("选中某通道------", this.checkedChannel);
      // 获取rtspUlrl
      this.getRtspInChannelUuid(this.checkedChannel.channelUuid, true);
      // 更新抓拍总数
      if (this.notCheckAll) {
        this.checkedChannelsUuidList = [];
        this.checkedChannelsUuidList[0] = this.checkedChannel.channelUuid;
        this.todayShootCount = 0;
        this.getPhotoList();
        if (this.footerLiftType) {
          // 获取人脸统计
          this.getPhotoStaticList();
        }
      }
      this.visible_popver = false;
    },
    // 布控任务通道ID获取码流参数
    getRtspInChannelUuid(channelUuid, isBool) {
      let data = {
        channelUuid: channelUuid,
        streamType: this.streamType
      };
      api
        .getRtspUrlByChannelUuidApi(data)
        .then(res => {
          if (res.data.success) {
            let data = res.data.data;
            Object.assign(this.checkedChannel, data);
            this.loadVideo(data);
          }
        })
        .catch(() => {});
    },
    loadVideo(data) {
      data.localId = "192.168.9.21";
      // eslint-disable-next-line
			this.video_mgr = new CVideoMgrSdk();
      this.canvas = document.createElement("canvas");
      this.canvas.width = (this.WIDTH() * 2) / 3 - 120;
      this.canvas.height = (this.HEIGHT() * 6) / 10 - 100;
      let ip = data.localId;
      this.video = this.video_mgr.play(
        `{"srcUuid":"signal_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "ip": "${ip}", "port":"4400"}}}`,
        `{"srcUuid":"media_channel", "routeType":"location", "param":{"location":{"protocol":"icc-ws", "ip": "${ip}", "port":"4401"}}}`,
        data.rtspUrl,
        "rtsp",
        "preview",
        this.canvas,
        this.streamType
      );
      this.$refs.canvasRefs.appendChild(this.canvas);
    },

    // 弹窗事件 关闭弹窗的回调，得到子组件的参数
    closeDialog(e) {
      this.showImg = false;
      this.dialogVisible = e;
    },
    // 获取抓拍记录
    getPhotoList(currentPage = 1, pageSize = 9) {
      this.photoList = []; // 清除记录
      var data = {
        page: 1,
        limit: 9,
        channelUuids: this.checkedChannelsUuidList.toString(),
        snapshotTimeStart: this.$common.getStartTime(),
        snapshotTimeEnd: this.$common.getCurrentTime()
      };
      if (!data.channelUuids) data.channelUuids = null;
      logApi.getSnapshotList(data).then(res => {
        if (res.data.success && res.data.data) {
          this.photoList = res.data.data.list;
          this.todayShootCount = res.data.data.total;
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
        limit: 5,
        page: 1,
        faceMonitorUuids: this.checkedTaskUUidList.toString(),
        snapshotTimeStart: this.$common.getStartTime(),
        snapshotTimeEnd: this.$common.getCurrentTime()
      };
      // 过滤空字符串
      if (!data.faceMonitorUuids) data.faceMonitorUuids = null;
      this.comparePhotoList = [];
      logApi
        .getRecognizeList(data)
        .then(res => {
          this.mainScreenLoading = false;
          if (res.data.success && res.data.data) {
            this.comparePhotoList = res.data.data.list;
            this.todayCompareCount = res.data.data.total;
          } else {
            this.$message({
              message: "没有查找到相关的识别记录",
              type: "warning"
            });
          }
        })
        .catch(() => {});
    },
    // 获取人流量分布统计
    getPhotoStaticList() {
      if (!this.notCheckAll) {
        this.getFaceCaptureSumByDay();
      } else {
        this.getSingleFaceCapSumByDay();
      }
    },
    // 今日全部抓拍
    getFaceCaptureSumByDay() {
      this.fullscreenLoading = !this.fullscreenLoading;
      this.$statisticHttp
        .getFaceCaptureAll({
          sort: "desc",
          faceCapturePhotoQuality: ["HIGH", "NORMAL", "LOW"].toString(),
          reportType: "faceDailyReport",
          searchDate: this.$common.getCurrentTime()
        })
        .then(res => {
          this.fullscreenLoading = !this.fullscreenLoading;
          let body = res.data;
          if (body.data) {
            let arr = body.data;
            let num = [];
            arr.forEach((item, index) => {
              num[index] = 0;
              item.forEach(o => {
                num[index] += o.snapshotTotal;
              });
            });
            this.photoStaticList = num;
          }
          this.drawLine();
        })
        .catch(() => {
          this.fullscreenLoading = !this.fullscreenLoading;
        });
    },
    // 今日单一摄像头全部抓拍
    getSingleFaceCapSumByDay() {
      this.fullscreenLoading = !this.fullscreenLoading;

      this.$statisticHttp
        .getFaceCaptureOne({
          channelUuid: this.checkedChannelsUuidList[0],
          reportType: "faceDailyReport",
          faceCapturePhotoQuality: ["HIGH", "NORMAL", "LOW"].toString(),
          searchDate: this.$common.getCurrentTime()
        })
        .then(res => {
          this.fullscreenLoading = !this.fullscreenLoading;
          let body = res.data;
          this.photoStaticList = [];
          if (body.data) {
            for (let i = 0; i < 25; i++) {
              this.photoStaticList.push(0);
            }
            body.data.forEach((v, i) => {
              this.photoStaticList[i + 1] = v;
            });
          }
          this.drawLine();
        })
        .catch(() => {
          this.fullscreenLoading = !this.fullscreenLoading;
        });
    },
    // 视频选择框显示，右侧按钮显示
    popverShow(e) {
      this.$refs.tree.setCheckedKeys(this.checkedTaskUUidList);
    },
    // 视频选择框隐藏,左侧按钮显示
    popverHidden(e) {
      if (this.checkedNodes && this.checkedNodes.length) {
        this.asidDropdownMednu = "";
        for (var i = 0; i < this.checkedNodes.length; i++) {
          this.asidDropdownMednu += this.checkedNodes[i].faceMonitorName;
          this.asidDropdownMednu += ",";
        }
      }
      // 预防在接口返回结果前，websocket就有推送数据
      this.todayCompareCount = 0;
      this.getRecongizeList();
    },
    doRecoginizeDetail(e) {
      console.log("右侧的弹窗事件index", e);

      if (e >= 0 && this.comparePhotoList[e]) {
        console.log(this.comparePhotoList[e]);
        this.dialogParama = this.comparePhotoList[e];
        this.getAlarmShootPhotoList(this.comparePhotoList[e]);
      }
    },

    // 根据客户端的传的人员staffUuid查找抓拍图片
    getAlarmShootPhotoList(rowData, currentPage = 1, pageSize = 24) {
      this.updatedFlag = true;
      var data = {
        faceUuid: rowData.faceUuid,
        limit: 8,
        page: 1
      };
      this.dialogfullscreenLoading = true;
      logApi
        .getRecognizeInfo(data)
        .then(res => {
          this.dialogfullscreenLoading = !this.dialogfullscreenLoading;
          if (res.data.success) {
            this.dialogVisible = true;
            this.dialogParama = res.data.data;
          }
        })
        .catch(() => {
          this.dialogfullscreenLoading = !this.dialogfullscreenLoading;
        });
    },

    // 左侧的底部的切换按钮,切换人脸抓拍与人流量统计的视图
    footerTypeAct() {
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
      this.$refs.canvsWidth.$el.style.width = (w * 2) / 3 - 180 + "px";
      this.$refs.canvsWidth.$el.style.height = (3 * h) / 10 - 100 + "px";
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
	width: 95%;
	height: calc(100% - 55px);
	overflow: auto;
	box-sizing: border-box;
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
	overflow: auto;
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
	font-family: "PingFangSC-Regular";
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
	font-family: "PingFangSC-Regular";
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
	text-align: left;
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
	text-align: center;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	margin: 0px 8px;
	padding-top: 10px;
}
.taskParentBgClass {
	background: rgba(32, 33, 36, 0.1);
	width: calc(100% - 245px);
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
	font-family: "PingFangSC-Regular";
	font-size: 16px;
	color: #cccccc;
	letter-spacing: 0;
}
.RTask .fontTheme {
	font-family: "PingFangSC-Regular";
	font-size: 14px;
	color: rgb(40, 255, 187) !important;
	letter-spacing: 0;
	cursor: pointer;
}
.RTask .fontThemes {
	font-family: "PingFangSC-Regular";
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
	background-color: rgba(0, 0, 0, 0.15);
	border-radius: 3px;
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
	background-color: transparent !important;
	color: #ffffff !important;
	border: 0 !important;
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
