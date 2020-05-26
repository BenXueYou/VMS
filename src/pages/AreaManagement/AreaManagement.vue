<template>
  <div class="areaManagement">
    <left-menu class="left"
               ref="leftTree"
               :ShowAuthDisabled='ShowAuthDisabled'
               :OwnAuthDisabled='OwnAuthDisabled'
               @updatePright="handleUpdateRightTree"></left-menu>
    <right-content class="right"
                   :ShowAuthDisabled='ShowAuthDisabled'
                   :OwnAuthDisabled='OwnAuthDisabled'
                   @updateTree="updateTree"
                   :updateCount="updateCount"></right-content>
  </div>
</template>
<script>
import leftMenu from "@/pages/AreaManagement/views/leftMenu";
import rightContent from "@/pages/AreaManagement/views/rightContent";

export default {
  name: "AreaManagement",
  components: {
    leftMenu,
    rightContent
  },
  data() {
    return {
      updateCount: 0,
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("区域管理", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("区域管理", "isOwn");
  },
  methods: {
    updateTree() {
      this.$refs.leftTree.updateTree();
    },
    handleUpdateRightTree() {
      this.updateCount += 1;
    }
  }
};
</script>

<style lang="scss" scoped>
.areaManagement {
  display: flex;
  height: 100%;
  .left {
    flex: 0 0 260px;
    height: 100%;
    padding: 0;
  }
  .right {
    flex: 1;
    height: 100%;
    background-color: rgb(17, 17, 17);
  }
}
</style>
