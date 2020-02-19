<template>
  <div class="VistorRecord"
       v-loading="showloading">
    <div class="header">
      <div>访客记录</div>
    </div>
    <div class="main">
      <div class="main-header">
        <div class="leftgroup">
          <el-radio-group v-model="selectDate"
                          @change="selectDateChangeAct">
            <el-radio-button label="lastday">昨日</el-radio-button>
            <el-radio-button label="today">今日</el-radio-button>
            <el-radio-button label="lastMonth">上月</el-radio-button>
            <el-radio-button label="thisMonth">本月</el-radio-button>
            <el-radio-button label="otherDay"
                             class="otherDay">其他时间段</el-radio-button>
          </el-radio-group>
          <el-date-picker v-model="validateTimeStart"
                          type="datetime"
                          v-if="selectDate==='otherDay'"
                          size="small"
                          class="time-interal-date"
                          style="margin-left: 13px;"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <span class="time-line"
                v-if="selectDate==='otherDay'">-</span>
          <el-date-picker v-model="validateTimeEnd"
                          type="datetime"
                          v-if="selectDate==='otherDay'"
                          size="small"
                          class="time-interal-date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <el-button :disabled="!$common.getAuthIsOwn('访客记录', 'isShow')"
                     type="primary"
                     size="mini">数据统计</el-button>
        </div>
        <!-- <div> -->
        <div class="rightgroup">
          <span class="title">访客姓名：</span>
          <el-input class="input staffNameInput"
                    v-model="staffName"></el-input>
          <el-button :disabled="!$common.getAuthIsOwn('访客记录', 'isShow')"
                     type="primary"
                     @click="queryBtnAct"
                     icon="el-icon-search"
                     size="small">检索</el-button>
          <el-button :disabled="!$common.getAuthIsOwn('访客记录', 'isShow')"
                     type="primary"
                     v-popover:popover1
                     size="small">其他条件检索</el-button>
          <el-popover ref="popover1"
                      placement="bottom-end"
                      :visible-arrow="false"
                      width="300"
                      trigger="click">
            <search-option-view @query="queryAct"></search-option-view>
          </el-popover>
        </div>
        <!-- </div> -->
      </div>
      <el-table ref="vistorRecordTable"
                :data="tableData"
                tooltip-effect="dark"
                class="tableBoxClass"
                @selection-change="handleSelectionChange">
        <el-table-column type="index"
                         :index="tableIndex"
                         label="序号"
                         width="55"></el-table-column>
        <el-table-column prop="visitorName"
                         label="姓名"
                         width="100"></el-table-column>
        <el-table-column prop="gender"
                         label="性别"
                         width="80">
          <template slot-scope="scope">{{$common.getEnumItemName("gender", scope.row.gender)}}</template>
        </el-table-column>
        <el-table-column prop="phoneNo"
                         label="手机号码"
                         width="120"></el-table-column>
        <el-table-column prop="plateNo"
                         label="车牌号码"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="regDeviceNickName"
                         show-overflow-tooltip
                         label="登记设备"></el-table-column>
        <el-table-column prop="source"
                         label="登记途径">
          <template slot-scope="scope">{{$common.getEnumItemName("visitor_singon_ways", scope.row.source)}}</template>
        </el-table-column>
        <el-table-column prop="regDatetime"
                         label="登记时间"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="staffName"
                         label="被访人员"></el-table-column>
        <el-table-column prop="reason"
                         label="来访事由"></el-table-column>
        <el-table-column prop="visitState"
                         label="访客状态">
          <template slot-scope="scope">{{$common.getEnumItemName("visitor_record_s", scope.row.visitState)}}</template>
        </el-table-column>
        <el-table-column label="操作"
                         min-width="220">
          <template slot-scope="scope">
            <div class="tableCertificateBtnClass">
              <span @click="detailBtnAct(scope.row)"
                    class="editFontClass cursorClass">详情</span>
              <span :class="OwnAuthDisabled?'cursorClass':'disabled'"
                    v-if="scope.row.signOff"
                    @click="signOffBtnAct(scope.row)"
                    class="editFontClass">签离</span>
              <span v-if="scope.row.forbid"
                    @click="forbidBtnAct(scope.row)"
                    :class="OwnAuthDisabled?'cursorClass':'disabled'"
                    class="deleteBtnClass">{{forbidBtnTxt}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <vistor-record-detail :visible="isShow"
                            :ShowAuthDisabled="ShowAuthDisabled"
                            :OwnAuthDisabled="OwnAuthDisabled"
                            :VistorRecordDetail="VistorRecordDetail"
                            @signoffAct="signOffBtnAct"
                            @signOnBlacklistAct="initData"
                            @forbidBtnAct="forbidBtnAct"
                            @showStaffDetail="showStaffDetail"
                            @close="closeDetail"></vistor-record-detail>
      <component v-show="isStaffDetailShow"
                 :visible.sync="isStaffDetailShow"
                 :defaultResident="residentDetail"
                 :is="tabMap[staffType]"
                 @close="closeStaffDetail()"></component>
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
import SearchOptionView from "../../components/vistorRecord/SearchOptionView";
import VistorRecordDetail from "../../components/vistorRecord/VistorRecordDetail";
import staffDetailDialog from "@/pages/personMange/components/staffDetailDialog.vue";
import residentDetailDialog from "@/pages/residentManage/components/TheResidentDetailDialog.vue";
import * as api from "../../utils/ajax";
export default {
  components: {
    SearchOptionView,
    VistorRecordDetail,
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
      pageSize: 14,
      total: 0,
      isShow: false,
      VistorRecordDetail: {},
      showloading: false,
      staffType: "staff",
      tabMap: {
        staff: "staffDetailDialog",
        resident: "residentDetailDialog"
      },
      isStaffDetailShow: false,
      residentDetail: {},
      forbidBtnTxt: "回收通行权限",
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
    this.$refs.vistorRecordTable.$el.style.height = h - 315 + "px";
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
      that.$refs.vistorRecordTable.$el.style.height = h - 315 + "px";
      that.pageSize = parseInt((h - 315) / 50) - 1;
      console.log(that.pageSize);
    });
    // this.initData();
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("访客记录", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("访客记录", "isOwn");
  },
  activated() {
    console.log(this.$route.params.data, "---------openDoor-------");
    var params = this.$route.params.data;
    var data = {};
    if (params && params.visitorUuid) {
      data.visitorUuid = params.visitorUuid;
    }
    this.currentPage = 1;
    Object.assign(this.otherSearchData, data);
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
      console.log(type, data, isBool);
      this.isStaffDetailShow = isBool;
      this.staffType = type;
      this.residentDetail = data;
      this.residentDetail.addressString = data.address;
    },
    closeStaffDetail() {
      this.isStaffDetailShow = false;
    },
    selectDateChangeAct(value) {
      console.log("value-----", value, "----------", this.selectDate);
      this.transSelectDate(this.selectDate);
      Object.assign(this.otherSearchData, {
        regDatetimeBegin: this.validateTimeStart,
        regDatetimeEnd: this.validateTimeEnd
      });
      this.initData();
    },
    transSelectDate(value) {
      let day = new Date();
      switch (value) {
        case "lastday":
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
    },
    initData() {
      if (!this.$common.getAuthIsOwn("访客记录", "isShow")) return;
      var params = {
        limit: this.pageSize,
        page: this.currentPage
      };
      Object.assign(params, this.otherSearchData);
      console.log(params);
      this.showloading = !this.showloading;
      // 查询数据的接口函数
      api
        .getVistorRecord(params)
        .then(res => {
          this.showloading = false;
          if (res.data.success && res.data.data) {
            this.tableData = res.data.data.list;
            for (let i = 0; i < this.tableData.length; i++) {
              let item = this.tableData[i];
              // 判断是否需要签离 处理已到访，超出有效期后 权限回收的问题
              item.signOff =
                item.manualSignOff &&
                Boolean(this.signOffBtnArr.indexOf(item.visitState) !== -1);
              let isOvertime = this.justifyForbidBtnTxt(item);
              item.forbid =
                Boolean(this.forbidBtnArr.indexOf(item.visitState) !== -1) ||
                (Boolean(item.visitState === "comed") && isOvertime);
            }
            this.total = res.data.data.total;
          } else {
            this.$message({ type: "error", message: "没有找到相关访客记录" });
          }
        })
        .catch(err => {
          this.showloading = false;
          console.error(err);
        });
    },
    closeDetail() {
      this.isShow = !this.isShow;
      this.isStaffDetailShow = false;
    },
    // 详情
    detailBtnAct(rowData) {
      if (!this.$common.getAuthIsOwn("访客记录", "isShow")) return;
      // 请求数据
      this.showloading = !this.showloading;
      api
        .getVistorRecordDetail({ recordUuid: rowData.recordUuid })
        .then(res => {
          this.showloading = false;
          if (res.data && res.data.success && res.data.data) {
            this.VistorRecordDetail = res.data.data;
            this.VistorRecordDetail.vistorState = rowData.visitState;
            this.VistorRecordDetail.recordUuid = rowData.recordUuid;
            this.VistorRecordDetail.signOff = rowData.signOff;
            this.VistorRecordDetail.forbid = rowData.forbid;
            console.log(this.VistorRecordDetail);
            this.isShow = !this.isShow;
          } else {
            this.$message({ type: "warning", message: "没有找到访客记录详情" });
          }
        })
        .catch(err => {
          this.showloading = !this.showloading;
          console.error(err);
        });
    },
    // 禁止通行
    forbidBtnAct(rowData) {
      console.log("禁止通信");
      if (!this.$common.getAuthIsOwn("访客记录", "isOwn")) return;

      if (rowData.recordUuid) {
        rowData.visitRecordUuid = rowData.recordUuid;
      } else {
        this.$message({ type: "error", message: "记录UUid为空" });
        return;
      }
      this.showloading = !this.showloading;
      api
        .putVistorForBiddenUrl(rowData)
        .then(res => {
          this.showloading = false;
          if (res.data.success && res.data.data) {
            this.$message({ type: "success", message: "权限已经回收" });
            this.initData();
          } else {
            this.$message({ type: "error", message: "权限回收失败" });
          }
        })
        .catch(err => {
          this.showloading = !this.showloading;
          console.error(err);
        });
    },
    // 签离
    signOffBtnAct(rowData) {
      if (!this.$common.getAuthIsOwn("访客记录", "isOwn")) return;
      console.log("签离", rowData);
      this.showloading = !this.showloading;
      api
        .putPlatformVistorSignOffUrl({ visitRecordUuid: rowData.recordUuid })
        .then(res => {
          this.showloading = false;
          if (res.data.success && res.data.data) {
            this.$message({ type: "success", message: "签离成功" });
            this.initData();
          } else {
            this.$message({ type: "error", message: "签离失败" });
          }
        })
        .catch(err => {
          this.showloading = !this.showloading;
          console.error(err);
        });
    },
    // 检索按钮事件
    queryAct(value) {
      console.log("接收其他检索条件", value);
      this.currentPage = 1;
      value.visitorUuid = null;
      Object.assign(this.otherSearchData, value);
      this.initData();
    },
    queryBtnAct() {
      var data = {};
      if (this.selectDate === "otherDay") {
        data.regDatetimeBegin = this.validateTimeStart;
        data.regDatetimeEnd = this.validateTimeEnd;
      } else {
        this.selectDate = "";
      }
      if (this.staffName) {
        data.visitorName = this.staffName;
      }
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
.VistorRecord .editFontClass {
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #26d39d;
  margin: 0 10px;
}
.VistorRecord .deleteBtnClass {
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ff5f5f;
}
.VistorRecord .rightgroup {
  display: inline-block;
}
.VistorRecord .rightgroup .title {
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ffffff;
}
.VistorRecord .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: #ffffff;
  background-color: rgba(40, 255, 187, 0.08);
  border: 0;
  border-bottom: 1px solid rgba(38, 211, 157, 0.5);
  border-right: 1px solid transparent;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.VistorRecord .el-radio-button__inner {
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
.VistorRecord .otherDay .el-radio-button__inner {
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
.VistorRecord .el-radio-button:first-child .el-radio-button__inner {
  border-left: 0;
  border-radius: 4px 0 0 4px;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
.VistorRecord .el-input--prefix .el-input__inner {
  padding-left: 12px;
}
.VistorRecord .el-input--suffix .el-input__inner {
  padding-right: 0px;
}
.VistorRecord .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 180px;
}
.VistorRecord .el-icon-time:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 120%;
}
.VistorRecord .el-button--primary,
.VistorRecord .el-button--primary:hover,
.VistorRecord .el-button--primary:active,
.VistorRecord .el-button--primary:focus {
  font-family: "PingFangSC-Regular";
  height: 34px;
  background: rgba(40, 255, 187, 0.08);
  border: 0 solid rgba(38, 211, 157, 0.8);
  border-radius: 2px;
  border-radius: 2px;
  margin-left: 10px!important;
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ffffff;
}
.VistorRecord .staffNameInput {
  width: 160px;
  display: inline-block;
  margin-right: 15px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/style/variables.scss";
.VistorRecord {
  height: 100%;
  color: #dddddd;
  .header {
    height: 50px;
    padding: 15px 40px;
    box-sizing: border-box;
    background: #212325;
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
