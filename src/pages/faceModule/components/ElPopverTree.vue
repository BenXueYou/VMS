<template>
	<el-popover
		class="popverTree"
		ref="popverBox"
		:popper-class="elPopoverClass"
		:visible-arrow="false"
		:value="visible_popver"
		@show="show"
		@hide="hide"
		placement="bottom-start"
		trigger="click"
	>
		<el-row class="popverTreeParentBox">
			<el-row
				style="overflow:auto; width:35%;border-right:1px solid rgb(104,103,102);background: #202124;"
			>
				<el-tree
					ref="deviceTree"
					class="popverTreeClass"
					:check-on-click-node="true"
					default-expand-all
					:data="treeData"
					node-key="id"
					:props="defaultProps"
					@node-click="handleNodeClick"
				></el-tree>
			</el-row>
			<el-row class="popverTreeParent" style="width:65%;background: #202124;">
				<div class="checkBoxTitle" style="width:85px;">
					<el-checkbox
						v-if="boxType!=='radio'"
						:indeterminate="isIndeterminate"
						v-model="checkAll"
						@change="handleCheckAllChange"
					>全选</el-checkbox>
				</div>
				<template v-if="boxType=='radio'">
					<el-radio-group
						v-if="channels"
						class="popverTreeParent checkGroupClass"
						v-model="checkedChannel"
						@change="handleCheckedChange"
					>
						<el-radio
							style="margin:10px 15px 9px;font-family: PingFangSC-Regular;font-size: 14px;color: #AAAAAA;letter-spacing: 0;"
							v-for="item in channels"
							:key="item.id"
							:label="item"
						>{{item.label}}</el-radio>
					</el-radio-group>
					<el-row v-else style="margin:15px;color:#ffffff">任务没有关联摄像机</el-row>
				</template>
				<template v-else>
					<el-checkbox-group
						v-if="channels"
						class="popverTreeParent checkGroupClass"
						v-model="checkedChannel"
						@change="handleCheckedChange"
					>
						<el-checkbox
							class="checkBoxClass"
							v-for="item in channels"
							:key="item.id"
							:label="item"
						>{{item.label}}</el-checkbox>
					</el-checkbox-group>
					<el-row v-else style="margin:15px;color:#ffffff">任务没有关联摄像机</el-row>
				</template>
			</el-row>
		</el-row>

		<el-input
			slot="reference"
			:style="`width: ${inputWidth}`"
			v-model="checkedChannelName"
			:clearable="true"
			@clear="clearAction()"
			placeholder="请选择"
		></el-input>
	</el-popover>
