<template>
	<div class="personflow">
		<div class="select-group">
			<img
				src="@/assets/images/person_fellow.png"
				width="15.1px"
				height="12px"
				style="margin-right: 0.5%;"
			/>
			<div class="title-text">人流量：</div>
			<el-radio-group v-model="flowRadio" style="margin: 2px 0 0 0;">
				<el-radio label>全部</el-radio>
				<el-radio label="in">进</el-radio>
				<el-radio label="out">出</el-radio>
				<el-radio label="no1">到达</el-radio>
				<el-radio label="no2">其他</el-radio>
			</el-radio-group>
			<img src="@/assets/images/pic_qa.png" width="15.1px" height="12px" style="margin:0 0.5% 0 3%;" />
			<div class="title-text">图片质量：</div>
			<el-select v-model="picQaVal" collapse-tags placeholder="请选择" class="dev-select">
				<el-option v-for="item in picQaArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<img src="@/assets/images/sort.png" width="15.1px" height="12px" style="margin:0 0.5% 0 3%;" />
			<div class="title-text">排序：</div>
			<el-radio-group v-model="sortRadio" @change="handleSortChange" style="margin: 2px 0 0 0">
				<el-radio label="desc">升序</el-radio>
				<el-radio label="asc">降序</el-radio>
			</el-radio-group>
			<img
				src="@/assets/images/report_type.png"
				width="15.1px"
				height="12px"
				style="margin:0 0.5% 0 3%;"
			/>
			<div class="title-text">报表类型：</div>
			<el-radio-group v-model="typeRadio" @change="handleTypeChange" style="margin: 4px 0 0 0;">
				<el-radio :label="1">日报表</el-radio>
				<el-radio :label="2">月报表</el-radio>
			</el-radio-group>
			<div class="title-text-date">统计日期：</div>
			<el-date-picker
				v-model="dateValue"
				style="width: 150px; margin-left: 2px;"
				:type="datePickerType"
				:value-format="dateValueFormat"
				@change="onChangeDate"
				size="small"
				placeholder="选择日期"
			></el-date-picker>
			<div style="height: 35px;margin-left: auto;" class="button-div">
				<el-button type="primary" @click="searchData" size="small">查询</el-button>
			</div>
		</div>
		<div class="statistic-chart">
			<!-- <div class="chart-title">
        <img src="@/assets/images/time2.png"
             width="16px"
             height="16px"
             style="margin:0 0.5% 0 1.8%;">
        <div class="report-time">{{dateValue}}</div>
			</div>-->
			<div class="total-num" :style="sortRadio=='asc' ? 'bottom: 180px' : 'top: 100px'">
				<div class="num-text">{{$common.formatNumber(totalNum)}}</div>
				<div v-if="typeRadio==2" class="num-text">{{dateValue}}-{{ changeNum(timeValue + 1) }}</div>
				<div v-else class="num-text">{{dateValue}}</div>
			</div>
			<div id="myChart"></div>
			<div class="time-line">
				<div class="title-text-line">时间轴：</div>
				<div class="time-line-bar">
					<el-slider
						v-model="timeValue"
						:max="sliderMax"
						:step="1"
						:show-tooltip="false"
						@change="handleSliderChange"
						class="time-slider"
					></el-slider>
					<div style="display: flex;">
						<div class="time-lable">
							<template v-for="(item, index) in timeLableData">
								<div :key="index" class="time-number">{{ changeNum(item) }}</div>
							</template>
						</div>
					</div>
				</div>
				<div class="time-unit">{{unitText}}</div>
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
      flowRadio: "",
      sortRadio: "asc",
      typeRadio: 1,
      picQaVal: "",
      dateValue: "",
      timeValue: 0,
      timeLableData: [],
      datePickerType: "date",
      unitText: "(时)",
      picQaArr: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "高",
          value: "high"
        },
        {
          label: "中",
          value: "normal"
        },
        {
          label: "低",
          value: "low"
        },
        {
          label: "无效",
          value: "lower"
        }
      ],
      nowHour: new Date().getHours(),
      nowDay: new Date().getDate(),
      dateValueFormat: "yyyy-MM-dd",
      sliderMax: 24,
      channelName: [],
      count: [],
      totalNum: 0,
      timer1: null,
      dataZoom: [],
      myChart: null,
      flag: 0
    };
  },
  created() {},
  mounted() {
    this.formatNowTime(this.typeRadio);
    this.initData();
    this.searchData();
    setInterval(() => {
      this.watchTime();
    }, 3000);
  },
  methods: {
    initData() {
      this.unitText = "(时)";
      this.dateValue = this.$common.formatDate(new Date()).substr(0, 10);
      for (let i = 0; i < 25; i++) {
        this.timeLableData.push(i);
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
    },
    handleSliderChange(val) {
      clearInterval(this.timer1);
      let nowDateVal = this.changeCommon();
      if (
        this.dateValue === this.$common.formatDate(new Date()).substr(0, 10) ||
				this.dateValue === this.$common.formatDate(new Date()).substr(0, 7)
      ) {
        if (val > nowDateVal) {
          this.timeValue = nowDateVal;
        } else {
          this.timer1 = setInterval(() => {
            if (this.timeValue < nowDateVal) {
              this.timeValue++;
              this.searchData();
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
          this.searchData();
        }, 2000);
      }
      this.searchData();
    },
    changeCommon() {
      let nowDateVal = "";
      let selectDateVal = "";
      if (this.typeRadio === 1) {
        nowDateVal = new Date().getHours();
        selectDateVal = this.dateValue.substr(8, 2);
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
        selectDateVal = this.dateValue.substr(5, 2);
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
      this.handleSliderChange(this.timeValue);
    },
    watchTime() {
      this.nowHour = new Date().getHours();
      this.nowDay = new Date().getDate();
    },
    searchData() {
      if (this.typeRadio === 1) {
        this.getFaceCaptureSumByDay();
      } else if (this.typeRadio === 2) {
        this.getFaceCaptureSumByMonth();
      }
    },
    resetData() {
      this.channelName = [];
      this.count = [];
      this.totalNum = 0;
      this.dataZoom = [];
    },
    getFaceCaptureSumByDay() {
      if (this.timeValue === 0) {
        this.resetData();
        this.drawLine();
        return;
      }
      let date = this.changeNum(this.timeValue - 1);
      date = date + ":00:00";
      this.$statisticRequest.getFaceCaptureSumByDay({
        flowrate: this.flowRadio,
        quality: this.picQaVal,
        sort: this.sortRadio,
        date: `${this.dateValue} ${date}`,
        onResult: (isSuccess, data) => {
          if (isSuccess && data) {
            this.handleGetFaceCaptureSumByDaySuccessResponse(data);
          } else {
            console.log("获取人脸抓拍(日)统计失败！");
          }
        }
      });
    },
    handleGetFaceCaptureSumByDaySuccessResponse(data) {
      this.resetData();
      if (data.body.data) {
        for (let item of data.body.data) {
          this.channelName.push(item.channelname);
          this.count.push(item.count);
          this.totalNum = this.totalNum + item.count;
        }
      }
      if (data.body.data.length <= 20) {
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
      this.drawLine();
    },
    getFaceCaptureSumByMonth() {
      let timeValueFake = this.timeValue + 1;
      let date = this.changeNum(timeValueFake);
      let flowRadio;
      if (this.flowRadio === "no1" || this.flowRadio === "no2") {
        flowRadio = "";
      } else {
        flowRadio = this.flowRadio;
      }
      this.$statisticRequest.getFaceCaptureSumByMonth({
        flowrate: flowRadio,
        quality: this.picQaVal,
        sort: this.sortRadio,
        date: `${this.dateValue}-${date}`,
        onResult: (isSuccess, data) => {
          if (isSuccess && data) {
            this.handleGetFaceCaptureSumByDaySuccessResponse(data);
          } else {
            console.log("获取人脸抓拍统计（月）失败！");
          }
        }
      });
    },
    drawLine() {
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
            name: "人流量",
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
                  for (let i = 0; i < 100; i++) {
                    colorList.push(
                      "rgba(238,95,117,0.8)",
                      "rgba(239,187,73,0.8)",
                      "rgba(40,255,187,0.8)",
                      "rgba(84,157,251,0.8)"
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
            data: this.count
          }
        ]
      });
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
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.personflow {
	width: 100%;
	height: 100%;
	padding: 0 3% 0 3%;
	box-sizing: border-box;
}
.select-group {
	height: 10%;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.title-text {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
	letter-spacing: 0;
}
.title-text-date {
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #cccccc;
	margin: 0 0 0 2.8%;
}
.statistic-chart {
	width: 100%;
	height: 87%;
	position: relative;
	background: #18191b;
	border-width: 1px;
	border-style: solid;
	border-color: #134a40;
}
#myChart {
	margin-top: -0.8%;
	margin-left: -3%;
	width: 100%;
	height: 96%;
}
.dev-select {
	width: 5%;
}
.time-line {
	height: 120px;
	display: flex;
	align-items: center;
	line-height: 120px;
	margin-top: -1.3%;
	margin-left: 3%;
}
.time-line-bar {
	width: 88%;
	margin: 0px 0 0 25px;
	text-align: center;
}
.time-slider {
	width: 99%;
	margin: 0 auto;
}
.time-lable {
	width: 100%;
	margin-top: -4%;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
}
.time-number {
	opacity: 0.5;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
}
.time-unit {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
	margin-left: 20px;
	margin-top: -40px;
}
.report-time {
	font-family: PingFangSC-Regular;
	font-size: 18px;
	color: #aaaaaa;
	letter-spacing: 0;
}
.chart-title {
	display: flex;
	margin-top: 20px;
	align-items: center;
}
.title-text-line {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #ffffff;
	margin-top: -45px;
}
.total-num {
	position: absolute;
	height: 80px;
	right: 300px;
}
.num-text {
	color: #84868d;
	font-size: 30px;
	text-align: center;
	margin-bottom: 7px;
}
</style>
