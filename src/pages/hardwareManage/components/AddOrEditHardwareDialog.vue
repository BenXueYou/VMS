 <template>
  <el-dialog width="620px"
             :title="isAdd?`新建装备`:`修改装备`"
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
               label-width="130px"
               :model="formLabelAlign"
               class="info-form">
        <el-form-item label="装备名称："
                      prop="equipmentName">
          <el-input class="time-interal"
                    v-model="formLabelAlign.equipmentName"></el-input>
        </el-form-item>
        <el-form-item label="装备类型："
                      prop="equipmentType">
          <el-select class="time-interal"
                     v-model="formLabelAlign.equipmentType"
                     clearable
                     placeholder="请选择装备性质">
            <el-option v-for="item in equipmentTypeOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经度："
                      prop="">
          <el-input class="time-interal"
                    v-model="formLabelAlign.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度："
                      prop="">
          <el-input class="time-interal"
                    v-model="formLabelAlign.latitude"></el-input>
        </el-form-item>
        <el-form-item label="坐标系："
                      prop="coordinatesType">
          <el-select class="time-interal"
                     v-model="formLabelAlign.coordinatesType"
                     clearable
                     placeholder="请选择坐标系">
            <el-option v-for="item in coordinatesOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注："
                      prop="">
          <el-input type="textarea" :rows="3" class="time-interal" v-model="formLabelAlign.remarks"></el-input>
        </el-form-item>
        <el-form-item label="请添加装备照片："
                      prop="">
            <el-upload class="upload-multiple" :style="formLabelAlign.wrapHeight"
                                 :action="frontPhotoUrl"
                                 accept="image/jpg,image/jpeg,image/png"
                                 :show-file-list="false"
                                 :auto-upload="true"
                                 :on-change="changeFile">
                      <div class="uploadImg">
                        <div class="wrap">
                          <img class="checked-img"
                             src="@/assets/images/uploadImg.png"
                             width="12.5px"
                             height="10.4px"
                             style="margin-right: 5px;">
                           <span>添加照片<!-- {{!frontUploaded}} --></span>
                        </div>
                      </div>
                      <div class="alreadyUploaded"
                           v-show="formLabelAlign.frontUploaded">
                        <img :src="formLabelAlign.frontPhoto" />
                        <div class="delete"
                             @click.stop="deleteUpload"></div>
                      </div>
            </el-upload>
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
export default {
  components: {
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
        equipmentUuid: "",
        infrastructureUuid: "",
        equipmentName: "",
        equipmentType: "",
        nodeText: "",
        chargePersonName: "",
        chargePersonPhone: "",
        remarks: "",
        version: null,
        coordinatesType: "",
        longitude: "",
        latitude: "",
        imageFileData: "",
        frontPhoto: "",
        frontUploaded: false,
        wrapHeight: "height:110px",
        equipmentPicture: ""
      },
      equipmentTypeOptions: [],
      coordinatesOptions: [],
      rules: {
        equipmentName: [
          { required: true, message: "装备名称不能为空", trigger: "blur" }
        ],
        equipmentType: [
          { required: true, message: "装备类型不能为空", trigger: "change" }
        ],
        coordinatesType: [
          { required: true, message: "坐标系不能为空", trigger: "change" }
        ]
      },
      initTreeRootData: null,
      lastLevelType: "",
      isShowPopover: false,
      myHeaders: { token: this.$store.state.token },
      frontUploaded: false,
      frontPhoto: "",
      imageFileData: "",
      frontPhotoUrl:
        this.$store.state.api +
        "/mppr-face/v1/face/image/upload?fileType=full_body_shot",
      opacity: "opacity:1",
      wrapHeight: "height:110px"

    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.equipmentTypeOptions = this.$common.getEnumByGroupStr("equip_type");
      this.coordinatesOptions = this.$common.getEnumByGroupStr("coordinate");
    },
    addUnits() {
      console.log("equipmentPicture==", this.formLabelAlign.imageFileData);
      this.$equipmentHttp
        .addequipments({
          equipmentName: this.formLabelAlign.equipmentName, /* 实有装备名称 */
          equipmentType: this.formLabelAlign.equipmentType, /* 实有装备类型 */
          longitude: this.formLabelAlign.longitude, /* 经度 */
          latitude: this.formLabelAlign.latitude, /* 纬度 */
          coordinateSystem: this.formLabelAlign.coordinatesType, /* 坐标系 */
          remark: this.formLabelAlign.remarks, /* 备注 */
          picture: this.formLabelAlign.imageFileData /* 实有装备图片 */
        }, {
          modelName: "实有装备",
          type: "新增",
          detailContent: "新增装备-" + this.formLabelAlign.equipmentName
        })
        .then(res => {
          let body = res.data;
          this.addUnitsSuccessResponse(body);
        });
    },
    addUnitsSuccessResponse(body) {
      this.$cToast.success("新增成功");
      this.resetFormData();
      this.$emit("onConfirm");
    },
    updateUnits() {
      this.$equipmentHttp
        .updateequipments({
          equipmentName: this.formLabelAlign.equipmentName, /* 实有装备名称 */
          equipmentType: this.formLabelAlign.equipmentType, /* 实有装备类型 */
          longitude: this.formLabelAlign.longitude, /* 经度 */
          latitude: this.formLabelAlign.latitude, /* 纬度 */
          coordinateSystem: this.formLabelAlign.coordinatesType, /* 坐标系 */
          remark: this.formLabelAlign.remarks, /* 备注 */
          picture: this.formLabelAlign.imageFileData, /* 实有装备图片 */
          equipmentUuid: this.formLabelAlign.equipmentUuid,
          equipmentPicture: this.formLabelAlign.equipmentPicture
        }, {
          modelName: "实有装备",
          type: "编辑",
          detailContent: "修改装备-" + this.formLabelAlign.equipmentName
        })
        .then(res => {
          let body = res.data;
          this.updateUnitsSuccessResponse(body);
        });
    },
    updateUnitsSuccessResponse(body) {
      this.$cToast.success("修改成功");
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
        equipmentUuid: "",
        infrastructureUuid: "",
        equipmentName: "",
        equipmentType: "",
        nodeText: "",
        chargePersonName: "",
        chargePersonPhone: "",
        remarks: "",
        version: null,
        coordinatesType: "",
        longitude: "",
        latitude: "",
        imageFileData: "",
        frontPhoto: "",
        equipmentPicture: ""
      };
      this.deleteUpload();
    },
    setUseData(params) {
      this.formLabelAlign.infrastructureUuid = params.infrastructureUuid;
    },
    httpRequest(e1) {
      console.log(e1);
    },
    changeFile(file, fileList) {
      console.log("file===", file);
      if (file.raw.type === "image/jpg" || file.raw.type === "image/jpeg" || file.raw.type === "image/png") {
        this.formLabelAlign.wrapHeight = "height: 110px";
        this.opacity = "opacity:0";
        this.formLabelAlign.frontUploaded = true;
        this.formLabelAlign.frontPhoto = URL.createObjectURL(file.raw);
        var that = this;
        var reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = function(e) {
          that.formLabelAlign.imageFileData = this.result
            .replace("data:image/jpeg;base64,", "jpeg:")
            .replace("data:image/png;base64,", "png:")
            .replace("data:image/jpg;base64,", "jpg:");
          // that.checkImageQuality(that.imageFileData);
        };
      } else {
        this.$message.error("不支持该图片类型");
      }
    },
    deleteUpload() {
      // 删除上传图片
      this.formLabelAlign.wrapHeight = "height: 110px";
      this.formLabelAlign.frontUploaded = false;
      this.formLabelAlign.frontPhoto = "";
      this.formLabelAlign.imageFileData = "";
      this.formLabelAlign.equipmentPicture = "";
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
  // padding: 2% 2%;
  padding: 2% 2% 0 2%;
  box-sizing: border-box;
}
.dialog-footer {
  padding: 0 0 43px 0;
  box-sizing: border-box;
  margin-top: -40px;
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
.upload-multiple {
  width: 66px;
  height: 72px;
  display: flex;
  flex-direction: column;
  position: relative;
  top: 12px;
}
.uploadImg {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #26D39D;
  width: 100px;
  height: 12px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 18px;
}
.uploadImg .wrap {
  width: 100px;
  height: 12px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.alreadyUploaded {
  width: 66px;
  height: 60px;
  position: relative;
}
.alreadyUploaded img {
  width: 66px;
  height: 60px;
  position: absolute;
  left: 0;
  top: 0;
}
.alreadyUploaded .delete {
  width: 13px;
  height: 13px;
  background: red;
  position: absolute;
  right: 0px;
  top: 0px;
  background: url("./../../../assets/images/personMange/delete.png") no-repeat;
  background-position: center center;
  z-index: 2000;
  background-size: 13px 13px;
}
</style>
