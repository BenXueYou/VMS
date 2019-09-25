<template>
	<div class="door-list">
		<div class="list-button">
			<el-button @click="allOpen" type="primary" size="small">全部开门</el-button>
			<el-button @click="allClose" type="primary" size="small">全部关门</el-button>
			<el-button @click="allDismiss" type="primary" size="small">全部消警</el-button>
			<div class="number-icon">
				<div class="number-text">
					<span>全部：</span>
					<span>{{total}}</span>
				</div>
				<div class="number-text">
					<img src="@/assets/images/door_open.png" width="9px" height="11px" style="margin-right: 5px;">
					<span>门开：</span>
					<span>{{opened}}</span>
				</div>
				<div class="number-text">
					<img src="@/assets/images/door_close.png" width="9px" height="11px" style="margin-right: 5px;">
					<span>门关：</span>
					<span>{{closed}}</span>
				</div>
				<div class="number-text">
					<span>报警：</span>
					<span>{{alarmed}}</span>
				</div>
				<div class="number-text">
					<span>在线：</span>
					<span>{{online}}</span>
				</div>
				<div class="number-text">
					<span>离线：</span>
					<span>{{offline}}</span>
				</div>
			</div>
		</div>
		<el-scrollbar class="scrollbar">
			<div class="list-items">
				<template v-for="(item, index) in itemListData">
					<door-item :key="index" :doorItem="item" @handleDoorStatus="handleDoorStatus"/>
				</template>
			</div>
		</el-scrollbar>
		<div class="footer">
			<el-pagination
				background
				layout="total, prev, pager, next, jumper"
				:page-size="pageInfo.pageSize"
				:current-page="pageInfo.currentPage"
				@current-change="handleCurrentChange"
				:total="pageInfo.total"
			></el-pagination>
		</div>
	</div>
</template>

<script>
import DoorItem from "@/pages/doorControl/views/doorStatus/DoorItem";

