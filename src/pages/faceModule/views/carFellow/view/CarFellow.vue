<template>
  <div class="companion-main">
    <car-fellow-detail-dialog :isShow="isShow"
                              :carFellowDetailList="carFellowDetailList"
                              @onCancel="onCancelDialog"/>
    <div class="select-box">
      <div class="picture">
        <div class="face-img"
             @click="onClickTurnToGetFace">
          <div class="avatar">
            <img v-if="!$route.query.imgObj"
                 src="@/assets/images/addImg2.png"
                 class="ovo-card-img add-icon">
            <i v-if="!$route.query.imgObj"
               class="el-icon-circle-plus-outline font-color">添加图片</i>
            <img v-if="$route.query.imgObj"
                 :src="$common.setPictureShow($route.query.imgObj.photouri)"
                 style="width: 100%; height: 100%">
          </div>
        </div>
      </div>
      <div class="input">
        <div class="line-one">
          <span class="topTitleTxt"> 时段：</span>
          <el-date-picker v-model="startTime"
                          type="datetime"
                          style="margin-left: 28px;"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          <span class="timeText">至</span>
          <el-date-picker v-model="endTime"
                          type="datetime"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          <el-button class="search-btn"
                     @click="queryAct"
                     type="primary">开始搜索</el-button>
        </div>
        <div class="line-two">
          <span class='topTitleTxt'>抓拍设备：</span>
          <elPopverTree :channelInfoList="deviceList"
                        :elPopoverClass="faceRecordPopoverClass"
                        @transferCheckedChannel="transferCheckedChannel"
                        inputWidth="200px"
                        @show="popverShow"
                        @hide="popverHidden">
          </elPopverTree>
        </div>
      </div>
    </div>
    <div class="content-box">
      <div class="title">
        <img src="@/assets/images/carflow.png"
             width="16.8px"
             height="12.6px">
        <span class="title-text">同车人分析结果</span>
      </div>
      <el-scrollbar style="height: 90%" v-loading="isLoading">
        <template v-for="(item, index) in fellowItemData">
          <car-fellow-item :key="index"
                           :item="item"
                           @onClickOpenDetail="onClickOpenDetail"/>
          <div class="split-line"
               v-if="fellowItemData && fellowItemData.length > 1 && index !== fellowItemData.length-1"
               :key="item.name"></div>
        </template>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import CarFellowItem from "@/pages/faceModule/views/carFellow/view/CarFellowItem";
import CarFellowDetailDialog from "@/pages/faceModule/views/carFellow/view/CarFellowDetailDialog";
import ElPopverTree from "@/pages/faceModule/components/ElPopverTree";

export default {
  components: {
    CarFellowItem,
    CarFellowDetailDialog,
    ElPopverTree
  },
  props: {},
  data() {
    return {
      isShow: false,
      startTime: "",
      endTime: "",
      interalVal: 1,
      imageFile: "",
      fellowItemData: [],
      deviceList: [],
      faceRecordPopoverClass: "faceRecordPopoverClass",
      channelList: [],
      isLoading: false,
      vehicleuuid: "",
      staffuuid: "",
      size: 20,
      carFellowDetailList: []
    };
  },
  created() {},
  mounted() {
    this.initData();
    // this.queryAct();
  },
  methods: {
    initData() {
      // this.staffuuid = "752ca559f1cc4733a9e0b9da59764787";
      this.startTime = this.$common.formatDate(
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      );
      this.endTime = this.$common.formatDate(new Date());
      console.log("this.$route.query: ", this.$route.query);
    },
    selectvisiblechange() {},
    selectChange() {},
    queryAct() {
      if (!this.$route.query.imgObj) {
        this.$cToast.warn("请添加图片");
      } else {
        this.getCarFellowList();
      }
    },
    getImageFile(val) {
      this.imageFile = val;
    },
    onCancelDialog() {
      this.isShow = false;
    },
    onClickOpenDetail(vehicleuuid) {
      this.isShow = true;
      this.vehicleuuid = vehicleuuid;
      this.getCarFellowListDetails();
    },
    onClickTurnToGetFace() {
      this.$router.push("/FaceRecord");
    },
    getDeviceList() {
      var deviceList = this.$store.getters.getDeviceList;
      this.deviceList = deviceList;
    },
    transferCheckedChannel(checkedChannel) {
      this.channelList = [];
      for (var i = 0; i < checkedChannel.length; i++) {
        this.channelList.push(checkedChannel[i].id);
      }
    },
    popverShow() {},
    popverHidden() {},
    getCarFellowList() {
      /* if (this.channelList.length === 0) {
        this.$cToast.warn("请先选择抓拍设备！");
        return;
      } */
      this.isLoading = true;
      this.$carFellowRequest.getCarFellowList({
        staffuuid: this.$route.query.imgObj.staffuuid,
        channelList: this.channelList.toString(),
        startTime: this.startTime,
        endTime: this.endTime,
        onResult: (isSuccess, data) => {
          if (isSuccess && data) {
            this.handleGetCarFellowListSuccessResponse(data);
          } else {
            console.log("获取同车人分析列表失败！");
          }
        }
      });
    },
    handleGetCarFellowListSuccessResponse(data) {
      this.fellowItemData = data.body.data;
      this.isLoading = false;
      if (!data.body.data) {
        this.$cToast.success(data.body.msg);
      }
    },
    getCarFellowListDetails() {
      this.$carFellowRequest.getCarFellowListDetails({
        vehicleuuid: this.vehicleuuid,
        size: this.size,
        onResult: (isSuccess, data) => {
          if (isSuccess && data) {
            this.handleGetCarFellowListDetailsSuccessResponse(data);
          } else {
            console.log("获取同车人分析列表详情失败！");
            this.isLoading = false;
          }
        }
      });
    },
    handleGetCarFellowListDetailsSuccessResponse(data) {
      this.carFellowDetailList = data.body.data;
    },
    resetData() {
      this.fellowItemData = [];
      this.carFellowDetailList = [];
      this.initData();
    }
  },
  watch: {},
  destroyed() {},
  activated() {
    this.getDeviceList();
    this.resetData();
  }
};
</script>

