<template>
	<el-dialog
		:title="title"
		:width="width"
		class="BlacklistAdd"
		:visible.sync="dialogVisible"
		:before-close="close"
	>
		<el-row type="flex" justify="flex-start" :gutter="20">
			<el-col :span="8">
				<div>
					<el-upload
						class="uploadClass"
						action
						:show-file-list="false"
						:auto-upload="true"
						:http-request="httpRequest"
					>
						<div v-if="imageUrl" class="left_tips_txt imgBox">
							<img class="img" :src="imageUrl" alt />
							<div class="deleteIconBox" @click.stop="cleanImgBtnAct">
								<img src="@/assets/images/doorAccess/delete_icon.png" alt />
							</div>
						</div>
						<div v-else class="left_tips_txt imgBox">
							<img class="imageClass" src="@/assets/images/vistorManage/upload_icon.png" alt srcset />
							<p>本地上传</p>
						</div>
					</el-upload>
				</div>
			</el-col>
			<el-col :span="16">
				<div class="form-item">
					<el-input class="input" v-model="SearchObj.blacklistName" placeholder="姓名"></el-input>
				</div>
				<div class="form-item">
					<el-input class="input" v-model="SearchObj.credentialNo" placeholder="身份证号"></el-input>
				</div>
				<div class="form-item">
					<el-input class="input" v-model="SearchObj.reason" placeholder="拉黑原因"></el-input>
				</div>
				<div class="btn-group">
					<el-button type="primary" :disabled="isDisabled" size="small" @click="query">保存</el-button>
					<el-button type="primary" size="small" @click="close">取消</el-button>
				</div>
			</el-col>
		</el-row>
	</el-dialog>
