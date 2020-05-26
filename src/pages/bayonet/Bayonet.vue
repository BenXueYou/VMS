<template>
	<div class="bayonetBox">
		<div class="left_menu header">
			<el-menu
				:default-active="$route.path"
				class="el-menu-vertical"
				@open="handleOpen"
				@close="handleClose"
				@select="handleSelect"
				background-color="#00000000"
				text-color="#DDDDDD"
				:router="true"
				active-text-color="#26D39D"
			>
				<el-menu-item index="/BayonetManage/bayonetPreview">
					<div class="bayonetMenuItem">
						<img
							class="img"
							:src="$route.path==='/BayonetManage/bayonetPreview'?icons.bayonetPreviewSelect:icons.bayonetPreview"
						/>
						<span>过车预览</span>
					</div>
				</el-menu-item>
				<el-menu-item index="/BayonetManage/bayonetRecord">
					<div class="bayonetMenuItem">
						<img
							class="img"
							:src="$route.path==='/BayonetManage/bayonetRecord'?icons.bayonetRecordSelect:icons.bayonetRecord"
						/>
						<span>过车查询</span>
					</div>
				</el-menu-item>
			</el-menu>
		</div>
		<el-row class="main">
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
		</el-row>
	</div>
</template>

<script>
import icons from "@/common/js/icon.js";
export default {
  props: {},
  data() {
    return {
      icons,
      menuTitle: "user",
      defaultActive: "/user/accout"
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleOpen(key, keyPath) {
      this.menuTitle = key;
    },
    handleClose(key, keyPath) {
      this.menuTitle = key;
    },
    handleSelect(index, indexpath) {
      this.menuTitle = indexpath[0];
      this.subRoute = index.split("/")[index.split("/").length - 1];
    }
  },
  watch: {},
  destroyed() {}
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" >
@import "@/style/variables.scss";
.bayonetMenuItem {
  line-height: 50px;
	img {
		vertical-align: middle;
	}
	span {
		font-family: "PingFangSC-Regular";
		font-size: 14px;
		color: #dddddd;
		letter-spacing: 0;
	}
}
.bayonetBox {
	display: flex;
	justify-content: space-between;
	height: 100%;
	color: #cccccc;
}
.bayonetBox .left_menu {
	width: 20%;
	max-width: 200px;
}
.bayonetBox .main {
	width: calc(100% - 200px);
	height: 100%;
}
.bayonetBox .left_menu .el-menu-item {
	padding-left: 55px !important;
	font-family: 'PingFangSC-Regular';
	font-size: 13px !important;
	color: #dddddd;
	text-align: justify;
	background-color: rgba(27, 27, 27, 0.6) !important;
	height: 50px;
}
.bayonetBox .left_menu .access_autn_select {
	margin-right: 10px;
	width: 15px;
	height: 15px;
}
.el-menu-vertical {
	background-color: transparent;
}
.el-submenu__title {
	background-color: transparent !important;
	position: relative;
	font-family: "PingFangSC-Regular";
	font-size: 14px !important;
	border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
	box-shadow: 8px 0 18px 0 rgba(0, 0, 0, 0.1);
}
.left_menu .activeClass {
	color: #26d39d !important;
	background-color: rgb(35, 70, 62) !important;
}

.el-menu:hover,
.el-menu-item:hover {
	background-color: rgb(33, 45, 51);
}
.bayonetBox .left_menu .el-menu-item.is-active {
	background-color: rgba(38, 211, 157, 0.15)!important;
}
.bayonetBox .left_menu .el-menu-item.is-active span{
	color: #26d39d!important;
}
.el-menu--collapse {
	width: 100%;
}
.el-menu--vertical {
	background: rgba(39, 42, 45, 0.9);
	width: 140px;
	/* border: 1px solid red; */
}
.el-menu--vertical .el-menu {
	background: rgba(39, 42, 45, 0.9);
	border: none;
	min-width: 138px;
}
.bayonetBox .header {
	width: 100%;
	height: 100%;
	/* max-width: 200px; */
	/* height: 1025px; */
	background: rgba(35, 38, 41, 0.8);
	box-sizing: border-box;
	position: relative;
}
.bayonetBox .left_menu {
	overflow-y: auto;
	overflow-x: hidden;
}
.bayonetBox .el-menu {
	background: rgba(39, 42, 45, 0.9);
	border: none;
	/* min-width: 138px; */
}
.bayonetBox .el-submenu {
	height: 50px;
	line-height: 49px;
}
.bayonetBox .el-menu--horizontal {
	border: none;
}
.el-menu--horizontal .el-menu-item {
	transition: all 0.6s ease-in-out;
}
.el-menu--horizontal .el-submenu:hover,
.el-menu--horizontal .el-menu-item:hover {
	/* background-color: rgba(40, 255, 187, 0.08); */
	transition: all 0.6s ease-in-out;
}
.el-menu--horizontal > .el-menu-item .is-active {
	background-color: rgb(35, 57, 54);
	/* border-left: 2px solid #26D39D; */
}
/* .el-submenu:hover,
.el-menu-item:hover {
  background-color: rgba(40, 255, 187, 0.08);
} */
.el-submenu__title:hover,
.el-menu-item:hover,
.el-menu-item:focus {
	/* background-color: rgba(40, 255, 187, 0.08); */
	background-color: rgb(35, 57, 54) !important;
	color: #72757f;
}
li {
	padding: 0;
	/* border-bottom: 1px solid rgba(40, 255, 187, 0.08); */
	/* box-shadow: 8px 0 18px 0 rgba(0, 0, 0, 0.1); */
}
/* .el-menu-item:first-child {
  font-size: 12px;
} */
a:-webkit-any-link {
	color: -webkit-link;
	text-decoration: none;
	cursor: auto;
}

.left_menu .el-icon-arrow-down:before {
	content: "";
	background-image: url("../../assets/images/doorAccess/down_btn.png");
}
</style>
