<template>
	<el-dialog
		:title="title"
		@close="close"
		width="1100px"
		:class="{'dialogCenter':true}"
		:close-on-click-modal="false"
		:append-to-body="true"
		class="showResource"
		:visible.sync="isShow"
	>
		<div class="mywrap">
			<div class="left">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane
						v-for="(treeTab,i) in treeTypeArr"
						:key="i"
						:label="treeTab.label"
						class="i-tree"
						:name="treeTab.id"
					>
						<el-tree
							:load="getNewTree"
							node-key="id"
							:show-checkbox="false"
							:props="defaultProps"
							:expand-on-click-node="false"
							@node-click="nodeClick"
							:filter-node-method="filterNode"
							lazy
						>
							<div class="custom-tree-node i-tree-item" slot-scope="{node}">
								<div class="i-tree-item-icon">
									{{ node.data.label}}
									<template>
										<img
											v-if="node.checked"
											src="@/assets/images/doorAccess/checked_icon.png"
											width="10.9px"
											height="9px"
											style="margin-right: 20px;"
										/>
									</template>
								</div>
							</div>
						</el-tree>
					</el-tab-pane>
					<!-- <el-tab-pane label="门禁" name="door"></el-tab-pane>
					<el-tab-pane label="报警" name="alarm"></el-tab-pane>
					<el-tab-pane label="访客机" name="visitor"></el-tab-pane>-->
				</el-tabs>
			</div>
			<div class="right">
				<!---- 资源类型 ----->
				<el-radio-group v-model="resourceType" @change="resourceTypeChange">
					<template v-for="(item,index) in rightTabArr">
						<el-radio-button :key="index" :label="item.id" :name="item.id">{{item.label}}</el-radio-button>
					</template>
				</el-radio-group>
				<!---- 资源权限 ----->
				<template v-for="(channelItem,i) in checkedChannelArr">
					<div v-if="resourceType === channelItem.resType" class="channelItemClass" :key="i">
						<span>{{channelItem.label}}</span>
						<el-checkbox
							:indeterminate="channelItem.isIndeterminate"
							v-model="channelItem.checkAll"
							@change="handleCheckAllChange(channelItem)"
						>全选</el-checkbox>
						<el-checkbox-group v-model="channelItem.checkedAuthUuids">
							<template v-for="(authItem,j) in channelItem.authArr">
								<el-checkbox
									:key="j"
									:label="authItem.authUuid"
									:name="authItem.authUuid"
								>{{authItem.authName}}</el-checkbox>
							</template>
						</el-checkbox-group>
					</div>
				</template>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="onConfirmBtn">确 定</el-button>
			<el-button type="primary" @click="isShow = false">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
