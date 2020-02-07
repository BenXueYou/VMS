<template>
  <el-dialog :title="title"
             :width="width"
             class="BlacklistDetail"
             :visible.sync="dialogVisible"
             :before-close="close">
    <div class="body">
      <div class="body_box"
           style="border-top:0px;">
        <el-row type="flex"
                justify="flex-start"
                :gutter="20">
          <el-col style="text-align:right;"
                  :span="6">
            <p>姓名：</p>
            <p>性别：</p>
            <p>证件号：</p>
            <p>手机号：</p>
            <p>车牌号：</p>
          </el-col>
          <el-col :span="9">
            <p>{{defaultRow.blacklistName}}</p>
            <p>{{$common.getEnumItemName("gender", defaultRow.gender)}}</p>
            <p>{{defaultRow.credentialNo}}</p>
            <p>{{defaultRow.phoneNo}}</p>
            <p>{{defaultRow.plateNo}}</p>
          </el-col>
          <el-col style="text-align:right;margin-right:-15px;"
                  :span="6">
            <div v-if="showImg"
                 class="imgBox">
              <img :src="defaultRow.certificatePhotoUri? imageUrl+defaultRow.certificatePhotoUri : require('@/assets/images/user.png')"
                   alt
                   srcset />
            </div>
          </el-col>
          <el-col style="text-align:right;"
                  :span="6">
            <div class="imgBox">
              <img :src="defaultRow.snapPhotoUri? imageUrl+defaultRow.snapPhotoUri : require('@/assets/images/user.png')"
                   alt
                   srcset />
            </div>
            <p style="text-align:center">
              <span class="activeFontClass"
                    @click="showImg = !showImg">查看证件照</span>
            </p>
          </el-col>
        </el-row>
        <el-row type="flex"
                justify="flex-start"
                :gutter="20">
          <el-col style="text-align:right;"
                  :span="6">
            <p>访客单位：</p>
            <p>拉黑时间：</p>
            <p>黑名单来源：</p>
            <p>拉黑原因：</p>
          </el-col>
          <el-col :span="14">
            <p>{{defaultRow.company}}</p>
            <p>{{defaultRow.blockDatetime}}</p>
            <p>{{$common.getEnumItemName("blacklistSource", defaultRow.source)}}</p>
            <p>{{$common.getEnumItemName("blacklist_trigger_reason", defaultRow.reason)}}</p>
          </el-col>
        </el-row>
      </div>
      <div class="body_box">
        <el-row type="flex"
                justify="flex-start"
                :gutter="20">
          <el-col style="text-align:right;"
                  :span="6">
            <p>黑名单报警记录：</p>
          </el-col>
          <el-col :span="19">
            <p v-for="(item,index) in defaultRow.alarmList"
               :key="index"
               @click="transferVistorRecord(item)">
              <span class="activeFontClass">{{item.alarmTime}}</span>
              <span class="activeFontClass">{{item.extInfo.deviceName}}</span>
            </p>
          </el-col>
        </el-row>
      </div>
    </div>
    <div slot="footer"
         class="dialogHeaderClass">
      <el-row type="flex"
              justify="flex-start">
        <el-col :span="12"></el-col>
        <el-col :span="12">
          <el-button @click="addToWhitelisttAct"
                     :disabled="!OwnAuthDisabled"
                     type="primary">解除拉黑</el-button>
          <el-button @click="close"
                     type="primary">关闭</el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import icons from "@/common/icon.js";
