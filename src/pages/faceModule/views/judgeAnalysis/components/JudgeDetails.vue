<template>
  <el-dialog width="780px"
             title="研判详情"
             class="judge-dialog"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <div class="content-title">
        <img src="@/assets/images/faceModule/alarm_t.png">
        <span style="margin-left: 10px;">报警类型：{{"疑是黄牛"}}</span>
      </div>
      <div class="content-device">
        <span>设备：</span>
        <el-checkbox :indeterminate="isIndeterminate"
                     v-model="checkAll"
                     @change="handleCheckAllChange"
                     style="margin: 0 30px 0 8px">全选</el-checkbox>
        <el-checkbox-group v-model="checkedDevices"
                           @change="handleCheckedDevChange">
          <el-checkbox v-for="dev in devices"
                       :label="dev"
                       :key="dev">
            {{dev}}
            <div class="device-dot"
                 style="background: #F6C620;"></div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="content-list">
        <template v-for="(item, index) in infoList">
          <div :key="index"
               class="list-item">
            <div class="item-left">
              <div class="item-arrow">
                {{item.time ? item.time.substr(5, 5) : ""}}
              </div>
            </div>
            <div class="dot"
                 style="background: #F6C620;"></div>
            <div class="item-right">
              <div class="right-item">
                <img :src="$common.setPictureShow(item.photoUrl)"
                     width="67.7px"
                     height="67.6px"
                     style="margin-left: 6px"
                     class="img-fill">
                <img :src="$common.setPictureShow(item.photoAllUrl)"
                     width="120.9px"
                     style="margin-left: 6px"
                     height="67.6px"
                     class="img-fill">
                <div class="info-other">
                  <div class="other-span">{{item.time}}</div>
                  <div class="other-span">{{item.address}}</div>
                  <div class="other-span">{{item.details}}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="content-title"
           style="margin-top: 24px;">
        <img src="@/assets/images/faceModule/alarm_t.png">
        <span style="margin-left: 10px;">研判处理</span>
      </div>
      <div class="content-status">
        <span>状态：</span>
        <el-radio-group v-model="typeRadio"
                        style="margin-left: 55px;">
          <el-radio :label="1">已处理</el-radio>
          <el-radio :label="0">未处理</el-radio>
        </el-radio-group>
      </div>
      <div class="content-status">
        <span>移至人脸库：</span>
        <el-select style="width: 240px;margin-left: 20px;"
                   v-model="dataBase"
                   clearable
                   size="small">
          <el-option v-for="item in dataBaseOptions"
                     :key="item.typeStr"
                     :label="item.typeName"
                     :value="item.typeStr">
          </el-option>
        </el-select>
      </div>
      <div class="content-status">
        <span>处理意见：</span>
        <el-input type="textarea"
                  :rows="3"
                  style="width: 600px; margin-left: 30px;"
                  v-model="remark">
        </el-input>
      </div>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="onClickConfirm"
                 size="small">确认</el-button>
      <el-button type="primary"
                 @click="onClickCancel"
                 size="small">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCurrentShow: false,
      typeRadio: 0,
      dataBaseOptions: [],
      dataBase: "",
      remark: "",
      checkAll: false,
      checkedDevices: ["设备1", "设备3"],
      devices: ["设备1", "设备2", "设备3", "设备4"],
      isIndeterminate: true,
      infoList: [
        {
          photoUrl: "",
          photoAllUrl: "",
          time: "2018-10-20  12:22:00",
          address: "南10入口1",
          details: "中年男性  戴口罩"
        },
        {
          photoUrl: "",
          photoAllUrl: "",
          time: "2018-10-20  12:22:00",
          address: "南10入口1",
          details: "中年男性  戴口罩"
        },
        {
          photoUrl: "",
          photoAllUrl: "",
          time: "2018-10-20  12:22:00",
          address: "南10入口1",
          details: "中年男性  戴口罩"
        },
        {
          photoUrl: "",
          photoAllUrl: "",
          time: "2018-10-20  12:22:00",
          address: "南10入口1",
          details: "中年男性  戴口罩"
        },
        {
          photoUrl: "",
          photoAllUrl: "",
          time: "2018-10-20  12:22:00",
          address: "南10入口1",
          details: "中年男性  戴口罩"
        },
        {
          photoUrl: "",
          photoAllUrl: "",
          time: "2018-10-20  12:22:00",
          address: "南10入口1",
          details: "中年男性  戴口罩"
        },
        {
          photoUrl: "",
          photoAllUrl: "",
          time: "2018-10-20  12:22:00",
          address: "南10入口1",
          details: "中年男性  戴口罩"
        }
      ]
    };
  },
  created() {},
  mounted() {},
  methods: {
    onClickCancel() {
      this.$emit("onCancel");
    },
    onClickConfirm() {
      this.$emit("onCancel");
    },
    handleCheckAllChange(val) {
      this.checkedDevices = val ? this.devices : [];
      this.isIndeterminate = false;
    },
    handleCheckedDevChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.devices.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.devices.length;
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
    }
  }
};
</script>
<style lang="scss">
.judge-dialog {
  .el-textarea__inner {
    background-color: transparent;
  }
  .el-dialog {
    margin-top: 6vh !important;
  }
  .el-textarea__inner {
    border: 1px solid #7c7f81;
  }
}
</style>
<style lang="scss" scoped>
.dialog-content {
  padding: 3% 5% 0 5%;
  box-sizing: border-box;
  .content-title {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #ffffff;
    display: flex;
    align-items: center;
  }
  .content-device {
    background: rgba($color: #26d39d, $alpha: 0.05);
    height: 40px;
    margin-top: 15px;
    padding: 0 18px;
    box-sizing: border-box;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #ffffff;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    .device-dot {
      border-radius: 55px;
      width: 8px;
      height: 8px;
      display: inline-flex;
    }
  }
  .content-list {
    height: 380px;
    width: 100%;
    border: 1px solid #254a43;
    margin-top: 15px;
    overflow-y: auto;
    &:last-child {
      margin-bottom: 0px;
    }
    .list-item {
      width: 100%;
      position: relative;
      display: flex;
      .item-left {
        width: 22%;
        padding: 23px 15px;
        text-align: center;
        border-right: 1px dashed rgba($color: #26d39d, $alpha: 0.4);
        .item-arrow {
          width: 90px;
          height: 48px;
          background: url("../../../../../assets/images/faceModule/judge_arrow.png")
            center center no-repeat;
          text-align: center;
          line-height: 48px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          display: inline-block;
          position: relative;
          color: #ffffff;
        }
      }
      .dot {
        width: 11px;
        height: 11px;
        border-radius: 100px;
        position: absolute;
        top: 40px;
        left: 178px;
      }
      .item-right {
        display: flex;
        align-items: center;
        justify-content: center;
        .right-item {
          background: rgba($color: #02000E, $alpha: 0.15);
          width: 460px;
          height: 80px;
          margin-left: 35px;
          display: flex;
          align-items: center;
          .info-other {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #DDDDDD;
            letter-spacing: 0;
            display: flex;
            margin-left: 30px;
            flex-direction: column;
            align-items: flex-start;
            .other-span {
              margin-bottom: 2px;
            }
          }
        }
      }
    }
  }
  .content-status {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #dddddd;
    margin-top: 15px;
    display: flex;
    align-items: center;
  }
}
.dialog-footer {
  padding: 25px 5% 2% 0;
  box-sizing: border-box;
}
</style>
