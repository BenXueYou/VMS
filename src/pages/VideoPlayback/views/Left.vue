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
      <!-- <img @click="showAddChildrenDialog"
           v-show="tabsIndex==2"
           :src="icons.add"
           alt> -->
    </div>
    <el-tabs v-model="activeName"
             class="tabs"
             @tab-click="handleClick">
      <el-tab-pane label="设备树"
                   class="mypanel"
                   name="organiza">
        <el-tree :props="devprops"
                 :load="devloadNode"
                 ref="tree1"
                 lazy
                 show-checkbox
                 @check-change="devhandleCheckChange">
          <div class="custom-tree-node"
               slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <!-- v-if="data.hasOwnProperty('channelType')" -->
            <el-dropdown trigger="click"
                         @command="handleCommand"
                         placement="bottom"
                         class='threelinemenu'>
              <span class="el-dropdown-link"
                    @click="saveClickData(node, data)">
                <img class="checked-img"
                     src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAAAXNSR0IArs4c6QAAAGxJREFUGBmlj7EJgEAQBPf8F+ENTBQMbEBsytRm7EQwF0sxMREzG/hbv4SD33h2YGTksRMywLACvDxQLSViY+ChwGfh8hhJDWtS9DaN3L6A24jYWg6Eey1cHiMTz1khnUUj0McrGAitLYfUEH75HhuBIHOOjAAAAABJRU5ErkJggg=="
                     style="margin-right: 20%;">
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="video">打开视频</el-dropdown-item>
                <el-dropdown-item command="playback">查看录像</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-tree>
      </el-tab-pane>
      <el-tab-pane label="标签"
                   name="tag">
        <el-tree :props="tagprops"
                 :load="tagloadNode"
                 :expand-on-click-node="false"
                 lazy
                 :indent="10"
                 ref="tree2"
                 show-checkbox
                 @check-change="taghandleCheckChange"
                 @node-click="taghandleNodeClick">

        </el-tree>

      </el-tab-pane>
      <el-tab-pane label="视图"
                   name="view">
        <el-tree :props="viewProps"
                 :data="viewTreeData"
                 refs="tree3"
                 @check-change="viewhandleCheckChange">
          <div class="custom-tree-node"
               slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <el-dropdown trigger="click"
                         @command="handleCommand"
                         placement="bottom"
                         class='threelinemenu'>
              <span class="el-dropdown-link"
                    @click="saveClickData(node, data)">
                <img class="checked-img"
                     src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAAAXNSR0IArs4c6QAAAGxJREFUGBmlj7EJgEAQBPf8F+ENTBQMbEBsytRm7EQwF0sxMREzG/hbv4SD33h2YGTksRMywLACvDxQLSViY+ChwGfh8hhJDWtS9DaN3L6A24jYWg6Eey1cHiMTz1khnUUj0McrGAitLYfUEH75HhuBIHOOjAAAAABJRU5ErkJggg=="
                     style="margin-right: 20%;">
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="view">打开视图</el-dropdown-item>
                <el-dropdown-item command="renameView">重命名</el-dropdown-item>
                <el-dropdown-item command="deleteView">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-tree>
      </el-tab-pane>
    </el-tabs>

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
      <div class="startWrap">
        <el-button type="primary"
                   @click='search'
                   style='margin:0px auto;'>查询</el-button>
      </div>
    </div>
    <tree-change-name-dialog @confirm="changeName"
                             :value="nodeValue"
                             title="视图重命名"
                             :visible.sync="changeNameDialogVisible"></tree-change-name-dialog>
    <confirm-dialog :visible.sync="isDeleteVisible"
                    @confirm="deleteNode"
                    confirmText="确定该删除该视图吗"></confirm-dialog>
  </div>
