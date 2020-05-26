<template>
  <el-dialog :title="title"
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :visible.sync="TreechangeNameDialogVisible">
    <div class='treeSelectjiangWrap'>
      <el-row class="popverTreeParentBox">
        <el-row style="overflow:auto; width:25%;min-width:245px;border-right:1px solid rgb(104,103,102);background: #202124;">
          <the-leftmenu v-if="!isOneProject"
                        ref="leftMenu"
                        :isOnlyArea="false"
                        :ShowAuthDisabled='ShowAuthDisabled'
                        :OwnAuthDisabled='OwnAuthDisabled'
                        @clickNode="clickNodeAll"
                        @addData="addData"
                        :isShowInput="false"
                        orgType="areaOrg"></the-leftmenu>
          <el-tree v-else
                   ref="deviceTree"
                   :indent="10"
                   class="popverTreeClass"
                   :data="treeData"
                   lazy
                   node-key="id"
                   :load="loadNode"
                   :props="defaultProps"
                   :check-strictly="true"
                   :check-on-click-node="true"
                   :expand-on-click-node="false"
                   :highlight-current="true"
                   @node-click="handleNodeClick"></el-tree>
        </el-row>
        <el-row class="popverTreeParent"
                style="width:65%;background: #202124;">
          <div class="checkBoxTitle"
               style="width:85px;">
          </div>
          <div v-if="channels"
               class="popverTreeParent checkGroupClass">
            <p class="checkBoxClass"
               v-for="(item,index) in channels"
               @click="clickChanel(index, item.chnOnlineOrNot)"
               @dblclick="dbClickChanel(index, item.chnOnlineOrNot)"
               :key="index"
               :class="{'active': OwnAuthDisabled &&  activeIndex==index}"
               :label="item.channelUuid">
              <img class="radioIcon"
                   :src="getIcon(item.chnOnlineOrNot,item.channelType)"
                   alt
                   srcset />{{item.nickName}}</p>
          </div>
          <el-row v-else
                  style="margin:15px;color:#ffffff">任务没有关联摄像机</el-row>
        </el-row>
      </el-row>
    </div>
    <div style='display:flex;    justify-content: flex-end;'>
      <el-button @click="sureBtn"
                 :disabled="!OwnAuthDisabled"
                 style="margin-right:100px;"
                 type="primary">确定</el-button>
    </div>
    <div style="height:60px;"></div>
  </el-dialog>
</template>

