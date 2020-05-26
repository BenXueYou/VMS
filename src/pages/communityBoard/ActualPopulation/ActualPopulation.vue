<template>
  <div class='equipment'>
    <the-leftmenu :orgType="orgType"
                  @changetab="changetab"
                  ref='testTree'
                  @clickNode="clickNode"
                  :activeProjectId="activeProjectId">

    </the-leftmenu>
    <the-wrap :tabName="tabName"
              :ShowAuthDisabled="ShowAuthDisabled"
              :OwnAuthDisabled="OwnAuthDisabled"
              @updateTree="updateTree"
              @activeProject="activeProject">

    </the-wrap>
  </div>
</template>

<script>
import TheLeftmenu from "./views/TheLeftmenu";
import TheWrap from "./views/TheContent";
import { mapState } from "vuex";
export default {
  components: {
    TheLeftmenu,
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
      ShowAuthDisabled: false,
      OwnAuthDisabled: false,
      activeProjectId: ""
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
    // const { commit, state, getters } = this.$store;
    // console.log(state.equipment.count);
    // commit("increment");
    // console.log(state.equipment.count);
    // console.log(getters.doubleCount);
    // console.log(this.count);
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("实有人口", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("实有人口", "isOwn");
    // this.ShowAuthDisabled = true;
    // this.OwnAuthDisabled = true;
  },
  methods: {
    updateTree(tagUuid) {
      this.$refs.testTree.getOrgTag(true, tagUuid);
    },
    activeProject(val) {
      console.log("activeProject====", val);
      this.activeProjectId = val;
    },
    clickNode(node) {
      console.log(node);
    },
    changetab(tab) {
      // 左边菜单的切换tab事件
      this.tabName = tab.name;
      console.log(tab);
    }
  },
  watch: {
    // activeProject(val) {
    //   if (val) {
    //     debugger
    //   }
    // }
  },
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
