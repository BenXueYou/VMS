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
					<el-tab-pane label="视频" class="i-tree" name="video">
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
					<el-tab-pane label="门禁" name="door"></el-tab-pane>
					<el-tab-pane label="报警" name="alarm"></el-tab-pane>
					<el-tab-pane label="访客机" name="visitor"></el-tab-pane>
				</el-tabs>
			</div>
			<div class="right">
				<el-radio-group v-model="resourceType" @change="resourceTypeChange">
					<template v-for="(item,index) in rightTabArr">
						<el-radio-button :key="index" :label="item.id" :name="item.id">{{item.label}}</el-radio-button>
					</template>
				</el-radio-group>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="isShow = false">确 定</el-button>
			<el-button type="primary" @click="isShow = false">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
import * as api from "../http/ajax";
const data = {
  video: [
    {
      id: "device",
      label: "视频设备",
      children: [
        { id: "see", label: "查看" },
        { id: "say", label: "设备对讲" },
        { id: "reveive", label: "事件接受" }
      ]
    },
    { id: "videoChannel", label: "监控点" },
    { id: "inputChannel", label: "输入" },
    { id: "outputChannel", label: "输出" }
  ],
  door: [
    {
      id: "device",
      label: "门禁设备",
      children: [
        { id: "see", label: "查看" },
        { id: "say", label: "设备对讲" },
        { id: "reveive", label: "事件接受" }
      ]
    },
    { id: "doorChannel", label: "门禁点" },
    { id: "inputChannel", label: "输入" },
    { id: "outputChannel", label: "输出" }
  ],
  alarm: [
    {
      id: "device",
      label: "报警设备",
      children: [
        { id: "see", label: "查看" },
        { id: "say", label: "设备对讲" },
        { id: "reveive", label: "事件接受" }
      ]
    },
    { id: "videoChannel", label: "防区" },
    { id: "inputChannel", label: "报警输入" },
    { id: "outputChannel", label: "报警输出" }
  ],
  visitor: [
    {
      id: "device",
      label: "访客机设备",
      children: [
        { id: "see", label: "查看" },
        { id: "say", label: "设备对讲" },
        { id: "reveive", label: "事件接受" }
      ]
    }
  ]
};
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
      rightTabArr: data["video"],
      resourceType: "device"
    };
  },
  methods: {
    filterNode(obj, data) {},
    // 点击树节点响应事件
    nodeClick(data, node, nodeTree) {
      //  新增节点的类型字段
      // console.log(data, node, nodeTree);
      this.$set(node, "checked", !node.checked);
      this.handleCheckChannelData(data, node.checked);
    },
    // 通道资源的静态资源权限
    getChannelAuth() {
      api
        .getResource({ resourceType: this.resourceType })
        .then(res => {
          if (res.data.success) {
            console.log(res.data.data);
          }
        })
        .catch(() => {});
    },
    // 处理选中的数据源
    handleCheckChannelData(data, isBool) {
      if (isBool) {
        // 判断树类型
        // 构造当前资源类型权限对象
        // let channelAuthObj = this.rightTabArr.filter(item => {
        //   return item.id === this.resourceType;
        // })[0].children;
        // Object.assign(data, channelAuthObj);
        this.checkedChannelArr.push(data);
        // console.log(this.checkedChannelArr);
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
    getTreeData(obj) {
      return new Promise(resolve => {
        api
          .getNewTree(obj)
          .then(res => {
            console.log(res);
            let data = res.data.data || [];
            resolve(data);
          })
          .catch(() => {
            resolve([]);
          });
      });
    },
    async getNewTree(node, resolve) {
      this.$set(node, "checked", false);
      // let obj = {
      //   viewType: "video", // 不填则查所有类型资源 门禁 door、视频 video、报警 alarm、访客机 visitor
      //   treeStructure:
      // 		"orgNode$orgType|devNode[$...devType]|chnNode[[$...chnType]]", // 树结构，指定树的类型及树的结构
      //   authEnable: false, // 是否开启权限过滤，默认开启true
      //   parentUuid: "fb6a1a0ad9b444bba4d5b5be1015c43d", // 查询的树节点UUID，默认根节点
      //   parentType: "orgNode", // 查询的树节点类型。组织 org[默认]、设备 dev、通道 chn
      //   recursiveEnable: true // 是否递归查询子节点的资源，默认不查询false
      // };
      // 先判断是不是根节点
      if (node) {
        // 非根节点
      } else {
        // 根节点
      }
      // let data = await this.getTreeData(obj);
      // 以下为测试代码
      this.cnt++;
      let obj = [
        {
          id: "string" + this.cnt /* 节点UUID */,
          label: "string" + this.cnt /* 节点名称 */,
          nodeType: "org" /* 当前节点类型[组织 org、设备 dev、通道 chn] */,
          resType: "int" /* 节点的资源类型 */,
          realType: "string" /* 节点的真实类型 */,
          openFlag: true /* 节点是否有下一级 */,
          extInfo: {
            // 当前节点类型为通道
            channelDivideType:
							"string" /* 监控点monitor、输入input、输出output、门禁点access、防区zone、子系统subsystem */
          }
        }
      ];
      resolve(obj);
    },
    // 点击tab筛选树的类型
    handleClick(tab, event) {
      this.rightTabArr = this.resourceTypeArr[tab.name];
      this.resourceType = this.rightTabArr[0].id;
      // TODO:筛选通道类型，左侧选中的树的节点
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
