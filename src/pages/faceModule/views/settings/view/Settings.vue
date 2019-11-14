<template>
	<div class="setting-main">
		<div class="mainBox">
			<el-header class="headerBox">
				<div>基础配置</div>
				<el-button @click="postData">保存</el-button>
			</el-header>
			<div class="bodyBox">
				<div class="bodyBoxDiv">
					<p>抓拍质量无效图片是否保存：</p>
					<p>抓拍查重：</p>
					<p v-if="queryBody.removeDuplicationImage">抓拍查重间隔：</p>
					<p v-if="queryBody.removeDuplicationImage">人脸查重相似度：</p>
				</div>
				<div class="bodyBoxDiv" style="text-align:left">
					<p class="bodyBoxDivRightP">
						<el-radio-group v-model="queryBody.saveQualityLowerImage">
							<el-radio :label="1">是</el-radio>
							<el-radio :label="0">否</el-radio>
						</el-radio-group>
					</p >
					<p class="bodyBoxDivRightP">
						<el-radio-group v-model="queryBody.removeDuplicationImage">
							<el-radio :label="1">是</el-radio>
							<el-radio :label="0">否</el-radio>
						</el-radio-group>
					</p>
					<div v-if="queryBody.removeDuplicationImage">
					<el-input
						v-if=" queryBody.removeDuplicationImage"
						type="number"
						onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
						v-model="queryBody.captureInterval"
					></el-input>秒
					</div>
					<!-- <p v-if=" queryBody.removeDuplicationImage"> -->
					<el-input
						v-if=" queryBody.removeDuplicationImage"
						type="number"
						onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
						v-model="queryBody.similarity"
					></el-input>
					<!-- </p> -->
				</div>
			</div>
			<div class="bodyBox">
				<div class="bodyBoxDiv">
					<p>报警声音：</p>
					<p></p>
				</div>
				<div class="bodyBoxDiv">
					<p class="cursorClass" style="text-align:left" @click="uploadBtnAct">
						<img class="img" src="@/assets/images/add.png" alt srcset />添加
					</p>
					<p v-for="tag in tags" :key="tag.soundUrl">
						<el-tag closable @close="handleClose(tag)" :disable-transitions="false">
							<img class="img" src="@/assets/images/faceModule/voice.png" alt srcset />
							{{tag.soundName}}
						</el-tag>
						<span class="cursorClass" style="margin-left:40px;" @click="tryListenBtnAct(tag)">
							<img class="img" src="@/assets/images/faceModule/tryListen.png" alt srcset />试听
						</span>
					</p>
					<p></p>
				</div>
			</div>
			<div class="bodyBox">
				<div class="bodyBoxDiv">
					<p style="visibility: hidden;">抓拍质量无效图片是否保存：</p>
					<p>人脸抓拍保存天数：</p>
					<p>人脸抓拍全景天保存天数：</p>
					<p>人脸报警图片保存天数：</p>
					<!-- <p>人脸查重相似度：</p> -->
				</div>
				<div class="bodyBoxDiv">
					<p class="warningTxt">注：缩短时间前期时间数据会消失</p>
					<p class="bodyBoxDivRightP">
						<el-input
							type="number"
							onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
							v-model="queryBody.saveImageUriDay"
						></el-input>天
					</p>
					<p class="bodyBoxDivRightP">
						<el-input
							type="number"
							onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
							v-model="queryBody.savePanoramauriDay"
						></el-input>天
					</p>
					<div style="margin-bottom:15px">
						<el-radio-group v-model="queryBody.saveAlarmImageType">
							<el-radio :label="1">长期</el-radio>
							<el-radio :label="0">短期</el-radio>
						</el-radio-group>
					</div>
					<div v-if="!queryBody.saveAlarmImageType">
						<el-input
							type="number"
							onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
							v-model="queryBody.savaAlarmIangeDay"
						></el-input>天
					</div>
				</div>
			</div>
			<div class="footerClass">
				<el-button @click="postData">保存</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import * as api from "@/pages/faceModule/http/baseConfigHttp.js";
export default {
  components: {},
  props: {
    tableData: {
      type: Array,
      default: function() {
        var num = [];
        for (var i = 0; i < 14; i++) {
          num.push({
            modules: "以脸搜脸",
            options: "临时布控",
            optionsDetails: "修改了布控任务详情",
            name: "李一一",
            account: "admin",
            time: "2018-11-12 16:34:45"
          });
        }
        return num;
      }
    }
  },
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
        savaAlarmIangeDay: 0 /* 人脸报警图片保存天数 */
      }
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      api
        .getFaceModuleConfig()
        .then(res => {
          if (res.data.success) {
            this.queryBody = res.data.data;
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
        savaAlarmIangeDay: 0 /* 人脸报警图片保存天数 */
      };
      Object.assign(data, this.queryBody);
      data.savaAlarmIangeDay = data.savaAlarmIangeDay
        .toString()
        .replace(/^(0+)|[^\d]+/g, "");
      data.savePanoramauriDay = data.savePanoramauriDay
        .toString()
        .replace(/^(0+)|[^\d]+/g, "");
      data.saveImageUriDay = data.saveImageUriDay
        .toString()
        .replace(/^(0+)|[^\d]+/g, "");
      data.captureInterval = data.captureInterval
        .toString()
        .replace(/^(0+)|[^\d]+/g, "");
      data.similarity = data.similarity.toString().replace(/^(0+)|[^\d]+/g, "");
      data.alarmSound = this.tags;
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
      }
      if (this.audio && this.audio.src && this.audio.src === tag.soundUrl) {
        this.audio.pause();
      } else {
        this.audio.src = tag.soundUrl;
        this.audio.play();
      }
    },
    uploadBtnAct() {
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
					margin: 23px 0;
					line-height: 20px;
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
					// margin: 2px 13px 12px 0;
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
				}
				.bodyBoxDivRightP{
					text-align: left;
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
