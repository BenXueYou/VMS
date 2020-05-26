<template>
  <div class="SchoolBoard">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: "SchoolBoard",
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  watch: {}
};
</script>
<style>
.SchoolBoard {
  height: 100%;
  background: rgba(0, 0, 0, 1);
}
</style>
