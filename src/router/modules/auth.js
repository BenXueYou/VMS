const user = () => import("@/pages/user/user");

const accout = () => import("@/pages/user/views/accout");
const role = () => import("@/pages/user/views/role");

const userChildRoutes = [
  {
    path: "accout",
    name: "accout",
    component: accout,
    title: "账户管理"
  },
  {
    path: "role",
    name: "role",
    component: role,
    title: "角色管理"
  }
];
const userMap = {
  path: "/user",
  name: "user",
  component: user,
  title: "日志管理",
  children: userChildRoutes,
  icon: "userManage",
  type: "app",
  redirect: "/user/" //设置默认子路由
};

export default userMap;
