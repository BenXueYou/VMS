<template>
  <div class="DoorRecord">
    <div class="headerBox">
      <span>开门时段：</span>
      <el-date-picker v-model="startTime"
                      type="datetime"
                      @change="changeTime"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"></el-date-picker>
      <span class="split">-</span>
      <el-date-picker v-model="endTime"
                      @change="changeTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"></el-date-picker>
      <el-button type="primary"
                 @click="search">查询</el-button>
    </div>
    <div class="rightContent"
         ref="rightContent"
         v-loading="isLoading"
         @scroll="scroll">
      <time-line :data="data"></time-line>
    </div>
  </div>
</template>
<script>
import TimeLine from "./TimeLine";
import * as api from "@/pages/communityBoard/utils/ajax.js";
const format = sss => {
  if (!sss) {
    return "";
  }
  var XyDate = new Date(sss);
  var year = XyDate.getFullYear(); // 得到年份
  var month = XyDate.getMonth(); // 得到月份
  var date = XyDate.getDate(); // 得到日期
  // var day = XyDate.getDay(); // 得到周几
  var hour = XyDate.getHours(); // 得到小时
  var minu = XyDate.getMinutes(); // 得到分钟
  var sec = XyDate.getSeconds(); // 得到秒
  month = month + 1;
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  if (hour < 10) hour = "0" + hour;
  if (minu < 10) minu = "0" + minu;
  if (sec < 10) sec = "0" + sec;
  return year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
};
const getZero = () => {
  var XyDate = new Date();
  var year = XyDate.getFullYear(); // 得到年份
  var month = XyDate.getMonth(); // 得到月份
  var date = XyDate.getDate(); // 得到日期
  // var day = XyDate.getDay(); // 得到周几
  var hour = XyDate.getHours(); // 得到小时
  var minu = XyDate.getMinutes(); // 得到分钟
  var sec = XyDate.getSeconds(); // 得到秒
  month = month + 1;
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  if (hour < 10) hour = "0" + hour;
  if (minu < 10) minu = "0" + minu;
  if (sec < 10) sec = "0" + sec;
  return year + "-" + month + "-" + date;
};
export default {
  name: "DoorRecord",
  components: {
    TimeLine
  },
  props: {
    staffUuid: {
      type: String,
      default() {
        return "";
      }
    },
    projectUuid: {
      type: String,
      default() {
        return this.$store.state.home.projectUuid;
      }
    }
  },
  activated() {},
  data() {
    return {
      startTime: getZero() + " 00:00:00",
      endTime: getZero() + " 23:59:59",
      pageNow: 1,
      limit: 300,
      data: [],
      isHavaData: true,
      isLoading: false
    };
  },
  mounted() {
    this.data = [];
    this.startTime = getZero() + " 00:00:00";
    this.endTime = getZero() + " 23:59:59";
    this.pageNow = 1;
    this.getData();
  },
  methods: {
    changeTime() {
      if (!this.startTime || !this.endTime) {
        return;
      }
      if (this.startTime > this.endTime) {
        [this.startTime, this.endTime] = [this.endTime, this.startTime];
      }
    },
    search() {
      // 最大查询时间不超过1周
      let timeDifferent =
        new Date(this.endTime).getTime() - new Date(this.startTime).getTime();
      if (timeDifferent > 604800000) {
        this.$message.warning("查询时间间隔最大为一周！");
        return;
      }
      this.data = [];
      this.pageNow = 1;
      this.isHavaData = true;
      this.getData();
    },
    getData() {
      if (!this.isHavaData || this.isLoading) {
        return;
      }
      this.isLoading = true;
      api
        .getDoorRecord({
          staffUuid: this.staffUuid,
          projectUuid: this.projectUuid,
          startTime: format(this.startTime),
          endTime: format(this.endTime),
          page: this.pageNow,
          limit: this.limit
        })
        .then(res => {
          this.isLoading = false;
          console.log(res);
          if (res.data.success) {
            let data = res.data.data || {};
            // this.data = this.data.cooncat(data.list);
            let list = data.list || [];
            if (!list.length) {
              return;
            }
            // 稍微修改后端的数据，变成前端需要的
            for (let i = 0, len = list.length; i < len; i++) {
              let time = list[i].time; // 默认time是2020-1-1 1:1:1
              let timeDate = time.split(" ")[0].split("-");
              list[i].fullTime = list[i].time;
              list[i].day = time.split(" ")[0]; // 入门的时间
              list[i].date = timeDate[0];
              list[i].time = timeDate[1] + "-" + timeDate[2];
              // list[i].staffInfo = list[i].staffInfo || [];
              // recordUuid: "3b683da157574947929d06b4a741c40e"
              // recognitionMode: "card"
              // channelUuid: "628D8B5DCA6C492DA4F1B4B3591BBFDC"
              // channelName: "192.168.9.239-门1"
              // openDoorPhotoUri: "http://192.168.9.238:9333/4,050e4ec314b3.jpg"
              // staffName: "户籍+普通"
              // time: "2020-03-04 14:00:26"
              list[i].staffInfo = [
                {
                  peopleSrc: list[i].openDoorPhotoUri,
                  recognitionMode: list[i].recognitionMode,
                  verifyDatetime: time.split(" ")[1]
                }
              ];
              // 遍历data数组，将同一天的日期的同个门的数据放在一起
              let flag = false;
              for (let j = 0; j < this.data.length; j++) {
                if (
                  this.data[j].day === list[i].day &&
                  this.data[j].channelUuid === list[i].channelUuid
                ) {
                  flag = true;
                  let item = this.data[j];
                  item.staffInfo = item.staffInfo.concat(list[i].staffInfo);
                  this.data.splice(j, 1, item);
                  break;
                }
              }
              if (!flag) {
                this.data.push(list[i]);
              }
            }
            console.log(this.data);
            this.data.sort((a1, a2) => {
              return (
                new Date(a2.fullTime).getTime() -
                new Date(a1.fullTime).getTime()
              );
            });
            let dateChannelArr = [];
            for (let j = 0; j < this.data.length; j++) {
              let picture = this.data[j];
              // 创建时间数组
              // 判断当前的通道抓拍 是否在在同一天
              let index = dateChannelArr.findIndex(item => {
                return item.time === picture.time;
              });
              // 不在时间数组内就加入时间数组
              if (index < 0) {
                picture.channelArr = [picture];
                dateChannelArr.push(picture);
              } else {
                // 若在通道数组，就加在该时间下的抓拍列表
                dateChannelArr[index].channelArr.push(picture);
              }
            }
            console.log(dateChannelArr);
            this.data = dateChannelArr;
            if (!list.length) {
              this.isHavaData = false;
            }
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    scroll(e) {
      let rightContent = this.$refs.rightContent;
      // console.log(rightContent.clientHeight);
      // console.log(rightContent.scrollTop);
      // console.log(rightContent.scrollHeight);
      // 还有30px的就触发获取下一页数据的方法
      if (
        rightContent.clientHeight + rightContent.scrollTop + 30 >=
        rightContent.scrollHeight
      ) {
        this.pageNow++;
        this.getData();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.DoorRecord {
  height: 100%;
  .headerBox {
    font-family: "PingFangSC-Regular";
    font-size: 14px;
    color: #fff;
    text-align: justify;
    span {
      padding-right: 10px;
    }
  }
  .rightContent {
    max-height: 680px;
    height: 680px;
    overflow: auto;
  }
}
</style>
