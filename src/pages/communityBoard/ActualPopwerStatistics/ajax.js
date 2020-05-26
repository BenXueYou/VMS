import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
let ip = window.config.ip;
let protocolHeader = window.config.protocolHeader;

// 获取实有力量列表
export function getEquipmentList(parms) {
  let params = parms.dada;
  let url = `${protocolHeader}${ip}${RestApi.api.peopleMange.getEquipmentList(params.projectUuid)}`;
  return axios({
    method: "get",
    url,
    params
  });
}
// 获取实有装备统计数据
export function getEquipmentChart(data) {
  let url = `${protocolHeader}${ip}${RestApi.api.peopleMange.getEquipmentChart(data.projectUuid)}`;
  return axios({
    method: "get",
    url,
    data
  });
}
// 获取实有力量统计数据
export function getPowerMapChart(data) {
  let url = `${protocolHeader}${ip}${RestApi.api.peopleMange.getPowerMapChart(data.projectUuid)}`;
  return axios({
    method: "get",
    url,
    data
  });
}
// 获取实有力量列表
export function getPowerList(parms) {
  let data = parms.dada1;
  let url = `${protocolHeader}${ip}${RestApi.api.peopleMange.getPowerList(parms.dada2)}`;
  return axios({
    method: "get",
    url,
    params: data
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
