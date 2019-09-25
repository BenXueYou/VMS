<template>
	<div class="dialogcontainer">
		<el-dialog :visible.sync="dialogIsShow" @open="open" title="研判详情" @close="close" @closed="closed">
			<div class="dialogwrap">
				<p class="alarmtypetitle">任务名称：{{alarmtypetext}}</p>

				<div class="checkboxgroup">
					<div class="left">
						设备：
						<el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
					</div>
					<div class="right">
						<el-checkbox-group @change="checkboxchange" v-model="checkedDevice">
							<el-checkbox v-for="item in devices" :label="item.name" :key="item.name">
								<span class="devicename">{{item.name}}</span>
								<span class="circle" :style="{'background-color':item.color}"></span>
							</el-checkbox>
						</el-checkbox-group>
					</div>
				</div>

				<div
					class="alarmsteps"
					ref="alarmstepsdom"
					v-loading="dialogloading"
					:element-loading-text="loadingtext"
					element-loading-background="rgba(0, 0, 0, 0.8)"
				>
					<transition-group name="slideToggle" tag="div">
						<div
							class="alarmstepsItem"
							v-for="(item,index) in filterdatabydevice"
							:key="item.devicesname+index"
						>
							<div class="stepspart1">
								<span class="date">{{item.time | filterMD}}</span>
							</div>
							<div class="stepspart2">
								<div class="line"></div>
								<div class="circle" :style="{'background-color':item.color}"></div>
							</div>
							<div class="stepspart3">
								<div class="imgwrap">
									<img :src="item.headerurl" @click="showBig(item.headerurl)" alt />
								</div>
								<div class="alarminfo">
									<div class="infobox">
										<p>{{item.time}}</p>
										<p>{{item.devicesname}}</p>
										<p>{{item.feature}}</p>
									</div>
								</div>
							</div>
						</div>
					</transition-group>

					<div class="nomoredata" v-if="dialognomoredata">没有更多的数据</div>

					<div
						class="loadingBottom"
						v-if="dialogloadingmore"
						v-loading="dialogloadingmore"
						element-loading-spinner="el-icon-loading"
						element-loading-text="加载更多数据ing"
						element-loading-background="#1B202A"
					></div>
				</div>

				<!-- <p class='alarmtypetitle'>研判处理</p> -->

				<!-- <div class="form-box"> -->
				<!-- <div class="left">
            <p class='label'>
              处理意见：
            </p>
				</div>-->
				<!-- <div class="right">
            <el-input type="textarea"
                      rows='3'
                      v-model="dealsuggestion"></el-input>

            <el-button class="comfirm"
                       type="primary"
                       @click='comfirmbtn'>确认</el-button>

            <el-button class="ignore"
                       type="primary"
                       @click='ignorebtn'>忽略</el-button>
				</div>-->
				<!-- </div> -->
			</div>
		</el-dialog>
		<el-dialog class="aaaaasdasd" title="图片详情" :visible.sync="bigDialogVisible">
			<img
				style="max-width:100%;display:block;margin:0 auto;max-height:400px;"
				:src="dialogImageUrl"
				alt
			/>
		</el-dialog>
	</div>
</template>

