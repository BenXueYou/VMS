<template>
  <div class='equipment'>
    <the-leftmenu :orgType="orgType"
                  @changetab="changetab"
                  ref='testTree'
                  :ShowAuthDisabled="ShowAuthDisabled"
                  :OwnAuthDisabled="OwnAuthDisabled"
                  @clickNode="clickNode"
                  @chanegeProject="chanegeProject">

    </the-leftmenu>
    <the-wrap :tabName="tabName"
              :ShowAuthDisabled="ShowAuthDisabled"
              :OwnAuthDisabled="OwnAuthDisabled"
              :rightpieData='rightpieData'
              @updateTree="updateTree"
              :activeProject="activeProject">

    </the-wrap>
  </div>
</template>

<script>
import TheLeftmenu from "./views/TheLeftContent";
import TheWrap from "./views/TheRightContent";
import { mapState } from "vuex";
export default {
  components: {
    TheLeftmenu,
    TheWrap
  },
  props: {
  },
  data() {
    return {
      data: "",
      tabName: "organiza",
      orgType: window.config.orgType,
      needType: "",
      tagType: window.config.tagType,
      ShowAuthDisabled: false,
      OwnAuthDisabled: false,
      rightpieData: {},
      activeProject: ""
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
    clickNode(node) {
      console.log(node);
      // debugger;
    },
    changetab(tab) {
      // 左边菜单的切换tab事件
      console.log("tab===", tab);
      this.rightpieData = tab;
      this.tabName = tab.name;
      console.log("tabName===", tab.name);
      // debugger;
    },
    chanegeProject(data) {
      console.log("data===", data);
      this.activeProject = data;
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
