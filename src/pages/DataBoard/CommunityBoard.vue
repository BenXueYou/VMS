<template>
  <div class="communityBoard">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
export default {
  name: "CommunityBoard",
  components: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  watch: {}
};
</script>
<style>
.communityBoard {
  height: 100%;
}
</style>
