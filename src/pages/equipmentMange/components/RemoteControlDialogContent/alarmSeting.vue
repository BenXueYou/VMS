<template>
  <div class='wrap relay'>
    <!-- <div class="title cube">
      报警输出
    </div> -->
    <el-form ref="form"
             :rules="rules"
             :model="data"
             class='deviceInfoPanel'
             label-width="180px">

      <el-form-item label="启用报警抓拍图片：">
        <el-switch v-model="data.snap"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <el-form-item label="静默报警：">
        <el-switch v-model="data.silent"
                   active-color="rgb(38,78,70)"
                   inactive-color="rgb(75,78,82)">
        </el-switch>
      </el-form-item>

      <el-button type="primary"
                 @click='save'>
        保存
      </el-button>
    </el-form>
  </div>
</template>

<script>
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  name: "relay",
  props: {
    deviceUuid: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      data: {
        snap: false,
        silent: false
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 4,
            max: 32,
            message: "长度在 4 - 32 个字符串",
            trigger: "blur"
          }
        ],
        outputtime: [
          {
            required: true,
            message: "请输入时间"
          }
        ]
      }
    };
  },
  mounted() {
    this.getAlarmData();
  },
  methods: {
    getAlarmData() {
      api.getAlarm(this.deviceUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          let data = res.data.data;
          this.data.snap = data.snap === 1;
          this.data.silent = data.silent === 1;
        }
      });
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          api
            .setAlarm(
              {
                silent: this.data.silent ? 1 : 0,
                snap: this.data.snap ? 1 : 0
              },
              this.deviceUuid
            )
            .then(res => {
              console.log(res);
              if (res.data.success) {
                this.$message.success("保存成功！");
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/style/variables.scss";
.relay {
  input {
    width: 200px;
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
