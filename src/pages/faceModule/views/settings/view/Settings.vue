<template>
  <div class="setting-main">
    <div style="background-color: #212325;height:100%">
      <div class="mainBox">
        <el-header class="headerBox">
          <div>基础配置</div>
          <el-button :disabled="!OwnAuthDisabled"
                     type="primary"
                     @click="postData">保存</el-button>
        </el-header>
        <div class="bodyBox">
          <div class="bodyBoxDiv">
            <p>抓拍质量无效图片是否保存：</p>
            <p>抓拍查重：</p>
            <p v-if="queryBody.removeDuplicationImage">抓拍查重间隔：</p>
            <p v-if="queryBody.removeDuplicationImage">人脸查重相似度：</p>
          </div>
          <div class="bodyBoxDiv"
               style="text-align:left">
            <p class="bodyBoxDivRightP">
              <el-radio-group v-model="queryBody.saveQualityLowerImage">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </p>
            <p class="bodyBoxDivRightP">
              <el-radio-group v-model="queryBody.removeDuplicationImage">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </p>
            <div v-if="queryBody.removeDuplicationImage">
              <el-input v-if=" queryBody.removeDuplicationImage"
                        type="number"
                        onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                        v-model="queryBody.captureInterval"></el-input>秒
            </div>
            <p v-if=" queryBody.removeDuplicationImage">
              <el-input v-if=" queryBody.removeDuplicationImage"
                        type="number"
                        onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                        v-model="queryBody.similarity"></el-input>
            </p>
          </div>
        </div>
        <div class="bodyBox">
          <div class="bodyBoxDiv">
            <p>报警声音：</p>
            <p></p>
          </div>
          <div class="bodyBoxDiv">
            <p :class="OwnAuthDisabled?'cursorClass':'disabled'"
               style="text-align:left"
               @click="uploadBtnAct">
              <img class="img"
                   src="@/assets/images/add.png"
                   alt
                   srcset />添加
            </p>
            <p v-for="tag in tags"
               :key="tag.soundUrl">
              <el-tag :closable="OwnAuthDisabled"
                      @close="handleClose(tag)"
                      :disable-transitions="false">
                <img class="img"
                     src="@/assets/images/faceModule/voice.png"
                     alt
                     srcset />
                {{tag.soundName}}
              </el-tag>
              <span class="cursorClass"
                    style="margin-left:40px;"
                    @click="tryListenBtnAct(tag)">
                <img class="img"
                     src="@/assets/images/faceModule/tryListen.png"
                     alt
                     srcset />试听
              </span>
            </p>
            <p></p>
          </div>
        </div>
        <div class="bodyBox">
          <div class="bodyBoxDiv">
            <p class="warningTxt"
               style="visibility: hidden;">抓拍质量无效图片是否保存：</p>
            <p>人脸抓拍保存天数：</p>
            <p>人脸抓拍全景图保存天数：</p>
            <p>人脸报警图片保存天数：</p>
            <!-- <p>人脸查重相似度：</p> -->
          </div>
          <div class="bodyBoxDiv">
            <p class="warningTxt">注：缩短时间前期时间数据会消失</p>
            <p class="bodyBoxDivRightP">
              <el-input type="number"
                        onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                        v-model="queryBody.saveImageUriDay"></el-input>天
            </p>
            <p class="bodyBoxDivRightP">
              <el-input type="number"
                        onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                        v-model="queryBody.savePanoramauriDay"></el-input>天
            </p>
            <p class="bodyBoxDivRightP">
              <el-radio-group v-model="queryBody.saveAlarmImageType">
                <el-radio :label="1">长期</el-radio>
                <el-radio :label="0">短期</el-radio>
              </el-radio-group>
            </p>
            <div v-if="!queryBody.saveAlarmImageType">
              <el-input type="number"
                        onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                        v-model="queryBody.savaAlarmIangeDay"></el-input>天
            </div>
          </div>
        </div>
        <div class="footerClass">
          <el-button :disabled="!OwnAuthDisabled"
                     type="primary"
                     @click="postData">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "@/pages/faceModule/http/baseConfigHttp.js";
