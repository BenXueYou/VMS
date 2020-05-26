import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
let townUrl = RestApi.dataBoard;
export function getFocusPeopleChart(params) {
  let url = townUrl.getBoardFocus;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getOneSixData(params) {
  let url = townUrl.getOneSixData;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getGridArea(params) {
  let url = townUrl.getGridArea;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getDevicesStatistics(params) {
  let url = townUrl.getDevices;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getFocusPeople(params) {
  let url = townUrl.getFocus(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getActPower(params) {
  let url = townUrl.getActPower(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getAlarmCount(params) {
  let url = townUrl.getAlarmCount;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getAlarmList(params) {
  let url = townUrl.getAlarmList;
  return axios({
    method: "get",
    url,
    params
  });
}
// 实有房屋人员统计
export function getActHouseCount(params) {
  let url = townUrl.getActHouseCount(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "get",
    url,
    params
  });
}
// 实有房屋-居住面积排名
export function getActHouseRank(params) {
  let url = townUrl.getActHouseRank(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "get",
    url,
    params
  });
}
// 数据看板今日感知
export function getDataBoardperception(params) {
  let url = townUrl.getDataBoardperception;
  return axios({
    method: "get",
    url,
    params
  });
}
// 实有人口-人口总数
export function getPopulationTotal(params) {
  let url = townUrl.getPopulationTotal(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "get",
    url,
    params
  });
}
// 实有人口-人员类型
export function getRealPopTypes(params) {
  let url = townUrl.getRealPopTypes(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "get",
    url,
    params
  });
}
// 实有房屋-通行排名
export function getHousePassTop(params) {
  let url = townUrl.getHousePassTop(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "get",
    url,
    params
  });
}
// 实有人口-重点人员活跃度
export function getFocusActive(params) {
  let url = townUrl.getFocusActive(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "get",
    url,
    params
  });
}
// 获取旭日图
export function getSunData(params) {
  let url = townUrl.getSunData;
  return axios({
    method: "get",
    url,
    params
  });
}
// 人脸感知-网格
export function getFacePtByGrid(params) {
  let url = townUrl.getFacePtByGrid(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "get",
    url,
    params
  });
}
// 人脸感知-小区
export function getFacePtByStreet(params) {
  let url = townUrl.getFacePtByStreet(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "get",
    url,
    params
  });
}
// 车辆感知-网格
export function getCarPtByGrid(params) {
  let url = townUrl.getCarPtByGrid(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "get",
    url,
    params
  });
}
// 车辆感知-小区
export function getCarPtByStreet(params) {
  let url = townUrl.getCarPtByStreet(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "get",
    url,
    params
  });
}
// 开门感知-网格
export function getDoorPtByGrid(params) {
  let url = townUrl.getDoorPtByGrid(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "get",
    url,
    params
  });
}
// 开门感知-小区
export function getDoorPtByStreet(params) {
  let url = townUrl.getDoorPtByStreet(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "get",
    url,
    params
  });
}
// 获取小区/子项目列表
export function getStreetList(params) {
  let url = townUrl.getStreetList;
  return axios({
    method: "get",
    url,
    params
  });
}
// 数据看板-布控报警
export function getDataAlarmList(params) {
  let url = townUrl.getDataAlarmList;
  return axios({
    method: "post",
    url,
    data: params
  });
}
// 实有人口-布控报警
export function getPeoAlarmList(params) {
  let url = townUrl.getPeoAlarmList(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "post",
    url,
    data: params
  });
}
// 实有人口-获取热力图
export function getHotMap(params) {
  let url = townUrl.getHotMap(params.projectUuid);
  delete params.projectUuid;
  return axios({
    method: "get",
    url,
    params
  });
}
// 安防设施
export function getDefanceDev(params) {
  let url = townUrl.getDefanceDev;
  return axios({
    method: "get",
    url,
    params
  });
}
