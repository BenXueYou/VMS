<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :modal="false"
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
        <el-form-item label="请添加人脸库：">
          <el-button class='iconButton'
                     @click="openDB()"
                     type="primary"
                     size='small'>
            <img :src="icons.tianjia"
                 alt="">
            添加
          </el-button>
          <span>共{{initSelectData.length}}个</span>
          <div>
            <gt-button class='sbtn'
                       @close="delteDBitem(index)"
                       v-for="(item,index) in initSelectData"
                       :key="index"
                       :icon="icons.door">
              {{item.libraryName||item.faceLibraryName}}
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
            h
          </span>
          <el-button type="primary"
                     @click="nowSync"
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
        <select-face-d-b :isShow.sync="isShow"
                         :initSelectData="initSelectData"
                         @onConfirm="onConfirm"
                         @onCancel="onCancel"></select-face-d-b>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import icons from "@/common/js/icon.js";
import * as api from "@/pages/equipmentMange/ajax.js";
import SelectFaceDB from "@/common/SelectFaceDB";
export default {
  name: "videoset",
  components: {
    SelectFaceDB
  },
  props: {
    deviceUuid: {
      type: String,
      default() {
        return "";
      }
    },
    title: {
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
      isShow: false,
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
      },
      initSelectData: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      return {
        // 填写需要更新的字段即可
        enable: this.data.isvideoset, // 是否启动人脸识别
        librarys: this.initSelectData.map(i => {
          i.libraryUuid = i.faceLibraryUuid;
          return i;
        }),
        autoSyncIntervalMin: this.data.interval * 60 // 自动同步间隔(单位：分钟)
      };
    },
    nowSync() {
      let data = this.getData();
      if (!data.enable) {
        this.$message.warning('请开启人脸识别');
        return;
      }
      api.setImmediateSyncSettingl(this.deviceUuid, data).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$message.success("立即同步成功！");
        }
      });
    },
    getVideoDeviceSetting() {
      api
        .getVideoDeviceSetting(this.deviceUuid)
        .then(res => {
          console.log(res);
          if (res.data.success) {
            let data = res.data.data || {};
            this.data = {
              isvideoset: data.enable || false,
              interval: (data.autoSyncIntervalMin || 0) / 60
            };
            this.initSelectData = (data.librarys || []).map(i => {
              i.faceLibraryUuid = i.libraryUuid;
              return i;
            });
          } else {
          }
        })
        .catch(() => {
          // 如果没有获取到数据，则关闭这个弹窗
          this.close();
        });
    },
    onConfirm(list) {
      console.log(list);
      this.initSelectData = list;
    },
    onCancel() {
      this.isShow = false;
    },
    openDB() {
      this.isShow = true;
    },
    delteDBitem(index) {
      this.initSelectData.splice(index, 1);
    },
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
    submit() {
      let data = this.getData();
      api.setDelaySyncSetting(this.deviceUuid, data).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$message.success("更新成功！");
          this.close();
        }
      });
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getVideoDeviceSetting();
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
    .sbtn {
      margin: 5px;
    }
    .timetips {
      display: inline-block;
      padding-left: 10px;
      @include font-s;
    }
  }
}
</style>
