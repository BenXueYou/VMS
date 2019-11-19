<template>
	<el-dialog class="dialogPhotoClass" :visible.sync="dialogVisible" :title="titleTxt" @close="close">
		<div class="leftImgBox">
			<!-- <img :src="$common.setPictureShow(faceImgDialogData.faceCapturePhotoUrl,PicSourceType)" alt /> -->
			<el-image
				:src="$common.setPictureShow(faceImgDialogData.facePhotoUrl,PicSourceType)"
				:preview-src-list="[$common.setPictureShow(faceImgDialogData.facePhotoUrl,PicSourceType)]"
			></el-image>
			<p>{{faceImgDialogData.channelName||'抓拍相机'}}</p>
		</div>
		<div class="rightImgBox">
			<!-- <img :src="$common.setPictureShow(faceImgDialogData.panoramaCapturePhotoUrl,PicSourceType)" alt /> -->
			<el-image
				:src="$common.setPictureShow(faceImgDialogData.panoramaCapturePhotoUrl,PicSourceType)"
				:preview-src-list="[$common.setPictureShow(faceImgDialogData.panoramaCapturePhotoUrl,PicSourceType)]"
			></el-image>
			<div class="flexBox">
				<p>
					<span>特征识别：{{faceImgDialogData.sunglasses?'戴墨镜 ':" "}} {{faceImgDialogData.mask?'戴口罩':""}}</span>
					<span>性别：{{$common.getEnumItemName("gender", faceImgDialogData.gender)||" "}}</span>
					<span>年龄：{{faceImgDialogData.age||""}}</span>
				</p>
				<p>{{faceImgDialogData.captureDatetime||"抓拍时间"}}</p>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="exportBtnAct">
				<img src="@/assets/images/faceModule/export_pic.png" />导出
			</el-button>
		</span>
	</el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    faceImgDialogData: {
      type: Object,
      default() {
        return {};
      }
    },
    titleTxt: {
      type: String,
      default: "详情"
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogPhotoImgUrl: "",
      dialogPanoramaImgUrl: "",
      PicSourceType: window.config.PicSourceType
    };
  },
  methods: {
    exportBtnAct() {
      var dialogPanoramaImgUrl = this.faceImgDialogData.panoramaCapturePhotoUrl;
      var dialogPhotoImgUrl = this.faceImgDialogData.faceCapturePhotoUrl;
      var itemData = this.faceImgDialogData;
      this.$common.exportImageAct(dialogPanoramaImgUrl, itemData);
      this.$common.exportImageAct(dialogPhotoImgUrl, itemData);
    },
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      console.log(this.faceImgDialogData);
    }
  }
};
</script>
<style>
.dialogPhotoClass .el-dialog__body {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	padding: 25px 38px 10px;
	box-sizing: border-box;
	width: 100%;
}
.dialogPhotoClass .el-dialog__footer {
	padding: 0px 38px 33px;
}
.dialogPhotoClass .dialog-footer img {
	width: 12px;
	height: 11px;
	margin-right: 6px;
	vertical-align: bottom;
}
.dialogPhotoClass .dialog-footer .el-button {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
	text-align: justify;
}
.dialogPhotoClass .el-dialog {
	width: 800px;
}
.dialogPhotoClass p {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #bbbbbb;
	letter-spacing: 0;
}
.dialogPhotoClass p span {
	margin-right: 10px;
}
.dialogPhotoClass .flexBox {
	display: flex;
	justify-content: space-between;
}
.dialogPhotoClass img {
	width: 100%;
	height: 250px;
	box-sizing: border-box;
	padding: 0;
}
.dialogPhotoClass .leftImgBox {
	width: 35%;

	height: 100%;
}
.dialogPhotoClass .leftImgBox img {
	min-width: 249px;
	min-height: 249px;
}
.dialogPhotoClass .rightImgBox {
	width: 63%;
	height: 100%;
	margin-left: 2%;
}
.dialogPhotoClass .rightImgBox img {
	width: 445px;
	height: 250px;
}
</style>
