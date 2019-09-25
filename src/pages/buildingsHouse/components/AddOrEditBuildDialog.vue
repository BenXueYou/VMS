<template>
  <el-dialog width="30%"
             :title="isAdd?`新增${showType}`:`修改名称`"
             class="dialog-main-unit"
             center
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <el-form :rules="rules"
               ref="addbuildForm"
               :label-position="labelPosition"
               label-width="95px"
               :model="formLabelAlign"
               class="info-form">
        <el-form-item label="上级地址："
                      v-if="isAdd"
                      prop="upAddress">
          <span class="path-title">{{formLabelAlign.upAddress}}</span>
        </el-form-item>
        <el-form-item label="名称："
                      prop="name">
          <el-input class="time-interal"
                    v-model="formLabelAlign.name"
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
export default {
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: true
    },
  },
  data() {
    const validatorlength = (rule, value, callback) => {
      if (this.isAdd) {
        this.$houseHttp
          .getInfrastructure({
            parentUuid: this.params.node.data.id
          })
          .then(res => {
            let body = res.data;
            if (body.data && body.data.some(v => v.label === value)) {
              callback(new Error("名称不能重复"));
            } else {
              callback();
            }
          })
          .catch(() => {
            callback(new Error("请求错误"));
          });
      } else {
        callback();
      }
    };
    return {
      isCurrentShow: false,
      labelPosition: "right",
      personTypeOptions: [],
      formLabelAlign: {
        name: "",
        upAddress: ""
      },
      params: null,
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { whitespace: true, message: "不允许输入空格", trigger: "blur" },
          { min: 1, max: 32, message: "长度在 1 到 32 个字符", trigger: "blur" },
          {
            validator: validatorlength,
            trigger: "blur"
          }
        ]
      },
      showType: "",
      subType: "",
      type: ""
    };
  },
  created() {},
  mounted() {
  },
  methods: {
    resetFormData() {
      this.$refs.addbuildForm.resetFields();
      this.params = null;
      this.formLabelAlign = {
        name: "",
        upAddress: ""
      };
      this.showType = "";
      this.subType = "";
    },
    onClickCancel() {
      this.resetFormData();
      this.$emit("onCancel");
    },
    onClickConfirm() {
      this.$refs.addbuildForm.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            this.addInfrastructure();
          } else {
            this.editInfrastructureName();
          }
        } else {
          this.$cToast.error("请正确填写内容");
        }
      });
    },
    setData(params) {
      if (!params) {
        return;
      }
      this.formLabelAlign.upAddress = params.upAddress;
      this.infrastructureUuid = params.node.data.id;
      this.showType = params.showType;
      this.subType = params.subType;
      if (!this.isAdd) {
        this.formLabelAlign.name = params.node.data.label;
      }
      this.type = params.node.data.type;
    },
    addInfrastructure() {
      this.$houseHttp
        .addInfrastructure({
          parentUuid: this.infrastructureUuid,
          infrastructureType: this.subType,
          infrastructureName: this.formLabelAlign.name,
          infrastructureUri: this.formLabelAlign.name
        })
        .then(res => {
          let body = res.data;
          this.addInfrastructureSuccessResponse(body);
        });
    },
    addInfrastructureSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.resetFormData();
      this.$emit("onConfirm", "add");
    },
    editInfrastructureName() {
      this.$houseHttp
        .editInfrastructureName({
          infrastructureUuid: this.infrastructureUuid,
          infrastructureName: this.formLabelAlign.name,
          infrastructureUri: this.formLabelAlign.name
        })
        .then(res => {
          let body = res.data;
          this.editInfrastructureNameSuccessResponse(body);
        });
    },
    editInfrastructureNameSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.resetFormData();
      if (this.type === "infrastructure" || this.type === "area") {
        this.$emit("onConfirm", "rootEdit");
      } else {
        this.$emit("onConfirm", "edit");
      }
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
    },
    params(val) {
      this.setData(val);
    }
  },
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
.time-interal {
  width: 90%;
}
.el-form-item {
  margin-bottom: 12px;
}
.path-title {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #ffffff;
}
</style>
