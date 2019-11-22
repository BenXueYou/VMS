<template>
  <el-dialog width="400px"
             title="新增"
             class="dialog-main-unit dialogCenter"
             center
             @close="close"
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
        <el-form-item label="名称："
                      prop="name">
          <el-input class="time-interal"
                    v-model="formLabelAlign.name"
                    size="small"></el-input>
        </el-form-item>
        <el-form-item label="上级："
                      prop="upAddressId">
          <popover-tree width="90%"
                        :visible="visible"
                        :orgType="orgType"
                        refs="popoverTree"
                        @setMaxSn='setMaxSn'
                        @setUseData="setUseData"
                        ref="popoverTree" />

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
import PopoverTree from "@/common/selectOrgTree";
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  components: {
    PopoverTree
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orgType: {
      type: String,
      default: ""
    }
  },
  data() {
    const validatorlength = (rule, value, callback) => {
      console.log(this.params);

      if (this.params.node.childNodes.some(v => v.label === value)) {
        callback(new Error("名称不能重复"));
      } else {
        callback();
      }
    };
    return {
      isCurrentShow: false,
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        upAddressId: ""
      },
      initAreaData: null,
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { whitespace: true, message: "不允许输入空格", trigger: "blur" },
          {
            min: 2,
            max: 32,
            message: "长度在 2 到 32 个字符",
            trigger: "blur"
          },
          {
            validator: validatorlength,
            trigger: "blur"
          }
        ],
        upAddressId: [
          { required: false, message: "上级地址不能为空", trigger: "change" }
        ]
      },
      key: "orgUuid",
      maxTagSn: 0,
      params: { node: { childNodes: [] } }
    };
  },
  created() {},
  mounted() {},
  methods: {
    initData() {
      // let data = {
      // parentOrgUuid: this.parentOrgUuid
      // };
      // api.getOrgTree(data, this.orgType).then(res => {
      //   if (res.data.data) {
      //     let result = res.data.data || [];
      //     this.initAreaData = result;
      //   }
      // });
      this.formLabelAlign.name = "";
      this.formLabelAlign.upAddressId = "";
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
    setMaxSn(maxTagSn) {
      this.maxTagSn = maxTagSn;
    },
    setUseData(params) {
      this.params = params;
      this.maxTagSn = params.maxTagSn;
      this.formLabelAlign.upAddressId = this.params.node.data[this.key];
    },
    onClickCancel() {
      this.$emit("onCancel");
      this.$emit("update:visible", false);
    },
    close() {
      this.$emit("update:visible", false);
    },
    onClickConfirm() {
      const isPass = this.validForm();
      if (!isPass) {
        this.$cToast.error("请正确填写内容");
      } else {
        this.addInfrastructure();
      }
    },
    /**
     * 表单校验
     */
    validForm() {
      let validResult = false;
      this.$refs.addForm.validate(valid => {
        if (valid) {
          validResult = true;
        }
      });
      return validResult;
    },
    addInfrastructure() {
      let data = {
        orgName: this.formLabelAlign.name,
        orgSn: this.maxTagSn,
        orgType: this.orgType,
        parentUuid: this.formLabelAlign.upAddressId
      };
      api.addOrgTree(data).then(res => {
        if (res.data.success) {
          this.$message.success("添加成功");
          this.$emit("confirm", data);
          this.$emit("update:visible", false);
          // 添加子结点成功之后，展开添加的节点
          // this.getChidrendata(this.orgUuid, true);
          // this.getOrgTree();
        }
      });
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.initData();
        this.formLabelAlign.name = "";
      }
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
.time-interal {
  width: 90%;
}
.el-form-item {
  margin-bottom: 12px;
}
</style>
