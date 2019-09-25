<template>
	<div class="VistorList" v-loading="showLoading">
		<div class="header">
			<div>访客列表</div>
		</div>
		<div class="main">
			<div class="main-header">
				<div>
					<el-button type="default" size="mini">数据统计</el-button>
					<el-button type="default" size="mini">导出</el-button>
				</div>
				<div class="rightgroup">
					<span class="title">访客姓名：</span>
					<el-input class="input staffNameInput" v-model="staffName"></el-input>
					<el-button type="primary" @click="queryBtnAct" icon="el-icon-search" size="small">检索</el-button>
					<el-button type="primary" v-popover:popover1 size="small">其他条件检索</el-button>
					<el-popover
						ref="popover1"
						placement="bottom-end"
						:visible-arrow="false"
						width="600"
						trigger="click"
					>
						<vistor-search-view @query="queryAct"></vistor-search-view>
					</el-popover>
					<el-button type="primary" @click="tableOrTableCell = !tableOrTableCell" size="small">切换视图</el-button>
				</div>
			</div>
			<el-table
				v-if="!tableOrTableCell"
				ref="VistorListTable"
				:data="tableData"
				tooltip-effect="dark"
				class="tableBoxClass"
				@sort-change="sortChange"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="index" :index="tableIndex" label="序号" width="55"></el-table-column>
				<el-table-column prop="visitorName" label="姓名" width="120"></el-table-column>
				<el-table-column prop="gender" label="性别" width="80">
					<template slot-scope="scope">{{$common.getEnumItemName("gender", scope.row.gender)}}</template>
				</el-table-column>
				<el-table-column prop="phoneNo" label="手机号码" width="120"></el-table-column>
				<el-table-column prop="plateNo" label="车牌号码" width="110" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="company" label="访客单位"></el-table-column>
				<el-table-column prop="firstRegDatetime" label="首次登记时间" show-overflow-tooltip sortable="custom"></el-table-column>
				<el-table-column prop="lastRegDatetime" label="最近登记时间" show-overflow-tooltip sortable="custom"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<div class="tableCertificateBtnClass">
							<span @click="detailBtnAct(scope.row)" class="editFontClass cursorClass">详情</span>
							<span
								v-if="!scope.row.black"
								@click="signBlacklistBtnAct(scope.row)"
								class="deleteBtnClass cursorClass"
							>拉黑</span>
							<span
								v-if="scope.row.black"
								@click="signWhitelistBtnAct(scope.row)"
								class="signOffBtnClass cursorClass"
							>解除拉黑</span>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<div v-else class="tableView">
				<el-checkbox class="checkedAll" v-model="checkedAll" @change="checkedAllChange" label="本页全选"></el-checkbox>
				<div class="tableCellContent">
					<div class="cellBox" v-for="(item,index) in tableCellData" :key="index">
						<el-popover
							:visible-arrow="false"
							:popper-class="!isShow?'VistorListPopoverClass':'cellPopoverHidden'"
							placement="bottom"
							trigger="click"
						>
							<el-row class="popoverBox" justify="space-between">
								<el-col class="VCelPopoverCol cursorClass" @click.native="detailBtnAct(item)">
									<img class="img" src="@/assets/images/personMange/detail1.png" />
									详情
								</el-col>
								<el-col
									v-if="!item.black"
									class="VCelPopoverCol cursorClass"
									@click.native="signBlacklistBtnAct(item)"
								>
									<img class="img" src="@/assets/images/personMange/delete1.png" />
									拉黑
								</el-col>
								<el-col
									v-if="item.black"
									class="VCelPopoverCol cursorClass"
									@click.native="signWhitelistBtnAct(item)"
								>
									<img class="img" src="@/assets/images/personMange/delete1.png" />
									解除拉黑
								</el-col>
							</el-row>
							<el-row slot="reference" class="cellItemClass">
								<div class="imgBox">
									<img
										class="images"
										:src="item.certificatePhotoUri?imageUrl+item.certificatePhotoUri:item.snapPhotoUri?imageUrl+item.snapPhotoUri:require('@/assets/images/user.png')"
										alt
									/>
								</div>
								<div class="txtBox">
									<div
										class="textClips"
										@mouseover="mymouseover"
										@mouseout="mymouseout"
										@mousemove="mymousemove"
									>
										<span>{{item.visitorName}}</span>
									</div>
									<div>{{item.phoneNo}}</div>
									<div
										class="textClips"
										@mouseover="mymouseover"
										@mouseout="mymouseout"
										@mousemove="mymousemove"
									>{{item.company || '访客单位'}}</div>
								</div>
								<el-checkbox class="checkBox" v-model="item.checked" @change="checkBoxChange(item)"></el-checkbox>
							</el-row>
						</el-popover>
					</div>
				</div>
			</div>
			<vistor-detail :visible="isShow" :vistorDetail="vistorDetail" @close="closeDetail"></vistor-detail>
			<!----------------------------------表格分页器---------------------------------->
			<div class="footer">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					layout="total,prev, pager, next,jumper"
					:page-size="pageSize"
					:total="total"
					background
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
import VistorSearchView from "../../components/vistorRecord/VistorSearchView";
import VistorDetail from "../../components/vistorRecord/VistorDetail";
import * as api from "../../utils/ajax";
export default {
  components: { VistorSearchView, VistorDetail },
  props: {},
  data() {
    return {
      tableData: window.config.tableData,
      validateTimeStart: null,
      validateTimeEnd: null,
      staffName: "",
      currentPage: 1,
      pageSize: 15,
      tableSize: 15,
      tableCellSize: 30,
      total: 0,
      tableOrTableCell: false,
      tableCellData: [],
      checkedAll: false,
      isShow: false,
      checkVistorUuids: [],
      vistorDetail: {},
      showLoading: false,
      otherSearchData: {},
      imageUrl: window.config.imageUrl
    };
  },
  created() {},
  mounted() {
    let h =
			window.innerHeight ||
			document.documentElement.clientHeight ||
			document.body.clientHeight;
    let w =
			window.innerWidth ||
			document.documentElement.clientWidth ||
			document.body.clientWidth;
    this.$nextTick(res => {
      this.$refs.VistorListTable.$el.style.height = h - 315 + "px";
    });
    // 这里 -1 是为了去掉表头高度
    this.tableSize = parseInt((h - 315) / 50) - 1;
    this.tableCellSize = parseInt((w - 340) / 158) * parseInt((h - 350) / 210);
    console.log(w - 340, h - 350, this.pageSize, "--", this.tableCellSize);
    // 当窗口发生变化时
    let that = this;
    window.addEventListener("resize", function() {
      let h =
				window.innerHeight ||
				document.documentElement.clientHeight ||
				document.body.clientHeight;
      console.log(that);
      that.$nextTick(res => {
        that.$refs.VistorListTable.$el.style.height = h - 315 + "px";
      });
      that.tableSize = parseInt((h - 315) / 50) - 1;
      that.tableCellSize =
				parseInt((w - 340) / 158) * parseInt((h - 350) / 235);
      console.log(that.pageSize, that.tableCellSize);
    });
    this.pageSize = !this.tableOrTableCell
      ? this.tableSize
      : this.tableCellSize;
    this.currentPage = !this.tableOrTableCell ? this.currentPage : 1;
  },
  activated() {
    console.log(this.$route.params.data, "---------VistorList-------");
    var params = this.$route.params.data;
    var data = {};
    if (params && params.visitorUuid) {
      data.visitorUuid = params.visitorUuid;
    }
    this.currentPage = 1;
    Object.assign(this.otherSearchData, data);
    this.initData();
  },
  methods: {
    initData() {
      var params = {
        limit: this.pageSize,
        page: this.currentPage
      };
      Object.assign(params, this.otherSearchData);
      console.log(params);
      // 查询数据的接口函数
      this.showLoading = !this.showLoading;
      api
        .getVistorListUrl(params)
        .then(res => {
          this.showLoading = false;
          if (res.data.success && res.data.data) {
            if (!this.tableOrTableCell) {
              this.tableData = res.data.data.list;
            } else {
              let data = res.data.data.list;
              data.map(item => {
                item.checked = false;
              });
              this.tableCellData = data;
              console.log(this.tableCellData);
              this.checkedAllChange(this.checkedAll);
            }
            this.total = res.data.data.total;
          } else {
            this.$message({ type: "error", message: "没有找到相关访客信息" });
          }
        })
        .catch(err => {
          this.showLoading = false;
          console.error(err);
        });
    },
    closeDetail(rowdata) {
      this.isShow = !this.isShow;
      if (rowdata && rowdata.black) {
        this.signWhitelistBtnAct(rowdata);
      }
      if (rowdata && !rowdata.black) {
        this.signBlacklistBtnAct(rowdata);
      }
    },
    checkedAllChange(val) {
      if (val) {
        // 全选了
        this.checkVistorUuids = [];
        this.tableCellData.forEach(element => {
          element.checked = true;
          this.checkVistorUuids.push(element.staffUuid);
        });
      } else {
        // 取消全选
        if (this.tableCellData.length === this.checkVistorUuids.length) {
          this.checkVistorUuids = [];
          this.tableCellData.forEach(element => {
            element.checked = false;
          });
        }
      }
    },
    checkBoxChange(val) {
      let i = this.checkVistorUuids.indexOf(val.staffUuid);
      if (i === -1) {
        this.checkVistorUuids.push(val.staffUuid);
      } else {
        this.checkVistorUuids.splice(i, 1);
      }
      this.checkedAll =
				this.checkVistorUuids.length === this.tableCellData.length;
    },
    // 排序
    sortChange(column, prop, order) {
      console.log("column:", column);
      column.order = column.order === "ascending" ? "asc" : column.order;
      column.order = column.order === "descending" ? "desc" : column.order;
      var data = {
        order: column.prop,
        sort: column.order
      };
      Object.assign(this.otherSearchData, data);
      this.initData();
    },
    // 详情
    detailBtnAct(rowData) {
      console.log(rowData);
      if (rowData.visitorUuid) {
        this.showLoading = !this.showLoading;
        api
          .getVistorDetailUrl({ visitorUuid: rowData.visitorUuid })
          .then(res => {
            this.showLoading = false;
            if (res.data.success && res.data.data) {
              this.isShow = !this.isShow;
              this.vistorDetail = res.data.data;
              this.vistorDetail.black = rowData.black;
              this.vistorDetail.visitorRecordUuid = rowData.visitorRecordUuid;
            } else {
              this.$message({ type: "error", message: "没有找到该访客的信息" });
            }
          })
          .catch(err => {
            this.showLoading = false;
            console.error(err);
          });
      } else {
        this.$message({ type: "error", message: "非法的访客信息" });
      }
    },
    // 标记黑名单
    signBlacklistBtnAct(rowData) {
      if (rowData.certificateNo === "") {
        rowData.certificateNo = null;
      }
      if (rowData.certificateType === "") {
        rowData.certificateType = null;
      }
      rowData.snapOriginalPhotoUri = rowData.certificatePhotoUri;
      rowData.snapOriginalPhotoBase = "";
      rowData.blacklistName = rowData.visitorName;
      rowData.credentialNo = rowData.certificateNo;
      rowData.credentialType = rowData.certificateType;
      rowData.source = "platform_machine";
      rowData.reason = "";
      rowData.blockDatetime = this.$common.getCurrentTime();
      console.log(rowData);
      this.showLoading = !this.showLoading;
      api
        .postBlacklistUrl(rowData)
        .then(res => {
          this.showLoading = !this.showLoading;
          if (res.data.success) {
            this.$message({ type: "success", message: res.data.msg });
            this.initData();
          } else {
            this.$message({ type: "error", message: res.data.msg });
          }
        })
        .catch(err => {
          this.showLoading = false;
          console.error(err);
        });
    },
    // 解除黑名单
    signWhitelistBtnAct(rowData) {
      let row = {};
      if (rowData.certificateNo === "") {
        rowData.certificateNo = null;
      }
      if (rowData.certificateType === "") {
        rowData.certificateType = null;
      }
      row.credentialNo = rowData.certificateNo;
      row.credentialType = rowData.certificateType;
      row.visitorRecordUuid = rowData.visitorRecordUuid;
      this.$confirm(
        `<span style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;">是否确认移出 ？</span>`,
        "",
        {
          confirmButtonText: "否",
          cancelButtonText: "是",
          distinguishCancelAndClose: true,
          confirmButtonClass: "confirm-button",
          cancelButtonClass: "cancel-button",
          center: true,
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          this.$message({ type: "info", message: "取消移出" });
        })
        .catch(action => {
          if (action === "cancel") {
            if (
              row.certificateNo ||
							row.certificateType ||
							row.visitorRecordUuid
            ) {
              this.showLoading = !this.showLoading;
              api
                .deleteBlacklistUrl(row)
                .then(res => {
                  this.showLoading = !this.showLoading;
                  if (res.data.success) {
                    this.$message.success("移出成功！");
                    this.initData();
                  } else {
                    this.$message.error(res.data.msg);
                  }
                })
                .catch(err => {
                  this.showLoading = false;
                  console.error(err);
                });
            } else {
              this.$message({ type: "warning", message: "证件信息为空" });
            }
          }
        });
    },
    // 检索按钮事件
    queryAct(value) {
      console.log("其他检索条件：", value);
      this.currentPage = 1;
      value.visitorUuid = null;
      Object.assign(this.otherSearchData, value);
      this.initData();
    },
    queryBtnAct() {
      var data = {};
      if (this.staffName) {
        data.visitorName = this.staffName;
      }
      this.currentPage = 1;
      Object.assign(this.otherSearchData, data);
      this.initData(data);
    },
    handleCurrentChange(val) {
      console.log("当前页面变化的回调函数");
      this.checkedAll = false;
      this.currentPage = val;
      this.initData();
    },
    handleSizeChange() {
      console.log("每一页数量变化时的回调函数");
    },
    // table表格的选择
    handleSelectionChange(val) {
      console.log(val);
    },
    tableIndex(val) {
      val += 1;
      return val < 10 ? "0" + val : val;
    },
    // 鼠标划过覆盖的hover弹窗事件
    mymouseover: event => {
      mouseover(event);
    },
    mymouseout(event) {
      mouseout(event);
    },
    mymousemove(event) {
      mousemove(event);
    }
  },
  watch: {
    tableOrTableCell(val) {
      this.pageSize = !val ? this.tableSize : this.tableCellSize;
      this.currentPage = !val ? this.currentPage : 1;
      // this.checkedAll = val ? this.checkedAll : false;
      this.initData();
    },
    staffName(val) {
      this.otherSearchData.visitorName = val;
    }
  },
  destroyed() {}
};
</script>
<style>
.VistorList .editFontClass {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #26d39d;
	margin: 0 10px;
}
.VistorList .deleteBtnClass {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ff5f5f;
}
.signOffBtnClass {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffd000;
}
.VistorList .rightgroup {
	display: inline-block;
}
.VistorList .rightgroup .title {
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
}
.VistorList .el-radio-button__orig-radio:checked + .el-radio-button__inner {
	color: #ffffff;
	background-color: rgba(40, 255, 187, 0.08);
	border: 0;
	border-bottom: 1px solid rgba(38, 211, 157, 0.5);
	border-right: 1px solid transparent;
	-webkit-box-shadow: none;
	box-shadow: none;
}
.VistorList .el-radio-button__inner {
	background: rgba(255, 255, 255, 0.05);
	border: 0;
	border-bottom: 1px solid transparent;
	border-right: 1px solid rgba(255, 255, 255, 0.05);
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
	text-align: center;
	min-width: 78px;
	/* display: block; */
	padding: 8px 34%;
}
.VistorList .otherDay .el-radio-button__inner {
	background: rgba(255, 255, 255, 0.05);
	border: 0;
	border-bottom: 1px solid transparent;
	border-right: 1px solid rgba(255, 255, 255, 0.05);
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
	text-align: center;
	padding: 8px 32px;
}
.VistorList .el-radio-button:first-child .el-radio-button__inner {
	border-left: 0;
	border-radius: 4px 0 0 4px;
	-webkit-box-shadow: none !important;
	box-shadow: none !important;
}
.VistorList .el-input--prefix .el-input__inner {
	padding-left: 12px;
}
.VistorList .el-input--suffix .el-input__inner {
	padding-right: 0px;
}
.VistorList .el-date-editor.el-input,
.el-date-editor.el-input__inner {
	width: 180px;
}
.VistorList .el-icon-time:before {
	content: "";
	position: absolute;
	top: 50%;
	left: 120%;
}
.VistorList .el-button--default,
.VistorList .el-button--default:hover,
.VistorList .el-button--default:active,
.VistorList .el-button--default:focus {
	font-family: "PingFangSC-Regular";
	font-size: 16px;
	width: 90px;
	height: 34px;
	background: rgba(40, 255, 187, 0.08);
	border: 1px solid rgba(38, 211, 157, 0.45);
	border-radius: 2px;
	border-radius: 2px;
	margin: 0 10px;
	/* margin-right: 20px; */
	font-family: "PingFangSC-Regular";
	font-size: 13px;
	color: #ffffff;
}
.VistorList .staffNameInput {
	width: 160px;
	display: inline-block;
	margin-right: 15px;
}
.VistorList .tableView {
	height: calc(100% - 90px);
}
.VistorList .tableCellContent {
	display: flex;
	-webkit-box-pack: start;
	-ms-flex-pack: start;
	justify-content: flex-start;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
	width: 100%;
	height: calc(100% - 20px);
}
.VistorList .checkedAll {
	padding-left: 20px;
}
.VistorList .tableCellContent .cellBox {
	width: 132px;
	height: 210px;
	text-align: center;
	margin: 7px 12px;
	padding: 12px 8px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	background-color: rgba(0, 0, 0, 0.1);
	border-radius: 2px;
	position: relative;
}
.VistorList .cellBox .imgBox {
	width: 118px;
	height: 118px;
}
.VistorList .cellBox .imgBox .images {
	width: 100%;
	height: 100%;
}
.VistorList .checkBox {
	position: absolute;
	top: 15px;
	left: 15px;
}
.VistorListPopoverClass {
	width: 135px;
	height: 100px;
	text-align: left;
	margin-left: 2.3%;
	margin-top: -4.26% !important;
	padding-left: 1.2%;
	box-sizing: border-box;
	background: #2a2e31;
	box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.2);
	border-radius: 2px;
	min-width: 0;
	font-family: "PingFangSC-Regular";
	font-size: 12px;
}
.VCelPopoverCol {
	height: 33%;
	line-height: 30px;
	color: #dddddd;
}
.VistorList .txtBox {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/style/variables.scss";
.VistorList {
	height: 100%;
	color: #dddddd;
	.header {
		height: 50px;
		padding: 15px 40px;
		background: #212325;
		box-sizing: border-box;
		div {
			font-family: "PingFangSC-Regular";
			font-size: 14px;
			color: #ffffff;
			letter-spacing: 0;
			box-sizing: border-box;
			border-left: 3px solid #26d39d;
			padding-left: 9px;
		}
	}
	.main {
		background: #212325;
		margin-top: 16px;
		padding: 18px 30px;
		height: calc(100% - 60px);
		box-sizing: border-box;
		.time-line {
			border-width: 1px 0px 0px 0px;
			width: 8px;
			color: rgba(255, 255, 255, 0.15);
		}
		.main-header {
			margin-bottom: 18px;
			display: flex;
			justify-content: space-between;
		}
		.footer {
			text-align: right;
		}
		.el-table {
			height: calc(100% - 90px);
		}
	}
}
</style>
