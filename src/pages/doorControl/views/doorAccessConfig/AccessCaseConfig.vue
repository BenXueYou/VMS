<template>
  <div class="wrap">
    <el-button :disabled="!OwnAuthDisabled"
               class="button"
               type="primary"
               @click="add">
      <img :src="icons.newAdd"
           alt />
      新增
    </el-button>
    <div class="tableContent"
         :style="{'height':tableHeight+'px'}">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column prop="name"
                         width="180"
                         label="名称"></el-table-column>
        <el-table-column prop="accessTimeArea"
                         label="通行时间">
          <template slot-scope="scope">
            <div class="dateLine"
                 v-for="(item , index) in scope.row.accessTimeArea"
                 :key="index">
              <div class="date">{{item.startTime}}~{{item.endTime}}</div>
              <div class="time">
                <div class="time"
                     v-for="(time,i) in item.timesArea"
                     :key="i">{{time.startTime}} ~ {{time.endTime}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="noAccessTimeArea"
                         label="不可通行时间">
          <template slot-scope="scope">
            <div class="dateLine"
                 v-for="(item , index) in scope.row.noAccessTimeArea"
                 :key="index">
              <div class="date">{{item.startTime}}~{{item.endTime}}</div>
              <div class="time">
                <div v-for="(time,i) in item.timesArea"
                     :key="i">{{time.startTime}} ~ {{time.endTime}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remarks"
                         width="180"
                         label="备注"></el-table-column>
        <el-table-column label="操作"
                         width="200">
          <template slot-scope="scope">
            <el-button :disabled="!OwnAuthDisabled"
                       @click="editEquipment(scope.row)"
                       type="text"
                       size="small">编辑</el-button>
            <el-button :disabled="!OwnAuthDisabled"
                       type="text"
                       class="deleteText"
                       @click="deleteEquip(scope.row)"
                       size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination @current-change="handleCurrentChange"
                   :current-page.sync="pageNow"
                   :page-size="pageSize"
                   background
                   class="pagination"
                   layout="total, prev, pager, next, jumper"
                   :total="dataTotal"></el-pagination>

    <add-access-case-dialog :title="title"
                            :mark="mark"
                            :value="value"
                            :accessData="accessData"
                            :noAccessData="noAccessData"
                            :row="row"
                            @confirm="confirmSuccess"
                            :visible.sync="AddAccesTimeDialogVisible"></add-access-case-dialog>

    <confirm-dialog :visible.sync="confirmVisible"
                    :confirmText="confirmText"
                    @confirm="confirm"></confirm-dialog>
  </div>
</template>

<script>
import ConfirmDialog from "@/common/ConfirmDialog";
import AddAccessCaseDialog from "@/pages/doorControl/components/doorAccessConfig/AddAccessCaseDialog";
import icons from "@/common/icon.js";
import * as api from "../../utils/ajax.js";
export default {
  components: {
    AddAccessCaseDialog,
    ConfirmDialog
  },
  methods: {
    confirm() {
      api.deleteDate(this.row.holidayUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          this.row = {};
          this.$message.success("删除成功！");
          this.getDateList();
        }
      });
    },
    confirmSuccess() {
      this.getDateList();
    },
    getDateList() {
      this.tableData = [];
      api
        .getDateList({
          limit: this.pageSize,
          page: this.pageNow
        })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            if (res.data.data) {
              this.dataTotal = res.data.data.total;
              let data = res.data.data.list || [];
              for (let i = 0, len = data.length; i < len; i++) {
                data[i].name = data[i].holidayName;
                let period = data[i].period;
                let accessTimeArea = [],
                  noAccessTimeArea = [];
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
                data[i].accessTimeArea = accessTimeArea;
                data[i].noAccessTimeArea = noAccessTimeArea;
              }
              this.tableData = data;
            }
          }
        });
    },
    handleCurrentChange(val) {
      this.pageNow = val;
      this.getDateList();
    },
    add() {
      this.mark = "";
      this.value = "";
      this.title = "新增特殊日期组";
      this.noAccessData = [];
      this.accessData = [];
      this.row = {};
      this.AddAccesTimeDialogVisible = true;
    },
    editEquipment(row) {
      console.log(row);
      api
        .getDateDetatil({ holidayUuid: row.holidayUuid }, row.holidayUuid)
        .then(res => {
          console.log(res);
          if (res.data.success) {
            this.mark = row.remarks;
            this.value = row.holidayName;
            this.title = "修改特殊日期组";
            this.accessData = row.accessTimeArea;
            this.noAccessData = row.noAccessTimeArea;
            this.row = res.data.data;
            this.AddAccesTimeDialogVisible = true;
          }
        });
    },
    deleteEquip(row) {
      console.log(row);
      this.confirmText = `是否删除名称为 ${row.name} 的特殊日期`;
      this.row = row;
      this.confirmVisible = true;
    },
    getDateDetail() {
      // api.getDateDetatil({ holidayUuid: 111 }, 111).then(res => {
      //   console.log(res);
      // });
    }
  },
  data() {
    return {
      confirmVisible: false,
      confirmText: "",
      row: {},
      pageNow: 1,
      dataTotal: 1,
      pageSize: 10,
      tableHeight: "500",
      value: "",
      mark: "",
      title: "新增特殊日期组",
      icons,
      AddAccesTimeDialogVisible: false,
      accessData: [], // 传入时间操作弹框的数据
      noAccessData: [],
      tableData: new Array(0).fill({
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
      }),
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  mounted() {
    this.tableHeight = window.innerHeight - 30 - 120 - 100;
    this.pageSize = ~~(this.tableHeight / 70);
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("特殊日期", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("特殊日期", "isOwn");
    if (!this.ShowAuthDisabled) return;
    this.getDateList();
  }
};
</script>

<style lang="scss" scoped>
@import "@/style/variables.scss";

.wrap {
	height: 100%;
	padding: $rightContentPadding;
	box-sizing: border-box;
	background-color: $rigthContentBackgroundColor;
	.tableContent {
		overflow: auto;
	}
	.dateLine {
		display: flex;
		flex-wrap: wrap;
		@include font-s;
		font-size: 13px;
		line-height: 20px;
		.date {
			width: 200px;
			text-align: right;
		}
		.time {
			width: 140px;
			text-align: left;
			text-indent: 15px;
		}
	}
	.button {
		@include button30;
		@include font-s;
		font-size: 13px;
		margin: 0px 0px 20px;
	}
	.pagination {
		margin-top: 15px;
		float: right;
	}
}
</style>
