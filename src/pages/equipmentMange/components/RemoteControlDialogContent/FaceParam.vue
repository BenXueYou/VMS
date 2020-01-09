<template>
  <div class='wrap faceParam'>
    <div class="title cube">
      人脸识别参数
    </div>
    <el-form ref="form"
             :rules="rules"
             :model="data"
             class='deviceInfoPanel'
             label-width="180px">

      <el-form-item label="活体检测：">
        <el-switch v-model="data.huoti"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <el-form-item label="抓拍图片压缩："
                    prop="yasuo">
        <el-switch v-model="data.yasuo"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <el-form-item label="人脸识别阈值："
                    prop="score">
        <el-input v-model='data.score'
                  type="number">
        </el-input>

        <span class='timetips'>
          (1-99)
        </span>
      </el-form-item>
      <el-button type="primary"
                 disabled="!OwnAuthDisabled"
                 @click='save'>
        保存
      </el-button>
    </el-form>
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
      if (value > 0 && value < 100) {
        if (value.toString().indexOf(".") === -1) {
          callback();
        } else {
          callback(new Error("人脸识别阈值不可以是小数!"));
        }
      } else {
        callback(new Error("请输入1-99的值"));
      }
    };
    return {
      data: {
        huoti: false,
        yasuo: false,
        score: ""
      },
      rules: {
        score: [
          {
            required: true,
            validator: validatorlength,
            trigger: "blur"
          }
        ]
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
      api.getFace(this.deviceUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          let data = res.data.data;
          this.data = {
            huoti: data.live === 1,
            yasuo: data.zip === 1,
            score: data.threshold
          };
        }
      });
    },
    submit() {
      let data = {
        live: this.data.huoti ? 1 : 0,
        zip: this.data.yasuo ? 1 : 0,
        threshold: parseInt(this.data.score)
      };
      api.setFace(data, this.deviceUuid).then(res => {
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
.faceParam {
  $inputwidth: 66px;
  .el-input {
    width: $inputwidth;
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
.wrap {
  height: 100%;
  padding: 13px 15px;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
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
