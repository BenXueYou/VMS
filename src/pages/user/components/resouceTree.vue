<template>
  <el-dialog :title="title"
             @close="close"
             width="1280px"
             :class="{'dialogCenter':true}"
             :close-on-click-modal="false"
             :append-to-body="true"
             class="showResource"
             :visible.sync="isShow">
    <div class="mywrap">
      <div class="left">
        <el-tabs v-model="activeName"
                 @tab-click="handleClick">
          <el-tab-pane v-for="(treeTab,i) in treeTypeArr"
                       :key="i"
                       :label="treeTab.label"
                       class="i-tree"
                       :name="treeTab.id">
            <!-- v-if="treeTab.id === activeName" -->
            <!-- :load="loadNode($event,treeTab.id)" -->
            <!-- v-if="treeTab.id === activeName" -->
            <el-tree :load="loadNode"
                     node-key="id"
                     :ref="treeTab.id"
                     check-strictly
                     :show-checkbox="false"
                     :props="defaultProps"
                     :expand-on-click-node="false"
                     @node-click="nodeClick"
                     :filter-node-method="filterNode"
                     lazy>
              <div class="custom-tree-node i-tree-item"
                   slot-scope="{node}">
                <div class="i-tree-item-icon">
                  {{ node.data.label}}
                  <template>
                    <img v-if="node.checked"
                         src="@/assets/images/doorAccess/checked_icon.png"
                         width="10.9px"
                         height="9px"
                         style="margin-right: 20px;" />
                  </template>
                </div>
              </div>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="right">
        <!---- 资源类型 ----->
        <el-radio-group v-model="resourceType"
                        @change="resourceTypeChange">
          <template v-for="(item,index) in rightTabArr">
            <el-radio-button :key="index"
                             :label="item.id"
                             :name="item.id">{{item.label}}</el-radio-button>
          </template>
        </el-radio-group>
        <!---- 资源权限 ----->
        <div class="channelItemClass">
          <span class="channelItemSpan textClips">资源名称</span>
          <el-checkbox :indeterminate="isIndeterminate"
                       v-model="checkAll"
                       @change="TopAllHandleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="checkedAuthUuids">
            <template v-for="(authItem,j) in resourceAuthArr">
              <el-checkbox @change="TopAllChangeAuthItem($event,authItem)"
                           :key="j"
                           :label="authItem.authUuid"
                           :name="authItem.authUuid">{{authItem.authName}}</el-checkbox>
            </template>
          </el-checkbox-group>
        </div>
        <template v-for="(channelItem,i) in checkedChannelArr">
          <div v-if="justifyIsShowCheckedChannel(channelItem)"
               class="channelItemClass"
               :key="i">
            <span class="channelItemSpan textClips"
                  @mouseover="mymouseover"
                  @mouseout="mymouseout"
                  @mousemove="mymousemove">{{channelItem.label}}</span>
            <el-checkbox :indeterminate="channelItem.isIndeterminate"
                         v-model="channelItem.checkAll"
                         @change="handleCheckAllChange(channelItem)">全选</el-checkbox>
            <el-checkbox-group v-model="channelItem.checkedAuthUuids">
              <template v-for="(authItem,j) in channelItem.authArr">
                <el-checkbox :key="j"
                             :label="authItem.authUuid"
                             :name="authItem.authUuid"
                             @change="authItemChangeAct($event,authItem,channelItem)">{{authItem.authName}}</el-checkbox>
              </template>
            </el-checkbox-group>
            <span @click="handleCheckChannelData(channelItem,false)">
              <img src
                   alt
                   srcset />
            </span>
          </div>
        </template>
      </div>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="onConfirmBtn">确 定</el-button>
      <el-button type="primary"
                 @click="isShow = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as api from "../http/ajax";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
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
      isIndeterminate: false,
      checkAll: true,
      resourceTypeArr: window.config.resourceType,
      isShow: false,
      activeName: "video",
      defaultProps: {
        children: "children",
        label: "label",
        id: "id",
        isLeaf: "isLeaf"
      },
      defaultExpandedKeys: [2],
      cnt: 0,
      checkedChannelArr: [],
      rightTabArr: [],
      resourceType: "",
      resourceAuthArr: [],
      treeTypeArr: [],
      checkedAuthUuids: []
    };
  },
  mounted: function() {
    this.treeTypeArr = [
      { id: "video", label: "视频" },
      { id: "door", label: "门禁" },
      { id: "alarm", label: "报警" },
      { id: "visitor", label: "访客机" }
    ];
    this.rightTabArr = this.resourceTypeArr[this.activeName];
    this.resourceType = this.rightTabArr[0].id;
    this.getChannelAuth();
  },
  methods: {
    authItemChangeAct(val, authItem, channelItem) {
      if (!val) {
        this.checkedAuthUuids.splice(
          this.checkedAuthUuids.findIndex(item => item === authItem.authUuid),
          1
        );
      } else {
        // if(channelItem.checkedAuthUuids.length === this.){}
      }
    },
    TopAllHandleCheckAllChange(val) {
      // 顶部的全选事件
      this.checkedChannelArr.map(channelItem => {
        // 过滤树类型以及资源类型
        let flag = this.justifyIsShowCheckedChannel(channelItem);
        if (flag) {
          let arr = [];
          if (val) {
            arr = channelItem.authArr.map(item => item.authUuid);
          }
          this.$set(channelItem, "checkedAuthUuids", arr);
          this.$set(channelItem, "checkAll", Boolean(arr.length));
        } else {
          console.log(channelItem);
        }
      });
      /* eslint-disable */
      this.checkedAuthUuids = val
        ? this.resourceAuthArr.map(item => {
            return item.authUuid;
          })
        : [];
      /* eslint-enable */
    },
    TopAllChangeAuthItem(val, authItem) {
      // 右侧按钮事件的全选
      this.checkedChannelArr.map(channelItem => {
        let flag = this.justifyIsShowCheckedChannel(channelItem);
        if (flag) {
          if (!val) {
            channelItem.checkedAuthUuids.splice(
              channelItem.checkedAuthUuids.findIndex(
                item => item === authItem.authUuid
              ),
              1
            );
          } else {
            channelItem.checkedAuthUuids.push(authItem.authUuid);
          }
        }
      });
    },
    // 过滤当前的通道，是否是当前选中的
    justifyIsShowCheckedChannel(channelItem) {
      if (channelItem.viewType === this.activeName) {
        if (this.resourceType !== this.rightTabArr[0].id) {
          return (
            channelItem.extInfo &&
            this.resourceType === channelItem.extInfo.channelDivideType
          );
        } else {
          // 只显示该类型的设备
          return channelItem.nodeType === "devNode";
        }
      }
      return false;
    },
    // 点击资源的全选按钮
    handleCheckAllChange(channelItem) {
      let arr = [];
      if (channelItem.checkAll) {
        channelItem.authArr.filter(item => {
          arr.push(item.authUuid);
        });
        channelItem.isIndeterminate = false;
      } else {
        channelItem.isIndeterminate = true;
      }
      this.$set(channelItem, "checkedAuthUuids", arr);
    },
    // 点击角色确定按钮
    onConfirmBtn() {
      this.isShow = !this.isShow;
      let dataArr = [];
      this.checkedChannelArr
        .filter((item, i) => {
          return item.checkedAuthUuids.length;
        })
        .map(o => {
          let data = {
            resourceUuid: o.id,
            resourceType: o.resType,
            resourceAuthUuids: o.checkedAuthUuids
          };
          Object.assign(data, o);
          dataArr.push(data);
        });
      console.log(dataArr);
      this.$emit("transferResourceAuth", dataArr);
    },
    // 筛选方法
    filterNode(obj, data) {
      console.log(123);
      console.log(obj, data);
      // 第一个的都是设备，所以比较第一个就可以判断是不是要显示通道
      if (this.resourceType === this.rightTabArr[0].id) {
        // 过滤通道
        console.log(data);
        return data.nodeType.indexOf("chn") === -1;
      } else {
        // if (data.nodeType === "devNode") {
        //   data.openFlag = true;
        // }
        // data.isLeaf = !data.openFlag;
        // console.log(data);
        // 恢复节点
        return true;
      }
    },
    // 点击树节点响应事件
    nodeClick(data, node, nodeTree) {
      // TODO:此处需要有过滤只选择通道
      if (this.resourceType === this.rightTabArr[0].id) {
        if (data.nodeType.indexOf("dev") !== -1) {
          this.$set(node, "checked", !node.checked);
          this.handleCheckChannelData(data, node.checked);
        }
      } else {
        if (!data.openFlag && data.nodeType.indexOf("chn") !== -1) {
          this.$set(node, "checked", !node.checked);
          this.handleCheckChannelData(data, node.checked);
        }
      }
    },
    // 过滤节点
    // 处理选中的数据源
    handleCheckChannelData(data, isBool) {
      if (isBool) {
        // 构造当前资源类型权限对象
        data.authArr = JSON.parse(JSON.stringify(this.resourceAuthArr));
        let checkedAuthUuids = [];
        // 默认资源权限全选
        data.authArr.filter(v => {
          checkedAuthUuids.push(v.authUuid);
        });
        this.$set(data, "checkedAuthUuids", checkedAuthUuids);
        data.checkAll = true;
        data.isIndeterminate = false;
        data.viewType = this.activeName;
        this.checkedChannelArr.push(data);
      } else {
        // 删除
        this.checkedChannelArr.splice(
          this.checkedChannelArr.findIndex(item => item.id === data.id),
          1
        );
      }
    },
    // 获取树节点数据的HTTP
    getTreeData(obj) {
      console.log(this.resourceType);
      console.log(this.rightTabArr[0].id);
      return new Promise(resolve => {
        api
          .getNewTree(obj)
          .then(res => {
            let data = res.data.data || [];
            data.map(element => {
              // if (
              //   this.resourceType === this.rightTabArr[0].id &&
              //   element.nodeType === "devNode"
              // ) {
              //   element.openFlag = false;
              // }
              element.isLeaf = !element.openFlag;
            });
            resolve(data);
          })
          .catch(() => {
            resolve([]);
          });
      });
    },
    // 树的懒加载动作
    async loadNode(node, resolve) {
      this.$set(node, "checked", false);
      let obj = {
        viewType: this.activeName, // 不填则查所有类型资源 门禁 door、视频 video、报警 alarm、访客机 visitor
        treeStructure: "orgNode$device|devNode|chnNode", // 树结构，指定树的类型及树的结构
        authEnable: false, // 是否开启权限过滤，默认开启true
        recursiveEnable: false, // 是否递归查询子节点的资源，默认不查询false
        extInfo: [
          {
            aimType: "chnSubType"
          }
        ]
      };
      // 判断当前是否是根节点懒加载
      if (node.id < 4) {
        obj.viewType = this.treeTypeArr[node.id].id;
      } else {
        // 非根节点的懒加载
        obj.viewType = this.activeName;
      }
      // 先判断是不是根节点
      if (node.data) {
        // 非根节点
        obj.parentType = node.data.nodeType;
        obj.parentUuid = node.data.id;
      }
      let data = await this.getTreeData(obj);
      console.log(data);
      resolve(data);
      this.$refs[this.activeName][0].filter();
    },
    // 点击tab按钮，切换树的类型
    handleClick(tab, event) {
      this.rightTabArr = this.resourceTypeArr[tab.name];
      this.resourceType = this.rightTabArr[0].id;
      // 切换树的类型
      let obj = {
        extInfo: [
          {
            aimType: "chnSubType"
          }
        ],
        viewType: this.activeName, // 不填则查所有类型资源 门禁 door、视频 video、报警 alarm、访客机 visitor
        treeStructure: "orgNode$device|devNode|chnNode", // 树结构，指定树的类型及树的结构
        authEnable: false, // 是否开启权限过滤，默认开启true
        recursiveEnable: false // 是否递归查询子节点的资源，默认不查询false
      };
      this.getTreeData(obj);
      this.getChannelAuth();
    },
    // 点击右边按钮，改变资源类型
    resourceTypeChange() {
      this.getChannelAuth();
      // 当选择的是设备
      if (this.resourceType === this.rightTabArr[0].id) {
        // 获取当前显示的通道
        let treeCheckedChannelArr = this.checkedChannelArr.filter((v, k) => {
          return this.justifyIsShowCheckedChannel(v);
        });
        let treeCheckedChannelKeysArr = treeCheckedChannelArr.map(v => {
          return v.id;
        });
        // 点击右侧按钮，过滤左侧树的节点
        console.log(treeCheckedChannelKeysArr);
        if (this.$refs[this.activeName] && this.$refs[this.activeName][0]) {
          this.$refs[this.activeName][0].setCheckedKeys([]);
          this.$refs[this.activeName][0].setCheckedKeys(
            treeCheckedChannelKeysArr
          );
        }
      }
      // auth_video
      this.$refs[this.activeName][0].filter();
    },
    // 通道资源的静态资源权限
    getChannelAuth() {
      api
        .getResource({ resourceType: this.resourceType })
        .then(res => {
          if (res.data.success) {
            res.data.data = res.data.data || [];
            let data = res.data.data[0];
            this.resourceAuthArr = data.auth;
            this.checkedAuthUuids = this.resourceAuthArr.map(item => {
              return item.authUuid;
            });
          } else {
            this.$messsage({
              type: "warning",
              messsage: res.data.msg
            });
          }
        })
        .catch(() => {});
    },
    close() {
      this.$emit("update:visible", false);
    },
    mymouseover: event => {
      mouseover(event);
    },
    mymouseout(event) {
      mouseout(event);
    },
    mymousemove(event) {
      mousemove(event);
    }
  },
  watch: {
    visible() {
      this.isShow = this.visible;
    },
    checkedChannelArr: {
      handler() {},
      deep: true,
      immediate: true
    }
  }
};
</script>
<style>
.showResource .right .channelItemClass {
  border-bottom: 1px dashed rgb(69, 71, 74);
  display: flex;
  line-height: 49px;
}
.showResource .right .channelItemClass .channelItemSpan {
  display: inline-block;
  width: 90px;
  padding-right: 15px;
}
.showResource .right .channelItemClass .el-checkbox {
  margin-right: 18px;
}
.showResource .right .channelItemClass span {
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  color: #dddddd;
}
.showResource .right .el-checkbox-group {
  display: inline;
}
.showResource .el-tabs__nav {
  display: inline-block;
  width: 100%;
  color: #dddddd;
}
.showResource .el-tabs__item {
  color: #dddddd;
  width: 25%;
}
.showResource .right .el-radio-group {
  width: 70%;
  display: flex;
  justify-content: space-between;
}
.showResource .right .el-radio-group .el-radio-button__inner {
  display: inline-block;
  width: 90px;
  background: transparent;
  border: 1px solid rgba(38, 211, 157, 0.08);
  border-radius: 2px;
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #dddddd;
  text-align: justify;
  text-align: center;
}
.showResource
  .right
  .el-radio-button__orig-radio:checked
  + .el-radio-button__inner {
  color: #ffffff;
  background: rgba(40, 255, 187, 0.08);
  border-color: rgba(38, 211, 157, 0.8);
  -webkit-box-shadow: -1px 0 0 0 #26d39d;
  box-shadow: -1px 0 0 0 rgba(38, 211, 157, 0.08);
}
.showResource .el-tabs__item.is-active {
  color: #26d39d;
}
</style>
<style lang="scss" scoped>
$width: 300px;

.showResource {
  .mywrap {
    display: flex;
    min-height: 500px;
    .left {
      flex: 2;
      padding: 20px 25px;
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      max-width: 420px;
    }
    .right {
      flex: 8;
      padding: 10px 25px;
    }
  }
  .dialog-footer {
    height: 69px;
    line-height: 69px;
    border-top: 1px solid #24473f;
    padding-right: 48px;
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
