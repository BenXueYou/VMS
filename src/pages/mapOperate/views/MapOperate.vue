<template>
  <div class="map-main"
       id="operate-main"
       v-loading="isMainLoading"
       @mouseover="mainMouseOver"
       @click="mainClick">
    <video-preview-dialog :visible.sync='VideoPreviewVisible'
                          :channelUuid="channelUuid"
                          :channelName="channelName"
                          moduleName="地图操作"
                          :orgName="orgName"
                          :channelType="channelType">
    </video-preview-dialog>
    <video-play-back-dialog :visible.sync="VideoPlayBackVisible"
                            :channelUuid="channelUuid"
                            :startTime="startTime"
                            :orgName="orgName"
                            moduleName="地图操作"
                            :channelName="channelName"
                            :endTime="endTime"
                            videoType="normal_vod"
                            :channelType="channelType">
    </video-play-back-dialog>
    <item-oper-block v-if="isShowDoorBlock"
                     :blockTop="itemTop"
                     :blockLeft="itemLeft"
                     :data="itemInfoData.itemWebData"
                     :mapType="mapType"
                     @videoLook="videoLook"
                     @videoBack="videoBack"
                     moduleName="地图操作"
                     @closeBlock="closeBlock"
                     @eleCollection="eleCollection"
                     @doorAction="doorAction"
                     @doorLog="doorLog"
                     @turnToLinkMap="turnToLinkMap"
                     @alarmRecord="alarmRecord" />
    <door-action :isShow="isShowDoorAction"
                 @onCancel="onCancelDoorAction"
                 ref="doorAction"
                 moduleName="地图操作"
                 :itemData="clickItemWebData"
                 @handleDoorStatus="handleDoorStatus" />
    <door-record :isShow="isShowDoorRecord"
                 @onCancel="onCancelDoorRecord"
                 :orgName="orgName"
                 moduleName="地图操作"
                 :itemData="clickItemWebData" />
    <door-alarm-log :isShow="isShowDoorAlarmRecord"
                    :orgName="orgName"
                    moduleName="地图操作"
                    @onCancel="onCancelDoorAlarmRecord"
                    :itemData="clickItemWebData" />
    <to-add-auth-dialog :isShow="isShowToAddAuth"
                        @onCancel="onCancelToAddAuth" />
    <div v-if="hasNoMapCopy"
         class="default-block">
      <div>
        <img src="@/assets/images/map/default_pic.png">
      </div>
      <div style="margin-top: 20px;">没有地图，请先添加地图再操作…</div>
      <el-button type="text"
                 @click="turnToMapConfig">
        <img src="@/assets/images/map/turnto.png">
        <span style="margin-left: 10px;">前往添加地图</span>
      </el-button>
    </div>
    <div class="map-self"
         id="gis-map"
         v-if="!hasNoMap && isShowGis"></div>
    <div class="map-self"
         id="pic-map"
         v-if="!hasNoMap && isShowPic"></div>
    <div class="option-search-opreate"
         v-if="!hasNoMap">
      <el-input placeholder="输入关键字查找"
                v-model="keyWord"
                clearable
                :disabled="!ShowAuthDisabled"
                @keyup.enter.native="clickSearch"
                v-if="!isShowTypeFind"
                style="width: 320px">
        <div slot="prepend"
             @click="clickFind"
             :disabled="!ShowAuthDisabled"
             style="width: 34px; text-align: center;">
          <img src="@/assets/images/map/find.png">
        </div>
        <el-button slot="append"
                   icon="el-icon-search"
                   :disabled="!ShowAuthDisabled"
                   @click.stop="clickSearch"></el-button>
      </el-input>
      <div class="type-find"
           v-if="isShowTypeFind">
        <el-tabs v-model="activeName"
                 @tab-click="handleTabClick">
          <el-tab-pane label="资源"
                       name="resource"></el-tab-pane>
          <el-tab-pane label="地址"
                       name="address"
                       v-if="mapType === 'gis'"></el-tab-pane>
          <el-tab-pane label="收藏"
                       name="collection"></el-tab-pane>
        </el-tabs>
        <div>
          <img src="@/assets/images/map/delete_clo.png"
               style="margin-right: 10px;curcor: pointer"
               @click="closeFind">
          <el-button icon="el-icon-search"
                     @click.stop="turnToSearch"></el-button>
        </div>
      </div>
    </div>
    <div class="search-result"
         v-show="isShowResult"
         v-if="!hasNoMap && ishaveResult"
         id="r-result"
         @click.stop="stopProg"
         v-loading="isLoading">
      <div class="result-title">
        查询结果（{{resultTotal}}）
      </div>
      <div class="result-items">
        <template v-for="(item, index) in resItemsData">
          <div :key="index"
               class="search-item">
            <div class="item-title">
              <div :style="`background: url(${require('@/assets/images/map/address.png')});`"
                   class="item-icon">
                {{index + 1}}
              </div>
              <div style="margin-left: 10px">{{item.elementName}}</div>
            </div>
            <div class="item-info">
              <div class="info-detail">设备名称：{{item.elementName}}</div>
              <div class="info-detail">通道类型：{{$common.getEnumItemName("chn", item.elementThirdType)}}</div>
              <div class="info-detail">厂商：{{item.channelInfo ? item.channelInfo.devManuf : ""}}</div>
              <div class="info-detail">能力集：{{item.channelInfo ? transformScan(item.channelInfo.scanCollectionList) : ""}}</div>
              <div class="info-detail">在线状态：{{item.channelInfo ? $common.getEnumItemName("onoffline", item.channelInfo.onlineStatus) : ""}}</div>
            </div>
            <div class="item-button">
              <div class="button-block">
                <div class="button-detail"
                     @click.stop="locationEle(item)">
                  <img src="@/assets/images/map/location_s.png">
                  <span style="margin-left: 3px">定位</span>
                </div>
                <div class="split-line"></div>
                <div class="button-detail"
                     @click.stop="collectEle(item)"
                     :style="`cursor: ${OwnAuthDisabled ? 'pointer' : 'not-allowed'}`">
                  <img src="@/assets/images/map/collect.png">
                  <span style="margin-left: 3px">{{item.collectionStatus ? "取消收藏" : "收藏"}}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="result-foot">
        <el-pagination background
                       small
                       layout="prev, pager, next"
                       :page-size="elePageInfo.pageSize"
                       :current-page="elePageInfo.currentPage"
                       @current-change='handleCurrentChange'
                       :total="elePageInfo.total">
        </el-pagination>
      </div>
    </div>
    <div class="find-result"
         v-if="isShowFindResult">
      <el-input placeholder="输入关键字查找"
                v-model="findkeyWord"
                clearable
                @keyup.enter.native="turnToSearch"
                class="find-result-title">
        <img slot="prefix"
             src="@/assets/images/search_s.png">
      </el-input>
      <div class="find-result-items"
           v-if="historyData && historyData.length !== 0">
        <template v-for="(item, index) in historyData">
          <div :key="index"
               class="find-search-item"
               @click="setLogIn(item)">
            {{item.historicalRecord}}
          </div>
        </template>
        <div class="result-foot">
          <el-pagination background
                         small
                         layout="prev, pager, next"
                         :page-size="historyPageInfo.pageSize"
                         :current-page="historyPageInfo.currentPage"
                         @current-change='handleCurrentChange2'
                         :total="historyPageInfo.total">
          </el-pagination>
        </div>
      </div>
      <div class="find-result-foot"
           v-if="historyData && historyData.length !== 0">
        <img src="@/assets/images/delete.png"
             @click="deleteHistory">
        <div class="delete-text"
             @click="deleteHistory">删除历史</div>
      </div>
    </div>
    <div class="map-option"
         :style="`width: ${(mapType === 'gis' ? 400 : 340) + (isShowLinkBack ? 80 : 0)}px`"
         v-if="!hasNoMap">
      <div class="option-button"
           @click="linkBack"
           v-if="isShowLinkBack">
        <img src="@/assets/images/map/return.png"
             width="12px"
             height="12px" />
        <span class="button-text">返回</span>
      </div>
      <div class="option-split"
           v-if="isShowLinkBack"></div>
      <div class="option-button"
           @mouseover.stop="isShowSurveyMenu = true"
           v-if="mapType === 'gis'">
        <img src="@/assets/images/map/survey.png" />
        <span class="button-text">测量</span>
        <img src="@/assets/images/map/drdown.png"
             style="margin-left: 8px;" />
        <div v-if="isShowSurveyMenu"
             @mouseover.stop="isShowSurveyMenu = true"
             class="popover-layer">
          <div class="option-popover">
            <div class="popover-menu"
                 @click="gisDistanceTool">
              <img src="@/assets/images/map/ranging.png" />
              <span class="button-text">测距</span>
            </div>
            <div class="popover-menu"
                 @click="gisAreaTool">
              <img src="@/assets/images/map/measure_sur.png" />
              <span class="button-text">测面</span>
            </div>
          </div>
        </div>
      </div>
      <div class="option-split"
           v-if="mapType === 'gis'"></div>
      <div class="option-button"
           @mouseover.stop="isShowSelectMenu = true">
        <img src="@/assets/images/map/rect_select.png" />
        <span class="button-text">选择</span>
        <img src="@/assets/images/map/drdown.png"
             style="margin-left: 8px;" />
        <div v-if="isShowSelectMenu"
             @mouseover.stop="isShowSelectMenu = true"
             class="popover-layer">
          <div class="option-popover">
            <div class="popover-menu"
                 @click="rectSelect">
              <img src="@/assets/images/map/rect_select.png" />
              <span class="button-text">框选</span>
            </div>
            <div class="popover-menu"
                 @click="circleSelect">
              <img src="@/assets/images/map/cricle_select.png" />
              <span class="button-text">圈选</span>
            </div>
            <div class="popover-menu"
                 @click="polygonSelect">
              <img src="@/assets/images/map/many_select.png" />
              <span class="button-text">多边形选</span>
            </div>
          </div>
        </div>
      </div>
      <div class="option-split"></div>
      <div class="option-button"
           @click="layer">
        <img src="@/assets/images/map/shadow.png" />
        <span class="button-text">图层</span>
      </div>
      <div class="option-split"></div>
      <div class="option-button"
           @click="clear">
        <img src="@/assets/images/map/clear.png" />
        <span class="button-text">清屏</span>
      </div>
      <div class="option-split"></div>
      <div class="option-button"
           @click="fullScreen">
        <img src="@/assets/images/map/all.png" />
        <span class="button-text">{{screenText}}</span>
      </div>
    </div>
    <div class="map-layer"
         :style="`width: ${mapType === 'gis' ? 400 : 340}px`"
         v-if="!hasNoMap"
         v-show="isShowLayer">
      <div class="layer-title">
        <div style="display: flex;align-item: center">
          <div class="split-line"></div>
          <div>显示图层</div>
        </div>
        <div>
          <img src="@/assets/images/map/close.png"
               @click="closeLayer"
               style="cursor: pointer">
        </div>
      </div>
      <div class="layer-content">
        <el-checkbox-group v-model="layerCheckList">
          <template v-for="(item, index) in layerArr">
            <el-checkbox :label="item.typeStr"
                         :key="index"
                         @change="layerBoxChange($event, item)">{{item.typeName}}</el-checkbox>
            <div class="layer-item"
                 :key="index + '_chn'">
              <div class="button-title">通道类型：</div>
              <div class="items-button">
                <template v-for="(chnItem, chnIndex) in item.chn">
                  <div :key="chnIndex"
                       class="button-item"
                       :style="handleLayerItemStyle(chnItem)"
                       @click="clickLayerItem(chnItem)">
                    {{ chnItem.typeName }}
                  </div>
                </template>
              </div>
            </div>
            <div class="layer-item"
                 :key="index + '_online'">
              <div class="button-title">在线状态：</div>
              <div class="items-button">
                <template v-for="(onLineStatusItem, onLineStatusIndex) in item.onlineStatus">
                  <div :key="onLineStatusIndex"
                       class="button-item"
                       :style="handleLayerItemStyle(onLineStatusItem)"
                       @click="clickLayerItem(onLineStatusItem)">
                    {{ onLineStatusItem.typeName }}
                  </div>
                </template>
              </div>
            </div>
            <div class="layer-item"
                 :key="index + '_scan'"
                 v-if="item.typeStr === 'vc'">
              <div class="button-title">能力集：</div>
              <div class="items-button">
                <template v-for="(scanItem, scanIndex) in item.scanCollectionList">
                  <div :key="scanIndex"
                       class="button-item"
                       :style="handleLayerItemStyle(scanItem)"
                       @click="clickLayerItem(scanItem)">
                    {{ scanItem.typeName }}
                  </div>
                </template>
              </div>
            </div>
          </template>
        </el-checkbox-group>
      </div>
    </div>
    <div class="map-control">
      <el-tooltip class="item"
                  effect="dark"
                  content="组织结构"
                  :disabled="isShowOrgTree"
                  placement="left">
        <div class="button-block"
             @click.stop="isShowOrgTree = true">
          <img src="@/assets/images/map/organaze.png" />
          <div class="orgtree-layer"
               v-show="isShowOrgTree">
            <div class="control-popover"
                 v-popover:popover>
              <span>{{orgName}}</span>
              <img src="@/assets/images/map/down.png">
            </div>
            <el-popover ref="popover"
                        placement="top-start"
                        width="165"
                        popper-class="m-popover"
                        trigger="click">
              <el-tree :props="defaultProps"
                       node-key="id"
                       :indent="10"
                       lazy
                       :load="loadNode"
                       ref="opOrgTree"
                       :default-expanded-keys="defaultExpKeys"
                       :highlight-current="true"
                       :expand-on-click-node="false"
                       @node-click="handleNodeClick">
                <div slot-scope="{ node }">
                  <div class="text-show"
                       :style="`width: ${140 - 35 - 10 * node.level}px`"
                       :title='node.label'>{{node.label}}</div>
                </div>
              </el-tree>
            </el-popover>
          </div>
        </div>
      </el-tooltip>
      <el-tooltip class="item"
                  effect="dark"
                  v-if="!hasNoMap"
                  content="回到中心点"
                  placement="left">
        <div class="button-block"
             @click="clickCenter">
          <img src="@/assets/images/map/location.png" />
        </div>
      </el-tooltip>
      <el-tooltip class="item"
                  effect="dark"
                  v-if="!hasNoMap"
                  content="放大一级"
                  placement="left">
        <div class="button-block"
             @click="clickcLarge">
          <img src="@/assets/images/map/enlarge.png" />
        </div>
      </el-tooltip>
      <el-tooltip class="item"
                  effect="dark"
                  v-if="!hasNoMap"
                  content="缩小一级"
                  placement="left">
        <div class="button-block"
             @click="clickcReduce">
          <img src="@/assets/images/map/reduce.png" />
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import * as GTMap from "@/utils/GTMap.js";
import ItemOperBlock from "@/pages/mapOperate/components/ItemOperBlock";
import DoorAction from "@/pages/mapOperate/components/DoorAction";
import DoorRecord from "@/pages/mapOperate/components/DoorRecord";
import DoorAlarmLog from "@/pages/mapOperate/components/DoorAlarmLog";
import VideoPreviewDialog from "@/pages/mapOperate/components/VideoPreviewDialog";
import VideoPlayBackDialog from "@/pages/mapOperate/components/VideoPlayBackDialog";
import ToAddAuthDialog from "@/pages/mapOperate/components/ToAddAuthDialog";

