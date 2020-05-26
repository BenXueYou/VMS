<template>
  <div class="card_wrap infinite-list-wrapper">
    <ul v-if="cardType == 1"
        class="infinite-list"
        v-infinite-scroll="handleGetMore"
        infinite-scroll-delay="500">
      <li v-for="(item, index) in listData"
          :key="index"
          class="infinite-list-item">
        <img :src="$common.setPictureShow(item.facePhotoUrl, 'facelog')"
             alt />
        <div class="info">
          <p>
            {{ item.staffName || ""}}
            <span>{{ item.libraryName || ""}}</span>
          </p>
          <span>{{ item.address || "" }}</span>
          <span>{{ item.channelName || ""}}</span>
          <span>{{ item.alarmDate || ""}}</span>
        </div>
      </li>
    </ul>
    <ul v-if="cardType == 2">
      <li v-for="(item, index) in 5"
          :key="index">
        <img src
             alt />
        <div class="info">
          <span>沁园春/1号楼/2楼/204室</span>
          <span>频繁通过100+次</span>
          <span>2020-3-10 11:57:58</span>
          <p>
            <span style="margin-left:0">未解决</span>
          </p>
        </div>
      </li>
    </ul>
    <div class="empty"
         v-if="!listData.length">暂无数据</div>
  </div>
</template>

<script>
import * as Town from "../../utils/town";
export default {
  name: "CardList",
  props: {
    cardType: {
      type: Number,
      default: 1
    },
    timeRange: {
      type: Object,
      default: () => {
        return {
          alarmDatetimeBegin: this.$common.getStartTime(),
          alarmDatetimeEnd: this.$common.getCurrentTime()
        };
      }
    },
    projectUuid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      listData: [],
      current: 0
    };
  },
  mounted() {
    // this.handleGetAlarm();
  },
  methods: {
    handleGetAlarm() {
      this.listData = [];
      //  Town.getPeoAlarmList({
      //     ...this.timeRange,
      //     projectUuid: this.projectUuid,
      //     limit: 10,
      //     page: 1
      //   })
      //     .then(res => {
      //       if (res.data.data.list) {
      //         this.listData = [...res.data.data.list];
      //       }
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     });
      Town.getPeoAlarmListZxd({
        projectUuid: this.projectUuid,
        limit: 10,
        page: 1,
        timeBegin: this.timeRange.alarmDatetimeBegin,
        timeEnd: this.timeRange.alarmDatetimeEnd
      })
        .then(res => {
          if (res.data.data.list) {
            this.listData = [...res.data.data.list];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleGetMore() {
      if (this.current === 10) return; // 防止无限加载  限制为100
      this.current += 1;
      //  Town.getPeoAlarmList({
      //   ...this.timeRange,
      //   projectUuid: this.projectUuid,
      //   limit: 10,
      //   page: this.current,
      // })
      //   .then(res => {
      //     if (res.data.data.list) {
      //       this.listData.push(...res.data.data.list);
      //     } else {
      //       this.current -= 1;
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
      Town.getPeoAlarmListZxd({
        projectUuid: this.projectUuid,
        limit: 10,
        page: this.current,
        timeBegin: this.timeRange.alarmDatetimeBegin,
        timeEnd: this.timeRange.alarmDatetimeEnd
      })
        .then(res => {
          if (res.data.data.list) {
            this.listData.push(...res.data.data.list);
          } else {
            this.current -= 1;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleReset() {
      this.listData = [];
      this.current = 1;
      // this.handleGetAlarm();
      this.handleGetMore();
    }
  },
  watch: {
    timeRange: {
      handler() {
        this.handleReset();
      },
      deep: true
    },
    projectUuid: {
      handler(val) {
        console.log("-----------right-------------", val);
        if (val) {
          this.handleReset();
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
  line-height: 1;
}
.card_wrap {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
  ul {
    width: 100%;
    padding: 0;
    li {
      width: 100%;
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 12px;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 0.05);
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 15px;
      img {
        display: block;
        width: 80px;
        height: 80px;
        margin-right: 15px;
      }
      .info {
        text-align: left;
        p {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #cccccc;
          margin-bottom: 5px;
          span {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #ff4545;
            margin-left: 15px;
          }
        }
        & > span {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba($color: #dddddd, $alpha: 0.8);
          margin-bottom: 8px;
          display: block;
          line-height: 1;
        }
      }
    }
  }
  .empty {
    width: 100%;
    text-align: center;
    line-height: 60px;
    font-size: 14px;
    color: #909399;
  }
}
</style>
