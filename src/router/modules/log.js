const loglog= () => import("@/pages/log/log");

const loginLog = () => import("@/pages/log/views/login");
const setLog = () => import("@/pages/log/views/set");
const operatorLog = () => import("@/pages/log/views/operator");

const logChildRoutes = [
  {
    path: "loginLog",
    name: "loginLog",
    component: loginLog,
    title: "登陆日志"
  },
  {
    path: "setLog",
    name: "setLog",
    component: setLog,
    title: "配置日志"
  },
  {
    path: "operatorLog",
    name: "operatorLog",
    component: operatorLog,
    title: "操作日志"
  }
];
const logMap = {
  path: "/log",
  name: "log",
  component: loglog,
  title: "日志管理",
  children: logChildRoutes,
  icon: "log",
  type: "app",
  redirect: "/log/" //设置默认子路由
};

export default logMap;
