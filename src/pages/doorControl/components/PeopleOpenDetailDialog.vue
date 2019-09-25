<template>
  <el-dialog width="600px"
             title="详情信息"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <person-info-dialog :isShow="isShowPersonInfo"
                        :personItem="personItem"
                        @onCancel="onCancelInfoDialog" />
    <div class="dialog-content">
      <!--内容-->
      <div class="lock-info">
        <div class="info-pic">
          <template v-for="(item, index) in itemData.staffInfoGroup.staffGroupList">
            <div :key="index"
                 class="img-block"
                 @click="onClickPersonInfo(item)">
              <img :src="$common.setPictureShow(item.openDoorUrl)"
                   width="100%"
                   height="100%">
            </div>
          </template>
        </div>
        <div class="info-details">
          <div class="info-details-title">
            <img src="@/assets/images/calendar.png"
                 width="15px"
                 height="15px">
            <div class="info-details-title-text">开锁图片</div>
          </div>
          <div class="info-details-items">验证时间：{{$common.setStringText(itemData.validateTime)}}</div>
          <div class="info-details-items">验证方式：{{$common.getEnumItemName("pass", itemData.validateType)}}</div>
          <div class="info-details-items">验证地址：{{$common.setStringText(itemData.doorName)}}</div>
          <div class="info-details-items">验证设备：{{$common.setStringText(itemData.readHeadName)}}</div>
        </div>
      </div>
      <div class="person-info">
        <div class="info-details">
          <div class="info-details-title">
            <img src="@/assets/images/calendar.png"
                 width="15px"
                 height="15px">
            <div class="info-details-title-text">人员组信息</div>
          </div>
          <div class="info-details-items">人员组名称：{{$common.setStringText(itemData.staffInfoGroup.staffGroupName)}}</div>
          <div class="info-details-items">
            组内人员：
            <span style="color: #27F9B7;">{{groupStaffNames}}</span>
          </div>
        </div>
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
        for (let index in this.itemData.staffInfoGroup.staffGroupList) {
          if (parseInt(index) === 0) {
            this.groupStaffNames = this.itemData.staffInfoGroup.staffGroupList[index].staffName;
          } else {
            this.groupStaffNames =
              this.groupStaffNames +
              "、" +
              this.itemData.staffInfoGroup.staffGroupList[index].staffName;
          }
        }
      }
    }
  },
  destroyed() {}
};
</script>
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
  padding: 10px 30px;
  box-sizing: border-box;
  @mixin info-common($margin-bottom1, $margin-bottom2, $margin-left) {
    @include flexBlock(row);
    width: 100%;
    box-sizing: border-box;
    .info-pic {
      width: 280px;
      height: 145px;
      @include flexBlock(row);
      flex-wrap: wrap;
      .img-block {
        width: 30%;
        height: 80px;
        margin-right: 6px;
        margin-bottom: 5px;
        cursor: pointer;
      }
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
    .info-details {
      margin-left: $margin-left;
      @include flexBlock(column);
      .info-details-title {
        @include flexBlock(row);
        align-items: center;
        margin-bottom: $margin-bottom2;
        .info-details-title-text {
          margin-left: 10px;
          @include setFontStyle(14px, #ebecec);
        }
      }
      .info-details-items {
        @include setFontStyle(14px, #afafb0);
        margin-bottom: $margin-bottom1;
      }
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
  .lock-info {
    @include info-common(8px, 20px, 1%);
    border-width: 0 0 1px 0;
    border-style: dashed;
    border-color: #444749;
    padding: 20px 20px 38px 20px;
  }
  .person-info {
    @include info-common(5px, 20px, 0);
    padding: 28px 20px 28px 20px;
  }
}
</style>
