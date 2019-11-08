import Axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
import store from '@/store/store.js';
let FaceModuleApi = RestApi.api.faceModuleAPi;

/** ******************************************* 人脸预览 ************************************** */
export function getFaceDeviceList(data) {
  if (data) {
    data.projectUuid = store.state.home.projectUuid;
    data.orgType = 'device';
  }
  let url = FaceModuleApi.baseDataApi.getFaceDeviceList(store.state.home.projectUuid);
  return Axios({
    method: 'GET',
    url,
    params: data
  });
}
export function getDeviceChannelList(data) {
  if (data) { data.projectUuid = store.state.home.projectUuid; }
  let url = FaceModuleApi.baseDataApi.getDeviceChannelList(store.state.home.projectUuid);
  return Axios({
    method: 'GET',
    url,
    params: data
  });
}
export function getRtspUrlByChannelUuidApi(data) {
  let url = FaceModuleApi.baseDataApi.getRtspUrlByChannelUuidApi(store.state.home.projectUuid);
  return Axios({
    method: "GET",
    url,
    params: data
  });
}
