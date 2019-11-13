<template>
  <el-dialog title="对比详情"
             class="dialog-main-unit"
             center
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <dialogview :dialogParama="dialogParama"></dialogview>
    </div>
  </el-dialog>
</template>

<script>
import dialogview from "@/pages/faceModule/components/dialogForm.vue";

export default {
  components: {
    dialogview
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    dialogParama: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isCurrentShow: false,
      dialogfullscreenLoading: false,
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
 .dialog-main-unit .el-dialog--center .el-dialog__body {
    padding: 0px;
  }
</style>
<style lang="scss" scoped>

</style>
