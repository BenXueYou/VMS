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
              <img class="checked-img"
                   src="@/assets/images/doorAccess/checked_icon.png"
                   width="10.9px"
                   height="9px"
                   v-if="node.data.type === lastLevelType"
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
      lastLevelType: "house"
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
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
      this.getInfrastructureToHouse(body.data.id);
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return;
      }
      this.$houseHttp
        .getInfrastructureToHouse({
          parentUuid: node.data.id
        })
        .then(res => {
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
          }
        });
    },
    getInfrastructureToHouse(parentUuid) {
      this.defaultExpKeys.push(this.treeData[0].id);
      // this.$houseHttp
      //   .getInfrastructureToHouse({
      //     parentUuid
      //   })
      //   .then(res => {
      //     let body = res.data;
      //     this.handleGetTreeSuccessResponse(body);
      //   });
    },
    // handleGetTreeSuccessResponse(body) {
    //   if (body.data) {
    //     this.treeData[0].children = body.data;
    //     for (let item of this.treeData[0].children) {
    //       this.$set(item, "leaf", true);
    //       if (item.nextCount !== 0) {
    //         this.$set(item, "leaf", false);
    //       }
    //     }
    //   }
    //   this.handleDefaultExpKeys();
    // },
    // handleDefaultExpKeys() {
    //   if (this.treeData && this.treeData.length !== 0) {
    //     this.defaultExpKeys.push(this.treeData[0].id);
    //   }
    // },
    handleNodeClick(obj, node, component) {
      if (obj.type === this.lastLevelType) {
        this.currentNode = node;
        this.labelArr = [];
        this.upAddress = "";
        this.getLabelArr(node);
        this.getUpAddress(this.labelArr);
        this.nodeText = this.upAddress;
        this.$emit("setUseData", {
          node: this.currentNode
        });
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
    initTreeRootData: {
      handler(val) {
        this.initData();
      },
      deep: true
    },
    name() {
      this.nodeText = this.name;
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
