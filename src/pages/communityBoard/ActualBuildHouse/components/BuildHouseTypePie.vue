<template>
  <div class="PieCharts">
    <div class="title">
      <div class="icon"></div>
      <div class="text">房屋类型</div>
    </div>
    <div class="echartsWrap" id="echartsWrap">
      <div id="canvasPieNew"></div>
    </div>
    <!-- <div class="echartsDetail">
        <div class="singleDetail"
              v-for="(item,index) in pieData"
              :key="index">
          <div class="squareIcon" :style="{background:color[index]}"></div>
          <div class="text">{{item.name}}</div>
        </div>
      </div> -->
  </div>
</template>
<script>
export default {
  name: "BHPie",
  props: {
    pieData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // pieData: [],
      color: [
        "#25D298",
        "#20BAFF",
        "#4A5DE5",
        "rgba(255,208,0,0.55)",
        "rgba(226,16,16,0.55)"
      ]
    };
  },
  mounted() {
    let that = this;
    setTimeout(() => {
      that.drawPie();
    }, 0);
  },
  methods: {
    drawPie() {
      var dom = document.getElementById("canvasPieNew");
      let myChart = this.$echarts.init(dom);
      let arr = ["自住", "出租", "闲置", "重点关注", "报警"];
      const deal = data => {
        let num = [];
        console.log(data);
        console.log(arr);
        for (let i = 0; i < arr.length; i++) {
          let index = data.findIndex(item => {
            return item.name === arr[i];
          });
          if (index !== -1) {
            num.push(data[index]);
          }
        }
        console.log(num);
        return num;
      };
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} {d}%",
          show: false
        },
        legend: {
          orient: "vertical",
          show: false,
          itemGap: 50,
          left: "right",
          top: "center",
          data: arr
        },
        color: this.color,
        series: [
          {
            minAngle: 25,
            // roseType: "radius",
            name: "房屋类型",
            type: "pie",
            radius: ["40%", "80%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            // top: 100,
            // left: 100,
            label: {
              normal: {
                show: true,
                // position: "outside",
                formatter: "{b}{c} \n{d}%",
                textStyle: {
                  fontWeight: 'normal',
                  fontSize: 12,
                  // height: 60,
                  // lineHeight: 20,
                  // align: 'center' // 设置文字居中
                }
              },
              // normal: {
              //   show: false,
              //   position: "center"
              // },
              show: true,
              position: "outside",
              formatter: "{d}%"
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: deal(this.pieData)
            // roseType: 'radius'
          }
        ]
      };
      myChart.setOption(option);
    },
    drawPie1() {
      var dom = document.getElementById("canvasPieNew");
      let myChart = this.$echarts.init(dom);
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: 10,
          top: 20,
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 35,
          align: "left",
          selectedMode: false,
          textStyle: {
            fontSize: "12px",
            padding: [3, 0, 0, 0]
          },
          data: ["户籍人员", "来沪人员", "外籍人员"].reverse()
        },
        color: this.color,
        series: [
          {
            name: "人员类型",
            type: "pie",
            radius: ["40%", "80%"],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter: "{d}%"
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: this.pieData
          }
        ]
      };
      myChart.setOption(option);
    }
  },
  watch: {
    pieData(val) {
      console.log("val===", val);
      let that = this;
      setTimeout(() => {
        that.drawPie();
      }, 0);
    }
  }
};
</script>
<style>
.PieCharts #echartsWrap {
  position: relative;
}
.PieCharts #canvasPieNew {
  width: 100%;
  min-height: 240px;
  position: relative;
  top: -10px;
}
.PieCharts .echartsDetail {
  width: 100%;
  height: 17px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 40px;
}
.PieCharts .echartsDetail .singleDetail {
  width: 100px;
  height: 17px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.PieCharts .echartsDetail .singleDetail .squareIcon {
  width: 10px;
  height: 10px;
  margin-right: 8px;
}
.PieCharts .echartsDetail .singleDetail .text {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #dddddd;
  text-align: justify;
}
</style>
<style lang="scss" scoped>
.PieCharts {
  width: 370px;
  height: 302px;
  opacity: 0.8;
  background: rgba(67, 251, 239, 0.07);
  border: 1px solid rgba(37, 210, 152, 0.3);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  position: relative;
  .title {
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-left: 23px;
    // margin-bottom: 30px;
    .icon {
      width: 4px;
      height: 16px;
      opacity: 0.79;
      background-image: linear-gradient(-180deg, #4cebc9 0%, #25d298 100%);
      border-radius: 1px;
      border-radius: 1px;
      margin-right: 9px;
    }
    .text {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #25d298;
      text-align: justify;
    }
  }
  .progressWrap {
    width: 100%;
    .singleProgress {
      width: 100%;
      height: 22px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding-left: 30px;
      box-sizing: border-box;
      margin-bottom: 25px;
      .progressTitle {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #dddddd;
        text-align: justify;
        margin-right: 12px;
        width: 70px;
        text-align: left;
      }
    }
    .el-progress__text {
      display: none;
    }
  }
}
.PieCharts:before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(to left, #25d298, #25d298) left top no-repeat,
    linear-gradient(to bottom, #25d298, #25d298) left top no-repeat,
    linear-gradient(to left, #25d298, #25d298) right top no-repeat,
    linear-gradient(to bottom, #25d298, #25d298) right top no-repeat,
    linear-gradient(to left, #25d298, #25d298) left bottom no-repeat,
    linear-gradient(to bottom, #25d298, #25d298) left bottom no-repeat,
    linear-gradient(to left, #25d298, #25d298) right bottom no-repeat,
    linear-gradient(to left, #25d298, #25d298) right bottom no-repeat;
  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
}
</style>
