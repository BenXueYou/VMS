<template>
  <div class='timeSelection'>
    <span class='span'>开始时间</span>
    <el-time-picker placeholder="起始时间"
                    class='timeSelect'
                    v-model="startTime"
                    size='small'
                    value-format="HH:mm"
                    format="HH:mm"
                    @change='changeStartTime'
                    :clearable="false"
                    :picker-options="startTimeOption">
    </el-time-picker>
    <span class='horizontal-line'>一</span>
    <span class='span'>结束时间</span>
    <el-time-picker placeholder="结束时间"
                    class='timeSelect'
                    size='small'
                    @change='changeEndTime'
                    value-format="HH:mm"
                    format="HH:mm"
                    v-model="endTime"
                    :clearable="false"
                    :picker-options="endTimeOption">
    </el-time-picker>

    <span class='deletetime'
          @click="$emit('delete')">删除</span>
    <el-button class='button'
               v-if="isLast"
               icon="el-icon-circle-plus-outline"
               @click="$emit('add',{startTime,endTime})"
               size="small">新增时段</el-button>
    <!-- <span class='comfirm'
          v-if='isLast && isShowComfirm'
          @click='$emit("confirm")'>确定</span> -->
  </div>
</template>

<script>
import { getHMS } from "@/utils/date.js";
export default {
  name: "TimePanel",
  props: {
    isLast: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isShowComfirm: {
      type: Boolean,
      default() {
        return true;
      }
    },
    timeOperation: {
      type: Object,
      default() {
        return {
          start: "00:00:00",
          end: "23:59:59"
        };
      }
    }
  },
  data() {
    return {
      checkList: [],
      startTime: "",
      endTime: "",
      startTimeOption: {},
      endTimeOption: {}
    };
  },
  methods: {
    commit() {
      console.log(this.startTime);
      console.log(this.endTime);
      let obj = {
        startTime: this.startTime,
        endTime: this.endTime
      };
      console.log("时间变化了~~~");
      console.log(obj);
      this.$emit("updateTime", obj);
    },
    changeEndTime() {
      this.endTime = this.endTime + ":59";
      this.commit();
    },
    changeStartTime() {
      console.log(this.startTime);
      this.startTime = this.startTime + ":00";
      this.endTimeOption.minTime = this.startTime;
      if (this.endTime < this.startTime) {
        this.endTime = this.startTime;
      }
      this.commit();
    },
    getHMS(date) {
      return getHMS(date);
    },
    setDate(time) {
      let [hours, mintus, seconds] = time.split(":");
      let d = new Date();
      d.setHours(parseInt(hours));
      d.setMinutes(parseInt(mintus));
      d.setSeconds(parseInt(seconds));
      return d;
    }
  },
  mounted() {
    // console.log("当前的timeOperation： ");
    console.log(this.timeOperation);
    this.startTime = this.timeOperation.startTime;
    this.endTime = this.timeOperation.endTime;
    // 选择时间的范围
    // 开始时间，第一个时间段，最小时间是00:00:00 其他的最小时间段都是以上个时间结束
    let timeRange = `${this.timeOperation.minTime ||
      "00:00:00"} - ${"23:59:59"}`;
    // console.log(timeRange);
    this.startTimeOption = {
      selectableRange: timeRange
    };
    this.endTimeOption = {
      selectableRange: timeRange
    };
  }
};
</script>
<style lang="scss">
.timePanelWrap {
  .el-checkbox__label {
    padding-left: 5px;
  }
  .el-icon-time {
    display: none;
  }
  .el-input__inner {
    padding: 0px 10px;
    height: 30px;
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.timeSelection {
  span {
    @include font-s;
  }
}
.timePanelWrap {
  .timePanelItem {
    .showTimeWrap {
      padding: 10px;
      background-color: $timePanelBackgroundColor;
      display: flex;
      line-height: 22px;
      .week {
        width: 25%;
        p {
          margin: 0px;
        }
      }
      .time {
        width: 55%;
      }
      .operator {
        .edit {
          color: $add-text-color;
          padding: 0px 5px;
          cursor: pointer;
        }
        .delete {
          color: $delete-text-color;
          padding: 0px 5px;
          cursor: pointer;
        }
      }
    }
    .editTimeWrap {
      .comfirm {
        color: $add-text-color;
        font-size: 12px;
        cursor: pointer;
      }
      .button {
        font-size: 12px;
        background-color: transparent;
        color: $add-text-color;
        padding-left: 10px;
        border: none;
      }
      .deletetime {
        color: $delete-text-color;
        cursor: pointer;
      }
      .horizontal-line {
        position: relative;
        padding: 0px 10px;
        color: $white15;
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          height: 1px;
          width: 60%;
          background-color: $dash-line-color;
        }
      }
      .checkbox {
        margin-right: 10px;
        .el-checkbox__label {
          padding-left: 5px;
        }
      }
      span {
        line-height: 30px;
        padding: 0px 10px 0px 0px;
      }
      .timeSelect {
        width: 80px;
      }
    }
  }
}
.comfirm {
  color: $add-text-color !important;
  font-size: 12px;
  cursor: pointer;
}
.button {
  font-size: 12px;
  background-color: transparent;
  color: $add-text-color;
  padding-left: 10px;
}
.deletetime {
  color: $delete-text-color !important;
  cursor: pointer;
}
</style>
