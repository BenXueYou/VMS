<template>
  <div class='left'
       id='VideoPlaybackContentLeft'>
    <div class="searchWrap">
      <el-input placeholder='搜索组织/标签/名称'
                v-model="searchText">
        <img slot="prefix"
             class="image"
             :src="icons.search"
             alt>
      </el-input>
      <img @click="showAddChildrenDialog"
           v-show="tabsIndex==2"
           :src="icons.add"
           alt>
    </div>

    <div class="treeSwitchTabs">
      <ul>
        <li :class="{'active':tabsIndex==0}"
            @click='switchTabs(0)'>设备树</li>
        <li :class="{'active':tabsIndex==1}"
            @click='switchTabs(1)'>标签</li>
        <li :class="{'active':tabsIndex==2}"
            @click='switchTabs(2)'>视图</li>
      </ul>
    </div>

    <div class="treeWrap">
      <div class="mypanel"
           v-show="tabsIndex==0">
        <el-tree ref="tree1"
                 :props="props"
                 :load="loadNode"
                 lazy
                 node-key="label"
                 show-checkbox
                 @check-change="handleCheckChange">
        </el-tree>
      </div>
    </div>

    <div class="timeSelect">
      <div class='startWrap'>
        <div class="label">
          从
        </div>
        <div class="time">
          <el-date-picker v-model="startDate"
                          type="datetime"
                          style='width:200px;'
                          placeholder="选择日期时间">
          </el-date-picker>
        </div>
      </div>
      <div class='startWrap'>
        <div class="label">
          到
        </div>
        <div class="time">
          <el-date-picker v-model="endDate"
                          type="datetime"
                          style='width:200px;'
                          placeholder="选择日期时间">
          </el-date-picker>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import icons from "@/common/icon.js";
export default {
  name: "leftwrap",
  data() {
    return {
      icons,
      searchText: "",
      tabsIndex: 0,
      props: {
        label: "name",
        children: "zones"
      },
      startDate: "",
      endDate: new Date()
    };
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      // 树上的节点选中发生了改变
      // console.log(data, checked, indeterminate);
      console.log(this.$refs.tree1.getCheckedNodes());
    },
    loadNode(node, resolve) {
      //  懒加载子结点
      if (node.level === 0) {
        return resolve([{ name: "广拓视频点位" }]);
      }
      if (node.level > 3) return resolve([]);

      var hasChild;
      if (node.data.name === "广拓视频点位") {
        hasChild = true;
      }

      setTimeout(() => {
        var data;
        if (hasChild) {
          data = [
            {
              name: "东门区域"
            },
            {
              name: "西门区域"
            },
            {
              name: "北门区域"
            }
          ];
        } else {
          data = [];
        }

        resolve(data);
      }, 500);
    },
    switchTabs(index) {
      this.tabsIndex = index;
    },
    showAddChildrenDialog() {}
  }
};
</script>
<style lang="scss">
@import "@/style/variables.scss";
#VideoPlaybackContentLeft {
  .el-tree-node__label {
    text-indent: 10px;
  }
  .el-tabs__item {
    color: #dddddd;
  }
  .el-tabs__nav-wrap::after {
    background: rgb(131, 131, 131);
  }
  .is-active {
    color: $add-text-color;
  }
  .el-input__prefix {
    position: absolute;
    left: 43px;
    top: 0px;
    img {
      margin-top: 9px;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.left {
  width: 280px;
  box-sizing: border-box;
  height: 100%;
  $iconWidth: 40px;
  background-color: rgba(35, 38, 41, 0.8);
  padding: 0px 40px;
  .timeSelect {
    .startWrap {
      display: flex;
      margin-bottom: 10px;
      .label {
        width: 20px;
        text-align: center;
        font-family: "PingFangSC-Regular";
        font-size: 13px;
        line-height: 30px;
        color: #ffffff;
      }
      .time {
        width: 8%;
        .input {
          width: 100%;
        }
      }
    }
  }
  .treeWrap {
    height: calc(100vh - 300px);
    overflow-y: auto;
  }

  .treeSwitchTabs {
    ul {
      display: flex;
      list-style: none;
      padding: 0px;
      li {
        text-align: center;
        flex: 1;
        background-color: rgba(38, 211, 157, 0.2);
        color: #fff;
        line-height: 40px;
        cursor: pointer;
      }

      .active {
        background: rgba(38, 211, 157, 0.8);
      }
    }
  }
  .searchWrap {
    padding: 25px 0px 10px 0px;
    .el-input {
      position: relative;
      width: calc(100% - 30px);
    }
    $addIconWidth: 14px;
    img {
      display: inline-block;
      vertical-align: middle;
      width: $addIconWidth;
      margin-left: 4px;
      cursor: pointer;
    }
  }
}
</style>
