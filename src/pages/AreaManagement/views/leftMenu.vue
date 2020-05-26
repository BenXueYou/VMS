<template>
  <div class="areaLeftMenu">
    <the-leftmenu ref="leftMenu"
                  :ShowAuthDisabled="ShowAuthDisabled"
                  :OwnAuthDisabled="OwnAuthDisabled"
                  :isTabs="true"
                  @clickNode="clickNodeAll"
                  @updateRight="handleUpdateRight"
                  orgType="areaOrg"></the-leftmenu>
  </div>
</template>

<script>
import TheLeftmenu from "@/pages/AreaManagement/views/leftWrap";
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
    updateTree() {
      this.$refs.leftMenu.getOrgTree();
    },
    clickNodeAll(data) {
      console.log(data);
      // if (data.type === "areaOrg" || data.type === "project") {
      this.$bus.$emit("clickMenuNode", data);
      // }
    },
    handleUpdateRight() {
      this.$emit("updatePright");
    }
  }
};
</script>
<style>
.custom-tree-node {
  width: 100%;
}
.areaLeftMenu .is-leaf {
  display: none !important;
}
</style>

<style lang="scss" scoped>
.areaLeftMenu {
  padding: 15px;
  box-sizing: border-box;
  background-color: rgba(37, 41, 45, 0.8);
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
