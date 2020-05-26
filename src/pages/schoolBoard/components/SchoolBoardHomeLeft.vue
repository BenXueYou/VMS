<template>
  <div class="SCBHomeLeft"
       :style="`margin-left:${leftLayer}px`">
    <div class="topBox">
      <div class="tipsBox">
        <img class="tipIcon"
             src="@/assets/images/SchoolBoard/scb_title_icon.png"
             alt />
        信息概览
      </div>
      <el-button @click="SwitchBtnAct">
        <img src="@/assets/images/SchoolBoard/scb_switch_icon.png"
             alt />
      </el-button>
    </div>
    <div class="digitCard">
      <div class="digitCardCell"
           v-for="(item,index) in digitCardArr"
           :key="index">
        <img class="tipIcon"
             :src="item.icon"
             alt
             srcset />
        <span class="tipsTxt">{{item.label}}</span>
        <span class="numberTxt"
              :style="`${item.numColor}`">{{item.value}}</span>
      </div>
    </div>
    <div class="topBox"
         style="margin-top:10px;">
      <div class="tipsBox">
        <img class="tipIcon"
             src="@/assets/images/SchoolBoard/scb_title_icon.png"
             alt />
        重点区域监控
      </div>
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
    <div class="videoCard"
         ref="videoCard"
         id="videoCardFullScreen">
      <video-box :fenluNumber="videoRadio"></video-box>
    </div>
    <div class="topBox"
         style="margin-top:10px;">
      <div class="tipsBox">
        <img class="tipIcon"
             src="@/assets/images/SchoolBoard/scb_title_icon.png"
             alt />
        在岗安保力量
      </div>
      <div @click="JumpFaculty"
           class="facultyBoxBtn cursorClass">共{{FacultyTotal}}人</div>
    </div>
    <div class="faucltyCardBox">
      <div class="faucltyCard"
           v-for="(item,index) in 4"
           :key="index">
        <el-image :src="FacultyArr.length>index?$common.setPictureShow(FacultyArr[index].staffPic):''">
          <div slot="error"
               class="image-slot">
            <img :src="$common.setPictureShow()"
                 alt="">
          </div>
        </el-image>
        <div class="tipsTxt">{{FacultyArr.length>index?FacultyArr[index].staffName : '姓名'}}</div>
        <div class="tipsTxt">{{FacultyArr.length>index?FacultyArr[index].phoneNumber:'电话号码'}}</div>
      </div>
    </div>
    <div class="topBox"
         style="margin-top:30px;">
      <div class="tipsBox">
        <img class="tipIcon"
             src="@/assets/images/SchoolBoard/scb_title_icon.png"
             alt />
        今日访客
      </div>
      <div class="facultyBoxBtn">共{{visitorTotal}}人</div>
    </div>
    <div class="visitorTableBox">
      <el-table :data="TableData"
                tooltip-effect="dark"
                class="CBTableBoxClass">
        <el-table-column prop="visitorName"
                         label="姓名"
                         width="95"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="staffName"
                         label="拜访人"
                         width="120"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="time"
                         label="拜访时间"
                         show-overflow-tooltip>
          <span slot-scope="scope">{{scope.row.time.slice(-8)}}</span>
        </el-table-column>
        <el-table-column prop="isSignOff"
                         label="是否签离"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.isSignOff?'是':'否'}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div @click="leftDropBtnAct"
         :style="`margin-left:${leftLayer}px`"
         class="SCBLeftDropClass cursorClass">
      <img v-if="leftLayer"
           src="@/assets/images/SchoolBoard/scb_left_drop.png"
           alt
           srcset />
      <img style="transform: rotate(-180deg)"
           v-else
           src="@/assets/images/SchoolBoard/scb_right_drop.png"
           alt
           srcset />
    </div>
  </div>
