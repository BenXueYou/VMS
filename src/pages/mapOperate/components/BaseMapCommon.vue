<template>
  <div class="map-common-main">
    <div class="map-main"
         id="operate-main"
         v-loading="isMainLoading"
         @click="mainClick">
      <video-preview-dialog :visible.sync='VideoPreviewVisible'
                            :channelUuid="channelUuid"
                            :channelName="channelName"
                            :moduleName="moduleName"
                            :orgName="orgName"
                            :channelType="channelType">
      </video-preview-dialog>
      <video-play-back-dialog :visible.sync="VideoPlayBackVisible"
                              :channelUuid="channelUuid"
                              :startTime="startTime"
                              :orgName="orgName"
                              :moduleName="moduleName"
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
                       :moduleName="moduleName"
                       @videoLook="videoLook"
                       @videoBack="videoBack"
                       @closeBlock="closeBlock"
                       @eleCollection="eleCollection"
                       @doorAction="doorAction"
                       @doorLog="doorLog"
                       @turnToLinkMap="turnToLinkMap"
                       @alarmRecord="alarmRecord" />
      <door-action :isShow="isShowDoorAction"
                   @onCancel="onCancelDoorAction"
                   :moduleName="moduleName"
                   :itemData="clickItemWebData"
                   @handleDoorStatus="handleDoorStatus" />
      <door-record :isShow="isShowDoorRecord"
                   @onCancel="onCancelDoorRecord"
                   :orgName="orgName"
                   :moduleName="moduleName"
                   :itemData="clickItemWebData" />
      <door-alarm-log :isShow="isShowDoorAlarmRecord"
                      :orgName="orgName"
                      :moduleName="moduleName"
                      @onCancel="onCancelDoorAlarmRecord"
                      :itemData="clickItemWebData" />
      <to-add-auth-dialog :isShow="isShowToAddAuth"
                          @onCancel="onCancelToAddAuth" />
      <template v-for="(item) in topicBlockArr">
        <topic-show-block :key="item.key"
                          :topicType="item.topicType"
                          :blockTop="item.blockTop"
                          :blockLeft="item.blockLeft"
                          :blockWidth="item.blockWidth"
                          :topicItem="item.topicItem" />
      </template>
      <template v-for="(item, index) in nameBlockArr">
        <show-name-block :mapType="mapType"
                         :key="index"
                         v-show="item.isShow"
                         :blockTop="item.nameBlockTop"
                         :blockLeft="item.nameBlockLeft"
                         :elementData="item.elementData" />
      </template>
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
      <div class="map-control"
           :style="`right: ${controlRight}px`">
        <el-tooltip class="item"
                    effect="dark"
                    v-if="isShowLinkBack"
                    content="返回"
                    placement="left">
          <div class="button-block"
               @click="fullScreen">
            <img src="@/assets/images/communityBoard/path2.png" />
          </div>
        </el-tooltip>
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
                    :content="screenText"
                    placement="left">
          <div class="button-block"
               @click="fullScreen">
            <img src="@/assets/images/map/all.png" />
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
      <div class="layer"
           v-if="isShowLayer"
           :style="`left: ${layerLeft}px`">
        <div class="layer-block">
          <div class="layer-button"
               @click.stop="showLayer">
            <img src="@/assets/images/communityBoard/layer.png">
          </div>
          <div class="main-menu"
               v-show="isShowMainMenu"
               @mouseout="menuMouseout">
            <template v-for="(item, index) in layerData">
              <div :key="index"
                   class="menu-item"
                   @mouseover="menuMouseover(item, index)"
                   @click.stop>
                <el-checkbox v-model="item.checked"
                             @click.native.stop
                             :indeterminate="item.isIndeterminate"
                             @change="mainMenuChange($event, item)"
                             :label="item.name">
                </el-checkbox>
              </div>
            </template>
          </div>
          <div class="child-menu"
               v-if="isShowChildMenu"
               :style="`top: ${childBlockTop}px`"
               @mousemove="isShowChildMenu = true"
               @mouseout="isShowChildMenu = false">
            <div class="child-menu-block">
              <template v-for="(item, index) in mainMenuChild">
                <div :key="index"
                     class="menu-item"
                     @click.stop>
                  <el-checkbox v-model="item.checked"
                               @click.native.stop
                               @change="childMenuChange($event, item, mainMenuChild)"
                               :label="item.name">
                  </el-checkbox>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as GTMap from "@/utils/GTMap.js";
