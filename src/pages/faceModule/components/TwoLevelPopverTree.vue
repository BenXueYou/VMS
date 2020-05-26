<template>
  <el-popover ref="popverBox"
              :popper-class="`${elPopoverClass} popverBoxClass`"
              :visible-arrow="false"
              :value="visible_popver"
              @show="show"
              @hide="hide"
              placement="bottom-start"
              trigger="click">
    <el-row class="popverTreeParentBox">
      <el-row style="overflow:auto;width:25%;min-width:245px;border-right:1px solid rgb(104,103,102);background: #202124;">
        <the-leftmenu ref="leftMenu"
                      :ShowAuthDisabled="ShowAuthDisabled"
                      :OwnAuthDisabled="OwnAuthDisabled"
                      :isOnlyArea="false"
                      :isShowInput="false"
                      @clickNode="clickNodeAll"
                      @addData="addData"
                      orgType="areaOrg"></the-leftmenu>
      </el-row>
      <el-row class="popverTreeParent"
              style="width:70%;background: #202124;">
        <div class="checkBoxTitle"
             style="width:85px;">
          <el-checkbox v-if="boxType!=='radio'"
                       :indeterminate="isIndeterminate"
                       v-model="checkAll"
                       @change="handleCheckAllChange">当页全选</el-checkbox>
        </div>
        <template v-if="boxType=='radio'">
          <el-radio-group v-if="channels"
                          class="popverTreeParent checkGroupClass"
                          v-model="checkedChannel"
                          @change="handleCheckedChange">
            <el-radio style="margin:10px 15px 9px;font-family: PingFangSC-Regular;font-size: 14px;color: #AAAAAA;letter-spacing: 0;"
                      v-for="item in channels"
                      :key="item.channelUuid"
                      :label="item.channelUuid">{{item.nickName}}</el-radio>
          </el-radio-group>
          <el-row v-else
                  style="margin:15px;color:#ffffff">任务没有关联摄像机</el-row>
        </template>
        <template v-else>
          <el-checkbox-group v-if="channels"
                             class="popverTreeParent checkGroupClass"
                             v-model="checkedChannel"
                             @change="handleCheckedChange">
            <el-checkbox class="checkBoxClass"
                         v-for="(item,index) in channels"
                         :key="index"
                         :label="item.channelUuid">{{item.nickName}}</el-checkbox>
          </el-checkbox-group>
          <el-row v-else
                  style="margin:15px;color:#ffffff">任务没有关联摄像机</el-row>
        </template>
      </el-row>
    </el-row>
    <el-input slot="reference"
              :style="`width: ${inputWidth}`"
              v-model="checkedChannelName"
              :clearable="true"
              @clear="clearAction()"
              placeholder="请选择"></el-input>
  </el-popover>
</template>
<script type="text/javascript">
import baseElTree from "./baseElTree.vue";
import * as api from "@/pages/faceModule/http/homeBaseHttp.js";
import TheLeftmenu from "@/pages/AreaManagement/views/leftWrap";

