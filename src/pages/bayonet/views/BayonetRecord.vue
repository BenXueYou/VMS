<template>
  <div class="BayonetRecord">
    <el-row class="BayonetRecordTop">
      <div class="topBoxDiv topTitleTxt topBoxTaskBox">
        抓拍设备：
        <elPopverTree :channelInfoList="deviceList"
                      :elPopoverClass="BRPopoverClass"
                      @transferCheckedChannel="transferCheckedChannel"
                      inputWidth="200px"
                      ref="FRDeviceRef"
                      deviceType="vehicleSnap"
                      :isCheckedAll="isCheckedAll"></elPopverTree>
      </div>
      <div class="topBoxDiv topTitleTxt topBoxTaskBox">
        车辆类型：
        <alPopverTree ref="vehicleTypeRef"
                      :treeDataList="vehicleTypeOptions"
                      :alPopoverClass="BRAlPopoverClass"
                      :defaultProps="defaultProps"
                      nodeKey="typeStr"
                      inputWidth="200px"
                      @transferAct="transferDataAct1($event,queryData.vehicleType)"></alPopverTree>
      </div>
      <div class="topBoxDateTimeBox">
        <span class="topTitleTxt">抓拍时段：</span>
        <el-date-picker class="left-space"
                        v-model="startTime"
                        type="datetime"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="selectDate=null"></el-date-picker>
        <span class="timeText">至</span>
        <el-date-picker class="left-space"
                        v-model="endTime"
                        type="datetime"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="selectDate=null"></el-date-picker>
      </div>
      <div class="topBoxDateRadioBtnBox">
        <date-radio-btn :selectDate="selectDate"
                        @transferDateTimeAct="transferDateTimeAct" />
      </div>
      <div class="topBoxBtnBox">
        <el-button icon="el-icon-search"
                   class="search-btn"
                   @click="queryAct"
                   type="primary"
                   :disabled="!ShowAuthDisabled">查询</el-button>
        <el-button class="search-btn"
                   @click="resetQueryAct"
                   type="primary">重置</el-button>
      </div>
      <div class="topBoxDiv topTitleTxt topBoxTaskBox">
        车辆颜色：
        <!--  <el-input placeholder
                  clearable
				v-model="queryData.vehicleColor" />-->
        <alPopverTree :treeDataList="vehicleColorOptions"
                      :alPopoverClass="BRAlPopoverClass"
                      :defaultProps="defaultProps"
                      nodeKey="typeStr"
                      ref="vehicleColorRef"
                      inputWidth="200px"
                      @transferAct="transferDataAct2($event,queryData.vehicleColor)"></alPopverTree>
      </div>
      <div class="topBoxDiv topTitleTxt topBoxTaskBox">
        车牌类型：
        <alPopverTree ref="vehicleNoTypeRef"
                      :treeDataList="carPlateOptions"
                      :alPopoverClass="BRAlPopoverClass"
                      :defaultProps="defaultProps"
                      nodeKey="typeStr"
                      inputWidth="200px"
                      @transferAct="transferDataAct3($event,queryData.vehicleNoType)"></alPopverTree>
      </div>
      <div class="topBoxDiv"
           style="text-align:left;display:block">
        车牌号码：
        <el-input placeholder
                  clearable
                  v-model="queryData.vehicleNo" />
      </div>
    </el-row>

    <el-divider class="dividerClass"></el-divider>
    <!-- ======================================================= 分割 ========================================================== -->

    <div class="BayonetRecordBox">
      <div class="BayonetRecordItem"
           v-for="(item, index) in 21"
           @click="doComparethis(index)"
           :key="index">
        <bayonet-record-card imgWidth="90"
                             :cardItem="totalCompareItemList.length>index?totalCompareItemList[index]:{}"
                             @detailClick="doComparethis(index)" />
      </div>
    </div>
    <!-- ======================================================= 弹窗 ========================================================== -->

    <bayonet-card-detail :visible.sync="BRRecordDetailDialogVisable"
                         :BayonetCardDetail="dialogParama" />
    <!-- ======================================================= 分页器 ========================================================== -->
    <el-row ref="footerHeight"
            class="BayonetRecordBottomBox"
            type="flex"
            justify="flex-end">
      <el-col :span="24"
              class="footerPages"
              style="text-align:center">
        <el-pagination @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       layout="total,prev, pager, next,jumper"
                       :page-size="pageSize"
                       :total="total"
                       background></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import * as api from "@/pages/user/http/ajax.js";
