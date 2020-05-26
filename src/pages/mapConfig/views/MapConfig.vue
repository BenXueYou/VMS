<template>
  <div class="map-config">
    <div class="left-side"
         :style="`justify-content: ${openMenu === 'org' ? 'space-between' : 'flex-start'}`">
      <div class="side-menu"
           :style="`border-width: 0px 0px ${openMenu === 'org' ? '0' : '1'}px 0px`"
           @click="clickOrgMenu">
        <img src="@/assets/images/map/org.png">
        <span style="margin-left: 8px;">组织区域</span>
        <img src="@/assets/images/map/down.png"
             style="margin-left: auto; margin-right: 0px">
      </div>
      <div class="tree-panel"
           v-show="isShowOrgPanel">
        <el-input class="search-input"
                  v-model="titleText"
                  size="small"
                  style="width: 90%;margin-left: 10px;"
                  placeholder="搜索区域名称">
          <img slot="prefix"
               src="@/assets/images/search_s.png">
        </el-input>
        <el-tree :props="defaultProps"
                 node-key="id"
                 :indent="10"
                 style="margin-top: 15px; margin-left: 5px;"
                 lazy
                 :load="loadNode"
                 ref="orgTree"
                 :filter-node-method="filterNode"
                 :default-expanded-keys="defaultExpKeys"
                 :highlight-current="true"
                 :expand-on-click-node="false"
                 @node-click="handleNodeClick">
          <div slot-scope="{ node }">
            <div class="text-show"
                 :style="`width: ${220 - 35 - 10 * node.level}px`"
                 :title='node.label'>{{node.label}}</div>
          </div>
        </el-tree>
      </div>
      <div class="side-menu"
           @click="clickDevMenu">
        <img src="@/assets/images/map/dev.png">
        <span style="margin-left: 8px;">配置资源点</span>
        <img src="@/assets/images/map/down.png"
             style="margin-left: auto; margin-right: 0px">
      </div>
      <div class="tree-panel"
           v-show="!isShowOrgPanel">
        <el-input class="search-input"
                  v-model="titleText2"
                  size="small"
                  style="width: 90%;margin-left: 10px;"
                  placeholder="搜索区域名称">
          <img slot="prefix"
               src="@/assets/images/search_s.png">
        </el-input>
        <el-tree :props="defaultProps"
                 node-key="id"
                 :indent="10"
                 style="margin-top: 15px; margin-left: 5px;"
                 lazy
                 v-if="isShowResTree"
                 :load="loadNode2"
                 ref="devTree"
                 expand-on-click-node
                 :highlight-current="false"
                 :filter-node-method="filterNode2"
                 :default-expanded-keys="defaultExpKeys2"
                 @node-click="handleNodeClick2">
          <div slot-scope="{ node, data }">
            <div class="tree-item">
              <img :src="getIcon(node.data.onlineStatus === 'offline' ? 0 : 1, node.data.realType)"
                   v-if="node.data.nodeType === 'chnNode'"
                   width="13px"
                   height="12px"
                   style="margin-right: 4px;">
              <div class="text-show"
                   :style="`width: ${220 - 35 - 13 - 10 * node.level}px`"
                   :title='node.label'
                   :draggable="data.nodeType === 'chnNode' ? 'true' : 'false'"
                   @dragstart="dragstart($event, data)">{{node.label}}</div>
              <div :id="node.data.id"
                   style="display: none">{{node.data.addStatus ? 1 : 0}}</div>
            </div>
          </div>
        </el-tree>
      </div>
    </div>
    <map-panel-edit class="map-panel-side"
                    ref="mapEdit"
                    @refreshMapPanelState="refreshMapPanelState"
                    v-if="!isSave" />
    <map-panel-save class="map-panel-side"
                    ref="mapSave"
                    @refreshMapPanelState="refreshMapPanelState"
                    v-if="isSave" />
  </div>
</template>

<script>
import MapPanelEdit from "@/pages/mapConfig/views/MapPanelEdit";
import MapPanelSave from "@/pages/mapConfig/views/MapPanelSave";

