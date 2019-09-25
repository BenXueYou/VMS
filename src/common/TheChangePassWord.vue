<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :append-to-body="true"
             :visible.sync="TreechangeNameDialogVisible">
    <div class='c'>
      <div class="body">
        <label class='label'
               for="">账号：</label>
        <el-input class='input'
                  v-model="name"></el-input>
      </div>
      <div class="body">
        <label class='label'
               for="">原密码：</label>
        <el-input class='input'
                  v-model="name"></el-input>
      </div>
      <div class="body">
        <label class='label'
               for="">新密码：</label>
        <el-input class='input'
                  v-model="name"></el-input>
      </div>
      <div class="body">
        <label class='label'
               for="">确认密码：</label>
        <el-input class='input'
                  v-model="name"></el-input>
      </div>
      <div class="body">
        <span class='label'></span>
        <div class="input">
          <el-button @click='confirm'
                     type="primary">确定</el-button>
          <el-button @click='close'
                     type="primary">取消</el-button>
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
        return "400px";
      }
    },
    userName: {
      type: String,
      default() {
        return "";
      }
    },
    title: {
      type: String,
      default() {
        return "修改密码";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      TreechangeNameDialogVisible: false,
      name: ""
    };
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
    this.name = this.value;
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
      this.$emit("close");
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.name = this.value;
      }
      this.TreechangeNameDialogVisible = this.visible;
    }
  }
};
</script>
<style lang="scss">
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
$labelwidth: 5em;
.c {
  overflow: hidden;
  .body {
    max-width: 300px;
    width: 80%;
    margin: 30px auto;
    display: flex;
    flex-wrap: wrap;
    .label {
      width: $labelwidth;
      text-align: right;
      line-height: 30px;
      font-family: "PingFangSC-Regular";
      padding-right: 5px;
      box-sizing: border-box;
      font-size: 13px;
      color: #dddddd;
      text-align: right;
    }
    .input {
      width: calc(100% - #{$labelwidth});
      box-sizing: border-box;
      button {
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
}
</style>
