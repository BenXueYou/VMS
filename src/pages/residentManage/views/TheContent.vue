<template>
  <div class="content">
    <!-- <the-resident-table></the-resident-table> -->
    <component :is="tabs[tabName]"></component>
  </div>
</template>
<script>
import TheResidentTable from "../components/TheResidentTable";
import TheResidentTagTable from "../components/TheResidentTagTable";
export default {
  name: "wrap",
  components: { TheResidentTable, TheResidentTagTable },
  props: {
    tabName: {
      type: String,
      default: "tree1"
    },
    tabs: {
      type: Object,
      default() {
        return {
          tree1: TheResidentTable,
          tree2: TheResidentTagTable
        };
      }
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "@/style/variables.scss";

.content {
  width: calc(100% - #{$equLeftMenuWidth});
  height: 100%;
  padding: $rightContentMargin;
  box-sizing: border-box;
  background-color: rgb(27, 27, 27);
}
</style>
