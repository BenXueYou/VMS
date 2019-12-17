<template>
	<!-- 过渡动画 -->
	<transition name="fade">
		<div class="RecognizeCardClass" @dblclick.native="clickDetailAct">
			<el-row class="asidListRowHeader" style="position:relative;">
				<div
					class="rowHeaderBox"
					:style="`background-color:${recoginizeItem.taskColour?recoginizeItem.taskColour:'#26D39D'};opacity: 0.1`"
				></div>
				<el-col :span="18" class="asidListRowFooter textclipsClass">
					<div class="header-line"></div>
					<span
						class="textclipsClass"
						style="font-size:14px;opacity:1;padding-left:8px;color:#FFFFFF;"
						@mouseover="mymouseover"
						@mouseout="mymouseout"
						@mousemove="mymousemove"
					>
						{{(recoginizeItem)&&
						(recoginizeItem.faceMonitorName)?recoginizeItem.faceMonitorName:'布控任务名称'}}
					</span>
				</el-col>
				<el-col :span="6" class="asidListRowFooter imgTxtClass">
					<div class="cursorClass" @click="clickDetailAct">
						<span>详情</span>
						<img src="@/assets/images/faceModule/detail_btn_icon.png" />
					</div>
				</el-col>
			</el-row>
			<div class="asidListRowBody">
				<div class="relativeClass">
					<div class="asidCompareImgBox" :style="`width:${imgWidth}px;height:${imgWidth}px`">
						<img
							class="asidCardImg"
							:src="$common.setPictureShow(recoginizeItem.faceCapturePhotoUrl,PicSourceType)"
						/>
					</div>
					<div class="asidFontClass">抓拍照</div>
				</div>
				<div class="progressBox">
					<el-progress
						class="asidRowProgress"
						:class="{'activec':(recoginizeItem)&&(recoginizeItem.taskColour==='red')}"
						:stroke-width="2"
						:width="45"
						type="circle"
						:color="(recoginizeItem)&&(recoginizeItem.taskColour=='red')?'#FF5F5F':'#28FFBB'"
						:percentage="recoginizeItem.similarity||recoginizeItem.faceSimilarity || 0"
					></el-progress>
					<div class="asidFontClass" style="visibility:hidden">布控照</div>
				</div>
				<div class="relativeClass">
					<div class="asidCompareImgBox" :style="`width:${imgWidth}px;height:${imgWidth}px`">
						<img class="asidCardImg" :src="$common.setPictureShow(recoginizeItem.facePhotoUrl)" />
					</div>
					<div class="asidFontClass">布控照</div>
				</div>
				<div class="asidCompareTxtClass" :style="`width:${imgWidth>95?'100%':'84px'};`">
					<div class="asidFontClass">{{recoginizeItem.staffName||'姓名:-- --'}}</div>
					<div
						class="asidFontClass"
					>{{$common.getEnumItemName("staff_t", recoginizeItem.staffType)||'人员类型'}}</div>
					<div class="asidFontClass">{{recoginizeItem.libraryName||'所属库:-- -- '}}</div>
					<div
						@mouseover="mymouseover"
						@mouseout="mymouseout"
						@mousemove="mymousemove"
						class="asidFontClass textclipsClass"
					>{{recoginizeItem.channelName||'通道名称'}}</div>
					<template v-if="imgWidth>95">
						<div
							@mouseover="mymouseover"
							@mouseout="mymouseout"
							@mousemove="mymousemove"
							class="textclipsClass asidFontClass"
						>{{recoginizeItem.captureDatetime?recoginizeItem.captureDatetime:'抓拍时间：-- --'}}</div>
					</template>
					<template v-else>
						<div
							@mouseover="mymouseover"
							@mouseout="mymouseout"
							@mousemove="mymousemove"
							class="textclipsClass asidFontClass"
						>{{recoginizeItem.captureDatetime?recoginizeItem.captureDatetime.split(" ")[0]:'抓拍日期：-- --'}}</div>
						<div
							@mouseover="mymouseover"
							@mouseout="mymouseout"
							@mousemove="mymousemove"
							class="textclipsClass asidFontClass"
						>{{recoginizeItem.captureDatetime?recoginizeItem.captureDatetime.split(" ")[1]:'抓拍时间：-- --'}}</div>
					</template>
				</div>
			</div>
			<div
				v-if="alarmState"
				class="alarmStateTxt"
			>{{$common.getEnumItemName("alarm_r",alarmState)||'已处理'}}</div>
		</div>
	</transition>
