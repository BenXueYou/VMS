<template>
  <div class="BuildHouseRightContent"
       v-loading="mainListLoading1"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <div style="display:flex;justify-content:space-between;">
      <div class="topHeader">
        <div class="topItem"
             v-for="(item,index) in topDataArr"
             :key="index">
          <img :src="item.icon"
               alt />
          {{item.name}}
          <span>{{item.value}}</span>
        </div>
        <div class="topItem">
          <span style="width:16px;height:16px;border: 1px solid #25D298;border-radius:50%;display:inline-block;vertical-align: middle;"></span>
          <span>居住人数</span>
        </div>
      </div>
      <el-button type="primary"
                 class="backBtnClass"
                 :disabled="!ShowAuthDisabled"
                 @click="goBack()">
        <img src="@/assets/images/ActualPopulation/back.png" />返回
      </el-button>
    </div>
    <div class="contentBodyBox">
      <!--  <div class="tipContain">
        <div class="tips">{{unitName}}</div>
      </div> -->
      <div class="FloorBox"
           id="FloorBox"
           v-for="(item11,index11) in nextDetails"
           :key="index11"
           style="position: relative;">
        <div class="tipContain"
             style="position: absolute;left: 0;top: 0">
          <div class="tips">{{item11.extInfo.unitName}}</div>
        </div>
        <template>
          <div v-for="(item,index) in item11.nextDetails"
               :key="index"
               id="detailWrap">
            <build-house-floor-card :itemContain='item'
                                    :key="index"
                                    :address='item11.extInfo.unitName'
                                    :index='index'
                                    :detailsArr="detailsArr"
                                    :maxWidth="item11"
                                    :activeProject="activeProject"></build-house-floor-card>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
