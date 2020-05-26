import router, { getRoute } from "./router";
import store from "@/store/store";
import Vue from 'vue';
// import { Message } from 'element-ui';
import * as api from "@/pages/user/http/ajax.js";
const whiteList = ["/Login"]; // 不重定向白名单
let isInitRoute = false;
router.beforeEach((to, from, next) => {
  // NProgress.start() // 开启Progress
  // eslint-disable-next-line no-constant-condition
  if (
    store.state.home.Authorization &&
    store.state.home.Authorization.substr(0, 5) !== "Basic" &&
    !!sessionStorage.getItem("Authorization") &&
    window.sessionStorage.getItem("useruuid")
  ) {
    // 判断是否有token 目前先置为 true !!!!
    if (to.path === "/Login") {
      // next({ path: '/' })
      next();
    } else {
      // 判断改账户是否选择了项目
      if (to.path === "/projectManage") {
        next();
        // return;
      }
      let paramsObj = JSON.parse(Vue.prototype.$common.getQueryString("paramObj"));
      if (paramsObj) {
        store.dispatch("setProjectUuid", paramsObj.projectUuid);
        store.dispatch("setProjectType", paramsObj.projectType);
        store.dispatch("clearTagView");
        let index = window.location.href.indexOf("#");
        let suffix = window.location.href.substring(0, index + 1);
        if (paramsObj.projectType.platformType === "school") {
          store.dispatch("addTagViewItem", {
            path: "/SchoolBoard",
            name: "SchoolBoard",
            key: "SchoolBoard",
            title: "学校看板",
          });
          store.dispatch("setLocalTag", "SchoolBoardHome");
          window.location.href = `${suffix}/SchoolBoard/SchoolBoardHome`;
        } else {
          store.dispatch("addTagViewItem", {
            path: "/CommunityBoard",
            name: "CommunityBoard",
            key: "CommunityBoard",
            title: "社区看板",
          });
          store.dispatch("setLocalTag", "CommunityBoardHome");
          window.location.href = `${suffix}/CommunityBoard/CommunityBoardHome`;
        }
        setTimeout(() => {
          window.location.reload();
        }, 200);
      } else {
        if (!isInitRoute && to.path !== "/projectManage") {
          if (sessionStorage.getItem("projectUuid") !== "") {
            // 测试获取不到动态的 accountType
            isInitRoute = true;
            // 这里根据项目的uuid去请求用户的权限菜单
            getMenu();
            getAccountTypeByUserUuid(
              window.sessionStorage.getItem("useruuid").trim()
            );
          }
        }
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next("/Login"); // 否则全部重定向到登录页
    }
  }
});

router.afterEach(() => {
  // NProgress.done() // 结束Progress
});
function getMenu() {
  api
    .getHomeMenu({
      accountUuid: window.sessionStorage.getItem("useruuid").trim(),
      projectType: store.state.home.projectType.platformType
    })
    .then(res => {
      if (res.data.success) {
        let data = res.data.data || [];
        let getAllData = false; // 测试用的，先显示全部的菜单那
        let routerData = getRoute(data, getAllData);
        let setModuleList = ['全部'], operateModuleList = ['全部'];
        // 生成日志模块，下拉框的options
        routerData[0].children.forEach(element => {
          if (element.moduleType && element.moduleType.indexOf('set') !== -1) {
            setModuleList.push(element.title);
          }
          if (element.moduleType && element.moduleType.indexOf('operation') !== -1) {
            operateModuleList.push(element.title);
          }
        });
        store.dispatch("setRouterData", routerData);
        store.dispatch("setSetModuleList", setModuleList);
        store.dispatch("setOperateModuleList", operateModuleList);
        router.addRoutes(routerData);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
// 根据userUuid查询账号类型
function getAccountTypeByUserUuid(userUuid) {
  api
    .getAccountDetail({ accountUuid: userUuid })
    .then(res => {
      if (res.data.success) {
        store.dispatch("setAccountType", res.data.data.accountType);
        getAuthList();
      } else {
        alert(res.data.msg);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
// 获取权限列表
function getAuthList() {
  api
    .getAccountFeatureAuth({
      accountUuid: sessionStorage.getItem("useruuid"),
      projectType: store.state.home.projectType.platformType
    })
    .then(res => {
      if (res) {
        let data = res.data.data || [];
        let AllModulesArr = [];
        getAllModulesArr(data, AllModulesArr);
        store.dispatch("setAuthList", AllModulesArr);
      }
    }).catch((err) => {
      console.log(err);
    });
}

// 将所有的模块扁化
function getAllModulesArr(data, AllModulesData) {
  if (!data || data.length === 0) {
    return;
  }
  for (let i = 0; i < data.length; i++) {
    AllModulesData.push(data[i]);
    if (data[i].childNodes && data[i].childNodes.length !== 0) {
      getAllModulesArr(data[i].childNodes, AllModulesData);
    }
  }
}
/**
 * 格式化路由映射 服务器返回的类 变成路由所需要的类
 */
// eslint-disable-next-line no-unused-vars
function formateRouterMap() { }
