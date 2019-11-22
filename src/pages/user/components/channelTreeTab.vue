<template>
	<el-dialog
		:title="title"
		@close="close"
		:width="width"
		:class="{'dialogCenter':center}"
		:close-on-click-modal="false"
		:append-to-body="true"
		:visible.sync="TreechangeNameDialogVisible"
	>
		<div class="c">
			<el-tree
				:data="data"
				node-key="featureUuid"
				:props="props"
				default-expand-all
				:expand-on-click-node="false"
			>
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<div class="labelName">{{ node.label }}</div>
				</span>
			</el-tree>
		</div>
		<div class="ss">
			<el-button type="primary" class="butttt" @click="close" size="small">取消</el-button>
			<el-button type="primary" class="butttt" @click="confirm" size="small">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import * as api from "@/pages/user/http/ajax.js";
export default {
  name: "TreeChangeNameDialog.vue",
  props: {
    width: {
      type: String,
      default() {
        return "900px";
      }
    },
    title: {
      type: String,
      default() {
        return "功能模块权限";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    roleUuid: {
      type: String,
      default() {
        return "0c691cd5845b4b4a918cc710e10985ea";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      TreechangeNameDialogVisible: false,
      data: [],
      props: {
        label: "nodeName",
        children: "childNodes"
      },
      allData: ["新建", "修改", "删除", "查看", "导入", "导出"],
      checkedNum: [],
      showNum: []
    };
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
    this.name = this.value;
  },
  methods: {
    initData() {
      let d = JSON.parse(JSON.stringify(this.data));
      this.dpTree(d);
      this.data = JSON.parse(JSON.stringify(d));
    },
    handleCheckAllChange(node, data) {},
    traverseUpwrad(node, checkAuth) {},
    dealParentOperator(data, checkAuth) {
      for (let i = 0, len = data.length; i < len; i++) {
        data[i].data.checkAuth = checkAuth;
        data[i].data.checkAll = checkAuth.length === auth.length;
        data[i].data.isIndeterminate =
					checkAuth.length > 0 && checkAuth.length < auth.length;
        if (data[i].childNodes.length) {
          this.dealParentOperator(data[i].childNodes, checkAuth);
        }
      }
    },
    handleCheckedCitiesChange(node, data) {},
    dealParentOperator222(data, name, isAdd) {},
    getDifferent(target, num) {},
    getCheckedNodes(data) {},
    // 循环遍历，判断是否有全选按钮
    dpTree(data) {},
    concat(target, num) {},
    append(data) {},

    remove(node, data) {
      // console.log(node);
    },
    getUuid(auth, chekcedNum) {},
    getAllCheckedLeafUuid(data) {},
    confirm() {},
    close() {},
    getData() {}
  },
  watch: {
    visible(val) {
      if (val) {
        this.name = this.value;
        this.getData();
      }
      this.TreechangeNameDialogVisible = this.visible;
    }
  }
};
</script>
<style lang="scss">
.c {
	.input {
		input {
			height: 30px;
			line-height: 30px;
		}
	}
}
</style>
<style lang="scss" scoped>
.custom-tree-node {
	display: flex;
	.labelName {
		width: 200px;
	}
	.groupButton {
		width: calc(100% - 200px);
	}
}

$labelwidth: 5em;
.ss {
	padding: 15px;
	.butttt {
		float: right;
		margin-right: 30px;
	}
	&::after {
		content: "";
		display: block;
		clear: both;
	}
}
.c {
	overflow: auto;
	max-height: 65vh;
	min-height: 30vh;
	padding: 10px 20px;
	.body {
		max-width: 300px;
		width: 80%;
		margin: 30px auto;
		display: flex;
		flex-wrap: wrap;
		.label {
			width: $labelwidth;
			text-align: right;
			line-height: 30px;
			font-family: "PingFangSC-Regular";
			padding-right: 5px;
			box-sizing: border-box;
			font-size: 13px;
			color: #dddddd;
			text-align: right;
		}
		.input {
			width: calc(100% - #{$labelwidth});
			box-sizing: border-box;
			button {
				height: 30px;
				padding: 7px 21px;
				background: rgba(40, 255, 187, 0.12);
				border: 1px solid rgba(40, 255, 187, 0.8);
				border-radius: 2px;
				border-radius: 2px;
				font-family: "PingFangSC-Regular";
				font-size: 12px;
				color: #ffffff;
				letter-spacing: 0;
			}
		}
	}
}
</style>
