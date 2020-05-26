<template>
  <div class='VideoPlaybackContentLeft'
       id='VideoPlaybackContentLeft'>
    <div class="searchWrap">
      <el-input placeholder='搜索组织/标签/名称'
                :disabled="!OwnAuthDisabled"
                v-model="searchText">
        <img slot="prefix"
             class="image"
             :src="icons.search"
             alt>
      </el-input>
    </div>
    <el-tabs v-model="activeName"
             class="tabs"
             @tab-click="handleClick">
      <el-tab-pane label="设备树"
                   class="mypanel"
                   :class="{'showMaxWidth':!showMaxWidth}"
                   name="organiza">
        <el-tree :props="devprops"
                 :load="devloadNode"
                 :data="treeData"
                 :default-expanded-keys="defaultExpKeys"
                 :filter-node-method="filterNode"
                 ref="tree1"
                 show-checkbox
                 class='videoTree'
                 node-key="id"
                 :default-checked-keys="defaultExpandedKeys">
          <div class="custom-tree-node"
               slot-scope="{ node,data }">
            <div class="channelStatus">
              <span v-if="((data.type!='areaOrg'&&data.openFlag)||(data.type=='project' && !data.isHaveRoot))&&(!data.children)"
                    @click.stop="getProjectChildTree(node,data)"
                    class="initExpandIcon el-tree-node__expand-icon el-icon-caret-right"></span>
              <img :src="data.icon"
                   v-if="data.icon"
                   alt="">
              <span :class="{'channelOffline':!data.isOnline&&(data.type!='areaOrg'&&data.type!='project'&&data.resType!='organization')}">{{ node.label }}</span>
            </div>
          </div>
        </el-tree>
      </el-tab-pane>
      <el-tab-pane label="视图"
                   name="view">
        <el-tree :props="viewProps"
                 class='videoTree2 videoTree3'
                 :data="viewTreeData"
                 :filter-node-method="filterNode"
                 ref="tree3"
                 @check-change="viewhandleCheckChange">
          <div class="custom-tree-node viewTree"
               @dblclick.stop="openView(data,$event)"
               slot-scope="{ node, data }">
            <span class="span"
                  :title="node.label">{{ node.label }}</span>
            <el-dropdown v-if="OwnAuthDisabled" trigger="click"
                         @command="handleCommand"
                         placement="bottom"
                         class='threelinemenu'>
              <span class="el-dropdown-link"
                    @click="saveClickData(node, data)">
                <img class="checked-img"
                     v-if="OwnAuthDisabled"
                     src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAAAXNSR0IArs4c6QAAAGxJREFUGBmlj7EJgEAQBPf8F+ENTBQMbEBsytRm7EQwF0sxMREzG/hbv4SD33h2YGTksRMywLACvDxQLSViY+ChwGfh8hhJDWtS9DaN3L6A24jYWg6Eey1cHiMTz1khnUUj0McrGAitLYfUEH75HhuBIHOOjAAAAABJRU5ErkJggg=="
                     style="margin-right: 20%;">
                <img class="checked-img"
                     v-else
                     src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA7UlEQVRYR+2VPQrCQBBGvy1E2DbVTAptJbaWgkfw5wSW4n1SewJzBMHSwk6bNNpM2mCpgUgKQSXbCEMi7PY73+PtzKxBw8c0nA8P4A20y4CI7ABMNCfDGLMhouUr48OAiBwAjJQBTkQ0rAXIsqxfFEVfE8BaewyC4FYLoBnsqt2uJvQGKgMi0tM0wczX9/rfY7gFMNMEALBl5oVrDyQApsoACTPPnWNY7QJNACK6OJ9AM9jvgf8wkKZp11o71uyFPM/3URTdXWN4BjDQBABwZubIBRADWNUAPH6E6nzfK8syDsNw7b9jb8AbaI2BJ65iOiHBES+mAAAAAElFTkSuQmCC"
                     style="width:12px;margin-right: 20%;">
              </span>
              <el-dropdown-menu v-if="OwnAuthDisabled" slot="'dropdown'">
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
                          @change="changeTime"
                          style='width:175px;'
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
                          @change="changeTime"
                          style='width:175px;'
                          placeholder="选择日期时间">
          </el-date-picker>
        </div>
      </div>
      <div class="startWrap">
        <el-button type="primary"
                   @click='search'
                   :disabled="!OwnAuthDisabled"
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
    ShowAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    OwnAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
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
      treeData: [],
      defaultExpKeys: [],
      defaultExpandedKeys: [],
      changeNameDialogVisible: false,
      isDeleteVisible: false,
      showMaxWidth: false,
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
  watch: {
    searchText(val) {
      if (this.activeName === "organiza") {
        this.$refs.tree1.filter(val);
      } else if (this.activeName === "tag") {
        this.$refs.tree2.filter(val);
      } else {
        this.$refs.tree3.filter(val);
      }
    }
  },
  mounted() {
    this.getAreaData();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      let returnVal = false;
      if (this.activeName === "view") {
        returnVal = data.viewName.indexOf(value) !== -1;
      } else {
        returnVal = data.label.indexOf(value) !== -1;
      }
      return returnVal;
    },
    getProjectChildTree(node, data) {
      let params = {
        parentUuid: data.id,
        parentType: data.nodeType
      };
      if (data.type === "project") {
        api2.getPlayTreeByProjectUuid(data.id).then(res => {
          let newArr = res.data.data || [];
          newArr.map(item => {
            item.parentUuid = data.id;
            return item;
          });
          if (!data.children) {
            this.$set(data, "children", []);
          }
          this.$set(node, "expanded", true);
          if (newArr[0] && !newArr[0].parentUuid) {
            this.$set(data, "isHaveRoot", true);
            return;
          }
          // data.children.push(...(newArr || []));
          console.log(newArr);
          params.parentUuid = newArr[0].id;
          data.parentUuid = newArr[0].parentUuid;
          params.parentType = newArr[0].nodeType;
          this.httpLoadNextNodeData(node, data, params);
        });
      } else {
        this.httpLoadNextNodeData(node, data, params);
      }
    },
    // 请求树下级节点的方法
    httpLoadNextNodeData(node, data, params) {
      api2.getPlayTreeByProjectUuid(data.parentUuid, params).then(res => {
        let newArr = res.data.data || [];
        newArr.map(item => {
          item.parentUuid = data.parentUuid;
          item.isOnline = true;
          if (item.nodeType === "chnNode") {
            item.isOnline = item.extInfo.chnOnlineOrNot === "online";
          }
          if (item.nodeType === "devNode") {
            item.isOnline = item.extInfo.devOnlineOrNot === "online";
          }
          item.icon = this.getIcon(item.isOnline, item.realType);
          return item;
        });
        if (!data.children) {
          this.$set(data, "children", []);
        }
        data.children.push(...(newArr || []));
        this.$set(node, "expanded", true);
        console.log(node);
      });
    },
    getAreaData() {
      api
        .getAreaAllOrg({
          // parentOrgUuid: this.parentOrgUuid,
          orgType: "areaOrg"
        })
        .then(res => {
          let result = res.data.data || [];

          this.treeData = result;
        });
    },
    setKeys(id) {
      if (this.defaultExpandedKeys.indexOf(id) === -1) {
        this.defaultExpandedKeys.push(id);
      }
    },
    changeTime() {
      if (this.startDate > this.endDate) {
        [this.endDate, this.startDate] = [this.startDate, this.endDate];
      }
    },
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
      if (!this.OwnAuthDisabled) {
        return;
      }
      console.log(command);
      console.log(this.operatorData);
      if (command === "video") {
        // 打开视频操作
        // this.getPreviewInfo(this.operatorData.channelUuid);
      } else if (command === "playback") {
      } else if (command === "view") {
        this.openView();
      } else if (command === "renameView") {
        this.nodeValue = this.operatorData.viewName;
        this.changeNameDialogVisible = true;
      } else if (command === "deleteView") {
        this.isDeleteVisible = true;
      }
    },
    openView(data) {
      if (!data) {
        data = this.operatorData;
      }
      this.$emit("openView", data);
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
        this.getViewTree();
      } else if (tab.index === "2") {
        this.getViewTree();
      }
      this.$emit("changetab", tab);
    },
    getViewTree() {
      setTimeout(() => {
        if (!this.ShowAuthDisabled) {
          return;
        }
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
      }, 0);
    },
    handleCheckChange(data, checked, indeterminate) {
      // 树上的节点选中发生了改变
      // console.log(data, checked, indeterminate);
      console.log(this.$refs.tree1.getCheckedNodes());
      this.deal();
    },
    deal() {},
    getIcon(isOnline, type) {
      let treeIcons = window.config.treeIcons || [],
        icon = "";
      for (let i = 0; i < treeIcons.length; i++) {
        if (treeIcons[i].value === type) {
          if (!isOnline) {
            icon = require(`@/assets/images/treeIcons/${treeIcons[i].icon}2.png`);
          } else {
            icon = require(`@/assets/images/treeIcons/${treeIcons[i].icon}.png`);
          }
          break;
        }
      }
      return icon;
    },
    async devloadNode(node, resolve) {
      setTimeout(async () => {
        if (!this.ShowAuthDisabled) {
          return resolve([]);
        }
        //  懒加载子结点
        console.log(node);
        let data = await this.videoTree(
          node.data && node.data.id,
          node.data && node.data.nodeType
        );
        // data = [];
        if (node.level === 0) {
          if (data.length) {
            this.defaultExpKeys.push(data[0].id);
            this.showMaxWidth = true;
          }
        }
        data = data.map(item => {
          item.leaf = !item.openFlag;
          item.isOnline = true;
          if (item.nodeType === "chnNode") {
            item.isOnline = item.extInfo.chnOnlineOrNot === "online";
          }
          if (item.nodeType === "devNode") {
            item.isOnline = item.extInfo.devOnlineOrNot === "online";
          }
          item.icon = this.getIcon(item.isOnline, item.realType);
          return item;
        });
        return resolve(data);
      }, 0);
    },
    videoTree(parentUuid, parentType) {
      let data = {};
      if (parentUuid) {
        data.parentUuid = parentUuid;
      }
      if (parentType) {
        data.parentType = parentType;
      }
      return new Promise((resolve, reject) => {
        api2
          .getPlayTree(data)
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
    async tagloadNode(node, resolve) {
      setTimeout(async () => {
        if (!this.ShowAuthDisabled) {
          return resolve([]);
        }
        // 加载子结点
        console.log(node);
        if (node.level === 0) {
          let data = await this.getTagTreeData();
          console.log(data);
          if (node.level === 0) {
            if (data.length) {
              this.defaultExpKeys.push(data[0].id);
            }
          }
          return resolve(data);
        } else if (node.level === 1) {
          let data = await this.getChannelByNode(node.data.id);
          console.log(data);
          return resolve(data);
        }
      }, 0);
    },
    getChannelByNode(tagUuid) {
      return new Promise((resolve, reject) => {
        api
          .getChannelByTag({
            tagUuid,
            page: 1,
            limit: 11111,
            viewType: "video"
          })
          .then(res => {
            let list = (res.data.data.list || []).map(item => {
              item.label = item.channelName;
              // item.id = item.deviceUuid;
              item.leaf = true;
              item.isOnline = item.extInfo.chnOnlineOrNot === "online";
              item.icon = this.getIcon(item.isOnline, item.channelType);
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
            list = list.map(item => {
              item.isOnline = true;
              item.icon = require(`@/assets/images/treeIcons/doc.png`);
              return item;
            });
            resolve(list);
          });
      });
    },
    switchTabs(index) {
      this.tabsIndex = index;
    },
    search() {
      // 判断两个日期是不是同一天
      let d1 = new Date(this.startDate).getTime();
      let d2 = new Date(this.endDate).getTime();
      let oneMonth = 30 * 24 * 60 * 60;
      if ((d2 - d1) / 1000 > oneMonth) {
        this.$message.error("时间选择跨度不可以超过1个月");
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
      if (!treeData.length) {
        this.$message.error("请选择选择视频通道!");
        return;
      }
      let num = treeData.filter(item => {
        return item.isOnline;
      });
      if (!num.length) {
        this.$message.error("请选择在线的视频通道!");
        return;
      }
      console.log(num);
      this.$emit(
        "playRtsp",
        num,
        this.dealTime(this.startDate),
        this.dealTime(this.endDate),
        "normal_vod",
        "main"
      );
    },
    dealTime(a) {
      let d = new Date(a);
      let fz = z => {
        return ("0" + z).slice(-2);
      };
      return `${d.getFullYear()}-${fz(d.getMonth() + 1)}-${fz(
        d.getDate()
      )} ${fz(d.getHours())}:${fz(d.getMinutes())}:${fz(d.getSeconds())}`;
    },
    showAddChildrenDialog() {}
  }
};
</script>
<style lang="scss">
@import "@/style/variables.scss";
#VideoPlaybackContentLeft {
  .el-tree-node__content > label.el-checkbox {
    margin-right: 6px;
  }
  .el-tree-node__content > label.el-checkbox {
    margin-right: 4px;
  }
  .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 0px !important;
  }
  .el-tree-node__content > label.el-checkbox {
    margin-right: 4px;
  }
  .el-tabs__content {
    overflow: auto;
  }
  .mypanel {
    // width: 380px;
    height: calc(100vh - 410px);
  }
  .showMaxWidth {
    width: 196px;
  }
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
      margin-top: 12px;
    }
  }
  .initExpandIcon.el-icon-caret-right:before {
    content: "\E791";
    font-size: 15px;
  }
  .el-input__inner {
    padding-left: 30px;
    &::-webkit-input-placeholder {
      /* WebKit browsers */
      font-size: 12px;
    }
  }
  .el-tree-node,
  .el-tree-node__content {
    width: max-content;
  }
  .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 6px 0px;
  }
}
.videoTree2 .el-tree-node,
.videoTree2 .el-tree-node__content {
  width: 100% !important;
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.VideoPlaybackContentLeft {
  width: 220px;
  box-sizing: border-box;
  height: 100%;
  $iconWidth: 40px;
  background-color: rgba(35, 38, 41, 0.8);
  .custom-tree-node {
    width: 100%;
    flex: 1;
    // display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    .channelStatus {
      user-select: none;
      position: relative;
      .initExpandIcon {
        position: absolute;
        left: -33px;
        top: 2px;
      }
      img {
        width: 10px;
        height: 10px;
        // margin-right: 7px;
      }
      span {
        font-size: 12px;
        color: #ddd;
      }
      .channelOffline {
        color: #999999;
      }
    }
    .span {
      white-space: nowrap;
    }
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
    padding: 25px 12px 25px;
    box-sizing: border-box;
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
    padding: 0px 12px 25px;
    overflow: auto;
    // overflow-y: auto;
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
    padding: 25px 12px 10px;
    .el-input {
      position: relative;
      width: calc(100%);
    }
    $addIconWidth: 14px;
    img {
      display: inline-block;
      vertical-align: middle;
      width: 12px;
      margin-left: 4px;
      cursor: pointer;
    }
  }
}
</style>
