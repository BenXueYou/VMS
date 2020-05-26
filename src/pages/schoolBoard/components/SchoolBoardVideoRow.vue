<template>
  <div class="SCBVideoRow">
    <div class="videoBox"
         id="videoCardFullScreen">
      <video-box :fenluNumber="videoRadio"></video-box>
    </div>
    <div class="rowBox">
      <div class="FacultyBox flex-st">
        <div class="leftTips"
             @click="JumpFaculty">在岗安保</div>
        <div class="facultyCardBox flex-st">
          <div v-for="(item,index) in  6"
               class="facultyCard"
               :key="index">
            <el-image :src="FacultyData.length>index?$common.setPictureShow(FacultyData[index].staffPic):''">
              <div slot="error"
                   class="image-slot">
                <img :src="$common.setPictureShow()"
                     alt="">
              </div>
            </el-image>
            <div class="tipsTxt">{{FacultyData.length>index?FacultyData[index].staffName:'姓名'}}</div>
            <div class="tipsTxt">{{FacultyData.length>index?FacultyData[index].phoneNumber: '电话号码'}}</div>
          </div>
        </div>
      </div>
      <div class="MegaTempBox flex-st">
        <div class="leftTips">高温预警</div>
        <div class="flex-st">
          <div v-for="(item,index) in  2"
               class="MegaTempCard flex-st"
               :key="index">
            <el-image :src="(MegaTempData.length>index) && (MegaTempData[index].extInfo)?$common.setPictureShow(MegaTempData[index].extInfo.snapPhotoUrl):''">
              <div slot="error"
                   class="image-slot">
                <img :src="$common.setPictureShow()"
                     alt="">
              </div>
            </el-image>
            <div class="tipsTxtBox flex-col-sd">
              <div class="tipsTxt stressTxt">
                <span class="stressTxtLeft">{{ '陌生人'}}</span>
                <span class="stressTxtRight">{{MegaTempData.length>index ?$common.getEnumItemName("alarm_r", MegaTempData[index].dealState)  : '未处理'}}</span>
              </div>
              <div class="tipsTxt stressTxt">
                <img src="@/assets/images/SchoolBoard/scb_temperature_gray.png"
                     alt
                     srcset />
                {{MegaTempData.length>index && MegaTempData[index].extInfo? MegaTempData[index].extInfo.temperature.toFixed(1) : '0'}}℃
              </div>
              <div class="tipsTxt">
                <img src="@/assets/images/SchoolBoard/scb_camera_gray.png"
                     alt
                     srcset />
                {{MegaTempData.length>index?MegaTempData[index].resName : '通道名称'}}
              </div>
              <div class="tipsTxt">
                <img src="@/assets/images/SchoolBoard/time_clock_icon.png"
                     alt
                     srcset />
                {{MegaTempData.length>index?MegaTempData[index].alarmTime : '抓拍时间'}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button @click="SwitchBtnAct">
        <img src="@/assets/images/SchoolBoard/scb_switch_icon.png"
             alt />
      </el-button>
      <div class="rightBoxBtn">
        <el-radio-group v-model="videoRadio">
          <el-radio-button :label="1">1</el-radio-button>
          <el-radio-button :label="4">4</el-radio-button>
          <el-radio-button :label="9">9</el-radio-button>
        </el-radio-group>
        <el-button @click="fullScreenBtnAct">
          <img src="@/assets/images/SchoolBoard/scb_screen_btn.png"
               alt />
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import videoBox from "./videoBox";
export default {
  props: {},
  components: { videoBox },
  data() {
    return {
      videoRadio: 1,
      FacultyData: [],
      MegaTempData: [],
      sInt: null
    };
  },
  created() {
    this.sInt = this.initData();
    if (!this.sInt) {
      this.sInt = setInterval(() => {
        this.initData();
      }, 10000);
    }
  },
  mount() {},
  destroyed() {
    clearInterval(this.sInt);
    this.sInt = null;
  },
  deactivated() {
    console.log("SCNHomeVideo -- deactivated");
    if (!this.sInt) return;
    clearInterval(this.sInt);
    this.sInt = null;
  },
  methods: {
    // 跳转在岗保安
    JumpFaculty() {
      this.$router.push({
        name: "FacultyList"
      });
    },
    initData() {
      this.initFacultyData();
      this.initMegaTempData();
    },
    initFacultyData() {
      let data = {
        startTime: this.$common.getStartTime(),
        endTime: this.$common.getCurrentTime(),
        page: 1,
        limit: 6,
        sign: "1"
      };
      this.$FacultyHttp
        .getFacultyApi(data)
        .then(res => {
          if (res.data.success && res.data.data) {
            let FacultyList = res.data.data.list || [];
            if (!FacultyList.length) {
              return;
            }
            if (
              !this.FacultyData.length ||
              FacultyList[0].staffUuid !== this.FacultyData[0].staffUuid
            ) {
              this.FacultyData = FacultyList;
              console.log(this.FacultyData);
            }
          } else {
            this.FacultyData = [];
          }
        })
        .catch(err => {
          console.log(err);
          this.FacultyData = [];
        });
    },
    initMegaTempData() {
      // this.MegaTempData = [];
      this.$logSearchHttp
        .getAlarmLog({
          currentPage: 1,
          pageSize: 2,
          beginTime: this.$common.getStartTime(),
          buessinessType: "VIDEO",
          endTime: this.$common.getCurrentTime(),
          subtype: "body_temp_abnormal"
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            let MegaTempData = res.data.data.list || [];
            if (!MegaTempData) {
              return;
            }
            if (
              !this.MegaTempData.length ||
              MegaTempData[0].alarmUuid !== this.MegaTempData[0].alarmUuid
            ) {
              this.MegaTempData = MegaTempData;
            }
          } else {
            this.MegaTempData = [];
          }
        })
        .catch(err => {
          console.error(err);
          this.MegaTempData = [];
        });
    },
    fullScreenBtnAct() {
      let elem = document.getElementById("videoCardFullScreen");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    },
    SwitchBtnAct() {
      this.$emit("SwitchBtnAct");
    }
  },
  watch: {}
};
</script>
<style lang="scss">
.SCBVideoRow {
  width: calc(100% - 450px);
  height: calc(100% - 4px);
  overflow-y: auto;
  .flex-st {
    display: flex;
    justify-content: flex-start;
  }
  .videoBox {
    width: 100%;
    height: 820px;
  }
  .rowBox {
    width: 100%;
    overflow-x: auto;
    height: 140px;
    display: flex;
    justify-content: space-between;
    margin-top: 18px;
    .leftTips {
      width: 32px;
      background: rgba(23, 237, 172, 0.25);
      border: 1px solid rgba(23, 237, 172, 0.4);
      border-radius: 3px;
      font-family: "PingFangSC-Regular";
      font-size: 14px;
      color: #00d8a0;
      letter-spacing: 0;
      text-align: right;
      padding: 35px 9px 0;
      box-sizing: border-box;
      margin-right: 8px;
    }
    .FacultyBox {
      height: 100%;
      padding-left: 10px;
      box-sizing: border-box;
      .facultyCard {
        border-radius: 3px;
        background: rgba(11, 50, 46, 0.75);
        margin: 0 6px;
        padding: 10px;
        box-sizing: border-box;
        .el-image {
          width: 92px;
          height: 92px;
        }
        .tipsTxt {
          font-family: "PingFangSC-Regular";
          font-size: 10px;
          color: #dddddd;
          text-align: center;
        }
      }
    }
    .MegaTempBox {
      width: 697px;
      height: 100%;
      .leftTips {
        color: #ff5f5f;
        background: rgba(255, 95, 95, 0.25);
        border: 1px solid rgba(255, 95, 95, 0.4);
        margin-left: 15px;
      }
      .MegaTempCard {
        width: 300px;
        background: rgba(60, 21, 21, 0.6);
        border-radius: 2px;
        padding: 20px 15px;
        box-sizing: border-box;
        margin-right: 10px;
        .el-image {
          width: 100px;
          height: 100px;
        }
        .tipsTxt {
          font-family: "PingFangSC-Regular";
          font-size: 12px;
          color: #dddddd;
          text-align: justify;
          line-height: 17px;
          img {
            margin-right: 6px;
          }
        }
        .tipsTxtBox {
          padding-left: 15px;
          .stressTxt {
            color: #ff5f5f;
            .stressTxtLeft {
              font-size: 14px;
              margin-right: 15px;
            }
          }
        }
        .flex-col-sd {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }
      }
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    height: 48px;
    padding: 10px 13px 0;
    box-sizing: border-box;
    .el-button {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 2px;
      padding: 0px 6px;
      height: 26px;
      margin: auto 0;
      border: 0;
      img {
        width: 14px;
        height: 12px;
      }
    }
    .rightBoxBtn {
      .el-radio-button__inner {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 1px;
        border: 0px;
        font-family: "PingFangSC-Regular";
        font-size: 14px;
        color: #3fd8b0;
        text-align: justify;
        margin-left: 5px;
        margin-top: 4px;
        padding: 6px 9px;
      }
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background: rgba(38, 179, 131, 0.3);
        border: 1px solid rgba(38, 211, 157, 0.7);
        border-radius: 1px;
        padding: 5px 8px;
        font-size: 14px;
        color: #3fd8b0;
      }
      .el-button {
        vertical-align: bottom;
      }
    }
  }
}
</style>
