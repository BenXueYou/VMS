<template>
  <el-dialog width="620px"
             :title="isAdd?`新增房屋`:`修改房屋`"
             class="AddOrEditHouseDialog"
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
          <popover-tree-for-bottom v-if="isAdd"
                                   width="260px"
                                   :initTreeRootData="initTreeRootData"
                                   :nodeText.sync="formLabelAlign.nodeText"
                                   :lastLevelType="lastLevelType"
                                   @setUseData="setUseData" />
          <el-input v-else
                    :disabled="true"
                    class="time-interal"
                    v-model="formLabelAlign.nodeText"
                    size="small"></el-input>

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
                       :value="item.typeStr"></el-option>
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
                       :value="item.typeStr"></el-option>
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
          <el-input type="textarea"
                    :rows="3"
                    class="time-interal"
                    v-model="formLabelAlign.remarks"
                    size="small"></el-input>
        </el-form-item>
        <el-form-item v-if="isAdd"
                      label="请添加房屋照片："
                      prop="remarks">
          <el-upload class="upload-demo"
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
          <div v-if="fileList.length"
               class="imgListCellClass">
            <img width="140px"
                 height="140px"
                 :src="showPicture()" />
            <div class="imgBox"
                 @click="deleteImage()">
              <img src="@/assets/images/doorAccess/delete_icon.png"
                   alt />
            </div>
          </div>
        </el-form-item>
        <div class="EditCallBox"
             v-else>
          <el-switch v-model="formLabelAlign.enablePhone"
                     active-text="启动电话转接功能"
                     active-color="rgb(38,75,67)"
                     inactive-color="rgb(11,49,49)"></el-switch>
          <edit-house-call-table :tableData='formLabelAlign.staffCallSequenceList'
                                 @transferAct='tansferCallTableDataAct'></edit-house-call-table>
        </div>
      </el-form>
    </div>
    <div v-if="isAdd"
         slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="onClickConfirm"
                 size="small">确定</el-button>
      <el-button type="primary"
                 @click="onClickCancel"
                 size="small">取消</el-button>
    </div>
    <div v-else
         slot="footer"
         class="dialog-footer EditDialogFooter">
      <el-button type="primary"
                 @click="onClickConfirm"
                 size="small">保存</el-button>
      <el-button type="primary"
                 @click="onClickCancel"
                 size="small">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import PopoverTreeForBottom from "@/pages/buildingsHouse/components/PopoverTreeForBottom";
import EditHouseCallTable from "@/pages/buildingsHouse/components/EditHouseCallTable";
import icons from "@/common/icon.js";
export default {
  components: {
    PopoverTreeForBottom,
    EditHouseCallTable
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
      myHeaders: {},
      fileList: [],
      fileBase64Url: false,
      icons,
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
        picture: null,
        newPicture: null,
        enablePhone: 0,
        staffCallSequenceList: [],
        version: null
      },
      houseTypeOptions: [],
      houseUseOptions: [],
      lastLevelType: "",
      tableData: [],
      rules: {
        roomsName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { whitespace: true, message: "不允许输入空格", trigger: "blur" },
          { min: 1, max: 32, message: "长度在 1 到 32 个字符", trigger: "blur" }
          // {
          //   validator: validatorlength,
          //   trigger: "blur"
          // }
        ],
        rootInfrastructureUuid: [
          { required: true, message: "楼栋单元不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    tansferCallTableDataAct(tableData) {
      this.tableData = tableData.map((item, index) => {
        item.callSequence = index;
        return item;
      });
    },
    deleteImage() {
      this.fileList = [];
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
        picture: "",
        newPicture: "",
        version: null,
        enablePhone: false,
        staffCallSequenceList: []
      };
      this.fileList = [];
      this.fileBase64Url = false;
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
          picture: this.formLabelAlign.picture,
          newPicture: this.fileBase64Url,
          version: this.formLabelAlign.version,
          enablePhone: Number(this.formLabelAlign.enablePhone),
          staffCallSequenceList: this.tableData
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
.AddOrEditHouseDialog {
  .dialog-content {
    padding: 2% 35px 0;
    box-sizing: border-box;
    .info-form {
      width: 100%;
      margin: 0 auto;
      .time-interal.el-textarea {
        width: 300px;
      }
      .time-interal {
        width: 300px;
      }
    }
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
    .EditCallBox {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px dashed rgba(255, 255, 255, 0.1);
      >>> .el-switch__label {
        font-family: "PingFangSC-Regular";
        font-size: 12px;
        color: #dddddd !important;
        text-align: right;
      }
      >>> .el-switch {
        margin-bottom: 14px;
      }
    }
  }
  .dialog-footer {
    padding: 0 0 4% 0;
    box-sizing: border-box;
  }
  .EditDialogFooter {
    text-align: right;
    padding-right: 35px;
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

.topTitleTxt {
  font-family: "PingFangSC-Regular";
  font-size: 14px;
  color: #cccccc;
}
.el-form-item {
  margin-bottom: 12px;
}
</style>
