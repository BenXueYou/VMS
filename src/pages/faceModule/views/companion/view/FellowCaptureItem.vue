<template>
  <div class="fellow-capture-detail">
    <div class="fellow-info-detail-img">
      <img :src="JSON.parse(item.photoinfo).imageUri"
           width="100%"
           height="100%">
    </div>
    <div class="fellow-info-detail-line1">
      <div class="title">
        {{item.time ? item.time : "暂无"}}
      </div>
    </div>
    <div class="fellow-info-detail-line2">
      <div class="title">
        {{item.channelName ? item.channelName : "暂无"}}
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
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  watch: {
  },
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.fellow-capture-detail {
  height: 188px;
  width: 158px;
  border: 1px solid #213f3a;
  border-radius: 3px;
  background: #1b1e21;
  padding: 10px 15px;
  box-sizing: border-box;
  margin: 0 0 10px 1.2%;
  .fellow-info-detail-img {
    width: 124px;
    height: 124px;
  }
  %title {
    opacity: 0.6;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #ffffff;
    letter-spacing: 0;
    margin: 5px 2px 0 0;
    width: 100%;
    text-align: center;
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
    text-align: center;
    flex-direction: row;
    width: 100%;
    .title {
      @extend %title;
    }
  }
}
</style>
