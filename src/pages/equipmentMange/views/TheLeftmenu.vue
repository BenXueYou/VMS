<template>
  <div class="equipmentLeftMenu">
    <the-leftmenu ref="leftMenu"
                  :ShowAuthDisabled='ShowAuthDisabled'
                  :OwnAuthDisabled='OwnAuthDisabled'
                  :isOnlyArea="false"
                  :isTabs="true"
                  placeholder="搜索设备/标签/名称"
                  @clickNode="clickNodeAll"
                  @addData="addData"
                  orgType="areaOrg"></the-leftmenu>
  </div>
</template>

<script>
import TheLeftmenu from "@/pages/AreaManagement/views/leftWrap";
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  name: "AreaManagement",
  props: {
    ShowAuthDisabled: {
      type: Boolean,
      default() {
        return true;
      }
    },
    OwnAuthDisabled: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      devprops: {
        label: "label",
        children: "zones",
        isLeaf: "leaf"
      },
      defaultExpKeys: [],
      searchText: "",
      parentOrgUuid: "",
      needType: "",
      orgType: "staff"
    };
  },
  components: {
    TheLeftmenu
  },
  methods: {
    addData(data, callback) {
      // 展开项目节点
      console.log(data);
      // let peojectuuid = data.childProjectUuid;
      let params = {
        parentOrgUuid: data.type === "project" ? "" : data.id,
        needType: "",
        orgType: "device"
      };
      let projectUuid = data.type === "project" ? data.id : data.projectUuid;
      api.getOrgByProjectUuid(params, projectUuid).then(res => {
        let result = res.data.data || [];
        for (let i = 0; i < result.length; i++) {
          result[i].projectUuid = projectUuid;
        }
        this.clickNodeAll(result[0]);
        callback(result);
      });
    },
    clickNodeAll(data, node) {
      console.log(data, node);
      if (!data || data.type === "areaOrg" || data.type === "project") {
        return;
      }
      this.$emit("clickNode", data, node);
      this.$store.commit("setOrgUuid", data.orgUuid || data.id);
      this.$store.commit("setProjectUuid", data.projectUuid);
    }
  }
};
</script>
<style>
.custom-tree-node {
  width: 100%;
}
.equipmentLeftMenu .is-leaf {
  display: none !important;
}
.equipmentLeftMenu .leftmenu .mypenl{
  padding-bottom: 30px!important;
}
</style>

<style lang="scss" scoped>
.equipmentLeftMenu {
  padding: 15px;
  width: 280px;
  box-sizing: border-box;
  height: 100%;
  .oneRoad {
    display: flex;
    width: 100%;
    justify-content: space-between;
    .operatorIcon {
      display: none;
    }
    &:hover .operatorIcon {
      display: block;
    }
  }
}
</style>
