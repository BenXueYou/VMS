<template>
  <el-dialog width="620px"
             :title="isAdd?`新建单位`:`${isOneProject ? '修改单位' : '单位详情'}`"
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
               label-width="120px"
               :model="formLabelAlign"
               class="info-form">
        <el-form-item label="单位名称："
                      prop="companyName">
          <el-input class="time-interal"
                    v-model="formLabelAlign.companyName"
                    :readonly="!isOneProject"></el-input>
        </el-form-item>
        <el-form-item label="单位性质："
                      prop="companyType">

          <el-select v-if="isOneProject"
                     class="time-interal"
                     v-model="formLabelAlign.companyType"
                     clearable
                     placeholder="请选择单位性质">
            <el-option v-for="item in companyTypeOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr"></el-option>
          </el-select>
          <el-input v-else
                    class="time-interal"
                    :readonly="!isOneProject"
                    v-model="companyTypeName">
          </el-input>
        </el-form-item>
        <el-form-item v-if="isOneProject"
                      label="楼栋单元："
                      prop="infrastructureUuid">
          <build-floor-popover-tree width="260px"
                                    :initTreeRootData="initTreeRootData"
                                    @setUseData="setUseData"
                                    v-if="isShowPopover"
                                    :nodeText.sync="formLabelAlign.nodeText"
                                    ref="buildFloorPopoverTree"
                                    :lastLevelType="lastLevelType"
                                    :isAllCanSelected="true"
                                    lastLevel="house" />
        </el-form-item>
        <el-form-item v-if="!isOneProject"
                      label="所属地址："
                      prop="infrastructureUuid">
          <el-input class="time-interal"
                    v-model="formLabelAlign.nodeText"
                    :readonly="!isOneProject"></el-input>
        </el-form-item>
        <el-form-item label="联系人："
                      prop="chargePersonName">
          <el-input class="time-interal"
                    v-model="formLabelAlign.chargePersonName"
                    :readonly="!isOneProject"></el-input>
        </el-form-item>
        <el-form-item label="联系电话："
                      prop="chargePersonPhone">
          <el-input class="time-interal"
                    v-model="formLabelAlign.chargePersonPhone"
                    :readonly="!isOneProject"></el-input>
        </el-form-item>
        <el-form-item label="备注："
                      prop="remarks">
          <el-input type="textarea"
                    :rows="3"
                    class="time-interal"
                    :readonly="!isOneProject"
                    v-model="formLabelAlign.remarks"></el-input>
        </el-form-item>
        <el-form-item label="单位照片："
                      prop="remarks">
          <el-upload v-if="isOneProject"
                     class="upload-demo"
                     action
                     :headers="myHeaders"
                     :http-request="httpRequest"
                     :show-file-list="false">
            <el-button class="addImgBtnClass"
                       type="text">
              <img :src="icons.addImgIcon"
                   alt
                   srcset /> 添加照片
            </el-button>
          </el-upload>
          <div class="imgListCellClass"
               width="140px"
               height="140px">
            <img v-show-bigimage v-if="fileList.length"
                 width="140px"
                 height="140px"
                 :src="showPicture()" />
            <div v-if="fileList.length && isOneProject"
                 class="imgBox"
                 @click="deleteImage()">
              <img src="@/assets/images/doorAccess/delete_icon.png"
                   alt />
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button v-if="isOneProject"
                 type="primary"
                 size="small"
                 @click="onClickConfirm">确定</el-button>
      <el-button type="primary"
                 size="small"
                 @click="onClickCancel">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import BuildFloorPopoverTree from "@/pages/unitMange/components/MutiBuildFloorPopoverTree";
