<template>
  <el-dialog :title="title"
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :append-to-body="true"
             :visible.sync="TreechangeNameDialogVisible">
    <div class="c">

      <div class="body form-item">
        <label class="label"
               for>亮度</label>
        <span class='name'>
          <el-slider v-model="light"></el-slider>
        </span>
      </div>

      <div class="body form-item">
        <label class="label"
               for>对比度</label>
        <span class='name'>
          <el-slider v-model="contrast"></el-slider>
        </span>
      </div>
      <div class="body form-item">
        <label class="label"
               for>饱和度</label>
        <span class='name'>
          <el-slider v-model="saturation"></el-slider>
        </span>
      </div>
      <div class="body form-item">
        <label class="label"
               for>色调</label>
        <span class='name'>
          <el-slider v-model="tonal"></el-slider>
        </span>
      </div>

      <div class="body">
        <span class="label"></span>
        <div class="input">
          <el-button @click="exit"
                     class="btn"
                     type="primary">退出</el-button>
          <el-button @click="confirm"
                     class="btn"
                     style="margin-right:10px;"
                     type="primary">恢复默认</el-button>

        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "imageAdjustDialog",
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
        return "新建标签";
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
    row: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      light: 0,
      contrast: 0,
      saturation: 0,
      tonal: 0,
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
      this.moren();
      // this.$emit("update:visible", false);
    },
    exit() {
      this.close();
    },
    close() {
      this.$emit("update:visible", false);
    },
    moren() {
      this.light = 50;
      this.contrast = 50;
      this.saturation = 50;
      this.tonal = 50;
    }
  },
  watch: {
    visible(val) {
      if (val) {
      } else {
      }
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
@import "@/style/variables.scss";
$labelwidth: 8em;
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
      text-align: left;
      line-height: 30px;
      padding-right: 5px;
      box-sizing: border-box;
      font-family: "PingFangSC-Regular";
      font-size: 13px;
      color: #dddddd;
      display: inline-block;
      vertical-align: middle;
      text-indent: 3em;
    }
    .name {
      display: inline-block;
      vertical-align: middle;
      line-height: 30px;
      width: 150px;
      font-family: "PingFangSC-Regular";
      font-size: 13px;
      color: #dddddd;
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
        float: right;
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
