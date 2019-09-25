<template>
	<div class="dialogwraphistory">
		<el-dialog class="dialogaa" :title="title" :visible.sync="diglogvisible" @close="close" center>
			<div class="tableContent">
				<div class="historyLeft">
					<div class="myleftable">
						<el-table :data="tableData" border @row-click="selectedRow" style="width:100%">
							<el-table-column prop="taskname" label="任务名称" width="100"></el-table-column>
							<el-table-column prop="progress" label="进度" width="80">
								<template slot-scope="scope">{{scope.row.progress | turnpercent}}</template>
							</el-table-column>
							<el-table-column prop="statusName" label="状态" width="140">
								<!-- <template slot-scope="scope">
                  {{ translaaaaa(scope.row.status) }}
								</template>-->
							</el-table-column>
							<el-table-column prop="updatetime" label="更新时间"></el-table-column>
							<el-table-column label="操作" width="140">
								<template slot-scope="scope">
									<el-button @click.stop="lookface(scope.row)" type="text" size="small">
										<i class="el-icon-search"></i>
										查看
									</el-button>
									<el-button type="text" size="small" @click.stop="opendialog(scope.row)">
										<i class="el-icon-delete"></i>
										删除
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>

				<div class="arrowLine"></div>
				<div class="historyRight">
					<div class="infoLine">
						<span class="infoItem">状态详情：{{translaaaaa(status)}}</span>
						<span class="infoItem">文件总人数：{{totalStaffSize }}人</span>
						<span class="infoItem">重复人数：{{repeatStaffSize }}人</span>
					</div>
					<div class="infoLine">
						<span class="infoItem">新增人数：{{addStaffSize }}人</span>
						<span class="infoItem">导入失败人脸：{{importFailStaffSize }}人</span>
						<span class="infoItem">注册失败人脸：{{registerFaceSize }}人</span>
					</div>
					<div class="mytable">
						<el-table :data="tableData2" border v-loading="rightloading" style="width:100%">
							<el-table-column label="序号" width="80">
								<template slot-scope="scope">{{("0"+(parseInt(scope.$index)+1)).slice(-2)}}</template>
							</el-table-column>
							<el-table-column prop="staffname" label="姓名" width="100"></el-table-column>
							<el-table-column prop="sexName" label="性别" width="80"></el-table-column>
							<el-table-column prop="idtype" label="证件类型" width="120"></el-table-column>
							<el-table-column prop="credentialno" label="证件号"></el-table-column>
							<el-table-column prop="remarks" label="错误信息"></el-table-column>
						</el-table>
					</div>

					<div class="footer">
						<el-pagination
							background
							layout="prev, pager, next"
							:page-size="pageSize"
							:current-page="pageNow"
							@current-change="currentChange"
							:total="pageCount"
						></el-pagination>
						<p class="totalpagetitle">共{{pageCount}}条</p>
						<div class="tiaozhuan">
							<span>跳转至</span>
							<el-input class="yeshu" v-model="yeshu" @blur="blur" type="number"></el-input>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>

		<displaydk
			:faceDBDialogVisible="faceDBDialogDKVisible"
			:kuname="kuname"
			:library="libraryname"
			:templatetype="templatetype"
			:filename="filename"
			:exprotway="exprotway"
			@close="faceDBDialogDKVisible=false"
		></displaydk>

		<el-dialog title="提示" width="30%" class="aaaaa" :visible.sync="dialogVisible">
			<p class="mydelete">
				<img src="@/assets/delete.png" alt />
				<span>是否确定删除</span>
			</p>
			<span slot="footer" class="dialog-footer aaaaa">
				<el-button type="primary" @click="deletesurt">确 定</el-button>
				<el-button type="primary" @click="dialogVisible = false">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import * as api from "@/pages/faceModule/api";
