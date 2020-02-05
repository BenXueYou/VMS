<template>
  <div class="resident">
    <the-leftmenu @tabClick="leftTabClick"
                  :ShowAuthDisabled="ShowAuthDisabled"
                  :OwnAuthDisabled="OwnAuthDisabled"></the-leftmenu>
    <the-wrap :tabName="tabName"></the-wrap>
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
      tabName: "tree1",
      tagName: "",
      addTagDialogVisible: false,
      residentTagType: "resident",
      ShowAuthDisabled: false,
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
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("居民管理", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("居民管理", "isOwn");
    console.log(this.ShowAuthDisabled);
    console.log(this.OwnAuthDisabled);
    // const { commit, state, getters } = this.$store;
    // console.log(state.resident.count);
    // commit("increment");
    // console.log(state.resident.count);
    // console.log(getters.doubleCount);
    // console.log(this.count);
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
