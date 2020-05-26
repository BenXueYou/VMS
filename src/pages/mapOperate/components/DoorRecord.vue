<template>
  <el-dialog width="1200px"
             title="开门记录"
             center
             :modal="false"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="true">
    <div class="dialog-content">
      <!--内容-->
      <div class="access-main-log">
        <button-open-detail-dialog :isShow="isShowButtonOpen"
                                   @onCancel="onCancelDialog('voiceOpen')"
                                   :isAppend="true" />
        <face-open-detail-dialog :isShow="isShowFaceOpen"
                                 @onCancel="onCancelDialog('face')"
                                 ref="faceOpenDialog"
                                 :isAppend="true" />
        <card-open-detail-dialog :isShow="isShowCardOpen"
                                 @onCancel="onCancelDialog('card')"
                                 ref="cardOpenDialog"
                                 :isAppend="true" />
        <people-open-detail-dialog :isShow="isShowPeopleOpen"
                                   ref="peopleOpenDialog"
                                   :isAppend="true"
                                   @onCancel="onCancelDialog('staff_group')" />
        <div class="access-search">
          <div style="margin-right: 10px;">
            <span class='topTitleTxt'>姓名：</span>
            <el-input v-model="staffName"
                      style="width: 140px"
                      @keyup.enter.native="queryAct"
                      size="small"></el-input>
          </div>
          <div style='display:inline-block;'>
            <div style="display:inline-block;">
              <span class='topTitleTxt'>验证时间：</span>
              <el-date-picker v-model="validateTimeStart"
                              type="datetime"
                              size="small"
                              class="time-interal-date"
                              style="margin-left: 0px;display:inline-block;width:220px;"
                              placeholder="选择日期"
                              value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
              <div class="time-line"
                   style='display:inline-block;text-align:center;'></div>
              <el-date-picker v-model="validateTimeEnd"
                              type="datetime"
                              size="small"
                              style="margin-left: 0px;display:inline-block;width:220px;"
                              class="time-interal-date"
                              placeholder="选择日期"
                              value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </div>
          </div>
          <div style="margin-left: 10px">
            <el-select style="width: 140px"
                       v-model="staffType"
                       clearable
                       :popper-append-to-body="false"
                       size="small"
                       placeholder="人员类型">
              <el-option v-for="item in personTypeOptions"
                         :key="item.typeStr"
                         :label="item.typeName"
                         :value="item.typeStr">
              </el-option>
            </el-select>
          </div>
          <div style="margin-left: 10px">
            <el-select style="width: 140px"
                       v-model="validateType"
                       clearable
                       :popper-append-to-body="false"
                       size="small"
                       placeholder="验证类型">
              <el-option v-for="item in validateTypeOptions"
                         :key="item.typeStr"
                         :label="item.typeName"
                         :value="item.typeStr">
              </el-option>
            </el-select>
          </div>
          <div class="search-btn">
            <el-button @click="queryAct"
                       icon="el-icon-search"
                       style="margin-left: 10px;"
                       type="primary"
                       size="small">检索</el-button>
          </div>
        </div>
        <div class="face-table">
          <el-scrollbar style="height: 92%;transition:0.2s">
            <el-table :data="tableData"
                      v-loading="isLoading"
                      @sort-change="sortChange"
                      style="width: 100%">
              <el-table-column type="index"
                               label="序号"
                               :index="indexMethod"
                               width="90">
              </el-table-column>
              <el-table-column prop="doorName"
                               label="门"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="direction"
                               label="方向"
                               sortable="custom"
                               width="90">
                <!-- sortable="custom" -->
                <template slot-scope="scope">
                  <span>{{$common.getEnumItemName("chn_d", scope.row.direction)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="validateType"
                               label="验证类型"
                               width="110"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>{{$common.transferValidateType(scope.row.validateType)}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="staffType"
                               label="人员类型"
                               width="100"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{$common.getEnumItemName("staff_t", scope.row.staffType)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="staffName"
                               label="人员姓名"
                               width="120">
              </el-table-column>
              <el-table-column prop="eventType"
                               label="事件"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{getEventType(scope.row)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="validateTime"
                               label="验证时间"
                               sortable="custom"
                               show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div class="detail-icon">
                    <img src="@/assets/images/look_details.png"
                         width="14px"
                         height="14px"
                         style="margin:0 6px 0 0">
                    <el-button @click="lookDetail(scope.row)"
                               type="text"
                               size="small">
                      详情
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
  </el-dialog>
</template>

<script>
import ButtonOpenDetailDialog from "@/pages/doorControl/components/ButtonOpenDetailDialog";
import FaceOpenDetailDialog from "@/pages/doorControl/components/FaceOpenDetailDialog";
import CardOpenDetailDialog from "@/pages/doorControl/components/CardOpenDetailDialog";
import PeopleOpenDetailDialog from "@/pages/doorControl/components/PeopleOpenDetailDialog";

export default {
  components: {
    FaceOpenDetailDialog,
    CardOpenDetailDialog,
    ButtonOpenDetailDialog,
    PeopleOpenDetailDialog
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    itemData: {
      type: Object,
      default: () => null
    },
    orgName: {
      type: String,
      default: () => ""
    },
    moduleName: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      isCurrentShow: false,
      staffName: "",
      validateTimeStart: "",
      validateTimeEnd: "",
      deviceName: "",
      staffType: "",
      validateType: "",
      verifyResult: "",
      openDoorResult: "",
      cardType: "",
      personTypeOptions: [],
      validateTypeOptions: [],
      resultOptions: [],
      mediumUseOptions: [],
      tableData: [],
      pageInfo: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      isShowButtonOpen: false,
      isShowFaceOpen: false,
      isShowCardOpen: false,
      isShowPeopleOpen: false,
      isLoading: false,
      isShowOtherTime: false,
      order: "time",
      sort: "desc",
      isOneProject: true
    };
  },
  created() {},
  mounted() {
    let projectType = this.$store.state.home.projectType || {};
    this.isOneProject = Boolean(projectType.platformLevel === "levelOne");
  },
  methods: {
    onClickCancel() {
      this.$emit("onCancel");
    },
    initData() {
      this.personTypeOptions = this.$common.getEnumByGroupStr("staff_t");
      this.validateTypeOptions = this.$common.getEnumByGroupStr("pass");
      this.mediumUseOptions = this.$common.getEnumByGroupStr("card_u");
      this.resultOptions = [
        {
          typeStr: "",
          typeName: "全部"
        },
        {
          typeStr: 0,
          typeName: "成功"
        },
        {
          typeStr: 1,
          typeName: "失败"
        }
      ];
      this.getDoorLog();
    },
    resetQuery() {
      this.deviceName = "";
      this.staffType = "";
      this.validateType = "";
      this.verifyResult = "";
      this.openDoorResult = "";
      this.cardType = "";
    },
    queryAct() {
      this.pageInfo = {
        total: 0,
        pageSize: 10,
        currentPage: 1
      };
      this.getDoorLog();
    },
    getDoorLog() {
      this.isLoading = true;
      let xhr = {
        channelUuid: this.itemData ? this.itemData.resourceUuid : "",
        staffName: this.staffName,
        validateTimeStart: this.validateTimeStart,
        validateTimeEnd: this.validateTimeEnd,
        staffType: this.staffType,
        validateType: this.validateType,
        limit: this.pageInfo.pageSize,
        page: this.pageInfo.currentPage,
        order: this.order,
        sort: this.sort
      };
      if (!this.isOneProject) {
        xhr.projectUuid = this.itemData.projectUuid;
      }
      this.$logSearchHttp
        .getDoorLog(xhr, {
          headers: {
            VIEW_MODULE_NAME: encodeURIComponent(this.moduleName),
            VIEW_MODULE_DETAIL: encodeURIComponent(
              `${this.orgName}-查询门禁记录`
            )
          }
        })
        .then(res => {
          let body = res.data;
          this.handleGetDoorLogSuccessResponse(body.data);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    handleGetDoorLogSuccessResponse(data) {
      this.tableData = data.list;
      this.handlePageInfo(data);
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
      this.getDoorLog();
    },
    lookDetail(row) {
      if (row.validateType !== "staff_group") {
        this.isShowFaceOpen = !this.isShowFaceOpen;
        this.$refs.faceOpenDialog.validateType = row.validateType;
        this.$refs.faceOpenDialog.itemData = this.$common.copyObject(
          row,
          this.$refs.faceOpenDialog.itemData
        );
      } else {
        this.isShowPeopleOpen = !this.isShowPeopleOpen;
        this.$refs.peopleOpenDialog.validateType = row.validateType;
        this.$refs.peopleOpenDialog.itemData = this.$common.copyObject(
          row,
          this.$refs.peopleOpenDialog.itemData
        );
      }
    },
    onCancelDialog(type) {
      if (type !== "staff_group") {
        this.isShowFaceOpen = false;
      } else {
        this.isShowPeopleOpen = false;
      }
    },
    getEventType(row) {
      let eventStr = "";
      if (row.openDoorResult === 0) {
        eventStr = "开门成功";
      } else if (row.verifyResult === 0) {
        eventStr = "验证成功，开门失败，";
      } else {
        eventStr = "验证失败，";
      }
      if (row.openDoorResult === 1 || row.verifyResult === 1) {
        eventStr =
          eventStr + this.$common.getEnumItemName("verify_t", row.eventType);
      }
      return eventStr;
    },
    formatNumber(num) {
      let numStr = "";
      if (num < 10) {
        numStr = `0${num}`;
      } else {
        numStr = `${num}`;
      }
      return numStr;
    },
    indexMethod(index) {
      return this.formatNumber(
        index + (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize + 1
      );
    },
    changeTime(item) {
      for (let dataItem of this.buttonData) {
        if (dataItem.value === item.value) {
          this.$set(dataItem, "isSelected", true);
        } else {
          this.$set(dataItem, "isSelected", false);
        }
      }
      if (item.value === "otherTime") {
        this.isShowOtherTime = true;
        this.validateTimeStart = "";
        this.validateTimeEnd = "";
      } else {
        this.isShowOtherTime = false;
        let day = new Date();
        switch (item.value) {
          case "yesterday":
            day.setDate(day.getDate() - 1);
            let str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
            this.validateTimeStart = str + " " + "00:00:00";
            this.validateTimeEnd = str + " " + "23:59:59";
            break;
          case "today":
            str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
            this.validateTimeStart = str + " " + "00:00:00";
            this.validateTimeEnd = str + " " + "23:59:59";
            break;
          case "lastMonth":
            let firstdate = new Date(
              new Date().getFullYear(),
              new Date().getMonth() - 1,
              1
            );
            firstdate = this.$common.timestampToFormatter(
              firstdate,
              "yyyy-mm-dd"
            );
            let enddate = new Date(
              new Date().getFullYear(),
              new Date().getMonth() - 1,
              new Date(day.getFullYear(), day.getMonth(), 0).getDate()
            );
            enddate = this.$common.timestampToFormatter(enddate, "yyyy-mm-dd");
            this.validateTimeStart = firstdate + " " + "00:00:00";
            this.validateTimeEnd = enddate + " " + "23:59:59";
            break;
          case "thisMonth":
            day.setDate(1);
            firstdate = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
            enddate = this.$common.timestampToFormatter(
              new Date().getTime(),
              "yyyy-mm-dd"
            );
            this.validateTimeStart = firstdate + " " + "00:00:00";
            this.validateTimeEnd = enddate + " " + "23:59:59";
            break;
        }
      }
      this.queryAct();
    },
    sortChange(val) {
      this.order = val.prop;
      if (!val.order) {
        this.order = "time";
        this.sort = "desc";
      } else if (val.order === "descending") {
        this.sort = "desc";
      } else {
        this.sort = "asc";
      }
      this.queryAct();
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
    },
    itemData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initData();
        }
      },
      deep: true
    }
  }
};
</script>
<style lang="scss">
.access-main-log {
  .el-button--default,
  .el-button--default:hover,
  .el-button--default:active,
  .el-button--default:focus {
    color: #ffffff;
    font-family: "PingFangSC-Regular";
    font-size: 16px;
    height: 40px;
    border: 1px #424445 solid;
    background: #247b61;
  }
  .el-button--default {
    background: transparent;
  }
}
</style>
<style lang="scss" scoped>
.dialog-content {
  width: 100%;
}
.access-main-log {
  width: 100%;
  height: 100%;
  background: #25292d;
  .access-search {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .topTitleTxt {
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #ffffff;
    }
    .time-interal {
      width: 9%;
    }
    .time-interal-date {
      width: 13%;
    }
    .left-space {
      margin-left: 3%;
    }
    .timeText {
      font-size: 32px;
      color: #cccccc;
    }
    .time-line {
      border-width: 1px 0px 0px 0px;
      width: 8px;
      border-color: #7a7b7c;
      border-style: solid;
      margin: 0px 3px;
    }
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
.detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
