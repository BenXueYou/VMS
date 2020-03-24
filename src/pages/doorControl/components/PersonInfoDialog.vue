<template>
	<el-dialog
		width="28%"
		title
		class="dialog-main"
		:visible.sync="isCurrentShow"
		:before-close="onClickCancel"
		:close-on-click-modal="false"
		append-to-body
	>
		<div class="dialog-content">
			<!--内容-->
			<div class="pictures">
				<div class="pictures-capture">
					<el-row class="ImgBox">
						<img
							v-if="personItem"
							:src="$common.setPictureShow(personItem.openDoorUrl)"
							width="100%"
							height="100%"
						/>
						<div class="PRelPopoverClass" @click="downloadImg(personItem)">
							<img src="@/assets/images/6s.png" />
						</div>
					</el-row>
				</div>
				<div class="pictures-photo">
					<!-- <el-row class="ImgBox"> -->
					<img
						v-if="personItem"
						:src="$common.setPictureShow(personItem.idCardPictureUrl)"
						width="100%"
						height="100%"
					/>
					<!-- <div class="PRelPopoverClass" @click.native="downloadImg(personItem)">
							<img src="@/assets/images/6s.png">
					</div>-->
					<!-- </el-row> -->
				</div>
			</div>
			<div class="person-info">
				<div class="info-details-items">姓名：{{personItem ? personItem.staffName : '暂无'}}</div>
				<div class="info-details-items">性别：{{personItem ? personItem.gender : '暂无'}}</div>
				<div class="info-details-items">住址：{{personItem ? personItem.adrees : '暂无'}}</div>
				<div class="info-details-items">身份证号：{{personItem ? personItem.idCard : '暂无'}}</div>
				<div class="info-details-items">民族：{{personItem ? personItem.nation : '暂无'}}</div>
				<div
					class="info-details-items"
				>人员类型：{{personItem ? $common.getEnumItemName("staff_t", personItem.staffType) : '暂无'}}</div>
				<div class="info-details-items">电话：{{personItem ? personItem.cellphone : '暂无'}}</div>
				<div class="info-details-items">备注：{{personItem ? personItem.remarks : '暂无'}}</div>
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
    },
    personItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isCurrentShow: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    onClickCancel() {
      this.$emit("onCancel");
    },
    downloadImg(itemData) {
      if (itemData && itemData.openDoorUrl) {
        var url = this.$common.setPictureShow(itemData.openDoorUrl);
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          this.aLinkDownload(url, itemData); // IE浏览器
        } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
          this.imageCanvasAlink(url, itemData); // 火狐浏览器
        } else if (navigator.userAgent.indexOf("Chrome") !== -1) {
          this.fileUrlDownload(url, itemData); // Chrome内核浏览器
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
      image.onload = function() {
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

<style lang="scss">
.dialog-main {
	.el-dialog {
		margin-top: 11% !important;
	}
	.el-dialog__header {
		height: 0px !important;
		padding: 0px !important;
		border-width: 0px !important;
	}
	.el-dialog__title {
		padding: 0px !important;
		border-width: 0px !important;
	}
}
</style>
<style lang="scss" scoped>
@mixin flexBlock($direction) {
	display: flex;
	flex-direction: $direction;
}
.dialog-content {
	@include flexBlock(row);
	padding: 40px 30px;
	box-sizing: border-box;
	.pictures {
		@include flexBlock(column);
		%pictures-common {
			width: 100px;
			height: 100px;
		}
		.pictures-capture {
			@extend %pictures-common;
			margin-bottom: 20px;
			.PRelPopoverClass {
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
				margin-left: 70px;
				padding: 8px;
				box-sizing: border-box;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.ImgBox {
				width: 100px;
				height: 100px;
			}
		}
		.pictures-photo {
			@extend %pictures-common;
		}
	}
	.person-info {
		@include flexBlock(column);
		margin-left: 40px;
		.info-details-items {
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #b9b9b9;
			letter-spacing: 1px;
			margin-bottom: 10px;
		}
	}
}
</style>
