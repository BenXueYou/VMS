<template>
	<el-dialog
		class="MyDialogClass"
		width="700px"
		:title="title"
		:modal="modal"
		:visible.sync="isShow"
		:before-close="onClickCancel"
		:close-on-press-escape="false"
		:append-to-body="true"
		@close="close"
		:close-on-click-modal="false"
	>
		<el-row class="dialog-content" type="flex" justify="space-around">
			<el-col class="left-contain" :span="12">
				<el-container>
					<el-main>
						<template v-if="!isTag">
							<resident-tree
								:treeType="treeType"
								:visible.sync="isShow"
								:options="options"
								@transferCheckedNodes="transferCheckedNodes"
								:checkedKeys="keysArr"
								:checkeTreedNodes="checkeTreedNodes"
							></resident-tree>
						</template>
						<template v-else>
							<tag-tree
								:treeType="treeType"
								:visible.sync="isShow"
								@transferCheckedNodes="transferCheckedNodes"
								:checkedKeys="keysArr"
								:checkeTreedNodes="checkeTreedNodes"
							></tag-tree>
						</template>
					</el-main>
				</el-container>
			</el-col>
			<el-col class="right-contain" :span="12">
				<!-- <el-checkbox></el-checkbox> -->
				<span class="checkedSpanClass rightTxt">{{rightTxt}}</span>
				<div class="tagBoxAuto">
					<tag :tags="dynamicTags" @handleClose="handleClose"></tag>
				</div>
			</el-col>
		</el-row>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" size="mini" @click="onClickConfirm" class="footer-button">确定</el-button>
			<el-button type="primary" size="mini" @click="onClickCancel" class="footer-button">取消</el-button>
		</div>
	</el-dialog>
</template>

<script>
import residentTree from "./residentTree.vue";
import tagTree from "./tagTree.vue";
import tag from "./Tag.vue";
export default {
	components: { residentTree, tag, tagTree },
	props: {
		isShow: {
			type: Boolean,
			default: false
		},
		options: {
			type: Array,
			default() {
				return [];
			}
		},
		isTag: {
			type: Boolean,
			default: false
		},
		treeType: {
			type: String,
			default: "resident"
		},
		title: {
			type: String,
			default: "新增弹窗"
		},
		rightTxt: {
			type: String,
			default: "已选择的设备"
		},
		tabs: {
			type: Array,
			default: () => []
		},
		modal: {
			type: Boolean,
			default() {
				return false;
			}
		},
		checkedNodeArr: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			checkeTreedNodes: [],
			dynamicTags: [],
			inputModel: "",
			isCurrentShow: false,
			treedata: [],
			defaultProps: {
				children: "children",
				label: "label"
			},
			keysArr: []
		};
	},
	created() {},
	mounted() {},
	methods: {
		init() {
			this.checkeTreedNodes = this.dynamicTags;
		},
		/**
		 * 取消新增或修改
		 */
		onClickCancel() {
			this.$emit("onCancel");
			this.$emit("update:isShow", false);
		},
		onClickConfirm() {
			// alert(1);
			this.$emit("onConfirm", this.checkeTreedNodes);
			// this.$emit("update:isShow", false);
		},
		close() {
			this.$emit("update:isShow", false);
		},
		filterNode(value, data) {
			if (!value) return true;
			return data.label.indexOf(value) !== -1;
		},
		transferCheckedNodes(data, nodeBool, treeName) {
			var num = this.dynamicTags;
			console.log(this.dynamicTags);
			let index = -1;
			for (var i = 0; i < num.length; i++) {
				if (num[i].treeName === treeName && num[i].id === data.id) {
					index = i;
					break;
				}
			}
			if (nodeBool && index === -1) {
				console.log("==================添加数据了！！", nodeBool);
				data.treeName = treeName;
				num.push(data);
			}
			if (!nodeBool && index !== -1) {
				num.splice(index, 1);
			}
			this.dynamicTags = num;
			this.checkeTreedNodes = num;
			console.log(this.dynamicTags);
		},
		handleClose(arr) {
			this.dynamicTags = arr;
			this.checkeTreedNodes = this.dynamicTags;
		}
	},
	watch: {
		isShow(val) {
			// 初始化弹窗数据
			this.isCurrentShow = val;
			this.dynamicTags = [];
			this.checkeTreedNodes = [];
			if (val) {
				this.dynamicTags = this.checkedNodeArr;
				this.checkeTreedNodes = this.checkedNodeArr;
				setTimeout(() => {
					this.init();
				}, 100);
			}
		},
		tabs: {
			handler(val) {
				this.treedata = val;
			},
			immediate: true,
			deep: true
		},
		checkeTreedNodes: {
			handler(val) {},
			immediate: true,
			deep: true
		}
	},
	destroyed() {}
};
</script>
<style>
.MyDialogClass .rightTxt {
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #ffffff;
}
.MyDialogClass .el-input__prefix {
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
.MyDialogClass .el-tag-class .el-icon-close {
	color: rgba(0, 0, 0, 0.6);
	margin-right: -12px;
	margin-top: -30px;
	background-color: rgba(245, 245, 245, 0.6);
}
.MyDialogClass .el-tag-class .el-icon-close:hover {
	background-color: transparent;
	color: #26d39d;
}
.MyDialogClass .el-dialog {
	height: 560px;
}
.MyDialogClass .el-tree {
	overflow-y: auto;
}
.MyDialogClass .el-dialog .el-dialog__body {
	height: calc(100% - 120px);
}
.MyDialogClass .checkedSpanClass {
	font-family: "PingFangSC-Regular";
	font-size: 12px;
	color: #dddddd;
	text-align: center;
	margin-bottom: 11px;
}
.MyDialogClass .checkedSpanClass::before {
	display: inline-block;
	content: "";
	width: 5px;
	height: 5px;
	background-color: #dddddd;
	margin-right: 8px;
	transform: translateY(-50%);
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$line-color: #24473f;
@mixin setFontStyle($fontsize) {
	font-family: PingFangSC-Regular;
	font-size: $fontsize;
	color: #cccccc;
	letter-spacing: 0;
}
.dialog-content {
	display: flex;
	width: 100%;
	height: 100%;
	.left-contain {
		border-right: 1px solid #2f2f2f;
		padding: 10px 15px 0;
		height: 100%;
		.el-container {
			height: 100%;
		}
		.box {
			display: flex;
			justify-content: space-around;
			padding: 10px 0px;
			margin: 0 25px;
			border-bottom: 1px dashed rgb(57, 60, 64);
			span {
				width: 20%;
				min-width: 100px;
				height: 40px;
				line-height: 40px;
			}
			.el-input {
				width: 80%;
			}
		}
		.el-main {
			padding: 10px 15px 0;
		}
	}
	.right-contain {
		padding: 10px 15px;
		.el-checkbox {
			margin-right: 5px;
		}
		.tagBoxAuto {
			width: 100%;
			height: calc(100% - 25px);
			overflow: auto;
		}
	}
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
