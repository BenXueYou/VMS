<template>
  <div id="equipLeftMenu"
       class="leftmenu"
       :style="'width:' + ownWidth + 'px'">
    <div class="searchWrap"
         v-if="isShowInput">
      <el-input :placeholder="placeholder"
                v-model="searchText"
                :style="{ width: inputWidth }">
        <img slot="prefix"
             class="image"
             :src="icons.search"
             alt />
      </el-input>
    </div>
    <div :class="isTabs?'tabs':''">
      <div class="mypenl"
           :style="isShowInput?'padding-bottom: 50px !important;':''">
        <el-tree :data="data"
                 node-key="id"
                 :props="props"
                 ref="mytree"
                 :filter-node-method="filterNode"
                 :highlight-current="isHighLight"
                 default-expand-all
                 @node-click="handleNodeClick"
                 :expand-on-click-node="false">
          <div class="i-tree-item"
               slot-scope="{ node, data }">
            <div class="i-tree-item-icon">
              <div class="text-show"
                   :title="node.label">
                <!-- isHaveChild表示展开项目，有没有根节点 -->
                <!-- 有三角箭头的需要是项目结构 -->
                <!-- 或者不是组织节点并且有nextCount -->
                <span v-if="
                    ((data.type === 'project' && !isOnlyArea && !data.isHaveRoot) ||
                      (data.type != 'areaOrg' && data.nextCount)) &&
                      !(data.children && data.children.length)
                  "
                      @click.stop="getProjectChildTree(node, data)"
                      class="my-el-tree-node-icon el-tree-node__expand-icon el-icon-caret-right">
                </span>
                <img v-if="data.type === 'project'"
                     src="@/assets/icon/area_tree_last_node.png"
                     style="margin-right:3px"
                     alt="">
                <img v-else
                     src="@/assets/images/equipment/floder.png"
                     width="10.9px"
                     height="9px"
                     style="margin-right: 4px;" />{{ node.label }}
              </div>
              <div class="action-icon"
                   v-if="isCanChecked">
                <img src="@/assets/images/checked_icon.png"
                     width="10.9px"
                     v-if="data.checked"
                     height="9px">
              </div>
              <el-dropdown v-if="data.type !== 'project' && isOnlyArea && OwnAuthDisabled"
                           :disabled="!OwnAuthDisabled"
                           trigger="click"
                           class="action-icon"
                           @command="handleDropDownMenuClick"
                           placement="bottom">
                <div class="img-div"
                     @click.stop="saveNodeAndData(node, data)">
                  <img :src="icons.more_action"
                       width="16px"
                       height="13px" />
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="!OwnAuthDisabled"
                                    command="add">添加子级</el-dropdown-item>
                  <el-dropdown-item :disabled="!OwnAuthDisabled"
                                    command="edit">修改名称</el-dropdown-item>
                  <el-dropdown-item :disabled="!OwnAuthDisabled"
                                    v-if="node.level != 1"
                                    command="delete">删除</el-dropdown-item>
                  <el-dropdown-item :disabled="!OwnAuthDisabled"
                                    command="moveUp"
                                    v-if="isDisableMoveUp">上移</el-dropdown-item>
                  <el-dropdown-item :disabled="!OwnAuthDisabled"
                                    command="moveDown"
                                    v-if="isDisableMoveDown">下移</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-tree>
      </div>
    </div>

    <tree-append-child-dialog @confirm="addchildren"
                              :options="options"
                              :select="select"
                              :title="'新增子节点'"
                              :visible.sync="appendChildrenDialogVisible"></tree-append-child-dialog>

    <!-- <tree-append-tag-dialog @confirm="addTag"
                            :title="addTitle"
                            :visible.sync="appendTagDialogVisible"></tree-append-tag-dialog> -->

    <tree-change-name-dialog @confirm="changeName"
                             :value="nodeValue"
                             :title="changeTitle"
                             :visible.sync="changeNameDialogVisible"></tree-change-name-dialog>

    <org-dialog :visible.sync="showOrgDialogVisible"
                :orgType="orgType"
                @confirm="confirAppendChildren"></org-dialog>
    <confirm-dialog :visible.sync="isDeleteVisible"
                    @confirm="deleteNode"
                    confirmText="确定删除"></confirm-dialog>
  </div>
