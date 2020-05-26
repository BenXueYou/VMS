<template>
  <el-dialog :title="title"
             @close="close"
             :width="width"
             :modal="false"
             :class="{'dialogCenter':center}"
             :visible.sync="TreechangeNameDialogVisible">
    <div class='treeSelectjiangWrap'>
      <el-row class="popverTreeParentBox">
        <el-row style="overflow:auto; width:25%;min-width:245px;border-right:1px solid rgb(104,103,102);background: #202124;">
          <el-tree ref="deviceTree"
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
          <template v-if="boxType=='radio'">
            <el-radio-group v-if="channels"
                            class="popverTreeParent checkGroupClass"
                            v-model="checkedChannel"
                            @change="handleCheckedChange">
              <el-radio style="margin:10px 15px 9px;font-family: PingFangSC-Regular;font-size: 14px;color: #AAAAAA;letter-spacing: 0;"
                        v-for="item in channels"
                        :key="item.channelUuid"
                        :label="item.channelUuid">
                <img class="radioIcon"
                     :src="getIcon(item.chnOnlineOrNot,item.channelType)"
                     alt
                     srcset />
                {{item.nickName}}</el-radio>
            </el-radio-group>
            <el-row v-else
                    style="margin:15px;color:#ffffff">任务没有关联摄像机</el-row>
          </template>
          <template v-else>
            <div v-if="channels"
                 class="popverTreeParent checkGroupClass">
              <p class="checkBoxClass"
                 v-for="(item,index) in channels"
                 @click="clickChanel(index)"
                 @dblclick="dbClickChanel(index)"
                 :key="index"
                 :class="{'active':activeIndex==index}"
                 :label="item.channelUuid">

                <img class="radioIcon"
                     :src="getIcon(item.chnOnlineOrNot,item.channelType)"
                     alt
                     srcset />
                {{item.nickName}}</p>
            </div>

            <el-row v-else
                    style="margin:15px;color:#ffffff">任务没有关联摄像机</el-row>
          </template>
        </el-row>
      </el-row>
    </div>
    <div style='display:flex;    justify-content: flex-end;'>
      <el-button @click="sureBtn"
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
export default {
  name: "TreeChangeNameDialog.vue",
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
  },
  methods: {
    sureBtn() {
      this.$emit(
        "playRtsp",
        this.channels[this.activeIndex].channelUuid,
        "main",
        {},
        1
      );
      this.close();
    },
    clickChanel(index) {
      this.activeIndex = index;
    },
    dbClickChanel(index) {
      this.activeIndex = index;
      this.$emit(
        "playRtsp",
        this.channels[this.activeIndex].channelUuid,
        "main",
        {},
        1
      );
      this.close();
    },
    getPreviewInfo(channelUuid, data, streamType, operator = 1) {
      this.$emit("playRtsp", channelUuid, streamType, data, operator);
      this.close();
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
    handleNodeClick(data) {
      api
        .getDeviceChannelList({ parentOrgUuid: data.id })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.channels = res.data.data;
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
      console.log("----设备在线离线通知-------", val);
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
