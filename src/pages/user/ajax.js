import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
// import store from "@/store/store.js";

let userUrl = RestApi.api.userUrl;

export function getAccout(params) {
  let { getAccoutUrl: url } = userUrl;
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
export function addUserDetailUrl(data) {
  let { addUserDetailUrl: url } = userUrl;
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
