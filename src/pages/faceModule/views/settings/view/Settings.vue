<template>
	<div class="setting-main">
		<div class="mainBox">
			<el-header class="headerBox">
				<div>基础配置</div>
				<el-button>保存</el-button>
			</el-header>
			<div class="bodyBox">
				<div class="bodyBoxDiv">
					<p>抓拍质量无效图片是否保存：</p>
					<p>抓拍查重：</p>
					<p>抓拍查重间隔：</p>
					<p>人脸查重相似度：</p>
				</div>
				<div class="bodyBoxDiv">
					<p>
						<el-radio-group v-model="queryBody.saveQualityLowerImage">
							<el-radio :label="1">是</el-radio>
							<el-radio :label="0">否</el-radio>
						</el-radio-group>
					</p>
					<p>
						<el-radio-group v-model="queryBody.removeDuplicationImage">
							<el-radio :label="1">是</el-radio>
							<el-radio :label="0">否</el-radio>
						</el-radio-group>
					</p>
					<div>
						<el-input type="number" v-model="queryBody.captureInterval"></el-input>秒
					</div>
					<div>
						<el-input type="number" v-model="queryBody.similarity"></el-input>
					</div>
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
					<p v-for="tag in tags" :key="tag.name">
						<el-tag closable @close="handleClose(tag)" :disable-transitions="false">
							<img class="img" src="@/assets/images/faceModule/voice.png" alt srcset />
							{{tag.name}}
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
					<div>
						<el-input type="number" v-model="queryBody.saveImageUriDay"></el-input>秒
					</div>
					<div>
						<el-input type="number" v-model="queryBody.savePanoramauriDay"></el-input>秒
					</div>
					<p>
						<el-radio-group v-model="queryBody.saveAlarmImageType">
							<el-radio :label="1">长期</el-radio>
							<el-radio :label="0">短期</el-radio>
						</el-radio-group>
					</p>
					<div v-if="!queryBody.saveAlarmImageType">
						<el-input type="number" v-model="queryBody.savaAlarmIangeDay"></el-input>天
					</div>
				</div>
			</div>
			<div class="footerClass">
				<el-button>保存</el-button>
			</div>
		</div>
	</div>
</template>
<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      tags: [],
      queryBody: {
        projectUuid: null /* 项目uuid */,
        saveQualityLowerImage: 0 /* 抓拍质量无效图片是否保存 */,
        removeDuplicationImage: 0 /* 抓拍查重 */,
        captureInterval: 0 /* 抓拍间隔 */,
        similarity: 0 /* 相似度 */,
        alarmSound: [
          {
            soundName: null /* 声音名称 */,
            soundUrl: null /* 声音地址 */
          }
        ] /* 报警声音 */,
        saveImageUriDay: 0 /* 人脸抓拍人脸图保存天数 */,
        savePanoramauriDay: 0 /* 人脸抓全景图保存天数 */,
        saveAlarmImageType: 0 /* 人脸报警图片保存天数类型，true长期，false短期 */,
        savaAlarmIangeDay: 0 /* 人脸报警图片保存天数 */
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    queryAct() {},
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    tryListenBtnAct(tag) {
      // 试听
      var audio = document.createElement("audio");
      audio.autoplay = "autoplay";
      audio.src = tag.url;
      audio.play();
      console.log(audio);
    },
    uploadBtnAct() {
      var input = document.createElement("input");
      input.type = "file";
      input.accept = 'audio/*';
      input.click();
      input.onchange = (res) => {
        var file = input.files[0];
        var url = URL.createObjectURL(file);
        var fileTag = {
          name: file.name,
          url: url,
          type: file.type
        };
        console.log(file);
        console.log(fileTag);
        this.tags.push(fileTag);
        console.log(this.tags);
        var form = new FormData();
        form.append("file", file); // 第一个参数是后台读取的请求key值
        form.append("fileName", file.name);
        this.queryBody.alarmSound.push(form);
      };
    },
    // 处理声音文件上传
    detealSoundFile() {}
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
		padding: 0 40px;
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
				border: 0 solid rgba(38, 211, 157, 0.8);
				border-radius: 2px;
				border-radius: 2px;
				width: 80px;
				height: 32px;
				font-family: "PingFangSC-Regular";
				font-size: 13px;
				color: #ffffff;
				text-align: justify;
				padding: 7px 27px;
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
				}
				p:last-child {
					margin: 35px 0;
				}
				.el-radio-group {
					display: block;
				}
				.el-input {
					display: inline-block;
					width: 100px;
					height: 32px;
					margin: 2px 13px 12px 0;
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
			}
			.bodyBoxDiv:first-child {
				width: 24%;
			}
		}
		.footerClass {
			margin: 26px 0 100px;
			text-align: right;
			.el-button {
				background: rgba(40, 255, 187, 0.08);
				border: 0 solid rgba(38, 211, 157, 0.8);
				border-radius: 2px;
				border-radius: 2px;
				width: 80px;
				height: 32px;
				font-family: "PingFangSC-Regular";
				font-size: 13px;
				color: #ffffff;
				text-align: justify;
				padding: 7px 27px;
			}
		}
	}
}
</style>
