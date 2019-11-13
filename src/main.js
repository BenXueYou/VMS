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
import { EventBusPlugin as EventBus } from "@/utils/Eventbus";
import Common from "@/utils/Common.js";
import Toast from "@/utils/Toast.js";
import HomeAjax from "@/pages/home/utils/HomeAjax.js";
import GuangTuoUI from "@/common/package/index.js";
import LogSearchHttp from "@/pages/doorControl/utils/LogSearchHttp.js";
import HouseHttp from "@/pages/buildingsHouse/utils/HouseHttp.js";
import UnitHttp from "@/pages/unitMange/utils/UnitHttp.js";

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

Vue.prototype.$echarts = echarts;
Vue.prototype.$http = Axios;
Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(EventBus);
Vue.use(Common);
Vue.use(Toast);
Vue.use(HomeAjax);
Vue.use(GuangTuoUI);
Vue.use(HouseHttp);
Vue.use(UnitHttp);
Vue.use(LogSearchHttp);
Vue.use(SearchFaceHttp);
Vue.use(JudgeHttp);
Vue.use(ModuleCountHttp);
Vue.use(StatisticHttp);
Vue.use(FactTragicHttp);
Vue.use(FaceControlHttp);
Vue.use(IntelModelHttp);
Vue.use(DoorSetAjax);
Vue.use(ResidentHttp);
Vue.use(LoginAjax);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
