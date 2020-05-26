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
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.handleInitPie();
    });
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
          selectedMode: false,
          textStyle: {
            color: "#DDDDDD",
            fontSize: "12px",
            padding: [3, 0, 0, 0]
          },
          data: ["户籍人员", "来沪人员", "外籍人员"],
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
            name: "访问来源",
            type: "pie",
            radius: ["40%", "75%"],
            avoidLabelOverlap: true,
            hoverAnimation: true,
            top: 10,
            left: 100,
            tooltip: {
              confine: true
            },
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter: "{d}%"
              }
            },
            labelLine: {
              normal: {
                show: true,
                length: 12,
                length2: 12,
                lineStyle: {
                  color: "#dddddd"
                }
              }
            },
            data: [
              {
                value: this.pieData.census_staff || null,
                name: "户籍人员",
                itemStyle: {
                  color: "#7AC425 "
                }
              },
              {
                value: this.pieData.come_shanghai_staff || null,
                name: "来沪人员",
                itemStyle: {
                  color: "#FFBA22 "
                }
              },
              {
                value: this.pieData.foreign_staff || null,
                name: "外籍人员",
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
    pieData(val) {
      this.$nextTick(() => {
        this.handleInitPie();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.pie_wrap {
  width: 100%;
  height: 166px;
  margin-bottom: 10px;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(23, 237, 172, 0.15);
  border-radius: 2px;

  #main {
    width: 100%;
    height: 166px;
  }
}
</style>
