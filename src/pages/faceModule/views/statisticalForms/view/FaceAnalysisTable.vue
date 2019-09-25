<template>
  <div class="face-main">
    <face-analysis-detail-dialog :isShow="isShow"
                                 :detailsData="detailsData"
                                 @onCancel="onCancelDialog" />
    <div class="face-select">
      <div class="title-text">抓拍设备：</div>
      <!-- <el-select v-model="devicename"
                 filterable
                 collapse-tags
                 placeholder="请选择"
                 class='dev-select'>
        <el-option v-for="item in devicearr"
                   :key="item.channeluuid"
                   :label="item.channelName"
                   :value="item.channeluuid">

        </el-option>
      </el-select> -->
      <elPopverTree :channelInfoList="deviceList"
                    :elPopoverClass="faceRecordPopoverClass"
                    @transferCheckedChannel="transferCheckedChannel"
                    @show="popverShow"
                    inputWidth="200px"
                    @hide="popverHidden">
      </elPopverTree>
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
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="interalVal"
                class="dev-input"
                type="number"></el-input>
      <div class="time-param">次</div>
      <el-button class="search-btn"
                 @click="queryAct"
                 type="primary">开始查询</el-button>
    </div>
    <div class="face-table">
      <el-scrollbar style="height: 92%;transition:0.2s" v-loading="isLoading">
        <el-table :data="tableData"
                  border
                  style="width: 100%">
          <el-table-column type="index"
                           label="序号"
                           width="90">
          </el-table-column>
          <el-table-column prop="channelName"
                           label="设备名称"
                           width="280">
          </el-table-column>
          <el-table-column prop="count"
                           label="频度"
                           width="190">
          </el-table-column>

          <el-table-column prop=""
                           label="人脸照片"
                           width="190">
            <template slot-scope="scope">
              <img :src="$common.setPictureShow(scope.row.imageUri)"
                   width="30px"
                   height="30px">
            </template>
          </el-table-column>
          <el-table-column prop=""
                           label="全景照片"
                           width="190">
            <template slot-scope="scope">
              <img :src="$common.setPictureShow(scope.row.panoramaUri)"
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
      devicearr: [
        {
          label: "全部",
          vlaue: ""
        },
        {
          label: "1",
          value: "1"
        },
        {
          label: "2",
          value: "2"
        },
        {
          label: "3",
          value: "3"
        }
      ],
      conditionVal: ">",
      conditionArr: [
        {
          label: "大于",
          value: ">"
        },
        {
          label: "大于等于",
          value: ">="
        },
        {
          label: "等于",
          value: "="
        },
        {
          label: "小于",
          value: "<"
        },
        {
          label: "小于等于",
          value: "<="
        }
      ],
      multipleSelection: [],
      isShow: false,
      deviceList: [],
      faceRecordPopoverClass: "faceRecordPopoverClass",
      checkedChannelsUuidList: [],
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
    this.initData();
    this.getFaceAnalysisTable();
  },
  methods: {
    initData() {
      this.startTime = this.$common.formatDate(
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      );
      this.endTime = this.$common.formatDate(new Date());
    },
    getFaceAnalysisTable() {
      this.isLoading = true;
      this.$statisticRequest.getFaceAnalysisTable({
        devname: this.checkedChannelsUuidList.toString(),
        starttime: this.startTime,
        overtime: this.endTime,
        condition: this.conditionVal,
        num: this.interalVal,
        currentPage: this.pageInfo.currentPage,
        pageSize: this.pageInfo.pageSize,
        onResult: (isSuccess, data) => {
          if (isSuccess && data) {
            this.handleGetFaceAnalysisTableSuccessResponse(data);
          } else {
            console.log("获取人脸频率分析统计失败！");
            this.isLoading = false;
          }
        }
      });
    },
    handleGetFaceAnalysisTableSuccessResponse(data) {
      this.isLoading = false;
      this.idListForDetail = this.$common.copyArray(this.checkedChannelsUuidList, this.idListForDetail);
      this.tableData = [];
      this.tableData = data.body.data.list;
      for (let item of this.tableData) {
        item.channelName = "";
        if (this.checkedChannelsUuidList.length === 0) {
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
    // 获取任务列表
    getDeviceList() {
      var deviceList = this.$store.getters.getDeviceList;
      this.deviceList = deviceList;
    },
    transferCheckedChannel(checkedChannel) {
      this.checkedChannel = checkedChannel;
      this.checkedChannelsUuidList = [];
      for (var i = 0; i < checkedChannel.length; i++) {
        this.checkedChannelsUuidList.push(checkedChannel[i].id);
      }
    },
    popverShow() {},
    popverHidden() {}
  },
  watch: {},
  destroyed() {},
  activated() {
    this.getDeviceList();
  }
};
</script>

<style>
.faceRecordPopoverClass {
  width: 50%;
  height: 45%;
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
  width: 100%;
  height: 100%;
  padding: 2% 2.5% 1% 2.5%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  $bg-color: #202326;
  .face-select {
    height: 12%;
    padding: 0 2%;
    box-sizing: border-box;
    background: $bg-color;
    border-radius: 3px;
    margin-bottom: 1.5%;
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
    background: $bg-color;
    border-radius: 3px;
    padding: 2% 2%;
    box-sizing: border-box;
    box-sizing: border-box;
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
