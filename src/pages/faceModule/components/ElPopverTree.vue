<template>
  <component :isCheckedAll="isCheckedAll"
             :channelInfoList="channelInfoList"
             :elPopoverClass="elPopoverClass"
             :deviceType="deviceType"
             :boxType="boxType"
             ref="ElPopverTree"
             @transferCheckedChannel="handleCheckedChange"
             :inputWidth="inputWidth"
             :defaultCheckedChannel="defaultCheckedChannel"
             :is="!isOneProject?'TwoLevelPopverTree':'OneLevelPopverTree'"></component>

</template>
<script type="text/javascript">
// import baseElTree from "./BaseElTree.vue";
import OneLevelPopverTree from "./OneLevelPopverTree";
import TwoLevelPopverTree from "./TwoLevelPopverTree";

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
    },
    shootType: {
      type: String,
      default: ""
    }
  },
  components: { TwoLevelPopverTree, OneLevelPopverTree },
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
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      // checkedChannelName: "全部",
      isFlag: false,
      projectUuid: "",
      isOneProject: false
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
  computed: {},
  mounted: function(e) {
    let projectType = this.$store.state.home.projectType || {};
    this.isOneProject = Boolean(projectType.platformLevel === "levelOne");
  },
  activated: function() {},
  methods: {
    clearAction() {
      this.$refs.ElPopverTree.clearAction();
    },
    // 点击复选框事件
    handleCheckedChange(value) {
      this.$emit("transferCheckedChannel", value);
    },
  }
};
</script>
<style lang='scss' >
.ElPopverTreeBox {
  overflow: auto;
  width: 25%;
  min-width: 245px;
  border-right: 1px solid rgb(104, 103, 102);
  background: #202124;
  .ElPopverRadio {
    margin: 10px 15px 9px;
    font-family: "PingFangSC-Regular";
    font-size: 14px;
    color: #aaaaaa;
    letter-spacing: 0;
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
}

.popverTreeClass {
  overflow: auto;
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
