<template>
  <div class="SCBHomeRight"
       :style="`margin-right:${rightLayer}px`">
    <div class="topBox">
      <div class="tipsBox">
        <img class="tipIcon"
             src="@/assets/images/SchoolBoard/scb_title_icon.png"
             alt />
        布控报警
      </div>
      <div class="facultyBoxBtn">共{{RecognizedTotal}}条</div>
    </div>
    <div class="RecognizedBox">
      <div class="RecognizedCard"
           v-for="(item,index) in 3"
           :key="index">
        <div style="position:relative;overflow: hidden;">
          <el-image :src="RecognizedBoxArr.length>index?$common.setPictureShow(RecognizedBoxArr[index].faceCapturePhotoUrl,'facelog'):''">
            <div slot="error"
                 class="image-slot">
              <img :src="$common.setPictureShow()"
                   alt="">
            </div>
          </el-image>
          <span>抓拍照</span>
        </div>
        <el-progress class="progressClass"
                     color="rgba(23,237,172,1)"
                     :width="45"
                     type="circle"
                     :percentage="RecognizedBoxArr.length>index?RecognizedBoxArr[index].faceSimilarity:0"></el-progress>
        <div style="position:relative;overflow: hidden;">
          <el-image :src="RecognizedBoxArr.length>index?$common.setPictureShow(RecognizedBoxArr[index].facePhotoUrl):''">
            <div slot="error"
                 class="image-slot">
              <img :src="$common.setPictureShow()"
                   alt="">
            </div>
          </el-image>
          <span>布控照</span>
        </div>
        <div class="tipsTxtBox">
          <span class="tipsTxt stressBox">
            {{RecognizedBoxArr.length>index &&
						RecognizedBoxArr[index].staffName?RecognizedBoxArr[index].staffName : '姓名'}}
            <span v-if="RecognizedBoxArr[index]&&RecognizedBoxArr[index].dealState === 'to_be_processed'"
                  class="stressTxt stressRight">{{'待处理'}}</span>
            <span v-else
                  class="stressTxt stressRight">{{'已处理'}}</span>
          </span>
          <span class="tipsTxt">
            {{RecognizedBoxArr.length>index &&
						RecognizedBoxArr[index].libraryName?RecognizedBoxArr[index].libraryName : '人脸库'}}
          </span>
          <span class="tipsTxt textClips"
                @mouseover="mymouseover"
                @mouseout="mymouseout"
                @mousemove="mymousemove">
            {{RecognizedBoxArr.length>index &&
						RecognizedBoxArr[index].channelName?RecognizedBoxArr[index].channelName : '通道名称'}}
          </span>
          <span class="tipsTxt">
            {{RecognizedBoxArr.length>index&&
						RecognizedBoxArr[index].captureDatetime?RecognizedBoxArr[index].captureDatetime.split(' ')[0] : '抓拍日期'}}
          </span>
          <span class="tipsTxt">
            {{RecognizedBoxArr.length>index&&
						RecognizedBoxArr[index].captureDatetime?RecognizedBoxArr[index].captureDatetime.split(' ')[1] : '抓拍时间'}}
          </span>
        </div>
      </div>
    </div>
    <div class="topBox"
         style="margin-top:20px">
      <div class="tipsBox">
        <img class="tipIcon"
             src="@/assets/images/SchoolBoard/scb_title_icon.png"
             alt />
        模型研判报警
      </div>
      <div class="facultyBoxBtn">共{{modelTotal}}条</div>
    </div>
    <div class="RecognizedBox">
      <div class="RecognizedCard ModelCard"
           v-for="(item,index) in 2"
           :key="index">
        <el-image :src="ModelBoxArr.length>index?$common.setPictureShow(ModelBoxArr[index].facePhotoUrl,'facelog'):''">
          <div slot="error"
               class="image-slot">
            <img :src="$common.setPictureShow()"
                 alt="">
          </div>
        </el-image>
        <div class="tipsTxtBox">
          <div class="tipsTxt stressTxt">
            <span class="stressTxtLeft stressBox">
              {{ModelBoxArr.length>index &&
							ModelBoxArr[index].faceModelName?ModelBoxArr[index].faceModelName: '模型名称'}}
              <!-- <span class="stressTxt stressRight">{{RecognizedBoxArr[index]&&RecognizedBoxArr[index].dealState === 'to_be_processed'?'未处理':'已处理'}}</span> -->
            </span>
            <span class="stressTxtRight"
                  :style="ModelBoxArr.length>index && ModelBoxArr[index].status === 'model_processed' ? 'color:#26D39D' : 'color:#FD545E'">
              {{ModelBoxArr.length>index &&
							ModelBoxArr[index].status?$common.getEnumItemName('model_analysis_s', ModelBoxArr[index].status):''}}
            </span>
          </div>
          <span class="tipsTxt">
            <img src="@/assets/images/SchoolBoard/scb_right_person.png"
                 alt
                 srcset />
            {{ModelBoxArr.length>index &&
						ModelBoxArr[index].staffName? ModelBoxArr[index].staffName: '陌生人'}}
            <span :style="ModelBoxArr.length>index && ModelBoxArr[index].staffName ? 'margin-left: 5px;' : ''">{{ModelBoxArr.length>index && ModelBoxArr[index].faceLibraryName?ModelBoxArr[index].faceLibraryName:''}}</span>
          </span>
          <span class="tipsTxt">
            <img src="@/assets/images/SchoolBoard/scb_right_camera.png"
                 alt
                 srcset />
            {{ModelBoxArr.length>index && ModelBoxArr[index].channelName?ModelBoxArr[index].channelName : '通道名称'}}
          </span>
          <span class="tipsTxt">
            <img src="@/assets/images/SchoolBoard/scb_right_clock.png"
                 alt
                 srcset />
            {{ModelBoxArr.length>index && ModelBoxArr[index].createTime?ModelBoxArr[index].createTime : '抓拍时间'}}
          </span>
        </div>
      </div>
    </div>
    <div class="topBox"
         style="margin-top:10px">
      <div class="tipsBox">
        <img class="tipIcon"
             src="@/assets/images/SchoolBoard/scb_title_icon.png"
             alt />
        {{!showVideoRow?'通行频率':'其他报警'}}
      </div>
      <div v-if="!showVideoRow"
           class="facultyBoxBtn">共{{LineDataTotal}}条</div>
      <div v-else
           class="facultyBoxBtn">共{{TableDataTotal}}条</div>
    </div>
    <div class="DoorAccessBox">
      <div v-show="!showVideoRow"
           id="DoorAccessBox"></div>
      <div v-show="showVideoRow"
           style="padding-top:15px;">
        <el-table ref="CBAlarmTable"
                  :data="TableData"
                  tooltip-effect="dark"
                  class="CBTableBoxClass"
                  @selection-change="handleSelectionChange">
          <el-table-column prop="alarmTime"
                           show-overflow-tooltip
                           label="报警时间">
            <template slot-scope="scope">{{scope.row.alarmTime?scope.row.alarmTime.split(' ')[1]:'00:00:00'}}</template>
          </el-table-column>
          <el-table-column prop="resName"
                           label="报警源"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="subType"
                           label="报警类型">
            <template slot-scope="scope">{{$common.getEnumItemName("alarm_t", scope.row.subType)}}</template>
          </el-table-column>
          <el-table-column prop="dealState"
                           label="处理状态">
            <template slot-scope="scope">{{$common.getEnumItemName("alarm_r", scope.row.dealState)}}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-show="!showVideoRow"
         @click="rightDropBtnAct"
         :style="`margin-right:${rightLayer}px`"
         class="SCBRightDropClass cursorClass">
      <img v-if="rightLayer"
           style="transform: rotate(-180deg)"
           src="@/assets/images/SchoolBoard/scb_left_drop.png"
           alt
           srcset />
      <img v-else
           src="@/assets/images/SchoolBoard/scb_right_drop.png"
           alt
           srcset />
    </div>
  </div>
