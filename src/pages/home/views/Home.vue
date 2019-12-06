<template>
	<div class="home-main">
		<div class="app-menu">
			<!-- <div class="type-title">应用业务</div> -->
			<template v-for="(item, index) in menuArr[0].children">
				<menu-item
					:key="index"
					@onClickMenu="onClickMenu(item)"
					:item="item"
					v-if="item.name !== 'Home'"
				/>
			</template>
			<!-- v-if="item.name !== 'Home' && item.type === 'app'" -->
		</div>
		<!-- <div class="config-menu">
      <div class="type-title">系统配置</div>
      <template v-for="(item, index) in menuArr[0].children">
        <menu-item :key="index"
                   :item="item"
                   @onClickMenu="onClickMenu(item)"
                   v-if="item.name !== 'Home' && item.type === 'config'" />
      </template>
		</div>-->
	</div>
</template>

<script>
// import { constantRouterMap } from "@/router";
import MenuItem from "@/pages/home/components/MenuItem";

export default {
  components: {
    MenuItem
  },
  props: {},
  data() {
    return {
      flag: true,
      tagViewArr: [],
      menuArr: [{ children: [] }]
    };
  },
  created() {
    // 请求菜单数据是延迟加载的，偷懒，先用setTimeout.
    setTimeout(() => {
      this.initData();
    }, 0);
  },
  mounted() {
    window.addEventListener("beforeunload", e => this.browerStatus(e));
    window.addEventListener("unload", e => this.browerStatusOff(e));
  },
  methods: {
    browerStatus(e) {
      e = window.event || e;
      e.returnValue = "确定离开当前页面吗？";
    },
    browerStatusOff(e) {
      console.log("完善登出事件", e);
      this.flag = true;
      this.$loginAjax
        .loginOut()
        .then(res => {
          this.flag = false;
        })
        .catch(() => {});
      while (this.flag) {
        console.log("-------等待退出接口响应---------");
      }
    },
    initData() {
      // 这里暂时将访客功能页面给注释掉
      // 解开只需要删掉val.name!=="VistorMange" 这个判断条件 && val.name !== "VistorMange"
      // console.log(this.$router);
      // constantRouterMap[0].children = constantRouterMap[0].children.filter(
      // val => val.icon !== undefined
      // );
      // this.menuArr = constantRouterMap;
      // console.log(constantRouterMap[0].children);
      // console.log(window.localStorage.getItem("useruuid"));
      // console.log(this.$router);
      this.menuArr = JSON.parse(window.localStorage.getItem("routerData"));
    },
    onClickMenu(compomentItem) {
      this.$store.dispatch("addTagViewItem", compomentItem);
      this.$store.dispatch("setLocalTag", compomentItem.name);
      this.$bus.$emit("setLocalTag", compomentItem.name);
      this.$router.push({ name: compomentItem.name });
    }
  },
  watch: {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.home-main {
	width: 100%;
	height: 100%;
	padding: 4% 16%;
	box-sizing: border-box;
}
.app-menu {
	width: 100%;
	height: 47%;
	display: flex;
	flex-flow: row wrap;
	padding-top: 10px;
	align-content: flex-start;
	box-sizing: border-box;
	// border-top: {
	//   width: 1px;
	//   style: dashed;
	//   color: #777777;
	// }
	position: relative;
	.type-title {
		position: absolute;
		font-family: "PingFangSC-Regular";
		font-size: 18px;
		text-align: center;
		color: #ffffff;
		letter-spacing: 0;
		width: 120px;
		background: #1b1b1b;
		left: 47%;
		top: -13px;
	}
}
.config-menu {
	width: 100%;
	height: 47%;
	margin-top: 45px;
	display: flex;
	flex-flow: row wrap;
	padding-top: 18px;
	box-sizing: border-box;
	border-top: {
		width: 1px;
		style: dashed;
		color: #777777;
	}
	position: relative;
	.type-title {
		position: absolute;
		font-family: PingFangSC-Regular;
		font-size: 18px;
		text-align: center;
		color: #ffffff;
		letter-spacing: 0;
		width: 120px;
		background: #1b1b1b;
		left: 47%;
		top: -13px;
	}
}
</style>
