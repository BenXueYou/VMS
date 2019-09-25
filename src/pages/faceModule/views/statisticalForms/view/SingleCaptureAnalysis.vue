<template>
  <div class="personflow">
    <div class="select-group">
      <img src="@/assets/images/captureDevice.png"
           width="15.1px"
           height="12px"
           style="margin:0 0.6% 0 0;">
      <div class="title-text">抓拍设备：</div>
      <elPopverTree :channelInfoList="deviceList"
                    :elPopoverClass="faceRecordPopoverClass"
                    @transferCheckedChannel="transferCheckedChannel"
                    @show="popverShow"
                    @getRadioDefaultData="getRadioDefaultData"
                    boxType="radio"
                    inputWidth="200px"
                    @hide="popverHidden">
      </elPopverTree>
      <img src="@/assets/images/pic_qa.png"
           width="15.1px"
           height="12px"
           style="margin:0 0.6% 0 5%;">
      <div class="title-text">图片质量：</div>
      <el-select v-model="picQaVal"
                 filterable
                 collapse-tags
                 placeholder="请选择"
                 class='dev-select'>
        <el-option v-for="item in picQaArr"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <img src="@/assets/images/report_type.png"
           width="15.1px"
           height="12px"
           style="margin:0 0.6% 0 5%;">
      <div class="title-text">报表类型：</div>
      <el-radio-group v-model="typeRadio"
                      @change="handleTypeChange"
                      style="margin: 4px 0 0 0;">
        <el-radio :label="1">日报表</el-radio>
        <el-radio :label="2">月报表</el-radio>
      </el-radio-group>
      <div class="title-text-date">统计日期：</div>
      <el-date-picker v-model="dateValue"
                      style="width: 150px; margin-left: 2px;"
                      :type="datePickerType"
                      :value-format="dateValueFormat"
                      @change="onChangeDate"
                      size="small"
                      placeholder="选择日期">
      </el-date-picker>
      <div style="height: 35px;margin-left: auto;"
           class="button-div">
        <el-button type="primary"
                   @click="searchData"
                   size="small">查询</el-button>
      </div>
    </div>
    <div class="statistic-chart">
      <div id="myChart"></div>
    </div>
  </div>
</template>

<script>
import ElPopverTree from "@/pages/faceModule/components/ElPopverTree";

export default {
  components: {
    ElPopverTree
  },
  props: {},
  data() {
    return {
      typeRadio: 1,
      picQaVal: "",
      dateValue: "",
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
      devicearr: [],
      xAxisData: [],
      photoStaticList: [],
      deviceList: [],
      faceRecordPopoverClass: "faceRecordPopoverClass",
      checkedChannelsUuid: "",
      dateValueFormat: "yyyy-MM-dd"
    };
  },
  created() {},
  mounted() {
    this.initData();
    // this.searchData();
  },
  methods: {
    initData() {
      this.dateValue = this.$common.formatDate(new Date()).substr(0, 10);
      for (let i = 0; i < 25; i++) {
        this.xAxisData.push(i);
      }
    },
    drawLine() {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          show: true,
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
    },
    handleTypeChange(val) {
      if (val === 1) {
        this.changeToDay();
      } else if (val === 2) {
        this.changeToMonth();
      }
      this.searchData();
    },
    changeToDay() {
      this.xAxisData = [];
      for (let i = 0; i < 25; i++) {
        this.xAxisData.push(i);
      }
      this.datePickerType = "date";
      this.dateValueFormat = "yyyy-MM-dd";
      this.dateValue = this.$common.formatDate(new Date()).substr(0, 10);
    },
    changeToMonth() {
      this.xAxisData = [];
      let d = new Date();
      let day = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      for (let i = 1; i < day + 1; i++) {
        this.xAxisData.push(i);
      }
      this.datePickerType = "month";
      this.dateValueFormat = "yyyy-MM";
      this.dateValue = this.$common.formatDate(new Date()).substr(0, 7);
    },
    onChangeDate() {
      if (this.typeRadio === 2) {
        this.xAxisData = [];
        let day = this.$common.getDaysByMonth(this.dateValue.substr(0, 4), this.dateValue.substr(5, 2));
        for (let i = 1; i < day + 1; i++) {
          this.xAxisData.push(i);
        }
      }
    },
    searchData() {
      if (this.typeRadio === 1) {
        this.getSingleFaceCapSumByDay();
      } else if (this.typeRadio === 2) {
        this.getSingleFaceCapSumByMonth();
      }
    },
    getSingleFaceCapSumByDay() {
      this.$statisticRequest.getSingleFaceCapSumByDay({
        devname: this.checkedChannelsUuid,
        quality: this.picQaVal,
        date: this.dateValue,
        onResult: (isSuccess, data) => {
          if (isSuccess && data) {
            this.handlegetSingleFaceCapSumSuccessResponse(data);
          } else {
            console.log("获取单路摄像机抓拍统计(日)失败！");
          }
        }
      });
    },
    getSingleFaceCapSumByMonth() {
      this.$statisticRequest.getSingleFaceCapSumByMonth({
        devname: this.checkedChannelsUuid,
        quality: this.picQaVal,
        date: this.dateValue,
        onResult: (isSuccess, data) => {
          if (isSuccess && data) {
            this.handlegetSingleFaceCapSumSuccessResponse(data);
          } else {
            console.log("获取单路摄像机抓拍统计(月)失败！");
          }
        }
      });
    },
    handlegetSingleFaceCapSumSuccessResponse(data) {
      this.photoStaticList = [];
      if (data.body.data) {
        if (this.typeRadio === 1) {
          for (let i = 0; i < 25; i++) {
            this.photoStaticList.push(0);
          }
          for (let index in this.photoStaticList) {
            for (let item of data.body.data) {
              if (parseInt(item.currenttime.substr(11, 2)) === parseInt(index)) {
                this.photoStaticList[index] = item.count;
              }
            }
          }
        } else if (this.typeRadio === 2) {
          this.xAxisData = [];
          let day = this.$common.getDaysByMonth(this.dateValue.substr(0, 4), this.dateValue.substr(5, 2));
          for (let i = 1; i < day + 1; i++) {
            this.xAxisData.push(i);
          }
          for (let i = 0; i < this.xAxisData.length; i++) {
            this.photoStaticList.push(0);
          }
          for (let index in this.photoStaticList) {
            for (let item of data.body.data) {
              if (parseInt(item.currentdate.substr(8, 2)) === parseInt(index) + 1) {
                this.photoStaticList[index] = item.count;
              }
            }
          }
        }
      }
      this.drawLine();
    },
    // 获取任务列表
    getDeviceList() {
      var deviceList = this.$store.getters.getDeviceList;
      this.deviceList = deviceList;
    },
    transferCheckedChannel(checkedChannel) {
      this.checkedChannelsUuid = checkedChannel.id;
    },
    popverShow() {},
    popverHidden() {},
    getRadioDefaultData(checkedChannel) {
      this.checkedChannelsUuid = checkedChannel.id;
      this.searchData();
    }
  },
  watch: {},
  destroyed() {},
  activated() {
    this.getDeviceList();
  }
};
</script>

<style>
.faceRecordPopoverClass {
  width: 50%;
  height: 45%;
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
  margin: 0 0 0 5%;
}
.statistic-chart {
  width: 100%;
  height: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  background: #18191b;
  border-width: 1px;
  border-style: solid;
  border-color: #134a40;
}
#myChart {
  margin-left: 38px;
  width: 97%;
  height: 85%;
}
.dev-select {
  width: 11%;
}
</style>
