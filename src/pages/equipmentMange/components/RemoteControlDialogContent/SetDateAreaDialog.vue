<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :modal="false"
             :close-on-click-modal="false"
             class="sadDialog"
             :append-to-body="true"
             :visible.sync="TreechangeNameDialogVisible">
    <div class='body'>

      <el-button class='addIcon'
                 type="primary"
                 @click="addTime"
                 size='small'>
        <img :src="icons.tianjia"
             alt="">
        设置时段
      </el-button>

      <el-table :data="dateTableData"
                max-height="380"
                style="height:250px;"
                highlight-current-row
                @current-change="handleCurrentChange"
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
        <el-table-column prop="holidayName"
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
      <add-access-case-dialog :title="casetitle"
                              :mark="mark"
                              :modal="false"
                              :value="value"
                              :accessData="accessData"
                              :noAccessData="noAccessData"
                              :row="row"
                              @confirm="confirmSuccess"
                              :visible.sync='AddAccesTimeDialogVisible'>

      </add-access-case-dialog>
      <confirm-dialog :visible.sync="confirmVisible"
                      :confirmText="confirmText"
                      :modal="false"
                      @confirm="confirmDelete"></confirm-dialog>
    </div>
  </el-dialog>
</template>

<script>
import icons from "@/common/js/icon.js";
import AddAccessCaseDialog from "@/pages/doorControl/components/doorAccessConfig/AddAccessCaseDialog";
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
            name: "xxxxxxxxxx节",
            accessTimeArea: [
              {
                startTime: "2019-03-25",
                endTime: "2019-03-28",
                timesArea: [
                  {
                    startTime: "09:00:00",
                    endTime: "12:00:00"
                  },
                  {
                    startTime: "13:00:00",
                    endTime: "18:00:00"
                  }
                ]
              },
              {
                startTime: "2019-04-20",
                endTime: "2019-06-30",
                timesArea: [
                  {
                    startTime: "09:00:00",
                    endTime: "18:00:00"
                  }
                ]
              }
            ],
            noAccessTimeArea: [
              {
                startTime: "2019-03-26",
                endTime: "2019-03-28",
                timesArea: [
                  {
                    startTime: "09:00:00",
                    endTime: "12:00:00"
                  },
                  {
                    startTime: "13:00:00",
                    endTime: "18:00:00"
                  }
                ]
              }
            ],
            remarks: ""
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
        return "特殊日期组";
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
      casetitle: "",
      mark: "",
      icons,
      name: "",
      accessData: [], // 传入时间操作弹框的数据
      noAccessData: [],
      AddAccesTimeDialogVisible: false,
      TreechangeNameDialogVisible: false,
      value: "",
      row: {},
      dateTableData: [],
      confirmVisible: false,
      confirmText: ""
    };
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
  },
  methods: {
    handleCurrentChange(row) {
      this.row = row;
    },
    editRow(row) {
      api
        .getDateDetatil({ holidayUuid: row.holidayUuid }, row.holidayUuid)
        .then(res => {
          console.log(res);
          if (res.data.success) {
            // 处理成我想要的数据格式
            let accessTimeArea = [];
            let noAccessTimeArea = [];
            let period = res.data.data.period;
            console.log(period);
            if (period) {
              for (let j = 0; j < period.length; j++) {
                let timeArea = {};
                timeArea.startTime = period[j].beginDate;
                timeArea.endTime = period[j].endDate;
                timeArea.timesArea = [];

                if (period[j].content) {
                  for (let k = 0; k < period[j].content.length; k++) {
                    timeArea.timesArea.push({
                      startTime: period[j].content[k].begin,
                      endTime: period[j].content[k].end
                    });
                  }
                }

                if (period[j].pass || period[j].isPass) {
                  accessTimeArea.push(timeArea);
                } else {
                  noAccessTimeArea.push(timeArea);
                }
              }
            }
            console.log(accessTimeArea);
            console.log(noAccessTimeArea);
            this.mark = "编辑备注";
            this.value = "编辑名称";
            this.casetitle = "修改特殊日期组";
            this.accessData = accessTimeArea;
            this.noAccessData = noAccessTimeArea;
            this.row = res.data.data;
            this.AddAccesTimeDialogVisible = true;
          }
        });
    },
    deleteRow(row) {
      this.confirmText = `是否删除名称为 ${row.holidayName} 的特殊日期组！`;
      this.confirmVisible = true;
      this.row = row;
    },
    confirmDelete() {
      api.deleteDate(this.row.holidayUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$message.success("特殊日期删除成功！");
          this.init();
        }
      });
    },
    addTime() {
      this.mark = "";
      this.value = "";
      this.casetitle = "新增特殊日期组";
      this.noAccessData = [];
      this.accessData = [];
      this.row = {};
      this.AddAccesTimeDialogVisible = true;
    },
    confirmSuccess() {
      this.init();
    },
    confirm() {
      if (!this.row || !this.row.holidayUuid) {
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
      api.getDateListAll().then(res => {
        console.log(res);
        if (res.data.success) {
          this.dateTableData = res.data.data || [];
        }
      });
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.init();
      } else {
        this.dateTableData = [];
      }
      this.TreechangeNameDialogVisible = this.visible;
    }
  },
  components: {
    AddAccessCaseDialog,
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
