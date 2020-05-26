<template>
  <el-row ref="headerH"
          class="header vistor_left_menu">
    <el-row class="el-row">
      <el-col :span="24">
        <el-menu :default-active="defaultActive"
                 class="el-menu-vertical"
                 @open="handleOpen"
                 @close="handleClose"
                 @select="handleSelect"
                 background-color="#00000000"
                 text-color="#DDDDDD"
                 :router="true"
                 active-text-color="#26D39D">
          <el-submenu index="1"
                      :class="menuTitle === '1'? 'submenuActiveClass' : ''">
            <template slot="title">
              <img class="access_autn_select"
                   src="../../../assets/images/vistorManage/vistorManage.png"
                   alt />
              <span>访客记录</span>
              <img class="vistor_left_menu_right_icon"
                   :src="menuTitle === '1'?require('@/assets/images/select-down.png'):require('@/assets/images/doorAccess/left_menu_down_icon.png')" />
            </template>
            <el-menu-item index="/VisitorManage/VistorRecord"
                          :disabled="!$common.getAuthIsOwn('访客记录', 'isShow')">访客记录</el-menu-item>
            <el-menu-item index="/VisitorManage/VistorList"
                          :disabled="!$common.getAuthIsOwn('访客列表', 'isShow')">访客列表</el-menu-item>
            <el-menu-item index="/VisitorManage/VistorOpenRecord"
                          :disabled="!$common.getAuthIsOwn('访客开门记录', 'isShow')">访客开门记录</el-menu-item>
            <el-menu-item index="/VisitorManage/AppointInviteRecord"
                          :disabled="!$common.getAuthIsOwn('预约/邀请记录', 'isShow')">预约/邀请记录</el-menu-item>
          </el-submenu>
          <el-submenu index="2"
                      :class="menuTitle === '2'? 'submenuActiveClass' : ''">
            <template slot="title">
              <img class="access_autn_select"
                   src="../../../assets/images/doorAccess/access_authority.png"
                   alt />
              <span slot="title">访客权限</span>
              <img v-show="menuTitle === '2'"
                   class="vistor_left_menu_right_icon"
                   src="../../../assets/images/select-down.png" />
              <img v-show="menuTitle !== '2'"
                   class="vistor_left_menu_right_icon"
                   src="../../../assets/images/doorAccess/left_menu_down_icon.png"
                   alt />
            </template>
            <el-menu-item index="/VisitorManage/VistorAccessConfig"
                          :disabled="!$common.getAuthIsOwn('访客权限组', 'isShow')">访客权限组</el-menu-item>
          </el-submenu>
          <el-submenu index="3"
                      :class="menuTitle === '3'? 'submenuActiveClass' : ''">
            <template slot="title">
              <img class="access_autn_select"
                   src="../../../assets/images/doorAccess/access_set.png"
                   alt />
              <span slot="title">访客配置</span>
              <img v-show="menuTitle === '3'"
                   class="vistor_left_menu_right_icon"
                   src="../../../assets/images/select-down.png" />
              <img v-show="menuTitle !== '3'"
                   class="vistor_left_menu_right_icon"
                   src="../../../assets/images/doorAccess/left_menu_down_icon.png"
                   alt />
            </template>
            <el-menu-item index="/VisitorManage/VistorNotificationSet"
                          :disabled="!$common.getAuthIsOwn('访客预约邀请', 'isShow')">访客预约邀请</el-menu-item>
            <el-menu-item index="/VisitorManage/VistorSignOff"
                          :disabled="!$common.getAuthIsOwn('访客签离', 'isShow')">访客签离</el-menu-item>
          </el-submenu>
          <el-submenu index="4"
                      :class="menuTitle === '4'? 'submenuActiveClass' : ''">
            <template slot="title">
              <img class="access_autn_select"
                   src="../../../assets/images/vistorManage/left_menu_blacklist_icon.png"
                   alt />
              <span slot="title">访客黑名单</span>
              <img v-show="menuTitle === '3'"
                   class="vistor_left_menu_right_icon"
                   src="../../../assets/images/select-down.png" />
              <img v-show="menuTitle !== '3'"
                   class="vistor_left_menu_right_icon"
                   src="../../../assets/images/doorAccess/left_menu_down_icon.png"
                   alt />
            </template>
            <el-menu-item index="/VisitorManage/VistorBlacklist"
                          :disabled="!$common.getAuthIsOwn('黑名单管理', 'isShow')">黑名单管理</el-menu-item>
            <el-menu-item index="/VisitorManage/VistorBlacklistAlarm"
                          :disabled="!$common.getAuthIsOwn('黑名单报警', 'isShow')">黑名单报警</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
