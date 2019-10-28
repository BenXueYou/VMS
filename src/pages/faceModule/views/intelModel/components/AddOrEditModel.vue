<template>
  <div class="control-main-add">
    <select-face :isShow="isShowAddFaceDB"
                 ref="selectFace"
                 :initSelectData="initSelectFaceData"
                 @onCancel="cancelAddFaceDB"
                 @onConfirm="confirmAddFaceDB" />
    <div class="access-main">
      <div class="dialog-title">
        <div class="title-text">{{isAdd ? "新建" : "编辑"}}模型</div>
        <div class="title-button">
          <el-button type="primary"
                     @click="onClickCancel"
                     size="small">返回</el-button>
          <el-button type="primary"
                     @click="onClickConfirm"
                     size="small">确定</el-button>
        </div>
      </div>
      <div class="form">
        <el-form :rules="rules"
                 ref="modelForm"
                 label-position="right"
                 label-width="180px"
                 :model="formLabelAlign"
                 class="info-form">
          <el-form-item label="名称："
                        prop="faceModelName">
            <el-input class="time-interal left-space"
                      v-model="formLabelAlign.faceModelName"></el-input>
          </el-form-item>
          <el-form-item label="人脸库："
                        prop="faceLibraryUuids">
            <div class="add-item"
                 @click="addFaceDB">
              <img src="@/assets/images/faceModule/add.png">
              <span>添加</span>
            </div>
            <div class="item-select">
              <template v-for="(item, index) in faceDBSelectedList">
                <div :key="index"
                     class="select-item"
                     v-if="item.faceLibraryType && item.faceLibraryType === 'systemFaceLib'">
                  <img src="@/assets/images/person_g.png"
                       width="11px"
                       height="11px">
                  <span style="margin-left: 4px; width: 80px">{{item.faceLibraryName}}</span>
                  <template v-for="(item, index) in staffTypeOption">
                    <div :key="index"
                         class="system-select">
                      <el-checkbox v-model="item.checked">{{item.typeName}}</el-checkbox>
                    </div>
                  </template>
                  <div class="del-image"
                       @click="deleteItem(item)">
                    <img src="@/assets/images/delete_x.png"
                         width="13px"
                         height="13px">
                  </div>
                </div>
                <div :key="index"
                     class="select-item"
                     v-else>
                  <img src="@/assets/images/person_g.png"
                       width="11px"
                       height="11px">
                  <span style="margin-left: 4px">{{item.faceLibraryName}}</span>
                  <div class="del-image"
                       @click="deleteItem(item)">
                    <img src="@/assets/images/delete_x.png"
                         width="13px"
                         height="13px">
                  </div>
                </div>
              </template>
            </div>
          </el-form-item>
          <el-form-item label="相似度不低于："
                        prop="faceSimilarityThreshold">
            <el-input class="time-interal left-space"
                      style="width: 60px"
                      type="number"
                      v-model="formLabelAlign.faceSimilarityThreshold"></el-input>
            <span class="unit">%</span>
          </el-form-item>
          <el-form-item label="抓拍图片需达到的质量："
                        prop="faceCapturePhotoQualities">
            <pic-qulity-select :selectedButtons.sync="formLabelAlign.faceCapturePhotoQualities"
                               class="left-space"
                               :isShowLower="false" />
          </el-form-item>
          <el-form-item label="时间段：">
            <div class="left-space time-select">
              <template v-for="(item, index) in formLabelAlign.timeList">
                <div class="time-item"
                     :key="index">
                  <el-time-picker v-model="item.startTime"
                                  style="width: 100px"
                                  value-format="HH:mm:ss"
                                  format="HH:mm"
                                  :picker-options="{
                                    selectableRange: '00:00:00 - 23:59:59'
                                  }">
                  </el-time-picker>
                  <span style="margin: 0 5px">至</span>
                  <el-time-picker v-model="item.endTime"
                                  style="width: 100px"
                                  value-format="HH:mm:ss"
                                  format="HH:mm"
                                  :picker-options="{
                                    selectableRange: `${item.startTime ? item.startTime : '00:00:00'} - 23:59:59`,
                                  }">
                  </el-time-picker>
                  <img src="@/assets/images/faceModule/add.png"
                       width="14px"
                       style="margin: 0 5px; cursor: pointer;"
                       @click="addTimePicker(index)"
                       height="14px">
                  <img src="@/assets/images/faceModule/reduce.png"
                       width="14px"
                       height="14px"
                       v-if="index !== 0"
                       @click="reduceTimePicker(index)"
                       style="margin: 0 5px; cursor: pointer;">
                </div>
              </template>
              <div>
                <span>最近</span>
                <el-input style="width: 60px;"
                          v-model="formLabelAlign.recentDays"></el-input>
                <span>天</span>
                <el-select v-model="formLabelAlign.statisticType"
                           size="small"
                           style="width: 80px; margin-left: 40px;"
                           placeholder=" ">
                  <el-option v-for="item in numOptions"
                             :key="item.typeStr"
                             :label="item.typeName"
                             :value="item.typeStr">
                  </el-option>
                </el-select>
                <span>满足：</span>
              </div>
              <div>
                <template v-for="(item, index) in allVideoSource">
                  <div :key="index">
                    <div v-if="index === 0">
                      <el-select v-model="item.logic"
                                 size="small"
                                 style="width: 180px;"
                                 placeholder="请选择视频源">
                        <el-option v-for="item in numOptions"
                                   :key="item.typeStr"
                                   :label="item.typeName"
                                   :value="item.typeStr">
                        </el-option>
                      </el-select>
                      <el-select v-model="item.logic"
                                 size="small"
                                 style="width: 64px; margin-left: 20px;"
                                 placeholder="≧">
                        <el-option v-for="item in numOptions"
                                   :key="item.typeStr"
                                   :label="item.typeName"
                                   :value="item.typeStr">
                        </el-option>
                      </el-select>
                      <el-input style="width: 60px; margin-left: 20px;"
                                v-model="item.frequency"
                                type="number"></el-input>
                      <span>次</span>
                      <span style="margin-left: 40px;">且至少</span>
                      <el-input style="width: 60px;"
                                type="number"
                                v-model="item.leastNumberOfChannel"></el-input>
                      <span>个摄像机抓拍</span>
                      <img src="@/assets/images/faceModule/add.png"
                           width="14px"
                           style="margin: 0 5px; cursor: pointer;"
                           @click="addDevRes(index)"
                           height="14px">
                    </div>
                    <div v-if="index !== 0">
                      <el-select v-model="item.localType"
                                 size="small"
                                 style="width: 120px;"
                                 placeholder="同时符合">
                        <el-option v-for="item in numOptions"
                                   :key="item.typeStr"
                                   :label="item.typeName"
                                   :value="item.typeStr">
                        </el-option>
                      </el-select>
                      <el-select v-model="item.logic"
                                 size="small"
                                 style="width: 180px; margin-left: 15px;"
                                 placeholder="请选择视频源">
                        <el-option v-for="item in numOptions"
                                   :key="item.typeStr"
                                   :label="item.typeName"
                                   :value="item.typeStr">
                        </el-option>
                      </el-select>
                      <el-select v-model="item.logic"
                                 size="small"
                                 style="width: 64px; margin-left: 15px;"
                                 placeholder="≧">
                        <el-option v-for="item in numOptions"
                                   :key="item.typeStr"
                                   :label="item.typeName"
                                   :value="item.typeStr">
                        </el-option>
                      </el-select>
                      <el-input style="width: 60px; margin-left: 15px;"
                                v-model="item.frequency"
                                type="number"></el-input>
                      <span>次</span>
                      <img src="@/assets/images/faceModule/add.png"
                           width="14px"
                           style="margin: 0 5px; cursor: pointer;"
                           @click="addDevRes(index)"
                           height="14px">
                      <img src="@/assets/images/faceModule/reduce.png"
                           width="14px"
                           height="14px"
                           v-if="index !== 0"
                           @click="reduceDevRes(index)"
                           style="margin: 0 5px; cursor: pointer;">
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="两次抓拍间隔时间："
                        prop="faceSimilarityThreshold">
            <el-input class="time-interal left-space"
                      style="width: 60px"
                      type="number"
                      v-model="formLabelAlign.faceSimilarityThreshold"></el-input>
            <span class="unit">%</span>
          </el-form-item>
          <el-form-item label="模型状态："
                        prop="enabled"
                        required>
            <el-switch v-model="formLabelAlign.enabled"
                       class="left-space"
                       active-color="rgba(32,204,150,0.2)"
                       inactive-color="rgba(255,255,255,0.2)"
                       :active-value="1"
                       :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="备注："
                        prop="remark">
            <el-input class="time-interal left-space"
                      v-model="formLabelAlign.remark"
                      style="width: 630px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <div class="bottom-button">
          <el-button type="primary"
                     @click="onClickCancel"
                     size="small">返回</el-button>
          <el-button type="primary"
                     @click="onClickConfirm"
                     size="small">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PicQulitySelect from "@/common/PicQulitySelect";
