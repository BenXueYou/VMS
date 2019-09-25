<template>
	<el-dialog
		class="StaticsViewDialogClass"
		width="28.3%"
		:title="title"
		:visible.sync="isCurrentShow"
		:before-close="onClickCancel"
		:close-on-click-modal="false"
	>
		<el-main>
			<el-row type="flex" justify="space-between">
				<el-col :span="14">
					<div id="canvasPie"></div>
				</el-col>
				<el-col :span="10" style="margin: auto;">
					<div class="legendBox" v-for="(item,index) in pieData" :key="index">
						<p class="name" :style="{color:color[index]}">
							<span>{{item.name}}</span>
						</p>
						<p style="text-align:center">{{item.value}}</p>
					</div>
				</el-col>
			</el-row>
		</el-main>

		<div slot="footer" class="dialog-footer">
			<el-button type="primary" size="mini" @click="onClickConfirm" class="footer-button">确定</el-button>
			<el-button type="primary" size="mini" @click="onClickCancel" class="footer-button">取消</el-button>
		</div>
	</el-dialog>
</template>

<script>
import tabTree from "./TabTree.vue";
import tag from "./Tag.vue";
export default {
	components: { tabTree, tag },
	props: {
		isShow: {
			type: Boolean,
			default: false
		},
		staticDefaultData: {
			type: Object,
			default: {}
		},
		title: {
			type: String,
			default: "新增弹窗"
		}
	},
	data() {
		return {
			color: ["#0ED0B6", "#05B1EE", "#02CD5E", "#A386F9", "#EF8871", "#F7D953"],
			isCurrentShow: false,
			pieData: [
				{ value: 0, name: "居民" },
				{ value: 0, name: "男" },
				{ value: 0, name: "女" },
				{ value: 0, name: "比对照片数" },
				{ value: 0, name: "比对指纹数" },
				{ value: 0, name: "比对卡片数" }
			]
		};
	},
	created() {},
	mounted() {
		// 当窗口发生变化时
		let that = this;
		window.addEventListener("resize", function() {
			that.drawPie();
		});
	},
	methods: {
		/**
		 * 取消新增或修改
		 */
		onClickCancel() {
			this.$emit("onClickCancel");
		},
		onClickConfirm() {
			this.$emit("onClickConfirm");
		},
		drawPie() {
			if (this.staticDefaultData && this.staticDefaultData.total) {
				this.pieData[0].value = this.staticDefaultData.total;
				this.pieData[1].value = this.staticDefaultData.male;
				this.pieData[2].value = this.staticDefaultData.female;
				this.pieData[3].value = this.staticDefaultData.photos;
				this.pieData[4].value = this.staticDefaultData.fingerprints;
				this.pieData[5].value = this.staticDefaultData.mediums;
			}
			var dom = document.getElementById("canvasPie");
			let myChart = this.$echarts.init(dom);
			var option = {
				tooltip: {
					trigger: "item",
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				legend: {
					orient: "vertical",
					show: false,
					itemGap: 50,
					left: "right",
					top: "center",
					data: [
						"居民",
						"男",
						"女",
						"比对人脸数",
						"比对指纹数",
						"比对卡片数"
					].reverse()
				},
				color: this.color,
				series: [
					{
						name: "访问来源",
						type: "pie",
						radius: ["40%", "80%"],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: "center"
							},
							emphasis: {
								show: false,
								textStyle: {
									fontSize: "30",
									fontWeight: "bold"
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: this.pieData
					}
				]
			};

			myChart.setOption(option);
		}
	},
	watch: {
		isShow(val) {
			console.log(val);
			// 初始化弹窗数据
			this.isCurrentShow = val;
			setTimeout(() => {
				this.drawPie();
			}, 0);
		}
	},
	destroyed() {}
};
</script>
<style>
.StaticsViewDialogClass .el-input__prefix {
	position: absolute;
	height: 100%;
	left: 5px !important;
	top: 0;
	text-align: center;
	color: #c0c4cc;
	-webkit-transition: all 0.3s;
	transition: all 0.3s;
	transform: translateX(0%);
}
.StaticsViewDialogClass .el-tag-class .el-icon-close {
	color: #ffffff;
	margin-right: -12px;
	margin-top: -30px;
}
.StaticsViewDialogClass .el-tag-class .el-icon-close:hover {
	background-color: transparent;
	color: #26d39d;
}
.StaticsViewDialogClass .el-dialog {
	max-height: 58.3%;
	min-height: 360px;
	min-width: 540px;
}
.StaticsViewDialogClass .el-dialog__body {
	padding: 0;
	min-height: 300px;
}
#canvasPie {
	width: 100%;
	min-height: 300px;
}
.legendBox {
	font-size: 0px;
}
.StaticsViewDialogClass .legendBox p {
	font-size: 13px;
	display: inline-block;
	width: 50%;
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #dddddd;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$line-color: #24473f;
.StaticsViewDialogClass .legendBox .name {
	position: relative;
	box-sizing: border-box;
	span {
		display: inline-block;
		padding-left: 20px;
		font-family: "PingFangSC-Regular";
		font-size: 12px;
		color: #dddddd;
	}
	&::after {
		content: "";
		width: 6px;
		height: 6px;
		border-radius: 50%;
		position: absolute;
		top: 50%;
		left: 0px;
		transform: translateY(-50%);
		background-color: currentColor;
		margin-right: 10px;
	}
}
@mixin setFontStyle($fontsize) {
	font-family: PingFangSC-Regular;
	font-size: $fontsize;
	color: #cccccc;
	letter-spacing: 0;
}
.el-dialog__body {
	height: 100%;
}
.StaticsViewDialogClass .el-header {
	width: 50%;
	height: 40px !important;
	line-height: 40px;
	margin-top: 20px;
	padding-left: 35px;
}
.el-main {
	padding: 10px 25px 10px;
}
.el-checkbox {
	margin-right: 5px;
}
.dialog-footer {
	border: {
		width: 1px 0 0 0;
		style: solid;
		color: $line-color;
	}
	.footer-button {
		margin: 17px 28px 17px 0;
	}
}
</style>
