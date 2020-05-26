<template>
  <div class="house">
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
      // 加这个清除是为了，驱动下一次监听OrgUuid的变化
      this.OrgUuid = "";
      this.projectUuid = "";
      this.projectUuid = val.projectUuid || "";
    },
    handleRefreshOrg(val) {
      // 当第二层只有一个OrgUuid的时候，则会出现多次点击第二层不会触发数据驱动
      this.OrgUuid = "";
      this.projectUuid = "";
      this.OrgUuid = val;
    }
  },
  watch: {},
  destroyed() {}
};
</script>
<style lang="scss" scoped>
.house {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  background: #000000;
}
</style>
