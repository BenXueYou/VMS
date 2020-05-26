<template>
  <div class="CommunityBoardHomeRight"
       :style="`width: ${width}`">
    <img class="drag-right"
         src="@/assets/images/communityBoard/right_drag.png"
         v-if="isShowRightDrag"
         @click="clickRight" />
    <img class="drag-left"
         src="@/assets/images/communityBoard/scb_left_drop.png"
         v-else
         height="120px"
         @click="clickLeft" />
    <div class="rightboard">
      <div class="faceReListBox"
           v-show="isShowRightboard">
        <div class="top">
          <div class="tipsTag"
               @click="turnToPage('FaceManage', 'FaceHome')">人脸识别</div>
          <div class="tipsRight">
            <span class="numTxt">{{FRData.resident || 0}}</span>
            <span class="tipsTxt">居民</span>
            <span class="numTxt tipsRNumber">{{FRData.focus || 0}}</span>
            <span class="tipsTxt">重点关注</span>
          </div>
        </div>
        <div class="bodyBox">
          <div class="bodyCell"
               v-for="(item, index) in faceList"
               :key="index">
            <div class="imgBox">
              <el-image class="elImageClass"
                        :src="$common.setPictureShow(item.faceCapturePhotoUrl, 'facelog')"></el-image>
              <div v-if="item.type === 'focus'"
                   class="tipsIconClass"
                   style="color: #FF5F5F">{{'重点'}}</div>
              <div v-else-if="item.type === 'resident'"
                   class="tipsIconClass"
                   style="color: #17EDAC">{{'居民'}}</div>
              <div v-else-if="item.type === 'visitor'"
                   class="tipsIconClass"
                   style="color: #F7B500">{{'访客'}}</div>
              <div v-else-if="item.type === 'strange'"
                   class="tipsIconClass"
                   style="color: #F7B500">{{'路人'}}</div>
              <div v-else></div>
            </div>
            <div class="cellTxt">
              <div class="info-item">
                <img class="img"
                     src="@/assets/images/communityBoard/cmb_right_person_icon.png" />
                <span>{{$common.getCodeName(item.staffName)}}</span>
              </div>
              <div class="info-item">
                <img class="img"
                     src="@/assets/images/communityBoard/cmb_right_point@1x.png" />
                <span :title="item.channelName">{{item.channelName}}</span>
              </div>
              <div class="info-item">
                <img class="img"
                     src="@/assets/images/communityBoard/cmb_right_time.png" />
                <span :title="item.captureDatetime">{{item.captureDatetime.substr(11, 8)}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bayonetReListBox"
           v-show="isShowRightboard">
        <div class="top">
          <div class="tipsTag"
               @click="turnToPage('BayonetManage', 'bayonetPreview')">车辆通行</div>
          <div class="tipsRight"
               @mouseover="mymouseover"
               @mouseout="mymouseout"
               @mousemove="mymousemove">
            <span class="numTxt">{{BRData.registerVehicle || 0}}</span>
            <span class="tipsTxt">登记车</span>
            <span class="numTxt tipsYNumber">{{BRData.tempVehicle || 0}}</span>
            <span class="tipsTxt tipsTxt1">临时车</span>
          </div>
        </div>
        <div class="bayonetBodyBox">
          <div class="bayonetLeftBox">
            <div class="carImgBox">
              <el-image class="carImageClass"
                        :src="$common.setPictureShow(carList[0] ? carList[0].vehiclePic : '')"></el-image>
              <div v-if="!carList[0]"></div>
              <div v-else-if="carList[0].dataType === 'register'"
                   class="tipsIconClass"
                   style="color: #17EDAC">{{'登记车'}}</div>
              <div v-else-if="carList[0].dataType === 'temporary'"
                   class="tipsIconClass"
                   style="color: #F7B500">{{'临时车'}}</div>
              <div v-else></div>
              <el-image class="plateImageClass"
                        :src="$common.setPictureShow(carList[0] ? carList[0].vehicleNoPic : '')"></el-image>
            </div>
          </div>
          <div class="bayonetRightBox">
            <div class="cellTxt">
              <div class="info-item">
                <img class="img"
                     src="@/assets/images/communityBoard/cmb_right_person_icon.png" />
                <span>{{carList[0] ? (carList[0].dataType === 'temporary' ? '临时车' : $common.getCodeName(carList[0].staffName) ) : ""}}</span>
              </div>
              <div class="info-item">
                <img class="img imgIcon"
                     src="@/assets/images/communityBoard/build_house_car1x.png" />
                <span :title="carList[0] ? carList[0].vehicleNo : ''">{{carList[0] ? carList[0].vehicleNo : ""}}</span>
              </div>
              <div class="info-item">
                <img class="img"
                     src="@/assets/images/communityBoard/cmb_right_point@1x.png" />
                <span :title="carList[0] ? carList[0].channelName : ''">{{carList[0] ? carList[0].channelName : ""}}</span>
              </div>
              <div class="info-item">
                <img class="img"
                     src="@/assets/images/communityBoard/cmb_direction@1x.png" />
                <span>{{carList[0] ? carList[0].direction : ""}}</span>
              </div>
              <div class="info-item">
                <img class="img"
                     src="@/assets/images/communityBoard/cmb_right_time.png" />
                <span :title="carList[0] ? carList[0].createTime.substr(11, 8) : ''">{{carList[0] ? carList[0].createTime.substr(11, 8) : ""}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="doorReListBox"
           v-show="isShowRightboard">
        <div class="top">
          <div class="tipsTag"
               @click="turnToPage('DoorControl', 'DoorAccessRecord')">开门记录</div>
          <div class="tipsRight">
            <span class="numTxt">{{DRData.resident || 0}}</span>
            <span class="tipsTxt">居民</span>
            <span class="numTxt tipsYNumber">{{DRData.visitor || 0}}</span>
            <span class="tipsTxt">访客</span>
          </div>
        </div>
        <div class="bodyBox"
             style="margin-top:15px;margin-bottom:0px;">
          <div class="bodyCell"
               v-for="(item, index) in doorList"
               :key="index">
            <div class="imgBox">
              <el-image class="elImageClass"
                        :src="doorPictureShow(item)"></el-image>
              <div v-if="item.type === 'focus'"
                   class="tipsIconClass"
                   style="color: #FF5F5F">{{'重点'}}</div>
              <div v-if="item.type === 'resident'"
                   class="tipsIconClass"
                   style="color: #17EDAC">{{'居民'}}</div>
              <div v-if="item.type === 'visitor'"
                   class="tipsIconClass"
                   style="color: #F7B500">{{'访客'}}</div>
              <div v-else></div>
            </div>
            <div class="cellTxt">
              <div class="info-item">
                <img class="img"
                     src="@/assets/images/communityBoard/cmb_right_person_icon.png" />
                <span>{{$common.getCodeName(item.staffName)}}</span>
              </div>
              <div class="info-item">
                <img class="img"
                     src="@/assets/images/communityBoard/cmb_right_point@1x.png" />
                <span :title="item.doorName">{{item.doorName}}</span>
              </div>
              <div class="info-item">
                <img class="img"
                     src="@/assets/images/communityBoard/cmb_right_vertify@1x.png" />
                <span :title="$common.transferValidateType(item.validateType)">{{$common.transferValidateType(item.validateType)}}</span>
              </div>
              <div class="info-item">
                <img class="img"
                     src="@/assets/images/communityBoard/cmb_right_time.png" />
                <span :title="item.validateTime">{{item.validateTime.substr(11, 8)}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "../utils/home.js";
import * as faceApi from "@/pages/faceModule/http/logSearchHttp.js";
import * as carApi from "@/pages/bayonet/http/ajax.js";
import { mouseover, mouseout, mousemove } from "@/common/mouse.js"; // 注意路径
export default {
  name: "",
  props: {
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
    }
  },
  data() {
    return {
      FRData: {},
      BRData: {},
      DRData: {},
      width: "450px",
      isShowRightDrag: true,
      isShowRightboard: true,
      faceList: [],
      carList: [],
      doorList: [],
      isOneProject: false
      // interval: null
    };
  },
  activated() {
    // this.interval = setInterval(() => {
    //   this.initFRData();
    //   this.initBRData();
    //   this.initDRData();
    // }, 15000);
  },
  deactivated() {
    // clearInterval(this.interval);
  },
  mounted() {
    let projectType = this.$store.state.home.projectType || {};
    this.isOneProject = Boolean(projectType.platformLevel === "levelOne");
    this.searchData();
  },
  methods: {
    // 鼠标划过覆盖的hover弹窗事件
    mymouseover: event => {
      mouseover(event);
    },
    mymouseout(event) {
      mouseout(event);
    },
    mymousemove(event) {
      mousemove(event);
    },
    doorPictureShow(item) {
      let srcStr = "";
      if (this.$common.transferValidateType(item.validateType) === "刷脸") {
        srcStr = item.staffInfo ? item.staffInfo.openDoorUrl : "";
      } else {
        if (item.staffInfo && item.staffInfo.lifePictureUrl) {
          srcStr = item.staffInfo ? item.staffInfo.lifePictureUrl : "";
        } else if (item.staffInfo && item.staffInfo.idCardPictureUrl) {
          srcStr = item.staffInfo ? item.staffInfo.idCardPictureUrl : "";
        } else if (item.staffInfo && item.staffInfo.openDoorUrl) {
          srcStr = item.staffInfo ? item.staffInfo.openDoorUrl : "";
        }
      }
      return this.$common.setPictureShow(srcStr);
    },
    searchData() {
      if (!this.ShowAuthDisabled) return;
      this.initFRData();
      this.getPhotoRecordList(this.isOneProject);
      this.getCarList();
      this.initDRData();
      this.initBRData();
      this.getDoorList();
    },
    initFRData() {
      let data = {
        beginTime: this.$common.getStartTime(),
        endTime: `${this.$common.getStartTime().substr(0, 10)} 23:59:59`
      };
      api
        .getFaceRecoginizedDataApi(data)
        .then(res => {
          console.log(res.data.data);
          if (res.data.success) {
            this.FRData = res.data.data;
          }
        })
        .catch(() => {});
    },
    initBRData() {
      let data = {
        beginTime: this.$common.getStartTime(),
        endTime: `${this.$common.getStartTime().substr(0, 10)} 23:59:59`
      };
      api
        .getBayonetDataApi(data)
        .then(res => {
          if (res.data.success) {
            this.BRData = res.data.data;
          }
        })
        .catch(() => {});
    },
    initDRData() {
      let data = {
        beginTime: this.$common.getStartTime(),
        endTime: `${this.$common.getStartTime().substr(0, 10)} 23:59:59`
      };
      api
        .getDoorRecordDataApi(data)
        .then(res => {
          if (res.data.success) {
            this.DRData = res.data.data;
          }
        })
        .catch(() => {});
    },
    getPhotoRecordList(isOneProject) {
      this.faceList = []; // 清除记录
      var data = {
        page: 1,
        limit: 3,
        snapshotTimeStart: this.$common.getStartTime(),
        snapshotTimeEnd: this.$common.getCurrentTime()
      };
      // TODO zxd 根据上下级来进行不同的处理
      // this.isOneProject 为 true 为下级
      faceApi.getRecognizeListZxd(data).then(res => {
        if (res.data.success) {
          if (res.data.data && res.data.data.list) {
            this.faceList = res.data.data.list;
            this.faceList.forEach(v => {
              this.$set(v, "type", v.identity);
            });
          }
        } else {
          this.$message.warning(res.data.msg);
        }
      });
      // if (!isOneProject) {
      //   faceApi.getRecognizeListZxd(data).then(res => {
      //     if (res.data.success) {
      //       if (res.data.data && res.data.data.list) {
      //         this.faceList = res.data.data.list;
      //         this.faceList.forEach(v => {
      //           this.$set(v, "type", v.identity);
      //         });
      //       }
      //     } else {
      //       this.$message.warning(res.data.msg);
      //     }
      //   });
      // } else {
      //   faceApi.getRecognizeList(data).then(res => {
      //     if (res.data.success) {
      //       if (res.data.data && res.data.data.list) {
      //         this.faceList = res.data.data.list;
      //         this.faceList.forEach(v => {
      //           this.$set(v, "type", v.identity);
      //         });
      //       }
      //     } else {
      //       this.$message.warning(res.data.msg);
      //     }
      //   });
      // }
    },
    getCarList() {
      this.carList = [];
      carApi
        .getBayonetRecordList(
          {
            page: 1,
            limit: 1,
            startTime: this.$common.getStartTime(),
            endTime: this.$common.getCurrentTime(),
            order: "createTime",
            sort: "desc"
          },
          {
            modelName: "社区看板",
            type: "look",
            detailContent: "社区看板"
          }
        )
        .then(res => {
          if (res.data.success && res.data.data) {
            this.carList = res.data.data.list || [];
          }
        });
    },
    getDoorList() {
      this.$logSearchHttp
        .getDoorLog_zxd({
          validateTimeStart: this.$common.getStartTime(),
          validateTimeEnd: this.$common.getCurrentTime(),
          limit: 3,
          page: 1,
          order: "time",
          sort: "desc",
          openDoorResult: 0
        })
        .then(res => {
          if (res.data.data) {
            this.doorList = res.data.data.list;
            this.doorList.forEach(v => {
              this.$set(v, "type", v.identity);
            });
          }
        });
    },
    clickRight() {
      this.isShowRightDrag = !this.isShowRightDrag;
      this.width = "0px";
      this.isShowRightboard = false;
      this.$emit("dragPanel", "toRight");
    },
    clickLeft() {
      this.isShowRightDrag = !this.isShowRightDrag;
      this.width = "450px";
      this.isShowRightboard = true;
      this.$emit("dragPanel", "toLeft");
    },
    turnToPage(fatherName, name) {
      let menuArr = this.$store.state.home.routerData;
      menuArr[0].children.forEach(v => {
        if (v.name === fatherName) {
          if (
            !this.$store.state.home.tagViewArr.some(x => x.name === fatherName)
          ) {
            this.$store.dispatch("addTagViewItem", v);
          }
          this.$store.dispatch("setLocalTag", name);
          this.$bus.$emit("setLocalTag", name);
          this.$router.push({ name: name });
        }
      });
    }
  }
};
</script>
<style>
.tipsRight {
  width: 255px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}
</style>
<style lang="scss" scoped>
.CommunityBoardHomeRight {
  height: 100%;
  position: relative;
  .drag-right {
    position: absolute;
    top: 50%;
    right: 439px;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  .drag-left {
    position: absolute;
    top: 50%;
    right: -10px;
    transform: translate(-50%, -50%) rotate(180deg);
    cursor: pointer;
  }
  .rightboard {
    padding: 30px 25px;
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
    background-image: linear-gradient(
      to left,
      rgba(0, 0, 0, 0.95) 0%,
      rgba(0, 0, 0, 0.55) 98%
    );
    .doorReListBox,
    .bayonetReListBox,
    .faceReListBox {
      .top {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        padding-bottom: 3px;
        box-sizing: border-box;
        border-bottom: 1px solid rgba(37, 210, 152, 0.7);
        position: relative;
        .tipsTag {
          width: 150px;
          cursor: pointer;
          padding-left: 14px;
          box-sizing: border-box;
          line-height: 40px;
          font-family: PingFangSC-Medium;
          font-size: 22px;
          color: #ffffff;
          letter-spacing: 1.22px;
          text-align: justify;
          background: url("./../../../assets/images/communityBoard/arrowBg.png");
        }
        .tipsTxt {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #eeeeee;
          text-align: justify;
          vertical-align: super;
        }
        .numTxt {
          font-family: "digital";
          color: #17edac;
          font-size: 32px;
          margin-right: 10px;
          margin-left: 8px;
        }
        .tipsRNumber {
          color: #ff5f5f;
        }
        .tipsYNumber {
          color: #f7b500;
        }
      }
      .top:after {
        content: "";
        position: absolute;
        bottom: -3px;
        right: 3px;
        width: 5px;
        height: 5px;
        background: #26b383;
      }
      .bodyBox {
        display: flex;
        margin: 15px 0px 30px;
        height: 220px;
        .imgBox {
          width: 124px;
          height: 124px;
          margin-bottom: 9px;
          overflow: hidden;
          position: relative;
          .tipsIconClass {
            width: 60px;
            height: 20px;
            text-align: center;
            box-sizing: border-box;
            position: absolute;
            right: -15px;
            top: 5px;
            background-color: rgba(49, 61, 71, 0.6);
            transform: rotate(45deg);
            font-family: "PingFangSC-Regular";
            font-size: 12px;
          }
          .elImageClass {
            width: 100%;
            height: 100%;
          }
        }
        .bodyCell {
          .cellTxt {
            margin-bottom: 9px;
            opacity: 0.88;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #eeeeee;
            .info-item {
              width: 130px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              height: 26px;
              line-height: 26px;
              img {
                width: 14px;
              }
            }
          }
        }
      }
    }
    .bayonetBodyBox {
      width: 400px;
      height: 245px;
      margin-top: 10px;
      margin-bottom: 40px;
      display: flex;
      justify-content: flex-start;
      background: rgba(37, 210, 152, 0.06)
        url("./../../../assets/images/communityBoard/cmb_right_car_access_bg.png");
      border: 1px solid rgba(37, 210, 152, 0.3);
      box-shadow: inset 0 0 12px 0 rgba(37, 210, 152, 0.2);
      .bayonetLeftBox {
        width: 65%;
        height: 100%;
        padding: 20px 25px;
        box-sizing: border-box;
        .carImageClass {
          width: 100%;
          height: 65%;
        }
        .plateImageClass {
          width: 100%;
          height: 35%;
        }
        .carImgBox {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          .tipsIconClass {
            width: 60px;
            height: 20px;
            text-align: center;
            box-sizing: border-box;
            position: absolute;
            right: -15px;
            top: 5px;
            background-color: rgba(49, 61, 71, 0.6);
            transform: rotate(45deg);
            font-family: "PingFangSC-Regular";
            font-size: 12px;
          }
        }
      }
      .bayonetRightBox {
        width: 35%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 20px 20px 30px 0px;
        box-sizing: border-box;
        .cellTxt {
          margin-bottom: 9px;
          opacity: 0.88;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #eeeeee;
          .info-item {
            width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            height: 26px;
            line-height: 26px;
          }
          .imgIcon {
            width: 14px;
          }
        }
      }
    }
  }
}
</style>