export default {
  mounted: function() {
    console.log(this.$route);
    // this.$router.push("AccessCaseConfig");
    // this.$router.push("{ name: this.$route.name }");
    this.defaultActive = this.$route.fullPath;
    console.log(this.defaultActive);
  },
  data: function() {
    return {
      menuTitle: "1",
      subRoute: "VistorRecord",
      defaultActive: ""
    };
  },
  watch: {
    $route(to, from) {
      this.defaultActive = this.$route.fullPath;
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      this.menuTitle = key;
    },
    handleClose(key, keyPath) {
      this.menuTitle = key;
    },
    handleSelect(index, indexpath) {
      // console.log(index, indexpath);
      this.menuTitle = indexpath[0];
      this.subRoute = index.split("/")[index.split("/").length - 1];
    }
  }
};
</script>
<style>
.vistor_left_menu .el-menu-item.doorStateClass {
  padding-left: 20px !important;
  font-size: 14px !important;
  background-color: transparent !important;
  height: 56px;
}
.vistor_left_menu .vistor_left_menu_right_icon {
  width: 9.2px;
  height: 6px;
  position: absolute;
  top: 24px;
  right: 18px;
}
.vistor_left_menu .el-menu-item {
  padding-left: 55px !important;
  font-family: 'PingFangSC-Regular';
  font-size: 13px !important;
  color: #dddddd;
  text-align: justify;
  background-color: rgba(27, 27, 27, 0.6) !important;
  height: 45px;
}
.vistor_left_menu .access_autn_select {
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
.vistor_left_menu .activeClass {
  color: #26d39d !important;
  background-color: rgb(35, 70, 62) !important;
}
.vistor_left_menu .el-menu:hover,
.vistor_left_menu .el-menu-item:hover {
  background-color: rgb(33, 45, 51);
}
.vistor_left_menu .el-menu-item.isActive {
  border-left: 2px solid #26d39d !important;
}
.vistor_left_menu .el-menu-item.is-active {
  color: rgb(220, 221, 222) !important;
  background-color: rgba(38, 211, 157, 0.6) !important;
}
.vistor_left_menu .submenuActiveClass .el-submenu__title {
  background-color: rgb(35, 38, 41) !important;
}
.vistor_left_menu .el-menu--collapse {
  width: 100%;
}
.vistor_left_menu .el-menu--vertical {
  background: rgba(39, 42, 45, 0.9);
  width: 140px;
  /* border: 1px solid red; */
}
.vistor_left_menu .el-menu--vertical .el-menu {
  background: rgba(39, 42, 45, 0.9);
  border: none;
  min-width: 138px;
}
.vistor_left_menu.header {
  width: 100%;
  height: 100%;
  background: rgba(35, 38, 41, 0.8);
  box-sizing: border-box;
  position: relative;
}
.vistor_left_menu {
  overflow-y: auto;
  overflow-x: hidden;
}
.vistor_left_menu .el-menu {
  background: rgba(39, 42, 45, 0.9);
  border: none;
}
.vistor_left_menu .menuItemBoxClass .el-submenu {
  height: 50px;
  line-height: 49px;
}
.vistor_left_menu .el-menu--horizontal {
  border: none;
}
.vistor_left_menu .el-menu--horizontal .el-menu-item {
  transition: all 0.6s ease-in-out;
}
.vistor_left_menu .el-menu--horizontal .el-submenu:hover,
.vistor_left_menu .el-menu--horizontal .el-menu-item:hover {
  transition: all 0.6s ease-in-out;
}
.vistor_left_menu .el-menu--horizontal > .el-menu-item .is-active {
  background-color: rgb(35, 57, 54);
}
.vistor_left_menu .el-submenu__title:hover,
.vistor_left_menu .el-menu-item:hover,
.vistor_left_menu .el-menu-item:focus {
  background-color: rgb(35, 57, 54);
  color: #72757f;
}
.vistor_left_menu li {
  padding: 0;
}

a:-webkit-any-link {
  color: -webkit-link;
  text-decoration: none;
  cursor: auto;
}
.vistor_left_menu .el-icon-arrow-down:before {
  content: "";
  background-image: url("../../../assets/images/doorAccess/down_btn.png");
}
</style>
