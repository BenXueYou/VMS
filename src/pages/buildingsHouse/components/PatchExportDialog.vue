<template>
  <el-dialog width="30%"
             title="批量导出"
             center
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <div class="download-obj">
        <div class="content-lable">将要导出：</div>
        <div class="obj-info">
          <img src="@/assets/images/building.png">
          <div class="info-name">4号楼</div>
        </div>
      </div>
      <div class="download-to">
        <div class="content-lable">导出至：</div>
        <el-input class="time-interal"
                  readonly
                  v-model="name"
                  size="small"></el-input>
        <div class="path-name">
          <img src="@/assets/images/save_path.png">
          <span class="path-text">保存路径</span>
        </div>
      </div>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="onClickConfirm"
                 size="small">确定</el-button>
      <el-button type="primary"
                 @click="onClickCancel"
                 size="small">取消</el-button>
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
    }
  },
  data() {
    return {
      isCurrentShow: false,
      name: ""
    };
  },
  created() {},
  mounted() {
  },
  methods: {
    onClickCancel() {
      this.$emit("onCancel");
    },
    onClickConfirm() {
    },
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
    }
  },
  destroyed() {}
};
</script>

<style lang="scss" scoped>
.dialog-content {
  width: 100%;
  padding: 4% 2% 2% 2%;
  box-sizing: border-box;
  .download-obj {
    width: 100%;
    height: 30px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .obj-info {
      margin-left: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba($color: #FFFFFF, $alpha: 0.05);
      border-radius: 3px;
      width: 88px;
      height: 30px;
      .info-name {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #BBBBBB;
        margin-left: 4px;
      }
    }
  }
  .download-to {
    width: 100%;
    display: flex;
    align-items: center;
    .time-interal {
      margin-left: 20px;
      width: 45%;
    }
    .path-name {
      margin-left: 15px;
      cursor: pointer;
      .path-text {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #26D39D;
        letter-spacing: 0;
        margin-left: 4px;
      }
    }
  }
}
.content-lable {
  width: 25%;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #BBBBBB;
  text-align: right;
}
.dialog-footer {
  padding: 0 0 4% 0;
  box-sizing: border-box;
}
</style>
