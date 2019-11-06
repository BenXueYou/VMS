<template>
  <div class="companion-main">
    <div class="main-container">
      <div class="select-box">
        <pic-upload @addImage="addImage"
                    :imageUrl="imageUrl"
                    height="125px" />
        <div class="input">
          <div class="line-one">
            <span class="topTitleTxt">检索时间：</span>
            <el-date-picker v-model="startTime"
                            type="datetime"
                            style="width: 14%; margin-left: 5px"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <span class="line">—</span>
            <el-date-picker v-model="endTime"
                            type="datetime"
                            style="width: 14%"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <el-radio-group v-model="selectDate"
                            @change="selectDateAct"
                            style="margin-left: 20px;">
              <el-radio-button label="today">今天</el-radio-button>
              <el-radio-button label="lastday">昨天</el-radio-button>
              <el-radio-button label="thisWeek">本周</el-radio-button>
              <el-radio-button label="thisMonth">本月</el-radio-button>
            </el-radio-group>
            <span class="topTitleTxt left-space">抓拍设备：</span>
            <elPopverTree :elPopoverClass="faceRecordPopoverClass"
                          @transferCheckedChannel="transferCheckedChannel"
                          :isCheckedAll="true"
                          inputWidth="200px"></elPopverTree>
            <span class="topTitleTxt left-space">对比库：</span>
            <el-radio-group v-model="libraryType"
                            @change="handleTypeChange"
                            style="margin: 4px 0 0 0.5%;">
              <template v-for="(item, index) in libraryTypeOption">
                <el-radio :label="item.typeStr"
                          :key="index">{{item.typeName}}</el-radio>
              </template>
            </el-radio-group>
          </div>
          <div class="line-two">
            <span class="topTitleTxt">相似度不低于：</span>
            <el-input v-model="travelTogetherFrequency"
                      class="time-interal"
                      type="number"></el-input>
            <span class="timeText">%</span>
            <span class="topTitleTxt left-space">搜索结果显示前：</span>
            <el-input v-model="travelTogetherChannel"
                      class="time-interal"
                      type="number"></el-input>
            <span class="timeText">个</span>
            <el-button @click="queryAct"
                       type="primary"
                       size="small"
                       class="left-space"
                       icon="el-icon-search">开始搜索</el-button>
            <el-button @click="queryAct"
                       type="primary"
                       size="small">重置</el-button>
          </div>
        </div>
      </div>
      <div class="content-box"
           id="allmap">
      </div>
    </div>
  </div>
</template>

<script>
import PicUpload from "@/common/PicUpload";
import FellowItem from "@/pages/faceModule/views/companion/view/FellowItem";
import ElPopverTree from "@/pages/faceModule/components/ElPopverTree";

export default {
  components: {
    PicUpload,
    FellowItem,
    ElPopverTree
  },
  props: {},
  data() {
    return {
      selectDate: "",
      startTime: "",
      endTime: "",
      faceUuid: "",
      fellowItemData: [],
      faceRecordPopoverClass: "companionPopoverClass",
      channelUuids: "",
      travelTogetherFrequency: 80,
      travelTogetherChannel: 2,
      isLoading: false,
      checkedChannelKeys: [],
      libraryType: "systemFaceLib,staticFaceLib,dynamicFaceLib",
      libraryTypeOption: [],
      imageUrl: "",
    };
  },
  created() {},
  mounted() {
    this.initData();
    // this.queryAct();
  },
  methods: {
    addImage(picBaseUrl) {
      console.log(picBaseUrl);
    },
    selectDateAct(dateStr) {
      let day = new Date();
      switch (dateStr) {
        case "lastday":
          day.setDate(day.getDate() - 1);
          let str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          this.startTime = str + " " + "00:00:00";
          this.endTime = str + " " + "23:59:59";
          break;
        case "today":
          str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          this.startTime = str + " " + "00:00:00";
          this.endTime = str + " " + "23:59:59";
          break;
        case "thisWeek":
          let weekday = day.getDay();
          let today = day.getDate();
          let month = day.getMonth();
          let firstDay = null;
          // month默认从0开始，则判断不是月初，则月份+1
          if (today - weekday) {
            month += 1;
            firstDay = today - weekday;
          } else {
            // 月初 则向前退weekday - today天
            // 判断 月大 月小
            let lastMonthDays =
              [1, 3, 5, 7, 8, 10, 12].indexOf(month + 1) > -1 ? 31 : 30;
            firstDay = lastMonthDays - weekday + today;
          }
          let firstdate = new Date(day.getFullYear(), month - 1, firstDay);
          firstdate = this.$common.timestampToFormatter(
            firstdate,
            "yyyy-mm-dd"
          );
          let enddate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          );
          enddate = this.$common.timestampToFormatter(enddate, "yyyy-mm-dd");
          this.startTime = firstdate + " " + "00:00:00";
          this.endTime = enddate + " " + "23:59:59";
          break;
        case "thisMonth":
          day.setDate(1);
          firstdate = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          enddate = this.$common.timestampToFormatter(
            new Date().getTime(),
            "yyyy-mm-dd"
          );
          this.startTime = firstdate + " " + "00:00:00";
          this.endTime = enddate + " " + "23:59:59";
          break;
      }
    },
    handleTypeChange() {},
    initData() {
      this.startTime = this.$common.formatDate(
        new Date(new Date().getTime() - 1 * 60 * 60 * 1000)
      );
      this.endTime = this.$common.formatDate(new Date());
      this.libraryTypeOption = this.$common.getEnumByGroupStr(
        "face_h5_lib_group_type"
      );
      // eslint-disable-next-line no-undef
      let map = new BMap.Map("allmap");
      map.centerAndZoom("上海", 15);
    },
    queryAct() {
      if (!this.$route.query.imgObj) {
        this.$cToast.warn("请添加图片");
      } else {
        this.getCompanionList();
      }
    },
    onClickTurnToGetFace() {
      this.$router.push("/FaceRecord");
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
          channelUuids: this.channelUuids,
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
    getCompanionListSuccess(data) {
      this.fellowItemData = data.body.data;
      if (data.body.data.length === 0) {
        this.$cToast.success("暂无同行人分析记录！");
      }
    },
    resetData() {
      this.fellowItemData = [];
      this.initData();
    }
  },
  watch: {},
  destroyed() {},
  activated() {
    this.resetData();
    this.checkedChannelKeys = [];
    this.channelUuids = [];
    if (this.$route.query.imgObj) {
      this.imageUrl = this.$route.query.imgObj.faceCapturePhotoUrl;
    }
  }
};
</script>

<style lang="scss">
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
.companion-main {
  .el-radio-button__inner {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    width: 50px;
    margin-right: 9px;
    border: 0;
    padding: 8px 10px;
    font-size: 13px;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border: 0;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background: rgba(40, 255, 187, 0.1);
    border-radius: 2px;
    border-radius: 2px;
    border: 0;
    box-shadow: 0px 0 0 0 #26d39d;
  }
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
    background: #212325;
    width: 100%;
    height: 100%;
    .select-box {
      height: 165px;
      padding: 1% 3%;
      box-sizing: border-box;
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
  margin-left: 3%;
}
.split-line {
  width: 95%;
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
.line {
  color: rgba($color: #ffffff, $alpha: 0.15);
  margin: 0 2px;
}
</style>
