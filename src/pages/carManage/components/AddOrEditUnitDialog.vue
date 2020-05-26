<template>
  <el-dialog width="580px"
             :title="isAdd?`新增车辆`:`修改车辆`"
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
               label-width="125px"
               :model="formLabelAlign"
               class="info-form">
        <el-form-item label="车牌号码："
                      prop="carName">
          <el-input class="time-interal"
                    v-model="formLabelAlign.carName"></el-input>
        </el-form-item>
        <el-form-item label="车牌类型："
                      prop="licenseType">
          <el-select class="time-interal"
                     v-model="formLabelAlign.licenseType"
                     clearable
                     placeholder="请选择车牌类型">
            <el-option v-for="item in carNumber"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌颜色："
                      prop="licenseColor">
          <el-select class="time-interal"
                     v-model="formLabelAlign.licenseColor"
                     clearable
                     placeholder="请选择车牌颜色">
            <el-option v-for="item in carColorArr"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆类型："
                      prop="vehicleType">
          <el-select class="time-interal"
                     v-model="formLabelAlign.vehicleType"
                     clearable
                     placeholder="请选择车牌类型">
            <el-option v-for="item in carType"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆颜色："
                      prop="vehicleColor">
          <el-input class="time-interal"
                    v-model="formLabelAlign.vehicleColor"></el-input>
        </el-form-item>
        <el-form-item label="请选择关联人员："
                      prop="companyName">
          <div class="uploadImg">
            <div class="wrap"
                 @click="addGuanLian">
              <img class="checked-img"
                   src="@/assets/images/add.png"
                   @click="addGuanLian"
                   height="10.4px"
                   style="margin-right: 5px;cursor:pointer;">
              <span @click="addGuanLian"
                    style="cursor:pointer;">添加</span>
            </div>
          </div>
          <div>
            <gt-button class="button"
                       v-for="(i,x) in peoData"
                       @close="deleteTag(x)"
                       :key="x">{{i.label}}</gt-button>
          </div>
        </el-form-item>
        <el-form-item label="请添加车辆照片："
                      prop="">
          <el-upload class="upload-multiple"
                     :style="wrapHeight"
                     :action="frontPhotoUrl"
                     accept="image/jpg,image/jpeg,image/png"
                     :show-file-list="false"
                     :auto-upload="false"
                     :on-change="changeFile">
            <div class="uploadImg">
              <div class="wrap">
                <img class="checked-img"
                     src="@/assets/images/uploadImg.png"
                     height="10.4px"
                     style="margin-right: 5px;">
                <span>添加照片
                  <!-- {{!frontUploaded}} --></span>
              </div>
            </div>
            <div class="alreadyUploaded"
                 v-show="frontUploaded">
              <gt-button class="button"
                         style="height:auto;background:transparent;margin-bottom:0px;"
                         @close="deleteUpload">
                <img :src="frontPhoto"
                     style='max-width:50px;max-height:50px' /></gt-button>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 size="small"
                 v-loading="loading"
                 @click="onClickConfirm">确定</el-button>
      <el-button type="primary"
                 size="small"
                 @click="onClickCancel">取消</el-button>
    </div>
    <tab-tree-tag title="请选择关联人员"
                  rightTxt="已选人员"
                  :modal="false"
                  :tabs="tabs1"
                  :isShow.sync="chooseVisible"
                  :checkedList="peopleList"
                  @onConfirm="peopleConfirm"></tab-tree-tag>
  </el-dialog>
</template>

