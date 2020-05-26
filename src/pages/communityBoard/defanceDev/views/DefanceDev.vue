<template>
  <div class="def-main"
       id="def-main">
    <base-map-common :moduleName="isOneProject?'社区看板':'居委看板'"
                     ref="baseMap"
                     v-if="isOneProject"
                     @fullScreenCall="fullScreenCall"
                     @commonFilter="commonFilter" />
    <data-board-map :moduleName="isOneProject?'社区看板':'居委看板'"
                    ref="baseMap"
                    :isShowStreetBlock="false"
                    v-if="!isOneProject"
                    @fullScreenCall="fullScreenCall"
                    @commonFilter="commonFilter" />
    <div class="left-layer">
      <div class="total">
        <div class="total-num">{{deviceCount}}</div>
        <div class="total-unit">
          <div>/ 个</div>
          <div>通道总数</div>
        </div>
      </div>
      <el-checkbox :indeterminate="isIndeterminate"
                   v-model="checkAll"
                   style="margin-top: 40px"
                   @change="handleCheckAllChange">全选
        <div class="all-right">
          <div class="option-line"
               style="margin-left: 40px; border-color: #F7B500"></div>
          <div>总数</div>
          <div class="option-line"
               style="margin-left: 25px; border-color: #FF5F5F"></div>
          <div>报警</div>
          <div class="option-line"
               style="margin-left: 25px; border-color: #BBBBBB"></div>
          <div>离线</div>
        </div>
      </el-checkbox>
      <el-checkbox-group v-model="checkedDevices"
                         @change="handleCheckedDevChange">
        <template v-for="(dev, index) in devices">
          <el-checkbox v-if="dev.chnAllCount !== 0"
                       @change="singleChange($event, dev)"
                       :label="dev.chnType"
                       :key="index">
            <div class="box-item">
              <div class="item-icon">
                <img :src="require(`@/assets/images/communityBoard/${dev.chnType}.png`)">
              </div>
              <div class="item-detail">
                <div class="item-num">
                  <span style="color: #F7B500">{{dev.chnAllCount}}</span>
                  <span style="color: #FF5F5F; margin-left: 15px">{{dev.chnAlarmCount}}</span>
                  <span style="color: #BBBBBB; margin-left: 15px">{{dev.chnOfflineNum}}</span>
                </div>
                <div class="item-type">{{getChnTypeTrans(dev.chnType)}}</div>
              </div>
            </div>
          </el-checkbox>
        </template>
      </el-checkbox-group>
    </div>
    <div class="back-menu"
         @click="goBack">
      <img src="@/assets/images/communityBoard/path2.png">
    </div>
  </div>
</template>

<script>
import BaseMapCommon from "@/pages/mapOperate/components/BaseMapCommon";
import DataBoardMap from "@/pages/mapOperate/components/DataBoardMap";

