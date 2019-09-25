<template>
	<div class="box">
		<left-menu class="left-menu"></left-menu>
		<el-row class="main">
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
			<!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
		</el-row>
	</div>
</template>

<script>
import leftMenu from "../components/leftMenu.vue";
export default {
  components: { leftMenu },
  props: {},
  data() {
    return {};
  },
  created() {},
  mounted() {
    // this.$router.push({ name: "AccessGroupConfig" });
  },
  methods: {},
  watch: {},
  destroyed() {}
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/style/variables.scss";
.box {
	display: flex;
	justify-content: space-between;
	height: 100%;
	color: #cccccc;
}
.box .left-menu {
	width: 20%;
	max-width: 200px;
}
.box .main {
	width: calc(100% - 200px);
	height: 100%;
	padding: $rightContentMargin;
}
</style>
