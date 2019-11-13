import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
// import Axios from "axios";
// import store from "@/store/store.js";

let userUrl = RestApi.api.userUrl;
let accountApi = RestApi.api.userUrl.accountApi;
export function getAccout(params) {
  let { getAccoutUrl: url } = userUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getNewTree(params) {
  let { getNewTreeUrl: url } = userUrl;
  return axios({
    method: "POST",
    url,
    data: params
  });
}
export function getHomeMenu(params) {
  let { getHomeMenuUrl: url } = userUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getAuth(params) {
  let { getAuthUrl: url } = userUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getResource(params) {
  let { getResourceUrl: url } = userUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getUserList(params) {
  console.log(params);
  let { getUserListUrl: url } = userUrl;
  console.log(url);
  return axios({
    method: "get",
    url,
    params
  });
}
export function getUserDetail(params) {
  let { getUserDetailUrl: url } = userUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getResourceAuth(params) {
  let { getResourceAuthUrl: url } = userUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
export function addUserDetailUrl(data) {
  let { addUserDetailUrl: url } = userUrl;
  return axios({
    method: "POST",
    url,
    data
  });
}
export function distruiAccout(data) {
  let { distruiAccoutUrl: url } = userUrl;
  return axios({
    method: "POST",
    url,
    data
  });
}
export function editUserDetailUrl(data) {
  let { editUserDetailUrl: url } = userUrl;
  return axios({
    method: "PUT",
    url,
    data
  });
}
export function deleteUser(data) {
  let { deleteUserUrl: url } = userUrl;
  return axios({
    method: "delete",
    url,
    data
  });
}
export function updateUserStatus(data) {
  let { updateUserStatusUrl: url } = userUrl;
  return axios({
    method: "PUT",
    url,
    data
  });
}
/** ***************************账号管理****************************** */
// add
export function addAccountApi(data) {
  let url = accountApi.addAccountApi;
  return axios({
    method: "POST",
    url,
    data
  });
}

// get
export function getAccountListApi(data) {
  let url = accountApi.getAccountListApi;
  return axios({
    method: "GET",
    url,
    params: data
  });
}

// 账号详情
export function getAccountDetail(data) {
  let url = accountApi.getAccountDetailApi;
  return axios({
    method: "GET",
    url,
    params: data
  });
}

// put修改账号
export function putAccountApi(data) {
  let url = accountApi.putAccountApi(data.accountUuid);
  return axios({
    method: "PUT",
    url,
    data
  });
}

// put修改密码
export function putAccountPWDApi(data) {
  let url = accountApi.putAccountPWDApi(data.accountName);
  return axios({
    method: "PUT",
    url,
    data
  });
}

// 重置密码
export function resetAccountPWDApi(data) {
  let url = accountApi.resetAccountPWDApi;
  return axios({
    method: "PUT",
    url,
    data
  });
}

// 删除账号
export function deleteAccountApi(data) {
  let url = accountApi.deleteAccountApi;
  return axios({
    method: "DELETE",
    url,
    data
  });
}

// 启用账号
export function switchAccountApi(data) {
  let url = accountApi.switchAccountApi;
  return axios({
    method: "POST",
    url,
    data
  });
}

// 账号分配角色

export function parcelRoleAccountApi(data) {
  let url = accountApi.editRoleAccountApi;
  return axios({
    method: "POST",
    url,
    data
  });
}
