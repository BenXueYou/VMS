<template>
	<div id="noteaacx" class="wrap">
		<transition name="slide-fade">
			<div class="left" :style="{'margin-left':(issuoxiao?-470:0)+'px'}">
				<div class="rightarrow" @click="suoxiao">
					<img :src="rightarrow" :style="{'transform':(issuoxiao?'rotate(180deg)':'rotate(0deg)')}" alt />
				</div>
				<div class="leftHeader">
					<img src="@/assets/images/faceModule/twopeople.png" alt />
					人脸库
				</div>
				<div class="title button-div">
					<el-button
						:disabled="!OwnAuthDisabled"
						type="primary"
						icon="el-icon-plus"
						class="addnewdb"
						@click="addfacedb"
					>新建人像库</el-button>
					<span class="tips">人像库总数：{{tableData.length}} &nbsp;&nbsp;&nbsp;&nbsp; 总人脸数：{{totalrenshu}}</span>
				</div>
				<div class="leftasda">
					<!-- :current-row-key="selectLibRow.index" -->
					<el-table
						:data="tableData"
						border
						ref="multipleTable"
						v-loading="loadding"
						:current-row-key="0"
						highlight-current-row
						@row-click="selectedRow"
						style="width: 100%"
					>
						<el-table-column prop="faceLibraryName" label="库名称" width="180"></el-table-column>
						<el-table-column prop="faceTotal" label="人员数量" width="100"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button
									:disabled="!OwnAuthDisabled"
									@click.stop="editFaceLib(scope.row)"
									type="text"
									size="small"
								>
									<!-- <i class="el-icon-edit-outline"></i> -->
									编辑
								</el-button>

								<el-button
									type="text"
									:disabled="!OwnAuthDisabled"
									size="small"
									class="deleteBtnClass"
									@click.stop="openDeleteDialog('deletefaceLib',scope.row)"
								>
									<!-- <i class="el-icon-delete"></i> -->
									删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</transition>
		<div class="right" :style="{'width': 'calc(100% - '+(issuoxiao?30:500)+'px)'}">
			<div v-show="!faceDBDialogAddVisible" class="rightheader">
				<ul>
					<li>
						<!-- <img src="@/assets/images/faceModule/onepeople.png" alt /> -->
						<div class="header-line"></div>
						{{libraryName?libraryName:'库名称'}}
					</li>
					<li>
						<el-checkbox v-model="selectall" @change="selectAll">本页全选</el-checkbox>
					</li>
					<li :disabled="!OwnAuthDisabled" class="active" @click="addfile">
						<el-button :disabled="!OwnAuthDisabled" type="text">
							<img v-if="OwnAuthDisabled" src="@/assets/images/faceModule/add.png" alt />
							<img v-else src="@/assets/icon/dis_add.png" alt />
							<span :disabled="!OwnAuthDisabled">新增</span>
						</el-button>
					</li>
					<li :disabled="!OwnAuthDisabled" class="active" @click="deletefile">
						<!-- <i class="el-icon-delete"></i> -->
						<el-button :disabled="!OwnAuthDisabled" type="text">
							<img :src="OwnAuthDisabled?require('@/assets/images/delete2.png'):require('@/assets/images/personMange/delete1.png')" alt />
							<span :disabled="!OwnAuthDisabled">删除</span>
						</el-button>
					</li>
					<li :disabled="!OwnAuthDisabled" class="active" @click="exportExcel2">
						<el-button :disabled="!OwnAuthDisabled" type="text">
							<img v-if="OwnAuthDisabled" src="@/assets/images/faceModule/expert.png" alt />
							<img v-else src="@/assets/icon/dis_export.png" alt />
							<span :disabled="!OwnAuthDisabled">导出</span>
						</el-button>
					</li>
					<li
						:disabled="!ShowAuthDisabled"
						class="active"
						@click="faceLibUpdateRecord"
						v-if="selectLibRow.faceLibraryType === 'staticFaceLib'"
					>
						<el-button :disabled="!ShowAuthDisabled" type="text">
							<img src="@/assets/images/faceModule/facedb_update_history.png" alt />
							<span :disabled="!ShowAuthDisabled">更新历史</span>
						</el-button>
					</li>
					<li
						class="active"
						:disabled="!OwnAuthDisabled"
						@click="updateLibraryTask"
						v-if="selectLibRow.faceLibraryType === 'staticFaceLib'"
					>
						<img src="@/assets/images/faceModule/facedb_update.png" alt />
						<span>库更新</span>
					</li>

					<li class="rightoperat button-div">
						<div class="searchInputClass">
							姓名：
							<el-input class="searchinput" label="姓名" v-model="staffName" placeholder="请输入"></el-input>
						</div>
						<el-button :disabled="!ShowAuthDisabled" type="primary" v-popover:popover>其他检索条件</el-button>
						<el-popover
							ref="popover"
							placement="bottom-end"
							:visible-arrow="false"
							width="300"
							trigger="click"
						>
							<search-option-view @query="queryAct"></search-option-view>
						</el-popover>
						<el-button :disabled="!ShowAuthDisabled" type="primary" @click="search">检索</el-button>
					</li>
				</ul>
			</div>

			<div v-show="!faceDBDialogAddVisible" class="typeoperator">
				<el-radio v-model="typeradio" @change="changetype" label="TheFaceDBImageTable">图片</el-radio>
				<el-radio v-model="typeradio" @change="changetype" label="TheFaceDBListTable">列表</el-radio>
			</div>

			<div v-show="!faceDBDialogAddVisible" class="dataWrap" ref="dataWrap">
				<!-- 这里面有用了双变量 保存切换视图，保存另一个的状态 -->
				<keep-alive>
					<component
						:OwnAuthDisabled="OwnAuthDisabled"
						:is="currentcomponents"
						:selectall="selectall"
						:listPageSize="listPageSize"
						:imagePageSize="imagePageSize"
						:total="total"
						:pageNow="pageNow"
						:listTableData="listTableData"
						:imageTableData="imageTableData"
						:listtableloadding="listtableloadding"
						:listTableColumns="listTableColumns"
						@getFaceDetail="editstaff"
						@deleteStaffFace="deleteStaffFace"
						@checkall="selectAll"
						@changepage="changepage"
					></component>
				</keep-alive>
			</div>
			<!-- 人脸增加弹窗 -->
			<the-face-d-b-add
				:faceDBDialogVisible="faceDBDialogAddVisible"
				:libraryarr="libraryarr"
				:libraryuuid="faceLibraryUuid"
				:isUpdate="isUpdate"
				:staffDetail="staffDetail"
				@getstafflirary="getstafflirary"
				@closeAddAct="closeStaffAddDialogAct"
			></the-face-d-b-add>
		</div>

		<!-- 新建人脸库弹窗 -->
		<the-face-d-b-dialog
			:faceDBDialogVisible="faceDBDialogVisible"
			:updatefacedata="updatefacedata"
			@close="closeFaceDBDialogAct"
		></the-face-d-b-dialog>
		<!-- 库更新弹窗 -->
		<the-face-d-b-d-k-dialog
			:faceDBDialogVisible="faceDBDialogDKVisible"
			:libraryuuid="selectLibRow.faceLibraryUuid ? selectLibRow.faceLibraryUuid : ''"
			@close="faceDBDialogDKVisible=false"
			@confirm="confirmDBUpdate"
		></the-face-d-b-d-k-dialog>
		<!-- 更新历史弹窗 -->
		<the-face-d-b-update-history-dialog
			:faceDBDialogVisible="faceDBDialogUpdateHistoryVisible"
			@close="faceDBDialogUpdateHistoryVisible=false"
		></the-face-d-b-update-history-dialog>

		<!-- 人脸删除弹窗 -->
		<el-dialog title="提示" width="30%" class="DeleteDialogClass" :visible.sync="dialogVisible">
			<p class="mydelete">
				<img src="@/assets/delete.png" alt />
				<span>是否确定删除</span>
			</p>
			<span slot="footer" class="dialog-footer DeleteDialogClass">
				<el-button type="primary" @click="deletesurt">确 定</el-button>
				<el-button type="primary" @click="dialogVisible = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 导出模板选择弹窗 -->
		<el-dialog
			class="ExportDialogClass"
			title="导出模板选择"
			width="350px"
			:visible.sync="exportdialogVisible"
		>
			<div style="margin:50px auto;">
				<el-select v-model="choosetemplate" placeholder="请选择" class="ExportDialogInput">
					<el-option
						v-for="item in templatetypearr"
						:key="item.typeStr"
						:label="item.typeName"
						:value="item.typeStr"
					></el-option>
				</el-select>
			</div>
			<div style="height:80px;">
				<el-button
					type="primary"
					style="width:120px;display:block;margin:0px auto 30px;"
					@click="sureExport"
				>确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import TheFaceDBDialog from "@/pages/faceModule/views/facedb/basic/TheFaceDBDialog";
