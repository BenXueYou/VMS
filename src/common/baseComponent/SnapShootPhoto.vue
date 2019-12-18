<template>
	<el-dialog
		title="拍照"
		center
		:visible.sync="shootPhotoDialogVisible"
		:width="`${canvWidth ? canvWidth + 50 : '1300'}px`"
		:before-close="handleClosePhoto"
		class="SnapShootDialogClass"
	>
		<video
			v-show="!shootPhotoShow"
			id="video"
			:height="`${canvHeight ? canvHeight : '800'}px`"
			ref="video"
		></video>
		<img v-show="shootPhotoShow" id="img" src />
		<span slot="footer" style="padding:15px">
			<el-button type="primary" @click="shootAct">拍摄</el-button>
			<el-button type="primary" @click="handleClosePhoto">取消</el-button>
		</span>
	</el-dialog>
</template>
<script>
export default {
	name: "SnapShootPhoto",
	props: {
		visible: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			fileData: null,
			imageUrl: false,
			shootPhotoDialogVisible: false,
			shootPhotoShow: false,
			canvas: null,
			video: null,
			img: null,
			canvWidth: "",
			canvHeight: "",
			mediaStreamTrack: null,
			vendorUrl: window.URL || window.webkitURL
		};
	},
	mounted() {},
	watch: {
		visible(val) {
			this.shootPhotoDialogVisible = val;
			if (val) {
				this.shootPhoto();
			}
		}
	},
	methods: {
		handleClosePhoto() {
			this.mediaStreamTrack.stop();
			this.shootPhotoDialogVisible = false;
			this.$emit("close");
		},
		// 拍照事件
		shootAct() {
			var canvas = document.createElement("canvas");
			canvas.width = this.canvWidth;
			canvas.height = this.canvHeight;
			canvas
				.getContext("2d")
				.drawImage(this.video, 0, 0, this.canvWidth, this.canvHeight);
			// 把canvas图像转为img图片
			this.shootPhotoShow = true;
			this.img = document.getElementById("img");
			this.img.src = canvas.toDataURL("image/jpg");
			this.imageUrl = canvas.toDataURL("image/jpg");
			this.fileData = this.imageUrl
				.replace("data:image/jpeg;base64,", "jpeg:")
				.replace("data:image/png;base64,", "png:")
				.replace("data:image/jpg;base64,", "jpg:");
			this.shootPhotoDialogVisible = false;

			this.$emit("snapPhotoAct", {
				imageUrl: this.imageUrl,
				fileData: this.fileData
			});
		},
		// 调取摄像头
		shootPhoto() {
			this.canvas = document.getElementById("canvas");
			var _this = this;
			_this.shootPhotoDialogVisible = true;
			_this.shootPhotoShow = false;
			setTimeout(() => {
				_this.video = document.getElementById("video");
				// 媒体对象
				window.navigator.getMedia =
					window.navigator.getUserMedia ||
					window.navigator.webkitGetUserMedia ||
					window.navigator.mozGetUserMedia ||
					window.navigator.msGetUserMedia;
				if (window.navigator.getMedia) {
					window.navigator.getMedia(
						{
							video: {
                width: { min: 1280 },
                height: { min: 720 }
              },
							audio: false // 不适用音频
						},
						function(strem) {
							console.log(strem);
							_this.mediaStreamTrack = strem.getTracks()[0];
							try {
								_this.video.src = _this.vendorUrl.createObjectURL(strem);
							} catch (e) {
								console.log(_this.video);
								_this.video.srcObject = strem;
							}
							_this.video.play();
							_this.video.addEventListener("loadedmetadata", function() {
								_this.canvWidth = this.videoWidth;
								_this.canvHeight = this.videoHeight;
							});
						},
						function(error) {
							console.log(error);
							_this.shootPhotoDialogVisible = false;
							alert("未捕捉到摄像头");
						}
					);
				} else {
					console.log(window.navigator);
					console.log(window.navigator.getMedia);
					alert("不支持摄像头");
					_this.shootPhotoDialogVisible = false;
				}
			}, 100);
		}
	}
};
</script>
<style >
.SnapShootDialogClass .el-dialog__footer {
	padding-bottom: 30px;
}
.SnapShootDialogClass .el-dialog {
	background: #25292d;
	border-radius: 3px;
	border-radius: 3px;
	margin-top: 2vh !important;
}
.SnapShootDialogClass.el-dialog__wrapper{
	overflow: auto;
}
</style>