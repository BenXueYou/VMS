import Vue from "vue";
import Router from "vue-router";
// 模块首页
import Login from "@/pages/login/Login";
import MainLayout from "@/pages/main/views/MainLayout";
import Home from "@/pages/home/views/Home";
import projectManage from "@/pages/projectManage/projectManage";
import VistorMangeSubRoute from "@/pages/vistorMange/VistorMange";
// 子系统系统路由
import vistorManage from "./modules/vistorManage";
import unitManage from "./modules/unitManage";
import resident from "./modules/resident";
import personManage from "./modules/personManage";
import equipmentManage from "./modules/equipmentManage";
import doorAccess from "./modules/doorAccess";
import buildingHouse from "./modules/buildingHouse";
import log from "./modules/log";
import user from "./modules/auth";

Vue.use(Router);

export const constantRouterMap = [
  {
    path: "/",
    name: "MainLayout",
    component: MainLayout,
    redirect: "Home",
    children: [
      {
        path: "/Home",
        name: "Home",
        component: Home,
        title: "首页"
      },
      {
        path: "/DoorControl",
        name: "DoorControl",
        component: doorAccess.component,
        title: "门禁管理",
        children: doorAccess.children,
        icon: "doorControl",
        type: "app"
        // redirect:'/DoorControl/' //设置默认子路由
      },
      {
        path: "/PersonMange",
        name: "PersonMange",
        component: personManage,
        title: "员工管理",
        icon: "personMange",
        type: "config"
      },
      {
        path: "/VistorMange",
        name: "VistorMange",
        component: VistorMangeSubRoute,
        title: "访客管理",
        children: vistorManage,
        icon: "vistorMange",
        type: "app"
      },
      {
        path: "/EquipmentMange",
        name: "EquipmentMange",
        component: equipmentManage,
        title: "设备管理",
        icon: "equipmentMange",
        type: "config"
      },
      {
        path: "/UnitMange",
        name: "UnitMange",
        component: unitManage,
        title: "单位管理",
        icon: "unitMange",
        type: "config"
      },
      {
        path: "/BuildingsHouse",
        name: "BuildingsHouse",
        component: buildingHouse,
        title: "楼栋房屋",
        icon: "buildingsHouse",
        type: "config"
      },
      {
        path: "/ResidentManage",
        name: "ResidentManage",
        component: resident,
        title: "居民管理",
        icon: "residentManage",
        type: "config"
      },
      {
        path: "/log",
        name: "log",
        component: log.component,
        title: "日志管理",
        children: log.children,
        icon: "log",
        type: "app"
      },
      {
        path: "/user",
        name: "user",
        component: user.component,
        title: "用户管理",
        children: user.children,
        icon: "userManage",
        type: "app"
      }
    ]
  },
  {
    path: "/Login",
    name: "Login",
    component: Login
  },
  {
    path: "/projectManage",
    name: "projectManage",
    component: projectManage
  }
];

export default new Router({
  // mode: 'history', //后端支持可开
  mode: "hash",
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
