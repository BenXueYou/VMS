<template>
	<div class="role">
		<div class="table" v-show="!isShowEdit">
			<div class="title">角色管理</div>

			<div class="content">
				<div class="roleHeader">
					<el-button :disabled="!OwnAuthDisabled" type="primary" @click="add" size="small">新增</el-button>
					<el-button :disabled="!OwnAuthDisabled" type="primary" @click="deletea" size="small">刪除</el-button>
					<el-button :disabled="!OwnAuthDisabled" type="primary" @click="enable(1)" size="small">启用</el-button>
					<el-button :disabled="!OwnAuthDisabled" type="primary" @click="enable(0)" size="small">禁用</el-button>
					<!-- <el-button type="primary"
                     @click="resetPassword"
					size="small">密码重置</el-button>-->

					<div style="float:right;">
						<label>角色名称：</label>
						<el-input style="width:130px;" v-model="roleName"></el-input>
						<el-button :disabled="!ShowAuthDisabled" type="primary" @click="serach" size="small">检索</el-button>
					</div>
				</div>
				<div class="tableWarp">
					<el-table
						ref="multipleTable"
						:data="tableData"
						tooltip-effect="dark"
						style="width: 100%"
						@selection-change="handleSelectionChange"
					>
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column label="角色名称" show-overflow-tooltip prop="roleName" width="120"></el-table-column>
						<el-table-column prop="roleStatus" label="状态" width="120"></el-table-column>
						<el-table-column prop="invalidTime" label="过期时间" show-overflow-tooltip>
							<template slot-scope="scope">
								<!--   <span>{{scope.row.invalidTime}}</span> -->
								<span v-if="scope.row.invalidTime==='long'">永久</span>
								<span v-if="scope.row.invalidTime!=='long'">{{scope.row.invalidTime}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="createAccountName" label="创建账号" show-overflow-tooltip></el-table-column>
						<el-table-column prop="roleCreateTime" label="创建时间" show-overflow-tooltip></el-table-column>
						<el-table-column prop="description" label="角色描述" show-overflow-tooltip></el-table-column>
						<el-table-column label="操作" width="200" show-overflow-tooltip>
							<template slot-scope="scope">
								<el-button :disabled="!OwnAuthDisabled" type="text" @click="edit(scope.row)" size="small">编辑</el-button>
								<el-button
									:disabled="!OwnAuthDisabled"
									type="text"
									@click="ditribute(scope.row)"
									size="small"
								>分配账号</el-button>
								<el-button
									:disabled="!OwnAuthDisabled"
									type="text"
									v-if="scope.row.enable===1"
									@click="enableRow(scope.row,0)"
									style="color:#FFBA22;"
									size="small"
								>禁用</el-button>
								<el-button
									:disabled="!OwnAuthDisabled"
									type="text"
									v-if="scope.row.enable===0"
									@click="enableRow(scope.row,1)"
									style="color:#FFBA22;"
									size="small"
								>启用</el-button>
								<el-button
									:disabled="!OwnAuthDisabled"
									type="text"
									@click="deleteRow(scope.row)"
									style="color: #FF5F5F;"
									size="small"
								>删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="fenye">
					<el-pagination
						@current-change="handleCurrentChange"
						:current-page="pageNow"
						:page-size="pageSize"
						background
						class="pagination"
						layout="total, prev, pager, next, jumper"
						:total="dataTotal"
					></el-pagination>
				</div>
			</div>
		</div>
		<role-add
			class="editDiv"
			:roleUuid.sync="roleUuid"
			:visible.sync="isShowEdit"
			@close="close"
			v-show="isShowEdit"
		></role-add>
		<reset-password :visible.sync="resetPasswordVisible"></reset-password>
		<confirm-dialog
			:visible.sync="isConfirm"
			title="提示"
			confirmText="是否删除角色"
			@confirm="confirmDelete"
		></confirm-dialog>
		<tree-panel-dialog
			:isShow.sync="showtreeadad"
			:treeData="treeList"
			:initSelectData="initSelectData"
			:itemicon="require('@/assets/images/person_g.png')"
			:props="treeProps"
			@onConfirm="distur"
			title="分配账号"
			checkedText="已分配的账号"
			placeholder="搜索账号名或姓名"
		></tree-panel-dialog>
	</div>
</template>

<script>
import * as api from "@/pages/user/http/ajax.js";
import treePanelDialog from "@/pages/user/components/treePanelDialog";
import ConfirmDialog from "@/common/ConfirmDialog";
import roleAdd from "@/pages/user/views/roleAdd";
import resetPassword from "@/pages/user/components/resetPassword";
export default {
  name: "role",
  components: {
    roleAdd,
    resetPassword,
    ConfirmDialog,
    treePanelDialog
  },
  data() {
    return {
      treeData: Array.from({ length: 0 }, (v, i) => ({
        treeId: i + 1,
        treeName: "测试数据" + (i + 1)
      })),
      treeProps: { id: "accountUuid", label: "accountName" },
      pageNow: 1,
      pageSize: 13,
      dataTotal: 0,
      roleName: "",
      roleUuid: "",
      visible: false,
      isConfirm: false,
      showtreeadad: false,
      deleteData: [],
      resetPasswordVisible: false,
      isShowEdit: false,
      tableData: [],
      multipleSelection: [],
      initSelectData: [
        {
          treeName: "测试数据1",
          treeId: 1
        }
      ],
      treeList: [
        {
          treeName: "测试数据1",
          treeId: 1
        },
        {
          treeName: "测试数据2",
          treeId: 2
        },
        {
          treeName: "测试数据3",
          treeId: 3
        }
      ],
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("角色管理", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("角色管理", "isOwn");
    this.getData();
  },
  methods: {
    handleCurrentChange(val) {
      this.pageNow = val;
      this.getData();
    },
    handleSelectionChange(val) {
      // 获取选中的table数据的事件回调
      this.multipleSelection = val;
    },
    add() {
      this.roleUuid = "";
      this.isShowEdit = true;
    },
    deletea() {
      // 判断有没有选中的
      if (!this.multipleSelection.length) {
        this.$message.error("请选中要删除的数据！");
        return;
      }
      this.deleteUser(
        this.multipleSelection.map(i => {
          return i.roleUuid;
        })
      );
    },
    enable(enable) {
      // 判断有没有选中的
      if (!this.multipleSelection.length) {
        this.$message.error(`请选中要${enable ? "启用" : "禁用"}的数据！`);
        return;
      }
      this.updateRoleStatus({
        roleUuids: this.multipleSelection.map(i => {
          return i.roleUuid;
        }),
        enable
      });
    },
    disabled() {},
    resetPassword() {
      // 这里不知道要不要判断多账号的问题
      this.resetPasswordVisible = true;
    },
    edit(row) {
      console.log(row);
      this.roleUuid = row.roleUuid;
      this.isShowEdit = true;
    },
    getAllData() {
      return new Promise((resolve, reject) => {
        console.log(api);
        api
          .getAccountListApi({
            limit: 12345679,
            page: 1,
            roleName: ""
          })
          .then(res => {
            if (res.data.success) {
              let data = res.data.data || {};
              resolve(data.list || []);
            }
          })
          .catch(() => {
            resolve([]);
          });
      });
    },
    getHadAccout(roleUuid) {
      return new Promise((resolve, reject) => {
        api
          .getRoleDetail({ roleUuid: roleUuid })
          .then(res => {
            if (res.data.success) {
              let data = res.data.data || {};
              resolve(data.account || []);
            }
          })
          .catch(() => {
            resolve([]);
          });
      });
    },
    async ditribute(row) {
      this.treeList = await this.getAllData();
      this.roleUuid = row.roleUuid;
      this.initSelectData = await this.getHadAccout(row.roleUuid);
      this.showtreeadad = true;
    },
    distur(data) {
      // 选择好分配账号的回调函数
      let formdata = {
        roleUuid: this.roleUuid, // 角色uuid
        accountUuids: data.map(i => i.accountUuid)
      };
      api.distruiAccout(formdata).then(res => {
        if (res.data.success) {
          this.$messge.success("分配账号成功！");
        }
      });
    },
    enableRow(row, enable) {
      this.updateRoleStatus({
        roleUuids: [row.roleUuid],
        enable: enable
      });
    },
    deleteRow(row) {
      this.deleteUser([row.roleUuid]);
      // let param = {
      //   roleUuids: [row.roleUuid]
      // };
      // api.deleteRole(param).then(res => {
      //   if (res.data.success) {
      //     this.$message.success("删除成功！");
      //     this.getData();
      //   }
      // });
    },
    serach() {
      this.pageNow = 1;
      this.getData();
    },
    getData() {
      if (!this.ShowAuthDisabled) return;
      this.tableData = [];
      api
        .getRoleList({
          limit: this.pageSize,
          page: this.pageNow,
          roleName: this.roleName || undefined
        })
        .then(res => {
          if (res.data.success) {
            let data = res.data.data || {};
            this.dataTotal = data.total || 0;
            this.tableData = data.list || [];
          }
        });
    },
    confirmDelete() {
      let param = {
        roleUuids: this.deleteData
      };
      api.deleteRole(param).then(res => {
        if (res.data.success) {
          this.$message.success("删除成功！");
          this.getData();
        }
      });
    },
    deleteUser(data) {
      this.deleteData = data;
      this.isConfirm = true;
    },
    updateRoleStatus(data) {
      api.updateRoleStatus(data).then(res => {
        if (res.data.success) {
          this.$message.success("修改成功！");
          this.getData();
        }
      });
    },
    close(is) {
      this.isShowEdit = false;
      this.getData();
      // this.addDialogVisible = !this.addDialogVisible;
      // if (is) {
      //   this.initData();
      // }
    }
  }
};
</script>
<style>
.role .el-button--small {
    font-size: 13px!important;
}
</style>
<style lang="scss" scoped>
@import "@/style/variables.scss";
.role {
	height: 100%;
	.table {
		height: 100%;
	}
	.editDiv {
		height: 100%;
		background: #212325;
	}
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
		.roleHeader {
			padding: 25px 40px;
		}
	}
}
.tableWarp {
	height: calc(100% - 140px);
	padding: 0px 40px;
	box-sizing: border-box;
	overflow: auto;
}
.fenye {
	margin-top: 10px;
	padding: 0px 40px;
	box-sizing: border-box;
	span {
		@include font-s;
		float: right;
	}
	.pagination {
		float: right;
	}
}
</style>
