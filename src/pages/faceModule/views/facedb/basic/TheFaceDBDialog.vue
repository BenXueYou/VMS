<template>
	<div class="DBDialogWrapClass">
		<el-dialog
			:title="updatefacedata.faceLibraryUuid?'编辑人脸库':'新增人脸库'"
			:visible.sync="diglogvisible"
			width="580px"
			center
		>
			<el-form :model="formData" :rules="rules" ref="formRef" label-width="150px">
				<el-form-item label="库名称：" prop="faceLibraryName">
					<el-input v-model="formData.faceLibraryName" class="myinput"></el-input>
				</el-form-item>
				<el-form-item label="库标识颜色：" prop="faceLibraryColour">
					<el-color-picker v-model="formData.faceLibraryColour"></el-color-picker>
				</el-form-item>
				<el-form-item label="入库需达到的质量：" prop="facePhotoQualities">
					<pic-qulity-select :selectedButtons.sync="formData.facePhotoQualities" defaultSelect="low" />
				</el-form-item>
				<el-form-item label="库描述：" prop="description">
					<el-input v-model="formData.description" class="myinput"></el-input>
				</el-form-item>
			</el-form>
			<span class="dialog-footer button-div btnBox">
				<el-button type="primary" @click="onSubmit">确 定</el-button>
				<el-button type="primary" @click="close">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import PicQulitySelect from "@/common/PicQulitySelect";
import * as api from "@/pages/faceModule/http/faceDBHttp.js";
const RULES = {
  faceLibraryName: [
    { required: true, message: "人脸库名称不能为空", trigger: "change" }
  ],
  faceLibraryColour: [
    { required: true, message: "人脸库颜色不能为空", trigger: "change" }
  ],
  facePhotoQualities: [
    { required: true, message: "人脸入库质量不能为空", trigger: "change" }
  ],
  description: [
    { required: true, message: "人脸库描述不能为空", trigger: "change" }
  ]
};
export default {
  name: "TheFaceDBDialog",
  components: { PicQulitySelect },
  props: {
    faceDBDialogVisible: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    isaddface: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    updatefacedata: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  mounted() {},
  data() {
    return {
      diglogvisible: false,
      rules: RULES,
      formData: {
        faceLibraryName: "",
        description: "",
        faceLibraryColour: "#26D39D",
        facePhotoQualities: []
      }
    };
  },
  watch: {
    faceDBDialogVisible(val) {
      this.diglogvisible = val;
      if (val && this.updatefacedata.faceLibraryUuid) {
        this.formData.faceLibraryColour = this.updatefacedata.faceLibraryColour
          ? this.updatefacedata.faceLibraryColour
          : "#26D39D";
        Object.assign(this.formData, this.updatefacedata);
        console.log(this.formData);
      } else {
        this.resetdata();
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs["formRef"].validate(valid => {
        if (valid) {
          let data = {
            facePhotoQualities: this.formData.facePhotoQualities, // 人脸质量（LOW，NORMAL,HIGH）
            description: this.formData.description, // 描述
            faceLibraryUuid: null, // 人脸库UUID
            faceLibraryName: this.formData.faceLibraryName, // 人脸库名称,64个字符以内
            faceLibraryType: null, // 人脸库类型
            faceLibraryColour: this.formData.faceLibraryColour, // 人脸库颜色（RGB，如："#000000"）
            editabled: 1, // 是否可编辑（0：不可编辑；1：可编辑）
            deletable: 1, // 是否可删除
            addFaceByUser: 1, // 人员是否可添加
            delFaceByUser: 1, // 人员是否可删除
            editFaceByUser: 1, // 人员是否可编辑
            // 拓展信息
            extInfo: {}
          };
          Object.assign(data, this.formData);
          console.log(data);
          // 是否是添加人员，true是添加 false为修改
          if (!this.updatefacedata.faceLibraryUuid) {
            console.log("submit!");
            this.addstaffku(data);
          } else {
            this.updatestaffku(data, this.updatefacedata.faceLibraryUuid);
          }
        } else {
          return false;
        }
      });
    },
    updatestaffku(data) {
      const _this = this;
      api.putFaceLib(data).then(res => {
        if (res.data.success) {
          _this.$message.success("修改人员库成功");
          this.$emit("close", true);
        }
      });
    },
    addstaffku(data) {
      const _this = this;
      data.faceLibraryType = 'staticFaceLib';
      api.addFaceLid(data).then(res => {
        console.log(res);
        if (res.data.success) {
          _this.$message.success("添加人员库成功");
          this.$emit("close", true);
        }
      });
    },
    resetdata() {
      this.formData = {
        faceLibraryName: "",
        description: "",
        faceLibraryColour: "",
        facePhotoQualities: []
      };
    },
    close() {
      this.$emit("close");
      this.resetdata();
    }
  }
};
</script>

<style lang='scss' scoped>
.el-color-picker__panel {
	background-color: transparent;
	.el-button--default,
	.el-button--default:hover,
	.el-button--default:active,
	.el-button--default:focus {
		background: rgba(40, 255, 187, 0.1);
		border: 1px solid rgba(40, 255, 187, 0.45);
		border-radius: 2px;
	}
}
.flexfather {
	width: 350px;
	.flexchild {
		margin-top: 10px;
		margin-right: 18px;
		margin-left: 0px;
	}
}
.color {
	display: inline-block;
	width: 16px;
	height: 16px;
	vertical-align: middle;
	border-radius: 2px;
	background-color: #fff;
}
.btn-center {
	position: absolute;
	left: 50%;
	height: 50px;
	transform: translateX(-50%);
}
.myinput {
	width: 350px;
}
.customize {
	border-top: 1px dashed #666;
	border-bottom: 1px dashed #666;
	height: 150px;
	overflow: hidden;
	.wrap {
		width: 555px;
		margin: 0 auto;
		padding: 20px 0px;
		line-height: 50px;
		font-size: 0px;
		.itemlabel {
			font-family: "PingFangSC-Regular";
			display: inline-block;
			width: 120px;
			font-size: 14px;
			text-align: right;
			color: #aaaaaa;
		}
		.itemInput {
			display: inline-block;
			.el-input {
				width: 65px;
			}
		}
	}
}
</style>

<style lang='scss'>
// 下拉上弹动画
.slideDownOrUp-enter-active {
	transition: all 0.3s;
}
// .slideDownOrUp-leave-active {
// }
.slideDownOrUp-enter {
	transform: scale(1, 0);
}
.slideDownOrUp-leave-to /* .fade-leave-active below version 2.1.8 */ {
	transform: scale(1, 1);
}

/* 本页面自定义 */
.DBDialogWrapClass {
	.el-form-item {
		margin-bottom: 10px;
	}
	.el-input__inner {
		padding: 0px 5px 0px 8px;
	}
	.btnBox {
		width: 200px;
		display: block;
		overflow: hidden;
		margin: 20px auto;
	}
}
</style>
