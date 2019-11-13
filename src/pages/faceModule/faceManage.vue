<template>
	<div id="FaceManage">
		<left-menu></left-menu>
		<el-row class="FaceRightBox">
			<keep-alive>
				<router-view v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
			<router-view v-if="!$route.meta.keepAlive"></router-view>
		</el-row>
	</div>
</template>

<script>
import leftMenu from '@/common/leftMenu.vue';
export default {
  name: 'FaceManage',
  components: {
    leftMenu
  },
  data: function (argument) {
    return {
      // this.$route.path:'/home'
      app_visible_popver: false
    };
  },
  mounted: function () {

  },
  methods: {
    switchModule () {
      console.log('-----', this.$route.path);
      this.app_visible_popver = false;
      // this.routerIndex = this.$route.path;
    },
    btnAct() {

    }
  }
};
</script>

<style>

body {
  overflow: hidden;
}
#FaceManage {
	/* width: 100%; */
	height: 100%;
	/* max-height: 1030px; */
	font-family: Helvetica, sans-serif;
	/* text-align: center; */
	box-sizing: border-box;
	background-color: rgb(28, 29, 32);
	display: flex;
	flex-direction: wrap;
	justify-content: flex-start;
}
.el-progress-circle__track{
    stroke: rgb(61,65,71);
    fill: none;
}
.FaceRightBox {
	width: calc(100% - 200px);
	height: 100%;
	/* padding: 40px 30px 40px 30px; */
}
</style>
