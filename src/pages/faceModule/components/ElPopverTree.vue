<template>
	<el-popover
		class="popverTree"
		ref="popverBox"
		:popper-class="elPopoverClass"
		:visible-arrow="false"
		:value="visible_popver"
		@show="show"
		@hide="hide"
		placement="bottom-start"
		trigger="click"
	>
		<el-row class="popverTreeParentBox">
			<el-row
				style="overflow:auto; width:25%;min-width:245px;border-right:1px solid rgb(104,103,102);background: #202124;"
			>
				<el-tree
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
					@node-click="handleNodeClick"
					:default-expanded-keys="defaultExpandedKeys"
				></el-tree>
			</el-row>
			<el-row class="popverTreeParent" style="width:65%;background: #202124;">
				<div class="checkBoxTitle" style="width:85px;">
					<el-checkbox
						v-if="boxType!=='radio'"
						:indeterminate="isIndeterminate"
						v-model="checkAll"
						@change="handleCheckAllChange"
					>全选</el-checkbox>
				</div>
				<template v-if="boxType=='radio'">
					<el-radio-group
						v-if="channels"
						class="popverTreeParent checkGroupClass"
						v-model="checkedChannel"
						@change="handleCheckedChange"
					>
						<el-radio
							style="margin:10px 15px 9px;font-family: PingFangSC-Regular;font-size: 14px;color: #AAAAAA;letter-spacing: 0;"
							v-for="item in channels"
							:key="item.channelUuid"
							:label="item.channelUuid"
						>{{item.nickName}}</el-radio>
					</el-radio-group>
					<el-row v-else style="margin:15px;color:#ffffff">任务没有关联摄像机</el-row>
				</template>
				<template v-else>
					<el-checkbox-group
						v-if="channels"
						class="popverTreeParent checkGroupClass"
						v-model="checkedChannel"
						@change="handleCheckedChange"
					>
						<el-checkbox
							class="checkBoxClass"
							v-for="(item,index) in channels"
							:key="index"
							:label="item.channelUuid"
						>{{item.nickName}}</el-checkbox>
					</el-checkbox-group>
					<el-row v-else style="margin:15px;color:#ffffff">任务没有关联摄像机</el-row>
				</template>
			</el-row>
		</el-row>
		<el-input
			slot="reference"
			:style="`width: ${inputWidth}`"
			v-model="checkedChannelName"
			:clearable="true"
			@clear="clearAction()"
			placeholder="请选择"
		></el-input>
	</el-popover>
</template>
<script type="text/javascript">
import * as api from "@/pages/faceModule/http/homeBaseHttp.js";
export default {
  name: "elPopverTree",
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
  components: {},

  data: function() {
    return {
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
      isFlag: false
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
    checkedChannel(val) {
      // if (!val) val = [];
      // if (val.length && val.length === this.channels.length) {
      //   this.checkedChannelName = "全部";
      //   this.isIndeterminate = false;
      //   this.checkAll = true;
      //   return;
      // }
      // let str = "";
      // this.channels.forEach(item => {
      //   if (val.indexOf(item.channelUuid) !== -1) {
      //     str += item.nickName;
      //     str += "，";
      //   }
      // });
      // this.checkedChannelName = str.substr(0, str.length - 1);
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
					this.checkedChannel.length === this.channels.length
        ) {
          return "全部";
        } else {
          let str = "";
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
    clearAction() {
      this.checkedChannel = [];
      this.checkedChannelName = "";
      this.checkAll = false;
      this.$emit("transferCheckedChannel", []);
    },
    // 弹窗展开的回调
    show() {},
    // 弹窗关闭的回调
    hide() {},
    // 全选的回调
    handleCheckAllChange(val) {
      console.log(val);
      let checkedChannelArr = [];
      let checkedChannelUuidArr = [];
      if (val) {
        this.channels.forEach(element => {
          checkedChannelUuidArr.push(element.channelUuid);
          checkedChannelArr.push(element);
        });
      }
      this.checkedChannel = checkedChannelUuidArr;
      console.log(this.checkedChannel);
      this.isIndeterminate = false;
      this.$emit("transferCheckedChannel", checkedChannelArr);
    },
    // 点击全选复选框事件
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
            // 判断是否全选
            if (this.isCheckedAll) {
              let checkedChannelUuidArr = [];
              this.channels.forEach(element => {
                checkedChannelUuidArr.push(element.channelUuid);
              });
              this.checkedChannel = checkedChannelUuidArr;
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
<style lang='scss'>
.checkBoxClass {
	text-align: left;
	margin: 0px 15px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
	letter-spacing: 0;
	padding: 12px 0px;
}

.popverTreeClass {
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
