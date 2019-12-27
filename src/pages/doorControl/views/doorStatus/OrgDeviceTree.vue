<template>
  <div class="left-list-build">
    <el-scrollbar style="height: 68vh;transition:0.2s">
      <el-tree :data="treeData"
               :props="defaultProps"
               node-key="id"
               :indent="10"
               lazy
               :load="loadNode"
               ref="orgTree"
               :filter-node-method="filterNode"
               :default-expanded-keys="defaultExpKeys"
               :highlight-current="true"
               :expand-on-click-node="false"
               @node-click="handleNodeClick">
        <div class="custom-tree-node i-tree-item"
             slot-scope="{ node }">
          <div class="i-tree-item-icon">
            <img :src="icons.folder"
                 width="10.9px"
                 height="9px"
                 style="margin-right: 4px;">
            <div class="text-show" :title='node.label'>{{node.label}}</div>
          </div>
        </div>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
import icons from "@/common/js/icon.js";

export default {
  components: {},
  props: {
    filterText: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      icons,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      currentNodeId: null,
      isExpanded: false,
      currentNode: null,
      defaultExpKeys: []
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  activated() {
    this.initData();
  },
  methods: {
    initData() {
      this.getOrgDevTree();
    },
    getOrgDevTree(parentOrgUuid) {
      this.$logSearchHttp
        .getOrgDevTree({
          needType: "orgAndDev",
          orgType: window.config.orgType,
          parentOrgUuid: parentOrgUuid
        })
        .then(res => {
          let body = res.data;
          this.handleGetTreeSuccessResponse(body);
        });
    },
    handleGetTreeSuccessResponse(body) {
      if (body.data) {
        this.treeData = body.data;
        for (let item of body.data) {
          this.$set(item, "leaf", true);
          if (item.nextCount !== 0) {
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
        this.$refs.orgTree.setCurrentKey(id);
        this.$emit("setTreeRootData", {
          treeNodeData: this.treeData[0],
          nodeType: "organization",
          isNodeRoot: true
        });
      }, 200);
    },
    handleNodeClick(obj, node, component) {
      console.log(node);
      let nodeType = "";
      if (obj.hasOwnProperty("orgType")) {
        nodeType = "organization";
      } else {
        nodeType = "device";
      }
      this.$emit("setTreeRootData", {
        treeNodeData: node,
        nodeType: nodeType,
        isNodeRoot: false
      });
      this.currentNode = node;
      // this.expandedSet(node);
    },
    expandedSet(node) {
      if (this.currentNodeId && this.currentNodeId === node.id) {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
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
      this.$logSearchHttp
        .getOrgDevTree({
          needType: "orgAndDev",
          orgType: window.config.orgType,
          parentOrgUuid: node.data.id
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
              if (item.nextCount !== 0) {
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
      this.$logSearchHttp
        .getOrgDevTree({
          needType: "orgAndDev",
          orgType: window.config.orgType,
          parentOrgUuid: node.data.id
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
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.orgTree.filter(val);
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.left-list-build {
  .el-tree {
    background: rgba($color: #212326, $alpha: 1);
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.left-list-build {
  height: 85%;
  overflow-x: auto;
  .i-tree-item {
    width: 190px;
    .i-tree-item-icon {
      display: flex;
      align-items: center;
      .action-icon {
        margin-left: auto;
        margin-right: 5px;
        .img-div {
          cursor: pointer;
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }
}
</style>
