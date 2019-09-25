<template>
  <el-dialog width="30%"
             :title="isAdd?`新建单位`:`修改单位`"
             class="dialog-main-unit"
             center
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <el-form :rules="rules"
               ref="unitForm"
               :label-position="labelPosition"
               label-width="95px"
               :model="formLabelAlign"
               class="info-form">
        <el-form-item label="单位名称："
                      prop="companyName">
          <el-input class="time-interal"
                    v-model="formLabelAlign.companyName"></el-input>
        </el-form-item>
        <el-form-item label="单位性质："
                      prop="companyType">
          <el-select class="time-interal"
                     v-model="formLabelAlign.companyType"
                     clearable
                     placeholder="请选择单位性质">
            <el-option v-for="item in companyTypeOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼栋单元："
                      prop="infrastructureUuid">
          <build-floor-popover-tree width="85%"
                                    :initTreeRootData="initTreeRootData"
                                    @setUseData="setUseData"
                                    v-if="isShowPopover"
                                    :nodeText.sync="formLabelAlign.nodeText"
                                    ref="buildFloorPopoverTree"
                                    :lastLevelType="lastLevelType"
                                    :isAllCanSelected="true"
                                    lastLevel="house" />
        </el-form-item>
        <el-form-item label="联系人："
                      prop="chargePersonName">
          <el-input class="time-interal"
                    v-model="formLabelAlign.chargePersonName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话："
                      prop="chargePersonPhone">
          <el-input class="time-interal"
                    v-model="formLabelAlign.chargePersonPhone"></el-input>
        </el-form-item>
        <el-form-item label="备注："
                      prop="remarks">
          <el-input class="time-interal"
                    v-model="formLabelAlign.remarks"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 size="small"
                 @click="onClickConfirm">确定</el-button>
      <el-button type="primary"
                 size="small"
                 @click="onClickCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import BuildFloorPopoverTree from "@/pages/unitMange/components/MutiBuildFloorPopoverTree";

export default {
  components: {
    BuildFloorPopoverTree
  },
  props: {
    isAdd: {
      type: Boolean,
      default: true
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCurrentShow: false,
      labelPosition: "right",
      formLabelAlign: {
        companyUuid: "",
        infrastructureUuid: "",
        companyName: "",
        companyType: "",
        nodeText: "",
        chargePersonName: "",
        chargePersonPhone: "",
        remarks: "",
        version: null
      },
      companyTypeOptions: [],
      rules: {
        companyName: [
          { required: true, message: "单位名称不能为空", trigger: "blur" }
        ],
        companyType: [
          { required: true, message: "单位属性不能为空", trigger: "change" }
        ],
        infrastructureUuid: [
          { required: true, message: "楼栋单元不能为空", trigger: "change" }
        ],
        chargePersonName: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        chargePersonPhone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ]
      },
      initTreeRootData: null,
      lastLevelType: "",
      isShowPopover: false
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.companyTypeOptions = this.$common.getEnumByGroupStr("company_t");
    },
    addUnits() {
      this.$unitHttp
        .addUnits({
          companyName: this.formLabelAlign.companyName,
          companyType: this.formLabelAlign.companyType,
          infrastructureUuid: this.formLabelAlign.infrastructureUuid,
          chargePersonName: this.formLabelAlign.chargePersonName,
          chargePersonPhone: this.formLabelAlign.chargePersonPhone,
          remarks: this.formLabelAlign.remarks
        })
        .then(res => {
          let body = res.data;
          this.addUnitsSuccessResponse(body);
        });
    },
    addUnitsSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.resetFormData();
      this.$emit("onConfirm");
    },
    updateUnits() {
      this.$unitHttp
        .updateUnits({
          companyUuid: this.formLabelAlign.companyUuid,
          infrastructureUuid: this.formLabelAlign.infrastructureUuid,
          companyName: this.formLabelAlign.companyName,
          companyType: this.formLabelAlign.companyType,
          chargePersonName: this.formLabelAlign.chargePersonName,
          chargePersonPhone: this.formLabelAlign.chargePersonPhone,
          remarks: this.formLabelAlign.remarks,
          version: this.formLabelAlign.version
        })
        .then(res => {
          let body = res.data;
          this.updateUnitsSuccessResponse(body);
        });
    },
    updateUnitsSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.resetFormData();
      this.$emit("onConfirm");
    },
    onClickCancel() {
      this.resetFormData();
      this.$emit("onCancel");
    },
    onClickConfirm() {
      const isPass = this.validForm();
      if (!isPass) {
        this.$cToast.error("请正确填写内容");
      } else {
        if (this.isAdd) {
          this.addUnits();
        } else {
          this.updateUnits();
        }
      }
    },
    validForm() {
      let validResult = false;
      this.$refs.unitForm.validate(valid => {
        if (valid) {
          validResult = true;
        }
      });
      return validResult;
    },
    resetFormData() {
      this.$refs.unitForm.resetFields();
      this.formLabelAlign = {
        companyUuid: "",
        infrastructureUuid: "",
        companyName: "",
        companyType: "",
        chargePersonName: "",
        chargePersonPhone: "",
        remarks: "",
        version: null
      };
    },
    setUseData(params) {
      this.formLabelAlign.infrastructureUuid = params.infrastructureUuid;
    },
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
  padding: 2% 2%;
  box-sizing: border-box;
}
.dialog-footer {
  padding: 0 0 4% 0;
  box-sizing: border-box;
}
.topTitleTxt {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #cccccc;
}
.time-interal {
  width: 85%;
}
.info-form {
  width: 75%;
  margin: 0 auto;
}
</style>
