<template>
  <el-dialog width="49%"
             title="从业人员详情"
             class="dialog-main-unit"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content">
      <!--内容-->
      <div class="access-search">
        <span class='topTitleTxt'>姓名：</span>
        <el-input v-model="staffName"
                  class="time-interal"
                  size="small"></el-input>
        <span class='topTitleTxt left-space'>性别：</span>
        <el-select class="time-interal"
                   v-model="gender"
                   clearable
                   placeholder="请选择性别">
          <el-option v-for="item in genderOptions"
                     :key="item.typeStr"
                     :label="item.typeName"
                     :value="item.typeStr">
          </el-option>
        </el-select>
        <span class='topTitleTxt left-space'>联系方式：</span>
        <el-input v-model="contact"
                  class="time-interal"
                  size="small"></el-input>
        <div class="search-btn">
          <el-button @click="queryAct"
                     icon="el-icon-search"
                     type="primary"
                     size="small">查询</el-button>
          <el-button @click="resetQuery"
                     type="primary"
                     size="small">重置</el-button>
        </div>
      </div>
      <div class="face-table">
        <el-scrollbar style="height: 92%;transition:0.2s">
          <el-table :data="tableData"
                    style="width: 100%">
            <el-table-column type="index"
                             label="序号"
                             width="60">
            </el-table-column>
            <el-table-column prop="staffName"
                             label="姓名"
                             width="120">
            </el-table-column>
            <el-table-column prop="gender"
                             label="性别"
                             width="80">
              <template slot-scope="scope">
                <span>{{$common.getEnumItemName("gender", scope.row.gender)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="contact"
                             label="联系电话"
                             width="160">
            </el-table-column>
            <el-table-column prop="unitsName"
                             label="单位名称"
                             show-overflow-tooltip>
              <template>
                <span>{{unitsName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="address"
                             label="所属地址"
                             show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </el-scrollbar>
        <div class="footer">
          <el-pagination background
                         layout="total, prev, pager, next, jumper"
                         :page-size="pageInfo.pageSize"
                         :current-page="pageInfo.currentPage"
                         @current-change='handleCurrentChange'
                         :total="pageInfo.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    unitName: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      isCurrentShow: false,
      unitUuid: "",
      staffName: "",
      gender: "",
      infrastructureUuids: "",
      contact: "",
      tableData: [],
      pageInfo: {
        total: 0,
        pageSize: 8,
        currentPage: 1
      },
      genderOptions: [],
      unitsName: ""
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.genderOptions = this.$common.getEnumByGroupStr("gender");
    },
    onClickCancel() {
      this.$emit("onCancel");
    },
    queryAct() {
      this.pageInfo = {
        total: 0,
        pageSize: 8,
        currentPage: 1
      };
      this.selPeople();
    },
    resetQuery() {
      this.staffName = "";
      this.gender = "";
      this.contact = "";
    },
    selPeople() {
      this.isLoading = true;
      this.$unitHttp
        .selPeople({
          unitName: this.unitName,
          staffName: this.staffName,
          gender: this.gender,
          contact: this.contact,
          infrastructureUuids: this.infrastructureUuids,
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
    },
    selPeopleSuccessResponse(body) {
      this.tableData = body.data.list;
      this.handlePageInfo(body.data);
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
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
      if (val) {
        this.selPeople();
      } else {
        this.resetQuery();
        this.infrastructureUuids = "";
        this.tableData = [];
      }
    }
  },
  destroyed() {}
};
</script>

<style lang="scss" scoped>
.dialog-content {
  padding: 3% 4%;
  box-sizing: border-box;
  .access-search {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .topTitleTxt {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #bbbbbb;
      text-align: right;
    }
    .left-space {
      margin-left: 3%;
    }
    .time-interal {
      width: 16%;
    }
    .search-btn {
      margin-left: auto;
      margin-right: 0;
    }
  }
  .face-table {
    height: 100%;
    margin-top: 4%;
    .footer {
      margin-top: 30px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
