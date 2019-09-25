<template>
  <el-container class="LinkageAction">
    <el-header>
      <el-row ref="headerRef"
              type="flex"
              justify="space-between">
        <el-col :span="20">
          <img class="img"
               src="../../../../assets/images/doorAccess/linkage_action_icon.png"
               alt>联动动作
        </el-col>
        <el-col :span="4"
                class="header-buttton-box">
          <el-button type="primary"
                     @click="addLinkageAct">
            <img class="img"
                 src="../../../../assets/images/doorAccess/add_btn_icon.png"
                 alt> 新增
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="bodyBox">
      <el-table :data="tableData"
                style="width: 100%"
                height="100%"
                v-loading="isLoading">
        <el-table-column type="index"
                         :index="tableIndex"
                         label="序号"
                         width="80"></el-table-column>
        <el-table-column prop="planName"
                         label="预案名称"
                         width="180"></el-table-column>
        <el-table-column prop="deviceName"
                         label="设备"
                         width="200"></el-table-column>
        <el-table-column prop="triggerCondition"
                         label="触发条件"
                         width="200">
          <template slot-scope="scope">
            <span>{{$common.getEnumItemName("door_plan_t", scope.row.triggerCondition)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="triggerPosName"
                         label="触发位置"
                         width="200"></el-table-column>
        <!-- <el-table-column prop="linkageType"
                         label="联动类型"
                         width="200">
          <template slot-scope="scope">
            <span>{{$common.getEnumItemName("linkage", scope.row.linkageType)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="linkagePosName"
                         label="联动位置"
                         width="200"></el-table-column>
        <el-table-column prop="linkageOp"
                         label="动作类型"
                         width="200">
          <template slot-scope="scope">
            <span>{{$common.getEnumItemName("door_plan_d", scope.row.linkageOp)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width>
          <template slot-scope="scope">
            <el-button type="text"
                       size="small"
                       @click.stop="editButtonAct(scope.row)">编辑</el-button>
            <el-button type="text"
                       size="small"
                       class="delete-button"
                       @click.stop="deleteDialog(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- --------------------------    弹窗   ------------------------------------- -->
    <linkage-action-dialog :isShow="isShow"
                           @onCancel="onCancelDialog"
                           @onConfirm="onConfirmDialog"
                           ref="linkActionDialog"
                           :isAdd="isAdd"></linkage-action-dialog>
  </el-container>
</template>
<script>
import linkageActionDialog from "../../components/doorAccessSetting/LinkageActDialog.vue";
export default {
  components: { linkageActionDialog },
  props: {},
  data() {
    return {
      isShow: false,
      tableData: [],
      isLoading: false,
      isAdd: true,
    };
  },
  created() {},
  mounted() {
    // this.getLinkageAct();
  },
  activated() {
    this.getLinkageAct();
  },
  methods: {
    getLinkageAct() {
      this.tableData = [];
      this.isLoading = true;
      this.$DoorSetAjax
        .getLinkageAct({
          limit: 9999,
          page: 1
        })
        .then(res => {
          let body = res.data;
          this.getLinkageActSuccessResponse(body);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getLinkageActSuccessResponse(body) {
      this.tableData = body.data.list;
    },
    deleteDialog(row) {
      this.$confirm(
        `<span style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;">是否确认删除？</span>`,
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
        .then(() => {})
        .catch((action) => {
          if (action === "cancel") {
            this.$DoorSetAjax
              .deleteLinkageActApi(row.planUuid)
              .then(res => {
                let body = res.data;
                this.$cToast.success(body.msg);
                this.getLinkageAct();
              });
          }
        });
    },
    editButtonAct(row) {
      this.isAdd = false;
      this.$DoorSetAjax
        .getLinkageActDetailApi(row.planUuid)
        .then(res => {
          let body = res.data;
          this.getLinkageActDetailSuccessResponse(body);
        });
    },
    getLinkageActDetailSuccessResponse(body) {
      this.getDeviceDoorVO(body.data.deviceUuid);
      this.$refs.linkActionDialog.formLabelAlign = body.data;
      this.isShow = !this.isShow;
    },
    getDeviceDoorVO(deviceUuid) {
      if (!deviceUuid) {
        return;
      }
      this.$DoorSetAjax
        .getDeviceDoorVO(deviceUuid)
        .then(res => {
          let body = res.data;
          this.getDeviceDoorVOSuccessResponse(body);
        });
    },
    getDeviceDoorVOSuccessResponse(body) {
      this.$refs.linkActionDialog.linkagePosOptions = [];
      this.$refs.linkActionDialog.triggerPosOptions = [];
      if (body && body.data) {
        for (let item of body.data.linkagePosList) {
          this.$refs.linkActionDialog.linkagePosOptions.push({
            typeName: item.label,
            typeStr: item.id,
            type: item.type
          });
        }
        for (let item of body.data.triggerPosList) {
          this.$refs.linkActionDialog.triggerPosOptions.push({
            typeName: item.label,
            typeStr: item.id,
            type: item.type
          });
        }
      }
    },
    addLinkageAct() {
      this.isAdd = true;
      this.isShow = !this.isShow;
    },
    onCancelDialog() {
      this.isShow = !this.isShow;
    },
    onConfirmDialog() {
      this.isShow = !this.isShow;
      this.getLinkageAct();
    },
    tableIndex(val) {
      val += 1;
      return val < 10 ? "0" + val : val;
    }
  },
  watch: {},
  destroyed() {},
  computed: {
    key() {
      return this.$route.fullPath;
    }
  }
};
</script>
<style lang="scss" scoped>
.LinkageAction {
  height: 100%;
  background: rgba(35, 38, 41, 0.8);
  padding: 15px 40px 0px;
  .el-header {
    line-height: 60px;
  }
  .header-buttton-box {
    text-align: right;
  }
  .bodyBox {
    padding-top: 15px;
  }
  .delete-button {
    color: #ff5f5f;
  }
}
</style>
