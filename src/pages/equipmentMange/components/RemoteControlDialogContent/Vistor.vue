<template>
  <div class='wrap vistor'>
    <el-form ref="form"
             class='deviceInfoPanel'
             label-width="220px">

      <!-- <el-form-item label="允许手动输入访客姓名、证件号：">
        <el-switch v-model="inputNameByHandEnable"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item> -->

      <el-form-item label="允许登记时间："
                    prop="name">
        <el-time-picker v-model="allowRegisterStartTime"
                        @change="changeTime"
                        :clearable="false"
                        prefix-icon="11"
                        value-format="HH:mm:ss"
                        style="float:left;width:100px;color:#ddd;font-size: 12px;"
                        placeholder="选择时间">

        </el-time-picker>
        <div style="float:left;width:30px;text-align:center;">--</div>
        <el-time-picker v-model="allowRegisterEndTime"
                        @change="changeTime"
                        :clearable="false"
                        prefix-icon="11"
                        value-format="HH:mm:ss"
                        style="float:left;width:100px;"
                        placeholder="选择时间">
        </el-time-picker>
        <div style="text-indent:20px;float:left;width:130px;word-break: keep-all;color:#ddd;font-size: 12px;">不能晚于当日访客失效时间</div>
      </el-form-item>

      <el-form-item label="启用人证核验："
                    prop="witnessTestimonCheckEnable">
        <el-switch v-model="witnessTestimonCheckEnable"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <el-form-item label="允许无证核验："
                    v-show="witnessTestimonCheckEnable"
                    prop="noWitnessCheckEnable">
        <el-switch v-model="noWitnessCheckEnable"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <el-form-item label="人证比对阈值："
                    v-show="witnessTestimonCheckEnable"
                    prop="witnessTestimonThreshold">
        <el-input v-model='witnessTestimonThreshold'
                  type="number"
                  placeholder="1-100">

        </el-input>
      </el-form-item>

      <el-form-item label="黑名单比对阈值："
                    prop="blacklistThreshold">
        <el-input v-model='blacklistThreshold'
                  type="number"
                  placeholder="1-100">

        </el-input>
      </el-form-item>

      <el-form-item label="访客再次来访时关联历史记录："
                    prop="relLastVisitRecordEnable">
        <el-switch v-model="relLastVisitRecordEnable"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <!-- <el-form-item label="是否需要签离："
                    prop="signOffEnable">
        <el-switch v-model="signOffEnable"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <el-form-item label="自动签离："
                    prop="autoSignOffEnable">
        <el-switch v-model="autoSignOffEnable"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <el-form-item label="访客失效时间/自动签离时间："
                    prop="autoSignOffTime">
        <el-time-picker v-model="autoSignOffTime"
                        :clearable="false"
                        prefix-icon="11"
                        value-format="HH:mm:ss"
                        placeholder="选择时间">
        </el-time-picker>
      </el-form-item> -->

      <el-form-item label="登记项目："
                    prop="registerPhone">

        <el-form-item label="手机号码"
                      label-width="70px"
                      prop="registerPhone">
          <el-checkbox-group v-model="registerPhone">
            <el-checkbox label="显示"></el-checkbox>
            <el-checkbox label="必选"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="车牌号"
                      label-width="70px"
                      prop="registerCar">
          <el-checkbox-group v-model="registerCar">
            <el-checkbox label="显示"></el-checkbox>
            <el-checkbox label="必选"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="拜访事由"
                      label-width="70px"
                      prop="registerVisit">
          <el-checkbox-group v-model="registerVisit">
            <el-checkbox label="显示"></el-checkbox>
            <el-checkbox label="必选"></el-checkbox>
          </el-checkbox-group>
          <span class="edit"
                @click="goEdit"
                style="position:absolute;top:1px;left:160px;color: #26D39D;cursor:pointer;font-size:12px;">编辑</span>
        </el-form-item>
        <el-form-item label="携带物品"
                      label-width="70px"
                      prop="registerGoods">
          <el-checkbox-group v-model="registerGoods">
            <el-checkbox label="显示"></el-checkbox>
            <el-checkbox label="必选"></el-checkbox>
          </el-checkbox-group>
          <span class="edit"
                @click="goEdit2"
                style="position:absolute;top:1px;left:160px;color: #26D39D;cursor:pointer;font-size:12px;">编辑</span>
        </el-form-item>
        <el-form-item label="访客单位"
                      label-width="70px"
                      prop="registerUnit">
          <el-checkbox-group v-model="registerUnit">
            <el-checkbox label="显示"></el-checkbox>
            <el-checkbox label="必选"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注"
                      label-width="70px"
                      prop="registerRemarks">
          <el-checkbox-group v-model="registerRemarks">
            <el-checkbox label="显示"></el-checkbox>
            <el-checkbox label="必选"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form-item>

      <el-form-item label="信息脱敏："
                    prop="type">
        <el-checkbox-group v-model="desensitization">
          <el-checkbox label="只显示身份证号前六位及后四位"></el-checkbox>
          <el-checkbox label="只显示手机号前三位及后四位"></el-checkbox>
          <br>
          <el-checkbox label="只显示姓"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-button type="primary"
                 size="small"
                 style="margin-left:180px;"
                 @click='save'>
        保存
      </el-button>
    </el-form>
    <append-reson :visible.sync="showResonTable"
                  :title="title"
                  :deviceUuid="deviceUuid"
                  :tableData="tableData"></append-reson>
  </div>
