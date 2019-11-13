<template>
	<div class="accout">
		<div class="title" v-show="!addDialogVisible">账户管理</div>
		<div class="content" v-show="!addDialogVisible">
			<div class="topBox">
				<div class="topBoxLeft">
					<el-button @click="addBtnAct">新增</el-button>
					<el-button @click="volumeDelete">删除</el-button>
					<el-button @click="switchData(1)">启用</el-button>
					<el-button @click="switchData(0)">禁用</el-button>
					<el-button @click="resetPasswordVisible=true">密码重置</el-button>
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
					<el-button icon="el-icon-search" @click="initData">检索</el-button>
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
					<template slot-scope="scope">
						<el-checkbox
							v-model="scope.row.checked"
							@change="selectchange"
						>{{("0"+(parseInt(scope.$index)+1)).slice(-2)}}</el-checkbox>
					</template>
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
						<el-button
							@click="addRoleClick(scope.row)"
							v-loading="showTreeAdd"
							type="text"
							size="small"
						>分配角色</el-button>
						<el-button
							class="onOffBtnClass"
							@click="forbidBtnClick(scope.row)"
							type="text"
							size="small"
						>禁用</el-button>
						<el-button
							class="deleteBtnClass"
							@click="deleteBtnClick(scope.row)"
							type="text"
							size="small"
						>删除</el-button>
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
		<account-add
			v-show="addDialogVisible"
			:checkedRoles="defaultRoleData"
			@close="close"
			:rowData="rowData"
			@addRole="addRoleClick"
		/>
		<tree-panel-dialog
			:treeData="roleDataList"
			:initSelectData="defaultRoleData"
			:props="defaultProps"
			placeholder="请输入搜索的角色"
			:isShow.sync="showTreeAdd"
			title="分配角色"
			checkedText="已分配的角色"
			@onConfirm="getCheckedRole"
			@onCancel="showTreeAdd=false"
		></tree-panel-dialog>
		<reset-password :visible.sync="resetPasswordVisible" @confirm="resetPWD"></reset-password>
		<confirm-dialog :visible.sync="isConfirm" title="提示" confirmText="是否删除账号" @confirm="deleteData"></confirm-dialog>
	</div>
