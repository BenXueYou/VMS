<template>
  <div class="resident">
    <keep-alive>
      <one-level-left-menu v-if="isOneProject"
                          @tabClick="leftTabClick"
                          :ShowAuthDisabled="ShowAuthDisabled"
                          :OwnAuthDisabled="OwnAuthDisabled"></one-level-left-menu>
      <the-leftmenu v-else></the-leftmenu>
    </keep-alive>

    <the-wrap :tabName="tabName"></the-wrap>
  </div>
</template>

<script>
import TheLeftmenu from "./views/TheLeftmenu";
import OneLevelLeftMenu from "./views/OneLevelLeftMenu";
import TheWrap from "./views/TheContent";
import { mapState } from "vuex";
export default {
  components: {
    TheLeftmenu,
    OneLevelLeftMenu,
    TheWrap
  },
  props: {},
  data() {
    return {
      data: "",
      tabName: "tree1",
      tagName: "",
      addTagDialogVisible: false,
      residentTagType: "resident",
      ShowAuthDisabled: false,
      isOneProject: false,
      OwnAuthDisabled: false
    };
  },
  created() {},
  computed: {
    ...mapState({
      checkedTreeData: state => {
        console.log("------------", state);
        return state.resident.curentLeftCheckedData;
      }
    })
  },
  mounted() {
    let projectType = this.$store.state.home.projectType || {};
    this.isOneProject = Boolean(projectType.platformLevel === "levelOne");
    console.log(this.isOneProject);
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("居民管理", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("居民管理", "isOwn");
  },
  methods: {
    leftTabClick(tabName, id) {
      console.log(tabName);
      this.tabName = tabName;
    }
  },
  watch: {
    checkedTreeData(val) {
      console.log(val);
    }
  },
  destroyed() {}
};
</script>
<style lang="scss" scoped>
.resident {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  .changeTagBox {
    color: #dddddd;
    text-align: center;
    margin: 30px 0 10px;
    .el-input {
      width: 50%;
      text-align: left;
    }
  }
}
</style>
