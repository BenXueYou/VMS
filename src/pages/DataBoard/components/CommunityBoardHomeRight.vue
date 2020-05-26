<template>
  <div class="CommunityBoardHomeRight"
       :style="`width: ${width}`">
    <img class="drag-right"
         src="@/assets/images/communityBoard/right_drag.png"
         v-if="isShowRightDrag"
         @click="clickRight" />
    <img class="drag-left"
         src="@/assets/images/faceModule/right_drag.png"
         v-else
         height="150px"
         @click="clickLeft" />
    <div class="rightboard">
      <div class="faceReListBox"
           v-show="isShowRightboard">
        <AsideItemHead style="margin:0px;padding:0px;"
                       :options="{ title: '设备统计', isDayOrWeek: false }"></AsideItemHead>
        <div class="bodyBox"
             style="height:268px;">
          <div class="canvas"
               ref="canvas"
               style="height:100%;width:100%;"></div>
        </div>
      </div>
      <div class="bayonetReListBox"
           v-show="isShowRightboard">
        <AsideItemHead style="margin:0px;padding:0px;"
                       :options="{ title: '今日感知', isDayOrWeek: false }"></AsideItemHead>
        <div class="line-header">
          <div class="item"
               @click="goOtherPage(1)">
            <span class="line"></span>
            人脸感知
          </div>
          <div class="item2"
               @click="goOtherPage(2)">
            <span class="line"></span>
            车辆感知
          </div>
          <div class="item3"
               @click="goOtherPage(3)">
            <span class="line"></span>
            开门记录
          </div>
        </div>
        <div class="bayonetBodyBox">
          <div class="line_3d_echart"
               ref="line_3d_echart"></div>
        </div>
      </div>
      <div class="doorReListBox"
           v-show="isShowRightboard">
        <AsideItemHead style="margin:0px;padding:0px;"
                       :options="{ title: '模型预警', isDayOrWeek: false }"></AsideItemHead>
        <div class="headerTitle"
             style="margin-top:15px;margin-bottom:0px;">
          <div class="title-item">
            <img src="@/assets/images/downTown/peo_alarm.png"
                 alt="" />
            人员模型 {{ judgeTotalOne }}
          </div>
          <div class="title-item">
            <img src="@/assets/images/downTown/house_alarm.png"
                 alt="" />
            房屋模型 0
          </div>
          <div class="title-item">
            <img src="@/assets/images/downTown/car_alarm.png"
                 alt="" />
            车辆模型 0
          </div>
        </div>
        <div class="bodyBox">
          <div class="peopleWrap">
            <div class="people-item"
                 v-for="(item, index) in judgeList"
                 :key="index">
              <div class="imgWrap">
                <img :src="$common.setPictureShow(item.facePhotoUrl, 'facelog')"
                     alt="" />
                <span class="focus"
                      v-if="item.decideKeyPersonnel">重点</span>
              </div>

              <div class="peopleInfo textClips"
                   @mouseover="mymouseover"
                   @mouseout="mymouseout"
                   @mousemove="mymousemove">
                {{ item.staffName }}
              </div>
              <div class="peopleInfo textClips"
                   @mouseover="mymouseover"
                   @mouseout="mymouseout"
                   @mousemove="mymousemove">
                {{ item.address ? item.address : ""}}
              </div>
              <!-- 通道名称 作 地址  -->
              <!-- <div class="peopleInfo textClips"
                   @mouseover="mymouseover"
                   @mouseout="mymouseout"
                   @mousemove="mymousemove">
                {{ item.channelName }}
              </div> -->
              <div class="peopleInfo textClips"
                   @mouseover="mymouseover"
                   @mouseout="mymouseout"
                   @mousemove="mymousemove">
                {{ item.faceModelName }}
              </div>
              <div class="peopleInfo peopleStatus textClips"
                   @mouseover="mymouseover"
                   @mouseout="mymouseout"
                   @mousemove="mymousemove">
                {{
                  item.dealState?$common.getEnumItemName("model_analysis_s",item.dealState):'未处理'
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as Town from "../utils/town.js";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
import AsideItemHead from "@/pages/DataBoard/components/AsideItemHead";
export default {
  name: "",
  props: {},
  components: {
    AsideItemHead
  },
  data() {
    return {
      plateSrc: "",
      carSrc: "",
      FRData: {},
      BRData: {},
      DRData: {},
      width: "450px",
      isShowRightDrag: true,
      isShowRightboard: true,
      devices: {
        names: [],
        online: [],
        offline: [],
        error: [],
        sum: []
      },
      judgeList: [],
      judgeTotalOne: 0,
      timer: null,
      peoData: [],
      carData: [],
      doorData: [],
      devChart: ""
    };
  },
  created() {},
  activated() {},
  mounted() {
    var myChart = this.$echarts.init(this.$refs.canvas);
    // 指定图表的配置项和数据
    this.devChart = myChart;
    this.handleInitAllFun();
    clearInterval(this.timer);
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.handleInitAllFun();
      }, 10000);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  destroyed() {},
  methods: {
    // 鼠标划过覆盖的hover弹窗事件
    mymouseover: event => {
      mouseover(event);
    },
    mymouseout(event) {
      mouseout(event);
    },
    mymousemove(event) {
      mousemove(event);
    },
    handleInitAllFun() {
      this.getDefanceDevList();
      this.handleGetAlarmCount();
      this.handleGetAlarmList();
      this.handleGetPCD();
      this.$nextTick(() => {
        this.initBarEchart();
      });
    },
    handleGetAlarmCount() {
      Town.getAlarmCount({})
        .then(res => {
          this.judgeTotalOne = res.data.data || "0";
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGetAlarmList() {
      Town.getAlarmList({})
        .then(res => {
          let list = res.data.data;
          if (list.length > 3) {
            this.judgeList = [list[0], list[1], list[2]];
          } else {
            this.judgeList = [...list];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 设备统计
    getDefanceDevList() {
      this.devices = {
        names: [],
        online: [],
        offline: [],
        error: [],
        sum: []
      };
      Town.getDevicesStatistics().then(res => {
        let body = res.data.data;
        if (body.length) {
          body.forEach(e => {
            this.devices.names.push(e.groupType);
            this.devices.online.push(e.onlineCount);
            this.devices.offline.push(e.offlineCount);
            this.devices.error.push(e.hitchCount);
            this.devices.sum.push(
              `${e.onlineCount}/${e.offlineCount}/${e.hitchCount}`
            );
          });
        }
        this.$nextTick(() => {
          this.drawCanvas();
        });
      });
    },
    handleGetPCD() {
      Town.getDataBoardperception()
        .then(res => {
          let data = res.data.data;
          this.peoData = data.face;
          this.carData = data.car;
          this.doorData = data.door;
          this.$nextTick(() => {
            this.initBarEchart();
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    goOtherPage(index) {
      switch (index) {
        case 1:
          this.$router.push({
            path: "/DataBoard/FacePerception"
          });
          break;
        case 2:
          this.$router.push({
            path: "/DataBoard/CarPerception"
          });
          break;
        case 3:
          this.$router.push({
            path: "/DataBoard/DoorPerception"
          });
          break;
      }
    },
    handleFormatData(xInit, initData) {
      var newArr = [];
      for (const key in initData) {
        if (initData.hasOwnProperty(key)) {
          const e = initData[key];
          let itemArr = [xInit, Number(key), e];
          newArr.push(itemArr);
        }
      }
      return newArr;
    },
    initBarEchart() {
      var myChart = this.$echarts.init(this.$refs.line_3d_echart);
      var option = {
        tooltip: {
          formatter: function(params) {
            let content = `${params.marker}${params.seriesName}&nbsp;${params.value[2]}`;
            return content;
          }
        },
        backgroundColor: "#111111",
        xAxis3D: {
          type: "value",
          axisLabel: {
            color: "#fff",
            show: false
          },
          name: "",
          min: 1,
          max: 20,
          minInterval: 10,
          axisLine: {
            show: true,
            interval: 10,
            lineStyle: {
              width: 3
            }
          },
          axisPointer: {
            show: true,
            lineStyle: {
              width: 1
            }
          }
        },
        yAxis3D: {
          type: "value",
          name: "",
          axisLabel: {
            color: "#0F5B5E"
          },
          min: 0,
          max: 23,
          splitNumber: 10,
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#095B5E"],
              width: 1,
              type: "solid"
            }
          }
        },
        zAxis3D: {
          type: "value",
          name: " ",
          minInterval: 1,
          axisLabel: {
            color: "#0F5B5E",
            margin: 10
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#095B5E"],
              width: 1,
              type: "solid"
            }
          }
        },
        grid3D: {
          viewControl: {
            projection: "orthographic"
          }
        },
        series: [
          {
            name: "人脸感知",
            type: "bar3D",
            data: this.handleFormatData(5, this.peoData),
            barWidth: 1,
            barMinWidth: 1,
            itemStyle: {
              width: 1,
              color: "#36C6BE"
            }
          },
          {
            name: "车辆感知",
            type: "bar3D",
            barWidth: 1,
            barMinWidth: 1,
            data: this.handleFormatData(10, this.carData),
            itemStyle: {
              width: 1,
              color: "#7A54FF"
            }
          },
          {
            name: "开门记录",
            type: "bar3D",
            barWidth: 1,
            data: this.handleFormatData(15, this.doorData),
            itemStyle: {
              width: 1,
              color: "#FFD000"
            }
          }
        ]
      };
      myChart.setOption(option);
    },
    initLineEchart() {
      var myChart = this.$echarts.init(this.$refs.line_3d_echart);
      // 指定图表的配置项和数据
      var option = {
        tooltip: {
          formatter: function(params) {
            let content = `${params.marker}${params.seriesName}&nbsp;${params.value[2]}`;
            return content;
          }
        },
        backgroundColor: "#111111",
        xAxis3D: {
          type: "category",
          axisLabel: {
            color: "#fff",
            show: false
          },
          name: "",
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#095B5E"],
              width: 1,
              type: "solid"
            }
          }
        },
        yAxis3D: {
          type: "value",
          name: "",
          axisLabel: {
            color: "#0F5B5E"
          },
          min: 0,
          max: 23,
          splitNumber: 10,
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#095B5E"],
              width: 1,
              type: "solid"
            }
          }
        },
        zAxis3D: {
          type: "value",
          name: " ",
          minInterval: 1,
          axisLabel: {
            color: "#0F5B5E",
            margin: 10
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#095B5E"],
              width: 1,
              type: "solid"
            }
          }
        },
        grid3D: {
          viewControl: {
            projection: "orthographic"
          }
        },
        series: [
          {
            name: "人脸感知",
            type: "line3D",
            data: this.handleFormatData(5, this.peoData),
            lineStyle: {
              width: 1,
              color: "#36C6BE"
            }
          },
          {
            name: "车辆感知",
            type: "line3D",
            data: this.handleFormatData(10, this.carData),
            lineStyle: {
              width: 1,
              color: "#7A54FF"
            }
          },
          {
            name: "开门记录",
            type: "line3D",
            data: this.handleFormatData(16, this.doorData),
            lineStyle: {
              width: 1,
              color: "#FFD000"
            }
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    drawCanvas() {
      let sum = this.devices.sum.reverse();
      var option = {
        title: {
          text: ""
        },
        tooltip: {
          trigger: "axis",
          showContent: false,
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "none" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["在线", "离线", "故障"],
          itemWidth: 8,
          itemHeight: 8,
          right: 10,
          top: 15,
          textStyle: {
            color: "#fff"
          }
        },
        xAxis: {
          data: this.devices.names.reverse(),
          axisLabel: {
            showMaxLabel: false,
            interval: 0,
            rotate: 40,
            show: true,
            margin: 10,
            align: "right",
            textStyle: {
              color: "#fff"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#095B5E"],
              width: 0,
              type: "solid"
            }
          }
        },
        yAxis: {
          minInterval: 1,
          boundaryGap: ["0%", "60%"],
          axisLabel: {
            show: true,
            textStyle: {
              color: "#095B5E"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#095B5E"],
              width: 1,
              type: "solid"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          top: "15%",
          bottom: "10%",
          containLabel: true
        },
        series: [
          {
            name: "在线",
            type: "bar",
            stack: "状态",
            data: this.devices.online.reverse(),
            barWidth: 15,
            itemStyle: {
              // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              emphasis: {
                barBorderRadius: 30
              },

              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [10, 10, 10, 10],
                color: "#4CEBC9"
              }
            }
          },
          {
            name: "离线",
            type: "bar",
            stack: "状态",
            data: this.devices.offline.reverse(),
            barWidth: 15,
            itemStyle: {
              // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              emphasis: {
                barBorderRadius: 30
              },

              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [10, 10, 10, 10],
                color: "#F7B500"
              }
            }
          },
          {
            name: "故障",
            type: "bar",
            stack: "状态",
            data: this.devices.error.reverse(),
            barWidth: 15,
            itemStyle: {
              // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              emphasis: {
                barBorderRadius: 30
              },

              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [10, 10, 10, 10],
                color: "#C13536"
              }
            }
          },
          {
            name: "统计",
            type: "bar",
            stack: "状态",
            data: this.devices.error.reverse(),
            barWidth: 15,
            itemStyle: {
              // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              emphasis: {
                barBorderRadius: 30
              },

              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [10, 10, 10, 10],
                color: "#ffffff"
              }
            },
            emphasis: {
              label: {
                show: true,
                position: "top",
                color: "#17EDAC",
                fontSize: 10,
                backgroundColor: "rgba(4, 59, 51, 0.80)",
                borderWidth: 1,
                borderColor: "rgba(23, 237, 172, 0.6)",
                borderRadius: 2,
                padding: 9,
                shadowColor: "rgba(23, 237, 172, 0.30)",
                shadowBlur: 5,
                formatter: function(params) {
                  return sum[params.dataIndex];
                }
              }
            }
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      this.devChart.setOption(option);
    },
    clickRight() {
      this.isShowRightDrag = !this.isShowRightDrag;
      this.width = "0px";
      this.isShowRightboard = false;
      this.$emit("dragPanel", "toRight");
    },
    clickLeft() {
      this.isShowRightDrag = !this.isShowRightDrag;
      this.width = "450px";
      this.isShowRightboard = true;
      this.$emit("dragPanel", "toLeft");
    }
  },
  watch: {
    "$route.path": function(newVal, oldVal) {
      // 监听路由，查看params是否携带参数rtsp，从而判断是否跳转播放码流
      if (
        this.$route.fullPath.toLocaleLowerCase().indexOf("/DataBoardHome") ===
        -1
      ) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.CommunityBoardHomeRight {
  height: 100%;
  position: relative;
  .drag-right {
    position: absolute;
    top: 50%;
    right: 439px;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  .drag-left {
    position: absolute;
    top: 50%;
    right: -20px;
    transform: translate(-50%, -50%) rotate(180deg);
    cursor: pointer;
  }
  .rightboard {
    padding: 30px 25px;
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
    background-image: linear-gradient(
      to left,
      rgba(0, 0, 0, 0.95) 0%,
      rgba(0, 0, 0, 0.55) 98%
    );
    .doorReListBox,
    .bayonetReListBox,
    .faceReListBox {
      .top {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        padding-bottom: 3px;
        box-sizing: border-box;
        border-bottom: 1px solid rgba(37, 210, 152, 0.7);
        position: relative;
        .tipsTag {
          width: 150px;
          padding-left: 14px;
          box-sizing: border-box;
          line-height: 40px;
          font-family: PingFangSC-Medium;
          font-size: 22px;
          color: #ffffff;
          letter-spacing: 1.22px;
          text-align: justify;
          background: url("./../../../assets/images/communityBoard/arrowBg.png");
        }
        .tipsTxt {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #eeeeee;
          text-align: justify;
          vertical-align: super;
        }
        .numTxt {
          font-family: "digital";
          color: #17edac;
          font-size: 32px;
          margin-right: 10px;
          margin-left: 8px;
        }
        .tipsRNumber {
          color: #ff5f5f;
        }
        .tipsYNumber {
          color: #f7b500;
        }
      }
      .top:after {
        content: "";
        position: absolute;
        bottom: -3px;
        right: 3px;
        width: 5px;
        height: 5px;
        background: #26b383;
      }
      .headerTitle {
        display: flex;
        .title-item {
          flex: 1;
          text-align: center;
          font-family: "PingFangSC-Regular";
          font-size: 12px;
          color: #43fbef;
          letter-spacing: 0;
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: start;
          box-sizing: border-box;
          padding-left: 25px;
          img {
            width: 13px;
            height: 13px;
            margin-right: 3px;
          }
        }
      }
      .bodyBox {
        display: flex;
        justify-content: space-between;
        margin: 5px 0px 5px;
        .peopleWrap {
          display: flex;
          margin: 10px 0px;
          justify-content: flex-start;
          .people-item {
            width: 120px;
            padding: 10px;
            box-sizing: border-box;
            height: 205px;
            margin-right: 10px;
            background: rgba(67, 251, 239, 0.05);
            border: 1px solid rgba(67, 251, 239, 0.2);
            .imgWrap {
              width: 100px;
              height: 100px;
              background-color: #111111;
              margin-bottom: 11px;
              position: relative;
              overflow: hidden;
              .focus {
                width: 100%;
                font-size: 10px;
                color: #ff5f5f;
                line-height: 20px;
                text-align: center;
                position: absolute;
                top: 5px;
                right: -35px;
                background: rgba($color: #111111, $alpha: 0.6);
                transform: rotate(45deg);
              }
              img {
                width: 100%;
                height: 100%;
              }
            }
            .peopleInfo {
              font-family: "PingFangSC-Regular";
              font-size: 10px;
              color: #ffffff;
              margin-bottom: 3px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .peopleStatus {
              color: #ed3f3f;
              line-height: 20px;
            }
          }
        }
        .imgBox {
          width: 124px;
          height: 124px;
          margin-bottom: 9px;
          .elImageClass {
            width: 100%;
            height: 100%;
          }
        }
        .bodyCell {
          .cellTxt {
            margin-bottom: 9px;
            opacity: 0.88;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #eeeeee;
          }
        }
      }
    }
    .line-header {
      display: flex;
      justify-content: space-around;
      margin: 6px 0px 3px;
      .item {
        cursor: pointer;
        font-family: "PingFangSC-Regular";
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 0;
        .line {
          position: relative;
          display: inline-block;
          vertical-align: middle;
          width: 26px;
          height: 1px;
          background-color: #36c6bd;
          &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #36c6bd;
          }
        }
      }
      .item2 {
        cursor: pointer;
        font-family: "PingFangSC-Regular";
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 0;
        .line {
          position: relative;
          display: inline-block;
          vertical-align: middle;
          width: 26px;
          height: 1px;
          background-color: #7a54ff;
          &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #7a54ff;
          }
        }
      }
      .item3 {
        cursor: pointer;
        font-family: "PingFangSC-Regular";
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 0;
        .line {
          position: relative;
          display: inline-block;
          vertical-align: middle;
          width: 26px;
          height: 1px;
          background-color: #ffd000;
          &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #ffd000;
          }
        }
      }
    }
    .bayonetBodyBox {
      width: 400px;
      height: 245px;
      margin-top: 10px;
      margin-bottom: 40px;
      display: flex;
      justify-content: flex-start;
      .line_3d_echart {
        height: 245px;
        width: 400px;
      }
      .bayonetLeftBox {
        width: 65%;
        height: 100%;
        padding: 20px 25px;
        box-sizing: border-box;
        .carImageClass {
          width: 100%;
          height: 65%;
        }
        .plateImageClass {
          width: 100%;
          height: 35%;
        }
      }
      .bayonetRightBox {
        width: 35%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 25px 25px 30px 0px;
        box-sizing: border-box;
        .img {
          width: 14px;
          height: 14px;
          object-fit: contain;
        }
      }
    }
  }
}
</style>
