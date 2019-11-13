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
        <el-input v-model="treeFilter"
                  @change="changeFilterText"
                  placeholder="搜索关键词"></el-input>
        <el-tabs v-model="activeName"
                 @tab-click="handleClickaaa">
          <el-tab-pane label="视频"
                       class="i-tree"
                       name="video">
            <el-tree :load="getNewTree"
                     node-key="id"
                     v-if="isShow"
                     :show-checkbox="false"
                     :props="defaultProps"
                     :expand-on-click-node="false"
                     @node-click="nodeClick"
                     :filter-node-method="filterNode"
                     lazy>
              <div class="custom-tree-node i-tree-item"
                   slot-scope="{ node}">
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
                       name="door">
            <el-tree :load="getNewTree"
                     node-key="id"
                     v-if="isShow"
                     :show-checkbox="false"
                     :props="defaultProps"
                     :expand-on-click-node="false"
                     @node-click="nodeClick"
                     :filter-node-method="filterNode"
                     lazy>
              <div class="custom-tree-node i-tree-item"
                   slot-scope="{ node}">
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
          <el-tab-pane label="报警"
                       name="alarm">
            <el-tree :load="getNewTree"
                     node-key="id"
                     v-if="isShow"
                     :show-checkbox="false"
                     :props="defaultProps"
                     :expand-on-click-node="false"
                     @node-click="nodeClick"
                     :filter-node-method="filterNode"
                     lazy>
              <div class="custom-tree-node i-tree-item"
                   slot-scope="{ node}">
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
          <el-tab-pane label="访客机"
                       name="visitor">
            <el-tree :load="getNewTree"
                     node-key="id"
                     v-if="isShow"
                     :show-checkbox="false"
                     :props="defaultProps"
                     :expand-on-click-node="false"
                     @node-click="nodeClick"
                     :filter-node-method="filterNode"
                     lazy>
              <div class="custom-tree-node i-tree-item"
                   slot-scope="{ node}">
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
        </el-tabs>
      </div>
      <div class="right">
        <el-tabs v-model="myname"
                 @tab-click="handleClick">
          <el-tab-pane :label="item.label"
                       class="i-tree"
                       v-for="(item,index) in switchTabs"
                       :key="index"
                       :name="item.id">
            <choose-pannel :enumArr="allData"
                           :allData="defaultExpandedKeys"></choose-pannel>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import * as api from "@/pages/user/http/ajax.js";
import choosePannel from "@/pages/user/components/choosePannel";
export default {
  name: "resouceTree",
  components: {
    choosePannel
  },
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
      treeFilter: "",
      isShow: false,
      activeName: "video",
      myname: "video",
      defaultProps: {
        children: "children",
        label: "label",
        id: "id",
        isLeaf: "leaf"
      },
      allData: ["查看", "设备对讲", "接收事件"], // a用来表示
      defaultExpandedKeys: [
        {
          id: 1,
          label: "测试",
          checkAll: false, // 辅助字段 判断是否全选
          checkedNum: ["查看"], // 辅助字段 判断选中哪些字段
          auth: {
            apiRule: "string",
            // api规则
            authUuid: "string",
            // 资源权限uuid
            authName: "string",
            // 资源权限名称
            authNo: "string",
            // 权限序号
            isOwn: "int"
            // 否拥有该权限0无，1有
          }
        },
        {
          id: 1,
          label: "测试",
          checkAll: false,
          isIndeterminate: false,
          checkedNum: ["查看"],
          auth: {
            apiRule: "string",
            // api规则
            authUuid: "string",
            // 资源权限uuid
            authName: "string",
            // 资源权限名称
            authNo: "string",
            // 权限序号
            isOwn: "int"
            // 否拥有该权限0无，1有
          }
        }
      ],
      // switchTabs: [
      //   {
      //     id: "video",
      //     label: "视频设备"
      //   },
      //   {
      //     id: "monitory",
      //     label: "监控点"
      //   },
      //   {
      //     id: "alarmIn",
      //     label: "报警输入"
      //   },
      //   {
      //     id: "alarmOut",
      //     label: "报警输出"
      //   }
      // ],
      chooseChannel: [
        {
          resourceUuid: "string",
          // 资源uuid
          resourceType: "string",
          // 资源类型
          auth: [
            {
              apiRule: "string",
              // api规则
              authUuid: "string",
              // 资源权限uuid
              authName: "string",
              // 资源权限名称
              authNo: "string",
              // 权限序号
              isOwn: "int"
              // 是否拥有该权限0无，1有
            }
          ]
        }
      ],
      cnt: 0
    };
  },
  computed: {
    switchTabs() {
      let resourceType = window.config.resourceType[this.activeName];
      // this.myname = resourceType[0].id;
      return resourceType;
    }
  },
  methods: {
    getResourceAuth() {
      // 这里来获取资源
      api.getResourceAuth({ resourceType: "" }).then(res => {
        console.log(res);
      });
    },
    changeFilterText() {},
    filterNode(obj, data) {},
    nodeClick(data, node, nodeTree) {
      //  新增节点的类型字段
      console.log(data, node, nodeTree);
      // 判断节点有没有被选中过，然后去更新选中的数组
      if (node.checked) {
        let index = this.defaultProps.indexOf(node.data.id);
        if (index !== -1) {
          this.defaultProps.splice(index, 1);
        }
      } else {
        let index = this.defaultProps.indexOf(node.data.id);
        if (index === -1) {
          this.defaultProps.push(node.data.id);
        }
      }
      // 更新节点点击选中的状态
      this.$set(node, "checked", !node.checked);
    },
    getTreeData(obj) {
      return new Promise(resolve => {
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
      console.log(node);
      // 先判断有没有子结点，有再继续请求下一个接口
      let data = {
        viewType: this.activeName,
        treeStructure: "orgNode$device|devNode|chnNode",
        authEnable: false,
        parentUuid: node.data ? node.data.id : "",
        parentType: node.data ? node.data.nodeType : "",
        recursiveEnable: false
      };
      if (!node.data || node.data.openFlag) {
        let num = await this.getTreeData(data);
        num = num.map(item => {
          item.leaf = !item.openFlag;
          return item;
        });
        resolve(num);
      } else {
        resolve([]);
      }
      //  这里需要将node的子结点拿出来判断是否被选中过
      for (let i = 0; i < node.childNodes.length; i++) {
        if (
          this.defaultExpandedKeys.some(item => {
            return item.id === node.childNodes[i].data.id;
          }).length
        ) {
          this.$set(node.childNodes[i], "checked", true);
        }
      }
    },
    handleClickaaa(tab, event) {},
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
<style lang="scss">
.showResource {
  .el-tabs__item {
    color: #fff;
  }
  .el-tabs__item.is-active {
    color: #26d39d;
  }
}
</style>

<style lang="scss" scoped>
$width: 300px;
@mixin paddinga {
  padding: 15px;
  box-sizing: border-box;
}
.showResource {
  .mywrap {
    display: flex;
    min-height: 500px;
    .left {
      flex: 3;
      @include paddinga;
    }
    .right {
      flex: 7;
      @include paddinga;
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