<style>
.faceRecordPopoverClass {
  width: 50%;
  height: 45%;
  position: absolute;
  background: #202127;
  min-width: 150px;
  border: 1px solid #ebeef5;
  padding: 12px;
  z-index: 2000;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-height: 80%;
  overflow: auto;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.companion-main {
  width: 100%;
  height: 100%;
  padding: 2% 2.5% 1% 2.5%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  $bg-color: #202326;
  .select-box {
    height: 20%;
    background: $bg-color;
    border-radius: 3px;
    margin-bottom: 1.5%;
    display: flex;
    .picture {
      width: 10%;
      display: flex;
      align-content: center;
      align-items: center;
      justify-content: center;
      .face-img {
        width: 100px;
        height: 125px;
        cursor: pointer;
        border: 1px dashed #3C3F42;
        position: relative;
        background-color: rgb(27, 30, 33);
        padding: 4px;
        box-sizing: border-box;
      }
    }
    .input {
      width: 90%;
      height: 100%;
      .line-one {
        width: 100%;
        height: 50%;
        margin-top: 10px;
        display: flex;
        direction: row;
        align-items: center;
        .dev-select {
          width: 18%;
        }
        .search-btn {
          margin-left: auto;
          margin-right: 3%;
        }
      }
      .line-two {
        margin-top: -20px;
        height: 50%;
        display: flex;
        height: 50%;
        display: flex;
        direction: row;
        align-items: center;
        .time-interal {
          width: 6%;
        }
      }
    }
  }
  .content-box {
    height: 77%;
    background: $bg-color;
    border-radius: 3px;
    padding-left: 20px;
    box-sizing: border-box;
    .title {
      display: flex;
      align-items: center;
      height: 8%;
      .title-text {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #ffffff;
        margin-left: 20px;
      }
    }
  }
}
.timeText {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #888888;
  width: 28px;
}
.topTitleTxt {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #cccccc;
}
.avatar {
  width: 100%;
  height: 100%;
  position: relative;
}
.clearImageIcon {
  position: absolute;
  right: 3px;
  top: 6px;
  z-index: 99;
  color: #efefef;
  width: 28px;
  height: 28px;
  background-color: rgba(17, 17, 17, 0.6);
  padding-top: 5px;
  box-sizing: border-box;
  border-radius: 19px;
}
.ovo-card-img {
  margin-top: 22%;
  vertical-align: middle;
  width: 55%;
  height: 45px;
  color: #20735C;
}
.font-color {
  margin-top: 20%;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #20735C;
  text-align: right;
}
.split-line {
  width: 95%;
  border-color: #303336;
  border-width: 0 0 2px 0;
  border-style: dashed;
  margin: 15px 0 25px 0;
}
</style>
