<template>
  <div class='equipment'>
    <the-leftmenu :orgType="orgType"
                  :needType="needType"
                  :tagType="tagType"
                  @changetab="changetab"
                  ref='testTree'
                  @clickNode="clickNode">

    </the-leftmenu>

    <the-wrap :tabName="tabName"
              @updateTree="updateTree">

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
      tagType: window.config.tagType
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
  mounted() {
    // const { commit, state, getters } = this.$store;
    // console.log(state.equipment.count);
    // commit("increment");
    // console.log(state.equipment.count);
    // console.log(getters.doubleCount);
    // console.log(this.count);
  },
  methods: {
    updateTree(tagUuid) {
      this.$refs.testTree.getOrgTag(true, tagUuid);
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
