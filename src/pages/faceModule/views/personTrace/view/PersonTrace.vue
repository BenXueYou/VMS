<template>
	<div class="companion-main">
		<div class="main-container">
			<div class="select-box">
				<pic-upload
					:disabled="!OwnAuthDisabled"
					@addImage="addImage"
					:imageUrl="imageUrl"
					@deleteImage="deleteImage"
					ref="picUpload"
					height="125px"
				/>
				<div class="input">
					<div class="line-one">
						<span class="topTitleTxt">检索时间：</span>
						<el-date-picker
							v-model="startTime"
							type="datetime"
							style="width: 14%; margin-left: 5px"
							placeholder="选择日期"
							value-format="yyyy-MM-dd HH:mm:ss"
						></el-date-picker>
						<span class="line">—</span>
						<el-date-picker
							v-model="endTime"
							type="datetime"
							style="width: 14%"
							placeholder="选择日期"
							value-format="yyyy-MM-dd HH:mm:ss"
						></el-date-picker>
						<el-radio-group v-model="selectDate" @change="selectDateAct" style="margin-left: 20px;">
							<el-radio-button label="today">今天</el-radio-button>
							<el-radio-button label="lastday">昨天</el-radio-button>
							<el-radio-button label="thisWeek">本周</el-radio-button>
							<el-radio-button label="thisMonth">本月</el-radio-button>
						</el-radio-group>
						<span class="topTitleTxt left-space">抓拍设备：</span>
						<elPopverTree
							:elPopoverClass="faceRecordPopoverClass"
							@transferCheckedChannel="transferCheckedChannel"
							:isCheckedAll="true"
							inputWidth="200px"
						></elPopverTree>
						<span class="topTitleTxt left-space">对比库：</span>
						<el-radio-group v-model="libraryType" style="margin: 4px 0 0 0.5%;">
							<template v-for="(item, index) in libraryTypeOption">
								<el-radio :label="item.typeStr" :key="index">{{item.typeName}}</el-radio>
							</template>
						</el-radio-group>
					</div>
					<div class="line-two">
						<span class="topTitleTxt">相似度不低于：</span>
						<el-input v-model="similarity" class="time-interal" type="number"></el-input>
						<span class="timeText">%</span>
						<span class="topTitleTxt left-space">搜索结果显示前：</span>
						<el-input v-model="staffLimit" class="time-interal" type="number"></el-input>
						<span class="timeText">个</span>
						<el-button
							:disabled="!ShowAuthDisabled"
							@click="queryAct"
							type="primary"
							size="small"
							class="left-space"
							icon="el-icon-search"
						>开始搜索</el-button>
						<el-button :disabled="!ShowAuthDisabled" @click="resetData" type="primary" size="small">重置</el-button>
					</div>
				</div>
			</div>
			<div class="content-box">
				<div class="map-box" id="allmap"></div>
				<div class="menu-list" v-if="isShowMenuList">
					<div class="list-title">满足条件人员</div>
					<template v-for="(item, index) in menuData">
						<div
							:key="index"
							class="menu-item"
							@click="clickMenuList(item, index)"
							:style="item.checked ? 'background: rgba(0, 0, 0, 0.3);border: 1px solid rgba(38, 211, 157, 0.3);' : 'border: 1px solid transparent;'"
						>
							<img
								:src="$common.setPictureShow(item.faceCapturePhotoUrl, 'facelog')"
								width="120px"
								height="120px"
							/>
							<div class="num-text">{{item.similarity}}%</div>
						</div>
					</template>
				</div>
				<div class="same-place" v-if="isShowSamePlaDialog">
					<div class="same-place-inner">
						<template v-for="(item, index) in samePlaArr">
							<div :key="index" class="same-item">
								<img
									:src="$common.setPictureShow(item.faceCapturePhotoUrl, 'facelog')"
									width="120px"
									height="120px"
								/>
								<div style="color: #26D39D;">{{item.similarity}}%</div>
								<div>{{item.channelName}}</div>
								<div>{{item.snapshotTime}}</div>
							</div>
						</template>
					</div>
					<div class="close" @click="closeSamePlaDialog">
						<img src="@/assets/images/faceModule/close.png" width="20px" height="20px" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import PicUpload from "@/common/PicUpload";
