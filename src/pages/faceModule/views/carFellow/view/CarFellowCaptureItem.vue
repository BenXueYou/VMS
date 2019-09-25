<template>
  <div class="car-capture-item">
    <div class="title">
      <img src="@/assets/images/time2.png"
           width="14px"
           height="14px">
      <div class="title-time">时间：{{$common.setStringText(detailItem.recordtime)}}</div>
      <div class="item-detail">
        <el-button type="text"
                   @click="onClickOpenDetail(detailItem.vehicleuuid)"
                   style="margin-right: 4px">详情</el-button>
        <div class="detail-arrow">
          <img src="@/assets/images/details.png"
               width="14px"
               height="14px">
        </div>
      </div>
    </div>
    <div class="picture">
      <div class="picture-car">
        <div class="pic-img">
          <img :src="$common.setPictureShow(detailItem.panoramauri)"
               width="100%"
               height="100%">
        </div>
        <div class="pic-title">车脸抓拍</div>
      </div>
      <div class="picture-main">
        <div class="pic-img">
          <img :src="$common.setPictureShow(detailItem.maindriveruri)"
               width="100%"
               height="100%">
        </div>
        <div class="pic-title">主驾抓拍</div>
      </div>
      <div class="picture-second">
        <div class="pic-img">
          <img :src="$common.setPictureShow(detailItem.subdriveruri)"
               width="100%"
               height="100%">
        </div>
        <div class="pic-title">副驾抓拍</div>
      </div>
      <div class="picture-place">
        <div class="kakou">
          <div class="point"></div>
          <el-tooltip class="item" effect="dark" :content="`卡口：${$common.setStringText(detailItem.channelName)}`" placement="top">
            <div class="text">{{$common.setStringText(detailItem.channelName)}}</div>
          </el-tooltip>
        </div>
        <div class="chedao">
          <div class="point"></div>
          <div class="text">{{`车道${$common.setStringText(detailItem.lanenumber)}`}}</div>
        </div>
        <div class="chepai">
          <div class="point"></div>
          <div class="text">{{$common.setStringText(detailItem.vehicleno)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    detailItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    };
  },
  created() {},
  mounted() {},
  methods: {
    onClickOpenDetail(vehicleuuid) {
      this.$emit("onClickOpenDetail", vehicleuuid);
    },
  },
  watch: {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@mixin flexBlock($direction) {
  display: flex;
  flex-direction: $direction;
}
.car-capture-item {
  background: #1b1e21;
  border: 1px solid #213f3a;
  border-radius: 4px;
  height: 200px;
  width: 31%;
  margin: 0 2% 16px 0;
  padding: 0 15px;
  box-sizing: border-box;
  .title {
    width: 100%;
    height: 20%;
    @include flexBlock(row);
    align-items: center;
    border-color: #303336;
    border-width: 0 0 1px 0;
    border-style: dashed;
    .title-time {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #28ffbb;
      letter-spacing: 0;
      margin-left: 10px;
    }
    .item-detail {
      margin-left: auto;
      @include flexBlock(row);
      .detail-arrow {
        @include flexBlock(row);
        align-items: center;
        align-content: center;
      }
    }
  }
  .picture {
    width: 100%;
    padding-top: 15px;
    @include flexBlock(row);
    %picBlock {
      @include flexBlock(column);
      width: 24.5%;
      margin: 0 3% 0 0;
      .pic-img {
        width: 100%;
        height: 99px;
      }
      .pic-title {
        width: 100%;
        margin-top: 10px;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #aaaaaa;
        letter-spacing: 0;
      }
    }
    .picture-car {
      @extend %picBlock;
    }
    .picture-main {
      @extend %picBlock;
    }
    .picture-second {
      @extend %picBlock;
    }
    @mixin placeDiv($color) {
      @include flexBlock(row);
      height: 36px;
      align-items: center;
      .point {
        width: 6px;
        height: 6px;
        border-radius: 55px;
        background: $color;
        margin-right: 10px;
      }
      .text {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #aaaaaa;
        letter-spacing: 0;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .picture-place {
      @include flexBlock(column);
      margin-left: 10px;
      .kakou {
        @include placeDiv(#ffba22);
      }
      .chedao {
        @include placeDiv(#ff5f5f);
      }
      .chepai {
        @include placeDiv(#24D19B);
      }
    }
  }
}
</style>
