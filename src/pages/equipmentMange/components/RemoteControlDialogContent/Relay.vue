<template>
  <div class='wrap relay'>
    <div class="title cube">
      报警输出
    </div>
    <el-form ref="form"
             class='deviceInfoPanel'
             label-width="180px">

      <div v-for="(item,index) in data"
           :key="index">
        <el-form-item label="启用/屏蔽继电器输出：">
          <el-switch v-model="item.enable"
                     active-color="rgb(38,78,70)"
                     inactive-color="rgb(75,78,82)">
          </el-switch>
        </el-form-item>

        <el-form-item label="名称："
                      prop="name">
          <el-input v-model='item.name'
                    readonly="readonly">

          </el-input>
        </el-form-item>

        <el-form-item label="输出持续时间（秒）："
                      prop="outputtime">
          <el-input v-model='item.outputTime'
                    type="number">

          </el-input>
        </el-form-item>
        <div class="dash-line"
             style="margin-bottom:10px;"></div>
      </div>

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
      },
      data: [
        {
          turn: false,
          name: "",
          outputtime: "",
          channelUuid: ""
        }
      ]
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    save() {
      this.submit();
      // this.$refs.form.validate(valid => {
      //   if (valid) {
      //     // alert("submit!");
      //   } else {
      //     console.log("error submit!!");
      //     return false;
      //   }
      // });
    },
    getData() {
      api.getRelay(this.deviceUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          let data = res.data.data || [];
          for (let i = 0, len = data.length; i < len; i++) {
            data[i].outputTime = data[i].outputTime / 1000;
            data[i].enable = data[i].enable === 1;
          }
          this.data = data;
        }
      });
    },
    submit() {
      // let data = {
      //   enable: this.data.turn ? 1 : 0,
      //   name: this.data.name,
      //   outputtime: this.data.outputtime,
      //   channelUuid: this.data.channelUuid
      // };
      let data = JSON.parse(JSON.stringify(this.data));
      for (let i = 0, len = data.length; i < len; i++) {
        data[i].outputTime = data[i].outputTime * 1000;
        data[i].enable = data[i].enable ? 1 : 0;
      }
      api.setRelay(data).then(res => {
        console.log(res);
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
