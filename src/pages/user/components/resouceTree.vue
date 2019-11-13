<template>
  <el-dialog :title='title'
             @close="close"
             width="1000px"
             :class="{'dialogCenter':true}"
             :close-on-click-modal="false"
             :append-to-body="true"
             class="showResource"
             :visible.sync="isShow">
    <div class="mywrap">
      <div class="left">
        <el-tabs v-model="activeName"
                 @tab-click="handleClick">
          <el-tab-pane label="视频"
                       class="i-tree"
                       name="video">
            <el-tree :load="getNewTree"
                     node-key="id"
                     :show-checkbox="false"
                     :props="defaultProps"
                     :expand-on-click-node="false"
                     @node-click="nodeClick"
                     :filter-node-method="filterNode"
                     lazy>
              <div class="custom-tree-node i-tree-item"
                   slot-scope="{ node, data}">
                <div class="i-tree-item-icon">
                  {{ node.label }}
                  <template>
                    <img v-if="(node.checked)"
                         src="@/assets/images/doorAccess/checked_icon.png"
                         width="10.9px"
                         height="9px"
                         style="margin-right: 20%;">
                  </template>
                </div>
              </div>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="门禁"
                       name="door"></el-tab-pane>
          <el-tab-pane label="报警"
                       name="alarm"></el-tab-pane>
          <el-tab-pane label="访客机"
                       name="visitor"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="right">
        2
      </div>
    </div>
  </el-dialog>
</template>

<script>
import * as api from "../http/ajax";
export default {
  name: "resouceTree",
  props: {
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return "关联的通道资源";
      }
    }
  },
  data() {
    return {
      isShow: false,
      activeName: "video",
      defaultProps: {
        children: "children",
        label: "label",
        id: "id",
        isLeaf: "isLeaf"
      },
      defaultExpandedKeys: [2],
      cnt: 0
    };
  },
  methods: {
    filterNode(obj, data) {},
    nodeClick(data, node, nodeTree) {
      //  新增节点的类型字段
      console.log(data, node, nodeTree);
      this.$set(node, "checked", !node.checked);
    },
    getTreeData() {
      return new Promise(resolve => {
        let obj = {
          viewType: "video", // 不填则查所有类型资源 门禁 door、视频 video、报警 alarm、访客机 visitor
          treeStructure:
            "orgNode$orgType|devNode[$...devType]|chnNode[[$...chnType]]", // 树结构，指定树的类型及树的结构
          authEnable: false, // 是否开启权限过滤，默认开启true
          parentUuid: "fb6a1a0ad9b444bba4d5b5be1015c43d", // 查询的树节点UUID，默认根节点
          parentType: "orgNode", // 查询的树节点类型。组织 org[默认]、设备 dev、通道 chn
          recursiveEnable: true // 是否递归查询子节点的资源，默认不查询false
        };
        api
          .getNewTree(obj)
          .then(res => {
            console.log(res);
            let data = res.data.data || [];
            resolve(data);
          })
          .catch(() => {
            resolve([]);
          });
      });
    },
    async getNewTree(node, resolve) {
      this.$set(node, "checked", true);
      resolve([
        {
          id: this.cnt++,
          label: "测试数据" + this.cnt
        }
      ]);
      // // 先判断有没有子结点，有再继续请求下一个接口
      // if (node.data.openFlag) {
      //   let data = await getTreeData();
      //   resolve(data);
      // } else {
      //   resolve([]);
      // }
    },
    handleClick(tab, event) {
      console.log(tab, event);
      // 这里添加判断，如果点击的不是要选中的节点类型，则不进行处理
    },
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible() {
      this.isShow = this.visible;
    }
  }
};
</script>
<style lang="scss" scoped>
$width: 300px;
.showResource {
  .mywrap {
    display: flex;
    min-height: 500px;
    .left {
      flex: 3;
    }
    .right {
      flex: 7;
    }
  }
}
.i-tree {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 10px 0;
  box-sizing: border-box;
  overflow: auto;
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
</style>
