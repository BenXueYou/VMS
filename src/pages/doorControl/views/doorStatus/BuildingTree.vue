<template>
	<div class="left-list-build">
		<el-scrollbar style="height: 68vh;transition:0.2s">
			<el-tree
				:data="treeData"
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
				@node-click="handleNodeClick"
			>
				<div class="custom-tree-node i-tree-item" slot-scope="{ node }">
					<div class="i-tree-item-icon">
						<img :src="iconShow(node)" width="10.9px" height="9px" style="margin-right: 4px;" />
						<div class="text-show" :title="node.label">{{node.label}}</div>
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
      defaultExpKeys: [],
      lastLevelType: "",
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("门状态", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("门状态", "isOwn");
    this.initData();
  },
  activated() {
    this.initData();
  },
  methods: {
    handleClick() {},
    initData() {
      if (!this.ShowAuthDisabled) return;
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
          nodeType: body.data.nodeType,
          type: body.data.type,
          children: []
        }
      ];
      this.getInfrastructureToDevice(body.data.id);
      this.setLastLevelType(body.data.extInfo);
    },
    setLastLevelType(data) {
      if (!data) {
        return;
      }
      for (let index in data) {
        if (parseInt(index) === data.length - 1) {
          this.lastLevelType = data[index].nodeType;
        }
      }
    },
    getInfrastructureToDevice(parentUuid) {
      this.$houseHttp
        .getInfrastructureToDevice({
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
          if (item.nextCount !== 0 && item.nodeType !== this.lastLevelType) {
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
        this.$emit("setTreeRootData", {
          treeNodeData: this.treeData[0],
          nodeType: "infrastructure",
          isNodeRoot: true
        });
      }, 200);
    },
    handleNodeClick(obj, node, component) {
      console.log(node);
      // let isNodeRoot = false;
      // if (node.level === 1 || node.level === 0) {
      //   isNodeRoot = true;
      // }
      let nodeType = "";
      if (obj.type === "infrastructure") {
        nodeType = obj.type;
      } else {
        nodeType = "device";
      }
      this.$emit("setTreeRootData", {
        treeNodeData: node,
        nodeType: nodeType,
        isNodeRoot: false
      });
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
        .getInfrastructureToDevice({
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
              if (
                item.nextCount !== 0 &&
								item.nodeType !== this.lastLevelType
              ) {
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
        .getInfrastructureToDevice({
          parentUuid: node.data.id
        })
        .then(res => {
          if (!res.data.data) {
            resolve([]);
          } else {
            for (let item of res.data.data) {
              this.$set(item, "leaf", true);
              if (
                item.nextCount !== 0 &&
								item.nodeType !== this.lastLevelType
              ) {
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
        if (node.data.type === "access_ctrl") {
          icon = require(`@/assets/images/building/access_ctrl.png`);
        } else if (node.data.type === "unknown") {
          icon = "";
        } else {
          let nodeType = node.data.nodeType;
          icon = require(`@/assets/images/building/${nodeType}.png`);
        }
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
