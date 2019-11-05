<template>
  <div class="companion-main">
    <div class="main-container">
      <div class="select-box">
        <div class="picture">
          <div class="face-img"
               @click="onClickTurnToGetFace">
            <div class="avatar">
              <img v-if="!$route.query.imgObj"
                   src="@/assets/images/addImg2.png"
                   class="ovo-card-img add-icon" />
              <i v-if="!$route.query.imgObj"
                 class="el-icon-circle-plus-outline font-color">添加图片</i>
              <img v-if="$route.query.imgObj"
                   :src="$common.setPictureShow($route.query.imgObj.faceCapturePhotoUrl, 'facelog')"
                   style="width: 100%; height: 100%" />
            </div>
          </div>
          <!-- <pic-upload @image-file="getImageFile" /> -->
        </div>
        <div class="input">
          <div class="line-one">
            <span class="topTitleTxt">时段：</span>
            <el-date-picker v-model="startTime"
                            type="datetime"
                            style="width: 190px"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <span class="timeText">—</span>
            <el-date-picker v-model="endTime"
                            type="datetime"
                            style="width: 190px"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <span class="topTitleTxt left-space">抓拍设备：</span>
            <elPopverTree :elPopoverClass="faceRecordPopoverClass"
                          @transferCheckedChannel="transferCheckedChannel"
                          :defaultCheckedChannel="checkedChannelKeys"
                          inputWidth="230px"></elPopverTree>
            <span class="topTitleTxt left-space">抓拍时间间隔：</span>
            <el-input v-model="captureInterval"
                      style="width: 60px"
                      type="number"></el-input>
            <span class="timeText">秒</span>
            <div class="search-btn">
              <el-button @click="queryAct"
                         type="primary"
                         size="small"
                         icon="el-icon-search">开始搜索</el-button>
              <el-button @click="resetParams"
                         type="primary"
                         size="small">重置</el-button>
            </div>
          </div>
          <div class="line-two">
            <span class="topTitleTxt">同行次数不小于：</span>
            <el-input v-model="travelTogetherFrequency"
                      class="time-interal"
                      type="number"></el-input>
            <span class="timeText">次</span>
            <span class="topTitleTxt left-space">共同出现的摄像头个数不小于：</span>
            <el-input v-model="travelTogetherChannel"
                      class="time-interal"
                      type="number"></el-input>
            <span class="timeText">个</span>
          </div>
        </div>
      </div>
      <div class="content-box">
        <div class="title">
          <img src="@/assets/images/person_fellow.png"
               width="16.8px"
               height="12.6px" />
          <span class="title-text">同行人分析结果</span>
        </div>
        <el-scrollbar style="height: 90%;transition:0.2s"
                      v-loading="isLoading">
          <template v-for="(item, index) in fellowItemData">
            <fellow-item :key="index"
                         :item="item" />
            <div class="split-line"
                 v-if="fellowItemData && fellowItemData.length > 1 && index !== fellowItemData.length-1"
                 :key="item.name"></div>
          </template>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
// import PicUpload from "@/common/PicUpload";
import FellowItem from "@/pages/faceModule/views/companion/view/FellowItem";
import ElPopverTree from "@/pages/faceModule/components/ElPopverTree";

export default {
  components: {
    // PicUpload,
    FellowItem,
    ElPopverTree
  },
  props: {},
  data() {
    return {
      startTime: "",
      endTime: "",
      deviceList: [],
      faceUuid: "",
      fellowItemData: [],
      faceRecordPopoverClass: "companionPopoverClass",
      channelUuids: [],
      captureInterval: 2,
      travelTogetherFrequency: 2,
      travelTogetherChannel: 2,
      isLoading: false,
      checkedChannelKeys: []
    };
  },
  created() {},
  mounted() {
    this.initData();
    // this.queryAct();
  },
  methods: {
    initData() {
      // this.faceUuid = "752ca559f1cc4733a9e0b9da59764787";
      this.startTime = this.$common.formatDate(
        new Date(new Date().getTime() - 1 * 60 * 60 * 1000)
      );
      this.endTime = this.$common.formatDate(new Date());
    },
    queryAct() {
      if (!this.$route.query.imgObj) {
        this.$cToast.warn("请添加图片");
      } else {
        this.getCompanionList();
      }
    },
    onClickTurnToGetFace() {
      this.$router.push("/FaceManage/FaceRecord");
    },
    transferCheckedChannel(checkedChannel) {
      this.channelUuids = [];
      for (let i = 0; i < checkedChannel.length; i++) {
        this.channelUuids.push(checkedChannel[i].channelUuid);
      }
    },
    getCompanionList() {
      this.isLoading = true;
      this.$factTragicHttp
        .getCompanionList({
          faceUuid: this.$route.query.imgObj.faceUuid,
          channelUuids: this.channelUuids ? this.channelUuids.join(",") : "",
          startTime: this.startTime,
          endTime: this.endTime,
          captureInterval: this.captureInterval,
          travelTogetherFrequency: this.travelTogetherFrequency,
          travelTogetherChannel: this.travelTogetherChannel
        })
        .then(res => {
          let body = res.data;
          this.getCompanionListSuccess(body);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getCompanionListSuccess(body) {
      this.fellowItemData = body.data;
      if (body.data.length === 0) {
        this.$cToast.success("暂无同行人分析记录！");
      }
    },
    resetData() {
      this.fellowItemData = [];
      // this.initData();
    },
    resetParams() {
      this.initData();
      this.captureInterval = 2;
      this.travelTogetherFrequency = 2;
      this.travelTogetherChannel = 2;
      this.$nextTick(() => {
        this.channelUuids = [];
        this.checkedChannelKeys = [];
      });
    }
  },
  watch: {},
  destroyed() {},
  activated() {
    this.resetData();
    // if (this.$route.query.imgObj) {
    //   this.$nextTick(() => {
    //     this.checkedChannelKeys.push(this.$route.query.imgObj.channelUuid);
    //     console.log("this.checkedChannelKeys: ", this.checkedChannelKeys);
    //   });
    // }
  }
};
</script>

<style>
.companionPopoverClass {
  width: 500px;
  height: 230px;
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
  padding: 1.6%;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .main-container {
    padding: 1% 3%;
    box-sizing: border-box;
    background: #212325;
    width: 100%;
    height: 100%;
    .select-box {
      height: 165px;
      border: {
        width: 0 0 1px 0;
        style: dashed;
        color: rgba($color: #ffffff, $alpha: 0.2);
      }
      display: flex;
      .picture {
        display: flex;
        align-content: center;
        align-items: center;
        justify-content: center;
        .face-img {
          width: 100px;
          height: 125px;
          cursor: pointer;
          border: 1px dashed #3c3f42;
          position: relative;
          background-color: rgb(27, 30, 33);
          padding: 4px;
          box-sizing: border-box;
        }
      }
      .input {
        margin-left: 2%;
        height: 100%;
        width: 95%;
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
            margin-right: 0;
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
      height: calc(100% - 165px);
      border-radius: 3px;
      .title {
        display: flex;
        align-items: center;
        height: 60px;
        .title-text {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #ffffff;
          margin-left: 20px;
        }
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
.left-space {
  margin-left: 5%;
}
.split-line {
  width: 100%;
  border-color: #303336;
  border-width: 0 0 2px 0;
  border-style: dashed;
  margin: 15px 0 25px 0;
}
.avatar {
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
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
  color: #20735c;
}
.font-color {
  margin-top: 20%;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #20735c;
  text-align: right;
}
</style>
