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
