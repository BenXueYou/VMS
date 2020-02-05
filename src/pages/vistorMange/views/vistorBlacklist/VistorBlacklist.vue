<template>
  <div class="Backlist"
       v-loading="showLoading">
    <div class="header">
      <div>黑名单列表</div>
    </div>
    <div class="main">
      <div class="main-header">
        <div>
          <el-button :disabled="!OwnAuthDisabled"
                     type="primary"
                     @click="addBtnAct"
                     size="mini">
            <img class="img"
                 src="@/assets/images/doorAccess/add_btn_icon.png"
                 alt />新增
          </el-button>
          <el-button :disabled="!OwnAuthDisabled"
                     type="primary"
                     size="mini">
            <img class="img"
                 src="@/assets/images/vistorManage/import_icon.png"
                 alt />导入
          </el-button>
          <el-button :disabled="!OwnAuthDisabled"
                     type="primary"
                     size="mini">
            <img class="img"
                 src="@/assets/images/vistorManage/export_icon.png"
                 alt />导出
          </el-button>
        </div>
        <div class="rightgroup">
          <span class="title">姓名：</span>
          <el-input class="input staffNameInput"
                    v-model="staffName"></el-input>
          <el-button :disabled="!ShowAuthDisabled"
                     type="primary"
                     @click="queryBtnAct"
                     icon="el-icon-search"
                     size="small">检索</el-button>
          <el-button :disabled="!ShowAuthDisabled"
                     type="primary"
                     v-popover:popover1
                     size="small">其他条件检索</el-button>
          <el-popover ref="popover1"
                      placement="bottom"
                      :visible-arrow="false"
                      width="600"
                      trigger="click">
            <blacklist-search-view @query="queryAct"></blacklist-search-view>
          </el-popover>
          <el-button :disabled="!ShowAuthDisabled"
                     type="primary"
                     @click="tableOrTableCell = !tableOrTableCell"
                     size="small">切换视图</el-button>
        </div>
      </div>
      <el-table v-if="!tableOrTableCell"
                ref="BacklistTable"
                :data="tableData"
                tooltip-effect="dark"
                class="tableBoxClass"
                @sort-change="sortChange"
                @selection-change="handleSelectionChange">
        <el-table-column type="index"
                         :index="tableIndex"
                         label="序号"
                         width="55"></el-table-column>
        <el-table-column prop="blacklistName"
                         label="姓名"></el-table-column>
        <el-table-column prop="gender"
                         label="性别"
                         width="80">
          <template slot-scope="scope">{{$common.getEnumItemName("gender", scope.row.gender)}}</template>
        </el-table-column>
        <el-table-column prop="credentialNo"
                         label="证件号码"></el-table-column>
        <el-table-column prop="blockDatetime"
                         label="拉黑时间"
                         sortable="custom"></el-table-column>
        <el-table-column prop="source"
                         label="黑名单来源">
          <template slot-scope="scope">{{$common.getEnumItemName("blacklistSource", scope.row.source)}}</template>
        </el-table-column>
        <el-table-column label="操作"
                         min-width="100">
          <template slot-scope="scope">
            <div class="tableCertificateBtnClass">
              <span :class="OwnAuthDisabled?'cursorClass':''"
                    @click="editBtnAct(scope.row)"
                    class="editFontClass">编辑</span>
              <span :class="ShowAuthDisabled?'cursorClass':''"
                    @click="detailBtnAct(scope.row)"
                    class="editFontClass cursorClass">详情</span>
              <span :class="OwnAuthDisabled?'cursorClass':''"
                    @click="signWhitelistBtnAct(scope.row)"
                    class="deleteBtnClass cursorClass">从黑名单中移出</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-else
           class="tableView">
        <el-checkbox class="checkedAll"
                     v-model="checkedAll"
                     @change="checkedAllChange"
                     label="本页全选"></el-checkbox>
        <div class="tableCellContent">
          <div class="cellBox"
               v-for="(item,index) in tableCellData"
               :key="index">
            <el-popover :visible-arrow="false"
                        popper-class="BacklistPopoverClass"
                        placement="bottom"
                        trigger="click">
              <el-row class="popoverBox"
                      justify="space-between">
                <el-col :class="ShowAuthDisabled?'cursorClass':''"
                        class="BLelPopoverCol cursorClass"
                        @click.native="detailBtnAct(item)">
                  <img class="img"
                       src="@/assets/images/personMange/detail1.png" />
                  详情
                </el-col>
                <el-col :class="OwnAuthDisabled?'cursorClass':''"
                        class="BLelPopoverCol cursorClass"
                        @click.native="editBtnAct(item)">
                  <img class="img"
                       src="@/assets/images/personMange/edit.png" />
                  编辑
                </el-col>
                <el-col :class="OwnAuthDisabled?'cursorClass':''"
                        class="BLelPopoverCol cursorClass"
                        @click.native="signWhitelistBtnAct(item)">
                  <img class="img"
                       src="@/assets/images/personMange/delete1.png" />
                  移除
                </el-col>
              </el-row>
              <el-row slot="reference"
                      class="cellItemClass">
                <div class="imgBox">
                  <img class="images"
                       :src="item.snapPhotoUri?imageUrl(item.snapPhotoUri):require('@/assets/images/user.png')"
                       alt />
                </div>
                <div class="txtBox">
                  <span class="textClips"
                        @mouseover="mymouseover"
                        @mouseout="mymouseout"
                        @mousemove="mymousemove">
                    <span>{{item.blacklistName}}</span>
                    <span>{{$common.transferEnumItemName($store.getters.GET_GENDEROPTIONS, item.gender)}}</span>
                    <span>{{$common.getEnumItemName("cred", item.credentialType)}}</span>
                  </span>
                  <span class="textClips"
                        @mouseover="mymouseover"
                        @mouseout="mymouseout"
                        @mousemove="mymousemove">{{item.credentialNo}}</span>
                  <span class="textClips"
                        @mouseover="mymouseover"
                        @mouseout="mymouseout"
                        @mousemove="mymousemove">{{$common.getEnumItemName("blacklistSource", item.source)}}</span>
                </div>
                <el-checkbox class="checkBox"
                             v-model="item.checked"
                             @change="checkBoxChange(item)"></el-checkbox>
              </el-row>
            </el-popover>
          </div>
        </div>
      </div>
      <blacklist-detail :visible="isShow"
                        :defaultRow="defaultRow"
                        :OwnAuthDisabled="OwnAuthDisabled"
                        @close="closeDetail"></blacklist-detail>
      <blacklist-add :visible="isAddDialogShow"
                     :title="title"
                     :defaultRow="defaultRow"
                     @closeAddDialogDetail="closeAddDialogDetail"></blacklist-add>
      <!----------------------------------表格分页器---------------------------------->
      <div class="footer">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       layout="total,prev, pager, next,jumper"
                       :page-size="pageSize"
                       :total="total"
                       background></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
