<template>
  <div class="pie_wrap">
    <div id="main"></div>
  </div>
</template>

<script>
export default {
  name: "BlockPie",
  data() {
    return {
      myChart: ""
    };
  },
  props: {
    pieData: {
      type: Object,
      default() {
        return {};
      }
    },
    ShowAuthDisabled: {
      type: Boolean,
      default: true
    },
    OwnAuthDisabled: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this.handleInitPie();
  },
  methods: {
    handleInitPie() {
      this.myChart = this.$echarts.init(document.getElementById("main"));
      var option = {
        legend: {
          orient: "vertical",
          left: 10,
          top: 20,
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 35,
          align: "left",
          zlevel: "1000",
          selectedMode: false,
          textStyle: {
            color: "#DDDDDD",
            fontSize: "12px",
            padding: [3, 0, 0, 0]
          },
          data: ["出租", "自住", "闲置"],
          formatter: function(val) {
            var index = 0;
            var datas = option.series[0].data;
            var legendData = option.legend.data;
            legendData.forEach(function(v, i) {
              if (v === val) {
                index = i;
              }
            });
            return val + " " + (datas[index].value || 0);
          }
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["35%", "70%"],
            avoidLabelOverlap: true,
            hoverAnimation: true,
            top: 5,
            left: 80,
            tooltip: {
              confine: true
            },
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter: "{d}%",
                alignTo: "labelLine"
              }
            },
            labelLine: {
              normal: {
                show: true,
                length: 10,
                length2: 50,
                lineStyle: {
                  color: "#dddddd"
                }
              }
            },
            data: [
              {
                value: this.pieData.rent || null,
                name: "出租",
                itemStyle: {
                  color: "#7AC425 "
                }
              },
              {
                value: this.pieData.live || null,
                name: "自住",
                itemStyle: {
                  color: "#FFBA22 "
                }
              },
              {
                value: this.pieData.unuse || null,
                name: "闲置",
                itemStyle: {
                  color: "#0FD6E6 "
                }
              }
            ]
          }
        ]
      };
      this.myChart.setOption(option);
    }
  },
  watch: {
    pieData: {
      handler() {
        if (this.myChart) {
          this.myChart.clear();
        }
        this.handleInitPie();
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
.pie_wrap {
  width: 100%;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(23, 237, 172, 0.15);
  border-radius: 2px;
  #main {
    width: 100%;
    height: 170px;
  }
}
</style>
