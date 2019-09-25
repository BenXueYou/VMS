<template>
  <el-dialog width="35%"
             title="初始化小区"
             class="dialog-main-unit"
             center
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <el-form :rules="rules"
               ref="initHouseForm"
               :label-position="labelPosition"
               label-width="95px"
               :model="formLabelAlign"
               class="info-form">
        <el-form-item label="小区名称："
                      prop="subdistrictName">
          <el-input class="time-interal"
                    v-model="formLabelAlign.subdistrictName"
                    size="small"></el-input>
        </el-form-item>
        <el-form-item label="小区结构："
                      prop="checkList">
          <div class="i-text">
            <span style="color: #FF5F5F">注：</span>
            <span>勾选小区所具有的结构类型</span>
          </div>
          <div class="check-box-input">
            <el-checkbox-group v-model="formLabelAlign.checkList"
                               class="check-box">
              <el-checkbox label="期"
                           @change="onChangePhase"></el-checkbox>
              <el-checkbox label="楼栋"
                           @change="onChangeBuilding"></el-checkbox>
              <el-checkbox label="单元"
                           @change="onChangeUnit"></el-checkbox>
              <el-checkbox label="层"
                           @change="onChangeFloor"></el-checkbox>
            </el-checkbox-group>
            <div class="check-input"
                 v-if="isShowPhase">
              <span class="i-text">共</span>
              <el-input class="time-input"
                        type="number"
                        @blur="onBlurPhaseInput"
                        size="small"
                        v-model="formLabelAlign.blockTimes"></el-input>
              <span class="i-text">期</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="onClickConfirm"
                 size="small">确定</el-button>
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
      isShowPhase: false,
      isCurrentShow: false,
      labelPosition: "right",
      formLabelAlign: {
        subdistrictName: "",
        checkList: [],
        blockTimes: "1"
      },
      isPhase: false,
      isBuilding: false,
      isUnit: false,
      isFloor: false,
      rules: {
        subdistrictName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { whitespace: true, message: "不允许输入空格", trigger: "blur" },
          { min: 4, max: 32, message: "长度在 4 到 32 个字符", trigger: "blur" }
        ],
        blockTimes: [
          { required: true, message: "期数不能为空", trigger: "blur" },
        ],
        checkList: [
          {
            type: "array",
            required: true,
            message: "结构类型必须至少勾选一项",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.personTypeOptions = this.$common.getEnumByGroupStr(
        "personTypeEnum"
      );
    },
    resetData() {
      this.$refs.initHouseForm.resetFields();
      this.formLabelAlign = {
        subdistrictName: "",
        checkList: [],
        blockTimes: "1"
      };
      this.isPhase = false;
      this.isBuilding = false;
      this.isUnit = false;
      this.isFloor = false;
    },
    onChangePhase(val) {
      this.isPhase = val;
      if (val) {
        this.isShowPhase = true;
        this.formLabelAlign.blockTimes = "1";
      } else {
        this.isShowPhase = false;
        this.formLabelAlign.blockTimes = "";
      }
    },
    onChangeBuilding(val) {
      this.isBuilding = val;
    },
    onChangeUnit(val) {
      this.isUnit = val;
    },
    onChangeFloor(val) {
      this.isFloor = val;
    },
    onClickCancel() {
      this.resetData();
      this.$emit("onCancel");
    },
    onClickConfirm() {
      const isPass = this.validForm();
      if (!isPass) {
        this.$cToast.error("请正确填写内容");
      } else {
        if (!this.formLabelAlign.checkList.some(v => v === "楼栋") && !this.formLabelAlign.checkList.some((v) => v === "单元")) {
          this.$cToast.warn("楼栋和单元至少选择一项");
        } else {
          this.initArea();
        }
      }
    },
    /**
     * 表单校验
     */
    validForm() {
      let validResult = false;
      this.$refs.initHouseForm.validate(valid => {
        if (valid) {
          validResult = true;
        }
      });
      return validResult;
    },
    initArea() {
      this.$houseHttp
        .initArea({
          areaName: this.formLabelAlign.subdistrictName,
          infrastructureUri: this.formLabelAlign.subdistrictName,
          building: this.isBuilding,
          floor: this.isFloor,
          phase: this.isPhase,
          unit: this.isUnit,
          phaseCount: parseInt(this.formLabelAlign.blockTimes),
        })
        .then(res => {
          let body = res.data;
          this.handleAddAreaSuccessResponse(body);
        });
    },
    handleAddAreaSuccessResponse(body) {
      console.log("初始化小区成功！");
      this.resetData();
      this.$emit("onConfirm");
    },
    onBlurPhaseInput() {
      if (!this.formLabelAlign.blockTimes || parseInt(this.formLabelAlign.blockTimes) <= 0) {
        this.formLabelAlign.blockTimes = "1";
      }
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
    }
  },
  destroyed() {}
};
</script>

<style lang="scss" scoped>
.dialog-content {
  padding: 2% 2% 0 2%;
  box-sizing: border-box;
}
.dialog-footer {
  padding: 0 0 4% 0;
  box-sizing: border-box;
}
.info-form {
  width: 75%;
  margin: 0 auto;
}
.i-text {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #DDDDDD;
}
.check-box-input {
  display: flex;
  flex-flow: row wrap;
  margin-top: 12px;
}
.check-box {
  display: flex;
  flex-flow: column nowrap;
  width: 40%;
}
.check-input {
  display: flex;
  flex-flow: row wrap;
}
.time-interal {
  width: 90%;
}
.time-input {
  width: 80px;
  margin: 0 8px;
}
</style>
