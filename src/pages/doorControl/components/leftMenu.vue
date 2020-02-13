<template>
  <el-row ref="headerH"
          class="header left_menu">
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
                   src="../../../assets/images/doorAccess/access_authority.png"
                   alt />
              <span>权限组</span>

              <img class="left_menu_right_icon"
                   :src="menuTitle === '1'?require('@/assets/images/select-down.png'):require('@/assets/images/doorAccess/left_menu_down_icon.png')" />
            </template>
            <el-menu-item index="/DoorControl/AccessGroupConfig"
                          :disabled="!$common.getAuthIsOwn('权限组', 'isShow')">权限组</el-menu-item>
            <el-menu-item index="/DoorControl/AccessTimeConfig"
                          :disabled="!$common.getAuthIsOwn('通行时间段', 'isShow')">通行时间段</el-menu-item>
            <el-menu-item index="/DoorControl/AccessCaseConfig"
                          :disabled="!$common.getAuthIsOwn('特殊日期', 'isShow')">特殊日期</el-menu-item>
          </el-submenu>
          <el-submenu index="2"
                      :class="menuTitle === '2'? 'submenuActiveClass' : ''">
            <template slot="title">
              <img class="access_autn_select"
                   src="../../../assets/images/doorAccess/access_set.png"
                   alt />
              <span slot="title">高级配置</span>
              <img class="left_menu_right_icon"
                   :src="menuTitle === '2'?require('@/assets/images/select-down.png'):require('@/assets/images/doorAccess/left_menu_down_icon.png')" />
            </template>
            <el-menu-item index="/DoorControl/Interlocking"
                          :disabled="!$common.getAuthIsOwn('互锁', 'isShow')">互锁</el-menu-item>
            <el-menu-item index="/DoorControl/AntiBack"
                          :disabled="!$common.getAuthIsOwn('反潜回', 'isShow')">反潜回</el-menu-item>
            <el-menu-item index="/DoorControl/FirstCardOpen"
                          :disabled="!$common.getAuthIsOwn('首卡开门', 'isShow')">首卡开门</el-menu-item>
            <el-menu-item index="/DoorControl/ManMakeUpOpen"
                          :disabled="!$common.getAuthIsOwn('多人组合开门', 'isShow')">多人组合开门</el-menu-item>
            <el-menu-item index="/DoorControl/WayMakeUpOpen"
                          :disabled="!$common.getAuthIsOwn('多验证方式开门', 'isShow')">多验证方式开门</el-menu-item>
            <el-menu-item index="/DoorControl/LinkageAction"
                          :disabled="!$common.getAuthIsOwn('联动动作', 'isShow')">联动动作</el-menu-item>
            <el-menu-item index="/DoorControl/PublicMessage"
                          :disabled="!$common.getAuthIsOwn('发布公告', 'isShow')">发布公告</el-menu-item>
          </el-submenu>
          <el-menu-item class="doorStateClass"
                        :disabled="!$common.getAuthIsOwn('门禁记录', 'isShow')"
                        index="/DoorControl/DoorAccessRecord"
                        :class="menuTitle === 'DoorAccessRecord'? 'submenuActiveClass' : ''">
            <img class="access_autn_select"
                 :src="menuTitle === '/DoorControl/DoorAccessRecord'? require('@/assets/images/doorAccess/left_menu_record_select.png'):require('@/assets/images/doorAccess/left_menu_record_icon.png')" />
            门禁记录
          </el-menu-item>
          <el-menu-item class="doorStateClass"
                        :disabled="!$common.getAuthIsOwn('报警记录', 'isShow')"
                        index="/DoorControl/DoorAlarmRecord"
                        :class="menuTitle === 'DoorAlarmRecord'? 'submenuActiveClass' : ''">
            <img class="access_autn_select"
                 :src="menuTitle === '/DoorControl/DoorAlarmRecord'? require('@/assets/images/doorAccess/left_menu_alarm_select.png'):require('@/assets/images/doorAccess/left_menu_alarm_icon.png')" />
            报警记录
          </el-menu-item>
          <el-menu-item class="doorStateClass"
                        :disabled="!$common.getAuthIsOwn('门状态', 'isShow')"
                        index="/DoorControl/DoorStatus"
                        :class="menuTitle === 'DoorStatus'? 'submenuActiveClass' : ''">
            <img class="access_autn_select"
                 :src="menuTitle === '/DoorControl/DoorStatus'? require('@/assets/images/doorAccess/left_menu_door_select.png'):require('@/assets/images/doorAccess/left_menu_door_icon.png')" />
            门状态
          </el-menu-item>
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
      menuTitle: "2",
      subRoute: "AccessGroupConfig",
      defaultActive: ""
    };
  },
  watch: {},
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
      // console.log(this.menuTitle);
      this.subRoute = index.split("/")[index.split("/").length - 1];
    }
  }
};
</script>
<style>
.left_menu .el-menu-item.doorStateClass {
  padding-left: 20px !important;
  font-size: 14px !important;
  background-color: transparent !important;
  height: 56px;
}
.left_menu .left_menu_right_icon {
  width: 9.2px;
  height: 6px;
  position: absolute;
  top: 24px;
  right: 18px;
}
.left_menu .el-menu-item {
  padding-left: 55px !important;
  font-family: PingFangSC-Regular;
  font-size: 13px !important;
  color: #dddddd;
  text-align: justify;
  background-color: rgba(27, 27, 27, 0.6) !important;
  height: 45px;
}
.left_menu .access_autn_select {
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
.el-menu-item.isActive {
  border-left: 2px solid #26d39d !important;
}
.left_menu .el-menu-item.is-active {
  color: rgb(220, 221, 222) !important;
  /* border-left: 2px solid #26D39D !important; */
  /* background-color: rgb(31, 42, 49) !important; */
  background-color: rgba(38, 211, 157, 0.6) !important;
}
.left_menu .submenuActiveClass .el-submenu__title {
  /* border-bottom-color: #26d39d;
  background-color: rgb(35, 70, 62) !important;
  color: #26d39d !important;
  border-left: 2px solid #26d39d !important; */
  background-color: rgb(35, 38, 41) !important;
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
.header {
  width: 100%;
  height: 100%;
  /* max-width: 200px; */
  /* height: 1025px; */
  background: rgba(35, 38, 41, 0.8);
  box-sizing: border-box;
  position: relative;
}
.left_menu {
  overflow-y: auto;
  overflow-x: hidden;
}
.el-menu {
  background: rgba(39, 42, 45, 0.9);
  border: none;
  /* min-width: 138px; */
}
.menuItemBoxClass .el-submenu {
  height: 50px;
  line-height: 49px;
}
.el-menu--horizontal {
  border: none;
}
.el-menu--horizontal .el-menu-item {
  background-color: red;
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
  background-image: url("../../../assets/images/doorAccess/down_btn.png");
}
</style>
