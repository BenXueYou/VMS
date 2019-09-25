<template>
  <div class="control-main-add">
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
                 ref="addUnitForm"
                 label-position="right"
                 label-width="180px"
                 :model="formLabelAlign"
                 class="info-form">
          <el-form-item label="名称："
                        prop="name">
            <el-input class="time-interal left-space"
                      v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="人脸库："
                        prop="name">
          </el-form-item>
          <el-form-item label="相似度不低于："
                        prop="name">
            <el-input class="time-interal left-space"
                      v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="抓拍图片需达到的质量："
                        prop="selectedButtons">
            <pic-qulity-select :selectedButtons.sync="formLabelAlign.selectedButtons"
                               class="left-space" />
          </el-form-item>
          <el-form-item label="时间段：">
            <div class="left-space time-select">
              <template v-for="(item, index) in timePickerList">
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
                          v-model="formLabelAlign.name"></el-input>
                <span>天</span>
                <el-select v-model="formLabelAlign.num"
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
                <template v-for="(item, index) in devResList">
                  <div :key="index">
                    <div v-if="index === 0">
                      <el-select v-model="formLabelAlign.num"
                                 size="small"
                                 style="width: 180px;"
                                 placeholder="请选择视频源">
                        <el-option v-for="item in numOptions"
                                   :key="item.typeStr"
                                   :label="item.typeName"
                                   :value="item.typeStr">
                        </el-option>
                      </el-select>
                      <el-select v-model="formLabelAlign.num"
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
                                v-model="formLabelAlign.name"
                                type="number"></el-input>
                      <span>次</span>
                      <span style="margin-left: 40px;">且至少</span>
                      <el-input style="width: 60px;"
                                type="number"
                                v-model="formLabelAlign.name"></el-input>
                      <span>个摄像机抓拍</span>
                      <img src="@/assets/images/faceModule/add.png"
                           width="14px"
                           style="margin: 0 5px; cursor: pointer;"
                           @click="addDevRes(index)"
                           height="14px">
                    </div>
                    <div v-if="index !== 0">
                      <el-select v-model="formLabelAlign.num"
                                 size="small"
                                 style="width: 120px;"
                                 placeholder="同时符合">
                        <el-option v-for="item in numOptions"
                                   :key="item.typeStr"
                                   :label="item.typeName"
                                   :value="item.typeStr">
                        </el-option>
                      </el-select>
                      <el-select v-model="formLabelAlign.num"
                                 size="small"
                                 style="width: 180px; margin-left: 15px;"
                                 placeholder="请选择视频源">
                        <el-option v-for="item in numOptions"
                                   :key="item.typeStr"
                                   :label="item.typeName"
                                   :value="item.typeStr">
                        </el-option>
                      </el-select>
                      <el-select v-model="formLabelAlign.num"
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
                                v-model="formLabelAlign.name"
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
          <el-form-item label="模型状态："
                        prop="status">
            <el-switch v-model="formLabelAlign.status"
                       class="left-space"
                       active-color="rgba(32,204,150,0.2)"
                       inactive-color="rgba(255,255,255,0.2)"></el-switch>
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

export default {
  components: {
    PicQulitySelect
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
        name: "",
        selectedButtons: [],
        isAlarm: 1,
        num: "",
        status: "",
        remark: ""
      },
      numOptions: [],
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { whitespace: true, message: "不允许输入空格", trigger: "blur" },
          { min: 1, max: 32, message: "长度在 1 到 32 个字符", trigger: "blur" }
        ],
        selectedButtons: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        isAlarm: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        vioce: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        status: [{ required: true, message: "名称不能为空", trigger: "blur" }]
      },
      timePickerList: [
        {
          startTime: "",
          endTime: ""
        }
      ],
      devResList: [
        {}
      ]
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
    resetFormData() {},
    onClickConfirm() {},
    onClickCancel() {
      this.resetFormData();
      this.$emit("onCancel");
    },
    addTimePicker(index) {
      this.timePickerList.splice(index + 1, 0, {
        startTime: "",
        endTime: ""
      });
    },
    reduceTimePicker(index) {
      this.timePickerList.splice(index, 1);
    },
    addDevRes(index) {
      this.devResList.splice(index + 1, 0, {
        startTime: "",
        endTime: ""
      });
    },
    reduceDevRes(index) {
      this.devResList.splice(index, 1);
    },
  },
  watch: {},
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
}
</style>
