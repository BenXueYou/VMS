// 访客管理
// 常规写法
// import AppointInviteRecord from "@/pages/VisitorManage/views/vistorRecord/AppointInviteRecord";
// import VistorList from "@/pages/VisitorManage/views/vistorRecord/VistorList";
// import VistorOpenRecord from "@/pages/VisitorManage/views/vistorRecord/VistorOpenRecord";
// import VistorRecord from "@/pages/VisitorManage/views/vistorRecord/VistorRecord";
// import VistorNotificationSet from "@/pages/VisitorManage/views/vistorSet/VistorNotificationSet";
// import VistorSignOff from "@/pages/VisitorManage/views/vistorSet/VistorSignOff";
// import VistorBlacklist from "@/pages/VisitorManage/views/vistorBlacklist/VistorBlacklist";
// import VistorBlacklistAlarm from "@/pages/VisitorManage/views/vistorBlacklist/VistorBlacklistAlarm";
// import VistorAccessConfig from "@/pages/VisitorManage/views/vistorAccess/VistorAccessConfig";

// 懒加载
const AppointInviteRecord = () => import(/* webpackChunkName: "VisitorManage" */ '@/pages/VisitorManage/views/vistorRecord/AppointInviteRecord')
const VistorList = () => import(/* webpackChunkName: "VisitorManage" */ '@/pages/VisitorManage/views/vistorRecord/VistorList')
const VistorOpenRecord = () => import(/* webpackChunkName: "VisitorManage" */ '@/pages/VisitorManage/views/vistorRecord/VistorOpenRecord')
const VistorRecord = () => import(/* webpackChunkName: "VisitorManage" */ '@/pages/VisitorManage/views/vistorRecord/VistorRecord')
const VistorNotificationSet = () => import(/* webpackChunkName: "VisitorManage" */ '@/pages/VisitorManage/views/vistorSet/VistorNotificationSet')
const VistorSignOff = () => import(/* webpackChunkName: "VisitorManage" */ '@/pages/VisitorManage/views/vistorSet/VistorSignOff')
const VistorBlacklist = () => import(/* webpackChunkName: "VisitorManage" */ '@/pages/VisitorManage/views/vistorBlacklist/VistorBlacklist')
const VistorBlacklistAlarm = () => import(/* webpackChunkName: "VisitorManage" */ '@/pages/VisitorManage/views/vistorBlacklist/VistorBlacklistAlarm')
const VistorAccessConfig = () => import(/* webpackChunkName: "VisitorManage" */ '@/pages/VisitorManage/views/vistorAccess/VistorAccessConfig')

// 访客系统子路由
const vistorSysRouter = [
  {
    path: "AppointInviteRecord",
    name: "AppointInviteRecord",
    component: AppointInviteRecord,
    title: "预约邀请记录"
  },
  {
    path: "VistorList",
    name: "VistorList",
    component: VistorList,
    title: "访客列表"
  },
  {
    path: "VistorOpenRecord",
    name: "VistorOpenRecord",
    component: VistorOpenRecord,
    title: "访客开门记录"
  },
  {
    path: "VistorRecord",
    name: "VistorRecord",
    component: VistorRecord,
    title: "访客记录"
  },
  {
    path: "VistorNotificationSet",
    name: "VistorNotificationSet",
    component: VistorNotificationSet,
    title: "访客通知配置"
  },
  {
    path: "VistorSignOff",
    name: "VistorSignOff",
    component: VistorSignOff,
    title: "访客签离"
  },
  {
    path: "VistorBlacklist",
    name: "VistorBlacklist",
    component: VistorBlacklist,
    title: "访客黑名单"
  },
  {
    path: "VistorBlacklistAlarm",
    name: "VistorBlacklistAlarm",
    component: VistorBlacklistAlarm,
    title: "访客黑名单报警"
  },
  {
    path: "VistorAccessConfig",
    name: "VistorAccessConfig",
    component: VistorAccessConfig,
    title: "访客权限组"
  },
  {
    path: "*",
    redirect: "VistorRecord"
  }
];

export default vistorSysRouter;