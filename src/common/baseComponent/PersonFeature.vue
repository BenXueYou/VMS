<template>
	<el-dialog
		width="730px"
		:title="`请选择${title}`"
		:visible.sync="isCurrentShow"
		:before-close="onClickCancel"
		:append-to-body="true"
		:close-on-click-modal="false"
	>
		<div class="PersonFeatureDialog">
			<!--内容-->
			<div class="content-left">
				<div class="block-left">
					<el-input
						v-model="filterText"
						size="small"
						clearable
						class="search-input"
						:placeholder="`请输入${title}`"
					>
						<img slot="prefix" src="@/assets/images/search_s.png" />
					</el-input>
					<div class="faceDB-list">
						<div
							:key="index"
							v-for="(item, index) in PersonFeatureList"
							class="faceDB-item"
							:class="item.checked?'selectStyle':''"
							@click="onClickItem(item,index)"
						>
							<!-- <img :src="itemicon" width="11px" height="11px" /> -->
							<div
								class="item-faceDB text-show text-style"
								:class="item.checked?'selectItemStyle':''"
							>{{item[props.label]}}</div>
							<img class="check-img" v-if="item.checked" src="@/assets/images/checked_icon.png" />
						</div>
					</div>
				</div>
			</div>
			<div class="content-right">
				<div class="block-right">
					<div class="title-line">
						<div class="spot"></div>
						<div class="title title-text">已选择的{{title}}</div>
					</div>
					<div class="selected-faceDB">
						<template v-for="(item, index) in checkedTreeList">
							<div :key="index" class="faceDB-select-item">
								<div class="item-faceDB">
									<img :src="itemicon" width="11px" height="11px" />
									<span class="title-text text-show" style="margin-left: 4px">{{item[props.label]}}</span>
								</div>
								<div class="del-img" @click="deleteItem(item,index)" style="cursor: pointer;">
									<img src="@/assets/images/delete_x.png" width="13px" height="13px" />
								</div>
							</div>
						</template>
					</div>
				</div>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="onClickConfirm" size="small">确定</el-button>
			<el-button type="primary" @click="onClickCancel" size="small">取消</el-button>
		</div>
	</el-dialog>
</template>

<script>
export default {
	components: {},
	props: {
		isShow: {
			type: Boolean,
			default: false
		},
		treeData: {
			type: Array,
			default() {
				return [];
			}
		},
		initSelectData: {
			type: Array,
			default: () => []
		},
		itemicon: {
			type: String,
			default() {
				return require("@/assets/images/person_g.png");
			}
		},
		title: {
			type: String,
			default() {
				return "标题title";
			}
		},
		placeholder: {
			type: String,
			default() {
				return "配置输入框的placeholder";
			}
		},
		checkedText: {
			type: String,
			default() {
				return "配置选中的文字checkedText";
			}
		},
		// 通过传进来id 和 label 对不同数据的字段方便使用
		props: {
			type: Object,
			default() {
				return { label: "label", id: "id" };
			}
		}
	},
	data() {
		return {
			filterText: "",
			isCurrentShow: false,
			titleText: "",
			treeList: [],
			StrengthArr: window.config.StrengthArr,
			ManFeatureArr: window.config.ManFeatureArr
		};
	},
	computed: {
		checkedTreeList() {
			return this.treeList.filter(i => {
				return i.checked;
			});
		},
		PersonFeatureList() {
			return this.treeList.filter(i => {
				return i[this.props.label].indexOf(this.filterText) !== -1;
			});
		}
	},
	created() {},
	mounted() {},
	methods: {
		formatData() {
			if (!this.treeList) return;
			console.log(this.initSelectData);
			console.log(this.treeList);
			let data = this.treeList.map(v => {
				v.checked = this.initSelectData.some(item => {
					return item[this.props.id] === v[this.props.id];
				});
				return v;
			});
			this.treeList = data;
		},
		getFacedbListSuccess(body) {},
		onClickItem(item, index) {
			item.checked = !item.checked;
			this.treeList.splice(index, 1, item);
		},
		deleteItem(item) {
			let id = item[this.props.id];
			let data = this.treeList.map(v => {
				if (v[this.props.id] === id) {
					v.checked = false;
				}
				return v;
			});
			this.treeList = data;
		},
		onClickConfirm() {
			console.log(this.checkedTreeList);
			console.log(this.checkedTreeList.map(v => delete v.checked));
			// this.$emit("onConfirm", this.checkedTreeList.map(v => delete v.checked));
			this.$emit("transferAct", this.title, this.checkedTreeList);
			this.$emit("onCancel");
			this.onClickCancel();
		},
		onClickCancel() {
			this.$emit("update:isShow", false);
		},
		resetFormData() {
			this.treeList = [];
		},
		onChangeInput() {}
	},
	watch: {
		isShow(val) {
			this.filterText = '';
			this.isCurrentShow = val;
			if (val && this.title) {
				this.treeList =
					this.title === "实有力量类型" ? this.StrengthArr : this.ManFeatureArr;
			}
			this.formatData();
		}
	}
};
</script>

