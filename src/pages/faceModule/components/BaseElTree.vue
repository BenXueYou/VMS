<template>
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
</template>
<script type="text/javascript">
import * as api from "@/pages/faceModule/http/homeBaseHttp.js";
export default {
  name: "baseElTree",
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
  components: {},
  data: function() {
    return {
      defaultExpandedKeys: [],
      checkedChannel: [], // 此变量的类型不可定义为字符串
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "isLeaf"
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
    loadNode(node, resolve) {
      api
        .getFaceDeviceList({
          parentOrgUuid: node.data.id,
          shootType: this.deviceType
        })
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
    handleNodeClick(data) {
      api
        .getDeviceChannelList({
          parentOrgUuid: data.id,
          shootType: this.deviceType
        })
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
