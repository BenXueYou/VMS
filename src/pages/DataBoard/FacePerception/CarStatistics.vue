<template>
  <div class="main-block">
    <div class="main-container">
      <span class="border row1"></span>
      <span class="border row2"></span>
      <span class="border col1"></span>
      <span class="border col2"></span>
      <div class="search">
        <span>统计方式：</span>
        <el-radio-group v-model="formType"
                        style="margin-left: 3px;"
                        @change="handleFormTypeChange"
                        class="sType">
          <el-radio label="all"
                    border>网格</el-radio>
          <el-radio label="one"
                    border>小区</el-radio>
        </el-radio-group>
        <span v-if="formType == 'one'"
              style="margin-left:30px">小区：</span>
        <el-select v-model="activeStreet"
                   placeholder="请选择小区"
                   style="margin-left:10px"
                   v-if="formType == 'one'"
                   @change="handleStreetChange">
          <el-option v-for="item in streets"
                     :key="item.childUuid"
                     :label="item.childName"
                     :value="item.childUuid"></el-option>
        </el-select>
        <img src="@/assets/images/sort.png"
             width="16px"
             height="14px"
             style="margin:0 6px 0 30px;" />
        <span>排序：</span>
        <el-radio-group v-model="sort"
                        @change="handleSortChange"
                        style="margin: 2px 0 0 3px">
          <el-radio label="desc">升序</el-radio>
          <el-radio label="asc">降序</el-radio>
        </el-radio-group>
        <img src="@/assets/images/report_type.png"
             width="16px"
             height="13px"
             style="margin:0 6px 0 30px;" />
        <span>报表类型：</span>
        <el-radio-group v-model="typeRadio"
                        @change="handleTypeChange"
                        style="margin: 4px 0 0 3px;">
          <el-radio :label="1">日报表</el-radio>
          <el-radio :label="2">月报表</el-radio>
        </el-radio-group>
        <span style="margin-left:20px">日期：</span>
        <el-date-picker v-model="searchDate"
                        :type="datePickerType"
                        :value-format="dateFormat"
                        placeholder="选择日期"
                        :picker-options="pickerOptions"
                        :clearable="false"
                        @change="handleDateChange"></el-date-picker>
        <div class="button-div">
          <el-button @click="searchData"
                     icon="el-icon-search"
                     type="primary"
                     style="width: 90px;height:34px"
                     size="small">开始</el-button>
          <el-button @click="$router.go(-1)"
                     type="primary"
                     style="width: 90px;height:34px"
                     size="small"
                     class="back">
            <img src="@/assets/images/downTown/go-back.png" />返回
          </el-button>
        </div>
      </div>
      <div class="reslut">
        <div id="myChart"
             class="chart-all"></div>
        <div class="time-line">
          <div class="line-lable">时间轴：</div>
          <div class="line-slider">
            <el-slider v-model="timeValue"
                       :max="sliderMax"
                       :step="1"
                       :show-tooltip="false"
                       @change="handleSliderChange"
                       class="time-slider"></el-slider>
            <div class="time-lable">
              <template v-for="(item, index) in timeLableData">
                <div :key="index">{{ changeNum(item) }}</div>
              </template>
            </div>
          </div>
          <div class="time-unit">{{ unitText }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Api from "../utils/town";
export default {
  components: {},
  props: {},
  data() {
    return {
      formType: "all",
      sort: "desc",
      typeRadio: 1,
      // searchDate: "",
      timeValue: 0,
      sliderMax: 24,
      timeLableData: [],
      datePickerType: "date",
      unitText: "(时)",
      nowHour: new Date().getHours(),
      nowDay: new Date().getDate(),
      channelName: [],
      snapshotTotal: [],
      totalNum: 0,
      timer1: null,
      dataZoom: [],
      myChart: null,
      flag: 0,
      xAxisData: [],
      photoStaticList: [],
      faceRecordPopoverClass: "staticsPopoverClass",
      checkedChannelsUuid: "",
      tableData: [],
      activeStreet: "",
      streets: [],
      searchDate: "",
      dateFormat: "yyyy-MM-dd",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      reportType: "day"
    };
  },
  created() {},
  activated() {},
  mounted() {
    this.handleGetAllProject();
    this.formatNowTime(this.typeRadio);
    this.initData();
    this.searchData();
    setInterval(() => {
      this.watchTime();
    }, 500);
  },
  methods: {
    handleStreetChange() {
      if (this.typeRadio === 1) {
        this.getFaceCaptureSumByDay();
      } else if (this.typeRadio === 2) {
        this.getFaceCaptureSumByMonth();
      }
    },
    // 获取小区（项目）
    handleGetAllProject() {
      Api.getStreetList({
        projectName: "",
        limit: 1000000,
        page: 1
      })
        .then(res => {
          console.log(res);

          let list = res.data.data.list;
          this.streets = [...list];
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleFormTypeChange(val) {
      if (val === "one") {
        this.activeStreet = this.streets.length
          ? this.streets[0].childUuid
          : "";
      } else {
        this.activeStreet = "";
      }
      this.myChart.clear();
      this.searchData();
    },
    initData() {
      this.unitText = "(时)";
      this.searchDate = this.$common.formatDate(new Date()).substr(0, 10);
      for (let i = 0; i < 25; i++) {
        this.timeLableData.push(i);
      }
      for (let i = 0; i < 25; i++) {
        this.xAxisData.push(i);
      }
      this.myChart = this.$echarts.init(document.getElementById("myChart"));
    },
    changeNum(t) {
      if (t < 10) {
        return "0" + t;
      }
      return t;
    },
    formatNowTime(val) {
      let date = new Date();
      if (val === 1) {
        this.timeValue = date.getHours();
      } else if (val === 2) {
        let day = new Date().getDate();
        this.timeValue = day - 1;
      }
    },
    handleSortChange() {
      this.searchData();
    },
    handleTypeChange(val) {
      clearInterval(this.timer1);
      if (val === 1) {
        this.changeToDay();
        this.reportType = "day";
      } else if (val === 2) {
        this.changeToMonth();
        this.reportType = "month";
      }
      this.formatNowTime(val);
      this.searchData();
    },
    changeToDay() {
      this.timeLableData = [];
      this.datePickerType = "date";
      this.dateFormat = "yyyy-MM-dd";
      this.sliderMax = 24;
      this.searchDate = this.$common.formatDate(new Date()).substr(0, 10);
      this.unitText = "(时)";
      for (let i = 0; i < 25; i++) {
        this.timeLableData.push(i);
      }
      this.xAxisData = [];
      for (let i = 0; i < 25; i++) {
        this.xAxisData.push(i);
      }
    },
    changeToMonth() {
      this.timeLableData = [];
      this.unitText = "(天)";
      this.datePickerType = "month";
      this.dateFormat = "yyyy-MM";
      this.searchDate = this.$common.formatDate(new Date()).substr(0, 7);
      let d = new Date();
      let day = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      this.sliderMax = day - 1;
      for (let i = 1; i < day + 1; i++) {
        this.timeLableData.push(i);
      }
      this.xAxisData = [];
      for (let i = 1; i < day + 1; i++) {
        this.xAxisData.push(i);
      }
    },
    setTableData() {
      this.resetData();
      this.tableData.forEach((v, i) => {
        if (
          (this.typeRadio === 1 &&
            this.timeValue !== 0 &&
            i === this.timeValue - 1) ||
          (this.typeRadio === 2 && i === this.timeValue)
        ) {
          for (let item of v) {
            if (this.formType === "all") {
              this.channelName.push(item.grid);
            } else if (this.formType === "one") {
              this.channelName.push(item.channelName);
            }

            this.snapshotTotal.push(item.count);
            this.totalNum = this.totalNum + item.count;
          }
          if (v.length <= 20) {
            this.dataZoom = [];
            this.flag = 0;
          } else {
            this.dataZoom = [
              {
                type: "slider",
                show: true, // flase直接隐藏图形
                yAxisIndex: [0],
                width: "15px",
                borderColor: "rgba(221,221,221,0.3)",
                fillerColor: "rgba(87,94,104,0.5)",
                handleSize: 0,
                top: 50, // 滚动条靠左侧的百分比
                bottom: 50,
                start: 30, // 滚动条的起始位置
                end: 100, // 滚动条的截止位置（按比例分割你的柱状图x轴长度）
                zoomOnMouseWheel: true, // 如何触发缩放。可选值为：true：表示不按任何功能键，鼠标滚轮能触发缩放。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标滚轮能触发缩放。'ctrl'：表示按住 ctrl 和鼠标滚轮能触发缩放。'alt'：表示按住 alt 和鼠标滚轮能触发缩放。
                moveOnMouseMove: true // 如何触发数据窗口平移。true：表示不按任何功能键，鼠标移动能触发数据窗口平移。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标移动能触发数据窗口平移。'ctrl'：表示按住 ctrl 和鼠标移动能触发数据窗口平移。'alt'：表示按住 alt 和鼠标移动能触发数据窗口平移。
              }
            ];
            this.flag = 1;
          }
        }
      });
    },
    handleSliderChange(val) {
      clearInterval(this.timer1);
      this.setTableData();
      this.drawLine();
      let nowDateVal = this.changeCommon();
      if (
        this.searchDate === this.$common.formatDate(new Date()).substr(0, 10) ||
        this.searchDate === this.$common.formatDate(new Date()).substr(0, 7)
      ) {
        if (val > nowDateVal) {
          this.timeValue = nowDateVal;
          this.setTableData();
          this.drawLine();
        } else {
          this.timer1 = setInterval(() => {
            if (this.timeValue < nowDateVal) {
              this.timeValue++;
              this.setTableData();
              this.drawLine();
            } else {
              clearInterval(this.timer1);
            }
          }, 1000);
        }
      } else {
        this.timer1 = setInterval(() => {
          if (this.typeRadio === 1) {
            if (this.timeValue < 24) {
              this.timeValue++;
            } else {
              clearInterval(this.timer1);
            }
          } else if (this.typeRadio === 2) {
            let day = this.$common.getDaysByMonth(
              this.searchDate.substr(0, 4),
              this.searchDate.substr(5, 2)
            );
            if (this.timeValue < day - 1) {
              this.timeValue++;
            } else {
              clearInterval(this.timer1);
            }
          }
          this.setTableData();
          this.drawLine();
        }, 1000);
      }
    },
    changeCommon() {
      let nowDateVal = "";
      let selectDateVal = "";
      if (this.typeRadio === 1) {
        nowDateVal = new Date().getHours();
        selectDateVal = parseInt(this.searchDate.substr(8, 2));
        if (selectDateVal !== new Date().getDate()) {
          nowDateVal = 24;
        }
      } else if (this.typeRadio === 2) {
        this.timeLableData = [];
        let day = this.$common.getDaysByMonth(
          this.searchDate.substr(0, 4),
          this.searchDate.substr(5, 2)
        );
        this.sliderMax = day - 1;
        for (let i = 1; i < day + 1; i++) {
          this.timeLableData.push(i);
        }
        nowDateVal = new Date().getDate() - 1;
        selectDateVal = parseInt(this.searchDate.substr(5, 2));
        // let month = new Date().getMonth();
        if (selectDateVal !== new Date().getMonth() + 1) {
          nowDateVal = day - 1;
        }
      }
      return nowDateVal;
    },
    onChangeDate() {
      let nowDateVal = this.changeCommon();
      this.timeValue = nowDateVal;
      this.searchData();
      this.handleSliderChange(this.timeValue);
      if (this.typeRadio === 2) {
        this.xAxisData = [];
        let day = this.$common.getDaysByMonth(
          this.searchDate.substr(0, 4),
          this.searchDate.substr(5, 2)
        );
        for (let i = 1; i < day + 1; i++) {
          this.xAxisData.push(i);
        }
      }
    },
    watchTime() {
      this.nowHour = new Date().getHours();
      this.nowDay = new Date().getDate();
    },
    searchData() {
      if (this.formType === "all") {
        if (this.typeRadio === 1) {
          this.getFaceCaptureSumByDay();
        } else if (this.typeRadio === 2) {
          this.getFaceCaptureSumByMonth();
        }
      } else {
        if (!this.activeStreet) {
          this.$message({ type: "warning", message: "请先选择小区" });
          return;
        }
        if (this.typeRadio === 1) {
          this.getFaceCaptureSumByDay();
        } else if (this.typeRadio === 2) {
          this.getFaceCaptureSumByMonth();
        }
      }
    },
    resetData() {
      this.channelName = [];
      this.snapshotTotal = [];
      this.totalNum = 0;
      this.dataZoom = [];
    },
    getFaceCaptureSumByDay() {
      if (this.timeValue === 0) {
        this.resetData();
        this.drawLine();
        return;
      }
      let date = this.changeNum(this.timeValue);
      date = date + ":00:00";
      date = `${this.searchDate}`;
      this.reportType = "day";
      this.getFaceCaptureAll(date);
    },
    getFaceCaptureSumByMonth() {
      this.reportType = "month";
      let timeValueFake = this.timeValue + 1;
      let date = this.changeNum(timeValueFake);
      date = `${this.searchDate}-01`;
      this.getFaceCaptureAll(date);
    },
    getFaceCaptureAll(date) {
      switch (this.formType) {
        case "all":
          Api.getCarPtByGrid({
            order: this.sort,
            reportType: this.reportType,
            searchDate: `${date}`
          }).then(res => {
            let body = res.data;
            console.log(body);
            this.getFaceCaptureAllSuccess(body);
          });
          break;

        case "one":
          Api.getCarPtByStreet({
            order: this.sort,
            reportType: this.reportType,
            searchDate: `${date}`,
            projectUuid: this.activeStreet
          }).then(res => {
            let body = res.data;
            console.log(body);
            this.getFaceCaptureAllSuccess(body);
          });
          break;
      }
    },
    getFaceCaptureAllSuccess(body) {
      this.resetData();
      if (body.data) {
        this.tableData = body.data;
        this.setTableData();
      }
      this.drawLine();
    },
    drawLine() {
      let self = this;
      this.myChart.setOption({
        dataZoom: this.dataZoom,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          x: 80,
          y: 45,
          x2: 80,
          y2: 45,
          containLabel: true
        },
        xAxis: [
          {
            type: "value",
            axisLabel: {
              textStyle: {
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "PingFangSC-Regular"
              }
            },
            splitLine: {
              lineStyle: {
                color: "#333333"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "category",
            position: "left",
            axisLabel: {
              textStyle: {
                fontSize: 14,
                color: "#ffffff",
                fontFamily: "PingFangSC-Regular"
              }
            },
            data: this.channelName
          }
        ],
        series: [
          {
            name: "车流量",
            type: "bar",
            stack: "总量",
            barWidth: 24,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "right",
                  distance: 19.5,
                  textStyle: {
                    color: "#28FFBB",
                    fontSize: 16,
                    fontFamily: "PingFangSC-Regular"
                  }
                },
                color(params) {
                  let colorList = [];
                  let echarts = self.$echarts;
                  for (let i = 0; i < 100; i++) {
                    colorList.push(
                      new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: "rgba(238,95,117,0.05)" },
                        { offset: 1, color: "rgba(238,95,117,0.8)" }
                      ]),
                      new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: "rgba(239,187,73,0.05)" },
                        { offset: 1, color: "rgba(239,187,73,0.8)" }
                      ]),
                      new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: "rgba(40,255,187,0.05)" },
                        { offset: 1, color: "rgba(40,255,187,0.8)" }
                      ]),
                      new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: "rgba(84,157,251,0.05)" },
                        { offset: 1, color: "rgba(84,157,251,0.8)" }
                      ])
                    );
                  }
                  return colorList[params.dataIndex];
                },
                barBorderRadius: 3
              },
              emphasis: {
                barBorderRadius: 3
              }
            },
            data: this.snapshotTotal
          }
        ]
      });
    },
    handleDateChange(val) {
      let nowDateVal = this.changeCommon();
      this.timeValue = nowDateVal;
      this.searchData();
      this.handleSliderChange(this.timeValue);
      if (this.typeRadio === 2) {
        this.xAxisData = [];
        let day = this.$common.getDaysByMonth(
          this.searchDate.substr(0, 4),
          this.searchDate.substr(5, 2)
        );
        for (let i = 1; i < day + 1; i++) {
          this.xAxisData.push(i);
        }
      }
    }
  },
  watch: {
    nowHour(val) {
      if (this.typeRadio === 1) {
        this.formatNowTime(1);
        this.searchData();
      }
    },
    nowDay(val) {
      if (this.typeRadio === 2) {
        this.formatNowTime(2);
        this.searchData();
      }
    },
    flag(val) {
      this.myChart.clear();
      this.drawLine();
    }
  },
  deactivated() {},
  destroyed() {}
};
</script>

