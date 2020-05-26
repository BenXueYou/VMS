<template>
  <div class="ContentCar">
    <div class="content">
      <div class="oneCar"
           v-for="(item,index) in data"
           :key="index">

        <div class="left">
          <!-- <el-image :src="item.vehiclePicture" :preview-src-list="[item.vehiclePicture]" alt></el-image> -->
          <img v-show-bigimage
               :src="$common.setPictureShow(item.vehiclePicture)"
               alt />
        </div>
        <div class="right">
          <div class="info">
            <div class="imgicon">
              <img src="@/assets/images/communityBoard/car1.png"
                   alt />
            </div>
            <div class="label">车牌号码：</div>
            <div class="answer">{{item.licenseNumber}}</div>
          </div>
          <div class="info">
            <div class="imgicon">
              <img src="@/assets/images/communityBoard/car2.png"
                   alt />
            </div>
            <div class="label">车牌颜色：</div>
            <div class="answer">
              <span class="rect"
                    :style="{'backgroundColor':item.licenseColor}"></span>
              {{$common.getEnumItemName("color", item.licenseColor)}}色
            </div>
          </div>
          <div class="info">
            <div class="imgicon">
              <img src="@/assets/images/communityBoard/car3.png"
                   alt />
            </div>
            <div class="label">车辆颜色：</div>
            <div class="answer">
              <span class="rect"
                    :style="{'backgroundColor':item.vehicleColor}"></span>
              {{$common.getEnumItemName("color", item.vehicleColor)}}
            </div>
          </div>
          <div class="info">
            <div class="imgicon">
              <img src="@/assets/images/communityBoard/car4.png"
                   alt />
            </div>
            <div class="label">车辆类型：</div>
            <div class="answer">{{$common.getEnumItemName("vehicle_type", item.vehicleType)}}</div>
          </div>
          <div class="info">
            <div class="imgicon">
              <img src="@/assets/images/communityBoard/car5.png"
                   alt />
            </div>
            <div class="label">停车位：</div>
            <div class="answer">{{item.stop}}</div>
          </div>
          <div class="info">
            <div class="imgicon">
              <img src="@/assets/images/communityBoard/car6.png"
                   alt />
            </div>
            <div class="label">登记时间：</div>
            <div class="answer">{{item.createTime}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import * as api from "@/pages/communityBoard/utils/ajax.js";
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
  return year + "-" + month + "-" + date + " " + 0 + ":" + 0 + ":" + 0;
};
export default {
  name: "ContentCar",
  components: {},
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
  data() {
    return {
      startTime: getZero(),
      endTime: new Date(),
      pageNow: 1,
      limit: 15,
      sHavaData: true,
      isLoading: false,
      data: []
    };
  },
  mounted() {
    this.getData();
  },
  destroyed() {
    this.data = [];
  },
  methods: {
    getData() {
      if (!this.infrastructureUuid) {
        return;
      }
      this.$BuildHouseFileAjax
        .roomCarListApi({
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
          if (res.data.success) {
            this.data = res.data.data;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  watch: {
    infrastructureUuid(val) {
      this.data = [];
      if (val) {
        this.getData();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.ContentCar {
  height: 100%;
  .headerBox {
    font-family: "PingFangSC-Regular";
    font-size: 14px;
    color: #fff;
    text-align: justify;
    height: auto;
    span {
      padding-right: 10px;
    }
  }
  .content {
    max-height: 680px;
    height: 680px;
    overflow: auto;
    .oneCar {
      display: flex;
      margin: 25px 20px 35px;
      padding-bottom: 35px;
      border-bottom: 1px dashed;
      box-sizing: border-box;
      .left {
        width: 480px;
        height: 268px;
        .el-image,
        img {
          max-width: 100%;
          max-height: 100%;
          width: 100%;
          height: 100%;
        }
      }
      .right {
        width: calc(100% - 480px);
        background-color: rgba(255, 255, 255, 0.05);
        .info {
          font-family: "PingFangSC-Regular";
          font-size: 18px;
          color: #dddddd;
          text-align: left;
          margin: 20px 15px;
          line-height: 20px;
          display: flex;
          align-items: center;
          .imgicon {
            text-align: center;
            width: 35px;
            img {
              vertical-align: middle;
              display: inline-block;
              width: 19px;
            }
          }
          .label {
            width: 90px;
          }
          .answer {
            .rect {
              display: inline-block;
              vertical-align: middle;
              width: 12px;
              height: 12px;
            }
          }
        }
      }
    }
    .oneCar:nth-last-child(1) {
      border-bottom: 0px dashed;
      margin-bottom: 0px;
    }
  }
}
</style>
