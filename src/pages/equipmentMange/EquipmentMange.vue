<template>
  <div class='equipment'>
    <!-- <the-leftmenu :orgType="orgType"
                  :needType="needType"
                  :tagType="tagType"
                  @changetab="changetab"
                  :ShowAuthDisabled="ShowAuthDisabled"
                  :OwnAuthDisabled="OwnAuthDisabled"
                  ref='testTree'
                  @clickNode="clickNode">
    </the-leftmenu> -->
    <component :orgType="orgType"
               :needType="needType"
               :tagType="tagType"
               @changetab="changetab"
               :ShowAuthDisabled="ShowAuthDisabled"
               :OwnAuthDisabled="OwnAuthDisabled"
               ref='testTree'
               @clickNode="clickNode"
               :is="!isOneProject?'TheLeftmenu':'OneLevelLeftTree'"></component>
    <the-wrap :tabName="tabName"
              :ShowAuthDisabled="ShowAuthDisabled"
              :OwnAuthDisabled="OwnAuthDisabled"
              @updateTree="updateTree">
    </the-wrap>
  </div>
</template>

<script>
import TheLeftmenu from "./views/TheLeftmenu";
import OneLevelLeftTree from "./views/OneLevelLeftTree";
import TheWrap from "./views/TheContent";
import { mapState } from "vuex";
export default {
  components: {
    TheLeftmenu,
    OneLevelLeftTree,
    TheWrap
  },
  props: {},
  data() {
    return {
      data: "",
      tabName: "organiza",
      orgType: window.config.orgType,
      needType: "",
      tagType: window.config.tagType,
      isOneProject: false,
      ShowAuthDisabled: false,
      OwnAuthDisabled: false
    };
  },
  created() {},
  computed: {
    ...mapState({
      count: state => {
        return state.equipment.count;
      }
    })
  },
  activated() {},
  mounted() {
    let projectType = this.$store.state.home.projectType || {};
    this.isOneProject = Boolean(projectType.platformLevel === "levelOne");
    if (this.isOneProject) {
      this.ShowAuthDisabled = this.$common.getAuthIsOwn("设备管理", "isShow");
      this.OwnAuthDisabled = this.$common.getAuthIsOwn("设备管理", "isOwn");
    } else {
      this.ShowAuthDisabled = this.$common.getAuthIsOwn("设备资源", "isShow");
      this.OwnAuthDisabled = this.$common.getAuthIsOwn("设备资源", "isOwn");
    }
  },
  methods: {
    updateTree(tagUuid) {
      this.$refs.testTree.getOrgTag(true, tagUuid);
    },
    clickNode(data, node) {
      console.log(this.$refs);
      // this.$refs.theWrap.getTableData();
    },
    changetab(tab) {
      // 左边菜单的切换tab事件
      this.tabName = tab.name;
      console.log(tab);
    }
  },
  watch: {},
  destroyed() {}
};
</script>
<style lang="scss" scoped>
.equipment {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}
</style>