<script>
const devicecolor = [
  "#F6C620",
  "#EA5151",
  "#4CE168",
  "#39C5FF",
  "#00FFFF",
  "#33FFFF",
  "#6666FF",
  "#66CCFF",
  "#CC00FF",
  "#CCFF00",
  "#FF33FF"
];
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    row: {
      type: Object,
      default() {
        return {};
      }
    },
    dialognomoredata: {
      type: Boolean,
      default: true
    },
    dialogloadingmore: {
      type: Boolean,
      default: false
    },
    dialogloading: {
      type: Boolean,
      default: false
    },
    loadingtext: {
      type: String,
      default: "数据请求中"
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogwidth: {
      type: Number,
      default: 790
    },
    alarmtypetext: {
      type: String,
      default: "这里要传入报警类型"
    },
    dataArr: {
      type: Array,
      default: function() {
        return [
          {
            headerurl: require("@/assets/user.png"),
            time: "2018-10-18 12:22:00",
            devicesname: "虹桥火车站西出口1",
            feature: "中年男性 戴口罩"
          },
          {
            headerurl: require("@/assets/user.png"),
            time: "2018-10-18 12:22:00",
            devicesname: "虹桥火车站西出口2",
            feature: "中年男性 戴口罩"
          },
          {
            headerurl: require("@/assets/user.png"),
            time: "2018-10-18 12:22:00",
            devicesname: "虹桥火车站西出口3",
            feature: "中年男性 戴口罩"
          },
          {
            headerurl: require("@/assets/user.png"),
            time: "2018-10-18 12:22:00",
            devicesname: "虹桥火车站西出口4",
            feature: "中年男性 戴口罩"
          }
        ];
      }
    }
  },
  data() {
    return {
      bigDialogVisible: false,
      dialogImageUrl: "",
      checkedDevice: [],
      checkAll: true,
      dealsuggestion: "",
      devices: [
        // {
        //   name: "设备1",
        //   color: "red"
        // }
      ],
      staticcheckall: [],
      isListen: false,
      dialogIsShow: false
    };
  },
  filters: {
    filterMD(val) {
      var part1 = val.split(" ")[0];
      return part1.split("-")[1] + "-" + part1.split("-")[2];
    }
  },
  computed: {
    filterdatabydevice() {
      const _this = this;
      let findItem = false;
      var okdata = this.dataArr;
      console.log(this.dataArr);
      // okdata.sort(function(x,y){
      //   if(x.time>y.time){
      //       return -1;
      //   }
      //   return 1;
      // })
      return okdata.filter(val => {
        findItem = false;
        for (var i = 0, len = _this.checkedDevice.length; i < len; i++) {
          if (_this.checkedDevice[i] === val.devicesname) {
            findItem = true;
            break;
          }
        }
        return findItem;
      });
    }
  },
  watch: {
    dialogVisible(val) {
      const _this = this;
      this.dialogIsShow = this.dialogVisible;
      // 注册滚动触底事件判断
      _this.$nextTick(() => {
        _this.$refs.alarmstepsdom.scrollTop = 0 + "px";
      });
      if (!val || this.isListen || this.dialognomoredata) {
      }
      // this.isListen = true;
      // var isCanScroll = true;
      // _this.$nextTick(function() {

      // _this.$refs.alarmstepsdom.addEventListener("scroll", function(e) {
      //   if (
      //     !isCanScroll ||
      // 		_this.dialogloadingmore ||
      // 		_this.dialognomoredata
      //   ) {
      //     return;
      //   }
      //   console.log("滚动函数正在执行");
      //   if (this.scrollHeight <= this.clientHeight + this.scrollTop) {
      //     _this.$emit("scrollBottom");
      //     isCanScroll = false;
      //     setTimeout(() => {
      //       isCanScroll = true;
      //     }, 50);
      //   }
      // });
      // });
    },
    dataArr() {
      console.log(this.dataArr);
      this.updateStatus();
    },
    checkedDevice(val) {}
  },
  mounted() {
    // 下面的数据测试.
    this.updateStatus();
  },
  activated() {},
  beforeDestroy() {},
  methods: {
    showBig(url) {
      this.bigDialogVisible = true;
      this.dialogImageUrl = url;
    },
    open() {
      this.$emit("open");
    },
    close() {
      this.$emit("close");
    },
    closed() {
      this.$emit("closed");
    },
    updateStatus() {
      console.log("更新数据了", this.dataArr);
      var ob = {},
        arr = [],
        slectedarr = [],
        cnt = 0;
      for (let i = 0, len = this.dataArr.length; i < len; i++) {
        console.log(this.dataArr[i].time);
        if (!ob[this.dataArr[i].devicesname]) {
          ob[this.dataArr[i].devicesname] = devicecolor[cnt % devicecolor.length];
          cnt++;
          this.dataArr[i].color = ob[this.dataArr[i].devicesname];
          arr.push({
            name: this.dataArr[i].devicesname,
            color: this.dataArr[i].color
          });
          slectedarr.push(this.dataArr[i].devicesname);
        } else {
          this.dataArr[i].color = ob[this.dataArr[i].devicesname];
        }
      }
      this.dataArr.concat();
      this.staticcheckall = slectedarr;
      this.checkedDevice = slectedarr;
      this.devices = arr;
    },

    checkboxchange(value) {
      this.checkAll = value.length === this.staticcheckall.length;
    },
    handleCheckAllChange(flag) {
      this.checkedDevice = flag ? this.staticcheckall : [];
    }
  }
};
</script>