import displaydk from "@/pages/faceModule/views/page/facedb/basic/displaydk";
export default {
  name: "TheFaceDBDialog",
  components: {
    displaydk
  },

  props: {
    idtypearr: {
      type: Array,
      default: function() {
        return [];
      }
    },
    uploadstatusZnarr: {
      type: Array,
      default: function() {
        return [];
      }
    },
    title: {
      type: String,
      default: "库更新历史"
    },
    faceDBDialogVisible: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    libraryuuid: {
      type: String,
      default: function() {
        return "1";
      }
    },
    libraryname: {
      type: String,
      default() {
        return "";
      }
    },
    realtimeNum: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  filters: {
    turnpercent: function(val) {
      return Math.round(val * 10000) / 100 + "%";
    },
    translate: function(val) {
      var str = val;
      console.log(this.uploadstatusZnarr);
      if (this.uploadstatusZnarr) {
        for (var i = 0, len = this.uploadstatusZnarr.length; i < len; i++) {
          if (this.uploadstatusZnarr[i].typestr === val) {
            str = this.uploadstatusZnarr[i].typename;
          }
        }
      }
      return str;
    }
  },
  computed: {},
  mounted() {},
  data() {
    return {
      diglogvisible: false,
      pageSize: 14,
      pageNow: 1,
      pageCount: 0,
      tableData: [],
      tableData2: [],
      leftPageSize: 10,
      leftPageNow: 1,
      leftPageCount: 0,
      addStaffSize: "",
      errorInfo: "",
      importFailStaffSize: "",
      registerFaceSize: "",
      repeatStaffSize: "",
      totalStaffSize: "",
      taskuuid: "",
      status: "",
      faceDBDialogDKVisible: false,
      kuname: "",
      templatetype: "",
      filename: "",
      exprotway: "",
      showIndex: 0, // 表示左表格，当前显示的第几个
      dialogVisible: false, // 删除的弹窗。
      row: "",
      yeshu: "",
      rightloading: false
    };
  },
  methods: {
    translateStatus() {},
    translaaaaa(val) {
      var str = val;
      console.log("++++++++++++++++");
      console.log(this.uploadstatusZnarr);
      console.log(typeof this.uploadstatusZnarr);
      if (
        typeof this.uploadstatusZnarr === "object" &&
				this.uploadstatusZnarr
      ) {
        for (var i = 0, len = this.uploadstatusZnarr.length; i < len; i++) {
          if (this.uploadstatusZnarr[i].typestr === val) {
            str = this.uploadstatusZnarr[i].typename;
          }
        }
      }
      return str;
    },
    blur() {
      if (this.yeshu !== "") {
        if (this.yeshu > Math.ceil(this.pageCount / this.pageSize)) {
          this.yeshu = Math.ceil(this.pageCount / this.pageSize);
        }
        this.yeshu = parseInt(this.yeshu);
        this.pageNow = this.yeshu;
        this.gettaskdetail();
      }
    },
    init() {
      this.importFailStaffSize = "";
      this.registerFaceSize = "";
      this.repeatStaffSize = "";
      this.totalStaffSize = "";
      this.addStaffSize = "";
      api
        .getkutask({
          currentPage: this.leftPageNow,
          pageSize: this.leftPageSize,
          libraryuuid: this.libraryuuid
        })
        .then(res => {
          this.tableData = [];
          this.tableData2 = [];
          if (
            res.data &&
						res.data.data &&
						res.data.data.list &&
						res.data.data.list.length
          ) {
            for (var i = 0; i < res.data.data.list.length; i++) {
              if (res.data.data.list[i]) {
                res.data.data.list[i].statusName = this.translaaaaa(
                  res.data.data.list[i].status
                );
              }
            }
            this.tableData = res.data.data.list;
            this.showRightTable(res.data.data.list[this.showIndex]);
          }
        });
    },
    gettemplateName(str) {
      for (let i = 0, len = window.face.kutemplate.length; i < len; i++) {
        if (window.face.kutemplate[i].value === str) {
          str = window.face.kutemplate[i].label;
          break;
        }
      }
      return str;
    },
    lookface(row) {
      console.log(row);
      var num = [];
      var arr = [];
      console.log(arr);
      if (row.filesnap) {
        arr = JSON.parse(row.filesnap);
      }
      /* eslint-disable */
			for (var i = 0; arr && i < arr.length; i++) {
				num.push(arr[i].fileName);
			}
			this.kuname = row.taskname;
			// this.templatetype = this.gettemplateName(row.templatetype);
			this.exprotway = row.importmode === "local" ? "本地" : "ftp";
			this.filename = num.join("、");
			this.faceDBDialogDKVisible = true;
		},
		opendialog(row) {
			this.row = row;
			this.dialogVisible = true;
		},
		deleteface() {
			var taskuuid = this.row.taskuuid;
			api.deleteDaoKuTask(taskuuid).then(res => {
				if (res.data && res.data.result === 0) {
					this.$message.success("删除成功！");
					this.init();
				}
			});
		},
		deletesurt() {
			this.deleteface();
			this.dialogVisible = false;
		},
		selectedRow(row, a, b, c) {
			console.log(row);
			this.showRightTable(row);
		},
		currentChange(val) {
			this.pageNow = val;
			this.gettaskdetail();
		},
		close() {
			this.$emit("close");
		},
		gettranslate(zidian, value) {
			var str = value;
			for (var i = 0, len = zidian.length; i < len; i++) {
				if (zidian[i].typestr === value) {
					str = zidian[i].typename;
				}
			}
			return str;
		},
		gettaskdetail(taskuuid) {
			const _this = this;
			this.rightloading = true;
			api
				.gettaskdetail({
					currentPage: this.pageNow,
					pageSize: this.pageSize,
					taskuuid: this.taskuuid
				})
				.then(res => {
					this.tableData2 = [];
					this.pageCount = 0;
					if (
						res.data &&
						res.data.data &&
						res.data.data.list &&
						res.data.data.list.length
					) {
						for (var i = 0, len = res.data.data.list.length; i < len; i++) {
							res.data.data.list[i].sexName =
								res.data.data.list[i].staffsex === "male" ? "男" : "女";
							res.data.data.list[i].idtype = _this.gettranslate(
								_this.idtypearr,
								res.data.data.list[i].credentialtype
							);
						}
						this.tableData2 = res.data.data.list;
						this.pageCount = res.data.data.total;
					}
					if (res.data.result !== 0) {
						this.$message.error(res.data.msg);
					}
					this.rightloading = false;
				})
				.catch(err => {
					console.log(err);
					this.rightloading = false;
				});
		},
		showRightTable(res) {
			this.taskuuid = res.taskuuid;
			this.gettaskdetail();
			this.addStaffSize = res.uploadStaffReportResult.addStaffSize;
			this.errorInfo = res.uploadStaffReportResult.errorInfo;
			this.importFailStaffSize =
				res.uploadStaffReportResult.importFailStaffSize;
			this.registerFaceSize = res.uploadStaffReportResult.registerFaceSize;
			this.repeatStaffSize = res.uploadStaffReportResult.repeatStaffSize;
			this.totalStaffSize = res.uploadStaffReportResult.totalStaffSize;
		}
	},
	watch: {
		realtimeNum() {
			for (var i = 0, len = this.realtimeNum.length; i < len; i++) {
				for (var j = 0, len2 = this.tableData.length; j < len2; j++) {
					if (this.realtimeNum[i].taskuuid === this.tableData[j].taskuuid) {
						this.tableData[j].progress = this.realtimeNum[i].progress;
						this.status = this.realtimeNum[i].status;
					}
				}
			}
			this.tableData.concat();
		},
		faceDBDialogVisible: function(val) {
			this.diglogvisible = val;
			if (val) {
				this.init();
			}
		},
		diglogvisible: function(val) {
			this.diglogvisible = this.faceDBDialogVisible;
		}
	}
};
</script>

<style lang='scss' scoped>
.dialogwraphistory {
	.tableContent {
		font-size: 0px;
		width: 100%;
		height: 650px;
		.historyLeft {
			display: inline-block;
			width: 43%;
			vertical-align: top;
		}
		.arrowLine {
			vertical-align: top;
			position: relative;
			display: inline-block;
			width: 2%;
			height: 100%;
			&::after {
				content: "";
				position: absolute;
				left: 50%;
				top: 0px;
				transform: translate(-50%);
				height: 100%;
				width: 1px;
				background: linear-gradient(
					to bottom,
					rgba(255, 255, 255, 0.15) 0%,
					rgba(255, 255, 255, 0.15) 50%,
					rgba(255, 255, 255, 0) 50%,
					rgba(255, 255, 255, 0) 100%
				);
				background-size: 1px 8px;
				background: no-repeat repeat-y;
			}
		}
		.historyRight {
			vertical-align: top;
			display: inline-block;
			width: 55%;
			.infoLine {
				width: 100%;
				margin: 10px 0px;
				.infoItem {
					width: 30%;
					line-height: 22px;
					display: inline-block;
					font-family: " PingFangSC-Regular";
					font-size: 14px;
					color: #aaaaaa;
				}
			}
		}
	}
	.mytable {
		height: 520px;
	}
	.myleftable {
		height: 660px;
	}
	.footer {
		position: relative;
		margin: 10px 0px;
		.totalpagetitle {
			font-size: 14px;
			color: #fff;
			float: right;
			margin-right: 20px;
			margin-top: 17px;
		}
		.el-pagination {
			margin-right: 180px;
			margin-top: 10px;
			float: right;
		}
		.tiaozhuan {
			position: absolute;
			right: 20px;
			top: 6px;
			span {
				font-size: 14px;
				color: #fff;
				padding-right: 20px;
			}
			.yeshu {
				display: inline-block;
				width: 90px;
				input {
					padding: 0px;
				}
			}
		}
	}
}
</style>

<style lang='scss'>
.dialogaa {
	.el-dialog {
		width: 90%;
		height: 750px;
		max-width: 1600px;
		min-width: 1550px;
	}
}
</style>
