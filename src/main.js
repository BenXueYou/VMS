// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Vuex from "vuex";
import store from "@/store/store.js";
import Axios from "@/utils/Request";
import ElementUI from "element-ui";

import "./style/element-variables.scss";
import "./style/index.scss";
import App from "./App";
import router from "./router";

// 权限控制中枢 路由守卫
import "./permission";
import "./directives";
// import './dir';

import echarts from "echarts";
import "echarts-gl";
import { EventBusPlugin as EventBus } from "@/utils/EventBus";
import Common from "@/utils/Common.js";
import Toast from "@/utils/Toast.js";

// 注册模块http.js
import HomeAjax from "@/pages/home/utils/HomeAjax.js";
import GuangTuoUI from "@/common/package/index.js";

import LogSearchHttp from "@/pages/doorControl/utils/LogSearchHttp.js";
import HouseHttp from "@/pages/buildingsHouse/utils/HouseHttp.js";
import UnitHttp from "@/pages/unitMange/utils/UnitHttp.js";
import equipmentHttp from "@/pages/hardwareManage/utils/UnitHttp.js";

import DoorSetAjax from "@/pages/doorControl/utils/DoorAccessSetHttp.js";
import ResidentHttp from "@/pages/residentManage/utils/ResidentHttp.js";
import LoginAjax from "@/pages/login/utils/LoginAjax.js";
import SearchFaceHttp from "@/pages/faceModule/views/searchFaceWithFace/utils/SearchFaceHttp.js";
import JudgeHttp from "@/pages/faceModule/views/judgeAnalysis/utils/JudgeHttp.js";
import ModuleCountHttp from "@/pages/faceModule/views/moduleCount/utils/ModuleCountHttp.js";
import StatisticHttp from "@/pages/faceModule/views/statisticalForms/util/StatisticHttp.js";
import FactTragicHttp from "@/pages/faceModule/views/companion/util/FactTragicHttp.js";
import FaceControlHttp from "@/pages/faceModule/views/faceControl/utils/FaceControlHttp.js";
import IntelModelHttp from "@/pages/faceModule/views/intelModel/utils/IntelModelHttp.js";
import ProjectManageAjax from "@/pages/projectManage/utils/ProjectManageAjax.js";
import MapConfigHttp from "@/pages/mapConfig/utils/MapConfigHttp.js";
import MapOperateHttp from "@/pages/mapOperate/utils/MapOperateHttp.js";
import SysConfigHttp from "@/pages/systemConfig/utils/SysConfigHttp.js";

import FacultyHttp from "@/pages/schoolBoard/faculty/utils/facultyHttp.js"; import * as BuildHouseFileAjax from "@/pages/communityBoard/utils/buildHouseFileAjax.js";
import DefanceDevHttp from "@/pages/communityBoard/defanceDev/utils/DefanceDevHttp.js";

Vue.prototype.$echarts = echarts;
Vue.prototype.$BuildHouseFileAjax = BuildHouseFileAjax;

Vue.prototype.$http = Axios;
Vue.config.productionTip = false;
Vue.prototype.$coordtransform = require("coordtransform");

const httpArr = [Vuex, ElementUI, EventBus, Common,
  Toast, HomeAjax, GuangTuoUI, HouseHttp, UnitHttp,
  SearchFaceHttp, LogSearchHttp, JudgeHttp,
  ModuleCountHttp, StatisticHttp, FactTragicHttp,
  FaceControlHttp, IntelModelHttp, DoorSetAjax,
  ResidentHttp, LoginAjax, ProjectManageAjax, MapConfigHttp,
  MapOperateHttp, SysConfigHttp, FacultyHttp,
  DefanceDevHttp, equipmentHttp
];
Vue.use(DefanceDevHttp);
// Vue.use(BuildHouseFileAjax);

httpArr.forEach(element => {
  Vue.use(element);
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
