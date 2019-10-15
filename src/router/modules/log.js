const loglog= () => import("@/pages/log/log");

const login = () => import("@/pages/log/views/login");
const set = () => import("@/pages/log/views/set");
const operator = () => import("@/pages/log/views/operator");

const logChildRoutes = [
  {
    path: "login",
    name: "login",
    component: login,
    title: "登陆日志"
  },
  {
    path: "set",
    name: "set",
    component: set,
    title: "配置日志"
  },
  {
    path: "operator",
    name: "operator",
    component: operator,
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
