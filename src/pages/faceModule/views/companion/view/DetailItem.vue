<template>
  <div class="fellow-info-detail">
    <div class="fellow-info-detail-img">
      <img :src="$common.setPictureShow(item.faceCapturePhotoUrl, 'facelog')" width="100%" height="100%">
    </div>
    <div class="fellow-info-detail-line1">
      <div class="title text-show">
        共同摄像头{{item.travelTogetherChannel ? item.travelTogetherChannel : "未知"}}个
      </div>
      <div class="title text-show" style="margin-left: 2px;">
        同行{{item.travelTogetherFrequency ? item.travelTogetherFrequency : "未知"}}次
      </div>
    </div>
    <div class="fellow-info-detail-line2">
      <div class="title text-show">
        {{item.staffName ? item.staffName : "未知"}}
      </div>
      <div class="title text-show">
        {{item.faceLibraryName ? item.faceLibraryName : "未知"}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {};
  },
  created () {},
  mounted () {},
  methods: {},
  watch: {},
  destroyed () {},
};
</script>
<style lang="scss" scoped>
.fellow-info-detail {
  height: 188px;
  width: 168px;
  border: 1px solid #213F3A;
  border-radius: 3px;
  background: #1B1E21;
  padding: 10px 15px;
  box-sizing: border-box;
  .fellow-info-detail-img {
    width: 134px;
    height: 124px;
  }
  %title {
    opacity: 0.6;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: 0;
    margin: 5px 2px 0 0;
  }
  .fellow-info-detail-line1 {
    display: flex;
    flex-direction: row;
    width: 100%;
    .title {
      @extend %title;
    }
  }
  .fellow-info-detail-line2 {
    display: flex;
    flex-direction: row;
    width: 100%;
    .title {
      @extend %title;
      margin-left: 18px;
    }
  }
}
</style>
