<template>
	<!-- 过渡动画 -->
	<transition name="fade">
		<div class="RecognizeCardClass">
			<el-row class="asidListRowHeader" style="position:relative;">
				<div
					class="rowHeaderBox"
					:style="`background-color:${recoginizeItem.taskColour?recoginizeItem.taskColour:'#26D39D'};opacity: 0.1`"
				></div>
				<el-col :span="18" class="asidListRowFooter textclipsClass">
					<img
						style="padding-right:12px"
						:src="(recoginizeItem.faceRecognization)&&
                        (recoginizeItem.faceRecognization.staffinfo.librarycolor==='red')?require('@/assets/red.png'):require('@/assets/icon/address.png')"
						alt
					/>
					<span
						class="textclipsClass"
						style="font-size:14px;"
						:style="`color:${(recoginizeItem.faceRecognization)&&(recoginizeItem.faceRecognization.staffinfo.librarycolor==='red') ? '#FF5F5F' : '#CCCCCC'}`"
						:class="(recoginizeItem.faceRecognization)&&(recoginizeItem.faceRecognization.staffinfo.librarycolor==='red')?'fontThemes':'fontTheme'"
						@mouseover="mymouseover"
						@mouseout="mymouseout"
						@mousemove="mymousemove"
					>
						{{(recoginizeItem.faceRecognization)&&
						(recoginizeItem.faceRecognization.channelName)?recoginizeItem.faceRecognization.channelName:'未知任务通道'}}
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
				<el-col :span="4" style="display: flex;text-align:center;width:50px">
					<el-progress
						class="asidRowProgress"
						:class="{'activec':(recoginizeItem.faceRecognization)&&(recoginizeItem.faceRecognization.staffinfo.librarycolor==='red')}"
						:stroke-width="2"
						:width="45"
						type="circle"
						:color="(recoginizeItem)&&(recoginizeItem.taskColour=='red')?'#FF5F5F':'#28FFBB'"
						:percentage="recoginizeItem.similarity||recoginizeItem.faceSimilarity || 0"
					></el-progress>
					<div class="asidFontClass" style="visibility:hidden">布控照</div>
				</el-col>
				</div>
				<div class="relativeClass">
					<div class="asidCompareImgBox" :style="`width:${imgWidth}px;height:${imgWidth}px`">
						<img class="asidCardImg" :src="$common.setPictureShow(recoginizeItem.facePhotoUrl)" />
					</div>
					<div class="asidFontClass">布控照</div>
				</div>
				<div class="asidCompareTxtClass" :style="`width:${1.2*imgWidth}px;`">
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
    dothis() {
      this.$emit('detailClick');
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
.RecognizeCardClass .alarmStateTxt {
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #26d39d;
	letter-spacing: 0;
	text-align: right;
	padding-right: 15%;
}
.RecognizeCardClass {
	/* width: 100%; */
	height: 100%;
	box-sizing: border-box;
	padding-bottom: 8px;
	background: rgba(0, 0, 0, 0.13);
	border: 1px solid rgba(255, 255, 255, 0.1);
	/* overflow: auto; */
}
.RecognizeCardClass .footerImgBox {
	width: 100%;
	height: 65%;
	box-sizing: border-box;
	padding: 10px 0px;
}
.RecognizeCardClass .asidListRowFooter {
	/* line-height: 35px; */
	font-size: 14px;
	text-align: left;
	display: flex;
	flex-direction: row;
	align-items: center;
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
	padding: 0px 5% 0px;
	width: calc(100% - 2px);
	height: calc(75% - 1px);
	box-sizing: border-box;
	display: flex;
	justify-content: flex-start;
	overflow: auto;
}
.RecognizeCardClass .asidListRowHeader {
	width: calc(100% - 2px);
	height: calc(25% - 1px);
	box-sizing: border-box;
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	padding: 1.5% 5% 1%;
}
.RecognizeCardClass .asidCompareImgBox{
	height: 100%;
	padding-top: 12px;
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
	height: 100%;;
}
.RecognizeCardClass .relativeClass {
	padding-bottom: 1.5%;
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
