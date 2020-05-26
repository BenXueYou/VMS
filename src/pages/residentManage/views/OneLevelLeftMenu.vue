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
      <img @click="addTagClick"
           v-if="this.treeName !=='tree1'"
           :src="icons.add"
           alt />
    </div>
    <el-tabs v-model="activeName"
             class="tabs"
             @tab-click="handleClick">
      <el-tab-pane label="楼栋房屋"
                   name="first">
        <div class="i-tree">
          <el-tree :data="data"
                   :props="defaultProps"
                   node-key="id"
                   :indent="10"
                   ref="tree1"
                   lazy
                   :load="loadNode"
                   :filter-node-method="filterNode"
                   :highlight-current="true"
                   :expand-on-click-node="false"
                   :default-expanded-keys="defaultExpandedKeys"
                   @node-click="handleNodeClick">
            <div class="custom-tree-node i-tree-item"
                 slot-scope="{ node }">
              <div v-if="node.data.myChildren">
                <el-popover placement="right-start"
                            trigger="hover"
                            @show="showHoverMenu(node)">
                  <el-card class="ResidentBoxCard">
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
              <div v-else>
                <div class="i-tree-item-icon">
                  <img :src="iconShow(node)"
                       width="10.9px"
                       height="9px"
                       style="margin-right: 4px;" />
                  <!-- <img :src="icons.folder" width="16px" height="13px" style="margin-right: 4px;"> -->
                  <span class="text-show">{{node.label}}</span>
                </div>
              </div>
            </div>
          </el-tree>
        </div>
      </el-tab-pane>
      <el-tab-pane label="标签"
                   name="second">
        <gt-tree title="修改标签"
                 ref="tree2"
                 class="tree"
                 @clickmenu="clickmenu2"
                 @exportData="exportData2"
                 :initdata="data2"></gt-tree>
      </el-tab-pane>
    </el-tabs>

    <tree-append-child-dialog :options="appendNodeOptions"
                              @confirm="addchildren"
                              :visible.sync="appendChildrenDialogVisible"></tree-append-child-dialog>

    <tree-change-name-dialog @confirm="changeName"
                             :value="nodeValue"
                             title="修改标签"
                             :visible.sync="changeNameDialogVisible"></tree-change-name-dialog>

    <el-dialog class="tagDialogBox"
               title="新增标签"
               :visible.sync="addTagDialogVisible"
               width="25%"
               center>
      <div class="changeTagBox">
        标签名称：
        <el-input placeholder="请填写标签名称"
                  v-model="newTagName"></el-input>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="addTagDialogVisibleTrue">保 存</el-button>
        <el-button type="primary"
                   @click="addTagClick">取 消</el-button>
      </span>
    </el-dialog>
    <confirm-dialog :visible.sync="isDeleteVisible"
                    @confirm="deleteNode"
                    confirmText="确定删除"></confirm-dialog>
  </div>
