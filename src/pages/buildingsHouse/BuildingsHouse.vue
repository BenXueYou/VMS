<template>
  <div style="height: 100%;">
    <init-building :isShow="isShowInitDialog"
                   @onCancel="onCancelInitDialog"
                   @onConfirm="onClickConfirm" />
    <all-type-add :isShow="isShowAllTypeAddDialog"
                  @onCancel="onCancelAllTypeAddDialog"
                  @onConfirm="onConfirmAllTypeAddDialog"
                  ref="allTypeAdd" />
    <add-or-edit-house :isShow="isShowEditOrAddDialog"
                       :isAdd="isAdd"
                       ref="addOrEditHouse"
                       :initTreeRootData="initTreeRootData"
                       @onCancel="onCancelEditOrAddDialog"
                       @onConfirm="onConfirmEditOrAddDialog" />
    <!-- 批量导入 -->
    <patch-import :isShow.sync="isShowPatchImportDialog"
                  @onCancel="onCancelPatchImportDialog"
                  @onImport="onConfirmPatchImportDialog" />
    <!-- 批量导出 -->
    <patch-export :isShow.sync="isShowPatchExportDialog"
                  @onCancel="onCancelPatchExportDialog"
                  @onImport="onConfirmPatchExportDialog" />

    <add-or-edit-build ref="addOrEditBuild"
                       :isShow="isShowAddOrEditBuild"
                       :isAdd="isAddBuild"
                       @onCancel="onCancelEditOrAddBuildDialog"
                       @onConfirm="onConfirmEditOrAddBuildDialog" />
    <div v-if="isShowMain"
         class="build-main">
      <left-tree @onClickAllTypeAdd="onClickAllTypeAdd"
                 @add="add"
                 @setInitArea="setInitArea"
                 ref="leftTree"
                 @setTreeRootData="setTreeRootData"
                 style="height: 100%;"
                 @edit="edit" />
      <house-table v-show="isShowHouseTable"
                   @addHouse="addHouse"
                   @editHouse="editHouse"
                   @batchImport="batchImport"
                   @batchExport="batchExport"
                   ref="houseTable" />
      <add-or-edit-unit v-show="!isShowHouseTable"
                        ref="addOrEditUnit"
                        style="height: 100%;"
                        @onConfirm="onConfirmEditOrAddUnit"
                        @onCancel="onCancelEditOrAddUnit" />
    </div>
  </div>
</template>

<script>
import { constantRouterMap } from "@/router";
import InitBuilding from "@/pages/buildingsHouse/components/InitBuildingDialog";
import AllTypeAdd from "@/pages/buildingsHouse/components/AllTypeAddDialog";
import AddOrEditHouse from "@/pages/buildingsHouse/components/AddOrEditHouseDialog";
import PatchImport from "@/pages/buildingsHouse/components/PatchImportDialog";
import PatchExport from "@/pages/buildingsHouse/components/PatchExportDialog";
import LeftTree from "@/pages/buildingsHouse/views/LeftTree";
import HouseTable from "@/pages/buildingsHouse/views/HouseTable";
import AddOrEditBuild from "@/pages/buildingsHouse/components/AddOrEditBuildDialog";
import AddOrEditUnit from "@/pages/buildingsHouse/components/AddOrEditUnitDialog";

