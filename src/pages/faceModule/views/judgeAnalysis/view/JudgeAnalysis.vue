<template>
  <div class="main-block">
    <judge-details :isShow="isShowDetail"
                   ref="judgeDetails"
                   @onCancel="onCancelDetail"
                   @onConfirm="onConfirmDetail" />
    <div class="main-container">
      <div class="search">
        <span>研判时段：</span>
        <el-date-picker v-model="startTime"
                        type="datetime"
                        style="width: 200px; margin-left: 5px"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        <span class="line">—</span>
        <el-date-picker v-model="endTime"
                        type="datetime"
                        style="width: 200px;"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        <el-radio-group v-model="selectDate"
                        @change="selectDateAct"
                        style="margin-left: 20px;">
          <el-radio-button label="today">今天</el-radio-button>
          <el-radio-button label="lastday">昨天</el-radio-button>
          <el-radio-button label="thisWeek">本周</el-radio-button>
          <el-radio-button label="thisMonth">本月</el-radio-button>
        </el-radio-group>
        <span style="margin-left: 4%">模型名称：</span>
        <el-input v-model="modelName"
                  style="width: 160px;"></el-input>
        <span style="margin-left: 4%">状态：</span>
        <el-select style="width: 160px;"
                   v-model="status"
                   clearable
                   size="small">
          <el-option v-for="item in statusOptions"
                     :key="item.typeStr"
                     :label="item.typeName"
                     :value="item.typeStr">
          </el-option>
        </el-select>
        <el-button @click="queryAct"
                   icon="el-icon-search"
                   class="search-btn"
                   type="primary"
                   size="small">查询</el-button>
      </div>
      <div class="result">
        <div class="result-title">
          <el-radio-group v-model="typeRadio"
                          @change="handleTypeChange">
            <el-radio label="picture">图片</el-radio>
            <el-radio label="table">列表</el-radio>
          </el-radio-group>
        </div>
        <div class="list-picture"
             v-if="typeRadio === 'picture'"
             v-loading="isLoading">
          <template v-for="(item, index) in moduleList">
            <div :key="index"
                 class="list-item"
                 @click="lookDetail(item)">
              <img :src="$common.setPictureShow(item.facePhotoUrl, 'facelog')"
                   width="100%"
                   height="120px"
                   class="img-fill">
              <div class="info-other">
                <div class="other-span">{{item.faceModelName}}</div>
                <div class="other-span">{{item.createTime}}</div>
                <div class="other-span desc">{{item.analysisResultDescribe}}</div>
                <div class="other-span">{{item.staffName}}
                  <span :style="item.staffName ? 'margin-left: 5px;' : ''">{{item.faceLibraryName}}</span>
                </div>
                <div class="other-span"
                     :style="item.status === 'model_processed' ? 'color:#26D39D' : 'color:#FD545E'">{{$common.getEnumItemName('model_analysis_s', item.status)}}</div>
              </div>
            </div>
          </template>
        </div>
        <div class="list-table"
             v-loading="isLoading"
             v-else>
          <el-table :data="moduleList"
                    style="width: 100%">
            <el-table-column type="index"
                             label="序号"
                             width="60">
            </el-table-column>
            <el-table-column prop="faceModelName"
                             label="模型名称"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="createTime"
                             label="研判时间"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="analysisResultDescribe"
                             label="研判描述"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="faceLibraryName"
                             label="所属库"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="status"
                             label="状态">
              <template slot-scope="scope">
                {{$common.getEnumItemName('model_analysis_s', scope.row.status)}}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="detail-icon">
                  <el-button @click="lookDetail(scope.row)"
                             type="text"
                             size="small">
                    查看
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
</template>

<script>
import JudgeDetails from "@/pages/faceModule/views/judgeAnalysis/components/JudgeDetails";

