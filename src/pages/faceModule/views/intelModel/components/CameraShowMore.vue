<template>
  <div class="intel-info-block"
       :style="`height: ${height};`">
    <div class="intel-item-container" :id="containerId">
      <template v-for="(item, index) in dataList">
        <div :key="index"
             class="list-item">
          <img :src="itemIcon"
               style="margin-right: 6px;">
          <span>{{item.channelName}}</span>
        </div>
      </template>
      <div class="more"
           @click="clickMore"
           v-if="isShowMore">
        <span style="margin-right: 6px;">{{buttonText}}</span>
        <img src="@/assets/images/faceModule/more.png"
             v-if="buttonText === '更多'">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: ""
    },
    blockHeight: {
      type: String,
      default: ""
    },
    itemIcon: {
      type: String,
      default: ""
    },
    dataList: {
      type: Array,
      default: () => []
    },
    lineLimit: {
      type: Number,
      default: 1
    },
    containerId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isDragDown: true,
      height: "",
      isShowMore: false,
      buttonText: "更多"
    };
  },
  created() {},
  activated() {},
  mounted() {
    this.height = this.blockHeight;
    this.isShowMoreButton();
  },
  methods: {
    isShowMoreButton() {
      this.$nextTick(() => {
        if (this.isDragDown && document.getElementById(this.containerId).offsetHeight > (37 * this.lineLimit)) {
          this.isShowMore = true;
        } else {
          this.isShowMore = false;
        }
      });
    },
    clickMore() {
      if (this.buttonText === "更多") {
        this.buttonText = "收起";
        this.height = "auto";
      } else {
        this.buttonText = "更多";
        this.height = this.blockHeight;
      }
    }
  },
  watch: {
    dataList: {
      handler() {
        this.isShowMoreButton();
      },
      deep: true
    }
  },
  deactivated() {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.intel-info-block {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #dddddd;
  overflow: hidden;
  transition: 0.1s all;
  position: relative;
  .intel-item-container {
    width: 85%;
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    .list-item {
      display: flex;
      height: 37px;
      align-items: center;
      margin-right: 48px;
    }
  }
  .more {
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #26d39d;
    position: absolute;
    display: flex;
    align-items: center;
    bottom: 0px;
    right: 60px;
    cursor: pointer;
  }
}
</style>
