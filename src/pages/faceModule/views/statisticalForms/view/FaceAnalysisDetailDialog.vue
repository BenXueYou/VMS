<template>
  <el-dialog width="935px"
             title="人脸频率详情"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <template v-for="(item, index) in detailsData">
        <div :key="index"
             class="face-item">
          <div>
            <img :src="$common.setPictureShow(item.faceCapturePhotoUrl, 'facelog')"
                 style="margin-right: 10px;"
                 width="139px"
                 height="139px">
            <img :src="$common.setPictureShow(item.panoramaCapturePhotoUrl, 'facelog')"
                 width="248px"
                 height="139px">
          </div>
          <div class="item-info">
            <div class="info-one">
              <div>{{item.channelName}}</div>
              <div>{{item.captureDatetime}}</div>
            </div>
            <div class="info-two">
              <div>
                特征： &nbsp;&nbsp;&nbsp;性别：{{$common.getEnumItemName("gender", item.genderCapture)}} &nbsp;&nbsp;&nbsp;年龄：{{item.age}} &nbsp;&nbsp;&nbsp;眼镜：{{item.sunglasses ? "是" : "否"}}
              </div>
            </div>
          </div>
        </div>
      </template>
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
    detailsData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isCurrentShow: false
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
.dialog-content {
  height: 500px;
  padding: 24px 37px 24px 22px;
  box-sizing: border-box;
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  overflow-y: auto;
  .face-item {
    width: 420px;
    height: 210px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba($color: #212325, $alpha: 0.8);
    padding: 8px;
    box-sizing: border-box;
    margin-left: 15px;
    margin-bottom: 15px;
    .item-info {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #bbbbbb;
      letter-spacing: 0;
      margin-top: 10px;
      .info-one {
        display: flex;
        margin-bottom: 5px;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
</style>
