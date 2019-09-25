<template>
  <div class="left-tree">
    <div class="tree-input">
      <el-input placeholder="搜索期号／楼栋／单元"
                v-model="filterText"
                style="width: 90%">
        <img slot="prefix"
             :src="icons.search">
      </el-input>
      <img :src="icons.add"
           @click="onClickAdd"
           class="image">
    </div>
    <div class="i-tree">
      <el-scrollbar style="height: 98%;transition:0.2s;width: 240px;">
        <el-tree :data="treeData"
                 :props="defaultProps"
                 node-key="id"
                 :indent="10"
                 lazy
                 :load="loadNode"
                 ref="buildingTree"
                 :filter-node-method="filterNode"
                 :default-expanded-keys="defaultExpKeys"
                 :highlight-current="true"
                 :expand-on-click-node="false"
                 @node-click="handleNodeClick">
          <div class="i-tree-item"
               slot-scope="{ node, data }">
            <div class="i-tree-item-icon">
              <img :src="iconShow(node)"
                   width="10.9px"
                   height="9px"
                   style="margin-right: 4px;">
              <span class="text-show">{{node.label}}</span>
              <el-dropdown trigger="click"
                           class="action-icon"
                           @command="handleDropDownMenuClick"
                           placement="bottom">
                <div class="img-div"
                     @click.stop="onClickMore(node, data)">
                  <img :src="icons.more_action"
                       width="16px"
                       height="13px">
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add"
                                    v-if="!isDisableAdd">新增{{showType}}</el-dropdown-item>
                  <el-dropdown-item command="edit">修改名称</el-dropdown-item>
                  <el-dropdown-item command="moveUp"
                                    v-if="!isDisableMoveUp">上移</el-dropdown-item>
                  <el-dropdown-item command="moveDown"
                                    v-if="!isDisableMoveDown">下移</el-dropdown-item>
                  <el-dropdown-item command="copy" v-if="isShowCopy">复制</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import icons from "@/common/js/icon.js";

