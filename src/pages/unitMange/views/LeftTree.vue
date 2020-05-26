<template>
  <div class="UnitLeftMenu">
    <the-leftmenu ref="leftMenu"
                  :ShowAuthDisabled='ShowAuthDisabled'
                  :OwnAuthDisabled='OwnAuthDisabled'
                  :isOnlyArea="isOnlyArea"
                  @clickNode="clickNodeAll"
                  @addData="addData"
                  :isTabs="true"
                  orgType="areaOrg"></the-leftmenu>
  </div>
</template>

<script>
import TheLeftmenu from "@/pages/AreaManagement/views/leftWrap";
// import * as api from "@/pages/equipmentMange/ajax.js";
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
      isOnlyArea: false,
      devprops: {
        label: "label",
        children: "zones",
        isLeaf: "leaf"
      },
      defaultExpKeys: [],
      searchText: "",
      parentOrgUuid: "",
      needType: "",
      orgType: "staff",
      lastLevelType: ""
    };
  },
  components: {
    TheLeftmenu
  },
  methods: {
    getAreaStruct(projectUuid) {
      return new Promise(resolve => {
        this.$houseHttp
          .getAreaStructByProjectUuid(projectUuid, {})
          .then(res => {
            let body = res.data || {};
            let data = [];
            if (body.data && body.data.id) {
              data = [
                {
                  id: body.data.id,
                  label: body.data.label,
                  projectUuid: projectUuid,
                  type: body.data.type,
                  children: [],
                  nextCount: 1
                }
              ];
              let extInfo = body.data.extInfo;
              console.log(extInfo);
              if (extInfo && extInfo.length) {
                this.lastLevelType = extInfo[extInfo.length - 1].type;
              }
            }
            resolve(data);
          });
      });
    },
    getInfrastructure(projectUuid, parentUuid) {
      return new Promise(resolve => {
        this.$houseHttp
          .getInfrastructureByProjectUuid(projectUuid, {
            parentUuid
          })
          .then(res => {
            if (!res.data.data) {
              resolve([]);
            } else {
              let data = (res.data.data || []).map(item => {
                // 记录projectUuid
                item.projectUuid = projectUuid;
                if (item.nextCount !== 0 && item.type === this.lastLevelType) {
                  this.$set(item, "leaf", true);
                  this.$set(item, "children", false);
                  this.$set(item, "nextCount", 0);
                }
                return item;
              });
              resolve(data);
            }
          });
      });
    },
    async addData(data, callback) {
      console.log(data);
      if (data.type === "project") {
        // 传入project-id获取对应的
        let rootArr = await this.getAreaStruct(data.id);
        if (rootArr && !rootArr.length) {
          callback(rootArr);
          return;
        }
        data.id = rootArr[0].id;
        data.projectUuid = rootArr[0].projectUuid;
        this.$emit("setTreeRootData", rootArr[0]);
      }
      let newArr = await this.getInfrastructure(data.projectUuid, data.id);
      callback(newArr);
    },
    clickNodeAll(data, node) {
      // 点击组织和区域树的时候不用管
      if (data.type !== "areaOrg" && data.type !== "project") {
        this.$emit("setTreeRootData", data);
      }
    }
  }
};
</script>
<style>
.custom-tree-node {
  width: 100%;
}
.UnitLeftMenu .is-leaf {
  display: none !important;
}
.UnitLeftMenu .leftmenu .tabs {
  height: calc(100% - 80px) !important;
}
</style>

<style lang="scss" scoped>
.UnitLeftMenu {
  padding: 15px;
  width: 320px !important;
  background-color: rgba(37, 41, 45, 0.8);
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
