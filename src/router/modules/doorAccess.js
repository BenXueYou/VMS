// import DoorControl from "@/pages/doorControl/views/DoorControl";
const DoorControl = () => import(/* webpackChunkName: "DoorControl" */ '@/pages/doorControl/views/DoorControl');

// 门禁控制权限 高级设置
const AntiBack = () => import(/* webpackChunkName: "DoorControl" */ '@/pages/doorControl/views/doorAccessSetting/AntiBack');
const FirstCardOpen = () => import(/* webpackChunkName: "DoorControl" */ '@/pages/doorControl/views/doorAccessSetting/FirstCardOpen');
const Interlocking = () => import(/* webpackChunkName: "DoorControl" */ '@/pages/doorControl/views/doorAccessSetting/Interlocking');
const LinkageAction = () => import(/* webpackChunkName: "DoorControl" */ '@/pages/doorControl/views/doorAccessSetting/LinkageAction');
const ManMakeUpOpen = () => import(/* webpackChunkName: "DoorControl" */ '@/pages/doorControl/views/doorAccessSetting/ManMakeUpOpen');
const PublicMessage = () => import(/* webpackChunkName: "DoorControl" */ '@/pages/doorControl/views/doorAccessSetting/PublicMessage');
const WayMakeUpOpen = () => import(/* webpackChunkName: "DoorControl" */ '@/pages/doorControl/views/doorAccessSetting/WayMakeUpOpen');

// 门禁通行权限
const AccessCaseConfig = () => import(/* webpackChunkName: "DoorControl" */ '@/pages/doorControl/views/doorAccessConfig/AccessCaseConfig');
const AccessGroupConfig = () => import(/* webpackChunkName: "DoorControl" */ '@/pages/doorControl/views/doorAccessConfig/AccessGroupConfig');
const AccessTimeConfig = () => import(/* webpackChunkName: "DoorControl" */ '@/pages/doorControl/views/doorAccessConfig/AccessTimeConfig');

// 记录检索
const DoorAccessRecord = () => import(/* webpackChunkName: "DoorControl" */ '@/pages/doorControl/views/recordSearch/DoorAccessRecord');
const DoorAlarmRecord = () => import(/* webpackChunkName: "DoorControl" */ '@/pages/doorControl/views/recordSearch/DoorAlarmRecord');
const DoorDialogRecord = () => import(/* webpackChunkName: "DoorControl" */ '@/pages/doorControl/views/recordSearch/DoorDialogRecord');

// 门状态
const DoorStatus = () => import(/* webpackChunkName: "DoorControl" */ '@/pages/doorControl/views/doorStatus/DoorStatus');


// 高级配置子路由数组
const doorAccessSetting = [
  {
    path: "Interlocking",
    name: "Interlocking",
    component: Interlocking,
    title: "互锁"
  },
  {
    path: "AntiBack",
    name: "AntiBack",
    component: AntiBack,
    title: "反潜回"
  },
  {
    path: "FirstCardOpen",
    name: "FirstCardOpen",
    component: FirstCardOpen,
    title: "首卡开门"
  },
  {
    path: "ManMakeUpOpen",
    name: "ManMakeUpOpen",
    component: ManMakeUpOpen,
    title: "多人组合开门"
  },
  {
    path: "WayMakeUpOpen",
    name: "WayMakeUpOpen",
    component: WayMakeUpOpen,
    title: "多验证方式组合开门"
  },
  {
    path: "LinkageAction",
    name: "LinkageAction",
    component: LinkageAction,
    title: "联动动作"
  },
  {
    path: "PublicMessage",
    name: "PublicMessage",
    component: PublicMessage,
    title: "发布公告"
  },
  {
    path: "AccessCaseConfig",
    name: "AccessCaseConfig",
    component: AccessCaseConfig,
    title: "特殊日期"
  },
  {
    path: "AccessGroupConfig",
    name: "AccessGroupConfig",
    component: AccessGroupConfig,
    title: "权限组"
  },
  {
    path: "AccessTimeConfig",
    name: "AccessTimeConfig",
    component: AccessTimeConfig,
    title: "通行时间"
  },
  {
    path: "DoorAccessRecord",
    name: "DoorAccessRecord",
    component: DoorAccessRecord,
    title: "门禁记录"
  },
  {
    path: "DoorAlarmRecord",
    name: "DoorAlarmRecord",
    component: DoorAlarmRecord,
    title: "报警记录"
  },
  {
    path: "DoorDialogRecord",
    name: "DoorDialogRecord",
    component: DoorDialogRecord,
    title: "通话记录"
  },
  {
    path: "DoorStatus",
    name: "DoorStatus",
    component: DoorStatus,
    title: "门状态"
  },
  {
    path: "/",
    redirect: "AccessGroupConfig"
  }
];
const doorAccessMap =
{
  path: "/DoorControl",
  name: "DoorControl",
  component: DoorControl,
  title: "门禁管理",
  children: doorAccessSetting,
  icon: "doorControl",
  type: "app",
  redirect: '/DoorControl/AccessGroupConfig' //设置默认子路由
};

export default doorAccessMap;
