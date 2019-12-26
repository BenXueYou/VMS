<template>
  <div class="control-main-add">
    <select-face :isShow="isShowAddFaceDB"
                 ref="selectFace"
                 :initSelectData="initSelectFaceData"
                 faceLibraryType="systemFaceLib,dynamicFaceLib,staticFaceLib"
                 @onCancel="cancelAddFaceDB"
                 @onConfirm="confirmAddFaceDB" />
    <select-video :isShow="isShowAddVideoSrc"
                  ref="selectVideo"
                  :initSelectData="initSelectVideoData"
                  @onCancel="cancelAddVideoSrc"
                  @onConfirm="confirmAddVideoSrc" />
    <div class="access-main">
      <div class="dialog-title">
        <div class="title-text">{{isAdd ? "新建" : "编辑"}}布控</div>
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
                 ref="monitorForm"
                 label-position="right"
                 label-width="180px"
                 :model="formLabelAlign"
                 class="info-form">
          <el-form-item label="名称："
                        prop="faceMonitorName">
            <el-input class="time-interal left-space"
                      v-model="formLabelAlign.faceMonitorName"></el-input>
          </el-form-item>
          <el-form-item label="人脸库："
                        prop="faceLibraryUuids"
                        required>
            <div class="add-item"
                 v-if="formLabelAlign.faceMonitorUuid === 'temp_face_monitoruuid00020191104' ? false : true">
              <img src="@/assets/images/faceModule/add.png"
                   style="cursor: pointer;"
                   @click="addFaceDB">
              <span style="cursor: pointer;"
                    @click="addFaceDB">添加</span>
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
                       v-if="formLabelAlign.faceMonitorUuid === 'temp_face_monitoruuid00020191104' ? false : true"
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
                       v-if="formLabelAlign.faceMonitorUuid === 'temp_face_monitoruuid00020191104' ? false : true"
                       @click="deleteItem(item)">
                    <img src="@/assets/images/delete_x.png"
                         width="13px"
                         height="13px">
                  </div>
                </div>
              </template>
            </div>
          </el-form-item>
          <el-form-item label="视频源："
                        prop="channelUuids"
                        required>
            <div class="add-item"
                 v-if="formLabelAlign.faceMonitorUuid === 'temp_face_monitoruuid00020191104' ? false : true">
              <img src="@/assets/images/faceModule/add.png"
                   style="cursor: pointer;"
                   @click="addVideoSource">
              <span style="cursor: pointer;"
                    @click="addVideoSource">添加</span>
            </div>
            <div class="item-select">
              <template v-for="(item, index) in videoSrcSelectedList">
                <div :key="index"
                     class="select-item">
                  <img src="@/assets/images/person_g.png"
                       width="11px"
                       height="11px">
                  <span style="margin-left: 4px">{{item.label}}</span>
                  <div class="del-image"
                       v-if="formLabelAlign.faceMonitorUuid === 'temp_face_monitoruuid00020191104' ? false : true"
                       @click="deleteVideoItem(item)">
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
          <el-form-item label="目标人列表："
                        prop="reservedCount">
            <el-input class="time-interal left-space"
                      style="width: 60px"
                      type="number"
                      v-model="formLabelAlign.reservedCount"></el-input>
            <span class="unit">位</span>
          </el-form-item>
          <el-form-item label="是否报警："
                        prop="alarmed">
            <el-radio-group v-model="formLabelAlign.alarmed"
                            class="left-space">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否报警弹窗："
                        prop="popup">
            <el-radio-group v-model="formLabelAlign.popup"
                            class="left-space">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="请选择报警声音："
                        prop="alarmSoundUrl">
            <el-select class="time-interal left-space"
                       v-model="formLabelAlign.alarmSoundUrl"
                       size="small"
                       @change="alarmSelect"
                       placeholder="请选择">
              <el-option v-for="item in alarmSoundOption"
                         :key="item.soundUrl"
                         :label="item.soundName"
                         :value="item.soundUrl">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="布控颜色："
                        prop="taskColour">
            <el-color-picker v-model="formLabelAlign.taskColour"
                             size="mini"
                             show-alpha
                             style="margin-top: 7px;margin-left: 8px;"></el-color-picker>
          </el-form-item>
          <el-form-item label="布控状态："
                        prop="enabled"
                        required>
            <el-switch v-model="formLabelAlign.enabled"
                       class="left-space"
                       active-color="rgba(32,204,150,0.2)"
                       inactive-color="rgba(255,255,255,0.2)"
                       :active-value="1"
                       :disabled="formLabelAlign.faceMonitorUuid === 'temp_face_monitoruuid00020191104' ? true : false"
                       :inactive-value="0"></el-switch>
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
import SelectVideo from "@/common/SelectVideoSource";

