<template>
	<el-popover
		class="popverTree"
		ref="popverBox"
		popper-class="popverTree"
		:visible-arrow="false"
		:value="visible_popver"
		@show="visiblePopverAct"
		placement="bottom"
		trigger="click"
	>
		<el-row>
			<el-input prefix-icon="el-icon-search" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
			<el-tree
				class="filter-tree"
				:class="{checkedBoxClass:treeType!=='residentTree'}"
				:show-checkbox="treeType==='residentTree'?false:true"
				:check-strictly="true"
				:data="treeData"
				lazy
				:load="loadNode"
				:props="treeType!=='residentTree'?defaultProps:defaultResidentProps"
				:node-key="treeType!=='residentTree'?'groupUuid':'id'"
				:default-expanded-keys="defaultExpandedKeys"
				@node-click="nodeClick"
				@check="checkAct"
				:expand-on-click-node="false"
				:filter-node-method="filterNode"
				ref="roomTree"
				:indent="treeType!=='residentTree'?23:15"
			>
				<div class="custom-tree-node i-tree-item" slot-scope="{ node, data }">
					<div class="i-tree-item-icon">
						{{ node.label}}
						<img
							v-show="treeType==='residentTree' && node.checked && data.type === lastLevelType"
							src="@/assets/images/doorAccess/checked_icon.png"
							width="10.9px"
							height="9px"
							style="margin-right: 20%;"
						/>
					</div>
				</div>
			</el-tree>
		</el-row>
		<el-input
			slot="reference"
			:style="`width: ${inputWidth}`"
			v-model="checkedNodeName"
			:clearable="true"
			suffix-icon="el-icon-caret-bottom"
			@clear="clearAction()"
			:placeholder="`${placeholderTxt}`"
		></el-input>
	</el-popover>
