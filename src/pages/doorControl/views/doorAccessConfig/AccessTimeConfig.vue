<template>
  <div class="wrap"
       ref="tablecontent">
    <!-- <el-button class='button'
               type="primary"
               @click='add'>
      <img :src="icons.newAdd"
           alt="">
      新增
		</el-button>-->
    <el-button :disabled="!OwnAuthDisabled"
               type="primary"
               style="margin-bottom:20px;"
               size="small"
               @click="add"
               icon="el-icon-edit-outline">新增</el-button>

		<div class="tableContent" :style="{'height':tableHeight+'px'}">
			<el-table :data="tableData" class="mytable" style="width: 100%;overflow:initial;">
				<el-table-column prop="name" width="180" label="名称"></el-table-column>
				<el-table-column prop="weeks" label="自然周">
					<template slot-scope="scope">
						<p v-for="(item , index) in scope.row.weeks" :key="index">{{item}}</p>
					</template>
				</el-table-column>
				<el-table-column prop="timeAreas" label="通行时间">
					<template slot-scope="scope">
						<el-tooltip :content="item" v-for="(item , index) in scope.row.timeAreas" :key="index">
							<div>{{item}}</div>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="remarks" label="备注"></el-table-column>
				<el-table-column label="操作" width="210">
					<template slot-scope="scope">
						<el-button
							:disabled="!OwnAuthDisabled"
							@click="editEquipment(scope.row)"
							type="text"
							size="small"
						>编辑</el-button>
						<el-button
							:disabled="!OwnAuthDisabled"
							type="text"
							class="deleteText"
							@click="deleteEquip(scope.row)"
							size="small"
						>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-pagination
			@current-change="handleCurrentChange"
			:current-page.sync="pageNow"
			:page-size="pageSize"
			background
			class="pagination"
			layout="total, prev, pager, next, jumper"
			:total="dataTotal"
		></el-pagination>

    <add-access-time-dialog :visible.sync="AddAccesTimeDialogVisible"
                            :title="title"
                            :mark="mark"
                            :value="value"
                            :row="row"
                            @confirm="addSuccess"
                            :data="timeData"></add-access-time-dialog>

    <confirm-dialog :visible.sync="confirmVisible"
                    :confirmText="confirmText"
                    @confirm="confirm"></confirm-dialog>
  </div>
</template>

<script>
import AddAccessTimeDialog from "@/pages/doorControl/components/doorAccessConfig/AddAcessTimeDialog";
import ConfirmDialog from "@/common/ConfirmDialog";
import { turnTimesArea, turnWeek, turnWeekToNumber } from "@/utils/date.js";
import icons from "@/common/icon.js";
import * as api from "../../utils/ajax.js";

export default {
  components: {
    AddAccessTimeDialog,
    ConfirmDialog
  },
  methods: {
    confirm() {
      api.deleteTime(this.row.periodUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          this.$message.success("时间段删除成功！");
          this.getTimeList();
        }
      });
    },
    handleCurrentChange(val) {
      this.pageNow = val;
      this.getTimeList();
    },
    getTimeList() {
      this.tableData = [];
      api
        .getTimeList({
          limit: this.pageSize,
          page: this.pageNow
        })
        .then(res => {
          console.log(res);
          if (res.data.success) {
            if (res.data.data) {
              this.dataTotal = res.data.data.total;
              let data = res.data.data.list;
              for (let i = 0, len = data.length; i < len; i++) {
                data[i].weeks = [];
                data[i].timeAreas = [];
                data[i].name = data[i].periodName;
                let timeData = data[i].content;
                if (timeData) {
                  for (let j = 0; j < timeData.length; j++) {
                    timeData[j].weekday = timeData[j].weekday.map(val => {
                      return turnWeekToNumber(val);
                    });
                    timeData[j].weekday = timeData[j].weekday.sort();
                    data[i].weeks[j] = turnWeek(timeData[j].weekday);
                    data[i].timeAreas[j] = turnTimesArea(timeData[j].time);
                  }
                }
              }
              console.log(data);
              this.tableData = data;
            }
          }
        });
    },
    addSuccess() {
      // 新增时间段成功回调
      this.getTimeList();
    },
    add() {
      this.mark = "";
      this.value = "";
      this.title = "新增通行时间段";
      this.timeData = [];
      this.row = {};
      this.AddAccesTimeDialogVisible = true;
    },
    editEquipment(row) {
      console.log(row);
      api.getTimeDetail(row.periodUuid).then(res => {
        console.log(res);
        if (res.data.success) {
          if (res.data.data) {
            let data = res.data.data;
            this.title = "修改通行时间段";
            this.mark = data.remarks;
            this.value = data.periodName;
            this.row = data;
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
            this.timeData = timeArea;
            console.log(timeArea);
            this.AddAccesTimeDialogVisible = true;
          }
        }
      });
    },
    deleteEquip(row) {
      this.confirmText = `是否删除名称为 ${row.name} 的时间段`;
      this.confirmVisible = true;
      this.row = row;
    }
  },
  data() {
    return {
      row: {},
      confirmVisible: false,
      confirmText: "",
      tableHeight: 500,
      dataTotal: 1,
      pageNow: 1,
      pageSize: 10,
      value: "",
      mark: "",
      title: "新增通行时间段",
      icons,
      AddAccesTimeDialogVisible: false,
      timeData: [], // 传入时间操作弹框的数据
      tableData: new Array(0).fill({
        name: "xxxxxxxxxx权限",
        // week: "周一、周三至周五、周日",
        times: [
          {
            weeks: [0, 1], // 表示有哪些星期 0表示星期一，6是星期天
            timeArea: [
              {
                startTime: "08:00:00",
                endTime: "10:00:00",
                minTime: "00:00:00"
              },
              {
                startTime: "18:00:00",
                endTime: "20:00:00",
                minTime: "00:00:00"
              }
            ]
          },
          {
            weeks: [2, 3, 5], // 表示有哪些星期 0表示星期一，6是星期天
            timeArea: [
              {
                startTime: "08:00:00",
                endTime: "10:00:00",
                minTime: "00:00:00"
              }
            ]
          }
        ],
        remark: ""
      }),
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  mounted() {
    // let data = this.tableData;
    // for (let i = 0, len = data.length; i < len; i++) {
    //   data[i].weeks = [];
    //   data[i].timeAreas = [];
    //   let timeData = data[i].times;
    //   for (let j = 0; j < timeData.length; j++) {
    //     data[i].weeks[j] = turnWeek(timeData[j].weeks);
    //     data[i].timeAreas[j] = turnTimesArea(timeData[j].timeArea);
    //   }
    // }
    // this.pageSize = ~~(this.tableHeight / 70);
    this.tableHeight = window.innerHeight - 30 - 120 - 100;
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("通行时间段", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("通行时间段", "isOwn");
    if (!this.ShowAuthDisabled) return;
    this.getTimeList();
  }
};
</script>

<style lang="scss">
.mytable {
	p {
		margin: 0px;
	}
}
</style>

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
