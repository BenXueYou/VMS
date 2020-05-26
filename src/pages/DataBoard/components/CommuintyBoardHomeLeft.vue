<template>
  <div class="CommunityBoardHomeLeft"
       :style="`width: ${width}`">
    <img class="drag-left"
         src="@/assets/images/communityBoard/left_drag.png"
         v-if="isShowLeftDrag"
         @click="clickLeft" />
    <img class="drag-right"
         src="@/assets/images/faceModule/right_drag.png"
         v-else
         height="150px"
         @click="clickRight" />
    <div class="leftboard"
         v-show="isShowLeftboard">
      <div class="areaName">
        <p class="hasAfter"
           style="cursor: pointer;"
           @click="clickChangeArea('grid')">
          网格数<span class="led">{{ topData.grid || "00" }}</span>
        </p>
        <p style="cursor: pointer;"
           @click="clickChangeArea('area')">
          小区数<span class="led">{{ topData.area || "00" }}</span>
        </p>
      </div>
      <div class="oneItem">
        <AsideItemHead style="margin:10px 0;padding:0"
                       :options="{ title: '一标六实', isDayOrWeek: false }"></AsideItemHead>

        <div class="itemBox">
          <one-six></one-six>
        </div>
      </div>
      <div class="oneItem">
        <AsideItemHead style="margin:5px 0;padding:0"
                       :options="{ title: '人员统计', isDayOrWeek: false }"></AsideItemHead>
        <div class="wrapVue">
          <div class="hedad">
            <div class="left">
              <img src="@/assets/images/downTown/power-icon.png"
                   alt="" />
              实有力量
            </div>
            <div class="right">
              <span class="online">在线{{ actTotal }}人</span>
              <span class="offline">离线0人</span>
            </div>
          </div>
          <div class="tableForm">
            <div class="table-item"
                 v-for="(item, index) in actPower"
                 :key="index">
              <div class="title">
                {{ item.name }}
              </div>
              <div class="onlineCount">
                {{ item.count }}
              </div>
              <div class="offlineCount">
                0
              </div>
            </div>
          </div>
        </div>
        <div class="wrapVue">
          <div class="hedad">
            <div class="left">
              <img src="@/assets/images/downTown/focus-icon.png"
                   alt="" />
              重点关注
            </div>
          </div>
          <div class="chartWrap">
            <div class="cavansWrap"
                 ref="cavansWrap"></div>
          </div>
        </div>
      </div>
      <div class="oneItem">
        <AsideItemHead style="margin:5px 0;padding:0"
                       :options="{ title: '布控报警', isDayOrWeek: false }"></AsideItemHead>
        <div class="peopleWrap">
          <div class="people-item"
               v-for="(item, index) in AlarmDataArr"
               :key="index">
            <div class="imgWrap">
              <img :src="
                  $common.setPictureShow(item.faceCapturePhotoUrl, 'facelog')
                "
                   alt="" />
            </div>
            <div class="peopleInfo flex-sbw">
              <span style="margin-right:5px;"
                    class="textClips"
                    @mouseover="mymouseover"
                    @mouseout="mymouseout"
                    @mousemove="mymousemove">
                {{ $common.plusXing(item.staffName,1,1) || '姓名' }}
              </span>
              <!-- {{ $common.getEnumItemName("staff_t", item.staffType) }} -->
              <span class="textClips"
                    @mouseover="mymouseover"
                    @mouseout="mymouseout"
                    @mousemove="mymousemove">{{ item.libraryName}}</span>
            </div>
            <el-tooltip :content="item.channelName"
                        placement="bottom"
                        effect="dark">
              <div class="peopleInfo">
                {{ item.channelName || '通道名称' }}
              </div>
            </el-tooltip>
            <el-tooltip :content="GetFormatTime(item.captureDatetime)"
                        placement="bottom"
                        effect="dark">
              <div class="peopleInfo">
                {{ GetFormatTime(item.captureDatetime) }}
              </div>
            </el-tooltip>
            <div class="peopleInfo peopleStatus">
              {{ item.dealState?$common.getEnumItemName("alarm_r", item.dealState):'未处理' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import oneSix from "@/pages/DataBoard/components/oneSix";
import AsideItemHead from "@/pages/DataBoard/components/AsideItemHead";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
import * as api from "../utils/home.js";
import * as Town from "../utils/town.js";
export default {
  name: "CommunityBoardHomeLeft",
  components: {
    oneSix,
    AsideItemHead
  },
  data() {
    return {
      videoScreenRadio: 1,
      data: {},
      alarmTotal: 0,
      TableData: [],
      isShowLeftDrag: true,
      width: "450px",
      isShowLeftboard: true,
      focus: {},
      actPower: [],
      actTotal: 0,
      alarmList: [],
      timerLeft: null,
      topData: {},
      areaChecked: false,
      gridChecked: false
    };
  },
  computed: {
    GlobalAlarm() {
      return this.$store.state.home.GlobalAlarm;
    },
    AlarmDataArr(val) {
      console.log(val);
      let alarmList = this.alarmList;
      if (this.GlobalAlarm.length < 3 && this.GlobalAlarm.length > 0) {
        let alarmOb = this.GlobalAlarm[this.GlobalAlarm.length - 1];
        alarmList.push(alarmOb);
      }
      if (alarmList.length > 3) {
        alarmList.shift();
      }
      console.log(this.GlobalAlarm);
      console.log(this.alarmList);
      return this.GlobalAlarm.length ? this.GlobalAlarm : alarmList;
    }
  },
  activated() {
    this.handleGetAlarm();
    this.handleInitData();
    console.log("-------activated ----------");
    if (!this.timerLeft) {
      this.timerLeft = setInterval(() => {
        this.handleInitData();
      }, 10000);
    }
  },
  deactivated() {
    clearInterval(this.timerLeft);
    this.timerLeft = null;
    console.log("-------deactivated----------");
  },
  mounted() {
    this.handleGetAlarm();
    this.handleInitData();
    if (!this.timerLeft) {
      this.timerLeft = setInterval(() => {
        this.handleInitData();
      }, 10000);
    }
    console.log("-------mounted----------");
  },
  beforeDestroy() {},
  destroyed() {
    clearInterval(this.timerLeft);
    this.timerLeft = null;
    console.log("-------destroyed----------");
  },
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
    GetFormatTime(date) {
      let time = new Date(date);
      return `${time.getHours() < 10 ? "0" : ""}${time.getHours()}:${
        time.getMinutes() < 10 ? "0" : ""
      }${time.getMinutes()}:${
        time.getSeconds() < 10 ? "0" : ""
      }${time.getSeconds()}`;
    },
    handleInitData() {
      this.handleGetFocusPeople();
      this.handleGetPeoPower();
      this.handleGetGridArea();
    },
    handleGetGridArea() {
      Town.getGridArea()
        .then(res => {
          let data = res.data.data;
          this.topData = {
            grid: data.grid < 10 ? `0${data.grid}` : data.grid,
            area: data.area < 10 ? `0${data.area}` : data.area
          };
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGetAlarm() {
      Town.getDataAlarmList({
        limit: 3,
        page: 1,
        alarmDatetimeBegin: this.$common.getStartTime(),
        alarmDatetimeEnd: `${this.$common
          .getStartTime()
          .substr(0, 10)} 23:59:59`
      })
        .then(res => {
          let data = res.data.data.list;
          console.log(data);
          if (data && data.length) {
            this.alarmList = [...data];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGetPeoPower() {
      Town.getActPower({})
        .then(res => {
          if (res.data.success) {
            if (res.data && res.data.data) {
              this.actPower = [];
              this.actTotal = res.data.data.total;
              for (let i = 0; i < res.data.data.list.length; i++) {
                let e = res.data.data.list[i];
                this.actPower.push({
                  name: this.$common.getEnumItemName(
                    "strength",
                    e.staffStrength
                  ),
                  count: e.count
                });
              }
            }
          }
        })
        .catch(err => {
          this.mainListLoading1 = false;
          console.log("请求错误：" + err);
        });
    },
    initEchart() {
      if (!this.$refs.cavansWrap) return;
      var myChart = this.$echarts.init(this.$refs.cavansWrap);
      let _this = this;
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: ""
        },
        tooltip: {},
        legend: {
          data: ["重点关注"]
        },
        xAxis: {
          data: this.focus.peoType,
          axisLabel: {
            interval: 0,
            rotate: 40,
            show: true,
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
          boundaryGap: ["0%", "20%"],
          axisLabel: {
            show: true,
            textStyle: {
              color: "#17EDAC"
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
          bottom: "10%",
          top: "5%",
          containLabel: true
        },
        series: [
          {
            name: "",
            type: "bar",
            data: this.focus.peoCount,
            barWidth: 15,
            itemStyle: {
              // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              emphasis: {
                barBorderRadius: 30
              },
              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [10, 10, 10, 10],
                color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#FF685F" },
                  { offset: 1, color: "#F23327" }
                ])
              }
            },
            label: {
              show: true,
              position: "top",
              color: "#F23327"
            }
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    handleGetFocusPeople() {
      Town.getFocusPeopleChart({})
        .then(res => {
          let data = res.data.data;
          let peoType = [];
          let peoCount = [];
          if (data.length) {
            for (let index = 0; index < data.length; index++) {
              const e = data[index];
              peoType.push(
                this.$common.getEnumItemName("feature", e.staffFeature)
              );
              peoCount.push(e.count);
            }
          }
          this.focus = {
            peoType: peoType,
            peoCount: peoCount
          };
          this.$nextTick(() => {
            this.initEchart();
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    setFullScreen(target) {
      if (target.requestFullscreen) {
        target.requestFullscreen();
      }
      if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen();
      }
      if (target.mozRequestFullScreen) {
        target.mozRequestFullScreen();
      }
      if (target.msRequestFullscreen) {
        target.msRequestFullscreen();
      }
    },
    initAlarmData() {
      let data = {
        beginTime: this.$common.getStartTime(),
        endTime: this.$common.getCurrentTime()
      };
      api
        .getAlarmDataApi(data)
        .then(res => {
          if (res.data.success) {
            this.TableData = res.data.data.list || [];
            this.alarmTotal = res.data.data.total || [];
          }
        })
        .catch(() => {
          this.TableData = [];
          this.alarmTotal = 0;
        });
    },
    handleSelectionChange() {},
    clickLeft() {
      this.isShowLeftDrag = !this.isShowLeftDrag;
      this.width = "0px";
      this.isShowLeftboard = false;
      this.$emit("dragPanel", "toLeft");
    },
    clickRight() {
      this.isShowLeftDrag = !this.isShowLeftDrag;
      this.width = "450px";
      this.isShowLeftboard = true;
      this.$emit("dragPanel", "toRight");
    },
    clickChangeArea(areaType) {
      if (areaType === "area") {
        this.areaChecked = !this.areaChecked;
        this.gridChecked = false;
        this.$bus.$emit("clickChangeArea", {
          areaType: areaType,
          checked: this.areaChecked
        });
      } else {
        this.gridChecked = !this.gridChecked;
        this.areaChecked = false;
        this.$bus.$emit("clickChangeArea", {
          areaType: areaType,
          checked: this.gridChecked
        });
      }
    }
  },
  watch: {
    "$route.path": function(newVal, oldVal) {
      // 监听路由，查看params是否携带参数rtsp，从而判断是否跳转播放码流
      if (
        this.$route.fullPath.toLocaleLowerCase().indexOf("/DataBoardHome") ===
        -1
      ) {
        clearInterval(this.timerLeft);
        this.timerLeft = null;
      }
    }
  }
};
</script>
<style>
.flex-sbw {
  display: flex;
  justify-content: space-between;
}
.CommunityBoardHomeLeft .el-table th {
  border-right: 0px dashed rgba(255, 255, 255, 0.12) !important;
}
.CommunityBoardHomeLeft .el-table__body-wrapper {
  overflow: hidden;
  position: relative;
  background: rgba(37, 210, 152, 0.09);
}
.CommunityBoardHomeLeft .el-table__header-wrapper {
  margin-bottom: 5px;
}
.CommunityBoardHomeLeft .el-table thead {
  background: rgba(37, 210, 152, 0.09);
}
.CommunityBoardHomeLeft .el-radio-button__inner {
  padding: 0px;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid rgba(38, 211, 157, 0.3);
  border-radius: 1px !important;
  margin-right: 5px;
  height: 24px;
  width: 24px;
  color: #dddddd !important;
  text-align: center;
  line-height: 24px;
}
.CommunityBoardHomeLeft
  .el-radio-button__orig-radio:checked
  + .el-radio-button__inner {
  color: #ffffff;
  background-color: rgba(38, 179, 131, 0.3);
  border-color: #26d39d;
  -webkit-box-shadow: -1px 0 0 0 #26d39d;
  box-shadow: -1px 0 0 0 #26d39d;
}
.CommunityBoardHomeLeft .el-button--default,
.CommunityBoardHomeLeft .el-button--default:hover,
.CommunityBoardHomeLeft .el-button--default:active,
.CommunityBoardHomeLeft .el-button--default:focus {
  font-family: "PingFangSC-Regular";
  font-size: 16px;
  height: 40px;
  border: 1px #424445 solid;
  background: transparent;
}
.CommunityBoardHomeLeft .titleBtn .el-button {
  border: 0;
}
.CommunityBoardHomeLeft
  .titleBtn
  .el-radio-button:first-child
  .el-radio-button__inner {
  /* border-left: 0px solid #dcdfe6; */
  border-radius: 4px 0 0 4px;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
</style>
<style lang="scss" scoped>
.led {
  margin: 10px;
  margin-bottom: 1px;
  font-family: "digital";
  background-image: linear-gradient(
    to top,
    #17edac 0%,
    #17edac 38%,
    #e0fff5 100%
  );
  -webkit-background-clip: text;
  color: transparent;
}
.CommunityBoardHomeLeft {
  height: 100%;
  position: relative;
  .drag-left {
    position: absolute;
    top: 50%;
    left: 461px;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  .drag-right {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  .leftboard {
    height: 100%;
    overflow-y: auto;
    width: 450px;
    padding: 25px 25px;
    padding-top: 15px;
    padding-bottom: 10px;
    box-sizing: border-box;
    background-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.95) 0%,
      rgba(0, 0, 0, 0.55) 98%
    );
    .areaName {
      color: #17edac;
      font-size: 24px;
      display: flex;
      p {
        flex: 1;
        text-align: center;
        margin: 8px 0px;
        padding: 0px;
        background-image: linear-gradient(
          to top,
          #17edac 0%,
          #17edac 38%,
          #e0fff5 100%
        );
        -webkit-background-clip: text;
        color: transparent;
      }
      .hasAfter {
        position: relative;
        &::after {
          content: "";
          display: block;
          height: 80%;
          width: 2px;
          background: rgba($color: #43fbef, $alpha: 0.4);
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    .itemBox {
      padding: 1px 0 7px 12px;
    }
    .oneItem {
      .peopleWrap {
        display: flex;
        margin: 10px 0px;
        margin-bottom: 0;
        justify-content: flex-start;
        .people-item {
          width: 120px;
          padding: 10px;
          box-sizing: border-box;
          height: 185px;
          margin-right: 10px;
          background: rgba(67, 251, 239, 0.05);
          border: 1px solid rgba(67, 251, 239, 0.2);
          .imgWrap {
            width: 100px;
            height: 100px;
            background-color: #fff;
            margin-bottom: 3px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .peopleInfo {
            font-family: "PingFangSC-Regular";
            font-size: 10px;
            color: #ffffff;
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
      .videoBox {
        height: 240px;
        border: 1px solid rgba(37, 210, 152, 0.3);
        margin-top: 15px;
        margin-bottom: 30px;
      }
      .tableForm {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        // margin: 10px 0px;
        margin-bottom: 10px;
        .table-item {
          display: flex;
          line-height: 30px;
          text-align: center;
          .title {
            width: 100px;
            font-family: "PingFangSC-Regular";
            font-size: 12px;
            color: #ffffff;
            letter-spacing: 0;
            border: 1px solid #095b5e;
            background: rgba(23, 237, 172, 0.1);
          }
          .onlineCount {
            width: 45px;
            font-family: "digital";
            color: #17edac;
            border: 1px solid #095b5e;
          }
          .offlineCount {
            width: 45px;
            font-family: "digital";
            color: #ffc015;
            border: 1px solid #095b5e;
          }
        }
      }
      .hedad {
        display: flex;
        justify-content: space-between;
        padding: 10px 10px;
        .left {
          font-family: "PingFangSC-Regular";
          font-size: 14px;
          color: #17edac;
          letter-spacing: 0;
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: flex-start;
          img {
            display: block;
            width: 18px;
            height: 18px;
            margin-right: 5px;
          }
        }
        .right {
          font-family: " PingFangSC-Regular";
          font-size: 12px;
          color: #ffffff;
          letter-spacing: 0;
          .online {
            position: relative;
            padding-left: 6px;
            padding-right: 20px;
            &::after {
              content: "";
              position: absolute;
              left: -10px;
              top: 50%;
              transform: translateY(-50%);
              width: 8px;
              height: 8px;
              background: #25d298;
              border-radius: 1px;
            }
          }
          .offline {
            position: relative;
            padding-left: 6px;
            padding-right: 10px;
            &::after {
              content: "";
              position: absolute;
              left: -10px;
              top: 50%;
              transform: translateY(-50%);
              width: 8px;
              height: 8px;
              background: #ffc015;
              border-radius: 1px;
            }
          }
        }
      }
      .chartWrap {
        height: 180px;
        .cavansWrap {
          height: 100%;
        }
      }
    }
  }
  .boardTitle {
    position: relative;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(37, 210, 152, 0.7);
    height: 34px;
    padding: 1px 0;
    background-image: linear-gradient(
      to left,
      rgba(23, 237, 172, 0) 4%,
      rgba(23, 237, 172, 0.25) 90%
    );
    // box-sizing: border-box;
    &::after {
      content: "";
      position: absolute;
      bottom: -3px;
      right: 3px;
      width: 5px;
      height: 5px;
      background: #26b383;
    }
    .titleBg {
      padding: 5px 40px 5px 12px;
      font-family: "PingFangSC-Medium";
      font-size: 19px;
      color: #ffffff;
      letter-spacing: 1.1px;
      text-align: justify;
      // background: url("../../../assets/images/communityBoard/arrowBg.png")
      //   no-repeat;
      background-size: cover;
      line-height: 24px;
      .ThatThreeLine {
        position: relative;
        display: inline-block;
        width: 3px;
        height: 20px;
        background-color: rgba(255, 255, 255, 0.25);
        margin-right: 10px;
        border-radius: 1px;
        &::before {
          content: "";
          position: absolute;
          top: 50%;
          right: -5px;
          width: 3px;
          height: 15px;
          transform: translateY(-50%);
          background-color: rgba(255, 255, 255, 0.125);
          border-radius: 1px;
        }
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          right: -10px;
          width: 3px;
          height: 12px;
          transform: translateY(-50%);
          background-color: rgba(255, 255, 255, 0.125);
          border-radius: 1px;
        }
      }
    }
    .CBAlarmNumberBox {
      color: #ff5f5f;
      font-family: "digital";
      margin-right: 10px;
      font-size: 32px;
      span {
        font-family: "PingFangSC-Regular";
        font-size: 16px;
        color: #eeeeee;
        text-align: justify;
        vertical-align: middle;
      }
    }
  }
}
</style>
