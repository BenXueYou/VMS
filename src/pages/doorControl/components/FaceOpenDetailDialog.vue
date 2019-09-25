<template>
	<el-dialog
		width="550px"
		title="详情信息"
		:visible.sync="isCurrentShow"
		:before-close="onClickCancel"
		:close-on-click-modal="false"
	>
		<div class="dialog-content">
			<!--内容-->
			<div class="lock-info">
				<div class="info-pic">
					<el-row slot="reference" class="ImgBox">
						<img
							:src="itemData && itemData.staffInfo ? $common.setPictureShow(itemData.staffInfo.openDoorUrl) : require('@/assets/images/user.png')"
							height="100%"
							style="object-fit: contain;max-width:100%;"
						/>
						<div class="FRelPopoverCol" @click="downloadImg(itemData)">
							<img src="@/assets/images/6s.png" />
						</div>
					</el-row>
				</div>
				<div class="info-details">
					<div class="info-details-title">
						<img src="@/assets/images/calendar.png" width="15px" height="15px" />
						<div class="info-details-title-text">开锁图片1</div>
					</div>
					<div class="info-details-items">验证时间：{{$common.setStringText(itemData.validateTime)}}</div>
					<div class="info-details-items">验证方式：{{$common.getEnumItemName("pass", itemData.validateType)}}</div>
					<div class="info-details-items">验证地址：{{$common.setStringText(itemData.doorName)}}</div>
					<div class="info-details-items">验证设备：{{$common.setStringText(itemData.readHeadName)}}</div>
					<div
						class="info-details-items"
						v-if="validateType === 'card'"
					>卡号：{{itemData && itemData.staffInfo ? $common.setStringText(itemData.staffInfo.mediumNo) : ""}}</div>
				</div>
			</div>
			<div class="person-info">
				<div class="info-pic">
					<img
						:src="itemData && itemData.staffInfo ? $common.setPictureShow(itemData.staffInfo.idCardPictureUrl) : require('@/assets/images/user.png')"
						height="100%"
            style="object-fit: contain;max-width:100%;"
					/>
				</div>
				<div class="info-details">
					<div class="info-details-title">
						<img src="@/assets/images/calendar.png" width="15px" height="15px" />
						<div class="info-details-title-text">人员信息</div>
					</div>
					<div
						class="info-details-items"
					>姓名：{{itemData && itemData.staffInfo ? $common.setStringText(itemData.staffInfo.staffName) : ''}}</div>
					<div
						class="info-details-items"
					>性别：{{itemData && itemData.staffInfo ? $common.getEnumItemName("gender", itemData.staffInfo.gender) : ''}}</div>
					<div
						class="info-details-items"
					>住址：{{itemData && itemData.staffInfo ? $common.setStringText(itemData.staffInfo.adrees) : ''}}</div>
					<div
						class="info-details-items"
					>身份证号：{{itemData && itemData.staffInfo ? $common.setStringText(itemData.staffInfo.idCard) : ''}}</div>
					<div
						class="info-details-items"
					>民族：{{itemData && itemData.staffInfo ? $common.getEnumItemName("nation", itemData.staffInfo.nation) : ''}}</div>
					<div
						class="info-details-items"
					>人员类型：{{itemData && itemData.staffInfo ? $common.getEnumItemName("staff_t", itemData.staffInfo.staffType) : ''}}</div>
					<div
						class="info-details-items"
					>电话：{{itemData && itemData.staffInfo ? $common.setStringText(itemData.staffInfo.cellphone) : ''}}</div>
					<div
						class="info-details-items"
					>备注：{{itemData && itemData.staffInfo ? $common.setStringText(itemData.staffInfo.remarks) : ''}}</div>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCurrentShow: false,
      validateType: "",
      itemData: {
        doorName: "",
        validateType: "",
        validateTypeName: "",
        staffType: "",
        staffName: "",
        validateTime: "",
        readHeadName: "",
        staffInfo: {
          staffName: "",
          gender: "",
          adrees: "",
          idCard: "",
          nation: "",
          staffType: "",
          cellphone: "",
          remarks: "",
          idCardPictureUrl: "",
          openDoorUrl: ""
        },
        staffInfoGroup: null
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    downloadImg(itemData) {
      if (itemData && itemData.staffInfo && itemData.staffInfo.openDoorUrl) {
        var url = this.$common.setPictureShow(itemData.staffInfo.openDoorUrl);
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          this.aLinkDownload(url, itemData); // IE浏览器
        } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
          this.imageCanvasAlink(url, itemData); // 火狐浏览器
        } else if (navigator.userAgent.indexOf("Chrome") !== -1) {
          this.fileUrlDownload(url, itemData); // Chrome内核浏览器
          // this.imageCanvasAlink(url, itemData); // 火狐浏览器
        } else {
          this.aLinkDownload(url, itemData);
        }
      } else {
        this.$message({ type: "error", message: "未找到下载资源" });
      }
    },
    // 下载图片的几种方式
    // 接口返回文件刘 chrome 浏览器会识别不了类型
    aLinkDownload(url, itemData) {
      var a = document.createElement("a");
      let event = new MouseEvent("click");
      a.href = url;
      if (itemData && itemData.staffInfo && itemData.staffInfo.staffName) {
        a.download = itemData.staffInfo.staffName + ".jpg";
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
            if (
              itemData &&
							itemData.staffInfo &&
							itemData.staffInfo.staffName
            ) {
              a.download = itemData.staffInfo.staffName + "." + type;
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
        if (itemData && itemData.staffInfo && itemData.staffInfo.staffName) {
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
    },

    onClickCancel() {
      this.resetData();
      this.$emit("onCancel");
    },
    resetData() {
      this.itemData = {
        doorName: "",
        validateType: "",
        validateTypeName: "",
        staffType: "",
        staffName: "",
        validateTime: "",
        readHeadName: "",
        staffInfo: {
          staffName: "",
          gender: "",
          adrees: "",
          idCard: "",
          nation: "",
          staffType: "",
          cellphone: "",
          remarks: "",
          idCardPictureUrl: "",
          openDoorUrl: ""
        },
        staffInfoGroup: null
      };
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
    }
  },
  destroyed() {}
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@mixin setFontStyle($fontsize, $color) {
	font-family: "PingFangSC-Regular";
	font-size: $fontsize;
	color: $color;
	letter-spacing: 1px;
}
@mixin flexBlock($direction) {
	display: flex;
	flex-direction: $direction;
}
.dialog-content {
	padding: 10px 30px;
	box-sizing: border-box;
	@mixin info-common($margin-bottom1, $margin-bottom2) {
		@include flexBlock(row);
		width: 100%;
		box-sizing: border-box;
		.info-pic {
			width: 145px;
			height: 145px;
			text-align: center;
			.FRelPopoverCol {
				width: 28px;
				height: 28px;
				font-size: 12px;
				color: rgb(159, 157, 153);
				cursor: pointer;
				text-align: center;
				margin-top: -40px;
				text-align: right;
				background: rgba(0, 0, 0, 0.6);
				border-radius: 14px;
				margin-left: 115px;
				padding: 8px;
				box-sizing: border-box;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.ImgBox {
				width: 100%;
				height: 100%;
				text-align: center;
			}
		}
		.info-details {
			margin-left: 5%;
			@include flexBlock(column);
			.info-details-title {
				@include flexBlock(row);
				align-items: center;
				margin-bottom: $margin-bottom2;
				.info-details-title-text {
					margin-left: 10px;
					@include setFontStyle(14px, #ebecec);
				}
			}
			.info-details-items {
				@include setFontStyle(14px, #afafb0);
				margin-bottom: $margin-bottom1;
			}
			&:last-child {
				margin-bottom: 0px;
			}
		}
	}
	.lock-info {
		@include info-common(8px, 20px);
		border-width: 0 0 1px 0;
		border-style: dashed;
		border-color: #444749;
		padding: 20px 20px 28px 20px;
	}
	.person-info {
		@include info-common(2px, 10px);
		padding: 28px 20px 8px 20px;
	}
}
</style>
