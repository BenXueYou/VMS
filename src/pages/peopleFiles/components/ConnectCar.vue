<template>
  <div class='ContentCar'>
    <div class="content">
      <div class="oneCar"
           v-for="(item,index) in data"
           :key="index">
        <div class="left">
          <img :src="$common.setPictureShow(item.vehiclePicture)"
               v-show-bigimage
               alt="">
        </div>
        <div class="right">
          <div class="info">
            <div class="imgicon">
              <img src="@/assets/images/communityBoard/car1.png"
                   alt="">
            </div>
            <div class="label">车牌号码：</div>
            <div class="answer">{{item.licenseNumber}}</div>
          </div>
          <div class="info">
            <div class="imgicon">
              <img src="@/assets/images/communityBoard/car2.png"
                   alt="">
            </div>
            <div class="label">车牌颜色：</div>
            <div class="answer">
              <span class='rect'
                    :style="{'backgroundColor':item.licenseColor}"></span>
              <!-- {{$common.getEnumItemName("color", item.licenseColor)}} -->
              {{getColor(item.licenseColor)}}
            </div>
          </div>
          <div class="info">
            <div class="imgicon"><img src="@/assets/images/communityBoard/car3.png"
                   alt=""></div>
            <div class="label">车辆颜色：</div>
            <div class="answer">
              <span class='rect'
                    :style="{'backgroundColor':item.vehicleColor}"></span>
              <!-- {{$common.getEnumItemName("color", item.vehicleColor)}} -->
              <!-- {{item.vehicleColor}} -->
              {{getColor(item.licenseColor)}}
            </div>
          </div>
          <div class="info">
            <div class="imgicon"><img src="@/assets/images/communityBoard/car4.png"
                   alt=""></div>
            <div class="label">车辆类型：</div>
            <div class="answer">{{$common.getEnumItemName("vehicle_type", item.vehicleType)}}</div>
          </div>
          <div class="info">
            <div class="imgicon"><img src="@/assets/images/communityBoard/car5.png"
                   alt=""></div>
            <div class="label">停车位：</div>
            <div class="answer"></div>
          </div>
          <div class="info">
            <div class="imgicon"><img src="@/assets/images/communityBoard/car6.png"
                   alt=""></div>
            <div class="label">登记时间：</div>
            <div class="answer">{{item.createTime?item.createTime.split(' ')[0]:item.createTime}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "@/pages/communityBoard/utils/ajax.js";
export default {
  name: "ContentCar",
  components: {},
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
      startTime: "",
      endTime: "",
      data: [
        {
          pic: "", // 车辆图片
          vehicleNo: "", // 车牌号码
          vehicleNoColor: "", // 车辆颜色
          vehicleNoColorCN: "",
          vehicleColor: "", // 车辆颜色
          vehicleColorCN: "", // 车牌颜色
          vehicleType: "", // 车辆类型
          parkGarage: "", // 停车库
          createTime: "" // 登记时间
        }
      ]
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getColor(label) {
      let carColorArr = [
        { label: "蓝色", value: "blue" },
        { label: "绿色", value: "green" },
        { label: "黄色", value: "yellow" },
        { label: "白色", value: "white" },
        { label: "黑色", value: "black" }
      ];
      let str = "";
      for (let i = 0; i < carColorArr.length; i++) {
        if (carColorArr[i].value === label) {
          str = carColorArr[i].label;
          break;
        }
      }
      return str;
    },
    getData() {
      api
        .getVehicle({
          staffUuid: this.staffUuid,
          projectUuid: this.projectUuid,
          startTime: this.startTime,
          endTime: this.endTime
        })
        .then(res => {
          if (res.data.success) {
            let data = res.data.data;
            this.data = [];
            this.data = data;
          }
        });
    }
  }
};
</script>
<style >
</style>
<style lang="scss" scoped>
.ContentCar {
  height: 100%;
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