</template>
<script>
import videoBox from "@/pages/schoolBoard/components/videoBox";
import * as api from "@/pages/faceModule/http/logSearchHttp.js";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
const legend = {
  top: "15px",
  formatter: function(name) {
    return name + "总数";
  },
  data: [
    {
      name: "老师",
      textStyle: {
        fontSize: "12",
        color: "#F7B500"
      }
    },
    {
      name: "学生",
      textStyle: {
        fontSize: "12",
        color: "#17EDAC"
      }
    },
    {
      name: "安保",
      textStyle: {
        fontSize: "12",
        color: "#32C5FF"
      }
    }
  ]
};
const xAxis = [
  {
    type: "category",
    boundaryGap: false,
    data: [
      "0",
      "2",
      "4",
      "6",
      "8",
      "10",
      "12",
      "14",
      "16",
      "18",
      "20",
      "22",
      "24"
    ],
    axisLabel: {
      show: true,
      textStyle: {
        color: "rgba(221,221,221,0.6)" // 更改坐标轴文字颜色
      }
    }
  }
];
export default {
  props: {
    showVideoRow: {
      type: Boolean,
      default: false
    }
  },
  components: { videoBox },
  data() {
    return {
      modelTotal: 0,
      RecognizedTotal: 0,
      rightLayer: 0,
      RecognizedBoxArr: [],
      ModelBoxArr: [],
      videoRadio: 1,
      TableData: [],
      studentData: [],
      teacherData: [],
      facultyData: [],
      TableDataTotal: [],
      legendData: {},
      sInt: null
    };
  },
  computed: {
    LineDataTotal() {
      let sum = 0;
      for (const key in this.legendData) {
        if (this.legendData.hasOwnProperty(key)) {
          const element = this.legendData[key] || 0;
          sum += element;
        }
      }
      return sum;
    },
    GlobalAlarm() {
      return this.$store.state.home.GlobalAlarm;
    }
  },
  watch: {
    GlobalAlarm(val) {
      if (val) {
        let len = val.length - 1;
        this.RecognizedBoxArr.push(val[len]);
      }
    }
  },
  created() {
    this.initData();
    if (!this.sInt) {
      this.sInt = setInterval(() => {
        this.initData();
      }, 10000);
    }
  },
  destroyed() {
    clearInterval(this.sInt);
    this.sInt = null;
  },
  deactivated() {
    console.log("SCNHomeRight -- deactivated");
    if (!this.sInt) return;
    clearInterval(this.sInt);
    this.sInt = null;
  },
  mounted() {
    this.httpQueryFaceAlarm();
  },
  methods: {
    initData() {
      this.httpOtherAlarm();
      this.httpQueryModelAlarm();
      // this.httpQueryFaceAlarm();
      this.httpQueryLineData();
    },
    // 其他报警
    httpOtherAlarm() {
      this.TableData = [];
      this.TableDataTotal = 0;
      this.$logSearchHttp
        .getAlarmLog({
          pageSize: 5,
          beginTime: this.$common.getStartTime(),
          endTime: this.$common.getCurrentTime(),
          buessinessType: "IAC",
          currentPage: 1
        })
        .then(res => {
          if (res.data.success) {
            this.TableData = res.data.data.list || [];
            this.TableDataTotal = res.data.data.total || 0;
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 查询折线图数据
    httpQueryLineData() {
      this.$FacultyHttp
        .getSchoolAccessStaticsApi()
        .then(res => {
          if (res.data.success) {
            this.legendData = res.data.data.totalStatistics || 0;
            let data = res.data.data.periodStatistics || [];
            this.teacherData = [];
            this.studentData = [];
            this.facultyData = [];
            data.forEach(element => {
              this.teacherData.push(element.teacher);
              this.studentData.push(element.student);
              this.facultyData.push(element.security);
            });
            let lineData = this.initEchartsLine();
            this.drawLine(lineData);
          } else {
          }
        })
        .catch(() => {});
    },
    // 查询模型研判报警
    httpQueryModelAlarm() {
      this.isLoading = true;
      this.$judgeHttp
        .getJudgeList({
          limit: 3,
          page: 1,
          createTimeStart: this.$common.getStartTime(),
          createTimeEnd: this.$common.getCurrentTime()
        })
        .then(res => {
          this.ModelBoxArr = [];
          this.modelTotal = 0;
          if (res.data.success) {
            this.ModelBoxArr = res.data.data.list || [];
            this.modelTotal = res.data.data.total;
          }
        })
        .catch(() => {
          this.ModelBoxArr = [];
          this.modelTotal = 0;
        });
    },
    // 获取布控报警
    httpQueryFaceAlarm() {
      let data = {
        alarmDatetimeBegin: this.$common.getStartTime(),
        alarmDatetimeEnd: this.$common.getCurrentTime(),
        page: 1,
        limit: 3
      };
      api
        .getAlarmList(data)
        .then(res => {
          this.RecognizedBoxArr = [];
          this.RecognizedTotal = 0;
          if (res.data.success && res.data.data && res.data.data.list) {
            this.RecognizedTotal = res.data.data.total;
            this.RecognizedBoxArr = res.data.data.list
              ? res.data.data.list
              : [];
          }
        })
        .catch(err => {
          console.log(err);
          this.RecognizedBoxArr = [];
          this.RecognizedTotal = 0;
        });
    },
    rightDropBtnAct() {
      if (this.rightLayer) {
        this.rightLayer = 0;
        this.$emit("dragPanel", "toLeft");
      } else {
        this.rightLayer = -450;
        this.$emit("dragPanel", "toRight");
      }
      // this.rightLayer = this.rightLayer ? 0 : -450;
    },
    handleSelectionChange() {},
    initEchartsLine() {
      let dataConfigArr = [
        {
          name: "老师",
          color0: "rgba(247,181,0,0)",
          color1: "rgba(247,181,0,1)",
          data: this.teacherData
        },
        {
          name: "学生",
          color0: "rgba(0,216,160,0.00)",
          color1: "rgba(0,216,160,1.00)",
          data: this.studentData
        },
        {
          name: "安保",
          color0: "rgba(50,197,255,0)",
          color1: "rgba(50,197,255,1)",
          data: this.facultyData
        }
      ];

      let lineData = [];
      dataConfigArr.forEach(element => {
        lineData.push({
          name: element.name,
          type: "line",
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: element.color0 // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: element.color1 // 100% 处的颜色
                }
              ]
            }
          },
          lineStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: element.color0 // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: element.color1 // 100% 处的颜色
                }
              ]
            }
          },
          data: element.data
        });
      });
      return lineData;
    },
    drawLine(lineData) {
      let tooltip = {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          snap: 0,
          label: {
            backgroundColor: "#6a7985",
            precision: 0
          }
        }
      };
      legend.formatter = name => {
        if (name === "老师" && this.legendData.teacher) {
          return name + this.legendData.teacher;
        } else if (name === "学生" && this.legendData.teacher) {
          return name + this.legendData.student;
        } else if (name === "安保" && this.legendData.teacher) {
          return name + this.legendData.security;
        } else {
          return name;
        }
      };
      let option = {
        tooltip: tooltip,
        legend: legend,
        color: ["#F7B500", "#17EDAC", "#32C5FF"],
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: xAxis,
        yAxis: [
          {
            type: "value",
            axisLabel: {
              show: true,
              textStyle: {
                color: "rgba(221,221,221,0.6)" // 更改坐标轴文字颜色
              }
            }
          }
        ],
        series: lineData
      };
      let dom = document.getElementById("DoorAccessBox");
      let myChart = this.$echarts.init(dom);
      myChart.setOption(option, true);
    },
    // 鼠标划过覆盖的hover弹窗事件
    mymouseover: event => {
      mouseover(event);
    },
    mymouseout(event) {
      mouseout(event);
    },
    mymousemove(event) {
      mousemove(event);
    }
  }
};
</script>
<style>
/*  .SCBHomeRight .marRight {
    margin-right: 13px;
  }*/
