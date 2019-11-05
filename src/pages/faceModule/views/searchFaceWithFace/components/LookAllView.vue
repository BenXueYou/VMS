<template>
  <el-dialog width="800px"
             title="全景图"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <img :src="$common.setPictureShow(item.faceCapturePhotoUrl, 'facelog')" width="250px" height="250px" style="margin-right: 30px;">
      <img :src="$common.setPictureShow(item.panoramaCapturePhotoUrl, 'facelog')" width="444px" height="250px">
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
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isCurrentShow: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    onClickCancel() {
      this.$emit("onCancel");
    },
    onClickConfirm() {
      this.$emit("onCancel");
    },
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-content {
  display: flex;
  align-items: center;
  padding: 30px 40px;
  box-sizing: border-box;
}
.dialog-footer {
  padding: 25px 5% 2% 0;
  box-sizing: border-box;
}
</style>
