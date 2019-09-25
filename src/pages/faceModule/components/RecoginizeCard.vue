<template>
	<!-- 过渡动画 -->
	<transition name="fade">
		<div class="RecognizeCardClass">
			<el-row
				:class="(recoginizeItem.faceRecognization)&&(recoginizeItem.faceRecognization.staffinfo.librarycolor==='red')?'asidListRowHeaders':'asidListRowHeader'"
			>
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
				<el-col :span="6" class="asidListRowFooter imgTxtClass" style="justify-content:flex-end">
					<span
						class="fontColor"
						:class="(recoginizeItem.faceRecognization)&&(recoginizeItem.faceRecognization.staffinfo.librarycolor=='red')?'fontThemes':'fontTheme'"
						@click="dothis()"
					>详情</span>
					<img
						@click="dothis()"
						style="margin-left:10px"
						:src="(recoginizeItem.faceRecognization)&&
                  (recoginizeItem.faceRecognization.staffinfo.librarycolor=='red')?require('@/assets/icon/details.png'):require('@/assets/icon/details.png')"
					/>
				</el-col>
			</el-row>
			<el-row class="asidListRowBody" type="flex" justify="space-between">
				<el-col :span="6" class="relativeClass">
					<div class="asidCompareImgBox">
						<img
							class="asidCardImg"
							:src="(recoginizeItem.faceRecognization)&&(recoginizeItem.faceRecognization.photoinfo.imageUri)?recoginizeItem.faceRecognization.photoinfo.imageUri:require('@/assets/user.png')"
						/>
					</div>
				</el-col>
				<el-col :span="4" style="display: flex;text-align:center;width:50px">
					<el-progress
						class="asidRowProgress"
						:class="{'activec':(recoginizeItem.faceRecognization)&&(recoginizeItem.faceRecognization.staffinfo.librarycolor==='red')}"
						:stroke-width="2"
						:width="45"
						type="circle"
						:color="(recoginizeItem.faceRecognization)&&(recoginizeItem.faceRecognization.staffinfo.librarycolor=='red')?'#FF5F5F':'#28FFBB'"
						:percentage="(recoginizeItem.faceRecognization)&&(recoginizeItem.faceRecognization.scores)?parseInt(recoginizeItem.faceRecognization.scores.toFixed(0)):0"
					></el-progress>
				</el-col>
				<el-col :span="6" class="relativeClass">
					<div class="asidCompareImgBox">
						<img
							class="asidCardImg"
							:src="(recoginizeItem.faceRecognization)&&(recoginizeItem.faceRecognization.staffinfo.photoUri)?recoginizeItem.faceRecognization.staffinfo.photoUri:require('@/assets/user.png')"
						/>
					</div>
				</el-col>
				<el-col :span="8" class="asidCompareTxtClass" style="padding-left:2%;padding-bottom:1.5%;">
					<div
						@mouseover="mymouseover"
						@mouseout="mymouseout"
						@mousemove="mymousemove"
						class="textclipsClass asidFontColor"
					>{{(recoginizeItem.faceRecognization)&&(recoginizeItem.faceRecognization.time)?recoginizeItem.faceRecognization.time.split(" ")[1]:'抓拍时间：-- --'}}</div>
					<div
						class="asidFontColor"
					>{{(recoginizeItem.faceRecognization)&&(recoginizeItem.faceRecognization.staffinfo.staffName)?recoginizeItem.faceRecognization.staffinfo.staffName:'姓名:-- --'}}</div>
					<div class="asidFontColor">
						{{(recoginizeItem.faceRecognization)&&(recoginizeItem.faceRecognization.staffinfo.libraryName)?recoginizeItem.faceRecognization.staffinfo.libraryName:'所属库:-- -- '}}
						<i
							v-if="(recoginizeItem.faceRecognization)&&(recoginizeItem.faceRecognization.staffinfo.librarycolor)"
							class="el-icon-warning"
							:style="{'color':recoginizeItem.faceRecognization.staffinfo.librarycolor}"
						></i>
						<i v-else class="el-icon-warning" :style="{'color':'#28FFBB'}"></i>
					</div>
				</el-col>
			</el-row>
		</div>
	</transition>
</template>
<script>
import { mouseover, mouseout, mousemove } from "@/common/mouse.js"; // 注意路径
export default {
  props: {
    recoginizeItem: {
      type: Object,
      default() {
        return {};
      }
    }
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
.RecognizeCardClass {
	/* width: 100%; */
	height: 100%;
	box-sizing: border-box;
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
.RecognizeCardClass .asidListRow {
	width: 100%;
	margin-top: 3.5%;
	height: 18%;
	color: #fff;
	background-color: rgb(29, 31, 34);
	border-radius: 3px;
	border: 0px solid rgb(45, 78, 75);
	white-space: nowrap;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	box-sizing: border-box;
}
.RecognizeCardClass .imgTxtClass {
	font-size: 14px;
	display: flex;
	flex-direction: row;
	align-items: center;
	color: #ffffff;
	font-family: "PingFangSC-Medium";
}

.RecognizeCardClass .asidFontColor {
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
}
.RecognizeCardClass .asidListRowHeaders {
	width: calc(100% - 2px);
	height: calc(25% - 1px);
	box-sizing: border-box;
	border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
	padding: 10px 5% 8px;
	color: #fff;
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
.RecognizeCardClass .asidCardImg{
	width: 100%;
	height: 100%;;
}
.RecognizeCardClass .relativeClass {
	padding-bottom: 1.5%;
}
</style>
