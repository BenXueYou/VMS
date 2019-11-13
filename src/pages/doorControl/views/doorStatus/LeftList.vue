<template>
  <div class="left-list">
    <div class="tree-input">
      <el-input placeholder="请输入关键字搜索"
                v-model="filterText"
                size="small"
                style="width: 97%">
        <img slot="prefix"
             :src="icons.search">
      </el-input>
    </div>
    <el-tabs v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane label="楼栋单元"
                   name="1">
        <building-tree v-if="isShowBuildTree"
                       :filterText="filterText"
                       @setTreeRootData="setTreeRootData" />
      </el-tab-pane>
      <el-tab-pane label="设备树"
                   name="2">
        <org-device-tree v-if="isShowOrgTree"
                         :filterText="filterText"
                         @setTreeRootData="setTreeRootData" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import icons from "@/common/icon.js";
import BuildingTree from "@/pages/doorControl/views/doorStatus/BuildingTree";
import OrgDeviceTree from "@/pages/doorControl/views/doorStatus/OrgDeviceTree";

export default {
  components: {
    BuildingTree,
    OrgDeviceTree
  },
  props: {},
  data() {
    return {
      icons,
      filterText: "",
      activeName: "1",
      isShowBuildTree: true,
      isShowOrgTree: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleClick(val) {
      if (val.name === "1") {
        this.isShowBuildTree = true;
        this.isShowOrgTree = false;
      } else if (val.name === "2") {
        this.isShowBuildTree = false;
        this.isShowOrgTree = true;
      }
    },
    setTreeRootData(params) {
      this.$bus.$emit("setTreeRootData", params);
    }
  },
  watch: {},
  destroyed() {}
};
</script>

<style lang="scss">
@import "@/style/variables.scss";
.left-list {
  .el-input__prefix {
    position: absolute;
    left: 43px;
    top: 12px;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 40px;
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
    top: 9px;
  }
  .el-tree {
    background: rgba($color: #212326, $alpha: 1);
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.left-list {
  width: 16%;
  min-width: 180px;
  height: 100%;
  background: #212325;
  padding: 0 1%;
  box-sizing: border-box;
  .tree-input {
    height: 75px;
    display: flex;
    align-items: center;
    .image {
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
