<template>
	<div class="accout">
		<div class="title" v-show="!addDialogVisible">账户管理</div>
		<div class="content" v-show="!addDialogVisible">
			<div class="topBox">
				<div class="topBoxLeft">
					<el-button @click="addDialogVisible=!addDialogVisible">新增</el-button>
					<el-button>删除</el-button>
					<el-button>启用</el-button>
					<el-button>禁用</el-button>
					<el-button>密码重置</el-button>
				</div>
				<div class="topBoxRight">
					<span class="tipsTxt">姓名：</span>
					<el-input class="input staffNameInput" v-model="staffName"></el-input>
					<span class="tipsTxt">在线状态：</span>
					<el-select v-model="onlineStatus" placeholder="请选择在线状态">
						<el-option
							v-for="item in onlineStatusOptions"
							:key="item.typeStr"
							:label="item.typeName"
							:value="item.typeStr"
						></el-option>
					</el-select>
					<el-button icon="el-icon-search">检索</el-button>
				</div>
			</div>
			<el-table
				ref="loginLogBoxTable"
				:data="tableData"
				tooltip-effect="dark"
				class="tableBoxClass"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="index" :index="tableIndex" label="序号" width="95">
					<template slot-scope="scope">{{("0"+(parseInt(scope.$index)+1)).slice(-2)}}</template>
				</el-table-column>
				<el-table-column prop="accountName" label="账户" width="120"></el-table-column>
				<el-table-column prop="staffName" label="姓名" width="120"></el-table-column>
				<el-table-column prop="phoneNumber" label="手机号码" width="120"></el-table-column>
				<el-table-column prop="roles" label="角色" width="120"></el-table-column>
				<el-table-column prop="accountCreateTime" label="创建时间" width="120"></el-table-column>
				<el-table-column prop="loginTimes" label="登陆次数" width="120"></el-table-column>
				<el-table-column prop="lastLoginTime" label="最后登录时间" width="120"></el-table-column>
				<el-table-column prop="onofflineStatus" label="状态" width="128">
					<template slot-scope="scope">{{$common.getEnumItemName("gender", scope.row.onofflineStatus)}}</template>
				</el-table-column>
				<el-table-column prop="description" label="账号描述"></el-table-column>
				<el-table-column prop="reason" label="操作">
					<template slot-scope="scope">
						<el-button @click="handleEditClick(scope.row)" type="text" size="small">编辑</el-button>
						<el-button @click="addRoleClick(scope.row)" type="text" size="small">分配角色</el-button>
						<el-button @click="forbidBtnClick(scope.row)" type="text" size="small">禁用</el-button>
						<el-button @click="deleteBtnClick(scope.row)" type="text" size="small">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!----------------------------------表格分页器---------------------------------->
			<div class="footer">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					layout="total,prev, pager, next,jumper"
					:page-size="pageSize"
					:total="total"
					background
				></el-pagination>
			</div>
		</div>
		<account-add v-show="addDialogVisible" @close="close" @addRole="addRoleClick" />
		<tree-panel-dialog :isShow.sync="showTreeAdd"></tree-panel-dialog>
	</div>
</template>
<script>
import AccountAdd from "../components/accountAdd.vue";
import treePanelDialog from "@/pages/user/components/treePanelDialog";
export default {
  name: "accout",
  components: { AccountAdd, treePanelDialog },
  mounted() {},
  data() {
    return {
      showTreeAdd: false,
      tableData: [],
      currentPage: 1,
      pageSize: 13,
      total: 0,
      staffName: null,
      onlineStatus: null,
      onlineStatusOptions: [],
      addDialogVisible: false
    };
  },
  watch: {},
  methods: {
    // 编辑
    handleEditClick() {},
    // 分配角色
    addRoleClick() {
      this.showTreeAdd = !this.showTreeAdd;
    },
    // 禁用
    forbidBtnClick() {},
    // 删除
    deleteBtnClick() {},
    // 表格选择row
    handleSelectionChange() {},
    handleCurrentChange() {},
    handleSizeChange() {},
    close() {
      this.addDialogVisible = !this.addDialogVisible;
    },
    tableIndex(val) {
      val += 1;
      return val < 10 ? "0" + val : val;
    }
  }
};
</script>
<style lang="scss" scoped>
.accout {
	height: 100%;
	.title {
		position: relative;
		height: 60px;
		line-height: 60px;
		padding-left: 60px;
		background: #212325;
		&::after {
			content: "";
			width: 3px;
			height: 14px;
			position: absolute;
			top: 23px;
			left: 40px;
			background: #26d39d;
		}
	}
	.content {
		height: calc(100% - 80px);
		margin-top: 20px;
		background: #212325;
		padding: 20px 40px 0;
		box-sizing: border-box;
		.topBox {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20px;
			font-family: "PingFangSC-Regular";
			font-size: 13px;
			color: #ffffff;
			.topBoxLeft {
				width: 450px;
				.el-button {
					background: rgba(40, 255, 187, 0.08);
					border: 1px solid rgba(38, 211, 157, 0.64);
					border-radius: 2px;
					height: 32px;
					line-height: 32px;
					padding: 0 5%;
					font-family: "PingFangSC-Regular";
					font-size: 13px;
					color: #ffffff;
					text-align: justify;
				}
			}
			.topBoxRight {
				width: 550px;
				.staffNameInput {
					margin-right: 30px;
				}
				.el-select {
					margin-right: 15px;
				}
				.el-select,
				.staffNameInput {
					width: 140px;
				}
				.el-button {
					background: rgba(40, 255, 187, 0.08);
					border: 1px solid rgba(38, 211, 157, 0.64);
					border-radius: 2px;
					height: 32px;
					line-height: 32px;
					padding: 0 3%;
					font-family: "PingFangSC-Regular";
					font-size: 13px;
					color: #ffffff;
					text-align: justify;
				}
			}
		}
		.tableBoxClass {
			height: calc(100% - 100px);
		}
		.footer {
			text-align: right;
		}
	}
}
</style>