// import * as api from "../ajax";
// import icons from "@/common/icon.js";
// import RestApi from "@/utils/RestApi.js";
import BuildHouseFloorCard from "../components/BuildHouseFloorCard.vue";
export default {
  name: "wrap",
  props: {
    tabName: {
      type: String,
      default() {
        return "";
      }
    },
    tabMap: {
      type: Object,
      default() {
        return {
          organiza: "TheCompanyTable",
          tag: "TheTagTable"
        };
      }
    },
    ShowAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    OwnAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    rightpieData: {
      type: Object,
      default: () => {}
    },
    activeProject: {
      type: String,
      default() {
        return "";
      }
    }
  },
  components: { BuildHouseFloorCard },
  data() {
    return {
      topDataArr: [
        {
          icon: require("@/assets/images/communityBoard/build_house_reside1x.png"),
          name: "自住",
          value: 0
        },
        {
          icon: require("@/assets/images/communityBoard/build_house_isfocus.png"),
          name: "出租",
          value: 0
        },
        {
          icon: require("@/assets/images/communityBoard/build_house_unuse1x.png"),
          name: "闲置",
          value: 0
        },
        {
          icon: require("@/assets/images/communityBoard/build_house_rent_icon1x.png"),
          name: "重点关注",
          value: 0
        },
        {
          icon: require("@/assets/images/communityBoard/build_house_alarm_icon1x.png"),
          name: "报警",
          value: 0
        },
        {
          icon: require("@/assets/images/carIcon.png"),
          name: "车辆",
          value: 0
        }
      ],
      mainListLoading1: false,
      pageSize: 15,
      total: 0,
      currentPage: 1,
      unitName: "",
      nextDetails: [],
      detailsArr: {},
      maxWidth: ""
    };
  },
  activated() {},
  mounted() {
    // 当窗口发生变化时
    window.addEventListener("resize", function() {});
    // console.log("rightpieData", this.rightpieData);
    // debugger;
    // let that = this;
    // setTimeout(function() {
    //   that.initImageWidth1();
    // }, 1000);
  },
  deactivated() {},
  methods: {
    goBack() {
      this.$router.go(-1);
      // this.$router.push({name: "CommunityBoardHome"});
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    initImageWidth1() {
      let elems = document.querySelectorAll("#detailWrap");
      // let elems1 = document.querySelectorAll("#rightRoomBox");
      let heightIndex;
      if (Number(this.detailsArr.modeCount) > 6) {
        // cellLength = 6;
        heightIndex = parseInt(Number(this.detailsArr.modeCount) / 5) + 1;
      } else {
        // cellLength = this.detailsArr.modeCount;
        heightIndex = 1;
      }
      for (let index = 0; index < elems.length; index++) {
        // elems[index].style.width = (cellLength+3) * 80 + 20 + "px";
        elems[index].style.height = 80 * heightIndex + "px";
        // console.log("length1==", Number(length1) + 60 + "px");
      }
      // for (let index1 = 0; index1 < elems1.length; index1++) {
      //   elems1[index1].style.width = cellLength * 80 + "px";
      //   elems1[index1].style.height = 80 * heightIndex + "px";
      //   // console.log("length1==", Number(length1) + 60 + "px");
      // }
    }
  },
  watch: {
    rightpieData(val) {
      this.topDataArr[0].value = val.statistics.live;
      this.topDataArr[1].value = val.statistics.rent;
      this.topDataArr[2].value = val.statistics.unuse;
      this.topDataArr[3].value = val.statistics.focus;
      this.topDataArr[4].value = val.statistics.alarm;
      this.topDataArr[5].value = val.statistics.vehicle;
      // this.unitName = val.houseDetailData[0].extInfo.unitName;
      this.nextDetails = val.houseDetailData;
      this.detailsArr = val;
    },
    activeProject(val) {
      console.log("val===", val);
      this.activeProject = val;
    }
  }
};
</script>
<style>
.BuildHouseRightContent .tipContain {
  width: 100%;
  height: 40px;
}
.BuildHouseRightContent .tips:before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(to left, #25d298, #25d298) left top no-repeat,
    linear-gradient(to bottom, #25d298, #25d298) left top no-repeat,
    linear-gradient(to left, #25d298, #25d298) right top no-repeat,
    linear-gradient(to bottom, #25d298, #25d298) right top no-repeat,
    linear-gradient(to left, #25d298, #25d298) left bottom no-repeat,
    linear-gradient(to bottom, #25d298, #25d298) left bottom no-repeat,
    linear-gradient(to left, #25d298, #25d298) right bottom no-repeat,
    linear-gradient(to left, #25d298, #25d298) right bottom no-repeat;
  background-size: 1px 10px, 10px 1px, 1px 10px, 10px 1px;
}
</style>
<style lang="scss" scoped>
.BuildHouseRightContent {
  width: calc(100% - 800px);
  height: 100%;
  background-color: #212325;
  padding: 25px 30px;
  box-sizing: border-box;
  .topHeader {
    display: flex;
    justify-content: flex-start;
    height: 54px;
    line-height: 54px;
    .topItem {
      margin-right: 25px;
      font-family: PingFangSC-Regular;
      font-size: 18px;
      color: #dddddd;
      letter-spacing: 0;
      text-align: justify;
      img {
        width: 18px;
        max-height: 18px;
        margin-right: 8px;
      }
    }
  }
  .backBtnClass {
    width: 100px;
    height: 42px;
    img {
      width: 14px;
      height: 16px;
      vertical-align: middle;
      margin-right: 8px;
    }
  }
  .contentBodyBox {
    border-top: 1px dashed rgba(255, 255, 255, 0.25);
    // padding-top: 22px;
    height: calc(100% - 50px);
    overflow: scroll;
    padding-bottom: 200px;
    .tips {
      width: fit-content;
      height: 40px;
      padding: 0 24px;
      font-family: PingFangSC-Regular;
      font-size: 18px;
      color: #dddddd;
      letter-spacing: 0;
      text-align: justify;
      position: relative;
      opacity: 0.8;
      background: rgba(67, 251, 239, 0.07);
      // border: 1px solid rgba(37, 210, 152, 0.3);
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
      border-radius: 2px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      // background: url("./../../../../assets/images/communityBoard/btn_bg.png")
      //  no-repeat;
      //    background-size: contain;
    }
    .FloorBox {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      // height: calc(100% - 150px);
      // overflow: auto;
      margin-top: 30px;
      padding-top: 50px;
      box-sizing: border-box;
    }
  }
}
</style>
