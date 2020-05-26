<template>
  <div class='PastCarRecord'>
    <div class="headerBox">
      <span>过车时段：</span>
      <el-date-picker v-model="startTime"
                      type="datetime"
                      @change="changeTime"
                      placeholder="选择日期时间">
      </el-date-picker>
      <span class='split'>-</span>
      <el-date-picker v-model="endTime"
                      type="datetime"
                      @change="changeTime"
                      placeholder="选择日期时间">
      </el-date-picker>
      <el-button type="primary"
                 @click="search">
        查询
      </el-button>
    </div>
    <div class="rightContent"
         ref="rightContent"
         v-loading="isLoading"
         @scroll="scroll">
      <div class="timelineWrap">
        <div class='oneTimeLeft'
             v-for="(item,index) in data"
             :key="index">
          <div class="time">
            <p>{{item.time}}</p>
            <span>{{item.date}}</span>
          </div>
          <div class="content">
            <div class="flex-st"
                 v-for="(im,i) in item.dateChannelArr"
                 :key="i">
              <div class="line">
                <div class="circle"></div>
                <div class="line"></div>
              </div>
              <div class="channelList">
                <div class="addressRect">
                  {{im.channelName}}
                </div>
                <div class="mywarp">
                  <my-car v-for="(it,ix) in im.shootRecord"
                          :channelName="item.channelName"
                          :channelUuid="item.channelUuid"
                          :key="ix"
                          :data="it"></my-car>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MyCar from "./MyCar";
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
  name: "PastCarRecord",
  components: {
    MyCar
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
  data() {
    return {
      startTime: getZero() + " 00:00:00",
      endTime: getZero() + " 23:59:59",
      pageNow: 1,
      limit: 300,
      sHavaData: true,
      isLoading: false,
      dir: {
        right: "右",
        left: "左",
        in: "进",
        out: "出"
      },
      isHavaData: true,
      data: [
        // {
        //   date: "2020",
        //   time: "11-11",
        //   title: "1号楼出口人脸门禁",
        //   picture: [
        //     {
        //       src: "",
        //       carLincese: "刷脸",
        //       carDirection: "进",
        //       passTime: "14:12:02",
        //       channelUuid: ""
        //     }
        //   ]
        // }
      ]
    };
  },
  mounted() {
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
      this.data = [];
      this.pageNow = 1;
      this.isHavaData = true;
      this.getData();
    },
    getData() {
      console.log(this.isHavaData);
      console.log(this.isLoading);
      if (!this.isHavaData || this.isLoading) {
        return;
      }
      this.isLoading = true;
      api
        .getVehicleSnapshot({
          staffUuid: this.staffUuid,
          projectUuid: this.projectUuid,
          startTime: format(this.startTime),
          endTime: format(this.endTime),
          page: this.pageNow,
          limit: this.limit
        })
        .then(res => {
          this.isLoading = false;
          console.log(res.data);
          if (res.data.success) {
            let data = res.data.data || {};
            // this.data = this.data.cooncat(data.list);
            let list = data.list || [];
            list.sort((a, b) => {
              let str1 = new Date(a.createTime).getTime();
              let str2 = new Date(b.createTime).getTime();
              return str1 - str2;
            });
            for (let i = 0, len = list.length; i < len; i++) {
              let time = list[i].createTime; // 默认time是2020-1-1 1:1:1
              let timeDate = time.split(" ")[0].split("-");
              list[i].fullTime = list[i].time;
              list[i].date = timeDate[0];
              list[i].time = timeDate[1] + "-" + timeDate[2];
              list[i].hour = time.split(" ")[1];
              let PCRRecord = {
                staffName: list[i].staffName,
                src: list[i].vehiclePic,
                carLincese: list[i].vehicleNo,
                carDirection: this.dir[list[i].direction],
                passTime: list[i].createTime,
                channelName: list[i].channelName,
                date: list[i].date,
                time: list[i].time,
                hour: list[i].hour
              };
              let PCRRecordList = [];
              PCRRecordList.push(PCRRecord);
              // 按时间进行分组
              if (i > 0 && list[i].time === list[i - 1].time) {
                this.data[this.data.length - 1].PCRRecordList.unshift(
                  PCRRecord
                );
              } else {
                PCRRecord.PCRRecordList = PCRRecordList;
                this.data.push(PCRRecord);
              }
            }
            this.data.sort((a, b) => {
              let str1 = new Date(a.time).getTime();
              let str2 = new Date(b.time).getTime();
              return str2 - str1;
            });
            for (let j = 0; j < this.data.length; j++) {
              let PCRRecordList = this.data[j].PCRRecordList;
              // 创建通道数组
              let dateChannelArr = [];
              // 遍历同一天抓拍的数组，按照通道再进行分组
              for (let k = 0; k < PCRRecordList.length; k++) {
                // 判断当前的通道 是否在通道数组
                let index = dateChannelArr.findIndex(item => {
                  return item.channelName === PCRRecordList[k].channelName;
                });
                // 创建通道下的抓拍列表
                PCRRecordList[k].shootRecord = [];
                // 不在通道数组就加入通道数组
                if (index < 0) {
                  PCRRecordList[k].shootRecord.push(PCRRecordList[k]);
                  dateChannelArr.push(PCRRecordList[k]);
                } else {
                  // 若在通道数组，就加在该通道下的抓拍列表
                  dateChannelArr[index].shootRecord.push(PCRRecordList[k]);
                }
              }
              // 取出同一天抓拍的数组
              this.data[j].dateChannelArr = dateChannelArr;
            }
            if (!data.list || !data.list.length) {
              this.isHavaData = false;
            }
          }
        })
        .catch(err => {
          this.isLoading = false;
          console.log(err);
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
.PastCarRecord {
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
  .oneTimeLeft {
    display: flex;
    padding-top: 20px;
    box-sizing: border-box;
    .time {
      width: 90px;
      text-align: right;
      p {
        font-family: "PingFangSC-Medium";
        font-size: 24px;
        color: #25d298;
        text-align: right;
        margin: 0px;
        padding: 0px;
      }
      span {
        font-family: "PingFangSC-Regular";
        font-size: 12px;
        color: #888888;
        text-align: right;
      }
    }
    .line {
      width: 50px;
      .circle {
        width: 10px;
        height: 10px;
        background: #17edac;
        position: relative;
        border-radius: 50%;
        margin: 0 auto;
        margin-top: 10px;
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          height: 20px;
          width: 20px;
          border-radius: 50%;
          border: 1px solid #17edac;
        }
      }
      .line {
        height: calc(100% - 30px);
        margin: 0 auto;
        margin-top: 15px;
        width: 0px;
        border-right: 1px dashed rgba(37, 210, 152, 0.3);
      }
    }

    .content {
      width: calc(100% - 90px);
      .flex-st {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        .channelList {
          width: calc(100% - 50px);
        }
      }
      .mywarp {
        display: flex;
        flex-wrap: wrap;
      }
      .addressRect {
        height: 35px;
        line-height: 35px;
        margin-bottom: 10px;
        // opacity: 0.1;
        background-image: linear-gradient(
          -90deg,
          rgba(37, 210, 152, 0) 7%,
          rgba(37, 210, 152, 0.1) 77%
        );
        border-radius: 3px;
        font-family: "PingFangSC-Regular";
        font-size: 14px;
        color: #25d298;
        text-align: justify;
        text-indent: 15px;
      }
    }
  }
}
</style>
