<template>
  <div class="BlacklistAlarm"
       v-loading="showloading">
    <div class="header">
      <div>黑名单报警记录</div>
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
          <el-button :disabled="!ShowAuthDisabled"
                     type="primary"
                     size="mini">数据统计</el-button>
        </div>
        <!-- <div> -->
        <div class="rightgroup">
          <span class="title">姓名：</span>
          <el-input class="input staffNameInput"
                    v-model="staffName"></el-input>
          <el-button :disabled="!ShowAuthDisabled"
                     type="primary"
                     @click="queryBtnAct"
                     icon="el-icon-search"
                     size="small">检索</el-button>
          <el-button :disabled="!ShowAuthDisabled"
                     type="primary"
                     v-popover:popover1
                     size="small">其他条件检索</el-button>
          <el-popover ref="popover1"
                      placement="bottom-end"
                      :visible-arrow="false"
                      width="300"
                      trigger="click">
            <blacklist-alarm-search @query="queryAct"></blacklist-alarm-search>
          </el-popover>
        </div>
        <!-- </div> -->
      </div>
      <el-table ref="BlacklistAlarmTable"
                :data="tableData"
                tooltip-effect="dark"
                class="tableBoxClass"
                @selection-change="handleSelectionChange">
        <el-table-column type="index"
                         :index="tableIndex"
                         label="序号"
                         width="55"></el-table-column>
        <el-table-column prop="resName"
                         label="姓名"></el-table-column>
        <el-table-column prop="source"
                         label="黑名单来源">
          <template slot-scope="scope">
            <div>{{scope.row.extInfo &&scope.row.extInfo.source?$common.getEnumItemName("blacklistSource", scope.row.extInfo.source):''}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="resType"
                         label="报警原因"
                         :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div>{{scope.row.extInfo&&scope.row.extInfo.reason?$common.getEnumItemName("blacklist_trigger_reason", scope.row.extInfo.reason):''}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="address"
                         label="报警地点"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.extInfo&&scope.row.extInfo.deviceName?scope.row.extInfo.deviceName:''}}</template>
        </el-table-column>
        <el-table-column prop="alarmTime"
                         label="报警时间"></el-table-column>
        <el-table-column prop="dealState"
                         label="处理状态">
          <template slot-scope="scope">
            <div>{{$common.getEnumItemName("alarm_r",scope.row.dealState)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="valided"
                         label="报警有效性">
          <template slot-scope="scope">
            <div>{{scope.row.valided?'有效':'误报'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="tableCertificateBtnClass">
              <span :class="ShowAuthDisabled?'cursorClass':''"
                    @click="detailBtnAct(scope.row)"
                    class="editFontClass">详情</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <blacklist-alarm-detail :OwnAuthDisabled="OwnAuthDisabled"
                              :visible="isShow"
                              :defaultAlarmDetail="rowData"
                              @close="closeDetail"></blacklist-alarm-detail>

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
import BlacklistAlarmSearch from "../../components/vistorBlacklist/BlacklistAlarmSearch";
import BlacklistAlarmDetail from "../../components/vistorBlacklist/BlacklistAlarmDetail";
import * as api from "../../utils/ajax";
export default {
  components: { BlacklistAlarmSearch, BlacklistAlarmDetail },
  props: {},
  data() {
    return {
      tableData: window.config.tableData,
      selectDate: "",
      validateTimeStart: null,
      validateTimeEnd: null,
      staffName: "",
      currentPage: 1,
      pageSize: 15,
      total: 0,
      isShow: false,
      rowData: {},
      showloading: false,
      otherSearchData: {},
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("黑名单报警", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("黑名单报警", "isOwn");
    let h =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    this.$refs.BlacklistAlarmTable.$el.style.height = h - 295 + "px";
    // 这里 -1 是为了去掉表头高度
    this.pageSize = parseInt((h - 295) / 50) - 1;
    console.log(this.pageSize);
    // 当窗口发生变化时
    let that = this;
    window.addEventListener("resize", function() {
      let h =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      that.$nextTick(() => {
        that.$refs.BlacklistAlarmTable.$el.style.height = h - 295 + "px";
      });
      that.pageSize = parseInt((h - 295) / 50) - 1;
      console.log(that.pageSize);
    });
  },
  activated() {
    console.log(this.$route.params.data, "---------blacklistAlarm-------");
    var params = this.$route.params.data;
    var data = {};
    if (params && params.blacklistUuid) {
      data.resUuid = params.blacklistUuid;
    }
    this.currentPage = 1;
    Object.assign(this.otherSearchData, data);
    if (this.ShowAuthDisabled) {
      this.initData();
    }
  },
  methods: {
    selectDateChangeAct(value) {
      console.log(value);
      this.transSelectDate(this.selectDate);
      Object.assign(this.otherSearchData, {
        beginTime: this.validateTimeStart,
        endTime: this.validateTimeEnd
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
      if (!this.ShowAuthDisabled) {
        return;
      }
      var params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      Object.assign(params, this.otherSearchData);
      console.log(params);
      this.showloading = !this.showloading;
      // 查询数据的接口函数
      api.getBlacklistAlarmListUrl(params).then(res => {
        this.showloading = !this.showloading;
        if (res.data.success && res.data.data) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message({ type: "error", message: "没有找到相关报警记录" });
        }
      });
    },
    closeDetail(evt) {
      this.isShow = false;
      if (evt === "init") {
        this.initData();
      }
    },
    // 详情
    detailBtnAct(rowData) {
      if (!this.ShowAuthDisabled) return;
      this.rowData = rowData;
      api.getBlacklistAlarmDetailUrl(rowData.alarmUuid).then(res => {
        if (res.data.success && res.data.data) {
          this.rowData = res.data.data;
          console.log(this.rowData);
          this.isShow = !this.isShow;
        } else {
          this.$message({ type: "error", message: "详情失败" });
        }
      });
    },
    queryBtnAct() {
      var data = {};
      if (this.selectDate === "otherDay") {
        data.beginTime = this.validateTimeStart;
        data.endTime = this.validateTimeEnd;
      } else {
        this.selectDate = "";
      }
      if (this.staffName) {
        data.resName = this.staffName;
      }
      this.currentPage = 1;
      Object.assign(this.otherSearchData, data);
      this.initData(data);
    },
    // 检索按钮事件
    queryAct(value) {
      console.log("接收其他检索条件", value);
      this.currentPage = 1;
      Object.assign(this.otherSearchData, value);
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
      this.otherSearchData.resName = val;
    }
  },
  destroyed() {}
};
</script>
<style>
.BlacklistAlarm .editFontClass {
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #26d39d;
  margin: 0 10px;
}
.BlacklistAlarm .deleteBtnClass {
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ff5f5f;
}
.BlacklistAlarm .rightgroup {
  display: inline-block;
}
.BlacklistAlarm .rightgroup .title {
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ffffff;
}
.BlacklistAlarm .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: #ffffff;
  background-color: rgba(40, 255, 187, 0.08);
  border: 0;
  border-bottom: 1px solid rgba(38, 211, 157, 0.5);
  border-right: 1px solid transparent;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.BlacklistAlarm .el-radio-button__inner {
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
.BlacklistAlarm .otherDay .el-radio-button__inner {
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
.BlacklistAlarm .el-radio-button:first-child .el-radio-button__inner {
  border-left: 0;
  border-radius: 4px 0 0 4px;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
.BlacklistAlarm .el-input--prefix .el-input__inner {
  padding-left: 12px;
}
.BlacklistAlarm .el-input--suffix .el-input__inner {
  padding-right: 0px;
}
.BlacklistAlarm .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 180px;
}
.BlacklistAlarm .el-icon-time:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 120%;
}
.BlacklistAlarm .el-button--primary,
.BlacklistAlarm .el-button--primary:hover,
.BlacklistAlarm .el-button--primary:active,
.BlacklistAlarm .el-button--primary:focus {
  font-family: "PingFangSC-Regular";
  font-size: 16px;
  height: 34px;
  background: rgba(40, 255, 187, 0.08);
  border: 0 solid rgba(38, 211, 157, 0.8);
  border-radius: 2px;
  border-radius: 2px;
  margin-left: 10px;
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ffffff;
}
.BlacklistAlarm .staffNameInput {
  width: 160px;
  display: inline-block;
  margin-right: 15px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/style/variables.scss";
.BlacklistAlarm {
  // min-width: 1440px;
  // overflow-x: auto;
  height: 100%;
  color: #dddddd;
  .header {
    // min-width: 1360px;
    // overflow-x: auto;
    height: 50px;
    padding: 15px 40px;
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
    // min-width: 1360px;
    // overflow-x: auto;
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