import BlacklistSearchView from "../../components/vistorBlacklist/BlacklistSearchView";
import BlacklistDetail from "../../components/vistorBlacklist/BlacklistDetail";
import BlacklistAdd from "../../components/vistorBlacklist/BlacklistAdd";
import RestApi from "@/utils/RestApi.js";
// eslint-disable-next-line
import * as api from "../../utils/ajax";
export default {
  components: { BlacklistSearchView, BlacklistDetail, BlacklistAdd },
  props: {},
  data() {
    return {
      defaultRow: {},
      tableData: [],
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
      isAddDialogShow: false,
      showLoading: false,
      checkStaffUuids: [],
      title: "添加黑名单",
      otherSearchData: {},
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  created() {},
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("黑名单管理", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("黑名单管理", "isOwn");
    let h =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    let w =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    this.$nextTick(res => {
      this.$refs.BacklistTable.$el.style.height = h - 315 + "px";
    });
    // 这里 -1 是为了去掉表头高度
    this.tableSize = parseInt((h - 315) / 50) - 1;
    this.tableCellSize = parseInt((w - 340) / 158) * parseInt((h - 350) / 235);
    console.log(this.pageSize);
    // 当窗口发生变化时
    let that = this;
    window.addEventListener("resize", function() {
      let h =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      let w =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      that.$nextTick(res => {
        that.$refs.BacklistTable.$el.style.height = h - 315 + "px";
      });
      that.tableSize = parseInt((h - 315) / 50) - 1;
      that.tableCellSize =
        parseInt((w - 340) / 158) * parseInt((h - 350) / 235);

      console.log(that.pageSize);
    });
    this.pageSize = !this.tableOrTableCell
      ? this.tableSize
      : this.tableCellSize;
    this.currentPage = !this.tableOrTableCell ? this.currentPage : 1;
  },
  activated() {
    setTimeout(() => {
      this.currentPage = 1;
      this.initData();
    }, 0);
  },
  methods: {
    imageUrl(a) {
      //   console.log(RestApi.api.imageUrl(a));
      return RestApi.api.imageUrl + a;
    },
    initData() {
      if (!this.ShowAuthDisabled) {
        return;
      }
      var params = {
        pageSize: this.pageSize,
        page: this.currentPage,
        order: "blockDatetime",
        sort: "desc"
      };
      Object.assign(params, this.otherSearchData);
      this.showLoading = !this.showLoading;
      api
        .getBlacklistUrl(params)
        .then(res => {
          this.showLoading = false;
          if (res.data.success) {
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
            this.$message({ type: "error", message: "没有找到相关黑名单信息" });
          }
        })
        .catch(err => {
          this.showLoading = false;
          console.error(err);
        });
    },
    checkedAllChange(val) {
      if (val) {
        // 全选了
        this.checkStaffUuids = [];
        this.tableCellData.forEach(element => {
          element.checked = true;
          this.checkStaffUuids.push(element.staffUuid);
        });
      } else {
        // 取消全选
        if (this.tableCellData.length === this.checkStaffUuids.length) {
          this.checkStaffUuids = [];
          this.tableCellData.forEach(element => {
            element.checked = false;
          });
        }
      }
    },
    checkBoxChange(val) {
      let i = this.checkStaffUuids.indexOf(val.staffUuid);
      if (i === -1) {
        this.checkStaffUuids.push(val.staffUuid);
      } else {
        this.checkStaffUuids.splice(i, 1);
      }
      this.checkedAll =
        this.checkStaffUuids.length === this.tableCellData.length;
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
      this.initData(data);
    },
    closeAddDialogDetail(isRefresh) {
      this.isAddDialogShow = !this.isAddDialogShow;
      if (isRefresh) {
        this.initData();
      }
    },
    closeDetail(val) {
      this.isShow = !this.isShow;
      if (val === "addToWhitelisttAct") {
        this.initData();
      }
    },
    // 添加
    addBtnAct() {
      this.isAddDialogShow = !this.isAddDialogShow;
      this.title = "添加黑名单";
      this.defaultRow = {};
    },
    // 详情
    detailBtnAct(rowData) {
      if (!this.ShowAuthDisabled) return;
      this.defaultRow = rowData;
      this.httpGetAlarmFromBlackkistUuid(rowData);
    },
    // http getblacklist detail 详情,根据字段blacklistUuid,查报警记录，组成详情页信息
    httpGetAlarmFromBlackkistUuid(rowData) {
      this.showLoading = !this.showLoading;
      console.log(rowData);
      api
        .getBlacklistAlarmListUrl({
          resUuid: rowData.blacklistUuid,
          pageSize: 3,
          currentPage: 1
        })
        .then(res => {
          this.isShow = !this.isShow;
          this.showLoading = !this.showLoading;
          if (res.data.success && res.data) {
            this.defaultRow.alarmList = res.data.data.list;
          } else {
            this.$message({
              type: "error",
              message: "没有找到相关黑名单的报警记录"
            });
          }
        })
        .catch(err => {
          this.showLoading = !this.showLoading;
          console.error(err);
        });
    },
    // 移出黑名单
    signWhitelistBtnAct(rowData) {
      if (!this.OwnAuthDisabled) return;
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
            api
              .deleteBlacklistUrl({ blacklistUuid: rowData.blacklistUuid })
              .then(res => {
                if (res.data.success) {
                  this.$message.success(res.data.msg);
                  this.initData();
                } else {
                  this.$message.error(res.data.msg);
                }
              });
          }
        });
    },
    editBtnAct(rowData) {
      if (!this.OwnAuthDisabled) return;
      this.isAddDialogShow = !this.isAddDialogShow;
      this.defaultRow = rowData;
      this.title = "编辑黑名单";
    },
    queryBtnAct() {
      var data = {};
      data.blacklistName = this.staffName;
      this.currentPage = 1;
      Object.assign(this.otherSearchData, data);
      this.initData(data);
    },
    // 检索按钮事件
    queryAct(data) {
      Object.assign(this.otherSearchData, data);
      this.initData();
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
      console.log(this.pageSize, this.currentPage);
      this.initData();
    },
    staffName(val) {
      this.otherSearchData.blacklistName = val;
    }
  },
  destroyed() {}
};
</script>
<style>
.Backlist .deleteBtnClass {
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ff5f5f;
}
.Backlist .editFontClass {
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #26d39d;
  margin: 0 10px;
}
.Backlist .rightgroup {
  display: inline-block;
}
.Backlist .rightgroup .title {
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ffffff;
}
.Backlist .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: #ffffff;
  background-color: rgba(40, 255, 187, 0.08);
  border: 0;
  border-bottom: 1px solid rgba(38, 211, 157, 0.5);
  border-right: 1px solid transparent;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.BacklistPopoverClass .BLelPopoverCol {
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  color: #dddddd;
  height: 30%;
  line-height: 25px;
}
.Backlist .el-radio-button__inner {
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
.Backlist .otherDay .el-radio-button__inner {
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
.Backlist .el-radio-button:first-child .el-radio-button__inner {
  border-left: 0;
  border-radius: 4px 0 0 4px;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
.Backlist .el-input--prefix .el-input__inner {
  padding-left: 12px;
}
.Backlist .el-input--suffix .el-input__inner {
  padding-right: 0px;
}
.Backlist .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 180px;
}
.Backlist .el-icon-time:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 120%;
}
.Backlist .el-button--primary,
.Backlist .el-button--primary:hover,
.Backlist .el-button--primary:active,
.Backlist .el-button--primary:focus {
  font-family: "PingFangSC-Regular";
  font-size: 16px;
  min-width: 90px;
  height: 34px;
  background: rgba(40, 255, 187, 0.08);
  border: 1px solid rgba(38, 211, 157, 0.45);
  border-radius: 2px;
  border-radius: 2px;
  margin: 0 10px;
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #ffffff;
}
.Backlist .staffNameInput {
  width: 160px;
  display: inline-block;
  margin-right: 15px;
}
.Backlist .tableView {
  height: calc(100% - 90px);
}
.Backlist .tableCellContent {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  width: 100%;
  height: calc(100% - 20px);
}
.Backlist .checkedAll {
  padding-left: 20px;
}
.Backlist .tableCellContent .cellBox {
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
.Backlist .cellBox .imgBox {
  width: 118px;
  height: 118px;
}
.Backlist .cellBox .imgBox .images {
  width: 100%;
  height: 100%;
}
.Backlist .checkBox {
  position: absolute;
  top: 15px;
  left: 15px;
}
.BacklistPopoverClass {
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
.Backlist .txtBox {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/style/variables.scss";
.Backlist {
  height: 100%;
  color: #dddddd;
  .header {
    height: 50px;
    padding: 15px 40px;
    background: #212325;
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
