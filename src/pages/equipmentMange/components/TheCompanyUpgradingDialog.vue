<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             :modal="modal"
             :show-close="false"
             :close-on-press-escape="false"
             class='comfirDialog'
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :visible.sync="ConfirmDialogVisible">
    <div class='c'>
      <div class="body">

        <p class="text"> {{confirmText}}</p>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "ConfirmDialog",
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
        return "";
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
        return "设备升级中...";
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
    max-width: 160px;
    margin: 60px auto;
    display: flex;
    flex-wrap: wrap;
    font-family: "PingFangSC-Regular";
    font-size: 16px;
    text-align: center;
    color: #ffffff;
    justify-content: space-around;
    p {
      margin: 0px 0px 50px 0px;
      white-space: nowrap;
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
