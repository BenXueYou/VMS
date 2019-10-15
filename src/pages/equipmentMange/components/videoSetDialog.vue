<template>
  <el-dialog title='设备名称-设备'
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :append-to-body="true"
             class="editEquip"
             :visible.sync="editEquipmentDialogVisible">
    <div class='wrap videoset'>
      <div class="title ">
        <el-checkbox class='checkbox'
                     style='margin-right:10px;'
                     v-model="data.isvideoset"
                     size='small'>

        </el-checkbox>
        是否启用人脸识别
      </div>
      <el-form ref="form"
               :rules="rules"
               :model="data"
               class='deviceInfoPanel'
               label-width="160px">
        <el-form-item label="请添加人脸库："
                      prop="interval">
          <el-button class='iconButton'
                     @click="openDB(item)"
                     type="primary"
                     size='small'>
            <img :src="icons.tianjia"
                 alt="">
            添加
          </el-button>
          <span>共2个</span>
          <div>
            <gt-button class='sbtn'
                       @close="delteDBitem(index)"
                       v-for="(item,index) in faceDBArr"
                       :key="index"
                       :icon="icons.door">
              {{item.label}}
            </gt-button>
          </div>
        </el-form-item>

        <el-form-item label="人脸库自动同步间隔："
                      prop="interval">
          <el-input v-model='data.interval'
                    class='interval'
                    type="number">
          </el-input>
          <span class='timetips'>
            小时
          </span>
          <el-button type="primary"
                     size="middle">立即同步</el-button>
        </el-form-item>

        <el-button type="primary"
                   class='marginLeft'
                   @click='save'>
          确定
        </el-button>
        <el-button type="primary"
                   @click='close'>
          取消
        </el-button>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import icons from "@/common/js/icon.js";
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  name: "videoset",
  props: {
    deviceUuid: {
      type: String,
      default() {
        return "";
      }
    },
    width: {
      type: String,
      default() {
        return "600px";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
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
      faceDBArr: [],
      icons,
      editEquipmentDialogVisible: false,
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
        isvideoset: true
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    openDB() {},
    delteDBitem(item) {},
    close() {
      this.$emit("update:visible", false);
    },
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
            isvideoset: data.enable === 1
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
        enable: this.data.isvideoset ? 1 : 0,
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
  },
  watch: {
    visible(val) {
      if (val) {
      } else {
      }
      this.editEquipmentDialogVisible = this.visible;
    }
  }
};
</script>

<style lang="scss">
@import "@/style/variables.scss";
.videoset {
  .iconButton {
    @include buttonnoborder;
  }
  input {
    width: 250px;
    @include input30;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  button {
    @include button30;
  }
  .marginLeft {
    margin-left: 120px;
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
    width: 90%;
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