</template>
<script>
import TreeAppendChildDialog from "@/pages/AreaManagement/components/TreeAppendChildDialog";
import TreeChangeNameDialog from "@/common/TreeChangeNameDialog";
import TreeAppendTagDialog from "@/common/TreeAppendTagDialog";
import ConfirmDialog from "@/common/ConfirmDialog";
import icons from "@/common/icon.js";
import * as api from "@/pages/equipmentMange/ajax.js";
import orgDialog from "@/pages/AreaManagement/components/orgDialog";
// import { addTreeKey, copyTreeKey, remeberLast } from "@/utils/tree";
import { mapState } from "vuex";
export default {
  name: "leftmenu",
  components: {
    TreeAppendChildDialog,
    TreeChangeNameDialog,
    TreeAppendTagDialog,
    orgDialog,
    ConfirmDialog
  },
  props: {
    isTabs: {
      type: Boolean,
      default: false
    },
    ownWidth: {
      type: Number,
      default: 245
    },
    isShowOperatorMenu: {
      type: Boolean,
      default() {
        return true;
      }
    },
    isShowInput: {
      type: Boolean,
      default() {
        return true;
      }
    },
    isOnlyArea: {
      type: Boolean,
      default() {
        return true;
      }
    },
    placeholder: {
      type: String,
      default() {
        return "搜索区域名称";
      }
    },
    inputWidth: {
      type: String,
      default() {
        return "100%";
      }
    },
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
    },
    orgType: {
      type: String,
      default() {
        return window.config.orgType;
      }
    },
    tagType: {
      type: String,
      default() {
        return window.config.tagType;
      }
    },
    needType: {
      type: String,
      default() {
        return "";
      }
    },
    isCanChecked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      props: {
        label: "label",
        children: "children",
        isLeaf: "leaf"
      },
      changeTitle: "",
      isHighLight: false,
      addTitle: "",
      showOrgDialogVisible: false,
      isDeleteVisible: false,
      Treeparent: "",
      options: [],
      select: "",
      treeName: "tree1",
      activeName: "organiza",
      icons,
      searchText: "", // 搜索框的文本
      appendChildrenDialogVisible: false,
      appendTagDialogVisible: false,
      changeNameDialogVisible: false,
      node: "", // 用于存储当前的操作的节点
      operatorData: "", // 存储树菜单正在操作的节点
      nodeValue: "", // 值
      rankOrder: "",
      orgUuid: "", //
      version: "",
      tagIndex: 0, // 用来上下移动标签的时候记录
      data: [],
      treenodeNums: [],
      selectId: "",
      parentOrgUuid: "",
      lastParentOrgUuid: "", // 更新
      lastParent: "",
      upData: {},
      downData: {},
      selectNode: null,
      selectData: null,
      isDisableMoveUp: false,
      isDisableMoveDown: false
    };
  },
  mounted() {
    this.data = [];
    this.parentOrgUuid = "";
    this.Treeparent = "";
    setTimeout(() => {
      this.getOrgTree(true);
    }, 0);
  },
  activated() {},
  computed: {
    ...mapState({
      tagUuid: state => {
        return state.equipment.tagUuid;
      }
    })
  },
  methods: {
    // 点击左侧三角 获取树下级节点的事件
    getProjectChildTree(node, data) {
      console.log(node, data);
      if (data) data.isHaveRoot = false;
      const callback = newArr => {
        if (!data.children) {
          this.$set(data, "children", []);
        }
        if (!newArr.length) {
          this.$set(data, "isHaveChild", true);
        }
        if (data.type === "project" && !newArr.length) {
          this.$set(data, "isHaveRoot", true);
        }
        // data.children.push(...(newArr || []));
        this.$set(data, "children", newArr || []);
      };
      this.$emit("addData", data, callback);
    },
    // 树搜索事件
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 点击当前节点事件
    handleNodeClick(data, node) {
      console.log(data);
      // 点击左边的树，来更新右边的页面
      // 区域树点击末级项目，无响应
      if (this.isOnlyArea && data.type === "project") {
        return;
      }
      if (data.type !== "areaOrg" && data.type !== "project") {
        this.$nextTick(() => {
          this.isHighLight = true;
        });
      } else {
        this.$nextTick(() => {
          this.isHighLight = false;
        });
      }
      this.$emit("clickNode", data, node);
    },
    saveNodeAndData(node, data) {
      console.log(node, data);
      this.selectNode = node;
      this.selectData = data;
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      // 根据index判断要不要显示出来上移或者下移按钮
      if (index === 0) {
        this.isDisableMoveUp = false;
      } else {
        this.isDisableMoveUp = true;
      }
      if (index === children.length - 1) {
        this.isDisableMoveDown = false;
      } else {
        this.isDisableMoveDown = true;
      }
    },
    // 点击下拉菜单的事件
    handleDropDownMenuClick(index) {
      switch (index) {
        case "add":
          this.appendChildrenDialogVisible = true;
          const parent = this.selectNode.parent;
          const children = parent.data.children || parent.data;
          this.select = this.selectData.id;
          this.options = children;
          break;
        case "edit":
          this.changeTitle = "修改名称";
          this.nodeValue = this.selectData.label;
          this.changeNameDialogVisible = true;
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
    deleteInfrastructure() {
      if (this.selectData.isHaveProject) {
        this.$message.error("该组织下面有项目,不允许删除!");
        return;
      }
      this.isDeleteVisible = true;
    },
    showAddChildrenDialog() {
      if (!this.OwnAuthDisabled) {
        return;
      }
      // this.appendChildrenDialogVisible = true;
      this.showOrgDialogVisible = true;
      console.log(this.options);
    },
    showAddTagDialog() {
      if (!this.OwnAuthDisabled) {
        return;
      }
      this.appendTagDialogVisible = true;
      this.addTitle = "新增标签";
    },
    deepTree(data) {
      for (let i = 0, len = data.length; i < len; i++) {
        let childData = data[i].children || [];
        for (let j = 0; j < childData.length; j++) {
          if (childData[j].type === "project") {
            // 用于判断节点下面是否挂了项目，有的话则不允许删除
            data[i].isHaveProject = true;
            childData.splice(j, 1);
            j--;
          }
        }
        if (data[i].children) {
          this.deepTree(childData);
        }
      }
    },
    getOrgTree(isFirst = false) {
      if (!this.ShowAuthDisabled) {
        return;
      }
      // 这个添加树的方法
      // console.log(data);
      api
        .getAreaAllOrg({
          // parentOrgUuid: this.parentOrgUuid,
          orgType: this.orgType
        })
        .then(res => {
          if (res.data.data) {
            let result = res.data.data || [];
            let firstPrjectRoot = this.findFirstProject(result);
            this.getProjectChildTree(firstPrjectRoot, firstPrjectRoot);
            this.data = result;
            console.log("区域树的firstPrjectRoot：", firstPrjectRoot);
            if (this.orgUuid === "") {
              if (result.length) {
                this.orgUuid = result[0].id;
                this.version = result[0].version;
                this.nodeValue = result[0].label;
              }
              this.Treeparent = "0-0";
              this.select = this.orgUuid;
              this.getoptions(result);
            }
            for (let i = 0, len = result.length; i < len; i++) {
              this.data[i].isHaveRoot = false;
              if (result[i].id === this.orgUuid) {
                this.version = result[i].version;
                this.nodeValue = result[i].orgName;
              }
            }
            this.$emit("clickNode", this.data[0]);
          }
        });
    },
    // 遍历查找第一个项目
    findFirstProject(dataArr) {
      dataArr = dataArr || [];
      let firstObj = null;
      for (let i = 0, len = dataArr.length; i < len; i++) {
        dataArr[i].isHaveRoot = false;
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
    appendChild(children) {
      // console.log(children);
      this.$refs[this.treeName].operator({
        operator: "addChildre",
        node: this.Treeparent,
        value: children
      });
    },
    confirAppendChildren(data) {
      console.log(data);
      if (data.parentUuid === "") {
        // 清空parentUuid和路径
        this.parentOrgUuid = "";
        this.Treeparent = "";
        this.getOrgTree();
      } else {
        // 确认添加节点，之后需要更新添加节点下面的子节点。
        // 需要根据添加节点的uuid找到父节点的路径(rankOrder),从而来更新
        this.parentOrgUuid = data.parentUuid;
        let path = this.$refs[this.treeName].operator({
          operator: "findParentById",
          parentUuid: data.parentUuid
        });
        if (path) {
          this.Treeparent = path;
          this.getOrgTree();
        }
      }
    },
    getoptions(sliblings) {
      // let arr = [];
      for (let i = 0, len = sliblings.length; i < len; i++) {
        sliblings[i].value = sliblings[i].orgUuid;
      }
      this.options = sliblings;
    },
    addchildren(name, node) {
      let data = {
        orgName: name,
        orgType: this.orgType,
        parentUuid: node
      };
      api.addOrgTree(data).then(res => {
        if (res.data.success) {
          // 添加子级成功之后，展开添加的节点
          this.$message.success("添加子级成功!");
          this.updateChild();
        }
      });
    },
    changeName(name) {
      api
        .updateOrg({
          orgName: name,
          orgUuid: this.selectData.id,
          version: this.selectData.version || 0
        })
        .then(res => {
          this.$message.success("更新成功!");
          this.setChild();
        });
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
    setChild() {
      this.getOrgTree();
    },
    updateChild() {
      this.getOrgTree();
    },
    moveInfrastructure(direaction) {
      api
        .operatorOrgTree({
          beforeUuid: this.getBeforeUuid(this.selectNode, direaction),
          fromUuid: this.selectNode.parent.data.id,
          myUuid: this.selectNode.data.id,
          toUuid: this.selectNode.parent.data.id
        })
        .then(res => {
          this.$message.success("移动成功!");
          // 移动成功更新树节点
          this.setChild();
        });
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
      } else if (this.treeName === "tree1") {
        api.operatorOrgTree(this.downData).then(res => {
          if (res.data.success) {
            // 向上移动之后,根据操作父节点重新获取获取数据
            this.$message.success("移动成功");
            this.getOrgTree2();
          }
        });
      }
    },
    deleteNode() {
      let node = this.selectNode;
      let data = this.selectData;
      api.deleteOrgTree(data.id).then(res => {
        if (res.data.success) {
          this.$message.success("删除成功！");
          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.id === data.id);
          children.splice(index, 1);
        }
      });
    },
    handleClick(tab, event) {
      this.treeName = ["tree1", "tree2"][tab.index];
      this.orgUuid = "";
      this.version = "";
      this.nodeValue = "";
      this.parentOrgUuid = "";
      this.Treeparent = "";
      if (tab.index === "0") {
        // this.parentOrgUuid="";
        this.getOrgTree(true);
      } else if (tab.index === "1") {
        this.getOrgTag();
      }
      this.$emit("changetab", tab);
    }
  },
  watch: {
    searchText(val) {
      this.$refs.mytree.filter(this.searchText);
    },
    Treeparent(val) {
      // console.log("=--==========================================");
      // console.log(val);
    },
    data: {
      handler() {
        this.$emit("updateRight");
      },
      deep: true
    },
    data2: {
      handler() {
        this.$emit("updateRight");
      },
      deep: true
    }
  }
};
</script>
<style lang="scss">
@import "@/style/variables.scss";
#equipLeftMenu {
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
    top: 0px;
    img {
      margin-top: 9px;
    }
  }
  .searchWrap .el-input__inner {
    padding-left: 30px;
  }
  .el-tree-node__expand-icon.is-leaf {
    color: transparent;
    cursor: default;
    width: 0;
  }
  .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 6px 0;
  }
  .text-show .my-el-tree-node-icon {
    padding: 6px 0;
    margin-left: -5px;
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";

.leftmenu {
  width: 260px;
  box-sizing: border-box;
  height: 100%;
  box-sizing: border-box;
  $iconWidth: 40px;
  // background-color: rgba(35, 38, 41, 0.8);
  .searchWrap {
    padding: 25px 15px 15px;
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
    padding: 0;
    height: calc(100% - 74px);
  }
  .mypenl {
    height: 100%;
    overflow: auto;
    width: 100%;
    padding: 0px 15px;
    box-sizing: border-box;
    >>> .tree {
      .gt-tree-node-header {
        padding: 0 20px !important;
        box-sizing: border-box;
      }
      .triangle {
        margin-right: 5px;
      }
    }
  }
  .i-tree {
    height: 85%;
    padding: 20px 0 0 0;
    box-sizing: border-box;
    overflow-x: auto;
  }
}
.i-tree-item {
  width: 100%;
  .i-tree-item-icon {
    width: 95%;
    display: flex;
    align-items: center;
    padding-left: 5px;
    justify-content: space-between;
    .action-icon {
      margin-left: -8px !important;
      .img-div {
        display: none;
        cursor: pointer;
        height: 32px;
        line-height: 32px;
        img {
          outline: none;
        }
      }
    }
    .text-show {
      overflow: visible;
    }
    &:hover {
      .img-div {
        padding-right: 12px;
        display: block;
      }
    }
  }
}
</style>
