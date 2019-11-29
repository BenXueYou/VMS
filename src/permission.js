import router, { getRoute } from "./router";
import store from "@/store/store";
// import { Message } from 'element-ui';

// permissiom judge
/* function hasPermission(roles, permissionRoles) {
  // 去除了角色校验的权限的操作，永远都是true
  // if (roles.indexOf('admin') >= 0) return true // admin权限 直接通过
  // if (!permissionRoles) return true
  // return roles.some(role => permissionRoles.indexOf(role) >= 0)
  return true;
} */
import * as api from "@/pages/user/http/ajax.js";

const whiteList = ["/Login"]; // 不重定向白名单
let isInitRoute = false;
router.beforeEach((to, from, next) => {
  // NProgress.start() // 开启Progress
  // eslint-disable-next-line no-constant-condition
  if (
    store.state.home.Authorization &&
    store.state.home.Authorization.substr(0, 5) !== "Basic"
  ) {
    // 判断是否有token 目前先置为 true !!!!
    if (to.path === "/Login") {
      // next({ path: '/' })
      next();
      // NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    } else {
      if (!isInitRoute) {
        isInitRoute = true;
        // 这里去请求用户的权限菜单
        api
          .getHomeMenu({
            accountUuid: window.localStorage.getItem("useruuid").trim()
          })
          .then(res => {
            console.log(res);
            if (res.data.success) {
              let data = res.data.data || [];
              let getAllData = true; // 测试用的，先显示全部的菜单那
              let routerData = getRoute(data, getAllData);
              window.localStorage.setItem(
                "routerData",
                JSON.stringify(routerData)
              );
              router.addRoutes(routerData);
            }
          }).catch(() => {
            // let routerData = getRoute([], true);
            // window.localStorage.setItem("routerData", JSON.stringify(routerData));
            // router.addRoutes(routerData);
            //  当1.6的服务接口不同的情况下，保证前端代码正常调试的测试代码 ******************************************
            next('/Login');
          });
      }

      /* console.log("topath : ", to.path);
      if (store.state.user.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          const roles = res.body.role;
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
            console.log("add routes", store.state.permission.addRouters);
            router.addRoutes(store.state.permission.addRouters);// 动态添加可访问路由表
            next({ ...to, replace: true });// hack方法 确保addRoutes已完成 ,replace: true so the navigation will not leave a history record
            // router.replace(to);
          });
        }).catch((e) => {
          console.log(e);
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录');
            next({ path: '/login' });
          });
        });
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.state.user.roles, to.meta.role)) {
          next();//
        } else {
          next({ path: '/401', query: { noGoBack: true } });
          // NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        }
        // 可删 ↑
      } */
      next();
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next("/Login"); // 否则全部重定向到登录页
      // NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
});

router.afterEach(() => {
  // NProgress.done() // 结束Progress
});

/**
 * 格式化路由映射 服务器返回的类 变成路由所需要的类
 */
// eslint-disable-next-line no-unused-vars
function formateRouterMap() {}