export default {
  name: "twoLevelPopverTree",
  props: {
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
    deviceType: {
      type: String,
      default: "faceSnap,bodySnap"
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
  components: { baseElTree, TheLeftmenu },
  data: function() {
    return {
      defaultExpandedKeys: [],
      channels: [], // 当前节点的通道的数组
      allCheckedChannel: [], // 所有选中的通道数组
      checkedChannel: [], // 当前节点下选中的所有通道数组 此变量的类型不可定义为字符串
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "isLeaf"
      },
      checkAll: false,
      isIndeterminate: false,
      visible_popver: false,
      treeData: [],
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      // checkedChannelName: "全部",
      isFlag: false,
      projectUuid: ""
    };
  },
  watch: {
    defaultCheckedChannel(val) {
      let arr = [];
      val.forEach(element => {
        arr.push(element.channelUuid);
      });
      this.checkedChannel = arr;
    },
    channels(val) {
      if (val && !val.length) {
        this.isIndeterminate = false;
        this.checkAll = false;
      }
    }
  },
  computed: {
    checkedChannelName: {
      get: function() {
        if (
          this.checkedChannel &&
          this.checkedChannel.length >= this.channels.length
        ) {
          if (this.boxType !== "radio") {
            return "全部";
          } else {
            let channel = this.channels.filter(item => {
              return item.channelUuid === this.checkedChannel;
            })[0];

            return channel ? channel.nickName : channel;
          }
        } else {
          let str = "";
          console.log(this.checkedChannel);
          this.channels.forEach(item => {
            if (this.checkedChannel.indexOf(item.channelUuid) !== -1) {
              str += item.nickName;
              str += "，";
            }
          });
          return str.substr(0, str.length - 1);
        }
      },
      set: function(newVal) {
        if (newVal === "全部") {
          this.isIndeterminate = false;
          this.checkAll = true;
        } else {
          this.isIndeterminate = true;
          this.checkAll = false;
        }
      }
    }
  },
  mounted: function(e) {},
  activated: function() {},
  methods: {
    // 点击树节点，返回树节点数据方法
    clickNodeAll(data) {
      console.log(data);
      if (data.type === "organization" && data.type !== "project") {
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
    // 加载子节点的http
    httpLoadNodeData(data) {
      let newData = [];
      let params = {
        parentOrgUuid: data.type === "project" ? null : data.id,
        shootType: this.deviceType,
        projectUuid: data.projectUuid
      };
      return new Promise(resolve => {
        api
          .getFaceDeviceList(params)
          .then(res => {
            if (res.data.success && res.data.data) {
              newData = res.data.data || [];
              newData = newData.map((item, index) => {
                item.projectUuid = data.projectUuid;
                return item;
              });
              if (!this.channels.length) {
                this.handleNodeClick(newData[0]);
              }
            }
            resolve(newData);
          })
          .catch(() => {
            resolve(newData);
          });
      });
    },
    clearAction() {
      this.checkedChannel = [];
      this.checkedChannelName = "全部";
      this.checkAll = false;
      if (!this.checkAll && this.isCheckedAll) {
        this.$emit("transferCheckedChannel", this.channels);
      } else {
        this.$emit("transferCheckedChannel", []);
      }
    },
    // 弹窗展开的回调
    show() {},
    // 弹窗关闭的回调
    hide() {
      // if (!this.checkAll && !this.isIndeterminate && this.isCheckedAll) {
      //   this.$emit("transferCheckedChannel", this.channels);
      // }
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
    // 通道选中事件
    handleCheckedChange(value, data) {
      console.log(this.checkedChannel, "===点击复选框事件===：", value);
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
    // 非单选跨小区项目数据处理
    checkBoxAct() {
      if (this.allCheckedChannel && this.allCheckedChannel.length) {
        this.allCheckedChannel = this.allCheckedChannel.filter(item => {
          return this.checkedChannel.indexOf(item.channelUuid) > -1;
        });
      }
      this.channels.map(item => {
        if (this.checkedChannel.indexOf(item.channelUuid) > -1) {
          let boolFlag = this.allCheckedChannel.some(im => {
            return im.channelUuid === item.channelUuid;
          });
          if (!boolFlag) {
            this.allCheckedChannel.push(item);
          }
        }
      });
    },
    // 点击设备树的事件
    handleNodeClick(data) {
      // 保存节点选中的通道
      if (!this.boxType) {
        this.checkBoxAct();
      }
      api
        .getDeviceChannelList({
          parentOrgUuid: data.id,
          shootType: this.deviceType,
          projectUuid: data.projectUuid
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.channels = res.data.data || [];
            if (!this.boxType) {
              this.channels.push(...this.allCheckedChannel);
              for (let i = 0; i < this.channels.length; i++) {
                for (let j = i + 1; j < this.channels.length; j++) {
                  if (
                    this.channels[i].channelUuid ===
                    this.channels[j].channelUuid
                  ) {
                    this.channels.splice(j, 1);
                    j--;
                  }
                }
              }
            }
            this.checkAll = false;
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
  }
};
</script>
<style lang='scss' >
.checkBoxClass {
  text-align: left;
  margin: 0px 15px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #aaaaaa;
  letter-spacing: 0;
  padding: 12px 0px;
}

.popverBoxClass {
  min-width: 600px;
  max-width: 50vw;
  max-height: 50vh;
}
.popverTreeClass {
  overflow: auto;
}
.popverTreeParentBox .tabs {
  padding: 0;
  height: 100% !important;
}
.BRPopoverClass .popverTreeParent .checkGroupClass {
  text-align: left;
  // margin-left: 5px !important;
  margin-top: 25px;
  width: 100%;
  overflow: auto;
}
.popverTreeParent .checkGroupClass {
  text-align: left;
  margin-left: -85px;
  margin-top: 25px;
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
  padding-top: 10px;
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
</style>
