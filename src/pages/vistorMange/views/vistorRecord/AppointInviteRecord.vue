<template>
  <div class="AppointInviteRecord"
       v-loading="showloading">
    <div class="header">
      <div>预约/邀请记录</div>
    </div>
    <div class="main">
      <div class="main-header">
        <div class="leftgroup">
          <span class="title">预约/邀请时间：</span>
          <el-date-picker v-model="validateTimeStart"
                          type="datetime"
                          size="small"
                          class="time-interal-date"
                          style="margin-left: 13px;"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <span class="time-line">-</span>
          <el-date-picker v-model="validateTimeEnd"
                          type="datetime"
                          size="small"
                          class="time-interal-date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <el-button :disabled="!$common.getAuthIsOwn('预约邀请记录','isShow')"
                     type="primary"
                     size="mini">数据统计</el-button>
        </div>
        <!-- <div> -->
        <div class="rightgroup">
          <span class="title">访客姓名：</span>
          <el-input class="input staffNameInput"
                    v-model="staffName"></el-input>
          <el-button :disabled="!$common.getAuthIsOwn('预约邀请记录','isShow')"
                     type="primary"
                     @click="queryBtnAct"
                     icon="el-icon-search"
                     size="small">检索</el-button>
          <el-button :disabled="!$common.getAuthIsOwn('预约邀请记录','isShow')"
                     type="primary"
                     v-popover:popover1
                     size="small">其他条件检索</el-button>
          <el-popover ref="popover1"
                      placement="bottom-end"
                      :visible-arrow="false"
                      width="600"
                      trigger="click">
            <search-a-i-record @query="queryAct" />
          </el-popover>
        </div>
        <!-- </div> -->
      </div>
      <el-table ref="AppointInviteRecordTable"
                :data="tableData"
                tooltip-effect="dark"
                class="tableBoxClass"
                @sort-change="sortChange"
                @selection-change="handleSelectionChange">
        <el-table-column type="index"
                         :index="tableIndex"
                         label="序号"
                         width="55"></el-table-column>
        <el-table-column prop="reservationDatetime"
                         show-overflow-tooltip
                         label="预约/邀请时间"></el-table-column>
        <el-table-column prop="visitorName"
                         label="访客姓名"
                         width="90"></el-table-column>
        <el-table-column prop="phoneNo"
                         label="访客手机"></el-table-column>
        <el-table-column prop="plateNo"
                         label="访客车牌"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="staffName"
                         label="被访人姓名"></el-table-column>
        <el-table-column prop="staffPhoneNo"
                         label="被访人手机"></el-table-column>
        <el-table-column prop="estimatedDatetimeArrive"
                         label="预计到达时间"
                         show-overflow-tooltip
                         sortable="custom"></el-table-column>
        <el-table-column prop="estimatedDatetimeLeave"
                         label="预计离开时间"
                         show-overflow-tooltip
                         sortable="custom"></el-table-column>
        <el-table-column prop="deviceName"
                         label="预约设备"></el-table-column>
        <el-table-column prop="source"
                         label="预约途径">
          <template slot-scope="scope">{{$common.getEnumItemName("visitor_singon_ways", scope.row.source)}}</template>
        </el-table-column>
        <el-table-column prop="approveState"
                         label="审批状态">
          <template slot-scope="scope">{{$common.getEnumItemName("reservation_record_s", scope.row.approveState)}}</template>
        </el-table-column>
        <el-table-column prop="visitState"
                         label="来访状态">
          <template slot-scope="scope">{{$common.getEnumItemName("visitor_record_s", scope.row.visitState)}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="tableCertificateBtnClass">
              <span :class="$common.getAuthIsOwn('预约邀请记录', 'isShow')?'cursorClass':'disabled'"
                    @click="detailBtnAct(scope.row)"
                    class="editFontClass">详情</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <vistor-a-i-detail :visible="isShow"
                         :vistorAIDetail="vistorAIDetail"
                         @close="closeDetail"
                         @showStaffDetail="showStaffDetail"></vistor-a-i-detail>
      <component v-show="isStaffDetailShow"
                 :visible.sync="isStaffDetailShow"
                 :defaultResident="residentDetail"
                 :is="tabMap[staffType]"
                 @close="closeStaffDetail"></component>
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
  </div>
</template>

<script>
import SearchAIRecord from "../../components/vistorRecord/SearchAIRecord";
import VistorAIDetail from "../../components/vistorRecord/VistorAIDetail";
import staffDetailDialog from "@/pages/personMange/components/staffDetailDialog.vue";
import residentDetailDialog from "@/pages/residentManage/components/TheResidentDetailDialog.vue";
import * as api from "../../utils/ajax";
export default {
  components: {
    SearchAIRecord,
    VistorAIDetail,
    staffDetailDialog,
    residentDetailDialog
  },
  props: {},
  data() {
    return {
      forbidBtnArr: window.config.forbidBtnArr,
      signOffBtnArr: window.config.signOffBtnArr,
      tableData: [],
      selectDate: "",
      validateTimeStart: null,
      validateTimeEnd: null,
      staffName: null,
      currentPage: 1,
      pageSize: 15,
      total: 0,
      isShow: false,
      vistorAIDetail: {},
      showloading: false,
      staffType: "staff",
      tabMap: {
        staff: "staffDetailDialog",
        resident: "residentDetailDialog"
      },
      isStaffDetailShow: false,
      residentDetail: {},
      otherSearchData: {},
      ShowAuthDisabled: false,
      OwnAuthDisabled: false
    };
  },
  created() {},
  mounted() {
    let h =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    this.$refs.AppointInviteRecordTable.$el.style.height = h - 315 + "px";
    // 这里 -1 是为了去掉表头高度
    this.pageSize = parseInt((h - 315) / 50) - 1;
    console.log(this.pageSize);
    // 当窗口发生变化时
    let that = this;
    window.addEventListener("resize", function() {
      let h =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      that.$refs.AppointInviteRecordTable.$el.style.height = h - 315 + "px";
      that.pageSize = parseInt((h - 315) / 50) - 1;
      console.log(that.pageSize);
    });
    // this.initData();
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("预约邀请记录", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("预约邀请记录", "isOwn");
  },
  activated() {
    this.currentPage = 1;
    this.initData();
  },
  methods: {
    justifyForbidBtnTxt(rowData) {
      // rowData.validDatetimeEnd
      let validDatetimeEnd = new Date(rowData.validDatetimeEnd).getTime();
      let currentDateTime = new Date().getTime();
      return currentDateTime < validDatetimeEnd;
    },
    showStaffDetail(type, data, isBool) {
      this.isStaffDetailShow = true;
      this.staffType = type;
      this.residentDetail = data;
      this.residentDetail.addressString = data.address;
    },
    closeStaffDetail() {
      this.isStaffDetailShow = false;
    },
    initData() {
      var params = {
        limit: this.pageSize,
        page: this.currentPage
      };
      Object.assign(params, this.otherSearchData);
      console.log(params);
      // 查询数据的接口函数
      this.showloading = !this.showloading;
      api
        .getVistorAIRecordListUrl(params)
        .then(res => {
          this.showloading = false;
          if (res && res.data.success && res.data.data) {
            this.tableData = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            this.$message({ type: "error", message: "没有找到相关访客记录" });
          }
        })
        .catch(error => {
          this.showloading = false;
          console.error(error);
        });
    },
    closeDetail(isBool) {
      this.isShow = !this.isShow;
      this.closeStaffDetail();
      if (isBool) {
        this.initData();
      }
    },
    sortChange(column) {
      console.log(column);
      column.order = column.order === "ascending" ? "asc" : column.order;
      column.order = column.order === "descending" ? "desc" : column.order;
      var data = {
        order: column.prop,
        sort: column.order
      };
      Object.assign(this.otherSearchData, data);
      this.initData();
    },
    // 详情
    detailBtnAct(rowData) {
      this.showloading = !this.showloading;
      api
        .getVistorAIRecordDetailUrl({ recordUuid: rowData.recordUuid })
        .then(res => {
          this.showloading = false;
          if (res.data.success) {
            this.isShow = !this.isShow;
            this.vistorAIDetail = res.data.data;
            this.vistorAIDetail.visitState = rowData.visitState;
            this.vistorAIDetail.estimatedDatetimeLeave =
              rowData.estimatedDatetimeLeave;
            this.vistorAIDetail.signOff =
              res.data.data.manualSignOff &&
              Boolean(this.signOffBtnArr.indexOf(rowData.visitState) !== -1);
            this.vistorAIDetail.forbid =
              Boolean(this.forbidBtnArr.indexOf(rowData.visitState) !== -1) ||
              (Boolean(rowData.visitState === "comed") &&
                this.justifyForbidBtnTxt(this.vistorAIDetail));
            this.vistorAIDetail.recordUuid = rowData.recordUuid;
            console.log(this.vistorAIDetail);
          } else {
            this.$message({ type: "error", message: "没有找到该记录的详情" });
          }
        })
        .catch(err => {
          this.showloading = false;
          console.error(err);
        });
    },
    queryBtnAct() {
      this.currentPage = 1;
      Object.assign(this.otherSearchData, {
        reservationDatetimeBegin: this.validateTimeStart,
        reservationDatetimeEnd: this.validateTimeEnd,
        visitorName: this.staffName
      });
      this.initData();
    },
    // 检索按钮事件
    queryAct(data) {
      this.currentPage = 1;
      Object.assign(this.otherSearchData, data);
      this.initData();
    },
    handleCurrentChange(val) {
      console.log("当前页面变化的回调函数");
      this.checkedAll = false;
      this.currentPage = val;
      this.initData();
    },
    handleSizeChange() {
      console.log("每一页数量变化时的回调函数");
    },
    // table表格的选择
    handleSelectionChange(val) {
      console.log(val);
    },
    tableIndex(val) {
      val += 1;
      return val < 10 ? "0" + val : val;
    }
  },
  watch: {
    staffName(val) {
      this.otherSearchData.visitorName = val;
    }
  },
  destroyed() {}
};
</script>
<style>
.AppointInviteRecord .rightgroup {
  display: inline-block;
}
.AppointInviteRecord .leftgroup .title,
.AppointInviteRecord .rightgroup .title {
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ffffff;
}
.AppointInviteRecord
  .el-radio-button__orig-radio:checked
  + .el-radio-button__inner {
  color: #ffffff;
  background-color: rgba(40, 255, 187, 0.08);
  border: 0;
  border-bottom: 1px solid rgba(38, 211, 157, 0.5);
  border-right: 1px solid transparent;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.AppointInviteRecord .el-radio-button__inner {
  background: rgba(255, 255, 255, 0.05);
  border: 0;
  border-bottom: 1px solid transparent;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ffffff;
  text-align: center;
  min-width: 78px;
  /* display: block; */
  padding: 8px 34%;
}
.AppointInviteRecord .otherDay .el-radio-button__inner {
  background: rgba(255, 255, 255, 0.05);
  border: 0;
  border-bottom: 1px solid transparent;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ffffff;
  text-align: center;
  padding: 8px 32px;
}
.AppointInviteRecord .el-radio-button:first-child .el-radio-button__inner {
  border-left: 0;
  border-radius: 4px 0 0 4px;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
.AppointInviteRecord .el-input--prefix .el-input__inner {
  padding-left: 12px;
}
.AppointInviteRecord .el-input--suffix .el-input__inner {
  padding-right: 0px;
}
.AppointInviteRecord .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 180px;
}
.AppointInviteRecord .el-icon-time:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 120%;
}
.AppointInviteRecord .el-button--primary,
.AppointInviteRecord .el-button--primary:hover,
.AppointInviteRecord .el-button--primary:active,
.AppointInviteRecord .el-button--primary:focus {
  font-family: "PingFangSC-Regular";
  font-size: 16px;
  height: 34px;
  background: rgba(40, 255, 187, 0.08);
  border: 0 solid rgba(38, 211, 157, 0.8);
  border-radius: 2px;
  border-radius: 2px;
  margin-left: 20px;
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ffffff;
}
.AppointInviteRecord .staffNameInput {
  width: 160px;
  display: inline-block;
  margin-right: 15px;
}
.AppointInviteRecord .editFontClass {
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #26d39d;
  margin: 0 10px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/style/variables.scss";
.AppointInviteRecord {
  height: 100%;
  color: #dddddd;
  .header {
    height: 50px;
    padding: 15px 40px;
    background: #212325;
    box-sizing: border-box;
    div {
      font-family: "PingFangSC-Regular";
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0;
      box-sizing: border-box;
      border-left: 3px solid #26d39d;
      padding-left: 9px;
    }
  }
  .main {
    background: #212325;
    margin-top: 16px;
    padding: 18px 2.4%;
    .time-line {
      border-width: 1px 0px 0px 0px;
      width: 8px;
      color: rgba(255, 255, 255, 0.15);
    }
    .main-header {
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
    }
    .footer {
      text-align: right;
    }
  }
}
</style>
