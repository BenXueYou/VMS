import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
let ip = window.config.ip;
let protocolHeader = window.config.protocolHeader;
let cbHomeUrl = RestApi.api.communityBoard;

export function getStaticsDataApi(params) {
  let url = cbHomeUrl.oneSixApi.getStaticsDataApi;
  console.log(url);
  return axios({
    method: "get",
    url,
    params
  });
}
export function getAlarmList(params) {
  let url = `${RestApi.faceModuleAPi.getAlarmList}`;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getJudgeList(params) {
  let url = `${RestApi.faceModuleAPi.getJudgeList}`;
  return axios({
    method: "get",
    url,
    params
  });
}

// 获取实有力量统计数据
export function getPowerMapChart(data) {
  let url = `${protocolHeader}${ip}${RestApi.api.peopleMange.getPowerMapChart()}`;
  return axios({
    method: "get",
    url,
    data
  });
}
// 获取实有设备统计数据
export function getEquipmentMapChart(data) {
  let url = `${protocolHeader}${ip}${RestApi.api.peopleMange.getEquipmentChart()}`;
  return axios({
    method: "get",
    url,
    data
  });
}
export function getAlarmDataApi(params) {
  let url = cbHomeUrl.oneSixApi.getAlarmDataApi;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getFocusPeople(params) {
  let url = cbHomeUrl.getFocusPeople;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getFaceRecoginizedDataApi(params) {
  let url = cbHomeUrl.oneSixApi.getFaceRecoginizedDataApi;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getBayonetDataApi(params) {
  let url = cbHomeUrl.oneSixApi.getBayonetDataApi;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getDoorRecordDataApi(params) {
  let url = cbHomeUrl.oneSixApi.getDoorRecordDataApi;
  return axios({
    method: "get",
    url,
    params
  });
}
