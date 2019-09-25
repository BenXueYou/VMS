<template>
  <el-dialog width="57.5%"
             title="人脸频率详情"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div style="height: 570px;">
      <el-scrollbar style="height: 95%; margin-top: 16px;">
        <div class="dialog-content">
          <!--内容-->
          <template v-for="(item, index) in detailsData">
            <div class="details-item"
                 :key="index">
              <div class="item-picture">
                <img :src="JSON.parse(item.detectedinfo).photouri"
                     width="34.7%"
                     height="104px">
                <img :src="JSON.parse(item.detectedinfo).panoramauri"
                     width="61%"
                     height="104px">
              </div>
              <div class="item-position">
                <div class="item-position-time">
                  <img src="@/assets/images/time2.png"
                       width="12px"
                       height="12px">
                  <span>{{item.time}}</span>
                </div>
                <div class="item-position-place">
                  <img src="@/assets/images/place.png"
                       width="12px"
                       height="12px">
                  <span>{{JSON.parse(item.detectedinfo).channelinfo.channelName}}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </el-scrollbar>
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
.dialog-content {
  padding: 1.8% 4%;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  height: 570px;
  width: 100%;
  flex-flow: row wrap;
  .details-item {
    margin-right: 1.2%;
    width: 32%;
    height: 160px;
    border: 1px solid #253e3a;
    border-radius: 3px;
    background: #1f2124;
    padding: 1.5% 1.4%;
    box-sizing: border-box;
    margin-bottom: 15px;
    .item-picture {
      display: flex;
      justify-content: space-between;
      flex-flow: row nowrap;
    }
    .item-position {
      display: flex;
      height: 35px;
      flex-flow: row nowrap;
      align-items: center;
      opacity: 0.6;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #ffffff;
      letter-spacing: 0;
      .item-position-time {
        margin-right: 5%;
      }
    }
  }
}
</style>
