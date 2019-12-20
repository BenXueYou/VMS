<template>
  <div id="equipLeftMenu"
       class="leftmenu">
    <div class="searchWrap">
      <el-input :placeholder="orgType=='staff'?'搜索组织/标签/名称':'搜索设备/标签/名称'"
                v-model="searchText">
        <img slot="prefix"
             class="image"
             :src="icons.search"
             alt>
      </el-input>
      <img v-if="activeName=='organiza'"
           @click="showAddChildrenDialog"
           :src="icons.add"
           alt>
      <img v-else-if="activeName==='tag'"
           @click="showAddTagDialog"
           :src="icons.addSign"
           alt>
    </div>

    <el-tabs v-model="activeName"
             class="tabs"
             @tab-click="handleClick">
      <el-tab-pane :label="orgType==='device'?'设备树':'组织架构'"
                   class="mypanel"
                   name="organiza">
        <gt-tree ref="tree1"
                 class="tree"
                 @getChidrendata="getChidrendata"
                 @clickmenu="clickmenu"
                 @exportData="exportData"
                 :initdata="data"></gt-tree>
      </el-tab-pane>
      <el-tab-pane label="标签"
                   name="tag">
        <gt-tree ref="tree2"
                 class="mypanel"
                 @clickmenu="clickmenu2"
                 @exportData="exportData2"
                 :initdata="data2"></gt-tree>
      </el-tab-pane>
    </el-tabs>

    <tree-append-child-dialog @confirm="addchildren"
                              :options="options"
                              :select="select"
                              :title="addTitle"
                              :visible.sync="appendChildrenDialogVisible"></tree-append-child-dialog>

    <tree-append-tag-dialog @confirm="addTag"
                            :title="addTitle"
                            :visible.sync="appendTagDialogVisible"></tree-append-tag-dialog>

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
import TreeAppendChildDialog from "@/common/TreeAppendChildDialog";
import TreeChangeNameDialog from "@/common/TreeChangeNameDialog";
import TreeAppendTagDialog from "@/common/TreeAppendTagDialog";
import ConfirmDialog from "@/common/ConfirmDialog";
import icons from "@/common/icon.js";
import * as api from "@/pages/equipmentMange/ajax.js";
import orgDialog from "@/pages/equipmentMange/components/orgDialog";
import { addTreeKey, copyTreeKey, remeberLast } from "@/utils/tree";
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
    }
  },
  data() {
    return {
      changeTitle: "",
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
      nodeValue: "", // 值
      rankOrder: "",
      orgUuid: "", //
      version: "",
      tagIndex: 0, // 用来上下移动标签的时候记录
      data: [
        // {
        //   label: "华南区",
        //   icon: icons.folder,
        //   children: new Array(4).fill({
        //     label: "xxx分公司1",
        //     icon: icons.folder,
        //     children: [
        //       {
        //         label: "测试菜单展开1",
        //         icon: icons.folder
        //       }
        //     ]
        //   })
        // }
      ],
      data2: [
        // {
        //   label: "默认分组1",
        //   icon: icons.sign
        // }
      ],
      treenodeNums: [],
      selectId: "",
      parentOrgUuid: "",
      lastParentOrgUuid: "", // 更新
      lastParent: "",
      upData: {},
      downData: {}
    };
  },
  mounted() {
    this.data = [];
    this.data2 = [];
    this.parentOrgUuid = "";
    this.Treeparent = "";
    this.getOrgTree(true);
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
    showAddChildrenDialog() {
      // this.appendChildrenDialogVisible = true;
      this.showOrgDialogVisible = true;
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
    showAddTagDialog() {
      this.appendTagDialogVisible = true;
      this.addTitle = "新增标签";
      // if (this.orgType === "device") {
      //   this.addTitle = "新增子结点";
      // } else {
      //   this.addTitle = "新增子部门";
      // }
    },
    addTag(name) {
      api
        .addTag({
          tagName: name,
          tagSn: this.getMaxSn(),
          tagType: this.tagType
        })
        .then(res => {
          if (res.data.success) {
            this.getOrgTag(true);
          }
        });
    },
    getOrgTag(flag = false, uuid) {
      api
        .getTagList({
          tagType: this.tagType
        })
        .then(res => {
          if (res.data.data && res.data.data.list) {
            let result = res.data.data.list || [];
            addTreeKey(result, "icon", icons.sign);
            addTreeKey(result, "havechildren", "no");
            copyTreeKey(result, "label", "tagName");
            copyTreeKey(result, "orgUuid", "tagUuid");
            // if (!this.tagUuid) {
            // this.tagUuid = result[0].tagUuid;
            // this.commit("tagUuid",result[0].tagUuid);
            if (!result[0]) {
              this.data2 = result;
              return;
            }

            // 新增节点之后，不会去刷新右边第一个节点的列表
            if (!uuid) {
              this.$store.commit("setTagUuid", result[0].tagUuid);
              this.$store.commit("setTag", result[0]);
              this.$emit("clickNode", result[0]);
              result[0].selected = true;
            } else {
              let index = 0;
              for (let i = 0; i < result.length; i++) {
                if (result[i].tagUuid === uuid) {
                  result[i].selected = false;
                  index = i;
                  break;
                }
              }
              result[index].selected = true;
              this.$store.commit("setTagUuid", result[index].tagUuid);
              this.$store.commit("setTag", result[index]);
              this.$emit("clickNode", result[index]);
            }
            // }
            this.data2 = result;

            if (this.orgUuid === "" && result.length) {
              this.orgUuid = result[0].tagUuid;
              this.version = result[0].version;
              this.nodeValue = result[0].tagName;
              this.Treeparent = "0-0";
            }
            for (let i = 0, len = result.length; i < len; i++) {
              if (result[i].tagUuid === this.orgUuid) {
                this.version = result[i].version;
                this.nodeValue = result[i].tagName;
              }
            }
          }
        });
    },
    getOrgTree(isFirst = false) {
      // 这个添加树的方法
      let data = {
        parentOrgUuid: this.parentOrgUuid,
        needType: this.needType
      };
      // console.log(data);
      api.getOrgTree(data, this.orgType).then(res => {
        if (res.data.data) {
          let result = res.data.data || [];
          addTreeKey(result, "icon", icons.folder);
          addTreeKey(result, "isextendJudge", false);
          copyTreeKey(result, "label", "orgName");
          remeberLast(result, this.treenodeNums, this.selectId);
          for (let i = 0; i < result.length; i++) {
            result[i].selected = false;
          }

          if (this.Treeparent.length) {
            this.appendChild(result);
          } else {
            this.data = result;
          }
          if (isFirst && result && result.length) {
            // 如果是第一次进来，自动选第一个子结点并且展开。则自动展开子结点。
            this.parentOrgUuid = result[0].orgUuid;
            if (this.orgType === "device") {
              this.$store.commit("setOrgUuid", result[0].orgUuid);
            }
            this.Treeparent = "0-0";
            this.getOrgTree();
            // 自动选中第一行有问题
            // this.$refs[this.treeName].operator({
            //   operator: "selected",
            //   node: this.Treeparent,
            //   selected: true
            // });
          }

          if (this.orgUuid === "") {
            if (result.length) {
              this.orgUuid = result[0].id;
              this.version = result[0].version;
              this.nodeValue = result[0].orgName;
            }
            this.Treeparent = "0-0";
            this.select = this.orgUuid;
            this.getoptions(result);
          }
          for (let i = 0, len = result.length; i < len; i++) {
            if (result[i].id === this.orgUuid) {
              this.version = result[i].version;
              this.nodeValue = result[i].orgName;
            }
          }
          this.$emit("clickNode", {
            id: this.parentOrgUuid,
            orgName: this.nodeValue
          });
        }
      });
    },
    getOrgTree2() {
      // 这个更新树的方法
      // 根据parent来获取parentUuid.
      let path = this.Treeparent.split("-");
      let parentUuid = this.$refs[this.treeName].getParentKey(
        this.Treeparent,
        "id"
      );
      let data = {
        parentOrgUuid: parentUuid,
        needType: this.needType
      };
      this.orgUuid = "";
      api.getOrgTree(data, this.orgType).then(res => {
        if (res.data.data) {
          let result = res.data.data || [];
          addTreeKey(result, "icon", icons.folder);
          copyTreeKey(result, "label", "orgName");
          remeberLast(result, this.treenodeNums, this.selectId);
          // console.log(result);
          if (path.length <= 2) {
            this.data = result;
          } else {
            let parentNode = this.Treeparent.substr(
              0,
              this.Treeparent.lastIndexOf("-")
            );
            this.$refs[this.treeName].operator({
              operator: "addChildre",
              node: parentNode,
              value: result
            });
          }
          if (this.orgUuid === "" && result.length) {
            this.orgUuid = result[0].id;
            this.version = result[0].version;
            this.nodeValue = result[0].orgName;
            this.Treeparent = "0-0";
          }
          for (let i = 0, len = result.length; i < len; i++) {
            if (result[i].id === this.orgUuid) {
              this.version = result[i].version;
              this.nodeValue = result[i].orgName;
            }
          }
        }
        this.$emit("clickNode", { id: parentUuid, orgName: this.nodeValue });
      });
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
      // console.log(data);
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
    getChidrendata(orgUuid, isextend, parent) {
      let index = this.treenodeNums.indexOf(orgUuid);
      this.parentOrgUuid = orgUuid;
      if (isextend) {
        this.treenodeNums.push(orgUuid);
        this.getOrgTree();
      } else {
        this.treenodeNums.splice(index, 1);
      }
      this.Treeparent = parent;
    },
    exportData(data, root, rankOrder, node, parent) {
      this.orgUuid = node.id;
      this.version = node.version;
      this.nodeValue = node.orgName;
      //  用户存储上次的操作树的信息。保存选中和展开状态
      //  这里将点击的ID抛出去给外面
      this.$emit("clickNode", node);
      if (this.orgType === "device") {
        this.$store.commit("setOrgUuid", node.orgUuid);
      }

      // alert(node.orgUuid);
      this.selectId = data;
      this.select = node.orgUuid;
      this.Treeparent = parent;
      this.getoptions(root);
    },
    exportData2(data, root, rankOrder, node, parent) {
      // console.log(data, root, rankOrder, node);
      this.Treeparent = parent;
      this.orgUuid = node.tagUuid;
      this.version = node.version;
      this.nodeValue = node.tagName;
      this.$emit("clickNode", node);
      // alert(2);
      // console.log("22222222222222222222222222");
      if (this.orgType === "device") {
        this.$store.commit("setTagUuid", node.tagUuid);
        this.$store.commit("setTag", node);
      }
    },
    getoptions(sliblings) {
      // let arr = [];
      for (let i = 0, len = sliblings.length; i < len; i++) {
        sliblings[i].value = sliblings[i].orgUuid;
        // arr.push({
        //   label: sliblings[i].label,
        //   value: sliblings[i].orgUuid,

        // });
      }
      this.options = sliblings;
      // console.log(this.options);
    },
    clickmenu({
      index,
      version,
      rankOrder,
      orgUuid,
      sliblings,
      isLastOne,
      node,
      value,
      e,
      downData,
      upData
    }) {
      console.log({
        index,
        version,
        rankOrder,
        orgUuid,
        sliblings,
        isLastOne,
        node,
        value,
        e,
        downData,
        upData
      });

      // console.log(downData);
      // console.log(upData);
      this.downData = downData;
      this.upData = upData;
      // 存储上个uuid 和 父节点路径
      this.lastParentOrgUuid = this.parentOrgUuid;
      this.lastParent = this.Treeparent;
      // let prefixnode = node.slice(0, node.length - 1);
      this.getoptions(sliblings);
      this.version = version;
      this.select = orgUuid;
      this.orgUuid = orgUuid;
      // 树节点右边菜单的点击事件
      var data = [
        {
          value: "addChildre",
          label: this.orgType === "staff" ? "添加子部门" : "添加子分组"
        },
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
      if (node.slice(-1)[0] === "0") {
        data.splice(2, 1);
        if (isLastOne) {
          data.splice(2, 1);
        }
      } else {
        if (isLastOne) {
          data.splice(3, 1);
        }
      }

      this.treeName = "tree1";
      this.node = node;
      this.parent = node;
      this.Treeparent = node;
      this.nodeValue = value;
      this.rankOrder = rankOrder;
      this.showMenu(data, e);
    },
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
      this.Treeparent = node;
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
          _this.deal(value);
        }
      });
    },
    deal(value) {
      const _this = this;
      if (value === "addChildre") {
        _this.appendChildrenDialogVisible = true;
        if (this.orgType === "device") {
          this.addTitle = "新增子结点";
        } else {
          this.addTitle = "新增子部门";
        }
      } else if (value === "changeName") {
        // alert(this.treeName);
        if (this.treeName === "tree1") {
          if (this.orgType === "device") {
            this.changeTitle = "修改结点名称";
          } else {
            this.changeTitle = "修改部门名称";
          }
        } else {
          this.changeTitle = "修改标签";
        }
        _this.changeNameDialogVisible = true;
      } else if (value === "movedown") {
        _this.movedownNode();
      } else if (value === "moveup") {
        _this.moveupNode();
      } else if (value === "delete") {
        this.isDeleteVisible = true;
        // 这里弹出个弹框询问是否确定删除该子结点。
        // _this.deleteNode();
      }
    },
    getMaxOrgSn() {
      let maxSn = -10000;
      for (let i = 0; i < this.options.length; i++) {
        maxSn = maxSn > this.options[i].orgSn ? maxSn : this.options[i].orgSn;
      }
      return maxSn;
    },
    addchildren(name, node) {
      console.log(this.options);
      console.log(name, node);
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].id === node) {
          this.Treeparent =
            this.Treeparent.substr(0, this.Treeparent.length - 1) + i;
        }
      }

      console.log(this.Treeparent);
      // console.log(this.getMaxOrgSn());
      // this.parentOrgUuid = node;
      let data = {
        orgName: name,
        // orgSn: this.getMaxOrgSn(),
        orgType: this.orgType,
        parentUuid: node
      };
      api.addOrgTree(data).then(res => {
        if (res.data.success) {
          // 添加子结点成功之后，展开添加的节点
          this.getChidrendata(node, true, this.Treeparent);
          // this.getOrgTree();
        }
      });
    },
    changeName(name) {
      if (this.treeName === "tree1") {
        api
          .updateOrg({
            orgName: name,
            orgUuid: this.orgUuid,
            version: this.version
          })
          .then(res => {
            if (res.data.success) {
              // this.getOrgTree();
              // 当前节点更新之后，怎么刷新呢
              // this.$refs[this.treeName].operator({
              //   operator: "changeName",
              //   node: this.parent,
              //   value: name
              // });
              // 返回来有一个version版本号，把这个version字段也更新了
              // alert(res.data.data.version);
              this.$refs[this.treeName].operator({
                operator: "changeName",
                version: res.data.data.version,
                node: this.Treeparent,
                value: name
              });
              this.nodeValue = name;
              this.version = res.data.data.version;
              // 更新options;
              // console.log(this.options);
              for (let i = 0; i < this.options.length; i++) {
                if (this.options[i].id === this.orgUuid) {
                  this.options[i].orgName = name;
                  this.options[i].label = name;
                  this.options[i].version = this.version;
                }
              }
              this.$emit("clickNode", {
                id: this.orgUuid,
                orgName: name
              });
            }
          });
      } else if (this.treeName === "tree2") {
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
      } else if (this.treeName === "tree1") {
        api.operatorOrgTree(this.upData).then(res => {
          if (res.data.success) {
            // 向上移动之后,根据操作父节点重新获取获取数据
            this.$message.success("移动成功");
            // this.getOrgTree();
            this.getOrgTree2();
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
      // alert(1);
      if (this.treeName === "tree1") {
        api.deleteOrgTree(this.orgUuid).then(res => {
          // this.Treeparent = "";
          // this.parentOrgUuid = "";
          // this.data1 = [];
          // this.orgUuid = "";
          if (res.data.success) {
            this.$message.success("删除成功！");
            // this.getOrgTree(true);
            this.getOrgTree2();
          }
        });
      } else {
        api.deleteTag(this.orgUuid).then(res => {
          // this.Treeparent = "";
          // this.data1 = [];
          // this.orgUuid = "";
          if (res.data.success) {
            this.$message.success("删除成功！");
            this.getOrgTag();
          }
        });
      }
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
      this.$refs[this.treeName].filter(this.searchText);
    },
    Treeparent(val) {
      // console.log("=--==========================================");
      // console.log(val);
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
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";

.leftmenu {
  width: 280px;
  box-sizing: border-box;
  height: 100%;
  $iconWidth: 40px;
  background-color: rgba(35, 38, 41, 0.8);
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
  .mypanel {
    height: calc(100vh - 60px - 70px - 80px);
    overflow: auto;
    width: 228px;
  }
}
</style>
