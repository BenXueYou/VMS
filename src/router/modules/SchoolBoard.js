const SchoolBoard = () => import(/* webpackChunkName: "SchoolBoard" */ '@/pages/schoolBoard/SchoolBoard');
const FacultyList = () => import(/* webpackChunkName: "ActualBuildHouse" */ '@/pages/SchoolBoard/faculty/Faculty');
const SchoolBoardHome = () => import(/* webpackChunkName: "SchoolBoardHome" */ '@/pages/schoolBoard/components/SchoolBoardHome');
const ChildRoutes = [

  {
    path: "FacultyList",
    name: "FacultyList",
    component: FacultyList,
    title: "在岗安保"
  },
  {
    path: "SchoolBoardHome",
    name: "SchoolBoardHome",
    component: SchoolBoardHome,
    title: "看板首页"
  },
];
const SchoolBoardRouter = {
  path: "/SchoolBoard",
  name: "SchoolBoard",
  component: SchoolBoard,
  title: "学校看板",
  children: ChildRoutes,
  icon: "equipmentMange",
  type: "app",
  redirect: "/SchoolBoard/SchoolBoardHome" //设置默认子路由
};

export default SchoolBoardRouter;