<style>
.slideToggle-move {
	transition: all 0.4s;
}
.slideToggle-enter-active,
.slideToggle-leave-active {
	transition: all 0.4s;
}
.slideToggle-enter,
.slideToggle-leave-to {
	will-change: transform;
	opacity: 0;
	transform: translateX(50px);
}
.dialogcontainer .dialogwrap .is-checked .el-checkbox__label {
	color: #fff;
}
.dialogcontainer
	.dialogwrap
	.el-checkbox__input.is-checked
	.el-checkbox__inner {
	height: 14px;
	width: 14px;
	border-color: rgba(40, 255, 187, 1) !important;
}
.dialogcontainer .dialogwrap .el-textarea__inner {
	background-color: rgb(36, 39, 42);
	font-size: 16px;
	line-height: 20px;
	color: rgba(255, 255, 255, 0.8);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 3px;
}
.dialogcontainer .dialogwrap .el-button--primary {
	height: 36px;
	background: rgba(40, 255, 187, 0.05);
	border: 1px solid rgba(32, 204, 150, 0.7);
	border-radius: 4px;
	font-family: 'PingFangSC-Medium';
	font-size: 14px;
	color: #ffffff;
	margin-left: 25px;
	opacity: 0.8;
}
.dialogcontainer.dialogwrap .el-checkbox__input.is-checked .el-checkbox__inner {
	color: #28ffbb;
	background: none;
}
.dialogcontainer .dialogwrap .el-checkbox__inner {
	background: none;
}
.dialogcontainer .el-dialog__wrapper .el-dialog {
	height: auto;
	border-radius: 4px;
	z-index: 500;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	margin: 0px !important;
}
.dialogcontainer .el-dialog__body {
	padding: 0px;
}
.dialogcontainer .el-dialog__headerbtn {
	top: 10px;
}
.dialogcontainer .el-dialog__header {
	height: 45px !important;
	line-height: 45px !important;
	padding: 0;
	padding-left: 32px;
	border-bottom: 1px solid rgba(40, 255, 187, 0.2);
}
.dialogcontainer .el-loading-spinner .el-loading-text {
	color: #28ffbb;
}
.dialogcontainer .el-loading-spinner i {
	color: #28ffbb;
}
.dialogcontainer .nomoredata {
	line-height: 60px;
	color: rgba(255, 255, 255, 0.8);
	text-align: center;
}

.dialogcontainer .el-checkbox__inner:after {
	left: 4px;
	top: 2px;
}
</style>

