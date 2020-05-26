<template>
  <div class="oneSixWrap">
    <div class="item" @click="stepDetailAct(0)">
      <img src="@/assets/images/communityBoard/people.png" alt />
      <div class="showContent">
        <p class="led">{{ OneSixData.population }}</p>
        <p class="title">实有人口</p>
      </div>
    </div>
    <div class="item" @click="stepDetailAct(1)">
      <img src="@/assets/images/communityBoard/house.png" alt />
      <div class="showContent">
        <p class="led">{{ OneSixData.housing }}</p>
        <p class="title">实有房屋</p>
      </div>
    </div>
    <div class="item" @click="stepDetailAct(2)">
      <img src="@/assets/images/communityBoard/danwei.png" alt />
      <div class="showContent">
        <p class="led">{{ OneSixData.unit }}</p>
        <p class="title">实有单位</p>
      </div>
    </div>
    <div class="item" @click="stepDetailAct(3)">
      <img src="@/assets/images/communityBoard/cuoshi.png" alt />
      <div class="showContent">
        <p class="led">{{ OneSixData.security }}</p>
        <p class="title">安防设施</p>
      </div>
    </div>
    <div class="item" @click="stepDetailAct(4)">
      <img src="@/assets/images/communityBoard/liliang.png" alt />
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
      <img src="@/assets/images/communityBoard/alarm.png" alt />
      <div class="showContent">
        <p class="led">{{ OneSixData.alarm }}</p>
        <p class="title">实有警情</p>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "../utils/home.js";
export default {
  name: "oneSix",
  props: {
    data: {
      type: Object,
      default() {
        return {
          people: "--",
          house: "--",
          danwei: "--",
          sheshi: "--",
          power: "--",
          equipment: "--",
          alarm: "--"
        };
      }
    }
  },
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
        { name: "实有人口", path: "ActualPopulation" },
        { name: "实有房屋", path: "ActualBuildHouse" },
        { name: "实有单位", path: "ActualUnit" },
        { name: "安防设施", path: "DefanceDev" },
        { name: "力量与装备", path: "ActualPopwerStatistics" },
        { name: "实有警情", path: "ActualPopulation" }
      ],
      interval: null
    };
  },
  activated() {
    this.interval = setInterval(() => {
      this.getInitData();
    }, 5000);
  },
  deactivated() {
    clearInterval(this.interval);
  },
  mounted() {
    this.getInitData();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    getInitData() {
      let data = {
        beginTime: this.$common.getStartTime(),
        endTime: this.$common.getCurrentTime()
      };
      api
        .getStaticsDataApi(data, this.$store.state.home.projectUuid)
        .then(res => {
          if (res.data.success) {
            this.OneSixData = res.data.data;
          } else {
          }
        })
        .catch(() => {});
    },
    stepDetailAct(index) {
      this.$router.push(`/CommunityBoard/${this.detailRouters[index].path}`);
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
    width: 50%;
    margin-top: 15px;
    align-items: center;
    cursor: pointer;
    img {
      width: 40px;
      height: 40px;
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
        margin: 10px;
        margin-bottom: 1px;
        font-family: "digital";
        color: #17edac;
        font-size: 40px;
      }
      .title {
        margin: 0px 10px;
        font-family: "PingFangSC-Regular";
        font-size: 18px;
        color: #dddddd;
        text-align: justify;
      }
    }
  }
}
</style>