<script>
// import * as api from "@/pages/equipmentMange/ajax.js";
import * as api2 from "@/pages/VideoPreview/ajax.js";
import * as api from "@/pages/faceModule/http/homeBaseHttp.js";
import TheLeftmenu from "@/pages/AreaManagement/views/leftWrap";
export default {
  name: "TreeChangeNameDialog.vue",
  components: {
    TheLeftmenu
  },
  props: {
    width: {
      type: String,
      default() {
        return "1000px";
      }
    },
    title: {
      type: String,
      default() {
        return "选择设备视频";
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isCheckedAll: {
      type: Boolean,
      default: false
    },
    channelInfoList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    elPopoverClass: {
      type: String,
      default: ""
    },
    boxType: {
      type: String,
      default: ""
    },
    inputWidth: {
      type: String,
      default: "50%"
    },
    defaultCheckedChannel: {
      type: Array,
      default() {
        return [];
      }
    },
    isOneProject: {
      type: Boolean,
      default() {
        return true;
      }
    },
    ShowAuthDisabled: {
      type: Boolean,
      default() {
        return true;
      }
    },
    OwnAuthDisabled: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      activeIndex: -1,
      defaultExpandedKeys: [],
      checkedChannel: [], // 此变量的类型不可定义为字符串
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: function(data, node) {
          if (data.children) return true;
          return false;
        }
      },
      checkAll: false,
      isIndeterminate: false,
      visible_popver: false,
      treeData: [],
      channels: [],
      // checkedChannelName: "全部",
      isFlag: false,
      defaultExpKeys: [],
      TreechangeNameDialogVisible: false,
      devprops: {
        label: "label",
        isLeaf: "leaf"
      }
    };
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
    console.log(this.isOneProject);
  },
  methods: {
    // 点击树节点，返回树节点数据方法
    clickNodeAll(data) {
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
    httpLoadNodeData(data) {
      let newData = [];
      let params = {
        parentOrgUuid: data.id,
        projectUuid: data.projectUuid,
        shootType: "shootType"
      };
      if (data.type === "project") {
        params.parentOrgUuid = "";
      }
      return new Promise(resolve => {
        api
          .getFaceDeviceList(params)
          .then(res => {
            if (res.data.success && res.data.data) {
              newData = res.data.data || [];
              newData = newData.map(item => {
                item.projectUuid = data.projectUuid;
                return item;
              });
            }
            if (this.channels && !this.channels.length) {
              this.handleNodeClick(newData[0], true);
            }
            resolve(newData);
          })
          .catch(err => {
            console.log(err);
            resolve(newData);
          });
      });
    },
    sureBtn() {
      if (
        this.channels[this.activeIndex] &&
        this.channels[this.activeIndex].channelUuid
      ) {
        if (this.channels[this.activeIndex].isOnline === "offline") {
          this.$cToast.warn("视频离线，无法查看");
          return;
        }
        this.$emit(
          "playRtsp",
          this.channels[this.activeIndex].channelUuid,
          "main",
          {},
          1,
          false,
          this.channels[this.activeIndex].nickName
        );
        this.close();
      } else {
        this.$message({ type: "warning", message: "没有选择通道" });
        console.log(this.OwnAuthDisabled);
        console.log(this.ShowAuthDisabled);
      }
    },
    clickChanel(index, isOnline) {
      this.activeIndex = index;
      this.channels[this.activeIndex].isOnline = isOnline;
    },
    dbClickChanel(index, isOnline) {
      if (!this.OwnAuthDisabled) return;
      if (isOnline === "offline") {
        this.$cToast.warn("视频离线，无法查看");
        return;
      }
      this.activeIndex = index;
      this.$emit(
        "playRtsp",
        this.channels[this.activeIndex].channelUuid,
        "main",
        {},
        1,
        false,
        this.channels[this.activeIndex].nickName
      );
      this.close();
    },
    openVidoeByDBClick(node, data, e) {
      e.preventDefault();
      e.stopPropagation();
      this.operatorData = data;
      // 不在线的通道 ，双击进行展示
      if (data.isOnline === false) {
        this.$message.error("设备不在线");
      } else {
        if (data.hasOwnProperty("channelUuid") || data.nodeType === "chnNode") {
          this.chuliData();
        }
      }
    },
    saveClickData(node, data, event) {
      // 点击三角菜单保存树节点信息
      this.operatorData = data;
      if (event) {
        event.preventDefault();
        event.stopPropagation();
        const _this = this;
        this.$ContextMenu({
          data: [
            {
              value: "video",
              label: "打开视频"
            }
          ],
          event: event,
          callback(value) {
            // value表示点击按钮的value
            _this.handleCommand(value);
          }
        });
      }
    },
    getPreviewInfo(channelUuid, data, streamType, operator = 1) {
      this.$emit("playRtsp", channelUuid, streamType, data, operator);
      this.close();
    },
    chuliData(streamType = "") {
      console.log(this.operatorData);
      if (this.operatorData.nodeType === "chnNode") {
        this.getPreviewInfo(
          this.operatorData.id,
          this.operatorData,
          streamType
        );
      } else if (this.operatorData.nodeType === "devNode") {
        // 点击的是设备，根据设备
        this.getOnlineChannelList(this.operatorData.id, "devNode", streamType);
      } else if (this.operatorData.nodeType === "orgNode") {
        // 根据组织来获取通道
        this.getOnlineChannelList(this.operatorData.id, "orgNode", streamType);
      } else if (this.operatorData.hasOwnProperty("channelType")) {
        this.getPreviewInfo(
          this.operatorData.channelUuid,
          this.operatorData,
          streamType
        );
      } else if (this.operatorData.hasOwnProperty("tagType")) {
        this.getChannelByNode(this.operatorData.id).then(res => {
          console.log(res);
          let data = res || [];
          for (let i = 0; i < data.length; i++) {
            // 判断设备在不在线
            if (data[i].extInfo.chnOnlineOrNot === "online") {
              data[i].realType = data[i].channelType;
              this.getPreviewInfo(data[i].channelUuid, data[i], streamType, -1);
            }
          }
        });
      }
    },
    handleCommand(command) {
      console.log(command);
      console.log(this.operatorData);
      if (command === "video") {
        // 打开视频操作
        this.chuliData();
      } else if (
        command === "main" ||
        command === "sub" ||
        command === "thrid"
      ) {
        this.chuliData(command);
      } else if (command === "playback") {
        console.log(this.operatorData);
        if (this.operatorData.nodeType === "chnNode") {
          this.$emit(
            "switchLuxiang",
            this.operatorData.id,
            this.operatorData.label
          );
        } else if (this.operatorData.hasOwnProperty("channelUuid")) {
          this.$emit(
            "switchLuxiang",
            this.operatorData.channelUuid,
            this.operatorData.channelName
          );
        } else {
          this.$message.error("请选择通道查看录像！");
        }
      } else if (command === "view") {
        this.openVidewTu();
      } else if (command === "renameView") {
        this.nodeValue = this.operatorData.viewName;
        this.changeNameDialogVisible = true;
      } else if (command === "deleteView") {
        this.isDeleteVisible = true;
      }
    },
    videoTree(parentUuid, parentType) {
      // 换成视频回放树，添加nvr设备
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
      // 下面是新树的接口，不满足有nvr的条件，更换成上面的
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
    confirm() {
      this.$emit("confirm", this.name, this.selectValue);
      this.$emit("update:visible", false);
    },
    close() {
      this.$emit("update:visible", false);
    },
    clearAction() {
      this.checkedChannel = [];
      this.checkedChannelName = "";
      this.checkAll = false;
      if (!this.checkAll && this.isCheckedAll) {
        this.$emit("transferCheckedChannel", this.channels);
      } else {
        this.$emit("transferCheckedChannel", []);
      }
    },
    // 全选的回调
    handleCheckAllChange(val) {
      console.log(val);
      this.checkAll = val;
      let checkedChannelArr = [];
      let checkedChannelUuidArr = [];
      if (val) {
        this.channels.forEach(element => {
          checkedChannelUuidArr.push(element.channelUuid);
          checkedChannelArr.push(element);
        });
      } else {
        // 此处标示该弹窗是否携带可编辑的数据
        if (this.isCheckedAll) {
          checkedChannelArr = this.channels;
        } else {
          // 携带编辑数据，允许传NULL数组
          checkedChannelArr = [];
        }
      }
      this.checkedChannel = checkedChannelUuidArr;
      console.log(this.checkedChannel);
      this.isIndeterminate = false;
      this.$emit("transferCheckedChannel", checkedChannelArr);
    },
    // 点击复选框事件
    handleCheckedChange(value, data) {
      console.log(value);
      if (this.boxType === "radio") {
        this.checkedChannel = value;
        this.$emit("transferCheckedChannel", value);
        return;
      } else {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.channels.length;
        this.isIndeterminate =
          checkedCount > 0 && checkedCount < this.channels.length;
      }
      let checkedChannelArr = [];
      this.channels.forEach(element => {
        if (value.indexOf(element.channelUuid) !== -1) {
          checkedChannelArr.push(element);
        }
      });
      this.$emit("transferCheckedChannel", checkedChannelArr);
    },
    loadNode(node, resolve) {
      api
        .getFaceDeviceList({ parentOrgUuid: node.data.id })
        .then(res => {
          if (res.data.success && res.data.data) {
            let data = res.data.data;
            for (let i = 0, len = data.length; i < len; i++) {
              if (parseInt(data[i].nextCount) === 0) {
                data[i].isLeaf = true;
                this.$set(data[i], "isLeaf", true);
              }
            }
            if (!this.channels.length) {
              this.handleNodeClick(data[0]);
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
    // 点击设备树的事件
    /**
     *  "channelUuid": "string",  通道UUID
        "channelName": "string",通道名称
    		"nickName": "string",昵称
    		"channelType": "int",通道类型
    		"deviceUuid": "string",设备UUID
     */
    handleNodeClick(data, isGet) {
      if (!this.ShowAuthDisabled) return;
      api
        .getDeviceChannelList({
          parentOrgUuid: data.id,
          projectUuid: data.projectUuid,
          shootType: "shootType"
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.channels = (res.data.data || []).map(item => {
              item.projectUuid = data.projectUuid;
              return item;
            });
            // 判断当前已经有了选中的通道，则不会更新已经选中的通道
            if (this.checkedChannel) return;
            // 判断是否全选
            if (this.isCheckedAll) {
              let checkedChannelUuidArr = [];
              this.channels.forEach(element => {
                checkedChannelUuidArr.push(element.channelUuid);
              });
              this.checkedChannel = checkedChannelUuidArr;
              this.checkAll = true;
              this.$emit("transferCheckedChannel", this.channels);
            }
            // 处理单选逻辑
            if (this.boxType === "radio") {
              this.checkedChannel = this.channels[0].channelUuid;
              this.$emit("transferCheckedChannel", this.checkedChannel);
            }
          } else {
            console.log(res.data.data);
            this.checkAll = false;
            this.$message({ type: "warning", message: "查询数据为空" });
          }
        })
        .catch(() => {});
    }
  },
  computed: {
    DeviceOnOffArr() {
      return this.$store.state.equipment.DeviceOnOffArr;
    }
  },
  watch: {
    visible(val) {
      this.activeIndex = -1;
      this.TreechangeNameDialogVisible = this.visible;
    },
    DeviceOnOffArr(val) {
      console.log(val);
      let array = this.channels;
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (val.deviceUuid === element.deviceUuid) {
          this.$set(this.channels[index], "chnOnlineOrNot", val.stateValue);
          break;
        }
      }
    }
  }
};
</script>
<style lang="scss">
$labelwidth: 5em;
.c {
  .input {
    input {
      height: 30px;
      line-height: 30px;
    }
  }
  .el-select {
    height: 30px;
    width: calc(100% - #{$labelwidth});
    .el-input {
      height: 30px;
      line-height: 30px;
      input {
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
.radioIcon {
  width: 12px;
  height: 12px;
  margin-right: 5px;
}
</style>

<style lang="scss" scoped>
$labelwidth: 5em;
.treeSelectjiangWrap {
  margin: 30px 60px;
  &::after {
    content: "";
    display: block;
    clear: both;
  }
}
.c {
  overflow: hidden;
  .body {
    max-width: 300px;
    width: 80%;
    margin: 30px auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .label {
      width: $labelwidth;
      text-align: right;
      line-height: 30px;
      padding-right: 5px;
      box-sizing: border-box;
      font-family: "PingFangSC-Regular";
      font-size: 13px;
      color: #dddddd;
      text-align: right;
    }
    .input {
      width: calc(100% - #{$labelwidth});
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;

      .btn {
        height: 30px;
        padding: 7px 21px;
        background: rgba(40, 255, 187, 0.12);
        border: 1px solid rgba(40, 255, 187, 0.8);
        border-radius: 2px;
        border-radius: 2px;
        font-family: "PingFangSC-Regular";
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 0;
      }
    }
  }
  .form-item {
    margin: 0px auto;
    margin-top: 20px;
    &:first-child {
      margin-top: 50px;
    }
  }
}
.checkBoxClass {
  text-align: left;
  margin: 0px 15px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #aaaaaa;
  letter-spacing: 0;
  padding: 12px 0px;
  cursor: pointer;
}

.popverTreeClass {
  overflow: auto;
}

.BRPopoverClass .popverTreeParent .checkGroupClass {
  text-align: left;
  margin-left: 5px !important;
  margin-top: 25px;
  width: 100%;
  overflow: auto;
}
.popverTreeParent .checkGroupClass {
  text-align: left;
  margin-left: 0px !important;
  width: 100%;
  overflow: auto;
}
.popverTreeParent {
  width: 50%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 0px 8px;
}
.popverTreeParentBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  background: #202124;
}
.popverTreeParent {
  .el-checkbox + .el-checkbox {
    margin-left: 15px !important;
  }
}
.active {
  color: #17edac !important;
}
</style>
