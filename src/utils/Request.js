import axios from "axios";
import { Toast } from "@/utils/Toast.js";
import router from "@/router";
import store from "@/store/store";

let lastToastTime = -1;
// 1秒内只显示一个报错通知
const TIME_RANGE_TOAST = 1000;

// 创建axios实例
const service = axios.create({
  timeout: 60000, // 请求超时时间
  withCredentials: true // 允许携带cookie
});

// request拦截器
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    // 获取token
    let Authorization = store.state.home.Authorization;
    let projectUuid = store.state.home.projectUuid;
    config.headers["Authorization"] = Authorization;
    config.headers["projectUuid"] = projectUuid;
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    if (response.data.hasOwnProperty("success")) {
      if (response.data.success) {
        return response;
      } else if (response.data.errCode === 7000 ) {
        sessionStorage.setItem("Authorization","");
        sessionStorage.setItem("projectUuid","");
        router.replace({
          name: "Login"
        });
      } else if (response.data.msg === "令牌无效" || response.data.msg === "权限不足" ) {
        sessionStorage.setItem("Authorization","");
        sessionStorage.setItem("projectUuid","");
        Toast.error(response.data.msg);
        router.replace({
          name: "Login"
        });
      } else {
        Toast.error(response.data.msg);
        return Promise.reject("error");
      }
    } else {
      if (response.data) {
        return response;
      } else {
        Toast.error("获取本地资源请求错误！");
        return Promise.reject("error");
      }
    }
  },
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
  //  const res = response.data;
  //     if (res.code !== 20000) {
  //       Message({
  //         message: res.message,
  //         type: 'error',
  //         duration: 5 * 1000
  //       });
  //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //           confirmButtonText: '重新登录',
  //           cancelButtonText: '取消',
  //           type: 'warning'
  //         }).then(() => {
  //           store.dispatch('FedLogOut').then(() => {
  //             location.reload();// 为了重新实例化vue-router对象 避免bug
  //           });
  //         })
  //       }
  //       return Promise.reject('error');
  //     } else {
  //       return response.data;
  //     }
  error => {
    console.log(error); // for debug
    // 一秒内只会弹出一个报错信息
    const currentToastTime = new Date().getTime();
    if (currentToastTime - lastToastTime > TIME_RANGE_TOAST) {
      Toast.error("请求错误！");
    }
    lastToastTime = new Date().getTime();
    return Promise.reject(error);
  }
);

export default service;
