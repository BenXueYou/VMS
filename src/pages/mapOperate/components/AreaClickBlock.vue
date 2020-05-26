<template>
  <div class="info-block"
       :style="`top: ${blockTop}px; left: ${blockLeft}px`">
    <div class="item-block">
      <div class="area-pic">
        <img :src="require('@/assets/images/map/area_default.png')"
             height="169px"
             width="300px">
      </div>
      <div class="area-name">
        <img src="@/assets/images/map/place.png">
        <div style="margin-left: 4px">{{areaData.village || 0}}</div>
      </div>
      <div class="area-info">
        <div class="info-detail">
          <div class="detail-item">
            <div class="detail-spot"></div>
            <div>实有人口</div>
            <div class="detail-num">{{oneSixData.population}}</div>
          </div>
          <div class="detail-item">
            <div class="detail-spot"></div>
            <div>实有单位</div>
            <div class="detail-num">{{oneSixData.unit}}</div>
          </div>
          <div class="detail-item">
            <div class="detail-spot"></div>
            <div>力量与装备</div>
            <div class="detail-num">{{oneSixData.strength}} | {{oneSixData.equipment}}</div>
          </div>
        </div>
        <div class="info-detail">
          <div class="detail-item">
            <div class="detail-spot"></div>
            <div>实有房屋</div>
            <div class="detail-num">{{oneSixData.housing}}</div>
          </div>
          <div class="detail-item">
            <div class="detail-spot"></div>
            <div>安防设施</div>
            <div class="detail-num">{{oneSixData.security}}</div>
          </div>
          <div class="detail-item">
            <div class="detail-spot"></div>
            <div>实有警情</div>
            <div class="detail-num">{{oneSixData.alarm}}</div>
          </div>
        </div>
      </div>
      <div class="button-enter"
           @click.stop="enterDownPlatform">
        <img src="@/assets/images/map/enter.png">
        <div>进入</div>
      </div>
      <div class="block-arrow"></div>
    </div>
  </div>
</template>

<script>
import * as api from "@/pages/communityBoard/utils/home.js";

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
    areaData: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      oneSixData: {
        population: 0,
        housing: 0,
        unit: 0,
        security: 0,
        strength: 0,
        equipment: 0,
        alarm: 0
      },
      paramObj: null
    };
  },
  created() {},
  activated() {},
  mounted() {},
  methods: {
    getInitData() {
      let data = {
        beginTime: this.$common.getStartTime(),
        endTime: this.$common.getCurrentTime()
      };
      api
        .getStaticsDataApi(data, this.projectUuid)
        .then(res => {
          if (res.data.success) {
            this.oneSixData = res.data.data;
          }
        })
        .catch(() => {});
    },
    enterDownPlatform() {
      this.$emit("enterDownPlatform", this.paramObj);
    }
  },
  watch: {
    areaData: {
      immediate: true,
      handler(val) {
        this.projectUuid = val.projectUuid;
        this.paramObj = {
          projectUuid: val.projectUuid,
          projectType: {
            platformLevel: val.platformLevel,
            platformType: val.platformType,
            projectUuid: val.projectUuid,
            projectName: val.village
          }
        };
        this.getInitData();
      },
      deep: true
    }
  },
  deactivated() {},
  destroyed() {}
};
</script>
<style lang="scss">
.info-block {
  .el-button--small {
    padding: 9px 8px;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.info-block {
  position: absolute;
  z-index: 1009;
  .item-block {
    height: 335px;
    position: relative;
    width: 335px;
    padding: 16px 18px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: rgba($color: #111111, $alpha: 0.9);
    border-radius: 2px;
    .area-name {
      display: flex;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ffffff;
      text-align: justify;
    }
    .area-info {
      display: flex;
      justify-content: space-between;
      .info-detail {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #dddddd;
        text-align: justify;
        margin-left: 12px;
        width: 96%;
        .detail-item {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          .detail-spot {
            border: {
              color: rgba($color: #d8d8d8, $alpha: 0.8);
              style: solid;
              width: 2px;
            }
            border-radius: 55px;
            margin-right: 10px;
          }
          .detail-num {
            margin-left: 20px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #00d8a0;
            text-align: justify;
          }
        }
      }
    }
    .button-enter {
      position: absolute;
      cursor: pointer;
      padding: 5px 0px;
      box-sizing: border-box;
      right: 20px;
      top: 158px;
      width: 52px;
      height: 52px;
      background: #00d8a0;
      border-radius: 100px;
      font-family: PingFangSC-Medium;
      font-size: 10px;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
    }
    .block-arrow {
      position: absolute;
      top: 335px;
      left: 30px;
      height: 0;
      width: 0;
      overflow: hidden;
      font-size: 0;
      line-height: 0;
      border-color: rgba($color: #111111, $alpha: 0.9) transparent transparent
        transparent;
      border-style: solid dashed dashed dashed;
      border-width: 27px 27px 0 0;
    }
  }
}
</style>
