<template>
	<div class="door-item" :style="`background:${backgroundColor};color:${fontColor};`">
		<div class="item-title">
			{{ $common.setStringText(doorItem.nickName) }}
			<!-- {{ $common.setStringText(doorItem.channelName) }} -->
			<div class="item-status">
				<img :src="icon" width="8px" height="10px" style="margin-right: 5px;" />
				<span>{{text}}</span>
			</div>
		</div>
		<div class="door-detail">
			<el-scrollbar style="height: 90%">
				<template v-for="(item, index) in doorItem.readHead">
					<div :key="index" class="read-head">
						<span>{{item.nickName}}：</span>
						<!-- <span>{{item.channelName}}：</span> -->
						<span>{{$common.getEnumItemName("onoffline", item.status)}}</span>
					</div>
				</template>
			</el-scrollbar>
		</div>
		<div class="item-button" v-if="doorItem.onoffline === 'online'">
			<div :disabled="!OwnAuthDisabled" class="button" @click="onClickHandleDoorStatus('open')">开门</div>
			<div :disabled="!OwnAuthDisabled" class="button" @click="onClickHandleDoorStatus('close')">关门</div>
			<div :disabled="!OwnAuthDisabled" class="button" @click="onClickHandleDoorStatus('no')">常开</div>
			<div :disabled="!OwnAuthDisabled" class="button" @click="onClickHandleDoorStatus('nc')">常闭</div>
			<div
				:disabled="!OwnAuthDisabled"
				class="button"
				@click="onClickHandleDoorStatus('cancelAlarm')"
			>消警</div>
		</div>
	</div>
</template>

<script>
export default {
  components: {},
  props: {
    doorItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      backgroundColor: "rgba($color: #FFFFFF, $alpha: 0.1)",
      fontColor: "#DDDDDD",
      icon: require("@/assets/images/door_open.png"),
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      text: ""
    };
  },
  created() {
    this.setData();
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("门状态", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("门状态", "isOwn");
  },
  methods: {
    setData() {
      if (!this.ShowAuthDisabled) return;
      this.handleClass();
      this.getDoorStatus();
    },
    handleClass() {
      if (Object.keys(this.doorItem).length === 0) {
        return;
      }
      let backgroundColor = "";
      let fontColor = "";
      let icon = "";
      if (
        this.doorItem.alarmstatus === "alarm" ||
				this.doorItem.readHead.some(v => v.alarmstatus === "alarm")
      ) {
        backgroundColor = "255,95,95";
        fontColor = "#DDDDDD";
      } else if (this.doorItem.onoffline === "offline") {
        backgroundColor = "102,102,102";
        fontColor = "#999999";
      } else {
        backgroundColor = "255,255,255";
        fontColor = "#DDDDDD";
      }
      if (this.doorItem.status === "close") {
        icon = "door_close";
      } else {
        icon = "door_open";
      }
      this.setClass(backgroundColor, fontColor, icon);
    },
    setClass(backgroundColor, fontColor, icon) {
      this.backgroundColor = `rgba(${backgroundColor}, 0.1)`;
      this.fontColor = fontColor;
      this.icon = require(`@/assets/images/${icon}.png`);
    },
    getDoorStatus() {
      if (Object.keys(this.doorItem).length === 0) {
        this.text = "未知";
      }
      if (this.doorItem.status === "close") {
        this.text = "门关";
      } else {
        this.text = "门开";
      }
    },
    onClickHandleDoorStatus(action) {
      this.$emit("handleDoorStatus", {
        action: action,
        channelUuid: this.doorItem.channelUuid
      });
    }
  },
  watch: {
    doorItem: {
      handler(val) {
        this.setData();
      },
      deep: true
    }
  },
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.door-item {
	width: 18.9%;
	min-width: 200px;
	height: 120px;
	border-radius: 2px;
	margin-bottom: 20px;
	margin-right: 12px;
	font-family: PingFangSC-Regular;
	font-size: 13px;
	position: relative;
	overflow: hidden;
	&:hover {
		.item-button {
			bottom: 0;
			box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.6);
		}
	}
	.item-title {
		width: 100%;
		height: 37px;
		border-bottom: 1px dashed rgba($color: #ffffff, $alpha: 0.05);
		display: flex;
		align-items: center;
		padding: 0 15px;
		box-sizing: border-box;
		.item-status {
			margin-left: auto;
			margin-right: 0;
		}
	}
	.door-detail {
		height: 107px;
		padding: 15px 15px;
		box-sizing: border-box;
		.read-head {
			margin-bottom: 10px;
			&:last-child {
				margin-bottom: 0px;
			}
		}
	}
	.item-button {
		position: absolute;
		width: 100%;
		height: 40px;
		padding: 0 22px;
		box-sizing: border-box;
		background: #2a2e31;
		border-radius: 2px;
		font-family: PingFangSC-Regular;
		font-size: 13px;
		bottom: -40px;
		transition: 0.5s all;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #ffffff;
		.button {
			cursor: pointer;
			&:hover {
				color: #28ffbb;
			}
		}
	}
}
</style>
