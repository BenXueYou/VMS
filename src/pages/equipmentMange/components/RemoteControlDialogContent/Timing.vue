<template>
  <div class='wrap timing'>
    <div class="title ">
      <el-checkbox class='checkbox'
                   style='margin-right:10px;'
                   v-model="data.istiming"
                   size='small'>

      </el-checkbox>
      启用校时
    </div>
    <el-form ref="form"
             :rules="rules"
             :model="data"
             class='deviceInfoPanel'
             label-width="120px">

      <el-form-item label="校时方式："
                    prop="way">
        <el-select v-model="data.way"
                   placeholder="">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="服务器地址："
                    v-if="data.way==='server'"
                    prop="serverAddress">
        <el-input v-model='data.serverAddress'>

        </el-input>
      </el-form-item>

      <!-- <el-form-item label="端口："
                    prop="port">
        <el-input v-model='data.port'
                  type="number">

        </el-input>
      </el-form-item> -->

      <el-form-item label="校时间隔："
                    prop="interval">
        <el-input v-model='data.interval'
                  class='interval'
                  type="number">
        </el-input>
        <span class='timetips'>
          小时
        </span>
      </el-form-item>

      <el-button type="primary"
                 :disabled="!OwnAuthDisabled"
                 @click='save'>
        保存
      </el-button>
    </el-form>
  </div>
</template>

<script>
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  name: "timing",
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
    const validatorlength = (rule, value = "", callback) => {
      if (parseInt(value) <= 0) {
        callback(new Error("时间间隔大于等于1"));
      } else {
        callback();
      }
    };
    return {
      options: [
        {
          label: "平台校时",
          value: "platform"
        },
        {
          label: "NTP校时",
          value: "server"
        }
      ],
      rules: {
        way: [{ required: true, message: "请输入校时方法" }],
        port: [{ required: true, message: "请输入端口" }],
        serverAddress: [{ required: true, message: "请输入服务器地址" }],
        interval: [
          { required: true, validator: validatorlength, trigger: "blur" }
        ]
      },
      data: {
        way: "platform",
        port: "1",
        serverAddress: "",
        interval: "",
        istiming: true
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    save() {
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
      api.getJiaoXiao(this.deviceUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          let data = res.data.data;
          this.data = {
            way: data.type,
            port: "",
            serverAddress: data.ntp,
            interval: data.intervals,
            istiming: data.enable === 1
          };
        }
      });
    },
    submit() {
      if (!this.data.interval) {
        this.$message.error("请填写校时间隔!");
        return;
      }
      let data = {
        enable: this.data.istiming ? 1 : 0,
        intervals: this.data.interval.toString(),
        ntp: this.data.serverAddress,
        type: this.data.way
      };
      api.setJiaoXiao(data, this.deviceUuid).then(res => {
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
.timing {
  input {
    width: 250px;
    @include input30;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  button {
    margin-left: 120px;
    @include button30;
  }
  .interval {
    width: 66px;
    input {
      width: 66px;
    }
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
      padding-left: 10px;
      @include font-s;
    }
  }
}
</style>
