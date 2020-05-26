<template>
  <div class="population">
    <TheLeft :projectUuid="projectUuid"
             :OrgUuid="OrgUuid"></TheLeft>
    <TheCenter @refreshAll="handleRefresh"
               @refreshOrg="handleRefreshOrg"></TheCenter>
    <TheRight :projectUuid="projectUuid"
              :OrgUuid="OrgUuid"></TheRight>
  </div>
</template>

<script>
import TheLeft from "./views/TheLeft";
import TheRight from "./views/TheRight";
import TheCenter from "./views/TheCenter";
export default {
  components: {
    TheLeft,
    TheRight,
    TheCenter
  },
  props: {},
  data() {
    return {
      projectUuid: "",
      OrgUuid: ""
    };
  },
  created() {},
  activated() {},
  mounted() {},
  methods: {
    handleRefresh(val) {
      // 点击的是旭日图根节点或是项目节点
      // 传入 orgUuid 不需要传切换projectUuid
      // 传入了projectUuid 则表示点击的是旭日图的根节点
      // 添加这一行的代码 是手动改变 更好的监听projectUUid的变化
      // 添加这一行的代码 是手动改变 更好的监听orgUUid的变化
      this.OrgUuid = "";
      this.projectUuid = '';
      this.projectUuid = val.projectUuid || "";
      console.log(this.projectUuid, "----传入projectUuid----", this.OrgUuid);
    },
    handleRefreshOrg(val) {
      // 点击的是组织节点，需要切换项目uuid
      this.OrgUuid = "";
      this.projectUuid = "";
      this.OrgUuid = val;
      console.log(this.projectUuid, "----传入orgUuid----", this.OrgUuid);
    }
  },
  watch: {},
  destroyed() {}
};
</script>
<style lang="scss" scoped>
.population {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  background: #000000;
  color: #dddddd;
}
</style>