import * as api from "../http/ajax";
export default {
  name: "resouceTree",
  props: {
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return "关联的通道资源";
      }
    }
  },
  data() {
    return {
      resourceTypeArr: window.config.resourceType,
      isShow: false,
      activeName: "video",
      defaultProps: {
        children: "children",
        label: "label",
        id: "id",
        isLeaf: "isLeaf"
      },
      defaultExpandedKeys: [2],
      cnt: 0,
      checkedChannelArr: [],
      rightTabArr: [],
      resourceType: "",
      resourceAuthArr: [],
      treeTypeArr: []
    };
  },
  mounted: function() {
    this.treeTypeArr = [
      { id: "video", label: "视频" },
      { id: "door", label: "门禁" },
      { id: "alarm", label: "报警" },
      { id: "visitor", label: "访客机" }
    ];
    this.rightTabArr = this.resourceTypeArr[this.activeName];
    this.resourceType = this.rightTabArr[0].id;
    this.getChannelAuth();
  },
  methods: {
    // 点击资源的全选按钮
    handleCheckAllChange(channelItem) {
      let arr = [];
      if (channelItem.checkAll) {
        channelItem.authArr.filter(item => {
          arr.push(item.authUuid);
        });
        channelItem.isIndeterminate = false;
      } else {
        arr = channelItem.checkedChannelArr;
        channelItem.isIndeterminate = true;
      }
      this.$set(channelItem, "checkedAuthUuids", arr);
    },
    // 点击角色确定按钮
    onConfirmBtn() {
      this.isShow = !this.isShow;
      let dataArr = [];
      this.checkedChannelArr
        .filter((item, i) => {
          return item.checkedAuthUuids.length;
        })
        .map(o => {
          dataArr.push({
            resourceUuid: o.id,
            resourceType: o.resType,
            resourceAuthUuids: o.checkedAuthUuids
          });
        });
      this.$emit("transferResourceAuth", dataArr);
    },
    // 输入框的筛选按钮
    filterNode(obj, data) {},
    // 点击树节点响应事件
    nodeClick(data, node, nodeTree) {
      //  新增节点的类型字段
      this.$set(node, "checked", !node.checked);
      this.handleCheckChannelData(data, node.checked);
    },
    // 通道资源的静态资源权限
    getChannelAuth() {
      api
        .getResource({ resourceType: this.resourceType })
        .then(res => {
          if (res.data.success) {
            res.data.data = res.data.data || [];
            let data = res.data.data[0];
            this.resourceAuthArr = data.auth;
            let obj = {
              id: "",
              label: "资源名称",
              authArr: JSON.parse(JSON.stringify(this.resourceAuthArr))
            };
            this.$set(this.checkedChannelArr, "0", obj);
          } else {
            this.$messsage({
              type: "warning",
              messsage: res.data.msg
            });
          }
        })
        .catch(() => {});
    },
    // 处理选中的数据源
    handleCheckChannelData(data, isBool) {
      if (isBool) {
        // 构造当前资源类型权限对象
        data.authArr = JSON.parse(JSON.stringify(this.resourceAuthArr));
        let checkedAuthUuids = [];
        // 默认资源权限全选
        data.authArr.filter(v => {
          checkedAuthUuids.push(v.authUuid);
        });
        this.$set(data, "checkedAuthUuids", checkedAuthUuids);
        data.checkAll = true;
        data.isIndeterminate = false;
        this.checkedChannelArr.push(data);
        console.log(this.checkedChannelArr);
      } else {
        // 删除
        this.checkedChannelArr.splice(
          this.checkedChannelArr.findIndex(
            item => item.channelUuid === data.channelUuid
          ),
          1
        );
      }
    },
    // 获取树节点数据的HTPP
    getTreeData(obj) {
      return new Promise(resolve => {
        api
          .getNewTree(obj)
          .then(res => {
            console.log(res);
            let data = res.data.data || [];
            data.forEach(element => {
              if (!element.openFlag) {
                element.isLeaf = true;
              }
            });
            resolve(data);
          })
          .catch(() => {
            resolve([]);
          });
      });
    },
    // 树的懒加载动作
    async getNewTree(node, resolve) {
      this.$set(node, "checked", false);
      let obj = {
        viewType: this.activeName, // 不填则查所有类型资源 门禁 door、视频 video、报警 alarm、访客机 visitor
        treeStructure: "orgNode$device|devNode|chnNode", // 树结构，指定树的类型及树的结构
        authEnable: false, // 是否开启权限过滤，默认开启true
        recursiveEnable: false // 是否递归查询子节点的资源，默认不查询false
      };
      // 先判断是不是根节点
      if (node) {
        // 非根节点
        obj.parentType = node.nodeType;
        obj.parentUuid = node.parentUuid;
      }
      let data = await this.getTreeData(obj);
      resolve(data);
    },
    // 点击tab按钮，切换树的类型
    handleClick(tab, event) {
      this.rightTabArr = this.resourceTypeArr[tab.name];
      this.resourceType = this.rightTabArr[0].id;
      let topChannelItem = {
        id: "",
        label: "资源名称",
        authArr: JSON.parse(JSON.stringify(this.resourceAuthArr))
      };
      this.$set(this.checkedChannelArr, "0", topChannelItem);
      // 切换树的类型
      let obj = {
        viewType: this.activeName, // 不填则查所有类型资源 门禁 door、视频 video、报警 alarm、访客机 visitor
        treeStructure: "orgNode$device|devNode|chnNode", // 树结构，指定树的类型及树的结构
        authEnable: false, // 是否开启权限过滤，默认开启true
        recursiveEnable: false // 是否递归查询子节点的资源，默认不查询false
      };
      this.getTreeData(obj);
    },
    // 点击右边按钮，改变资源类型
    resourceTypeChange() {
      this.getChannelAuth();
    },
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible() {
      this.isShow = this.visible;
    }
  }
};
</script>
<style>
.showResource .right .channelItemClass {
	border-bottom: 1px dashed rgb(69, 71, 74);
}
.showResource .el-tabs__item {
	color: #dddddd;
}
.showResource .right .el-radio-group {
	width: 70%;
	display: flex;
	justify-content: space-between;
}
.showResource .right .el-radio-group .el-radio-button__inner {
	display: inline-block;
	width: 90px;
	background: transparent;
	border: 1px solid rgba(38, 211, 157, 0.08);
	border-radius: 2px;
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #dddddd;
	text-align: justify;
	text-align: center;
}
.showResource
	.right
	.el-radio-button__orig-radio:checked
	+ .el-radio-button__inner {
	color: #ffffff;
	background: rgba(40, 255, 187, 0.08);
	border-color: rgba(38, 211, 157, 0.8);
	-webkit-box-shadow: -1px 0 0 0 #26d39d;
	box-shadow: -1px 0 0 0 rgba(38, 211, 157, 0.08);
}
.showResource .el-tabs__item.is-active {
	color: #26d39d;
}
</style>
<style lang="scss" scoped>
$width: 300px;

.showResource {
	.mywrap {
		display: flex;
		min-height: 500px;
		.left {
			flex: 3;
			padding: 20px 25px;
			border-right: 1px solid rgba(255, 255, 255, 0.05);
		}
		.right {
			flex: 7;
			padding: 10px 25px;
		}
	}
	.dialog-footer {
		height: 69px;
		line-height: 69px;
		border-top: 1px solid #24473f;
		padding-right: 48px;
	}
}
.i-tree {
	width: 100%;
	height: 100%;
	overflow: auto;
	padding: 10px 0;
	box-sizing: border-box;
	overflow: auto;
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
}
</style>