<script>
import BuildFloorPopoverTree from "@/pages/unitMange/components/MutiBuildFloorPopoverTree";
import tabTreeTag from "@/common/TabTreeTag";
import * as api from "@/pages/carManage/utils/UnitHttp.js";
export default {
  components: {
    BuildFloorPopoverTree,
    tabTreeTag
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
    carNumber: {
      type: Array,
      default() {
        return [];
      }
    },
    carType: {
      type: Array,
      default() {
        return [];
      }
    },
    carColor: {
      type: Array,
      default() {
        return [];
      }
    },
    row: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      carColorArr: [
        { label: "蓝色", value: "blue" },
        { label: "绿色", value: "green" },
        { label: "黄色", value: "yellow" },
        { label: "白色", value: "white" },
        { label: "黑色", value: "black" }
      ],
      licenseColor: "",
      tabs1: [
        {
          id: "2",
          label: "居民",
          treeType: "resident",
          treeNodeType: "staff",
          radio: true,
          selectSingleNode: "staff",
          treeRef: "tree2",
          nodeKey: "id"
        },
        {
          id: "1",
          label: "员工",
          treeType: "person",
          treeRef: "tree1",
          radio: true,
          selectSingleNode: "staff",
          nodeKey: "id"
        }
      ],
      loading: false,
      peoData: [],
      peopleList: [],
      chooseVisible: false,
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
        licenseColor: ""
      },
      equipmentTypeOptions: [],
      coordinatesOptions: [],
      rules: {
        carName: [
          { required: true, message: "车牌号码不能为空", trigger: "blur" }
        ],
        vehicleType: [
          { required: true, message: "车辆类型不能为空", trigger: "change" }
        ],
        licenseType: [
          { required: true, message: "车牌类型不能为空", trigger: "change" }
        ],
        licenseColor: [
          { required: true, message: "车牌颜色不能为空", trigger: "change" }
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
      wrapHeight: "height:12px",
      companyTypeOptions: []
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    deleteTag(index) {
      this.peoData.splice(index, 1);
    },
    addGuanLian() {
      this.chooseVisible = true;
    },
    peopleConfirm(data) {
      console.log(data);
      this.peoData = data;
    },
    initData() {
      this.companyTypeOptions = this.$common.getEnumByGroupStr("company_t");
    },
    addUnits() {
      this.loading = true;
      api
        .addNewCar({
          picture: this.imageFileData /* 车辆图片 */,
          vehiclePicture: this.imageFileData /* 车辆图片 */,
          licenseNumber: this.formLabelAlign.carName /* 车牌号码 */,
          licenseType: this.formLabelAlign.licenseType /* 车牌类型 */,
          licenseColor: this.formLabelAlign.licenseColor /* 车牌类型 */,
          vehicleType: this.formLabelAlign.vehicleType /* 车辆类型 */,
          vehicleColor: this.formLabelAlign.vehicleColor /* 车辆颜色 */,
          staffUuid: this.peoData
            .map(item => {
              return item.id;
            })
            .join(",") /* 关联人员Uuid */
        }, {
          modelName: "车辆登记",
          type: "新增",
          detailContent: "新增车辆-" + this.formLabelAlign.carName
        })
        .then(res => {
          console.log(res);
          this.loading = false;
          this.$message.success("添加成功!");
          this.$emit("update:isShow", false);
          this.$emit("onConfirm");
        })
        .catch(() => {
          this.loading = false;
        });
    },
    updateUnits() {
      this.loading = true;
      api
        .updateCar({
          vehicleUuid: this.row.vehicleUuid,
          picture: this.imageFileData /* 车辆图片 */,
          licenseNumber: this.formLabelAlign.carName /* 车牌号码 */,
          licenseType: this.formLabelAlign.licenseType /* 车牌类型 */,
          licenseColor: this.formLabelAlign.licenseColor /* 车牌类型 */,
          vehicleType: this.formLabelAlign.vehicleType /* 车辆类型 */,
          vehicleColor: this.formLabelAlign.vehicleColor /* 车辆颜色 */,
          staffUuid: this.peoData
            .map(item => {
              return item.id;
            })
            .join(",") /* 关联人员Uuid */
        }, {
          modelName: "车辆登记",
          type: "修改",
          detailContent: "修改车辆-" + this.formLabelAlign.carName
        })
        .then(res => {
          console.log(res);
          this.loading = false;
          this.$message.success("修改成功!");
          this.$emit("update:isShow", false);
          this.$emit("onConfirm");
        })
        .catch(() => {
          this.loading = false;
        });
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
        if (this.formLabelAlign.carName.length > 32) {
          this.$message.warning("车牌号码过长,不超过32位");
          return;
        }
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
    httpRequest(e1) {
      console.log(e1);
    },
    getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var dataURL = canvas.toDataURL("image/png"); // 可选其他值 image/jpeg
      return dataURL
        .replace("data:image/jpeg;base64,", "jpeg:")
        .replace("data:image/png;base64,", "png:")
        .replace("data:image/bmp;base64,", "bmp:")
        .replace("data:image/jpg;base64,", "jpg:");
    },
    changeFile(file, fileList) {
      console.log("file===", file);
      if (
        file.raw.type === "image/jpg" ||
        file.raw.type === "image/jpeg" ||
        file.raw.type === "image/png"
      ) {
        this.wrapHeight = "height: 110px";
        this.opacity = "opacity:0";
        this.frontUploaded = true;
        this.frontPhoto = URL.createObjectURL(file.raw);
        var that = this;
        var reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = function(e) {
          that.imageFileData = this.result
            .replace("data:image/jpeg;base64,", "jpeg:")
            .replace("data:image/png;base64,", "png:")
            .replace("data:image/bmp;base64,", "bmp:")
            .replace("data:image/jpg;base64,", "jpg:");
          // that.checkImageQuality(that.imageFileData);
        };
      } else {
        this.$message.error("不支持该图片类型");
      }
    },
    deleteUpload() {
      // 删除上传图片
      this.wrapHeight = "height: 12px";
      this.frontUploaded = false;
      this.frontPhoto = "";
      this.imageFileData = "";
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
      console.log(this.row);
      if (val && !this.isAdd) {
        console.log(this.row);
        this.formLabelAlign = {
          carName: this.row.licenseNumber,
          licenseType: this.row.licenseType,
          licenseColor: this.row.licenseColor,
          vehicleType: this.row.vehicleType,
          vehicleColor: this.row.vehicleColor
        };
        if (this.row.staffUuid) {
          this.peoData = [
            {
              id: this.row.staffUuid,
              label: this.row.staffName,
              type: "staff"
            }
          ];
        }
        if (this.row.staffUuid) {
          this.peopleList = [
            { id: this.row.staffUuid, label: this.row.staffName }
          ];
        }
        this.frontPhoto = this.row.vehiclePicture;
        if (this.frontPhoto) {
          this.frontUploaded = true;
          var image = new Image();
          image.src = this.frontPhoto; // 处理缓存
          image.crossOrigin = "*"; // 支持跨域图片
          image.onload = () => {
            this.imageFileData = this.getBase64Image(image);
          };
        }
      } else {
        this.formLabelAlign = {
          carName: "",
          licenseType: "",
          licenseColor: "",
          vehicleType: "",
          vehicleColor: ""
        };
        this.peoData = [];
        this.peopleList = [];
        this.frontPhoto = "";
        this.frontUploaded = false;
      }
      if (!val) {
        this.$refs.unitForm.resetFields();
      }
    }
  },
  destroyed() {}
};
</script>

<style lang="scss" scoped>
.alreadyUploaded {
  .imgWrap {
    position: relative;
    .delete {
      position: absolute;
      top: -5px;
      right: -5px;
    }
  }
}
.wrap {
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  color: #26d39d;
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
.time-interal {
  width: 85%;
}
.info-form {
  width: 75%;
  margin: 0 auto;
}
</style>