export default {
  components: {
    ItemOperBlock,
    DoorAction,
    DoorRecord,
    DoorAlarmLog,
    VideoPreviewDialog,
    VideoPlayBackDialog,
    ToAddAuthDialog
  },
  props: {},
  data() {
    return {
      mapType: "gis",
      isShowSurveyMenu: false,
      isShowSelectMenu: false,
      VideoPreviewVisible: false,
      VideoPlayBackVisible: false,
      isShowOrgTree: false,
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      orgName: "",
      mapData: [],
      mapSelfData: [],
      hasNoMap: true,
      hasNoMapCopy: false,
      screenText: "全屏",
      keyWord: "",
      resultTotal: 0,
      elePageInfo: {
        pageSize: 4,
        currentPage: 1,
        total: 0
      },
      historyPageInfo: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      resItemsData: [],
      isShowResult: false,
      isShowFindResult: false,
      isLoading: false,
      mapUuid: "",
      activeName: "resource",
      isShowTypeFind: false,
      historyData: [],
      findkeyWord: "",
      isShowGis: true,
      isShowPic: false,
      ishaveResult: true,
      elementUuidList: [],
      isShowDoorBlock: false,
      isShowDoorAction: false,
      clickItemWebData: null,
      isShowDoorRecord: false,
      layerCheckList: [],
      layerArr: [],
      isShowLayer: false,
      isMainLoading: false,
      stompClient: null,
      defaultExpKeys: [],
      channelUuid: "",
      channelName: "",
      channelType: "",
      startTime: "",
      endTime: "",
      lastObj: "",
      isShowLinkBack: false,
      itemTop: "",
      itemLeft: "",
      refreshFlag: false,
      isShowTopicFlag: false,
      isShowDoorAlarmRecord: false,
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      ConfigShowAuthDisabled: true,
      isShowToAddAuth: false,
      eleCurrentPage: 1,
      mapModel: null,
      mapView: null,
    };
  },
  created() {
    let that = this;
    window.onresize = function() {
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        that.screenText = "全屏";
      }
    };
  },
  activated() {
    if (this.ShowAuthDisabled) {
      if (this.refreshFlag) {
        this.getMapInfo();
        this.refreshFlag = false;
      }
      this.isShowTopicFlag = true;
    }
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("地图操作", "isShow");
    this.ConfigShowAuthDisabled = this.$common.getAuthIsOwn(
      "地图配置",
      "isShow"
    );
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("地图操作", "isOwn");
    if (this.ShowAuthDisabled) {
      this.handleLayerArr();
      this.connectSocket();
    }
  },
  methods: {
    setVideoTime() {
      this.startTime =
        this.$common.formatDate(new Date(new Date())).substr(0, 10) +
        " 00:00:00";
      this.endTime = this.$common.formatDate(new Date());
    },
    videoLook(data) {
      this.channelUuid = data.resourceUuid;
      this.channelName = data.elementName;
      this.channelType = data.elementThirdType;
      this.VideoPreviewVisible = true;
    },
    videoBack(data) {
      this.channelUuid = data.resourceUuid;
      this.channelName = data.elementName;
      this.channelType = data.elementThirdType;
      this.setVideoTime();
      this.VideoPlayBackVisible = true;
    },
    mainMouseOver() {
      this.isShowSurveyMenu = false;
      this.isShowSelectMenu = false;
    },
    mainClick() {
      this.isShowOrgTree = false;
      this.isShowResult = false;
    },
    stopProg() {
      console.log("stopPropagation");
    },
    turnToMapConfig() {
      if (!this.ConfigShowAuthDisabled) {
        this.isShowToAddAuth = true;
        return;
      }
      let menuArr = this.$store.state.home.routerData;
      menuArr[0].children.forEach(v => {
        if (v.name === "MapConfig") {
          if (
            !this.$store.state.home.tagViewArr.some(x => x.name === "MapConfig")
          ) {
            this.$store.dispatch("addTagViewItem", v);
          }
          this.$store.dispatch("setLocalTag", v.name);
          this.$bus.$emit("setLocalTag", v.name);
          this.$router.push({ name: v.name });
        }
      });
    },
    gisDistanceTool() {
      this.mapView.gisDistanceTool("open");
    },
    gisAreaTool() {
      this.mapView.gisAreaTool("open");
    },
    rectSelect() {
      this.mapView.rectangleSelect((itemArr, overlay) => {
        this.selectCommon(itemArr, overlay);
      });
    },
    selectCommon(itemArr, overlay) {
      if (!itemArr || itemArr.length === 0) {
        this.$cToast.warn("未选中点位");
        this.mapView.map.removeOverlay(overlay);
        return;
      }
      let elementUuidList = [];
      itemArr.forEach(v => {
        elementUuidList.push(v.itemId);
      });
      this.closeFind();
      this.keyWord = "";
      this.ishaveResult = false;
      setTimeout(() => {
        this.ishaveResult = true;
        this.clickSearch(elementUuidList);
      }, 200);
    },
    circleSelect() {
      this.mapView.circleSelect((itemArr, overlay) => {
        this.selectCommon(itemArr, overlay);
      });
    },
    polygonSelect() {
      this.mapView.polygonSelect((itemArr, overlay) => {
        this.selectCommon(itemArr, overlay);
      });
    },
    layer() {
      this.isShowLayer = true;
    },
    closeLayer() {
      this.isShowLayer = false;
    },
    handleLayerArr() {
      this.layerArr = [];
      let chnArr = this.$common.getEnumByGroupStr("chn_g");
      chnArr.forEach((v, k) => {
        if (v.typeStr === "vc") {
          this.layerArr.push({
            typeStr: v.typeStr,
            typeName: v.typeName,
            chn: [
              {
                typeStr: "bullet_camera",
                typeName: "枪机"
              },
              {
                typeStr: "dome_camera",
                typeName: "半球机"
              },
              {
                typeStr: "ball_camera",
                typeName: "球机"
              },
              {
                typeStr: "bullet_camera_ptz",
                typeName: "带云台的枪机"
              }
            ],
            onlineStatus: this.$common.getEnumByGroupStr("onoffline"),
            scanCollectionList: [
              {
                typeStr: "bodySnap",
                typeName: "人体"
              },
              {
                typeStr: "faceSnap",
                typeName: "人脸"
              },
              {
                typeStr: "vehicleSnap",
                typeName: "车辆"
              }
            ]
          });
        } else if (v.typeStr === "door") {
          this.layerArr.push({
            typeStr: v.typeStr,
            typeName: v.typeName,
            chn: [
              {
                typeStr: "door",
                typeName: "普通"
              },
              {
                typeStr: "door",
                typeName: "人脸"
              }
            ],
            onlineStatus: this.$common.getEnumByGroupStr("onoffline"),
            scanCollectionList: []
          });
        }
      });
      this.layerArr.forEach((v, k) => {
        this.$set(v, "selected", true);
        v.chn.forEach((v1, k1) => {
          this.$set(v1, "selected", true);
        });
        v.onlineStatus.forEach((v2, k2) => {
          this.$set(v2, "selected", true);
        });
        v.scanCollectionList.forEach((v3, k3) => {
          this.$set(v3, "selected", true);
        });
      });
      this.layerCheckList.push("vc");
      this.layerCheckList.push("door");
    },
    handleLayerItemStyle(item) {
      let styleStr = "";
      if (item.selected) {
        styleStr =
          "border:1px rgba(37,210,152,0.50) solid;background:rgba(37,210,152,0.1);";
      } else {
        styleStr =
          "border:1px transparent solid;background:rgba(255,255,255,0.1);";
      }
      return styleStr;
    },
    clickLayerItem(item) {
      this.isShowDoorBlock = false;
      this.$set(item, "selected", !item.selected);
      this.mapView.filterMarker(this.layerArr);
    },
    layerBoxChange(checkBool, item) {
      this.$set(item, "selected", checkBool);
      this.mapView.filterMarker(this.layerArr);
    },
    clear() {
      this.mapView.clearOverlays();
    },
    fullScreen() {
      let element = document.getElementById("operate-main");
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        // current working methods
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        this.screenText = "退出全屏";
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        this.screenText = "全屏";
      }
    },
    clickCenter() {
      this.mapView.setCenter();
    },
    clickcLarge() {
      this.mapView.zoomIn();
    },
    clickcReduce() {
      this.mapView.zoomOut();
    },
    clickFind() {
      this.isShowTypeFind = true;
      this.isShowFindResult = true;
      this.getHistory();
    },
    getHistory(noRefreshPage) {
      this.historyData = [];
      if (!noRefreshPage) {
        this.historyPageInfo = {
          pageSize: 10,
          currentPage: 1,
          total: 0
        };
      }
      this.$mapOperateHttp
        .getHistory({
          limit: this.historyPageInfo.pageSize,
          page: this.historyPageInfo.currentPage,
          historyRecordType: this.activeName
        })
        .then(res => {
          this.getHistorySuccess(res.data);
        });
    },
    deleteHistory() {
      this.$confirm(
        `<span style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;">是否删除搜索历史？</span>`,
        "",
        {
          confirmButtonText: "否",
          cancelButtonText: "是",
          distinguishCancelAndClose: true,
          confirmButtonClass: "confirm-button",
          cancelButtonClass: "cancel-button",
          center: true,
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {})
        .catch(action => {
          if (action === "cancel") {
            this.$mapOperateHttp.deleteHistory(this.activeName).then(res => {
              let activeNameStr = "";
              switch (this.activeName) {
                case "resource":
                  activeNameStr = "资源";
                  break;
                case "address":
                  activeNameStr = "地址";
                  break;
                case "collection":
                  activeNameStr = "收藏";
                  break;
              }
              this.$mapConfigHttp.setMapSysLog({
                logType: "operation",
                moduleName: "地图操作",
                logEvent: "delete",
                detail: `${activeNameStr}-删除历史记录`
              });
              this.getHistory();
            });
          }
        });
    },
    getHistorySuccess(body) {
      if (body.data) {
        this.historyData = body.data.list;
        this.handlePageInfo2(body.data);
      }
    },
    handlePageInfo2(data) {
      let total = 0;
      if (data.total >= 0) {
        total = data.total;
      }
      this.historyPageInfo.total = total;
    },
    handleCurrentChange2(val) {
      this.historyPageInfo.currentPage = val;
      this.getHistory(true);
    },
    closeFind() {
      this.isShowTypeFind = false;
      this.isShowFindResult = false;
      this.activeName = "resource";
      this.findkeyWord = "";
    },
    handleTabClick() {
      this.ishaveResult = false;
      setTimeout(() => {
        this.ishaveResult = true;
        this.findkeyWord = "";
        this.historyData = [];
        this.getHistory();
      }, 200);
    },
    setLogIn(item) {
      this.findkeyWord = item.historicalRecord;
      this.turnToSearch();
    },
    turnToSearch() {
      this.keyWord = this.findkeyWord;
      this.clickSearch(this.elementUuidList);
    },
    addHistory() {
      if (!this.keyWord || this.keyWord.match(/^[ ]*$/)) {
        return;
      }
      this.$mapOperateHttp
        .addHistory({
          historyRecordType: this.activeName,
          historicalRecord: this.keyWord
        })
        .then(res => {});
    },
    clickSearch(elementUuidList, noRefreshPage) {
      if (elementUuidList && elementUuidList.length > 0) {
        this.elementUuidList = this.$common.copyArray(
          elementUuidList,
          this.elementUuidList
        );
      } else {
        this.elementUuidList = [];
      }
      this.isShowTypeFind = false;
      this.isShowFindResult = false;
      this.resItemsData = [];
      this.resultTotal = 0;
      setTimeout(() => {
        this.isShowResult = true;
      }, 100);
      if (!noRefreshPage) {
        this.elePageInfo = {
          pageSize: 4,
          currentPage: 1,
          total: 0
        };
      }
      if (this.activeName === "resource") {
        this.isLoading = true;
        this.$mapOperateHttp
          .getOperaMapElements({
            page: this.elePageInfo.currentPage,
            limit: this.elePageInfo.pageSize,
            mapUuid: this.mapUuid,
            excludeElementTypeList: "sector",
            elementName: this.keyWord,
            elementUuidList:
              this.elementUuidList.length > 0
                ? this.elementUuidList.toString()
                : null
          })
          .then(res => {
            this.getOperaMapElementsSuccess(res.data);
          })
          .catch(() => {
            this.isLoading = false;
          });
      } else if (this.activeName === "collection") {
        this.$mapOperateHttp
          .getCollection({
            page: this.elePageInfo.currentPage,
            limit: this.elePageInfo.pageSize,
            mapUuid: this.mapUuid,
            elementName: this.keyWord
          })
          .then(res => {
            this.getOperaMapElementsSuccess(res.data);
          })
          .catch(() => {
            this.isLoading = false;
          });
      } else {
        this.$nextTick(() => {
          this.mapView.map.clearOverlays();
          // eslint-disable-next-line no-undef
          let local = new BMap.LocalSearch(this.mapView.map, {
            renderOptions: {
              map: this.mapView.map,
              panel: "r-result",
              selectFirstResult: false
            },
            onSearchComplete: results => {
              this.addHistory();
              setTimeout(() => {
                let lista = document
                  .getElementById("r-result")
                  .getElementsByTagName("a");
                for (let i = 0; i < lista.length; i++) {
                  lista[i].innerText = "";
                }
              }, 100);
            },
            onInfoHtmlSet: () => {
              setTimeout(() => {
                let list = document.getElementsByClassName("BMap_bubble_title");
                for (let i = 0; i < list.length; i++) {
                  let lista2 = list[i].getElementsByTagName("a");
                  for (let i2 = 0; i2 < lista2.length; i2++) {
                    lista2[i2].innerText = "";
                  }
                }
              }, 100);
            }
          });
          local.search(this.keyWord);
        });
      }
    },
    getOperaMapElementsSuccess(body) {
      this.addHistory();
      this.isLoading = false;
      if (body.data) {
        this.resItemsData = body.data.list;
        if (this.activeName === "collection") {
          this.resItemsData.forEach(v => {
            this.$set(v, "collectionStatus", 1);
          });
        }
        this.handlePageInfo(body.data);
      }
    },
    transformScan(scanArr) {
      let scanStr = "";
      if (!scanArr) {
        return;
      }
      scanArr.forEach((v, i) => {
        switch (v) {
          case "bodySnap":
            scanStr =
              scanStr + "人体" + `${i === scanArr.length - 1 ? "" : "，"}`;
            break;
          case "faceSnap":
            scanStr =
              scanStr + "人脸" + `${i === scanArr.length - 1 ? "" : "，"}`;
            break;
          case "vehicleSnap":
            scanStr =
              scanStr + "车辆" + `${i === scanArr.length - 1 ? "" : "，"}`;
            break;
        }
      });
      return scanStr;
    },
    handlePageInfo(data) {
      let total = 0;
      if (data.total >= 0) {
        total = data.total;
      }
      this.elePageInfo.total = total;
      this.resultTotal = this.elePageInfo.total;
    },
    handleCurrentChange(val) {
      this.elePageInfo.currentPage = val;
      this.clickSearch(this.elementUuidList, true);
    },
    locationEle(item) {
      let center = {};
      let panelCenter = {};
      if (this.mapType === "picture") {
        let mapDom = document.getElementById("pic-map");
        panelCenter.x = mapDom.offsetWidth / 2;
        panelCenter.y = mapDom.offsetHeight / 2;
      }
      center.x = item.elementPointX;
      center.y = item.elementPointY;
      this.mapView.locationElement(center, panelCenter);
    },
    eleCollection(item) {
      if (item.collectionStatus) {
        this.$mapOperateHttp
          .cancelCollection({
            elementUuid: item.elementUuid
          })
          .then(res => {
            this.$mapConfigHttp.setMapSysLog({
              logType: "operation",
              moduleName: "地图操作",
              logEvent: "collection",
              detail: `${this.orgName}-取消收藏`
            });
          });
      } else {
        let xhr = {
          mapUuid: this.mapUuid,
          elementUuid: item.elementUuid,
          elementName: item.elementName,
          elementType: item.elementType,
          elementSecondType: item.elementSecondType,
          elementThirdType: item.elementThirdType
        };
        this.$mapOperateHttp.addCollection(xhr).then(res => {
          this.$mapConfigHttp.setMapSysLog({
            logType: "operation",
            moduleName: "地图操作",
            logEvent: "collection",
            detail: `${this.orgName}-加入收藏`
          });
        });
      }
    },
    collectEle(item) {
      if (!this.OwnAuthDisabled) {
        return;
      }
      if (item.collectionStatus) {
        this.$mapOperateHttp
          .cancelCollection({
            elementUuid: item.elementUuid
          })
          .then(res => {
            this.clickSearch(this.elementUuidList, true);
            this.$mapConfigHttp.setMapSysLog({
              logType: "operation",
              moduleName: "地图操作",
              logEvent: "collection",
              detail: `${this.orgName}-取消收藏`
            });
          });
      } else {
        let xhr = {
          mapUuid: this.mapUuid,
          elementUuid: item.elementUuid,
          elementName: item.elementName,
          elementType: item.elementType,
          elementSecondType: item.elementSecondType,
          elementThirdType: item.elementThirdType
        };
        this.$mapOperateHttp.addCollection(xhr).then(res => {
          this.clickSearch(this.elementUuidList, true);
          this.$mapConfigHttp.setMapSysLog({
            logType: "operation",
            moduleName: "地图操作",
            logEvent: "collection",
            detail: `${this.orgName}-加入收藏`
          });
        });
      }
    },
    loadNode(node, resolve) {
      if (!this.ShowAuthDisabled) {
        return;
      }
      this.$mapConfigHttp
        .getTree({
          viewType: "",
          treeStructure: "orgNode$device",
          authEnable: false,
          parentUuid: node.level !== 0 ? node.data.id : "",
          parentType: node.level !== 0 ? node.data.nodeType : "",
          recursiveEnable: false
        })
        .then(res => {
          if (!res.data.data || res.data.data.length === 0) {
            resolve([]);
          } else {
            for (let item of res.data.data) {
              this.$set(item, "leaf", true);
              if (item.openFlag) {
                this.$set(item, "leaf", false);
              }
            }
            resolve(res.data.data);
            if (node.level === 0) {
              this.setDefaultSelectedKey(res.data.data[0]);
              res.data.data.forEach((v, i) => {
                if (v.openFlag) {
                  this.setChild(node.childNodes[i]);
                }
              });
            }
          }
        });
    },
    setChild(node) {
      this.$set(node, "loading", true);
      this.$mapConfigHttp
        .getTree({
          viewType: "",
          treeStructure: "orgNode$device",
          authEnable: false,
          parentUuid: node.data.id,
          parentType: node.data.nodeType,
          recursiveEnable: false
        })
        .then(res => {
          this.$set(node, "loading", false);
          this.$set(node, "loaded", true);
          if (!res.data.data) {
            this.$set(node, "isLeaf", true);
            this.$set(node, "childNodes", []);
          } else {
            this.$set(node.data, "children", []);
            this.$set(node, "childNodes", []);
            for (let item of res.data.data) {
              this.$set(item, "leaf", true);
              if (item.openFlag) {
                this.$set(item, "leaf", false);
              }
            }
            node.doCreateChildren(res.data.data);
            this.defaultExpKeys.push(node.data.id);
          }
        });
    },
    handleNodeClick(obj, node, component) {
      this.lastObj = this.$common.copyObject(obj, this.lastObj);
      this.isShowLinkBack = false;
      this.setNodeCommon(obj);
    },
    setNodeCommon(obj) {
      this.isShowDoorBlock = false;
      this.orgName = obj.label;
      this.orgSelectId = obj.id;
      this.closeFind();
      this.keyWord = "";
      this.isShowResult = false;
      this.isShowLayer = false;
      this.handleLayerArr();
      this.getMapInfo();
    },
    setDefaultSelectedKey(data) {
      setTimeout(() => {
        this.$refs.opOrgTree.setCurrentKey(data.id);
        this.orgName = data.label;
        this.orgSelectId = data.id;
        this.lastObj = this.$common.copyObject(data, this.lastObj);
        this.getMapInfo();
      }, 100);
    },
    getMapInfo() {
      this.$mapConfigHttp
        .getMapInfo({
          orgUuid: this.orgSelectId
        })
        .then(res => {
          this.getMapInfoSuccess(res.data);
        });
    },
    getMapInfoSuccess(body) {
      if (body.data) {
        this.hasNoMapCopy = false;
        this.hasNoMap = false;
        this.saveMapData = body.data;
        this.mapType = this.saveMapData.mapType;
        this.isShowPic = false;
        this.isShowGis = false;
        setTimeout(() => {
          this.mapType === "gis"
            ? (this.isShowGis = true)
            : (this.isShowPic = true);
          this.$nextTick(() => {
            this.mapUuid = this.saveMapData.mapUuid;
            this.handleMapSelfData();
          });
        }, 200);
      } else {
        this.hasNoMap = true;
        setTimeout(() => {
          this.hasNoMapCopy = true;
        }, 200);
      }
      this.$mapConfigHttp.setMapSysLog({
        logType: "operation",
        moduleName: "地图操作",
        logEvent: "look",
        detail: "查看地图信息"
      });
    },
    handleMapSelfData() {
      this.mapData = [];
      this.mapSelfData = {};
      this.mapSelfData.itemId = this.saveMapData.mapUuid;
      this.mapSelfData.parentItemId = null;
      this.mapSelfData.domId =
        this.saveMapData.mapType === "gis" ? "gis-map" : "pic-map";
      this.mapSelfData.type = "map";
      if (this.mapType === "gis") {
        this.mapSelfData.startPoint = {
          lng: this.saveMapData.centerPointY,
          lat: this.saveMapData.centerPointX
        };
        this.mapSelfData.scale = this.saveMapData.mapLevel;
      } else {
        this.mapSelfData.picUrl = this.saveMapData.mapUrl;
      }
      this.mapData.push(this.mapSelfData);
      this.onCreateMap();
      this.iterateMapElements(["init"]);
    },
    async iterateMapElements(data) {
      if (!data || data.length === 0) {
        return;
      }
      let elementsData = await this.getMapElements();
      elementsData.forEach(v => {
        let elementData = this.createElementCommon(v);
        this.addCommon(elementData);
      });
      this.eleCurrentPage = this.eleCurrentPage + 1;
      this.iterateMapElements(elementsData);
    },
    getMapElements() {
      return new Promise(resolve => {
        this.$mapOperateHttp
          .getOperaMapElements({
            page: this.eleCurrentPage,
            limit: 10,
            mapUuid: this.saveMapData.mapUuid
          })
          .then(res => {
            if (res.data.data) {
              resolve(res.data.data.list);
            } else {
              resolve([]);
            }
          })
          .catch(() => {
            resolve([]);
          });
      });
    },
    createElementCommon(v) {
      let elementData = {};
      elementData.itemId = v.elementUuid;
      if (!v.parentElementUuid && this.saveMapData) {
        elementData.parentItemId = this.saveMapData.mapUuid;
      } else {
        elementData.parentItemId = v.parentElementUuid;
      }
      if (
        v.elementType === "device" ||
        v.elementType === "channel" ||
        v.elementType === "link" ||
        v.elementType === "unknown"
      ) {
        elementData.type = "marker";
      } else {
        elementData.type = v.elementType;
      }
      elementData.secondType = v.elementSecondType;
      elementData.icon = this.setEleIcon(v);
      elementData.name = v.elementName;
      if (this.mapType === "gis") {
        elementData.point = {
          lng: v.elementPointY,
          lat: v.elementPointX
        };
      } else {
        elementData.point = {
          x: parseFloat(v.elementPointX),
          y: parseFloat(v.elementPointY)
        };
      }
      elementData.resourceId = v.resourceUuid;
      elementData.itemInfo = v.elementInfo ? v.elementInfo : null;
      elementData.channelInfo = v.channelInfo;
      elementData.itemWebData = v;
      elementData.itemGroupType = v.elementGroupType;
      return elementData;
    },
    setEleIcon(v) {
      let iconVal = "";
      iconVal = v.elementThirdType;
      if (
        v.elementSecondType !== "door" &&
        v.elementSecondType !== "vc" &&
        v.elementSecondType !== "link"
      ) {
        iconVal = "door_open_online";
      } else {
        if (!v.channelInfo) {
          iconVal = `${iconVal}_online`;
        } else if (v.channelInfo.alarmStatus === "alarm") {
          iconVal = `${iconVal}_alarm`;
        } else {
          if (v.elementThirdType === "door") {
            switch (v.channelInfo.openDoorStatus) {
              case "open":
                iconVal = `${iconVal}_open`;
                break;
              case "close":
                iconVal = `${iconVal}_close`;
                break;
              case "nc":
                iconVal = `${iconVal}_nc`;
                break;
              case "no":
                iconVal = `${iconVal}_no`;
                break;
              default:
                iconVal = `${iconVal}_open`;
                break;
            }
          }
          if (v.channelInfo.onlineStatus === "offline") {
            if (v.elementThirdType === "door") {
              iconVal = `door_offline`;
            } else {
              iconVal = `${iconVal}_offline`;
            }
          } else {
            iconVal = `${iconVal}_online`;
          }
        }
      }
      return require(`@/assets/images/map/icon/${iconVal}.png`);
    },
    onCreateMap() {
      this.mapModel = new GTMap.MapModel(this.mapData);
      this.mapView = new GTMap.MapView(this.mapModel, this.mapType);
      if (this.$store.state.home.mapSetData.onlineMap) {
        if (this.mapType === "gis") {
          this.mapView.setMapStyleV2();
        }
      }
      this.mapView.createItems(this.itemEventCallBack);
      if (this.mapType === "gis") {
        this.mapView.map.addEventListener("ondragstart", e => {
          this.hideInfoBlock();
        });
        this.mapView.map.addEventListener("onzoomstart", e => {
          this.hideInfoBlock();
        });
      } else {
        this.mapView.map.addEventListener("dragstart", e => {
          this.hideInfoBlock();
        });
        this.mapView.map.addEventListener("mousewheel", e => {
          this.hideInfoBlock();
        });
      }
    },
    itemEventCallBack(e, dataObj) {
      if (dataObj.eventType === "onclick") {
        if (dataObj.item.type === "marker") {
          this.infoBlockClick(dataObj);
        }
      }
      if (dataObj.eventType === "ondblclick") {
        if (!this.OwnAuthDisabled) {
          return;
        }
        if (dataObj.item.type === "marker") {
          this.infoBlockDblclick(dataObj);
        }
      }
    },
    infoBlockClick(dataObj) {
      this.isShowDoorBlock = true;
      this.itemTop = dataObj.y - 20 - 320;
      this.itemLeft = dataObj.x - 20;
      this.itemInfoData = dataObj.item;
    },
    infoBlockDblclick(dataObj) {
      this.isShowDoorBlock = false;
      if (dataObj.item.secondType === "door") {
        this.doorAction(dataObj.item.itemWebData);
      } else if (dataObj.item.secondType === "vc") {
        let inOnLine = dataObj.item.itemWebData.channelInfo ? this.$common.getEnumItemName("onoffline", dataObj.item.itemWebData.channelInfo.onlineStatus) : "离线";
        if (inOnLine === "离线") {
          this.$cToast.warn("设备离线，无法查看");
          return;
        }
        this.videoLook(dataObj.item.itemWebData);
      } else if (dataObj.item.secondType === "link") {
        this.turnToLinkMap(dataObj.item.itemWebData);
      }
    },
    hideInfoBlock() {
      this.isShowDoorBlock = false;
    },
    closeBlock() {
      this.isShowDoorBlock = false;
    },
    doorAction(itemWebData) {
      this.isShowDoorAction = true;
      this.clickItemWebData = this.$common.copyObject(
        itemWebData,
        this.clickItemWebData
      );
    },
    doorLog(itemWebData) {
      this.isShowDoorRecord = true;
      this.clickItemWebData = this.$common.copyObject(
        itemWebData,
        this.clickItemWebData
      );
    },
    alarmRecord(itemWebData) {
      this.isShowDoorAlarmRecord = true;
      this.clickItemWebData = this.$common.copyObject(
        itemWebData,
        this.clickItemWebData
      );
    },
    turnToLinkMap(itemWebData) {
      this.isShowLinkBack = true;
      this.setNodeCommon(itemWebData.elementInfo.nodeObj);
    },
    linkBack() {
      this.isShowLinkBack = false;
      this.setNodeCommon(this.lastObj);
    },
    onCancelDoorAction() {
      this.isShowDoorAction = false;
    },
    onCancelDoorRecord() {
      this.isShowDoorRecord = false;
    },
    onCancelDoorAlarmRecord() {
      this.isShowDoorAlarmRecord = false;
    },
    handleDoorStatus(params) {
      this.$logSearchHttp
        .handleDoorStatus(
          {
            channelUuid: params.channelUuid,
            action: params.action
          },
          {
            headers: {
              VIEW_MODULE_NAME: encodeURIComponent("地图操作"),
              VIEW_MODULE_DETAIL: encodeURIComponent(
                `${this.orgName}-操作${params.name}-${
                  params.action === "open" ? "开门" : "关门"
                }`
              )
            }
          }
        )
        .then(res => {
          this.isShowDoorAction = false;
        });
    },
    addCommon(itemNew) {
      this.mapModel.addItem(itemNew, (item, modelIndex) => {
        this.mapView.addItem(item, modelIndex, this.itemEventCallBack, false);
      });
    },
    updateCommon(itemNew) {
      this.mapModel.updateItem(itemNew.itemId, itemNew, (item, modelIndex) => {
        this.mapView.updateItem(item, modelIndex, this.itemEventCallBack);
      });
    },
    deleteCommon(item) {
      this.mapModel.deleteItem(item.elementUuid, modelIndex => {
        this.mapView.deleteItem(modelIndex);
      });
    },
    connectSocket() {
      /* eslint-disable */
      let socket = new SockJS(
        window.config.protocolHeader + window.config.socketIP
      );
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect(
        {
          projectUuid: this.$store.state.home.projectUuid,
          accountUuid: this.$store.state.home.userUuid
        },
        frame => {
          console.log("operate connect success: ");
          const elementChangeTopic =
            "/user/topic/map-1.7/client/operation/elementChange";
          const mapChangeTopic =
            "/user/topic/map-1.7/client/operation/mapChange";
          const collectionChangeTopic =
            "/user/topic/map-1.7/client/element/collectionChange";
          const treeChangeTopic =
            "/user/topic/map-1.7/client/device/organization/tree";
          this.stompClient.subscribe(elementChangeTopic, greeting => {
            this.handleEleSubscribe(JSON.parse(greeting.body));
          });
          this.stompClient.subscribe(mapChangeTopic, greeting => {
            this.handleMapSubscribe(JSON.parse(greeting.body));
          });
          this.stompClient.subscribe(collectionChangeTopic, greeting => {
            this.handleCollecSubscribe(JSON.parse(greeting.body));
          });
          this.stompClient.subscribe(treeChangeTopic, greeting => {
            this.handleTreeSubscribe(JSON.parse(greeting.body));
          });
        },
        err => {
          console.log("save error, errMsg: ", err);
        }
      );
      /* eslint-enable */
    },
    handleEleSubscribe(body) {
      console.log("operate Subscribe success: ", body);
      if (!body) {
        return;
      }
      this.isMainLoading = true;
      setTimeout(() => {
        this.isMainLoading = false;
        if (this.isShowTopicFlag) {
          this.$cToast.success("地图信息已变更");
        }
        this.isShowDoorBlock = false;
        this.isShowDoorAction = false;
        if (body.changeType === "add") {
          let elementData = this.createElementCommon(body.data);
          this.addCommon(elementData);
        } else if (body.changeType === "update") {
          if (
            !this.mapView
              .getAllItemsData()
              .some(v => v.itemWebData.elementUuid === body.data.elementUuid)
          ) {
            return;
          }
          let elementData = this.createElementCommon(body.data);
          this.updateCommon(elementData);
        } else if (body.changeType === "delete") {
          if (
            !this.mapView
              .getAllItemsData()
              .some(v => v.itemWebData.elementUuid === body.data.elementUuid)
          ) {
            return;
          }
          this.deleteCommon(body.data);
        }
      }, 500);
    },
    handleMapSubscribe(body) {
      console.log("operate Subscribe success: ", body);
      if (!body) {
        return;
      }
      this.refreshFlag = true;
      this.isMainLoading = true;
      setTimeout(() => {
        this.isMainLoading = false;
        if (this.isShowTopicFlag) {
          this.$cToast.success("地图信息已变更");
        }
        this.getMapInfo();
      }, 500);
    },
    handleCollecSubscribe(body) {
      console.log("operate Subscribe success: ", body);
      if (!body) {
        return;
      }
      this.isMainLoading = true;
      setTimeout(() => {
        this.isMainLoading = false;
        if (this.isShowTopicFlag) {
          this.$cToast.success("地图信息已变更");
        }
        this.isShowDoorBlock = false;
        let elementData = null;
        let initData = null;
        if (this.mapView.getAllItemsData()) {
          this.mapView.getAllItemsData().forEach(v => {
            if (v.itemWebData.elementUuid === body.data.elementUuid) {
              initData = this.$common.copyObject(v.itemWebData, initData);
            }
          });
        }
        if (body.changeType === "add") {
          initData.collectionStatus = 1;
        } else if (body.changeType === "delete") {
          initData.collectionStatus = 0;
        }
        elementData = this.createElementCommon(initData);
        this.updateCommon(elementData);
      }, 500);
    },
    handleTreeSubscribe(body) {
      console.log("tree Subscribe success: ", body);
      if (!body) {
        return;
      }
      if (this.isShowTopicFlag) {
        this.$cToast.success("设备树信息已变更");
      }
      if (this.$refs.opOrgTree) {
        if (body.changeType === "add") {
          this.treeChangeAdd(body.data);
        } else if (body.changeType === "update") {
          this.treeChangeUpdate(body.data);
        } else if (body.changeType === "delete") {
          this.treeChangeDelete(body.data);
        }
      }
    },
    treeChangeAdd(data) {
      this.$set(data, "leaf", true);
      if (data.openFlag) {
        this.$set(data, "leaf", false);
      }
      if (this.$refs.opOrgTree.getNode(data.nodeNewParentUuid)) {
        this.$refs.opOrgTree.append(
          data,
          this.$refs.opOrgTree.getNode(data.nodeNewParentUuid)
        );
      }
    },
    treeChangeUpdate(data) {
      this.$set(data, "leaf", true);
      if (data.openFlag) {
        this.$set(data, "leaf", false);
      }
      if (this.$refs.opOrgTree.getNode(data.id)) {
        if (data.nodeNewParentUuid) {
          this.$refs.opOrgTree.remove(this.$refs.opOrgTree.getNode(data.id));
          this.$refs.opOrgTree.append(
            data,
            this.$refs.opOrgTree.getNode(data.nodeNewParentUuid)
          );
        } else {
          this.$refs.opOrgTree.getNode(data.id).data = this.$common.copyObject(
            data,
            this.$refs.opOrgTree.getNode(data.id).data
          );
        }
      }
    },
    treeChangeDelete(data) {
      this.$set(data, "leaf", true);
      if (data.openFlag) {
        this.$set(data, "leaf", false);
      }
      if (this.$refs.opOrgTree.getNode(data.id)) {
        this.$refs.opOrgTree.remove(this.$refs.opOrgTree.getNode(data.id));
        if (data.id === this.orgUuid && data.nodeNewParentUuid) {
          this.orgSetCommon(data.nodeNewParentUuid);
          this.setDefaultSelectedKey(
            this.$refs.opOrgTree.getNode(data.nodeNewParentUuid).data
          );
        }
      }
    },
    disConnectSocket() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        console.log("Disconnected");
      }
    },
    onCancelToAddAuth() {
      this.isShowToAddAuth = false;
    }
  },
  watch: {},
  deactivated() {
    this.refreshFlag = false;
    this.isShowTopicFlag = false;
  },
  destroyed() {
    this.disConnectSocket();
  }
};
</script>

