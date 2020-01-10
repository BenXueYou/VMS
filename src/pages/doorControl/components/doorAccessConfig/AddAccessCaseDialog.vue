<template>
  <el-dialog :title='title'
             @close="close"
             class='datetimeareadialog timePanelItem'
             :width="width"
             :modal="modal"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :class="{'dialogCenter':center}"
             :append-to-body="true"
             :visible.sync="AddAcessCaseDialogVisible">
    <div class='cb'>

      <el-form :model="ruleForm"
               :rules="rules"
               class="timeForm"
               ref="form"
               label-width="130px">

        <el-form-item label="名称："
                      prop="name">
          <el-input v-model="ruleForm.name"
                    class="nameinput"></el-input>
        </el-form-item>

        <el-form-item label="备注："
                      prop="remarks">
          <el-input class="markinput"
                    v-model="ruleForm.remarks"></el-input>
        </el-form-item>

        <el-form-item label="可通行时间：">

          <el-button class='button'
                     @click='addTime(0)'
                     icon="el-icon-circle-plus-outline"
                     size="small">新增日期</el-button>
          <div class="dash-line"
               style="margin-bottom:15px;">

          </div>

          <div class="timePanelWrap">
            <div class="timeItem"
                 v-for="(item,index) in accessTime"
                 :key="index">
              <el-date-picker v-model="item.startTime"
                              class='eldatapicker'
                              type="date"
                              @change="changeStartTime(index,0,$event)"
                              placeholder="选择日期">
              </el-date-picker>
              <span style="padding:0px 5px;">一</span>
              <el-date-picker v-model="item.endTime"
                              class='eldatapicker'
                              @change="changeEndTime(index,0)"
                              type="date"
                              placeholder="选择日期">
              </el-date-picker>
              <span class='deletetime'
                    @click="deleteAccessTime(index,0)"> 删除</span>
              <el-button class='button'
                         icon="el-icon-circle-plus-outline"
                         v-if="!item.timesArea.length"
                         @click="addFirstTime(index,0)"
                         size="small">新增时段</el-button>
              <time-panel-item-select v-for="(it,idx) in item.timesArea"
                                      class='TimePanelItem'
                                      :key='idx'
                                      :timeOperation='it'
                                      :clearable="false"
                                      :isLast='idx==(item.timesArea.length-1)'
                                      :isShowComfirm='false'
                                      @updateTime="updateTime(index,idx,0,$event)"
                                      @add='addTimeArea(index,0)'
                                      @confirm='confirmTime(index)'
                                      @delete='deleteTime(index,idx,0)'>
              </time-panel-item-select>

            </div>
          </div>

        </el-form-item>

        <el-form-item label="不可通行时间：">

          <el-button class='button'
                     @click='addTime(1)'
                     icon="el-icon-circle-plus-outline"
                     size="small">新增日期</el-button>
          <div class="dash-line"
               style="margin-bottom:15px;">

          </div>

          <div class="timePanelWrap">
            <div class="timeItem"
                 v-for="(item,index) in noAccessTime"
                 :key="index">
              <el-date-picker v-model="item.startTime"
                              class='eldatapicker'
                              type="date"
                              @change="changeStartTime(index,1,$event)"
                              placeholder="选择日期">
              </el-date-picker>
              <span style="padding:0px 5px;">一</span>
              <el-date-picker v-model="item.endTime"
                              class='eldatapicker'
                              type="date"
                              @change="changeEndTime(index,1,$event)"
                              placeholder="选择日期">
              </el-date-picker>
              <span class='deletetime'
                    @click="deleteAccessTime(index,1)"> 删除</span>
              <el-button class='button'
                         icon="el-icon-circle-plus-outline"
                         v-if="!item.timesArea.length"
                         @click="addFirstTime(index,1)"
                         size="small">新增时段</el-button>
              <time-panel-item-select v-for="(it,idx) in item.timesArea"
                                      class='TimePanelItem'
                                      :key='idx'
                                      :timeOperation='it'
                                      :clearable="false"
                                      :isLast='idx==(item.timesArea.length-1)'
                                      @updateTime="updateTime(index,idx,1,$event)"
                                      @add='addTimeArea(index,1)'
                                      @confirm='confirmTime(index)'
                                      @delete='deleteTime(index,idx,1)'>
              </time-panel-item-select>

            </div>
          </div>

        </el-form-item>

        <el-form-item label="">

          <el-button @click='confirm'
                     class="surebtn"
                     type="primary">确定</el-button>

          <el-button @click='close'
                     class="cancelbtn"
                     type="primary">取消</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div style="height:20px;"></div>
  </el-dialog>
