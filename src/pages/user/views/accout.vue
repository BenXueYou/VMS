<template>
  <div class="accout">
    <div class="title"
         v-show="!addDialogVisible">账户管理</div>
    <div class="content"
         v-show="!addDialogVisible">
      <div class="topBox">
        <div class="topBoxLeft">
          <el-button :disabled="!OwnAuthDisabled"
                     type="primary"
                     @click="addBtnAct">新增</el-button>
          <el-button :disabled="!OwnAuthDisabled"
                     type="primary"
                     @click="volumeDelete">删除</el-button>
          <el-button :disabled="!OwnAuthDisabled"
                     type="primary"
                     @click="switchData(1)">启用</el-button>
          <el-button :disabled="!OwnAuthDisabled"
                     type="primary"
                     @click="switchData(0)">禁用</el-button>
          <el-button :disabled="!OwnAuthDisabled"
                     type="primary"
                     @click="resetPassword">密码重置</el-button>
        </div>
        <div class="topBoxRight">
          <span class="tipsTxt">姓名：</span>
          <el-input class="input staffNameInput"
                    v-model="staffName"></el-input>
          <span class="tipsTxt">在线状态：</span>
          <el-select v-model="onlineStatus"
                     placeholder="请选择在线状态">
            <el-option v-for="item in onlineStatusOptions"
                       :key="item.typeStr"
                       :label="item.typeName"
                       :value="item.typeStr"></el-option>
          </el-select>
          <el-button type="primary"
                     :disabled="!ShowAuthDisabled"
                     icon="el-icon-search"
                     @click="queryBtnData">检索</el-button>
        </div>
      </div>
      <el-table ref="loginLogBoxTable"
                :data="tableData"
                tooltip-effect="dark"
                class="tableBoxClass"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55"></el-table-column>
        <el-table-column type="index"
                         :index="tableIndex"
                         label="序号"
                         width="95">
          <!-- <template slot-scope="scope">
						<el-checkbox
							v-model="scope.row.checked"
							@change="selectchange"
						>{{("0"+(parseInt(scope.$index)+1)).slice(-2)}}</el-checkbox>
					</template>-->
        </el-table-column>
        <el-table-column prop="accountName"
                         show-overflow-tooltip
                         label="账户"></el-table-column>
        <el-table-column prop="staffName"
                         show-overflow-tooltip
                         label="姓名"></el-table-column>
        <el-table-column prop="phoneNumber"
                         show-overflow-tooltip
                         label="手机号码"></el-table-column>
        <el-table-column prop="rolesName"
                         show-overflow-tooltip
                         label="角色">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.accountType==='project_admin'">超级管理员</span>
            <span v-if="scope.row.accountType!=='project_admin'">{{scope.row.roles}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="accountCreateTime"
                         label="创建时间"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="loginTimes"
                         label="登陆次数"></el-table-column>
        <el-table-column prop="lastLoginTime"
                         label="最后登录时间"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="onofflineStatus"
                         label="状态">
          <template slot-scope="scope">{{$common.getEnumItemName("onoffline", scope.row.onofflineStatus)}}</template>
        </el-table-column>
        <el-table-column prop="description"
                         label="账号描述"></el-table-column>
        <el-table-column prop="reason"
                         label="操作"
                         width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.accountType!=='project_admin'">
              <el-button :disabled="!OwnAuthDisabled"
                         @click="handleEditClick(scope.row)"
                         type="text"
                         size="small">编辑</el-button>
              <el-button :disabled="!OwnAuthDisabled"
                         @click="editRoleClick(scope.row)"
                         type="text"
                         size="small">分配角色</el-button>
              <el-button :disabled="!OwnAuthDisabled"
                         v-if="scope.row.enable===1"
                         class="onOffBtnClass"
                         @click="forbidBtnClick(scope.row)"
                         type="text"
                         size="small">禁用</el-button>
              <el-button v-if="scope.row.enable===0"
                         class="onOffBtnClass"
                         @click="startBtnClick(scope.row)"
                         type="text"
                         size="small"
                         :disabled="!OwnAuthDisabled">启用</el-button>
              <el-button :disabled="!OwnAuthDisabled"
                         class="deleteBtnClass"
                         @click="deleteBtnClick(scope.row)"
                         type="text"
                         size="small">删除</el-button>
            </div>
            <div v-if="scope.row.accountType==='project_admin'">
              <el-button :disabled="!OwnAuthDisabled"
                         @click="handleEditClick(scope.row)"
                         type="text"
                         size="small">编辑</el-button>
              <el-button :disabled="!OwnAuthDisabled"
                         type="text"
                         size="small"></el-button>
              <el-button :disabled="!OwnAuthDisabled"
                         type="text"
                         size="small"></el-button>
              <el-button :disabled="!OwnAuthDisabled"
                         class="onOffBtnClass"
                         type="text"
                         size="small"></el-button>
              <el-button :disabled="!OwnAuthDisabled"
                         class="deleteBtnClass"
                         type="text"
                         size="small"></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!----------------------------------表格分页器---------------------------------->
      <div class="footer">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       layout="total,prev, pager, next,jumper"
                       :page-size="pageSize"
                       :total="total"
                       background></el-pagination>
      </div>
    </div>
    <account-add v-show="addDialogVisible"
                 :addDialogVisible="addDialogVisible"
                 :checkedRoles="defaultRoleData"
                 :showTreeAddRole="showTreeAdd"
                 @close="close"
                 :rowData.sync="rowData"
                 @addRole="addRoleClick" />
    <tree-panel-dialog :treeData="roleDataList"
                       :initSelectData="defaultRoleData"
                       :props="defaultProps"
                       placeholder="请输入搜索的角色"
                       :isShow.sync="showTreeAdd"
                       title="分配角色"
                       checkedText="已分配的角色"
                       @onConfirm="getCheckedRole"
                       @onCancel="showTreeAdd=false"></tree-panel-dialog>
    <reset-password :visible.sync="resetPasswordVisible"
                    @confirm="resetPWD"></reset-password>
    <confirm-dialog :visible.sync="isConfirm"
                    title="提示"
                    confirmText="是否删除账号"
                    @confirm="deleteData"></confirm-dialog>
  </div>
</template>
<script>
import AccountAdd from "../components/accountAdd.vue";
import treePanelDialog from "@/pages/user/components/treePanelDialog";
import * as api from "../http/ajax";
import resetPassword from "@/pages/user/components/resetPassword";
import ConfirmDialog from "@/common/ConfirmDialog";
// import RestApi from "@/utils/RestApi";
export default {
  name: "accout",
  components: { AccountAdd, treePanelDialog, resetPassword, ConfirmDialog },
  activated() {
    this.initData();
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("账号管理", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("账号管理", "isOwn");
    // this.initData();
    this.onlineStatusOptions = this.$common.getEnumByGroupStr("onoffline");
    this.onlineStatusOptions.unshift({ typeName: "全部", typeStr: null });
    console.log("onlineStatusOptions==", this.onlineStatusOptions);
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
      partUuids: [],
      adminUuids: [],
      roleDataList: [],
      defaultRoleData: [],
      defaultProps: {
        label: "roleName",
        id: "roleUuid"
      },
      checkedRoleList: [],
      rowData: {},
      accountUuid: "",
      isAddRole: "",
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  watch: {},
  methods: {
    queryBtnData() {
      this.currentPage = 1;
      this.initData();
    },
    addBtnAct() {
      this.isAddRole = "add";
      this.defaultRoleData = [];
      this.rowData = {};
      this.addDialogVisible = !this.addDialogVisible;
    },
    // 选择角色弹窗的回调
    getCheckedRole(arr) {
      console.log(arr);
      this.defaultRoleData = arr;
      // this.rowData.roles = arr;
      if (this.isAddRole === "edit") {
        this.$set(this.rowData, "roles", arr);
        this.editAccountRoleApi();
      } else if (this.isAddRole === "add") {
        this.$set(this.rowData, "roles", arr);
        console.log("defaultRoleData==", this.defaultRoleData);
        this.showTreeAdd = false;
      } else if (this.isAddRole === "editRole") {
        this.editAccountRoleApi();
      }
    },
    // 账号分配角色
    editAccountRoleApi() {
      this.isAddRole = "edit";
      let data = {
        accountUuid: this.accountUuid, // 账号uuid
        roleUuids: this.defaultRoleData.map((v, k) => {
          return v.roleUuid;
        })
      };
      console.log("data==", this.rowData);
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
      if (!this.ShowAuthDisabled) return;
      this.tableData = [];
      let data = {
        staffName: this.staffName,
        onlineStatus: this.onlineStatus,
        page: this.currentPage,
        limit: this.pageSize
      };
      api
        .getAccountListApi(data)
        .then(res => {
          this.total = 0;
          if (res.data.success) {
            let list = res.data.data.list;
            //    <template slot-scope="scope">
            //   <span v-if="scope.row.accountType==='project_admin'">超级管理员</span>
            //   <span v-if="scope.row.accountType!=='project_admin'">{{scope.row.roles}}</span>
            // </template>
            for (let i = 0, len = list.length; i < len; i++) {
              list[i].rolesName =
                list[i].accountType === "project_admin"
                  ? "超级管理员"
                  : list[i].roles;
            }
            this.tableData = list;
            this.total = res.data.data.total;
          }
        })
        .catch(() => {
          this.total = 0;
        });
    },
    // 编辑
    handleEditClick(rowData) {
      this.rowData = rowData;
      this.getAccountDetail(rowData);
    },
    // 修改角色
    editRoleClick(rowData) {
      this.isAddRole = "editRole";
      this.defaultRoleData = [];
      this.accountUuid = rowData.accountUuid;
      this.rowData = rowData;
      this.getRoleList();
      // this.getRoleDetail(rowData);
      // this.$set(this.rowData, 'roles', this.defaultRoleData);
      console.log("editRole,rowData===", rowData);
    },
    // 账号编辑
    addRoleClick(rowData) {
      console.log("rowData===", rowData);
      // debugger
      // if (rowData && this.rowData.accountUuid) {
      //   this.rowData = rowData;
      //   // 查详情
      //   this.getAccountDetail(rowData);
      // } else {
      //   this.defaultRoleData = [];
      //   this.rowData = {};
      // }
      this.defaultRoleData = rowData.roles;
      this.$set(this.rowData, "roles", this.defaultRoleData);
      this.getRoleList();
    },
    // 查详情
    getAccountDetail(data) {
      if (data.accountNames) {}
      api
        .getAccountDetail(data)
        .then(res => {
          if (res.data.success) {
            this.addDialogVisible = !this.addDialogVisible;
            this.rowData = res.data.data;
            // if (this.rowData.invalidTime === "long") {
            //   this.rowData.isLongTIme = 1;
            // } else {
            //   this.rowData.isLongTIme = 0;
            // }
            this.defaultRoleData = this.rowData.roles;
            // this.rowData.password = "********";
            console.log("rowData==详情=", this.rowData);
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(() => {});
    },
    // 查看角色详情
    getRoleDetail(data) {
      api
        .getAccountDetail(data)
        .then(res => {
          if (res.data.success) {
            this.rowData = res.data.data;
            this.defaultRoleData = this.rowData.roles;
            this.$set(this.rowData, "roles", this.defaultRoleData);
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(() => {});
    },
    // 获取分配角色弹窗内树列表数据
    getRoleList() {
      api
        .getRoleList({
          limt: 10000000, // 不分页
          page: 1
        })
        .then(res => {
          if (res.data.success) {
            this.showTreeAdd = !this.showTreeAdd;
            if (this.isAddRole === 'editRole') {
              this.getRoleDetail(this.rowData);
            }
            let data = res.data.data || {};
            this.roleDataList = data.list || [];
          }
        });
    },
    // 重置密码
    resetPWD(data) {
      console.log(data);
      console.log(this.accountNames);
      console.log(this.$store.state.home.account);
      console.log(this.accountNames.indexOf(this.$store.state.home.account));
      if (!this.accountNames) {
        this.$message.warning("请选择重置密码的账户");
        return;
      }
      api
        .resetAccountPWDApi({
          accountNames: this.accountNames,
          password: data // 密码
        })
        .then(res => {
          if (res.data.success) {
            this.$message({ type: "success", message: res.data.msg });
            if (
              this.accountNames.indexOf(this.$store.state.home.account) !== -1
            ) {
              // this.$store.dispatch("setAuthorization", "");
              this.$store.dispatch("setProjectUuid", "");
              this.$store.dispatch("setTagViewArr", []);
              this.$store.dispatch("setLocalTag", "Home");
              sessionStorage.setItem("iccSignalRule", "");
              sessionStorage.setItem("iccMediaRule", "");
              this.$router.push({
                name: "Login"
              });
            }
          }
        })
        .catch(() => {});
    },
    // 禁用
    forbidBtnClick(rowData) {
      this.accountUuids = [rowData.accountUuid];
      this.switchData(0);
    },
    // 启用
    startBtnClick(rowData) {
      this.accountUuids = [rowData.accountUuid];
      this.switchData(1);
    },
    resetPassword() {
      if (!this.accountNames.length) {
        this.$message.warning("请选择账号！");
        return;
      }
      this.resetPasswordVisible = true;
    },
    switchData(enable) {
      if (!this.accountUuids.length) {
        if (this.accountNames.length) {
          this.$message.warning("超级管理员没有权限");
          return;
        } else {
          this.$message.warning("请选择账号！");
          return;
        }
      } else {
        if (this.adminUuids.length) {
          this.$message.warning("勾选之中的超级管理员没有权限");
          return;
        }
      }
      api
        .switchAccountApi({
          accountUuids: this.accountUuids,
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
      if (this.adminUuids.length) {
        this.$message.warning("勾选之中的超级管理员没有权限");
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
      if (!this.accountUuids.length) {
        if (this.accountNames.length) {
          this.$message.warning("超级管理员没有权限");
          return;
        } else {
          this.$message.warning("请选择账号！");
          return;
        }
      } else {
        if (this.adminUuids.length) {
          this.$message.warning("勾选账号中包括管理员账号没有权限");
          return;
        }
      }
      api
        .deleteAccountApi({ accountUuids: this.accountUuids })
        .then(res => {
          if (res.data.success) {
            this.$message({ type: "success", message: res.data.msg });
            this.currentPage = 1;
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
      this.adminUuids = [];
      selection.forEach(item => {
        console.log("item==", item);
        if (item.accountType === "project_admin") {
          this.adminUuids.push(item.accountUuid);
        } else {
          this.accountUuids.push(item.accountUuid);
        }
        this.accountNames.push(item.accountName);
      });
      console.log("accountUuids==", this.accountUuids);
    },
    handleSizeChange() {},
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initData();
    },
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
<style>
.accout .el-button--small {
    font-size: 13px!important;
}
</style>
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