</style>
<style lang="scss">
.SCBHomeRight {
  .SCBRightDropClass {
    position: fixed;
    right: 450px;
    top: 50%;
    transform: translateY(-50%);
  }
  width: 450px;
  height: 100%;
  overflow-y: auto;
  font-family: "PingFangSC-Medium";
  font-size: 16px;
  color: #ffffff;
  letter-spacing: 0;
  background: rgba(0, 20, 18, 0.75);
  padding: 20px 25px 5px;
  box-sizing: border-box;
  .topBox {
    background-image: linear-gradient(
      90deg,
      rgba(23, 237, 172, 0.2) 4%,
      rgba(23, 237, 172, 0.01) 90%
    );
    border-radius: 1px;
    display: flex;
    justify-content: space-between;
    .tipsBox {
      font-family: "PingFangSC-Medium";
      font-size: 16px;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 0;
      line-height: 35px;
      padding: 0 10px;
      img {
        vertical-align: middle;
      }
    }
    .tipIcon {
      margin-right: 9px;
    }
    .el-button {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 2px;
      padding: 0px 6px;
      height: 26px;
      margin: auto 0;
      border: 0;
      img {
        width: 14px;
        height: 12px;
      }
    }
  }
  .stressBox {
    overflow: hidden;
    .stressRight {
      float: right;
    }
  }
  .RecognizedBox {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 16px;
    .RecognizedCard {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      background: rgba(11, 50, 46, 0.5);
      border-radius: 2px;
      margin: 4px auto;
      padding: 8px 13px 8px 13px;
      box-sizing: border-box;
      .el-image {
        width: 92px;
        height: 92px;
      }
      .el-image + span {
        position: absolute;
        top: 5px;
        right: -22px;
        padding: 3px 20px;
        transform: scale(0.8) rotate(-315deg);
        font-family: "PingFangSC-Regular";
        font-size: 8px;
        color: #f7b500;
        text-align: justify;
        background: rgba(0, 0, 0, 0.5);
      }
      .tipsTxtBox {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        text-align: center;
        font-size: 12px;
        color: #54cda9;
        padding-left: 12px;
        .tipsTxt {
          text-align: left;
          color: #54cda9 !important;
          font-size: 12px !important;
          img {
            margin-right: 7px;
          }
        }
      }
      .progressClass {
        margin: auto 8px;
      }
    }
    .ModelCard {
      margin-bottom: 15px;
      padding: 0px;
      position: relative;
      .el-image {
        width: 100px;
        height: 100px;
      }
      .tipsTxtBox {
        padding: 9px 0 9px 18px;
        width: calc(100% - 100px);
        .stressRight {
          float: right;
          margin-right: 13px;
        }
      }
    }
  }
  .stressTxt {
    font-family: "PingFangSC-Regular";
    font-size: 12px;
    color: #ff5f5f;
    text-align: justify;
    .stressTxtRight {
      position: absolute;
      right: 13px;
    }
  }
  .facultyBoxBtn {
    line-height: 34px;
    font-family: "PingFangSC-Regular";
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 0;
    text-align: right;
  }
  .faucltyCardBox {
    display: flex;
    justify-content: flex-start;
    .faucltyCard {
      width: 90px;
      background: rgba(11, 50, 46, 0.6);
      border-radius: 2px;
      margin: 18px auto 0;
      padding-bottom: 10px;
      box-sizing: border-box;
      .el-image {
        width: 90px;
        height: 90px;
        margin-bottom: 7px;
      }
      .tipsTxt {
        font-family: "PingFangSC-Regular";
        font-size: 10px;
        color: rgba(255, 255, 255, 0.8);
        margin-left: 9px;
      }
    }
  }
  .DoorAccessBox {
    height: 240px;
    #DoorAccessBox {
      height: 100%;
    }
    .el-table th.is-leaf,
    .el-table td {
      border-color: #2d2f31;
      padding: 5px 0px;
    }
  }
}
</style>
