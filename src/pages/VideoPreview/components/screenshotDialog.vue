<template>
  <el-dialog :title="title"
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :append-to-body="true"
             :visible.sync="TreechangeNameDialogVisible">
    <div class="c">
      <div class="leftWrap">
        <!-- 这里摆抓拍的照片 -->
        <!-- <img src="" alt=""> -->
      </div>
      <div class="rightInfo">
        <div class="item">
          <label class='title'>设备名称：</label>
          <span>{{form.deviceName}}</span>
        </div>
        <div class="item">
          <label class='title'>通道名称：</label>
          <span>{{form.channelName}}</span>
        </div>
        <div class="item">
          <label class='title'>抓图日期：</label>
          <span>{{form.screenshotDate}}</span>
        </div>
        <div class="item">
          <label class='title'>抓图时间：</label>
          <span>{{form.screenshotTime}}</span>
        </div>
        <div class="item">
          <label class='title'>抓图大小：</label>
          <span>{{form.screenshotSize}}</span>
        </div>
        <div class="item">
          <label class='title'>抓图人：</label>
          <span>{{form.screenshotPeople}}</span>
        </div>
        <div class="item">
          <label class='title'>抓图路径：</label>
          <span>{{form.screenshotPath}}</span>
        </div>
        <div class="item">
          <label class='title'>抓图原因：</label>
          <el-input v-model='form.screenshotReson'
                    style='width:200px;'></el-input>
        </div>
        <div class="item">
          <label class='title'>备注：</label>
          <textarea name=""
                    class='textare'
                    id=""
                    cols="30"
                    rows="3"></textarea>
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
        return "920px";
      }
    },
    title: {
      type: String,
      default() {
        return "抓图";
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
    }
  },
  data() {
    return {
      form: {
        deviceName: "",
        screenshotDate: "",
        screenshotTime: "",
        screenshotSize: "",
        screenshotPeople: "",
        screenshotPath: ""
      },
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
      this.$emit("update:visible", false);
    },
    close() {
      this.$emit("update:visible", false);
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
  display: flex;
  box-sizing: border-box;
  padding: 30px;
  .leftWrap {
    width: 55%;
  }
  .rightInfo {
    width: 45%;
    font-family: "PingFangSC-Regular";
    font-size: 12px;
    color: #dddddd;
    box-sizing: border-box;
    padding-left: 50px;
    .item {
      line-height: 35px;
      .title {
        display: inline-block;
        width: 80px;
        vertical-align: top;
      }
      .textare {
        background-color: transparent;
        font-family: "PingFangSC-Regular";
        font-size: 12px;
        padding: 15px;
        color: #aaaaaa;
      }
    }
  }
}
</style>
