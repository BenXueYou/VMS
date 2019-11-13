<template>
	<el-dialog
		title="拍照"
		center
		:visible.sync="shootPhotoDialogVisible"
		width="400px"
		:before-close="handleClose"
		class="SnapShootDialogClass"
	>
		<video v-show="!shootPhotoShow" id="video" ref="video" width="350" height="300"></video>
		<img v-show="shootPhotoShow" id="img" src />
		<span slot="footer" style="padding:15px;margin-bottom:30px;">
			<el-button type="primary" @click="shootPhotoDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="shootAct">拍摄</el-button>
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
		handleClose() {
            this.shootPhotoDialogVisible = false;
            this.$emit('close');
		},
		// 拍照事件
		shootAct() {
			var canvas = document.createElement("canvas");
			canvas.width = "350";
			canvas.height = "260";
			canvas.getContext("2d").drawImage(this.video, 0, 0, 350, 260);
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

			this.$emit("snapPhotoAct",{imageUrl:this.imageUrl,fileData:this.fileData});
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
							video: true, // 使用摄像头对象
							audio: false // 不适用音频
						},
						function(strem) {
							console.log(strem);
							try {
								_this.video.src = _this.vendorUrl.createObjectURL(strem);
							} catch (e) {
								console.log(_this.video);
								_this.video.srcObject = strem;
							}
							_this.video.play();
						},
						function(error) {
							console.log(error);
							_this.shootPhotoDialogVisible = false;
							alert("未捕捉到摄像头");
						}
					);
				} else {
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
</style>