import FellowItem from "@/pages/faceModule/views/companion/view/FellowItem";
import ElPopverTree from "@/pages/faceModule/components/ElPopverTree";

export default {
  components: {
    PicUpload,
    FellowItem,
    ElPopverTree
  },
  props: {},
  data() {
    return {
      selectDate: "",
      startTime: "",
      endTime: "",
      itemData: [],
      faceRecordPopoverClass: "companionPopoverClass",
      channelUuids: [],
      similarity: 80,
      staffLimit: 2,
      libraryType: "systemFaceLib,staticFaceLib,dynamicFaceLib",
      libraryTypeOption: [],
      imageUrl: "",
      imageBase64: "",
      menuData: [],
      traceData: [],
      pois: [],
      samePlaArr: [],
      isShowSamePlaDialog: false,
      isShowMenuList: false,
      Overlay: null,
      numShowArr: [],
      faceUuid: "",
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("人员轨迹", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("人员轨迹", "isOwn");
    if (!this.ShowAuthDisabled) {
      this.$message.warning("权限不足");
      return;
    }
    let script = document.createElement("script");
    script.src = "./static/utils/BMap_min.js";
    // script.type = "text/javascript";
    // script.src = "http://api.map.baidu.com/api?v=3.0&ak=EnRctIH3RAgwGZGN0P1xlyIoBaOVw86i";
    document.body.appendChild(script);
    script.onload = () => {
      let scriptDraw = document.createElement("script");
      scriptDraw.src = "./static/utils/DrawingManager.js";
      document.body.appendChild(scriptDraw);
      scriptDraw.onload = () => {
        this.Overlay = require("@/utils/BlockItemOverlay.js");
        this.initData();
      };
    };
  },
  mounted() {
    // this.initData();
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("人员轨迹", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("人员轨迹", "isOwn");
  },
  methods: {
    getMenuData() {
      this.menuData = [];
      if (this.itemData) {
        this.itemData.forEach(v => {
          this.menuData.push(v[0]);
        });
        this.menuData.forEach(v => {
          this.$set(v, "checked", false);
        });
        if (this.itemData.length !== 0) {
          this.clickMenuList(this.menuData[0], 0);
        }
      }
    },
    clickMenuList(item, index) {
      this.menuData.forEach(v => {
        this.$set(v, "checked", false);
      });
      this.$set(item, "checked", true);
      this.traceData = [];
      this.traceData = this.itemData[index];
      this.setMapShow();
    },
    setMapShow() {
      /* eslint-disable */
			this.map.clearOverlays();
			this.pois = [];
			this.numShowArr = [];
			for (let i = this.traceData.length - 1; i >= 0; i--) {
				let pt = new BMap.Point(
					this.traceData[i].longitude,
					this.traceData[i].latitude
				);
				this.pois.push(pt);
				let myIcon = new BMap.Icon(
					require("@/assets/images/faceModule/trace.png"),
					new BMap.Size(48, 60)
				);
				let marker = new BMap.Marker(pt, { icon: myIcon });
				marker.setOffset(new BMap.Size(0, -30));
				this.map.addOverlay(marker);
				let itemOverlay = new this.Overlay.ItemOverlay(pt, this.traceData[i]);
				this.map.addOverlay(itemOverlay);
				itemOverlay.addEventListener("click", () => {
					this.getSamePlaceArr(
						this.traceData[i].longitude,
						this.traceData[i].latitude
					);
					this.isShowSamePlaDialog = true;
				});
				if (i !== this.traceData.length - 1) {
					let longitude =
						(Number(this.traceData[i].longitude) +
							Number(this.traceData[i + 1].longitude)) /
						2;
					let latitude =
						(Number(this.traceData[i].latitude) +
							Number(this.traceData[i + 1].latitude)) /
						2;
					let numStr = this.traceData.length - 1 - i;
					let numObj = {
						longitude,
						latitude,
						numStr
					};
					for (let i = this.numShowArr.length - 1; i >= 0; i--) {
						if (
							numObj.longitude === this.numShowArr[i].longitude &&
							numObj.latitude === this.numShowArr[i].latitude
						) {
							numObj.numStr = this.numShowArr[i].numStr + "/" + numObj.numStr;
							break;
						}
					}
					this.numShowArr.push(numObj);
					let point = new BMap.Point(numObj.longitude, numObj.latitude);
					let numOverlay = new this.Overlay.NumOverlay(point, numObj.numStr);
					this.map.addOverlay(numOverlay);
				}
			}
			let sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_CLOSED_ARROW, {
				scale: 0.8, //图标缩放大小
				strokeColor: "#E63434", //设置矢量图标的线填充颜色
				strokeWeight: "3" //设置线宽
			});
			let icons = new BMap.IconSequence(sy, "20%", "5%");
			// 创建polyline对象
			let polyline = new BMap.Polyline(this.pois, {
				icons: [icons],
				strokeWeight: "2", //折线的宽度，以像素为单位
				strokeOpacity: 0.8, //折线的透明度，取值范围0 - 1
				strokeColor: "#E63434", //折线颜色
				strokeStyle: "dashed"
			});
			this.map.addOverlay(polyline);
		},
		getSamePlaceArr(longitude, latitude) {
			this.samePlaArr = [];
			this.traceData.forEach(v => {
				if (v.longitude === longitude && v.latitude === latitude) {
					this.samePlaArr.push(v);
				}
			});
		},
		closeSamePlaDialog() {
			this.isShowSamePlaDialog = false;
			this.samePlaArr = [];
		},
		addImage(picBaseUrl) {
			this.imageBase64 = picBaseUrl;
		},
		selectDateAct(dateStr) {
			let day = new Date();
			switch (dateStr) {
				case "lastday":
					day.setDate(day.getDate() - 1);
					let str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
					this.startTime = str + " " + "00:00:00";
					this.endTime = str + " " + "23:59:59";
					break;
				case "today":
					str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
					this.startTime = str + " " + "00:00:00";
					this.endTime = str + " " + "23:59:59";
					break;
				case "thisWeek":
					let weekday = day.getDay();
					let today = day.getDate();
					let month = day.getMonth();
					let firstDay = null;
					// month默认从0开始，则判断不是月初，则月份+1
					if (today - weekday) {
						month += 1;
						firstDay = today - weekday;
					} else {
						// 月初 则向前退weekday - today天
						// 判断 月大 月小
						let lastMonthDays =
							[1, 3, 5, 7, 8, 10, 12].indexOf(month + 1) > -1 ? 31 : 30;
						firstDay = lastMonthDays - weekday + today;
					}
					let firstdate = new Date(day.getFullYear(), month - 1, firstDay);
					firstdate = this.$common.timestampToFormatter(
						firstdate,
						"yyyy-mm-dd"
					);
					let enddate = new Date(
						new Date().getFullYear(),
						new Date().getMonth(),
						new Date().getDate()
					);
					enddate = this.$common.timestampToFormatter(enddate, "yyyy-mm-dd");
					this.startTime = firstdate + " " + "00:00:00";
					this.endTime = enddate + " " + "23:59:59";
					break;
				case "thisMonth":
					day.setDate(1);
					firstdate = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
					enddate = this.$common.timestampToFormatter(
						new Date().getTime(),
						"yyyy-mm-dd"
					);
					this.startTime = firstdate + " " + "00:00:00";
					this.endTime = enddate + " " + "23:59:59";
					break;
			}
		},
		initData() {
			this.startTime = this.$common.formatDate(
				new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
			);
			this.endTime = this.$common.formatDate(new Date());
			this.libraryTypeOption = this.$common.getEnumByGroupStr(
				"face_h5_lib_group_type"
			);
			this.map = new BMap.Map("allmap", {
				minZoom: 3,
				maxZoom: 19,
				enableMapClick: false
			});
			this.map.centerAndZoom("上海", 19);
			this.map.enableScrollWheelZoom();
		},
		queryAct() {
			if (!this.imageBase64) {
				this.$cToast.warn("请添加图片");
			} else {
				this.getTragicList();
			}
		},
		transferCheckedChannel(checkedChannel) {
			this.channelUuids = [];
			for (let i = 0; i < checkedChannel.length; i++) {
				this.channelUuids.push(checkedChannel[i].channelUuid);
			}
		},
		getTragicList() {
			if (this.staffLimit < 1) {
				this.$cToast.warn("搜索结果显示数量最小值为1");
				return;
			}
			this.menuData = [];
			this.itemData = [];
			this.map.clearOverlays();
			this.$factTragicHttp
				.getTragicList({
					imageBase64: this.imageBase64,
					faceUuid: this.faceUuid,
					// faceUuid: "28334ca055b54a428fc6c63e56d24da4",
					startTime: this.startTime,
					endTime: this.endTime,
					channelUuidList: this.channelUuids,
					libraryType: this.libraryType,
					similarity: parseInt(this.similarity),
					staffLimit: this.staffLimit
				})
				.then(res => {
					let body = res.data;
					this.getTragicListSuccess(body);
				});
		},
		getTragicListSuccess(body) {
			this.itemData = body.data;
			if (!this.itemData || this.itemData.length === 0) {
				this.$cToast.success("暂无满足条件人员");
				this.isShowMenuList = false;
			} else {
				this.isShowMenuList = true;
				this.setMapCenter();
				this.getMenuData();
			}
		},
		setMapCenter() {
			if (this.itemData.length !== 0) {
				this.map.setCenter(
					new BMap.Point(
						this.itemData[0][0].longitude,
						this.itemData[0][0].latitude
					)
				);
			}
		},
		resetData() {
			this.initData();
			this.selectDate = "";
			this.itemData = [];
			this.imageUrl = "";
			this.imageBase64 = "";
			this.$refs.picUpload.imageFile = "";
			this.$refs.picUpload.isDisabled = false;
			this.similarity = 80;
			this.staffLimit = 2;
			this.libraryType = "systemFaceLib,staticFaceLib,dynamicFaceLib";
			this.menuData = [];
			this.traceData = [];
			this.pois = [];
			this.numShowArr = [];
			this.samePlaArr = [];
			this.isShowSamePlaDialog = false;
			this.isShowMenuList = false;
		},
		deleteImage() {
			this.imageUrl = "";
			this.imageBase64 = "";
			this.faceUuid = "";
			this.$refs.picUpload.imageFile = "";
			this.$refs.picUpload.isDisabled = false;
		}
	},
	watch: {},
	destroyed() {},
	activated() {
		if (this.$route.params.imgObj) {
			this.imageUrl = this.$route.params.imgObj.faceCapturePhotoUrl;
			this.$common.imageToBase64(this.imageUrl, base64 => {
				this.imageBase64 = base64;
			});
			this.faceUuid = this.$route.params.imgObj
				? this.$route.params.imgObj.faceUuid
				: "";
		}
	}
};
</script>

<style lang="scss">
.companionPopoverClass {
	width: 500px;
	height: 230px;
	position: absolute;
	background: #202127;
	min-width: 150px;
	border: 1px solid #ebeef5;
	padding: 12px;
	z-index: 2000;
	color: #606266;
	line-height: 1.4;
	text-align: justify;
	font-size: 14px;
	-webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	max-height: 80%;
	overflow: auto;
}
.companion-main {
	.el-radio-button__inner {
		background: rgba(255, 255, 255, 0.1);
		color: #ffffff;
		width: 50px;
		margin-right: 9px;
		border: 0;
		padding: 8px 10px;
		font-size: 13px;
	}
	.el-radio-button:first-child .el-radio-button__inner {
		border: 0;
	}
	.el-radio-button__orig-radio:checked + .el-radio-button__inner {
		background: rgba(40, 255, 187, 0.1);
		border-radius: 2px;
		border-radius: 2px;
		border: 0;
		box-shadow: 0px 0 0 0 #26d39d;
	}
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.companion-main {
	padding: 1.6%;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	.main-container {
		background: #212325;
		width: 100%;
		height: 100%;
		.select-box {
			height: 165px;
			padding: 1% 3%;
			box-sizing: border-box;
			display: flex;
			.picture {
				display: flex;
				align-content: center;
				align-items: center;
				justify-content: center;
				.face-img {
					width: 100px;
					height: 125px;
					cursor: pointer;
					border: 1px dashed #3c3f42;
					position: relative;
					background-color: rgb(27, 30, 33);
					padding: 4px;
					box-sizing: border-box;
				}
			}
			.input {
				margin-left: 2%;
				height: 100%;
				width: 95%;
				.line-one {
					width: 100%;
					height: 50%;
					margin-top: 10px;
					display: flex;
					direction: row;
					align-items: center;
					.dev-select {
						width: 18%;
					}
					.search-btn {
						margin-left: auto;
						margin-right: 0;
					}
				}
				.line-two {
					margin-top: -20px;
					height: 50%;
					display: flex;
					height: 50%;
					display: flex;
					direction: row;
					align-items: center;
					.time-interal {
						width: 6%;
					}
				}
			}
		}
		.content-box {
			height: calc(100% - 165px);
			border-radius: 3px;
			position: relative;
			overflow: hidden;
			.map-box {
				width: 100%;
				height: 100%;
			}
			.menu-list {
				position: absolute;
				top: 20px;
				left: 20px;
				background: #25292d;
				border-radius: 2px;
				width: 160px;
				max-height: 93%;
				overflow-y: auto;
				padding: 8px 6px;
				box-sizing: border-box;
				.list-title {
					font-family: PingFangSC-Regular;
					font-size: 13px;
					color: #ffffff;
					width: 100%;
					text-align: center;
				}
				.menu-item {
					width: 140px;
					height: 160px;
					margin-top: 12px;
					margin-left: 3px;
					padding: 10px;
					box-sizing: border-box;
					cursor: pointer;
					.num-text {
						width: 100%;
						text-align: center;
						font-family: PingFangSC-Regular;
						font-size: 12px;
						color: #26d39d;
						letter-spacing: 0;
						margin-top: 3px;
					}
				}
			}
			.same-place {
				width: 480px;
				padding: 15px 0px 15px 15px;
				box-sizing: border-box;
				background: #25292d;
				box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
				border-radius: 2px;
				position: absolute;
				right: 30px;
				top: 30px;
				.same-place-inner {
					max-height: 450px;
					overflow-y: auto;
					width: 100%;
					height: 100%;
					display: flex;
					flex-flow: row wrap;
					align-content: flex-start;
					.same-item {
						border: 1px #2e3135 solid;
						border-radius: 2px;
						background: rgba($color: #000000, $alpha: 0.1);
						width: 140px;
						height: 190px;
						margin-right: 10px;
						margin-bottom: 10px;
						padding: 5px;
						box-sizing: border-box;
						font-family: PingFangSC-Regular;
						font-size: 12px;
						color: #dddddd;
						letter-spacing: 0;
						text-align: center;
					}
				}
				.close {
					position: absolute;
					right: -8px;
					top: -8px;
					cursor: pointer;
				}
			}
		}
	}
}
.timeText {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #888888;
	width: 28px;
}
.topTitleTxt {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #cccccc;
}
.left-space {
	margin-left: 3%;
}
.split-line {
	width: 95%;
	border-color: #303336;
	border-width: 0 0 2px 0;
	border-style: dashed;
	margin: 15px 0 25px 0;
}
.avatar {
	width: 100%;
	height: 100%;
	position: relative;
	text-align: center;
}
.clearImageIcon {
	position: absolute;
	right: 3px;
	top: 6px;
	z-index: 99;
	color: #efefef;
	width: 28px;
	height: 28px;
	background-color: rgba(17, 17, 17, 0.6);
	padding-top: 5px;
	box-sizing: border-box;
	border-radius: 19px;
}
.ovo-card-img {
	margin-top: 22%;
	vertical-align: middle;
	width: 55%;
	height: 45px;
	color: #20735c;
}
.font-color {
	margin-top: 20%;
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #20735c;
	text-align: right;
}
.line {
	color: rgba($color: #ffffff, $alpha: 0.15);
	margin: 0 2px;
}
</style>
