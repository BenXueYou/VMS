<template>
  <el-dialog :title='title'
             @close="close"
             class='timeareadialog'
             :width="width"
             :modal="modal"
             :class="{'dialogCenter':center}"
             :visible.sync="AddAcessTimeDialogVisible">
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
                      v-if='showrRemarks'
                      prop="remarks">
          <el-input class="markinput"
                    v-model="ruleForm.remarks"></el-input>
        </el-form-item>

        <el-form-item label="通行时间：">

          <el-button class='button'
                     @click='addTime'
                     icon="el-icon-circle-plus-outline"
                     size="small">添加</el-button>
          <div class="dash-line"
               style="margin-bottom:15px;">

          </div>

          <div class="timePanelWrap">
            <time-panel-item v-for="(item,index) in timeData"
                             :key="item.weeks+'---'+index"
                             :weeks="item.weeks"
                             :timeArea="item.timeArea"
                             @update="updateItem(index,$event)"
                             @delete='deleteItem(index)'>
            </time-panel-item>
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
import TimePanelItem from "@/pages/doorControl/components/doorAccessConfig/TimePanelItem";
import * as api from "../../utils/ajax.js";
import { turnNumberToweek, fixTime } from "@/utils/date.js";
export default {
  name: "AddAccessTimeDialog.vue",
  components: { TimePanelItem },
  props: {
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
    showrRemarks: {
      type: Boolean,
      default() {
        return true;
      }
    },
    mark: {
      type: String,
      default() {
        return "";
      }
    },
    data: {
      type: Array,
      default() {
        return [
          {
            weeks: [], // 表示有哪些星期 0表示星期一，6是星期天
            timeArea: [
              {
                startTime: "08:00",
                endTime: "10:00",
                minTime: "00:00"
              }
            ]
          }
        ];
      }
    },
    width: {
      type: String,
      default() {
        return "720px";
      }
    },
    title: {
      type: String,
      default() {
        return "新增通行时间段";
      }
    },
    row: {
      type: Object,
      default() {
        return "";
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
    },
    addDataInDialog: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    const validatorlength = (rule, value = "", callback) => {
      if (value.length > 200) {
        callback(new Error("字符串长度超过200了"));
      } else {
        callback();
      }
    };
    return {
      AddAcessTimeDialogVisible: false,
      name: "",
      remarks: "",
      timeData: [],
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
      }
    };
  },
  mounted() {
    this.AddAcessTimeDialogVisible = this.visible;
  },
  methods: {
    updateItem(index, item) {
      console.log(index);
      console.log(item);
      this.timeData[index] = item;
    },
    deleteItem(index) {
      // 删除某个数据
      this.timeData.splice(index, 1);
    },
    judgeDuplicateData(data) {
      // 1.将所有同一天的时间段放在一起，然后判断是否有重叠
      let num = new Array(7).fill([]);
      let flag = true;
      for (let i = 0, len = data.length; i < len; i++) {
        if (!data[i].weeks.length) {
          flag = false;
        }
        for (let j = 0; j < data[i].weeks.length; j++) {
          let index = data[i].weeks[j];
          num[index] = num[index].concat(data[i].timeArea);
        }
        for (let j = 0; j < data[i].timeArea.length; j++) {
          if (!data[i].timeArea[j].startTime) {
            this.$message.error(
              `第${i + 1}个时间段的第${j + 1}个开始时间没有选择！`
            );
            return;
          }
          if (!data[i].timeArea[j].endTime) {
            this.$message.error(
              `第${i + 1}个时间段的第${j + 1}个结束时间没有选择！`
            );
            return;
          }
        }
      }
      if (!flag) {
        this.$message.error("请选择时间段的星期！");
        return false;
      }
      console.log(num);
      // 2.如何判断是否有重复的数据呢？先排序，比较当前的startTime跟上一个endTime

      // console.log(JSON.stringify(num));
      const isSBTE = item => {
        let flag = false;
        for (let i = 1, len = item.length; i < len; i++) {
          if (item[i].startTime < item[i - 1].endTime) {
            flag = true;
            break;
          }
        }
        return flag;
      };
      for (let i = 0; i < 7; i++) {
        let numData = num[i];
        numData.sort((item1, item2) => {
          return (
            item1.startTime.replace(/:/g, "") -
            item2.startTime.replace(/:/g, "")
          );
        });
        if (isSBTE(numData)) {
          // alert(`星期${i + 1}时段冲突`);
          this.$message.error(
            `星期${["一", "二", "三", "四", "五", "六", "七"][i]}时段冲突`
          );
          return false;
        }
      }
      return true;
    },
    submitTime() {
      if (!this.addDataInDialog) {
        // 判断是否需要在这里面添加数据,不需要的话，直接把数据传给上个父节点就行了。
        let data = {
          periodName: this.ruleForm.name,
          remarks: this.ruleForm.remarks,
          timeData: this.timeData
        };

        this.$emit("updateData", data);
        this.$emit("update:visible", false);
        return;
      }

      let content = [];
      for (let i = 0, len = this.timeData.length; i < len; i++) {
        content[i] = {};
        content[i].weekday = this.timeData[i].weeks.map(val => {
          return turnNumberToweek(val);
        });
        content[i].time = [];
        let timeArea = this.timeData[i].timeArea;
        for (let j = 0; j < timeArea.length; j++) {
          // 以冒号分割，看长度
          // 这里将时间处理下，补0
          if (timeArea[j].startTime.split(":").length < 3) {
            timeArea[j].startTime += ":00";
          }
          if (timeArea[j].endTime.split(":").length < 3) {
            timeArea[j].endTime += ":59";
          }

          content[i].time.push({
            begin: fixTime(timeArea[j].startTime), // 开始时间
            end: fixTime(timeArea[j].endTime) // 结束时间
          });
        }
      }
      console.log(content);
      // undefined的时候表示新增 否则为修改
      if (this.row.periodUuid === undefined) {
        let data = {
          periodName: this.ruleForm.name,
          remarks: this.ruleForm.remarks,
          content
        };
        api.addNewTime(data).then(res => {
          console.log(res);
          if (res.data.success) {
            this.$message.success("时间段添加成功！");
            this.$emit("confirm"); // 添加成功通知事件
            this.$emit("update:visible", false);
          }
        });
      } else {
        let data = this.row;
        data.periodName = this.ruleForm.name;
        data.remarks = this.ruleForm.remarks;
        data.content = content;
        api.editTime(data, data.periodUuid).then(res => {
          console.log(res);
          if (res.data.success) {
            this.$message.success("时间段修改成功！");
            this.$emit("confirm"); // 添加成功通知事件
            this.$emit("update:visible", false);
          }
        });
      }
    },
    confirm() {
      if (!this.timeData.length) {
        this.$message.error("请添加通行时间");
        return;
      }
      if (!this.judgeDuplicateData(this.timeData)) {
        return;
      }

      this.$refs.form.validate(valid => {
        if (valid) {
          // 可以通过判断传进来的value值，识别是新增还是修改
          this.submitTime();
          // this.$emit("confirm", this.name);
          // this.$emit("update:visible", false);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    close() {
      this.$emit("update:visible", false);
    },
    addTime() {
      this.timeData.push({
        weeks: [],
        timeArea: [
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
        this.ruleForm = {
          name: this.value,
          remarks: this.mark
        };
        console.log("=========================");
        console.log(this.data);
        this.timeData = this.data;
        this.timeData.concat();
      } else {
        this.timeData = [];
      }
      this.AddAcessTimeDialogVisible = this.visible;
    }
  }
};
</script>

<style lang="scss">
@import "@/style/variables.scss";
.timeareadialog {
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
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";

$labelwidth: 5em;
.timeareadialog {
  overflow: auto;
  overflow-x: hidden;
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
