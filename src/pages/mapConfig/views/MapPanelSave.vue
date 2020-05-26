<template>
  <div class="map-save"
       id="mapSave"
       v-loading="isLoading"
       @mousemove="mainMousemove">
    <link-map-dialog :isShow="isShowLinkMapDialog"
                     :orgUuid="orgUuid"
                     @onCancel="onCancelLinkMapDialog"
                     @onConfirm="onConfirmLinkMapDialog" />
    <div v-if="isShowDelIcon"
         :style="`position: absolute; z-index: 2009; top: ${imgTop}px; left: ${imgLeft}px; cursor: pointer;`"
         @click="delSingleEle"
         @mousemove.stop="delMouse"
         @mouseover.stop="delMouse">
      <img src="@/assets/images/map/icon_del.png">
    </div>
    <item-info-block v-if="isShowDoorBlock"
                     :blockTop="itemTop"
                     :orgUuid="orgUuid"
                     :blockLeft="itemLeft"
                     :data="itemInfoData"
                     :mapType="mapType"
                     @closeBlock="closeBlock"
                     @confirmEditInfo="confirmEditInfo" />
    <div class="map-self"
         id="gis-map"
         v-if="mapType === 'gis'"
         @dragover="allowDrop"
         @drop="dropRes"></div>
    <div class="map-self"
         id="pic-map"
         @drop="dropRes"
         v-if="mapType === 'picture'"></div>
    <div class="map-option">
      <div class="option-button"
           @click="rectSelect"
           :style="`cursor: ${OwnAuthDisabled ? 'pointer' : 'not-allowed'}`">
        <img src="@/assets/images/map/rect_select.png" />
        <span class="button-text">框选</span>
      </div>
      <div class="option-split"></div>
      <div class="option-button"
           @click="linkMap"
           :style="`cursor: ${OwnAuthDisabled ? 'pointer' : 'not-allowed'}`">
        <img src="@/assets/images/map/link_map.png" />
        <span class="button-text">链接地图</span>
      </div>
      <div class="option-split"></div>
      <div class="option-button"
           @click="editCenter"
           v-if="mapType === 'gis'"
           :style="`cursor: ${OwnAuthDisabled ? 'pointer' : 'not-allowed'}`">
        <img src="@/assets/images/map/edit_center.png" />
        <span class="button-text">修改中心点</span>
      </div>
      <el-upload :action="fileUrl"
                 :show-file-list="false"
                 :auto-upload="true"
                 :disabled="!OwnAuthDisabled"
                 class="option-button"
                 :style="`cursor: ${OwnAuthDisabled ? 'pointer' : 'not-allowed'}`"
                 accept=".jpg, .jpeg, .png, .svg, .JPG, .JPEG, .PNG, .SVG,"
                 v-if="mapType === 'picture'"
                 :before-upload="beforeAvatarUpload"
                 :http-request='httpRequest'>
        <img src="@/assets/images/map/edit_center.png" />
        <span class="button-text">更改地图</span>
      </el-upload>
      <div class="option-split"></div>
      <div class="option-button"
           @click="clearAll"
           :style="`cursor: ${OwnAuthDisabled ? 'pointer' : 'not-allowed'}`">
        <img src="@/assets/images/map/clear_all.png" />
        <span class="button-text">清除</span>
      </div>
    </div>
    <div class="map-control">
      <el-tooltip class="item"
                  effect="dark"
                  content="回到中心点"
                  placement="left">
        <div class="button-block"
             @click="clickCenter">
          <img src="@/assets/images/map/location.png" />
        </div>
      </el-tooltip>
      <el-tooltip class="item"
                  effect="dark"
                  content="放大一级"
                  placement="left">
        <div class="button-block"
             @click="clickcLarge">
          <img src="@/assets/images/map/enlarge.png" />
        </div>
      </el-tooltip>
      <el-tooltip class="item"
                  effect="dark"
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
import ItemInfoBlock from "@/pages/mapConfig/components/ItemInfoBlock";
import LinkMapDialog from "@/pages/mapConfig/components/LinkMapDialog";

