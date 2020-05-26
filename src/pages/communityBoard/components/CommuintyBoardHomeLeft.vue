<template>
  <div class="CommunityBoardHomeLeft"
       :style="`width: ${width}`">
    <img class="drag-left"
         src="@/assets/images/communityBoard/left_drag.png"
         v-if="isShowLeftDrag"
         @click="clickLeft" />
    <img class="drag-right"
         src="@/assets/images/communityBoard/scb_left_drop.png"
         v-else
         height="120px"
         @click="clickRight" />
    <div class="leftboard"
         v-show="isShowLeftboard">
      <div class="oneItem">
        <div class="boardTitle">
          <div class="titleBg">一标六实</div>
        </div>
        <div class="itemBox">
          <one-six></one-six>
        </div>
      </div>
      <div class="oneItem">
        <div class="boardTitle">
          <div class="titleBg"
               :style="`background: url(${require('@/assets/images/communityBoard/arrow_bg2.png')})`">重点区域监控</div>
          <div class="titleBtn">
            <el-radio-group v-model="videoScreenRadio">
              <el-radio-button :label="1"></el-radio-button>
              <el-radio-button :label="4"></el-radio-button>
              <el-radio-button :label="9"></el-radio-button>
            </el-radio-group>
            <el-button @click="fulleScreen"
                       style="height: 24px; width: 24px; padding: 0px; text-align: center;line-height: 24px;">
              <img src="@/assets/images/communityBoard/all_screen_1.png"
                   alt
                   srcset />
            </el-button>
          </div>
        </div>
        <div class="videoBox">
          <div ref="videoBoxWrap"
               style='width:100%;height:211px;'>
            <video-box :isOneProject='isOneProject'
                       :fenluNumber="videoScreenRadio"
                       :ShowAuthDisabled="ShowAuthDisabled"
                       :OwnAuthDisabled="OwnAuthDisabled"
                       ref='videoBox'></video-box>
          </div>
        </div>
      </div>
      <div class="oneItem">
        <div class="boardTitle">
          <div class="titleBg" @click="turnToPage('FaceManage', 'faceAlarm')">警情事件</div>
          <div class="CBAlarmNumberBox">
            {{alarmTotal}}
            <span>未处理</span>
          </div>
        </div>
        <div style="margin-top:10px;">
          <el-table ref="CBAlarmTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    class="CBTableBoxClass"
                    @selection-change="handleSelectionChange">
            <el-table-column prop="alarmType"
                             label="事件类型"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                {{$common.getEnumItemName("alarm_t", scope.row.subType)}}
              </template>
            </el-table-column>
            <el-table-column prop="resName"
                             label="报警源"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="alarmTime"
                             label="时间"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.alarmTime.substr(11, 8)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dealStatus"
                             label="处理状态"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <span :style="scope.row.dealState === 'to_be_processed' ? 'color: #FF5F5F' : ''">
                  {{$common.getEnumItemName("alarm_r", scope.row.dealState)}}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import oneSix from "@/pages/communityBoard/components/oneSix";
import videoBox from "@/pages/communityBoard/components/videoBox";