<style lang="scss">
.block-left {
	.el-input__prefix {
		position: absolute;
		left: 36px;
		top: 7px;
	}
	.el-input--prefix .el-input__inner {
		padding-left: 28px;
	}
}
</style>
<style lang="scss" scoped>
.PersonFeatureDialog {
	padding: 0 4% 4% 4%;
	height: 500px;
	width: 100%;
	box-sizing: border-box;
	display: flex;
	.content-left {
		width: 50%;
		height: 100%;
		border: {
			width: 0 1px 1px 0;
			style: solid;
			color: rgba($color: #ffffff, $alpha: 0.06);
		}
		padding: 35px 20px;
		box-sizing: border-box;
		.block-left {
			width: 100%;
			height: 100%;
			margin-left: -10px;
			text-align: center;
			.search-input {
				width: 95%;
			}
			.faceDB-list {
				width: 100%;
				height: 90%;
				margin-top: 20px;
				overflow-y: auto;
				overflow-x: hidden;
				.faceDB-item {
					height: 34px;
					display: flex;
					flex-flow: row nowrap;
					align-items: center;
					padding: 0 20px;
					cursor: pointer;
					margin-bottom: 10px;
					background: rgba($color: #ffffff, $alpha: 0.05);
					border-radius: 2px;

					&:hover {
						background: rgba($color: #26d39d, $alpha: 0.05);
					}
					.item-faceDB {
						width: 90%;
						margin-left: 18px;
						text-align: left;
					}
					.item-name {
						width: 20%;
						margin-left: 30px;
						text-align: left;
					}
					.check-img {
						margin-left: auto;
						margin-right: 8px;
					}
				}
			}
		}
		.selectStyle {
			background: rgba(37, 210, 152, 0.05) !important;
		}
		.selectItemStyle {
			color: #26d39d !important;
		}
		.text-style {
			font-family: "PingFangSC-Regular";
			font-size: 12px;
			color: #dddddd;
		}
		.el-input__inner {
			padding-left: 30px;
		}
	}
	.content-right {
		width: 50%;
		height: 100%;
		border: {
			width: 0 0 1px 0;
			style: solid;
			color: rgba($color: #ffffff, $alpha: 0.06);
		}
		padding: 15px 15px;
		box-sizing: border-box;
		.block-right {
			width: 100%;
			height: 100%;
			margin-left: 18px;
			text-align: center;
			.title-line {
				display: flex;
				align-items: center;
				.spot {
					width: 5px;
					height: 5px;
					background: #aaaaaa;
					border-radius: 1px;
				}
				.title {
					margin-left: 6px;
				}
			}
			.selected-faceDB {
				width: 100%;
				height: 95%;
				padding: 8px 0;
				box-sizing: border-box;
				margin-top: 20px;
				overflow-y: auto;
				overflow-x: hidden;
				text-align: center;
				display: flex;
				flex-flow: row wrap;
				align-content: flex-start;
				.faceDB-select-item {
					height: 36px;
					display: flex;
					flex-flow: row nowrap;
					align-items: center;
					padding: 0 6px;
					box-sizing: border-box;
					background: rgba($color: #ffffff, $alpha: 0.03);
					border-radius: 3px;
					margin-bottom: 10px;
					margin-right: 10px;
					position: relative;
					.item-faceDB {
						text-align: left;
					}
					.item-name {
						width: 20%;
						margin-left: 30px;
						text-align: left;
					}
					.del-img {
						position: absolute;
						top: -5px;
						right: -5px;
					}
				}
			}
			.title-text {
				font-family: PingFangSC-Regular;
				font-size: 13px;
				color: #dddddd;
			}
		}
	}
}
.dialog-footer {
	padding: 0 4% 4% 0;
	box-sizing: border-box;
}
</style>
