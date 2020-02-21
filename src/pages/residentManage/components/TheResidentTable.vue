<template>
  <div class="wrap theResidentGroup"
       v-loading="mainScreenLoading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="contentBox"
         v-show="!addResidentDialogVisible">
      <div class="titleBox">{{topCheckedNodeTitle}}（{{this.total}}人）</div>
      <div class="tablecontent">
        <div class="overflowX">
          <div class="btn-group">
            <el-button type="primary"
                       :disabled="!$common.getAuthIsOwn('居民管理', 'isOwn')"
                       @click="addResident"
                       style="margin-bottom:10px;">新增居民</el-button>
            <el-button type="primary"
                       :disabled="!$common.getAuthIsOwn('居民管理', 'isOwn')"
                       @click="deleteMoreResidents">删除</el-button>
            <el-button type="primary"
                       :disabled="!$common.getAuthIsOwn('居民管理', 'isOwn')"
                       @click="isShowPatchImportDialog=!isShowPatchImportDialog">批量导入</el-button>
            <el-button type="primary"
                       :disabled="!$common.getAuthIsOwn('居民管理', 'isOwn')"
                       @click="exportAct">批量导出</el-button>
            <el-button type="primary"
                       :disabled="!$common.getAuthIsOwn('居民管理', 'isOwn')"
                       @click="getMsgToDeviceDialogVisiable=!getMsgToDeviceDialogVisiable">从设备内获取居民信息</el-button>
            <el-button type="primary"
                       :disabled="!$common.getAuthIsOwn('居民管理', 'isShow')"
                       @click="staticsData">统计</el-button>
            <div class="rightgroup">
              <span class="title">姓名：</span>
              <el-input class="input"
                        v-model="staffName"></el-input>
              <el-button type="primary"
                         :disabled="!$common.getAuthIsOwn('居民管理', 'isShow')"
                         @click="getResident"
                         icon="el-icon-search"
                         size="small">检索</el-button>
              <el-button type="primary"
                         v-popover:popover1
                         size="small">其他条件检索</el-button>
              <el-button type="primary"
                         @click="tableOrTableCell = !tableOrTableCell"
                         size="small">切换视图</el-button>
            </div>
            <el-popover ref="popover1"
                        placement="bottom-end"
                        :visible-arrow="false"
                        width="300"
                        trigger="click">
              <search-option-view @query="queryAct"></search-option-view>
            </el-popover>
          </div>
          <el-table v-if="tableOrTableCell"
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    class="tableBoxClass"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection"
                             :index="tableIndex"
                             width="55"></el-table-column>
            <el-table-column prop="staffName"
                             label="姓名"></el-table-column>
            <el-table-column prop="gender"
                             label="性别"
                             width="80">
              <template slot-scope="scope">{{$common.getEnumItemName("gender", scope.row.gender)}}</template>
            </el-table-column>
            <el-table-column prop="cellphone"
                             label="电话"></el-table-column>
            <el-table-column prop="address"
                             label="住址"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="staffType"
                             width="100"
                             label="人员类型">
              <template slot-scope="scope">{{$common.getEnumItemName("staff_t", scope.row.staffType)}}</template>
            </el-table-column>
            <el-table-column prop="netStatus"
                             label="凭证">
              <template slot-scope="scope">
                <div class="tableCertificateClass">
                  <span class="tableCertificateBtnClass">
                    <img v-if="scope.row && scope.row.voucher && scope.row.voucher.faceNum"
                         src="@/assets/images/personMange/face.png"
                         style="margin-right: 11.5px" />
                    <img v-else
                         src="@/assets/images/personMange/faceFade.png"
                         style="margin-right: 11.5px" />
                  </span>
                  <span class="tableCertificateCenterBtnClass">
                    <img v-if="true"
                         src="@/assets/images/personMange/fingerprint.png"
                         style="margin:0 10.2px 0 0;" />
                    {{(scope.row && scope.row.voucher)?scope.row.voucher.fingerprintNum:''}}
                  </span>
                  <span class="tableCertificateBtnClass">
                    <img v-if="true"
                         src="@/assets/images/personMange/card.png"
                         style="margin-right: 11.5px" />
                    {{(scope.row && scope.row.voucher)?scope.row.voucher.cardNum:''}}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime"
                             label="注册时间"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作"
                             width="200">
              <template slot-scope="scope">
                <div class="tableCertificateBtnClass">
                  <span :class="$common.getAuthIsOwn('居民管理', 'isShow')?'cursorClass':'disabled'"
                        class="tableOperateBtnClass"
                        @click="detailResident(scope.row)">
                    <img v-if="$common.getAuthIsOwn('居民管理', 'isShow')"
                         class="img"
                         src="@/assets/images/personMange/detail.png"
                         style="margin-right: 5.9px;" />详情
                  </span>
                  <span :class="$common.getAuthIsOwn('居民管理', 'isOwn')?'cursorClass':'disabled'"
                        @click="editResident(scope.row)"
                        class="editFontClass">编辑</span>
                  <span :class="$common.getAuthIsOwn('居民管理', 'isOwn')?'cursorClass':'disabled'"
                        @click="deleteResident(scope.row)"
                        class="deleteBtnClass">删除</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div v-else
               class="tableView">
            <el-checkbox class="checkedAll"
                         :disabled="!$common.getAuthIsOwn('居民管理', 'isShow')"
                         v-model="checkedAll"
                         @change="checkedAllChange"
                         label="本页全选"></el-checkbox>
            <div class="tableCellContent">
              <div class="cellBox"
                   v-for="(item,index) in tableCellData"
                   :key="index">
                <el-popover :visible-arrow="false"
                            :popper-class="!addResidentDialogVisible?'ResidentPopoverClass':'cellPopoverHidden'"
                            placement="bottom"
                            trigger="click">
                  <!-- width="92" -->
                  <el-row class="popoverBox"
                          justify="space-between">
                    <el-col :class="$common.getAuthIsOwn('居民管理', 'isShow')?'cursorClass':'disabled'"
                            class="FRelPopoverCol"
                            @click.native="detailResident(item)">
                      <img class="img"
                           v-if="!$common.getAuthIsOwn('居民管理', 'isShow')"
                           src="@/assets/images/personMange/detail1.png" />
                      <img class="img"
                           v-else
                           src="@/assets/images/personMange/detail.png" />
                      详情
                    </el-col>
                    <el-col :class="$common.getAuthIsOwn('居民管理', 'isOwn')?'cursorClass':'disabled'"
                            class="FRelPopoverCol"
                            @click.native="editResident(item)">
                      <img class="img"
                           v-if="$common.getAuthIsOwn('居民管理', 'isOwn')"
                           src="@/assets/images/personMange/edit.png" />
                      <img class="img"
                           v-else
                           src="@/assets/images/personMange/edit2.png" />
                      编辑
                    </el-col>
                    <el-col :class="$common.getAuthIsOwn('居民管理', 'isOwn')?'cursorClass':'disabled'"
                            class="FRelPopoverCol"
                            @click.native="deleteResident(item)">
                      <img class="img"
                           v-if="!$common.getAuthIsOwn('居民管理', 'isOwn')"
                           src="@/assets/images/personMange/delete1.png" />
                      <img v-else src="@/assets/images/delete2.png" alt />
                      删除
                    </el-col>
                  </el-row>
                  <el-row slot="reference"
                          class="cellItemClass">
                    <div class="imgBox">
                      <!-- style="min-width:100px;min-height:100px;" -->
                      <img class="images"
                           :src="item.photoUri?imageUrl+item.photoUri:require('@/assets/images/user.png')"
                           alt />
                    </div>
                    <div class="txtBox">
                      <p style="height:18px;">
                        <span>{{item.staffName}}</span>
                        <span>{{$common.transferEnumItemName($store.getters.GET_GENDEROPTIONS, item.gender)}}</span>
                        <span>{{$common.transferEnumItemName($store.getters.GET_STAFFOPTIONS, item.staffType)}}</span>
                      </p>
                      <p style="height:18px;">{{item.cellphone}}</p>
                      <p class="textClips"
                         style="height:18px;"
                         @mouseover="mymouseover"
                         @mouseout="mymouseout"
                         @mousemove="mymousemove">{{item.address}}</p>
                    </div>
                    <el-checkbox class="checkBox"
                                 v-model="item.checked"
                                 @change="checkBoxChange(item)"></el-checkbox>
                  </el-row>
                </el-popover>
              </div>
            </div>
          </div>
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
    </div>
    <!----------------------------------居民删除提示弹窗---------------------------------->
    <confirm-dialog :visible.sync="deleteConfirmDialogVisible"
                    confirmText="是否删除该住户"
                    @confirm="confirm"
                    @close="close"></confirm-dialog>

    <!----------------------------------居民添加弹窗-------------------------------------->
    <the-resident-add-dialog :addResidentDialogVisible="addResidentDialogVisible"
                             :defaultResident="residentDetail"
                             :titleTxt="TitleTxt"
                             :topCheckedNodeTitle="topCheckedNodeTitle"
                             @close="closeAddView"
                             @transferResidentData="transferResidentData"></the-resident-add-dialog>

    <!----------------------------------获取用户信息的设备弹窗------------------------------>
    <tab-tree-tag title="请选择拉取居民信息的设备"
                  rightTxt="已选的分组、设备、地址"
                  :tabs="tabs"
                  :isShow="getMsgToDeviceDialogVisiable"
                  @onCancel="onCancel"
                  @onConfirm="onConfirm"></tab-tree-tag>
    <!--------------------------- 导入弹窗 TheResidentImportDialog ---------------------->
    <the-resident-import-dialog :isShow="isShowPatchImportDialog"
                                type="resident"
                                title="批量导入居民"
                                @onCancel="onCancelPatchImportDialog"
                                @onImport="onConfirmPatchImportDialog"></the-resident-import-dialog>

    <!---------------------------------- 居民详情弹窗 TheResidentDetailDialog---------------------------------->
    <the-resident-detail-dialog :visible.sync="detailResidentDialogVisible"
                                :defaultResident="residentDetail"></the-resident-detail-dialog>

    <!---------------------------------- 居民统计弹窗 TheResidentStaticsDialog---------------------------------->
    <statics-dialog :isShow="staticsResidentDialogVisible"
                    :title="topCheckedNodeTitle"
                    :staticDefaultData="staticDialogData"
                    @onClickConfirm="staticsConfirm"
                    @onClickCancel="staticsCancel"></statics-dialog>
  </div>
