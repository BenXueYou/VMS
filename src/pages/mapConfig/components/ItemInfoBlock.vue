<template>
  <div class="info-block"
       :style="`top: ${blockTop}px; left: ${blockLeft}px`">
    <div class="item-block">
      <div class="item-container">
        <img :src="data.channelInfo && data.channelInfo.channelUrl ? data.channelInfo.channelUrl : require('@/assets/images/map/camera_dev.png')"
             height="148px"
             width="148px">
        <div class="info-detail">
          <div class="detail-item"
               v-if="data.secondType === 'link'">
            <div class="detail-text">链接地图：</div>
            <div v-if="!isEdit"
                 class="info-text"
                 :title="data.name ? data.name : ''">{{data.itemInfo && data.itemInfo.nodeObj ? data.itemInfo.nodeObj.label : ""}}</div>
            <el-input v-model="orgName"
                      v-if="isEdit"
                      size="mini"
                      readonly
                      v-popover:popover
                      style="width:140px;"
                      placeholder="请选择">
              <img slot="suffix"
                   src="@/assets/images/map/drop_down.png">
            </el-input>
            <el-popover ref="popover"
                        placement="bottom-start"
                        width="140"
                        v-if="isEdit"
                        popper-class="my-popover"
                        trigger="click">
              <el-tree :props="defaultProps"
                       node-key="id"
                       :indent="10"
                       lazy
                       :load="loadNode"
                       ref="orgTree"
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
          <div class="detail-item">
            <div class="detail-text">{{data.secondType === 'link' ? "热图名称" : "通道名称"}}：</div>
            <div v-if="data.secondType !== 'link'"
                 class="info-text"
                 :title="data.name ? data.name : ''">{{data.name ? data.name : ""}}</div>
            <div v-if="data.secondType === 'link' && !isEdit"
                 class="info-text"
                 :title="data.name ? data.name : ''">{{data.name ? data.name : ""}}</div>
            <el-input v-model="linkName"
                      v-if="isEdit && data.secondType === 'link'"
                      size="mini"
                      style="width:140px;"></el-input>
          </div>
          <div class="detail-item">
            <div class="detail-text">{{mapType === 'gis' ? '经度' : 'Y'}}：</div>
            <div v-if="!isEdit && mapType === 'gis'"
                 class="info-text">{{data.point.lng ? data.point.lng : ""}}</div>
            <div v-if="!isEdit && mapType === 'picture'"
                 class="info-text">{{data.point.y ? data.point.y : ""}}</div>
            <el-input v-model="elementPointY"
                      v-if="isEdit"
                      size="mini"
                      style="width:140px;"></el-input>
          </div>
          <div class="detail-item">
            <div class="detail-text">{{mapType === 'gis' ? '纬度' : 'X'}}：</div>
            <div v-if="!isEdit && mapType === 'gis'"
                 class="info-text">{{data.point.lat ? data.point.lat : ""}}</div>
            <div v-if="!isEdit && mapType === 'picture'"
                 class="info-text">{{data.point.x ? data.point.x : ""}}</div>
            <el-input v-model="elementPointX"
                      size="mini"
                      style="width:140px;"
                      v-if="isEdit"></el-input>
          </div>
          <div class="detail-item"
               v-if="data.secondType === 'vc'">
            <div class="detail-text">视角：</div>
            <el-switch v-model="isShowSector"
                       active-color="rgba(32,204,150,0.2)"
                       inactive-color="rgba(255,255,255,0.2)"
                       :active-value="1"
                       :inactive-value="0"
                       :disabled="!isEdit"></el-switch>
          </div>
          <div class="detail-button">
            <el-button type="text"
                       size='mini'
                       @click="edit"
                       :disabled="!OwnAuthDisabled"
                       v-if="!isEdit">
              修改
            </el-button>
            <el-button type="text"
                       size='mini'
                       :disabled="!OwnAuthDisabled"
                       @click="confirm"
                       v-if="isEdit">
              确认
            </el-button>
            <el-button type="text"
                       size='mini'
                       :disabled="!OwnAuthDisabled"
                       @click="cancel"
                       v-if="isEdit">
              取消
            </el-button>
          </div>
        </div>
      </div>
      <img src="@/assets/images/map/close.png"
           class="block-close"
           width="11px"
           @click="closeBlock">
      <div class="block-arrow"></div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    blockTop: {
      type: Number,
      default: 0
    },
    blockLeft: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    },
    mapType: {
      type: String,
      default: "gis"
    },
    orgUuid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      elementPointX: "",
      elementPointY: "",
      isShowSector: 0,
      isEdit: false,
      item: null,
      linkName: "",
      orgName: "",
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      nodeObj: null,
      labelArr: [],
      linkAddress: "",
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  activated() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("地图配置", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("地图配置", "isOwn");
  },
  methods: {
    setInfo() {
      this.item = this.$common.copyObject(this.data, this.item);
      if (this.mapType === "gis") {
        this.elementPointX = this.data.point.lat;
        this.elementPointY = this.data.point.lng;
      } else {
        this.elementPointX = this.data.point.x;
        this.elementPointY = this.data.point.y;
      }
      this.isShowSector =
        this.data.itemInfo && this.data.itemInfo.isShowSector
          ? this.data.itemInfo.isShowSector
          : 0;
      if (this.data.secondType === "link") {
        this.linkName = this.data.name;
        this.orgName = this.data.itemInfo.nodeObj.label;
      }
    },
    edit() {
      this.setInfo();
      this.isEdit = true;
    },
    confirm() {
      let data = {
        item: this.item,
        elementPointX: this.elementPointX.toString(),
        elementPointY: this.elementPointY.toString(),
        isShowSector: this.isShowSector
      };
      if (this.data.secondType === "link") {
        data.linkName = this.linkName;
        data.nodeObj = {};
        data.nodeObj = this.$common.copyObject(this.nodeObj, data.nodeObj);
        data.linkAddress = this.linkAddress;
      }
      this.$emit("confirmEditInfo", data);
      this.isEdit = false;
    },
    cancel() {
      this.setInfo();
      this.isEdit = false;
    },
    closeBlock() {
      this.$emit("closeBlock");
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
          }
        });
    },
    handleNodeClick(obj, node, component) {
      if (obj.id === this.orgUuid) {
        this.orgName = "";
        this.nodeObj = null;
        this.$cToast.warn("不可链接当前组织");
        return;
      }
      this.$mapConfigHttp
        .getMapInfo({
          orgUuid: obj.id
        })
        .then(res => {
          if (!res.data || !res.data.data) {
            this.orgName = "";
            this.nodeObj = null;
            this.$cToast.warn("该组织下无配置地图，不可链接");
          } else {
            this.orgName = obj.label;
            this.nodeObj = this.$common.copyObject(obj, this.nodeObj);
            this.labelArr = [];
            this.linkAddress = "";
            this.getLabelArr(node);
            this.getUpAddress(this.labelArr);
          }
        });
    },
    getLabelArr(node) {
      if (!node.data) {
        return;
      }
      this.labelArr.push(node.data.label);
      this.getLabelArr(node.parent);
    },
    getUpAddress(labelArr) {
      if (!this.labelArr || this.labelArr.length === 0) {
        return;
      }
      if (!this.linkAddress) {
        this.linkAddress = this.labelArr.pop();
      } else {
        this.linkAddress = `${this.linkAddress}／${this.labelArr.pop()}`;
      }
      this.getUpAddress(this.labelArr);
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.setInfo();
      },
      deep: true
    }
  },
  deactivated() {},
  destroyed() {}
};
</script>

