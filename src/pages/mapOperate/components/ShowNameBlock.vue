<template>
  <div class="show-name-main"
       :style="`top: ${blockTop}px; left: ${blockLeft}px`">
    <div class="info"
         :title="elementData.elementName">名称：{{elementData.elementName}}</div>
    <div class="info"
         :title="elementData.elementPointY">{{mapType === 'gis' ? "经度：" : "Y："}}{{elementData.elementPointY}}</div>
    <div class="info"
         :title="elementData.elementPointX">{{mapType === 'gis' ? "纬度：" : "X："}}{{elementData.elementPointX}}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    blockTop: {
      type: Number,
      default: 0
    },
    blockLeft: {
      type: Number,
      default: 0
    },
    mapType: {
      type: String,
      default: "gis"
    },
    elementData: {
      type: Object,
      default: () => null
    },
  },
  data() {
    return {};
  },
  created() {},
  activated() {},
  mounted() {},
  methods: {},
  watch: {},
  deactivated() {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.show-name-main {
  width: 120px;
  height: 55px;
  position: absolute;
  z-index: 999;
  background: rgba($color: #111111, $alpha: 0.9);
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  border-radius: 4px;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  .info {
    font-family: PingFangSC-Regular;
    font-size: 1px;
    color: #bbbbbb;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
