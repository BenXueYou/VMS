<template>
  <el-dialog width="30%"
             title="新增"
             class="dialog-main-unit"
             center
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <el-form :rules="rules"
               ref="addForm"
               :label-position="labelPosition"
               label-width="95px"
               :model="formLabelAlign"
               class="info-form">
        <el-form-item label="上级地址："
                      prop="upAddressId">
          <popover-tree width="90%"
                        :initAreaData="initAreaData"
                        :lastLevelType="lastLevelType"
                        @setUseData="setUseData"/>
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
                 :loading="isLoading"
                 size="small">确定</el-button>
      <el-button type="primary"
                 @click="onClickCancel"
                 size="small">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import PopoverTree from "@/common/PopoverTree";

export default {
  components: {
    PopoverTree
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validatorlength = (rule, value, callback) => {
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
    };
    return {
      params: null,
      isCurrentShow: false,
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        upAddressId: "",
      },
      initAreaData: null,
      lastLevelType: "",
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { whitespace: true, message: "不允许输入空格", trigger: "blur" },
          { min: 1, max: 32, message: "长度在 1 到 32 个字符", trigger: "blur" },
          {
            validator: validatorlength,
            trigger: "blur"
          }
        ],
        upAddressId: [
          { required: true, message: "上级地址不能为空", trigger: "change" },
        ]
      },
      isLoading: false
    };
  },
  created() {},
  mounted() {
    // this.initData();
  },
  methods: {
    initData() {
    },
    resetFormData() {
      this.$refs.addForm.resetFields();
      this.currentNode = null;
      this.formLabelAlign = {
        name: "",
        upAddressId: ""
      };
      this.subType = "";
    },
    setUseData(params) {
      this.params = params;
      this.formLabelAlign.upAddressId = this.params.node.data.id;
    },
    onClickCancel() {
      this.$emit("onCancel");
    },
    onClickConfirm() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.addInfrastructure();
        } else {
          this.$cToast.error("请正确填写内容");
        }
      });
    },
    addInfrastructure() {
      this.isLoading = true;
      this.$houseHttp
        .addInfrastructure({
          parentUuid: this.formLabelAlign.upAddressId,
          infrastructureType: this.params.subType,
          infrastructureName: this.formLabelAlign.name
        })
        .then(res => {
          let body = res.data;
          this.addInfrastructureSuccessResponse(body);
        });
    },
    addInfrastructureSuccessResponse(body) {
      this.isLoading = false;
      this.$cToast.success(body.msg);
      this.resetFormData();
      this.$emit("onConfirm");
    },
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
    },
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
.time-interal {
  width: 90%;
}
.el-form-item {
  margin-bottom: 12px;
}
</style>
