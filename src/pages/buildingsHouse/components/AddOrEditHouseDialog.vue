<template>
  <el-dialog width="28%"
             :title="isAdd?`新增房屋`:`修改房屋`"
             class="dialog-main-unit"
             center
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <el-form :rules="rules"
               ref="addHouseForm"
               :label-position="labelPosition"
               label-width="120px"
               :model="formLabelAlign"
               class="info-form">
        <el-form-item label="房屋名称："
                      prop="roomsName">
          <el-input class="time-interal"
                    v-model="formLabelAlign.roomsName"
                    size="small"></el-input>
        </el-form-item>
        <el-form-item label="楼栋单元："
                      prop="rootInfrastructureUuid">
          <popover-tree-for-bottom width="90%"
                        :initTreeRootData="initTreeRootData"
                        :nodeText.sync="formLabelAlign.nodeText"
                        :lastLevelType="lastLevelType"
                        @setUseData="setUseData"/>
        </el-form-item>
        <el-form-item label="房屋类型："
                      prop="roomsType">
          <el-select class="time-interal"
                     v-model="formLabelAlign.roomsType"
                     size="small"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in houseTypeOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房屋用途："
                      prop="roomsUse">
          <el-select class="time-interal"
                     v-model="formLabelAlign.roomsUse"
                     size="small"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in houseUseOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房屋面积(m²)："
                      prop="acreage">
          <el-input class="time-interal"
                    v-model="formLabelAlign.acreage"
                    size="small"></el-input>
        </el-form-item>
        <el-form-item label="备注："
                      prop="remarks">
          <el-input class="time-interal"
                    v-model="formLabelAlign.remarks"
                    size="small"></el-input>
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
import PopoverTreeForBottom from "@/pages/buildingsHouse/components/PopoverTreeForBottom";

export default {
  components: {
    PopoverTreeForBottom,
  },
  props: {
    isAdd: {
      type: Boolean,
      default: true
    },
    isShow: {
      type: Boolean,
      default: false
    },
    initTreeRootData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    // const validatorlength = (rule, value, callback) => {
    //   if (this.isAdd) {
    //     this.$houseHttp
    //       .getInfrastructure({
    //         parentUuid: this.formLabelAlign.infrastructureUuid
    //       })
    //       .then(res => {
    //         let body = res.data;
    //         if (body.data && body.data.some(v => v.label === value)) {
    //           callback(new Error("名称不能重复"));
    //         } else {
    //           callback();
    //         }
    //       })
    //       .catch(() => {
    //         callback(new Error("请求错误"));
    //       });
    //   } else {
    //     callback();
    //   }
    // };
    return {
      isCurrentShow: false,
      labelPosition: "right",
      formLabelAlign: {
        roomsName: "",
        rootInfrastructureUuid: "",
        infrastructureUuid: "",
        roomsType: "commodity",
        roomsUse: "complete",
        acreage: "",
        remarks: "",
        nodeText: "",
        version: null
      },
      houseTypeOptions: [],
      houseUseOptions: [],
      lastLevelType: "",
      rules: {
        roomsName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { whitespace: true, message: "不允许输入空格", trigger: "blur" },
          { min: 1, max: 32, message: "长度在 1 到 32 个字符", trigger: "blur" },
          // {
          //   validator: validatorlength,
          //   trigger: "blur"
          // }
        ],
        rootInfrastructureUuid: [{ required: true, message: "楼栋单元不能为空", trigger: "change" }],
      },
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.houseTypeOptions = this.$common.getEnumByGroupStr("house_t");
      this.houseUseOptions = this.$common.getEnumByGroupStr("house_u");
    },
    resetFormData() {
      this.$refs.addHouseForm.resetFields();
      this.params = null;
      this.formLabelAlign = {
        roomsName: "",
        rootInfrastructureUuid: "",
        infrastructureUuid: "",
        roomsType: "commodity",
        roomsUse: "complete",
        acreage: "",
        remarks: "",
        nodeText: "",
        version: null
      };
    },
    onClickCancel() {
      this.resetFormData();
      this.$emit("onCancel");
    },
    onClickConfirm() {
      this.$refs.addHouseForm.validate(valid => {
        if (valid) {
          this.addHouse();
        } else {
          this.$cToast.error("请正确填写内容");
        }
      });
    },
    setUseData(params) {
      this.formLabelAlign.rootInfrastructureUuid = params.node.data.id;
    },
    addHouse() {
      this.$houseHttp
        .addHouse({
          rootInfrastructureUuid: this.formLabelAlign.rootInfrastructureUuid,
          infrastructureUuid: this.formLabelAlign.infrastructureUuid,
          acreage: this.formLabelAlign.acreage,
          remarks: this.formLabelAlign.remarks,
          roomsName: this.formLabelAlign.roomsName,
          infrastructureUri: this.formLabelAlign.roomsName,
          roomsType: this.formLabelAlign.roomsType,
          roomsUse: this.formLabelAlign.roomsUse,
          version: this.formLabelAlign.version
        })
        .then(res => {
          let body = res.data;
          this.addHouseSuccessResponse(body);
        });
    },
    addHouseSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.resetFormData();
      this.$emit("onConfirm");
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
.topTitleTxt {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #cccccc;
}
.time-interal {
  width: 90%;
}
.info-form {
  width: 85%;
  margin: 0 auto;
}
.el-form-item {
  margin-bottom: 12px;
}
</style>
