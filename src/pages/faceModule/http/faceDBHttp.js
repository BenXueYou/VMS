import Axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
import store from '@/store/store.js';
let FaceModuleApi = RestApi.api.faceModuleAPi;
/** *******************************************人脸库管理 ************************************** */
// 增
export function addFaceLid(data) {
  let url = FaceModuleApi.faceDBApi.addFaceLibUrl(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
    data
  });
}
// 查
export function getFaceLib(data) {
  let url = FaceModuleApi.faceDBApi.getFaceLibUrl(store.state.home.projectUuid);
  return Axios({
    method: 'GET',
    url,
    params: data
  });
}
// 二查
export function getFaceLibDetail(data) {
  let url = FaceModuleApi.faceDBApi.getFaceLibDetailUrl(store.state.home.projectUuid);
  return Axios({
    method: 'GET',
    url,
    params: data
  });
}
// 改
export function putFaceLib(data) {
  let url = FaceModuleApi.faceDBApi.putFaceLibUrl(store.state.home.projectUuid);
  return Axios({
    method: 'PUT',
    url,
    data
  });
}
// 删
export function deleteFaceLib(data) {
  let url = FaceModuleApi.faceDBApi.deleteFaceLibUrl(store.state.home.projectUuid);
  return Axios({
    method: 'delete',
    url,
    params: data
  });
}

// 辅查
export function getFaceLibOptions(data) {
  let url = FaceModuleApi.faceDBApi.getFaceLibOptionsUrl(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
    data
  });
}
// 人脸库人员添加
export function addStaffInfo(data) {
  let url = FaceModuleApi.faceDBApi.addStaffUrl(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
    data
  });
}
// 人脸库人员列表
export function getStaffList(data) {
  let url = FaceModuleApi.faceDBApi.getStaffListUrl(store.state.home.projectUuid);
  return Axios({
    method: 'GET',
    url,
    params: data
  });
}
// 人脸库人员详情
export function getStaffDetail(data) {
  let url = FaceModuleApi.faceDBApi.getStaffDetailUrl(store.state.home.projectUuid);
  return Axios({
    method: 'GET',
    url,
    params: data
  });
}
// 删除人员
export function deleteStaff(data) {
  let url = FaceModuleApi.faceDBApi.deleteStaffUrl(store.state.home.projectUuid);
  return Axios({
    method: 'DELETE',
    url,
    data
  });
}
// 编辑人员
export function updateStaff(data) {
  let url = FaceModuleApi.faceDBApi.updateStaffUrl(store.state.home.projectUuid);
  return Axios({
    method: 'PUT',
    url,
    data
  });
}
// 库更新
export function addDaoKuTask(data, faceLibUuid) {
  let url = FaceModuleApi.faceDBApi.addDaoKuTask(store.state.home.projectUuid, faceLibUuid);
  return Axios({
    method: 'POST',
    url,
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });
}
// 库更新历史列表
export function getTaskList(data) {
  let url = FaceModuleApi.faceDBApi.getTaskList(store.state.home.projectUuid);
  return Axios({
    method: 'GET',
    url,
    params: data
  });
}
// 库更新历史列表
export function getTaskErrorList(data) {
  let url = FaceModuleApi.faceDBApi.getTaskErrorList(store.state.home.projectUuid);
  return Axios({
    method: 'GET',
    url,
    params: data
  });
}
// 删除导库历史记录
export function deleteTask(importTaskUuid) {
  let url = FaceModuleApi.faceDBApi.deleteTask(store.state.home.projectUuid, importTaskUuid);
  return Axios({
    method: 'DELETE',
    url,
  });
}
// 库模板下载
export function downloadDBTemp(data) {
  let url = FaceModuleApi.faceDBApi.downloadDBTemp(store.state.home.projectUuid);
  return Axios({
    method: 'GET',
    url,
    params: data,
  });
}
// 库导入错误信息下载
export function downloadErrTemp(data) {
  let url = FaceModuleApi.faceDBApi.downloadErrTemp(store.state.home.projectUuid);
  return Axios({
    method: 'GET',
    url,
    params: data,
  });
}