</template>
<script>
import TreeAppendChildDialog from "@/common/TreeAppendChildDialog";
import TreeChangeNameDialog from "@/common/TreeChangeNameDialog";
import ConfirmDialog from "@/common/ConfirmDialog";
import * as api from "@/pages/equipmentMange/ajax.js";
import { mapState } from "vuex";
import icons from "@/common/icon.js";
import { addTreeKey, copyTreeKey } from "@/utils/tree";
export default {
  name: "leftmenu",
  components: {
    TreeAppendChildDialog,
    TreeChangeNameDialog,
    ConfirmDialog
  },
  data() {
    return {
      lastLevelType: "",
      isDeleteVisible: false,
      treeName: "tree1",
      activeName: "first",
      icons,
      searchText: "", // 搜索框的文本
      appendChildrenDialogVisible: false,
      addTagDialogVisible: false,
      changeNameDialogVisible: false,
      node: "", // 用于存储当前的操作的节点
      nodeValue: "", // 值
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      labelArr: [],
      upAddress: "",
      defaultExpandedKeys: [],
      data: [],
      data2: [],
      currentNode: {},
      isExpanded: false,
      orgType: "organization.device",
      tagType: "resident",
      newTagName: "",
      appendNodeOptions: [],
      residentTagType: "resident"
    };
  },
  mounted() {},
  activated() {
    this.registerEventbus();
    this.initData();
  },
  computed: {
    ...mapState({
      checkedLeftTagData: state => {
        return state.resident.curLeftTagData;
      }
    })
  },
  methods: {
    clickHoverMenu(node, subItem, item) {
      console.log(node);
      var name = subItem.label;
      if (item && item.label) {
        name = item.label + "／" + name;
      }
      subItem.name = this.upAddress + "／" + name;
      console.log(subItem);
      this.$store.commit("SET_LEFT_MENU_Data", subItem);
      console.log(this.$refs.tree1.getCheckedKeys());
      this.$refs.tree1.setCurrentKey(node.data.id);
    },
    addTagClick(evt) {
      if (!this.$common.getAuthIsOwn("居民管理", "isOwn")) return;
      this.newTagName = "";
      this.addTagDialogVisible = !this.addTagDialogVisible;
    },
    addTagDialogVisibleTrue() {
      console.log(this.newTagName);
      if (this.newTagName && this.newTagName.length) {
        this.addTagHttp();
      } else {
        this.$message({
          message: "标签名不能为空",
          type: "warning"
        });
      }
    },
    addTagHttp() {
      api
        .addTag({
          tagName: this.newTagName,
          tagSn: this.getMaxSn(),
          tagType: this.residentTagType
        })
        .then(res => {
          if (res.data.success) {
            this.addTagDialogVisible = !this.addTagDialogVisible;
            console.log("居民标签添加成功", res.data);
            this.getOrgTag("add");
          }
          this.newTagName = "";
        });
    },
    getOrgTag(isFi) {
      // if (!isFi) {
      //   return;
      // }
      api
        .getTagList({
          tagType: this.tagType
        })
        .then(res => {
          if (res.data.data && res.data.data.list) {
            let result = res.data.data.list;
            addTreeKey(result, "icon", icons.sign);
            addTreeKey(result, "havechildren", "no");
            copyTreeKey(result, "label", "tagName");
            copyTreeKey(result, "orgUuid", "tagUuid");
            this.data2 = result;
            console.log(!isFi, "====刷新======", this.data2);
            if (isFi === "add") {
              var newTag = this.data2[this.data2.length - 1];
              this.nodeValue = newTag.tagName;
              this.$store.commit("SET_Cur_Left_Tag_Data", newTag);
              return;
            }
            if (!isFi) {
              if (this.data2.length) {
                this.nodeValue = this.data2[0].tagName;
                this.$store.commit("SET_Cur_Left_Tag_Data", this.data2[0]);
              } else {
                this.$store.commit("SET_Cur_Left_Tag_Data", { tagUuid: "" });
              }
            } else {
              for (var i = 0; i < this.data2.length; i++) {
                var item = this.data2[i];
                if (item.tagUuid === isFi.tagUuid) {
                  this.nodeValue = this.data2[i].tagName;
                  this.$store.commit("SET_Cur_Left_Tag_Data", this.data2[i]);
                  break;
                }
              }
            }
          }
        });
    },
    // 初始化刷新树的结构
    initData() {
      this.$ResidentManageAjax.getResidentTreeDataApi().then(res => {
        let data = res.data.data || {};
        this.data = [];
        this.data.push(data);
        this.defaultExpandedKeys.push(data.id);
        this.appendNodeOptions = [];
        this.appendNodeOptions.push(this.data);
        let checkedData = data;
        checkedData.name = checkedData.label;
        this.setLastLevelType(this.data.extInfo);
        this.$store.commit("SET_LEFT_MENU_Data", checkedData);
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
    exportData2(...arg) {
      var obj = arg[3];
      this.nodeValue = obj.tagName;
      this.$store.commit("SET_Cur_Left_Tag_Data", obj);
    },
    handleDefaultExpKeys() {
      if (this.data && this.data.length !== 0) {
        this.defaultExpandedKeys.push(this.data[0].id);
      }
    },
    // 根据点击树节点的id获取当前节点的字节
    loadNode(node, resolve) {
      if (node.level === 0) {
        resolve([]);
        return;
      }
      this.$ResidentManageAjax
        .getResidentLeftMenuSubDataApi({
          id: node.data.id
        })
        .then(res => {
          console.log(res.data.data);
          if (res.data.data && res.data.data.length) {
            for (let item of res.data.data) {
              if (
                item.nodeType === "area" ||
                item.nodeType === "phase" ||
                item.nodeType === "unit" ||
                item.nodeType === "building"
              ) {
                this.$set(item, "leaf", true);
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
            resolve(res.data.data);
          } else {
            resolve([]);
          }
        });
    },
    getFloorAndHouse(item) {
      this.$ResidentManageAjax
        .getFloorAndHouse({
          id: item.id
        })
        .then(res => {
          if (res.data.data && res.data.data.length) {
            this.$set(item, "myChildren", res.data.data);
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
    handleNodeClick(data, node, component) {
      console.log(data, "-------------", node);
      this.resetData();
      this.getLabelArr(node);
      this.getUpAddress(this.labelArr);
      data.name = this.upAddress;
      this.$store.commit("SET_LEFT_MENU_Data", data);
      this.appendNodeOptions = data.children;
      if (this.currentNode && this.currentNode === node) {
        // this.isExpanded = !this.isExpanded;
        // this.$set(node, "expanded", this.isExpanded);
        // 点击
        if (this.isExpanded && node.level !== 1) {
          this.defaultExpandedKeys.push(data.id);
          // this.setChild(node);
          // 传值
        } else {
          var index = this.defaultExpandedKeys.indexOf(node.data.id);
          this.defaultExpandedKeys.splice(index, 1);
        }
      } else {
        // this.$set(node, "expanded", false);
        this.currentNode = node;
        // this.isExpanded = false;
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
    // 标签树的编辑事件
    clickmenu2({
      index,
      version,
      rankOrder,
      orgUuid,
      sliblings,
      isLastOne,
      node,
      value,
      e
    }) {
      this.tagIndex = index;
      // 树节点右边菜单的点击事件
      var data = [
        {
          value: "changeName",
          label: "修改名称"
        },
        {
          value: "moveup",
          label: "上移"
        },
        {
          value: "movedown",
          label: "下移"
        },
        {
          value: "delete",
          label: "删除"
        }
      ];
      this.orgUuid = orgUuid;
      this.version = version;
      if (node.slice(-1)[0] === "0") {
        data.splice(1, 1);
        if (isLastOne) {
          data.splice(1, 1);
        }
      } else {
        if (isLastOne) {
          data.splice(2, 1);
        }
      }
      if (isLastOne) {
        data.splice(3, 1);
      }
      this.treeName = "tree2";
      this.node = node;
      this.nodeValue = value;
      this.showMenu(data, e);
    },
    showMenu(data, e) {
      const _this = this;
      this.$ContextMenu({
        data: data,
        event: e,
        callback(value) {
          // value表示点击按钮的value
          if (value === "addChildre") {
            _this.appendChildrenDialogVisible = true;
          } else if (value === "changeName") {
            _this.changeNameDialogVisible = true;
          } else if (value === "movedown") {
            _this.movedownNode();
          } else if (value === "moveup") {
            _this.moveupNode();
          } else if (value === "delete") {
            _this.isDeleteVisible = true;
          }
        }
      });
    },
    addchildren(name) {
      // 添加名字 点击确定之后的回调
      if (this.treeName === "tree2") {
        this.$refs[this.treeName].operator({
          operator: "addChildre",
          node: this.node,
          value: name
        });
      } else {
        console.log(this.appendNodeOptions);
      }
    },
    changeName(name) {
      if (this.treeName === "tree2") {
        api
          .updateTagUrl({
            tagName: name,
            tagType: this.tagType,
            tagUuid: this.orgUuid,
            version: this.version
          })
          .then(res => {
            if (res.data.success) {
              this.getOrgTag();
            }
          });
      }
    },
    moveupNode() {
      if (this.treeName === "tree2") {
        let data = [
          {
            tagUuid: this.data2[this.tagIndex].tagUuid,
            tagSn: this.data2[this.tagIndex - 1].tagSn,
            version: this.data2[this.tagIndex].version
          },
          {
            tagUuid: this.data2[this.tagIndex - 1].tagUuid,
            tagSn: this.data2[this.tagIndex].tagSn,
            version: this.data2[this.tagIndex - 1].version
          }
        ];
        api.opeartorTag(data).then(res => {
          if (res.data.success) {
            this.getOrgTag();
          }
        });
      }
    },
    movedownNode() {
      if (this.treeName === "tree2") {
        let data = [
          {
            tagUuid: this.data2[this.tagIndex].tagUuid,
            tagSn: this.data2[this.tagIndex + 1].tagSn,
            version: this.data2[this.tagIndex].version
          },
          {
            tagUuid: this.data2[this.tagIndex + 1].tagUuid,
            tagSn: this.data2[this.tagIndex].tagSn,
            version: this.data2[this.tagIndex + 1].version
          }
        ];
        api.opeartorTag(data).then(res => {
          if (res.data.success) {
            this.getOrgTag();
          }
        });
      }
    },
    deleteNode() {
      if (this.treeName === "tree1") {
        api.deleteOrgTree(this.rankOrder, this.orgType).then(res => {
          if (res.data.success) {
            this.getOrgTree();
          }
        });
      } else {
        api.deleteTag(this.orgUuid).then(res => {
          if (res.data.success) {
            this.getOrgTag();
          }
        });
      }
      this.newTagName = "";
    },
    handleClick(tab, event) {
      this.treeName = ["tree1", "tree2"][tab.index];
      if (this.treeName === "tree2") {
        this.getOrgTag();
      } else {
        this.initData();
      }
      this.$emit("tabClick", this.treeName);
    },
    getMaxSn() {
      var max = 0;
      for (var i = 0, len = this.data2.length; i < len; i++) {
        if (this.data2[i].tagSn > max) {
          max = this.data2[i].tagSn;
        }
      }
      return max + 1;
    },
    registerEventbus() {
      this.$bus.$on("ModifyTagName", localTag => {
        this.changeNameDialogVisible = localTag;
      });
      this.$bus.$on("getLeftMenuTag", obj => {
        this.getOrgTag(obj);
      });
      this.$bus.$on("getRefreshLeftMenu", obj => {
        this.initData();
      });
    },
    unRegisterEventbus() {
      this.$bus.$off("ModifyTagName");
      this.$bus.$off("getLeftMenuTag");
      this.$bus.$off("getRefreshLeftMenu");
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
    },

    checkedLeftTagData(val) {
      console.log(val);
      this.orgUuid = val.tagUuid;
      this.version = val.version;
    }
  },
  deactivated() {
    this.unRegisterEventbus();
  },
  destroyed() {
    this.unRegisterEventbus();
  }
};
</script>
<style lang="scss">
@import "@/style/variables.scss";
#ResdientLeftMenu {
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
}
.ResidentBoxCard .el-card__header {
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
  /* display: inline-block; */
  /* width: 100%; */
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
.ResidentBoxCard {
  background: transparent !important;
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #dddddd;
  letter-spacing: 0;
  border: none;
  box-shadow: none;
  max-width: calc(99vw - 300px);
  max-height: calc(99vh - 20px);
  overflow: auto;
  margin-top: 20px;
}
.leftmenu {
  width: $equLeftMenuWidth;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
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
  width: $equLeftMenuWidth;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
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
    padding: 20px 0;
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
