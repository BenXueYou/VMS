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
        设置时段
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
            <el-button @click="editRow(scope.row)"
                       type="text"
                       size="small">修改</el-button>
            <el-button type="text"
                       @click="deleteRow(scope.row)"
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
                              @confirm="addSuccess"
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
import icons from "@/common/js/icon.js";
import AddAccessTimeDialog from "@/pages/doorControl/components/doorAccessConfig/AddAcessTimeDialog";
import ConfirmDialog from "@/common/ConfirmDialog";
import * as api from "@/pages/doorControl/utils/ajax.js";
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
      timeTableData: []
    };
  },
  mounted() {
    this.AddAccesTimeDialogVisible = this.visible;
  },
  methods: {
    addSuccess() {
      this.init();
    },
    handleCurrentChange(row) {
      this.row = row;
    },
    deleteRow(row) {
      console.log(row);
      this.confirmText = `是否删除名称为 ${row.periodName} 的时间段`;
      this.confirmVisible = true;
      this.row = row;
    },
    confirmDelete() {
      api.deleteTime(this.row.periodUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$message.success("时间段删除成功！");
          this.init();
        }
      });
    },
    addTime() {
      this.mark = "";
      this.value = "";
      this.timetitle = "新增通行时间段";
      this.timeData = [];
      this.row = {};
      this.aaaaaaVisible = true;
    },
    editRow(row) {
      api.getTimeDetail(row.periodUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          if (res.data.data) {
            let data = res.data.data;
            this.timetitle = "修改通行时间段";
            this.mark = data.remarks;
            this.value = data.periodName;
            this.row = data;
            let timeArea = [];
            for (let i = 0, len = data.content.length; i < len; i++) {
              let time = [];
              data.content[i].time = data.content[i].time || [];
              data.content[i].weekday = data.content[i].weekday || [];
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
            this.timeData = timeArea;
            console.log(timeArea);
            this.aaaaaaVisible = true;
          }
        }
      });
    },
    confirm() {
      if (!this.row || !this.row.periodUuid) {
        this.$message.error("请点击选择时段！");
        return;
      }
      this.$emit("confirm", this.row);
      this.$emit("update:visible", false);
    },
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    init() {
      api.getTimeListAll().then(res => {
        console.log(res);
        if (res.data.success) {
          this.timeTableData = res.data.data || [];
        }
      });
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.init();
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
