<template>
  <div class='content'>
    <keep-alive>
      <component v-show="!isShowEdit"
                 ref='tabList'
                 @showEdit="showEdit"
                 @updateTree="updateTree"
                 @switch="changeDevTypeArr"
                 @changeViewType='changeViewType'
                 @serverList="serverList"
                 :ShowAuthDisabled="ShowAuthDisabled"
                 :OwnAuthDisabled="OwnAuthDisabled"
                 :viewType="viewType"
                 :is="tabMap[tabName]"></component>
    </keep-alive>
    <component :is='EditDialogMap'
               v-show="isShowEdit"
               :projectUuid="projectUuid"
               :row="row"
               :update="update"
               :isVideo="viewType==='video'"
               :deviceTypeArr="deviceTypeArr"
               :localService="localService"
               :visible="isShowEdit"
               :netStatus="netStatus"
               :viewType="viewType"
               :deviceUuid="deviceUuid"
               @updateEdit="showEdit"
               @showEdit="hiddenEdit"></component>
    <!-- <the-company-edit-equipment-dialog v-show="isShowEdit"
                                       :projectUuid="projectUuid"
                                       :row="row"
                                       :update="update"
                                       :isVideo="viewType==='video'"
                                       :deviceTypeArr="deviceTypeArr"
                                       :localService="localService"
                                       :visible="isShowEdit"
                                       :netStatus="netStatus"
                                       :viewType="viewType"
                                       :deviceUuid="deviceUuid"
                                       @updateEdit="showEdit"
                                       @showEdit="hiddenEdit">
    </the-company-edit-equipment-dialog> -->
  </div>
</template>
<script>
import TheCompanyTable from "../components/TheCompanyTable";
import TheTagTable from "../components/TheTagTable";
import TheCompanyEditEquipmentDialog from "../components/TheCompanyEditEquipmentDialog";
import EditDoorRoomEquipment from "../components/EditDoorRoomEquipment";
import * as api from "../ajax";
import { mapState } from "vuex";
export default {
  name: "wrap",
  props: {
    tabName: {
      type: String,
      default() {
        return "";
      }
    },
    tabMap: {
      type: Object,
      default() {
        return {
          organiza: "TheCompanyTable",
          tag: "TheTagTable"
        };
      }
    },
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
  computed: {
    ...mapState({
      orgUuid: state => {
        return state.equipment.orgUuid;
      },
      projectUuid: state => {
        return state.equipment.projectUuid;
      },
      DeviceOnOffArr: state => {
        return state.equipment.DeviceOnOffArr;
      }
    })
  },
  components: {
    TheTagTable,
    TheCompanyTable,
    TheCompanyEditEquipmentDialog,
    EditDoorRoomEquipment
  },
  data() {
    return {
      deviceTypeArr: [],
      isOneProject: false,
      localService: [],
      isShowEdit: false,
      editEquipMentDialgoVisible: true,
      row: {},
      deviceUuid: "",
      viewType: "door",
      netStatus: "offline",
      EditDialogMap: "TheCompanyEditEquipmentDialog",
      update: 0 // 新建一个int变量，监听他来进行修改数据
    };
  },
  mounted() {},
  methods: {
    changeViewType(viewType) {
      this.viewType = viewType;
    },
    serverList(arr, viewType) {
      this.localService = arr;
      this.viewType = viewType;
    },
    changeDevTypeArr(arr) {
      this.deviceTypeArr = arr;
    },
    updateTree(uuid) {
      this.$emit("updateTree", uuid);
    },
    showEdit(row, isOneProject) {
      this.EditDialogMap =
        row.devMode !== "buildingIntercom"
          ? "TheCompanyEditEquipmentDialog"
          : "EditDoorRoomEquipment";
      this.row = {};
      this.deviceUuid = row.deviceUuid;
      this.isOneProject = isOneProject;
      api.getDeviceDetail(row.deviceUuid, row.projectUuid).then(res => {
        if (res.data.success) {
          this.row = res.data.data;
          this.isShowEdit = true;
          this.update++;
          this.netStatus = row.netStatus;
        }
      });
    },
    hiddenEdit(isSuccess) {
      this.isShowEdit = false;
      if (isSuccess) {
        this.$refs.tabList.getTableData();
      }
    }
  },
  watch: {
    tabName() {
      this.isShowEdit = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/style/variables.scss";

.content {
  width: calc(100% - #{$equLeftMenuWidth});
  height: 100%;
  padding: $rightContentMargin;
  box-sizing: border-box;
}
</style>