</template>
<script>
export default {
	props: {
		initData: {
			type: Array,
			default() {
				return [];
			}
		},
		placeholderTxt: {
			type: String,
			default: "请选择"
		},
		houseName: {
			type: String,
			default: ""
		},
		visible_popver: {
			type: Boolean,
			default: false
		},
		treeType: {
			type: String,
			default: ""
		},
		inputWidth: {
			type: String,
			default: "220"
		},
		ResidentPopoverClass: {
			type: String,
			default: ""
		},
		checkedNodes: {
			type: Array,
			default() {
				return [];
			}
		},
		topCheckedNodeTitle: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			defaultProps: {
				children: "children",
				label: "groupName"
			},
			defaultResidentProps: {
				children: "children",
				label: "label",
				isLeaf: "leaf"
			},
			checkedNodeName: "",
			filterText: "",
			defaultExpandedKeys: [],
			treeData: window.config.treeData,
			lastLevelType: "house",
			nodeArr: [] // 用来存储被选中的节点数据
		};
	},
	mounted() {
		console.log(this.initData);
	},
	watch: {
		filterText(val) {
			this.$refs["roomTree"].filter(val);
		},
		checkedNodes(val) {
			this.$refs.roomTree.setCheckedNodes(val);
			this.defaultExpandedKeys = [];
			this.checkedNodeName = "";
			val.forEach(element => {
				this.defaultExpandedKeys.push(element.id);
			});
			this.$refs.roomTree.setCheckedKeys(this.defaultExpandedKeys);
			this.getCheckedNodeNameStr(val, true);
			if (val && !val.length) {
				this.checkedNodeName = "";
			}
		},
		initData(val) {
			console.log("00000000000000000000000000");
			console.log(val);
			this.visiblePopverAct();
			if (val && val.length) {
				this.defaultExpandedKeys = [];
				this.checkedNodeName = "";
				this.defaultExpandedKeys.push(val[0].id);
				if (!val[0].nodeType) {
					this.$refs.roomTree.setCheckedKeys(this.defaultExpandedKeys);
					// this.$emit("transferData", this.defaultExpandedKeys);
				}
			}
		}
	},
	computed: {},
	methods: {
		initTreeData() {
			console.log(this.defaultExpandedKeys);
			this.$ResidentManageAjax
				.getResidentTreeDataApi(this.defaultExpandedKeys)
				.then(res => {
					console.log(res.data);
					if (res.data.success && res.data.data) {
						this.treeData = [];
						this.treeData.push(res.data.data);
						this.defaultExpandedKeys.push(this.treeData[0].id);
					} else {
						console.log("getResidentTreeDataApi 出错了！！！");
					}
				});
		},
		initDoorAccessData() {
			let groupType = "";
			if (this.treeType === "doorAccessAuth") {
				groupType = "normal";
			} else {
				groupType = "visitor";
			}
			this.$ResidentManageAjax.getDoorAccessAuthListApi(groupType).then(res => {
				if (res.data.success) {
					this.treeData = res.data.data.list;
				}
			});
		},
		// 根据点击树节点的id获取当前节点的字节
		loadNode(node, resolve) {
			if (node.level === 0) {
				return;
			}
			this.$ResidentManageAjax
				.getResidentTreeNodeDataApi(node.data.id)
				.then(res => {
					if (res.data.success) {
						if (res.data.data && res.data.data.length) {
							for (let item of res.data.data) {
								this.$set(item, "leaf", true);
								if (item.nextCount !== 0 && item.type !== this.lastLevelType) {
									this.$set(item, "leaf", false);
								}
							}
							resolve(res.data.data);
						} else {
							resolve([]);
						}
					} else {
						console.log("getResidentTreeNodeApi~出错了！！！");
					}
				});
		},
		clearAction() {
			this.checkedNodeName = "";
			this.nodeArr = [];
			this.$refs.roomTree.setCheckedNodes([]);
			this.$refs.roomTree.setCheckedKeys([]);
			this.$emit("transferData", []);
		},
		nodeClick(data, node, nodeTree) {
			console.log(node);
			if (this.treeType !== "residentTree") return;
			if (!data.nodeType) return;
			var checkedKeys = this.$refs.roomTree.getCheckedKeys();
			if (checkedKeys.indexOf(data.id) !== -1) {
				checkedKeys.splice(checkedKeys.indexOf(data.id), 1);
				this.nodeArr.splice(checkedKeys.indexOf(data.id), 1);
			} else {
				if (data.type === this.lastLevelType) {
					checkedKeys.push(data.id);
					this.nodeArr.push(node);
				}
			}
			// 这里不知道为什么多个测试小区的id
			console.log(node);
			while (node.parent) {
				let index = checkedKeys.indexOf(node.data.id);
				if (index !== -1) {
					if (node.data.type !== this.lastLevelType) {
						checkedKeys.splice(index, 1);
					}
				}
				node = node.parent;
			}
			// 当前节点为house时，生效
			if (data.type === this.lastLevelType) {
				this.$refs.roomTree.setCheckedKeys(checkedKeys);

				console.log(checkedKeys);
				this.$emit("transferData", checkedKeys);
				var checkedNodes = this.$refs.roomTree.getCheckedNodes();
				this.getCheckedNodeNameStr(checkedNodes);
				console.log(checkedKeys);
			}
		},
		checkAct(data, node) {
			this.$emit("transferCheckedBoxData", node.checkedNodes);
			this.getCheckedNodeNameStr(node.checkedNodes);
		},
		filterNode(value, data) {
			if (!value) return true;
			return data.label.indexOf(value) !== -1;
		},
		getName(node, str = "") {
			if (!node) {
				return str;
			}
			return this.getName(
				node.parent,
				node.data.label ? node.data.label + "／" + str : str
			);
		},
		getCheckedNodeNameStr(arr, isEdit) {
			let str = [];
			console.log(this.nodeArr);
			for (let i = 0; i < this.nodeArr.length; i++) {
				str.push(this.getName(this.nodeArr[i]));
			}
			this.checkedNodeName = str.join(",");
		},
		visiblePopverAct() {
			if (this.treeType === "residentTree") {
				if (this.initData && this.initData.length) {
					this.treeData = this.initData;
				} else {
					this.initTreeData();
				}
			} else {
				this.initDoorAccessData();
			}
			this.checkedNodeName = this.houseName;
			if (this.checkedNodes.length === 0) {
				this.nodeArr = [];
			}
		}
	}
};
</script>
<style>
.checkedBoxClass .el-tree-node__expand-icon {
	display: none !important;
}
.popverTree {
	width: 215px;
	/* position: absolute; */
	/* top: 10px;
    left: 100px; */
}
</style>

<style lang='scss' scoped>
.checkedBoxClass {
	padding-left: 23px;
	box-sizing: border-box;
	.el-tree-node__content > .el-tree-node__expand-icon {
		display: none !important;
	}
}
.el-input {
	display: inline-block;
	width: 215px !important;
	/* width: 30%; */
	height: 30px;
}
.el-tree {
	position: relative;
	cursor: default;
	background: transparent;
	color: #dee5f4;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #dddddd;
	width: 215px;
	height: 350px;
	overflow: auto;
}
</style>