</template>

<script>
import TimePanelItemSelect from "@/pages/doorControl/components/doorAccessConfig/TimePanelItemSelect";
import { addHoursTime, getYMD, fixTime } from "@/utils/date.js";
import * as api from "../../utils/ajax.js";

export default {
  name: "AddAccessCaseDialog",
  components: { TimePanelItemSelect },
  props: {
    appendbody: {
      type: Boolean,
      default() {
        return false;
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    },
    modal: {
      type: Boolean,
      default() {
        return true;
      }
    },
    row: {
      type: Object,
      default() {
        return {};
      }
    },
    accessData: {
      type: Array,
      default() {
        return [
          // {
          //   startTime: "2019-03-25",
          //   endTime: "2019-03-28",
          //   timesArea: [
          //     {
          //       startTime: "09:00",
          //       endTime: "18:00"
          //     }
          //   ]
          // },
          // {
          //   startTime: "2019-04-20",
          //   endTime: "2019-06-30",
          //   timesArea: [
          //     {
          //       startTime: "09:00",
          //       endTime: "18:00"
          //     }
          //   ]
          // }
        ];
      }
    },
    noAccessData: {
      type: Array,
      default() {
        return [
          // {
          //   startTime: "2019-03-25",
          //   endTime: "2019-03-28",
          //   timesArea: [
          //     {
          //       startTime: "09:00",
          //       endTime: "12:00"
          //     },
          //     {
          //       startTime: "13:00",
          //       endTime: "18:00"
          //     }
          //   ]
          // }
        ];
      }
    },
    width: {
      type: String,
      default() {
        return "720px";
      }
    },
    mark: {
      type: String,
      default() {
        return "";
      }
    },
    title: {
      type: String,
      default() {
        return "新增通行时间段";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    const validatorlength = (rule, value, callback) => {
      if (value.length > 200) {
        callback(new Error("字符串长度超过200了"));
      } else {
        callback();
      }
    };
    return {
      AddAcessCaseDialogVisible: false,
      remarks: "",
      accessTime: [],
      noAccessTime: [],
      ruleForm: {
        name: "",
        remarks: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 4, max: 32, message: "长度在 4 到 32 个字符", trigger: "blur" }
        ],
        remarks: [
          {
            validator: validatorlength,
            message: "不允许超过200个字符",
            trigger: "blur"
          }
        ]
      },
      ShowAuthDisabled: false,
      OwnAuthDisabled: false
    };
  },
  mounted() {
    this.AddAcessCaseDialogVisible = this.visible;
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("通行时间段", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("通行时间段", "isOwn");
  },
  methods: {
    changeStartTime(index, type, val) {
      let arr = type === 0 ? "accessTime" : "noAccessTime";
      if (this[arr][index].endTime) {
        if (this[arr][index].startTime > this[arr][index].endTime) {
          [this[arr][index].startTime, this[arr][index].endTime] = [
            this[arr][index].endTime,
            this[arr][index].startTime
          ];
        }
      }
    },
    changeEndTime(index, type, val) {
      let arr = type === 0 ? "accessTime" : "noAccessTime";
      if (this[arr][index].startTime) {
        if (this[arr][index].startTime > this[arr][index].endTime) {
          [this[arr][index].startTime, this[arr][index].endTime] = [
            this[arr][index].endTime,
            this[arr][index].startTime
          ];
        }
      }
    },
    deleteAccessTime(index, type) {
      let arr = type === 0 ? "accessTime" : "noAccessTime";
      this[arr].splice(index, 1);
    },
    addFirstTime(index, type) {
      let arr = type === 0 ? "accessTime" : "noAccessTime";
      this[arr][index].timesArea.push({
        startTime: "00:00:00",
        endTime: "23:59:59"
      });
    },
    updateTime(index, idx, type, data) {
      let arr = type === 0 ? "accessTime" : "noAccessTime";
      this[arr][index].timesArea[idx] = data;
    },
    addTimeArea(index, type) {
      // type 表示是添加通行时间还是不通行时间
      let arr = type === 0 ? "accessTime" : "noAccessTime";
      let len = this[arr][index].timesArea.length;
      if (!this[arr][index].timesArea[len - 1].endTime) {
        this.$message.error("请填写当前时段的结束时间，才可以新增时段");
        return;
      }
      if (this[arr][index].timesArea[len - 1].endTime.indexOf("23:59") !== -1) {
        this.$message.error("当前时段的最后时间已经是23:59，不可以再新增时段");
        return;
      }
      if (len >= 4) {
        this.$message.error("最多添加4个时段！");
        return;
      }
      console.log({
        minTime: this[arr][index].timesArea[len - 1].endTime,
        startTime: addHoursTime(this[arr][index].timesArea[len - 1].endTime, 1),
        endTime: addHoursTime(this[arr][index].timesArea[len - 1].endTime, 4)
      });
      this[arr][index].timesArea.push({
        minTime: this[arr][index].timesArea[len - 1].endTime,
        startTime: addHoursTime(this[arr][index].timesArea[len - 1].endTime, 1),
        endTime: addHoursTime(this[arr][index].timesArea[len - 1].endTime, 4)
      });
    },
    updateItem(index, item) {
      console.log(index);
      console.log(item);
    },
    deleteItem(index) {
      // 删除某个数据
    },
    confirmTime(index) {},
    deleteTime(index, idx, type) {
      let arr = type === 0 ? "accessTime" : "noAccessTime";
      this[arr][index].timesArea.splice(idx, 1);
      if (!this[arr][index].timesArea.length) {
        this[arr].splice(index, 1);
      }
    },
    submitDate() {
      // holidayUuid为undefined的时候为新增
      let period = [];
      const turnTime = (arr, isPass = 1) => {
        let time = [];
        for (let j = 0; j < arr.timesArea.length; j++) {
          if (arr.timesArea[j].startTime.split(":").length < 3) {
            arr.timesArea[j].startTime += ":00";
          }
          if (arr.timesArea[j].endTime.split(":").length < 3) {
            arr.timesArea[j].endTime += ":59";
          }
          time.push({
            begin: fixTime(arr.timesArea[j].startTime),
            end: fixTime(arr.timesArea[j].endTime)
          });
        }
        return {
          beginDate: getYMD(arr.startTime),
          endDate: getYMD(arr.endTime),
          isPass,
          content: time
        };
      };
      for (let i = 0; i < this.accessTime.length; i++) {
        period.push(turnTime(this.accessTime[i]));
      }
      for (let i = 0; i < this.noAccessTime.length; i++) {
        period.push(turnTime(this.noAccessTime[i], 0));
      }
      console.log(period);

      // 这里判断年月日下面的时间是否有重叠
      let timeJson = {},
        oneDay = 24 * 60 * 60 * 1000;
      for (let i = 0, len = period.length; i < len; i++) {
        let beginDate = period[i].beginDate;
        let endDate = getYMD(new Date(period[i].endDate).getTime() + oneDay);
        let content = period[i].content;

        do {
          if (!timeJson[beginDate]) {
            timeJson[beginDate] = {};
            timeJson[beginDate].concent = [];
          }
          if (timeJson[beginDate].content) {
            timeJson[beginDate].content = timeJson[beginDate].content.concat(
              content
            );
          } else {
            timeJson[beginDate].content = content;
          }
          let timeStamps = new Date(beginDate).getTime() + oneDay;
          beginDate = getYMD(timeStamps);
        } while (beginDate !== endDate);
      }
      const isSBTE = item => {
        let flag = false;
        for (let i = 1, len = item.length; i < len; i++) {
          if (item[i].begin < item[i - 1].end) {
            flag = true;
            break;
          }
        }
        return flag;
      };
      let isOk = true;
      for (let day in timeJson) {
        let num = timeJson[day].content;
        // 现在所有的时间都放在了timeJson中了，里面只要排序时间段，看下有没有重叠的既可，
        num.sort((item1, item2) => {
          return item1.begin.replace(/:/g, "") - item2.begin.replace(/:/g, "");
        });
        if (isSBTE(num)) {
          this.$message.error(`${day}的时间段有重复，请修改！`);
          isOk = false;
          break;
        }
      }
      if (!isOk) {
        return;
      }
      if (this.row.holidayUuid === undefined) {
        let data = {
          holidayName: this.ruleForm.name,
          period: period,
          remarks: this.ruleForm.remarks
        };
        api.addNewDate(data).then(res => {
          if (res.data.success) {
            this.$message.success("特殊日期添加成功！");
            this.$emit("confirm"); // 添加成功通知事件
            this.$emit("update:visible", false);
          }
        });
      } else {
        let data = this.row;
        data.holidayName = this.ruleForm.name;
        data.remarks = this.ruleForm.remarks;
        data.period = period;
        api.editDate(data, this.row.holidayUuid).then(res => {
          if (res.data.success) {
            this.$message.success("特殊日期修改成功！");
            this.$emit("confirm"); // 添加成功通知事件
            this.$emit("update:visible", false);
          }
        });
      }
      // this.$emit("confirm", this.name);
      // this.$emit("update:visible", false);
    },
    confirm() {
      // 点击确定就来判断当前时间段的规则

      // 1、判断添加是否有空时间段
      if (!this.accessTime.length) {
        this.$message.error("请添加可通行时间段");
        return;
      }

      if (!this.noAccessTime.length) {
        this.$message.error("请添加不可通行时间段");
        return;
      }
      // 判断日期选择的开始和结束日期是否有null
      if (!this.judge(this.accessTime)) {
        return;
      }
      if (!this.judge(this.noAccessTime, "不可通行")) {
        return;
      }

      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitDate();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    judge(arr, text = "通行") {
      console.log(arr);
      for (let i = 0, len = arr.length; i < len; i++) {
        if (!arr[i].startTime) {
          this.$message.error(`第${i + 1}个${text}日期的开始日期没有选择`);
          return false;
        }
        if (!arr[i].endTime) {
          this.$message.error(`第${i + 1}个${text}日期的结束日期没有选择`);
          return false;
        }
        let time = arr[i].timesArea;
        for (let j = 0; j < time.length; j++) {
          if (!time[j].startTime) {
            // console.log(<time j="" />.startTime);
            this.$message.error(
              `第${i + 1}个${text}日期的第${j + 1}个的开始时间没有选择!`
            );
            return false;
          }
          if (!time[j].endTime) {
            this.$message.error(
              `第${j + 1}个${text}日期的第${j + 1}个的结束时间没有选择!`
            );
            return false;
          }
        }
      }
      return true;
    },
    close() {
      this.$emit("update:visible", false);
    },
    addTime(type) {
      let arr = type === 0 ? "accessTime" : "noAccessTime";
      if (this[arr].length >= 4) {
        return this.$message.error("最多添加4个时段");
      }
      this[arr].push({
        startTime: "",
        endTime: "",
        timesArea: [
          {
            startTime: "00:00:00",
            endTime: "23:59:59"
          }
        ]
      });
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.accessTime = JSON.parse(JSON.stringify(this.accessData));
        this.noAccessTime = JSON.parse(JSON.stringify(this.noAccessData));
        this.ruleForm = {
          remarks: this.mark,
          name: this.value
        };
      } else {
        this.accessTime = [];
        this.noAccessTime = [];
      }
      this.AddAcessCaseDialogVisible = this.visible;
    }
  }
};
</script>

<style lang="scss">
@import "@/style/variables.scss";
.datetimeareadialog {
  .TimePanelItem {
    .span {
      @include font-s;
      padding-right: 10px;
    }
    .horizontal-line {
      color: $white15;
      padding: 0px 10px;
    }
    .timeSelect {
      width: 90px;
    }
    .el-input__suffix {
      right: 0px;
    }
  }
  .el-form-item__content,
  .el-form-item__label {
    line-height: 30px;
  }
  .nameinput {
    width: 160px;
    height: 30px;
    input {
      width: 160px;
      @include input30;
    }
  }
  .markinput {
    width: 530px;
    height: 30px;
    input {
      width: 530px;
      @include input30;
    }
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .el-form-item__label {
    font-size: 13px;
  }
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
  .eldatapicker {
    width: 130px;
    .el-input__icon {
      line-height: 30px;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";

$labelwidth: 5em;
.datetimeareadialog {
  .deletetime {
    color: $delete-text-color !important;
    cursor: pointer;
  }
  .TimePanelItem {
    margin: 10px 0px;
  }
  overflow: auto;
  .timePanelWrap {
    min-height: 180px;
    // overflow-y: auto;
  }
  .cb {
    .timeForm {
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .button {
      @include button30;
      @include buttonnoborder;
      padding-left: 10px;
      font-size: 12px;
    }
    .surebtn,
    .cancelbtn {
      @include button30;
    }
  }
}
</style>
