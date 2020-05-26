<template>
  <div class="warmRecord-main">
    <people-open-detail-dialog :isShow="isShowPeopleOpen"
                               ref="peopleOpenDialog"
                               @onCancel="onCancelDialog('staff_group')" />
    <div class="access-search"
         style="margin-bottom: 14px;">
      <span class='topTitleTxt left-space'>请选时间段：</span>
      <el-date-picker v-model="beginTime"
                      type="datetime"
                      class="time-interal-date"
                      size="small"
                      @focus="changeTime"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
      <div class="time-line"></div>
      <el-date-picker v-model="endTime"
                      style="margin-right: 40px"
                      type="datetime"
                      class="time-interal-date"
                      @focus="changeTime"
                      placeholder="选择日期"
                      size="small"
                      value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
      <el-radio-group v-model="selectDate"
                      @change="selectDateChangeAct"
                      style="width: 420px;overflow: hidden;">
        <el-radio-button label="today">今日</el-radio-button>
        <el-radio-button label="lastday">昨日</el-radio-button>
        <el-radio-button label="thisWeek">本周</el-radio-button>
        <el-radio-button label="thisMonth">本月</el-radio-button>
        <!--  <el-radio-button label="otherDay">其他时间段</el-radio-button> -->
      </el-radio-group>
      <span class='topTitleTxt'>预警人姓名：</span>
      <el-input v-model="staffName"
                @keyup.enter.native="queryAct"
                class="time-interal"
                size="small"></el-input>
      <div class="search-btn">
        <el-button @click="queryAct"
                   size="small"
                   type="primary">检索</el-button>
        <el-button @click="resetData"
                   size="small"
                   type="primary">重置</el-button>
        <el-button @click="exportExcel"
                   size="small"
                   :disabled="!OwnAuthDisabled"
                   type="primary">导出</el-button>
      </div>

    </div>
    <div class="access-search access-search2">
      <span class='topTitleTxt'>请选择门：</span>
      <div @click="chooseBtn2">
        <el-input v-model="doorCheckedName"
                  :clearable="false"
                  suffix-icon="el-icon-caret-bottom"
                  placeholder="请选择门"></el-input>
      </div>
      <span class='topTitleTxt'>请选择住址：</span>
      <multi-popover-tree treeType="residentTree"
                          placeholderTxt="房间号允许多选"
                          :initData="initData1"
                          :topCheckedNodeTitle="topCheckedNodeTitle"
                          :houseName="houseName"
                          @transferData="transferCheckedData"
                          :checkedNodes="checkeTreedNodes"></multi-popover-tree>
      <span style="margin-right:45px"></span>
      <span class='topTitleTxt'>请选择预警主题：</span>
      <!--  <el-input v-model="warningPlanSubject"
                @keyup.enter.native="queryAct"
                class="time-interal"
                size="small"></el-input> -->
      <el-select v-model="warningPlanSubject"
                 collapse-tags
                 multiple
                 placeholder="请选择主题">
        <el-option v-for="item in themeList"
                   :key="item.warningPlanUuid"
                   :label="item.subject"
                   :value="item.warningPlanUuid">
        </el-option>
      </el-select>
    </div>
    <div class="face-table">
      <el-scrollbar style="height: 92%;transition:0.2s">
        <el-table :data="tableData"
                  style="width: 100%"
                  v-loading="isLoading"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"
                           width="100"></el-table-column>
          <el-table-column type="index"
                           label="序号"
                           :index="indexMethod"
                           width="90">
          </el-table-column>
          <el-table-column prop="warningPlanSubject"
                           label="预警主题"
                           show-overflow-tooltip
                           width="120">
          </el-table-column>
          <el-table-column prop="staffName"
                           label="预警人"
                           show-overflow-tooltip
                           width="220">
          </el-table-column>
          <el-table-column prop="doorName"
                           label="预警位置"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createTime"
                           label="预警时间"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="resName"
                           label="验证方式"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              {{$common.transferValidateType(scope.row.verificationMode)}}
            </template>
          </el-table-column>
          <el-table-column prop="tags"
                           label="人员标签"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.tags"
                    :key="index">
                {{item.tagName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="infrastructureUri"
                           label="住址"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="alarmLevel"
                           label="操作"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="level-div"
                   style="color: #26D39D;"
                   @click="lookDetail(scope.row)">
                查看
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
    <tab-tree-tag title="请选择门"
                  rightTxt="已选的门"
                  :tabs="tabs2"
                  :modal="false"
                  :isShow.sync="chooseVisible2"
                  :checkedList="doorList"
                  @onConfirm="doorConfirm"></tab-tree-tag>

    <!--     <div style="height:40px;"></div> -->
  </div>
</template>

<script>
import PeopleOpenDetailDialog from "@/pages/doorControl/components/PeopleWarmRecordDialog";
import MultiPopoverTree from "@/common/MultiPopoverTree.vue";
import tabTreeTag from "@/common/TabTreeTag";

export default {
  components: {
    PeopleOpenDetailDialog,
    MultiPopoverTree,
    tabTreeTag
  },
  props: {
    topCheckedNodeTitle: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isLoading: false,
      themeList: [],
      staffName: "",
      warningPlanSubject: "",
      stompClient: null,
      doorCheckedId: [],
      doorCheckedName: "",
      doorList: [],
      chooseVisible2: false,
      checkeTreedNodes: [],
      addressOrgList: [],
      houseName: "",
      initData1: [],
      isShowPeopleOpen: false,
      selectDate: "",
      pageInfo: {
        total: 0,
        pageSize: 13,
        currentPage: 1
      },
      resName: "",
      beginTime: "",
      endTime: "",
      subtype: "",
      alarmTypeOptions: [],
      dealState: "",
      handleStatusOptions: [],
      tableData: [],
      warmUuidList: [],
      tabs2: [
        {
          id: "1",
          label: "设备树",
          treeType: "orgAndDev",
          treeRef: "tree1",
          nodeKey: "id"
        }
      ],
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
    };
  },
  created() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("人员预警记录", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("人员预警记录", "isOwn");
  },
  activated() {
    // this.connectSocket();
    // this.getStatistics();
    // this.interval = setInterval(() => {
    //   this.getStatistics();
    // }, 15000);
    this.initData();
    this.getThemeList();
  },
  methods: {
    exportExcel() {
    },
    changeTime() {
      this.selectDate = "";
    },
    getThemeList() {
      this.$logSearchHttp
        .getThemeList({})
        .then(res => {
          if (res.data && res.data.data) {
            console.log("获取预警主题====", res.data);
            this.themeList = res.data.data;
            // let body = res.data;
            // this.handleGetAlarmLogSuccessResponse(body.data);
          }
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    resetData() {
      this.doorCheckedName = "";
      this.checkeTreedNodes = [];
      this.doorList = [];
      this.initData1 = [];
      this.warningPlanSubject = "";
      this.staffName = "";
      this.doorCheckedId = "";
      this.addressOrgList = "";
      this.beginTime = "";
      this.endTime = "";
    },
    connectSocket() {
      /* eslint-disable */
      let socket = new SockJS(
        window.config.protocolHeader + window.config.socketIP
      );
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect(
        // { projectUuid: window.config.projectUuid },
        { projectUuid: this.$store.state.home.projectUuid },
        frame => {
          console.log("connect success: ", frame);
          this.stompClient.subscribe("/user/topic/status/channel", greeting => {
            console.log("subscribe success: ", greeting);
            // this.handleSubscribe(JSON.parse(greeting.body));
          });
        },
        err => {
          console.log("error, errMsg: ", err);
        }
      );
      /* eslint-enable */
    },
    disConnectSocket() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        console.log("Disconnected");
      }
    },
    handleSubscribe(data) {
      if (!this.itemListData || !data) {
        return;
      }
      if (data.channelType === "readhead") {
        for (let item of this.itemListData) {
          if (item.channelUuid === data.parentChannelUuid) {
            for (let headItem of item.readHead) {
              if (headItem.channelUuid === data.channelUuid) {
                if (data.status) {
                  this.$set(headItem, "status", data.status);
                }
                if (data.alarmstatus) {
                  this.$set(headItem, "alarmstatus", data.alarmstatus);
                }
              }
            }
          }
        }
      } else if (data.channelType === "door") {
        for (let item of this.itemListData) {
          if (item.channelUuid === data.channelUuid) {
            if (data.status) {
              this.$set(item, "status", data.status);
            }
            if (data.alarmstatus) {
              this.$set(item, "alarmstatus", data.alarmstatus);
            }
          }
        }
      }
    },
    doorConfirm(checkedNodes) {
      console.log("选中的门", checkedNodes);
      this.doorList = checkedNodes;
      this.doorCheckedName = [];
      this.doorCheckedId = [];
      for (let i = 0; i < this.doorList.length; i++) {
        // 这里需要判断一下，设备没有版本号
        // resType: this.doorList[i].type,
        // resUuid: this.doorList[i].id

        this.doorCheckedName.push(this.doorList[i].label);
        this.doorCheckedId.push(this.doorList[i].id);
      }
      this.doorCheckedName = this.doorCheckedName.toString();
      console.log("doorCheckedId===", this.doorCheckedId);
    },
    chooseBtn2() {
      this.chooseVisible2 = true;
    },
    transferCheckedData(data) {
      console.log("获取到选中的节点：", data);
      this.addressOrgList = data;
    },
    onCancelDialog(type) {
      if (type !== "staff_group") {
        this.isShowPeopleOpen = false;
      } else {
        this.isShowPeopleOpen = false;
      }
    },
    lookDetail(row) {
      // this.isShowPeopleOpen = !this.isShowPeopleOpen;
      // let row = {
      //   "测试": "888888"
      // };
      this.isShowPeopleOpen = !this.isShowPeopleOpen;
      this.$refs.peopleOpenDialog.validateType = row.validateType;
      this.$refs.peopleOpenDialog.itemData = this.$common.copyObject(
        row,
        this.$refs.peopleOpenDialog.itemData
      );
    },
    handleSelectionChange(res) {
      console.log(res);
      this.warmUuidList = [];
      for (var i = 0; i < res.length; i++) {
        this.warmUuidList.push(res[i].warmUuid);
      }
    },
    selectDateChangeAct(value) {
      console.log(value);
      this.transSelectDate(this.selectDate);
      // Object.assign(this.otherSearchData, {
      //   beginTime: this.validateTimeStart,
      //   endTime: this.validateTimeEnd
      // });
      // this.initData();
    },
    transSelectDate(value) {
      let day = new Date();
      var now = new Date(); // 当前日期
      var nowDayOfWeek = now.getDay(); // 今天本周的第几天
      var nowDay = now.getDate(); // 当前日
      var nowMonth = now.getMonth(); // 当前月
      // var nowYear = now.getYear(); // 当前年
      switch (value) {
        case "lastday":
          day.setDate(day.getDate() - 1);
          let str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          this.validateTimeStart = str + " " + "00:00:00";
          this.validateTimeEnd = str + " " + "23:59:59";
          this.beginTime = str + " " + "00:00:00";
          this.endTime = str + " " + "23:59:59";
          break;
        case "today":
          str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          this.validateTimeStart = str + " " + "00:00:00";
          this.validateTimeEnd = str + " " + "23:59:59";
          this.beginTime = str + " " + "00:00:00";
          this.endTime = str + " " + "23:59:59";
          break;
        case "thisMonth":
          let firstdate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          );
          firstdate = this.$common.timestampToFormatter(
            firstdate,
            "yyyy-mm-dd"
          );
          let enddate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate()
          );
          enddate = this.$common.timestampToFormatter(enddate, "yyyy-mm-dd");
          this.validateTimeStart = firstdate + " " + "00:00:00";
          this.validateTimeEnd = enddate + " " + "23:59:59";
          this.beginTime = firstdate + " " + "00:00:00";
          this.endTime = enddate + " " + "23:59:59";
          break;
        case "thisMonth1":
          // var now = new Date(); // 当前日期
          // var nowDayOfWeek = now.getDay(); // 今天本周的第几天
          // var nowDay = now.getDate(); // 当前日
          // var nowMonth = now.getMonth(); // 当前月
          // var nowYear = now.getYear(); // 当前年
          day.setDate(1);
          firstdate = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          // enddate = this.$common.timestampToFormatter(
          //   new Date().getTime(),
          //   "yyyy-mm-dd"
          // );
          // this.validateTimeStart = firstdate + " " + "00:00:00";
          // this.validateTimeEnd = enddate + " " + "23:59:59";
          // this.beginTime = firstdate + " " + "00:00:00";
          // this.endTime = enddate + " " + "23:59:59";
          // let monthEndDate1 = new Date(nowYear, nowMonth, this.getMonthDays());
          // console.log("monthEndDate1===", monthEndDate1);
          // let monthEndDate2 = this.formatDate(monthEndDate1);
          // console.log("monthEndDate2===", monthEndDate2);
          // this.endTime = monthEndDate2 + " " + "23:59:59";
          // var now = new Date(); //当前日期
          // var nowMonth = now.getMonth(); //当前月
          // var nowYear = now.getFullYear(); //当前年
          // //本月的开始时间
          // var monthStartDate = new Date(nowYear, nowMonth, 1);
          // //本月的结束时间
          // var monthEndDate = new Date(nowYear, nowMonth+1, 0);
          // var timeStar=Date.parse(monthStartDate)/1000;//s
          // var timeEnd=Date.parse(monthEndDate)/1000;//s
          // debugger;
          // let timeEnd = this.$common.timestampToFormatter(timeEnd, "yyyy-mm-dd")
          // console.log("timeEnd===", timeEnd)
          break;
        case "thisWeek":
          // day.setDate(1);
          // firstdate = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          // enddate = this.$common.timestampToFormatter(
          //   new Date().getTime(),
          //   "yyyy-mm-dd"
          // );
          // var Nowdate=new Date();
          // var WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);
          // var M=Number(WeekFirstDay.getMonth())+1;
          // var WeekFirstDay = WeekFirstDay.getYear()+"-"+M+"-"+WeekFirstDay.getDate();
          // console.log("WeekFirstDay===", WeekFirstDay)
          // this.validateTimeStart = firstdate + " " + "00:00:00";
          // this.validateTimeEnd = enddate + " " + "23:59:59";
          // this.beginTime = firstdate + " " + "00:00:00";
          // this.endTime = enddate + " " + "23:59:59";
          // this.getWeekStartDate()
          // var now = new Date(); // 当前日期
          // var nowDayOfWeek = now.getDay(); // 今天本周的第几天
          // var nowDay = now.getDate(); // 当前日
          // var nowMonth = now.getMonth(); // 当前月
          // var nowYear = now.getYear(); // 当前年
          // nowYear += (nowYear < 2000) ? 1900 : 0;
          let day1 = nowDayOfWeek || 7;
          let weektime1 = this.formatDate(
            new Date(now.getFullYear(), nowMonth, nowDay + 1 - day1)
          );
          let weektime2 = this.formatDate(
            new Date(now.getFullYear(), nowMonth, nowDay + 7 - day1)
          );
          this.beginTime = weektime1 + " " + "00:00:00";
          this.endTime = weektime2 + " " + "23:59:59";
          console.log("weektime===", weektime2);

          break;
      }
      this.initData();
    },
    formatDate: function(date) {
      var myyear = date.getFullYear();
      var mymonth = date.getMonth() + 1;
      var myweekday = date.getDate();

      if (mymonth < 10) {
        mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
        myweekday = "0" + myweekday;
      }
      return myyear + "-" + mymonth + "-" + myweekday;
    },
    getMonthDays() {
      let now2 = new Date(); // 当前日期
      // let nowDayOfWeek2 = now2.getDay(); // 今天本周的第几天
      // let nowDay2 = now2.getDate(); // 当前日
      let nowMonth2 = now2.getMonth(); // 当前月
      let nowYear2 = now2.getYear(); // 当前年
      let monthStartDate = new Date(nowYear2, nowMonth2, 1);
      let monthEndDate = new Date(nowYear2, nowMonth2 + 1, 1);
      let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
      return days;
    },
    initData() {
      this.alarmTypeOptions = this.$common.getEnumByGroupStr("alarm_t");
      this.handleStatusOptions = this.$common.getEnumByGroupStr("alarm_r");
      this.getAlarmLog();
    },
    queryAct() {
      this.pageInfo = {
        total: 0,
        pageSize: 13,
        currentPage: 1
      };
      this.getAlarmLog();
    },
    getAlarmLog() {
      if (this.beginTime !== null && this.endTime !== null) {
        var startTime = new Date(this.beginTime).getTime();
        var endTime = new Date(this.endTime).getTime();
        if (Number(startTime) >= Number(endTime)) {
          this.$message({
            message: "开始时间不能晚于结束时间",
            type: "error"
          });
          return;
        }
      }
      this.tableData = [];
      this.isLoading = true;
      this.$logSearchHttp
        .getWarningRecord({
          limit: this.pageInfo.pageSize,
          page: this.pageInfo.currentPage,
          warningPlanUuid: this.warningPlanSubject.toString(), // 预警预案主题
          staffName: this.staffName, // 预警人姓名
          doorUuid: this.doorCheckedId.toString(), // 门通道UUID集合
          infrastructureUuid: this.addressOrgList.toString(), // 住址基建UUID
          beginTime: this.beginTime ? this.beginTime : null,
          endTime: this.endTime ? this.endTime : null
        })
        .then(res => {
          if (res.data && res.data.data) {
            let body = res.data;
            this.handleGetAlarmLogSuccessResponse(body.data);
          }
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    handleGetAlarmLogSuccessResponse(data) {
      this.tableData = data.list;
      this.pageInfo.total = data.total ? data.total : 0;
      // this.handlePageInfo(data);
    },
    handlePageInfo(data) {
      // total = data.total?data.total:0;
      // debugger;
      // this.pageInfo.total = total;
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.getAlarmLog();
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
    }
  },
  watch: {},
  destroyed() {}
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.warmRecord-main
  .el-radio-button__orig-radio:checked
  + .el-radio-button__inner {
  color: #ffffff;
  background-color: rgba(40, 255, 187, 0.08);
  border: 1px solid rgba(38, 211, 157, 0.5);
  /*  border-right: 1px solid transparent;*/
  -webkit-box-shadow: none;
  box-shadow: none;
}
.warmRecord-main .el-radio-button:first-child .el-radio-button__inner:checked {
  border: 0;
  border-radius: 4px 0 0 4px;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
.warmRecord-main .el-radio-button__inner {
  background: rgba(255, 255, 255, 0.05);
  border: 0;
  /*border-bottom: 1px solid transparent;*/
  /*  border-right: 1px solid rgba(255, 255, 255, 0.05);*/
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ffffff;
  text-align: center;
  min-width: 46px;
  height: 32px;
  /* line-height: 32px;*/
  /* display: block; */
  /* padding: 8px 34%;*/
  margin-right: 8px;
  /* display: flex;
  flex-direction: row;
  align-items: center;*/
  box-sizing: border-box;
  overflow: hidden;
}
/*.warmRecord-main .access-search:first-child {
  margin-bottom: 14px;
}*/
.warmRecord-main .el-radio-button:first-child .el-radio-button__inner {
  border-left: 0;
  border-radius: 4px 0 0 4px;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
.warmRecord-main .access-search2 .el-input {
  width: 180px;
  margin-right: 45px;
}
</style>
<style lang="scss" scoped>
.warmRecord-main {
  width: 100%;
  height: 100%;
  background: #212325;
  padding: 1.8% 2.2%;
  box-sizing: border-box;
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
      margin-right: 3px;
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
    }
  }
  .face-table {
    height: 90%;
    // margin-top: 2%;
    margin-top: 25px;
    .footer {
      margin-top: 30px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