<style lang="scss" scoped>
.dialogcontainer {
	.dialogwrap {
		position: relative;
		width: 90%;
		margin: 0px auto 45px;
		.loadingBottom {
			height: 30px;
			// margin-bottom: 30px;
		}
		.form-box {
			&::after {
				content: "";
				clear: both;
				display: block;
			}
			.left {
				float: left;
				width: 15%;
				text-align: left;
				.label {
					color: rgba(255, 255, 255, 1);
				}
			}
			.right {
				float: left;
				width: 80%;
				.comfirm {
					width: 100px;
					margin: 10px;
				}
				.ignore {
					width: 100px;
					margin: 10px;
				}
			}
		}
		.alarmsteps {
			width: 100%;
			height: 50vh;
			max-height: 430px;
			border: rgba(40, 255, 187, 0.1) 1px solid;
			padding: 15px;
			box-sizing: border-box;
			overflow-y: auto;
			overflow-x: hidden;
			.alarmstepsItem {
				width: 100%;
				height: 100px;
				&::after {
					content: "";
					display: block;
					clear: both;
				}
				.stepspart1 {
					float: left;
					width: 10%;
					height: 100%;
					position: relative;
					.date {
						position: absolute;
						top: 50%;
						left: 50%;
						width: 100%;
						text-align: center;
						display: block;
						transform: translate(-50%, -50%);
						color: #28ffbb;
						font-size: 16px;
						font-family: "PingFangSC-Regular";
						height: 35px;
						line-height: 35px;
						background-image: url("../../../../../../../assets/facedb/arrow.png");
						background-size: 100% 100%;
					}
				}
				.stepspart2 {
					position: relative;
					float: left;
					width: 10%;
					height: 100%;
					font-size: 0px;
					.line {
						position: absolute;
						top: 0px;
						left: 50%;
						transform: translateX(-50%);
						height: 100%;
						width: 1px;
						background-color: rgba(40, 255, 187, 1);
					}
					.circle {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						width: 13px;
						height: 13px;
						border-radius: 50%;
					}
				}
				.stepspart3 {
					float: left;
					height: 100%;
					width: 80%;
					font-size: 0px;
					&::after {
						content: "";
						display: block;
						clear: both;
					}
					.imgwrap {
						float: left;
						margin: 5px 0px;
						width: 90px;
						height: 90px;
						border: 1px solid rgba(40, 255, 187, 0.1);
						img {
							display: block;
							width: 100%;
							height: 100%;
						}
					}
					.alarminfo {
						float: left;
						width: calc(100% - 100px);
						height: 100%;
						position: relative;
						vertical-align: top;
						.infobox {
							width: 100%;
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							p {
								padding-left: 10px;
								font-family: "PingFangSC-Regular";
								font-size: 14px;
								line-height: 20px;
								color: rgba(255, 255, 255, 0.8);
							}
						}
					}
				}
			}
		}
		.checkboxgroup {
			width: 100%;
			margin: 5px auto 10px;
			background-color: rgb(36, 55, 53);
			padding: 10px 0px;
			&:after {
				content: "";
				clear: both;
				display: block;
			}
			.left {
				float: left;
				width: 20%;
				color: rgba(255, 255, 255, 1);
			}
			.right {
				width: 80%;
				float: left;
				.el-checkbox {
					// width: 100px;
					margin-right: 30px;
					.devicename {
						display: inline-block;
						// width:50px;
					}
					.circle {
						display: inline-block;
						width: 13px;
						height: 13px;
						border-radius: 50%;
						vertical-align: middle;
						margin-left: 5px;
					}
				}
			}
		}
		.alarmtypetitle {
			color: #28ffbb;
			text-align: left;
			line-height: 50px;
			position: relative;
		}
		.otphe {
			position: absolute;
			top: -45px;
			left: -3%;
			font-size: 0px;
			img {
				display: inline-block;
				vertical-align: middle;
			}
			span {
				display: inline-block;
				line-height: 39px;
				font-family: "PingFangSC-Regular";
				font-size: 16px;
				color: rgba(255, 255, 255, 1);
				vertical-align: middle;
				text-indent: 10px;
			}
		}
		.el-checkbox {
			font-family: "PingFangSC-Regular";
			color: rgba(255, 255, 255, 1);
		}
		.el-checkbox + .el-checkbox {
			margin-left: 0px;
		}
		.el-checkbox__label {
			position: relative;
		}
	}
}
</style>
