import Vue from "vue";
import Router from "vue-router";
// const originalPush = Router.prototype.push;
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err);
// };
// 模块首页
import Login from "@/pages/login/Login";
import MainLayout from "@/pages/main/views/MainLayout";
import Home from "@/pages/home/views/Home";

// 子模块路由
import projectManage from "@/pages/projectManage/projectManage";
import VistorMangeSubRoute from "@/pages/VisitorManage/VistorMange";
import AreaManagement from "@/pages/AreaManagement/AreaManagement";
import VideoPreview from "@/pages/VideoPreview/VideoPreview";
import VideoPlayback from "@/pages/VideoPlayback/VideoPlayback";
import MapConfig from "@/pages/mapConfig/views/MapConfig";
import MapOperate from "@/pages/mapOperate/views/MapOperate";
import DeviceStatus from "@/pages/deviceStatus/views/DeviceStatus";
// import AreaManagement from "@/pages/AreaManagement/AreaManagement";
import SystemConfig from "@/pages/systemConfig/views/SystemConfig";
// 子系统系统路由
import vistorManage from "./modules/vistorManage";
import unitManage from "./modules/unitManage";
import PrewarnMegatemp from "./modules/prewarnMegatemp";
import resident from "./modules/resident";
import personManage from "./modules/personManage";
import equipmentManage from "./modules/equipmentManage";
import doorAccess from "./modules/doorAccess";
import buildingHouse from "./modules/buildingHouse";
import faceModule from "./modules/faceModule";
import sysConfig from "./modules/sysConfig";
import log from "./modules/log";
import user from "./modules/auth";
import SchoolBoard from "./modules/SchoolBoard";
import BayonetManage from "./modules/bayonet";
import CarManage from "./modules/cardManage";
import Hardware from "./modules/hardware";
import CommunityBoard from "./modules/CommunityBoard";
import DataBoard from "./modules/DataBoard";
Vue.use(Router);
// 先定义好所有的路由模块，然后根据权限来生成对面菜单路由
let allChildrenRouter = [
  {
    path: "/DoorControl",
    name: "DoorControl",
    component: doorAccess.component,
    title: "门禁管理",
    moduleType: ['set', 'operation'],
    children: doorAccess.children,
    icon: "doorControl",
    featureUuid: "775f7470156c849ceabc00f15865416c",
    type: "app",
    //redirect:'/DoorControl/' //设置默认子路由
  },
  {
    path: "/SchoolBoard",
    name: "SchoolBoard",
    component: SchoolBoard.component,
    children: SchoolBoard.children,
    title: "学校看板",
    icon: "school_board",
    featureUuid: "75ba7a0721544379a2f29834494cc955",
    type: "config",
    moduleType: ['operation'],
    redirect: "/SchoolBoard/SchoolBoardHome" //设置默认子路由
  },
  {
    path: "/DataBoard",
    name: "DataBoard",
    component: DataBoard.component,
    title: "数据看板",
    key: "DataBoard",
    children: DataBoard.children,
    icon: "databoard",
    featureUuid: "3f7b160b3a30426f89f3f30897aafbbf",
    type: "config",
    moduleType: ['operation'],
    redirect: "/DataBoard/DataBoardHome"
  },
  {
    path: "/VideoPreview",
    name: "VideoPreview",
    component: VideoPreview,
    title: "视频预览",
    featureUuid: "3cf1e18ab6d1b204f307c0f6aa290c7b",
    key: "VideoPreview",
    icon: "VideoPreview",
    moduleType: ['set', 'operation'],
    type: "config"
  },
  {
    path: "/VideoPlayback",
    name: "VideoPlayback",
    component: VideoPlayback,
    title: "视频回放",
    featureUuid: "c5a5f02adf603a7cb6f59f7e265406c5",
    key: "VideoPlayback",
    icon: "VideoPlayback",
    moduleType: ['set', 'operation'],
    type: "config"
  },
  {
    path: "/FaceManage",
    name: "FaceManage",
    key: "FaceManage",
    component: faceModule.component,
    title: "人脸识别",
    featureUuid: "5b244788df50961e0abdf535677e221d",
    children: faceModule.children,
    moduleType: ['set', 'operation'],
    icon: "FaceManage",
    type: "app"
    // redirect: "/FaceManage" //设置默认子路由
  },
  {
    path: "/ResidentManage",
    name: "ResidentManage",
    component: resident,
    title: "居民管理",
    featureUuid: "516082deb361fce0c984e06566f89d61,9456b0f631a14c8cb663a148dac842d2,d3a4c79cb27245febf2c4e3540cc9448",
    key: "ResidentManage",
    icon: "residentManage",
    moduleType: ['set'],
    type: "config"
  },
  {
    path: "/EquipmentMange",
    name: "EquipmentMange",
    key: "EquipmentMange",
    component: equipmentManage,
    title: "设备资源",
    featureUuid: "4fbd541ddc81715ba430e7b5108c6bfb,fbb333122e3047a1a17fa1a2f7b47f80",
    icon: "equipmentMange",
    moduleType: ['set'],
    type: "config"
  },
  {
    path: "/BuildingsHouse",
    name: "BuildingsHouse",
    key: "BuildingsHouse",
    component: buildingHouse,
    title: "楼栋房屋",
    featureUuid: "c03c571ca244ff8a0f5178e3a339c9a8",
    icon: "buildingsHouse",
    moduleType: ['set'],
    type: "config"
  },
  {
    path: "/UnitMange",
    name: "UnitMange",
    key: "UnitMange",
    component: unitManage,
    title: "单位管理",
    featureUuid: "d1e06885fdcf62db3d608f9390c0d517",
    icon: "unitMange",
    moduleType: ['set'],
    type: "config"
  },
  {
    path: "/AreaManagement",
    name: "AreaManagement",
    component: AreaManagement,
    key: "AreaManagement",
    title: "区域管理",
    featureUuid: "79445bc3b80e4a22b8fd37582321dbdb",
    icon: "areamanagement",
    moduleType: ['set', 'operation'],
    type: "config"
  },
  {
    path: "/user",
    name: "user",
    key: "user",
    component: user.component,
    title: "用户管理",
    featureUuid: "e8513c43a7b8a1599bd696953060d707",
    children: user.children,
    moduleType: ['set'],
    icon: "userManage",
    type: "app"
  },
  {
    path: "/PrewarnMegatemp",
    name: "PrewarnMegatemp",
    featureUuid: "0e3f7a99b8714b21a472737b0a12dc28",
    component: PrewarnMegatemp,
    title: "高温预警",
    icon: "prewarnMegatemp",
    moduleType: ['operation'],
    type: "config"
  },
  {
    path: "/SystemConfig",
    name: "SystemConfig",
    key: "SystemConfig",
    component: sysConfig.component,
    title: "系统配置",
    featureUuid: "90b216a5ac9a46b1bc47acc6c376c31e",
    moduleType: ['set', 'operation'],
    children: sysConfig.children,
    icon: "SystemConfig",
    moduleType: ['set'],
    type: "config"
  },
  {
    path: "/log",
    name: "log",
    key: "log",
    component: log.component,
    featureUuid: "8c4ba218134857f9d31ceefe3449bf48",
    title: "系统日志",
    children: log.children,
    moduleType: [],
    icon: "log",
    type: "app"
  },
  {
    path: "/PersonMange",
    name: "PersonMange",
    key: "PersonMange",
    featureUuid: "3cd14b99ea694067a384f5dc78d312da,8bccb17924c928ccfc93a320e399dfc5",
    component: personManage,
    title: "人员管理",
    icon: "personMange",
    moduleType: ['set'],
    type: "config"
  },
  {
    path: "/VisitorManage",
    name: "VisitorManage",
    key: "VisitorManage",
    featureUuid: "9266115eeb6f8a2f68494c0510f981f6",
    component: VistorMangeSubRoute,
    title: "访客管理",
    children: vistorManage,
    moduleType: ['set', 'operation'],
    icon: "VisitorManage",
    type: "app"
  },
  {
    path: "/MapConfig",
    name: "MapConfig",
    key: "MapConfig",
    featureUuid: "91f6c6f969804c9b94c06945826f7d8e",
    component: MapConfig,
    title: "地图配置",
    icon: "MapConfig",
    moduleType: ['set'],
    type: "config"
  },
  {
    path: "/MapOperate",
    name: "MapOperate",
    key: "MapOperate",
    component: MapOperate,
    title: "地图操作",
    featureUuid: "7640d45e46a3444db50ed39ad6ebb155",
    icon: "MapOperate",
    moduleType: ['operation'],
    type: "config"
  },
  {
    path: "/BayonetManage",
    name: "BayonetManage",
    key: "BayonetManage",
    featureUuid: "dcec26f5ac5347afbb46432bb39b7a53",
    component: BayonetManage.component,
    title: "车辆识别",
    children: BayonetManage.children,
    icon: "BayonetManage",
    moduleType: ['set', 'operation'],
    type: "app"
    // redirect: "/FaceManage" //设置默认子路由
  },
  {
    path: "/Hardware",
    name: "Hardware",
    key: "Hardware",
    featureUuid: "a85b9a49578d4b30bf17a745c9de4710",
    component: Hardware,
    title: "实有装备",
    icon: "equipmentMange",
    moduleType: ['set'],
    type: "config"
  },
  {
    path: "/CarManage",
    name: "CarManage",
    key: "CarManage",
    component: CarManage,
    title: "车辆登记",
    featureUuid: "b0838cfdfcb64e6ea26a4e5b94c8ceec",
    icon: "CarManage",
    moduleType: ['set'],
    type: "config"
  },
  {
    path: "/DeviceStatus",
    name: "DeviceStatus",
    key: "DeviceStatus",
    component: DeviceStatus,
    featureUuid: "f5eb3d2171e6475e891e015d910184fe",
    title: "设备状态",
    icon: "DeviceStatus",
    moduleType: ['operation'],
    type: "config"
  },
  {
    path: "/CommunityBoard",
    name: "CommunityBoard",
    key: "CommunityBoard",
    featureUuid: "0234a23034484a3ab95f4c7617803ee9,601a4fde6f154d6f9f4203c6cba99e37",
    component: CommunityBoard.component,
    title: "社区看板",
    children: CommunityBoard.children,
    icon: "communityBoard",
    type: "config",
    moduleType: ['operation'],
    redirect: "/CommunityBoard/CommunityBoardHome"
  }
];

export const constantRouterMap = [
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
export function getRoute(data = [], istest) {
  let routerArr = [{
    path: "/Home",
    name: "Home",
    component: Home,
    title: "首页"
  }];
  for (let j = 0; j < allChildrenRouter.length; j++) {
    for (let i = 0, len = data.length; i < len; i++) {
      if (allChildrenRouter[j].featureUuid.indexOf(data[i].featureUuid) !== -1) {
        Object.assign(data[i], allChildrenRouter[j]);
        data[i].title = data[i].nodeName;
        routerArr.push(data[i]);
        break;
      }
    }
  }
  // console.log(routerArr);
  return [
    {
      path: "/",
      name: "MainLayout",
      component: MainLayout,
      redirect: "Home",
      children: routerArr
    }
  ];
}
export default new Router({
  // mode: 'history', //后端支持可开
  mode: "hash",
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
