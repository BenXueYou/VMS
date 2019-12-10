const FaceManage = () =>
  import(/* webpackChunkName: "FaceModule" */ "@/pages/faceModule/faceManage");
const FaceControl = () =>
  import(
    /* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/faceControl/view/FaceControl"
  );
const FaceHome = () =>
  import(/* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/Home");
const faceDB = () =>
  import(
    /* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/facedb/faceDB"
  );
const FaceRecord = () =>
  import(
    /* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/FaceRecord"
  );
const CompareRecord = () =>
  import(
    /* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/CompareRecord"
  );
const IntelModel = () =>
  import(
    /* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/intelModel/view/IntelModel"
  );
const OVO = () =>
  import(/* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/OVO");
const searchFaceWithFace = () =>
  import(
    /* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/searchFaceWithFace/view/SearchFaceWithFace"
  );
const judgeAnalysis = () =>
  import(
    /* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/judgeAnalysis/view/JudgeAnalysis"
  );
const ModuleCount = () =>
  import(
    /* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/moduleCount/view/ModuleCount"
  );
const faceAlarm = () =>
  import(
    /* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/facealarm/faceAlarm"
  );
const PersonFlowAnalysis = () =>
  import(
    /* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/statisticalForms/view/PersonFlowAnalysis"
  );
const PersonCompareCount = () =>
  import(
    /* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/statisticalForms/view/PersonCompareCount"
  );
const FaceAnalysisTable = () =>
  import(
    /* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/statisticalForms/view/FaceAnalysisTable"
  );
const Companion = () =>
  import(
    /* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/companion/view/Companion"
  );
const PersonTrace = () =>
  import(
    /* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/personTrace/view/PersonTrace"
  );
const Settings = () =>
  import(
    /* webpackChunkName: "FaceModule" */ "@/pages/faceModule/views/settings/view/Settings"
  );

const routes = [
  {
    path: "FaceHome",
    name: "FaceHome",
    meta: {
      keepAlive: true // 不需要缓存
    },
    component: FaceHome
  },
  {
    path: "faceAlarm",
    name: "faceAlarm",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: faceAlarm
  },
  {
    path: "IntelModel",
    name: "IntelModel",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: IntelModel
  },
  {
    path: "CompareRecord",
    name: "CompareRecord",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: CompareRecord
  },
  {
    path: "FaceRecord",
    name: "FaceRecord",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: FaceRecord
  },
  {
    path: "faceDB",
    name: "faceDB",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: faceDB
  },
  {
    path: "FaceControl",
    name: "FaceControl",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: FaceControl
  },
  {
    path: "OVO",
    name: "OVO",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: OVO
  },
  {
    path: "searchFaceWithFace",
    name: "searchFaceWithFace",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: searchFaceWithFace
  },
  {
    path: "judgeAnalysis",
    name: "judgeAnalysis",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: judgeAnalysis
  },
  {
    path: "PersonFlowAnalysis",
    name: "PersonFlowAnalysis",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: PersonFlowAnalysis
  },
  {
    path: "PersonCompareCount",
    name: "PersonCompareCount",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: PersonCompareCount
  },
  {
    path: "FaceAnalysisTable",
    name: "FaceAnalysisTable",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: FaceAnalysisTable
  },
  {
    path: "Companion",
    name: "Companion",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: Companion
  },
  {
    path: "PersonTrace",
    name: "PersonTrace",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: PersonTrace
  },
  {
    path: "Settings",
    name: "Settings",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: Settings
  },
  {
    path: "ModuleCount",
    name: "ModuleCount",
    meta: {
      keepAlive: true // 需要缓存
    },
    component: ModuleCount
  },
  {
    path: "/",
    redirect: "FaceHome"
  }
];
export default {
  path: "/FaceManage",
  name: "FaceManage",
  component: FaceManage,
  title: "门禁管理",
  children: routes,
  icon: "faceManage",
  type: "app",
  redirect: "/FaceManage/" //设置默认子路由
};
