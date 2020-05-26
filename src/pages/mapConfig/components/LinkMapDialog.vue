<template>
  <el-dialog width="400px"
             title="添加链接地图"
             class="linkDialog"
             center
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <div class="content-item"
           style="margin-bottom: 15px;">
        <div class="text-title">选择地图： </div>
        <el-input v-model="orgName"
                  size="small"
                  readonly
                  v-popover:popover
                  style="width: 240px; margin-left: 10px;"
                  placeholder="请选择">
          <img slot="suffix"
               src="@/assets/images/map/drop_down.png">
        </el-input>
      </div>
      <div class="content-item">
        <div class="text-title">热图名称： </div>
        <el-input v-model="linkName"
                  size="small"
                  style="width: 240px; margin-left: 10px;">
        </el-input>
      </div>
      <el-popover ref="popover"
                  placement="bottom-start"
                  width="215"
                  popper-class="my-popover"
                  trigger="click">
        <el-tree :props="defaultProps"
                 node-key="id"
                 :indent="10"
                 lazy
                 v-if="isShowTree"
                 :load="loadNode"
                 ref="orgTree"
                 :highlight-current="true"
                 :expand-on-click-node="false"
                 @node-click="handleNodeClick">
          <div slot-scope="{ node }">
            <div class="text-show"
                 :style="`width: ${215 - 35 - 10 * node.level}px`"
                 :title='node.label'>{{node.label}}</div>
          </div>
        </el-tree>
      </el-popover>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="onClickConfirm"
                 size="small">确定</el-button>
      <el-button type="primary"
                 @click="onClickCancel"
                 size="small">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    orgUuid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isCurrentShow: false,
      orgName: "",
      linkName: "",
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      nodeObj: null,
      isShowTree: true,
      labelArr: [],
      linkAddress: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    resetData() {
      this.nodeObj = null;
      this.orgName = "";
      this.linkName = "";
    },
    onClickConfirm() {
      if (!this.orgName) {
        this.$cToast.warn("请选择地图");
        return;
      }
      if (!this.linkName) {
        this.$cToast.warn("请输入链接地图名称");
        return;
      }
      this.$emit("onConfirm", {
        nodeObj: this.nodeObj,
        linkName: this.linkName,
        linkAddress: this.linkAddress
      });
      this.resetData();
    },
    onClickCancel() {
      this.resetData();
      this.$emit("onCancel");
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
        this.linkName = "";
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
            this.linkName = "";
            this.nodeObj = null;
            this.$cToast.warn("该组织下无配置地图，不可链接");
          } else {
            this.orgName = obj.label;
            this.linkName = `热图--${obj.label}`;
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
    isShow(val) {
      this.isCurrentShow = val;
      this.isShowTree = val;
    }
  }
};
</script>
<style lang="scss">
.linkDialog {
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
<style lang="scss" scoped>
.dialog-content {
  padding: 2% 2% 0 2%;
  box-sizing: border-box;
}
.dialog-footer {
  padding: 0 0 4% 0;
  box-sizing: border-box;
}
.content-item {
  display: flex;
  align-items: center;
}
.text-title {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #dddddd;
  width: 80px;
  text-align: right;
}
</style>