export default {
  components: {
    ItemInfoBlock,
    LinkMapDialog
  },
  props: {},
  data() {
    return {
      orgUuid: "",
      orgName: "",
      mapType: "gis",
      saveMapData: null,
      mapData: [],
      mapModel: null,
      mapView: null,
      isShowDoorBlock: false,
      itemTop: 0,
      itemLeft: 0,
      itemInfoData: null,
      isLoading: false,
      stompClient: null,
      mapInfo: {
        centerPointX: "",
        centerPointY: "",
        mapBase64: "",
        mapLevel: ""
      },
      fileUrl: "",
      mapBase64: "",
      mapSelfData: [],
      isShowLinkMapDialog: false,
      linkPoint: null,
      isShowDelIcon: false,
      imgLeft: 0,
      imgTop: 0,
      mouseOverItemId: "",
      mouseOverItemName: "",
      isShowTopicFlag: false,
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      eleCurrentPage: 1
    };
  },
  created() {},
  activated() {
    if (this.ShowAuthDisabled) {
      this.isShowTopicFlag = true;
    }
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("地图配置", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("地图配置", "isOwn");
    if (this.ShowAuthDisabled) {
      this.connectSocket();
    }
  },
  methods: {
    mainMousemove() {
      if (this.mapType === "picture") {
        this.isShowDelIcon = false;
      }
    },
    delMouse() {
      if (!this.OwnAuthDisabled) {
        return;
      }
      this.isShowDelIcon = true;
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
    hideInfoBlock() {
      this.isShowDoorBlock = false;
    },
    itemEventCallBack(e, dataObj) {
      if (dataObj.eventType === "onclick") {
        if (dataObj.item.type === "marker") {
          this.infoBlockClick(dataObj);
        }
      }
      if (dataObj.eventType === "ondragend") {
        if (!this.OwnAuthDisabled) {
          return;
        }
        if (dataObj.item.type === "marker") {
          this.dragElement(dataObj);
        }
      }
      if (dataObj.eventType === "sectorDragend") {
        if (!this.OwnAuthDisabled) {
          return;
        }
        this.updateSectorInfo(dataObj);
      }
      if (
        dataObj.eventType === "onmousemove" ||
        dataObj.eventType === "onmouseover"
      ) {
        if (!this.OwnAuthDisabled) {
          return;
        }
        if (dataObj.item.type === "marker") {
          this.mouseoverEle(dataObj);
        }
      }
      if (dataObj.eventType === "onmouseout") {
        if (!this.OwnAuthDisabled) {
          return;
        }
        if (dataObj.item.type === "marker") {
          this.isShowDelIcon = false;
        }
      }
    },
    updateSectorInfo(dataObj) {
      let xhr = {
        elementUuid: dataObj.item.itemWebData.elementUuid,
        elementName: dataObj.item.itemWebData.elementName,
        elementType: dataObj.item.itemWebData.elementType,
        elementSecondType: dataObj.item.itemWebData.elementSecondType,
        elementThirdType: dataObj.item.itemWebData.elementThirdType,
        elementPointX: dataObj.item.itemWebData.elementPointX,
        elementPointY: dataObj.item.itemWebData.elementPointY,
        elementPointZ: null,
        resourceUuid: null,
        parentElementUuid: dataObj.item.itemWebData.parentElementUuid,
        mapUuid: this.mapType === "gis" ? null : this.saveMapData.mapUuid,
        elementGroupType: this.mapType === "gis" ? "channelGroup" : null,
        elementInfo: {
          center: dataObj.item.itemWebData.elementInfo.center,
          radius: dataObj.sectorInfo.radius,
          sDegree: dataObj.sectorInfo.sDegree,
          eDegree: dataObj.sectorInfo.eDegree,
          isShowSector: dataObj.item.itemWebData.elementInfo.isShowSector
        }
      };
      this.editElement(xhr);
    },
    dragElement(dataObj) {
      let x = dataObj.x;
      let y = dataObj.y;
      let point = null;
      point = this.mapView.pixelToPoint(
        x,
        y,
        dataObj.offset ? dataObj.offset : null
      );
      if (this.mapType === "picture" && (isNaN(point.x) || isNaN(point.y))) {
        this.$cToast.warn("点位不能拖离图片底图，请重新拖动！");
        let elementData = this.createElementCommon(dataObj.item.itemWebData);
        this.updateCommon(elementData);
        return;
      }
      if (this.mapType === "gis") {
        if (
          point.lat.toString() === dataObj.item.itemWebData.elementPointX &&
          point.lng.toString() === dataObj.item.itemWebData.elementPointY
        ) {
          return;
        }
      } else {
        if (
          point.x.toString() === dataObj.item.itemWebData.elementPointX &&
          point.y.toString() === dataObj.item.itemWebData.elementPointY
        ) {
          return;
        }
      }
      let xhr = {
        elementUuid: dataObj.item.itemWebData.elementUuid,
        elementName: dataObj.item.itemWebData.elementName,
        elementType: dataObj.item.itemWebData.elementType,
        elementSecondType: dataObj.item.itemWebData.elementSecondType,
        elementThirdType: dataObj.item.itemWebData.elementThirdType,
        elementPointX:
          this.mapType === "gis" ? point.lat.toString() : point.x.toString(),
        elementPointY:
          this.mapType === "gis" ? point.lng.toString() : point.y.toString(),
        elementPointZ: dataObj.item.itemWebData.elementPointZ,
        resourceUuid: dataObj.item.itemWebData.resourceUuid,
        elementInfo: dataObj.item.itemWebData.elementInfo,
        parentElementUuid: dataObj.item.itemWebData.parentElementUuid,
        mapUuid:
          (dataObj.item.itemWebData.elementType === "channel" ||
            dataObj.item.itemWebData.elementType === "sector") &&
          this.mapType === "gis"
            ? null
            : dataObj.item.itemWebData.mapUuid,
        elementGroupType:
          (dataObj.item.itemWebData.elementType === "channel" ||
            dataObj.item.itemWebData.elementType === "sector") &&
          this.mapType === "gis"
            ? "channelGroup"
            : null
      };
      this.editElement(xhr);
      if (dataObj.item.secondType === "vc" && dataObj.item.itemInfo) {
        let sectorWebData = this.mapView
          .getAllItemsData()
          .find(
            v =>
              v.itemWebData.parentElementUuid ===
              dataObj.item.itemWebData.elementUuid
          ).itemWebData;
        let sectorParams = {
          parentUuid: dataObj.item.itemWebData.elementUuid,
          elementPointX:
            this.mapType === "gis" ? point.lat.toString() : point.x.toString(),
          elementPointY:
            this.mapType === "gis" ? point.lng.toString() : point.y.toString(),
          mapUuid: dataObj.item.itemWebData.mapUuid,
          isShowSector: dataObj.item.itemInfo.isShowSector
        };
        sectorParams.sectorWebData = sectorWebData;
        this.updateSector(sectorParams);
      }
    },
    addElement(xhr) {
      this.$mapConfigHttp.addMapElement(xhr).then(res => {
        this.addMapElementSuccess(res.data, xhr);
      });
    },
    editElement(xhr) {
      this.$mapConfigHttp.editMapElement(xhr).then(res => {
        this.editMapElementSuccess(res.data, xhr);
      });
    },
    editMapElementSuccess(body, xhr) {
      // this.$cToast.success(body.msg);
      this.isLoading = true;
      this.$mapConfigHttp.setMapSysLog({
        logType: "config",
        moduleName: "地图配置",
        logEvent: "edit",
        detail: `${this.orgName}-修改点位-${xhr.elementName}`
      });
    },
    infoBlockClick(dataObj) {
      this.isShowDoorBlock = true;
      this.itemTop = dataObj.y - 20 - 200;
      this.itemLeft = dataObj.x - 20;
      this.itemInfoData = dataObj.item;
    },
    mouseoverEle(dataObj) {
      if (this.mapType === "picture") {
        this.imgTop =
          this.mapView.pointToPixel(dataObj.item.point).y -
          5 -
          10 * (this.mapView.map.getStageInfo().scale - 1);
        this.imgLeft =
          this.mapView.pointToPixel(dataObj.item.point).x +
          32 +
          50 * (this.mapView.map.getStageInfo().scale - 1);
      } else {
        this.imgTop = this.mapView.pointToPixel(dataObj.item.point).y - 45;
        this.imgLeft = this.mapView.pointToPixel(dataObj.item.point).x + 13;
      }
      this.mouseOverItemId = dataObj.item.itemId;
      this.mouseOverItemName = dataObj.item.name;
      this.isShowDelIcon = true;
    },
    closeBlock() {
      this.isShowDoorBlock = false;
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
    rectSelect() {
      if (!this.OwnAuthDisabled) {
        return;
      }
      this.mapView.quitEditState();
      this.mapView.rectangleSelect((itemArr, overlay) => {
        console.log("框选后返回的点位数据：", itemArr);
        if (!itemArr || itemArr.length === 0) {
          this.$cToast.warn("未选中点位");
          this.mapView.map.removeOverlay(overlay);
          setTimeout(() => {
            this.mapView.setEditState();
          }, 300);
          return;
        }
        this.$confirm(
          `<span style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;">是否确认删除所选点位？</span>`,
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
          .then(() => {
            this.mapView.map.removeOverlay(overlay);
            setTimeout(() => {
              this.mapView.setEditState();
            }, 300);
          })
          .catch(action => {
            setTimeout(() => {
              this.mapView.setEditState();
            }, 300);
            if (action === "cancel") {
              let elementUuidList = [];
              let elementNameList = [];
              itemArr.forEach(v => {
                elementUuidList.push(v.itemId);
                elementNameList.push(v.name);
              });
              this.deleteMapElement(elementUuidList, elementNameList, overlay);
            } else if (action === "close") {
              this.mapView.map.removeOverlay(overlay);
            }
          });
      });
    },
    linkMap(ev) {
      if (!this.OwnAuthDisabled) {
        return;
      }
      let img = document.createElement("img");
      img.style.position = "absolute";
      img.src = require("@/assets/images/map/icon/link_online.png");
      let mapSave = document.getElementById("mapSave");
      mapSave.appendChild(img);
      mapSave.onmousemove = event => {
        if (img) {
          let x = event.clientX;
          let y = event.clientY;
          img.style.left = x - 243 + "px";
          img.style.top = y - 80 + "px";
        }
      };
      mapSave.onmousedown = event => {
        if (img) {
          mapSave.removeChild(img);
          img = null;
          let x = event.clientX;
          let y = event.clientY;
          this.linkPoint = this.mapView.pixelToPoint(x - 220, y - 50);
          this.isShowLinkMapDialog = true;
        }
      };
    },
    onConfirmLinkMapDialog(linkData) {
      this.isShowLinkMapDialog = false;
      let xhr = {
        elementName: linkData.linkName,
        elementType: "link",
        elementSecondType: "link",
        elementThirdType: "link",
        elementPointX:
          this.mapType === "gis"
            ? this.linkPoint.lat.toString()
            : this.linkPoint.x.toString(),
        elementPointY:
          this.mapType === "gis"
            ? this.linkPoint.lng.toString()
            : this.linkPoint.y.toString(),
        elementPointZ: "",
        resourceUuid: "",
        elementInfo: {
          nodeObj: linkData.nodeObj,
          linkAddress: linkData.linkAddress
        },
        parentElementUuid: "",
        mapUuid: this.saveMapData.mapUuid,
        elementGroupType: null
      };
      this.addElement(xhr);
    },
    onCancelLinkMapDialog() {
      this.isShowLinkMapDialog = false;
    },
    editCenter() {
      if (!this.OwnAuthDisabled) {
        return;
      }
      this.$confirm(
        `<span style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;">确认修改当前地图中心为新的中心点？</span>`,
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
            this.setMapInfo();
            this.editMap();
          }
        });
    },
    setMapInfo(mapBase64 = "") {
      this.mapInfo = {
        centerPointX: "",
        centerPointY: "",
        mapBase64: "",
        mapLevel: ""
      };
      if (this.mapType === "gis") {
        this.mapInfo.centerPointX = this.mapView.map.getCenter().lat.toString();
        this.mapInfo.centerPointY = this.mapView.map.getCenter().lng.toString();
        this.mapInfo.mapLevel = this.mapView.map.getZoom().toString();
      } else {
        this.mapInfo.mapBase64 = mapBase64;
      }
    },
    editMap() {
      this.$mapConfigHttp
        .updateMapInfo({
          mapUuid: this.saveMapData.mapUuid,
          orgUuid: this.saveMapData.orgUuid,
          mapType: this.saveMapData.mapType,
          mapBase64: this.mapInfo.mapBase64,
          centerPointX: this.mapInfo.centerPointX,
          centerPointY: this.mapInfo.centerPointY,
          centerPointAltitude: "",
          mapLevel: this.mapInfo.mapLevel
        })
        .then(res => {
          this.updateMapInfoSuccess(res.data);
        });
    },
    updateMapInfoSuccess(body) {
      // this.$cToast.success(body.msg);
      this.isLoading = true;
      let detailStr = "";
      if (this.mapType === "gis") {
        detailStr = `${this.orgName}-修改中心点`;
      } else {
        detailStr = `修改地图-${this.orgName}`;
      }
      this.$mapConfigHttp.setMapSysLog({
        logType: "config",
        moduleName: "地图配置",
        logEvent: "edit",
        detail: detailStr
      });
    },
    clearAll() {
      if (!this.OwnAuthDisabled) {
        return;
      }
      this.$confirm(
        `<span style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;">是否删除当前地图以及地图上的所有元素信息？</span>`,
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
            this.deleteMapInfo();
          }
        });
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
    dropRes(ev) {
      ev.preventDefault();
      let resData = JSON.parse(ev.dataTransfer.getData("resData"));
      console.log(resData);
      let mapPoint = this.mapView.pixelToPoint(ev.x - 220, ev.y - 50);
      let point = null;
      point = mapPoint;
      let xhr = {
        elementName: resData.label,
        elementType: "channel",
        elementSecondType: resData.resType,
        elementThirdType: resData.realType,
        elementPointX:
          this.mapType === "gis" ? point.lat.toString() : point.x.toString(),
        elementPointY:
          this.mapType === "gis" ? point.lng.toString() : point.y.toString(),
        elementPointZ: "",
        resourceUuid: resData.id,
        elementInfo: null,
        parentElementUuid: "",
        mapUuid: this.mapType === "gis" ? null : this.saveMapData.mapUuid,
        elementGroupType: this.mapType === "gis" ? "channelGroup" : null
      };
      if (
        this.mapView
          .getAllItemsData()
          .some(v => v.itemWebData.resourceUuid === resData.id)
      ) {
        this.$confirm(
          `<span style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;">当前资源已添加，是否更换位置？</span>`,
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
              let elementItem = this.mapView
                .getAllItemsData()
                .find(v => v.itemWebData.resourceUuid === resData.id);
              xhr.elementUuid = elementItem.itemWebData.elementUuid;
              this.editElement(xhr);
              if (elementItem.secondType === "vc" && elementItem.itemInfo) {
                let sectorWebData = this.mapView
                  .getAllItemsData()
                  .find(
                    v =>
                      v.itemWebData.parentElementUuid ===
                      elementItem.itemWebData.elementUuid
                  ).itemWebData;
                let sectorParams = {
                  parentUuid: elementItem.itemWebData.elementUuid,
                  elementPointX:
                    this.mapType === "gis"
                      ? point.lat.toString()
                      : point.x.toString(),
                  elementPointY:
                    this.mapType === "gis"
                      ? point.lng.toString()
                      : point.y.toString(),
                  mapUuid: elementItem.itemWebData.mapUuid,
                  isShowSector: elementItem.itemInfo.isShowSector
                };
                sectorParams.sectorWebData = sectorWebData;
                this.updateSector(sectorParams);
              }
            }
          });
      } else {
        this.addElement(xhr);
      }
    },
    addMapElementSuccess(body, xhr) {
      // this.$cToast.success(body.msg);
      this.isLoading = true;
      this.$mapConfigHttp.setMapSysLog({
        logType: "config",
        moduleName: "地图配置",
        logEvent: "add",
        detail: `${this.orgName}-添加点位-${xhr.elementName}`
      });
    },
    addCommon(itemNew) {
      this.mapModel.addItem(itemNew, (item, modelIndex) => {
        this.mapView.addItem(item, modelIndex, this.itemEventCallBack);
        setTimeout(() => {
          this.mapView.setItemEditState(modelIndex);
        }, 200);
      });
    },
    updateCommon(itemNew) {
      this.mapModel.updateItem(itemNew.itemId, itemNew, (item, modelIndex) => {
        this.mapView.updateItem(item, modelIndex, this.itemEventCallBack);
        setTimeout(() => {
          this.mapView.setItemEditState(modelIndex);
        }, 200);
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
        { projectUuid: this.$store.state.home.projectUuid },
        frame => {
          console.log("save connect success: ");
          const elementChangeTopic =
            "/user/topic/map-1.7/client/config/elementChange";
          const mapChangeTopic = "/user/topic/map-1.7/client/config/mapChange";
          this.stompClient.subscribe(elementChangeTopic, greeting => {
            this.handleEleSubscribe(JSON.parse(greeting.body));
          });
          this.stompClient.subscribe(mapChangeTopic, greeting => {
            this.handleMapSubscribe(JSON.parse(greeting.body));
          });
        },
        err => {
          console.log("save error, errMsg: ", err);
        }
      );
      /* eslint-enable */
    },
    handleEleSubscribe(body) {
      console.log("save Subscribe success: ", body);
      if (!body) {
        return;
      }
      this.isLoading = false;
      if (this.isShowTopicFlag) {
        this.$cToast.success("地图信息已变更");
      }
      this.isShowDoorBlock = false;
      if (body.changeType === "add") {
        let elementData = this.createElementCommon(body.data);
        this.addCommon(elementData);
        this.$bus.$emit("setTreeNode", {
          elementData: body.data,
          addStatus: 1
        });
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
        this.deleteCommon(body.data);
        this.$bus.$emit("setTreeNode", {
          elementData: body.data,
          addStatus: 0
        });
      }
    },
    handleMapSubscribe(body) {
      if (!body) {
        return;
      }
      this.isLoading = false;
      if (this.isShowTopicFlag) {
        this.$cToast.success("地图信息已变更");
      }
      this.$emit("refreshMapPanelState");
    },
    disConnectSocket() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        console.log("Disconnected");
      }
    },
    deleteMapInfo() {
      this.$mapConfigHttp
        .deleteMapInfo({
          mapUuid: this.saveMapData.mapUuid
        })
        .then(res => {
          this.deleteMapInfoSuccess(res.data);
        });
    },
    deleteMapInfoSuccess(body) {
      // this.$cToast.success(body.msg);
      this.isLoading = true;
      this.$mapConfigHttp.setMapSysLog({
        logType: "config",
        moduleName: "地图配置",
        logEvent: "delete",
        detail: `删除地图-${this.orgName}`
      });
    },
    beforeAvatarUpload(file) {
      let isJPG = false;
      if (
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/svg" ||
        file.type === "image/svg+xml"
      ) {
        isJPG = true;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$cToast.error("上传图片只能是 JPG 或 PNG 或 SVG 格式!");
      }
      if (!isLt2M) {
        this.$cToast.error("上传图片大小不能超过 10MB!");
      }
      return isJPG && isLt2M && this.chargeImgSize(file);
    },
    chargeImgSize(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = e => {
          let data = e.target.result;
          let image = new Image();
          image.onload = () => {
            let width = image.width;
            let height = image.height;
            if (width >= 1024 && height >= 768) {
              resolve();
            } else {
              this.$cToast.error("最小图片分辨率为1024×768像素");
              reject(new Error("最小图片分辨率为1024×768像素"));
            }
          };
          image.src = data;
        };
        reader.readAsDataURL(file);
      });
    },
    httpRequest(e) {
      let reader = new FileReader();
      reader.readAsDataURL(e.file);
      let _this = this;
      reader.onload = function(e) {
        _this.mapBase64 = this.result
          .replace("data:image/jpeg;base64,", "jpeg:")
          .replace("data:image/png;base64,", "png:")
          .replace("data:image/svg;base64,", "svg:")
          .replace("data:image/svg+xml;base64,", "svg:")
          .replace("data:image/jpg;base64,", "jpg:");
        _this.setMapInfo(_this.mapBase64);
        _this.editMap();
      };
    },
    confirmEditInfo(blockData) {
      let xhr = {
        elementUuid: blockData.item.itemWebData.elementUuid,
        elementType: blockData.item.itemWebData.elementType,
        elementSecondType: blockData.item.itemWebData.elementSecondType,
        elementThirdType: blockData.item.itemWebData.elementThirdType,
        elementPointX: blockData.elementPointX,
        elementPointY: blockData.elementPointY,
        elementPointZ: blockData.item.itemWebData.elementPointZ,
        resourceUuid: blockData.item.itemWebData.resourceUuid,
        parentElementUuid: blockData.item.itemWebData.parentElementUuid
      };
      if (blockData.item.secondType === "link") {
        let linkXhr = {
          elementName: blockData.linkName,
          elementInfo: {
            nodeObj: blockData.nodeObj,
            linkAddress: blockData.linkAddress
          },
          mapUuid: blockData.item.itemWebData.mapUuid,
          elementGroupType: null
        };
        Object.assign(xhr, linkXhr);
      } else {
        let vcXhr = {
          elementName: blockData.item.itemWebData.elementName,
          elementInfo: {
            isShowSector: blockData.isShowSector
          },
          mapUuid: this.mapType === "gis" ? null : this.saveMapData.mapUuid,
          elementGroupType: this.mapType === "gis" ? "channelGroup" : null
        };
        Object.assign(xhr, vcXhr);
      }
      if (blockData.item.itemWebData.elementSecondType === "vc") {
        let sectorParams = {
          parentUuid: blockData.item.itemWebData.elementUuid,
          elementPointX: blockData.elementPointX,
          elementPointY: blockData.elementPointY,
          mapUuid: blockData.item.itemWebData.mapUuid,
          isShowSector: blockData.isShowSector
        };
        if (!blockData.item.itemWebData.elementInfo) {
          this.createSector(sectorParams);
        } else {
          let sectorWebData = this.mapView
            .getAllItemsData()
            .find(
              v =>
                v.itemWebData.parentElementUuid ===
                blockData.item.itemWebData.elementUuid
            ).itemWebData;
          sectorParams.sectorWebData = sectorWebData;
          this.updateSector(sectorParams);
        }
      }
      this.editElement(xhr);
      this.isShowDoorBlock = false;
    },
    createSector(sectorParams) {
      let xhr = {
        elementName: "视角扇形",
        elementType: "sector",
        elementSecondType: "sector",
        elementThirdType: "sector",
        elementPointX: sectorParams.elementPointX,
        elementPointY: sectorParams.elementPointY,
        elementPointZ: null,
        resourceUuid: null,
        parentElementUuid: sectorParams.parentUuid,
        mapUuid: this.mapType === "gis" ? null : this.saveMapData.mapUuid,
        elementGroupType: this.mapType === "gis" ? "channelGroup" : null,
        elementInfo: {
          radius: 220,
          sDegree: 20,
          eDegree: 80,
          isShowSector: sectorParams.isShowSector
        }
      };
      if (this.mapType === "gis") {
        xhr.elementInfo.center = {
          lng: sectorParams.elementPointY,
          lat: sectorParams.elementPointX
        };
      } else {
        xhr.elementInfo.center = {
          x: parseFloat(sectorParams.elementPointX) + 17.0,
          y: parseFloat(sectorParams.elementPointY) + 40.0
        };
      }
      this.addElement(xhr);
    },
    updateSector(sectorParams) {
      let xhr = {
        elementUuid: sectorParams.sectorWebData.elementUuid,
        elementName: sectorParams.sectorWebData.elementName,
        elementType: sectorParams.sectorWebData.elementType,
        elementSecondType: sectorParams.sectorWebData.elementSecondType,
        elementThirdType: sectorParams.sectorWebData.elementThirdType,
        elementPointX: sectorParams.elementPointX,
        elementPointY: sectorParams.elementPointY,
        elementPointZ: null,
        resourceUuid: null,
        parentElementUuid: sectorParams.parentUuid,
        mapUuid: this.mapType === "gis" ? null : this.saveMapData.mapUuid,
        elementGroupType: this.mapType === "gis" ? "channelGroup" : null,
        elementInfo: {
          radius: sectorParams.sectorWebData.elementInfo.radius,
          sDegree: sectorParams.sectorWebData.elementInfo.sDegree,
          eDegree: sectorParams.sectorWebData.elementInfo.eDegree,
          isShowSector: sectorParams.isShowSector
        }
      };
      if (this.mapType === "gis") {
        xhr.elementInfo.center = {
          lng: sectorParams.elementPointY,
          lat: sectorParams.elementPointX
        };
      } else {
        xhr.elementInfo.center = {
          x: parseFloat(sectorParams.elementPointX) + 17.0,
          y: parseFloat(sectorParams.elementPointY) + 40.0
        };
      }
      this.editElement(xhr);
    },
    delSingleEle() {
      this.isShowDelIcon = false;
      this.$confirm(
        `<span style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;">是否确认删除该点位？</span>`,
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
            let elementUuidList = [];
            let elementNameList = [];
            elementUuidList.push(this.mouseOverItemId);
            elementNameList.push(this.mouseOverItemName);
            this.deleteMapElement(elementUuidList, elementNameList);
          }
        });
    },
    deleteMapElement(elementUuidList, elementNameList, overlay) {
      let uuidList = elementUuidList;
      // uuidList.forEach(v => {
      //   this.mapView.itemMap.forEach(itemViewObj => {
      //     if (itemViewObj.item.parentItemId === v) {
      //       uuidList.push(itemViewObj.item.itemId);
      //     }
      //   });
      // });
      this.$mapConfigHttp
        .deleteMapElement({
          elementUuidList: uuidList.toString()
        })
        .then(res => {
          this.deleteMapElementSuccess(res.data, elementNameList, overlay);
        });
    },
    deleteMapElementSuccess(body, elementNameList, overlay) {
      this.isLoading = true;
      if (overlay) {
        this.mapView.map.removeOverlay(overlay);
      }
      this.$mapConfigHttp.setMapSysLog({
        logType: "config",
        moduleName: "地图配置",
        logEvent: "delete",
        detail: `${this.orgName}-删除点位-${elementNameList.toString()}`
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
      if (this.OwnAuthDisabled) {
        setTimeout(() => {
          this.mapView.setEditState();
        }, 500);
      }
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
    }
  },
  watch: {
    saveMapData: {
      handler(val) {
        this.mapType = val.mapType;
        this.orgUuid = val.orgUuid;
        this.$nextTick(() => {
          this.handleMapSelfData();
        });
      },
      deep: true
    }
  },
  deactivated() {
    this.isShowTopicFlag = false;
  },
  destroyed() {
    this.disConnectSocket();
  }
};
</script>
<style lang="scss">
.map-save {
  .el-upload:focus {
    border-color: #ffffff;
    color: #ffffff;
  }
  .el-dialog {
    margin-top: 36vh !important;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.map-save {
  width: 100%;
  height: 99%;
  position: relative;
  .map-self {
    width: 100%;
    height: 100%;
  }
  .map-option {
    position: absolute;
    top: 40px;
    right: 42px;
    background: #363b3e;
    box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    width: 340px;
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
      align-items: center;
      cursor: pointer;
      .button-text {
        margin-left: 5px;
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
  .map-control {
    position: absolute;
    bottom: 55px;
    right: 25px;
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
    }
  }
}
</style>
