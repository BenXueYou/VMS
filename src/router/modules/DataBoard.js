const CommunityBoard = () =>
  import(
    /* webpackChunkName: "CommunityBoard" */ "@/pages/DataBoard/CommunityBoard"
  );
const ActualBuildHouse = () =>
  import(
    /* webpackChunkName: "ActualBuildHouse" */ "@/pages/DataBoard/ActualBuildHouse/ActualBuildHouse"
  );
const ActualPopwerStatistics = () =>
  import(
    /* webpackChunkName: "ActualPopwerStatistics" */ "@/pages/DataBoard/ActualPopwerStatistics/ActualPopwerStatistics"
  );
const FacePerception = () =>
  import(
    /* webpackChunkName: "ActualPopwerStatistics" */ "@/pages/DataBoard/FacePerception/FaceStatistics"
  );
const CarPerception = () =>
  import(
    /* webpackChunkName: "ActualPopwerStatistics" */ "@/pages/DataBoard/FacePerception/CarStatistics"
  );
const DoorPerception = () =>
  import(
    /* webpackChunkName: "ActualPopwerStatistics" */ "@/pages/DataBoard/FacePerception/DoorStatistics"
  );
const ActualPopulation = () =>
  import(
    /* webpackChunkName: "ActualPopulation" */ "@/pages/DataBoard/ActualPopulation/ActualPopulation"
  );
const ActualUnit = () =>
  import(
    /* webpackChunkName: "ActualUnit" */ "@/pages/DataBoard/ActualUnit/ActualUnit"
  );
const CommunityBoardHome = () =>
  import(
    /* webpackChunkName: "CommunityBoardHome" */ "@/pages/DataBoard/components/CommunityBoardHome"
  );
const PersonCompareCount = () =>
  import(
    /* webpackChunkName: "CommunityBoardHome" */ "@/pages/DataBoard/components/PersonCompareCount"
  );
const DefanceDev = () =>
  import(
    /* webpackChunkName: "CommunityBoardHome" */ "@/pages/DataBoard/defanceDev/views/DefanceDev"
  );
const ChildRoutes = [
  {
    path: "ActualPopulation",
    name: "ActualPopulation",
    component: ActualPopulation,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "实有人口"
  },
  {
    path: "FacePerception",
    name: "FacePerception",
    component: FacePerception,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "人脸感知"
  },
  {
    path: "CarPerception",
    name: "CarPerception",
    component: CarPerception,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "车辆感知"
  },
  {
    path: "DoorPerception",
    name: "DoorPerception",
    component: DoorPerception,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "开门记录"
  },
  {
    path: "ActualUnit",
    name: "ActualUnit",
    component: ActualUnit,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "实有单位"
  },
  {
    path: "DataBoardHome",
    name: "DataBoardHome",
    component: CommunityBoardHome,
    meta: {
      keepAlive: false,
    },
    title: "看板首页"
  },
  {
    path: "PersonCompareCount",
    name: "PersonCompareCount",
    component: PersonCompareCount,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "感知页面"
  },
  {
    path: "ActualBuildHouse",
    name: "ActualBuildHouse",
    component: ActualBuildHouse,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "实有房屋"
  },
  {
    path: "ActualPopwerStatistics",
    name: "ActualPopwerStatistics",
    component: ActualPopwerStatistics,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "力量和装备统计"
  },
  {
    path: "ActualPopulation",
    name: "ActualPopulation",
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    component: ActualPopulation,
    title: "实有人口"
  },
  {
    path: "DefanceDev",
    name: "DefanceDev",
    component: DefanceDev,
    meta: {
      keepAlive: false, //此组件不需要被缓存
    },
    title: "安防设施"
  }
];
const DataBoardRouter = {
  path: "/DataBoard",
  name: "DataBoard",
  component: CommunityBoard,
  title: "数据看板",
  children: ChildRoutes,
  icon: "equipmentMange",
  type: "app",
  redirect: "/DataBoard/DataBoardHome" //设置默认子路由
};

export default DataBoardRouter;
