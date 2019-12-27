import Vue from "vue";
import Router from "vue-router";
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
// 模块首页
import Login from "@/pages/login/Login";
import MainLayout from "@/pages/main/views/MainLayout";
import Home from "@/pages/home/views/Home";
import projectManage from "@/pages/projectManage/projectManage";
import VistorMangeSubRoute from "@/pages/vistorMange/VistorMange";
import VideoPreview from "@/pages/VideoPreview/VideoPreview";
import VideoPlayback from "@/pages/VideoPlayback/VideoPlayback";
// 子系统系统路由
import vistorManage from "./modules/vistorManage";
import unitManage from "./modules/unitManage";
import resident from "./modules/resident";
import personManage from "./modules/personManage";
import equipmentManage from "./modules/equipmentManage";
import doorAccess from "./modules/doorAccess";
import buildingHouse from "./modules/buildingHouse";
import faceModule from './modules/faceModule';
import log from "./modules/log";
import user from "./modules/auth";

Vue.use(Router);
// 先定义好所有的路由模块，然后根据权限来生成对面菜单路由
let allChildrenRouter = [
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
    title: "系统日志",
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
  },
  {
    path: "/FaceManage",
    name: "FaceManage",
    component: faceModule.component,
    title: "人脸识别",
    children: faceModule.children,
    icon: "FaceManage",
    type: "app",
    // redirect: "/FaceManage" //设置默认子路由
  },
  {
    path: "/VideoPreview",
    name: "VideoPreview",
    component: VideoPreview,
    title: "视频预览",
    icon: "VideoPreview",
    type: "config"
  },
  {
    path: "/VideoPlayback",
    name: "VideoPlayback",
    component: VideoPlayback,
    title: "视频回放",
    icon: "VideoPlayback",
    type: "config"
  }
];

export function getRoute(data, istest) {
  let routerArr=[{
    path: "/Home",
    name: "Home",
    component: Home,
    title: "首页"
  }];
  for(let i=0,len=data.length;i<len;i++){
    for(let j=0;j<allChildrenRouter.length;j++){
      if(allChildrenRouter[j].title === data[i].nodeName){
        routerArr.push(allChildrenRouter[j]);
        break;
      }
    }
  }
  console.log(routerArr);
  return [
    {
      path: "/",
      name: "MainLayout",
      component: MainLayout,
      redirect: "Home",
      children:routerArr 
      // allChildrenRouter.filter(item => {
      //   return (
      //     data.some(v => {
      //       return v.nodeName === item.title;
      //     }) ||
      //     item.title === "首页" ||
      //     istest
      //   );
      // })
    }
  ];
}

export const constantRouterMap = [
  {
    path: "/",
    name: "MainLayout",
    component: MainLayout,
    redirect: "Home"
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
