<template>
	<div class="companion-main">
		<div class="select-box">
			<div class="picture">
				<div class="face-img" @click="onClickTurnToGetFace">
					<div class="avatar">
						<img
							v-if="!$route.query.imgObj"
							src="@/assets/images/addImg2.png"
							class="ovo-card-img add-icon"
						/>
						<i v-if="!$route.query.imgObj" class="el-icon-circle-plus-outline font-color">添加图片</i>
						<img
							v-if="$route.query.imgObj"
							:src="$common.setPictureShow($route.query.imgObj.photouri)"
							style="width: 100%; height: 100%"
						/>
					</div>
				</div>
				<!-- <pic-upload @image-file="getImageFile" /> -->
			</div>
			<div class="input">
				<div class="line-one">
					<span class="topTitleTxt">抓拍时段：</span>
					<el-date-picker
						v-model="startTime"
						type="datetime"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
					<span class="timeText">至</span>
					<el-date-picker
						v-model="endTime"
						type="datetime"
						placeholder="选择日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
					<span class="topTitleTxt left-space">抓拍设备：</span>
					<elPopverTree
						:channelInfoList="deviceList"
						:elPopoverClass="faceRecordPopoverClass"
						:checkedChannelKeys="checkedChannelKeys"
						@transferCheckedChannel="transferCheckedChannel"
						inputWidth="200px"
						@show="popverShow"
						@hide="popverHidden"
					></elPopverTree>
					<el-button class="search-btn" @click="queryAct" type="primary">开始搜索</el-button>
				</div>
				<div class="line-two">
					<span class="topTitleTxt">抓拍时间间隔：</span>
					<el-input v-model="storInterVal" class="time-interal" type="number"></el-input>
					<span class="timeText">秒</span>
					<span class="topTitleTxt left-space">同行次数不小于：</span>
					<el-input v-model="inHarns" class="time-interal" type="number"></el-input>
					<span class="timeText">次</span>
					<span class="topTitleTxt left-space">共同出现的摄像头个数不小于：</span>
					<el-input v-model="channels" class="time-interal" type="number"></el-input>
					<span class="timeText">个</span>
				</div>
			</div>
		</div>
		<div class="content-box">
			<div class="title">
				<img src="@/assets/images/person_fellow.png" width="16.8px" height="12.6px" />
				<span class="title-text">同行人分析结果</span>
			</div>
			<el-scrollbar style="height: 90%;transition:0.2s" v-loading="isLoading">
				<template v-for="(item, index) in fellowItemData">
					<fellow-item :key="index" :item="item" />
					<div
						class="split-line"
						v-if="fellowItemData && fellowItemData.length > 1 && index !== fellowItemData.length-1"
						:key="item.name"
					></div>
				</template>
			</el-scrollbar>
		</div>
	</div>
</template>

<script>
// import PicUpload from "@/common/PicUpload";
import FellowItem from "@/pages/faceModule/views/companion/view/FellowItem";
import ElPopverTree from "@/pages/faceModule/components/ElPopverTree";

export default {
  components: {
    // PicUpload,
    FellowItem,
    ElPopverTree
  },
  props: {},
  data() {
    return {
      startTime: "",
      endTime: "",
      deviceList: [],
      staffuuid: "",
      fellowItemData: [],
      faceRecordPopoverClass: "faceRecordPopoverClass",
      channelUuids: null,
      storInterVal: 10,
      inHarns: 1,
      channels: 1,
      isLoading: false,
      checkedChannelKeys: []
    };
  },
  created() {},
  mounted() {
    this.initData();
    // this.queryAct();
  },
  methods: {
    initData() {
      // this.staffuuid = "752ca559f1cc4733a9e0b9da59764787";
      this.startTime = this.$common.formatDate(
        new Date(new Date().getTime() - 1 * 60 * 60 * 1000)
      );
      this.endTime = this.$common.formatDate(new Date());
    },
    queryAct() {
      if (!this.$route.query.imgObj) {
        this.$cToast.warn("请添加图片");
      } else {
        this.getCompanionList();
      }
    },
    onClickTurnToGetFace() {
      this.$router.push("/FaceRecord");
    },
    getDeviceList() {
      // var deviceList = this.$store.getters.getDeviceList;
      // this.deviceList = deviceList;
      this.$store.dispatch("getDeviceList", false).then(res => {
        if (res.result === 0) {
          this.deviceList = res.data;
        } else {
          this.$message({ message: "更新设备列表失败", type: "warning" });
        }
      });
    },
    transferCheckedChannel(checkedChannel) {
      this.channelUuids = [];
      if (!checkedChannel || checkedChannel.length === 0) {
        this.getChannelUuids(this.deviceList);
      } else {
        for (var i = 0; i < checkedChannel.length; i++) {
          this.channelUuids.push(checkedChannel[i].id);
        }
      }
    },
    getChannelUuids(data) {
      if (!data) {
        return;
      }
      for (let item of data) {
        this.channelUuids.push(item.id);
        this.getChannelUuids(item.children);
      }
    },
    popverShow() {},
    popverHidden() {},
    getCompanionList() {
      this.isLoading = true;
      this.$companionRequest.getCompanionList({
        staffuuid: this.$route.query.imgObj.staffuuid,
        channelUuids: this.channelUuids,
        startTime: this.startTime,
        endTime: this.endTime,
        storInterVal: this.storInterVal,
        inHarns: this.inHarns,
        channels: this.channels,
        onResult: (isSuccess, data) => {
          if (isSuccess && data) {
            this.handleGetCompanionListSuccessResponse(data);
          } else {
            console.log("获取同行人分析列表失败！");
            this.isLoading = false;
          }
        }
      });
    },
    handleGetCompanionListSuccessResponse(data) {
      this.fellowItemData = data.body.data;
      this.isLoading = false;
      if (data.body.data.length === 0) {
        this.$cToast.success("暂无同行人分析记录！");
      }
    },
    resetData() {
      this.fellowItemData = [];
      this.initData();
    }
  },
  watch: {},
  destroyed() {},
  activated() {
    this.getDeviceList();
    this.resetData();
    this.checkedChannelKeys = [];
    this.channelUuids = [];
    if (this.$route.query.imgObj) {
      this.checkedChannelKeys.push(this.$route.query.imgObj.channeluuid);
      this.channelUuids = this.$common.copyArray(
        this.checkedChannelKeys,
        this.channelUuids
      );
    }
  }
};
</script>

<style>
.faceRecordPopoverClass {
	width: 50%;
	height: 45%;
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
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.companion-main {
	width: 100%;
	height: 100%;
	padding: 2% 2.5% 1% 2.5%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	$bg-color: #202326;
	.select-box {
		height: 20%;
		background: $bg-color;
		border-radius: 3px;
		margin-bottom: 1.5%;
		display: flex;
		.picture {
			width: 10%;
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
			width: 90%;
			height: 100%;
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
					margin-right: 3%;
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
		height: 77%;
		background: $bg-color;
		border-radius: 3px;
		padding-left: 20px;
		box-sizing: border-box;
		.title {
			display: flex;
			align-items: center;
			height: 8%;
			.title-text {
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #ffffff;
				margin-left: 20px;
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
	margin-left: 5%;
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
</style>
