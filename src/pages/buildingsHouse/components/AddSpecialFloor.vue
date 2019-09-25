<template>
  <el-dialog width="440px"
             title="特殊楼层"
             class="dialog-add-special"
             center
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <el-checkbox-group v-model="checkList"
                         @change="onChangeGroup">
        <template v-for="(item, index) in floorData">
          <el-checkbox :label="item.floor"
                       :key="index">{{item.floorName}}</el-checkbox>
        </template>
      </el-checkbox-group>
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
    },
    floorData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isCurrentShow: false,
      checkList: []
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {},
    onClickCancel() {
      this.checkList = [];
      this.$emit("onCancel");
    },
    onClickConfirm() {
      this.$emit("onConfirm", this.checkList);
    },
    onChangeGroup(val) {
      console.log(val);
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
<style lang="scss">
.dialog-add-special {
  .el-dialog {
    margin-top: 30vh !important;
  }
  .el-checkbox__label {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #dddddd;
    width: 17.5px;
  }
  .el-checkbox {
    margin-bottom: 13px;
  }
}
</style>
<style lang="scss" scoped>
.dialog-content {
  padding: 2% 0 0 7%;
  box-sizing: border-box;
}
.dialog-footer {
  padding: 0 0 4% 0;
  box-sizing: border-box;
}
</style>
