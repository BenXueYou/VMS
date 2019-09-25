<template>
  <div class="unit-left-tree">
    <div class="tree-input">
      <el-input placeholder="搜索期号／楼栋／单元"
                v-model="filterText"
                style="width: 95%">
        <img slot="prefix"
             :src="icons.search">
      </el-input>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="楼栋单元"
                   name="first"
                   style="height: 68vh;"
                   class="i-tree">
        <el-scrollbar style="height: 100%;transition:0.2s">
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
            <div class="custom-tree-node i-tree-item"
                 slot-scope="{ node }">
              <div class="i-tree-item-icon">
                <img :src="iconShow(node)"
                     width="10.9px"
                     height="9px"
                     style="margin-right: 4px;">
                {{ node.label }}
              </div>
            </div>
          </el-tree>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
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
      filterText: "",
      activeName: "first",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      currentNodeId: null,
      isExpanded: false,
      currentNode: null,
      defaultExpKeys: [],
      lastLevelType: ""
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
      this.getInfrastructure(body.data.id);
      this.setLastLevelType(body.data.extInfo);
    },
    setLastLevelType(data) {
      if (!data) {
        return;
      }
      for (let index in data) {
        if (parseInt(index) === data.length - 1) {
          this.lastLevelType = data[index].type;
          this.$emit("setLastLevelType", this.lastLevelType);
        }
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
    handleDefaultExpKeys() {
      if (this.treeData && this.treeData.length !== 0) {
        this.defaultExpKeys.push(this.treeData[0].id);
      }
    },
    setDefaultSelectedKey(id) {
      setTimeout(() => {
        this.$refs.buildingTree.setCurrentKey(id);
        this.$emit("setTreeRootData", this.treeData[0]);
      }, 200);
    },
    handleNodeClick(obj, node, component) {
      console.log(node);
      this.$emit("setTreeRootData", obj);
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
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return;
      }
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
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.buildingTree.filter(val);
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.unit-left-tree {
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
  .el-tabs__nav-wrap::after {
    background-color: rgba($color: #ffffff, $alpha: 0.15);
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.unit-left-tree {
  // width: 15%;
  width: 320px !important;
  height: 100%;
  background: rgba($color: #232629, $alpha: 0.8);
  padding: 0 1%;
  box-sizing: border-box;
  .tree-input {
    height: 90px;
    display: flex;
    align-items: center;
    .image {
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .i-tree {
    padding: 10px 0;
    box-sizing: border-box;
    .i-tree-item {
      width: 100%;
      .i-tree-item-icon {
        display: flex;
        align-items: center;
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
