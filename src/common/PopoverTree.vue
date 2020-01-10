<template>
	<div class="popover-tree">
		<el-input
			v-model="nodeText"
			:style="`width: ${width}`"
			v-popover:popover
			placeholder="请选择"
			readonly
			:clearable="true"
			size="small"
		></el-input>
		<el-popover
			ref="popover"
			placement="bottom-start"
			width="300"
			@show="showPopover"
			popper-class="my-popover"
			trigger="click"
		>
			<el-input placeholder="输入关键字进行过滤" v-model="filterText" style="margin-bottom: 10px;" size="small"></el-input>
			<el-scrollbar style="height: 87%;" class="i-tree-style">
				<el-tree
					:data="treeData"
					:props="defaultProps"
					node-key="id"
					lazy
					:load="loadNode"
					:filter-node-method="filterNode"
					:indent="10"
					:default-expanded-keys="defaultExpKeys"
					ref="popoverTree"
					:expand-on-click-node="false"
					:highlight-current="true"
					@node-click="handleNodeClick"
				>
					<div class="custom-tree-node i-tree-item" slot-scope="{ node }">
						<div class="i-tree-item-icon">
							{{ node.label }}
							<img
								class="checked-img"
								src="@/assets/images/doorAccess/checked_icon.png"
								width="10.9px"
								height="9px"
								style="margin-right: 20%;"
							/>
						</div>
					</div>
				</el-tree>
			</el-scrollbar>
		</el-popover>
	</div>
</template>
<script>
export default {
	components: {},
	props: {
		width: {
			type: String,
			default: "40"
		},
		initAreaData: {
			type: Object,
			default: () => {}
		},
		lastLevelType: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			treeData: [],
			nodeText: "",
			defaultProps: {
				children: "children",
				label: "label",
				isLeaf: "leaf"
			},
			defaultExpKeys: [],
			labelArr: [],
			upAddress: "",
			filterText: "",
			currentNode: "",
			subType: ""
		};
	},
	created() {},
	mounted() {
		this.initData();
	},
	methods: {
		initData() {
			if (!this.initAreaData) {
				return;
			}
			this.treeData = [
				{
					id: this.initAreaData.id,
					label: this.initAreaData.label,
					type: this.initAreaData.type,
					version: this.initAreaData.version,
					children: []
				}
			];
			this.treeLevelRule = this.initAreaData.extInfo;
			this.getInfrastructure(this.initAreaData.id);
		},
		loadNode(node, resolve) {
			if (node.level === 0) {
				return;
			}
			if (this.initAreaData && node.data) {
				this.$houseHttp
					.getInfrastructure({
						parentUuid: node.data.id
					})
					.then(res => {
						if (!res.data.data) {
							resolve([]);
						} else {
							for (let item of res.data.data) {
								// 新增楼栋单元的上级地址，不能到层。
								if (item.type === "floor") {
									res.data.data = [];
									resolve([]);
									this.$message({
										type: "warning",
										message: "新增楼栋单元的上级地址，不能到层"
									});
									break;
								}
								this.$set(item, "leaf", true);
								if (item.nextCount !== 0 && item.type !== this.lastLevelType) {
									this.$set(item, "leaf", false);
								}
							}
							resolve(res.data.data);
						}
					});
			}
		},
		getInfrastructure(parentUuid) {
			this.$houseHttp
				.getInfrastructure({
					parentUuid
				})
				.then(res => {
					let body = res.data;
					this.handleGetTreeSuccessResponse(body);
				});
		},
		handleGetTreeSuccessResponse(body) {
			if (body.data) {
				this.treeData[0].children = body.data;
			}
			this.handleDefaultExpKeys();
		},
		handleDefaultExpKeys() {
			if (this.treeData && this.treeData.length !== 0) {
				this.defaultExpKeys.push(this.treeData[0].id);
			}
		},
		handleNodeClick(obj, node, component) {
			this.currentNode = node;
			this.labelArr = [];
			this.upAddress = "";
			this.judgeSubLevel(this.currentNode);
			this.getLabelArr(node);
			console.log(node);
			console.log(this.labelArr);
			this.getUpAddress(this.labelArr);
			this.nodeText = this.upAddress;
			this.$emit("setUseData", {
				node: this.currentNode,
				subType: this.subType
			});
		},
		judgeSubLevel(node) {
			if (!node || !this.treeLevelRule || this.treeLevelRule.length === 0) {
				return;
			}
			let subLevel;
			for (let item of this.treeLevelRule) {
				if (node.level === parseInt(item.level)) {
					subLevel = parseInt(item.level) + 1;
				}
			}
			for (let item of this.treeLevelRule) {
				if (subLevel === parseInt(item.level)) {
					this.subType = item.type;
				}
			}
		},
		getLabelArr(node) {
			if (!node) {
				if (this.labelArr.length !== 0) {
					this.labelArr.pop();
				}
				return;
			}
			this.labelArr.push(node.data.label);
			this.getLabelArr(node.parent);
		},
		getUpAddress(labelArr) {
			if (!this.labelArr || this.labelArr.length === 0) {
				return;
			}
			if (!this.upAddress) {
				this.upAddress = this.labelArr.pop();
			} else {
				this.upAddress = `${this.upAddress}／${this.labelArr.pop()}`;
			}
			this.getUpAddress(this.labelArr);
		},
		filterNode(value, data) {
			if (!value) return true;
			return data.label.indexOf(value) !== -1;
		},
		showPopover() {
			this.initData();
		}
	},
	watch: {
		filterText(val) {
			this.$refs.popoverTree.filter(val);
		},
		initAreaData: {
			handler(val) {
				this.initData();
			},
			deep: true
		}
	},
	destroyed() {}
};
</script>
<style lang="scss">
.my-popover {
	height: 250px !important;
}
.i-tree-style {
	.el-tree {
		background: #2a2e31 !important;
	}
	.el-tree-node__content {
		.checked-img {
			display: none;
		}
		&:focus {
			.checked-img {
				display: block;
			}
		}
	}
	.el-tree--highlight-current
		.el-tree-node.is-current
		> .el-tree-node__content {
		.checked-img {
			display: block;
		}
	}
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.i-tree-item {
	width: 100%;
	.i-tree-item-icon {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.action-icon {
			margin-left: auto;
			margin-right: 10px;
			cursor: pointer;
		}
	}
}
</style>
