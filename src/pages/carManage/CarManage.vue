<template>
  <div class="unit-main">
    <add-or-edit-unit-dialog :isShow.sync="isShowAddOrEditDialog"
                             @onCancel="onCancelAddOrEditDialog"
                             :isAdd="isAdd"
                             :carType="carType"
                             :row="row"
                             :carNumber="carNumber"
                             ref="addOrEditUnitDialog"
                             @onConfirm="onConfirmAddOrEditDialog" />
    <div class="main">
      <div class="access-main">
        <div class="access-search">
          <el-button @click="addUnit"
                     type="primary"
                     size="small"
                     :disabled='!OwnAuthDisabled'>新增车辆</el-button>
          <el-button @click="deleteUnits"
                     type="primary"
                     size="small"
                     :disabled='!OwnAuthDisabled'>删除</el-button>
          <div class="search-btn">
            <div style="margin-right: 10px;">
              <span class='topTitleTxt'>车牌号码：</span>
              <el-input v-model="licenseNumber"
                        placeholder="请输入车牌号码"
                        class="time-interal"
                        size="small"></el-input>
            </div>
            <el-button @click="queryAct"
                       icon="el-icon-search"
                       style="margin-left: 10px;margin-right: 10px;"
                       type="primary"
                       size="small"
                       :disabled='!ShowAuthDisabled'>检索</el-button>
            <el-popover placement="bottom-end"
                        width="320"
                        popper-class="i-popover-box"
                        trigger="click">
              <div class="unit-more-action">
                <span class='topTitleTxtMore'>关联人员：</span>
                <el-input v-model="staffName"
                          class="time-interal"
                          size="small"></el-input>
              </div>
              <div class="unit-more-action">
                <span class='topTitleTxtMore'>车牌类型：</span>
                <el-select v-model="licenseType"
                           multiple
                           collapse-tags
                           placeholder="请选择">
                  <el-option v-for="item in carNumber"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="unit-more-action">
                <span class='topTitleTxtMore'>车辆类型：</span>
                <el-select v-model="vehicleType"
                           multiple
                           collapse-tags
                           placeholder="请选择">
                  <el-option v-for="item in carType"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="unit-more-action">
                <span class='topTitleTxtMore'>车辆颜色：</span>
                <el-input v-model="vehicleColor"
                          class="time-interal"
                          size="small"></el-input>
              </div>
              <div class="unit-more-action">
                <span class='topTitleTxtMore'>创建时间：</span>
                <el-date-picker v-model="startTime"
                                type="datetime"
                                @change="changeTime"
                                placeholder="选择日期时间">
                </el-date-picker>
              </div>
              <div class="unit-more-action">
                <span class='topTitleTxtMore'>至：</span>
                <el-date-picker v-model="endTime"
                                type="datetime"
                                @change="changeTime"
                                placeholder="选择日期时间">
                </el-date-picker>
              </div>
              <div class="unit-more-action">
                <el-button @click="queryAct"
                           size="small"
                           style="margin-top:5px;margin-right: 10px;"
                           type="primary"
                           :disabled='!ShowAuthDisabled'>检索</el-button>
                <el-button @click="resetQuery"
                           style="margin-top:5px;"
                           type="text">重置</el-button>
              </div>
              <el-button type="primary"
                         size="small"
                         style="margin-right:50px;"
                         slot="reference">其他检索条件</el-button>
            </el-popover>

          </div>
        </div>
        <div class="face-table">
          <el-scrollbar style="height: 92%;transition:0.2s">
            <el-table :data="tableData"
                      ref="singleTable"
                      @selection-change="handleSelectionChange"
                      v-loading="isLoading"
                      style="width: 100%">
              <el-table-column type="selection">
              </el-table-column>
              <el-table-column type="index"
                               label="序号"
                               width="60">
              </el-table-column>
              <el-table-column prop="licenseNumber"
                               label="车牌号码"
                               width="200"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="licenseType"
                               label="车牌类型"
                               width="200">
                <template slot-scope="scope">
                  <span>{{$common.getEnumItemName("license_type", scope.row.licenseType)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="vehicleType"
                               label="车辆类型"
                               width="90"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{$common.getEnumItemName("vehicle_type", scope.row.vehicleType)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="vehicleColor"
                               label="车辆颜色"
                               width="90">
              </el-table-column>
              <el-table-column prop="staffName"
                               label="关联人员">
              </el-table-column>
              <el-table-column prop="createTime"
                               label="创建时间"
                               width="300">
              </el-table-column>
              <el-table-column label="操作"
                               width="300">
                <template slot-scope="scope">
                  <div class="detail-icon">
                    <el-button @click="editUnit(scope.row)" :disabled='!OwnAuthDisabled'
                               type="text"
                               size="small">
                      编辑
                    </el-button>
                    <el-button @click="deleteUnit(scope.row)" :disabled='!OwnAuthDisabled'
                               type="text"
                               size="small">删除
                      <!-- <span style="color: #DF5656">删除</span> -->
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
import AddOrEditUnitDialog from "@/pages/carManage/components/AddOrEditUnitDialog";
import LeftTree from "@/pages/carManage/views/LeftTree";
import BuildFloorPopoverTree from "@/pages/carManage/components/BuildFloorPopoverTree";
import * as api from "@/pages/carManage/utils/UnitHttp.js";
export default {
  components: {
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
      isShowAddOrEditDialog: false,
      isAdd: true,
      unitsUuid: [],
      initTreeRootData: null,
      infrastructureUuid: "",
      lastLevelType: "",
      nodeText: "",
      licenseNumber: "",
      licenseType: [],
      startTime: "",
      endTime: "",
      vehicleType: [],
      vehicleColor: "",
      staffName: null,
      isShowPop: false,
      carNumber: [],
      carType: [],
      row: {},
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("车辆登记", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("车辆登记", "isOwn");
    if (!this.ShowAuthDisabled) return;
    this.initData();
    const turnObj = obj => {
      let num = [];
      for (let k in obj) {
        num.push({
          value: k,
          label: obj[k]
        });
      }
      return num;
    };
    let data = JSON.parse(sessionStorage.getItem("localEnums"));
    console.log(data);
    let carNumber = data.license_type;
    this.carNumber = turnObj(carNumber);
    let carType = data.vehicle_type;
    this.carType = turnObj(carType);
    console.log(carType);
    console.log(carNumber);
  },
  methods: {
    changeTime() {
      if (!this.startTime || !this.endTime) {
        return;
      }
      if (this.startTime > this.endTime) {
        [this.startTime, this.endTime] = [this.endTime, this.startTime];
      }
    },
    initData() {
      this.companyTypeOptions = this.$common.getEnumByGroupStr("company_t");
      this.getAllequipments();
      // if (this.initTreeRootData) {
      //   this.getAllequipments();
      // }
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
    change(t) {
      return ("0" + t).slice(-2);
    },
    formate(date) {
      if (!date) {
        return "";
      }
      var MyDate = new Date(date);
      return (
        MyDate.getFullYear() +
        "-" +
        this.change(MyDate.getMonth() + 1) +
        "-" +
        this.change(MyDate.getDate()) +
        " " +
        this.change(MyDate.getHours()) +
        ":" +
        this.change(MyDate.getMinutes()) +
        ":" +
        this.change(MyDate.getSeconds())
      );
    },
    getAllequipments() {
      this.isLoading = true;
      api
        .getNewCarList({
          licenseNumber: this.licenseNumber, // 车牌号码
          staffName: this.staffName, // 关联人员姓名
          licenseType: this.licenseType.toString(), // 车牌类型
          vehicleType: this.vehicleType.toString(), // 车辆类型
          vehicleColor: this.vehicleColor, // 车辆颜色
          startTime: this.formate(this.startTime), //  起始时间
          endTime: this.formate(this.endTime), //  结束时间
          page: this.pageInfo.currentPage,
          limit: this.pageInfo.pageSize
        })
        .then(res => {
          let body = res.data;
          console.log(body);
          this.handlegetAllequipmentsSuccessResponse(body);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    handlegetAllequipmentsSuccessResponse(body) {
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
      this.getAllequipments();
    },
    addUnit() {
      this.isAdd = true;
      this.isShowAddOrEditDialog = true;
      this.$refs.addOrEditUnitDialog.isShowPopover = true;
    },
    deleteUnits() {
      this.unitsUuid = [];
      if (this.multipleSelection.length !== 0) {
        this.$confirm(
          `<span style="font-family: "PingFangSC-Regular";font-size: 14px;color: #FFFFFF;">确认删除${
            this.multipleSelection.length > 1 ? "这些" : "该"
          }车辆吗?</span>`,
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            distinguishCancelAndClose: true,
            confirmButtonClass: "confirm-button",
            cancelButtonClass: "cancel-button",
            center: true,
            dangerouslyUseHTMLString: true,
            customClass: "isCloseDialog"
          }
        )
          .then(() => {
            let uuids = this.multipleSelection.map(item => {
              return item.vehicleUuid;
            });
            let licenseNums = this.multipleSelection.map(item => {
              return item.licenseNumber;
            });
            api.deleteCar(uuids, {
              modelName: "车辆登记",
              type: "删除",
              detailContent: "删除车辆-" + licenseNums.toString()
            }).then(res => {
              console.log(res);
              if (res.data.success) {
                this.$message.success("删除成功了!");
                this.getAllequipments();
              }
            });
          })
          .catch(() => {});
      } else {
        this.$cToast.warn("请选择所要删除的车辆！");
      }
    },
    formatData(row) {
      let infrastructureUuid = "";
      let infrastructureUri = "";
      for (let item of row.infrastructure) {
        if (!infrastructureUuid) {
          infrastructureUuid = item.infrastructureUuid;
        } else {
          infrastructureUuid =
            infrastructureUuid + "," + item.infrastructureUuid;
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
      api.getCarDetail(row.vehicleUuid).then(res => {
        console.log(res);
        let data = res.data.data;
        this.row = data;
        this.isShowAddOrEditDialog = true;
        this.$refs.addOrEditUnitDialog.isShowPopover = true;
      });
    },
    deleteUnit(row) {
      this.$refs.singleTable.toggleRowSelection(row);
      this.deleteUnits();
    },
    queryAct() {
      this.pageInfo = {
        total: 0,
        pageSize: 13,
        currentPage: 1
      };
      this.getAllequipments();
    },
    resetQuery() {
      this.licenseNumber = ""; // 车牌号码
      this.staffName = ""; // 关联人员姓名
      this.licenseType = []; // 车牌类型
      this.vehicleType = []; // 车辆类型
      this.vehicleColor = ""; // 车辆颜色
      this.startTime = ""; //  起始时间
      this.endTime = ""; //  结束时间
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onCancelAddOrEditDialog() {
      this.isShowAddOrEditDialog = false;
      this.$refs.addOrEditUnitDialog.isShowPopover = false;
    },
    onConfirmAddOrEditDialog() {
      this.isShowAddOrEditDialog = false;
      this.$refs.addOrEditUnitDialog.isShowPopover = false;
      this.getAllequipments();
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
        .catch(action => {
          if (action === "cancel") {
            this.$equipmentHttp
              .delequipments({
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
      this.getAllequipments();
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
            infrastructureUri =
              infrastructureUri + "，" + data[index].infrastructureUri;
          }
        }
      }
      return infrastructureUri;
    },
    onShowPop() {
      document.getElementById("app").addEventListener("click", () => {
        this.$refs.buildPopoverTree.isShowPopover = false;
      });
      document
        .getElementsByClassName("i-popover-box")[0]
        .addEventListener("click", () => {
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
    }
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
