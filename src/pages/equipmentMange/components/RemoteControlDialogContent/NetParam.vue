<template>
  <div class='wrap newparam'>
    <div class="title cube">
      网络参数
    </div>

    <el-form ref="form"
             :rules="rules"
             :model="data"
             class='deviceInfoPanel'
             label-width="120px">

      <el-form-item label="IP地址："
                    prop="ip">
        <el-input v-model='data.ip'>

        </el-input>
      </el-form-item>

      <el-form-item label="子网掩码："
                    prop="subnetMask">
        <el-input v-model='data.subnetMask'>
        </el-input>
      </el-form-item>

      <el-form-item label="默认网关："
                    prop="gateway">
        <el-input v-model='data.gateway'>
        </el-input>
      </el-form-item>

      <el-form-item label="DNS："
                    prop="dns">
        <el-input v-model='data.dns'>
        </el-input>
      </el-form-item>

      <el-form-item label=""
                    prop="radioFlag">
        <el-radio-group v-model="radioFlag"
                        @change="changeWay">
          <el-radio label="IP"
                    value='ip'></el-radio>
          <el-radio label="域名"
                    value='domain'></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="中心地址："
                    prop="iotng">
        <el-input v-model='data.iotng'>
        </el-input>
      </el-form-item>

      <el-form-item label="端口："
                    v-if="radioFlag=='IP'"
                    prop="iotngPort">
        <el-input v-model='data.iotngPort'>
        </el-input>
      </el-form-item>

      <el-form-item label="MAC地址："
                    prop="mac">
        <el-input v-model='data.mac'
                  readonly>
        </el-input>
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
  name: "newparam",
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
        ip: "",
        subnetMask: "",
        gateway: "",
        dns: "",
        way: "IP",
        iotng: "",
        iotngPort: "",
        mac: ""
      },
      radioFlag: "IP",
      rules: {
        ip: [{ required: true, message: "请输入IP地址" }],
        subnetMask: [{ required: true, message: "请输入子网掩码" }],
        gateway: [{ required: true, message: "请输入默认网关" }],
        dns: [{ required: true, message: "请输入DNS" }],
        way: [{ required: true, message: "请输入IP或域名" }],
        iotng: [{ required: true, message: "请输入中心地址" }],
        iotngPort: [{ required: false, message: "请输入端口" }],
        mac: [{ required: true, message: "请输入MAC地址" }],
        lastIP: "",
        lastDomain: ""
      }
    };
  },
  mounted() {
    this.getData();
    setTimeout(() => {
      this.$refs.form.resetFields();
    }, 10);
  },
  methods: {
    changeWay(val) {
      console.log(val);
      if (val === "IP") {
        this.lastDomain = this.data.iotng;
        this.data.iotng = this.lastIP;
      } else {
        this.lastIP = this.data.iotng;
        this.data.iotng = this.lastDomain;
      }
    },
    getData() {
      api.getDeivceInfo(this.deviceUuid).then(res => {
        if (res.data.success) {
          let data = res.data.data;
          if (data.radioFlag === "ip") {
            this.radioFlag = "IP";
          } else {
            this.radioFlag = "域名";
          }
          this.data = data;
        }
      });
    },
    submitData() {
      let data = {
        ip: this.data.ip,
        dns: this.data.dns,
        deviceUuid: this.data.deviceUuid,
        gateway: this.data.gateway,
        subnetMask: this.data.subnetMask,
        port: this.data.iotngPort,
        mac: this.data.mac,
        iotng:
          this.radioFlag === "IP"
            ? this.data.iotng + ":" + this.data.iotngPort
            : this.data.iotng,
        radioFlag: this.radioFlag === "IP" ? "ip" : "domain"
      };
      console.log(JSON.stringify(data));
      api.setNet(data).then(res => {
        if (res.data.success) {
          this.$message.success("保存成功!");
        }
      });
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // alert("submit!");
          this.submitData();
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
.newparam {
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
