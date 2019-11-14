import Axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
import store from '@/store/store.js';

let FaceModuleApi = RestApi.api.faceModuleAPi;
/** ******************************************* 检索 ************************************** */
// 根据布控任务查询关联的设备以及人脸库
export function getTaskDeatailChannelAndLib(uuid) {
  let url = FaceModuleApi.baseDataApi.getTaskDetailChannelAndLibs(store.state.home.projectUuid, uuid);
  return Axios({
    method: 'GET',
    url
  });
}
/**
   *
   * @param {enabled} 布控任务启用状态(1启用，0不启用)
   */
export function getTaskList(enabled) {
  let url = FaceModuleApi.baseDataApi.getTaskListApi(store.state.home.projectUuid);
  return Axios({
    method: 'get',
    url,
    params: enabled
  });
}
// 1V1对比
export function faceComparison1v1(data) {
  let url = FaceModuleApi.searchLogApi.faceComparison1v1(store.state.home.projectUuid);
  return Axios({
    method: "POST",
    url,
    data
  });
}
// 抓拍列表
export function getSnapshotList(data) {
  let url = FaceModuleApi.searchLogApi.getSnapshotList(store.state.home.projectUuid);
  return Axios({
    method: "get",
    url,
    params: data
  });
}
// 识别列表
export function getRecognizeList(data) {
  let url = FaceModuleApi.searchLogApi.getRecognizeList(store.state.home.projectUuid);
  return Axios({
    method: "get",
    url,
    params: data
  });
}
// 识别详情
export function getRecognizeInfo(data) {
  let url = FaceModuleApi.searchLogApi.getRecognizeInfo(store.state.home.projectUuid);
  return Axios({
    method: "get",
    url,
    params: data
  });
}
// 报警列表
export function getAlarmList(data) {
  let url = FaceModuleApi.searchLogApi.getAlarmInfoList(store.state.home.projectUuid);
  return Axios({
    method: "get",
    url,
    params: data
  });
}
// 是否能跳转人员轨迹
export function getFaceUuidByFaceCaptureUuid(data) {
  let url = FaceModuleApi.searchLogApi.getFaceUuidByFaceCaptureUuid(store.state.home.projectUuid);
  return Axios({
    method: "GET",
    url,
    params: data
  });
}

// 临时布控
export function addTempContrlTask(data) {
  let url = FaceModuleApi.searchLogApi.addTempContrlTask(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
    data
  });
}

// 根据抓拍id查询人脸ID
export function photoRecordToAnalysis(data) {
  let url = FaceModuleApi.searchLogApi.photoRecordToAnalysis(store.state.home.projectUuid);
  return Axios({
    method: 'GET',
    url,
    params: data
  });
}
