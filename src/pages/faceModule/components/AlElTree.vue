<template>
  <!-- 过渡动画 -->
  <el-popover :popper-class="alPopoverClass"
              placement="bottom"
              width="220"
              @show="popverShow()"
              @hide="popverHidden()"
              trigger="click">
    <el-checkbox :indeterminate="isIndeterminate"
                 v-model="checkAll"
                 @change="handleCheckedAllChange">全选</el-checkbox>
    <el-tree ref="treeRef"
             :data="JSON.parse(JSON.stringify(treeDataList))"
             show-checkbox
             :node-key="nodeKey"
             :props="defaultProps"
             default-expand-all
             @check="checkChanges"></el-tree>
    <el-input slot="reference"
              :style="`width:${inputWidth}`"
              :clearable="true"
              v-model="checkedNameString"
              @clear="clearAction()"
              :placeholder="inputPlaceholder"></el-input>
  </el-popover>
</template>
<script>
export default {
  props: {
    alPopoverClass: {
      type: String
    },
    treeDataList: {
      type: Array
    },
    nodeKey: {
      type: String,
      default: "id"
    },
    inputWidth: {
      type: String,
      default: "50%"
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: "children",
          label: "label"
        };
      }
    },
    checkedUuid: {
      type: Array,
      default: () => []
    },
    inputPlaceholder: {
      type: String,
      default: "全部"
    },
    isTransferNull: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    checkedUuid: {
      immediate: true,
      handler(val) {
        this.checkedUuidList = this.checkedUuid;
      }
    },
    treeDataList: function(val) {
      this.checkAll = val.length === this.checkedUuidList.length;
      // this.checkedNameString = this.getCheckedNameString();
    },
    checkedUuidList(val) {
      this.checkAll = val.length === this.treeDataList.length;
      this.checkedNameString = this.getCheckedNameString();
    }
  },
  data: function() {
    return {
      checkedNameString: "",
      checkedUuidList: [],
      checkedObj: [],
      isIndeterminate: false,
      checkAll: true
    };
  },
  mounted: function() {},
  methods: {
    popverShow() {
      if (!this.checkedUuidList.length && !this.isTransferNull) {
        this.checkedUuidList = this.getAllUuidList();
        this.checkedObj = this.treeDataList;
      }
      console.log(this.checkAll);
      this.$refs.treeRef.setCheckedKeys(this.checkedUuidList);
    },
    popverHidden() {
      if (!this.isTransferNull && !this.checkedUuidList.length) {
        this.$emit("transferAct", this.getAllUuidList());
      }
    },
    clearAction() {
      this.checkedNameString = "";
      this.checkedUuidList = [];
      this.checkedObj = [];
      this.$emit("transferAct", []);
    },
    // 点击复选框
    checkChanges(data, node) {
      this.checkedUuidList = node.checkedKeys;
      this.checkedObj = node.checkedNodes;
      this.$refs.treeRef.setCheckedKeys(this.checkedUuidList);
      this.$emit("transferAct", this.checkedUuidList);
    },
    // 点击全选
    handleCheckedAllChange(val) {
      this.checkedUuidList = val ? this.getAllUuidList() : [];
      this.checkedObj = val ? this.treeDataList : [];
      console.log(this.checkedUuidList);
      this.$refs.treeRef.setCheckedKeys(this.checkedUuidList);
      this.$emit("transferAct", this.getAllUuidList());
    },
    getAllUuidList() {
      var tempArr = [];
      tempArr = this.treeDataList.map(item => {
        return item[this.nodeKey];
      });
      return tempArr;
    },
    getCheckedNameString() {
      var string = "";
      var name = this.defaultProps.label;
      this.checkedObj.forEach(element => {
        string += element[name];
        string += ",";
      });
      string = string.substr(0, string.length - 1);
      return !this.isTransferNull && !string ? "全部" : string;
    }
  }
};
</script>
<style lang="postcss" scoped>
.el-popover {
  position: absolute;
  background: #26292b;
  min-width: 150px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  padding: 12px;
  z-index: 2000;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: auto;
}
</style>
