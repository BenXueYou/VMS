<template>
  <el-dialog :title="title"
             :width="width"
             class="VistorDetail"
             :visible.sync="dialogVisible"
             :before-close="close">
    <div class="body">
      <div class="body_box"
           style="border-top:0px;">
        <el-row type="flex"
                justify="flex-start"
                :gutter="20">
          <el-col style="text-align:right;"
                  :span="5">
            <p>姓名：</p>
            <p>性别：</p>
            <p>证件号：</p>
            <p>手机号：</p>
            <p>车牌号：</p>
          </el-col>
          <el-col :span="9">
            <p>{{vistorDetail.visitorName}}</p>
            <p>{{$common.getEnumItemName("gender", vistorDetail.gender)}}</p>
            <p>{{vistorDetail.certificateNo}}</p>
            <p>{{vistorDetail.phoneNo}}</p>
            <p>{{vistorDetail.plateNo}}</p>
          </el-col>
          <el-col style="text-align:right;margin-right:-15px;"
                  :span="5">
            <div v-if="showImg"
                 class="imgBox">
              <img :src="vistorDetail.certificatePhotoUri? imageUrl+vistorDetail.certificatePhotoUri : require('@/assets/images/user.png')"
                   alt
                   srcset />
            </div>
          </el-col>
          <el-col style="text-align:right;"
                  :span="5">
            <div class="imgBox">
              <img :src="vistorDetail.snapPhotoUri? imageUrl+vistorDetail.snapPhotoUri : require('@/assets/images/user.png')"
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
                  :span="5">访客单位：</el-col>
          <el-col :span="14">{{vistorDetail.company}}</el-col>
        </el-row>
      </div>

      <div class="body_box">
        <el-row type="flex"
                justify="flex-start"
                :gutter="20">
          <el-col style="text-align:right;"
                  :span="5">
            <p>访客历史记录：</p>
          </el-col>
          <el-col :span="19">
            <p v-for="(item,index) in vistorDetail.visitHistoryRedord"
               :key="index"
               @click="transferVistorRecord(item)">
              <span class="activeFontClass">{{item.regDatetime}}</span>
              <span class="activeFontClass">{{$common.getEnumItemName("visitor_singon_ways", item.source) || ''}}</span>
              <span class="activeFontClass">{{item.reason}}</span>
              <!-- <span class="activeFontClass">{{item.staffName}}</span> -->
              <span class="activeFontClass">{{item.staffName}}</span>
            </p>
          </el-col>
        </el-row>
      </div>
      <div class="body_box">
        <el-row type="flex"
                justify="flex-start"
                :gutter="20">
          <el-col style="text-align:right;"
                  :span="5">
            <p>访客开门记录：</p>
          </el-col>
          <el-col :span="19">
            <p v-for="(item,index) in openDoorRecord"
               :key="index"
               @click="transferVistorOpenRecord(item)">
              <span class="activeFontClass">{{item.time}}</span>
              <span class="activeFontClass">{{item.channelName}}</span>
              <span class="activeFontClass">{{$common.getEnumItemName("chn_d", item.direction)}}</span>
              <span class="activeFontClass">{{$common.transferValidateType(item.recognitionMode)}}</span>
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
          <el-button v-if="!vistorDetail.black"
                     class="deleteBtn"
                     :disabled="!$common.getAuthIsOwn('访客列表', 'isOwn')"
                     @click="addToBlacklistAct"
                     type="primary">拉黑</el-button>
          <el-button v-else
                     class="deleteBtn"
                     :disabled="!$common.getAuthIsOwn('访客列表', 'isOwn')"
                     @click="addToBlacklistAct"
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
export default {
  components: { tagView },
  props: {
    width: {
      type: String,
      default() {
        return "580px";
      }
    },
    title: {
      type: String,
      default() {
        return "访客详情";
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
    OwnAuth: {
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
    vistorDetail: {
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
  computed: {
    openDoorRecord: function() {
      if (this.vistorDetail.openDoorRecord) {
        return JSON.parse(
          JSON.stringify(this.vistorDetail.openDoorRecord)
        ).reverse();
      } else {
        return [];
      }
    }
  },
  mounted() {
    this.dialogVisible = this.visible;
    this.name = this.value;
    this.checkeTreedNodes = this.dynamicTags;
  },
  methods: {
    transferVistorOpenRecord(data) {
      let ShowAuthDisabled = this.$common.getAuthIsOwn("访客开门记录", "isShow");
      if (!ShowAuthDisabled) {
        this.$message({type: 'warnning', message: '没有权限'});
        return;
      }
      // 跳转到访客开门记录
      this.$router.push({
        name: "VistorOpenRecord",
        params: { data: this.vistorDetail }
      });
      this.close();
    },
    transferVistorRecord(value) {
      let ShowAuthDisabled = this.$common.getAuthIsOwn("访客记录", "isShow");
      if (!ShowAuthDisabled) {
        this.$message({type: 'warnning', message: '没有权限'});
        return;
      }
      // 跳转到访客记录
      this.$router.push({
        name: "VistorRecord",
        params: { data: this.vistorDetail }
      });
      this.close();
    },
    // 添加到黑名单
    addToBlacklistAct() {
      this.$emit("close", this.vistorDetail);
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
    },
    vistorDetail: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    }
  }
};
</script>
<style>
.VistorDetail .el-dialog__body {
  overflow-y: auto;
  max-height: 53.7%;
}
.VistorDetail .activeFontClass {
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  color: #26d39d;
}
.VistorDetail .el-dialog {
  position: relative;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  margin: 0px !important;
  background: #25292d;
}
.VistorDetail .el-input__icon {
  line-height: 30px;
  color: #26d39d;
}
.VistorDetail .el-dialog__headerbtn {
  top: 18px;
  display: none;
}
.VistorDetail .el-dialog__header {
  height: 60px;
}
.dialogHeaderClass {
  width: 100%;
  padding: 25px 40px 24px;
  box-sizing: border-box;
}
.dialogHeaderClass .el-button {
  font-family: "PingFangSC-Regular";
  font-size: 12px!important;
  color: #ffffff;
  letter-spacing: 0;
  margin: 0 10px;
}
.dialogHeaderClass .deleteBtn {
  background: rgba(253, 84, 94, 0.05)!important;
  border: 1px solid rgba(255, 95, 95, 0.89)!important;
  font-size: 12px!important;
  border-radius: 2px;

}
.VistorDetail .dialogHeaderClass .header_left_txt {
  border-left: 2px solid #26d39d;
  font-family: "PingFangSC-Regular";
  font-size: 14px;
  color: #ffffff;
  padding-left: 10px;
}
.VistorDetail .pBox {
  display: flex;
  justify-content: flex-start;
  margin: 7px 0 8px;
}
.VistorDetail .pBox div {
  width: 50%;
  text-align: left;
}
.VistorDetail .header_right_box {
  text-align: center;
}
.VistorDetail .header_right_box button {
  height: 32px;
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  color: #ffffff;
  text-align: justify;
  padding: 7px 17px;
}
.VistorDetail .imgBox {
  display: inline-block;
  width: 100%;
  height: 100px;
  background: rgba(0, 0, 0, 0.1);
  border: 0 solid rgba(255, 255, 255, 0.1);
  padding: 7px;
  box-sizing: border-box;
}
.VistorDetail .imgBox img {
  width: 100%;
  height: 100%;
}
.VistorDetail .left_tips_txt {
  font-family: 'PingFangSC-Regular';
  font-size: 12px;
  color: #26d39d;
}
.VistorDetail .el-upload {
  display: inline-block;
  text-align: center;
  width: 100%;
  line-height: 130px;
  cursor: pointer;
  outline: none;
}
.VistorDetail .authBox {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
}
.VistorDetail .el-select {
  display: inline-block;
  position: relative;
  width: 30%;
}
.VistorDetail .el-select .el-input {
  width: 100%;
}
.VistorDetail .el-select .el-select-dropdown__list {
  width: 100%;
}
.VistorDetail .el-input {
  display: inline-block;
  width: 30%;
  height: 30px;
}
.VistorDetail .el-input .el-input__inner {
  height: 30px;
  padding-right: 15px;
}
.VistorDetail .body_box {
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  padding: 15px 0px 20px;
  color: #dddddd;
  font-size: 12px;
}
.el-dialog__wrapper {
  overflow: auto;
}
.VistorDetail .time-line {
  display: inline-block;
  border-width: 1px 0px 0px 0px;
  width: 8px;
  border-color: #7a7b7c;
  border-style: solid;
  margin: 0px 3px;
}
.VistorDetail .img {
  vertical-align: baseline;
}
.VistorDetail {
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
