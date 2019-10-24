<template>
  <div class='wrap thecompanygroup'>
    <div class="btn-group">
      <el-button :class="{'default':index!=0}"
                 @click="switchType(0)"
                 type="primary">门禁</el-button>
      <el-button :class="{'default':index!=1}"
                 @click="switchType(1)"
                 type="primary">视频</el-button>
      <el-button :class="{'default':index!=2}"
                 @click="switchType(2)"
                 type="primary">报警</el-button>
      <el-button :class="{'default':index!=3}"
                 @click="switchType(3)"
                 type="primary">访客机</el-button>

    </div>
    <div class="tablecontent"
         ref="tablecontent">
      <div class="btn-group">
        <el-button type="primary"
                   @click='addEquipMent'>搜索设备</el-button>
        <!-- <el-button type="primary"
                   @click='manualAdd'>手动添加</el-button> -->
        <el-button type="primary"
                   @click="deletetableData">删除</el-button>
        <el-button type="primary"
                   @click="update">批量升级</el-button>
        <el-button type="primary"
                   @click='sendData'>下发数据</el-button>

        <div class="rightgroup">
          <span class='title'>设备名称：</span>
          <el-input class='input'
                    v-model='devName'>

          </el-input>

          <el-button type="primary"
                     @click='retrieveVisible=!retrieveVisible'
                     size="small">其他条件检索</el-button>
          <el-button type="primary"
                     @click='searchBytext'
                     icon="el-icon-search"
                     size="small">检索</el-button>
        </div>
        <!-- <retrieve></retrieve> -->
        <input-retrieve :visible='retrieveVisible'
                        @query="retrieve"
                        @updateIpAndType="updateIpAndType"
                        class='retrieve'></input-retrieve>
      </div>

      <el-table ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                v-loading="showloading"
                style="width: 100%;overflow:initial;"
                :style="{'height':tableHeight+'px'}"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column prop="devName"
                         label="设备名字">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.devName">
              <div>
                {{scope.row.devName}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="ip"
                         label="IP">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.ip">
              <div>
                {{scope.row.ip}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="devId"
                         label="设备ID">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.devId">
              <div>
                {{scope.row.devId}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="devMode"
                         width='120'
                         label="设备型号">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.devMode">
              <div>
                {{scope.row.devMode}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="doorCount"
                         width='80'
                         label="门数量">
        </el-table-column>
        <el-table-column prop="netStatus"
                         width='80'
                         label="网络状态">
          <template slot-scope="scope">
            <div style="color:#32C5FF;"
                 v-if="scope.row.netStatus==='online'"
                 class="online">
              在线
            </div>
            <div style="color:#FF5F5F;"
                 v-else-if="scope.row.netStatus==='offline'"
                 class="offline">
              离线
            </div>
            <div v-else>

            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime"
                         label="时间">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.createTime">
              <div>
                {{scope.row.createTime}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="150">
          <template slot-scope="scope">
            <el-button @click="editEquipment(scope.row)"
                       type="text"
                       size="small">编辑</el-button>
            <el-button type="text"
                       class='deleteText'
                       @click='deleteEquip(scope.row)'
                       size="small">删除</el-button>
            <el-button type="text"
                       @click="remoteControl(scope.row)"
                       :class="{'offLine':scope.row.netStatus==='offline'}"
                       :disabled="(scope.row.netStatus==='offline'|| !(scope.row.extInfo.remoteConfig))"
                       size="small">配置</el-button>
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
                       :total="dataTotal">
        </el-pagination>
      </div>

      <remote-control-dialog :visible.sync="remoteControlDialogVisiable"
                             :isVistors="index===3"
                             :deviceUuid="deviceUuid">
      </remote-control-dialog>

      <confirm-dialog :visible.sync="ConfirmDialogVisible"
                      confirmText="是否要下发到设备内"
                      @confirm="confirmxiafa"
                      @close="close">
      </confirm-dialog>

      <confirm-dialog :visible.sync="deleteConfirmDialogVisible"
                      confirmText="是否删除该设备"
                      @confirm="confirm"
                      @close="close">
      </confirm-dialog>

      <confirm-dialog :visible.sync="upgradeConfirmDialogVisible"
                      confirmText="是否升级选中的设备"
                      @confirm="confirmUpgrade"
                      @close="close">
      </confirm-dialog>

      <the-company-add-equipment-dialog :visible.sync="addEquipMentDialgoVisible"
                                        :orgUuid="orgUuid"
                                        :deviceType="viewType"
                                        @confirm="addSuccess">
      </the-company-add-equipment-dialog>

      <the-company-update-dialog :visible.sync="updateDialogVisible"
                                 :data="multipleSelection">

      </the-company-update-dialog>

      <the-company-upgradingDialog :visible.sync="upgradeVisible">

      </the-company-upgradingDialog>

      <the-company-table-xiafa-dialog :visible.sync="TheCompanyTableXiafaDialogVisible"
                                      @confirm="getTableData">

      </the-company-table-xiafa-dialog>

      <manual-add-dialog :visible.sync="manualAddVisible"
                         :deviceTypeArr="deviceTypeArr"
                         @commit="addSuccess"
                         :localService="localService">

      </manual-add-dialog>
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
import * as api from "../ajax.js";
import { mapState } from "vuex";
export default {
  name: "TheCompanyTable",
  data() {
    return {
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
      updateDialogVisible: false,
      tableData: [],
      multipleSelection: [],
      TheCompanyTableXiafaDialogVisible: false,
      deviceUuid: "",
      showloading: false,
      upgradeConfirmDialogVisible: false,
      deviceType: "door_machine",
      productType: "",
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
    RemoteControlDialog,
    ConfirmDialog,
    TheCompanyAddEquipmentDialog,
    InputRetrieve,
    TheCompanyUpdateDialog,
    TheCompanyUpgradingDialog,
    TheCompanyTableXiafaDialog
  },
  computed: {
    ...mapState({
      orgUuid: state => {
        return state.equipment.orgUuid;
      }
    })
  },
  methods: {
    serviceList() {
      this.localService = [];
      // api
      //   .serviceList(this.viewType)
      //   .then(res => {
      //     console.log(res);
      //     if (res.data.success) {
      // this.localService = [
      //   {
      //     belongServiceName: "测试服务名称",
      //     belongServiceUuid: "iotas_vd_serviceuuid_001"
      //   }
      // ].concat(res.data.data || []);
      //     let num = (res.data.data || []).map(item => {
      //       item.belongServiceName = item.serviceName;
      //       item.belongServiceUuid = item.serviceUuid;
      //       return item;
      //     });
      //     this.localService = num;
      //   }
      //   this.$emit("serverList", this.localService, this.viewType);
      // })
      // .catch(() => {
      //   this.$emit("serverList", this.localService, this.viewType);
      // });
    },
    DType() {
      this.deviceTypeArr = [];
      api
        .DType(this.viewType)
        .then(res => {
          console.log(res);
          if (res.data.success) {
            // this.localService = [
            //   {
            //     belongServiceName: "测试服务名称",
            //     belongServiceUuid: "iotas_vd_serviceuuid_001"
            //   }
            // ].concat(res.data.data || []);
            let num = (res.data.data || []).map(item => {
              item.label = item.value;
              item.value = item.key;
              return item;
            });
            this.deviceTypeArr = num;
          }
          // this.$emit("serverList", this.localService);
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
      this.showloading = true;
      api
        .getDevList({
          orgUuid: this.orgUuid,
          limit: this.pageSize,
          page: this.pageNow,
          nickName: this.devName,
          deviceIp: this.deviceIp,
          productType: this.productType,
          viewType: this.viewType
          // deviceType: this.deviceType
        })
        .then(res => {
          this.showloading = false;
          console.log(res);
          let data = res.data.data;
          this.tableData = [];
          if (res.data.success && data.list && data.list.length) {
            //  devName: "192.128.1." + (i + 1),
            // ip: "192.128.1.1",
            // devId: "123456789",
            // devMode: "VB510F",
            // doorCount: 1,
            // netStatus: "online",
            // time: "2018-10-08"
            let list = data.list;
            for (let i = 0, len = list.length; i < len; i++) {
              list[i].devName = list[i].nickName;
              list[i].ip = list[i].deviceIp;
              list[i].devId = list[i].deviceSn;
              list[i].devMode = list[i].productType;
              list[i].doorCount = list[i].doorCount;
              list[i].netStatus = list[i].deviceOnlineStatus;
              list[i].createTime = list[i].createTime;
            }
            this.tableData = list;
            this.dataTotal = data.total;
          }
          console.log(res);
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
        console.log(data);
        api.judgeTask(data).then(res => {
          console.log(res);
          let data = res.data.data || [];
          // 用于测试，看是否有设备的时候是否可以取消选中状态！
          // let data = this.multipleSelection.map(val => val.deviceUuid);
          if (res.data.success) {
            let arr = this.multipleSelection;
            arr = arr.filter(val => {
              return !data.some(v => v.name === val);
            });
            console.log(arr);
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
      // this.upgradeVisible = true;
      // 点击下发确定，获取选中了哪些数据
      // this.multipleSelection
      // console.log(this.multipleSelection);
      // 修改:这边修改所有的数据
      let num = this.multipleSelection.map(item => {
        item.ipAddress = item.deviceIp || item.ip;
        return item;
      });
      console.log(num);
      api.setConfigIssue(num).then(res => {
        console.log(res);
        if (res.data.success) {
          this.TheCompanyTableXiafaDialogVisible = true;
        }
      });
    },
    confirmUpgrade() {
      this.updateDialogVisible = true;
    },
    manualAdd() {
      // this.serviceList(this.viewType);
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

      // let data = { deviceUuid: num };
      api.deleteDevice(num).then(res => {
        if (res.data.success) {
          this.$message.success("删除成功");
        }
        this.getTableData();
      });
    },
    close() {},
    switchType(index) {
      var arr = ["door", "video", "alarm", "visitor"];
      let num = [];
      if (index === 0) {
        num = this.door;
      } else if (index === 1) {
        num = this.video;
      } else if (index === 2) {
        num = this.alarm;
      } else if (index === 3) {
        num = this.vistor;
      }
      this.viewType = arr[index];
      // this.serviceList(this.viewType);
      console.log(num);
      // this.deviceTypeArr = num;
      // this.deviceType = num.reduce((sum, val, index) => {
      //   return sum + (index === 0 ? "" : ",") + val.value;
      // }, "");
      this.index = index;
      this.getTableData();
      // this.deviceUuid = "123";
      // this.remoteControlDialogVisiable = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    editEquipment(row) {
      if (row.extInfo.source === "local") {
        // this.serviceList(this.viewType);
        this.DType(this.viewType);
      }
      // this.editEquipMentDialgoVisible = true;

      this.$emit("showEdit", row.deviceUuid);
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
      // debug
      // let deviceUuid = "494F1F75B788464BB05AE87DAB1E8AF2";
      // this.deviceUuid = deviceUuid;

      this.deviceUuid = row.deviceUuid;
      this.remoteControlDialogVisiable = true;
    }
  },
  mounted() {
    let info = this.$refs.tablecontent.getBoundingClientRect();
    this.tableHeight = info.height - 30 - 60 - 40 - 50;
    this.pageSize = ~~(this.tableHeight / 50);
    // for (let i = 0; i < this.pageSize; i++) {
    //   this.tableData.push({
    //     devName: "192.128.1." + (i + 1),
    //     ip: "192.128.1.1",
    //     devId: "123456789",
    //     devMode: "VB510F",
    //     doorCount: 1,
    //     netStatus: "online",
    //     time: "2018-10-08"
    //   });
    // }
    this.getTableData();
    // this.serviceList(this.viewType);
  },
  watch: {
    orgUuid(val) {
      // alert(val);
      this.getTableData();
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
