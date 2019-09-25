<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             :modal="modal"
             class='comfirDialog'
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :visible.sync="ConfirmDialogVisible">
    <div class='c'>
      <div class="body">

        <p class="text"> {{confirmText}}</p>
        <!-- 加个空的div,便于p标签的字过短，导致下面按钮飘上去 -->
        <div style='width:100%;'>&nbsp;</div>
        <el-button @click='confirm'
                   class='btn'
                   type="primary">确定</el-button>
        <el-button @click='close'
                   class='btn'
                   type="primary">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "ConfirmDialog.vue",
  props: {
    width: {
      type: String,
      default() {
        return "400px";
      }
    },
    title: {
      type: String,
      default() {
        return "提示框";
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    },
    confirmText: {
      type: String,
      default() {
        return "询问用户是否确定的内容";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    modal: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      ConfirmDialogVisible: false
    };
  },
  mounted() {
    this.ConfirmDialogVisible = this.visible;
  },
  methods: {
    confirm() {
      this.$emit("confirm", this.name);
      this.$emit("update:visible", false);
    },
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.name = this.value;
      }
      this.ConfirmDialogVisible = this.visible;
    }
  }
};
</script>

<style lang="scss">
.comfirDialog {
  .el-dialog__header {
    border-bottom-color: transparent;
    height: 0px;
  }
  .el-dialog__title {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
$labelwidth: 3em;
.c {
  overflow: hidden;
  .body {
    max-width: 260px;
    margin: 60px auto;
    display: flex;
    flex-wrap: wrap;
    font-family: "PingFangSC-Regular";
    font-size: 16px;
    text-align: center;
    color: #ffffff;
    justify-content: space-around;
    p {
      margin: 0px 0px 40px 0px;
      // white-space: nowrap;
    }
    .btn {
      height: 30px;
      padding: 7px 21px;
      background: rgba(40, 255, 187, 0.12);
      border: 1px solid rgba(40, 255, 187, 0.8);
      border-radius: 2px;
      border-radius: 2px;
      font-family: "PingFangSC-Regular";
      font-size: 12px;
      color: #ffffff;
      letter-spacing: 0;
    }
  }
}
</style>