import tagView from "@/common/Tag.vue";
import RestApi from "@/utils/RestApi.js";
import * as api from "../../utils/ajax";
export default {
  components: { tagView },
  props: {
    width: {
      type: String,
      default() {
        return "580px";
      }
    },
    OwnAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return "黑名单访客详情";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    },
    defaultRow: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      showImg: false,
      countryOptions: window.config.options,
      countryOption: "",
      maritalOptions: window.config.options,
      maritalOption: "",
      nationOption: "",
      nationOptions: window.config.options,
      educationOptions: window.config.options,
      educationOption: "",
      checkedNodeName: "",
      inputWidth: "30%",
      visible_popver: false,
      checkeTreedNodes: [],
      dynamicTags: [],
      myHeaders: {},
      updateFileImage: "",
      icons,
      dialogVisible: false,
      radioGender: "男",
      phoneNumber: "",
      name: "",
      radioDate: "",
      startTime: "",
      endTime: "",
      ResidentPopoverClass: "ResidentPopoverClass",
      treeData: window.config.treeData,
      defaultProps: {
        label: "label",
        children: "children"
      },
      filterText: "",
      certificateOptions: window.config.options,
      certificateOption: "",
      imageUrl: RestApi.api.imageUrl
    };
  },
  mounted() {
    this.dialogVisible = this.visible;
    this.name = this.value;
    this.checkeTreedNodes = this.dynamicTags;
  },
  methods: {
    transferVistorRecord(data) {
      // 跳转到黑名单报警记录
      this.$router.push({
        name: "VistorBlacklistAlarm",
        params: { data: this.defaultRow }
      });
      this.close();
    },
    // 添加到黑名单
    addToWhitelisttAct() {
      if (!this.OwnAuthDisabled) {
        return;
      }
      this.$confirm(
        `<span style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;">是否确认移出 ？</span>`,
        "",
        {
          confirmButtonText: "否",
          cancelButtonText: "是",
          distinguishCancelAndClose: true,
          confirmButtonClass: "confirm-button",
          cancelButtonClass: "cancel-button",
          center: true,
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          this.$message({ type: "info", message: "取消删除" });
        })
        .catch(action => {
          if (action === "cancel") {
            api
              .deleteBlacklistUrl({
                blacklistUuid: this.defaultRow.blacklistUuid
              })
              .then(res => {
                if (res.data.success) {
                  this.$message.success("删除成功！");
                  this.$emit("close", "addToWhitelisttAct");
                } else {
                  this.$message.console.error(res.data.msg);
                }
              });
          }
        });
    },
    // 关闭
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.name = this.value;
      }
      this.dialogVisible = this.visible;
      this.dynamicTags = [];
      console.log(val, this.defaultRow.certificatePhotoUri);
    },
    defaultRow: {
      handler(val, oldVal) {
        if (val.tagInofShows && val.tagInofShows.length) {
          val.tagInofShows.forEach(item => {
            item.id = item.tagUuid;
            item.label = item.tagName;
            this.dynamicTags.push(item);
          });
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style>
.BlacklistDetail .el-dialog__body {
  overflow-y: auto;
  max-height: 53.7%;
}
.BlacklistDetail .activeFontClass {
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  color: #26d39d;
}
.BlacklistDetail .el-dialog {
  position: relative;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  margin: 0px !important;
  background: #25292d;
}
.BlacklistDetail .el-input__icon {
  line-height: 30px;
  color: #26d39d;
}
.BlacklistDetail .el-dialog__headerbtn {
  top: 18px;
  display: none;
}
.BlacklistDetail .el-dialog__header {
  height: 60px;
}
.dialogHeaderClass {
  width: 100%;
  padding: 25px 40px 24px;
  box-sizing: border-box;
}
.dialogHeaderClass .el-button {
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  color: #ffffff;
  letter-spacing: 0;
  margin: 0 10px;
}
.dialogHeaderClass .deleteBtn {
  background: rgba(253, 84, 94, 0.05);
  border: 1px solid rgba(255, 95, 95, 0.89);
  border-radius: 2px;
  border-radius: 2px;
}
.BlacklistDetail .dialogHeaderClass .header_left_txt {
  border-left: 2px solid #26d39d;
  font-family: "PingFangSC-Regular";
  font-size: 14px;
  color: #ffffff;
  padding-left: 10px;
}
.BlacklistDetail .pBox {
  display: flex;
  justify-content: flex-start;
  margin: 7px 0 8px;
}
.BlacklistDetail .pBox div {
  width: 50%;
  text-align: left;
}
.BlacklistDetail .header_right_box {
  text-align: center;
}
.BlacklistDetail .header_right_box button {
  height: 32px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #ffffff;
  text-align: justify;
  padding: 7px 17px;
}

.BlacklistDetail .imgBox {
  display: inline-block;
  width: 100%;
  height: 100px;
  background: rgba(0, 0, 0, 0.1);
  border: 0 solid rgba(255, 255, 255, 0.1);
  padding: 7px;
  box-sizing: border-box;
}
.BlacklistDetail .imgBox img {
  width: 100%;
  height: 100%;
}
.BlacklistDetail .left_tips_txt {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #26d39d;
}
.BlacklistDetail .el-upload {
  display: inline-block;
  text-align: center;
  width: 100%;
  line-height: 130px;
  cursor: pointer;
  outline: none;
}
.BlacklistDetail .authBox {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
}
.BlacklistDetail .el-select {
  display: inline-block;
  position: relative;
  width: 30%;
}
.BlacklistDetail .el-select .el-input {
  width: 100%;
}
.BlacklistDetail .el-select .el-select-dropdown__list {
  width: 100%;
}
.BlacklistDetail .el-input {
  display: inline-block;
  width: 30%;
  height: 30px;
}
.BlacklistDetail .el-input .el-input__inner {
  height: 30px;
  padding-right: 15px;
}
.BlacklistDetail .body_box {
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  padding: 15px 0px 20px;
  color: #dddddd;
  font-size: 12px;
}
.el-dialog__wrapper {
  overflow: auto;
}
.BlacklistDetail .time-line {
  display: inline-block;
  border-width: 1px 0px 0px 0px;
  width: 8px;
  border-color: #7a7b7c;
  border-style: solid;
  margin: 0px 3px;
}
.BlacklistDetail .img {
  vertical-align: baseline;
}
.BlacklistDetail {
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  color: #dddddd;
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";

@mixin padding {
  padding: 10px 46px 0px;
  box-sizing: border-box;
}
.body {
  @include padding;
  .title {
    height: 40px;
    line-height: 30px;
    @include font-s;
  }
  .righttips {
    float: right;
    .test {
      padding-right: 20px;
    }
    .refresh {
      cursor: pointer;
      img {
        display: inline-block;
        vertical-align: middle;
      }
      color: $add-text-color;
    }
  }
  .body_box {
    p {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #dddddd;
      margin: 7px 0 8px;
      height: 16px;
    }
  }
  .card_icon_class {
    text-align: center;
    p {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 2px;
      border-radius: 2px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #dddddd;
      line-height: 35px;
      margin: 0 20%;
      padding: 0 20px;
      width: 60%;
      text-align: center;
      display: flex;
      justify-content: space-between;
    }
  }
  .finger_icon_class {
    padding-left: 30px;
  }
}
.footer {
  @include padding;
  overflow: hidden;
  button {
    height: 30px;
    padding: 7px 21px;
    background: rgba(40, 255, 187, 0.12);
    border: 1px solid rgba(40, 255, 187, 0.8);
    border-radius: 2px;
    border-radius: 2px;
    font-family: "PingFangSC-Regular";
    font-size: 12px;
    color: #ffffff;
    letter-spacing: 0;
  }
}
</style>
