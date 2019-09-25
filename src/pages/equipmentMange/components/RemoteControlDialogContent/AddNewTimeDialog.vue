<template>
  <el-dialog :title='title'
             @close="close"
             class='timeareadialog'
             :width="width"
             :modal="false"
             :close-on-click-modal="false"
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
                      prop="remarks">
          <el-input class="markinput"
                    v-model="ruleForm.mark"></el-input>
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
                             :key="index"
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
            weeks: [0, 1, 2], // 表示有哪些星期 0表示星期一，6是星期天
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
            required: true,
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
      for (let i = 0, len = data.length; i < len; i++) {
        for (let j = 0; j < data[i].weeks.length; j++) {
          let index = data[i].weeks[j];
          num[index] = num[index].concat(data[i].timeArea);
        }
      }
      // 2.如何判断是否有重复的数据呢？先排序，比较当前的startTime跟上一个endTime
      num.sort((item1, item2) => {
        return item1.startTime - item2.startTime;
      });
      console.log(JSON.stringify(num));
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
        if (isSBTE(num[i])) {
          // alert(`星期${i + 1}时段冲突`);
          this.$message.error(`星期${i + 1}时段冲突`);
          return false;
        }
      }
      return true;
    },
    subTime() {
      let content = [];
      for (let i = 0, len = this.timeData.length; i < len; i++) {
        content[i] = {};
        content[i].weekday = this.timeData[i].weeks;
        content[i].time = [];
        let timeArea = this.timeData[i].timeArea;
        for (let j = 0; j < timeArea.length; j++) {
          content[i].time.push({
            begin: timeArea[j].startTime, // 开始时间
            end: timeArea[j].endTime // 结束时间
          });
        }
      }
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
          this.subTime();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      // this.$emit("confirm", this.name);
      // this.$emit("update:visible", false);
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
        this.ruleForm.name = this.value;
        this.ruleForm.remarks = this.mark;
        this.timeData = JSON.parse(JSON.stringify(this.data));
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
  overflow: hidden;
  .timePanelWrap {
    height: 180px;
    overflow-y: auto;
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
