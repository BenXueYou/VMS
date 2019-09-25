<template>
  <div class="unit-main">
    <look-staff-details :isShow="isShowStaffDetails"
                        ref="lookStaffDetails"
                        @onCancel="onCancelStaffDetailsDialog" />
    <add-or-edit-unit-dialog :isShow="isShowAddOrEditDialog"
                             @onCancel="onCancelAddOrEditDialog"
                             :isAdd="isAdd"
                             ref="addOrEditUnitDialog"
                             @onConfirm="onConfirmAddOrEditDialog" />
    <left-tree @setTreeRootData="setTreeRootData"
               style="height: 100%;"
               ref="unitLeftTree"
               @setLastLevelType="setLastLevelType" />
    <div class="main">
      <div class="access-main">
        <div class="access-search">
          <el-button @click="addUnit"
                     type="primary"
                     size="small">新增单位</el-button>
          <el-button @click="deleteUnits"
                     type="primary"
                     size="small">删除</el-button>
          <div class="search-btn">
            <div style="margin-right: 10px;">
              <span class='topTitleTxt'>单位名称：</span>
              <el-input v-model="companyName"
                        class="time-interal"
                        size="small"></el-input>
            </div>
            <el-button @click="queryAct"
                       icon="el-icon-search"
                       style="margin-left: 10px;"
                       type="primary"
                       size="small">检索</el-button>
            <el-button v-popover:i-popover
                       type="primary"
                       size="small">其他检索条件</el-button>
            <el-popover ref="i-popover"
                        placement="bottom-end"
                        width="320"
                        @show="onShowPop"
                        popper-class="i-popover-box"
                        trigger="click">
              <div class="unit-more-action">
                <span class='topTitleTxtMore'>单位性质：</span>
                <el-select class="time-interal"
                           v-model="companyType"
                           size="small"
                           clearable
                           placeholder="请选择单位性质">
                  <el-option v-for="item in companyTypeOptions"
                             :key="item.typeStr"
                             :label="item.typeName"
                             :value="item.typeStr">
                  </el-option>
                </el-select>
              </div>
              <div class="unit-more-action">
                <span class='topTitleTxtMore'>联系人：</span>
                <el-input v-model="chargePerson"
                          class="time-interal"
                          size="small"></el-input>
              </div>
              <div class="unit-more-action">
                <span class='topTitleTxtMore' style="margin-left: -40px;">楼栋单元：</span>
                <build-floor-popover-tree width="170px"
                                          :initTreeRootData="initTreeRootData"
                                          @setUseData="setUseData"
                                          :nodeText.sync="nodeText"
                                          ref="buildPopoverTree"
                                          :lastLevelType="lastLevelType"
                                          :isAllCanSelected="true" />
              </div>
              <div class="unit-more-action">
                <el-button @click="queryAct"
                           size="small"
                           style="margin-top:5px;margin-right: 10px;"
                           type="primary">检索</el-button>
                <el-button @click="resetQuery"
                           style="margin-top:5px;"
                           type="text">重置</el-button>
              </div>
            </el-popover>
          </div>
        </div>
        <div class="face-table">
          <el-scrollbar style="height: 92%;transition:0.2s">
            <el-table :data="tableData"
                      @selection-change="handleSelectionChange"
                      v-loading="isLoading"
                      style="width: 100%">
              <el-table-column type="selection">
              </el-table-column>
              <el-table-column type="index"
                               label="序号"
                               width="60">
              </el-table-column>
              <el-table-column prop="companyName"
                               label="单位名称"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="companyType"
                               label="单位性质">
                <template slot-scope="scope">
                  <span>{{$common.getEnumItemName("company_t", scope.row.companyType)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="infrastructure"
                               label="楼栋单元"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{getInfrastructureUri(scope.row.infrastructure)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="chargePersonName"
                               label="联系人"
                               width="90">
              </el-table-column>
              <el-table-column prop="chargePersonPhone"
                               label="联系电话">
              </el-table-column>
              <el-table-column prop="staffNum"
                               label="员工数"
                               width="70">
              </el-table-column>
              <el-table-column prop="createTime"
                               label="创建时间">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div class="detail-icon">
                    <el-button @click="lookDetail(scope.row)"
                               type="text"
                               size="small">
                      查看从业人员
                    </el-button>
                    <el-button @click="editUnit(scope.row)"
                               type="text"
                               size="small">
                      编辑
                    </el-button>
                    <el-button @click="deleteUnit(scope.row)"
                               type="text"
                               size="small">
                      <span style="color: #DF5656">删除</span>
                    </el-button>
                  </div>
                </template>
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
    </div>
  </div>
</template>

<script>
import LookStaffDetails from "@/pages/unitMange/components/LookStaffDetails";
import AddOrEditUnitDialog from "@/pages/unitMange/components/AddOrEditUnitDialog";
import LeftTree from "@/pages/unitMange/views/LeftTree";
import BuildFloorPopoverTree from "@/pages/unitMange/components/BuildFloorPopoverTree";

export default {
  components: {
    LookStaffDetails,
    AddOrEditUnitDialog,
    LeftTree,
    BuildFloorPopoverTree
  },
  props: {},
  data() {
    return {
      companyName: "",
      companyType: "",
      chargePerson: "",
      infrastructureUri: "",
      isLoading: false,
      companyTypeOptions: [],
      tableData: [],
      pageInfo: {
        total: 0,
        pageSize: 13,
        currentPage: 1
      },
      multipleSelection: [],
      isShowStaffDetails: false,
      isShowAddOrEditDialog: false,
      isAdd: true,
      unitsUuid: [],
      initTreeRootData: null,
      infrastructureUuid: "",
      lastLevelType: "",
      nodeText: "",
      isShowPop: false
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.companyTypeOptions = this.$common.getEnumByGroupStr("company_t");
      if (this.initTreeRootData) {
        this.getAllUnits();
      }
    },
    setTreeRootData(data) {
      this.initTreeRootData = data;
      this.infrastructureUuid = this.initTreeRootData.id;
      this.$refs.addOrEditUnitDialog.initTreeRootData = data;
    },
    setUseData(params) {
      this.infrastructureUuid = params.node.data.id;
    },
    setLastLevelType(lastLevelType) {
      this.lastLevelType = lastLevelType;
      this.$refs.addOrEditUnitDialog.lastLevelType = lastLevelType;
    },
    getAllUnits() {
      this.isLoading = true;
      this.tableData = [];
      this.$unitHttp
        .getAllUnits({
          companyName: this.companyName,
          companyType: this.companyType,
          chargePerson: this.chargePerson,
          infrastructureUuid: this.infrastructureUuid,
          limit: this.pageInfo.pageSize,
          page: this.pageInfo.currentPage
        })
        .then(res => {
          let body = res.data;
          this.handleGetAllUnitsSuccessResponse(body);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    handleGetAllUnitsSuccessResponse(body) {
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
      this.getAllUnits();
    },
    addUnit() {
      this.isAdd = true;
      this.isShowAddOrEditDialog = true;
      this.$refs.addOrEditUnitDialog.isShowPopover = true;
    },
    deleteUnits() {
      this.unitsUuid = [];
      if (this.multipleSelection.length !== 0) {
        for (const item of this.multipleSelection) {
          this.formatItems(item);
        }
        this.delUnits();
      } else {
        this.$cToast.warn("请选择所要删除的单位！");
      }
    },
    formatItems(val) {
      this.unitsUuid.push(val.companyUuid);
    },
    lookDetail(row) {
      this.$refs.lookStaffDetails.infrastructureUuids = this.formatData(row).infrastructureUuid;
      this.$refs.lookStaffDetails.unitsName = row.companyName;
      this.isShowStaffDetails = true;
    },
    formatData(row) {
      let infrastructureUuid = "";
      let infrastructureUri = "";
      for (let item of row.infrastructure) {
        if (!infrastructureUuid) {
          infrastructureUuid = item.infrastructureUuid;
        } else {
          infrastructureUuid = infrastructureUuid + "," + item.infrastructureUuid;
        }
        if (!infrastructureUri) {
          infrastructureUri = item.infrastructureUri;
        } else {
          infrastructureUri = infrastructureUri + "，" + item.infrastructureUri;
        }
      }
      let infrastructure = {
        infrastructureUuid,
        infrastructureUri
      };
      return infrastructure;
    },
    editUnit(row) {
      this.isAdd = false;
      this.isShowAddOrEditDialog = true;
      this.$refs.addOrEditUnitDialog.isShowPopover = true;
      let copyRow = {};
      copyRow = this.$common.copyObject(row, copyRow);
      let infrastructureUuid = this.formatData(copyRow).infrastructureUuid;
      let infrastructureUri = this.formatData(copyRow).infrastructureUri;
      /* for (let item of copyRow.infrastructure) {
        if (!infrastructureUuid) {
          infrastructureUuid = item.infrastructureUuid;
        } else {
          infrastructureUuid = infrastructureUuid + "," + item.infrastructureUuid;
        }
        if (!infrastructureUri) {
          infrastructureUri = item.infrastructureUri;
        } else {
          infrastructureUri = infrastructureUri + "，" + item.infrastructureUri;
        }
      } */
      this.$set(this.$refs.addOrEditUnitDialog.formLabelAlign, "companyUuid", copyRow.companyUuid);
      this.$set(this.$refs.addOrEditUnitDialog.formLabelAlign, "companyName", copyRow.companyName);
      this.$set(this.$refs.addOrEditUnitDialog.formLabelAlign, "companyType", copyRow.companyType);
      this.$set(this.$refs.addOrEditUnitDialog.formLabelAlign, "chargePersonName", copyRow.chargePersonName);
      this.$set(this.$refs.addOrEditUnitDialog.formLabelAlign, "chargePersonPhone", copyRow.chargePersonPhone);
      this.$set(this.$refs.addOrEditUnitDialog.formLabelAlign, "remarks", copyRow.remarks);
      this.$set(this.$refs.addOrEditUnitDialog.formLabelAlign, "version", copyRow.version);
      this.$set(this.$refs.addOrEditUnitDialog.formLabelAlign, "infrastructureUuid", infrastructureUuid);
      this.$set(this.$refs.addOrEditUnitDialog.formLabelAlign, "nodeText", infrastructureUri);
    },
    deleteUnit(row) {
      this.unitsUuid = [];
      this.formatItems(row);
      this.delUnits();
    },
    queryAct() {
      this.pageInfo = {
        total: 0,
        pageSize: 13,
        currentPage: 1
      };
      this.getAllUnits();
    },
    resetQuery() {
      this.companyType = "";
      this.chargePerson = "";
      this.infrastructureUuid = this.initTreeRootData.id;
      this.nodeText = "";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onCancelStaffDetailsDialog() {
      this.isShowStaffDetails = false;
    },
    onCancelAddOrEditDialog() {
      this.isShowAddOrEditDialog = false;
      this.$refs.addOrEditUnitDialog.isShowPopover = false;
    },
    onConfirmAddOrEditDialog() {
      this.isShowAddOrEditDialog = false;
      this.$refs.addOrEditUnitDialog.isShowPopover = false;
      this.getAllUnits();
    },
    delUnits() {
      this.$confirm(
        `<span style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;">是否确认删除？</span>`,
        "",
        {
          confirmButtonText: "否",
          cancelButtonText: "是",
          distinguishCancelAndClose: true,
          confirmButtonClass: "confirm-button",
          cancelButtonClass: "cancel-button",
          center: true,
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {})
        .catch((action) => {
          if (action === "cancel") {
            this.$unitHttp
              .delUnits({
                unitsUuids: this.unitsUuid
              })
              .then(res => {
                let body = res.data;
                this.delUnitsSuccessResponse(body);
              });
          }
        });
    },
    delUnitsSuccessResponse(body) {
      this.$cToast.success(body.msg);
      this.getAllUnits();
    },
    resetData() {
      this.resetQuery();
      this.companyName = "";
      this.pageInfo = {
        total: 0,
        pageSize: 13,
        currentPage: 1
      };
    },
    getInfrastructureUri(data) {
      let infrastructureUri = "";
      if (data) {
        for (let index in data) {
          if (parseInt(index) === 0) {
            infrastructureUri = data[index].infrastructureUri;
          } else {
            infrastructureUri = infrastructureUri + "，" + data[index].infrastructureUri;
          }
        }
      }
      return infrastructureUri;
    },
    onShowPop() {
      document.getElementById("app").addEventListener("click", () => {
        this.$refs.buildPopoverTree.isShowPopover = false;
      });
      document.getElementsByClassName("i-popover-box")[0].addEventListener("click", () => {
        this.$refs.buildPopoverTree.isShowPopover = false;
      });
    }
  },
  watch: {
    initTreeRootData: {
      handler(val) {
        this.resetData();
        this.initData();
      },
      deep: true
    },
  },
  destroyed() {}
};
</script>
<style lang="scss">
.unit-more-action {
  .el-input {
    width: 200px;
  }
  .el-input__inner {
    width: 200px;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 20px 12px 0px;
  .topTitleTxtMore {
    width: 100px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #bbbbbb;
    text-align: right;
    margin-right: 10px;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.unit-main {
  height: 100%;
  width: 100%;
  display: flex;
}
.left-interal {
  margin-left: 12%;
}
.topTitleTxt {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #bbbbbb;
  text-align: right;
}
.main {
  width: 100%;
  height: 100%;
  padding: 1.6% 1.5%;
  box-sizing: border-box;
  .access-main {
    height: 100%;
    background: #212325;
    padding: 1.6% 2%;
    box-sizing: border-box;
    .access-search {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      .search-btn {
        margin-left: auto;
        margin-right: 0;
        display: flex;
        justify-content: space-between;
        .time-interal {
          width: 170px;
        }
      }
    }
    .face-table {
      height: 90%;
      margin-top: 2%;
      .footer {
        margin-top: 30px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