<style lang="scss">
.m-popover {
  height: 340px !important;
  overflow: auto;
  background: #363b3e;
  padding: 2px;
  box-sizing: border-box;
}
.el-popover {
  min-width: 50px;
}
.option-search-opreate {
  .el-input__inner {
    background-color: #363b3e !important;
  }
  .el-input-group__append {
    background-color: #25d298;
    border: 0px #25d298 solid;
    color: #ffffff;
    font-size: 16px;
  }
  .el-input-group__prepend {
    cursor: pointer;
    background: #363b3e;
    border-color: #54585b;
    padding: 0;
    box-sizing: border-box;
  }
}
.result-foot {
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    border: 0px;
  }
}
.type-find {
  .el-tabs__header {
    margin: 0px;
  }
  .el-tabs__item {
    height: 33px;
    line-height: 33px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #ffffff;
    text-align: justify;
  }
  .el-tabs__item.is-active {
    color: #26d39d;
  }
  .el-tabs__nav-wrap::after {
    height: 0px;
  }
  .el-button--default,
  .el-button--default:hover,
  .el-button--default:active,
  .el-button--default:focus {
    background: #25d298;
    height: 34px;
  }
  .el-button {
    padding: 0px 20px;
  }
}
.find-result {
  .el-input__prefix {
    position: absolute;
    left: 36px;
    top: 8px;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 28px;
  }
  .el-input__inner {
    background-color: rgba(255, 255, 255, 0.08) !important;
  }
}
.layer-content {
  .el-checkbox {
    display: block;
  }
  .el-checkbox-group {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #dddddd;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.map-main {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .default-block {
    width: 375px;
    height: 350px;
    padding: 20px 0px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    // justify-content: center;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba($color: #ffffff, $alpha: 0.6);
  }
  .map-self {
    width: 100%;
    height: 100%;
  }
  .option-search-opreate {
    position: absolute;
    left: 40px;
    top: 40px;
    .type-find {
      background: #363b3e;
      box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.5);
      border-radius: 3px;
      width: 320px;
      height: 34px;
      padding-left: 24px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .search-result {
    position: absolute;
    left: 40px;
    top: 80px;
    max-height: 85%;
    overflow-y: auto;
    width: 320px;
    background: #2a2e31;
    .result-title {
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      padding-left: 16px;
      box-sizing: border-box;
      color: #dddddd;
      border: {
        width: 0 0 1px 0;
        style: solid;
        color: rgba($color: #dddddd, $alpha: 0.15);
      }
    }
    .result-items {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 15px;
      box-sizing: border-box;
      margin-bottom: 10px;
      .search-item {
        width: 100%;
        border: {
          width: 0 0 1px 0;
          style: dashed;
          color: rgba($color: #ffffff, $alpha: 0.15);
        }
        padding: 10px 0;
        box-sizing: border-box;
        &:last-child {
          border: 0px;
        }
        .item-title {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #ffffff;
          display: flex;
          align-items: center;
          .item-icon {
            width: 16px;
            height: 20px;
            text-align: center;
            line-height: 17px;
          }
        }
        .item-info {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #bbbbbb;
          text-align: justify;
          margin-left: 24px;
          .info-detail {
            margin-top: 5px;
          }
        }
        .item-button {
          width: 100%;
          margin-top: 5px;
          display: flex;
          justify-content: flex-end;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba($color: #25d298, $alpha: 0.8);
          text-align: justify;
          .button-block {
            display: flex;
            align-items: center;
            .button-detail {
              cursor: pointer;
              display: flex;
              align-items: center;
            }
            .split-line {
              height: 12px;
              border: {
                width: 0 1px 0 0;
                style: solid;
                color: rgba($color: #ffffff, $alpha: 0.2);
              }
              margin: 0 10px;
            }
          }
        }
      }
    }
    .result-foot {
      width: 100%;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .find-result {
    position: absolute;
    left: 40px;
    top: 80px;
    width: 320px;
    background: #2a2e31;
    padding: 13px 15px;
    box-sizing: border-box;
    .find-result-title {
      width: 100%;
    }
    .find-result-items {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 10px 10px;
      box-sizing: border-box;
      border: {
        width: 0 0 1px 0;
        style: dashed;
        color: rgba($color: #ffffff, $alpha: 0.15);
      }
      .find-search-item {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #dddddd;
        text-align: justify;
        margin: 6px 0;
        cursor: pointer;
        &:hover {
          color: #25d298;
        }
      }
      .result-foot {
        width: 100%;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .find-result-foot {
      width: 100%;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #aaaaaa;
      text-align: justify;
      .delete-text {
        cursor: pointer;
        margin-left: 5px;
        &:hover {
          color: #25d298;
        }
      }
    }
  }
  .map-option {
    position: absolute;
    top: 40px;
    right: 42px;
    background: #363b3e;
    box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0px 7px;
    box-sizing: border-box;
    .option-button {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #ffffff;
      display: flex;
      height: 100%;
      position: relative;
      align-items: center;
      cursor: pointer;
      .button-text {
        margin-left: 5px;
      }
      .popover-layer {
        padding: 4px 0px;
        box-sizing: border-box;
        position: absolute;
        top: 36px;
        left: -15px;
        .option-popover {
          width: 88px;
          background: #363b3e;
          box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.3);
          border-radius: 1px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4px 0px;
          box-sizing: border-box;
          .popover-menu {
            width: 100%;
            height: 36px;
            padding: 0 0 0 13px;
            box-sizing: border-box;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            cursor: pointer;
            &:hover {
              background: rgba(38, 211, 157, 0.2);
            }
          }
        }
      }
    }
    .option-split {
      height: 22px;
      border: {
        width: 0px 0px 0px 1px;
        style: solid;
        color: rgba($color: #ffffff, $alpha: 0.1);
      }
    }
  }
  .map-layer {
    position: absolute;
    top: 80px;
    right: 42px;
    background: #2a2e31;
    box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.3);
    border-radius: 1px;
    max-height: 85%;
    overflow-y: auto;
    .layer-title {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 17px;
      box-sizing: border-box;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #ffffff;
      text-align: justify;
      border: {
        width: 0 0 1px 0;
        style: solid;
        color: rgba($color: #dddddd, $alpha: 0.15);
      }
      .split-line {
        height: 16px;
        border: {
          style: solid;
          width: 0 0 0 3px;
          color: #26d39d;
        }
        margin-right: 10px;
      }
    }
    .layer-content {
      padding: 12px 20px;
      box-sizing: border-box;
      .layer-item {
        display: flex;
        margin: 15px 25px;
        .button-title {
          width: 25%;
          padding-top: 5px;
        }
        .items-button {
          width: 75%;
          display: flex;
          flex-flow: row wrap;
          align-content: flex-start;
          .button-item {
            height: 28px;
            padding: 0 10px;
            box-sizing: border-box;
            border-radius: 2px;
            border: 1px transparent solid;
            background: rgba($color: #ffffff, $alpha: 0.1);
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #dddddd;
            text-align: center;
            line-height: 28px;
            cursor: pointer;
            margin-left: 10px;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
  .map-control {
    position: absolute;
    bottom: 55px;
    right: 42px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .button-block {
      background: rgba(102, 102, 102, 0.66);
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
      border-radius: 2px;
      width: 36px;
      height: 36px;
      margin-top: 6px;
      text-align: center;
      line-height: 36px;
      cursor: pointer;
      position: relative;
      .orgtree-layer {
        padding: 0px 6px;
        box-sizing: border-box;
        position: absolute;
        top: 0px;
        right: 36px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #ffffff;
        .control-popover {
          width: 160px;
          height: 36px;
          background: #363b3e;
          box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.3);
          border-radius: 1px;
          padding: 4px 16px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