import elPopverTree from "@/pages/faceModule/components/ElPopverTree.vue";
import alPopverTree from "@/pages/faceModule/components/AlElTree.vue";
import DateRadioBtn from "../components/DateRadioBtn";
import BayonetRecordCard from "../components/BayonetRecordCard";
import BayonetCardDetail from "../components/BayonetCardDetail";
import * as api from "../http/ajax.js";
export default {
  name: "role",
  components: {
    BayonetRecordCard,
    DateRadioBtn,
    elPopverTree,
    BayonetCardDetail,
    alPopverTree
  },
  data() {
    return {
      BRRecordDetailDialogVisable: false,
      dialogfullscreenLoading: false,
      dialogParama: {},
      shootPhotoList: false,
      vehicleTypeOptions: [],
      vehicleColorOptions: [],
      carPlateOptions: [],
      startTime: null,
      endTime: null,
      vehicleNo: null,
      deviceList: [],
      selectDate: null,
      BRPopoverClass: "BRPopoverClass",
      BRAlPopoverClass: "",
      defaultProps: {
        id: "typeStr",
        label: "typeName"
      },
      currentPage: 1,
      pageSize: 21,
      total: 0,
      totalCompareItemList: [],
      queryData: {
        vehicleType: null,
        vehicleNo: null,
        vehicleNoType: null,
        vehicleColor: null,
        startTime: null,
        endTime: null,
        channelUuid: []
      },
      ShowAuthDisabled: true,
      isOneProject: true
    };
  },
  computed: {
    isCheckedAll() {
      return this.isOneProject;
    }
  },
  mounted() {
    let projectType = this.$store.state.home.projectType || {};
    this.isOneProject = Boolean(projectType.platformLevel === "levelOne");
    this.carPlateOptions = this.$common.getEnumByGroupStr("vehicle_no");
    this.vehicleColorOptions = this.$common.getEnumByGroupStr("color");
    this.vehicleTypeOptions = this.$common.getEnumByGroupStr("vehicle");
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("过车查询", "isShow");
    this.selectDate = "today";
    this.startTime = this.$common.getStartTime();
    this.endTime = this.$common.getCurrentTime();
  },
  activated() {
    // this.OwnAuthDisabled = this.$common.getAuthIsOwn("实有登记", "isOwn");
    if (!this.ShowAuthDisabled) return;
    this.initData();
  },
  methods: {
    initData() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        order: "createTime",
        sort: "desc"
      };
      let isValite =
        new Date(this.startTime).getTime() > new Date(this.endTime).getTime();
      if (isValite) {
        this.$message({ type: "warning", message: "开始时间不得早于结束时间" });
        return;
      }

      if (
        new Date(this.endTime).getMonth() === new Date().getMonth() &&
        new Date(this.endTime).getDate() > new Date().getDate()
      ) {
        this.$message({ type: "warning", message: "结束时间不得早于当天" });
        return;
      }
      this.queryData.startTime = this.startTime;
      this.queryData.endTime = this.endTime;
      this.queryData.channelUuid = this.queryData.channelUuid.toString();
      if (!this.queryData.vehicleNo) this.queryData.vehicleNo = null;
      Object.assign(data, this.queryData);
      if (!data.channelUuid) data.channelUuid = null;

      console.log(data);
      api
        .getBayonetRecordList(data, {
          modelName: "车辆识别",
          type: "查看",
          detailContent: "查看过车记录"
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.totalCompareItemList = res.data.data.list || [];
            this.total = res.data.data.total;
          }
        })
        .catch(() => {
          this.totalCompareItemList = [];
          this.total = 0;
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initData();
    },
    doComparethis(index) {
      this.BRRecordDetailDialogVisable = !this.BRRecordDetailDialogVisable;
      this.dialogParama = this.totalCompareItemList[index] || {};
    },
    queryAct() {
      this.currentPage = 1;
      this.initData();
    },
    resetQueryAct() {
      this.currentPage = 1;
      this.queryData = {
        vehicleType: null,
        vehicleNo: null,
        vehicleNoType: null,
        vehicleColor: null,
        startTime: this.$common.getStartTime(),
        endTime: this.$common.getCurrentTime(),
        channelUuid: []
      };
      this.$refs.vehicleTypeRef.clearAction();
      this.$refs.vehicleColorRef.clearAction();
      this.$refs.vehicleNoTypeRef.clearAction();
      this.$refs.FRDeviceRef.clearAction(true);
      this.selectDate = "today";
      this.startTime = this.$common.getStartTime();
      this.endTime = this.$common.getCurrentTime();
      this.initData();
    },
    transferDataAct1($event, params) {
      // 车辆类型
      console.log($event, params);
      this.queryData.vehicleType = $event.toString();
    },
    transferDataAct2($event, params) {
      // 车辆颜色
      console.log($event, params);
      this.queryData.vehicleColor = $event.toString();
    },
    transferDataAct3($event, params) {
      // 车牌类型
      console.log($event, params);
      this.queryData.vehicleNoType = $event.toString();
    },
    transferDateTimeAct(startTime, endTime, dateStr) {
      this.startTime = startTime;
      this.endTime = endTime;
      this.selectDate = dateStr;
    },
    transferCheckedChannel(checkedChannel) {
      console.log(checkedChannel);
      this.queryData.channelUuid =
        checkedChannel.map(item => {
          return item.channelUuid;
        }) || [];
    }
  }
};
</script>
<style lang="scss">
.BayonetRecord .el-input--suffix .el-input__inner {
  padding-right: 10px;
}
.BayonetRecord .el-input__prefix {
  left: 110%;
  -webkit-transform: translateX(-200%);
  transform: translateX(-200%);
}
.BRPopoverClass {
  width: 50%;
  height: 45%;
}
</style>
<style lang="scss" scoped>
@import "@/style/variables.scss";
.BayonetRecord {
  // width: 100%;
  margin: 30px 30px 0;
  height: calc(100% - 60px);
  background: #212325;
  overflow: auto;
  display: flex;
  flex-direction: column;
  // justify-content: space-around;
  .BayonetRecordTop {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 30px 25px 2px 40px;
    // border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
    div {
      margin-bottom: 10px;
    }
    .topBoxDiv {
      width: 285px;
      margin-right: 40px;
      .el-input {
        width: 180px;
      }
    }
    .topBoxDateTimeBox {
      width: 480px;
      .el-input {
        width: 180px;
      }
    }
    .topBoxDateRadioBtnBox {
      width: 245px;
    }
    .topBoxBtnBox {
      margin-left: 40px;
    }
  }
  .dividerClass {
    margin: 0 30px;
    width: calc(100% - 60px);
    background-color: transparent;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
  }
  .BayonetRecordBox {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    padding-left: 27px;
    align-content: space-between;
    .BayonetRecordItem {
      width: 210px;
      height: 210px;
      margin-top: 1%;
      margin-left: 18px;
    }
  }
  .BayonetRecordBottomBox {
    text-align: center;
    height: 60px;
    // line-height: 60px;
    padding-top: 20px;
  }
}
</style>
