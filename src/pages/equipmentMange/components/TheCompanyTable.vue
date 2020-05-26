<template>
  <div class="wrap thecompanygroup">
    <div class="btn-group">
      <el-button v-for="item in tabBtnArr"
                 :key="item.index"
                 :class="{'default':index!=item.index}"
                 :disabled="!ShowAuthDisabled"
                 @click="switchType(item)"
                 type="primary">{{item.label}}</el-button>
    </div>
    <div class="tablecontent"
         ref="tablecontent">
      <div class="btn-group">
        <el-button v-if="isOneProject"
                   type="primary"
                   :disabled="!OwnAuthDisabled"
                   @click="addEquipMent">搜索设备</el-button>
        <el-button v-if="isOneProject"
                   type="primary"
                   :disabled="!OwnAuthDisabled"
                   @click="manualAdd">手动添加</el-button>
        <el-button type="primary"
                   v-if="isOneProject"
                   :disabled="!OwnAuthDisabled"
                   @click="deletetableData">删除</el-button>
        <el-button v-if="isOneProject"
                   type="primary"
                   :disabled="!OwnAuthDisabled"
                   @click="update">批量升级</el-button>
        <el-button v-if="isOneProject"
                   type="primary"
                   :disabled="!OwnAuthDisabled"
                   @click="sendData">下发数据</el-button>

        <div class="rightgroup">
          <span class="title">设备名称：</span>
          <el-input class="input"
                    :disabled="!ShowAuthDisabled"
                    v-model="devName"></el-input>
          <el-button type="primary"
                     @click="searchBytext"
                     :disabled="!ShowAuthDisabled"
                     icon="el-icon-search"
                     size="small">检索</el-button>
          <el-button type="primary"
                     @click="retrieveVisible=!retrieveVisible"
                     :disabled="!ShowAuthDisabled"
                     size="small">其他条件检索</el-button>

        </div>
        <!-- <retrieve></retrieve> -->
        <input-retrieve :visible="retrieveVisible"
                        @query="retrieve"
                        @updateIpAndType="updateIpAndType"
                        class="retrieve"></input-retrieve>
      </div>

      <el-table ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                v-loading="showloading"
                style="width: 100%;overflow:initial;"
                :style="{'height':tableHeight+'px'}"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         v-if="isOneProject"></el-table-column>
        <el-table-column type="index"
                         label="序号"
                         width="60"></el-table-column>
        <el-table-column prop="devName"
                         label="设备名字">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.devName">
              <div>{{scope.row.devName}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="ip"
                         label="IP地址">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.ip">
              <div>{{scope.row.ip}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="devId"
                         label="设备ID">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.devId">
              <div>{{scope.row.devId}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 修改 设备型号 为 设备类型 -->
        <el-table-column prop="devMode"
                         width="120"
                         show-overflow-tooltip
                         label="设备类型">
          <template slot-scope="scope">
            <!-- <div>{{scope.row.devMode}}</div> -->
            <div>{{$common.getEnumItemName('dev',scope.row.devMode)}}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="index==4"
                         prop="devMode"
                         width="120"
                         show-overflow-tooltip
                         label="设备型号">
          <template slot-scope="scope">
            <div>{{scope.row.productType}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="doorCount"
                         width="80"
                         v-if="index==0"
                         label="门数量"></el-table-column>
        <el-table-column prop="videoCount"
                         width="80"
                         v-else-if="index==1"
                         label="视频通道"></el-table-column>
        <el-table-column prop="alarmCount"
                         width="80"
                         v-else-if="index==2"
                         label="防区数量"></el-table-column>
        <el-table-column prop="netStatus"
                         width="80"
                         label="网络状态">
          <template slot-scope="scope">
            <div style="color:#32C5FF;"
                 v-if="scope.row.netStatus==='online'"
                 class="online">在线</div>
            <div style="color:#FF5F5F;"
                 v-else-if="scope.row.netStatus==='offline'"
                 class="offline">离线</div>
            <div v-else></div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime"
                         label="添加时间">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.createTime">
              <div>{{scope.row.createTime}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="150">
          <template slot-scope="scope">
            <el-button v-if="isOneProject"
                       @click="editEquipment(scope.row)"
                       type="text"
                       :disabled="!OwnAuthDisabled"
                       size="small"> 编辑</el-button>
            <el-button v-else
                       @click="editEquipment(scope.row)"
                       type="text"
                       :disabled="!ShowAuthDisabled"
                       size="small"> 详情</el-button>
            <template v-if="isOneProject">
              <el-button type="text"
                         class="deleteText"
                         :disabled="!OwnAuthDisabled"
                         @click="deleteEquip(scope.row)"
                         size="small">删除</el-button>
              <el-button type="text"
                         v-if="index==1"
                         @click="remoteControl(scope.row)"
                         :disabled="(!!(scope.row.extInfo.fdLib!=1) || !OwnAuthDisabled)"
                         size="small">配置</el-button>
              <el-button type="text"
                         v-if="index!=1"
                         @click="remoteControl(scope.row)"
                         :class="{'offLine':scope.row.netStatus==='offline'}"
                         :disabled="(scope.row.netStatus!=='offline'|| !(scope.row.extInfo.remoteConfig) || !OwnAuthDisabled)"
                         size="small">配置</el-button>

            </template>
          </template>
        </el-table-column>
      </el-table>

      <div class="fenye">
        <el-pagination @current-change="handleCurrentChange"
                       :current-page.sync="pageNow"
                       :page-size="pageSize"
                       background
                       class="pagination"
                       layout="total, prev, pager, next, jumper"
                       :total="dataTotal"></el-pagination>
      </div>

      <remote-control-dialog :visible.sync="remoteControlDialogVisiable"
                             :viewType="viewType"
                             :ShowAuthDisabled="ShowAuthDisabled"
                             :OwnAuthDisabled="OwnAuthDisabled"
                             :bodyTemperature="bodyTemperature"
                             :deviceUuid="deviceUuid"></remote-control-dialog>

      <confirm-dialog :visible.sync="ConfirmDialogVisible"
                      confirmText="是否要下发到设备内"
                      @confirm="confirmxiafa"
                      @close="close"></confirm-dialog>

      <confirm-dialog :visible.sync="deleteConfirmDialogVisible"
                      confirmText="是否删除该设备"
                      @confirm="confirm"
                      @close="close"></confirm-dialog>

      <confirm-dialog :visible.sync="upgradeConfirmDialogVisible"
                      confirmText="是否升级选中的设备"
                      @confirm="confirmUpgrade"
                      @close="close"></confirm-dialog>

      <!-- 设备自动搜索添加弹窗 -->
      <the-company-add-equipment-dialog :visible.sync="addEquipMentDialgoVisible"
                                        :orgUuid="orgUuid"
                                        :deviceType="viewType"
                                        @confirm="addSuccess"></the-company-add-equipment-dialog>
      <!-- 设备更新弹窗 -->
      <the-company-update-dialog :visible.sync="updateDialogVisible"
                                 :data="multipleSelection"></the-company-update-dialog>

      <the-company-upgradingDialog :visible.sync="upgradeVisible"></the-company-upgradingDialog>
      <!-- 下发弹窗 -->
      <the-company-table-xiafa-dialog :visible.sync="TheCompanyTableXiafaDialogVisible"
                                      @confirm="getTableData"></the-company-table-xiafa-dialog>
      <!-- 设备手动添加 -->
      <manual-add-dialog :visible.sync="manualAddVisible"
                         :deviceTypeArr="deviceTypeArr"
                         @commit="addSuccess"
                         :localService="localService"></manual-add-dialog>
      <!-- 视频设备NVR的设置 -->
      <video-set-dialog :visible.sync="videoDialogVisiable"
                        :title="deviceTitle"
                        :deviceUuid="deviceUuid"></video-set-dialog>

    </div>
  </div>
</template>

<script>
import TheCompanyTableXiafaDialog from "@/pages/equipmentMange/components/TheCompanyTableXiafaDialog";
import RemoteControlDialog from "./RemoteControlDialog.vue";
import ConfirmDialog from "@/common/ConfirmDialog";
import TheCompanyAddEquipmentDialog from "./TheCompanyAddEquipmentDialog";
import InputRetrieve from "@/common/InputRetrieve";
import TheCompanyUpdateDialog from "@/pages/equipmentMange/components/TheCompanyUpdateDialog";
import TheCompanyUpgradingDialog from "@/pages/equipmentMange/components/TheCompanyUpgradingDialog";
import ManualAddDialog from "@/pages/equipmentMange/components/ManualAddDialog";
import VideoSetDialog from "@/pages/equipmentMange/components/videoSetDialog";

import * as api from "../ajax.js";
// import { mapState } from "vuex";
export default {
  name: "TheCompanyTable",
  props: {
    ShowAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    OwnAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      projectType: {},
      isOneProject: false, // 是否下级平台
      deviceTitle: "",
      viewType: "door",
      deviceTypeArr: window.config.door_machine,
      door: window.config.door_machine,
      video: window.config.video,
      alarm: window.config.alarm,
      vistor: window.config.vistor,
      upgradeVisible: false,
      tableHeight: 0,
      dataTotal: 0,
      pageSize: 10,
      pageNow: 1,
      retrieveVisible: false,
      devName: "",
      addEquipMentDialgoVisible: false,
      editEquipMentDialgoVisible: false,
      manualAddVisible: false,
      ConfirmDialogVisible: false,
      deleteConfirmDialogVisible: false,
      index: 0,
      remoteControlDialogVisiable: false,
      videoDialogVisiable: false,
      updateDialogVisible: false,
      tableData: [],
      multipleSelection: [],
      TheCompanyTableXiafaDialogVisible: false,
      deviceUuid: "",
      showloading: false,
      upgradeConfirmDialogVisible: false,
      deviceType: "door_machine",
      bodyTemperature: "",
      productType: "",
      tabBtnArr: [
        {
          index: 0,
          type: "door",
          label: "门禁"
        },
        {
          index: 1,
          type: "video",
          label: "视频"
        },
        {
          index: 2,
          type: "alarm",
          label: "报警"
        },
        {
          index: 3,
          type: "visitor",
          label: "访客机"
        },
        {
          index: 4,
          type: "buildingIntercom",
          // type: "door",
          label: "楼寓对讲"
        }
      ],
      deleteOneRow: null, // 用于记录删除单个记录
      localService: [
        {
          belongServiceName: "测试服务名称",
          belongServiceUuid: "iotas_vd_serviceuuid_001"
        }
      ] // 本地服务列表
    };
  },
  components: {
    ManualAddDialog,
    VideoSetDialog,
    RemoteControlDialog,
    ConfirmDialog,
    TheCompanyAddEquipmentDialog,
    InputRetrieve,
    TheCompanyUpdateDialog,
    TheCompanyUpgradingDialog,
    TheCompanyTableXiafaDialog
  },
  computed: {
    orgUuid() {
      return this.$store.state.equipment.orgUuid;
    },
    DeviceOnOffArr() {
      return this.$store.state.equipment.DeviceOnOffArr;
    },
    projectUuid() {
      return this.isOneProject
        ? this.$store.state.home.projectUuid
        : this.$store.state.equipment.projectUuid;
    }
  },
  methods: {
    tableColumnType() {
      return this.isOneProject ? "selection" : "index";
    },
    serviceList(projectUuid) {
      api
        .serviceList(this.viewType, projectUuid)
        .then(res => {
          if (res.data.success) {
            let num = (res.data.data || []).map(item => {
              item.belongServiceName = item.serviceName;
              item.belongServiceUuid = item.serviceUuid;
              return item;
            });
            this.localService = num;
          }
          this.$emit("serverList", this.localService, this.viewType);
        })
        .catch(() => {
          this.$emit("serverList", this.localService, this.viewType);
        });
    },
    DType() {
      this.deviceTypeArr = [];
      api
        .DType(this.viewType)
        .then(res => {
          if (res.data.success) {
            let num = (res.data.data || []).map(item => {
              item.label = item.value;
              item.value = item.key;
              return item;
            });
            this.deviceTypeArr = num;
          }
          this.$emit("switch", this.deviceTypeArr);
        })
        .catch(() => {
          this.$emit("switch", this.deviceTypeArr);
        });
    },
    searchBytext() {
      this.pageNow = 1;
      this.getTableData();
    },
    addSuccess() {
      // 设备添加成功回调
      this.getTableData();
    },
    // 获取当前列表table数据
    getTableData() {
      if (!this.ShowAuthDisabled) {
        return;
      }
      this.showloading = true;
      // 这里传入projectUuid,表示不同的项目
      api
        .getDevList(
          {
            orgUuid: this.orgUuid,
            limit: this.pageSize,
            page: this.pageNow,
            nickName: this.devName,
            deviceIp: this.deviceIp,
            productType: this.productType,
            viewType: this.viewType
            // deviceType: this.deviceType
          },
          this.projectUuid
        )
        .then(res => {
          this.showloading = false;
          let data = res.data.data;
          this.tableData = [];
          if (res.data.success && data.list && data.list.length) {
            let list = data.list;
            for (let i = 0, len = list.length; i < len; i++) {
              // list[i].devName = list[i].nickName;
              // 保持跟下发数据的设备名字一样，所以改成deviceName
              list[i].devName = list[i].nickName;
              list[i].ip = list[i].deviceIp;
              list[i].devId = list[i].deviceSn;
              list[i].productType = list[i].productType;
              list[i].devMode = list[i].deviceType;
              list[i].doorCount = list[i].extInfo.doorCount;
              list[i].videoCount = list[i].extInfo.videoCount;
              list[i].alarmCount = list[i].extInfo.alarmCount;
              list[i].vistorCount = 0;
              list[i].netStatus = list[i].deviceOnlineStatus;
              list[i].createTime = list[i].createTime;
              list[i].projectUuid = this.projectUuid;
            }
            this.tableData = list;
            this.dataTotal = data.total;
          }
        })
        .catch(() => {
          this.showloading = false;
        });
    },
    deletetableData() {
      if (!this.multipleSelection.length) {
        this.$message.error("未选中需要删除的数据！");
      } else {
        this.deleteOneRow = null;
        this.deleteConfirmDialogVisible = true;
      }
    },
    update() {
      if (!this.multipleSelection.length) {
        this.$message.error("未选中需要升级的设备！");
      } else {
        this.upgradeConfirmDialogVisible = true;
      }
    },
    handleCurrentChange(val) {
      this.pageNow = val;
      this.getTableData();
    },
    updateIpAndType(ip, mode) {
      this.deviceIp = ip;
      this.productType = mode;
    },
    retrieve() {
      this.getTableData();
    },
    sendData() {
      if (!this.multipleSelection.length) {
        this.$message.error("未选中需要下发的设备！");
      } else {
        // 判断选中的设备是不是可以下发
        let data = {
          deviceUuids: this.multipleSelection
            .map(val => val.deviceUuid)
            .toString()
        };
        api.judgeTask(data).then(res => {
          let data = res.data.data || [];
          // 用于测试，看是否有设备的时候是否可以取消选中状态！
          // let data = this.multipleSelection.map(val => val.deviceUuid);
          if (res.data.success) {
            let arr = this.multipleSelection;
            arr = arr.filter(val => {
              return !data.some(v => v.name === val);
            });
            if (!data.length) {
              this.ConfirmDialogVisible = true;
            } else {
              arr.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
              });
              this.$message.error("有设备正在处于下发中,已经自动取消!");
            }
          }
        });
      }
    },
    confirmxiafa() {
      let num = this.multipleSelection.map(item => {
        item.deviceName = item.nickName;
        item.ipAddress = item.deviceIp || item.ip;
        return item;
      });
      api.setConfigIssue(num).then(res => {
        if (res.data.success) {
          this.TheCompanyTableXiafaDialogVisible = true;
        }
      });
    },
    confirmUpgrade() {
      this.updateDialogVisible = true;
    },
    // 手动添加
    manualAdd() {
      this.DType(this.viewType);
      this.manualAddVisible = true;
    },
    addEquipMent() {
      if (!this.orgUuid) {
        this.$message.error("请选择设备树的节点！");
        return;
      }
      this.addEquipMentDialgoVisible = true;
    },
    confirm() {
      // 点击table里面的row删除设备
      // 确认删除该设备
      let num = null;
      if (this.deleteOneRow) {
        num = this.deleteOneRow.deviceUuid;
      } else {
        num = this.multipleSelection.reduce((sum, val, i) => {
          return sum + (i === 0 ? "" : ",") + val.deviceUuid;
        }, "");
      }
      api.deleteDevice(num).then(res => {
        if (res.data.success) {
          this.$message.success("删除成功");
        }
        this.getTableData();
      });
    },
    close() {},
    switchType(item) {
      this.viewType = item.type;
      this.serviceList(this.projectUuid);
      this.index = item.index;
      this.getTableData();
      this.$emit("changeViewType", this.viewType);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    editEquipment(row) {
      if (row.extInfo.source === "local") {
        this.$emit("showEdit", row, this.isOneProject);
      } else {
        this.$emit("showEdit", row, this.isOneProject);
      }
      this.serviceList(this.projectUuid);
      this.DType(this.viewType);
    },
    deleteEquip(row) {
      this.deleteOneRow = row;
      let flag = false;
      for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
        if (row.deviceUuid === this.multipleSelection[i].deviceUuid) {
          flag = true;
        }
      }
      if (!flag) {
        this.$refs.multipleTable.toggleRowSelection(row);
      }
      this.deleteConfirmDialogVisible = true;
    },
    remoteControl(row) {
      this.deviceUuid = row.deviceUuid;
      // eslint-disable-next-line
      this[
        this.index === 1 ? "videoDialogVisiable" : "remoteControlDialogVisiable"
      ] = true;
      this.deviceTitle = row.devName;
      this.bodyTemperature = row.extInfo.bodyTemperature
        ? row.extInfo.bodyTemperature.toString()
        : "";
      console.log("row===", row);
    }
  },
  mounted() {
    this.projectType = this.$store.state.home.projectType || {};
    this.isOneProject = Boolean(this.projectType.platformLevel === "levelOne");
    setTimeout(() => {
      let info = this.$refs.tablecontent.getBoundingClientRect();
      this.tableHeight = info.height - 30 - 60 - 40 - 50;
      this.pageSize = ~~(this.tableHeight / 50);
      // 获取是否有权限查看
      this.getTableData();
      this.serviceList();
    }, 0);
  },
  watch: {
    orgUuid(val) {
      this.getTableData();
    },
    DeviceOnOffArr(val) {
      let array = this.tableData;
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (val.deviceUuid === element.deviceUuid) {
          this.$set(this.tableData[index], "netStatus", val.stateValue);
          break;
        }
      }
    }
  }
};
</script>
<style lang='scss'>
@import "@/style/variables.scss";
.thecompanygroup {
  .btn-group {
    input {
      @include input30;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.wrap {
  height: 100%;
  .btn-group {
    position: relative;
    height: 60px;
    $defaultColor: rgb(44, 44, 44);
    .retrieve {
      position: absolute;
      top: 35px;
      right: 0px;
      z-index: 1;
    }
    button {
      padding: 10px 40px;
    }
    .default {
      background: $defaultColor;
      border: 1px solid $defaultColor;
    }
    .rightgroup {
      float: right;
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
    background-color: rgba(33, 35, 37, 1);
    height: calc(100% - 60px);
    padding: $rightContentPadding;
    box-sizing: border-box;
    overflow: hidden;
    .btn-group {
      button {
        height: 30px;
        padding: 6px 15px;
      }
    }
  }
  .fenye {
    margin-top: 40px;
    span {
      @include font-s;
      float: right;
    }
    .pagination {
      float: right;
    }
  }
  .offLine {
    color: #ddd;
  }
}
</style>
