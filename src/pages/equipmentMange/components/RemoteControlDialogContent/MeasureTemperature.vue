<template>
  <div class='tempWrap'>
    <div class="title cube">
      体温配置
    </div>
    <div style='height:420px;overflow:auto;'>
      <el-form ref="form"
               :rules="rules"
               :model="data"
               class='deviceInfoPanel'
               label-width="180px">

        <el-form-item label="开启测温功能：">
          <el-switch v-model="data.tempMeasureEnable"
                     active-color="rgb(38,78,70)"
                     inactive-color="rgb(75,78,82)">
          </el-switch>
        </el-form-item>

        <el-form-item label="高温报警上传：">
          <el-switch v-model="data.highTempAlarmUploadEnable"
                     active-color="rgb(38,78,70)"
                     inactive-color="rgb(75,78,82)">
          </el-switch>
        </el-form-item>

        <el-form-item label="高温阈值："
                      prop="highTemperatureThrold">
          <el-input v-model='data.highTemperatureThrold'
                    type="number">
          </el-input>
          <span class='timetips'>
            ℃
          </span>
        </el-form-item>

        <el-form-item label="显示测温结果：">
          <el-switch v-model="data.showTempMeasureEnable"
                     active-color="rgb(38,78,70)"
                     inactive-color="rgb(75,78,82)">
          </el-switch>
        </el-form-item>

        <el-form-item label="播报测温结果：">
          <el-switch v-model="data.broadcastTempMeasureEnable"
                     active-color="rgb(38,78,70)"
                     inactive-color="rgb(75,78,82)">
          </el-switch>
        </el-form-item>

        <el-form-item label="测温参数：">
          <span class="operator"
                @click="opening=true"
                v-if="!opening">展开<img src="@/assets/temperature/slideup.png"
                 alt=""></span>
          <span class="operator"
                @click="opening=false"
                v-else>收起<img src="@/assets/temperature/slidedown.png"
                 alt=""></span>
        </el-form-item>

        <div v-show="opening">
          <el-form-item label="目标距离："
                        prop="destDistance">
            <el-input v-model='data.destDistance'
                      type="number">
            </el-input>
          </el-form-item>

          <el-form-item label="发射率："
                        prop="emissivity">
            <el-input v-model='data.emissivity'
                      type="number">
            </el-input>
          </el-form-item>

          <el-form-item label="气温："
                        prop="airTemperature">
            <el-input v-model='data.airTemperature'
                      type="number">
            </el-input>
          </el-form-item>

          <el-form-item label="相对湿度："
                        prop="relativeTemperature">
            <el-input v-model='data.relativeTemperature'
                      type="number">
            </el-input>
          </el-form-item>

          <el-form-item label="能见度："
                        prop="visibility">
            <el-input v-model='data.visibility'
                      type="number">
            </el-input>
          </el-form-item>

          <el-form-item label="降雨强度："
                        prop="rainfallIntensity">
            <el-input v-model='data.rainfallIntensity'
                      type="number">
            </el-input>
          </el-form-item>

          <el-form-item label="降雪强度："
                        prop="snowfallIntensity">
            <el-input v-model='data.snowfallIntensity'
                      type="number">
            </el-input>
          </el-form-item>

          <el-form-item label="修正参数1："
                        prop="correctionParameter1">
            <el-input v-model='data.correctionParameter1'
                      type="number">
            </el-input>
          </el-form-item>

          <el-form-item label="修正参数2："
                        prop="correctionParameter2">
            <el-input v-model='data.correctionParameter2'
                      type="number">
            </el-input>
          </el-form-item>

          <el-form-item label="大气透过率："
                        prop="atmosphericTransmittance">
            <el-input v-model='data.atmosphericTransmittance'
                      type="number">
            </el-input>
          </el-form-item>

          <el-form-item label="窗口/滤光片透过率："
                        prop="windowFilterTransmittance">
            <el-input v-model='data.windowFilterTransmittance'
                      type="number">
            </el-input>
          </el-form-item>
        </div>

      </el-form>
    </div>
    <el-button type="primary"
               style="margin:10px auto;display:block;"
               :disabled="!OwnAuthDisabled"
               @click='save'>
      保存
    </el-button>
  </div>
</template>

