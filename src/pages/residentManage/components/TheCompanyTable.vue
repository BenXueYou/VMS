<template>
  <div class="wrap thecompanygroup">
    <div class="btn-group">
      <el-button :class="{'default':index!=0}" @click="switchType(0)" type="primary">门禁</el-button>
      <el-button :class="{'default':index!=1}" @click="switchType(1)" type="primary">视频</el-button>
      <el-button :class="{'default':index!=2}" @click="switchType(2)" type="primary">报警</el-button>
    </div>
    <div class="tablecontent">
      <div class="btn-group">
        <el-button type="primary" @click="addEquipMent">新增用户</el-button>
        <el-button type="primary">删除</el-button>
        <el-button type="primary">批量导入</el-button>
        <el-button type="primary">批量导出</el-button>
        <el-button type="primary">从设备内获取居民信息</el-button>
        <el-button type="primary" @click="sendData">统计</el-button>

        <div class="rightgroup">
          <span class="title">姓名：</span>
          <el-input class="input" v-model="devName"></el-input>
          <el-button type="primary" icon="el-icon-search" size="small">检索</el-button>
          <el-button type="primary" @click="retrieveVisible=!retrieveVisible" size="small">其他条件检索</el-button>
          <el-button type="primary" @click="switchView" size="small">切换视图</el-button>
        </div>
        <input-retrieve :visible="retrieveVisible" @query="retrieve" class="retrieve"></input-retrieve>
      </div>

      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="devName" label="设备名字"></el-table-column>
        <el-table-column prop="ip" label="IP"></el-table-column>
        <el-table-column prop="devId" label="设备ID"></el-table-column>
        <el-table-column prop="devMode" width="120" label="设备型号"></el-table-column>
        <el-table-column prop="doorCount" width="80" label="门数量"></el-table-column>
        <el-table-column prop="netStatus" width="80" label="网络状态"></el-table-column>
        <el-table-column prop="time" label="时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editEquipment(scope.row)" type="text" size="small">编辑</el-button>
            <el-button
              type="text"
              class="deleteText"
              @click="deleteEquip(scope.row)"
              size="small"
            >删除</el-button>
            <el-button type="text" @click="remoteControl(scope.row)" size="small">配置</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div></div>

      <remote-control-dialog :visible.sync="remoteControlDialogVisiable"></remote-control-dialog>

      <confirm-dialog
        :visible.sync="ConfirmDialogVisible"
        confirmText="是否要下发到设备内"
        @confirm="confirm"
        @close="close"
      ></confirm-dialog>

      <confirm-dialog
        :visible.sync="deleteConfirmDialogVisible"
        confirmText="是否删除该设备"
        @confirm="confirm"
        @close="close"
      ></confirm-dialog>

      <the-company-add-equipment-dialog :visible.sync="addEquipMentDialgoVisible"></the-company-add-equipment-dialog>

      <the-company-edit-equipment-dialog :visible.sync="editEquipMentDialgoVisible"></the-company-edit-equipment-dialog>
    </div>
  </div>
</template>
<script>
import RemoteControlDialog from "./RemoteControlDialog.vue";
import ConfirmDialog from "@/common/ConfirmDialog";
import TheCompanyAddEquipmentDialog from "./TheCompanyAddEquipmentDialog";
import TheCompanyEditEquipmentDialog from "./TheCompanyEditEquipmentDialog";
import InputRetrieve from "@/common/InputRetrieve";

export default {
  name: "TheCompanyTable",
  data() {
    return {
      retrieveVisible: false,
      devName: "",
      addEquipMentDialgoVisible: false,
      editEquipMentDialgoVisible: false,
      ConfirmDialogVisible: false,
      deleteConfirmDialogVisible: false,
      index: 0,
      remoteControlDialogVisiable: false,
      tableData: new Array(10).fill({
        devName: "192.128.1.1",
        ip: "192.128.1.1",
        devId: "123456789",
        devMode: "VB510F",
        doorCount: 1,
        netStatus: "online",
        time: "2018-10-08"
      }),
      multipleSelection: []
    };
  },
  components: {
    RemoteControlDialog,
    ConfirmDialog,
    TheCompanyAddEquipmentDialog,
    TheCompanyEditEquipmentDialog,
    InputRetrieve
  },
  methods: {
    switchView() {
      // 切换视图
    },
    retrieve(ip, mode) {
      console.log(ip, mode);
    },
    sendData() {
      this.ConfirmDialogVisible = true;
    },
    addEquipMent() {
      this.addEquipMentDialgoVisible = true;
    },
    confirm() {},
    close() {},
    switchType(index) {
      this.index = index;
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    editEquipment(row) {
      this.editEquipMentDialgoVisible = true;
    },
    deleteEquip() {
      this.deleteConfirmDialogVisible = true;
    },
    remoteControl(row) {
      this.remoteControlDialogVisiable = true;
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
    background-color: rgb(37, 41, 45);
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
}
</style>
