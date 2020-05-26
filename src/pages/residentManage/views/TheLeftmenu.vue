<template>
  <div id="ResdientLeftMenu"
       class="leftmenu">
    <div class="searchWrap">
      <el-input placeholder="搜索组织/标签/名称"
                v-model="searchText">
        <img slot="prefix"
             class="image"
             :src="icons.search"
             alt />
      </el-input>
    </div>
    <el-tabs v-model="activeName"
             class="tabs">
      <el-tab-pane label="楼栋房屋"
                   name="first">
        <div class="i-tree">
          <el-tree :data="AreaTreeData"
                   node-key="id"
                   :props="AreaProps"
                   ref="ResidentTree"
                   :filter-node-method="filterNode"
                   default-expand-all
                   @node-click="handleNodeClick"
                   :expand-on-click-node="false">
            <div class="i-tree-item"
                 style="width:100%;"
                 slot-scope="{ node, data }">
              <div v-if="node.data.myChildren">
                <el-popover placement="right-start"
                            trigger="hover"
                            popper-class="RLMPopverClass"
                            @show="showHoverMenu(node)">
                  <el-card class="RLMBoxCard">
                    <div slot="header"
                         class="clearfix">
                      <div style="padding-left:10px;border-left: 4px solid #26D39D;">{{upAddress}}</div>
                    </div>
                    <div v-for="(o , index) in node.data.myChildren"
                         :key="index"
                         class="card-item-box">
                      <div v-if="o.label">
                        <img :src="icons.ceng"
                             class="cengIcon"
                             alt />
                        <a class="text-item-Title textClips bigText"
                           href="#"
                           @click="clickHoverMenu(node,o)">{{ o.label }}</a>
                      </div>
                      <div class="text-item-box"
                           v-for="(item , i) in o.house"
                           :key="i">
                        <a class="text-item-Title textClips bigText2"
                           href="#"
                           @click="clickHoverMenu(node,item,o)">{{item.label}}</a>
                      </div>
                    </div>
                  </el-card>
                  <div class="i-tree-item-icon"
                       slot="reference">
                    <img :src="iconShow(node)"
                         width="10.9px"
                         height="9px"
                         style="margin-right: 4px;" />
                    <span class="text-show">{{node.label}}</span>
                  </div>
                </el-popover>
              </div>
              <div v-else
                   class="i-tree-item-icon flex-sbt">
                <div class="text-show"
                     style="width: 100px;"
                     :title="node.label">
                  <!-- isHaveChild表示展开项目，有没有根节点 -->
                  <!-- 有三角箭头的需要是项目结构 -->
                  <!-- 或者不是组织节点并且有nextCount -->
                  <span v-if="((data.type=='project'&& !data.isHaveRoot )||(data.type!='areaOrg'&&data.nextCount))&&!(data.children&&data.children.length)"
                        @click.stop="getProjectChildTree(node,data)"
                        class="my-el-tree-node-icon el-tree-node__expand-icon el-icon-caret-right"></span>
                  <img v-if="data.type === 'project'"
                       src="@/assets/icon/area_tree_last_node.png"
                       style="margin-right:3px"
                       alt="">
                  <img v-else
                       src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAJCAYAAADkZNYtAAAAAXNSR0IArs4c6QAAAFJJREFUGBljXLVq1WUGBgYdIAYDRkbGef///88JCwv7DhOD0YxAxf9hHCT6HVDTZyQ+A9CAKyzIAkhsIaCkEBIfxJRnQhPAyx2qiq/g9RVC8goA5EYWrRlv3uIAAAAASUVORK5CYII="
                       width="10.9px"
                       height="9px"
                       style="margin-right: 4px;" />{{node.label}}</div>
              </div>
            </div>
          </el-tree>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import TreeAppendChildDialog from "@/common/TreeAppendChildDialog";