export default {
  components: {
    JudgeDetails
  },
  props: {},
  data() {
    return {
      selectDate: "",
      startTime: "",
      endTime: "",
      modelName: "",
      num: "",
      status: "",
      statusOptions: [],
      pageInfo: {
        total: 0,
        pageSize: 27,
        currentPage: 1
      },
      moduleList: [],
      typeRadio: "picture",
      isShowDetail: false,
      isLoading: false
    };
  },
  created() {},
  activated() {
    this.init();
  },
  mounted() {
    this.statusOptions = this.$common.getEnumByGroupStr("model_analysis_s");
  },
  methods: {
    init() {
      this.startTime = this.getStartTime();
      this.endTime = this.$common.getCurrentTime();
      this.getJudgeList();
    },
    queryAct() {
      this.getJudgeList();
    },
    selectDateAct(dateStr) {
      let day = new Date();
      switch (dateStr) {
        case "lastday":
          day.setDate(day.getDate() - 1);
          let str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          this.startTime = str + " " + "00:00:00";
          this.endTime = str + " " + "23:59:59";
          break;
        case "today":
          str = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          this.startTime = str + " " + "00:00:00";
          this.endTime = str + " " + "23:59:59";
          break;
        case "thisWeek":
          let weekday = day.getDay();
          let today = day.getDate();
          let month = day.getMonth();
          let firstDay = null;
          // month默认从0开始，则判断不是月初，则月份+1
          if (today - weekday) {
            month += 1;
            firstDay = today - weekday;
          } else {
            // 月初 则向前退weekday - today天
            // 判断 月大 月小
            let lastMonthDays =
              [1, 3, 5, 7, 8, 10, 12].indexOf(month + 1) > -1 ? 31 : 30;
            firstDay = lastMonthDays - weekday + today;
          }
          let firstdate = new Date(day.getFullYear(), month - 1, firstDay);
          firstdate = this.$common.timestampToFormatter(
            firstdate,
            "yyyy-mm-dd"
          );
          let enddate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          );
          enddate = this.$common.timestampToFormatter(enddate, "yyyy-mm-dd");
          this.startTime = firstdate + " " + "00:00:00";
          this.endTime = enddate + " " + "23:59:59";
          break;
        case "thisMonth":
          day.setDate(1);
          firstdate = this.$common.timestampToFormatter(day, "yyyy-mm-dd");
          enddate = this.$common.timestampToFormatter(
            new Date().getTime(),
            "yyyy-mm-dd"
          );
          this.startTime = firstdate + " " + "00:00:00";
          this.endTime = enddate + " " + "23:59:59";
          break;
      }
    },
    getStartTime() {
      var new111 = new Date();
      var hours = new111.getHours();
      if (hours > 1) {
        return (
          new111.getFullYear() +
          "-" +
          addZero(new111.getMonth() + 1) +
          "-" +
          addZero(new111.getDate()) +
          " " +
          addZero(hours - 1) +
          ":" +
          addZero(new111.getMinutes()) +
          ":" +
          addZero(new111.getSeconds())
        );
      } else {
        return (
          new111.getFullYear() +
          "-" +
          addZero(new111.getMonth() + 1) +
          "-" +
          addZero(new111.getDate()) +
          " " +
          "00:00:00"
        );
      }
      function addZero(num) {
        if (num < 10) return "0" + num;
        return num;
      }
    },
    handleTypeChange() {
      if (this.typeRadio === "picture") {
        this.pageInfo.pageSize = 27;
      } else {
        this.pageInfo.pageSize = 14;
      }
      this.getJudgeList();
    },
    lookDetail(row) {
      this.$refs.judgeDetails.modelItem = this.$common.copyObject(
        row,
        this.$refs.judgeDetails.modelItem
      );
      this.isShowDetail = true;
      this.$refs.judgeDetails.getModelDev();
    },
    onConfirmDetail() {
      this.isShowDetail = false;
    },
    onCancelDetail() {
      this.isShowDetail = false;
    },
    getJudgeList() {
      this.isLoading = true;
      this.$judgeHttp
        .getJudgeList({
          limit: this.pageInfo.pageSize,
          page: this.pageInfo.currentPage,
          modelName: this.modelName,
          status: this.status,
          createTimeStart: this.startTime,
          createTimeEnd: this.endTime
        })
        .then(res => {
          let body = res.data;
          this.getJudgeListSuccess(body);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getJudgeListSuccess(body) {
      this.moduleList = body.data.list;
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
      this.getJudgeList();
    }
  },
  watch: {},
  deactivated() {},
  destroyed() {}
};
</script>

<style lang="scss">
.main-block {
  .el-radio-button__inner {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    margin-right: 9px;
    border: 0;
    padding: 8px 20px;
    font-size: 13px;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border: 0;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background: rgba(40, 255, 187, 0.1);
    border-radius: 2px;
    border-radius: 2px;
    border: 0;
    box-shadow: 0px 0 0 0 #26d39d;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main-block {
  padding: 1.6%;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .main-container {
    padding: 1.8% 3%;
    box-sizing: border-box;
    background: #212325;
    width: 100%;
    height: 100%;
    .search {
      height: 90px;
      width: 100%;
      border: {
        width: 0 0 1px 0;
        style: dashed;
        color: rgba($color: #ffffff, $alpha: 0.2);
      }
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #ffffff;
      display: flex;
      align-items: center;
      .line {
        color: rgba($color: #ffffff, $alpha: 0.15);
        margin: 0 2px;
      }
      .search-btn {
        margin-left: auto;
        margin-right: 0;
        width: 80px;
      }
    }
    .result {
      padding: 20px 0;
      box-sizing: border-box;
      height: 88%;
      .result-title {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #ffffff;
      }
      .list-picture {
        height: 89%;
        overflow-y: auto;
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        .list-item {
          width: 150px;
          height: 230px;
          cursor: pointer;
          background: rgba($color: #000000, $alpha: 0.1);
          border: 1px solid #2a2c2e;
          margin-right: 20px;
          margin-bottom: 10px;
          padding: 10px;
          box-sizing: border-box;
          .info-other {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #dddddd;
            letter-spacing: 0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .other-span {
              margin-bottom: 2px;
            }
          }
        }
      }
      .list-table {
        height: 89%;
        overflow-y: auto;
      }
      .footer {
        margin-top: 30px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .desc {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
