<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :modal="false"
             :close-on-click-modal="false"
             class="sadDialog"
             :visible.sync="AddAccesTimeDialogVisible">
    <div class='body'>

      <el-button class='addIcon'
                 type="primary"
                 @click="addTime"
                 size='small'>
        <img :src="icons.tianjia"
             alt="">
        新增时间段
      </el-button>

      <el-table :data="timeTableData"
                max-height="380"
                style="height:250px;"
                highlight-current-row
                @current-change="handleCurrentChange"
                ref="table"
                border>
        <el-table-column prop="xulie"
                         width="80"
                         label="编号">
          <template slot-scope="scope">
            <div>
              {{("0"+(scope.$index+1)).slice(-2)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="periodName"
                         label="时段名称"></el-table-column>
        <el-table-column width="120"
                         label="操作">
          <template slot-scope="scope">
            <el-button @click="editRow(scope.row,scope.$index)"
                       v-if="scope.row.defaulted!=1"
                       type="text"
                       size="small">修改</el-button>
            <el-button type="text"
                       v-if="scope.row.defaulted!=1"
                       @click="deleteRow(scope.row,scope.$index)"
                       class="deleteText"
                       size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="btn-group">
        <el-button @click='confirm'
                   type="primary">确定</el-button>
        <el-button @click='close'
                   type="primary">取消</el-button>
      </div>

      <add-access-time-dialog :visible.sync='aaaaaaVisible'
                              :title="timetitle"
                              :mark="mark"
                              :value="value"
                              :row="row"
                              :showrRemarks="false"
                              :addDataInDialog="false"
                              @updateData="updateData"
                              :modal="false"
                              :data="timeData">
      </add-access-time-dialog>
      <confirm-dialog :visible.sync="confirmVisible"
                      :confirmText="confirmText"
                      :modal="false"
                      @confirm="confirmDelete"></confirm-dialog>
    </div>
  </el-dialog>
</template>

<script>
import icons from "@/common/icon.js";
import AddAccessTimeDialog from "@/pages/doorControl/components/doorAccessConfig/AddAcessTimeDialog";
import ConfirmDialog from "@/common/ConfirmDialog";
import { turnWeekToNumber, turnNumberToweek } from "@/utils/date.js";
// import * as api from "@/pages/doorControl/utils/ajax.js";
import * as api2 from "@/pages/equipmentMange/ajax.js";
export default {
  name: "TreeChangeNameDialog.vue",
  props: {
    tableData: {
      type: Array,
      default() {
        return [
          {
            xulie: "01",
            name: "时段1名字",
            times: [
              {
                weeks: [0, 1, 2, 3, 5], // 表示有哪些星期 0表示星期一，6是星期天
                timeArea: [
                  {
                    startTime: "08:00:00",
                    endTime: "10:00:00",
                    minTime: "00:00:00"
                  },
                  {
                    startTime: "08:00:00",
                    endTime: "10:00:00",
                    minTime: "00:00:00"
                  }
                ]
              },
              {
                weeks: [0, 1, 2, 3, 5], // 表示有哪些星期 0表示星期一，6是星期天
                timeArea: [
                  {
                    startTime: "08:00:00",
                    endTime: "10:00:00",
                    minTime: "00:00:00"
                  }
                ]
              }
            ]
          },
          {
            xulie: "02",
            name: "时段1名字"
          },
          {
            xulie: "03",
            name: "时段1名字"
          },
          {
            xulie: "04",
            name: "时段1名字"
          },
          {
            xulie: "05",
            name: "时段1名字"
          }
        ];
      }
    },
    width: {
      type: String,
      default() {
        return "700px";
      }
    },
    title: {
      type: String,
      default() {
        return "设备时段";
      }
    },
    visible: {
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
    deviceUuid: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      icons,
      name: "",
      data: [],
      aaaaaaVisible: false,
      confirmVisible: false,
      AddAccesTimeDialogVisible: false,
      timeData: [],
      row: {},
      confirmText: "",
      mark: "",
      value: "",
      timetitle: "",
      timeTableData: [],
      oriData: []
    };
  },
  mounted() {
    this.AddAccesTimeDialogVisible = this.visible;
  },
  methods: {
    updateData(data) {
      if (this.row.index === -1) {
        this.timeTableData.push(data);
      } else {
        this.timeTableData.splice(this.row.index, 1, data);
      }
      console.log(data);
      console.log(this.timeTableData);
    },
    addSuccess() {
      this.init();
    },
    handleCurrentChange(row) {
      this.row = row;
    },
    deleteRow(row, index) {
      console.log(row);
      this.confirmText = `是否删除名称为 ${row.periodName} 的时间段`;
      this.confirmVisible = true;
      this.row = row;
      this.row.index = index;
    },
    confirmDelete() {
      this.timeTableData.splice(this.row.index, 1);
      // api.deleteTime(this.row.periodUuid).then(res => {
      //   console.log(res);
      //   if (res.data.success) {
      //     this.$message.success("时间段删除成功！");
      //     this.init();
      //   }
      // });
    },
    addTime() {
      this.mark = "";
      this.value = "";
      this.timetitle = "新增通行时间段";
      this.timeData = [];
      this.row = {};
      this.row.index = -1;
      this.aaaaaaVisible = true;
    },
    editRow(row, index) {
      console.log(row);
      let data = row;
      this.timetitle = "修改通行时间段";
      this.mark = data.remarks;
      this.value = data.periodName;
      this.row = data;
      this.row.index = index;
      this.timeData = row.timeData;
      console.log(this.timeData);
      this.aaaaaaVisible = true;
    },
    confirm() {
      let num = [];
      for (let i = 0; i < this.timeTableData.length; i++) {
        let data = {};
        data.periodName = this.timeTableData[i].periodName;
        data.periodUuid = this.timeTableData[i].periodUuid;
        data.content = this.turnBackTime(this.timeTableData[i].timeData);
        num.push(data);
      }
      num = num.concat(this.oriData);
      console.log(JSON.stringify(num));
      api2.setTime(num, this.deviceUuid).then(res => {
        if (res.data.success) {
          this.$message.success("时间设置成功");
          this.$emit("confirm", this.row);
          this.$emit("update:visible", false);
        }
      });
    },
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    turnBackTime(timeData) {
      let content = [];
      for (let i = 0, len = timeData.length; i < len; i++) {
        content[i] = {};
        content[i].weekday = timeData[i].weeks.map(val => {
          return turnNumberToweek(val);
        });
        content[i].time = [];
        let timeArea = timeData[i].timeArea;
        for (let j = 0; j < timeArea.length; j++) {
          // 以冒号分割，看长度
          if (timeArea[j].startTime.split(":").length < 3) {
            timeArea[j].startTime += ":00";
          }
          if (timeArea[j].endTime.split(":").length < 3) {
            timeArea[j].endTime += ":59";
          }

          content[i].time.push({
            begin: timeArea[j].startTime, // 开始时间
            end: timeArea[j].endTime // 结束时间
          });
        }
      }
      return content;
    },
    changeTime(data) {
      let timeArea = [];
      for (let i = 0, len = data.content.length; i < len; i++) {
        let time = [];
        data.content[i].time = data.content[i].time || [];
        data.content[i].weekday = data.content[i].weekday || [];
        data.content[i].weekday = data.content[i].weekday.map(item => {
          return turnWeekToNumber(item);
        });
        for (let j = 0; j < data.content[i].time.length; j++) {
          time.push({
            startTime: data.content[i].time[j].begin,
            endTime: data.content[i].time[j].end
          });
        }
        let t = data.content[i].weekday || [];
        t = t.map(val => {
          return parseInt(val);
        });
        timeArea.push({
          weeks: t,
          timeArea: time || []
        });
      }
      return timeArea;
    }
  },
  watch: {
    visible(val) {
      if (val) {
        // this.init();
        // 使用传进来的数据
        let data = JSON.parse(JSON.stringify(this.tableData));
        let oriData = [],
          tData = [];
        // console.log(this.tableData);
        for (let i = 0, len = data.length; i < len; i++) {
          if (data[i].content || data[i].defaulted !== 1) {
            data[i].name = data[i].periodName;
            data[i].content = data[i].content || [];
            data[i].timeData = this.changeTime(data[i]);
            tData.push(data[i]);
          } else {
            oriData.push(data[i]);
          }
        }
        this.oriData = oriData;
        this.timeTableData = tData;
      } else {
        this.timeTableData = [];
      }
      this.AddAccesTimeDialogVisible = this.visible;
    }
  },
  components: {
    AddAccessTimeDialog,
    ConfirmDialog
  }
};
</script>
<style lang="scss">
@import "@/style/variables.scss";
.sadDialog {
  .btn-group {
    margin-top: 40px;
    float: right;
    button {
      @include button30;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "@/style/variables.scss";
.sadDialog {
  .body {
    padding: 30px 40px;
    box-sizing: border-box;
    height: 450px;
    .addIcon {
      @include button30;
      @include buttonnoborder;
    }
  }
}
</style>
