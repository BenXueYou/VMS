<template>
  <div id="noteaacx"
       class="wrap">
    <transition name="slide-fade">
      <div class="left"
           :style="{'margin-left':(issuoxiao?-470:0)+'px'}">
        <div class="rightarrow"
             @click="suoxiao">
          <img :src="rightarrow"
               :style="{'transform':(issuoxiao?'rotate(180deg)':'rotate(0deg)')}"
               alt />
        </div>
        <div class="leftHeader">
          <img src="@/assets/images/faceModule/twopeople.png"
               alt />
          人脸库
        </div>
        <div class="title button-div">
          <el-button type="primary"
                     icon="el-icon-plus"
                     class="addnewdb"
                     @click="addfacedb">新建人像库</el-button>
          <span class="tips">人像库总数：{{tableData.length}} &nbsp;&nbsp;&nbsp;&nbsp; 总人脸数：{{totalrenshu}}</span>
        </div>
        <div class="leftasda">
          <!-- :current-row-key="selectLibRow.index" -->
          <el-table :data="tableData"
                    border
                    ref="multipleTable"
                    v-loading="loadding"
                    :current-row-key="0"
                    highlight-current-row
                    @row-click="selectedRow"
                    style="width: 100%">
            <el-table-column prop="faceLibraryName"
                             label="库名称"
                             width="180"></el-table-column>
            <el-table-column prop="faceTotal"
                             label="人员数量"
                             width="100"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click.stop="editFaceLib(scope.row)"
                           type="text"
                           size="small">
                  <!-- <i class="el-icon-edit-outline"></i> -->
                  编辑
                </el-button>

                <el-button type="text"
                           size="small"
                           class="deleteBtnClass"
                           @click.stop="openDeleteDialog('deletefaceLib',scope.row)">
                  <!-- <i class="el-icon-delete"></i> -->
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </transition>
    <div class="right"
         :style="{'width': 'calc(100% - '+(issuoxiao?30:500)+'px)'}">
      <div v-show="!faceDBDialogAddVisible"
           class="rightheader">
        <ul>
          <li>
            <!-- <img src="@/assets/images/faceModule/onepeople.png" alt /> -->
            <div class="header-line"></div>
            {{libraryName?libraryName:'库名称'}}
          </li>
          <li>
            <el-checkbox v-model="selectall"
                         @change="selectAll">本页全选</el-checkbox>
          </li>
          <li class="active"
              @click="addfile">
            <img src="@/assets/images/faceModule/add.png"
                 alt />
            <span>新增</span>
          </li>
          <li class="active"
              @click="deletefile">
            <!-- <i class="el-icon-delete"></i> -->
            <img src="@/assets/images/delete2.png"
                 alt />
            <span>删除</span>
          </li>
          <li class="active"
              @click="exportExcel2">
            <img src="@/assets/images/faceModule/expert.png"
                 alt />
            <span>导出</span>
          </li>
          <li class="active"
              @click="faceLibUpdateRecord"
              v-if="selectLibRow.faceLibraryType === 'staticFaceLib'">
            <img src="@/assets/images/faceModule/facedb_update_history.png"
                 alt />
            <span>更新历史</span>
          </li>
          <li class="active"
              @click="updateLibraryTask"
              v-if="selectLibRow.faceLibraryType === 'staticFaceLib'">
            <img src="@/assets/images/faceModule/facedb_update.png"
                 alt />
            <span>库更新</span>
          </li>

          <li class="rightoperat button-div">
            <div class="searchInputClass">
              姓名：
              <el-input class="searchinput"
                        label="姓名"
                        v-model="staffName"
                        placeholder="请输入"></el-input>
            </div>
            <el-button type="primary"
                       v-popover:popover>其他检索条件</el-button>
            <el-popover ref="popover"
                        placement="bottom-end"
                        :visible-arrow="false"
                        width="300"
                        trigger="click">
              <search-option-view @query="queryAct"></search-option-view>
            </el-popover>
            <el-button type="primary"
                       @click="search">检索</el-button>
          </li>
        </ul>
      </div>

      <div v-show="!faceDBDialogAddVisible"
           class="typeoperator">
        <el-radio v-model="typeradio"
                  @change="changetype"
                  label="TheFaceDBImageTable">图片</el-radio>
        <el-radio v-model="typeradio"
                  @change="changetype"
                  label="TheFaceDBListTable">列表</el-radio>
      </div>

      <div v-show="!faceDBDialogAddVisible"
           class="dataWrap"
           ref="dataWrap">
        <!-- 这里面有用了双变量 保存切换视图，保存另一个的状态 -->
        <keep-alive>
          <component :is="currentcomponents"
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
                     @changepage="changepage"></component>
        </keep-alive>
      </div>
      <!-- 人脸增加弹窗 -->
      <the-face-d-b-add :faceDBDialogVisible="faceDBDialogAddVisible"
                        :libraryarr="libraryarr"
                        :libraryuuid="faceLibraryUuid"
                        :isUpdate="isUpdate"
                        :staffDetail="staffDetail"
                        :title="addtitle"
                        @getstafflirary="getstafflirary"
                        @closeAddAct="closeStaffAddDialogAct"></the-face-d-b-add>
    </div>

    <!-- 新建人脸库弹窗 -->
    <the-face-d-b-dialog :faceDBDialogVisible="faceDBDialogVisible"
                         :updatefacedata="updatefacedata"
                         @close="closeFaceDBDialogAct"></the-face-d-b-dialog>
    <!-- 库更新弹窗 -->
    <the-face-d-b-d-k-dialog :faceDBDialogVisible="faceDBDialogDKVisible"
                             :libraryuuid="selectLibRow.faceLibraryUuid ? selectLibRow.faceLibraryUuid : ''"
                             @close="faceDBDialogDKVisible=false"
                             @confirm="confirmDBUpdate"></the-face-d-b-d-k-dialog>
    <!-- 更新历史弹窗 -->
    <the-face-d-b-update-history-dialog :faceDBDialogVisible="faceDBDialogUpdateHistoryVisible"
                                        @close="faceDBDialogUpdateHistoryVisible=false"></the-face-d-b-update-history-dialog>

    <!-- 人脸删除弹窗 -->
    <el-dialog title="提示"
               width="30%"
               class="DeleteDialogClass"
               :visible.sync="dialogVisible">
      <p class="mydelete">
        <img src="@/assets/delete.png"
             alt />
        <span>是否确定删除</span>
      </p>
      <span slot="footer"
            class="dialog-footer DeleteDialogClass">
        <el-button type="primary"
                   @click="deletesurt">确 定</el-button>
        <el-button type="primary"
                   @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 导出模板选择弹窗 -->
    <el-dialog class="ExportDialogClass"
               title="导出模板选择"
               width="350px"
               :visible.sync="exportdialogVisible">
      <div style="margin:50px auto;">
        <el-select v-model="choosetemplate"
                   placeholder="请选择"
                   class="ExportDialogInput">
          <el-option v-for="item in templatetypearr"
                     :key="item.typeStr"
                     :label="item.typeName"
                     :value="item.typeStr"></el-option>
        </el-select>
      </div>
      <div style="height:80px;">
        <el-button type="primary"
                   style="width:120px;display:block;margin:0px auto 30px;"
                   @click="sureExport">确定</el-button>
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
      uploadstatusZnarr: [],
      defaultHeader: require("@/assets/user.png"),
      listTableColumns: [], // 右边表格，显示哪些数据
      ws: "" // 定义全局的websocket对象
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
        RestApi.api.faceModuleAPi.faceDBApi.downloadFace(
          this.$store.state.home.projectUuid
        ) + "?templateType=" + this.choosetemplate,
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
        staffName: this.staffName,
        page: this.pageNow,
        limit: this.pageSize
      };
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
            this.$message.success(this.libraryName + "没有数据");
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
      this.getStaffLibStaffData();
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
      // 当点击左边的列表，右边进行更新
      this.faceDBDialogAddVisible = false;
      this.selectLibRow = row;
      this.faceLibraryUuid = this.selectLibRow.faceLibraryUuid;
      this.libraryName = this.selectLibRow.faceLibraryName;
      this.currentRowStyle(this.selectLibRow.index);
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
          faceUuid: uuid
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
      faceApi
        .getFaceLib()
        .then(res => {
          this.loadding = false;
          if (res.data.success && res.data.data) {
            this.tableData = res.data.data;
            if (this.tableData && !this.tableData.length) return;
            this.selectLibRow = this.tableData[0];
            this.faceLibraryUuid = res.data.data[0].faceLibraryUuid;
            this.libraryName = res.data.data[0].faceLibraryName;
            this.$refs.multipleTable.setCurrentRow(this.selectLibRow);
            this.getStaffLibStaffData();
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(() => {
          this.loadding = false;
        });
    },
    conSocket() {
      const _this = this;
      console.log(window.config.socketIP);
      this.ws = new WebSocket(window.config.socketIP);
      this.ws.onopen = function() {};
      // test
      this.ws.onmessage = function(e) {
        console.log("socket有数据过来了!");
        if (!e.data) {
          console.log("暂无消息推送");
        } else {
          try {
            if (
              JSON.parse(e.data) &&
              JSON.parse(e.data).topic === "TOPIC_FILE_UPLOAD_PROCESS"
            ) {
              let data = JSON.parse(JSON.parse(e.data).data);
              console.log(data);
              if (data.socketType === "startStaffImport") {
                var needdata = data.clientImportInfoDTO.allNeedFileNamelist;
                console.log(needdata);
                console.log(_this.taskNum);
                if (needdata.length) {
                  for (var j = 0; j < _this.taskNum.length; j++) {
                    if (
                      _this.taskNum[j].isUpload === false &&
                      _this.taskNum[j].time ===
                        data.clientImportInfoDTO.filepath
                    ) {
                      // 去除需要上传的文件
                      for (let i = 0; i < _this.taskNum[j].num.length; i++) {
                        var flag = false;
                        for (var k = 0; k < needdata.length; k++) {
                          if (_this.taskNum[j].num[i].name === needdata[k]) {
                            flag = true;
                            break;
                          }
                        }
                        if (!flag) {
                          _this.taskNum[j].uploader.removeFile(
                            _this.taskNum[j].num[i].id
                          );
                        } else {
                          console.log(
                            "-------------------------" +
                              _this.taskNum[j].num[i].name
                          );
                        }
                      }
                      console.log("找到相同时间戳的任务了，我要开始上传了。");
                      _this.taskNum[j].uploader.start();
                      _this.taskNum[j].isUpload = true;
                      break;
                    }
                  }
                } else {
                  // console.log("上传完毕，调用分析接口");
                  // api.fenxi().then(res => {});
                }
              } else if (data.socketType === " staffImportProcess") {
                // var data = data.clientImportInfoDTO;
                // var needdata = data.allNeedFileNamelist;
                // if (data.progress === 0.33 && !needdata.length) {
                //   console.log("上传完毕，调用分析接口");
                //   api.fenxi().then(res => {});
                // }

                _this.getStaffLibList();
                _this.realtimeNum.push({
                  progress: data.progress,
                  taskuuid: data.taskuuid,
                  status: data.status
                });
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      };
      this.ws.onclose = function() {
        console.log("socket关闭了");
      };
    },
    confirmDBUpdate() {
      this.faceDBDialogDKVisible = false;
      this.getStaffLibList();
    }
  },
  mounted() {
    // this.templatetypearr = window.face.kutemplate;
    this.templatetypearr = this.$common.getEnumByGroupStr("staff_temp");
    this.$nextTick(function() {
      // var el = this.$refs.dataWrap;
      // var w = el.offsetWidth;
      // var h = el.offsetHeight;
      // this.imagePageSize = 4 * Math.floor(w / 150);
      // this.listPageSize = 15;
    });
  },
  activated() {
    if (this.listTableData.length || this.imageTableData.length) {
      // this.getStaffLibList(false); // 如果有数据就不用在请求一次了。
    } else {
      // this.getStaffLibList(true);
    }
    this.getStaffLibList(true);
    // this.conSocket(); // 建立socket
  },
  deactivated() {
    if (this.ws) {
      this.ws.close();
      this.ws = "";
    }
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
