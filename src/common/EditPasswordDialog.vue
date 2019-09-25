<template>
  <el-dialog width="30%"
             title="设置密码"
             class="dialog-main-unit"
             center
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <el-form :rules="rules"
               ref="accessForm"
               :label-position="labelPosition"
               label-width="105px"
               :model="formLabelAlign"
               class="info-form">
        <el-form-item label="账号：">
          <div style="color:#DDD;font-size:13px;">{{userName}}</div>
        </el-form-item>
        <el-form-item label="原密码："
                      prop="oldPassword">
          <el-input class="time-interal"
                    v-model="formLabelAlign.oldPassword"
                    size="small"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码："
                      prop="newPassword">
          <el-input class="time-interal"
                    v-model="formLabelAlign.newPassword"
                    size="small"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码："
                      prop="newPasswordConfirm"
                      required>
          <el-input class="time-interal"
                    v-model="formLabelAlign.newPasswordConfirm"
                    size="small"
                    type="password"></el-input>
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
    userName: {
      type: String,
      default: ""
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let noSpace = (rule, value, callback) => {
      /* eslint-disable */
      var eReg = /^[^\s]*$/;
      if (!eReg.test(value)) {
        callback(new Error("字符中不能包含空格"));
      } else {
        callback();
      }
      /* eslint-enable */
    };
    let validateConfirmPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认密码"));
      } else if (value !== this.formLabelAlign.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let validatePwd = (rule, value, callback) => {
      /* eslint-disable */
      var eReg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
      if (!eReg.test(value)) {
        callback(new Error("至少包含数字，字母这两种（区分大小写）"));
      } else {
        callback();
      }
      /* eslint-enable */
    };
    return {
      isCurrentShow: false,
      labelPosition: "right",
      formLabelAlign: {
        newPassword: "",
        newPasswordConfirm: "",
        oldPassword: ""
      },
      rules: {
        oldPassword: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { whitespace: true, message: "不允许输入空格", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur"
          },
          { validator: validatePwd, trigger: "blur" },
          { validator: noSpace, trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { whitespace: true, message: "不允许输入空格", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur"
          },
          { validator: validatePwd, trigger: "blur" },
          { validator: noSpace, trigger: "blur" }
        ],
        newPasswordConfirm: [
          { validator: validateConfirmPwd, trigger: "blur" },
          { whitespace: true, message: "不允许输入空格", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur"
          },
          { validator: validatePwd, trigger: "blur" },
          { validator: noSpace, trigger: "blur" }
        ]
      },
      accountUuid: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    resetFormData() {
      this.$refs.accessForm.resetFields();
      this.currentNode = null;
      this.formLabelAlign = {
        newPassword: "",
        newPasswordConfirm: ""
      };
    },
    onClickCancel() {
      this.resetFormData();
      this.$emit("update:isShow", false);
    },
    onClickConfirm() {
      this.$refs.accessForm.validate(valid => {
        if (valid) {
          this.setPwd();
        } else {
          this.$cToast.error("请正确填写内容");
        }
      });
    },
    setPwd(row) {
      this.$accMangeAjax
        .setPwd({
          accountUuid: this.accountUuid,
          newPassword: this.formLabelAlign.newPassword
        })
        .then(res => {
          let body = res.data;
          this.setPwdSuccessResponse(body);
        });
    },
    setPwdSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.resetFormData();
      this.$emit("update:isShow", false);
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
    }
  }
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
