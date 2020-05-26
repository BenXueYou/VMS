<template>
  <el-dialog width="460px"
             title=""
             center
             :modal="false"
             class="i-dialog"
             top="30vh"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="true">
    <div class="dialog-content">
      <!--内容-->
      <div style="margin-top: 18px;display: flex; align-items: center">
        <img src="@/assets/images/map/auth.png">
        <span style="margin-left: 10px;">您没有权限，请管理员添加。</span>
      </div>
      <div style="margin-top: 28px;">
        <el-button @click="onClickCancel"
                   size="small"
                   type="primary">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCurrentShow: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    onClickCancel() {
      this.$emit("onCancel");
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
    }
  }
};
</script>
<style lang="scss">
.i-dialog {
  .el-dialog__header {
    border-bottom: 0px;
  }
  .el-dialog__title {
    border-left: 0px;
  }
}
</style>
<style lang="scss" scoped>
.dialog-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #dddddd;
}
</style>