import SelectFace from "@/common/SelectFaceDB";

export default {
  components: {
    PicQulitySelect,
    SelectFace
  },
  props: {
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formLabelAlign: {
        faceModelName: "",
        faceLibraryUuids: [],
        faceSimilarityThreshold: 80,
        faceCapturePhotoQualities: ["HIGH", "NORMAL", "LOW"],
        timeList: [
          {
            startTime: "",
            endTime: ""
          }
        ],
        recentDays: 0,
        statisticType: "",
        videoSource: {},
        otherVideoSource: [],
        notInVideoSource: [],
        notInlibrary: "",
        captureInterval: "",
        enabled: 1,
        remarks: ""
      },
      numOptions: [],
      rules: {
        faceModelName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { whitespace: true, message: "不允许输入空格", trigger: "blur" },
          { min: 1, max: 32, message: "长度在 1 到 32 个字符", trigger: "blur" }
        ],
        faceLibraryUuids: [
          { type: 'array', required: true, message: '请选择人脸库', trigger: 'change' },
        ],
        faceSimilarityThreshold: [
          { required: true, message: "相似度不能为空", trigger: "blur" },
        ],
        faceCapturePhotoQualities: [
          { type: 'array', required: true, message: '请选择图片需达到的质量', trigger: 'change' },
        ],
      },
      faceDBSelectedList: [],
      isShowAddFaceDB: false,
      allVideoSource: [
        {
          localType: "videoSource",
          channelList: [],
          logic: "",
          frequency: 0,
          leastNumberOfChannel: 0,
        }
      ],
      initSelectFaceData: []
    };
  },
  created() {},
  mounted() {
    // this.initData();
  },
  methods: {
    initData() {
      // this.houseTypeOptions = this.$common.getEnumByGroupStr("house_t");
    },
    resetFormData() {
      this.formLabelAlign = {
        faceModelName: "",
        faceLibraryUuids: [],
        faceSimilarityThreshold: 80,
        faceCapturePhotoQualities: ["HIGH", "NORMAL", "LOW"],
        timeList: [
          {
            startTime: "",
            endTime: ""
          }
        ],
        recentDays: 0,
        statisticType: "",
        videoSource: {},
        otherVideoSource: [],
        notInVideoSource: [],
        notInlibrary: "",
        captureInterval: "",
        enabled: 1,
        remarks: ""
      };
    },
    onClickConfirm() {
      this.$refs.modelForm.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            this.addIntelModel();
          } else {
            this.editIntelModel();
          }
        } else {
          this.$cToast.error("请正确填写内容");
        }
      });
    },
    onClickCancel() {
      this.resetFormData();
      this.$emit("onCancel");
    },
    addIntelModel() {
      this.$intelModelHttp.addIntelModel(this.formLabelAlign).then(res => {
        let body = res.data;
        this.modelSuccess(body);
      });
    },
    modelSuccess(body) {
      this.$cToast.success(body.msg);
      this.resetFormData();
      this.$emit("onConfirm");
    },
    editIntelModel() {
      this.$intelModelHttp.editIntelModel(this.formLabelAlign).then(res => {
        let body = res.data;
        this.modelSuccess(body);
      });
    },
    addTimePicker(index) {
      this.formLabelAlign.timeList.splice(index + 1, 0, {
        startTime: "",
        endTime: ""
      });
    },
    reduceTimePicker(index) {
      this.formLabelAlign.timeList.splice(index, 1);
    },
    addDevRes(index) {
      this.allVideoSource.splice(index + 1, 0, {
        localType: "",
        channelList: [],
        logic: "",
        frequency: 0,
      });
    },
    reduceDevRes(index) {
      this.allVideoSource.splice(index, 1);
    },
    addFaceDB() {
      this.initSelectFaceData = this.$common.copyArray(this.faceDBSelectedList, this.initSelectFaceData);
      this.isShowAddFaceDB = true;
    },
    confirmAddFaceDB(val) {
      this.faceDBSelectedList = this.$common.copyArray(
        val,
        this.faceDBSelectedList
      );
      this.isShowAddFaceDB = false;
      this.formLabelAlign.faceLibraryUuids = [];
      this.faceDBSelectedList.forEach(v => {
        this.formLabelAlign.faceLibraryUuids.push(v.faceLibraryUuid);
        if (v.faceLibraryType === "systemFaceLib") {
          this.staffTypeOption.forEach(v => {
            if (v.checked) {
              this.formLabelAlign.systemStaffLibraryTypes.push(v.typeStr);
            }
          });
        }
      });
      this.$refs.modelForm.validateField('faceLibraryUuids');
    },
    cancelAddFaceDB() {
      this.isShowAddFaceDB = false;
    },
    deleteItem(item) {
      for (let [i, v] of this.faceDBSelectedList.entries()) {
        if (v.id === item.id) {
          this.faceDBSelectedList.splice(i, 1);
        }
      }
      this.$refs.selectFace.deleteItem(item);
    }
  },
  watch: {
    "formLabelAlign.faceCapturePhotoQualities": {
      handler(val) {
        this.$refs.modelForm.validateField('faceCapturePhotoQualities');
      },
      deep: true
    }
  },
  destroyed() {}
};
</script>
<style lang="scss">
.control-main-add {
  .el-form-item__label {
    font-family: PingFangSC-Regular;
    font-size: 12px !important;
    color: #dddddd;
  }
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.control-main-add {
  width: 100%;
  height: 100%;
  padding: 1.2% 1.5%;
  box-sizing: border-box;
}
.access-main {
  width: 1000px;
  height: 100%;
  background: #212325;
  padding: 0 1.5%;
  box-sizing: border-box;
  position: relative;
  .dialog-title {
    height: 75px;
    border: {
      width: 0 0 1px 0;
      color: rgba(255, 255, 255, 0.1);
      style: dashed;
    }
    display: flex;
    align-items: center;
    .title-text {
      height: 20px;
      line-height: 20px !important;
      font-family: " PingFangSC-Regular";
      font-size: 14px;
      color: #ffffff;
      padding-left: 10px;
      line-height: 50px;
      border-left: 3px solid #20cc96;
    }
    .title-button {
      margin-left: auto;
      margin-right: 0;
    }
  }
  .form {
    height: calc(100% - 190px);
    overflow-y: auto;
    padding: 12px 0;
    .info-form {
      .el-form-item {
        margin-bottom: 10px;
      }
      padding: 1% 2%;
      box-sizing: border-box;
      .left-space {
        margin-left: 13px;
      }
      .time-select {
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #dddddd;
        .time-item {
          display: flex;
          align-items: center;
        }
      }
      .time-interal {
        width: 250px;
      }
    }
  }
  .unit {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #dddddd;
  }
  .footer {
    position: absolute;
    bottom: 0px;
    left: 20px;
    width: 96%;
    height: 75px;
    border: {
      width: 1px 0 0 0;
      color: rgba(255, 255, 255, 0.1);
      style: dashed;
    }
    .bottom-button {
      position: absolute;
      right: 0px;
      top: 18px;
    }
  }
  .add-item {
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #26d39d;
    cursor: pointer;
    margin-left: 8px;
  }
  .item-select {
    display: flex;
    align-content: flex-start;
    flex-flow: row wrap;
    .select-item {
      height: 32px;
      padding: 0 12px;
      box-sizing: border-box;
      position: relative;
      display: flex;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #dddddd;
      background: rgba($color: #ffffff, $alpha: 0.05);
      border-radius: 3px;
      margin-bottom: 10px;
      margin-right: 15px;
      .del-image {
        position: absolute;
        top: -16px;
        right: -5px;
        cursor: pointer;
      }
      .system-select {
        height: 100%;
        border: {
          width: 0 0 0 1px;
          style: solid;
          color: rgba($color: #ffffff, $alpha: 0.1);
        }
        margin-left: 10px;
        padding-left: 10px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
