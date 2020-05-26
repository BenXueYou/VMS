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
               for>设备名称：</label>
        <span class='name' :title="devName">{{devName}}</span>
      </div>
      <div class="body form-item">
        <label class="label"
               for>通道名称：</label>
        <span class='name' :title="channelName">{{channelName}}</span>
      </div>
      <div class="body form-item">
        <label class="label"
               for>通道类型：</label>
        <span class='name'>{{channelType}}</span>
      </div>
      <div class="body form-item">
        <label class="label"
               for>经度：</label>
        <span class='name'>{{jd}}</span>
      </div>
      <div class="body form-item">
        <label class="label"
               for>纬度：</label>
        <span class='name'>{{wd}}</span>
      </div>

      <div class="body">
        <span class="label"></span>
        <div class="input">
          <el-button @click="confirm"
                     class="btn"
                     type="primary">确定</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "TreeChangeNameDialog.vue",
  props: {
    videoinfo: {
      type: Object
    },
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
    value: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      devName: "",
      channelName: "",
      channelType: "",
      jd: "",
      wd: "",
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
        console.log(this.videoinfo);
        this.devName = this.videoinfo.deviceName;
        this.channelName = this.videoinfo.channelName;
        this.channelType = this.videoinfo.channelType;
        this.jd = this.videoinfo.longitude;
        this.wd = this.videoinfo.latitude;
      } else {
        this.devName = "";
        this.channelName = "";
        this.channelType = "";
        this.jd = "";
        this.wd = "";
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
      text-align: right;
      line-height: 30px;
      padding-right: 5px;
      box-sizing: border-box;
      font-family: "PingFangSC-Regular";
      font-size: 13px;
      color: #dddddd;
      text-align: right;
      display: inline-block;
      vertical-align: middle;
    }
    .name {
      display: inline-block;
      vertical-align: middle;
      line-height: 30px;
      font-family: "PingFangSC-Regular";
      font-size: 13px;
      color: #dddddd;
      width: 180px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
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
