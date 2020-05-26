
<template>
  <div class="BayonetPreviewHeader">
    <el-popover ref="popverBox"
                popper-class="BPHeaderPopoverClass"
                :visible-arrow="false"
                v-model="visible_popver"
                placement="right"
                trigger="click">
      <el-row class="taskParentBox">
        <el-row class="taskParent taskParentPopoverBox">
          <!-- <el-tree
						ref="deviceTree"
						:props="defaultProps"
						:check-strictly="true"
						:highlight-current="true"
						:indent="10"
						:expand-on-click-node="false"
						:data="deviceTreeList"
						lazy
						:load="loadNode"
						node-key="id"
						:default-expanded-keys="defaultExpandedKeys"
						@node-click="handleNodeClick"
					></el-tree> -->
          <the-leftmenu v-if="!isOneProject"
                        ref="leftMenu"
                        :ShowAuthDisabled="ShowAuthDisabled"
                        :OwnAuthDisabled="OwnAuthDisabled"
                        :isOnlyArea="false"
                        @clickNode="clickNodeAll"
                        @addData="addData"
                        :isShowInput="false"
                        orgType="areaOrg"></the-leftmenu>
          <el-tree v-else
                   ref="deviceTree"
                   :props="defaultProps"
                   :check-strictly="true"
                   :highlight-current="true"
                   :indent="10"
                   :expand-on-click-node="false"
                   :data="deviceTreeList"
                   lazy
                   :load="loadNode"
                   node-key="id"
                   :default-expanded-keys="defaultExpandedKeys"
                   @node-click="handleNodeClick"></el-tree>
        </el-row>
        <el-row class="taskParent taskParentBgClass">
          <div class="checkBoxTitle">
            <el-checkbox class="checkBoxClass"
                         v-model="notCheckAll"
                         @change="handleCheckAllChange">只呈现单路摄像机</el-checkbox>
          </div>
          <el-radio-group v-if="channelInfoList"
                          class="taskParent radioGroup"
                          v-model="checkedChannel"
                          @change="handleCheckedChannelChange">
            <el-radio class="el-radio-myclass"
                      v-for="(channelItem,index) in channelInfoList"
                      :label="channelItem"
                      :key="index">
              <img class="radioIcon"
                   :src="getIcon(channelItem.chnOnlineOrNot,channelItem.channelType)"
                   alt
                   srcset />
              {{channelItem.nickName}}
            </el-radio>
          </el-radio-group>
          <el-row v-else
                  style="margin:15px;color:#ffffff">任务没有关联摄像机</el-row>
        </el-row>
      </el-row>
      <el-row slot="reference">
        <img src="@/assets/sxj.png"
             alt />
        <el-button type="text"
                   class="leftflexButton">请选择摄像机</el-button>
        <img :src="icons.bayonetDropDown"
             alt />
      </el-row>
    </el-popover>
  </div>
