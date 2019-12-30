<template>
  <el-dialog :visible.sync="dialogVisible"
             class="dialogCenter"
             title="下载"
             width="1200px"
             :close-on-click-modal="false"
             @close="close"
             :append-to-body="true">
    <div class="body">
      <!-- <div>
        <el-button size="small">下载</el-button>
        <el-button size="small">删除</el-button>
      </div> -->
      <el-table :data="showData"
                style="width: 100%">
        <el-table-column prop="fileName"
                         label="文件名称"
                         show-overflow-tooltip
                         width="100">
        </el-table-column>
        <el-table-column prop="devicename"
                         label="设备名称"
                         show-overflow-tooltip
                         width="100">
        </el-table-column>
        <el-table-column prop="videoPeriod"
                         show-overflow-tooltip
                         label="录像时间段">
        </el-table-column>
        <el-table-column prop="progress"
                         label="进度"
                         width="180">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.progress"
                         color="#26D39D"></el-progress>
          </template>
        </el-table-column>
        <el-table-column prop="status"
                         label="状态"
                         width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status==='done'">已完成</span>
            <span v-else-if="scope.row.status==='processing'">进行中</span>
            <span v-else-if="scope.row.status==='ready'">准备中</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskAddTime"
                         label="任务加入时间"
                         show-overflow-tooltip
                         width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="downloadVideo(scope.row)"
                       type="text"
                       size="small">下载</el-button>
            <!-- <el-button type="text"
                       class='deleteText'
                       @click='deleteVideo(scope.row)'
                       size="small">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @current-change="handleCurrentChange"
                       :current-page.sync="currentPage"
                       :page-size="pageSize"
                       background
                       class="pagination"
                       layout="total, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import * as api2 from "@/pages/VideoPreview/ajax.js";
export default {
  props: {
    visible: {
      type: Boolean
    },
    tableData: {
      type: Array,
      default() {
        return [];
        // return Array.from({ length: 10 }).fill({
        //   fileName: "tradecore1",
        //   devicename: "设备1-通道1",
        //   videoPeriod: "2018-02-03 02:01:06 ～ 2018-02-03 02:01:06",
        //   progress: 50,
        //   status: "done",
        //   taskAddTime: "2016-07-24  19:23"
        // });
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    total() {
      return this.tableData.length;
    },
    showData() {
      let start = (this.currentPage - 1) * this.pageSize;
      let end = start + this.pageSize - 1;
      return this.tableData.slice(start, end);
    }
  },
  methods: {
    handleCurrentChange(val) {},
    backup(channelUuid, startTime, endTime, videoType, streamType) {
      return new Promise((resolve, reject) => {
        api2
          .backup({
            channelUuid,
            startTime,
            endTime,
            videoType,
            streamType
          })
          .then(res => {
            let data = res.data.data;
            resolve(data);
          });
      });
    },
    async downloadVideo(row) {
      console.log(row);
      // for (let i = 0, len = this.tableData.length; i < len; i++) {
      //   if (this.tableData[i].videoPeriod === row.videoPeriod) {
      //     this.tableData[i].status = "processing";
      //     this.tableData.concat();
      //     break;
      //   }
      // }
      let { rtspUrl: url } = await this.backup(
        row.channelUuid,
        row.startTime,
        row.endTime,
        row.videoType,
        row.streamType
      );
      // 下载的时候判断是海康还是大华的设备
      // 大华NVR不暂停视频 进行下载
      // 海康IPC暂停视频在进行下载
      // 就算是大华的nvr也要暂停，因为不知道他支不支持多路拉流
      // if (row.deviceType === "ipc") {
      this.$emit("shutdownVideo");
      // }
      console.log(url);
      // eslint-disable-next-line
      var video_mgr = new window.CVideoMgrSdk(data => {
        console.log(data);
        this.$message.success("下载完成!");
      });
      let { jMedia, jSignal } = this.$store.getters;
      console.log(jMedia, jSignal);
      var video = await video_mgr.setup({
        jSignal: JSON.stringify(jSignal),
        jMedia: JSON.stringify(jMedia),
        url: url,
        protocol: "rtsp",
        action: "download",
        speed: 4
      });
      video_mgr.play(video);
      api2.downloadRecordLog({
        channelUuid: row.channelUuid,
        viewType: "playback"
      });
    },
    deleteVideo(device) {},
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.body {
  padding: 10px 30px;
  box-sizing: border-box;
  .pagination {
    float: right;
  }
  .block {
    margin: 20px;
    overflow: hidden;
  }
}
</style>
