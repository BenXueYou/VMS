/* eslint-disable no-undef */
<template>
  <div class="hot_wrap">
    <div id="heatMap"></div>
  </div>
</template>

<script>
import * as Api from "../../utils/town";
require("echarts/extension/bmap/bmap");
export default {
  name: "HotMap",
  props: {
    toFull: {
      type: Boolean,
      default: false
    },
    projectUuid: {
      type: String,
      default: ""
    },
    OrgUuid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      mapArr: [],
      myMap: "",
      proId: "",
      orgId: ""
    };
  },
  mounted() {
    this.handleInitHeatMap();
    this.handleGetHotData();
    let _this = this;
    window.addEventListener("resize", () => {
      _this.myMap.resize();
    });
  },
  methods: {
    handleGetHotData() {
      Api.getHotMap({
        projectUuid: this.proId,
        areaOrgUuid: this.orgId
      })
        .then(res => {
          let data = res.data.data;
          if (data) {
            this.mapArr = data.map(e => {
              return [e.longitude, e.latitude, e.count];
            });
          } else {
            this.mapArr = [];
          }
          console.log(this.mapArr);
          this.handleSetMapOptions();
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSetMapOptions() {
      var option = {
        animation: true,
        bmap: {
          center: [121.32329065, 31.29814804],
          zoom: 13,
          roam: true,
          itemStyle: {
            areaColor: "#333333"
          }
        },
        visualMap: {
          show: false,
          top: "top",
          // seriesIndex: 0,
          pieces: [
            {min: 0, max: 100},
            {min: 100, max: 1000},
            {min: 1000},
          ],
          calculable: true,
          inRange: {
            color: [
              "rgba(23,237,172,0.15)",
              "rgba(247,181,0,0.5)",
              "rgba(255,69,69,0.7)"
            ]
          }
        },
        series: [
          {
            type: "heatmap",
            coordinateSystem: "bmap",
            data: this.mapArr,
            pointSize: 20,
            blurSize: 20
          }
        ]
      };
      this.myMap.setOption(option);
    },
    handleInitHeatMap() {
      this.myMap = this.$echarts.init(document.getElementById("heatMap"));
      this.handleSetMapOptions();
      // 添加百度地图插件
      this.myMap
        .getModel()
        .getComponent("bmap")
        .getBMap()
        .setMapStyleV2({ styleJson: this.$store.state.home.mapStyle });
    }
  },
  watch: {
    projectUuid: {
      handler(val) {
        if (val) {
          this.proId = val;
          this.orgId = "";
          this.handleGetHotData();
        }
      }
    },
    OrgUuid: {
      handler(val) {
        if (val) {
          this.proId = "";
          this.orgId = val;
          this.handleGetHotData();
        }
      }
    },
    toFull: {
      handler() {
        var element = document.getElementById("heatMap");
        // 否则，进入全屏
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
        this.myMap.resize();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.hot_wrap {
  width: 100%;
  height: 258px;
  background-image: url("../../../../assets/images/downTown/hot-border.png");
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 12px;
  #heatMap {
    width: 100%;
    height: 100%;
  }
}
</style>