export default {
  name: "CommunityBoardHomeLeft",
  components: {
    oneSix,
    videoBox
  },
  data() {
    return {
      isOneProject: false,
      videoScreenRadio: 1,
      data: {},
      alarmTotal: 0,
      tableData: [],
      isShowLeftDrag: true,
      width: "450px",
      isShowLeftboard: true,
      // interval: null,
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  activated() {
    // this.interval = setInterval(() => {
    //   this.initAlarmData();
    // }, 20000);
  },
  deactivated() {
    // clearInterval(this.interval);
  },
  mounted() {
    this.projectType = this.$store.state.home.projectType || {};
    this.isOneProject = Boolean(this.projectType.platformLevel === "levelOne");
    if (this.isOneProject) {
      this.ShowAuthDisabled = this.$common.getAuthIsOwn("社区看板", "isShow");
      this.OwnAuthDisabled = this.$common.getAuthIsOwn("社区看板", "isOwn");
    } else {
      this.ShowAuthDisabled = this.$common.getAuthIsOwn("居委看板", "isShow");
      this.OwnAuthDisabled = this.$common.getAuthIsOwn("居委看板", "isOwn");
    }
    this.initAlarmData();
  },
  methods: {
    turnToPage(fatherName, name) {
      // if (this.$store.state.home.projectType.platformType === "neighborhood") {
      //   return;
      // }
      if (this.$store.state.home.projectType.platformLevel === "levelOne") {
        return;
      }
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
    },
    setFullScreen(target) {
      if (target.requestFullscreen) {
        target.requestFullscreen();
      }
      if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen();
      }
      if (target.mozRequestFullScreen) {
        target.mozRequestFullScreen();
      }
      if (target.msRequestFullscreen) {
        target.msRequestFullscreen();
      }
    },
    fulleScreen() {
      this.setFullScreen(this.$refs.videoBoxWrap);
      console.log(this.$refs.videoBox.initDom);
      setTimeout(() => {
        this.$refs.videoBox.initDom();
      }, 310);
    },
    initAlarmData() {
      this.alarmTotal = 0;
      this.tableData = [];
      this.$logSearchHttp
        .getAlarmLog({
          pageSize: 4,
          beginTime: this.$common.getStartTime(),
          endTime: this.$common.getDayEndTime(),
          buessinessType: "IAC",
          currentPage: 1
        })
        .then(res => {
          this.tableData = res.data.data.list || [];
        });
      this.$logSearchHttp
        .getAlarmLog({
          pageSize: 1,
          beginTime: this.$common.getStartTime(),
          endTime: this.$common.getDayEndTime(),
          currentPage: 1,
          buessinessType: "IAC",
          dealState: "to_be_processed"
        })
        .then(res => {
          this.alarmTotal = res.data.data.total || 0;
        });
    },
    handleSelectionChange() {},
    clickLeft() {
      this.isShowLeftDrag = !this.isShowLeftDrag;
      this.width = "0px";
      this.isShowLeftboard = false;
      this.$emit("dragPanel", "toLeft");
    },
    clickRight() {
      this.isShowLeftDrag = !this.isShowLeftDrag;
      this.width = "450px";
      this.isShowLeftboard = true;
      this.$emit("dragPanel", "toRight");
    }
  }
};
</script>
<style>
.CommunityBoardHomeLeft .el-table th {
  border-right: 0px dashed rgba(255, 255, 255, 0.12) !important;
}
.CommunityBoardHomeLeft .el-table__body-wrapper {
  overflow: hidden;
  position: relative;
  background: rgba(37, 210, 152, 0.09);
}
.CommunityBoardHomeLeft .el-table__header-wrapper {
  margin-bottom: 5px;
}
.CommunityBoardHomeLeft .el-table thead {
  background: rgba(37, 210, 152, 0.09);
}

.CommunityBoardHomeLeft .el-radio-button__inner {
  padding: 0px;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid rgba(38, 211, 157, 0.3);
  border-radius: 1px !important;
  margin-right: 5px;
  height: 24px;
  color: #dddddd !important;
  width: 24px;
  text-align: center;
  line-height: 24px;
}
.CommunityBoardHomeLeft
  .el-radio-button__orig-radio:checked
  + .el-radio-button__inner {
  color: #ffffff;
  background-color: rgba(38, 179, 131, 0.3);
  border: 1px solid #26d39d !important;
}
.CommunityBoardHomeLeft .el-button--default,
.CommunityBoardHomeLeft .el-button--default:hover,
.CommunityBoardHomeLeft .el-button--default:active,
.CommunityBoardHomeLeft .el-button--default:focus {
  font-family: "PingFangSC-Regular";
  font-size: 16px;
  height: 38px;
  border: 1px #424445 solid;
  background: transparent;
}
.CommunityBoardHomeLeft .titleBtn .el-button {
  border: 1px solid rgba(38, 211, 157, 0.3);
  padding: 10px 12px;
  vertical-align: middle;
  border-radius: 1px;
}
.CommunityBoardHomeLeft
  .titleBtn
  .el-radio-button:first-child
  .el-radio-button__inner {
  border-radius: 1px !important;
  border: 1px solid rgba(37, 210, 152, 0.3);
}
</style>
<style lang="scss" scoped>
.CommunityBoardHomeLeft {
  height: 100%;
  position: relative;
  .drag-left {
    position: absolute;
    top: 50%;
    left: 461px;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  .drag-right {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  .leftboard {
    height: 100%;
    overflow-y: auto;
    width: 450px;
    padding: 25px 25px;
    box-sizing: border-box;
    background-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.95) 0%,
      rgba(0, 0, 0, 0.55) 98%
    );
    .itemBox {
      padding: 10px 0 30px 12px;
    }
    .oneItem {
      .videoBox {
        height: 240px;
        width: 400px;
        margin-top: 15px;
        margin-bottom: 30px;
        padding: 12px;
        box-sizing: border-box;
        background: url("../../../assets/images/communityBoard/video_bg.png");
        background-size: cover;
      }
    }
  }
  .boardTitle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(37, 210, 152, 0.7);
    height: 40px;
    padding: 5px 0;
    // box-sizing: border-box;
    &::after {
      content: "";
      position: absolute;
      bottom: -3px;
      right: 3px;
      width: 5px;
      height: 5px;
      background: #26b383;
    }
    .titleBg {
      padding: 5px 40px 5px 12px;
      font-family: "PingFangSC-Medium";
      font-size: 22px;
      color: #ffffff;
      letter-spacing: 1.1px;
      text-align: justify;
      background: url("../../../assets/images/communityBoard/arrowBg.png")
        no-repeat;
      background-size: cover;
      line-height: 30px;
    }
    .CBAlarmNumberBox {
      color: #ff5f5f;
      font-family: "digital";
      margin-right: 10px;
      font-size: 32px;
      span {
        font-family: "PingFangSC-Regular";
        font-size: 16px;
        color: #eeeeee;
        text-align: justify;
        vertical-align: middle;
      }
    }
  }
}
</style>