export default {
  components: {},
  props: {},
  data() {
    return {
      tags: [],
      audio: null,
      queryBody: {
        projectUuid: null /* 项目uuid */,
        saveQualityLowerImage: 0 /* 抓拍质量无效图片是否保存 */,
        removeDuplicationImage: 0 /* 抓拍查重 */,
        captureInterval: 10 /* 抓拍间隔 */,
        similarity: 80 /* 相似度 */,
        alarmSound: [
          {
            soundName: null /* 声音名称 */,
            soundUrl: null /* 声音地址 */
          }
        ] /* 报警声音 */,
        saveImageUriDay: 180 /* 人脸抓拍人脸图保存天数 */,
        savePanoramauriDay: 180 /* 人脸抓全景图保存天数 */,
        saveAlarmImageType: 1 /* 人脸报警图片保存天数类型，true长期，false短期 */,
        savaAlarmIangeDay: 180 /* 人脸报警图片保存天数 */
      },
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("设置", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("设置", "isOwn");
    if (this.ShowAuthDisabled) {
      this.initData();
    }
  },
  methods: {
    initData() {
      api
        .getFaceModuleConfig()
        .then(res => {
          if (res.data.success) {
            this.queryBody = res.data.data;
            // 若初始化人脸报警图片保存天数为零，不允许,自动处理默认180
            if (
              !this.queryBody.saveAlarmImageType &&
              !this.queryBody.savaAlarmIangeDay
            ) {
              this.queryBody.savaAlarmIangeDay = 180;
            }
            this.tags = res.data.data.alarmSound;
          }
        })
        .catch(() => {});
    },
    postData() {
      let data = {
        projectUuid: "" /* 项目uuid */,
        saveQualityLowerImage: 0 /* 抓拍质量无效图片是否保存 */,
        removeDuplicationImage: 0 /* 抓拍查重 */,
        captureInterval: 0 /* 抓拍间隔 */,
        similarity: 0 /* 相似度 */,
        alarmSound: this.tags /* 报警声音 */,
        saveImageUriDay: 0 /* 人脸抓拍人脸图保存天数 */,
        savePanoramauriDay: 0 /* 人脸抓全景图保存天数 */,
        saveAlarmImageType: true /* 人脸报警图片保存天数类型，true长期，false短期 */,
        savaAlarmIangeDay: 180 /* 人脸报警图片保存天数 */
      };
      Object.assign(data, this.queryBody);
      // 过滤输入的非数字的值
      data.savaAlarmIangeDay = data.savaAlarmIangeDay
        .toString()
        .replace(/^(0+)|[^\d]+/g, 0);
      data.savePanoramauriDay = data.savePanoramauriDay
        .toString()
        .replace(/^(0+)|[^\d]+/g, 0);
      data.saveImageUriDay = data.saveImageUriDay
        .toString()
        .replace(/^(0+)|[^\d]+/g, 0);
      data.captureInterval = data.captureInterval
        .toString()
        .replace(/^(0+)|[^\d]+/g, 0);
      data.similarity = data.similarity.toString().replace(/^(0+)|[^\d]+/g, 0);
      data.alarmSound = this.tags;
      // 输入框返回的转字符串为number
      data.savaAlarmIangeDay = Number(data.savaAlarmIangeDay);
      data.savePanoramauriDay = Number(data.savePanoramauriDay);
      data.saveImageUriDay = Number(data.saveImageUriDay);
      data.captureInterval = Number(data.captureInterval);
      data.similarity = Number(data.similarity);
      delete data.extInfo;
      delete this.queryBody.extInfo;
      if (
        Object.getOwnPropertyNames(data).every(item => {
          if (item === "saveAlarmImageType") return true;
          if (item === "saveQualityLowerImage") return true;
          if (item === "removeDuplicationImage") return true;
          if (data["saveAlarmImageType"] && item === "savaAlarmIangeDay") { return true; }
          if (typeof data[item] === "boolean") return true;
          return Boolean(data[item]);
        })
      ) {
        api
          .postFaceModuleConfig(data)
          .then(res => {
            if (res.data.success) {
              this.$message.success("保存成功");
            } else {
              this.$message.warning(res.data.msg);
            }
          })
          .catch(() => {});
      } else {
        console.log(data);
        this.$message.warning("基础设置项不允许空值");
      }
    },
    handleClose(tag) {
      if (tag.defaulted) {
        this.$message.warning("该资源不允许删除");
        return;
      }
      if (tag.soundUrl.indexOf("blob:http://") !== -1) {
        this.tags.splice(this.tags.indexOf(tag), 1);
        return;
      }
      this.$confirm("是否确定删除该条音频?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delteAudioFile(tag);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    tryListenBtnAct(tag) {
      console.log(tag.soundUrl);
      // 试听
      if (!this.audio) {
        this.audio = document.createElement("audio");
        this.audio.autoplay = "autoplay";
        this.audio.isPlay = false;
      }
      if (this.audio.src && !this.audio.isPlay) {
        this.audio.pause();
      } else {
        this.audio.src = this.$common.setPictureShow(tag.soundUrl);
        this.audio.play();
        this.audio.isPlay = true;
      }
    },
    uploadBtnAct() {
      if (!this.OwnAuthDisabled) return;
      if (this.tags.length > 9) {
        this.$message({ type: "warning", message: "允许添加音频最多10个" });
        return;
      }
      var input = document.createElement("input");
      input.type = "file";
      input.accept = "audio/*";
      input.click();
      input.onchange = res => {
        var file = input.files[0];
        var form = new FormData();
        form.append("file", file); // 第一个参数是后台读取的请求key值
        form.append("fileName", file.name);
        console.log(form);
        this.uploadSoundFile(form, file);
        // this.queryBody.alarmSound.push(form);
      };
    },
    // 处理声音文件上传
    uploadSoundFile(formData, file) {
      api
        .uploadAudio(formData)
        .then(res => {
          if (res.data.success && res.data.data) {
            this.$message.success(res.data.msg);
            var fileTag = {
              soundName: file.name,
              soundUrl: res.data.data,
              defaulted: 0,
              type: file.type
            };
            this.tags.push(fileTag);
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(() => {});
    },
    // 删除配置的声音 soundUrl
    delteAudioFile(tag) {
      api
        .deleteAudio({ soundUrl: tag.soundUrl })
        .then(res => {
          if (res.data.success) {
            this.$message.success(res.data.msg);
            this.tags.splice(this.tags.indexOf(tag), 1);
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(() => {});
    }
  },
  watch: {},
  destroyed() {}
};
</script>
<style>
.setting-main .el-tag .el-icon-close {
  background-image: url("../../../../../assets/images/faceModule/tagDeleteIcon.png");
  background-size: contain;
  color: transparent;
  top: -15px;
  right: -15px;
}
.el-message-box__title {
  padding-left: 0;
  margin-bottom: 0;
  font-size: 16px;
  line-height: 1;
  color: #dddddd;
}
.el-message-box__header {
  border-bottom: 1px solid #303133;
}
.el-message-box__content {
  color: #dddddd;
}
.el-message-box .el-button--default,
.el-message-box .el-button--default:hover,
.el-message-box .el-button--default:active,
.el-message-box .el-button--default:focus {
  background: rgba(40, 255, 187, 0.1);
  border: 1px solid rgba(40, 255, 187, 0.45);
  border-radius: 2px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.setting-main {
  width: 1100px;
  min-height: 100%;
  padding: 30px;
  box-sizing: border-box;
  .mainBox {
    height: 100%;
    background-color: #212325;
    padding: 0 40px 40px;
    box-sizing: border-box;
    overflow: auto;
    .headerBox {
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 25px 0 24px;
      height: 69px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      div {
        border-left: 2px solid #26d39d;
        font-family: "PingFangSC-Regular";
        font-size: 14px;
        color: #ffffff;
        padding-left: 10px;
        line-height: 10px;
      }
      .el-button {
        background: rgba(40, 255, 187, 0.08);
        border: 1px solid rgba(38, 211, 157, 0.8);
        border-radius: 2px;
        border-radius: 2px;
        width: 80px;
        height: 32px;
        font-family: "PingFangSC-Regular";
        font-size: 13px;
        color: #ffffff;
        text-align: justify;
        padding: 0px 27px;
        margin-top: -13px;
      }
    }
    .bodyBox {
      display: flex;
      justify-content: flex-start;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
      padding: 15px 0;
      .bodyBoxDiv {
        font-family: "PingFangSC-Regular";
        font-size: 13px;
        color: #dddddd;
        text-align: right;
        padding: 0px 11px;
        p {
          // margin: 13px 0;
          height: 32px;
          line-height: 32px;
        }
        // p:last-child {
        // 	margin: 0px 0;
        // }
        .el-radio-group {
          display: block;
        }
        .el-input {
          display: inline-block;
          width: 100px;
          height: 32px;
          margin-right: 13px;
        }
        div {
          text-align: left;
        }
        .img {
          vertical-align: baseline;
          margin-right: 8px;
        }
        .el-tag {
          background-color: rgba(255, 255, 255, 0.05);
          border: 0;
          border-radius: 2px;
          font-family: "PingFangSC-Regular";
          font-size: 13px;
          color: #dddddd;
        }
        .warningTxt {
          font-family: "PingFangSC-Regular";
          font-size: 13px;
          color: #fd545e;
          margin-top: 0;
        }
        .bodyBoxDivRightP {
          text-align: left;
          .el-radio-group {
            line-height: 40px !important;
          }
        }
      }
      .bodyBoxDiv:first-child {
        width: 24%;
      }
    }
    .footerClass {
      margin: 26px 0 10px;
      text-align: right;
      .el-button {
        background: rgba(40, 255, 187, 0.08);
        border: 1px solid rgba(38, 211, 157, 0.8);
        border-radius: 2px;
        border-radius: 2px;
        width: 80px;
        height: 32px;
        font-family: "PingFangSC-Regular";
        font-size: 13px;
        color: #ffffff;
        text-align: justify;
        padding: 0px 27px;
      }
    }
  }
}
</style>
