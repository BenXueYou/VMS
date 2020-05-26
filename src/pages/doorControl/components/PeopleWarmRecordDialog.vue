<template>
  <el-dialog width="520px"
             :title='"预警主题：" + itemData.warningPlanSubject'
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false"
             class="PeopleWarmRecordDialog">
    <div class="dialog-content">
      <!-- <div class="lock-info">
        <div class="info-pic">
          <template>
            <div
                 class="img-block"
                 @click="onClickPersonInfo(item)">
              <img :src="$common.setPictureShow(itemData.picture)">
            </div>
          </template>
        </div>
      </div> -->
      <div class="info-details">
        <div class="left">
          <div class="img-block"
               @click="onClickPersonInfo(item)">
            <img :src="$common.setPictureShow(itemData.picture)">
          </div>
        </div>
        <div class="right">
          <div class="singleLine">预警人： {{itemData.staffName}}</div>
          <div class="singleLine">监控位置： {{itemData.doorName}}</div>
          <div class="singleLine">预警时间： {{itemData.createTime}}</div>
          <div class="labelLine">
            <div class="leftLabel">人员标签： </div>
            <div class="rightLabel">
              <div v-for="(item,index) in itemData.tags"
                   class="staffLabel"
                   :key="index">
                {{item.tagName}}
              </div>
            </div>
          </div>
          <div class="singleLine">开门方式： {{$common.transferValidateType(itemData.verificationMode)}}</div>
          <div class="singleLine">证件号： {{itemData.credentialNo}}</div>
          <div class="singleLine">手机号： {{itemData.contactInfo}}</div>
          <div class="singleLine">住址： {{itemData.infrastructureUri}}</div>
          <div class="singleLine">预警原因： {{itemData.warningPlanReason}}</div>
        </div>
      </div>
      <div class="btnWrap">
        <!-- <el-button
         @click="queryAct"
         size="small"
         type="primary">关闭预警声音</el-button> -->
        <el-button style="width: 80px;"
                   @click="isCurrentShow=false"
                   size="small"
                   type="primary">退出</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import PersonInfoDialog from "@/pages/doorControl/components/PersonInfoDialog";

export default {
  components: {
    PersonInfoDialog
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
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
  created() {},
  mounted() {},
  methods: {
    queryAct() {},
    onClickCancel() {
      this.$emit("onCancel");
    },
    onClickPersonInfo(item) {
      this.isShowPersonInfo = true;
      this.personItem = this.$common.copyObject(item, this.personItem);
    },
    onCancelInfoDialog() {
      this.isShowPersonInfo = false;
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
      if (val) {
        console.log("详情====", this.itemData);
        // for (let index in this.itemData.staffInfoGroup.staffGroupList) {
        //   if (parseInt(index) === 0) {
        //     this.groupStaffNames = this.itemData.staffInfoGroup.staffGroupList[
        //       index
        //     ].staffName;
        //   } else {
        //     this.groupStaffNames =
        //       this.groupStaffNames +
        //       "、" +
        //       this.itemData.staffInfoGroup.staffGroupList[index].staffName;
        //   }
        // }
      }
    }
  },
  destroyed() {}
};
</script>
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
  height: 320px;
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
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
}
.info-details .labelLine {
  display: flex;
  flex-direction: row;
  align-items: center;
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
  background: url("./../../../assets/images/placeLabel.png") no-repeat;
  background-position: center center;
  z-index: 2000;
  background-size: contain;
}
.info-details .labelLine .staffLabel {
  width: 70px;
  height: 32px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ff5f5f;
  text-align: justify;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: url("./../../../assets/images/staffLabel.png") no-repeat;
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
  // padding: 25px 40px 0 40px;
  box-sizing: border-box;
  padding-bottom: 15px;
  @mixin info-common($margin-bottom1, $margin-bottom2, $margin-left) {
    @include flexBlock(row);
    width: 100%;
    box-sizing: border-box;
    .info-pic {
      width: 520px;
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
    min-height: 320px;
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
  }
  .person-info {
    @include info-common(5px, 20px, 0);
    padding: 28px 20px 28px 20px;
  }
}
</style>