</template>

<script>
import * as api from "@/pages/equipmentMange/ajax.js";
import AppendReson from "@/common/AppendReson.vue";
export default {
  name: "vistor",
  props: {
    deviceUuid: {
      type: String,
      default() {
        return "";
      }
    }
  },
  components: {
    AppendReson
  },
  data() {
    const validatorlength = (rule, value = "", callback) => {
      if (parseInt(value) <= 0) {
        callback(new Error("阈值大于等于1"));
      } else if (parseInt(value) > 100) {
        callback(new Error("阈值小于等于100"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        witnessTestimonThreshold: [
          { required: true, validator: validatorlength, trigger: "blur" }
        ],
        blacklistThreshold: [
          { required: true, validator: validatorlength, trigger: "blur" }
        ]
      },
      inputNameByHandEnable: false,
      allowSignTime: { beginTime: "", endTime: "" },
      allowRegisterStartTime: "",
      allowRegisterEndTime: "",
      witnessTestimonCheckEnable: false,
      noWitnessCheckEnable: false,
      witnessTestimonThreshold: "",
      blacklistThreshold: "",
      relLastVisitRecordEnable: false,
      signOffEnable: false,
      autoSignOffEnable: false,
      autoSignOffTime: "",
      registerPhone: [],
      registerCar: [],
      registerVisit: [],
      registerGoods: [],
      registerUnit: [],
      registerRemarks: [],
      desensitization: [],
      tableData: ["商务洽谈"],
      showResonTable: false,
      title: "拜访事由",
      loadding: false
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    goEdit() {
      this.tableData = [];
      this.title = "拜访事由";
      api.visitorReasonUrl({ deviceUuid: this.deviceUuid }).then(res => {
        console.log(res);
        if (res.data.success) {
          let list = res.data.data || [];
          this.tableData = list.map(val => {
            return val.name;
          });
          console.log(this.tableData);
          this.showResonTable = true;
        }
      });
    },
    goEdit2() {
      this.tableData = [];
      this.title = "携带物品";
      api.tokeGoods({ deviceUuid: this.deviceUuid }).then(res => {
        if (res.data.success) {
          let list = res.data.data || [];
          this.tableData = list.map(val => {
            return val.name;
          });
          this.showResonTable = true;
        }
      });
    },
    save() {
      this.submit();
      // this.$refs.form.validate(valid => {
      //   if (valid) {
      //     // alert("submit!");
      //   } else {
      //     console.log("error submit!!");
      //     return false;
      //   }
      // });
    },
    getData() {
      api.visitorRegisterConfig({ deviceUuid: this.deviceUuid }).then(res => {
        console.log(res);
        if (res.data.success) {
          let data = res.data.data || [];
          this.inputNameByHandEnable = data.inputNameByHandEnable === 1;
          this.allowRegisterEndTime = data.allowRegisterEndTime || "";
          this.allowRegisterStartTime = data.allowRegisterStartTime || "";
          this.witnessTestimonCheckEnable =
            data.witnessTestimonCheckEnable === 1;
          this.noWitnessCheckEnable = data.noWitnessCheckEnable === 1;
          this.witnessTestimonThreshold = data.witnessTestimonThreshold;
          this.blacklistThreshold = data.blacklistThreshold;
          this.relLastVisitRecordEnable = data.relLastVisitRecordEnable === 1;
          this.autoSignOffEnable = data.autoSignOffEnable === 1;
          this.signOffEnable = data.signOffEnable === 1;
          this.autoSignOffTime = data.autoSignOffTime;
          const deal = obj => {
            let num = [];
            obj = obj || {};
            if (obj.isShow) {
              num.push("显示");
            }
            if (obj.isMust) {
              num.push("必选");
            }
            return num;
          };
          this.registerPhone = deal(data.registerInfo.phoneNumber);
          this.registerCar = deal(data.registerInfo.carNumber);
          this.registerVisit = deal(data.registerInfo.visitReason);
          this.registerGoods = deal(data.registerInfo.takeGoods);
          this.registerUnit = deal(data.registerInfo.visitorOrganization);
          this.registerRemarks = deal(data.registerInfo.remark);

          if (
            data.registerInfo.partHideCert &&
            data.registerInfo.partHideCert.isMust
          ) {
            this.desensitization.push("只显示身份证号前六位及后四位");
          }
          if (
            data.registerInfo.partHidePhoneNumber &&
            data.registerInfo.partHidePhoneNumber.isMust
          ) {
            this.desensitization.push("只显示手机号前三位及后四位");
          }
          if (
            data.registerInfo.partHideName &&
            data.registerInfo.partHideName.isMust
          ) {
            this.desensitization.push("只显示姓");
          }
        }
      });
    },
    submit() {
      if (!this.allowRegisterStartTime) {
        this.$message.error("请选择允许登记时间的开始时间!");
        return;
      }
      if (!this.allowRegisterEndTime) {
        this.$message.error("请选择允许登记时间的结束时间!");
        return;
      }
      if (this.loadding) {
        return;
      }
      this.loadding = true;
      const deal = num => {
        return {
          isShow: num.indexOf("显示") !== -1 ? 1 : 0,
          isMust: num.indexOf("必选") !== -1 ? 1 : 0
        };
      };
      let registerInfo = {};
      registerInfo.phoneNumber = deal(this.registerPhone);
      registerInfo.carNumber = deal(this.registerCar);
      registerInfo.visitReason = deal(this.registerVisit);
      registerInfo.takeGoods = deal(this.registerGoods);
      registerInfo.visitorOrganization = deal(this.registerUnit);
      registerInfo.remark = deal(this.registerRemarks);
      registerInfo.partHideCert = {
        isMust:
          this.desensitization.indexOf("只显示身份证号前六位及后四位") !== -1
            ? 1
            : 0,
        isShow: 0
      };
      registerInfo.partHidePhoneNumber = {
        isMust:
          this.desensitization.indexOf("只显示手机号前三位及后四位") !== -1
            ? 1
            : 0,
        isShow: 0
      };
      registerInfo.partHideName = {
        isMust: this.desensitization.indexOf("只显示姓") !== -1 ? 1 : 0,
        isShow: 0
      };

      let data = {
        inputNameByHandEnable: this.inputNameByHandEnable ? 1 : 0, // 允许手动输入访客姓名、手机号
        // 允许登记时间
        allowRegisterStartTime: this.allowRegisterStartTime,
        allowRegisterEndTime: this.allowRegisterEndTime,
        witnessTestimonCheckEnable: this.witnessTestimonCheckEnable ? 1 : 0, // 启用认证核验
        noWitnessCheckEnable: this.noWitnessCheckEnable ? 1 : 0, // 允许无证核验
        witnessTestimonThreshold: this.witnessTestimonThreshold, // 认证比对阈值
        blacklistThreshold: this.blacklistThreshold, // 黑名单比对阈值
        relLastVisitRecordEnable: this.relLastVisitRecordEnable ? 1 : 0, // 访客再次来访时关联上次来访记录
        signOffEnable: this.signOffEnable ? 1 : 0, // 是否需要签离
        autoSignOffEnable: this.autoSignOffEnable ? 1 : 0, // 自动签离
        autoSignOffTime: this.autoSignOffTime, // 自动签离时间
        // 登记项目
        registerInfo
      };
      console.log(data);
      api
        .UpdatevisitorRegisterConfig(this.deviceUuid, data)
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.$message.success("保存成功！");
            this.getData();
          }
          this.loadding = false;
        })
        .catch(() => {
          this.loadding = false;
        });
    },
    changeTime(val) {
      if (this.allowRegisterStartTime && this.allowRegisterEndTime) {
        if (this.allowRegisterStartTime > this.allowRegisterEndTime) {
          [this.allowRegisterStartTime, this.allowRegisterEndTime] = [
            this.allowRegisterEndTime,
            this.allowRegisterStartTime
          ];
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/style/variables.scss";
.vistor {
  .el-input__inner {
    padding: 0px 15px;
  }
  input {
    width: 100px;
    @include input30;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.wrap {
  height: 100%;
  padding: 13px 15px;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  .title {
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    @include font-s;
  }
  .cube {
    position: relative;
    padding-left: 18px;
    box-sizing: border-box;
    &::after {
      content: "";
      position: absolute;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
      width: 5px;
      height: 5px;
      background-color: #aaa;
    }
  }
  .deviceInfoPanel {
    width: 80%;
    max-width: 600px;
    margin: 0 auto;
    .timetips {
      display: inline-block;
      @include font-s;
    }
  }
}
</style>
