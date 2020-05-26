<template>
  <el-dialog width="520px"
             class="GlobalAlarmDialogClass"
             :visible.sync="isShow"
             @close="closeDialog"
             :title='"预警主题：" + dialogParamaPeopele.warningPlanSubject'
             v-dialogDrag>
    <audio :src="dialogParamaPeopele.sound"
           autoplay="autoplay"
           controls="controls"
           preload
           id="globalAlarmMusic"
           hidden></audio>
    <div class="dialog-content">
      <!--  <div class="lock-info">
        <div class="info-pic">
          <template>
            <div class="img-block">
              <img :src="$common.setPictureShow(dialogParamaPeopele.picture)">
            </div>
          </template>
        </div>
      </div> -->
      <div class="info-details">
        <div class="left">
          <div class="img-block">
            <img :src="$common.setPictureShow(dialogParamaPeopele.picture)">
          </div>
        </div>
        <div class="right">
          <div class="singleLine">预警人： {{dialogParamaPeopele.staffName}}</div>
          <div class="singleLine">监控位置： {{dialogParamaPeopele.doorName}}</div>
          <div class="singleLine">预警时间： {{dialogParamaPeopele.createTime}}</div>
          <div class="labelLine">
            <div class="leftLabel">人员标签： </div>
            <!--  <div class="placeLabel">{{dialogParamaPeopele.place}}</div>
              <div class="staffLabel">{{$common.getEnumItemName('staff_t',dialogParamaPeopele.staffType)}}</div> -->
            <div class="rightLabel">
              <div v-for="(item,index) in dialogParamaPeopele.tags"
                   :key="index"
                   class="staffLabel">
                {{item.tagName}}
              </div>
            </div>
          </div>
          <div class="singleLine">开门方式： {{$common.transferValidateType(dialogParamaPeopele.verificationMode)}}</div>
          <div class="singleLine">证件号： {{dialogParamaPeopele.credentialNo}}</div>
          <div class="singleLine">手机号： {{dialogParamaPeopele.contactInfo}}</div>
          <div class="singleLine">住址： {{dialogParamaPeopele.infrastructureUri}}</div>
          <div class="singleLine">预警原因： {{dialogParamaPeopele.warningPlanReason}}</div>
        </div>
      </div>
      <div class="btnWrap">
        <el-button @click="pauseAudio"
                   size="small"
                   type="primary">关闭预警声音</el-button>
        <el-button @click="closeDialog"
                   size="small"
                   type="primary">退出</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script type="text/javascript">
