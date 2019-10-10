<template>
	<el-dialog class="dialogPhotoClass" :visible.sync="dialogVisible" :title="titleTxt">
		<div class="leftImgBox">
			<img
				:src="faceImgDialogData.faceCapturePhotoUrl?faceImgDialogData.dialogPhotoImgUrl:require('@/assets/user.png')"
				alt
			/>
			<p>{{faceImgDialogData.channelName||'抓拍相机'}}</p>
		</div>
		<div class="rightImgBox">
			<img
				:src="faceImgDialogData.panoramaCapturePhotoUrl?faceImgDialogData.dialogPanoramaImgUrl:require('@/assets/user.png')"
				alt
			/>
			<div class="flexBox">
				<p>
					<span>特征识别：{{faceImgDialogData.sunglasses?'戴墨镜 ':" "}} {{faceImgDialogData.mask?'戴口罩':""}}</span>
					<span>性别：{{faceImgDialogData.gender||" "}}</span>
					<span>年龄：{{faceImgDialogData.age||""}}</span>
				</p>
				<p>{{faceImgDialogData.alarmDatetime||"抓拍时间"}}</p>
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
      default: '详情'
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogPhotoImgUrl: "",
      dialogPanoramaImgUrl: ""
    };
  },
  methods: {
    exportBtnAct() {
      var dialogPanoramaImgUrl = this.faceImgDialogData.dialogPanoramaImgUrl;
      var dialogPhotoImgUrl = this.faceImgDialogData.dialogPhotoImgUrl;
      var itemData = this.faceImgDialogData;
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        this.aLinkDownload(dialogPanoramaImgUrl, itemData); // IE浏览器
        this.aLinkDownload(dialogPhotoImgUrl, itemData); // IE浏览器
      } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
        this.imageCanvasAlink(dialogPanoramaImgUrl, itemData); // 火狐浏览器
        this.imageCanvasAlink(dialogPhotoImgUrl, itemData); // 火狐浏览器
      } else if (navigator.userAgent.indexOf("Chrome") !== -1) {
        this.fileUrlDownload(dialogPanoramaImgUrl, itemData); // Chrome内核浏览器
        this.fileUrlDownload(dialogPhotoImgUrl, itemData); // Chrome内核浏览器
      } else {
        this.aLinkDownload(dialogPanoramaImgUrl, itemData);
        this.aLinkDownload(dialogPhotoImgUrl, itemData);
      }
    },
    // 下载图片的几种方式
    // 接口返回文件刘 chrome 浏览器会识别不了类型
    aLinkDownload(url, itemData) {
      var a = document.createElement("a");
      let event = new MouseEvent("click");
      a.href = url;
      if (itemData && itemData.staffName) {
        a.download = itemData.staffName + ".jpg";
      } else {
        a.download = "xxx.jpg";
      }
      // a.click();火狐浏览器不触发
      a.dispatchEvent(event);
    },
    // 下载文件流的方式 火狐浏览器会默认XML格式，无法定义文件类型
    fileUrlDownload(url, itemData) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = "blob"; // 返回类型blob
      xhr.onload = function() {
        // 定义请求完成的处理函数
        if (this.status === 200) {
          var blob = this.response;
          var reader = new FileReader();
          reader.readAsDataURL(blob); // 转换为base64，可以直接放入a标签href
          reader.onload = function(e) {
            var str = e.target.result;
            var type = str.substring(str.indexOf("/") + 1, str.indexOf(";"));
            var a = document.createElement("a"); // 转换完成，创建一个a标签用于下载
            let event = new MouseEvent("click");
            if (itemData && itemData.staffName) {
              a.download = itemData.staffName + "." + type;
            } else {
              a.download = "xxx.jpg";
            }
            a.href = e.target.result;
            a.dispatchEvent(event);
          };
        } else if (this.status === 504) {
          alert("导出失败，请求超时");
        } else {
          alert("导出失败");
        }
      };
      xhr.open("get", url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send();
    },
    // 通过canvas转换
    imageCanvasAlink(src, itemData) {
      // 通过Images对象
      let image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function(e) {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        // window.navigator.msSaveBlob(canvas.msToBlob(), 'image.jpg');
        let url = canvas.toDataURL("image/png");
        let a = document.createElement("a");
        let event = new MouseEvent("click");
        if (itemData && itemData.staffName) {
          a.download = itemData.staffInfo.staffName + ".jpg";
        } else {
          a.download = "xxx.jpg";
        }
        a.href = url;
        // 触发a的单击事件
        a.dispatchEvent(event);
      };
      // 获取img上的src值，赋值之后，完成之后会调用onload事件
      image.src = src;
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
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

.dialogPhotoClass .rightImgBox {
	width: 63%;
	height: 100%;
	margin-left: 2%;
}
</style>