<style lang="scss">
.info-block {
  .el-input__suffix {
    position: absolute;
    right: 10px;
    top: 5px;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 28px;
  }
  .el-input--small .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
}
.my-popover {
  height: 200px !important;
  overflow: auto;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.info-block {
  position: absolute;
  z-index: 1009;
  .item-block {
    position: relative;
    .item-container {
      width: 410px;
      height: 180px;
      background: #2a2e31;
      box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.5);
      border-radius: 2px;
      padding: 16px;
      box-sizing: border-box;
      display: flex;
      .info-detail {
        height: 100%;
        margin-left: 17px;
        display: flex;
        height: 130px;
        flex-direction: column;
        justify-content: space-around;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #dddddd;
        position: relative;
        .detail-item {
          display: flex;
          width: 200px;
          // overflow: hidden;
          // text-overflow: ellipsis;
          white-space: nowrap;
          align-items: center;
          .detail-text {
            width: 65px;
            text-align: right;
            margin-right: 10px;
          }
          .info-text {
            width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .detail-button {
          position: absolute;
          bottom: -25px;
          right: -5px;
        }
      }
    }
    .block-close {
      position: absolute;
      top: 12px;
      right: 12px;
      cursor: pointer;
    }
    .block-arrow {
      position: absolute;
      top: 180px;
      left: 30px;
      height: 0;
      width: 0;
      overflow: hidden;
      font-size: 0;
      line-height: 0;
      border-color: #2a2e31 transparent transparent transparent;
      border-style: solid dashed dashed dashed;
      border-width: 27px 27px 0 0;
    }
  }
}
</style>