import icons from "@/common/icon.js";
export default {
  components: {
    BuildFloorPopoverTree
  },
  props: {
    address: {
      type: String,
      default: ""
    },
    isOneProject: {
      type: Boolean,
      default: false
    },
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
      myHeaders: {},
      fileList: [],
      fileBase64Url: false,
      icons,
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
        picture: null,
        newPicture: null,
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
      isShowPopover: false,
    };
  },
  computed: {
    companyTypeName() {
      return this.$common.getEnumItemName(
        "company_t",
        this.formLabelAlign.companyType
      );
    }
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    deleteImage() {
      this.fileList = [];
      this.fileBase64Url = "";
      this.formLabelAlign.picture = "";
      this.formLabelAlign.newPicture = this.fileBase64Url;
    },
    showPicture(item) {
      item = this.fileList[0] || {};
      let url = "";
      if (item.type === "web") {
        url = this.$common.setPictureShow(item.url);
      } else {
        url = item.url;
      }
      return url;
    },
    httpRequest(e) {
      if (
        e.file.type === "image/png" ||
        e.file.type === "image/jpg" ||
        e.file.type === "image/jpeg"
      ) {
        this.fileList = [];
        this.fileList.push({
          url: URL.createObjectURL(e.file),
          type: "local"
        });
        let reader = new FileReader();
        reader.readAsDataURL(e.file);
        let _this = this;
        reader.onload = function(e) {
          _this.fileBase64Url = this.result
            .replace("data:image/jpeg;base64,", "jpeg:")
            .replace("data:image/png;base64,", "png:")
            .replace("data:image/jpg;base64,", "jpg:");
        };
      } else {
        this.$message.error("不支持该图片类型");
      }
    },
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
          picture: this.formLabelAlign.picture,
          newPicture: this.fileBase64Url,
          remarks: this.formLabelAlign.remarks
        },
        {
          modelName: "单位管理",
          type: "新增",
          detailContent: "新增单位-" + this.formLabelAlign.companyName
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
          picture: this.formLabelAlign.picture,
          newPicture: this.fileBase64Url,
          version: this.formLabelAlign.version
        },
        {
          modelName: "单位管理",
          type: "修改",
          detailContent: "修改单位-" + this.formLabelAlign.companyName
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
        picture: null,
        newPicture: null,
        remarks: "",
        version: null
      };
      this.fileList = [];
      this.fileBase64Url = false;
    },
    setUseData(params) {
      this.formLabelAlign.infrastructureUuid = params.infrastructureUuid;
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
      if (val && this.formLabelAlign && this.formLabelAlign.picture) {
        this.fileList = [];
        this.fileList.push({
          url: this.formLabelAlign.picture,
          type: "web"
        });
      }
      this.fileBase64Url = false;
    }
  },
  destroyed() {}
};
</script>

<style lang="scss" scoped>
.imgListCellClass {
  position: relative;
  width: 140px;
  height: 140px;
}
.imgBox {
  width: 22px;
  height: 22px;
  border-radius: 11px;
  position: absolute;
  right: 3px;
  top: 3px;
  background-color: rgba(17, 17, 17, 0.5);
  img {
    width: 10px;
    height: 10px;
    margin: 5px 6px 8px;
  }
}
.el-upload-list__item {
  overflow: hidden;
  z-index: 0;
  background-color: transparent;
  border: 0px solid #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-top: 10px;
  padding: 10px 10px 10px 90px;
  height: 92px;
}
.el-upload-list__item:hover {
  background-color: transparent;
}
.addImgBtnClass {
  margin-left: 20px;
  font-size: 12px;
  img {
    width: 12px;
    height: 10px;
    margin-right: 8px;
  }
}
.el-textarea__inner {
  border: 1px solid rgba($color: #ffffff, $alpha: 0.15);
  border-radius: 2px;
  background-color: transparent !important;
}
.dialog-content {
  padding: 2% 2%;
  box-sizing: border-box;
}
.dialog-footer {
  padding: 0 0 4% 0;
  box-sizing: border-box;
}
.topTitleTxt {
  font-family: "PingFangSC-Regular";
  font-size: 14px;
  color: #cccccc;
}
.time-interal.el-textarea {
  width: 100%;
}
.time-interal {
  width: 260px;
}
.info-form {
  width: 75%;
  margin: 0 auto;
}
</style>
