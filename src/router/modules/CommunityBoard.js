const CommunityBoard = () =>
  import(
    /* webpackChunkName: "CommunityBoard" */ "@/pages/communityBoard/CommunityBoard"
  );
const ActualBuildHouse = () =>
  import(
    /* webpackChunkName: "ActualBuildHouse" */ "@/pages/communityBoard/ActualBuildHouse/ActualBuildHouse"
  );
const ActualPopwerStatistics = () =>
  import(
    /* webpackChunkName: "ActualPopwerStatistics" */ "@/pages/communityBoard/ActualPopwerStatistics/ActualPopwerStatistics"
  );
const ActualPopulation = () =>
  import(
    /* webpackChunkName: "ActualPopulation" */ "@/pages/communityBoard/ActualPopulation/ActualPopulation"
  );
const ActualUnit = () =>
  import(
    /* webpackChunkName: "ActualUnit" */ "@/pages/communityBoard/ActualUnit/ActualUnit"
  );
const CommunityBoardHome = () =>
  import(
    /* webpackChunkName: "CommunityBoardHome" */ "@/pages/communityBoard/components/CommunityBoardHome"
  );
const DefanceDev = () =>
  import(
    /* webpackChunkName: "CommunityBoardHome" */ "@/pages/communityBoard/defanceDev/views/DefanceDev"
  );
const ChildRoutes = [
  {
    path: "/CommunityBoard/ActualPopulation",
    name: "ActualPopulation",
    component: ActualPopulation,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "实有人口"
  },
  {
    path: "/CommunityBoard/ActualUnit",
    name: "ActualUnit",
    component: ActualUnit,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "实有单位"
  },
  {
    path: "/CommunityBoard/CommunityBoardHome",
    name: "CommunityBoardHome",
    component: CommunityBoardHome,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "看板首页"
  },
  {
    path: "/CommunityBoard/ActualBuildHouse",
    name: "ActualBuildHouse",
    component: ActualBuildHouse,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "实有房屋"
  },
  {
    path: "/CommunityBoard/ActualPopwerStatistics",
    name: "ActualPopwerStatistics",
    component: ActualPopwerStatistics,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "力量和装备统计"
  },
  {
    path: "/CommunityBoard/ActualPopulation",
    name: "ActualPopulation",
    component: ActualPopulation,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "实有人口"
  },
  {
    path: "/CommunityBoard/DefanceDev",
    name: "DefanceDev",
    component: DefanceDev,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "安防设施"
  }
];
const CommunityBoardRouter = {
  path: "/CommunityBoard",
  name: "CommunityBoard",
  component: CommunityBoard,
  title: "社区看板",
  children: ChildRoutes,
  icon: "equipmentMange",
  type: "app",
  redirect: "/CommunityBoard/CommunityBoardHome" //设置默认子路由
};

export default CommunityBoardRouter;