export default {
  components: {
    InitBuilding,
    LeftTree,
    HouseTable,
    AllTypeAdd,
    AddOrEditHouse,
    PatchImport,
    PatchExport,
    AddOrEditBuild,
    AddOrEditUnit
  },
  props: {},
  data() {
    return {
      isShowInitDialog: false,
      isShowMain: true,
      isShowAllTypeAddDialog: false,
      isShowEditOrAddDialog: false,
      isShowPatchImportDialog: false,
      isShowPatchExportDialog: false,
      isAdd: true,
      isShowAddOrEditBuild: false,
      isAddBuild: true,
      isShowHouseTable: true,
      isHaveFloor: true,
      initTreeRootData: null,
      lastLevelType: "",
      specialType: "",
      isInitArea: false
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  activated() {
    if (!this.isInitArea) {
      this.initData();
    }
  },
  methods: {
    initData() {
      this.getAreaStruct();
    },
    getAreaStruct() {
      this.$houseHttp.getAreaStruct({}).then(res => {
        let body = res.data;
        this.getAreaStructSuccessResponse(body);
      });
    },
    getAreaStructSuccessResponse(body) {
      if (!body.data || body.data === 0) {
        this.isInitArea = false;
        this.isShowInitDialog = true;
        this.isShowMain = false;
      } else {
        this.isInitArea = true;
        this.isShowInitDialog = false;
        this.isShowMain = true;
        setTimeout(() => {
          this.judgeIsHaveFloor(body.data);
          this.isBuildIngOrUnit(body.data);
          this.setLastLevelType(body.data.extInfo);
          this.$refs.leftTree.initAreaData = body.data;
          this.$refs.allTypeAdd.initAreaData = body.data;
        }, 300);
      }
    },
    setLastLevelType(data) {
      if (!data) {
        return;
      }
      for (let index in data) {
        if (parseInt(index) === data.length - 1) {
          this.lastLevelType = data[index].type;
          this.$refs.addOrEditHouse.lastLevelType = this.lastLevelType;
          this.$refs.houseTable.lastLevelType = this.lastLevelType;
          this.$refs.allTypeAdd.lastLevelType = this.lastLevelType;
          this.$refs.houseTable.lastLevelType = this.lastLevelType;
        }
      }
    },
    judgeIsHaveFloor(data) {
      if (!data || !data.extInfo) {
        return;
      }
      if (data.extInfo.some(v => v.type === "floor")) {
        this.isHaveFloor = true;
      } else {
        this.isHaveFloor = false;
      }
      this.$refs.houseTable.isHaveFloor = this.isHaveFloor;
    },
    isBuildIngOrUnit(data) {
      if (!data || !data.extInfo) {
        return;
      }
      if (data.extInfo.some(v => v.type === "unit")) {
        this.specialType = "unit";
      } else {
        this.specialType = "building";
      }
    },
    setTreeRootData(data) {
      console.log("233333333333333333333333333399999999");
      this.initTreeRootData = data;
      this.$refs.houseTable.rootInfrastructureUuid = data.id;
      this.$refs.houseTable.initTreeRootData = data;
    },
    onCancelInitDialog() {
      this.isInitArea = false;
      this.isShowInitDialog = false;
      for (let item of constantRouterMap[0].children) {
        if (item.name === "BuildingsHouse") {
          this.$store.dispatch("delTagViewItem", item);
        }
      }
      this.$store.dispatch("setLocalTag", "Home");
      this.$bus.$emit("setLocalTag", "Home");
      this.$router.push({ name: "Home" });
    },
    onClickConfirm() {
      this.isInitArea = true;
      this.getAreaStruct();
    },
    setInitArea() {
      this.isInitArea = false;
      this.getAreaStruct();
    },
    onClickAllTypeAdd() {
      this.isShowAllTypeAddDialog = true;
    },
    onCancelAllTypeAddDialog() {
      this.isShowAllTypeAddDialog = false;
    },
    onConfirmAllTypeAddDialog() {
      this.isShowAllTypeAddDialog = false;
      this.$refs.leftTree.refreshNode("init");
    },
    onCancelEditOrAddDialog() {
      this.isShowEditOrAddDialog = false;
    },
    onConfirmEditOrAddDialog() {
      this.isShowEditOrAddDialog = false;
      this.$refs.houseTable.getHouseList();
    },
    addHouse() {
      this.isAdd = true;
      this.isShowEditOrAddDialog = true;
    },
    editHouse(row) {
      this.isAdd = false;
      this.isShowEditOrAddDialog = true;
      let copyRow = {};
      copyRow = this.$common.copyObject(row, copyRow);
      this.$set(
        this.$refs.addOrEditHouse.formLabelAlign,
        "infrastructureUuid",
        copyRow.infrastructureUuid
      );
      this.$set(
        this.$refs.addOrEditHouse.formLabelAlign,
        "roomsName",
        copyRow.infrastructureName
      );
      this.$set(
        this.$refs.addOrEditHouse.formLabelAlign,
        "nodeText",
        copyRow.address
      );
      this.$set(
        this.$refs.addOrEditHouse.formLabelAlign,
        "roomsType",
        copyRow.roomType
      );
      this.$set(
        this.$refs.addOrEditHouse.formLabelAlign,
        "roomsUse",
        copyRow.roomUse
      );
      this.$set(
        this.$refs.addOrEditHouse.formLabelAlign,
        "acreage",
        copyRow.acreage
      );
      this.$set(
        this.$refs.addOrEditHouse.formLabelAlign,
        "remarks",
        copyRow.remarks
      );
      this.$set(
        this.$refs.addOrEditHouse.formLabelAlign,
        "rootInfrastructureUuid",
        copyRow.parentUuid
      );
      this.$set(
        this.$refs.addOrEditHouse.formLabelAlign,
        "version",
        copyRow.version
      );
    },
    batchImport() {
      this.isShowPatchImportDialog = true;
    },
    onConfirmPatchImportDialog() {
      this.isShowPatchImportDialog = false;
    },
    onCancelPatchImportDialog() {
      this.isShowPatchImportDialog = false;
    },
    batchExport() {
      this.isShowPatchExportDialog = true;
    },
    onConfirmPatchExportDialog() {
      this.isShowPatchExportDialog = false;
    },
    onCancelPatchExportDialog() {
      this.isShowPatchExportDialog = false;
    },
    add(params) {
      this.isAddBuild = true;
      if (params.subType === this.specialType) {
        this.isShowHouseTable = false;
        setTimeout(() => {
          this.$refs.addOrEditUnit.specialType = this.specialType;
          this.$refs.addOrEditUnit.isHaveFloor = this.isHaveFloor;
          this.$refs.addOrEditUnit.params = params;
        }, 200);
      } else {
        this.isShowAddOrEditBuild = true;
        this.$refs.addOrEditBuild.params = params;
      }
    },
    edit(params) {
      this.isAddBuild = false;
      this.isShowAddOrEditBuild = true;
      this.$refs.addOrEditBuild.params = params;
    },
    onCancelEditOrAddBuildDialog() {
      this.isShowAddOrEditBuild = false;
    },
    onConfirmEditOrAddBuildDialog(val) {
      this.isShowAddOrEditBuild = false;
      if (val === "add") {
        this.$refs.leftTree.refreshNode();
      } else if (val === "edit") {
        this.$refs.leftTree.refreshParentNode();
      } else if (val === "rootEdit") {
        this.getAreaStruct();
      }
    },
    onConfirmEditOrAddUnit() {
      this.isShowHouseTable = true;
      setTimeout(() => {
        this.$refs.leftTree.refreshNode();
      }, 200);
    },
    onCancelEditOrAddUnit() {
      this.isShowHouseTable = true;
    }
  },
  watch: {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.build-main {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
