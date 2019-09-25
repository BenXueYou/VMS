<template>
	<!-- 过渡动画 -->
	<transition name="fade">
		<div class="img-view" @click="bigImg">
			<!-- 遮罩层 -->
			<div class="img-layer"></div>
			<div class="imgBox">
				<div class="closeImgBox" @click="bigImg">
					<img class="closeImg" src="@/assets/icon/close.png" alt />
				</div>
				<img class="img" :src="imgSrc" />
			</div>
		</div>
	</transition>
</template>
<script>
export default {
  props: ["imgSrc"], // 接受图片地址
  methods: {
    bigImg() {
      // 发送事件
      this.$emit("clickit");
    }
  }
};
</script>
<style lang="postcss">
/* bigimg */
.img-view {
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 1111;
	margin: auto;
	background: rgba(25, 25, 25, 0.5);
	bottom: 0px;
	left: 0px;
	display: flex;
	justify-content: center;
	align-content: center;
	flex-direction: column;
	box-sizing: border-box;
}
/* 遮罩层样式 */
.img-view .img-layer {
	position: relative;
	z-index: 999;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.7);
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.img-view .imgBox {
	position: relative;
	margin: auto;
}
.img-view .closeImgBox {
	width: 50%;
	margin: auto;
	background-color: rgba(225, 225, 225, 0.5);
	text-align: right;
}

/* 不限制图片大小，实现居中 */
.img-view .imgBox .img {
	max-width: 50%;
	display: block;
	position: relative;
}
/* 动画 */
.fade-enter-active,
.fade-leave-active {
	transition: all 0.2s linear;
	transform: translate3D(0, 0, 0);
}
.fade-enter,
.fade-leave-active {
	transform: translate3D(100%, 0, 0);
}
</style>