export default {
  components: {
    PicQulitySelect,
    SelectFace,
    SelectVideo,
  },
  props: {
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const validatorlength = (rule, value, callback) => {
      if (parseInt(value) < 1 || parseInt(value) > 20) {
        callback(new Error("目标人列表需为1-20"));
      } else {
        callback();
      }
    };
    return {
      formLabelAlign: {
        faceMonitorName: "",
        faceLibraryUuids: [],
        channelUuids: [],
        faceSimilarityThreshold: 80,
        faceCapturePhotoQualities: ["HIGH", "NORMAL", "LOW"],
        reservedCount: 20,
        alarmed: 1,
        popup: 0,
        alarmSoundName: "",
        alarmSoundUrl: "",
        taskColour: "",
        enabled: 1,
        systemStaffLibraryTypes: []
      },
      vioceOptions: [],
      rules: {
        faceMonitorName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { whitespace: true, message: "不允许输入空格", trigger: "blur" },
          { min: 1, max: 32, message: "长度在 1 到 32 个字符", trigger: "blur" }
        ],
        faceSimilarityThreshold: [
          { required: true, message: "相似度不能为空", trigger: "blur" },
        ],
        reservedCount: [
          { required: true, message: "目标人列表不能为空", trigger: "blur" },
          { validator: validatorlength, trigger: "blur" }
        ],
        alarmed: [
          { required: true, message: '请选择是否报警', trigger: 'change' },
        ],
        popup: [
          { required: true, message: '请选择是否报警弹窗', trigger: 'change' },
        ],
        taskColour: [
          { required: true, message: '请选择布控颜色', trigger: 'change' },
        ],
        faceCapturePhotoQualities: [
          { type: 'array', required: true, message: '请选择图片需达到的质量', trigger: 'change' },
        ],
        faceLibraryUuids: [
          { type: 'array', required: true, message: '请选择人脸库', trigger: 'change' },
        ],
        channelUuids: [
          { type: 'array', required: true, message: '请选择视频源', trigger: 'change' },
        ],
        alarmSoundUrl: [
          { required: true, message: '请选择报警声音', trigger: 'change' },
        ]
      },
      isShowAddFaceDB: false,
      isShowAddVideoSrc: false,
      faceDBSelectedList: [],
      videoSrcSelectedList: [],
      staffTypeOption: [],
      initSelectFaceData: [],
      initSelectVideoData: [],
      alarmSoundOption: [],
    };
  },
  created() {},
  mounted() {
    this.initData();
    this.getAlarmSound();
  },
  methods: {
    initData() {
      this.staffTypeOption = this.$common.getEnumByGroupStr("staff_t");
      this.staffTypeOption.forEach(v => {
        this.$set(v, "checked", false);
      });
    },
    resetFormData() {
      this.formLabelAlign = {
        faceMonitorName: "",
        faceLibraryUuids: [],
        channelUuids: [],
        faceSimilarityThreshold: 80,
        faceCapturePhotoQualities: ["HIGH", "NORMAL", "LOW"],
        reservedCount: 20,
        alarmed: 1,
        popup: 0,
        alarmSoundName: "",
        alarmSoundUrl: "",
        taskColour: "",
        enabled: 1,
        systemStaffLibraryTypes: []
      };
      this.faceDBSelectedList = [];
      this.videoSrcSelectedList = [];
      this.initData();
      this.$refs.monitorForm.resetFields();
    },
    onClickConfirm() {
      this.$refs.monitorForm.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            this.addMonitoringTask();
          } else {
            this.editMonitoringTask();
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
    formatParams() {
      this.formLabelAlign.systemStaffLibraryTypes = [];
      this.faceDBSelectedList.forEach(v => {
        if (v.faceLibraryType === "systemFaceLib") {
          this.staffTypeOption.forEach(v => {
            if (v.checked) {
              this.formLabelAlign.systemStaffLibraryTypes.push(v.typeStr);
            }
          });
        }
      });
    },
    addMonitoringTask() {
      this.formatParams();
      this.$faceControlHttp.addMonitoringTask(this.formLabelAlign).then(res => {
        let body = res.data;
        this.monitoringTaskSuccess(body);
      });
    },
    monitoringTaskSuccess(body) {
      this.$cToast.success(body.msg);
      this.resetFormData();
      this.$emit("onConfirm");
    },
    editMonitoringTask() {
      this.formatParams();
      this.$faceControlHttp
        .editMonitoringTask(this.formLabelAlign)
        .then(res => {
          let body = res.data;
          this.monitoringTaskSuccess(body);
        });
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
      });
      this.$refs.monitorForm.validateField('faceLibraryUuids');
    },
    cancelAddFaceDB() {
      this.isShowAddFaceDB = false;
    },
    addVideoSource() {
      this.initSelectVideoData = this.$common.copyArray(this.videoSrcSelectedList, this.initSelectVideoData);
      this.isShowAddVideoSrc = true;
    },
    confirmAddVideoSrc(val) {
      this.videoSrcSelectedList = this.$common.copyArray(
        val,
        this.videoSrcSelectedList
      );
      this.isShowAddVideoSrc = false;
      this.formLabelAlign.channelUuids = [];
      this.videoSrcSelectedList.forEach(v => {
        this.formLabelAlign.channelUuids.push(v.channelUuid);
      });
      this.$refs.monitorForm.validateField('channelUuids');
    },
    cancelAddVideoSrc() {
      this.isShowAddVideoSrc = false;
    },
    deleteItem(item) {
      this.formLabelAlign.faceLibraryUuids = [];
      for (let [i, v] of this.faceDBSelectedList.entries()) {
        if (v.faceLibraryUuid === item.faceLibraryUuid) {
          this.faceDBSelectedList.splice(i, 1);
        }
      }
      this.$refs.selectFace.deleteItem(item);
      this.faceDBSelectedList.forEach(v => {
        this.formLabelAlign.faceLibraryUuids.push(v.faceLibraryUuid);
      });
      this.$refs.monitorForm.validateField('faceLibraryUuids');
    },
    deleteVideoItem(item) {
      this.formLabelAlign.channelUuids = [];
      for (let [i, v] of this.videoSrcSelectedList.entries()) {
        if (v.id === item.id) {
          this.videoSrcSelectedList.splice(i, 1);
        }
      }
      this.$refs.selectVideo.deleteItem(item);
      this.videoSrcSelectedList.forEach(v => {
        this.formLabelAlign.channelUuids.push(v.channelUuid);
      });
      this.$refs.monitorForm.validateField('channelUuids');
    },
    setFromDataForEdit(detailData) {
      this.faceDBSelectedList = [];
      this.videoSrcSelectedList = [];
      this.formLabelAlign = this.$common.copyObject(detailData, this.formLabelAlign);
      this.$set(this.formLabelAlign, "faceLibraryUuids", []);
      this.$set(this.formLabelAlign, "channelUuids", []);
      if (this.formLabelAlign.libraryList) {
        this.formLabelAlign.libraryList.forEach(v => {
          this.formLabelAlign.faceLibraryUuids.push(v.faceLibraryUuid);
          this.faceDBSelectedList.push(v);
        });
      }
      if (this.formLabelAlign.channelList) {
        this.formLabelAlign.channelList.forEach(v => {
          this.formLabelAlign.channelUuids.push(v.channelUuid);
          this.videoSrcSelectedList.push({
            id: v.channelUuid,
            label: v.channelName,
            channelUuid: v.channelUuid,
            channelName: v.channelName
          });
        });
      }
      if (this.formLabelAlign.systemStaffLibraryTypes) {
        this.formLabelAlign.systemStaffLibraryTypes.forEach(v => {
          this.staffTypeOption.forEach(v2 => {
            if (v2.typeStr === v) {
              v2.checked = true;
            }
          });
        });
      }
    },
    getAlarmSound() {
      this.$faceControlHttp.getAlarmSound().then(res => {
        let body = res.data;
        this.getAlarmSoundSuccess(body);
      });
    },
    getAlarmSoundSuccess(body) {
      this.alarmSoundOption = body.data;
      this.alarmSoundOption.forEach(v => {
        if (v.defaulted) {
          this.formLabelAlign.alarmSoundName = v.soundName;
          this.formLabelAlign.alarmSoundUrl = v.soundUrl;
        }
      });
    },
    alarmSelect(item) {
      this.alarmSoundOption.forEach(v => {
        if (v.soundUrl === item) {
          this.formLabelAlign.alarmSoundName = v.soundName;
        }
      });
    }
  },
  watch: {
    "formLabelAlign.faceCapturePhotoQualities": {
      handler(val) {
        this.$refs.monitorForm.validateField('faceCapturePhotoQualities');
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
      .time-interal {
        width: 250px;
      }
    }
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
  .unit {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #dddddd;
  }
  .add-item {
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #26d39d;
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