export default {
  components: {
    DoorItem
  },
  props: {},
  data() {
    return {
      itemListData: [],
      pageInfo: {
        total: 0,
        pageSize: 20,
        currentPage: 1
      },
      treeNodeData: null,
      nodeType: "",
      nodeUuid: "",
      stompClient: null,
      opened: 0,
      closed: 0,
      alarmed: 0,
      online: 0,
      offline: 0,
      total: 0,
      interval: null
    };
  },
  created() {},
  mounted() {
    // this.registerEventbus();
    // this.connectSocket();
  },
  activated() {
    this.registerEventbus();
    this.connectSocket();
    this.getStatistics();
    this.interval = setInterval(() => {
      this.getStatistics();
    }, 15000);
  },
  methods: {
    initData() {
      this.getChannelStatusList();
    },
    getStatistics() {
      this.$logSearchHttp
        .getStatistics()
        .then(res => {
          let body = res.data;
          this.getStatisticsSuccessResponse(body);
        });
    },
    getStatisticsSuccessResponse(body) {
      this.opened = body.data.opened;
      this.closed = body.data.closed;
      this.alarmed = body.data.alarmed;
      this.online = body.data.online;
      this.offline = body.data.offline;
      this.total = body.data.total;
    },
    getChannelStatusList() {
      this.itemListData = [];
      this.isLoading = true;
      this.$logSearchHttp
        .getChannelStatusList({
          channelType: "door",
          nodeType: this.nodeType,
          nodeUuid: this.nodeUuid,
          pageSize: this.pageInfo.pageSize,
          currPage: this.pageInfo.currentPage
        })
        .then(res => {
          let body = res.data;
          this.getChannelStatusListSuccessResponse(body);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getChannelStatusListSuccessResponse(body) {
      this.itemListData = body.data.list;
      this.handlePageInfo(body.data);
    },
    handlePageInfo(data) {
      let total = 0;
      if (data.total >= 0) {
        total = data.total;
      }
      this.pageInfo.total = total;
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.getChannelStatusList();
    },
    allOpen() {
      this.showConfirmDialog("开门");
    },
    allClose() {
      this.showConfirmDialog("关门");
    },
    allDismiss() {
      this.showConfirmDialog("消警");
    },
    showConfirmDialog(param) {
      this.$confirm(
        `<span style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;">是否确认全部${param}？</span>`,
        "",
        {
          confirmButtonText: "否",
          cancelButtonText: "是",
          distinguishCancelAndClose: true,
          confirmButtonClass: "confirm-button",
          cancelButtonClass: "cancel-button",
          center: true,
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {})
        .catch(action => {
          if (action === "cancel") {
            let operateType = "";
            if (param === "开门") {
              operateType = "allOpen";
            } else if (param === "关门") {
              operateType = "allClose";
            } else {
              operateType = "allDisAlarm";
            }
            this.$logSearchHttp
              .allOperation({
                operateType,
                resType: this.nodeType,
                resUuid: this.nodeUuid,
              })
              .then(res => {
                let body = res.data;
                this.$cToast.success(body.msg);
              });
          }
        });
    },
    registerEventbus() {
      this.$bus.$on("setTreeRootData", params => {
        this.treeNodeData = params.treeNodeData;
        this.nodeType = params.nodeType;
        if (params.isNodeRoot) {
          this.nodeUuid = params.treeNodeData.id;
        } else {
          this.nodeUuid = params.treeNodeData.data.id;
        }
      });
    },
    connectSocket() {
      /* eslint-disable */
			let socket = new SockJS(window.config.protocolHeader + window.config.socketIP);
			this.stompClient = Stomp.over(socket);
			this.stompClient.connect(
				// { projectUuid: window.config.projectUuid },
				{ projectUuid: this.$store.state.home.projectUuid },
				frame => {
					console.log("connect success: ", frame);
					this.stompClient.subscribe("/user/topic/status/channel", greeting => {
						console.log("subscribe success: ", greeting);
						this.handleSubscribe(JSON.parse(greeting.body));
					});
				},
				err => {
					console.log("error, errMsg: ", err);
				}
			);
			/* eslint-enable */
    },
    disConnectSocket() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        console.log("Disconnected");
      }
    },
    handleSubscribe(data) {
      if (!this.itemListData || !data) {
        return;
      }
      if (data.channelType === "readhead") {
        for (let item of this.itemListData) {
          if (item.channelUuid === data.parentChannelUuid) {
            for (let headItem of item.readHead) {
              if (headItem.channelUuid === data.channelUuid) {
                if (data.status) {
                  this.$set(headItem, "status", data.status);
                }
                if (data.alarmstatus) {
                  this.$set(headItem, "alarmstatus", data.alarmstatus);
                }
              }
            }
          }
        }
      } else if (data.channelType === "door") {
        for (let item of this.itemListData) {
          if (item.channelUuid === data.channelUuid) {
            if (data.status) {
              this.$set(item, "status", data.status);
            }
            if (data.alarmstatus) {
              this.$set(item, "alarmstatus", data.alarmstatus);
            }
          }
        }
      }
    },
    handleDoorStatus(params) {
      if (params.action !== "cancelAlarm") {
        this.onHandleDoorStatus(params.channelUuid, params.action);
      } else {
        this.removeAlarm(params.channelUuid);
      }
    },
    onHandleDoorStatus(channelUuid, action) {
      this.$logSearchHttp
        .handleDoorStatus({
          channelUuid,
          action
        })
        .then(res => {
          this.$cToast.success("操作成功");
        });
    },
    removeAlarm(channelUuid) {
      this.$logSearchHttp
        .removeAlarm({
          channelUuid,
        })
        .then(res => {
          this.$cToast.success("操作成功");
        });
    },
    unRegisterEventbus() {
      this.$bus.$off("setTreeRootData");
    }
  },
  watch: {
    nodeUuid(val) {
      this.pageInfo = {
        total: 0,
        pageSize: 13,
        currentPage: 1
      };
      this.initData();
    }
  },
  deactivated() {
    this.unRegisterEventbus();
    this.disConnectSocket();
    clearInterval(this.interval);
  },
  destroyed() {
    this.unRegisterEventbus();
    this.disConnectSocket();
    clearInterval(this.interval);
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.door-list {
	width: 84%;
	height: 100%;
	padding: 1.3% 0% 1.3% 1.1%;
	box-sizing: border-box;
	margin-left: 20px;
	background: #212325;
	.list-button {
		width: 100%;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		.number-icon {
			width: 50%;
      min-width: 500px;
			margin-left: auto;
			margin-right: 0;
			font-family: PingFangSC-Regular;
			font-size: 13px;
			display: flex;
			flex-flow: row nowrap;
      justify-content: center;
			color: #ffffff;
			align-items: center;
			.number-text {
				display: flex;
				align-items: center;
        margin-right:8px;
        span{
          white-space: nowrap;
        }
				&:last-child {
					margin-right: 0px;
				}
			}
		}
	}
	.scrollbar {
		height: 88%;
		width: 100%;
		margin-top: 28px;
	}
	.list-items {
		display: flex;
		flex-flow: row wrap;
		align-content: flex-start;
	}
	.footer {
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}
}
</style>
