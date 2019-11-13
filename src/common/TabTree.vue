<template>
  <el-row class="treeTabs">
    <div v-if="showInput">
      <el-input class="el_input"
                prefix-icon="el-icon-search"
                placeholder="输入关键字进行过滤"
                v-model="filterText"></el-input>
    </div>
    <div class="dialog-content">
      <el-tabs class="tabsBox"
               :class="tabs.length>1?'':'tabsBoxActive'"
               v-model="activeName"
               @tab-click="handleClick">
        <template v-for="(item, index) in tabs">
          <el-tab-pane :key="index"
                       :label="item.label"
                       :name="item.treeRef">
            <div class="i-tree">
              <template v-if="!item.isTag">
                <resident-tree :showInput="false"
                               :selectSingleNode="item.selectSingleNode"
                               :radio="item.radio"
                               :visible.sync="isCurrentShow"
                               :treeType="item.treeType"
                               :hasDoor="item.hasDoor"
                               :treeNodeType="item.treeNodeType"
                               :treeLeafType='item.treeLeafType'
                               @transferCheckedNodes="transferCheckedNodes"
                               :checkeTreedNodes="checkeTreedNodes"></resident-tree>
              </template>
              <template v-else>
                <tag-tree :showInput="false"
                          :visible.sync="isCurrentShow"
                          :treeType="item.treeType"
                          :hasDoor="item.hasDoor"
                          :treeNodeType="item.treeNodeType"
                          @transferCheckedNodes="transferCheckedNodes"
                          :checkeTreedNodes="checkeTreedNodes"></tag-tree>
              </template>
            </div>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </el-row>
</template>
<script>
import residentTree from "./residentTree";
import icons from "@/common/icon.js";
import tagTree from "./tagTree.vue";
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  components: { residentTree, tagTree },
  props: {
    searchText: {
      type: String,
      default() {
        return "";
      }
    },
    searchType: {
      type: String,
      default() {
        return "";
      }
    },
    showInput: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: false
    },
    tabs: {
      type: Array,
      default: () => [
        {
          id: "1",
          label: "设备树",
          treeType: "device",
          treeRef: "tree1",
          nodeKey: "id"
        },
        {
          id: "2",
          label: "地址",
          treeType: "resident",
          treeRef: "tree2",
          nodeKey: "id"
        }
      ]
    },
    checkedKeys: {
      type: Array,
      default: () => []
    },
    treeType: {
      type: String,
      default: "resident"
    },
    checkeTreedNodes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      icons,
      filterText: "",
      activeName: "",
      inputModel: "",
      isCurrentShow: false,
      data2: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      expandedKeys: [],
      checkedNodes: {},
      isSetChange: false,
      orgType: "organization.device",
      defaultExpandedKeys: []
    };
  },
  created() {},
  mounted() {},
  methods: {
    onClickCancel() {
      this.$emit("onCancel");
      this.$emit("update:isShow", false);
    },
    onClickConfirm() {
      this.$emit("onConfirm", this.checkeTreedNodes);
      this.$emit("update:isShow", false);
    },
    transferCheckedNodes(data, nodeBool, treeName) {
      this.$emit("transferCheckedNodes", data, nodeBool, treeName);
    },
    handleClick(val) {
      console.log("点击tab回调事件===", val);
    }
  },
  watch: {
    visible: {
      handler(val, oldVal) {
        setTimeout(() => {
          this.isCurrentShow = val;
        }, 200);
      },
      deep: true,
      immediate: true
    },
    tabs: {
      handler(val, oldval) {
        if (val && val.length) {
          this.activeName = val[0].treeRef;
        }
      },
      deep: true,
      immediate: true
    },
    filterText(val) {
      // var tree = this.activeName;
      // this.$refs[tree][0].filter({ value: val, type: 0 });
    },
    searchText(val) {
      // var tree = this.activeName;
      // this.$refs[tree][0].filter({ value: val, type: 0 });
    },
    searchType(val) {
      // var tree = this.activeName;
      // this.$refs[tree][0].filter({ value: val, type: 1 });
    },
    activeName(val) {
      console.log("===activeName===", val);
      // this.setkey();
    },
    checkedNodes(val) {
      // 向父组件传值
    },
    checkedKeys(val) {
      // debugger;
      // var tree = this.activeName;
      // this.$refs[tree][0].setCheckedKeys(val);
    },
    checkeTreedNodes: {
      handler(newVal, oldVal) {
        // this.setkey();
      },
      immediate: true,
      deep: true
    }
  },
  destroyed() {}
};
</script>
<style>
.el_input {
  margin-bottom: 10px;
}
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: transparent;
  border-color: #26d39d;
}
.treeTabs {
  height: 100%;
}
.treeTabs .el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 20px;
}
.treeTabs .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 10px;
}
.treeTabs .el-tabs__active-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0px;
}
.treeTabs .el-tabs__nav {
  width: 100%;
  min-width: 70px;
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
}
.treeTabs .el-tabs__nav-wrap::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background-color: #cccccc;
  z-index: 1;
  /* display: none; */
}
.treeTabs .el-tabs__item.is-active {
  color: #26d39d;
  border-bottom: 1px solid #26d39d;
}
.treeTabs .el-tabs__item {
  padding: 0 10px;
  color: #dddddd;
}
.treeTabs .el_tabs {
  width: 100%;
  padding: 0 5px;
  box-sizing: border-box;
}

.treeTabs .el-tabs__content {
  overflow: auto;
  position: relative;
  height: calc(100% - 45px);
}
/* .treeTabs .el-tabs__nav-scroll {
    overflow: auto;
} */
.treeTabs .tabsBoxActive .el-tabs__header {
  display: none;
}
.treeTabs .tabsBoxActive .el-tabs__content {
  overflow: auto;
  position: relative;
  height: 100%;
}
.treeTabs .el-tabs__header {
  padding: 0;
  position: relative;
  margin: 0;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$line-color: #24473f;
@mixin setFontStyle($fontsize) {
  font-family: PingFangSC-Regular;
  font-size: $fontsize;
  color: #dddddd;
  letter-spacing: 0;
}
.dialog-content {
  display: flex;
  width: 100%;
  color: #dddddd;
  height: calc(100% - 45px);
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  .box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    padding: 10px 0px;
    margin: 0 25px;
    border-bottom: 1px dashed #2f2f2f;
    span {
      width: 20%;
      min-width: 100px;
      height: 40px;
      line-height: 40px;
    }
    .el-input {
      width: 80%;
    }
  }
  .el-main {
    padding: 10px 5px;
    margin: 0px;
  }
  .tabsBox {
    width: 100%;
    height: 100%;
    .el-tabs__nav .is-top {
      display: flex;
      justify-content: space-around;
      padding: 0 5px;
    }
  }
}
.right-contain {
  padding: 10px 15px;
  .el-checkbox {
    margin-right: 5px;
  }
  .tagBox {
    padding-top: 15px;
    box-sizing: border-box;
    .tableDiv {
      display: inline-flex;
    }
    .el-tag-class {
      margin: 15px 12px 0;
    }
  }
}
.i-tree {
  height: calc(100% - 55px);
  overflow: auto;
  padding: 10px 0;
  box-sizing: border-box;
  .i-tree-item {
    width: 100%;
    .i-tree-item-icon {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .action-icon {
        margin-left: auto;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
}
.dialog-footer {
  border: {
    width: 1px 0 0 0;
    style: solid;
    color: $line-color;
  }
  .footer-button {
    margin: 17px 28px 17px 0;
  }
}
</style>