</template>
<script>
import icons from "@/common/icon.js";
import * as api from "@/pages/equipmentMange/ajax.js";
import * as api2 from "@/pages/VideoPreview/ajax.js";
import TreeChangeNameDialog from "@/common/TreeChangeNameDialog";
import ConfirmDialog from "@/common/ConfirmDialog";
export default {
  name: "leftwrap",
  props: {
    tagType: {
      type: String,
      default() {
        return window.config.tagType;
      }
    }
  },
  components: {
    TreeChangeNameDialog,
    ConfirmDialog
  },
  data() {
    let d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    return {
      changeNameDialogVisible: false,
      isDeleteVisible: false,
      nodeValue: "",
      icons,
      searchText: "",
      tabsIndex: 0,
      devprops: {
        label: "label",
        isLeaf: "leaf"
      },
      props: {
        label: "name"
      },
      startDate: d,
      endDate: new Date(),
      tagprops: {
        label: "label",
        isLeaf: "leaf"
      },
      viewProps: {
        label: "viewName"
      },
      activeName: "organiza",
      viewTreeData: [],
      operatorData: {}
    };
  },
  methods: {
    deleteNode() {
      // 删除该视图 this.operatorData
      api2.deleteView(this.operatorData.viewUuid).then(res => {
        if (res.data.success) {
          this.$message.success("删除成功！");
        } else {
          this.$message.error(res.data.msg);
        }
        this.getViewTree();
      });
    },
    changeName(name) {
      // 修改视图的名字
      console.log(name, this.operatorData);
      this.operatorData.viewInfo.view_name = name;
      this.$emit("updateView", this.operatorData);
    },
    saveClickData(node, data) {
      // 点击三角菜单保存树节点信息
      this.operatorData = data;
    },
    handleCommand(command) {
      console.log(command);
      console.log(this.operatorData);
      if (command === "video") {
        // 打开视频操作
        // this.getPreviewInfo(this.operatorData.channelUuid);
      } else if (command === "playback") {
      } else if (command === "view") {
        this.$emit("openView", this.operatorData);
      } else if (command === "renameView") {
        this.nodeValue = this.operatorData.viewName;
        this.changeNameDialogVisible = true;
      } else if (command === "deleteView") {
        this.isDeleteVisible = true;
      }
    },
    getPreviewInfo(channelUuid) {
      api2
        .getPreviewInfo({
          channelUuid,
          streamType: "string"
        })
        .then(res => {
          console.log(res);
          // 这里会得到rtsp的码流地址，然后进行一些操作
        });
    },
    viewhandleCheckChange() {
      console.log(this.$refs.tree3.getCheckedNodes());
    },
    handleClick(tab) {
      if (tab.index === "0") {
      } else if (tab.index === "1") {
      } else if (tab.index === "2") {
        this.getViewTree();
      }
    },
    getViewTree() {
      api2
        .getView({
          viewUuid: "",
          viewType: "playback"
        })
        .then(res => {
          console.log(res);
          let data = res.data.data;
          let list = (data && data.list) || [] || [];
          this.viewTreeData = list
            .filter(item => {
              return item.viewType === "playback";
            })
            .map(item => {
              item.viewName = item.viewInfo.view_name;
              return item;
            });
        });
    },
    handleCheckChange(data, checked, indeterminate) {
      // 树上的节点选中发生了改变
      // console.log(data, checked, indeterminate);
      console.log(this.$refs.tree1.getCheckedNodes());
      this.deal();
    },
    deal() {},
    async devloadNode(node, resolve) {
      //  懒加载子结点
      console.log(node);
      let data = await this.videoTree(node.data && node.data.id);
      data = data.map(item => {
        item.leaf = !!item.openFlag;
        return item;
      });
      data = [
        {
          label: "测试",
          id: "49D2B7299EAAA3AF295E33F03B982D32",
          h5Type: "channel",
          leaf: true
        }
      ];
      return resolve(data);
    },
    videoTree(parentOrgUuid) {
      let data = parentOrgUuid ? { parentOrgUuid } : {};
      return new Promise((resolve, reject) => {
        api2
          .videoTree(data)
          .then(res => {
            let list = res.data.data || [];
            resolve(list);
          })
          .catch(err => {
            console.log(err);
            resolve([]);
          });
      });
    },
    devhandleCheckChange() {
      console.log(this.$refs.tree1.getCheckedNodes());
    },
    taghandleCheckChange() {
      console.log(this.$refs.tree2.getCheckedNodes());
      // this.deal();
    },
    taghandleNodeClick() {
      // 点击展开
    },
    async tagloadNode(node, resolve) {
      // 加载子结点
      console.log(node);
      if (node.level === 0) {
        let data = await this.getTagTreeData();
        console.log(data);
        return resolve(data);
      } else if (node.level === 1) {
        let data = await this.getChannelByNode(node.data.id);
        return resolve(data);
      }
    },
    getChannelByNode(tagUuid) {
      return new Promise((resolve, reject) => {
        api
          .getChannelByTag({
            tagUuid,
            page: 1,
            limit: 11111
          })
          .then(res => {
            let list = (res.data.data.list || []).map(item => {
              item.label = item.channelName;
              item.id = item.channelUuid;
              // item.id = item.deviceUuid;
              item.leaf = true;
              return item;
            });
            resolve(list);
          });
      });
    },
    getTagTreeData() {
      return new Promise((resolve, reject) => {
        api
          .getTagList({
            tagType: this.tagType
          })
          .then(res => {
            let list = res.data.data.list || [];
            resolve(list);
          });
      });
    },
    switchTabs(index) {
      this.tabsIndex = index;
    },
    search() {
      // 判断两个日期是不是同一天
      let d1 = new Date(this.startDate);
      let d2 = new Date(this.endDate);
      if (
        d1.getFullYear() !== d2.getFullYear() ||
        d1.getMonth() !== d2.getMonth() ||
        d1.getDate() !== d2.getDate()
      ) {
        this.$message.error("请选择同一天时间！");
        return;
      }
      // 获取树选中的节点
      let treeData = [];
      if (this.activeName === "organiza") {
        treeData = this.$refs.tree1.getCheckedNodes();
      } else if (this.activeName === "tag") {
        treeData = this.$refs.tree2.getCheckedNodes();
      } else if (this.activeName === "view") {
        treeData = this.$refs.tree3.getCheckedNodes();
      }
      console.log(treeData);
      if (!treeData.length) {
        this.$message.error("请选择视频通道!");
        return;
      }
      this.$emit("playRtsp", treeData, this.startDate, this.endDate, "main");
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
  .custom-tree-node {
    width: 100%;
    .threelinemenu {
      display: none;
      float: right;
      margin-right: 10px;
    }
    &:hover .threelinemenu {
      display: block;
    }
  }
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
  .treeWrap,
  .tabs {
    height: calc(100vh - 350px);
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
