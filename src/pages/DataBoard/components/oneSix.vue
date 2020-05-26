<template>
  <div class="oneSixWrap">
    <div class="item" @click="stepDetailAct(0)">
      <img src="@/assets/images/downTown/six-peo.png" alt />
      <div class="showContent">
        <p class="led">{{ OneSixData.population }}</p>
        <p class="title">实有人口</p>
      </div>
    </div>
    <div class="item" @click="stepDetailAct(1)">
      <img src="@/assets/images/downTown/six-house.png" alt />
      <div class="showContent">
        <p class="led">{{ OneSixData.housing }}</p>
        <p class="title">实有房屋</p>
      </div>
    </div>
    <div class="item" @click="stepDetailAct(2)">
      <img src="@/assets/images/downTown/six-unit.png" alt />
      <div class="showContent">
        <p class="led">{{ OneSixData.unit }}</p>
        <p class="title">实有单位</p>
      </div>
    </div>
    <div class="item" @click="stepDetailAct(3)">
      <img src="@/assets/images/downTown/six-buildings.png" alt />
      <div class="showContent">
        <p class="led">{{ OneSixData.security }}</p>
        <p class="title">安防设施</p>
      </div>
    </div>
    <div class="item" @click="stepDetailAct(4)">
      <img src="@/assets/images/downTown/six-dev.png" alt />
      <div class="showContent">
        <p class="led oneline">
          <span>{{ OneSixData.strength }}</span>
          <span class="line"></span>
          <span>{{ OneSixData.equipment }}</span>
        </p>
        <p class="title">力量与装备</p>
      </div>
    </div>
    <div class="item">
      <img src="@/assets/images/downTown/six-alarm.png" alt />
      <div class="showContent">
        <p class="led">{{ OneSixData.alarm }}</p>
        <p class="title">实有警情</p>
      </div>
    </div>
  </div>
</template>
<script>
import * as Api from "../utils/town";
export default {
  name: "oneSix",
  props: {},
  data() {
    return {
      OneSixData: {
        population: 0,
        housing: 0,
        unit: 0,
        security: 0,
        strength: 0,
        equipment: 0,
        alarm: 0
      },
      detailRouters: [
        { name: "实有人口", path: "./ActualPopulation" },
        { name: "实有房屋", path: "./ActualBuildHouse" },
        { name: "实有单位", path: "./ActualUnit" },
        { name: "安防设施", path: "./DefanceDev" },
        { name: "力量与装备", path: "./ActualPopwerStatistics" },
        { name: "实有警情", path: "./ActualPopulation" }
      ],
      timerSix: null
    };
  },
  activated() {},
  beforeDestroy() {
    clearInterval(this.timerSix);
    this.timerSix = null;
  },
  mounted() {
    clearInterval(this.timerSix);
    this.getInitData();
    this.timerSix = setInterval(() => {
      this.getInitData();
    }, 10000);
  },
  methods: {
    getInitData() {
      Api.getOneSixData({})
        .then(res => {
          if (res.data.success) {
            this.OneSixData = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    stepDetailAct(index) {
      this.$router.push(this.detailRouters[index].path);
    }
  },
  watch: {
    "$route.path": function(newVal, oldVal) {
      // 监听路由，查看params是否携带参数rtsp，从而判断是否跳转播放码流
      if (
        this.$route.fullPath.toLocaleLowerCase().indexOf("/DataBoardHome") ===
        -1
      ) {
        clearInterval(this.timerSix);
        this.timerSix = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.oneSixWrap {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  .item {
    display: flex;
    width: calc(50% - 14px);
    margin-right: 12px;
    align-items: center;
    background: rgba(67, 251, 239, 0.05);
    border: 1px solid rgba(67, 251, 239, 0.25);
    border-radius: 1px;
    cursor: pointer;
    margin-bottom: 12px;
    &:nth-of-type(5) {
      margin-bottom: 0;
    }
    &:nth-of-type(6) {
      margin-bottom: 0;
    }
    img {
      width: 34px;
      height: 34px;
      margin: 0px 10px;
    }
    .showContent {
      .oneline {
        display: flex;
        justify-content: space-between;
      }
      .line {
        width: 2px;
        margin: 5px;
        height: 30px;
        text-align: center;
        background: rgba(67, 251, 239, 0.3);
        border-radius: 1px;
      }
      .led {
        margin: 5px 10px;
        margin-bottom: 1px;
        font-family: "digital";
        color: #17edac;
        font-size: 32px;
      }
      .title {
        margin: 0px 10px;
        font-family: "PingFangSC-Regular";
        font-size: 12px;
        line-height: 20px;
        color: #dddddd;
        text-align: justify;
      }
    }
  }
}
</style>
