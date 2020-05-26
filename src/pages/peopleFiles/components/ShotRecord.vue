<template>
  <div class='PastCarRecord'>
    <div class="headerBox">
      <span>抓拍时段：</span>
      <el-date-picker v-model="startTime"
                      type="datetime"
                      @change="changeTime"
                      placeholder="选择日期时间">
      </el-date-picker>
      <span class='split'>-</span>
      <el-date-picker v-model="endTime"
                      @change="changeTime"
                      type="datetime"
                      placeholder="选择日期时间">
      </el-date-picker>
      <span>图片质量：</span>
      <el-checkbox-group class="picQuity"
                         v-model="qualityOption">
        <el-checkbox-button label="HIGH">
          高
          <img src="@/assets/images/faceModule/selected.png"
               class="checkBtnImg"
               v-if="qualityOption.indexOf('HIGH')!==-1" />
        </el-checkbox-button>
        <el-checkbox-button label="NORMAL">
          中
          <img src="@/assets/images/faceModule/selected.png"
               class="checkBtnImg"
               v-if="qualityOption.indexOf('NORMAL')!==-1" />
        </el-checkbox-button>
        <el-checkbox-button label="LOW">
          低
          <img src="@/assets/images/faceModule/selected.png"
               class="checkBtnImg"
               v-if="qualityOption.indexOf('LOW')!==-1" />
        </el-checkbox-button>
      </el-checkbox-group>
      <!-- <ul class='picQuity'>
        <li :class="{'active':selectArr.indexOf(0)!=-1}"
            @click='setIndex(0)'>高</li>
        <li :class="{'active':selectArr.indexOf(1)!=-1}"
            @click='setIndex(1)'>中</li>
        <li :class="{'active':selectArr.indexOf(2)!=-1}"
            @click='setIndex(2)'>低</li>
      </ul> -->
      <el-button type="primary"
                 @click="search">
        查询
      </el-button>
    </div>
    <div class="rightcontent"
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
                 v-for="(im,i) in item.channelArr"
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
                  <my-photo v-for="(it,ix) in im.picture"
                            :key="ix"
                            :data="it"></my-photo>
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
import MyPhoto from "./MyPhoto";
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
    MyPhoto
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
      qualityOption: ["HIGH", "NORMAL", "LOW"],
      selectArr: [0, 1, 2],
      activeIndex: 0,
      num: ["HIGH", "NORMAL", "LOW"],
      pageNow: 1,
      limit: 300,
      startTime: getZero() + " 00:00:00",
      endTime: getZero() + " 23:59:59",
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
        // },
        // {
        //   captureDatetime: "2020-03-04 13:55:54",
        //   channelUuid: "8195B3691FEF3433ACD242557709CA29",
        //   channelName: "192.168.9.25-枪机1",
        //   staffName: "户籍+普通",
        //   faceCapturePhotoUrl: "http://192.168.9.238:9333/6,014a0d333b4b.jpg",
        //   faceSimilarity: 90,
        //   facePhotoUrl: "http://192.168.9.238:9333/4,03efa7ed24.jpeg",
        //   panoramaCapturePhotoUrl:
        //     "http://192.168.9.238:9333/6,0149a34ac5e7.jpg"
        // }
      ],
      isHavaData: true,
      isLoading: false
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    changeTime() {
      if (this.startTime > this.endTime) {
        [this.startTime, this.endTime] = [this.endTime, this.startTime];
      }
    },
    setIndex(index) {
      let i = this.selectArr.indexOf(index);
      if (i === -1) {
        this.selectArr.push(index);
      } else {
        this.selectArr.splice(i, 1);
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
      let faceCapturePhotoQuality = [];
      for (let i = 0; i < this.selectArr.length; i++) {
        faceCapturePhotoQuality.push(this.num[this.selectArr[i]]);
      }
      api
        .getSnapshot({
          staffUuid: this.staffUuid,
          projectUuid: this.projectUuid,
          startTime: format(this.startTime),
          endTime: format(this.endTime),
          page: this.pageNow,
          limit: this.limit,
          faceCapturePhotoQuality: this.qualityOption.toString() || null
          // faceCapturePhotoQuality: faceCapturePhotoQuality.join(",")
        })
        .then(res => {
          console.log(res);
          this.isLoading = false;
          if (res.data.success) {
            let data = res.data.data || {};
            // this.data = this.data.cooncat(data.list);
            let list = data.list || [];
            console.log(list.length);
            if (!list.length) return;
            for (let i = 0, len = list.length; i < len; i++) {
              let time = list[i].captureDatetime; // 默认time是2020-1-1 1:1:1
              let timeDate = time.split(" ")[0].split("-");
              list[i].day = time.split(" ")[0];
              list[i].date = timeDate[0];
              list[i].time = timeDate[1] + "-" + timeDate[2];
              list[i].hour = time.split(" ")[1];
              list[i].picture = [
                {
                  faceCapturePhotoUrl: list[i].panoramaCapturePhotoUrl,
                  panoramaCapturePhotoUrl: list[i].faceCapturePhotoUrl,
                  passTime: list[i].hour,
                  similar: list[i].faceSimilarity,
                  channelUuid: list[i].channelUuid
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
                  item.picture = item.picture.concat(list[i].picture);
                  this.data.splice(j, 1, item);
                  break;
                }
              }
              console.log(this.data);
              // 将同一天的抓拍放在一起
              if (!flag) {
                this.data.push(list[i]);
              }
            }
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
                // 若在通道数组，就加在该时间下的通道列表列表
                dateChannelArr[index].channelArr.push(picture);
              }
            }
            this.data = dateChannelArr;
            console.log(this.data);
            if (!data.list.length) {
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
      console.log(rightContent.clientHeight);
      console.log(rightContent.scrollTop);
      console.log(rightContent.scrollHeight);
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
<style lang="scss">
.PastCarRecord .el-checkbox-button.is-checked .el-checkbox-button__inner,
.PastCarRecord .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background: rgba(40, 255, 187, 0.1);
  border-radius: 2px;
  border-radius: 2px;
  border: 1px solid #26d39d;
  -webkit-box-shadow: 0px 0 0 0 #26d39d;
  box-shadow: 0px 0 0 0 #26d39d;
}
// .PastCarRecord .el-checkbox-button:first-child .el-checkbox-button__inner,
// .PastCarRecord .el-radio-button:first-child .el-radio-button__inner {
// 	border: 1px solid transparent;
// }
.PastCarRecord .el-checkbox-button__inner,
.PastCarRecord .el-radio-button__inner {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  margin-right: 9px;
  border: 1px solid transparent;
  padding: 8px 20px;
  font-size: 13px;
}
.PastCarRecord .checkBtnImg {
  position: absolute;
  right: -5px;
  top: -5px;
}
.PastCarRecord .el-date-editor.el-input,
.PastCarRecord .el-date-editor.el-input__inner {
  width: 200px;
}
</style>
<style lang="scss" scoped>
.PastCarRecord {
  height: 100%;
  .headerBox {
    font-family: "PingFangSC-Regular";
    font-size: 14px;
    color: #fff;
    text-align: justify;
    span {
      padding-left: 10px;
      padding-right: 0px;
    }
    .picQuity {
      display: inline-block;
      list-style: none;
      margin: 0px;
      padding-left: 0px;
      vertical-align: middle;
      li {
        display: inline-block;
        width: 40px;
        height: 34px;
        text-align: center;
        line-height: 34px;
        cursor: pointer;
      }
      .active {
        background-color: #25d298;
      }
    }
  }
  .rightcontent {
    height: 680px;
  }
  .timelineWrap {
    height: 100%;
    overflow-y: auto;
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
        margin-bottom: 15px;
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
