<template>
  <div class="access-main">
    <div class="access-search">
      <span class='topTitleTxt'>设备：</span>
      <el-input v-model="policeSourceName"
                class="time-interal"
                size="small"></el-input>
      <span class='topTitleTxt left-space'>通话时间：</span>
      <el-date-picker v-model="startTime"
                      type="datetime"
                      class="time-interal-date"
                      size="small"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
      <div class="time-line"></div>
      <el-date-picker v-model="endTime"
                      type="datetime"
                      class="time-interal-date"
                      placeholder="选择日期"
                      size="small"
                      value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
      <span class='topTitleTxt left-space'>接听房间：</span>
      <el-input v-model="policeSourceName"
                class="time-interal"
                size="small"></el-input>
      <span class='topTitleTxt left-space'>呼叫设备：</span>
      <el-input v-model="policeSourceName"
                class="time-interal"
                size="small"></el-input>
      <div class="search-btn">
        <el-button @click="queryAct"
                   size="small"
                   icon="el-icon-search"
                   type="primary">检索</el-button>
        <el-button @click="queryAct"
                   size="small"
                   type="primary">
          <img src="@/assets/images/export.png">
                   导出
        </el-button>

      </div>
    </div>
    <div class="face-table">
      <el-scrollbar style="height: 92%;transition:0.2s">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column type="index"
                           label="序号"
                           width="90">
          </el-table-column>
          <el-table-column prop="deviceName"
                           label="设备名称">
          </el-table-column>
          <el-table-column prop="address"
                           label="地址">
          </el-table-column>
          <el-table-column prop="receiveDevice"
                           label="接听设备">
          </el-table-column>
          <el-table-column prop="receiveRoom"
                           label="接听房间">
          </el-table-column>
          <el-table-column prop="callTime"
                           label="通话时间"
                           width="500">
            <template slot-scope="scope">
              <span>接听：{{ scope.row.callTime.pick }}</span>
              <span style="margin-left: 15px;">挂断：{{ scope.row.callTime.hang }}</span>
              <span style="margin-left: 15px;">通话时间：{{ scope.row.callTime.time }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isOpen"
                           label="是否开门">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="detail-icon">
                <img src="@/assets/images/look_details.png"
                     width="14px"
                     height="14px"
                     style="margin:0 6px 0 0">
                <el-button @click="lookDetail(scope.row)"
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
                       layout="total, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      policeSourceName: "",
      deviceName: "",
      startTime: "",
      endTime: "",
      alarmType: "",
      alarmTypeOptions: [],
      handleStatus: "",
      handleStatusOptions: [],
      tableData: [
        {
          deviceName: "1区域1单元门口机",
          address: "1区域1栋1单元",
          receiveDevice: "1区域1单元201室内机",
          receiveRoom: "201",
          callTime: {
            pick: "2018-12-03 09:00:52",
            hang: "2018-12-03 09:01:52",
            time: "60"
          },
          isOpen: "未开门"
        },
        {
          deviceName: "1区域1单元门口机",
          address: "1区域1栋1单元",
          receiveDevice: "1区域1单元201室内机",
          receiveRoom: "201",
          callTime: {
            pick: "2018-12-03 09:00:52",
            hang: "2018-12-03 09:01:52",
            time: "60"
          },
          isOpen: "未开门"
        },
        {
          deviceName: "1区域1单元门口机",
          address: "1区域1栋1单元",
          receiveDevice: "1区域1单元201室内机",
          receiveRoom: "201",
          callTime: {
            pick: "2018-12-03 09:00:52",
            hang: "2018-12-03 09:01:52",
            time: "60"
          },
          isOpen: "未开门"
        },
        {
          deviceName: "1区域1单元门口机",
          address: "1区域1栋1单元",
          receiveDevice: "1区域1单元201室内机",
          receiveRoom: "201",
          callTime: {
            pick: "2018-12-03 09:00:52",
            hang: "2018-12-03 09:01:52",
            time: "60"
          },
          isOpen: "未开门"
        },
        {
          deviceName: "1区域1单元门口机",
          address: "1区域1栋1单元",
          receiveDevice: "1区域1单元201室内机",
          receiveRoom: "201",
          callTime: {
            pick: "2018-12-03 09:00:52",
            hang: "2018-12-03 09:01:52",
            time: "60"
          },
          isOpen: "未开门"
        },
        {
          deviceName: "1区域1单元门口机",
          address: "1区域1栋1单元",
          receiveDevice: "1区域1单元201室内机",
          receiveRoom: "201",
          callTime: {
            pick: "2018-12-03 09:00:52",
            hang: "2018-12-03 09:01:52",
            time: "60"
          },
          isOpen: "未开门"
        },
        {
          deviceName: "1区域1单元门口机",
          address: "1区域1栋1单元",
          receiveDevice: "1区域1单元201室内机",
          receiveRoom: "201",
          callTime: {
            pick: "2018-12-03 09:00:52",
            hang: "2018-12-03 09:01:52",
            time: "60"
          },
          isOpen: "未开门"
        },
        {
          deviceName: "1区域1单元门口机",
          address: "1区域1栋1单元",
          receiveDevice: "1区域1单元201室内机",
          receiveRoom: "201",
          callTime: {
            pick: "2018-12-03 09:00:52",
            hang: "2018-12-03 09:01:52",
            time: "60"
          },
          isOpen: "未开门"
        },
      ]
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.alarmTypeOptions = this.$common.getEnumByGroupStr("alarmTypeEnum");
      this.handleStatusOptions = this.$common.getEnumByGroupStr(
        "handleStatusEnum"
      );
    },
    queryAct() {}
  },
  watch: {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.access-main {
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
      margin-left: 3%;
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
    margin-top: 2%;
    .footer {
      margin-top: 30px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
  .level-div {
    height: 32px;
    line-height: 32px;
  }
}
</style>