<style>
.el-date-table td.disabled div {
  background-color: transparent;
  cursor: not-allowed !important;
}
.el-month-table td.disabled .cell {
  background-color: transparent;
  cursor: not-allowed !important;
}
.staticsPopoverClass {
  width: 500px;
  height: 230px;
  position: absolute;
  background: #202127;
  min-width: 150px;
  border: 1px solid #ebeef5;
  padding: 12px;
  z-index: 2000;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-height: 80%;
  overflow: auto;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main-block {
  padding: 30px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: #000000;
  .main-container {
    padding: 0 3%;
    box-sizing: border-box;
    background: rgba(67, 251, 239, 0.07);
    width: 100%;
    height: 100%;
    position: relative;
    border: 1px solid rgba($color: #25d298, $alpha: 0.2);
    .border {
      position: absolute;
      padding: 10px;
      border-style: solid;
      border-color: rgba($color: #25d298, $alpha: 0.5);
    }
    .row1 {
      border-width: 1px 0 0 1px;
      top: 0;
      left: 0;
    }
    .row2 {
      border-width: 1px 1px 0 0;
      top: 0;
      right: 0;
    }
    .col1 {
      border-width: 0 0 1px 1px;
      bottom: 0;
      left: 0;
    }
    .col2 {
      border-width: 0 1px 1px 0;
      bottom: 0;
      right: 0;
    }
    .search {
      height: 100px;
      width: 100%;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #ffffff;
      display: flex;
      align-items: center;
      .left-space {
        margin-left: 3vw;
      }
      .button-div {
        margin-left: auto;
        margin-right: 0;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-end;
        .back {
          padding: 0;
          >>> span {
            display: block;
            width: 100%;
            height: 100%;
            line-height: 34px;
            text-align: center;
            img {
              display: inline-block;
              width: 14.7px;
              height: 12px;
              margin-right: 6px;
            }
          }
        }
      }
      .sType {
        >>> .el-radio {
          width: 60px;
          height: 34px;
          line-height: 34px;
          text-align: center;
          padding: 0;
          border-radius: 2px;
          background: rgba($color: #ffffff, $alpha: 0.1);
          border: none;
          margin-right: 0;
          .el-radio__input {
            display: none;
          }
          .el-radio__label {
            padding: 0;
          }
        }
        >>> .is-checked {
          background: rgba($color: #28ffbb, $alpha: 0.1);
          border: 1px solid rgba($color: #26d39d, $alpha: 0.8);
        }
      }
    }
    .reslut {
      height: 90%;
      width: 100%;
      position: relative;
      #myChart {
        width: 100%;
        height: 88%;
      }
      .chart-all {
        margin-top: -2%;
        margin-left: -3%;
      }
      .chart-one {
        margin-top: 0;
        margin-left: 0;
      }
      .time-line {
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        .line-lable {
          height: 75px;
          width: 4%;
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #dddddd;
        }
        .line-slider {
          height: 75px;
          width: 94%;
          margin-top: -10px;
          .time-slider {
            width: 99%;
            margin: 0 auto;
          }
          .time-lable {
            width: 100%;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #bbbbbb;
          }
        }
        .time-unit {
          height: 75px;
          width: 2%;
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #dddddd;
        }
      }
    }
  }
}
</style>
