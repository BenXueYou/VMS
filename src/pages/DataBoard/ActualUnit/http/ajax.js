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