import RestApi from "@/utils/RestApi.js";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js";
// import * as api from "@/pages/faceModule/http/logSearchHttp.js";
export default {
  name: "GlobalAlarmDialog",
  props: {
    dialogParamaPeopele: {},
    dialogShow: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      shootPhotoList: [],
      staffInfo: {},
      taskInfo: {},
      imgSrc: "",
      isShow: true,
      imageHeader: RestApi.api.imageUrl,
      PicSourceType: window.config.PicSourceType,
      isCurrentShow: false,
      isShowPersonInfo: false,
      validateType: "",
      itemData: {
        doorUuid: "",
        doorName: "",
        direction: "",
        validateType: "",
        validateTypeName: "",
        staffType: "",
        staffName: "",
        validateTime: "",
        readHeadName: "",
        staffInfo: null,
        staffInfoGroup: {
          staffGroupName: "",
          staffGroupList: [
            {
              staffName: "",
              gender: "",
              adrees: "",
              idCard: null,
              nation: "",
              staffType: "",
              cellphone: "",
              remarks: "",
              idCardPictureUrl: "",
              openDoorUrl: "",
              mediumNo: null
            }
          ]
        }
      },
      personItem: {
        staffName: "",
        gender: "",
        adrees: "",
        idCard: null,
        nation: "",
        staffType: "",
        cellphone: "",
        remarks: "",
        idCardPictureUrl: "",
        openDoorUrl: "",
        mediumNo: null
      },
      groupStaffNames: ""
    };
  },
  watch: {
    dialogParamaPeopele: {
      handler: function(newVal, oldVal) {
        // this.staffInfo = newVal || {};
        // this.getRecoginizedList();
        // console.log("newVal==", newVal);
        // console.log("oldVal==", oldVal);
        let audio = document.getElementById("globalAlarmMusic");
        if (audio !== null) {
          audio.play();
        }
      },
      deep: true,
      immediate: true
    },
    dialogShow: {
      handler: function(val, oldVal) {
        this.isShow = val;
      },
      deep: true
    }
  },
  mounted: function(e) {
    // 父組件向子組件傳值
    console.log("dialogParamaPeopele------", this.dialogParamaPeopele);
    this.staffInfo = this.dialogParamaPeopele || {};
    // this.isShow = this.dialogParamaPeopele.showDialog;
    // this.getRecoginizedList();
  },
  activated: function() {
    console.log("刷新页面");
    let audio = document.getElementById("globalAlarmMusic");
    if (audio !== null) {
      audio.play();
    }
  },
  methods: {
    pauseAudio() {
      let audio = document.getElementById("globalAlarmMusic");
      if (audio !== null) {
        // if(audio.paused){
        // audio.play();// 播放
        // }else{
        // audio.pause();// 暂停
        // }
        audio.pause();
      }
    },
    muteMe(elem) {
      // elem.muted = true;
      elem.pause();
    },
    mutePage() {
      // document.querySelectorAll("video").forEach( video => muteMe(video) );
      document.querySelectorAll("audio").forEach(audio => this.muteMe(audio));
    },
    queryAct() {},
    // 查看视频
    preViewVideo() {
      this.$store.dispatch("addTagViewItem", {
        icon: "VideoPreview",
        name: "VideoPreview",
        title: "视频预览",
        type: "config",
        path: "/VideoPreview"
      });
      this.$store.dispatch("setLocalTag", "VideoPreview");
      this.$bus.$emit("setLocalTag", "VideoPreview");
      this.$router.push({
        path: "../VideoPreview",
        query: {
          dialogParamaPeopele: this.dialogParamaPeopele,
          channelUuid: this.dialogParamaPeopele.channelUuid
        }
      });
    },
    // 查看录像
    reviewVideo() {
      this.$store.dispatch("addTagViewItem", {
        icon: "VisitorManage",
        name: "VideoPlayback",
        title: "视频回放",
        type: "config",
        path: "/VideoPlayback"
      });
      this.$store.dispatch("setLocalTag", "VideoPlayback");
      this.$bus.$emit("setLocalTag", "VideoPlayback");
      this.$router.push({
        path: "../VideoPlayback",
        query: {
          dialogParamaPeopele: this.dialogParamaPeopele,
          channelUuid: this.dialogParamaPeopele.channelUuid,
          channelName: this.dialogParamaPeopele.channelName
        }
      });
    },
    closeAudio() {
      this.$emit("closeAudio");
    },
    // 查询识别记录
    getRecoginizedList() {
      // var data = {
      //   limit: 8, // int每页显示行数是
      //   page: 1, // int第几页是
      //   faceUuid: this.dialogParamaPeopele.faceUuid
      // };
      // api
      //   .getRecognizeInfo(data)
      //   .then(res => {
      //     if (res.data.success) {
      //       this.shootPhotoList = res.data.data.list;
      //     }
      //   })
      //   .catch(() => {});
    },
    clickImg(e) {
      this.$emit("cs", true);
      // 获取当前图片地址
      this.imgSrc = e.currentTarget.src;
    },
    mousedown(event) {
      this.selectElement = event.currentTarget;
      var div1 = this.selectElement.parentNode.parentNode.parentNode;
      this.selectElement.style.cursor = "move";
      this.isDowm = true;
      var distanceX = event.clientX - this.selectElement.offsetLeft;
      var distanceY = event.clientY - this.selectElement.offsetTop;
      document.onmousemove = function(ev) {
        var oevent = ev || event;
        div1.style.left = oevent.clientX - distanceX + "px";
        div1.style.top = oevent.clientY - distanceY + "px";
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
        div1.style.cursor = "default";
      };
    },
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
    closeDialog() {
      this.isShow = false;
      this.$emit("close");
    }
  }
};
</script>
<style type="text/css">
.GlobalAlarmDialog .cardBoxFooter {
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  color: #bbbbbb;
  letter-spacing: 0;
}
.GlobalAlarmDialogBodyClass {
  align-items: center;
  box-sizing: border-box;
  padding: 19px 20px 12px;
  background: rgba(0, 0, 0, 0.21);
  border-radius: 3px;
}
.GlobalAlarmDialogBodyClass p {
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  color: #bbbbbb;
}
.GlobalAlarmDialogBodyClass .leftColBg {
  background: rgba(33, 35, 37, 0.8);
  width: 139px;
  height: 139px;
}
.GlobalAlarmDialogBodyClass .leftColBg img {
  width: 100%;
  height: 100%;
}
.GlobalAlarmDialog .el-icon-caret-left:before {
  font-size: 25px;
  content: "\E60A";
}
.GlobalAlarmDialog .el-icon-caret-right:before {
  font-size: 25px;
  content: "\E60E";
}
.GlobalAlarmDialog .el-progress__text {
  font-size: 14px !important;
  color: #fff;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}
.GlobalAlarmDialog .textclipsClass {
  display: block;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 12px;
  font-family: "PingFangSC-Regular";
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0;
}
.GlobalAlarmDialogClass .el-dialog__header {
  padding: 0 25px;
  border-bottom: 1px solid rgba(40, 255, 187, 0.1);
  background-color: rgba(255, 0, 0, 0.1);
}
.GlobalAlarmDialogClass .el-dialog__header .el-dialog__title {
  border-left: 3px solid #fd545e;
}
.GlobalAlarmDialog .rightTxtBox {
  padding-left: 35px;
  height: 100%;
}
.GlobalAlarmDialog .rightTxtBox div {
  text-align: left;
  font-family: "PingFangSC-Regular";
  font-size: 12px !important;
  color: #bbbbbb;
  line-height: 27px;
}
.GlobalAlarmDialog .rightTxtBox .el-col {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 12px;
}
.firstTitle {
  text-align: left;
  font-size: 12px;
  color: #dddddd;
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.GlobalAlarmDialog .el-dialog__header {
  text-align: left;
  padding: 20px 20px 10px;
}
.GlobalAlarmDialog .el-progress-class {
  margin: 0 30px;
}
.GlobalAlarmDialog {
  text-align: center;
  width: 100%;
  height: calc(100% - 60px);
  padding: 0px 33px 30px 36px;
  box-sizing: border-box;
}
.colBoxClass::-webkit-scrollbar {
  display: none;
}
.GlobalAlarmDialog .dialog-footer {
  height: 480px;
  box-sizing: border-box;
  padding-bottom: 30px;
  border-top: 1px dashed rgba(102, 102, 102, 0.6);
  overflow: auto;
}
.GlobalAlarmDialog .dialog-footer .footerBox {
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.GlobalAlarmDialog .dialog-footer .cardBox {
  width: calc(50% - 18px);
  /* height: calc(50% - 20px); */
  margin-top: 15px;
  margin: 5px 7.5px 10px;
  background-color: rgba(33, 35, 37, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 10px 0;
  box-sizing: border-box;
}
.GlobalAlarmDialog .cardBox .el-image {
  width: 100%;
  height: 100%;
  position: relative;
  display: inline-block;
  overflow: hidden;
}
.GlobalAlarmDialog .cardBox .facePhoto {
  width: 139px;
  height: 139px;
}
.GlobalAlarmDialog .cardBox .panoramaPhoto {
  width: 248px;
  height: 139px;
}
.GlobalAlarmDialog .leftColBg .el-image .el-image-viewer__canvas img,
.GlobalAlarmDialog .cardBox .facePhoto .el-image .el-image-viewer__canvas img {
  width: auto;
  max-width: 100%;
  height: 100%;
}
.GlobalAlarmDialog .leftColBg .GlobalAlarmDialog-card-img.el-image {
  height: 100%;
}
.GlobalAlarmDialog .cardBox .facePhoto img,
.GlobalAlarmDialog .cardBox .panoramaPhoto img {
  width: 100%;
  height: 100%;
}
.cardBox .GlobalAlarmDialog-card-img {
  width: 139px;
  height: 139px;
  -webkit-background-size: cover;
  -webkit-background-origin: content;
  background-origin: content-box;
  background-size: cover;
  -webkit-background-origin: content;
  background-origin: content-box;
  background-clip: content-box;
}
.GlobalAlarmDialog .footerCardImg {
  width: 100%;
  height: 100%;
  -webkit-background-size: cover;
  background-origin: content;
  background-size: auto 100%;
  background-origin: content;
}
.GlobalAlarmDialog .operatorBoxClass {
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #dddddd;
  text-align: right;
  line-height: 35px;
  margin: 15px 0;
}
.GlobalAlarmDialog .operatorBoxClass .el-button {
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ffffff;
  text-align: justify;
  background: rgba(40, 255, 187, 0.08);
  border: 0 solid rgba(38, 211, 157, 0.8);
  border-radius: 2px;
  margin-left: 15px;
}
.GlobalAlarmDialog .footerTxtBox {
  border-left: 2px solid #28ffbb;
  text-align: left;
  font-family: "PingFangSC-Regular";
  font-size: 14px;
  color: #dddddd;
  padding-left: 8px;
}
.GlobalAlarmDialogClass.el-dialog__wrapper {
  overflow: auto;
}
</style>
<style scoped>
.info-details {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.info-details .singleLine {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ffffff;
  line-height: 33px;
}
.info-details .left {
  width: 205px;
  min-height: 320px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 30px;
  box-sizing: border-box;
}
.info-details .right {
  flex: 1;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.btnWrap {
  width: 100%;
  height: 30p;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
}
.info-details .labelLine {
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 30px;
}
.info-details .labelLine .leftLabel {
  /*  display: flex;
  flex-direction: row;
  align-items: center;*/
  width: 73px;
  height: auto;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ffffff;
  line-height: 33px;
}
.info-details .labelLine .rightLabel {
  flex: 1;
  height: auto;
}
.info-details .labelLine .rightLabel .staffLabel {
  float: left;
}
.info-details .labelLine .placeLabel {
  padding: 0 21px;
  height: 32px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #f7b500;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  background: url("./../../assets/images/placeLabel.png") no-repeat;
  background-position: center center;
  z-index: 2000;
  background-size: contain;
  float: left;
}
.info-details .labelLine .staffLabel {
  min-width: 70px;
  height: 32px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ff5f5f;
  text-align: justify;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: url("./../../assets/images/staffLabel.png") no-repeat;
  background-position: center center;
  z-index: 2000;
  background-size: contain;
}
</style>
<style lang="scss" scoped>
@mixin setFontStyle($fontsize, $color) {
  font-family: PingFangSC-Regular;
  font-size: $fontsize;
  color: $color;
  letter-spacing: 1px;
}
@mixin flexBlock($direction) {
  display: flex;
  flex-direction: $direction;
}
.dialog-content {
  width: 520px;
  min-height: 380px;
  padding-bottom: 15px;
  box-sizing: border-box;
  @mixin info-common($margin-bottom1, $margin-bottom2, $margin-left) {
    @include flexBlock(row);
    width: 100%;
    box-sizing: border-box;
    .info-pic {
      width: 680px;
      height: 360px;
      @include flexBlock(row);
      flex-wrap: wrap;
      .FRelPopoverCol {
        width: 28px;
        height: 28px;
        font-size: 12px;
        color: rgb(159, 157, 153);
        cursor: pointer;
        text-align: center;
        margin-top: -32px;
        text-align: right;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 14px;
        margin-left: 52px;
        padding: 8px;
        box-sizing: border-box;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .ImgBox {
        width: 100%;
        height: 100%;
      }
    }
  }
  .lock-info {
    @include info-common(8px, 20px, 1%);
    // border-width: 0 0 1px 0;
    // border-style: dashed;
    // border-color: #444749;
    // padding: 20px 20px 38px 20px;
  }
  .info-details {
    width: 100%;
    height: min-320px;
    .img-block {
      width: 158px;
      height: 280px;
      // margin-right: 6px;
      // margin-bottom: 5px;
      cursor: pointer;
      img {
        width: 158px;
        height: 280px;
      }
    }
    // margin-left: $margin-left;
    // @include flexBlock(column);
    // .info-details-title {
    //   @include flexBlock(row);
    //   align-items: center;
    //   margin-bottom: $margin-bottom2;
    //   .info-details-title-text {
    //     margin-left: 10px;
    //     @include setFontStyle(14px, #ebecec);
    //   }
    // }
    // .info-details-items {
    //   @include setFontStyle(14px, #afafb0);
    //   margin-bottom: $margin-bottom1;
    // }
    // &:last-child {
    //   margin-bottom: 0px;
    // }
  }
  .person-info {
    @include info-common(5px, 20px, 0);
    padding: 28px 20px 28px 20px;
  }
}
</style>