import TreeChangeNameDialog from "@/common/TreeChangeNameDialog";
import ConfirmDialog from "@/common/ConfirmDialog";
import * as api from "@/pages/equipmentMange/ajax.js";
import { mapState } from "vuex";
import icons from "@/common/icon.js";
export default {
  name: "leftmenu",
  components: {
    TreeAppendChildDialog,
    TreeChangeNameDialog,
    ConfirmDialog
  },
  props: {
    ShowAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    OwnAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      lastLevelType: "",
      isDeleteVisible: false,
      treeName: "ResidentTree",
      activeName: "first",
      icons,
      searchText: "", // 搜索框的文本
      node: "", // 用于存储当前的操作的节点
      nodeValue: "", // 值
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      AreaProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      labelArr: [],
      upAddress: "",
      defaultExpandedKeys: [],
      currentNode: {},
      isExpanded: false,
      orgType: "organization.device",
      tagType: "resident",
      newTagName: "",
      appendNodeOptions: [],
      residentTagType: "resident",
      AreaTreeData: [],
      defaultAreaExpKeys: [],
      defaultAreaExpandedKeys: []
    };
  },
  mounted() {},
  activated() {
    setTimeout(() => {
      let projectType = this.$store.state.home.projectType || {};
      if (projectType.platformLevel !== "levelOne") {
        this.getAreaData(true);
      }
    }, 0);
  },
  computed: {
    ...mapState({})
  },
  methods: {
    getProjectChildTree(node, data) {
      if (!data.children) {
        this.$set(data, "children", []);
      }
      if (data.type === "project") {
        data.projectUuid = data.id;
        this.initData(data);
      } else {
        this.loadNode(node, data);
      }
    },

    handleNodeClick(data, node, component) {
      console.log(data);
      // 判断非区域组织节点击
      if (data.type !== "areaOrg" && data.type !== "project") {
        this.handleOneProjectNodeClick(data, node);
      } else if (data.type === "project") {
        // 获取子项目基建结构事件
        if (!data.children) {
          this.$set(data, "children", []);
        }
        data.projectUuid = data.id;
        // this.initData(data);
      } else {
        // 点击区域组织节点
        console.log("点击区域组织节点");
      }
    },
    // 点击子项目节点响应事件
    handleOneProjectNodeClick(data, node) {
      this.resetData();
      this.getLabelArr(node);
      this.getUpAddress(this.labelArr);
      data.name = this.upAddress;
      this.$store.commit("SET_LEFT_MENU_Data", data);
      this.appendNodeOptions = data.children;
      if (this.currentNode && this.currentNode === node) {
        if (this.isExpanded && node.level !== 1) {
          this.defaultExpandedKeys.push(data.id);
        } else {
          var index = this.defaultExpandedKeys.indexOf(node.data.id);
          this.defaultExpandedKeys.splice(index, 1);
        }
      } else {
        this.currentNode = node;
      }
    },
    getAreaData() {
      api
        .getAreaAllOrg({
          // parentOrgUuid: this.parentOrgUuid,
          orgType: "areaOrg"
        })
        .then(res => {
          let result = res.data.data || [];
          let firstPrjectRoot = this.findFirstProject(result);
          this.getProjectChildTree(firstPrjectRoot, firstPrjectRoot);
          this.AreaTreeData = result;
        });
    },
    // 遍历查找第一个项目
    findFirstProject(dataArr) {
      dataArr = dataArr || [];
      let firstObj = null;
      for (let i = 0, len = dataArr.length; i < len; i++) {
        const obj = dataArr[i];
        if (obj.type === "project") {
          return obj;
        } else {
          if (obj.children) {
            firstObj = this.findFirstProject(obj.children);
            if (firstObj !== null) return firstObj;
          }
        }
      }
      return firstObj;
    },
    clickHoverMenu(node, subItem, item) {
      // 加载projectUuid
      var name = subItem.label;
      if (item && item.label) {
        name = item.label + "／" + name;
        subItem.projectUuid = item.projectUuid;
      }
      subItem.name = this.upAddress + "／" + name;
      this.$store.commit("SET_LEFT_MENU_Data", subItem);
      console.log(this.$refs.ResidentTree.getCheckedKeys());
      this.$refs.ResidentTree.setCurrentKey(node.data.id);
    },
    // 根据点击树节点的id获取当前节点的字节
    loadNode(node, data, parentData) {
      this.$ResidentManageAjax
        .getResidentLeftMenuSubDataApi({
          id: data.id,
          projectUuid: data.projectUuid
        })
        .then(res => {
          console.log(res.data.data);
          let newData = res.data.data;
          for (let item of newData) {
            if (
              item.nodeType === "area" ||
              item.nodeType === "phase" ||
              item.nodeType === "unit" ||
              item.nodeType === "building"
            ) {
              this.$set(item, "leaf", true);
              this.$set(item, "projectUuid", data.projectUuid);

              if (item.nextCount !== 0) {
                this.$set(item, "leaf", false);
              } else {
                this.getFloorAndHouse(item);
              }
            } else {
              this.$set(item, "leaf", false);
              break;
            }
          }
          if (parentData) {
            parentData.children.push(...(newData || []));
          } else {
            data.children.push(...(newData || []));
          }
          // data.$set("children", newData);
        });
    },
    getFloorAndHouse(item) {
      this.$ResidentManageAjax
        .getFloorAndHouse({
          id: item.id,
          projectUuid: item.projectUuid
        })
        .then(res => {
          if (res.data.data && res.data.data.length) {
            let data = (res.data.data || []).map(im => {
              im.projectUuid = item.projectUuid;
              return im;
            });
            this.$set(item, "myChildren", data);
          }
        });
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
    showHoverMenu(node) {
      this.resetData();
      this.getLabelArr(node);
      this.getUpAddress(this.labelArr);
    },
    // 初始化刷新树的结构
    initData(data) {
      this.$ResidentManageAjax.getResidentTreeDataApi(data).then(res => {
        console.log(res.data);
        if (res.data.success && res.data.data) {
          let newData = {
            id: res.data.data.id,
            label: res.data.data.label,
            projectUuid: data.projectUuid,
            type: res.data.data.type,
            children: [],
            nextCount: 1
          };

          // newArr.push(newData || []);
          // data.children.push(...(newArr || []));
          this.loadNode({}, newData, data);
          if (!newData.length) {
            this.$set(data, "isHaveChild", true);
          }
          this.defaultExpandedKeys.push(newData.id);
          this.appendNodeOptions = [];
          this.appendNodeOptions.push(newData);
          let checkedData = newData;
          checkedData.name = checkedData.label;
          this.setLastLevelType(newData.extInfo);
          this.$store.commit("SET_LEFT_MENU_Data", checkedData);
        } else {
          this.$message({
            type: "warning",
            message: "没有获取到居民基建树"
          });
          if (data.type === "project") {
            this.$set(data, "isHaveRoot", true);
          }
        }
      });
    },
    iconShow(node) {
      let icon = "";
      if (!node) {
        icon = require("@/assets/images/building/area.png");
      } else {
        let type = node.data.nodeType;
        if (type === "infrastructure") {
          type = "area";
        } else if (type === "house") {
          icon = icons.folder;
          return icon;
        }
        icon = require(`@/assets/images/building/${type}.png`);
      }
      return icon;
    },
    resetData() {
      this.labelArr = [];
      this.upAddress = "";
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
    handleDefaultExpKeys() {
      if (this.data && this.data.length !== 0) {
        this.defaultExpandedKeys.push(this.data[0].id);
      }
    },
    setChild(node) {
      this.$set(node, "loading", true);
      this.$ResidentManageAjax
        .getResidentTreeNodeDataApi(node.data.id)
        .then(res => {
          this.$set(node, "loading", false);
          this.$set(node, "loaded", true);
          if (!res.data.data) {
            this.$set(node, "isLeaf", true);
          } else {
            this.$set(node.data, "children", []);
            this.$set(node, "childNodes", []);
            node.doCreateChildren(res.data.data);
          }
        });
    },
    filterNode(obj, data) {
      if (data.label.indexOf(obj) !== -1) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    searchText(val) {
      this.$refs[this.treeName].filter(this.searchText);
    },
    appendNodeOptions(sliblings) {
      if (sliblings === this.appendNodeOptions) return;
      let arr = [];
      for (let i = 0, len = sliblings.length; i < len; i++) {
        arr.push({
          label: sliblings[i].label,
          value: sliblings[i].rankOrder
        });
      }
      this.appendNodeOptions = arr;
    }
  }
};
</script>
<style lang="scss">
@import "@/style/variables.scss";
.RLMPopverClass {
  max-width: calc(100% - 500px);
  max-height: 80%;
  overflow: auto;
}
#ResdientLeftMenu {
  .el-tabs__content {
    overflow-y: auto;
    position: relative;
    height: calc(100% - 80px);
  }
  .flex-sbt {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .el-tabs__item {
    color: #dddddd;
  }
  .el-tabs__nav-wrap::after {
    background: rgb(131, 131, 131);
  }
  .is-active {
    color: $add-text-color;
  }
  .el-input__prefix {
    position: absolute;
    left: 43px;
    top: 9px;
  }
  .el-input__prefix {
    position: absolute;
    left: 43px;
    top: 5px;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 40px;
  }
  .el-tree {
    // background: rgba($color: #212326, $alpha: 1);
    background: transparent;
  }
  .el-tree-node__content {
    .action-icon {
      display: none;
    }
    &:hover {
      .action-icon {
        display: block;
      }
    }
  }
  .el-tree-node__expand-icon.is-leaf {
    color: transparent;
    cursor: default;
    width: 0;
  }
  .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 6px 3px 6px 0px;
  }
  .text-show .my-el-tree-node-icon {
    padding: 6px 0;
    margin-left: -2px;
  }
}
.RLMBoxCard .el-card__header {
  padding: 10px 0px;
  margin: 0 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.card-item-box {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
}
.text-item-box a {
  margin-right: 15px;
}
.text-item-Title {
  margin-right: 30px;
}
.leftmenu .textClips {
  font-family: "PingFangSC-Regular";
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1; /*3表示只显示3行*/
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  transform-origin: center center;
  transition: all 0.2s;
  cursor: pointer;
  color: #dddddd !important;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer !important;
}
.cengIcon {
  width: 14px;
  height: 13px;
  vertical-align: middle;
  margin: 3px 5px 0px;
}
.bigText:active {
  transform: scale(1.5, 1.5);
}
.bigText2:active {
  transform: scale(3.5, 3.5);
}
.bigText2:hover {
  transform: scale(3.5, 3.5);
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.RLMBoxCard {
  margin-top: 20px;
  background-color: transparent;
  color: #dddddd;
  border: none;
  width: 100%;
  overflow: auto;
}
.leftmenu {
  width: $equLeftMenuWidth;
  box-sizing: border-box;
  height: 100%;
  background-color: rgba(37, 41, 45, 0.8);
  $iconWidth: 40px;
  .changeTagBox {
    color: #dddddd;
    text-align: center;
    margin: 30px 0 10px;
    .el-input {
      width: 50%;
      text-align: left;
    }
  }
  .searchWrap {
    padding: 25px 26px 10px;
    .el-input {
      position: relative;
      width: calc(100% - #{$iconWidth});
    }
    $addIconWidth: 14px;
    img {
      display: inline-block;
      vertical-align: middle;
      width: $addIconWidth;
      margin-left: 4px;
      cursor: pointer;
    }
  }
  .tabs {
    padding: 0px 26px 25px;
    height: calc(100% - 80px);
  }
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
    // padding: 20px 0;
    box-sizing: border-box;
    overflow: auto;
    height: 100%;
    .i-tree-item {
      width: 100%;
      .i-tree-item-icon {
        display: flex;
        align-items: center;
        // position: relative;
        .action-icon {
          margin-left: auto;
          margin-right: 10px;
          cursor: pointer;
        }
      }
    }
  }
  .changeTagBox {
    color: #dddddd;
    text-align: center;
    margin: 30px 0 10px;
    .el-input {
      width: 50%;
      text-align: left;
    }
  }
  .searchWrap {
    padding: 25px 26px 10px;
    .el-input {
      position: relative;
      width: calc(100% - #{$iconWidth});
    }
    $addIconWidth: 14px;
    img {
      display: inline-block;
      vertical-align: middle;
      width: $addIconWidth;
      margin-left: 4px;
      cursor: pointer;
    }
  }
  .tabs {
    padding: 0px 26px 25px;
  }
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
    padding: 0px 0 20px;
    box-sizing: border-box;
    .i-tree-item {
      width: 100%;
      .i-tree-item-icon {
        display: flex;
        align-items: center;
        // position: relative;
        .action-icon {
          margin-left: auto;
          margin-right: 10px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
