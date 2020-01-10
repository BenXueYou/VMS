<template>
  <el-row class="treeTabs">
    <div v-if="showInput">
      <el-input class="el_input"
                prefix-icon="el-icon-search"
                placeholder="输入关键字进行过滤"
                v-model="filterText"></el-input>
    </div>
    <div class="dialog-content">
      <div class="i-tree">
        <el-tree :show-checkbox="false"
                 :check-strictly="true"
                 :highlight-current="true"
                 :data="treeData"
                 :props="defaultProps"
                 node-key="tagUuid"
                 :indent="10"
                 lazy
                 ref="treeRef"
                 :filter-node-method="filterNode"
                 :default-expanded-keys="checkedKeys"
                 :expand-on-click-node="false"
                 @node-click="handleNodeClick">
          <div class="custom-tree-node i-tree-item"
               slot-scope="{ node }">
            <img src="@/assets/images/equipment/sign.png"
                 width="10.9px"
                 height="9px"
                 style="margin-right: 4px;">
            <div class="i-tree-item-icon">
              {{ node.label }}
              <img v-if="(node.checked)"
                   src="@/assets/images/doorAccess/checked_icon.png"
                   width="10.9px"
                   height="9px"
                   style="margin-right: 20%;">
            </div>
          </div>
        </el-tree>
      </div>
    </div>
  </el-row>
</template>
<script>
import icons from "@/common/icon.js";
import * as api from "@/pages/equipmentMange/ajax.js";
import { addTreeKey, copyTreeKey } from "@/utils/tree";
export default {
  components: {},
  props: {
    searchText: {
      type: String,
      default() {
        return "";
      }
    },
    treeType: {
      type: String,
      default: "staff"
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
    checkedKeys: {
      type: Array,
      default: () => []
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
      inputModel: "",
      isCurrentShow: false,
      defaultExpandedKeys: [],
      checkedNodes: {},
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "isLeaf"
      },
      treeData: [],
      nodeKey: "tagUuid",
      tagType: "staff"
    };
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * tagType:
     * 1、staff 表示员工管理标签
     * 2、resident 表示居民管理标签
     * 3、person 表示居民和员工管理的混合标签
     * 4、device 表示设备标签
     */
    init() {
      if (this.treeType === "person") {
        this.tagType = "staff,resident";
      } else {
        this.tagType = this.treeType;
      }
      this.getAjaxTagTree();
    },
    // 组织机构请求
    getAjaxTagTree(data) {
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
            copyTreeKey(result, "id", "tagUuid");
            this.treeData = res.data.data.list;
            this.treeData.forEach(element => {
              element.isLeaf = true;
            });
            console.log(this.treeData[0]);
          }
        });
    },
    handleNodeClick(data, node) {
      var checked = true;
      let i = this.defaultExpandedKeys.indexOf(data.id);
      if (node.checked) {
        checked = false;
        this.defaultExpandedKeys.splice(i, 1);
      } else {
        this.defaultExpandedKeys.push(data.id);
      }
      this.$set(node, "checked", checked);
      // this.$refs.treeRef.setCheckedKeys(this.defaultExpandedKeys);
      data.id = data.tagUuid;
      data.label = data.tagName;
      this.$emit("transferCheckedNodes", data, checked);
    },
    filterNode(obj, data) {
      console.log(obj);
      console.log(data);
      // obj 里面有type字段,0表示筛选value值，1表示筛选类型
      if (!obj.value) {
        return true;
      } else {
        if (obj.type == 0) {
          return data.label.indexOf(obj.value) !== -1;
        } else if (obj.type == 1) {
          return data.type.indexOf(obj.value) !== -1;
        }
      }
    },
    setkey() {
      var num = [];
      var keysArr = [];

      for (var i = 0, len = this.checkeTreedNodes.length; i < len; i++) {
        num.push(this.checkeTreedNodes[i]);
        keysArr.push(this.checkeTreedNodes[i].id);
      }
      if (this.$refs.treeRef) {
        this.$nextTick(() => {
          this.$refs.treeRef.setCheckedNodes(num);
          this.$refs.treeRef.setCheckedKeys(keysArr);
        });
      }
      this.defaultExpandedKeys = keysArr;
    }
  },
  watch: {
    visible: {
      handler(val, oldVal) {
        if (val) {
          this.init();
        } else {
          this.treeData = [];
        }
        this.$nextTick(() => {
          this.setkey();
        });
      },
      deep: true,
      immediate: true
    },
    filterText(val) {
      this.$refs.treeRef.filter({ value: val, type: 0 });
    },
    searchText(val) {
      this.$refs.treeRef.filter({ value: val, type: 0 });
    },
    searchType(val) {
      this.$refs.treeRef.filter({ value: val, type: 1 });
    },
    checkedNodes(val) {
      // 向父组件传值
    },
    checkedKeys(val) {},
    checkeTreedNodes: {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.setkey();
        });
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
  overflow: auto;
}
.treeTabs .el-input__inner {
	padding-left: 30px;
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
  border-top: 0px dashed rgba(255, 255, 255, 0.1);
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
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 10px 0;
  margin-left: -10px;
  box-sizing: border-box;
  overflow: auto;
  .i-tree-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 15px;
    }
    .i-tree-item-icon {
      width: calc(100% - 20px);
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
