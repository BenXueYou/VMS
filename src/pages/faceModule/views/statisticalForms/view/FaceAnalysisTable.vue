<template>
  <div class="face-main">
    <face-analysis-detail-dialog :isShow="isShow"
                                 :detailsData="detailsData"
                                 @onCancel="onCancelDialog" />
    <div class="main-container">
      <div class="face-select">
        <div class="title-text">抓拍设备：</div>
        <elPopverTree :elPopoverClass="faceRecordPopoverClass"
                        @transferCheckedChannel="transferCheckedChannel"
                        inputWidth="230px"></elPopverTree>
        <div class="title-text left-space">抓拍时段：</div>
        <el-date-picker v-model="startTime"
                        type="datetime"
                        class='dev-select'
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <span class="time-text">至</span>
        <el-date-picker v-model="endTime"
                        type="datetime"
                        class='dev-select'
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <div class="title-text left-space">条件设置：</div>
        <el-select v-model="conditionVal"
                   filterable
                   collapse-tags
                   placeholder="请选择"
                   class='dev-select'>
          <el-option v-for="item in conditionArr"
                     :key="item.typeStr"
                     :label="item.typeName"
                     :value="item.typeStr">
          </el-option>
        </el-select>
        <el-input v-model="interalVal"
                  class="dev-input"
                  type="number"></el-input>
        <div class="time-param">次</div>
        <el-button class="search-btn"
                   @click="queryAct"
                   size="small"
                   type="primary">查询</el-button>
      </div>
      <div class="face-table">
        <el-scrollbar style="height: 92%;transition:0.2s">
          <el-table :data="tableData"
                    border
                    v-loading="isLoading"
                    style="width: 100%">
            <el-table-column type="index"
                             label="序号"
                             width="90">
            </el-table-column>
            <el-table-column prop="channelNames"
                             label="设备名称"
                             width="280">
            </el-table-column>
            <el-table-column prop="frequency"
                             label="频度"
                             width="190">
            </el-table-column>

            <el-table-column label="人脸照片"
                             width="190">
              <template slot-scope="scope">
                <img :src="$common.setPictureShow(scope.row.faceCapturePhotoUrl)"
                     width="30px"
                     height="30px">
              </template>
            </el-table-column>
            <el-table-column label="全景照片"
                             width="190">
              <template slot-scope="scope">
                <img :src="$common.setPictureShow(scope.row.panoramaCapturePhotoUrl)"
                     width="50px"
                     height="30px">
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="detail-icon">
                  <img src="@/assets/images/look_details.png"
                       width="14px"
                       height="14px"
                       style="margin:0 6px 0 0">
                  <el-button @click="lookface(scope.row)"
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
</template>

<script>
import FaceAnalysisDetailDialog from "@/pages/faceModule/views/statisticalForms/view/FaceAnalysisDetailDialog";
import ElPopverTree from "@/pages/faceModule/components/ElPopverTree";

