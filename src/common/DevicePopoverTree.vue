<template>
	<div class="device-popover-tree">
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
			width="220"
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
							>
						</div>
					</div>
				</el-tree>
			</el-scrollbar>
		</el-popover>
	</div>
</template>

<script>
import icons from "@/common/icon.js";
import * as api from "@/pages/equipmentMange/ajax.js";
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
			subType: "",
			needType: "orgAndDev",
			orgType: "device"
		};
	},
	created() {},
	mounted() {
		this.initData();
	},
	methods: {
		initData() {
			this.getInfrastructure("");
		},
		loadNode(node, resolve) {
			if (node.level === 0) {
				return;
			}
			if (node.data) {
				// this.$houseHttp
				// 	.getInfrastructure({
				// 		parentUuid: node.data.id
				// 	})
				// 	.then(res => {
				// 		if (!res.data.data) {
				// 			resolve([]);
				// 		} else {
				// 			for (let item of res.data.data) {
				// 				this.$set(item, "leaf", true);
				// 				if (item.nextCount !== 0 && item.type !== this.lastLevelType) {
				// 					this.$set(item, "leaf", false);
				// 				}
				// 			}
				// 			resolve(res.data.data);
				// 		}
				// 	});
				let data = {
					parentOrgUuid: node.data.id,
					needType: this.needType
				};
				api.getOrgTree(data, this.orgType).then(res => {
					if (!res.data.data) {
						resolve([]);
					} else {
						for (let item of res.data.data) {
							this.$set(item, "leaf", true);
							if (item.nextCount !== 0 && item.type !== this.lastLevelType) {
								this.$set(item, "leaf", false);
							}
						}
						resolve(res.data.data);
					}
					// if (res.data.data && res.data.data.length) {
					// 	this.treeData = [];
					// 	res.data.data.forEach(element => {
					// 		if (element.nextCount === "0" || element.nextCount === 0) {
					// 			element.isLeaf = true;
					// 		}
					// 		this.treeData.push(element);
					// 	});
					// 	this.defaultExpKeys = [];
					// 	if (this.treeData.length) {
					// 		this.defaultExpKeys.push(this.treeData[0].id);
					// 	}
					// } else {
					// 	this.$message({
					// 		type: "warning",
					// 		message: "没有获取到设备树"
					// 	});
					// }
				});
			}
			resolve([]);
		},
		getInfrastructure(parentUuid) {
			let data = {
				parentOrgUuid: parentUuid,
				needType: this.needType
			};
			api.getOrgTree(data, this.orgType).then(res => {
				if (res.data.data && res.data.data.length) {
					this.treeData = [];
					res.data.data.forEach(element => {
						if (element.nextCount === "0" || element.nextCount === 0) {
							element.isLeaf = true;
						}
						this.treeData.push(element);
					});
					this.defaultExpKeys = [];
					if (this.treeData.length) {
						this.defaultExpKeys.push(this.treeData[0].id);
					}
				} else {
					this.$message({
						type: "warning",
						message: "没有获取到设备树"
					});
				}
			});
		},

		handleNodeClick(obj, node, component) {
			this.currentNode = node;
			this.labelArr = [];
			this.upAddress = "";
			this.judgeSubLevel(this.currentNode);
			this.getLabelArr(node);
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
// .my-popover {
// 	height: 250px !important;
// }
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
