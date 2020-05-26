<template>
  <div class="hot_wrap"></div>
</template>

<script>
export default {
  name: "TopTable",
  props: {},
  data() {
    return {
      tableData: []
    };
  },
  mounted() {},
  methods: {},
  watch: {}
};
</script>
<style lang="scss" scoped>
.hot_wrap {
  width: 100%;
  height: 258px;
  background-image: url("../../../../assets/images/downTown/hot-border.png");
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 100% 100%;
}
</style>
