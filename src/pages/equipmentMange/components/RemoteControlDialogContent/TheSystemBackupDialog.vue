<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             :modal="modal"
             :class="{'dialogCenter':center}"
             :visible.sync="TreechangeNameDialogVisible">
    <div class='c'>
      <div class="body form-item">
        <label class='label'
               for="">导出备份文件：</label>
        <el-input class='input'
                  v-model="name"></el-input>
      </div>
      <div class="body form-item">
        <label class='label'
               for="">进度：</label>
        <el-progress :percentage="percentage"
                     class='progressbar'
                     color="#26D39D"></el-progress>
      </div>
      <div class="body">
        <span class='label'></span>
        <div class="input">
          <el-button @click='confirm'
                     class='btn'
                     type="primary">保存</el-button>
          <el-button @click='close'
                     class='btn'
                     type="primary">停止</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "TreeChangeNameDialog.vue",
  props: {
    width: {
      type: String,
      default() {
        return "600px";
      }
    },
    title: {
      type: String,
      default() {
        return "备份数据";
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
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
      TreechangeNameDialogVisible: false,
      name: "",
      selectValue: "",
      percentage: 30
    };
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
  },
  methods: {
    confirm() {
      if (!this.name) {
        this.$message.error("名称不可以为空!");
        return;
      }
      this.$emit("confirm", this.name);
      this.$emit("update:visible", false);
    },
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible(val) {
      this.name = "";
      this.TreechangeNameDialogVisible = this.visible;
    }
  }
};
</script>
<style lang="scss">
$labelwidth: 5em;
.c {
  .input {
    input {
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>

<style lang="scss" scoped>
$labelwidth: 10em;
.c {
  overflow: hidden;
  .body {
    width: calc(320px + #{$labelwidth});
    margin: 30px auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .progressbar {
      width: 280px;
      line-height: 30px;
      display: inline-block;
    }
    .label {
      width: $labelwidth;
      text-align: right;
      line-height: 30px;
      padding-right: 5px;
      box-sizing: border-box;
      font-family: "PingFangSC-Regular";
      font-size: 12px;
      color: #dddddd;
      text-align: right;
    }
    .input {
      width: 320px;
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;

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
  .form-item {
    margin: 0px auto;
    margin-top: 20px;
    &:first-child {
      margin-top: 50px;
    }
  }
}
</style>
