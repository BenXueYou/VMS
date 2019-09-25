<template>
  <el-dialog :title="title"
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :visible.sync="TreechangeNameDialogVisible">
    <div class="c">
      <div class="body form-item">
        <label class="label"
               for>名称：</label>
        <el-input class="input"
                  v-model="name"></el-input>
      </div>
      <div class="body form-item">
        <label class="label"
               for>上级：</label>
        <el-select v-model="selectValue"
                   
                   placeholder>
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="body">
        <span class="label"></span>
        <div class="input">
          <el-button @click="confirm"
                     class="btn"
                     type="primary">确定</el-button>
          <el-button @click="close"
                     class="btn"
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
    title: {
      type: String,
      default() {
        return "新建子结点";
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
    select: {
      type: String,
      default() {
        return "";
      }
    },
    options: {
      type: Array,
      default() {
        return [
          {
            value: "选项1",
            label: "黄金糕"
          },
          {
            value: "选项2",
            label: "双皮奶"
          },
          {
            value: "选项3",
            label: "蚵仔煎"
          },
          {
            value: "选项4",
            label: "龙须面"
          },
          {
            value: "选项5",
            label: "北京烤鸭"
          }
        ];
      }
    }
  },
  data() {
    return {
      TreechangeNameDialogVisible: false,
      name: "",
      selectValue: ""
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
      if (!this.selectValue) {
        this.$message.error("请选择父级节点");
        return;
      }
      if (this.name.length >= 32) {
        this.$message.error("名称不可超过32个字符");
        return;
      }
      this.$emit("confirm", this.name, this.selectValue);
      this.$emit("update:visible", false);
    },
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible(val) {
      this.name = "";
      this.selectValue = this.select;
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
  .el-select {
    height: 30px;
    width: calc(100% - #{$labelwidth});
    .el-input {
      height: 30px;
      line-height: 30px;
      input {
        height: 30px;
        line-height: 30px;
      }
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
    justify-content: flex-start;
    .label {
      width: $labelwidth;
      text-align: right;
      line-height: 30px;
      padding-right: 5px;
      box-sizing: border-box;
      font-family: "PingFangSC-Regular";
      font-size: 13px;
      color: #dddddd;
      text-align: right;
    }
    .input {
      width: calc(100% - #{$labelwidth});
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