</template>
<script>
import icons from "@/common/js/icon.js";
import * as api from "@/pages/faceModule/http/homeBaseHttp.js";
import TheLeftmenu from "@/pages/AreaManagement/views/leftWrap";
export default {
  props: {
    defaultData: {
      type: Object,
      default() {
        return {};
      }
    },
    ShowAuthDisabled: {
      type: Boolean,
      default: true
    },
    OwnAuthDisabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      icons,
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "isLeaf"
      },
      deviceTreeList: [],
      defaultExpandedKeys: [],
      notCheckAll: false,
      channelInfoList: [],
      checkedChannel: {},
      visible_popver: false,
      isOneProject: false,
      checkedChannelsUuidList: []
    };
  },
  components: { TheLeftmenu },
  created() {},
  activated() {},
  mounted() {
    let projectType = this.$store.state.home.projectType || {};
    this.isOneProject = Boolean(projectType.platformLevel === "levelOne");
  },
  methods: {
    // 点击树节点，返回树节点数据方法
    clickNodeAll(data) {
      console.log(data);
      if (data.type !== "areaOrg" && data.type !== "project") {
        // 判断该次点击是子项目树节点
        this.handleNodeClick(data);
      }
    },
    // 点击请求子项目下一级节点，将数据返回挂载到树上的方法
    async addData(data, callback) {
      if (data.type === "project") {
        data.projectUuid = data.id;
        let rootArr = await this.httpLoadNodeData(data);
        if (!rootArr[0] || !rootArr.length) {
          callback(rootArr || []);
          return;
        }
        data.projectUuid = rootArr[0].projectUuid;
        data.type = rootArr[0].type;
        data.id = rootArr[0].id;
      }
      let newArr = await this.httpLoadNodeData(data);
      callback(newArr);
    },
    httpLoadNodeData(data, callback) {
      let newData = [];
      let params = {
        parentOrgUuid: data.id,
        projectUuid: data.projectUuid,
        shootType: "vehicleSnap"
      };
      if (data.type === "project") {
        params.parentOrgUuid = "";
      }
      return new Promise(resolve => {
        if (!this.ShowAuthDisabled) {
          resolve(newData);
        }
        api
          .getFaceDeviceList(params)
          .then(res => {
            if (res.data.success && res.data.data) {
              newData = res.data.data;
              newData = newData.map(item => {
                item.projectUuid = data.projectUuid;
                return item;
              });
            }
            if (this.channelInfoList && !this.channelInfoList.length) {
              this.handleNodeClick(newData[0], true);
            }
            resolve(newData);
          })
          .catch(() => {
            resolve(newData);
          });
      });
    },
    loadNode(node, resolve) {
      api
        .getFaceDeviceList({
          parentOrgUuid: node.data.id,
          shootType: "vehicleSnap"
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            let data = res.data.data;
            if (data && !this.defaultExpandedKeys.length) {
              this.handleNodeClick(data[0]);
            }
            for (let i = 0, len = data.length; i < len; i++) {
              if (parseInt(data[i].nextCount) === 0) {
                data[i].isLeaf = true;
                this.$set(data[i], "isLeaf", true);
              }
              this.defaultExpandedKeys.push(data[i].id);
            }
            resolve(data);
          } else {
            resolve([]);
          }
        })
        .catch(() => {
          resolve([]);
        });
    },
    handleNodeClick(data) {
      api
        .getDeviceChannelList({
          parentOrgUuid: data.id,
          projectUuid: data.projectUuid,
          shootType: "vehicleSnap"
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.channelInfoList = (res.data.data || []).map(item => {
              item.projectUuid = data.projectUuid;
              return item;
            });
            // 判断当前已经有了选中的通道，则不会更新已经选中的通道
            if (this.checkedChannel && this.checkedChannel.channelUuid) return;
            this.checkedChannel = this.channelInfoList[0];
            if (this.notCheckAll) {
              // 勾了单选
              this.checkedChannelsUuidList = [];
              this.checkedChannelsUuidList[0] = this.checkedChannel.channelUuid;
            } else {
              // 去掉单选
              this.checkedChannelsUuidList = [];
              this.channelInfoList.forEach(item => {
                this.checkedChannelsUuidList.push(item.channelUuid);
              });
            }
            this.$emit(
              "transferCheckedChannels",
              this.checkedChannelsUuidList,
              this.checkedChannel
            );
          } else {
            console.log(res.data.data);
            this.$message({ type: "warning", message: "查询数据为空" });
          }
        })
        .catch(() => {});
    },
    getIcon(isOnline, type) {
      let treeIcons = window.config.treeIcons || [],
        icon = "";
      for (let i = 0; i < treeIcons.length; i++) {
        if (treeIcons[i].value === type) {
          if (isOnline === "offline") {
            icon = require(`@/assets/images/treeIcons/${treeIcons[i].icon}2.png`);
          } else {
            icon = require(`@/assets/images/treeIcons/${treeIcons[i].icon}.png`);
          }
          break;
        }
      }
      return icon;
    },
    handleCheckAllChange(val) {
      if (!this.ShowAuthDisabled) return;
      console.log("默认勾选单路摄像机，改变对比列表数据以及抓拍数据", val);
      this.notCheckAll = val;
      if (val) {
        // 勾了单选
        this.checkedChannelsUuidList = [];
        this.checkedChannelsUuidList[0] = this.checkedChannel.channelUuid;
      } else {
        // 去掉单选
        let tempArr = [];
        this.channelInfoList.forEach(item => {
          tempArr.push(item.channelUuid);
        });
        this.checkedChannelsUuidList = tempArr;
      }
      this.$emit(
        "transferCheckedChannels",
        this.checkedChannelsUuidList,
        this.checkedChannel,
        this.notCheckAll
      );
    },
    handleCheckedChannelChange(value) {
      if (!this.OwnAuthDisabled) return;
      if (this.checkedChannel.chnOnlineOrNot === "offline") {
        this.$message.warning("该设备离线！");
        return;
      }
      if (this.notCheckAll) {
        this.checkedChannelsUuidList = [];
        this.checkedChannelsUuidList[0] = this.checkedChannel.channelUuid;
      }
      this.visible_popver = false;
      this.$emit(
        "transferCheckedChannels",
        this.checkedChannelsUuidList,
        this.checkedChannel,
        this.notCheckAll
      );
    }
  },
  watch: {
    defaultData: {
      handler(newVal, old) {},
      deep: true,
      immediate: true
    }
  },
  destroyed() {}
};
</script>
<style>
.BPHeaderPopoverClass .el-radio + .el-radio {
  margin-left: 0px;
}
.BPHeaderPopoverClass .el-radio__input {
  display: none;
}
.BPHeaderPopoverClass .el-radio__input.is-checked + .el-radio__label {
  color: #28ffbb;
}
.radioIcon {
  width: 12px;
  height: 12px;
  margin-right: 5px;
}
.el-radio-myclass {
  margin: 10px 0px 9px;
  font-family: "PingFangSC-Regular";
  font-size: 14px;
  color: #aaaaaa;
  letter-spacing: 0;
}
</style>
<style lang="scss">
.BPHeaderPopoverClass {
  width: calc(100% - 730px);
  height: calc(100% - 420px);
  position: absolute;
  left: 225px !important;
  top: 115px !important;
  background-color: #2a2e319c !important;
  z-index: 10 !important;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 0px;
  padding: 0px 12px;
  .taskParentBox {
    width: 100%;
    height: calc(100% - 18px);
    margin-top: 15px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    background: rgba(32, 33, 36, 0.3);
    .taskParent {
      text-align: left;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      margin: 0px 8px;
      padding-top: 10px;
      .checkBoxTitle {
        width: 245px;
        display: flex;
        flex-direction: wrap;
        justify-content: flex-start;
        align-items: center;
        padding-top: 10px;
        /* padding-left: 12px; */
      }
    }
    .taskParentPopoverBox {
      width: 245px;
      border-right: 1px solid rgb(104, 103, 102);
      background: rgba(32, 33, 36, 0.1);
      overflow-x: auto;
    }
    .taskParentBgClass {
      background: rgba(32, 33, 36, 0.1);
      width: calc(100% - 245px);
    }
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.BayonetPreviewHeader {
  line-height: 60px;
  .el-radio + .el-radio {
    margin-left: 0px;
  }
}
</style>
