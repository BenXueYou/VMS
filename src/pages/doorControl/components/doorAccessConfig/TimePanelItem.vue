<template>
  <div class='timePanelItem'>

    <div class='showTimeWrap'
         v-show='!isEditor'>
      <div class="week">
        {{turnWeek}}
      </div>
      <div class="time">
        {{turnTimesArea}}
      </div>
      <div class="operator">
        <span class='edit'
              @click='isEditor="true"'>
          编辑
        </span>
        <span class='delete'
              @click='deleteItem'>
          删除
        </span>
      </div>
    </div>

    <div class="editTimeWrap"
         v-show="isEditor">
      <el-checkbox-group v-model="checkList"
                         @change='change'>
        <el-checkbox v-for='(item,index) in [0,1,2,3,4,5,6]'
                     class='checkbox'
                     :key='index'
                     :value="item"
                     :label="turnNumToWeek(item)"></el-checkbox>
      </el-checkbox-group>
      <time-panel-item-select v-for="(item,index) in timeSelection"
                              class='TimePanelItem'
                              :key='index'
                              :timeOperation='item'
                              :clearable="false"
                              :isLast='index==(timeSelection.length-1)'
                              @updateTime="updateTime(index,$event)"
                              @add='addTime'
                              @confirm='confirm'
                              @delete='deleteTime(index)'>

      </time-panel-item-select>
    </div>

    <div class="dash-line margin"></div>
  </div>
</template>

<script>
import TimePanelItemSelect from "@/pages/doorControl/components/doorAccessConfig/TimePanelItemSelect";
import { turnTimesArea, turnWeek, addHoursTime } from "@/utils/date.js";
export default {
  name: "TimePanelItem",
  components: {
    TimePanelItemSelect
  },
  props: {
    weeks: {
      type: Array,
      default() {
        return [];
      }
    },
    timeArea: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      checkList: [],
      checkListNumber: [],
      isEditor: true,
      timeSelection: []
    };
  },
  computed: {
    turnWeek() {
      return turnWeek(this.checkListNumber);
    },
    turnTimesArea() {
      return turnTimesArea(this.timeArea);
    }
  },
  mounted() {
    const _this = this;
    this.checkListNumber = this.weeks;
    this.weeks.forEach(function(val) {
      let a = _this.turnNumToWeek(val);
      if (a) {
        _this.checkList.push(a);
      }
    });
    // this.dealTime();
  },
  methods: {
    updateTime(index, obj) {
      // 当开始时间或者结束时间修改了之后，进行的赋值操作
      // console.log(arguments);
      // console.log("更新time：");
      // console.log(index);
      // console.log(obj);
      // Object.assign(this.timeSelection[index], obj);
      this.timeSelection[index] = obj;
      // console.log(this.timeSelection);
    },
    dealTime() {
      // 直接赋值使用
      this.timeSelection = this.timeArea;
    },
    turnWeekToNum(week) {
      // return
      let map = {
        一: 0,
        二: 1,
        三: 2,
        四: 3,
        五: 4,
        六: 5,
        日: 6
      };
      return map[week.replace("星期", "")];
    },
    turnNumToWeek(day) {
      if (isNaN(day)) {
        return null;
      }
      if (day < 7 && day >= 0) {
        return "星期" + ["一", "二", "三", "四", "五", "六", "日"][day];
      } else {
        return null;
      }
    },
    change() {
      let num = [];
      console.log(this.checkList);
      this.checkList.forEach(val => {
        num.push(this.turnWeekToNum(val));
      });
      num.sort();
      this.checkListNumber = num;
    },

    addTime({ startTime, endTime }) {
      // 1、各时段不允许冲突/重叠，如冲突，点击确认该行后提示报错。
      //   报错内容：
      //   结束时间早于开始时间：“应晚于开始时间”
      //   第二段开始时间早于第一段结束时间：应晚于上段结束时间
      //   新增的时段与上方已有时段重叠：“与已有时段冲突”
      // 2、【结束时间】的时/分只能从【开始时间】往后选择，如开始时间为09:00，结束时间只能从09：00往后选
      // 3、点击【新增时段】默认新增一个时段，新时段规则默认如下：
      //   第一次新增的时段开始时间为00:00，结束时间为24:00；
      //   再次新增的时段，【开始时间】晚于上一段【结束时间】1小时
      //   【结束时间】为4小时后
      // 4、最多不能超过4个时段，超出后不允许新增时段；

      let len = this.timeSelection.length - 1;
      if (!endTime) {
        this.$message.error("请填写当前时段的结束时间，才可以新增时段");
        return;
      }
      if (endTime.indexOf("23:59") !== -1) {
        this.$message.error("当前时段的最后时间已经是23:59，不可以再新增时段");
        return;
      }
      if (len >= 3) {
        this.$message.error("最多添加4个时段");
        return;
      }
      // 处理将下个时间的开始计算为上个时间结束之后的1个小时，
      // 写个方法，加上n个小时，计算出的时间，超出最大时间则返回23:59:59
      console.log("处理");
      console.log({ startTime, endTime });
      console.log({
        minTime: startTime,
        startTime: addHoursTime(endTime, 1),
        endTime: addHoursTime(endTime, 4)
      });
      this.timeSelection.push({
        minTime: startTime,
        startTime: addHoursTime(endTime, 1),
        endTime: addHoursTime(endTime, 4)
      });
      console.log(this.timeSelection);
    },
    deleteTime(index) {
      this.timeSelection.splice(index, 1);
      if (!this.timeSelection.length) {
        this.deleteItem();
      }
    },
    deleteItem() {
      this.$emit("delete");
    },
    confirm() {
      console.log(this.timeArea);
      this.isEditor = false;
    }
  },
  watch: {
    timeSelection() {
      // 监听时间改变，以便向父节点传递。
      this.$emit("update", {
        weeks: this.checkListNumber,
        timeArea: this.timeSelection
      });
    },
    checkListNumber() {
      // 监听时间改变，以便向父节点传递。
      this.$emit("update", {
        weeks: this.checkListNumber,
        timeArea: this.timeSelection
      });
    },
    timeArea: {
      handler(newval, oldVal) {
        this.timeSelection = newval;
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="scss">
@import "@/style/variables.scss";
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
  .el-checkbox__label {
    @include font-s;
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";

.timePanelItem {
  .showTimeWrap {
    padding: 9px;
    background-color: $timePanelBackgroundColor;
    display: flex;
    line-height: 22px;
    .week {
      width: 25%;
      @include font-s;
    }
    .time {
      width: 55%;
      @include font-s;
    }
    .operator {
      .edit {
        @include font-s;
        color: $add-text-color;
        padding: 0px 5px;
        cursor: pointer;
      }
      .delete {
        @include font-s;
        color: $delete-text-color;
        padding: 0px 5px;
        cursor: pointer;
      }
    }
  }
  .editTimeWrap {
    .TimePanelItem {
      margin: 10px 0px;
    }
    .comfirm {
      color: $add-text-color;
      cursor: pointer;
    }
    .button {
      background-color: transparent;
      color: $add-text-color;
      padding-left: 10px;
    }
    .deletetime {
      color: $delete-text-color;
      cursor: pointer;
    }
    .horizontal-line {
      position: relative;
      padding: 0px 10px;
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
</style>