</template>
<script>
import * as api from "../../utils/ajax";
import RestApi from "@/utils/RestApi.js";
export default {
  name: "BlacklistAdd",
  props: {
    width: {
      type: String,
      default() {
        return "420px";
      }
    },
    title: {
      type: String,
      default() {
        return "添加黑名单";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    defaultRow: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      isDisabled: false,
      gender: "",
      phone: "",
      address: "",
      personType: "",
      registerTime: "",
      genderOptions: [],
      sourceOptions: [],
      SearchObj: {
        blacklistName: "",
        credentialNo: "",
        imageBase64: "",
        reason: ""
      },
      dialogVisible: false,
      imageUrl: null,
      imageHeaderUrl: RestApi.api.imageUrl,
    };
  },
  mounted() {
    this.sourceOptions = this.$common.getEnumByGroupStr("visitor_singon_ways");
    this.SearchObj.blacklistWay = this.sourceOptions[0].typeStr;
    this.genderOptions = this.$common.getEnumByGroupStr("gender");
  },
  methods: {
    cleanImgBtnAct() {
      this.imageUrl = null;
      this.SearchObj.imageBase64 = false;
    },
    query() {
      console.log("------", this.SearchObj);
      if (this.$common.isJustify(this.SearchObj)) {
        this.$message({type: 'warning', message: '黑名单不能为空'});
        return;
      }
      var data = {};
      Object.assign(data, this.SearchObj);
      data.snapOriginalPhotoUri = this.SearchObj.imageBase64
        ? null
        : this.imageUrl;
      data.snapOriginalPhotoBase = this.SearchObj.imageBase64;
      data.source = "platform_add";
      if (!data.credentialType) {
        data.credentialType = "id_card";
      }
      console.log("白名单编辑：", data);
      if (this.defaultRow.blacklistUuid) {
        this.httpPuttBlacklist(data);
      } else {
        this.httpPostBlacklist(data);
      }
    },
    httpPostBlacklist(data) {
      var flag = 0;
      for (const i in data) {
        if (data[i]) {
          flag = 1;
          break;
        }
      }
      if (!flag) {
        this.$message({ type: "warning", message: "黑名单信息为空" });
        return;
      }
      this.isDisabled = true;
      api
        .postBlacklistUrl(data)
        .then(res => {
          this.isDisabled = false;
          if (res.data.success) {
            this.$emit("closeAddDialogDetail", true);
            this.$message({ type: "success", message: res.data.msg });
          } else {
            this.$message({ type: "error", message: res.data.msg });
          }
        })
        .catch(() => {
          this.isDisabled = false;
        });
    },
    httpPuttBlacklist(data) {
      this.isDisabled = true;
      api
        .putBlacklistUrl(data)
        .then(res => {
          this.isDisabled = false;
          if (res.data.success) {
            this.$emit("closeAddDialogDetail", true);
            this.$message({ type: "success", message: "编辑成功" });
          } else {
            this.$message({ type: "error", message: "保存失败" });
          }
        })
        .catch(() => {
          this.isDisabled = false;
        });
    },
    httpRequest(e) {
      console.log(e.file.type);
      const isLt500k = e.file.size / 1024 / 1024 < 0.488;
      if (!isLt500k) {
        this.$message.error('上传头像图片大小不能超过 500k!');
        this.cleanImgBtnAct();
        return;
      }
      if (
        e.file.type === "image/jpeg" ||
				e.file.type === "image/png" ||
				e.file.type === "image/jpg"
      ) {
        var reader = new FileReader();
        reader.readAsDataURL(e.file);
        this.imageUrl = URL.createObjectURL(e.file);
        var _this = this;
        reader.onload = function(e) {
          _this.SearchObj.imageBase64 = this.result
            .replace("data:image/jpeg;base64,", "jpeg:")
            .replace("data:image/png;base64,", "png:")
            .replace("data:image/jpg;base64,", "jpg:");
          _this.getFaceQualityDetection(_this.SearchObj.imageBase64);
        };
      } else {
        this.$message.error("不支持该图片类型");
      }
    },
    // 检测图片质量
    getFaceQualityDetection() {
      var data = { imageBase64: this.SearchObj.imageBase64 };
      this.$ResidentManageAjax
        .getFaceQualityDetection(data)
        .then(res => {
          console.log(this.imageUrl);
          this.$message({
            type: "success",
            message: res.data.msg
          });
        })
        .catch(err => {
          console.log(err);
          this.SearchObj.imageBase64 = null;
          this.imageUrl = false;
        });
    },
    // 关闭
    close() {
      this.$emit("update:visible", false);
      this.$emit("closeAddDialogDetail");
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = this.visible;
      if (val && this.defaultRow.blacklistUuid) {
        this.imageUrl = this.defaultRow.certificatePhotoUri
          ? this.defaultRow.certificatePhotoUri
          : this.defaultRow.snapPhotoUri;
        this.imageUrl = this.imageHeaderUrl + this.imageUrl;
        Object.assign(this.SearchObj, this.defaultRow);
      } else {
        this.SearchObj = {
          blacklistName: "",
          credentialNo: "",
          imageBase64: "",
          reason: ""
        };
        this.imageUrl = "";
      }
      console.log(this.SearchObj);
    }
  }
};
</script>

<style lang='scss'>
@import "@/style/variables.scss";
.BlacklistAdd {
	.input {
		input {
			@include input30;
		}
	}
	.el-dialog {
		background: #25292d;
		border-radius: 3px;
		border-radius: 3px;
	}
	.el-dialog__body {
		padding: 30px 45px 50px 35px;
	}
	.uploadClass {
		display: inline-block;
		width: 100px;
		position: relative;
		height: 120px;
		background: rgba(0, 0, 0, 0.1);
		border: 0 solid rgba(255, 255, 255, 0.1);
	}
	.left_tips_txt {
		font-family: "PingFangSC-Regular";
		font-size: 13px;
		color: #26d39d;
	}
	.img {
		width: 100%;
		height: 100%;
		margin: 0;
	}
	.imgBox {
		width: 100px;
		height: 120px;
	}
	.imageClass {
		margin-top: 50%;
		margin-left: 50%;
		transform: translate(-100%, -50%);
	}
	.deleteIconBox {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		padding: 1px;
		position: absolute;
		right: 5px;
		bottom: 5px;
		box-sizing: border-box;
		background-color: rgba(105, 105, 105, 0.1);
	}
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.BlacklistAdd {
	padding: 10px 20px 10px;
	box-sizing: border-box;
	.btn-group {
		// float: right;
		text-align: left;
		.btn-text {
			display: inline-block;
			padding: 0px 30px;
			color: $add-text-color;
			cursor: pointer;
		}
		margin-top: 25px;
		padding-left: 10px;
	}
	.form-item {
		margin-bottom: 15px;
		label {
			display: inline-block;
			width: 80px;
			text-align: right;
			@include font-s;
		}
		.el-select,
		.input {
			margin-left: 10px;
		}
	}
}
</style>
