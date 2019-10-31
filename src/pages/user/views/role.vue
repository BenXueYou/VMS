<template>
  <div class='role'>
    <div class='table'
         v-show="!isShowEdit">
      <div class="title">
        账户管理
      </div>

      <div class="content">
        <div class='roleHeader'>
          <el-button type="primary"
                     @click="add"
                     size="small">新增</el-button>
          <el-button type="primary"
                     @click="deletea"
                     size="small">刪除</el-button>
          <el-button type="primary"
                     @click="enable"
                     size="small">启用</el-button>
          <el-button type="primary"
                     @click="disabled"
                     size="small">禁用</el-button>
          <el-button type="primary"
                     @click="resetPassword"
                     size="small">密码重置</el-button>

          <div style="float:right;">
            <label>角色名称：</label>
            <el-input style="width:130px;"
                      v-model="roleName"></el-input>
            <el-button type="primary"
                       size="small">检索</el-button>
          </div>
        </div>
        <div class="tableWarp">
          <el-table ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column label="角色名称"
                             prop="roleName"
                             width="120">

            </el-table-column>
            <el-table-column prop="roleStatus"
                             label="状态"
                             width="120">
            </el-table-column>
            <el-table-column prop="invalidTime"
                             label="过期时间"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="createAccountName"
                             label="创建账号"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="roleCreateTime"
                             label="创建时间"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="description"
                             label="角色描述"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作"
                             width="200"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text"
                           @click="edit(scope.roe)"
                           size="small">编辑</el-button>
                <el-button type="text"
                           @click="ditribute(scope.roe)"
                           size="small">分配账号</el-button>
                <el-button type="text"
                           @click="enableRow(scope.roe)"
                           style='color:#FFBA22;'
                           size="small">禁用</el-button>
                <el-button type="text"
                           @click="deleteRow(scope.roe)"
                           style='color: #FF5F5F;'
                           size="small">剔除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="fenye">
          <el-pagination @current-change="handleCurrentChange"
                         :current-page.sync="pageNow"
                         :page-size="pageSize"
                         background
                         class="pagination"
                         layout="total, prev, pager, next, jumper"
                         :total="dataTotal">
          </el-pagination>
        </div>
      </div>
    </div>
    <accout-add class='editDiv'
                v-show="isShowEdit">

    </accout-add>
    <auth-tree :visible.sync="
                visible">

    </auth-tree>
  </div>
</template>

<script>
import authTree from "@/pages/user/components/authTree";
import accoutAdd from "@/pages/user/views/accoutAdd";
export default {
  name: "role",
  components: {
    accoutAdd,
    authTree
  },
  data() {
    return {
      pageNow: 1,
      pageSize: 11,
      dataTotal: 100,
      roleName: "",
      visible: false,
      isShowEdit: true,
      tableData: Array(11).fill({
        roleUuid: "string", // 角色uuid
        roleName: "string", // 角色名称
        roleStatus: "String", // 角色状态
        invalidTime: "string", // 过期时间
        createAccountName: "",
        // 创建账号
        roleCreateTime: "string",
        // 角色创建时间
        description: "string", // 角色描述
        enable: 1 // 0禁用、1启用
      })
    };
  },
  methods: {
    handleCurrentChange(val) {},
    handleSelectionChange() {},
    add() {
      this.isShowEdit = true;
    },
    deletea() {},
    enable() {},
    disabled() {},
    resetPassword() {},
    edit(row) {},
    ditribute(row) {},
    enableRow(row) {},
    deleteRow(row) {}
  }
};
</script>
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
      padding: 25px;
    }
  }
}
.tableWarp {
  height: calc(100% - 140px);
  overflow: auto;
}
.fenye {
  margin-top: 10px;
  span {
    @include font-s;
    float: right;
  }
  .pagination {
    float: right;
  }
}
</style>