export default {
  components: {
    FaceAnalysisDetailDialog,
    ElPopverTree
  },
  props: {},
  data() {
    return {
      pageInfo: {
        total: 0,
        pageSize: 13,
        currentPage: 1
      },
      startTime: "",
      endTime: "",
      interalVal: 10,
      conditionVal: ">",
      conditionArr: [],
      multipleSelection: [],
      isShow: false,
      deviceList: [],
      faceRecordPopoverClass: "faceAnaPopoverClass",
      channelUuids: [],
      staffUuid: "",
      tableData: [],
      detailsData: [],
      checkedChannel: [],
      idListForDetail: [],
      isLoading: false
    };
  },
  created() {},
  mounted() {
  },
  methods: {
    initData() {
      this.startTime = this.$common.formatDate(
        new Date(new Date().getTime() - 1 * 60 * 60 * 1000)
      );
      this.endTime = this.$common.formatDate(new Date());
      this.conditionArr = this.$common.getEnumByGroupStr("compare_r");
    },
    getFaceAnalysisTable() {
      this.isLoading = true;
      let xhr = {
        channelUuids: this.channelUuids,
        startTime: this.startTime,
        endTime: this.endTime,
        logic: this.conditionVal,
        frequency: this.interalVal,
        page: this.pageInfo.currentPage,
        limit: this.pageInfo.pageSize
      };
      this.$factTragicHttp
        .getFaceAnalysisTable(xhr)
        .then(res => {
          let body = res.data;
          this.getFaceAnalysisTableSuccess(body);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getFaceAnalysisTableSuccess(data) {
      this.isLoading = false;
      this.idListForDetail = this.$common.copyArray(
        this.channelUuids,
        this.idListForDetail
      );
      this.tableData = [];
      this.tableData = data.body.data.list;
      for (let item of this.tableData) {
        item.channelName = "";
        if (this.channelUuids.length === 0) {
          item.channelName = "全部";
        } else {
          for (let item2 of this.checkedChannel) {
            if (this.checkedChannel.length === 1) {
              item.channelName = item2.label;
            } else {
              item.channelName = `${item.channelName}${
                item.channelName ? "," : ""
              }${item2.label}`;
            }
          }
        }
      }
      this.handlePageInfo(data.body.data);
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
      this.getFaceAnalysisTable();
    },
    queryAct() {
      this.getFaceAnalysisTable();
    },
    lookface(row) {
      this.staffUuid = row.vstaffuuid;
      this.getFaceAnalysisDetail();
      this.isShow = true;
    },
    getFaceAnalysisDetail() {
      this.$statisticRequest.getFaceAnalysisDetail({
        channelNameList: this.idListForDetail.toString(),
        staffUuid: this.staffUuid,
        // staffUuid: "da1c3c6ecf88413e8925c92e5630dba3",
        onResult: (isSuccess, data) => {
          if (isSuccess && data) {
            this.handleGetFaceAnalysisDetailSuccessResponse(data);
          } else {
            console.log("获取人脸频率分析详情统计失败！");
          }
        }
      });
    },
    handleGetFaceAnalysisDetailSuccessResponse(data) {
      this.detailsData = data.body.data;
    },
    onCancelDialog() {
      this.isShow = false;
    },
    transferCheckedChannel(checkedChannel) {
      this.channelUuids = [];
      for (let i = 0; i < checkedChannel.length; i++) {
        this.channelUuids.push(checkedChannel[i].channelUuid);
      }
    },
  },
  watch: {},
  destroyed() {},
  activated() {
    this.initData();
    this.getFaceAnalysisTable();
  }
};
</script>

<style>
.faceAnaPopoverClass {
  width: 500px;
  height: 230px;
  position: absolute;
  background: #202127;
  min-width: 150px;
  border: 1px solid #ebeef5;
  padding: 12px;
  z-index: 2000;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-height: 80%;
  overflow: auto;
}
</style>
<style lang="scss" scoped>
.face-main {
  padding: 1.6%;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .main-container {
    padding: 1% 3%;
    box-sizing: border-box;
    background: #212325;
    width: 100%;
    height: 100%;
    .face-select {
      height: 12%;
      border: {
        width: 0 0 1px 0;
        style: dashed;
        color: rgba($color: #ffffff, $alpha: 0.2);
      }
      display: flex;
      align-items: center;
      .time-text {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #888888;
        margin: 0 5px;
      }
      .search-btn {
        margin-left: auto;
      }
    }
    .face-table {
      height: 84.5%;
      border-radius: 3px;
      padding: 2% 2%;
      box-sizing: border-box;
      box-sizing: border-box;
    }
  }
}
.title-text {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #cccccc;
}
.time-param {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #cccccc;
  margin-left: 4px;
}
.left-space {
  margin-left: 5%;
}
.dev-select {
  width: 13%;
}
.dev-input {
  width: 4.5%;
  margin-left: 6px;
}
.footer {
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
