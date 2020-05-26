<template>
  <div class="BuildHouseFloorCard">
    <!--    <div style="position: relative;top: -50px;">1111111111111111</div> -->
    <div class="leftFloorBox">
      {{index+1}}
      <span>F</span>
    </div>
    <!-- <div>{{maxWidth.extInfo.modeCount}}</div> -->
    <div class="rightRoomBox"
         id="rightRoomBox"
         :style="maxWidth.extInfo.modeCount>5?`width:400px;`:`width:${maxWidth.extInfo.modeCount*80}px;`">
      <div class="imageBox"
           v-for="(item,index) in itemContain.nextDetails.length"
           :key="index"
           @click="lookDetail(itemContain.nextDetails[index].extInfo)">
        <!--数字遍历-->
        <div class="imageBoxWrap"
             v-if="itemContain.nextDetails[index]">
          <span v-if="itemContain.nextDetails[index].extInfo.alarm!==0&&itemContain.nextDetails.length>index"
                :class="numberClass">{{parseInt(itemContain.nextDetails[index].extInfo.rent+itemContain.nextDetails[index].extInfo.live)}}</span>
          <span v-else-if="itemContain.nextDetails[index].extInfo.focus!==0&&itemContain.nextDetails.length>index"
                :class="numberClass">{{parseInt(itemContain.nextDetails[index].extInfo.rent+itemContain.nextDetails[index].extInfo.live)}}</span>
          <span v-else-if="itemContain.nextDetails[index].extInfo.rent!==0&&itemContain.nextDetails.length>index"
                :class="numberClass">{{parseInt(itemContain.nextDetails[index].extInfo.rent+itemContain.nextDetails[index].extInfo.live)}}</span>
          <span v-else-if="itemContain.nextDetails[index].extInfo.live!==0&&itemContain.nextDetails.length>index"
                :class="numberClass">{{parseInt(itemContain.nextDetails[index].extInfo.rent+itemContain.nextDetails[index].extInfo.live)}}</span>
          <span v-else
                :class="numberClass">{{parseInt(itemContain.nextDetails[index].extInfo.rent+itemContain.nextDetails[index].extInfo.live)}}</span>
          <!-- <span :class="numberClass">{{itemContain.nextDetails[index].extInfo.houseNumber}}</span> -->
          <!--图片遍历-->
          <!--报警情况-->
          <img v-if="itemContain.nextDetails[index].extInfo.alarm!==0&&itemContain.nextDetails.length>index&&itemContain.nextDetails[index].extInfo.vehicle!==0"
               width="60px"
               height="60px"
               :src="icons.buildHouseAlarmCar"
               alt />
          <img v-else-if="itemContain.nextDetails[index].extInfo.alarm!==0&&itemContain.nextDetails.length>index&&itemContain.nextDetails[index].extInfo.vehicle===0"
               width="60px"
               height="60px"
               :src="icons.buildHouseAlarm"
               alt />
          <!--重点关注情况-->
          <img v-else-if="itemContain.nextDetails[index].extInfo.focus!==0&&itemContain.nextDetails.length>index&&itemContain.nextDetails[index].extInfo.vehicle!==0"
               width="60px"
               height="60px"
               :src="icons.buildHouseFocusCar"
               alt />
          <img v-else-if="itemContain.nextDetails[index].extInfo.focus!==0&&itemContain.nextDetails.length>index&&itemContain.nextDetails[index].extInfo.vehicle===0"
               width="60px"
               height="60px"
               :src="icons.buildHouseFocus"
               alt />
          <!--出租情况-->
          <img v-else-if="itemContain.nextDetails[index].extInfo.rent!==0&&itemContain.nextDetails.length>index&&itemContain.nextDetails[index].extInfo.vehicle!==0"
               width="60px"
               height="60px"
               :src="icons.buildHouseRentCar"
               alt />
          <img v-else-if="itemContain.nextDetails[index].extInfo.rent!==0&&itemContain.nextDetails.length>index&&itemContain.nextDetails[index].extInfo.vehicle===0"
               width="60px"
               height="60px"
               :src="icons.buildHouseRent"
               alt />
          <!--自住情况-->
          <img v-else-if="itemContain.nextDetails[index].extInfo.live!==0&&itemContain.nextDetails.length>index&&itemContain.nextDetails[index].extInfo.vehicle!==0"
               width="60px"
               height="60px"
               :src="icons.buildHouseResideCar"
               alt />
          <img v-else-if="itemContain.nextDetails[index].extInfo.live!==0&&itemContain.nextDetails.length>index&&itemContain.nextDetails[index].extInfo.vehicle===0"
               width="60px"
               height="60px"
               :src="icons.buildHouseReside"
               alt />
          <!--闲置情况-->
          <img v-else-if="itemContain.nextDetails[index].extInfo.live===0&&itemContain.nextDetails[index].extInfo.rent===0&&itemContain.nextDetails.length>index&&itemContain.nextDetails[index].extInfo.vehicle!==0"
               width="60px"
               height="60px"
               :src="icons.buildHouseUnuseCar"
               alt />
          <img v-else
               width="60px"
               height="60px"
               :src="icons.buildHouseUnuse"
               alt />
          <!--  <span class="indexClass">{{index>8?index+1:'0'+(index+1)}}</span> -->
          <span class="indexClass">{{itemContain.nextDetails[index].extInfo.houseNumber}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import icons from "@/common/js/icon.js";
export default {
  name: "",
  components: {},
  props: {
    index: {
      type: Number,
      default: 1
    },
    address: {
      type: String,
      default: ""
    },
    defaultFloorData: {
      type: Object,
      default: () => {
        return {
          buildHouseAlarm: []
        };
      }
    },
    detailsArr: {
      type: Object,
      default: () => {}
    },
    itemContain: {
      type: Object,
      default: () => {}
    },
    maxWidth: {
      type: Object,
      default: () => {}
    },
    listArr: [],
    activeProject: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      icons,
      numberClass: "BHRtxt",
      infrastructureUuid: "",
      isBHFShow: false,
      peopleStaffUuid: "",
      peopleFilesDialogVisiable: false,
      widthData: ""
    };
  },
  mounted() {
    // this.initImageWidth();
    // let cellLength;
    // if (Number(this.maxWidth.extInfo.modeCount) > 5) {
    //   cellLength = 5;
    // } else {
    //   cellLength = this.maxWidth.extInfo.modeCount;
    // }
    // this.widthData = cellLength * 75 + "px";
  },
  methods: {
    lookDetail(row) {
      console.log("row====", row);
      // 查看一房一档
      this.$bus.$emit("showBuildHouseFiles", {
        projectUuid: this.activeProject,
        infrastructureUuid: row.houseUuid,
        address: `${this.address}${this.index + 1}${row.houseNumber}`,
        subModuleName: "实有房屋",
        moduleName:
          this.$store.state.home.projectType.platformLevel === "levelTwo"
            ? "居委看板"
            : "社区看板"
      });
    },
    initImageWidth() {
      let elems = document.querySelectorAll("#rightRoomBox");
      let cellLength;
      if (Number(this.maxWidth.extInfo.modeCount) > 5) {
        cellLength = 5;
      } else {
        cellLength = this.maxWidth.extInfo.modeCount;
      }
      for (let index = 0; index < elems.length; index++) {
        elems[index].style.width = cellLength * 75 + "px";
        // elems[index].style.height = 80 * heightIndex + "px";
        // console.log("length1==", Number(length1) + 60 + "px");
      }
    },
    judgeImgeAct(Type) {
      // debugger;
      //   switch (imageType){
      //    case 1:
      //   }
    }
  },
  watch: {
    nextDetails(val) {
      // debugger;
      console.log("val===", val);
    },
    activeProject(val) {
      console.log("val===", val);
    }
  }
};
</script>
<style>
.imageBoxWrap {
  flex: 1;
}
</style>
<style lang="scss" scoped>
.BuildHouseFloorCard {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-bottom: 30px;
  margin-left: 20px;
  margin-right: 20px;
  .leftFloorBox {
    width: 60px;
    height: 60px;
    background-image: linear-gradient(
      -180deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    border-radius: 30px;
    border-radius: 30px;
    // margin-left: 25px;
    margin-right: 10px;
    font-family: "PingFangSC-Medium";
    font-size: 24px;
    color: #dddddd;
    text-align: justify;
    text-align: center;
    line-height: 60px;
    span {
      font-family: "PingFangSC-Medium";
      font-size: 14px;
      color: #b3aeae;
      text-align: justify;
      line-height: 33px;
      vertical-align: middle;
    }
  }
  .rightRoomBox {
    max-width: 380px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .baseClass {
      min-width: 240px;
      max-width: 400px;
    }
    .baseMaxClass {
      width: 400px;
    }
    .imageBox {
      margin-left: 15px;
      margin-bottom: 15px;
      position: relative;
      display: flex;
      span {
        display: block;
        width: 30px;
        height: 30px;
        position: absolute;
        left: 0px;
        top: 0px;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        // text-align: justify;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
      .BHAtxt {
        color: #e21010;
      }
      .BHRtxt {
        color: #32c5ff;
      }
      .BHDtxt {
        color: #25d298;
      }
      .BHUtxt {
        color: #ffd000;
      }
      .indexClass {
        font-family: "PingFangSC-Medium";
        font-size: 20px;
        color: rgba(255, 255, 255, 0.4);
        text-align: justify;
        position: absolute;
        left: 15px;
        top: 28px;
      }
    }
  }
}
</style>