</template>
<script>
import videoBox from "@/pages/schoolBoard/components/videoBox";
export default {
  props: {},
  components: { videoBox },
  data() {
    return {
      forbidBtnArr: window.config.forbidBtnArr,
      signOffBtnArr: window.config.signOffBtnArr,
      visitorTotal: 0,
      digitCardArr: [
        {
          name: "student",
          label: "学生",
          icon: require("@/assets/images/SchoolBoard/scb_student_icon.png"),
          value: "0",
          numColor: "color:#F78B00"
        },
        {
          name: "teacher",
          label: "教职工",
          icon: require("@/assets/images/SchoolBoard/scb_faculty_icon.png"),
          value: "0",
          numColor: "color:#FFF856"
        },
        {
          name: "parents",
          label: "家长",
          icon: require("@/assets/images/SchoolBoard/scb_parents_icon.png"),
          value: "0",
          numColor: "color:#45F283"
        },
        {
          name: "security",
          label: "校园力量",
          icon: require("@/assets/images/SchoolBoard/scb_ensure_security.png"),
          value: "0",
          numColor: "color:#19F1E3"
        }
      ],
      videoRadio: 1,
      leftLayer: 0,
      FacultyArr: [],
      FacultyTotal: 0,
      TableData: [],
      sInt: null,
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {
    this.initData();
    if (!this.sInt) {
      this.sInt = setInterval(() => {
        this.initData();
      }, 10000);
    }
  },
  destroyed() {
    clearInterval(this.sInt);
    this.sInt = null;
  },
  deactivated() {
    if (!this.sInt) return;
    clearInterval(this.sInt);
    this.sInt = null;
  },
  mounted() {},
  methods: {
    initData() {
      this.httpQueryVisitor();
      this.httpQueryFaculty();
      this.httpQueryStaffData();
    },
    // 信息概览
    httpQueryStaffData() {
      this.$FacultyHttp
        .getSchoolStaffCategoryApi()
        .then(res => {
          if (res.data.success && res.data.data) {
            let digitCardObj = res.data.data || {};
            let digitCardList =
              JSON.parse(JSON.stringify(this.digitCardArr)) || [];
            this.digitCardArr = [];
            for (let i = 0, len = digitCardList.length; i < len; i++) {
              for (const key in digitCardObj) {
                if (digitCardList[i].name === key) {
                  digitCardList[i].value = digitCardObj[key];
                }
              }
            }
            this.digitCardArr = digitCardList;
          } else {
          }
        })
        .catch(err => {
          console.log(err);
          this.digitCardArr = [
            {
              name: "teacher",
              label: "学生",
              icon: require("@/assets/images/SchoolBoard/scb_student_icon.png"),
              value: "0",
              numColor: "color:#F78B00"
            },
            {
              name: "teacher",
              label: "教职工",
              icon: require("@/assets/images/SchoolBoard/scb_faculty_icon.png"),
              value: "0",
              numColor: "color:#FFF856"
            },
            {
              name: "parents",
              label: "家长",
              icon: require("@/assets/images/SchoolBoard/scb_parents_icon.png"),
              value: "0",
              numColor: "color:#45F283"
            },
            {
              name: "security",
              label: "校园力量",
              icon: require("@/assets/images/SchoolBoard/scb_ensure_security.png"),
              value: "0",
              numColor: "color:#19F1E3"
            }
          ];
        });
    },
    // 今日在岗安保力量
    httpQueryFaculty() {
      if (!this.ShowAuthDisabled) return;
      let data = {
        startTime: this.$common.getStartTime().split(" ")[0],
        endTime: this.$common.getCurrentTime().split(" ")[0],
        page: 1,
        limit: 4,
        sign: "1"
      };
      this.$FacultyHttp
        .getFacultyApi(data)
        .then(res => {
          this.FacultyTotal = 0;
          if (res.data.success && res.data.data) {
            // 判断数组是不是新增
            this.FacultyTotal = res.data.data.total;
            let FacultyList = res.data.data.list || [];
            if (!FacultyList.length) {
              return;
            }
            if (
              !this.FacultyArr.length ||
              FacultyList[0].staffUuid !== this.FacultyArr[0].staffUuid
            ) {
              // 按最早签到时间排序
              FacultyList.sort((a, b) => {
                return (
                  new Date(b.firstSign).getTime() -
                  new Date(a.firstSign).getTime()
                );
              });
              this.FacultyArr = FacultyList;
            }
          } else {
            this.FacultyArr = [];
          }
        })
        .catch(() => {
          this.FacultyArr = [];
          this.FacultyTotal = 0;
        });
    },
    // 今日访客记录的查询
    httpQueryVisitor() {
      if (!this.ShowAuthDisabled) return;
      var params = {
        limit: 5,
        page: 1,
        regDatetimeBegin: this.$common.getStartTime(),
        regDatetimeEnd: this.$common.getCurrentTime()
      };
      // 查询数据的接口函数
      this.$FacultyHttp
        .getTodayVisitorApi(params)
        .then(res => {
          this.showloading = false;
          if (res.data.success && res.data.data) {
            this.TableData = res.data.data.list || [];
            this.visitorTotal = res.data.data.total;
          } else {
            this.$message({ type: "error", message: "没有找到相关访客记录" });
          }
        })
        .catch(err => {
          this.showloading = false;
          console.error(err);
        });
    },
    justifyForbidBtnTxt(rowData) {
      // rowData.validDatetimeEnd
      let validDatetimeEnd = new Date(rowData.validDatetimeEnd).getTime();
      let currentDateTime = new Date().getTime();
      return currentDateTime < validDatetimeEnd;
    },
    // 全屏按钮
    fullScreenBtnAct() {
      let elem = document.getElementById("videoCardFullScreen");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    },
    // 左侧隐藏按钮
    leftDropBtnAct() {
      if (this.leftLayer) {
        this.leftLayer = 0;
        this.$emit("dragPanel", "toRight");
      } else {
        this.leftLayer = -450;
        this.$emit("dragPanel", "toLeft");
      }
      // this.leftLayer = this.leftLayer ? 0 : -450;
    },
    // 切换类型
    SwitchBtnAct() {
      this.$emit("SwitchBtnAct");
    },
    // 跳转在岗保安
    JumpFaculty() {
      this.$router.push({
        name: "FacultyList"
      });
    }
  },
  watch: {}
};
</script>
<style lang="scss">
.SCBHomeLeft {
  .SCBLeftDropClass {
    position: fixed;
    left: 450px;
    top: 50%;
    transform: translateY(-50%);
  }
  width: 450px;
  height: 100%;
  overflow-y: auto;
  font-family: "PingFangSC-Medium";
  font-size: 16px;
  color: #ffffff;
  letter-spacing: 0;
  background: rgba(0, 20, 18, 0.75);
  padding: 20px 25px 5px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  .topBox {
    background-image: linear-gradient(
      90deg,
      rgba(23, 237, 172, 0.2) 4%,
      rgba(23, 237, 172, 0.01) 90%
    );
    border-radius: 1px;
    display: flex;
    justify-content: space-between;
    .tipsBox {
      font-family: "PingFangSC-Medium";
      font-size: 16px;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 0;
      line-height: 35px;
      padding: 0 10px;
      img {
        vertical-align: middle;
      }
    }
    .tipIcon {
      margin-right: 9px;
    }
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
  }
  .digitCard {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    text-align: center;
    .digitCardCell {
      width: 82px;
      height: 116px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: rgba(11, 50, 46, 0.5);
      border-radius: 2px;
      margin: 20px auto;
      img {
        width: 27px;
        height: 32px;
        margin: 20px auto 5px;
      }
      .tipsTxt {
        opacity: 0.6;
        font-size: 10px;
        color: #f78b00;
      }
      .numberTxt {
        font-family: digital;
        font-size: 28px;
        margin-top: 10px;
      }
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
  .videoCard {
    width: 400px;
    height: 210px;
    margin-top: 18px;
  }
  .facultyBoxBtn {
    line-height: 34px;
    font-family: "PingFangSC-Regular";
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 0;
    text-align: right;
  }
  .faucltyCardBox {
    display: flex;
    justify-content: flex-start;
    .faucltyCard {
      width: 90px;
      background: rgba(11, 50, 46, 0.6);
      border-radius: 2px;
      margin: 18px auto 0;
      padding-bottom: 10px;
      box-sizing: border-box;
      .el-image {
        width: 90px;
        height: 90px;
        margin-bottom: 7px;
      }
      .tipsTxt {
        font-family: "PingFangSC-Regular";
        font-size: 10px;
        color: rgba(255, 255, 255, 0.8);
        margin-left: 9px;
      }
    }
  }
  .visitorTableBox {
    margin-top: 10px;
  }
}
</style>