import ItemOperBlock from "@/pages/mapOperate/components/ItemOperBlock";
import TopicShowBlock from "@/pages/mapOperate/components/TopicShowBlock";
import ShowNameBlock from "@/pages/mapOperate/components/ShowNameBlock";
import DoorAction from "@/pages/mapOperate/components/DoorAction";
import DoorRecord from "@/pages/mapOperate/components/DoorRecord";
import DoorAlarmLog from "@/pages/mapOperate/components/DoorAlarmLog";
import VideoPreviewDialog from "@/pages/mapOperate/components/VideoPreviewDialog";
import VideoPlayBackDialog from "@/pages/mapOperate/components/VideoPlayBackDialog";
import ToAddAuthDialog from "@/pages/mapOperate/components/ToAddAuthDialog";

export default {
  components: {
    ItemOperBlock,
    TopicShowBlock,
    DoorAction,
    DoorRecord,
    DoorAlarmLog,
    VideoPreviewDialog,
    VideoPlayBackDialog,
    ToAddAuthDialog,
    ShowNameBlock
  },
  props: {
    moduleName: {
      type: String,
      default: ""
    },
    controlRight: {
      type: Number,
      default: 42
    },
    isShowLayer: {
      type: Boolean,
      default: false
    },
    layerLeft: {
      type: Number,
      default: 20
    },
    isShowStreetBlock: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mapType: "gis",
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
      mapUuid: "",
      isShowGis: true,
      isShowPic: false,
      ishaveResult: true,
      isShowDoorBlock: false,
      isShowDoorAction: false,
      clickItemWebData: null,
      isShowDoorRecord: false,
      isMainLoading: false,
      stompClient: null,
      stompClientForOther: null,
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
      ConfigShowAuthDisabled: true,
      isShowToAddAuth: false,
      layerData: [
        {
          id: 1,
          name: "显示名称/经纬度",
          value: "showName",
          children: [],
          checked: false,
          isIndeterminate: false
        },
        {
          name: "动态感知",
          id: 2,
          value: "dynamicFeel",
          checked: true,
          isIndeterminate: false,
          children: [
            {
              name: "人脸感知",
              value: "face",
              children: [],
              parentId: 2,
              checked: true
            },
            {
              name: "车辆感知",
              value: "car",
              parentId: 2,
              children: [],
              checked: true
            },
            {
              name: "门禁感知",
              value: "door",
              parentId: 2,
              children: [],
              checked: true
            },
            {
              name: "防尾随感知",
              parentId: 2,
              value: "noFollow",
              children: [],
              checked: true
            }
          ]
        },
        {
          name: "摄像机",
          id: 3,
          value: "vc",
          checked: true,
          isIndeterminate: false,
          children: [
            {
              name: "人脸",
              value: "faceSnap",
              parentId: 3,
              children: [],
              checked: true
            },
            {
              name: "车辆",
              value: "vehicleSnap",
              parentId: 3,
              children: [],
              checked: true
            },
            {
              name: "人体",
              value: "bodySnap",
              parentId: 3,
              children: [],
              checked: true
            },
            {
              name: "普通",
              value: "normalSnap",
              parentId: 3,
              children: [],
              checked: true
            }
          ]
        },
        {
          name: "门禁",
          id: 4,
          value: "door",
          checked: true,
          isIndeterminate: false,
          children: []
        },
        {
          name: "车闸",
          id: 5,
          value: "car",
          checked: true,
          isIndeterminate: false,
          children: []
        },
        {
          name: "泛感知",
          id: 6,
          value: "normalFeel",
          checked: true,
          isIndeterminate: false,
          children: []
        }
      ],
      isShowChildMenu: false,
      childBlockTop: 0,
      mainMenuChild: [],
      isShowMainMenu: false,
      mainMenuOverVal: "",
      topicBlockArr: [],
      chnTypeHideItemArr: [],
      snapColHideItemArr: [],
      allShowStatus: "allShow",
      nameBlockArr: [],
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      eleCurrentPage: 1,
      mapModel: null,
      mapView: null,
      scanColTypeArr: ["faceSnap", "vehicleSnap", "bodySnap", "normalSnap"]
    };
  },
  created() {
  },
  activated() {
    if (this.refreshFlag) {
      this.getMapInfo();
      this.refreshFlag = false;
    }
    this.isShowTopicFlag = true;
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn(this.moduleName, "isShow");
    this.ConfigShowAuthDisabled = this.$common.getAuthIsOwn(
      "地图配置",
      "isShow"
    );
    this.OwnAuthDisabled = this.$common.getAuthIsOwn(this.moduleName, "isOwn");
    this.connectSocket();
    this.connectSocketForOther();
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
    mainClick() {
      this.isShowOrgTree = false;
      this.isShowMainMenu = false;
      this.isShowChildMenu = false;
    },
    turnToMapConfig() {
      if (!this.ConfigShowAuthDisabled) {
        this.isShowToAddAuth = true;
        return;
      }
      let compomentItem = {
        path: "/MapConfig",
        name: "MapConfig",
        title: "地图配置",
        icon: "MapConfig",
        type: "config"
      };
      this.$store.dispatch("addTagViewItem", compomentItem);
      this.$store.dispatch("setLocalTag", compomentItem.name);
      this.$bus.$emit("setLocalTag", compomentItem.name);
      this.$router.push({ name: compomentItem.name });
      this.$router.push({ name: "MapConfig" });
    },
    fullScreen() {
      this.$emit("fullScreenCall");
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
    eleCollection(item) {
      if (item.collectionStatus) {
        this.$mapOperateHttp
          .cancelCollection({
            elementUuid: item.elementUuid
          })
          .then(res => {
            this.$mapConfigHttp.setMapSysLog({
              logType: "operation",
              moduleName: this.moduleName,
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
            moduleName: this.moduleName,
            logEvent: "collection",
            detail: `${this.orgName}-加入收藏`
          });
        });
      }
    },
    loadNode(node, resolve) {
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
        moduleName: this.moduleName,
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
      setTimeout(() => {
        this.setNameBlockArr();
      }, 100);
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
            limit: 30,
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
          // this.setNameBlockHide();
        });
        this.mapView.map.addEventListener("ondragging", e => {
          this.setNameBlockArr();
        });
        this.mapView.map.addEventListener("onzoomstart", e => {
          this.hideInfoBlock();
          this.setNameBlockHide();
        });
        this.mapView.map.addEventListener("onzoomend", e => {
          this.setNameBlockArr();
        });
      } else {
        this.mapView.map.addEventListener("dragstart", e => {
          this.hideInfoBlock();
          this.setNameBlockHide();
          this.setNameBlockArr();
        });
        this.mapView.map.addEventListener("mousewheel", e => {
          this.hideInfoBlock();
          this.setNameBlockHide();
          this.setNameBlockArr();
        });
      }
    },
    setNameBlockHide() {
      this.nameBlockArr.forEach(v => {
        this.$set(v, "isShow", false);
      });
    },
    setNameBlockArr() {
      this.nameBlockArr = [];
      for (let v of this.mapView.getAllItemsData()) {
        if (
          !this.chnTypeHideItemArr.some(
            item => item.itemWebData.resourceUuid === v.itemWebData.resourceUuid
          ) &&
          !this.snapColHideItemArr.some(
            item => item.itemWebData.resourceUuid === v.itemWebData.resourceUuid
          )
        ) {
          this.setNameBlockCommon(v);
        }
      }
    },
    setNameBlockCommon(v) {
      if (v.type === "marker") {
        let nameBlockTop = 0,
          nameBlockLeft = 0;
        if (this.mapType === "picture") {
          nameBlockTop =
            this.mapView.pointToPixel(v.point).y +
            50 -
            10 * (this.mapView.map.getStageInfo().scale - 1);
          nameBlockLeft =
            this.mapView.pointToPixel(v.point).x -
            30 +
            50 * (this.mapView.map.getStageInfo().scale - 1);
        } else {
          nameBlockTop = this.mapView.pointToPixel(v.point).y + 10;
          nameBlockLeft = this.mapView.pointToPixel(v.point).x - 60;
        }
        let item = {
          isShow: this.layerData[0].checked,
          nameBlockTop,
          nameBlockLeft,
          elementData: v.itemWebData
        };
        this.nameBlockArr.push(item);
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
              VIEW_MODULE_NAME: encodeURIComponent(this.moduleName),
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
    commonFilter() {
      this.layerData.forEach(v => {
        if (!v.checked && !v.isIndeterminate) {
          this.mapView.filterByChnType(v.value, v.checked, hideItemArr => {
            this.chnTypeHideItemArr = this.$common.copyArray(
              hideItemArr,
              this.chnTypeHideItemArr
            );
          });
        }
      });
      this.mapView.filterByScanCol(this.scanColTypeArr, hideItemArr => {
        this.snapColHideItemArr = this.$common.copyArray(
          hideItemArr,
          this.snapColHideItemArr
        );
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
    mainMenuChange(val, item) {
      this.isShowDoorBlock = false;
      this.mapView.filterByChnType(item.value, item.checked, hideItemArr => {
        this.chnTypeHideItemArr = this.$common.copyArray(
          hideItemArr,
          this.chnTypeHideItemArr
        );
      });
      this.$set(item, "isIndeterminate", false);
      item.children.forEach(v => {
        v.checked = val;
      });
      if (item.value === "showName") {
        this.nameBlockArr.forEach(v => {
          this.$set(v, "isShow", val);
        });
      }
      this.setNameBlockArr();
    },
    childMenuChange(val, item, mainMenuChild) {
      this.isShowDoorBlock = false;
      if (!val) {
        this.layerData.forEach(v => {
          if (v.id === item.parentId) {
            this.$set(v, "checked", false);
          }
        });
      }
      let flag = true;
      this.layerData.forEach(v => {
        if (v.id === item.parentId) {
          this.$set(v, "checked", flag);
          !flag && mainMenuChild.some(x => x.checked === true)
            ? this.$set(v, "isIndeterminate", true)
            : this.$set(v, "isIndeterminate", false);
        }
      });
      if (this.mainMenuOverVal === "vc") {
        this.scanColTypeArr = ["faceSnap", "vehicleSnap", "bodySnap", "normalSnap"];
        mainMenuChild.forEach(v => {
          if (!v.checked) {
            flag = false;
            for (let [i, v2] of this.scanColTypeArr.entries()) {
              if (v2 === v.value) {
                this.scanColTypeArr.splice(i, 1);
              }
            }
          }
        });
        this.mapView.filterByScanCol(this.scanColTypeArr, hideItemArr => {
          this.snapColHideItemArr = this.$common.copyArray(
            hideItemArr,
            this.snapColHideItemArr
          );
        });
      }
      this.setNameBlockArr();
    },
    menuMouseover(item, index) {
      this.childBlockTop = index * 39;
      this.mainMenuChild = item.children;
      this.mainMenuOverVal = item.value;
      this.isShowChildMenu = true;
    },
    menuMouseout() {
      this.isShowChildMenu = false;
    },
    showLayer() {
      this.isShowMainMenu = !this.isShowMainMenu;
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
          console.log("mapCommon connect success: ");
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
    connectSocketForOther() {
      /* eslint-disable */
      let socket = new SockJS(
        window.config.protocolHeader + window.config.socketIP
      );
      this.stompClientForOther = Stomp.over(socket);
      this.stompClientForOther.connect(
        {
          projectUuid: this.$store.state.home.projectUuid,
          accountUuid: this.$store.state.home.userUuid
        },
        frame => {
          console.log("mapCommon connect success: ");
          const carResTopic =
            "/user/topic/dashboard-1.8/client/vehicleSnapshotMessage";
          const doorResTopic = "/user/topic/dashboard/open/door";
          const faceResTopic = "/user/topic/dashboard/face/recognize";
          const alarmResTopic = "/user/topic/alarm/info";
          this.stompClientForOther.subscribe(carResTopic, greeting => {
            this.handleCarSubscribe(JSON.parse(greeting.body));
          });
          this.stompClientForOther.subscribe(doorResTopic, greeting => {
            this.handleDoorSubscribe(JSON.parse(greeting.body));
          });
          this.stompClientForOther.subscribe(faceResTopic, greeting => {
            this.handleFaceSubscribe(JSON.parse(greeting.body));
          });
          this.stompClientForOther.subscribe(alarmResTopic, greeting => {
            this.handleAlarmSubscribe(JSON.parse(greeting.body));
          });
        },
        err => {
          console.log("save error, errMsg: ", err);
        }
      );
      /* eslint-enable */
    },
    handleEleSubscribe(body) {
      if (!body) {
        return;
      }
      console.log("socket body: ", body);
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
          if (this.isShowLayer) {
            this.commonFilter();
          } else {
            this.$emit("commonFilter");
          }
        } else if (body.changeType === "update") {
          if (!this.mapView.getAllItemsData().some(v => v.itemWebData.elementUuid === body.data.elementUuid)) {
            return;
          }
          let elementData = this.createElementCommon(body.data);
          this.updateCommon(elementData);
          if (this.isShowLayer) {
            this.commonFilter();
          } else {
            this.$emit("commonFilter");
          }
        } else if (body.changeType === "delete") {
          if (!this.mapView.getAllItemsData().some(v => v.itemWebData.elementUuid === body.data.elementUuid)) {
            return;
          }
          this.deleteCommon(body.data);
        }
      }, 500);
    },
    handleMapSubscribe(body) {
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
        if (this.isShowLayer) {
          this.commonFilter();
        } else {
          this.$emit("commonFilter");
        }
      }, 500);
    },
    handleTreeSubscribe(body) {
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
    handleCarSubscribe(body) {
      console.log("carSocketData: ", body);
      if (!body) {
        return;
      }
      this.topicShowCommon(body, "car", 460);
    },
    handleDoorSubscribe(body) {
      console.log("doorSocketData: ", body);
      if (!body) {
        return;
      }
      this.topicShowCommon(body, "door", 410);
    },
    handleFaceSubscribe(body) {
      console.log("faceSocketData: ", body);
      if (!body) {
        return;
      }
      this.topicShowCommon(body, "face", 410);
    },
    handleAlarmSubscribe(body) {
      console.log("alarmSocketData: ", body);
      if (!body) {
        return;
      }
      this.$emit("socketPush", { topicItem: body, topicType: "alarm" });
    },
    topicShowCommon(topicItem, topicType, blockWidth) {
      this.$emit("socketPush", { topicItem, topicType });
      if (this.allShowStatus === "allHide") {
        return;
      }
      if (
        this.chnTypeHideItemArr.some(
          item => item.itemWebData.resourceUuid === topicItem.channelUuid
        ) ||
        this.snapColHideItemArr.some(
          item => item.itemWebData.resourceUuid === topicItem.channelUuid
        )
      ) {
        return;
      }
      let dynArr = [];
      this.layerData.forEach(v => {
        if (v.value === "dynamicFeel") {
          v.children.forEach(x => {
            if (x.checked) {
              dynArr.push(x.value);
            }
          });
        }
      });
      if (!dynArr.some(v => v === topicType)) {
        return;
      }
      let key = this.$common.genModelIndex();
      let blockTop = 0,
        blockLeft = 0;
      this.mapView.getAllItemsData().forEach(v => {
        if (v.itemWebData.resourceUuid === topicItem.channelUuid) {
          if (this.mapType === "picture") {
            blockTop =
              this.mapView.pointToPixel(v.point).y -
              230 -
              10 * (this.mapView.map.getStageInfo().scale - 1);
            blockLeft =
              this.mapView.pointToPixel(v.point).x -
              20 +
              50 * (this.mapView.map.getStageInfo().scale - 1);
          } else {
            blockTop = this.mapView.pointToPixel(v.point).y - 275;
            blockLeft = this.mapView.pointToPixel(v.point).x - 40;
          }
          this.topicBlockArr.push({
            key,
            topicType,
            blockWidth,
            topicItem,
            blockTop,
            blockLeft
          });
          setTimeout(() => {
            for (let [i, x] of this.topicBlockArr.entries()) {
              if (x.key === key) {
                this.topicBlockArr.splice(i, 1);
              }
            }
          }, 3000);
        }
      });
    },
    disConnectSocket() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        console.log("Disconnected");
      }
    },
    disConnectSocketForOther() {
      if (this.stompClientForOther != null) {
        this.stompClientForOther.disconnect();
        console.log("DisconnectedForOther");
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
    this.disConnectSocketForOther();
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
.map-common-main {
  .el-checkbox {
    display: flex;
    align-items: center;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background: #26d39d;
  }
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background: #26d39d;
  }
  .el-checkbox__label {
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  .el-checkbox__inner::after {
    border: 1px solid white !important;
    border-left: 0 !important;
    border-top: 0 !important;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.map-common-main {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
  top: 0px;
  left: 0px;
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
    .layer {
      position: absolute;
      top: 30px;
      .layer-block {
        position: relative;
        .layer-button {
          position: absolute;
          top: 0px;
          left: 0px;
          width: 38px;
          height: 38px;
          background: rgba(85, 85, 85, 0.5);
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .main-menu {
          position: absolute;
          top: 0px;
          left: 45px;
          background: #2a2e31;
          box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.2);
          width: 160px;
          &:last-child {
            border-bottom: 0px;
          }
        }
        .child-menu {
          position: absolute;
          left: 204px;
          padding-left: 4px;
          box-sizing: border-box;
          .child-menu-block {
            background: #2a2e31;
            box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.2);
            width: 160px;
            &:last-child {
              border-bottom: 0px;
            }
          }
        }
        .menu-item {
          border-bottom: 1px rgba($color: #ffffff, $alpha: 0.05) solid;
          width: 100%;
          height: 39px;
          display: flex;
          align-items: center;
          padding: 0px 12px;
          box-sizing: border-box;
          // &:hover {
          //   background: rgba($color: #28ffbb, $alpha: 0.05);
          // }
        }
      }
    }
  }
}
</style>
