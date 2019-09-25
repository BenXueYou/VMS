<template>
  <div class="personflow">
    <div class="select-group">
      <div class="title-text">人流量：</div>
      <el-radio-group v-model="flowRadio"
                      style="line-height: 88px; margin: 6px 0 0 25px;">
        <el-radio :label="1">进</el-radio>
        <el-radio :label="2">出</el-radio>
        <el-radio :label="3">到达</el-radio>
        <el-radio :label="4">其他</el-radio>
        <el-radio :label="5">全部</el-radio>
      </el-radio-group>
      <div class="title-text"
           style="margin-left: 6%;">报表类型：</div>
      <el-radio-group v-model="typeRadio"
                      @change="handleTypeChange"
                      style="line-height: 88px; margin: 6px 0 0 25px;">
        <el-radio :label="1">日报表</el-radio>
        <el-radio :label="2">月报表</el-radio>
      </el-radio-group>
      <div class="title-text-date"
           style="margin-left: 6%;">统计日期：</div>
      <el-date-picker v-model="dateValue"
                      style="width: 150px; margin-left: 20px;"
                      type="date"
                      size="small"
                      placeholder="选择日期">
      </el-date-picker>
      <div style="height: 35px;margin-top:2px;margin-left: 2%;"
           class="button-div">
        <el-button type="primary"
                   size="small"
                   style="margin-left:35px;">查询</el-button>
      </div>
    </div>
    <div class="statistic-chart">
      <div id="myChart"></div>
    </div>
    <div class="time-line">
      <div class="title-text-date">时间轴：</div>
      <div class="time-line-bar">
        <el-slider v-model="timeValue"
                   disabled
                   :format-tooltip="formatTooltip"></el-slider>
        <div style="display: flex;">
          <div class="time-lable">
            <template v-for="(item, index) in timeLableData">
              <div :key="index" class="time-number">
                {{ changeNum(item) }}
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="time-unit">
        {{unitText}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      flowRadio: 1,
      typeRadio: 1,
      dateValue: new Date(),
      timeValue: 0,
      timeLableData: [],
      unitText: '(时)'
    }
  },
  created () {},
  mounted () {
    this.drawLine()
    setInterval(() => {
      this.formatNowTime(this.typeRadio)
    }, 20)
    this.initData()
  },
  methods: {
    initData () {
      this.unitText = '(时)'
      for (let i = 0; i < 25; i++) {
        this.timeLableData.push(i)
      }
    },
    drawLine () {
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          x: 80,
          y: 45,
          x2: 80,
          y2: 45
        },
        xAxis: [{
          type: 'value',
          axisLabel: {
            textStyle: {
              fontSize: 14,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'PingFangSC-Regular'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#333333'
            }
          }
        }],
        yAxis: [{
          type: 'category',
          position: 'left',
          axisLabel: {
            textStyle: {
              fontSize: 14,
              color: '#ffffff',
              fontFamily: 'PingFangSC-Regular'
            }
          },
          data: ['相机1', '相机2', '相机3', '相机4', '相机5', '相机6', '相机7', '相机8', '相机9', '相机10', '相机11', '相机12']
        }],
        series: [{
          name: '人流量',
          type: 'bar',
          stack: '总量',
          barWidth: 26,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'right',
                distance: 19.5,
                textStyle: {
                  color: '#28FFBB',
                  fontSize: 16,
                  fontFamily: 'PingFangSC-Regular'
                }
              },
              color: function (params) {
                var colorList = ['rgba(238,95,117,0.8)', 'rgba(238,95,117,0.8)', 'rgba(238,95,117,0.8)', 'rgba(239,187,73,0.8)', 'rgba(239,187,73,0.8)',
                  'rgba(239,187,73,0.8)', 'rgba(40,255,187,0.8)', 'rgba(40,255,187,0.8)', 'rgba(40,255,187,0.8)', 'rgba(84,157,251,0.8)', 'rgba(84,157,251,0.8)', 'rgba(84,157,251,0.8)']
                return colorList[params.dataIndex]
              },
              barBorderRadius: 3
            },
            emphasis: {
              barBorderRadius: 3
            }
          },
          data: [3200, 4120, 3010, 3340, 3900, 3300, 3200, 2140, 2780, 4560, 5670, 2110]
        }]
      })
    },
    changeNum (t) {
      if (t < 10) {
        return '0' + t
      }
      return t
    },
    formatTooltip (val) {
      let date = new Date()
      let tooltip = ''
      if (this.typeRadio === 1) {
        tooltip = this.changeNum(date.getHours()) + ':' + this.changeNum(date.getMinutes())
      } else if (this.typeRadio === 2) {
        tooltip = this.changeNum((date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours()) + ':' + this.changeNum(date.getMinutes())
      }
      return tooltip
    },
    formatNowTime (val) {
      let date = new Date()
      if (val === 1) {
        this.timeValue = ((date.getHours() * 60 + date.getMinutes()) / (24 * 60)) * 100
      } else if (val === 2) {
        let day = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
        this.timeValue = ((date.getDate() * 24 + date.getHours()) / (day * 24)) * 100
      }
    },
    handleTypeChange (val) {
      this.timeLableData = []
      if (val === 1) {
        this.unitText = '(时)'
        for (let i = 0; i < 25; i++) {
          this.timeLableData.push(i)
        }
      } else if (val === 2) {
        this.unitText = '(天)'
        let d = new Date()
        let day = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
        for (let i = 0; i < day + 1; i++) {
          this.timeLableData.push(i)
        }
      }
      this.formatNowTime(val)
    }
  },
  watch: {},
  destroyed () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.personflow {
  background: url("../../../assets/images/screen-bg.png") repeat-y;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
.select-group {
  height: 88px;
  display: flex;
  line-height: 88px;
  margin-left: 3%;
}
.title-text {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #ffffff;
}
.title-text-date {
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #ffffff;
}
.statistic-chart {
  width: 94.4%;
  height: calc(100vh - 208px);
  border-width: 1px;
  border-style: solid;
  border-color: #134A40;
  margin-left: 3%;
}
#myChart {
  width: 100%;
  height: 100%;
}
.time-line {
  height: 120px;
  display: flex;
  line-height: 120px;
  margin-left: 3%;
}
.time-line-bar {
  width: 86%;
  margin: 40px 0 0 25px;
}
.time-lable {
  width: 101%;
  margin-top: -50px;
  display: flex;
  flex-flow:  row nowrap;
  justify-content: space-between;
}
.time-number {
  opacity: 0.5;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #FFFFFF;
}
.time-unit {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ffffff;
  margin-top: 24px;
  margin-left: 20px;
}
</style>
