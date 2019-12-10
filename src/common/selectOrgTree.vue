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
                width="300"
                popper-class="my-popover"
                @show="showPopver"
                trigger="click">
      <el-input placeholder="输入关键字进行过滤"
                v-model="filterText"
                style="margin-bottom: 10px;"
                size="small">
      </el-input>
      <el-scrollbar style="height: 87%;"
                    class="i-tree-style">
        <!-- <el-tree :data="data"
                 :props="defaultProps"
                 @node-click="handleNodeClick"></el-tree> -->
        <el-tree :data="data"
                 :props="defaultProps"
                 node-key="id"
                 lazy
                 :load="loadNode"
                 :filter-node-method="filterNode"
                 :indent="10"
                 :expand-on-click-node="false"
                 :default-expanded-keys="defaultExpKeys"
                 :default-checked-keys="checkedKeys"
                 ref="popoverTree"
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
import * as api from "@/pages/equipmentMange/ajax.js";
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
    orgUuid: {
      type: String,
      default: ""
    },
    orgType: {
      type: String,
      default: ""
    },
    aaaaaa: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      checkedKeys: [],
      treeData: [],
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      nodeText: "",
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "isLeaf"
      },
      defaultExpKeys: [],
      labelArr: [],
      upAddress: "",
      filterText: "",
      currentNode: "",
      subType: "",
      initAreaData: {
        type: Array,
        default: () => {}
      },
      checkedUuid: ""
    };
  },
  created() {},
  mounted() {
    this.showPopver();
    this.checkedUuid = this.aaaaaa;
  },
  methods: {
    showPopver() {
      // alert(1);
      let data = {};
      api.getOrgTree(data, this.orgType).then(res => {
        if (res.data.data) {
          let result = res.data.data || [];
          let maxSn = 0;
          for (let i = 0; i < result.length; i++) {
            if (result[i].nextCount === 0 || result[i].nextCount === "0") {
              result[i].isLeaf = true;
            }
            if (result[i].orgSn > maxSn) {
              maxSn = Math.max(result[i].orgSn, maxSn);
            }
          }
          this.$emit("setMaxSn", maxSn + 1);
          this.data = result;
        }
      });
    },
    initData() {
      // if (!this.initAreaData) {
      //   return;
      // }
      // this.treeData = [
      //   {
      //     id: this.initAreaData.id,
      //     label: this.initAreaData.label,
      //     type: this.initAreaData.type,
      //     version: this.initAreaData.version,
      //     children: []
      //   }
      // ];
      // this.treeData = this.initAreaData;
      // this.treeLevelRule = this.initAreaData.extInfo;
      // this.getInfrastructure(this.initAreaData.id);
    },
    loadNode(node, resolve) {
      console.log(node);
      if (node.level === 0) {
        return;
      }

      let data = { parentOrgUuid: node.data.orgUuid };
      api.getOrgTree(data, this.orgType).then(res => {
        if (res.data.data) {
          let result = res.data.data || [];
          let maxTagSn = 0,
            children = result;
          for (let i = 0; i < children.length; i++) {
            let sn = children[i].orgSn;
            if (maxTagSn < sn) {
              maxTagSn = sn;
            }
          }
          for (let i = 0; i < result.length; i++) {
            if (result[i].nextCount === 0 || result[i].nextCount === "0") {
              result[i].isLeaf = true;
            }
          }
          this.$emit("setMaxSn", maxTagSn + 1);
          resolve(result);
        } else {
          resolve([]);
        }
        this.jugdeChecked(node);
      });
    },
    jugdeChecked(node) {
      console.log(node);
      if (node.data.id === this.checkedUuid) {
        this.$set(node, "checked", true);
      } else {
        this.$set(node, "checked", false);
      }
      if (node.parent) {
        this.jugdeChecked(node.parent);
      }
      if (node.children) {
        this.jugdeChecked(node.children);
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
      }
      this.handleDefaultExpKeys();
    },
    handleDefaultExpKeys() {
      if (this.treeData && this.treeData.length !== 0) {
        this.defaultExpKeys.push(this.treeData[0].id);
      }
    },
    handleNodeClick(obj, node, component) {
      this.checkedUuid = node.data.id;
      this.jugdeChecked(node);
      let maxTagSn = -1000,
        children = node.childNodes;
      for (let i = 0; i < children.length; i++) {
        let sn = children[i].data.orgSn;
        if (maxTagSn < sn) {
          maxTagSn = sn;
        }
      }
      this.currentNode = node;
      this.labelArr = [];
      this.upAddress = "";
      this.judgeSubLevel(this.currentNode);
      this.getLabelArr(node);
      this.getUpAddress(this.labelArr);
      this.nodeText = this.upAddress;
      this.$emit("setUseData", {
        node: this.currentNode,
        subType: this.subType
      });
    },
    judgeSubLevel(node) {
      if (!node || !this.treeLevelRule || this.treeLevelRule.length === 0) {
        return;
      }
      let subLevel;
      for (let item of this.treeLevelRule) {
        if (node.level === parseInt(item.level)) {
          subLevel = parseInt(item.level) + 1;
        }
      }
      for (let item of this.treeLevelRule) {
        if (subLevel === parseInt(item.level)) {
          this.subType = item.type;
        }
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
    }
  },
  watch: {
    aaaaaa() {
      this.checkedUuid = this.aaaaaa;
       console.log(this.aaaaaa);
    },
    visible(val) {
      if (val) {
        this.nodeText = this.name;
        if (this.orgUuid) {
          this.checkedKeys = [this.orgUuid];
        }
      } else {
        this.nodeText = "";
      }
    },
    filterText(val) {
      this.$refs.popoverTree.filter(val);
    },
    initAreaData: {
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
      // display: none;
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
