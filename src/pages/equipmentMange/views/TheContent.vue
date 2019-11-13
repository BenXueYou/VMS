<template>
  <div class='content'>
    <keep-alive>
      <component v-show="!isShowEdit"
                 ref='tabList'
                 @showEdit="showEdit"
                 @updateTree="updateTree"
                 @switch="changeDevTypeArr"
                 @serverList="serverList"
                 :is="tabMap[tabName]"></component>
    </keep-alive>
    <the-company-edit-equipment-dialog v-show="isShowEdit"
                                       :row="row"
                                       :update="update"
                                       :isVideo="viewType==='video'"
                                       :deviceTypeArr="deviceTypeArr"
                                       :localService="localService"
                                       :visible="isShowEdit"
                                       :deviceUuid="deviceUuid"
                                       @updateEdit="showEdit"
                                       @showEdit="hiddenEdit">
    </the-company-edit-equipment-dialog>
  </div>
</template>
<script>
import TheCompanyTable from "../components/TheCompanyTable";
import TheTagTable from "../components/TheTagTable";
import TheCompanyEditEquipmentDialog from "../components/TheCompanyEditEquipmentDialog";
import * as api from "../ajax";
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
    }
  },
  components: { TheTagTable, TheCompanyTable, TheCompanyEditEquipmentDialog },
  data() {
    return {
      deviceTypeArr: window.config.door_machine,
      localService: [],
      isShowEdit: false,
      editEquipMentDialgoVisible: true,
      row: {},
      deviceUuid: "",
      viewType: "door",
      netStatus: "offline",
      update: 0 // 新建一个int变量，监听他来进行修改数据
    };
  },
  methods: {
    serverList(arr) {
      this.localService = arr;
    },
    changeDevTypeArr(arr) {
      this.deviceTypeArr = arr;
    },
    updateTree(uuid) {
      this.$emit("updateTree", uuid);
    },
    showEdit(deviceUuid, netStatus) {
      this.row = {};
      this.deviceUuid = deviceUuid;
      api.getDeviceDetail(deviceUuid).then(res => {
        if (res.data.success) {
          this.row = res.data.data;
          this.isShowEdit = true;
          this.update++;
          this.netStatus = netStatus;
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
