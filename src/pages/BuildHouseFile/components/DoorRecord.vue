<template>
  <div class="DoorRecord">
    <div class="header">
      <span>开门时间：</span>
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
// import * as api from "@/pages/communityBoard/utils/buildHouseFileAjax.js";
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
export default {
  name: "DoorRecord",
  components: {
    TimeLine
  },
  props: {
    infrastructureUuid: {
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
  watch: {
    infrastructureUuid(val) {
      this.data = [];
      if (val) {
        this.getData();
      }
    }
  },
  data() {
    return {
      startTime: "",
      endTime: new Date(),
      pageNow: 1,
      limit: 300,
      data: [],
      isHavaData: true,
      isLoading: false
    };
  },
  mounted() {
    this.startTime = this.$common.getStartTime();
    this.getData();
  },
  destroyed() {},
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
      if (!this.infrastructureUuid || !this.isHavaData || this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.$BuildHouseFileAjax
        .roomDoorRecordApi({
          infrastructureUuid: this.infrastructureUuid,
          projectUuid: this.projectUuid,
          startTime: format(this.startTime),
          endTime: format(this.endTime),
          page: this.pageNow,
          limit: this.limit
        })
        .then(res => {
          this.isLoading = false;
          console.log(res);
          let newData = [];
          if (res.data.success) {
            let data = res.data.data;
            // this.data = this.data.cooncat(data.list);
            let list = data.list;
            list.sort((a, b) => {
              let str1 = new Date(a.time).getTime();
              let str2 = new Date(b.time).getTime();
              return str1 - str2;
            });

            // 稍微修改后端的数据，变成前端需要的
            for (let i = 0, len = list.length; i < len; i++) {
              let time = list[i].time; // 默认time是2020-1-1 1:1:1
              list[i].dateTime = list[i].time; // 默认time是2020-1-1 1:1:1
              list[i].verifyDatetime = time.split(" ")[1]; // 默认time是2020-1-1 1:1:1
              let timeDate = time.split(" ")[0].split("-");
              list[i].date = timeDate[0];
              list[i].time = timeDate[1] + "-" + timeDate[2];

              let staffInfo = [];
              staffInfo.push(list[i]);
              if (i > 0 && list[i].time === list[i - 1].time) {
                newData[newData.length - 1].staffInfo.push(list[i]);
              } else {
                list[i].staffInfo = staffInfo;
                newData.push(list[i]);
              }
            }
            // 按时间由近到远排序
            newData.sort((a, b) => {
              let str1 = new Date(a.dateTime).getTime();
              let str2 = new Date(b.dateTime).getTime();
              return str2 - str1;
            });
            console.log(newData);

            for (let j = 0; j < newData.length; j++) {
              let staffInfo = newData[j].staffInfo;
              console.log(staffInfo);
              // 创建通道数组
              let dateChannelArr = [];
              // 遍历同一天抓拍的数组，按照通道再进行分组
              for (let k = 0; k < staffInfo.length; k++) {
                // 判断当前的通道 是否在通道数组
                let index = dateChannelArr.findIndex(item => {
                  return item.channelUuid === staffInfo[k].channelUuid;
                });
                // 创建通道下的抓拍列表
                staffInfo[k].shootRecord = [];
                // 不在通道数组就加入通道数组
                if (index < 0) {
                  staffInfo[k].shootRecord.push(staffInfo[k]);
                  dateChannelArr.push(staffInfo[k]);
                } else {
                  // 若在通道数组，就加在该通道下的抓拍列表
                  dateChannelArr[index].shootRecord.push(staffInfo[k]);
                }
              }
              // 取出同一天抓拍的数组
              newData[j].dateChannelArr = dateChannelArr;
            }
            console.log(newData);
            this.data = newData;
            if (!data.list.length) {
              this.isHavaData = false;
            }
          }
        })
        .catch(err => {
          console.log(err);
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
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.DoorRecord {
  height: 100%;
  .header {
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
