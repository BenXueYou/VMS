<template>
	<div v-if="diglogvisible" class="dialogwrapadd">
		<div class="dialogHeader">
			<span>{{staffDetail.faceLibraryName}}-{{staffDetail.faceUuid?"修改人脸":'新增人脸'}}</span>
			<div class="dialogHeaderBtn">
				<el-button @click="cancelAct">返回</el-button>
				<el-button :loading="isloading" @click="confirmAct">确认</el-button>
				<el-button @click="cancelAct">取消</el-button>
			</div>
		</div>
		<div class="bodyBox">
			<div class="bodyBoxLeft">
				<el-upload
					action="''"
					:show-file-list="false"
					class="uploadClass"
					accept="image/jpg, image/jpeg"
					:http-request="httpRequest"
				>
					<div v-if="staffInfo.facePhotoUrl" class="left_tips imgBox">
						<img class="img" :src="staffInfo.facePhotoUrl" alt />
						<div class="deleteIconBox" @click.stop="staffInfo.facePhotoUrl='',staffInfo.faceImage=''">
							<img src="@/assets/images/doorAccess/delete_icon.png" alt />
						</div>
					</div>
					<div v-else class="tipsBox">
						<div class="left_tips">
							<img class="img" src="@/assets/images/doorAccess/add_img_icon.png" alt />本地
						</div>
						<div class="left_tips" @click.stop="shootPhoto">
							<img class="img" src="@/assets/images/personMange/shootPhoto.png" alt /> 拍摄
						</div>
					</div>
				</el-upload>
				<div class="left_tips_txt">证件类型：</div>
				<div class="left_tips_txt">证件号码：</div>
				<div class="left_tips_txt">人员类型：</div>
			</div>
			<div class="bodyBoxRight">
				<div class="bodyBoxRightUploadClass">
					<div class="staffNameInputBox">
						<el-input v-model="staffInfo.staffName" placeholder="姓名"></el-input>
					</div>
					<el-radio-group v-model="staffInfo.gender">
						<el-radio label="male">男</el-radio>
						<el-radio label="female">女</el-radio>
					</el-radio-group>
					<div class="phoneNumberInputBox">
						<el-input type="number" v-model="staffInfo.phoneNo" placeholder="手机号码"></el-input>
					</div>
				</div>
				<div>
					<el-select v-model="staffInfo.credentialType" placeholder="请选择证件类型">
						<el-option
							v-for="item in certificateOptions"
							:key="item.typeStr"
							:label="item.typeName"
							:value="item.typeStr"
						></el-option>
					</el-select>
				</div>
				<div>
					<el-input v-model="staffInfo.credentialNo" style="width:217px;" placeholder="证件号码"></el-input>
				</div>
				<div>
					<el-select v-model="staffInfo.staffType" placeholder="请选择人员类型">
						<el-option
							v-for="item in staffOptions"
							:key="item.typeStr"
							:label="item.typeName"
							:value="item.typeStr"
						></el-option>
					</el-select>
					<span class="themeFont cursorClass" @click="detailShow =!detailShow">
						{{detailShow?'展开':'收起'}}
						<i :class="detailShow?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
					</span>
				</div>
			</div>
		</div>
		<div class="bodyBox" v-show="!detailShow">
			<div class="bodyBoxLeft">
				<div class="left_tips_txt">民族：</div>
				<div class="left_tips_txt">文化程度：</div>
				<div class="left_tips_txt">婚姻状况：</div>
				<div class="left_tips_txt">国籍：</div>
				<div class="left_tips_txt">籍贯：</div>
				<div class="left_tips_txt">户籍：</div>
				<div class="left_tips_txt">备注：</div>
			</div>
			<div class="bodyBoxRight">
				<div>
					<el-select v-model="staffInfo.nation" placeholder="请选择民族">
						<el-option
							v-for="item in nationOptions"
							:key="item.typeStr"
							:label="item.typeName"
							:value="item.typeStr"
						></el-option>
					</el-select>
				</div>
				<div>
					<el-select v-model="staffInfo.education" placeholder="请选择学历">
						<el-option
							v-for="item in educationOptions"
							:key="item.typeStr"
							:label="item.typeName"
							:value="item.typeStr"
						></el-option>
					</el-select>
				</div>
				<div>
					<el-select v-model="staffInfo.maritalState" placeholder="请选择婚姻状况">
						<el-option
							v-for="item in maritalOptions"
							:key="item.typeStr"
							:label="item.typeName"
							:value="item.typeStr"
						></el-option>
					</el-select>
				</div>
				<div>
					<el-select v-model="staffInfo.nationality" placeholder="请选择国籍">
						<el-option
							v-for="item in countryOptions"
							:key="item.typeStr"
							:label="item.typeName"
							:value="item.typeStr"
						></el-option>
					</el-select>
				</div>
				<div>
					<el-input v-model="staffInfo.nativePlace" placeholder="籍贯"></el-input>
				</div>
				<div>
					<el-input v-model="staffInfo.householdRegister" placeholder="户籍"></el-input>
				</div>
				<div>
					<el-input v-model="staffInfo.remarks" placeholder="备注"></el-input>
				</div>
			</div>
		</div>
		<div class="dialogFooter">
			<div class="dialogHeaderBtn">
				<el-button @click="cancelAct">返回</el-button>
				<el-button :loading="isloading" @click="confirmAct">确认</el-button>
				<el-button @click="cancelAct">取消</el-button>
			</div>
		</div>
		<snap-shoot-photo :visible="isSnapShoot" @close="shootPhoto" @snapPhotoAct="snapPhotoAct"></snap-shoot-photo>
	</div>
