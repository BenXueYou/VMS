import Axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
import store from '@/store/store.js';
let FaceModuleApi = RestApi.api.faceModuleAPi;

/** ******************************************* 基础设置 ************************************** */
// 基础设置接口
export function getFaceModuleConfig() {
  let url = FaceModuleApi.baseConfigApi.getFaceModuleConfigApi(store.state.home.projectUuid);
  return Axios({
    method: 'GET',
    url,
  });
}
export function postFaceModuleConfig(xhr) {
  let url = FaceModuleApi.baseConfigApi.postFaceModuleConfigApi(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
    data: xhr
  });
}
export function uploadAudio(xhr) {
  let url = FaceModuleApi.baseConfigApi.uploadAudioApi(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
    data: xhr
  });
}
export function deleteAudio(xhr) {
  let url = FaceModuleApi.baseConfigApi.deleteAudioApi(store.state.home.projectUuid);
  return Axios({
    method: 'DELETE',
    url,
    data: xhr
  });
}