<script>
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  name: "faceParam",
  props: {
    ShowAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    OwnAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    deviceUuid: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    const validatorlength = (rule, value, callback) => {
      if (value > 30 && value < 42) {
        callback();
      } else {
        callback(new Error("请输入30-42的数字"));
      }
    };
    return {
      opening: false,
      data: {
        tempMeasureEnable: "int", // 测温功能使能
        highTempAlarmUploadEnable: "int", // 高温报警上传使能
        highTemperatureThrold: "float", // 高温阈值
        showTempMeasureEnable: "int", // 显示温度使能
        broadcastTempMeasureEnable: "int", // 播报温度使能
        tempMeasureParam: {
          // 测温参数配置
          destDistance: "float", // 目标距离
          emissivity: "float", // 发射率
          airTemperature: "float", // 气温
          relativeTemperature: "float", // 相对温度
          visibility: "float", // 能见度
          rainfallIntensity: "float", // 降雨强度
          snowfallIntensity: "float", // 降雪强度
          correctionParameter1: "float", // 修正参数1
          correctionParameter2: "float", // 修正参数2
          atmosphericTransmittance: "float", // 大气透过率
          windowFilterTransmittance: "float" // 窗口/滤光片透过率
        }
      },
      rules: {
        score: [
          {
            required: true,
            validator: validatorlength,
            trigger: "blur"
          }
        ],
        highTemperatureThrold: [{ validator: validatorlength, trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    save() {
      console.log(this.data);
      this.$refs.form.validate(valid => {
        if (valid) {
          // alert("submit!");
          this.submit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getData() {
      api.getTempMeasure(this.deviceUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          let data = res.data.data;
          this.data = {
            tempMeasureEnable: !!data.tempMeasureEnable,
            highTempAlarmUploadEnable: !!data.highTempAlarmUploadEnable,
            highTemperatureThrold: data.highTemperatureThrold,
            showTempMeasureEnable: !!data.showTempMeasureEnable,
            broadcastTempMeasureEnable: !!data.broadcastTempMeasureEnable,
            destDistance: data.tempMeasureParam.destDistance, // 目标距离
            emissivity: data.tempMeasureParam.emissivity, // 发射率
            airTemperature: data.tempMeasureParam.airTemperature, // 气温
            relativeTemperature: data.tempMeasureParam.relativeTemperature, // 相对温度
            visibility: data.tempMeasureParam.visibility, // 能见度
            rainfallIntensity: data.tempMeasureParam.rainfallIntensity, // 降雨强度
            snowfallIntensity: data.tempMeasureParam.snowfallIntensity, // 降雪强度
            correctionParameter1: data.tempMeasureParam.correctionParameter1, // 修正参数1
            correctionParameter2: data.tempMeasureParam.correctionParameter2, // 修正参数2
            atmosphericTransmittance:
              data.tempMeasureParam.atmosphericTransmittance, // 大气透过率
            windowFilterTransmittance:
              data.tempMeasureParam.windowFilterTransmittance // 窗口/滤光片透过率
          };
        }
      });
    },
    submit() {
      let data = {
        tempMeasureEnable: this.data.tempMeasureEnable ? 1 : 0, // 测温功能使能
        highTempAlarmUploadEnable: this.data.highTempAlarmUploadEnable ? 1 : 0, // 高温报警上传使能
        highTemperatureThrold: this.data.highTemperatureThrold, // 高温阈值
        showTempMeasureEnable: this.data.showTempMeasureEnable ? 1 : 0, // 显示温度使能
        broadcastTempMeasureEnable: this.data.broadcastTempMeasureEnable
          ? 1
          : 0, // 播报温度使能
        tempMeasureParam: {
          // 测温参数配置
          destDistance: this.data.destDistance, // 目标距离
          emissivity: this.data.emissivity, // 发射率
          airTemperature: this.data.airTemperature, // 气温
          relativeTemperature: this.data.relativeTemperature, // 相对温度
          visibility: this.data.visibility, // 能见度
          rainfallIntensity: this.data.rainfallIntensity, // 降雨强度
          snowfallIntensity: this.data.snowfallIntensity, // 降雪强度
          correctionParameter1: this.data.correctionParameter1, // 修正参数1
          correctionParameter2: this.data.correctionParameter2, // 修正参数2
          atmosphericTransmittance: this.data.atmosphericTransmittance, // 大气透过率
          windowFilterTransmittance: this.data.windowFilterTransmittance // 窗口/滤光片透过率
        }
      };
      api.setTempMeasure(data, this.deviceUuid).then(res => {
        if (res.data.success) {
          this.$message.success("保存成功！");
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/style/variables.scss";
.tempWrap {
  $inputwidth: 106px;
  .el-input {
    width: $inputwidth;
  }
  .operator {
    font-family: "PingFangSC-Regular";
    font-size: 12px;
    color: #00d8a0;
    text-align: right;
    cursor: pointer;
    img {
      margin-left: 5px;
    }
  }
  input {
    width: $inputwidth;
    @include input30;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  button {
    margin-left: 180px;
    @include button30;
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.tempWrap {
  height: 100%;
  padding: 13px 15px;
  box-sizing: border-box;
  overflow: auto;
  .title {
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    @include font-s;
  }
  .cube {
    position: relative;
    padding-left: 18px;
    box-sizing: border-box;
    &::after {
      content: "";
      position: absolute;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
      width: 5px;
      height: 5px;
      background-color: #aaa;
    }
  }
  .deviceInfoPanel {
    width: 80%;
    max-width: 400px;
    margin: 0 auto;
    .timetips {
      display: inline-block;
      @include font-s;
    }
  }
}
</style>
