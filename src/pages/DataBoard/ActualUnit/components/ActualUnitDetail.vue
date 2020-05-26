<template>
  <el-dialog :title="title"
             :width="width"
             class="ActualUnitDetail"
             :before-close="onClickCancel"
             :visible.sync="ActualUnitDetailDialogVisiable">
    <div class="wrap">
      <div class="topBox">
        <div class="leftBox">
          <div>
            姓名：
            <el-input clearable
                      v-model="query.staffName"></el-input>
          </div>
          <div>
            性别：
            <el-select v-model="query.gender">
              <el-option label="全部"
                         value></el-option>
              <el-option label="男"
                         value="male"></el-option>
              <el-option label="女"
                         value="female"></el-option>
            </el-select>
          </div>
          <div>
            联系方式：
            <el-input clearable
                      v-model="query.phoneNo"></el-input>
          </div>
        </div>
        <div class="rightBox">
          <el-button type="primary"
                     size="mini"
                     @click="queryBtnAct">查询</el-button>
          <el-button type="primary"
                     size="mini"
                     @click="resetBtnAct">重置</el-button>
        </div>
      </div>
      <el-table v-loading="isLoading"
                ref="ActualUnitTable"
                :data="tableData"
                tooltip-effect="dark"
                class="ActualUnitTableClass">
        <el-table-column type="index"
                         label="序号"
                         width="55"></el-table-column>
        <el-table-column prop="staffName"
                         label="姓名"
                         width="95"></el-table-column>
        <el-table-column prop="gender"
                         label="性别"
                         width="80">
          <template slot-scope="scope">
            <span>{{
              $common.getEnumItemName("gender", scope.row.gender)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contact"
                         label="联系方式"></el-table-column>
        <el-table-column label="单位名称">
          <template>
            <span>{{ unitsName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address"
                         label="所属地址"
                         show-overflow-tooltip></el-table-column>
      </el-table>

      <div class="footer">
        <el-pagination background
                       layout="total, prev, pager, next, jumper"
                       :page-size="pageInfo.pageSize"
                       :current-page="pageInfo.currentPage"
                       @current-change="handleCurrentChange"
                       :total="pageInfo.total"></el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "ActualUnitDetailDialog",
  props: {
    title: {
      type: String,
      default: "从业人员详情"
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "900px"
    }
  },
  data() {
    return {
      unitsName: "",
      companyUuid: "",
      infrastructureUuids: "",
      projectUuid: this.$store.state.home.projectUuid,
      isLoading: false,
      query: {
        staffName: null,
        gender: null,
        phoneNo: null
      },
      pageInfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      tableData: [],
      ActualUnitDetailDialogVisiable: false
    };
  },
  mounted() {},
  methods: {
    close() {
      this.ActualUnitDetailDialogVisiable = false;
      this.$emit("update:visible", false);
    },
    onClickCancel() {
      this.$emit("onCancel");
    },
    handlePageInfo(data) {
      let total = 0;
      if (data.total >= 0) {
        total = data.total;
      }
      this.pageInfo.total = total;
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.selPeople();
    },
    queryBtnAct() {
      this.pageInfo = {
        total: 0,
        pageSize: 10,
        currentPage: 1
      };
      this.selPeople();
    },
    resetBtnAct() {
      this.query = {
        staffName: "",
        gender: "",
        phoneNo: ""
      };
      this.pageInfo = {
        total: 0,
        pageSize: 10,
        currentPage: 1
      };
      this.selPeople();
    },
    selPeople() {
      if (this.infrastructureUuids) {
        this.isLoading = true;
        this.$unitHttp
          .selPeople({
            staffName: this.query.staffName,
            unitName: this.unitsName,
            gender: this.query.gender,
            contact: this.query.phoneNo,
            infrastructureUuids: this.infrastructureUuids,
            companyUuid: this.companyUuid,
            projectUuid: this.projectUuid,
            limit: this.pageInfo.pageSize,
            page: this.pageInfo.currentPage
          })
          .then(res => {
            let body = res.data;
            this.selPeopleSuccessResponse(body);
            this.isLoading = false;
          })
          .catch(() => {
            this.isLoading = false;
          });
      } else {
        this.isLoading = false;
        this.tableData = [];
      }
    },
    selPeopleSuccessResponse(body) {
      this.tableData = body.data.list;
      this.handlePageInfo(body.data);
    }
  },
  watch: {
    visible(val) {
      this.ActualUnitDetailDialogVisiable = val;
      if (val) {
        this.selPeople();
        console.log(this);
      } else {
        this.resetBtnAct();
        this.infrastructureUuids = "";
        this.tableData = [];
      }
    }
  }
};
</script>
<style lang="scss"></style>
<style lang="scss" scoped>
.ActualUnitDetail {
  .wrap {
    padding: 20px 35px;
    box-sizing: border-box;
    max-height: 630px;
    .topBox {
      display: flex;
      justify-content: space-between;
      padding-bottom: 20px;
      font-family: "PingFangSC-Regular";
      font-size: 12px;
      color: #dddddd;
      .leftBox {
        display: flex;
        justify-content: flex-start;
        div {
          margin-right: 20px;
        }
      }
      .el-input {
        width: 120px;
      }
      .el-select {
        width: 120px;
      }
    }
    .footer {
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
