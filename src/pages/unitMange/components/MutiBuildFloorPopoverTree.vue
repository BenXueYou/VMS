<template>
  <div class="popover-tree">
    <el-input v-model="nodeText"
              :style="`width: ${width}`"
              v-popover:popover
              placeholder="请选择楼栋单元"
              readonly
              :clearable="true"
              size="small"></el-input>
    <el-popover ref="popover"
                placement="bottom-start"
                @show="showPopover"
                width="230"
                popper-class="my-popover"
                trigger="click">
      <el-input placeholder="输入关键字进行过滤"
                v-model="filterText"
                style="margin-bottom: 10px;"
                size="small">
      </el-input>
      <el-scrollbar style="height: 87%;"
                    class="i-tree-style-muti">
        <el-tree :data="treeData"
                 :props="defaultProps"
                 node-key="id"
                 :check-strictly="true"
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
                   v-if="node.checked"
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
    initTreeRootData: {
      type: Object,
      default: () => {}
    },
    lastLevelType: {
      type: String,
      default: ""
    },
    isAllCanSelected: {
      type: Boolean,
      default: false
    },
    nodeText: {
      type: String,
      default: ""
    },
    lastLevel: {
      type: String,
      default: "floor"
    }
  },
  data() {
    return {
      treeData: [],
      // nodeText: "",
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      defaultExpKeys: [],
      labelArr: [],
      upAddress: "",
      filterText: "",
      subType: "",
      mutiUpAddress: "",
      infrastructureUuid: ""
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      if (!this.initTreeRootData) {
        return;
      }
      if (!this.initTreeRootData.id) {
        return;
      }
      this.treeData = [
        {
          id: this.initTreeRootData.id,
          label: this.initTreeRootData.label,
          type: this.initTreeRootData.type,
          children: []
        }
      ];
      this.handleDefaultExpKeys();
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return;
      }
      if (this.initTreeRootData && node.data) {
        if (this.lastLevel === "floor") {
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
        } else if (this.lastLevel === "house") {
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
        }
      }
    },
    handleDefaultExpKeys() {
      if (this.treeData && this.treeData.length !== 0) {
        this.defaultExpKeys.push(this.treeData[0].id);
      }
    },
    handleNodeClick(obj, node, component) {
      if (!node.checked) {
        this.$set(node, "checked", true);
      } else {
        this.$set(node, "checked", false);
      }
      this.afterNodeClick(obj, node, component);
    },
    afterNodeClick(obj, node, component) {
      this.getMutiUpAddress(node);
      this.getInfrastructureUuid(node);
    },
    getInfrastructureUuid(node) {
      if (node.checked) {
        if (!this.infrastructureUuid) {
          this.infrastructureUuid = node.data.id;
        } else {
          this.infrastructureUuid = this.infrastructureUuid + "," + node.data.id;
        }
      } else {
        let array = this.infrastructureUuid.split(",");
        for (const [i, v] of array.entries()) {
          if (v === node.data.id) {
            array.splice(i, 1);
            break;
          }
        }
        this.infrastructureUuid = array.join(",");
      }
      this.$emit("setUseData", {
        infrastructureUuid: this.infrastructureUuid
      });
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
    getMutiUpAddress(node) {
      this.labelArr = [];
      this.upAddress = "";
      this.getLabelArr(node);
      this.getUpAddress(this.labelArr);
      if (node.checked) {
        if (!this.mutiUpAddress) {
          this.mutiUpAddress = this.upAddress;
        } else {
          this.mutiUpAddress = this.mutiUpAddress + "，" + this.upAddress;
        }
      } else {
        let array = this.mutiUpAddress.split("，");
        for (const [i, v] of array.entries()) {
          if (v === this.upAddress) {
            array.splice(i, 1);
            break;
          }
        }
        this.mutiUpAddress = array.join("，");
      }
      this.$emit("update:nodeText", this.mutiUpAddress);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    showPopover() {
      // this.initData();
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
    }
  },
  destroyed() {}
};
</script>
<style lang="scss">
.my-popover {
  height: 250px !important;
}
.i-tree-style-muti {
  .el-tree {
    background: #2a2e31 !important;
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
  }
}
</style>