</template>
<script type="text/javascript">
// import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js";
// import BigImg from "./BigImg.vue";
// var cityOptions = [];
export default {
  name: "elPopverTree",
  props: {
    checkedChannelKeys: {
      type: Array,
      default() {
        return [];
      }
    },
    channelInfoList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    elPopoverClass: {
      type: String,
      default: ""
    },
    boxType: {
      type: String,
      default: ""
    },
    inputWidth: {
      type: String,
      default: "50%"
    }
  },
  components: {},

  data: function() {
    return {
      checkedChannel: [], // 此变量的类型不可定义为字符串
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: function(data, node) {
          if (data.children) return true;
          return false;
        }
      },
      checkAll: false,
      isIndeterminate: true,
      visible_popver: false,
      treeData: [],
      channels: [],
      checkedChannelName: "全部",
      isFlag: false
    };
  },
  watch: {
    channelList: function() {
      this.channels = this.channelList;
    },
    channelInfoList(val) {
      // 若单选框则默认设置第一阶段的叶子
      if (this.boxType === "radio") {
        this.treeData = JSON.parse(JSON.stringify(this.channelInfoList));
        var arr = [];
        arr = this.getInitChannelInfoList(this.channelInfoList);
        this.channels = arr;
        this.checkedChannel = arr[0];
        this.checkedChannelName = arr[0].label;
        this.$emit("getRadioDefaultData", this.checkedChannel);
      } else {
        if (this.checkedChannelKeys && this.checkedChannelKeys.length) {
          this.channels = [];
          this.checkedChannel = [];
          for (let i = 0; i < this.checkedChannelKeys.length; i++) {
            var id = this.checkedChannelKeys[i];
            var _this = this;
            _this.getChannelInfoList(_this.channelInfoList, id, _this);
          }
          this.checkedChannel = this.channels;
          this.checkedChannelName = "";
          for (let i = 0; i < this.checkedChannel.length; i++) {
            this.checkedChannelName += this.checkedChannel[i].label;
            this.checkedChannelName += ",";
          }
        } else {
          this.channels = [];
          this.getChildren(this.channelInfoList, this.channels);
          this.checkedChannel = this.channels;
        }
      }
    }
  },

  mounted: function(e) {
    // 若设置了默认选中的节点
    // if(this.checkedChannelKeys && this.checkedChannelKeys.length){
    //     this.channels = [];
    //     this.checkedChannel = [];
    //     for(var i=0;i<this.checkedChannelKeys.length;i++){
    //       var id = this.checkedChannelKeys[i];
    //       var _this = this;
    //       _this.getChannelInfoList(_this.channelInfoList, id, _this);
    //     }
    //     this.checkedChannel = this.channels;
    //     this.checkedChannelName = '';
    //     for(var i=0;i<this.checkedChannel.length;i++){
    //       this.checkedChannelName += this.checkedChannel[i].label;
    //       this.checkedChannelName += ',';
    //     }
    // }else{
    // }
  },
  activated: function() {
    console.log("刷新页面");
  },
  methods: {
    clearAction() {
      this.checkedChannel = [];
      this.checkedChannelName = "";
    },
    // 递归确定默认设备列表
    getInitChannelInfoList(data) {
      if (!data || data.length === 0) {
        return "";
      }
      if (data[0] && data[0].children === null) {
        return data;
      } else {
        return this.getInitChannelInfoList(data[0].children);
      }
    },
    // 去掉树节点的叶子
    hasChildren(data) {
      if (!data && data.length === 0) {
        return;
      }
      for (let index = 0; index < data.length; index++) {
        if (data[index].children === null) {
          data.splice(index, 1);
          index = index - 1;
        } else {
          this.hasChildren(data[index].children);
        }
      }
    },
    // 弹窗展开的回调
    show() {
      console.log("--------show-------");
      this.treeData = JSON.parse(JSON.stringify(this.channelInfoList));
      this.hasChildren(this.treeData);
      // 若设置了默认选中的节点
      if (this.checkedChannelKeys && this.checkedChannelKeys.length) {
        this.channels = [];
        this.checkedChannel = [];
        for (let i = 0; i < this.checkedChannelKeys.length; i++) {
          var id = this.checkedChannelKeys[i];
          var _this = this;
          _this.getChannelInfoList(_this.channelInfoList, id, _this);
        }
        this.checkedChannel = this.channels;
        this.checkedChannelName = "";
        for (let i = 0; i < this.checkedChannel.length; i++) {
          this.checkedChannelName += this.checkedChannel[i].label;
          this.checkedChannelName += ",";
        }
      } else {
        // 默认展示所有节点
        if (this.checkedChannel && this.checkedChannel.length) {
          return;
        }
        if (this.boxType !== "radio") {
          this.channels = [];
          this.getChildren(this.channelInfoList, this.channels);
          this.checkedChannel = this.channels;
        }
      }
    },
    // 弹窗关闭的回调
    hide() {
      this.$emit("transferCheckedChannel", this.checkedChannel);
      this.checkedChannelName = "";
      if (
        this.checkedChannel &&
				Object.prototype.toString.call(this.checkedChannel) !== "[object Array]"
      ) {
        this.checkedChannelName = this.checkedChannel.label;
      } else if (this.checkedChannel && this.checkedChannel.length) {
        this.checkedChannelName = "";
        for (let i = 0; i < this.checkedChannel.length; i++) {
          this.checkedChannelName += this.checkedChannel[i].label;
          this.checkedChannelName += ",";
        }
      } else {
        this.checkedChannelName = "全部";
        if (this.boxType !== "radio") {
          this.channels = [];
          this.getChildren(this.channelInfoList, this.channels);
          this.checkedChannel = this.channels;
        }
      }
      console.log("--------hide-------");
    },
    // 全选的回调
    handleCheckAllChange(val) {
      console.log(val);
      this.checkedChannel = val ? this.channels : [];
      this.isIndeterminate = false;
    },
    // 点击复选框事件
    handleCheckedChange(value, data) {
      console.log(value);
      if (this.boxType === "radio") {
        this.checkedChannel = value;
      } else {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.channels.length;
        this.isIndeterminate =
					checkedCount > 0 && checkedCount < this.channels.length;
      }
    },
    // 点击左边设备树的事件
    handleNodeClick(data, node) {
      console.log(this.treeData);
      if (data) {
        this.channels = [];
        var _this = this;
        _this.getChannelInfoList(_this.channelInfoList, data.id, _this);
        _this.checkedChannel = [];
        _this.checkedChannelName = "";
      }
    },
    // 递归查找被选择的设备节点的通道列表
    getChannelInfoList(data, id, _this) {
      for (var index = 0; index < data.length; index++) {
        if (data[index].id === id) {
          var arr = data[index].children;
          if (!arr) {
            arr = [];
            arr.push(data[index]);
          }
          _this.getChildren(arr, _this.channels);
          break;
        } else {
          if (!data[index].children || data[index].children.length === 0) {
            continue;
          }
          this.getChannelInfoList(data[index].children, id, _this);
        }
      }
    },
    // 获取子节点的叶子
    getChildren(data, arr) {
      if (!data || data.length === 0) {
        return;
      }
      for (let index = 0; index < data.length; index++) {
        if (!data[index].children) {
          arr.push(JSON.parse(JSON.stringify(data[index])));
        } else {
          this.getChildren(data[index].children, arr);
        }
      }
    }
  }
};
// const ArrayObj = [
//   { label: "shanghai", id: "1" },
//   { label: "上海", id: "2" },
//   { label: "北京", id: "3" },
//   { label: "广东方饭店州", id: "4" },
//   { label: "深是分三圳", id: "5" },
//   { label: "武汉", id: "6" },
//   { label: "重庆", id: "7" },
//   { label: "南京", id: "8" },
//   { label: "江苏", id: "9" },
//   { label: "河北", id: "10" },
//   { label: "山东", id: "12" },
//   { label: "青粉色发海", id: "13" },
//   { label: " 安防额", id: "14" },
//   { label: "安徽", id: "15" },
//   { label: "湖北", id: "16" },
//   { label: "湖北", id: "17" },
//   { label: "湖北", id: "18" },
//   {
//     label: "湖北",
//     id: "19"
//   },
//   {
//     label: "湖北",
//     id: "20"
//   },
//   {
//     label: "湖北",
//     id: "21"
//   },
//   {
//     label: "湖北",
//     id: "22"
//   },
//   {
//     label: "湖北",
//     id: "23"
//   }
// ];
</script>
<style>
.checkBoxClass {
	text-align: left;
	margin: 0px 15px;
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #aaaaaa;
	letter-spacing: 0;
	padding: 12px 0px;
}

.popverTreeClass {
	overflow: auto;
}

.popverTreeParent .checkGroupClass {
	text-align: left;
	margin-left: -85px;
	margin-top: 25px;
	width: 100%;
	overflow: auto;
}
.iframeClass {
	position: absolute;
	visibility: inherit;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	border: 0;
	background: transparent;
	filter: "Alpha(style=0,opacity=0)";
}

.popverTreeParent {
	width: 50%;
	height: 100%;
	text-align: center;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	margin: 0px 8px;
	padding-top: 10px;
}
.popverTreeParentBox {
	width: 100%;
	height: 100%;
	display: flex;
	flex-wrap: nowrap;
	justify-content: flex-start;
	background: #202124;
}

.el-checkbox + .el-checkbox {
	margin-left: 15px !important;
}
</style>