</template>
<script>
import ConfirmDialog from "@/common/ConfirmDialog";
import TheResidentAddDialog from "./TheResidentAddDialog";
import SearchOptionView from "./SearchOptionView";
import tabTreeTag from "@/common/TabTreeTag";
import TheResidentImportDialog from "@/pages/residentManage/components/TheResidentImportDialog";
import TheResidentDetailDialog from "@/pages/residentManage/components/TheResidentDetailDialog";
import StaticsDialog from "@/common/StaticsDialog";
import { mapState } from "vuex";
import { mouseover, mouseout, mousemove } from "@/common/mouse.js"; // 注意路径
import RestApi from "@/utils/RestApi.js";
export default {
  name: "TheCompanyTable",
  data() {
    return {
      staticDialogData: null,
      imageUrl: RestApi.api.imageUrl,
      cellPopoverVisible: false,
      mainScreenLoading: false,
      checkedAll: false,
      tableOrTableCell: true,
      staffName: "",
      addResidentDialogVisible: false,
      detailResidentDialogVisible: false,
      ConfirmDialogVisible: false,
      deleteConfirmDialogVisible: false,
      index: 0,
      getMsgToDeviceDialogVisiable: false,
      isShowPatchImportDialog: false,
      staticsResidentDialogVisible: false,
      tableData: [],
      tableCellData: [],
      multipleSelection: [],
      checkedMenuUuid: false,
      currentPage: 1,
      pageSize: 15,
      total: 0,
      residentDetail: {},
      TitleTxt: "",
      topCheckedNodeTitle: "",
      checkStaffUuids: [],
      tabs: [
        {
          id: "2",
          label: "地址",
          treeType: "resident",
          treeRef: "tree2",
          nodeKey: "id",
          treeNodeType: "device"
        },
        {
          id: "1",
          label: "设备树",
          treeType: "orgAndDev",
          treeRef: "tree1",
          nodeKey: "id",
          hasDoor: false
        }
      ],
      tableSize: 15,
      tableCellSize: 30,
      queryData: {},
      resizeFlag: false
    };
  },
  components: {
    ConfirmDialog,
    TheResidentAddDialog,
    SearchOptionView,
    tabTreeTag,
    TheResidentImportDialog,
    TheResidentDetailDialog,
    StaticsDialog
  },
  mounted() {
    let h =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    // this.$refs.multipleTable.$el.style.height = h - 285 + "px";
    // 这里 -1 是为了去掉表头高度
    this.tableSize = parseInt((h - 235) / 50) - 1;
    console.log(this.tableSize);
    // 当窗口发生变化时
    let that = this;
    window.addEventListener("resize", function() {
      let h =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      // that.$refs.multipleTable.$el.style.height = h - 285 + "px";
      var pageSize = parseInt((h - 235) / 50) - 1;
      console.log(that.tableSize);
      if (pageSize !== that.tableSize && !that.resizeFlag) {
        that.tableSize = pageSize;
        that.getResident();
      }
    });
  },
  watch: {
    checkedLeftTreeData(val) {
      console.log(val);
      // if (this.checkedMenuUuid === val.id) {
      //   return;
      // }
      this.topCheckedNodeTitle = val.name;
      this.checkedMenuUuid = JSON.parse(JSON.stringify(val)).id;
      this.currentPage = 1;
      this.getResident();
    },
    tableOrTableCell(val) {
      this.pageSize = val ? this.tableSize : this.tableCellSize;
      this.currentPage = val ? this.currentPage : 1;
      // this.checkedAll = val ? this.checkedAll : false;
      this.getResident();
    },
    tableCellData: {
      handler(e1, e2) {},
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState({
      checkedLeftTreeData: state => {
        console.log(state);
        return state.resident.curentLeftCheckedData;
      }
    })
  },
  deactivated() {
    this.resizeFlag = true;
  },
  activated() {
    this.resizeFlag = false;
  },
  methods: {
    // 导出
    exportAct() {
      // 1、通知服务端需要导出的数据
      // 2、获取生成excel文件的下载路径
    },
    queryAct(data) {
      this.queryData = data;
      this.getResident();
    },
    // 全选或反全选
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
    deleteMoreResidents() {
      if (this.checkStaffUuids && this.checkStaffUuids.length) {
        this.deleteConfirmDialogVisible = true;
      } else {
        this.$message({ type: "warning", message: "没有选择删除项" });
      }
    },
    getResident() {
      if (!this.$common.getAuthIsOwn("居民管理", "isShow")) return;
      this.pageSize = this.tableOrTableCell
        ? this.tableSize
        : this.tableCellSize;
      if (!this.checkedMenuUuid && !this.checkedMenuUuid.length) {
        this.$message({ type: "warning", message: "没有选择基建树节点" });
        return;
      }
      var xhr = {
        limit: this.pageSize,
        page: this.currentPage,
        queryType: "infrastructure",
        queryTypeUuid: this.checkedMenuUuid,
        staffName: this.staffName
      };
      Object.assign(xhr, this.queryData);
      this.mainScreenLoading = true;
      this.$ResidentManageAjax
        .getResidentListApi(xhr)
        .then(res => {
          console.log(res.data);
          this.mainScreenLoading = false;
          this.tableData = [];
          this.tableCellData = [];
          if (res.data.success && res.data.data.list) {
            if (this.tableOrTableCell) {
              this.tableData = res.data.data.list;
              this.tableData.reverse();
            } else {
              let data = res.data.data.list;
              data.map(item => {
                item.checked = false;
              });
              this.tableCellData = data;
              this.tableCellData.reverse();
            }
            this.total = res.data.data.total;
            this.checkedAllChange(this.checkedAll);
          } else {
            console.log("getResident 出错了！！！");
            this.$message({
              type: "error",
              message: "出错了！！！"
            });
          }
        })
        .catch(() => {
          this.mainScreenLoading = false;
        });
    },

    // 导入信息
    onCancelPatchImportDialog() {
      this.isShowPatchImportDialog = !this.isShowPatchImportDialog;
    },
    onConfirmPatchImportDialog() {
      // 确定导入
      this.isShowPatchImportDialog = !this.isShowPatchImportDialog;
    },
    // 取消选择获取用户信息的设备
    onCancel() {
      this.getMsgToDeviceDialogVisiable = !this.getMsgToDeviceDialogVisiable;
    },
    // 选择导出居民信息的设备
    onConfirm(val) {
      console.log(val);
      this.getMsgToDeviceDialogVisiable = !this.getMsgToDeviceDialogVisiable;
      this.$ResidentManageAjax.getResidentFromDevice(val).then(res => {
        if (res.data.success) {
          this.$message({ type: "success", message: "已在后台开始导入" });
          this.connectSocket();
        } else {
          this.$message({ type: "err", message: res.data.msg });
        }
      });
    },
    // 监控设备导出居民信息的任务进度
    connectSocket() {
      /* eslint-disable */
      let socket = new SockJS(
        window.config.protocolHeader + window.config.socketIP
      );
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect(
        // { projectUuid: window.config.projectUuid },
        { projectUuid: this.$store.state.home.projectUuid },
        frame => {
          console.log("connect success: ", frame);
          this.stompClient.subscribe(
            "/user/topic/uploadPersonProgress",
            greeting => {
              console.log("subscribe success: ", greeting);
              // console.log(JSON.parse(greeting.body));
              var bodyData = JSON.parse(greeting.body);
              //  type:（-1失败，0统计总数阶段，1正在同步入库,2同步完成）
              if (bodyData.type === "2" || bodyData.type === 2) {
                this.$message({ type: "success", message: "导入成功" });
                this.$bus.$emit("getRefreshLeftMenu", this.checkedLeftTreeData);
              } else if (bodyData.type === "-1" || bodyData.type === -1) {
                this.$message({ type: "err", message: "任务失败" });
              } else {
                // 预览进度提示信息
                // map.put("totalSize", totalSize);    总数
                // map.put("currentSize", currentSize);   当前同步数量
              }
            }
          );
        },
        err => {
          console.log("error, errMsg: ", err);
        }
      );
      /* eslint-enable */
    },
    tableIndex(val) {
      val += 1;
      return val < 10 ? "0" + val : val;
    },
    // 统计按钮
    staticsData() {
      this.getHttpStaticsData();
    },
    // 请求居民管理的统计
    // "data": {
    //   "total": 32,
    //   "male": 31,
    //   "female": 1,
    //   "photos": 20,
    //   "mediums": 13,
    //   "fingerprints": 0
    // }
    getHttpStaticsData() {
      this.$ResidentManageAjax.getResidentStaticData().then(res => {
        if (res.data.success) {
          console.log(res.data.data);
          this.staticDialogData = res.data.data;
          this.staticsResidentDialogVisible = !this
            .staticsResidentDialogVisible;
        } else {
          this.$message({ type: "warning", message: "服务器开小差了" });
        }
      });
    },
    // 新增居民
    addResident() {
      this.residentDetail = {};
      this.residentDetail.checkedTreeNode = this.checkedLeftTreeData;
      console.log(this.residentDetail);
      this.TitleTxt = "新增居民";
      this.addResidentDialogVisible = true;
    },
    // 关闭新增
    closeAddView() {
      this.addResidentDialogVisible = false;
    },
    transferResidentData(xhr) {
      this.getResident();
    },
    // 删除按钮的确定 getResidentFromDevice
    confirm() {
      console.log("确定删除居民: ", this.residentDetail);
      this.deleteResidentAPi();
    },
    // 删除接口函数
    deleteResidentAPi() {
      this.mainScreenLoading = true;
      this.$ResidentManageAjax
        .deleteResidentApi(this.checkStaffUuids)
        .then(res => {
          this.mainScreenLoading = false;
          console.log("删除返回接口", res.data);
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "删除成功！"
            });
            this.checkStaffUuids = [];
            this.getResident();
          }
        })
        .catch(() => {
          this.mainScreenLoading = false;
        });
    },
    close() {},

    // table表格的选择
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
      this.checkStaffUuids = [];
      if (val && val.length) {
        val.forEach(item => {
          this.checkStaffUuids.push(item.staffUuid);
        });
      }
    },
    // 详情弹窗
    detailResident(data) {
      console.log("详情弹窗");
      if (!this.$common.getAuthIsOwn("居民管理", "isShow")) return;
      this.mainScreenLoading = true;
      this.$ResidentManageAjax
        .getResidentDetailApi({ staffUuid: data.staffUuid })
        .then(res => {
          console.log(res.data.data);
          this.mainScreenLoading = false;
          if (res.data.success && res.data.data) {
            this.detailResidentDialogVisible = true;
            this.residentDetail = res.data.data;
            this.residentDetail.addressString = data.address;
          }
        })
        .catch(() => {
          this.mainScreenLoading = false;
        });
    },
    // 编辑弹窗
    editResident(row) {
      if (!this.$common.getAuthIsOwn("居民管理", "isOwn")) return;
      this.cellPopoverVisible = false;
      let staffUuid = row.staffUuid;
      this.TitleTxt = "编辑居民";
      this.mainScreenLoading = true;
      setTimeout(() => {
        this.mainScreenLoading = false;
      }, 10000);

      this.$ResidentManageAjax
        .getResidentDetailApi({ staffUuid: staffUuid })
        .then(res => {
          console.log(res.data.data);
          this.mainScreenLoading = false;
          if (res.data.success && res.data.data) {
            this.addResidentDialogVisible = true;
            this.residentDetail = res.data.data;
            console.log(this.residentDetail);
          }
        });
    },
    // 删除按钮
    deleteResident(value) {
      if (!this.$common.getAuthIsOwn("居民管理", "isOwn")) return;
      this.deleteConfirmDialogVisible = true;
      this.residentDetail = value;
      this.checkStaffUuids = [];
      this.checkStaffUuids = [value.staffUuid];
    },
    // 统计弹窗的回调
    staticsConfirm() {
      this.staticsResidentDialogVisible = false;
    },
    staticsCancel() {
      this.staticsResidentDialogVisible = false;
    },
    handleCurrentChange(val) {
      console.log("当前页面变化的回调函数");
      this.checkedAll = false;
      this.currentPage = val;
      this.getResident();
    },
    handleSizeChange() {
      console.log("每一页数量变化时的回调函数");
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
  }
};
</script>
<style lang='scss'>
.textClips {
  /* display: inline-block; */
  /* width: 100%; */
  font-family: "PingFangSC-Regular";
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1; /*3表示只显示3行*/
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
}
.ResidentPopoverClass {
  // width: 90%;
  // height: 54%;
  width: 6.3%;
  // height: 8.4%;
  text-align: left;
  margin-left: 2.3%;
  margin-top: -4.26% !important;
  padding-left: 1.2%;
  box-sizing: border-box;
  // background-color: rgba(0, 0, 0, 0.6);
  background: #2a2e31;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  min-width: 0;
  font-family: "PingFangSC-Regular";
  font-size: 12px;
}
.popoverBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-around;
  color: #dddddd;
}
.FRelPopoverCol {
  height: 33%;
  line-height: 30px;
  color: #dddddd;
}
.cellItemClass {
  height: 100%;
}
.cellPopoverHidden {
  display: none;
}
.cellBox span:nth-child(0) {
  display: block;
  height: 100%;
}
@import "@/style/variables.scss";
.theResidentGroup {
  .btn-group {
    input {
      @include input30;
    }
  }
}
.el-checkbox__input.is-checked .el-checkbox__inner::after {
  border-color: #26d39d;
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.wrap {
  height: 100%;
  .contentBox {
    height: 100%;
  }
  .titleBox {
    font-family: "PingFangSC-Regular";
    font-size: 16px;
    color: #bbbbbb;
    text-align: justify;
    padding-bottom: 15px;
    padding-left: 20px;
  }
  .btn-group {
    position: relative;
    height: 60px;
    $defaultColor: rgb(44, 44, 44);
    button {
      padding: 10px 40px;
    }
    .default {
      background: $defaultColor;
      border: 1px solid $defaultColor;
    }
    .rightgroup {
      float: right;
      margin-bottom: 10px;
      .title {
        font-family: " PingFangSC-Regular";
        font-size: 13px;
        color: #dddddd;
        margin-right: 12px;
      }
      .input {
        width: 180px;
        margin-right: 13px;
      }
    }
  }
  .tablecontent {
    background-color: rgba(37, 41, 45, 0.8);
    height: calc(100% - 40px);
    padding: 20px 30px 10px;
    box-sizing: border-box;
    overflow: auto hidden;
    .overflowX {
      min-width: 1200px;
      height: 100%;
    }
    .btn-group {
      button {
        height: 30px;
        padding: 6px 15px;
      }
    }
    .tableBoxClass {
      width: 100%;
      height: calc(100% - 100px);
      box-sizing: border-box;
      overflow: auto;
    }
    .tableCertificateClass {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .tableCertificateBtnClass {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .tableCertificateCenterBtnClass {
        margin: 0 15px 0 7px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
    .tableOperateBtnClass {
      font-family: "PingFangSC-Regular";
      font-size: 13px;
      color: #26d39d;
      display: flex;
      flex-direction: row;
      align-items: center;
      display: inline-block;
    }
    .editFontClass {
      font-family: "PingFangSC-Regular";
      font-size: 13px;
      color: #26d39d;
      margin: 0 22px;
    }
    .deleteBtnClass {
      font-family: "PingFangSC-Regular";
      font-size: 13px;
      color: #ff5f5f;
    }
  }
  .footer {
    line-height: 40px;
    text-align: right;
    padding-right: 30px;
  }
  .tableView {
    width: 100%;
    border-top: 1px dashed rgba(255, 255, 255, 0.2);
    padding-top: 18px;
    height: calc(100% - 100px);
    box-sizing: border-box;
    overflow-y: auto;
    .checkedAll {
      padding-left: 20px;
    }
  }
  .tableCellContent {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 100%;
    height: calc(100% - 60px);
    .cellBox {
      width: 9%;
      height: 220px;
      text-align: center;
      margin: 0.9% 0.4%;
      padding: 12px 8px;
      box-sizing: border-box;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      position: relative;
      .imgBox {
        width: 100%;
        height: 70%;
      }
      .images {
        // width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
      }
      .txtBox {
        width: 100%;
        height: 30%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        p {
          font-family: "PingFangSC-Regular";
          font-size: 12px;
          color: #bbbbbb;
          letter-spacing: 0;
          text-align: center;
          line-height: 18px;
          margin: 1px;
        }
      }

      .checkBox {
        position: absolute;
        top: 15px;
        left: 15px;
      }
    }
  }
}
</style>