export default {
  components: {},
  props: {},
  data() {
    return {
      icons,
      initAreaData: null,
      filterText: "",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      currentNodeId: null,
      isExpanded: false,
      showType: "",
      currentNode: null,
      defaultExpKeys: [],
      infUuidArr: [],
      treeLevelRule: [],
      labelArr: [],
      upAddress: "",
      subType: "",
      isDisableMoveUp: false,
      isDisableMoveDown: false,
      isDisableAdd: false,
      lastLevelType: "",
      clickObj: {},
      isShowCopy: true
    };
  },
  created() {},
  mounted() {
    // this.initData();
  },
  methods: {
    initData() {
      if (!this.initAreaData) {
        return;
      }
      this.treeData = [
        {
          id: this.initAreaData.id,
          label: this.initAreaData.label,
          type: this.initAreaData.type,
          version: this.initAreaData.version,
          children: []
        }
      ];
      this.treeLevelRule = this.initAreaData.extInfo;
      this.getInfrastructure(this.initAreaData.id);
      this.setLastLevelType(this.initAreaData.extInfo);
    },
    setLastLevelType(data) {
      if (!data) {
        return;
      }
      for (let index in data) {
        if (parseInt(index) === data.length - 1) {
          this.lastLevelType = data[index].type;
        }
      }
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return;
      }
      if (this.initAreaData && node.data) {
        this.$houseHttp
          .getInfrastructure({
            parentUuid: node.data.id
          })
          .then(res => {
            if (!res.data.data) {
              resolve([]);
            } else {
              for (let item of res.data.data) {
                this.$set(item, "leaf", true);
                if (item.nextCount !== 0 && item.type !== this.lastLevelType) {
                  this.$set(item, "leaf", false);
                }
              }
              resolve(res.data.data);
            }
          });
      }
    },
    handleDefaultExpKeys() {
      if (this.treeData && this.treeData.length !== 0) {
        this.defaultExpKeys.push(this.treeData[0].id);
      }
    },
    getInfrastructure(parentUuid) {
      this.$houseHttp
        .getInfrastructure({
          parentUuid
        })
        .then(res => {
          let body = res.data;
          this.handleGetTreeSuccessResponse(body);
        });
    },
    handleGetTreeSuccessResponse(body) {
      if (body.data) {
        this.treeData[0].children = body.data;
        for (let item of this.treeData[0].children) {
          this.$set(item, "leaf", true);
          if (item.nextCount !== 0 && item.type !== this.lastLevelType) {
            this.$set(item, "leaf", false);
          }
        }
      }
      this.handleDefaultExpKeys();
      this.setDefaultSelectedKey(this.treeData[0].id);
    },
    setDefaultSelectedKey(id) {
      setTimeout(() => {
        this.$refs.buildingTree.setCurrentKey(id);
        this.$emit("setTreeRootData", this.treeData[0]);
        this.clickObj = this.$common.copyObject(this.treeData[0], this.clickObj);
      }, 200);
    },
    handleNodeClick(obj, node, component) {
      console.log(node);
      this.$emit("setTreeRootData", obj);
      this.clickObj = this.$common.copyObject(obj, this.clickObj);
      this.currentNode = node;
      // if (obj.nextCount !== 0 && obj.type !== this.lastLevelType) {
      //   this.expandedSet(node);
      // }
    },
    expandedSet(node) {
      if (this.currentNodeId && this.currentNodeId === node.id) {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded && node.level !== 1) {
          this.setChild(node);
        }
        this.$set(node, "expanded", this.isExpanded);
      } else {
        this.$set(node, "expanded", false);
        this.currentNodeId = node.id;
        this.isExpanded = false;
      }
    },
    setChild(node) {
      this.$set(node, "loading", true);
      this.$houseHttp
        .getInfrastructure({
          parentUuid: node.data.id
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
              if (item.nextCount !== 0 && item.type !== this.lastLevelType) {
                this.$set(item, "leaf", false);
              }
            }
            node.doCreateChildren(res.data.data);
          }
        });
      setTimeout(() => {
        this.$refs.buildingTree.setCurrentKey(this.clickObj.id);
        this.$emit("setTreeRootData", this.clickObj);
      }, 200);
    },
    refreshNode(param) {
      if (param === "init") {
        this.initData();
      } else {
        // if (!this.currentNode.expanded) {
        //   return;
        // }
        this.setChild(this.currentNode);
      }
    },
    refreshParentNode() {
      this.setChild(this.currentNode.parent);
    },
    onClickMore(node) {
      this.currentNode = node;
      this.resetData();
      this.judgeSubLevel(this.currentNode);
      this.getLabelArr(this.currentNode);
      this.getUpAddress(this.labelArr);
      this.isDisableMoveButton(this.currentNode);
    },
    resetData() {
      this.labelArr = [];
      this.upAddress = "";
      this.isDisableAdd = false;
      this.isDisableMoveUp = false;
      this.isDisableMoveDown = false;
    },
    judgeSubLevel(node) {
      if (!node || !this.treeLevelRule || this.treeLevelRule.length === 0) {
        return;
      }
      let subLevel;
      for (let item of this.treeLevelRule) {
        if (node.level === parseInt(item.level)) {
          subLevel = parseInt(item.level) + 1;
        }
      }
      for (let item of this.treeLevelRule) {
        if (subLevel === parseInt(item.level)) {
          this.showType = item.showType;
          this.subType = item.type;
        }
      }
      if (!this.treeLevelRule.some(v => parseInt(v.level) === subLevel)) {
        this.isDisableAdd = true;
      }
    },
    getLabelArr(node) {
      if (!node) {
        if (this.labelArr.length !== 0) {
          this.labelArr.pop();
        }
        return;
      }
      this.labelArr.push(node.data.label);
      this.getLabelArr(node.parent);
    },
    getUpAddress(labelArr) {
      if (!this.labelArr || this.labelArr.length === 0) {
        return;
      }
      if (!this.upAddress) {
        this.upAddress = this.labelArr.pop();
      } else {
        this.upAddress = `${this.upAddress}／${this.labelArr.pop()}`;
      }
      this.getUpAddress(this.labelArr);
    },
    isDisableMoveButton(node) {
      if (node.parent.childNodes.length <= 1) {
        this.isDisableMoveUp = true;
        this.isDisableMoveDown = true;
      } else if (this.getNodeIndex(node) === 0) {
        this.isDisableMoveUp = true;
        this.isDisableMoveDown = false;
      } else if (
        this.getNodeIndex(node) ===
        node.parent.childNodes.length - 1
      ) {
        this.isDisableMoveUp = false;
        this.isDisableMoveDown = true;
      } else {
        this.isDisableMoveUp = false;
        this.isDisableMoveDown = false;
      }
      if (node.data.type === "infrastructure") {
        this.isShowCopy = false;
      } else {
        this.isShowCopy = true;
      }
    },
    getNodeIndex(node) {
      if (node.parent.childNodes.length === 0) {
        return 0;
      }
      let index = 0;
      for (let index2 in node.parent.childNodes) {
        if (node.id === node.parent.childNodes[index2].id) {
          index = parseInt(index2);
        }
      }
      return index;
    },
    onClickAdd() {
      this.$emit("onClickAllTypeAdd");
    },
    handleDropDownMenuClick(index) {
      switch (index) {
        case "add":
          this.$emit("add", {
            upAddress: this.upAddress,
            node: this.currentNode,
            showType: this.showType,
            subType: this.subType
          });
          break;
        case "edit":
          this.$emit("edit", {
            upAddress: this.upAddress,
            node: this.currentNode,
            showType: this.showType,
            subType: this.subType
          });
          break;
        case "moveUp":
          this.moveInfrastructure("up");
          break;
        case "moveDown":
          this.moveInfrastructure("down");
          break;
        case "copy":
          this.copyInfrastructure();
          break;
        case "delete":
          this.deleteInfrastructure();
          break;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    iconShow(node) {
      let icon = "";
      if (!node) {
        icon = require("@/assets/images/building/area.png");
      } else {
        let type = node.data.type;
        if (type === "infrastructure") {
          type = "area";
        }
        icon = require(`@/assets/images/building/${type}.png`);
      }
      return icon;
    },
    deleteInfrastructure() {
      this.$houseHttp
        .deleteInfrastructure({
          infrastructureType: this.currentNode.data.type,
          infrastructureUuid: this.currentNode.data.id
        })
        .then(res => {
          let body = res.data;
          this.deleteInfrastructureSuccessResponse(body);
        });
    },
    deleteInfrastructureSuccessResponse(body) {
      if (!body.data) {
        this.$cToast.success(body.msg);
        this.refreshParentNode();
      } else {
        this.$cToast.warn(body.data);
      }
      if (this.currentNode.data.type === "area") {
        this.$emit("setInitArea");
      }
    },
    moveInfrastructure(direaction) {
      this.$houseHttp
        .moveInfrastructure({
          beforeUuid: this.getBeforeUuid(this.currentNode, direaction),
          fromUuid: this.currentNode.parent.data.id,
          myUuid: this.currentNode.data.id,
          toUuid: this.currentNode.parent.data.id
        })
        .then(res => {
          let body = res.data;
          this.moveInfrastructureSuccessResponse(body);
        });
    },
    moveInfrastructureSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.refreshParentNode();
    },
    getBeforeUuid(node, direaction) {
      let id = null;
      for (let index in node.parent.childNodes) {
        if (node.id === node.parent.childNodes[index].id) {
          if (direaction === "up" && parseInt(index) - 2 >= 0) {
            id = node.parent.childNodes[parseInt(index) - 2].data.id;
          } else if (direaction === "down") {
            id = node.parent.childNodes[parseInt(index) + 1].data.id;
          }
        }
      }
      return id;
    },
    getCopyName(label, index) {
      label = `${this.currentNode.data.label}(${index})`;
      if (!this.currentNode.parent.childNodes.some((v) => v.data.label === label)) {
        return label;
      }
      return this.getCopyName(label, index + 1);
    },
    copyInfrastructure() {
      let copyName = this.getCopyName(this.currentNode.data.label, 1);
      this.$houseHttp
        .copyInfrastructure({
          infrastructureUuid: this.currentNode.data.id,
          infrastructureName: copyName
        })
        .then(res => {
          let body = res.data;
          this.copyInfrastructureSuccessResponse(body);
        });
    },
    copyInfrastructureSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.refreshParentNode();
    },
  },
  watch: {
    filterText(val) {
      this.$refs.buildingTree.filter(val);
    },
    initAreaData: {
      handler(val) {
        this.initData();
      },
      deep: true
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.left-tree {
  .el-input__prefix {
    position: absolute;
    left: 36px;
    top: 7px;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 28px;
  }
  .el-tree {
    background: rgba($color: #212326, $alpha: 1);
  }
  .el-tree-node__content {
    .action-icon {
      height: 0px !important;
      .img-div {
        display: none;
      }
    }
    &:hover {
      .action-icon {
        height: 32px !important;
        line-height: 32px !important;
        .img-div {
          display: block;
        }
      }
    }
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.left-tree {
  // width: 15%;
  width:300px;
  height: 100%;
  background: rgba($color: #232629, $alpha: 0.8);
  padding: 0 1%;
  box-sizing: border-box;
  .tree-input {
    height: 100px;
    border-bottom: 1px solid rgba($color: #ffffff, $alpha: 0.08);
    display: flex;
    align-items: center;
    .image {
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .i-tree {
    height: 85%;
    padding: 20px 0 0 0;
    box-sizing: border-box;
    overflow-x: auto;
    .i-tree-item {
      width: 200px;
      .i-tree-item-icon {
        display: flex;
        align-items: center;
        .action-icon {
          margin-left: auto;
          margin-right: 5px;
          .img-div {
            cursor: pointer;
            height: 32px;
            line-height: 32px;
          }
        }
      }
    }
  }
}
</style>
