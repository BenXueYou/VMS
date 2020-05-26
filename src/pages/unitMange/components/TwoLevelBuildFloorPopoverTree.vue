<template>
  <div class="popover-tree">
    <el-input v-model="nodeText"
              :style="`width: ${width}`"
              v-popover:popover
              placeholder="请选择楼栋单元"
              readonly
              id="i-input"
              :clearable="true"
              size="small"></el-input>
    <el-popover ref="popover"
                placement="bottom-start"
                @show="showPopover"
                width="230"
                v-model="isShowPopover"
                popper-class="my-popover"
                trigger="manual">
      <el-input placeholder="输入关键字进行过滤"
                v-model="filterText"
                style="margin-bottom: 10px;"
                size="small">
      </el-input>
      <el-scrollbar style="height: 87%;"
                    class="i-tree-style">
        <el-tree :data="AreaTreeData"
                 node-key="id"
                 :props="AreaProps"
                 v-if="isShowTree"
                 ref="ResidentTree"
                 :filter-node-method="filterNode"
                 default-expand-all
                 @node-click="handleNodeClick"
                 :expand-on-click-node="false">
          <div class="i-tree-item"
               style="width:100%;"
               slot-scope="{ node, data }">
            <div class="i-tree-item-icon flex-sbt">
              <div class="text-show"
                   style="width: 100px;"
                   :title="node.label">
                <!-- isHaveChild表示展开项目，有没有根节点 -->
                <!-- 有三角箭头的需要是项目结构 -->
                <!-- 或者不是组织节点并且有nextCount -->
                <span v-if="((data.type=='project')||(data.type!='areaOrg'&&data.nextCount))&&!(data.children&&data.children.length)"
                      @click.stop="getProjectChildTree(node,data)"
                      class="el-tree-node__expand-icon el-icon-caret-right"></span>
                <img v-if="data.type === 'project'"
                     src="@/assets/icon/area_tree_last_node.png"
                     style="margin-right:3px"
                     alt="">
                <img v-else
                     src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAJCAYAAADkZNYtAAAAAXNSR0IArs4c6QAAAFJJREFUGBljXLVq1WUGBgYdIAYDRkbGef///88JCwv7DhOD0YxAxf9hHCT6HVDTZyQ+A9CAKyzIAkhsIaCkEBIfxJRnQhPAyx2qiq/g9RVC8goA5EYWrRlv3uIAAAAASUVORK5CYII="
                     width="10.9px"
                     height="9px"
                     style="margin-right: 4px;" />{{ node.label }}
              </div>
            </div>
          </div>
        </el-tree>
      </el-scrollbar>
    </el-popover>
  </div>
</template>

<script>
import TheLeftmenu from "@/pages/AreaManagement/views/leftWrap";
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  components: { TheLeftmenu },
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
      AreaTreeData: [],
      // nodeText: "",
      AreaProps: {
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
      isShowPopover: false,
      lastNodeDataType: "",
      isShowTree: true
    };
  },
  created() {},
  mounted() {
    this.getAreaData();
    document.getElementById("i-input").addEventListener("click", e => {
      e.stopPropagation();
      this.isShowPopover = !this.isShowPopover;
    });
  },
  methods: {
    getProjectChildTree(node, data) {
      if (!data.children) {
        this.$set(data, "children", []);
      }
      if (data.type === "project") {
        data.projectUuid = data.id;
        console.log(data);
        this.getAreaStruct(data);
      } else {
        this.loadNode(node, data);
      }
    },

    handleNodeClick(data, node, component) {
      // 判断非区域组织节点击
      if (data.type !== "areaOrg" && data.type !== "project") {
        if (!this.isAllCanSelected) {
          if (data.type === this.lastLevelType) {
            this.afterNodeClick(data, node, component);
          }
        } else {
          this.afterNodeClick(data, node, component);
        }
      }
    },
    getAreaData() {
      this.AreaTreeData = [];
      api
        .getAreaAllOrg({
          // parentOrgUuid: this.parentOrgUuid,
          orgType: "areaOrg"
        })
        .then(res => {
          let result = res.data.data || [];
          this.AreaTreeData = result;
        });
    },
    getAreaStruct(data) {
      this.$houseHttp
        .getAreaStructByProjectUuid(data.projectUuid, {})
        .then(res => {
          let body = res.data || {};
          let newArr = [];
          if (body.data && body.data.id) {
            newArr.push({
              id: body.data.id,
              label: body.data.label,
              projectUuid: data.projectUuid,
              type: body.data.type,
              children: [],
              nextCount: 1
            });
          }
          let extInfo = body.data.extInfo;
          if (extInfo && extInfo.length) {
            this.lastNodeDataType = extInfo[extInfo.length - 1].type;
          }
          this.$set(data, "children", newArr);
        });
    },
    loadNode(node, data) {
      let parentUuid = data.id;
      this.$houseHttp
        .getInfrastructureByProjectUuid(data.projectUuid, {
          parentUuid
        })
        .then(res => {
          let newArr = res.data.data || [];
          let newData = newArr.map(item => {
            // 记录projectUuid
            item.projectUuid = data.projectUuid;
            if (item.nextCount !== 0 && item.type === this.lastNodeDataType) {
              this.$set(item, "leaf", true);
              this.$set(item, "children", false);
              this.$set(item, "nextCount", 0);
            }
            return item;
          });
          console.log(data);
          data.children.push(...(newData || []));
        });
    },
    afterNodeClick(obj, node, component) {
      this.currentNode = node;
      this.labelArr = [];
      this.upAddress = "";
      this.getLabelArr(node);
      this.getUpAddress(this.labelArr);
      this.$emit("update:nodeText", this.upAddress);
      // this.nodeText = this.upAddress;
      this.$emit("setUseData", {
        node: this.currentNode
      });
    },
    isShowImg(node) {
      let isShow = true;
      if (!this.isAllCanSelected) {
        if (node.data.type === this.lastLevelType) {
          isShow = true;
        } else {
          isShow = false;
        }
      }
      return isShow;
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
      this.getAreaData();
    }
  },
  watch: {
    filterText(val) {
      this.$refs.popoverTree.filter(val);
    },
    initTreeRootData: {
      handler(val) {
        this.getAreaData();
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
.i-tree-style {
  overflow-x: auto;
  .el-tree {
    background: #2a2e31 !important;
    overflow-x: hidden;
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