</template>

<script>
// import { uploadbase64, deletepic } from "@/pages/faceModule/api";
import snapShootPhoto from "@/common/baseComponent/SnapShootPhoto.vue";
import * as api from "@/pages/faceModule/http/faceDBHttp.js";
export default {
  name: "TheFaceDBDialog",
  props: {
    faceDBDialogVisible: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    staffDetail: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: { snapShootPhoto },
  data() {
    return {
      isloading: false,
      detailShow: false,
      diglogvisible: false,
      imageUrl: false,
      fileData: false,
      certificateOptions: [],
      certificateOption: null,
      staffOptions: [],
      isSnapShoot: false,
      staffInfo: {
        faceUuid: null, // 人脸uuid
        staffName: null, // 姓名
        gender: "male", // 性别
        phoneNo: null, // 手机号
        credentialType: null, // 证件类型
        credentialNo: null, // 证件号
        birthday: null, // 出生日期（根据身份证号获取）
        staffType: null, // 人员类型
        nation: null, // 民族
        education: null, // 文化程度
        maritalState: null, // 婚姻状况
        nationality: null, // 国籍
        nativePlace: null, // 籍贯
        householdRegister: null, // 户籍
        remarks: null, // 备注
        staffUuid: null, // 人员UUID/访客UUID
        householdType: null, // 住户类型（系统人员库的居民信息特有信息）
        address: null, // 住址（系统人员库的居民信息特有信息，由基建树拼接而来）
        facePhotoUrl: null, // 图片的url
        faceImage: null // 图片的base64 字符串
      }
    };
  },
  watch: {
    faceDBDialogVisible(val) {
      this.diglogvisible = val;
      if (val) {
        Object.assign(this.staffInfo, this.staffDetail);
        console.log(this.staffInfo);
      } else {
        this.staffInfo = {
          faceUuid: null, // 人脸uuid
          staffName: null, // 姓名
          gender: "male", // 性别
          phoneNo: null, // 手机号
          credentialType: null, // 证件类型
          credentialNo: null, // 证件号
          birthday: null, // 出生日期（根据身份证号获取）
          staffType: null, // 人员类型
          nation: null, // 民族
          education: null, // 文化程度
          maritalState: null, // 婚姻状况
          nationality: null, // 国籍
          nativePlace: null, // 籍贯
          householdRegister: null, // 户籍
          remarks: null, // 备注
          staffUuid: null, // 人员UUID/访客UUID
          householdType: null, // 住户类型（系统人员库的居民信息特有信息）
          address: null, // 住址（系统人员库的居民信息特有信息，由基建树拼接而来）
          facePhotoUrl: null, // 图片的url
          faceImage: null // 图片的base64 字符串
        };
      }
    }
  },
  activated() {},
  mounted() {
    this.certificateOptions = this.$common.getEnumByGroupStr("cred");
    this.educationOptions = this.$common.getEnumByGroupStr("edu");
    this.countryOptions = this.$common.getEnumByGroupStr("nationality");
    this.nationOptions = this.$common.getEnumByGroupStr("nation");
    this.maritalOptions = this.$common.getEnumByGroupStr("marital");
    this.staffOptions = this.$common.getEnumByGroupStr("staff_t");
  },
  methods: {
    confirmAct() {
      if (
        this.staffInfo.phoneNo &&
				!this.$common.isPhoneNum(this.staffInfo.phoneNo)
      ) {
        debugger;
        this.$message.warning("请填写正确的手机号");
        return;
      }

      if (
        this.credentialType &&
				this.credentialType === "id_card" &&
				this.staffInfo.credentialNo &&
				!this.$common.isCredentialNo(this.staffInfo.credentialNo)
      ) {
        this.$message.warning("请填写正确的身份证号");
        return;
      }
      if (!this.staffInfo.staffName) {
        this.$message.warning("请填写姓名");
        return;
      }
      if (!this.staffInfo.gender) {
        this.$message.warning("请选择性别");
        return;
      }
      if (this.staffInfo.faceUuid) {
        this.updateStaff(this.staffInfo);
      } else {
        this.addStaff(this.staffInfo);
      }
    },
    addStaff(data) {
      if (!this.staffInfo.faceImage) {
        this.$message.warning("请上传人脸照片");
        return;
      }
      this.isloading = !this.isloading;
      api
        .addStaffInfo(data)
        .then(res => {
          this.isloading = !this.isloading;
          if (res.data.success) {
            this.$message.success(res.data.msg);
            this.$emit("closeAddAct", true);
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(() => {
          this.isloading = !this.isloading;
        });
    },
    updateStaff(data) {
      this.isloading = !this.isloading;
      api
        .updateStaff(data)
        .then(res => {
          this.isloading = !this.isloading;
          if (res.data.success) {
            this.$message.success(res.data.msg);
            this.$emit("closeAddAct", true);
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(() => {
          this.isloading = !this.isloading;
        });
    },
    cancelAct() {
      this.$emit("closeAddAct");
    },
    shootPhoto() {
      this.isSnapShoot = !this.isSnapShoot;
    },
    httpRequest(e) {
      if (e.file.type === "image/jpg" || e.file.type === "image/jpeg") {
        var reader = new FileReader();
        reader.readAsDataURL(e.file);
        this.staffInfo.facePhotoUrl = URL.createObjectURL(e.file);
        var _this = this;
        reader.onload = function(e) {
          _this.staffInfo.faceImage = this.result
            .replace("data:image/jpeg;base64,", "jpeg:")
            .replace("data:image/png;base64,", "png:")
            .replace("data:image/jpg;base64,", "jpg:");
          //   _this.getFaceQualityDetection(_this.staffInfo.faceImage);
        };
      } else {
        this.$message.error("不支持该图片类型");
      }
    },
    snapPhotoAct(data) {
      this.staffInfo.faceImage = data.fileData;
      this.staffInfo.facePhotoUrl = data.imageUrl;
      this.getFaceQualityDetection(this.staffInfo.faceImage);
    },
    // 检测图片质量
    getFaceQualityDetection() {
      var data = { imageBase64: this.staffInfo.faceImage };
      this.$ResidentManageAjax
        .getFaceQualityDetection(data)
        .then(res => {
          this.$message({
            type: "success",
            message: res.data.msg
          });
        })
        .catch(err => {
          console.log(err);
          this.staffInfo.faceImage = null;
          this.staffInfo.facePhotoUrl = false;
        });
    }
  }
};
</script>
<style >
.dialogwrapadd .el-upload {
	display: block;
	width: 100%;
	height: 100%;
}
.dialogwrapadd .bodyBoxRight .el-input__inner {
	border: 1px solid rgba(255, 255, 255, 0.15);
	border-radius: 2px;
}
.dialogwrapadd .bodyBoxRight .staffNameInputBox .el-input__inner {
	border: 1px solid rgba(255, 255, 255, 0.15);
	border-radius: 2px;
	width: calc(100% - 20px);
}
.dialogwrapadd .bodyBoxRight .bodyBoxRightUploadClass {
	display: flex;
	height: 112px;
	flex-direction: column;
	justify-content: space-between;
}
</style>
<style lang='scss' scoped>
.dialogwrapadd {
	padding: 30px 0px;
	.dialogHeaderBtn {
		display: inline-block;
		text-align: right;
		.el-button {
			font-family: "PingFangSC-Regular";
			font-size: 13px;
			color: #ffffff;
			text-align: justify;
			padding: 7px 27px;
			background: rgba(40, 255, 187, 0.08);
			border: 0 solid rgba(38, 211, 157, 0.8);
			border-radius: 2px;
		}
	}
	.dialogHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 23px 0;
		border-bottom: 1px dashed rgba($color: #ffffff, $alpha: 0.15);
		span {
			font-family: "PingFangSC-Regular";
			font-size: 14px;
			color: #ffffff;
			letter-spacing: 0;
			border-left: 4px solid #26d39d;
			border-radius: 1px;
			padding-left: 8px;
		}
	}
	.bodyBox {
		display: flex;
		justify-content: flex-start;
		padding: 30px 0;
		height: 315px;
		border-bottom: 1px dashed rgba($color: #ffffff, $alpha: 0.15);
		box-sizing: border-box;
		.bodyBoxLeft {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 120px;
			align-items: flex-end;
			.left_tips_txt {
				font-family: "PingFangSC-Regular";
				font-size: 13px;
				color: #dddddd;
				text-align: right;
				line-height: 32px;
			}
			.uploadClass {
				display: inline-block;
				width: 92px;
				position: relative;
				height: 112px;
				background: rgba(0, 0, 0, 0.1);
				border: 0 solid rgba(255, 255, 255, 0.1);
				.el-upload {
					display: block;
					.left_tips {
						text-align: center;
						box-sizing: border-box;
						font-family: "PingFangSC-Regular";
						font-size: 12px;
						color: #26d39d;
						margin: auto;
					}
					.imgBox {
						width: 100%;
						height: 100%;
						img {
							width: 100%;
							height: 100%;
						}
					}
					.deleteIconBox {
						width: 22px;
						height: 22px;
						border-radius: 11px;
						position: absolute;
						right: 3px;
						top: 3px;
						background-color: rgba(17, 17, 17, 0.5);
						img {
							width: 10px;
							height: 10px;
							margin: 6px;
						}
					}
				}
				.tipsBox {
					display: block;
					padding: 10px 0;
					.left_tips {
						line-height: 45px;
					}
				}
			}
		}
		.bodyBoxRight {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 25px;
			.staffNameInputBox {
				.el-input {
					width: 150px;
				}
				.el-input::after {
					content: "*";
					color: #ff5f5f;
					margin-left: 10px;
				}
			}
			.phoneNumberInputBox {
				.el-input {
					width: 220px;
				}
			}
			.themeFont {
				font-family: "PingFangSC-Regular";
				font-size: 12px;
				color: #26d39d;
				margin-left: 65px;
			}
		}
	}
	.dialogFooter {
		padding-top: 22px;
		text-align: right;
	}
}
</style>
