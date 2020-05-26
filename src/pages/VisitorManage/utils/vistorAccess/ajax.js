import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
import store from "@/store/store.js";

let pmUrl = RestApi.pmUrl;
// 获取特殊日期列表
export function getDateList(data) {
  let url = pmUrl.dateListUrl;
  return axios({
    method: "get",
    url,
    params: data
  });
}
// 获取特殊日期列表 不包括分页*****
export function getDateListAll() {
  let url = pmUrl.dateListAllUrl;
  return axios({
    method: "get",
    url
  });
}

// 获取特殊日期详情
export function getDateDetatil(data, uuid) {
  let url = pmUrl.dateDatailUrl(uuid);
  return axios({
    method: "get",
    url,
    params: data
  });
}

// 新增特殊日期
export function addNewDate(data) {
  let url = pmUrl.addNewDateUrl;
  return axios({
    method: "post",
    url,
    data
  });
}

// 获取时间段列表
export function getTimeList(data) {
  let url = pmUrl.timeListUrl;
  return axios({
    method: "get",
    url,
    params: data
  });
}
// 获取全部时间段列表  不包括分页*****
export function getTimeListAll() {
  let url = pmUrl.timeListAllUrl;
  return axios({
    method: "get",
    url
  });
}

//  获取时间段详情
export function getTimeDetail(uuid) {
  let url = pmUrl.timeDetailUrl(uuid);
  return axios({
    method: "get",
    url
  });
}

// 修改特殊日期
export function editDate(data, holidayUuid) {
  let url = pmUrl.editDateUrl(holidayUuid);
  return axios({
    method: "put",
    url,
    data
  });
}

// 删除特殊日期
export function deleteDate(holidayUuid) {
  let url = pmUrl.deleteDateUrl(holidayUuid);
  return axios({
    method: "delete",
    url
  });
}

// 新增时段
export function addNewTime(data) {
  let url = pmUrl.addNewTimeUrl;
  return axios({
    method: "post",
    url,
    data
  });
}

// 修改时段
export function editTime(data, periodUuid) {
  let url = pmUrl.editTimeUrl(periodUuid);
  return axios({
    method: "put",
    url,
    data
  });
}

// 删除时段
export function deleteTime(periodUuid) {
  let url = pmUrl.deleteTimeUrl(periodUuid);
  return axios({
    method: "DELETE",
    url
  });
}
// 获取权限列表的接口
export function getQXList(data) {
  let url = pmUrl.qxListUrl;
  return axios({
    method: "get",
    url,
    params: data
  });
}
// 获取权限详情接口
export function getQXDetail(uuid) {
  let url = pmUrl.qxDetailUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
// 新增权限组接口
export function addNewPermission(data) {
  let url = pmUrl.addNewPermissionUrl;
  return axios({
    method: "post",
    url,
    data
  });
}

// 编辑权限组接口
export function editPermission(data, groupUuid) {
  let url = pmUrl.editPermissionUrl(groupUuid);
  return axios({
    method: "put",
    url,
    data
  });
}

// 获取编辑详情
export function editPMUrl(groupUuid, params) {
  let url = pmUrl.editPMUrl(groupUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
// 删除权限组接口
export function deletePermission(groupUuid) {
  let url = pmUrl.deletePermissionUrl(groupUuid);
  return axios({
    method: "delete",
    url
  });
}
// 权限组规则下发
export function xiafa(data) {
  let url = pmUrl.xifaUrl;
  return axios({
    method: "post",
    url,
    data
  });
}
// 获取人员详情
export function staffDetail(params) {
  // params.projectUuid = window.config.projectUuid;
  params.projectUuid = store.state.home.projectUuid;
  let url = pmUrl.staffDetailUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
// 新增多人组合Url
export function addDRZH(data) {
  let url = pmUrl.addDRZHUrl;
  return axios({
    url,
    method: "post",
    data
  });
}
// 修改多人组合Url
export function updateDRZH(data, uuid) {
  let url = pmUrl.updateDRZHUrl(uuid);
  return axios({
    url,
    method: "put",
    data
  });
}
// 删除多人组合Url
export function deleteDRZH(uuid) {
  let url = pmUrl.updateDRZHUrl(uuid);
  return axios({
    url,
    method: "delete"
  });
}
// 获取多人组合的列表
export function getDRZH(params) {
  let url = pmUrl.getDRZHUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
// 获取多人组合的详情
export function detailDRZH(uuid) {
  let url = pmUrl.detailDRZHUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
// 删除反潜回
export function deleteAnti(uuid) {
  let url = pmUrl.deleteAntiUrl(uuid);
  return axios({
    method: "delete",
    url
  });
}
// 启用或关闭反潜回
export function switchAntiUrl(uuid, enable, data) {
  let url = pmUrl.switchAntiUrl(uuid, enable);
  return axios({
    method: "put",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    url,
    data
  });
}
// 新增互锁
export function addIT(data) {
  let url = pmUrl.addITUrl;
  return axios({
    method: "post",
    url,
    data
  });
}
// 删除互锁组
export function deleteIT(uuid) {
  let url = pmUrl.deleteITUrl(uuid);
  return axios({
    method: "delete",
    url
  });
}
// 获取互锁组的详情
export function detailIT(uuid) {
  let url = pmUrl.detailITUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
// 修改互锁组
export function updateIT(data, uuid) {
  let url = pmUrl.updateITUrl(uuid);
  return axios({
    url,
    method: "put",
    data
  });
}
// 启用或禁用互锁
export function switchITUrl(uuid, enable, data) {
  let url = pmUrl.switchITUrl(uuid, enable);
  return axios({
    method: "put",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    url,
    data
  });
}