</template>
<script>
import AccountAdd from "../components/accountAdd.vue";
import treePanelDialog from "@/pages/user/components/treePanelDialog";
import * as api from "../http/ajax";
import resetPassword from "@/pages/user/components/resetPassword";
import ConfirmDialog from "@/common/ConfirmDialog";
export default {
  name: "accout",
  components: { AccountAdd, treePanelDialog, resetPassword, ConfirmDialog },
  mounted() {
    this.initData();
  },
  data() {
    return {
      isConfirm: false,
      resetPasswordVisible: false,
      showTreeAdd: false,
      tableData: [],
      currentPage: 1,
      pageSize: 13,
      total: 0,
      staffName: null,
      onlineStatus: null,
      onlineStatusOptions: [],
      addDialogVisible: false,
      accountUuids: [],
      accountNames: [],
      roleDataList: [],
      defaultRoleData: [],
      defaultProps: {
        label: "roleName",
        id: "roleUuid"
      },
      checkedRoleList: [],
      rowData: {}
    };
  },
  watch: {},
  methods: {
    addBtnAct() {
      this.defaultRoleData = [];
      this.rowData = {};
      this.addDialogVisible = !this.addDialogVisible;
    },
    // 选择角色弹窗的回调
    getCheckedRole(arr) {
      console.log(arr);
      this.defaultRoleData = arr;
      this.rowData.roles = arr;
      this.editAccountRoleApi();
    },
    // 账号分配角色
    editAccountRoleApi() {
      let data = {
        accountUuid: this.rowData.accountUuid, // 账号uuid
        roleUuids: this.defaultRoleData.map((v, k) => {
          return v.roleUuid;
        })
      };
      api
        .parcelRoleAccountApi(data)
        .then(res => {
          if (res.data.success) {
            this.$message.success(res.data.msg);
            this.initData();
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(() => {});
    },
    selectchange(val) {
      console.log(val);
    },
    initData() {
      let data = {
        staffName: this.staffName,
        onlineStatus: this.onlineStatus,
        page: this.currentPage,
        limit: this.pageSize
      };
      api
        .getAccountListApi(data)
        .then(res => {
          if (res.data.success) {
            this.tableData = res.data.data.list;
            this.total = res.data.data.total;
          }
        })
        .catch(() => {});
    },
    // 编辑
    handleEditClick(rowData) {
      this.rowData = rowData;
      this.getAccountDetail(rowData);
    },
    // 分配角色
    addRoleClick(rowData) {
      if (rowData && this.rowData.accountUuid) {
        this.rowData = rowData;
        // 查详情
        this.getAccountDetail(rowData);
      } else {
        this.defaultRoleData = [];
        this.rowData = {};
      }
      this.getRoleList();
    },
    // 查详情
    getAccountDetail(data) {
      api
        .getAccountDetail(data)
        .then(res => {
          if (res.data.success) {
            this.addDialogVisible = !this.addDialogVisible;
            this.rowData = res.data.data;
            this.defaultRoleData = this.rowData.roles;
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(() => {});
    },
    // 获取分配角色弹窗内树列表数据
    getRoleList() {
      api
        .getUserList({
          limt: 10000000, // 不分页
          page: 1
        })
        .then(res => {
          if (res.data.success) {
            this.showTreeAdd = !this.showTreeAdd;
            let data = res.data.data || {};
            this.roleDataList = data.list || [];
          }
        });
    },
    // 重置密码
    resetPWD(data) {
      console.log(data);
      if (!this.accountNames) {
        this.$message.warning("请选择重置密码的账户");
        return;
      }
      api
        .resetAccountPWDApi({
          accountNames: this.accountNames.toString(),
          password: data // 密码
        })
        .then(res => {
          if (res.data.success) {
            this.$message({ type: "success", message: res.data.msg });
          }
        })
        .catch(() => {});
    },
    // 禁用
    forbidBtnClick(rowData) {
      this.accountUuids = [rowData.accountUuid];
      this.switchData(0);
    },
    switchData(enable) {
      if (!this.accountUuids.length) {
        this.$message.warning("请选择账号！");
        return;
      }
      api
        .switchAccountApi({
          accountUuids: this.accountUuids.toString(),
          enable: enable
        })
        .then(res => {
          if (res.data.success) {
            this.$message({ type: "success", message: res.data.msg });
            this.initData();
          } else {
            this.$message({ type: "warning", message: res.data.msg });
          }
        })
        .catch(() => {});
    },
    // 批量删除
    volumeDelete() {
      if (this.accountUuids && !this.accountUuids.length) {
        this.$message({ type: "warning", message: "请选择删除的账号" });
        return;
      }
      this.isConfirm = !this.isConfirm;
    },
    // 删除
    deleteBtnClick(rowData) {
      this.accountUuids = [rowData.accountUuid];
      this.isConfirm = !this.isConfirm;
    },
    deleteData() {
      api
        .deleteAccountApi({ accountUuids: this.accountUuids })
        .then(res => {
          if (res.data.success) {
            this.$message({ type: "success", message: res.data.msg });
            this.initData();
          } else {
            this.$message({ type: "warning", message: res.data.msg });
          }
        })
        .catch(() => {});
    },
    // 表格选择row
    handleSelectionChange(selection) {
      this.accountUuids = [];
      this.accountNames = [];
      selection.forEach(item => {
        this.accountUuids.push(item.accountUuid);
        this.accountNames.push(item.accountName);
      });
    },
    handleCurrentChange() {},
    handleSizeChange() {},
    close(is) {
      this.addDialogVisible = !this.addDialogVisible;
      if (is) {
        this.initData();
      }
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
			overflow: auto;
			.onOffBtnClass {
				font-family: "PingFangSC-Regular";
				font-size: 13px;
				color: #ffba22;
			}
			.deleteBtnClass {
				font-family: "PingFangSC-Regular";
				font-size: 13px;
				color: #ff5f5f;
			}
		}
		.footer {
			text-align: right;
		}
	}
}
</style>
