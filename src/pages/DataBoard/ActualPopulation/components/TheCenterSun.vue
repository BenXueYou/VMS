<template>
  <div class="sun_wrap">
    <div id="sun"></div>
  </div>
</template>
<script>
export default {
  name: "TheCenterSun",
  data() {
    return {
      myCharts: ""
    };
  },
  props: {
    sunData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mounted() {
    let _this = this;
    this.myCharts = this.$echarts.init(document.getElementById("sun"));
    this.handleSetChartData();
    this.myCharts.on("click", function(params) {
      _this.handleRefreshOutSide(params);
    });
  },
  methods: {
    handleSetChartData() {
      var data = [
        {
          name: `${this.sunData.projectName}\n\n${this.sunData.count}人`,
          nodeClick: true,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#F8DE23" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#00714B" // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          },
          children: this.sunData.children
        }
      ];
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}"
        },
        series: {
          type: "sunburst",
          data: data,
          radius: [0, "90%"],

          emphasis: {
            itemStyle: {
              borderColor: "#ffffff",
              borderWidth: 2,
              borderType: "solid"
            }
          },
          levels: [
            {
              r0: "0%",
              r: "0%",
              itemStyle: {
                borderWidth: 0,
                borderColor: "none"
              },
              emphasis: {
                itemStyle: {
                  borderColor: "none",
                  borderWidth: 0
                }
              }
            },
            {
              r0: "0%",
              r: "26%",
              itemStyle: {
                borderWidth: 0
              },
              label: {
                rotate: "tangential",
                verticalAlign: "bottom",
                fontSize: 24,
                textBorderWidth: 0,
                textShadowColor: "#333333",
                textShadowBlur: 5,
                textShadowOffsetX: 2,
                textShadowOffsetY: 2
              }
            },
            {
              r0: "28%",
              r: "54%",
              itemStyle: {
                borderWidth: 0.2,
                borderColor: "white"
              },
              label: {
                align: "center"
              }
            },
            {
              r0: "56%",
              r: "72%",
              label: {
                align: "center",
                color: "white",
                fontWeight: 300
              },
              itemStyle: {
                borderWidth: 0.2,
                borderColor: "white"
              }
            },
            {
              r0: "72%",
              r: "72%",
              label: {
                position: "outside",
                padding: 5,
                silent: true,
                color: "white",
                fontWeight: 300
              },
              itemStyle: {
                borderWidth: 0
              }
            }
          ]
        }
      };
      this.myCharts.setOption(option);
    },
    handleRefreshOutSide(params) {
      console.log(params);
      if (!params.data.name && !this.lastClickNode.hasOwnProperty("isOrg")) {
        this.transferRefreshParams(this.lastClickNode);
      } else {
        this.transferRefreshParams(params.data);
      }
      this.lastClickNode = params.data;
    },
    transferRefreshParams(data) {
      // 判断当前层级为第二层，数据为网格层的时候
      if (data.isOrg) {
        this.$emit("changeOrg", data.projectUuid);
      } else {
        // 需要判断点击的是根节点还是项目节点，所以传入整个数据结构
        this.$emit(
          "reFreshOut",
          // params.data.projectUuid || this.sunData.projectUuid
          data.projectUuid ? data : this.sunData
        );
      }
    }
  },
  watch: {
    sunData: {
      handler(val) {
        this.handleSetChartData();
      },
      deep: true,
      immediate: false
    }
  }
};
</script>
<style lang="scss" scoped>
.sun_wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 30px;
  #sun {
    width: 100%;
    height: 100%;
  }
}
</style>
