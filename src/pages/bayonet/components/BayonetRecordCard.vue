<template>
	<div class="BayonetRecordCard">
		<img
			style="width: 100%; height:55%;margin-bottom:8px"
			:src="$common.setPictureShow(cardItem.vehiclePic,PicSourceType)"
		/>
		<div class="BayonetRecordFooter">
			<div>
				<img :src="icons.bayonetCarplate" alt />
				<span
					class="textClips"
					@mouseover="mymouseover"
					@mouseout="mymouseout"
					@mousemove="mymousemove"
				>{{cardItem.vehicleNo||'车牌号'}}</span>
			</div>
			<div>
				<img :src="icons.bayonetRecordAddress" alt />
				<span
					class="textClips"
					@mouseover="mymouseover"
					@mouseout="mymouseout"
					@mousemove="mymousemove"
				>{{cardItem.channelName||'抓拍通道名称'}}</span>
			</div>
			<div>
				<img :src="icons.bayonetDatetime" alt />
				<span
					class="textClips"
					@mouseover="mymouseover"
					@mouseout="mymouseout"
					@mousemove="mymousemove"
				>{{cardItem.createTime||'抓拍时间'}}</span>
			</div>
		</div>
	</div>
</template>

<script>
import icons from "@/common/js/icon.js";
import RestApi from "@/utils/RestApi.js";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
export default {
  name: "choosePannel",
  props: {
    enumArr: {
      type: Array,
      default() {
        return [];
      }
    },
    cardItem: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      icons,
      imageHeader: RestApi.api.imageUrl,
      PicSourceType: window.config.PicSourceType
    };
  },
  mounted() {},
  methods: {
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

<style lang="scss" scoped>
.BayonetRecordCard {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	background: rgba(0, 0, 0, 0.1);
	border: 0 solid rgba(255, 255, 255, 0.1);
	border-radius: 2px;
	.BayonetRecordFooter {
		width: 100%;
		height: 45%;
		padding: 13px 0 13px 10px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		img {
			width: 11px;
			height: 12px;
			margin-right: 10px;
			object-fit: fill;
		}
	}
}
</style>
