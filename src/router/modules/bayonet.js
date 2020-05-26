const bayonet = () => import("@/pages/bayonet/Bayonet");

const bayonetPreview = () => import("@/pages/bayonet/views/BayonetPreview");
const bayonetRecord = () => import("@/pages/bayonet/views/BayonetRecord");

const bayonetChildRoutes = [
  {
    path: "bayonetPreview",
    name: "bayonetPreview",
    component: bayonetPreview,
    title: "车辆识别"
  },
  {
    path: "bayonetRecord",
    name: "bayonetRecord",
    component: bayonetRecord,
    title: "过车查询"
  }
];
const bayonetMap = {
  path: "/bayonet",
  name: "bayonet",
  component: bayonet,
  title: "卡口",
  children: bayonetChildRoutes,
  icon: "bayonetManage",
  type: "app",
  redirect: "/bayonet/" //设置默认子路由
};

export default bayonetMap;
