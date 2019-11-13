<template>
	<!-- 过渡动画 -->
	<transition name="fade">
		<div class="ImgCardClass" style="width:100%;height:100%">
			<div class="footerImgBox">
				<img
					:src="$common.setPictureShow(photoItem.faceCapturePhotoUrl,PicSourceType)"
					class="image footerCardImg"
				/>
			</div>
			<div class="HomeFooterChannelName">
				<span
					style="width:100%;display: inline-block;"
					class="textclipsClass"
					@mouseover="mymouseover"
					@mouseout="mymouseout"
					@mousemove="mymousemove"
				>{{(photoItem)&&(photoItem.captureDatetime)?photoItem.captureDatetime:'-- --'}}</span>
			</div>
			<div
				class="HomeFooterChannelName textclipsClass"
				style="width:100%;"
				@mouseover="mymouseover"
				@mouseout="mymouseout"
				@mousemove="mymousemove"
			>
				{{(photoItem)&&
				(photoItem.channelName)?photoItem.channelName:'-- --'}}
			</div>
		</div>
	</transition>
</template>
<script>
import RestApi from "@/utils/RestApi.js";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
export default {
  props: {
    photoItem: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      imageHeader: RestApi.api.imageUrl,
      PicSourceType: window.config.PicSourceType
    };
  },
  methods: {
    bigImg() {
      // 发送事件
      this.$emit("clickit");
    },
    // 鼠标划过覆盖的hover弹窗事件
    mymouseover: event => {
      mouseover(event);
    },
    mymouseout(event) {
      mouseout(event);
    },
    mymousemove(event) {
      mousemove(event);
    }
  }
};
</script>
<style lang="postcss">
.ImgCardClass {
	/* width: 100%; */
	height: 100%;
	box-sizing: border-box;
}
.ImgCardClass .footerImgBox {
	width: 100%;
	height: 65%;
	box-sizing: border-box;
	padding: 10px 0px;
}
.ImgCardClass .HomeFooterChannelName {
	font-size: 12px;
	position: relative;
	color: #cccccc;
	width: 100%;
	height: 17.5%;
}
.ImgCardClass .footerCardImg {
	width: 100%;
	height: 100%;
	-webkit-background-size: cover;
	-webkit-background-origin: content;
	background-origin: content;
	background-size: auto 100%;
	-webkit-background-origin: content;
	background-origin: content;
}
</style>
