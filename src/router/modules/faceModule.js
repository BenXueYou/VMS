const FaceManage = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/FaceManage');
const taskDB = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/taskDB');
const FaceHome = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/Home');
const faceDB = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/page/facedb/faceDB');
const FaceRecord = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/FaceRecord');
const CompareRecord = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/CompareRecord');
const IntelligentModel = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/IntelligentModel');
const OVO = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/OVO');
const searchFaceWithFace = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/searchFaceWithFace/view/SearchFaceWithFace');
const judgeAnalysis = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/judgeAnalysis/view/JudgeAnalysis');
const ModuleCount = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/moduleCount/view/ModuleCount');
const ManBodyAnalysis = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/ManBodyAnalysis');
const MBAnalysisRecord = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/MBAnalysisRecord');
const faceAlarm = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/page/search/facealarm/faceAlarm');
const faceAnalysis = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/page/search/faceanalysis/faceAnalysis');
const IGMRecord = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/page/search/IntelligentModelRecord/IMRecord');
const PersonFlowAnalysis = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/statisticalForms/view/PersonFlowAnalysis');
const PersonCompareCount = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/statisticalForms/view/PersonCompareCount');
const SingleCaptureAnalysis = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/statisticalForms/view/SingleCaptureAnalysis');
const SingleMissionAnalysis = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/statisticalForms/view/SingleMissionAnalysis');
const FaceAnalysisTable = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/statisticalForms/view/FaceAnalysisTable');
const Companion = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/companion/view/Companion');
const Settings = () => import(/* webpackChunkName: "FaceModule" */ '@/pages/faceModule/views/settings/view/Settings');

const routes = [
  {
    path: '/',
    redirect: '/FaceHome'
  },
  {
    path: '/FaceHome',
    name: 'FaceHome',
    meta: {
      keepAlive: false // 不需要缓存
    },
    component: FaceHome
  },
  {
    path: '/MBAnalysisRecord',
    name: 'MBAnalysisRecord',
    meta: {
      keepAlive: true // 不需要缓存
    },
    component: MBAnalysisRecord
  },
  {
    path: '/faceAnalysis',
    name: 'faceAnalysis',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: faceAnalysis
  },
  {
    path: '/ManBodyAnalysis',
    name: 'ManBodyAnalysis',
    meta: {
      keepAlive: false // 需要缓存
    },
    component: ManBodyAnalysis
  },
  {
    path: '/faceAlarm',
    name: 'faceAlarm',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: faceAlarm
  },
  {
    path: '/IntelligentModel',
    name: 'IntelligentModel',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: IntelligentModel
  },
  {
    path: '/CompareRecord',
    name: 'CompareRecord',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: CompareRecord
  },
  {
    path: '/FaceRecord',
    name: 'FaceRecord',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: FaceRecord
  },
  {
    path: '/faceDB',
    name: 'faceDB',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: faceDB
  },
  {
    path: '/taskDB',
    name: 'taskDB',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: taskDB
  },
  {
    path: '/OVO',
    name: 'OVO',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: OVO
  },
  {
    path: '/searchFaceWithFace',
    name: 'searchFaceWithFace',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: searchFaceWithFace
  },
  {
    path: '/judgeAnalysis',
    name: 'judgeAnalysis',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: judgeAnalysis
  },
  {
    path: '/IGMRecord',
    name: 'IGMRecord',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: IGMRecord
  },
  {
    path: '/PersonFlowAnalysis',
    name: 'PersonFlowAnalysis',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: PersonFlowAnalysis
  },
  {
    path: '/PersonCompareCount',
    name: 'PersonCompareCount',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: PersonCompareCount
  },
  {
    path: '/SingleCaptureAnalysis',
    name: 'SingleCaptureAnalysis',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: SingleCaptureAnalysis
  },
  {
    path: '/SingleMissionAnalysis',
    name: 'SingleMissionAnalysis',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: SingleMissionAnalysis
  },
  {
    path: '/FaceAnalysisTable',
    name: 'FaceAnalysisTable',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: FaceAnalysisTable
  },
  {
    path: '/Companion',
    name: 'Companion',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: Companion
  },
  {
    path: '/Settings',
    name: 'Settings',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: Settings
  },
  {
    path: '/ModuleCount',
    name: 'ModuleCount',
    meta: {
      keepAlive: true // 需要缓存
    },
    component: ModuleCount
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
  redirect: '/FaceManage/FaceHome' //设置默认子路由
};
