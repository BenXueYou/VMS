const SystemConfig = () =>
  import(/* webpackChunkName: "FaceModule" */ "@/pages/systemConfig/views/SystemConfig");
const MapSet = () =>
  import(/* webpackChunkName: "FaceModule" */ "@/pages/systemConfig/views/MapSet");

const routes = [
  {
    path: "MapSet",
    name: "MapSet",
    meta: {
      keepAlive: true
    },
    component: MapSet
  },
  {
    path: "/",
    redirect: "MapSet"
  }
];
export default {
  path: "/SystemConfig",
  name: "SystemConfig",
  component: SystemConfig,
  title: "系统配置",
  children: routes,
  icon: "SystemConfig",
  type: "config",
  redirect: "/SystemConfig/" //设置默认子路由
};
