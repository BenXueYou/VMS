<template>
  <div class="popover-tree">
    <el-input v-model="nodeText"
              :style="`width: ${width}`"
              v-popover:popover
              placeholder="请选择"
              readonly
              :clearable="true"
              size="small"></el-input>
    <el-popover ref="popover"
                placement="bottom-start"
                width="250"
                @show="showPopover"
                popper-class="my-popover"
                trigger="click">
      <el-input placeholder="输入关键字进行过滤"
                v-model="filterText"
                style="margin-bottom: 10px;"
                size="small">
      </el-input>
      <el-scrollbar style="height: 87%;"
                    class="i-tree-style">
        <el-tree :data="treeData"
                 :props="defaultProps"
                 node-key="id"
                 lazy
                 :load="loadNode"
                 :filter-node-method="filterNode"
                 :indent="10"
                 :default-expanded-keys="defaultExpKeys"
                 ref="popoverTree"
                 :expand-on-click-node="false"
                 :highlight-current="true"
                 @node-click="handleNodeClick">
          <div class="custom-tree-node i-tree-item"
               slot-scope="{ node }">
            <div class="i-tree-item-icon">
              {{ node.label }}
              <img v-if="node.data.id===checkedUuid"
                   src="@/assets/images/doorAccess/checked_icon.png"
                   width="10.9px"
                   height="9px"
                   style="margin-right: 20%;">
            </div>
          </div>
        </el-tree>
      </el-scrollbar>
    </el-popover>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    width: {
      type: String,
      default: "40"
    },
    name: {
      type: String,
      default: ""
    },
    houseUuid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      treeData: [],
      nodeText: "",
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      defaultExpKeys: [],
      labelArr: [],
      upAddress: "",
      filterText: "",
      currentNode: "",
      subType: "",
      lastLevelType: "house",
      checkedUuid: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    initData() {
      this.getAreaStruct();
    },
    getAreaStruct() {
      this.$houseHttp.getAreaStruct({}).then(res => {
        let body = res.data;
        this.getAreaStructSuccessResponse(body);
      });
    },
    getAreaStructSuccessResponse(body) {
      if (!body.data) {
        return;
      }
      this.treeData = [
        {
          id: body.data.id,
          label: body.data.label,
          type: body.data.type,
          children: []
        }
      ];
      // this.getInfrastructureToHouse(body.data.id);
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return;
      }
      this.$houseHttp.getInfrastructureToUnit(node.data.id).then(res => {
        if (!res.data.data) {
          resolve([]);
        } else {
          for (let item of res.data.data) {
            this.$set(item, "leaf", true);
            if (item.nextCount !== 0) {
              this.$set(item, "leaf", false);
            }
          }
          resolve(res.data.data);
          if (this.houseUuid) {
            this.$refs.popoverTree.setChecked(this.houseUuid);
            console.log(this.$refs.popoverTree.getCheckedKeys());
          }
        }
      });
    },
    handleNodeClick(obj, node, component) {
      this.checkedUuid = node.data.id;
      // if (obj.type === this.lastLevelType) {
      this.currentNode = node;
      this.nodeText = this.getWanZheng(node).substr(1);
      this.$emit("setUseData", {
        node: this.currentNode
      });
      console.log(this.nodeText);
      // this.defaultExpKeys = [node.data.id];
      // }
    },
    getWanZheng(node) {
      console.log(node.data.label);
      if (!node.parent) {
        return "";
      }
      return this.getWanZheng(node.parent) + "/" + node.data.label;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    showPopover() {
      this.initData();
    }
  },
  watch: {
    filterText(val) {
      this.$refs.popoverTree.filter(val);
    },
    name(val) {
      let uuid = this.$refs.popoverTree.getCheckedKeys();
      if (!uuid.length) {
        this.nodeText = val;
      }
    },
    houseUuid() {
      // this.defaultExpKeys = [this.houseUuid];
      this.checkedUuid = this.houseUuid;
      this.$refs.popoverTree.setChecked(this.houseUuid);
    }
  },
  destroyed() {}
};
</script>
<style lang="scss">
.my-popover {
  height: 250px !important;
}
.i-tree-style {
  .el-tree {
    background: #2a2e31 !important;
  }
  .el-tree-node__content {
    .checked-img {
      display: none;
    }
    &:focus {
      .checked-img {
        display: block;
      }
    }
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    .checked-img {
      display: block;
    }
  }
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
</style>
