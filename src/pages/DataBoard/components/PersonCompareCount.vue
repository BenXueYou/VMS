<template>
  <div class="main-block">
    <div class="main-container">
      <div class="search">
        <span>统计方式：</span>
        <!-- <el-radio-group
					:disabled="!ShowAuthDisabled"
					v-model="formType"
					@change="handleFormTypeChange"
					style="margin-left: 3px;"
				>
					<el-radio label="all">全部</el-radio>
					<el-radio label="one">单一</el-radio>
				</el-radio-group> -->
        <el-button type="primary"
                   :class="{'offActive':type=='grid'}"
                   @click="set('single')"
                   size="medium">网格</el-button>
        <el-button type="primary"
                   :class="{'offActive':type=='single'}"
                   @click="set('grid')"
                   size="medium">单一</el-button>
        <img src="@/assets/images/sort.png"
             width="15.1px"
             height="12px"
             v-if="formType === 'all'"
             style="margin:0 0.5% 0 6vw;" />
        <span v-if="formType === 'all'">排序：</span>
        <el-radio-group :disabled="!ShowAuthDisabled"
                        v-model="sort"
                        v-if="formType === 'all'"
                        @change="handleSortChange"
                        style="margin: 2px 0 0 3px">
          <el-radio label="desc">升序</el-radio>
          <el-radio label="asc">降序</el-radio>
        </el-radio-group>
        <span v-if="formType === 'one'"
              class="left-space">布控任务：</span>
        <el-select v-model="faceMonitorUuid"
                   filterable
                   v-show="formType === 'one'"
                   collapse-tags
                   placeholder="请选择">
          <el-option v-for="item in missionArr"
                     :key="item.faceMonitorUuid"
                     :label="item.faceMonitorName"
                     :value="item.faceMonitorUuid"></el-option>
        </el-select>
        <img src="@/assets/images/report_type.png"
             width="15.1px"
             height="12px"
             style="margin:0 0.5% 0 6vw;" />
        <span>报表类型：</span>
        <el-radio-group :disabled="!ShowAuthDisabled"
                        v-model="typeRadio"
                        @change="handleTypeChange"
                        style="margin: 4px 0 0 3px;">
          <el-radio :label="1">日报表</el-radio>
          <el-radio :label="2">月报表</el-radio>
        </el-radio-group>
        <div class="button-div">
          <span>统计日期：</span>
          <el-date-picker v-model="dateValue"
                          style="width: 150px; margin-left: 2px;"
                          :type="datePickerType"
                          :value-format="dateValueFormat"
                          @change="onChangeDate"
                          size="small"
                          placeholder="选择日期"></el-date-picker>
          <el-button :disabled="!ShowAuthDisabled"
                     @click="searchData"
                     icon="el-icon-search"
                     type="primary"
                     style="width: 110px;margin-left: 10px;"
                     size="small">开始查询</el-button>
        </div>
      </div>
      <div class="reslut">
        <div id="myChart"
             :class="formType === 'all' ? 'chart-all' : 'chart-one'"></div>
        <div class="time-line"
             v-if="formType === 'all'">
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
          <div class="time-unit">{{unitText}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      formType: "all",
      sort: "desc",
      typeRadio: 1,
      dateValue: "",
      timeValue: 0,
      sliderMax: 24,
      timeLableData: [],
      datePickerType: "date",
      dateValueFormat: "yyyy-MM-dd",
      unitText: "(时)",
      nowHour: new Date().getHours(),
      nowDay: new Date().getDate(),
      faceMonitorName: [],
      faceCaptureRecordTotal: [],
      totalNum: 0,
      timer1: null,
      dataZoom: [],
      myChart: null,
      flag: 0,
      xAxisData: [],
      photoStaticList: [],
      faceMonitorUuid: "",
      missionArr: [],
      tableData: [],
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      type: "single"
    };
  },
  created() {},
  activated() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("对比统计", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("对比统计", "isOwn");
    if (!this.ShowAuthDisabled) return;
    this.formatNowTime(this.typeRadio);
    this.initData();
    this.searchData();
    setInterval(() => {
      this.watchTime();
    }, 3000);
  },
  methods: {
    set(type) {
      this.type = type;
    },
    handleFormTypeChange() {
      this.myChart.clear();
      this.searchData();
    },
    initData() {
      this.unitText = "(时)";
      this.dateValue = this.$common.formatDate(new Date()).substr(0, 10);
      for (let i = 0; i < 25; i++) {
        this.timeLableData.push(i);
      }
      for (let i = 0; i < 25; i++) {
        this.xAxisData.push(i);
      }
      this.myChart = this.$echarts.init(document.getElementById("myChart"));
      this.getMonitorList();
    },
    getMonitorList() {
      this.$faceControlHttp.getMonitoringTaskList({}).then(res => {
        let body = res.data;
        this.getMonitoringTaskListSuccess(body);
      });
    },
    getMonitoringTaskListSuccess(body) {
      this.missionArr = body.data;
      if (this.missionArr) {
        this.faceMonitorUuid = this.missionArr[0].faceMonitorUuid;
      }
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
      } else if (val === 2) {
        this.changeToMonth();
      }
      this.formatNowTime(val);
      this.searchData();
    },
    changeToDay() {
      this.timeLableData = [];
      this.datePickerType = "date";
      this.dateValueFormat = "yyyy-MM-dd";
      this.sliderMax = 24;
      this.dateValue = this.$common.formatDate(new Date()).substr(0, 10);
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
      this.dateValueFormat = "yyyy-MM";
      this.dateValue = this.$common.formatDate(new Date()).substr(0, 7);
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
    handleSliderChange(val) {
      clearInterval(this.timer1);
      this.setTableData();
      this.drawLine();
      let nowDateVal = this.changeCommon();
      if (
        this.dateValue === this.$common.formatDate(new Date()).substr(0, 10) ||
        this.dateValue === this.$common.formatDate(new Date()).substr(0, 7)
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
          }, 2000);
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
              this.dateValue.substr(0, 4),
              this.dateValue.substr(5, 2)
            );
            if (this.timeValue < day - 1) {
              this.timeValue++;
            } else {
              clearInterval(this.timer1);
            }
          }
          this.setTableData();
          this.drawLine();
        }, 2000);
      }
    },
    changeCommon() {
      let nowDateVal = "";
      let selectDateVal = "";
      if (this.typeRadio === 1) {
        nowDateVal = new Date().getHours();
        selectDateVal = parseInt(this.dateValue.substr(8, 2));
        if (selectDateVal !== new Date().getDate()) {
          nowDateVal = 24;
        }
      } else if (this.typeRadio === 2) {
        this.timeLableData = [];
        let day = this.$common.getDaysByMonth(
          this.dateValue.substr(0, 4),
          this.dateValue.substr(5, 2)
        );
        this.sliderMax = day - 1;
        for (let i = 1; i < day + 1; i++) {
          this.timeLableData.push(i);
        }
        nowDateVal = new Date().getDate() - 1;
        selectDateVal = parseInt(this.dateValue.substr(5, 2));
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
          this.dateValue.substr(0, 4),
          this.dateValue.substr(5, 2)
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
        if (!this.faceMonitorUuid || this.faceMonitorUuid.length) {
          this.$message({ type: "warning", message: "请选择任务" });
          return;
        }
        if (this.typeRadio === 1) {
          this.getSingleFaceCapSumByDay();
        } else if (this.typeRadio === 2) {
          this.getSingleFaceCapSumByMonth();
        }
      }
    },
    resetData() {
      this.faceMonitorName = [];
      this.faceCaptureRecordTotal = [];
      this.totalNum = 0;
      this.dataZoom = [];
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
            this.faceMonitorName.push(item.faceMonitorName);
            this.faceCaptureRecordTotal.push(item.faceCaptureRecordTotal);
            this.totalNum = this.totalNum + item.faceCaptureRecordTotal;
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
    getFaceCaptureSumByDay() {
      if (this.timeValue === 0) {
        this.resetData();
        this.drawLine();
        return;
      }
      let date = this.changeNum(this.timeValue);
      date = date + ":00:00";
      date = `${this.dateValue}`;
      let reportType = "faceDailyReport";
      this.getFaceCaptureAll(date, reportType);
    },
    getFaceCaptureSumByMonth() {
      let timeValueFake = this.timeValue + 1;
      let date = this.changeNum(timeValueFake);
      date = `${this.dateValue}-01`;
      let reportType = "faceMonthlyReport";
      this.getFaceCaptureAll(date, reportType);
    },
    getFaceCaptureAll(date, reportType) {
      this.$statisticHttp
        .getCompareAll({
          sort: this.sort,
          reportType,
          searchDate: `${date}`
        })
        .then(res => {
          let body = res.data;
          this.getFaceCaptureAllSuccess(body);
        });
    },
    getFaceCaptureAllSuccess(body) {
      this.resetData();
      if (body.data) {
        this.tableData = body.data;
        this.setTableData();
      }
      this.drawLine();
    },
    getSingleFaceCapSumByDay() {
      let reportType = "faceDailyReport";
      this.getFaceCaptureOne(this.dateValue, reportType);
    },
    getSingleFaceCapSumByMonth() {
      let reportType = "faceMonthlyReport";
      this.getFaceCaptureOne(`${this.dateValue}-01`, reportType);
    },
    getFaceCaptureOne(date, reportType) {
      this.$statisticHttp
        .getCompareOne({
          faceMonitorUuid: this.faceMonitorUuid,
          reportType,
          searchDate: date
        })
        .then(res => {
          let body = res.data;
          this.getFaceCaptureOneSuccess(body);
        });
    },
    getFaceCaptureOneSuccess(body) {
      this.photoStaticList = [];
      if (body.data) {
        if (this.typeRadio === 1) {
          for (let i = 0; i < 25; i++) {
            this.photoStaticList.push(0);
          }
          body.data.forEach((v, i) => {
            this.photoStaticList[i + 1] = v;
          });
        } else if (this.typeRadio === 2) {
          this.xAxisData = [];
          let day = this.$common.getDaysByMonth(
            this.dateValue.substr(0, 4),
            this.dateValue.substr(5, 2)
          );
          for (let i = 1; i < day + 1; i++) {
            this.xAxisData.push(i);
          }
          for (let i = 0; i < this.xAxisData.length; i++) {
            this.photoStaticList.push(0);
          }
          body.data.forEach((v, i) => {
            this.photoStaticList[i] = v;
          });
        }
      }
      this.drawLine();
    },
    drawLine() {
      let self = this;
      if (this.formType === "all") {
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
              data: this.faceMonitorName
            }
          ],
          series: [
            {
              name: "比对数量",
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
              data: this.faceCaptureRecordTotal
            }
          ]
        });
      } else {
        this.myChart.setOption({
          tooltip: {
            trigger: "axis",
            show: false,
            axisPointer: {
              type: "none"
            }
          },
          textStyle: {
            color: "#666666"
          },
          grid: {
            left: "4%",
            right: "3%",
            top: "20",
            bottom: "20",
            y: 100
          },
          xAxis: {
            type: "category",
            // interval: 10,
            boundaryGap: false,
            axisLabel: {
              textStyle: {
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "PingFangSC-Regular"
              }
            },
            data: this.xAxisData
          },
          yAxis: {
            // name: '车流量统计结果(日)',
            type: "value",
            boundaryGap: true,
            axisLabel: {
              formatter: "{value}",
              textStyle: {
                fontSize: 14,
                color: "#ffffff",
                fontFamily: "PingFangSC-Regular"
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ["#18191B"],
                opacity: 0.6
              }
            }
          },
          series: [
            {
              type: "line",
              color: ["#28FFBB"],
              smooth: false,
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    textStyle: {
                      color: "#28FFBB",
                      fontSize: 16,
                      fontFamily: "PingFangSC-Regular"
                    }
                  },
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "#28FFBB" // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "rgba(40,253,186,0.00)" // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  }
                }
              },
              areaStyle: {
                normal: {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "#28FFBB" // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "rgba(40,253,186,0.00)" // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  }
                }
              },
              data: this.photoStaticList
            }
          ]
        });
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.offActive {
  background-color: rgba(0, 0, 0, 0.4);
}
.main-block {
  padding: 1.4%;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .main-container {
    padding: 0 3%;
    box-sizing: border-box;
    background: #212325;
    width: 100%;
    height: 100%;
    .search {
      height: 100px;
      width: 100%;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #ffffff;
      display: flex;
      align-items: center;
      .left-space {
        margin-left: 6vw;
      }
      .button-div {
        margin-left: auto;
        margin-right: 0;
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