import TheFaceDBImageTable from "@/pages/faceModule/views/facedb/basic/TheFaceDBImageTable";
import TheFaceDBListTable from "@/pages/faceModule/views/facedb/basic/TheFaceDBListTable";
import TheFaceDBDKDialog from "@/pages/faceModule/views/facedb/basic/TheFaceDBDKDialog";
import TheFaceDBUpdateHistoryDialog from "@/pages/faceModule/views/facedb/basic/TheFaceDBUpdateHistoryDialog";
import TheFaceDBAdd from "@/pages/faceModule/views/facedb/basic/TheFaceDBAdd";
import SearchOptionView from "./basic/SearchOptionView";
// import * as api from "@/pages/faceModule/api.js";
import * as faceApi from "@/pages/faceModule/http/faceDBHttp.js";
import RestApi from "@/utils/RestApi";

export default {
  name: "faceDB",
  components: {
    TheFaceDBDialog,
    TheFaceDBImageTable,
    TheFaceDBListTable,
    TheFaceDBDKDialog,
    TheFaceDBUpdateHistoryDialog,
    TheFaceDBAdd,
    SearchOptionView
  },
  data() {
    return {
      taofanlibraryuuid: "", // 逃犯库的UUID记录
      issuoxiao: false,
      rightarrow: require("@/assets/images/faceModule/rightarrow.png"),
      choosetemplate: "static_person",
      templatetypearr: [],
      exportdialogVisible: false,
      faceDBDialogVisible: false, // 新建人脸库的
      faceDBDialogDKVisible: false,
      faceDBDialogUpdateHistoryVisible: false,
      faceDBDialogAddVisible: false,
      kutotal: 4,
      facetotal: "100万",
      tableData: [],
      selectall: false,
      typeradio: "TheFaceDBImageTable",
      currentcomponents: "TheFaceDBImageTable",
      listPageSize: 18,
      imagePageSize: 28,
      listPageCount: 0,
      imagePageCount: 0,
      listPageNow: 1,
      imagePageNow: 1,
      pageNow: 1,
      pageSize: 28,
      total: 0,
      imageTableData: [],
      listTableData: [],
      libraryarr: [],
      staffName: null,
      loadding: false, //
      selectLibRow: { index: 0 }, // 是否是动态库的标识
      listtableloadding: false,
      shituarr: [], // 视图数组
      isUpdate: false, // false 添加vip true为修改vip
      staffDetail: {}, // 当isUpdate为true 储存编辑人员的信息
      taskNum: [],
      realtimeNum: [], // 实时更新的数据的进度
      addtitle: "添加人脸",
      newtitle: "新建人脸库",
      isaddface: true,
      updatefacedata: {}, // 编辑人员数据库，存储的数据
      dialogVisible: false, // 删除的弹窗。
      deleteWay: "",
      row: "",
      faceLibraryUuid: "",
      projectUuid: this.$store.state.home.projectUuid,
      uploadstatusZnarr: [],
      defaultHeader: require("@/assets/user.png"),
      listTableColumns: [], // 右边表格，显示哪些数据
      ws: "", // 定义全局的websocket对象,
      currentRowIndex: "",
      stompClient: null,
      interval: null,
      refreshFlag: false,
      queryData: {},
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  computed: {
    totalrenshu() {
      return this.tableData.reduce(function(sum, val) {
        return (sum += val.faceTotal);
      }, 0);
    },
    libraryName: {
      // libraryName在组件中是双向绑定的，computed单向get， 则需加set双向绑定
      set(val) {
        this.selectLibRow.faceLibraryName = val;
      },
      get() {
        return this.selectLibRow.faceLibraryName;
      }
    }
    // faceLibraryUuid() {
    //   return this.selectLibRow.faceLibraryUuid;
    // }
  },
  watch: {
    selectLibRow: {
      handler(newVal, oldVal) {
        this.faceLibraryUuid = newVal.faceLibraryUuid;
        console.log(newVal, "this.selectLibRow====", this.selectLibRow);
      },
      deep: true
    }
  },
  methods: {
    queryAct(data) {
      this.queryData = data;
      this.pageNow = 1;
      this.getStaffLibStaffData(data);
    },
    suoxiao() {
      this.issuoxiao = !this.issuoxiao;
      this.imagePageSize = this.issuoxiao ? 40 : 28;
      if (this.typeradio === "TheFaceDBImageTable") {
        this.pageSize = this.imagePageSize;
        this.getStaffLibStaffData();
      } else {
        // 列表的limit不需改变
        this.pageSize = this.listPageSize;
      }
    },
    sureExport() {
      let dataArr = [];
      if (this.typeradio === "TheFaceDBImageTable") {
        for (let i = 0, len = this.imageTableData.length; i < len; i++) {
          if (this.imageTableData[i].checked) {
            // num.push(this.imageTableData[i].staffUuid);
            dataArr.push({
              faceUuid: this.imageTableData[i].faceUuid,
              facePhotoUuid: this.imageTableData[i].facePhotoUuid
            });
          }
        }
      } else {
        for (let i = 0, len = this.listTableData.length; i < len; i++) {
          if (this.listTableData[i].checked) {
            // num.push(this.listTableData[i].staffUuid);
            dataArr.push({
              faceUuid: this.listTableData[i].faceUuid,
              facePhotoUuid: this.listTableData[i].facePhotoUuid
            });
          }
        }
      }
      this.exportdialogVisible = false;
      if (!dataArr.length) {
        return;
      }
      this.$common.funBuildFile(
        RestApi.faceModuleAPi.faceDBApi.downloadFace(
          this.$store.state.home.projectUuid
        ) +
					"?templateType=" +
					this.choosetemplate,
        "人脸库.zip",
        "POST",
        dataArr
      );
    },
    // 后端导出方法
    exportExcel2() {
      var num = [];
      if (this.typeradio === "TheFaceDBImageTable") {
        for (let i = 0, len = this.imageTableData.length; i < len; i++) {
          if (this.imageTableData[i].checked) {
            num.push(this.imageTableData[i].staffUuid);
          }
        }
      } else {
        for (let i = 0, len = this.listTableData.length; i < len; i++) {
          if (this.listTableData[i].checked) {
            num.push(this.listTableData[i].staffUuid);
          }
        }
      }
      if (!num.length) {
        this.$message.warning("未选中人员");
        return;
      }
      this.exportdialogVisible = true;
    },
    openDeleteDialog(way, row) {
      if (!row.deletable) {
        this.$message.warning(`不可以删除${row.faceLibraryName}数据`);
        return;
      }
      if (row.faceLibraryUuid) {
        this.row = row.faceLibraryUuid;
      } else {
        this.row = [row.faceUuid];
      }
      this.dialogVisible = true;
      this.deleteWay = way;
    },
    deletesurt() {
      this.dialogVisible = false;
      this[this.deleteWay]();
    },
    getStaffLibStaffData(data) {
      this.selectall = false;
      if (!this.faceLibraryUuid) {
        this.$message.warning("请选择人脸库");
        return;
      }
      this.listtableloadding = true;
      console.log(`第${this.pageNow}页，一页${this.pageSize}条`);
      let params = {
        faceLibraryUuid: this.faceLibraryUuid,
        projectUuid: this.projectUuid,
        staffName: this.staffName,
        page: this.pageNow,
        limit: this.pageSize
      };
      if (!params.staffName) params.staffName = null;
      Object.assign(params, data);
      faceApi
        .getStaffList(params)
        .then(res => {
          this.listtableloadding = false;
          let staffTableData = [];
          if (
            !res.data.success ||
						!res.data.data ||
						!res.data.data.list.length
          ) {
            // this.$message.success(this.libraryName + "没有数据");
          } else {
            let arr = res.data.data.list;
            for (let i = 0; i < arr.length; i++) {
              let tmpItem = arr[i];
              tmpItem.checked = false;
              tmpItem.faceLibraryName = this.selectLibRow.faceLibraryName;
              tmpItem.faceLibraryUuid = this.selectLibRow.faceLibraryUuid;
              // 翻译 性别 人员类型 证件类型
              tmpItem["gender"] = this.$common.getEnumItemName(
                "gender",
                tmpItem.gender
              );
              tmpItem["staffType"] = this.$common.getEnumItemName(
                "staff_t",
                tmpItem.staffType
              );
              tmpItem["credentialType"] = this.$common.getEnumItemName(
                "cred",
                tmpItem.credentialType
              );
              // 照片设置默认图片
              if (!tmpItem.facePhotoUrl || tmpItem.isshow === false) {
                tmpItem.facePhotoUrl = this.defaultHeader;
              }
              staffTableData.push(tmpItem);
            }
          }
          if (this.typeradio === "TheFaceDBListTable") {
            this.listTableData = staffTableData;
          } else {
            this.imageTableData = staffTableData;
          }
          this.total = res.data.data.total;
        })
        .catch(err => {
          console.log(err);
          this.listtableloadding = false;
        });
    },
    search() {
      // 点击搜索按钮从而发起请求
      if (this.typeradio === "TheFaceDBListTable") {
        this.listPageNow = 1;
      } else {
        this.imagePageNow = 1;
      }
      this.pageNow = 1;
      this.getStaffLibStaffData();
    },
    changepage(index) {
      // 改变页数
      // console.log(index);
      if (this.typeradio === "TheFaceDBListTable") {
        this.listPageNow = index;
      } else {
        this.imagePageNow = index;
      }
      this.pageNow = index;
      this.getStaffLibStaffData(this.queryData);
    },
    selectAll(val) {
      // 选择全部
      this.selectall = val;
    },
    // 新增人脸库
    addfacedb() {
      this.updatefacedata = {};
      this.faceDBDialogVisible = true;
    },
    // 编辑人脸库
    editFaceLib(row) {
      if (!row.editabled) {
        this.$message.error(`不可以编辑${row.faceLibraryName}数据`);
        return;
      }
      faceApi
        .getFaceLibDetail({
          faceLibraryUuid: row.faceLibraryUuid,
          projectUuid: this.$store.state.home.projectUuid
        })
        .then(res => {
          this.updatefacedata = res.data.data;
          this.faceDBDialogVisible = !this.faceDBDialogVisible;
        })
        .catch(() => {
          this.faceDBDialogVisible = !this.faceDBDialogVisible;
        });
    },
    // 删除人脸库
    deletefaceLib() {
      faceApi.deleteFaceLib({ faceLibraryUuid: this.row }).then(res => {
        if (res.data.success) {
          this.$message.success("删除成功！");
          this.faceLibraryUuid = "";
          this.getStaffLibList();
        }
      });
    },
    // 添加样式
    currentRowStyle(index) {
      setTimeout(() => {
        // 刷新之后，恢复当前选中的状态
        if (document.querySelector(".index")) {
          if (document.querySelector(".index").classList) {
            document.querySelector(".index").classList.remove("index");
          }
        }
        if (document.getElementsByClassName("el-table__row")[index]) {
          if (
            !document.querySelector(".index") &&
						document.getElementsByClassName("el-table__row")[index].classList
          ) {
            let dom = document.getElementsByClassName("el-table__row")[index];
            dom.classList.add("index");
          }
        }
      }, 10);
    },
    // 切换视图
    changetype(val) {
      this.currentcomponents = val;
      this.selectall = false;
      this.imagePageSize = this.issuoxiao ? 40 : 28;
      if (this.typeradio === "TheFaceDBListTable") {
        this.pageSize = this.listPageSize;
      } else {
        this.pageSize = this.imagePageSize;
      }
      this.pageNow = 1;
      this.getStaffLibStaffData();
    },

    updateLibraryTask() {
      if (!this.OwnAuthDisabled) {
        return;
      }
      this.faceDBDialogDKVisible = !this.faceDBDialogDKVisible;
    },
    faceLibUpdateRecord() {
      this.faceDBDialogUpdateHistoryVisible = !this
        .faceDBDialogUpdateHistoryVisible;
    },
    addfile() {
      if (this.selectLibRow.addFaceByUser) {
        this.isUpdate = false;
        this.staffDetail = {};
        this.staffDetail.faceLibraryName = this.selectLibRow.faceLibraryName;
        this.staffDetail.faceLibraryUuid = this.selectLibRow.faceLibraryUuid;
        this.faceDBDialogAddVisible = !this.faceDBDialogAddVisible;
      } else {
        this.$message.warning(
          `${this.selectLibRow.faceLibraryName}人员是不可添加`
        );
      }
    },
    exportfile() {},
    // 删除人员
    deletefile() {
      if (!this.selectLibRow.delFaceByUser) {
        this.$message.error(`${this.selectLibRow.faceLibraryName}不可以删除`);
        return;
      }
      var num = [];
      if (this.typeradio === "TheFaceDBImageTable") {
        for (let i = 0, len = this.imageTableData.length; i < len; i++) {
          if (this.imageTableData[i].checked) {
            num.push(this.imageTableData[i].faceUuid);
          }
        }
      } else {
        for (let i = 0, len = this.listTableData.length; i < len; i++) {
          if (this.listTableData[i].checked) {
            num.push(this.listTableData[i].faceUuid);
          }
        }
      }
      if (!num.length) {
        this.$message.error("未选中人员");
        return;
      }
      this.deleteStaffFace(num);
    },
    addDaoKuTask(params) {
      faceApi.addDaoKuTask(params[0], params[1]).then(res => {
        this.$message.success("任务添加完成，请不要关闭客户端！");
        this.faceDBDialogDKVisible = false;
      });
    },
    getstafflirary() {
      // 获取到所有的人员库
      // 这边用坐标的表格也可以获取到所有的数据，所以不用在获取一遍
      // 要是以后有左边的表格分页了，就不可以使用这种方法了。
      console.log(this.tableData);
      this.libraryarr = this.tableData;
      // api.getStaffLiblist().then(res => {
      //   if (res.data && res.data.data) {
      //     this.libraryarr = res.data.data || [];
      //     console.log(this.libraryarr);
      //   }
      // });
    },
    // 关闭人脸库弹窗
    closeFaceDBDialogAct(is) {
      this.faceDBDialogVisible = false;
      if (is) {
        this.getStaffLibList();
      }
    },
    resetall() {
      this.listPageNow = 1;
      this.imagePageNow = 1;
      this.listTableData = [];
      this.imageTableData = [];
    },
    selectedRow(row, event, column) {
      if (!this.ShowAuthDisabled) return;
      // 当点击左边的列表，右边进行更新
      this.faceDBDialogAddVisible = false;
      this.selectLibRow = row;
      this.faceLibraryUuid = this.selectLibRow.faceLibraryUuid;
      this.libraryName = this.selectLibRow.faceLibraryName;
      this.projectUuid = this.selectLibRow.projectUuid;
      // this.currentRowStyle(this.selectLibRow.index);
      this.currentRowIndex = this.getIndexById(row);
      this.selectall = false;
      this.resetall();
      this.pageNow = 1;
      this.getStaffLibStaffData();
    },
    // 关闭人脸新增页面
    closeStaffAddDialogAct(is) {
      this.isUpdate = !this.isUpdate;
      this.faceDBDialogAddVisible = !this.faceDBDialogAddVisible;
      if (is) {
        this.getStaffLibStaffData();
        this.getStaffLibList();
      }
    },
    editstaff(uuid, faceLibraryUuid) {
      // 点击编辑的时候获取人员信息
      if (!this.selectLibRow.editabled) {
        this.$message.error(`不可以编辑${this.libraryName}人员`);
        return;
      }
      this.addtitle = "修改人脸";
      faceApi
        .getStaffDetail({
          faceUuid: uuid,
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            this.staffDetail = res.data.data;
            this.staffDetail.faceLibraryUuid = faceLibraryUuid;
            this.staffDetail.faceLibraryName = this.libraryName;
            this.faceDBDialogAddVisible = !this.faceDBDialogAddVisible;
          } else {
            this.$message.error("获取数据为空!");
          }
        });
    },
    // 删除人脸
    deleteStaffFace(uuid) {
      if (!this.selectLibRow.delFaceByUser) {
        this.$message.error(`不可以删除${this.libraryName}人员`);
        return;
      }
      this.row = uuid;
      this.dialogVisible = true;
      this.deleteWay = "deleteviprealy";
    },
    deleteviprealy() {
      if (!this.row.length) {
        this.$message.warning("没有选中的faceUuid");
        return;
      }
      var uuids = this.row;
      faceApi
        .deleteStaff({ faceUuid: uuids, faceLibraryUuid: this.faceLibraryUuid })
        .then(res => {
          if (res.data.success) {
            this.$message.success("删除成功！");
            this.getStaffLibList();
            this.getStaffLibStaffData();
          }
        });
    },
    // 查询人员库列表
    getStaffLibList(flag = false) {
      this.loadding = true;
      this.tableData = [];
      faceApi
        .getFaceLib()
        .then(res => {
          this.loadding = false;
          if (res.data.success && res.data.data) {
            this.tableData = res.data.data;
            if (this.tableData && !this.tableData.length) return;
            if (!flag) {
              this.selectLibRow = this.tableData[0];
              this.faceLibraryUuid = res.data.data[0].faceLibraryUuid;
              this.libraryName = res.data.data[0].faceLibraryName;
              this.$refs.multipleTable.setCurrentRow(this.selectLibRow);
              this.getStaffLibStaffData();
            } else {
              this.handleDefaultChooseFirstData();
            }
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(() => {
          this.loadding = false;
        });
    },
    getIndexById(row) {
      if (!row || this.tableData.length === 0) {
        return -1;
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (row.faceLibraryUuid === this.tableData[i].faceLibraryUuid) {
          return i;
        }
      }
      return -1;
    },
    handleDefaultChooseFirstData() {
      if (!this.tableData || this.tableData.length === 0) {
        return;
      }
      let index = 0;
      if (this.currentRowIndex && this.currentRowIndex >= 0) {
        index = this.currentRowIndex;
      }
      this.setCurrentRow(index);
      this.getStaffLibStaffData();
    },
    setCurrentRow(index) {
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.setCurrentRow(this.tableData[index]);
      }
    },
    confirmDBUpdate() {
      this.faceDBDialogDKVisible = false;
      // this.getStaffLibList();
      setTimeout(() => {
        this.$refs.multipleTable.setCurrentRow(this.selectLibRow);
        this.getStaffLibStaffData();
      }, 10);
    },
    connectSocket() {
      /* eslint-disable */
			let socket = new SockJS(
				window.config.protocolHeader + window.config.socketIP
			);
			this.stompClient = Stomp.over(socket);
			this.stompClient.connect(
				{ projectUuid: this.$store.state.home.projectUuid },
				frame => {
					console.log("connect success: ", frame);
					this.stompClient.subscribe(
						"/user/topic/face-1.3/client/faceLibImportTaskProgress",
						greeting => {
							console.log("subscribe success: ", greeting);
							this.handleSubscribe(JSON.parse(greeting.body));
						}
					);
				},
				err => {
					console.log("error, errMsg: ", err);
				}
			);
			/* eslint-enable */
    },
    disConnectSocket() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
        console.log("Disconnected");
      }
    },
    handleSubscribe(data) {
      this.refreshFlag = true;
      if (!data) {
        this.refreshFlag = false;
      }
    },
    setIntervalMethod() {
      this.interval = setInterval(() => {
        if (this.refreshFlag) {
          this.getStaffLibList(true);
          this.refreshFlag = false;
        }
      }, 3000);
    }
  },
  mounted() {
    // this.templatetypearr = window.face.kutemplate;
    this.templatetypearr = this.$common.getEnumByGroupStr("staff_temp");
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("人脸库", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("人脸库", "isOwn");

    this.$nextTick(function() {
      // var el = this.$refs.dataWrap;
      // var w = el.offsetWidth;
      // var h = el.offsetHeight;
      // this.imagePageSize = 4 * Math.floor(w / 150);
      // this.listPageSize = 15;
    });
  },
  activated() {
    if (this.ShowAuthDisabled) {
      this.getStaffLibList();
      this.setIntervalMethod();
      this.connectSocket(); // 建立socket
    }
  },
  deactivated() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.disConnectSocket();
    this.refreshFlag = false;
  },
  destroyed() {
    // alert('destroyed')
    // this.ws.close();
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

<style lang="scss">
#noteaacx {
	.el-checkbox__label {
		color: rgba(255, 255, 255, 0.8);
	}
	.el-checkbox__inner::after {
		box-sizing: content-box;
		border: 1px solid #26d39d;
		border-left: 0;
		border-top: 0;
		height: 7px;
		left: 4px;
		position: absolute;
		top: 1px;
	}
	.DeleteDialogClass {
		.mydelete {
			text-align: center;
			font-size: 0px;
			line-height: 150px;
			img {
				display: inline-block;
				vertical-align: middle;
			}
			span {
				display: inline-block;
				font-family: " PingFangSC-Regular";
				font-size: 16px;
				color: #ffffff;
				letter-spacing: 0;
				padding-left: 30px;
				vertical-align: middle;
			}
		}
		.el-dialog__footer {
			text-align: center;
		}
		.el-dialog {
			height: 300px;
		}
	}
	.ExportDialogInput {
		width: 150px;
		display: block;
		margin: 0px auto;
	}
}
</style>