export default {
  components: {
    MapPanelEdit,
    MapPanelSave
  },
  props: {},
  data() {
    return {
      openMenu: "org",
      titleText: "",
      titleText2: "",
      isShowOrgPanel: true,
      data: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      defaultExpKeys: [],
      defaultExpKeys2: [],
      orgUuid: "",
      isSave: false,
      stompClient: null,
      orgDefaultId: "",
      resConfigDefaultId: "",
      isShowTopicFlag: false,
      isShowResTree: false,
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      orgName: "",
    };
  },
  created() {},
  activated() {
    if (this.ShowAuthDisabled) {
      this.isShowTopicFlag = true;
      this.registerEventbus();
    }
  },
  mounted() {
    // console.log(
    //   "百度经纬度坐标转wgs84坐标: ",
    //   this.$coordtransform.gcj02towgs84(
    //     this.$coordtransform.bd09togcj02(121.464977, 31.247061)[0],
    //     this.$coordtransform.bd09togcj02(121.464977, 31.247061)[1]
    //   )
    // );
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("地图配置", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("地图配置", "isOwn");
    if (this.ShowAuthDisabled) {
      this.connectSocket();
    }
  },
  methods: {
    clickOrgMenu() {
      this.openMenu = "org";
      this.isShowOrgPanel = true;
      this.orgSetCommon(this.orgDefaultId);
    },
    clickDevMenu() {
      this.openMenu = "dev";
      this.isShowOrgPanel = false;
      // this.orgSetCommon(this.resConfigDefaultId);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    filterNode2(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
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
              this.setDefaultSelectedKey(res.data.data[0].id);
              res.data.data.forEach((v, i) => {
                if (v.openFlag) {
                  this.setChild(node.childNodes[i]);
                }
              });
            }
          }
        });
    },
    loadNode2(node, resolve) {
      if (!this.ShowAuthDisabled) {
        return;
      }
      this.$mapConfigHttp
        .getResTree({
          mapUuid: this.mapUuid,
          viewType: "",
          treeStructure: "orgNode$device|chnNode",
          authEnable: false,
          parentUuid: node.level !== 0 ? node.data.id : "",
          parentType: node.level !== 0 ? node.data.nodeType : "",
          recursiveEnable: true
        })
        .then(res => {
          if (!res.data.data || res.data.data.length === 0) {
            resolve([]);
          } else {
            let resolvaArr = [];
            for (let index in res.data.data) {
              if (
                (res.data.data[index].resType !== "organization" &&
                  res.data.data[index].resType !== "door" &&
                  res.data.data[index].resType !== "vc") ||
                res.data.data[index].realType === "door_ipc"
              ) {
                delete res.data.data[index];
              } else {
                this.$set(res.data.data[index], "leaf", true);
                if (res.data.data[index].openFlag) {
                  this.$set(res.data.data[index], "leaf", false);
                }
              }
              if (res.data.data[index]) {
                resolvaArr.push(res.data.data[index]);
              }
            }
            resolve(resolvaArr);
            this.setTreeNodeStatus(resolvaArr);
            if (node.level === 0) {
              this.setDefaultSelectedKey2(res.data.data[0].id);
              resolvaArr.forEach((v, i) => {
                if (v.openFlag) {
                  this.setChild2(node.childNodes[i]);
                }
              });
            }
          }
        });
    },
    setTreeNodeStatus(dataArr) {
      if (!dataArr) {
        return;
      }
      setTimeout(() => {
        dataArr.forEach(v => {
          let isAddDiv = document.getElementById(v.id);
          let parentNode = isAddDiv.parentNode.parentNode.parentNode;
          if (isAddDiv.innerText === "0" && v.nodeType === "chnNode") {
            parentNode.style.background = "rgba(50,197,255,0.06)";
          } else {
            parentNode.style.background = "";
          }
        });
      }, 300);
    },
    setDefaultSelectedKey(id) {
      setTimeout(() => {
        this.$refs.orgTree.setCurrentKey(id);
        this.orgDefaultId = id;
        this.orgSetCommon(id);
      }, 200);
    },
    setDefaultSelectedKey2(id) {
      setTimeout(() => {
        this.$refs.devTree.setCurrentKey(id);
        this.resConfigDefaultId = id;
      }, 200);
    },
    handleNodeClick(obj, node, component) {
      this.orgSetCommon(obj.id);
      this.orgDefaultId = obj.id;
      this.orgName = obj.label;
    },
    handleNodeClick2(obj, node, component) {
      // if (obj.nodeType === "orgNode") {
      //   this.orgSetCommon(obj.id);
      //   this.resConfigDefaultId = obj.id;
      // }
    },
    orgSetCommon(id) {
      this.orgUuid = id;
      this.getMapInfo();
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
    setChild2(node) {
      this.$set(node, "loading", true);
      this.$mapConfigHttp
        .getResTree({
          mapUuid: this.mapUuid,
          viewType: "",
          treeStructure: "orgNode$device|chnNode",
          authEnable: false,
          parentUuid: node.data.id,
          parentType: node.data.nodeType,
          recursiveEnable: true
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
            let resolvaArr = [];
            for (let index in res.data.data) {
              if (
                (res.data.data[index].resType !== "organization" &&
                  res.data.data[index].resType !== "door" &&
                  res.data.data[index].resType !== "vc") ||
                res.data.data[index].realType === "door_ipc"
              ) {
                delete res.data.data[index];
              } else {
                this.$set(res.data.data[index], "leaf", true);
                if (res.data.data[index].openFlag) {
                  this.$set(res.data.data[index], "leaf", false);
                }
              }
              if (res.data.data[index]) {
                resolvaArr.push(res.data.data[index]);
              }
            }
            node.doCreateChildren(resolvaArr);
            this.defaultExpKeys2.push(node.data.id);
            this.setTreeNodeStatus(resolvaArr);
          }
        });
    },
    dragstart(ev, data) {
      if (!this.OwnAuthDisabled) {
        return;
      }
      ev.dataTransfer.setData("resData", JSON.stringify(data));
    },
    getMapInfo() {
      this.$mapConfigHttp
        .getMapInfo({
          orgUuid: this.orgUuid
        })
        .then(res => {
          this.getMapInfoSuccess(res.data);
        });
    },
    getMapInfoSuccess(body) {
      if (body.data) {
        this.$mapConfigHttp.setMapSysLog({
          logType: "config",
          moduleName: "地图配置",
          logEvent: "query",
          detail: "查看地图配置信息"
        });
        this.isSave = false;
        setTimeout(() => {
          this.isSave = true;
          this.$nextTick(() => {
            this.$refs.mapSave.orgUuid = this.orgUuid;
            this.$refs.mapSave.orgName = this.orgName;
            this.$refs.mapSave.saveMapData = body.data;
            this.mapUuid = body.data.mapUuid;
            this.isShowResTree = false;
            setTimeout(() => {
              this.isShowResTree = true;
            }, 200);
          });
        }, 200);
      } else {
        this.isSave = true;
        setTimeout(() => {
          this.isSave = false;
          this.$nextTick(() => {
            this.$refs.mapEdit.orgUuid = this.orgUuid;
            this.$refs.mapEdit.orgName = this.orgName;
            this.mapUuid = "";
            this.isShowResTree = false;
            setTimeout(() => {
              this.isShowResTree = true;
            }, 200);
          });
        }, 200);
      }
    },
    refreshMapPanelState() {
      this.getMapInfo();
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
          console.log("tree connect success: ");
          this.stompClient.subscribe(
            "/user/topic/map-1.7/client/device/organization/tree",
            greeting => {
              this.handleSubscribe(JSON.parse(greeting.body));
            }
          );
        },
        err => {
          console.log("tree error, errMsg: ", err);
        }
      );
      /* eslint-enable */
    },
    handleSubscribe(body) {
      console.log("tree Subscribe success: ", body);
      if (!body) {
        return;
      }
      if (this.isShowTopicFlag) {
        this.$cToast.success("设备树信息已变更");
      }
      if (body.changeType === "add") {
        this.treeChangeAdd(body.data);
      } else if (body.changeType === "update") {
        this.treeChangeUpdate(body.data);
      } else if (body.changeType === "delete") {
        this.treeChangeDelete(body.data);
      }
    },
    treeChangeAdd(data) {
      this.$set(data, "leaf", true);
      if (data.openFlag) {
        this.$set(data, "leaf", false);
      }
      if (this.$refs.orgTree.getNode(data.nodeNewParentUuid)) {
        this.$refs.orgTree.append(
          data,
          this.$refs.orgTree.getNode(data.nodeNewParentUuid)
        );
      }
      if (this.$refs.devTree.getNode(data.nodeNewParentUuid)) {
        this.$set(data, "addStatus", 0);
        this.$refs.devTree.append(
          data,
          this.$refs.devTree.getNode(data.nodeNewParentUuid)
        );
        this.setTreeNodeStatus([this.$refs.devTree.getNode(data.id).data]);
      }
    },
    treeChangeUpdate(data) {
      this.$set(data, "leaf", true);
      if (data.openFlag) {
        this.$set(data, "leaf", false);
      }
      if (this.$refs.orgTree.getNode(data.id)) {
        if (data.nodeNewParentUuid) {
          this.$refs.orgTree.remove(this.$refs.orgTree.getNode(data.id));
          this.$refs.orgTree.append(
            data,
            this.$refs.orgTree.getNode(data.nodeNewParentUuid)
          );
        } else {
          this.$refs.orgTree.getNode(data.id).data = this.$common.copyObject(
            data,
            this.$refs.orgTree.getNode(data.id).data
          );
        }
      }
      if (this.$refs.devTree.getNode(data.id)) {
        this.$set(
          data,
          "addStatus",
          this.$refs.devTree.getNode(data.id).data.addStatus
        );
        if (data.nodeNewParentUuid) {
          this.$refs.devTree.remove(this.$refs.devTree.getNode(data.id));
          this.$refs.devTree.append(
            data,
            this.$refs.devTree.getNode(data.nodeNewParentUuid)
          );
        } else {
          this.$refs.devTree.getNode(data.id).data = this.$common.copyObject(
            data,
            this.$refs.devTree.getNode(data.id).data
          );
        }
        this.setTreeNodeStatus([this.$refs.devTree.getNode(data.id).data]);
      }
    },
    treeChangeDelete(data) {
      this.$set(data, "leaf", true);
      if (data.openFlag) {
        this.$set(data, "leaf", false);
      }
      if (this.$refs.orgTree.getNode(data.id)) {
        this.$refs.orgTree.remove(this.$refs.orgTree.getNode(data.id));
        if (data.id === this.orgUuid && data.nodeNewParentUuid) {
          this.orgSetCommon(data.nodeNewParentUuid);
          this.setDefaultSelectedKey(data.nodeNewParentUuid);
        }
      }
      if (this.$refs.devTree.getNode(data.id)) {
        this.$refs.devTree.remove(this.$refs.devTree.getNode(data.id));
        if (data.nodeNewParentUuid) {
          this.setDefaultSelectedKey2(data.nodeNewParentUuid);
        }
      }
    },
    disConnectSocket() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        console.log("Disconnected");
      }
    },
    getIcon(isOnline, type) {
      let treeIcons = window.config.treeIcons || [],
        icon = "";
      for (let i = 0; i < treeIcons.length; i++) {
        if (treeIcons[i].value === type) {
          if (!isOnline) {
            icon = require(`@/assets/images/treeIcons/${treeIcons[i].icon}2.png`);
          } else {
            icon = require(`@/assets/images/treeIcons/${treeIcons[i].icon}.png`);
          }
          break;
        }
      }
      return icon;
    },
    registerEventbus() {
      this.$bus.$on("setTreeNode", params => {
        if (this.$refs.devTree.getNode(params.elementData.resourceUuid)) {
          let data = this.$refs.devTree.getNode(params.elementData.resourceUuid)
            .data;
          this.$set(data, "addStatus", params.addStatus);
          this.$refs.devTree.getNode(data.id).data = this.$common.copyObject(
            data,
            this.$refs.devTree.getNode(data.id).data
          );
          this.setTreeNodeStatus([this.$refs.devTree.getNode(data.id).data]);
        }
      });
    },
    unRegisterEventbus() {
      this.$bus.$off("setTreeNode");
    }
  },
  watch: {
    titleText(val) {
      this.$refs.orgTree.filter(val);
    },
    titleText2(val) {
      this.$refs.devTree.filter(val);
    }
  },
  deactivated() {
    this.isShowTopicFlag = false;
    this.unRegisterEventbus();
  },
  destroyed() {
    this.disConnectSocket();
  }
};
</script>

<style lang="scss">
.tree-panel {
  .el-input__prefix {
    position: absolute;
    left: 36px;
    top: 8px;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 28px;
  }
  .el-input--small .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: rgba(38, 211, 157, 0.2);
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.map-config {
  display: flex;
  width: 100%;
  height: 100%;
  .left-side {
    height: 100%;
    width: 220px;
    background: #1c1d20;
    display: flex;
    flex-direction: column;
    .side-menu {
      height: 50px;
      width: 100%;
      background: #202225;
      cursor: pointer;
      padding: 0px 15px;
      box-sizing: border-box;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #dddddd;
      display: flex;
      align-items: center;
      border: {
        width: 0px;
        style: solid;
        color: rgba($color: #ffffff, $alpha: 0.08);
      }
    }
    .tree-panel {
      height: calc(100% - 100px);
      width: 100%;
      overflow: auto;
      padding: 12px 0;
      box-sizing: border-box;
    }
  }
  .map-panel-side {
    width: calc(100% - 220px);
  }
  .tree-item {
    display: flex;
    align-items: center;
  }
}
</style>
