import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
let ip = window.config.ip;
let protocolHeader = window.config.protocolHeader;
// import store from "@/store/store.js";

let sbUrl = RestApi.sbUrl;
// var projectUuid = store.state.home.projectUuid;

// 获取门禁感知离开，图4
export function getMapChart4(params) {
  let url = `${protocolHeader}${ip}${RestApi.api.peopleMange.residentPerception}`;
  return axios({
    method: "get",
    url,
    params
  });
}
// 获取重点关注人员统计数据,图1
export function getMapChart1(data) {
  let url = `${protocolHeader}${ip}${RestApi.api.peopleMange.getMapChart}`;
  return axios({
    method: "get",
    url,
    data
  });
}
// 获取人员类型统计数据,图2
export function getMapChart2(data) {
  let url = `${protocolHeader}${ip}${RestApi.api.peopleMange.populationType}`;
  return axios({
    method: "get",
    url,
    data
  });
}
// 获取人口总数统计数据,图3
export function getMapChart3(data) {
  let url = `${protocolHeader}${ip}${RestApi.api.peopleMange.populationTotal}`;
  return axios({
    method: "get",
    url,
    data
  });
}
// 获取人口列表数据,右侧
export function getPeopleList(parms) {
  // let data = parms.dada;
  // let data = {
  //   "params": parms.dada
  // }
  let params = parms.dada;
  console.log("parms00000===", parms);
  console.log("parms1111===", parms.dada);
  console.log("parms2222===", parms.id);
  let url = `${protocolHeader}${ip}${RestApi.api.peopleMange.residentList(parms.id)}`;
  return axios({
    method: "get",
    url,
    params
  });
}
// 获取人口统计数据,右侧列表
export function getPeopleStatistics(parms) {
  let data = parms.dada;
  // let data = {
  //   "params": parms.dada
  // }
  console.log("parms00000===", parms);
  console.log("parms1111===", parms.dada);
  console.log("parms2222===", parms.id);
  let url = `${protocolHeader}${ip}${RestApi.api.peopleMange.residentStatistics(parms.id)}`;
  return axios({
    method: "get",
    url,
    data
  });
}

// 获取组织架构树
export function getOrgTree(params, orgType) {
  params.orgType = orgType;
  let url = sbUrl.getOrgUrl;
  // console.log(param);
  // if (param.length) {
  //   url += `?orgUuidArr=${param.toString()}`;
  // }
  return axios({
    method: "get",
    url,
    params
  });
}
// 操作组织架构树
export function operatorOrgTree(data) {
  let url = sbUrl.operatorOrgUrl;
  return axios({
    method: "post",
    url,
    data
  });
}
export function getScond(viewType) {
  let url = sbUrl.getScondUrl(viewType);
  return axios({
    method: "get",
    url
  });
}
export function getResultImport(params) {
  let url = sbUrl.getResultImportUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
// 操作标签 上下移动
export function opeartorTag(data) {
  let url = sbUrl.operatorTagUrl;
  return axios({
    method: "put",
    url,
    data: data
  });
}
// 编辑权限组接口
export function getTDByType(resUuid, resType) {
  let url = sbUrl.getTDByTypeUrl(resUuid, resType);
  return axios({
    method: "get",
    url
  });
}
// 编辑权限组接口
export function getDeviceInfoByChannel(channelUuid) {
  let url = sbUrl.getDeviceInfoByChannelUrl(channelUuid);
  return axios({
    method: "get",
    url
  });
}
// 添加组织树节点
export function addOrgTree(param) {
  let url = sbUrl.addOrgUrl;
  return axios({
    method: "post",
    url,
    data: param
  });
}
// 添加标签节点
export function addTag(param) {
  let url = sbUrl.addTagUrl;
  return axios({
    method: "post",
    url,
    data: param
  });
}
// 删除节点
export function deleteOrgTree(uuid) {
  let url = sbUrl.deleteOrgUrl(uuid);
  return axios({
    method: "delete",
    url
  });
}
// 删除标签
export function deleteTag(tagUuid) {
  let url = sbUrl.deleteTagUrl(tagUuid);
  return axios({
    method: "delete",
    url
  });
}
// 更新节点数据
export function updateOrg(param) {
  let url = sbUrl.updateOrgUrl;
  return axios({
    method: "put",
    url,
    data: param
  });
}
// 获取基建树
export function getIninfrastructureList(uuid) {
  let url = sbUrl.getIninfrastructureListUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
// 数据备份
export function dataBackup(uuid) {
  let url = sbUrl.dataBackupUrl(uuid);
  return axios({
    method: "put",
    url
  });
}
// 更新标签数据
export function updateTagUrl(param) {
  let url = sbUrl.updateTagUrl;
  return axios({
    method: "put",
    url,
    data: param
  });
}
// 获取下发数据的进度
export function getconfigissue() {
  let url = sbUrl.getConfigIssue;
  return axios({
    method: "get",
    url
  });
}
// 让某个机器开始下发
export function setConfigIssue(param) {
  let url = sbUrl.setConfigIssue;
  return axios({
    method: "POST",
    url,
    data: param
  });
}

// 重新下发数据
export function setReConfigIssue(deviceUuid, taskUuid) {
  let url = sbUrl.setReConfigIssue(deviceUuid, taskUuid);
  return axios({
    method: "POST",
    url
  });
}

// 终止数据下发
export function stopConfigIssue(deviceUuid, taskUuid) {
  let url = sbUrl.stopConfigIssue(deviceUuid, taskUuid);
  return axios({
    method: "POST",
    url
  });
}
// 获取标签列表
export function getTagList(params) {
  let url = sbUrl.getTagUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
