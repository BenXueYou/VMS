<template>
  <div class="dialogwraphistory">
    <el-dialog class="dialogaa"
               :title="title"
               :visible.sync="diglogvisible"
               @close="close"
               width="1280px"
               center>
      <div class="tableContent">
        <div class="historyLeft">
          <div class="myleftable">
            <el-table :data="tableData"
                      border
                      ref="leftTable"
                      :current-row-key="0"
                      highlight-current-row
                      @row-click="selectedRow"
                      style="width:100%">
              <el-table-column prop="faceLibraryName"
                               label="库名称"
                               show-overflow-tooltip
                               width="100"></el-table-column>
              <el-table-column prop="importProgress"
                               label="进度"
                               show-overflow-tooltip
                               width="100">
                <template slot-scope="scope">
                  <span style="color: #26D39D">{{scope.row.importProgress}}%</span></template>
              </el-table-column>
              <el-table-column prop="importState"
                               label="状态"
                               show-overflow-tooltip
                               width="120">
                <template slot-scope="scope">
                  <span :style="scope.row.importProgress < 100 ? 'color: #26D39D' : ''">{{scope.row.importState}}</span></template>
              </el-table-column>
              <el-table-column prop="updateTime"
                               label="更新时间"
                               show-overflow-tooltip></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text"
                             size="small"
                             :disabled="scope.row.importProgress < 100 ? true : false"
                             @click.stop="deleteTask(scope.row)">
                    <span style="color: #FD545E">删除</span>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="arrowLine"></div>
        <div class="historyRight">
          <div class="infoLine">状态详情：{{selectedTabRow ? selectedTabRow.importStateDetails : ""}}</div>
          <div class="infoLine">文件总人脸数：{{selectedTabRow ? selectedTabRow.faceTotal : ""}}张</div>
          <div class="infoLine">重复人脸数：{{selectedTabRow ? selectedTabRow.repeatCount : ""}}张</div>
          <div class="infoLine">新增人脸数：{{selectedTabRow ? selectedTabRow.addCount : "" }}张</div>
          <div class="infoLine">导入失败人脸数：{{selectedTabRow ? selectedTabRow.failedCount : ""}}张</div>
          <div class="infoLine">注册失败人脸数：{{selectedTabRow ? selectedTabRow.regFailedCount : ""}}张
            <el-button type="primary"
                       size="small"
                       style="margin-left: auto; margin-right: 10px;"
                       @click="downloadErrTemp">
              导出错误信息
            </el-button>
          </div>
          <div class="mytable">
            <el-table :data="tableData2"
                      border
                      v-loading="rightloading"
                      style="width:100%">
              <el-table-column label="序号"
                               width="80"
                               :index="indexMethod"
                               type="index">
              </el-table-column>
              <el-table-column prop="staffName"
                               label="姓名"
                               show-overflow-tooltip
                               width="100"></el-table-column>
              <el-table-column prop="gender"
                               label="性别"
                               width="80">
                <template slot-scope="scope">
                  <span>{{$common.getEnumItemName("gender", scope.row.gender)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="credentialType"
                               label="证件类型"
                               show-overflow-tooltip
                               width="120">
                <template slot-scope="scope">
                  <span>{{$common.getEnumItemName("cred", scope.row.credentialType)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="credentialNo"
                               label="证件号"
                               show-overflow-tooltip></el-table-column>
              <el-table-column prop="error"
                               label="错误信息"
                               show-overflow-tooltip></el-table-column>
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
    </el-dialog>
  </div>
</template>

<script>
import * as faceApi from "@/pages/faceModule/http/faceDBHttp.js";
import RestApi from "@/utils/RestApi";

export default {
  name: "TheFaceDBDialog",
  components: {},

  props: {
    title: {
      type: String,
      default: "库更新历史"
    },
    faceDBDialogVisible: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  computed: {},
  mounted() {},
  data() {
    return {
      diglogvisible: false,
      tableData: [],
      tableData2: [],
      importTaskUuid: "",
      faceDBDialogDKVisible: false,
      showIndex: 0, // 表示左表格，当前显示的第几个
      rightloading: false,
      pageInfo: {
        total: 0,
        pageSize: 9,
        currentPage: 1
      },
      stompClient: null,
      selectedTabRow: null,
      interval: null,
      refreshFlag: false,
    };
  },
  methods: {
    init() {
      faceApi.getTaskList().then(res => {
        this.tableData = [];
        this.tableData2 = [];
        if (res.data && res.data.data) {
          this.tableData = res.data.data;
          if (this.tableData.length > 0) {
            this.selectedTabRow = this.tableData[0];
            this.$refs.leftTable.setCurrentRow(this.tableData[0]);
            this.showRightTable(res.data.data[this.showIndex]);
          }
        }
      });
    },
    selectedRow(row) {
      this.selectedTabRow = row;
      this.showRightTable(row);
    },
    close() {
      this.$emit("close");
    },
    gettaskdetail() {
      this.rightloading = true;
      this.tableData2 = [];
      faceApi
        .getTaskErrorList({
          limit: this.pageInfo.pageSize,
          page: this.pageInfo.currentPage,
          importTaskUuid: this.importTaskUuid
        })
        .then(res => {
          this.tableData2 = res.data.data.list;
          this.handlePageInfo(res.data.data);
          this.rightloading = false;
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.rightloading = false;
        });
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
      this.gettaskdetail();
    },
    showRightTable(res) {
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.importTaskUuid = res.importTaskUuid;
      this.gettaskdetail();
      this.setIntervalMethod();
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
    deleteTask(row) {
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
            faceApi.deleteTask(row.importTaskUuid).then(res => {
              let body = res.data;
              this.deleteTaskSuccess(body);
            });
          }
        });
    },
    deleteTaskSuccess(body) {
      this.$cToast.success(body.msg);
      this.init();
    },
    connectSocket() {
      /* eslint-disable */
      let socket = new SockJS(
        window.config.protocolHeader + window.config.socketIP
      );
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect(
        { projectUuid: this.$store.state.home.projectUuid },
        frame => {
          console.log("connect success: ", frame);
          this.stompClient.subscribe(
            "/user/topic/face-1.3/client/faceLibImportTaskProgress",
            greeting => {
              this.handleSubscribe(JSON.parse(greeting.body));
            }
          );
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
      this.refreshFlag = true;
      if (!data) {
        this.refreshFlag = false;
        return;
      }
      if (this.tableData && this.tableData.length > 0) {
        this.tableData.forEach((v, i) => {
          if (data.importTaskUuid === v.importTaskUuid) {
            this.$nextTick(() => {
              this.$set(
                this.tableData[i],
                "importProgress",
                data.importProgress
              );
              this.$set(this.tableData[i], "importState", data.importState);
              this.$set(
                this.tableData[i],
                "importStateDetails",
                data.importStateDetails
              );
              this.$set(this.tableData[i], "faceTotal", data.faceTotal);
              this.$set(this.tableData[i], "repeatCount", data.repeatCount);
              this.$set(this.tableData[i], "addCount", data.addCount);
              this.$set(this.tableData[i], "failedCount", data.failedCount);
              this.$set(
                this.tableData[i],
                "regFailedCount",
                data.regFailedCount
              );
            });
          }
        });
      }
    },
    downloadErrTemp() {
      // let alink = document.createElement("a");
      // alink.download = "error.xlsx";
      // alink.href = RestApi.api.faceModuleAPi.faceDBApi.downloadErrTemp(this.$store.state.home.projectUuid) + "?importTaskUuid=" + this.importTaskUuid;
      // alink.click();
      this.$common.funBuildFile(
        RestApi.api.faceModuleAPi.faceDBApi.downloadErrTemp(
          this.$store.state.home.projectUuid
        ) +
          "?importTaskUuid=" +
          this.importTaskUuid,
        "错误信息.xlsx",
        "GET"
      );
    },
    setIntervalMethod() {
      this.interval = setInterval(() => {
        if (this.refreshFlag) {
          this.gettaskdetail();
          this.refreshFlag = false;
        }
      }, 6000);
    }
  },
  watch: {
    faceDBDialogVisible: function(val) {
      this.diglogvisible = val;
      if (val) {
        this.init();
        this.connectSocket();
      } else {
        this.disConnectSocket();
        if (this.interval) {
          clearInterval(this.interval);
        }
      }
    },
    diglogvisible: function(val) {
      this.diglogvisible = this.faceDBDialogVisible;
    },
    "selectedTabRow.importProgress"(val) {
      if (this.selectedTabRow.importProgress === 100) {
        if (this.interval) {
          clearInterval(this.interval);
        }
      }
    }
  }
};
</script>
<style>
.dialogwraphistory .el-dialog__wrapper {
  overflow: auto;
}
</style>
<style lang='scss' scoped>
.dialogwraphistory {
  .tableContent {
    font-size: 0px;
    width: 100%;
    height: 650px;
    .historyLeft {
      display: inline-block;
      width: 43%;
      vertical-align: top;
    }
    .arrowLine {
      vertical-align: top;
      position: relative;
      display: inline-block;
      width: 2%;
      height: 100%;
      &::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 0px;
        transform: translate(-50%);
        height: 100%;
        width: 1px;
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0.15) 0%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        background-size: 1px 8px;
        background: no-repeat repeat-y;
      }
    }
    .historyRight {
      vertical-align: top;
      display: inline-block;
      width: 55%;
      .infoLine {
        width: 100%;
        margin: 3px 0px;
        font-family: " PingFangSC-Regular";
        font-size: 14px;
        color: #aaaaaa;
        display: flex;
      }
    }
  }
  .mytable {
    margin-top: 15px;
    height: 450px;
    overflow-y: auto;
  }
  .myleftable {
    height: 660px;
    overflow-y: auto;
  }
  .footer {
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

<style lang='scss'>
.dialogaa {
  .el-dialog {
    height: 750px;
  }
}
</style>