</template>
<script>
import RestApi from "@/utils/RestApi.js";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
export default {
  props: {
    recoginizeItem: {
      type: Object,
      default() {
        return {};
      }
    },
    imgWidth: {
      type: String,
      default: "95"
    },
    alarmState: {
      type: undefined,
      default: false
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
    clickDetailAct() {
      console.log("事件");
      this.$emit("detailClick");
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
.RecognizeCardClass .header-line {
	border-left: 2px solid #ffffff;
	height: 10px;
	display: inline-block;
	margin-bottom: 3px
}
.RecognizeCardClass .alarmStateTxt {
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #26d39d;
	letter-spacing: 0;
	text-align: right;
	padding-right: 15%;
	padding-bottom: 10px;
}
.RecognizeCardClass {
	height: 100%;
	box-sizing: border-box;
	background: rgba(0, 0, 0, 0.09);
	border: 1px solid rgba(255, 255, 255, 0.1);
	/* overflow: auto; */
}
.RecognizeCardClass .progressBox {
	display: flex;
	text-align: center;
	width: 60px;
	flex-direction: column;
}
.RecognizeCardClass .asidListRowFooter {
	/* line-height: 35px; */
	font-size: 14px;
	text-align: left;
	display: flex;
	flex-direction: row;
	align-items: center;
	opacity: 1;
}
.RecognizeCardClass .asidListRowFooter.imgTxtClass {
	display: flex;
	justify-content: flex-end;
}
.RecognizeCardClass .asidListRowFooter.imgTxtClass .cursorClass span {
	font-size: 12px;
}
.asidListRowFooter.imgTxtClass .cursorClass img {
	vertical-align: middle;
	margin: 2px 0 0 5px;
}
.RecognizeCardClass .asidRowProgress {
	margin: auto;
	color: #28ffbb;
	font-size: 14px;
}
.RecognizeCardClass .textclipsClass {
	display: inline-block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
}

.RecognizeCardClass .imgTxtClass {
	font-size: 14px;
	display: flex;
	flex-direction: row;
	align-items: center;
	color: #ffffff;
	font-family: "PingFangSC-Medium";
}
.RecognizeCardClass .asidFontClass {
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #bbbbbb;
	letter-spacing: 0;
}
.RecognizeCardClass .asidListRowBody {
	width: 100%;
	padding: 12px 15px 10px;
	box-sizing: border-box;
	display: flex;
	justify-content: flex-start;
	overflow: auto;
}
.RecognizeCardClass .asidListRowHeader {
	height: 35px;
	box-sizing: border-box;
	padding: 1.5% 5% 1%;
}
.RecognizeCardClass .asidCompareImgBox {
	width: 96px;
	height: 96px;
	margin-bottom: 6px;
	box-sizing: border-box;
}
.RecognizeCardClass .asidCompareTxtClass {
	width: 36%;
	text-align: left;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	padding: 0px;
	border-left: 1px dashed #333333;
	margin-left: 10px;
	padding-left: 2%;
	padding-bottom: 1.5%;
}
@media screen and (max-width: 1400px) {
	.RecognizeCardClass .asidCompareImgBox {
		width: 75px;
		height: 75px;
		margin-bottom: 6px;
		box-sizing: border-box;
	}
}
.RecognizeCardClass .asidCardImg {
	width: 100%;
	height: 100%;
}
.RecognizeCardClass .relativeClass {
	padding-bottom: 1.5%;
	text-align: center;
}
.RecognizeCardClass .rowHeaderBox {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 34px;
	z-index: 10;
	pointer-events: none;
	/* overflow-x: auto; */
}
</style>
