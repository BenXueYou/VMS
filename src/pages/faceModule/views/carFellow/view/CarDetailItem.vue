<template>
	<div class="fellow-info-detail">
		<div class="fellow-info-detail-img">
			<img :src="$common.setPictureShow(item.photouri)" width="100%" height="100%" />
		</div>
		<div class="fellow-info-detail-line1">
			<div class="title">共同摄像头{{item.channelCount}}个</div>
			<div class="title">同行{{item.count}}次</div>
		</div>
		<div class="fellow-info-detail-line2">
			<div class="title">{{$common.setStringText(item.staffname)}}</div>
			<div class="title">{{$common.setStringText(item.libraryname)}}</div>
		</div>
	</div>
</template>

<script>
export default {
  components: {},
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  watch: {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.fellow-info-detail {
	height: 200px;
	width: 168px;
	border: 1px solid #213f3a;
	border-radius: 3px;
	background: #1b1e21;
	padding: 10px 15px;
	box-sizing: border-box;
	.fellow-info-detail-img {
		width: 132px;
		height: 130px;
	}
	%title {
		opacity: 0.6;
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #ffffff;
		letter-spacing: 0;
		margin: 7px 2px 0 0;
	}
	.fellow-info-detail-line1 {
		display: flex;
		flex-direction: row;
		width: 100%;
		.title {
			@extend %title;
		}
	}
	.fellow-info-detail-line2 {
		display: flex;
		flex-direction: row;
		width: 100%;
		.title {
			@extend %title;
			margin-left: 18px;
		}
	}
}
</style>
