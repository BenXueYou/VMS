<template>
  <el-dialog width="30%"
             title="详情信息"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <div class="lock-info">
        <div class="info-pic">
          <img src="@/assets/images/user.png" width="100%" height="100%">
        </div>
        <div class="info-details">
          <div class="info-details-title">
            <img src="@/assets/images/calendar.png" width="15px" height="15px">
            <div class="info-details-title-text">开锁图片</div>
          </div>
          <div class="info-details-items">验证时间：{{"2018-05-23 12:00"}}</div>
          <div class="info-details-items">开锁方式：{{"刷卡开门"}}</div>
          <div class="info-details-items">卡号：{{"10123456251020"}}</div>
          <div class="info-details-items">开锁地址：{{"上海演示测试地区南门"}}</div>
        </div>
      </div>
      <div class="person-info">
        <div class="info-pic">
          <img src="@/assets/images/user.png" width="100%" height="100%">
        </div>
        <div class="info-details">
          <div class="info-details-title">
            <img src="@/assets/images/calendar.png" width="15px" height="15px">
            <div class="info-details-title-text">人员信息</div>
          </div>
          <div class="info-details-items">姓名：{{"张三"}}</div>
          <div class="info-details-items">性别：{{"男"}}</div>
          <div class="info-details-items">住址：{{"上海演示测试地区南门"}}</div>
          <div class="info-details-items">身份证号：{{"141126199308240135"}}</div>
          <div class="info-details-items">民族：{{"汉"}}</div>
          <div class="info-details-items">人员类型：{{"住户"}}</div>
          <div class="info-details-items">电话：{{"15935127436"}}</div>
          <div class="info-details-items">备注：{{"XXXXXX"}}</div>
        </div>
      </div>
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
  },
  data() {
    return {
      isCurrentShow: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 取消新增或修改
     */
    onClickCancel() {
      this.$emit("onCancel");
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
    }
  },
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@mixin setFontStyle($fontsize, $color) {
  font-family: PingFangSC-Regular;
  font-size: $fontsize;
  color: $color;
  letter-spacing: 1px;
}
@mixin flexBlock($direction) {
  display: flex;
  flex-direction: $direction;
}
.dialog-content {
  padding: 10px 30px;
  box-sizing: border-box;
  @mixin info-common($margin-bottom1, $margin-bottom2) {
    @include flexBlock(row);
    width: 100%;
    box-sizing: border-box;
    .info-pic {
      width: 145px;
      height: 145px;
    }
    .info-details {
      margin-left: 5%;
      @include flexBlock(column);
      .info-details-title {
        @include flexBlock(row);
        align-items: center;
        margin-bottom: $margin-bottom2;
        .info-details-title-text {
          margin-left: 10px;
          @include setFontStyle(14px, #EBECEC);
        }
      }
      .info-details-items {
        @include setFontStyle(14px, #AFAFB0);
        margin-bottom: $margin-bottom1;
      }
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
  .lock-info {
    @include info-common(8px, 20px);
    border-width: 0 0 1px 0;
    border-style: dashed;
    border-color: #444749;
    padding: 20px 20px 28px 20px;
  }
  .person-info {
    @include info-common(2px, 10px);
    padding: 28px 20px 8px 20px;
  }
}
</style>