export default {
  components: { BaseMapCommon, DataBoardMap },
  props: {},
  data() {
    return {
      checkAll: true,
      checkedDevices: [
        "face_capture",
        "vehicle_capture",
        "body_capture",
        "normal_capture",
        "intrusion_alarm",
        "access_ctrl",
        "parking",
        "perception",
        "real_inspection"
      ],
      devices: [],
      isIndeterminate: false,
      deviceCount: 0,
      chnTypeTrans: [
        {
          key: "face_capture",
          value: "人脸抓拍摄像机"
        },
        {
          key: "vehicle_capture",
          value: "车辆抓拍摄像机"
        },
        {
          key: "body_capture",
          value: "人体抓拍摄像机"
        },
        {
          key: "normal_capture",
          value: "普通抓拍摄像机"
        },
        {
          key: "intrusion_alarm",
          value: "入侵报警"
        },
        {
          key: "access_ctrl",
          value: "门禁"
        },
        {
          key: "parking",
          value: "停车场"
        },
        {
          key: "perception",
          value: "泛感知"
        },
        {
          key: "real_inspection",
          value: "实时巡检"
        }
      ],
      cameraArr: [
        {
          value: "face_capture",
          checked: true
        },
        {
          value: "vehicle_capture",
          checked: true
        },
        {
          value: "body_capture",
          checked: true
        },
        {
          value: "normal_capture",
          checked: true
        }
      ],
      isOneProject: false,
      scanColTypeArr: ["faceSnap", "vehicleSnap", "bodySnap", "normalSnap"]
    };
  },
  created() {
    let projectType = this.$store.state.home.projectType || {};
    this.isOneProject = Boolean(projectType.platformLevel === "levelOne");
  },
  activated() {},
  mounted() {
    this.getDefanceDevList();
  },
  methods: {
    getDefanceDevList() {
      this.deviceCount = 0;
      this.devices = [];
      this.$DefanceDevHttp.getDefanceDevList().then(res => {
        let body = res.data;
        this.getDefanceDevListSuccess(body);
      });
    },
    getDefanceDevListSuccess(body) {
      if (body.data) {
        this.devices = body.data.list;
        this.devices.forEach(v => {
          this.$set(v, "isChecked", true);
          this.deviceCount = this.deviceCount + parseInt(v.chnAllCount);
        });
      }
    },
    getChnTypeTrans(key) {
      let val = "";
      this.chnTypeTrans.forEach(v => {
        if (v.key === key) {
          val = v.value;
        }
      });
      return val;
    },
    goBack() {
      this.$router.go(-1);
    },
    handleCheckAllChange(val) {
      let devArr = [];
      if (this.devices) {
        this.devices.forEach(v => {
          devArr.push(v.chnType);
        });
      }
      this.checkedDevices = val ? devArr : [];
      this.isIndeterminate = false;
      if (this.checkAll) {
        this.$refs.baseMap.mapView.showAll(allShowStatus => {
          this.$refs.baseMap.allShowStatus = allShowStatus;
        });
        this.cameraArr.forEach(v => {
          this.$set(v, "checked", true);
        });
      } else {
        this.$refs.baseMap.mapView.hideAll(allShowStatus => {
          this.$refs.baseMap.allShowStatus = allShowStatus;
        });
        this.cameraArr.forEach(v => {
          this.$set(v, "checked", false);
        });
      }
    },
    handleCheckedDevChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.devices.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.devices.length;
    },
    singleChange(val, dev) {
      this.$set(dev, "isChecked", val);
      if (dev.chnType === "access_ctrl") {
        this.$refs.baseMap.mapView.filterByChnType("door", val, hideItemArr => {
          this.$refs.baseMap.chnTypeHideItemArr = this.$common.copyArray(
            hideItemArr,
            this.$refs.baseMap.chnTypeHideItemArr
          );
        });
      } else if (
        dev.chnType === "face_capture" ||
        dev.chnType === "vehicle_capture" ||
        dev.chnType === "body_capture" ||
        dev.chnType === "normal_capture"
      ) {
        this.cameraArr.forEach(v => {
          if (v.value === dev.chnType) {
            this.$set(v, "checked", val);
          }
        });
        this.scanColTypeArr = ["faceSnap", "vehicleSnap", "bodySnap", "normalSnap"];
        this.cameraArr.forEach(v => {
          if (!v.checked) {
            for (let [i, v2] of this.scanColTypeArr.entries()) {
              if (v2 === `${v.value.split("_")[0]}Snap`) {
                this.scanColTypeArr.splice(i, 1);
              }
            }
          }
        });
        this.$refs.baseMap.mapView.filterByScanCol(
          this.scanColTypeArr,
          hideItemArr => {
            this.$refs.baseMap.snapColHideItemArr = this.$common.copyArray(
              hideItemArr,
              this.$refs.baseMap.snapColHideItemArr
            );
          }
        );
      }
    },
    fullScreenCall(val) {
      let element = document.getElementById("def-main");
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        // current working methods
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        this.$refs.baseMap.screenText = "退出全屏";
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        this.$refs.baseMap.screenText = "全屏";
      }
    },
    commonFilter() {
      this.devices.forEach(v => {
        if (v.chnType === "access_ctrl" && !v.isChecked) {
          this.$refs.baseMap.mapView.filterByChnType("door", v.isChecked, hideItemArr => {
            this.$refs.baseMap.chnTypeHideItemArr = this.$common.copyArray(
              hideItemArr,
              this.$refs.baseMap.chnTypeHideItemArr
            );
          });
        }
      });
      this.$refs.baseMap.mapView.filterByScanCol(
        this.scanColTypeArr,
        hideItemArr => {
          this.$refs.baseMap.snapColHideItemArr = this.$common.copyArray(
            hideItemArr,
            this.$refs.baseMap.snapColHideItemArr
          );
        }
      );
    },
  },
  watch: {},
  deactivated() {},
  destroyed() {}
};
</script>
<style lang="scss">
.def-main {
  .el-checkbox {
    display: flex;
    align-items: center;
    margin-top: 30px;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background: #26d39d;
  }
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background: #26d39d;
  }
  .el-checkbox__label {
    font-size: 16px;
    display: flex;
    align-items: center;
  }
  .el-checkbox__inner::after {
    border: 1px solid white !important;
    border-left: 0 !important;
    border-top: 0 !important;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.def-main {
  width: 100%;
  height: 100%;
  position: relative;
  .left-layer {
    position: absolute;
    width: 360px;
    height: 100%;
    overflow: auto;
    top: 0;
    left: 0;
    background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(0, 0, 0, 0.35) 98%
    );
    padding: 51px 28px 0 28px;
    box-sizing: border-box;
    .total {
      display: flex;
      align-items: center;
      justify-content: center;
      .total-num {
        font-family: "digital";
        color: #25d298;
        font-size: 68px;
      }
      .total-unit {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #dddddd;
        margin-left: 20px;
      }
    }
    .all-right {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #dddddd;
      display: flex;
      align-items: center;
      .option-line {
        border-radius: 2px;
        width: 16px;
        border: {
          width: 2px 0;
          style: solid;
        }
        margin-right: 4px;
      }
    }
    .box-item {
      display: flex;
      align-items: center;
      margin-left: 25px;
      .item-icon {
        opacity: 0.8;
        background: rgba(40, 255, 187, 0.1);
        border: 1px solid rgba(37, 210, 152, 0.3);
        border-radius: 3px;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .item-detail {
        margin-left: 20px;
        .item-num {
          font-family: "digital";
          font-size: 32px;
        }
        .item-type {
          margin-top: 10px;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #dddddd;
        }
      }
    }
  }
  .back-menu {
    position: absolute;
    width: 38px;
    height: 38px;
    top: 35px;
    left: 370px;
    background: rgba(85, 85, 85, 0.5);
    border-radius: 2px;
    padding: 11px;
    box-sizing: border-box;
  }
}
</style>
