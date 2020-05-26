import Axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
import store from '@/store/store.js';
let FaceModuleApi = RestApi.faceModuleAPi;

/** ******************************************* 人脸预览 ************************************** */
export function getFaceDeviceList(data) {
  if (data && !data.orgType) {
    data.orgType = "device";
  }
  let projectUuid = data.projectUuid ? data.projectUuid : store.state.home.projectUuid;
  let url = FaceModuleApi.baseDataApi.getFaceDeviceList(projectUuid);
  return Axios({
    method: 'GET',
    url,
    params: data
  });
}
export function getDeviceChannelList(data) {
  if (!data.shootType) {
    data.shootType = "faceSnap,bodySnap";
  }
  if (data.shootType === 'shootType') {
    data.shootType = null;
  }
  let projectUuid = data && data.projectUuid ? data.projectUuid : store.state.home.projectUuid;
  let url = FaceModuleApi.baseDataApi.getDeviceChannelList(projectUuid);
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
// 人流量统计
export function getStaticsPeopleAPi(xhr) {
  let url = FaceModuleApi.baseDataApi.getStaticsPeopleApi(store.state.home.projectUuid);
  xhr.asgName = store.state.home.projectUuid;
  return Axios({ method: "GET", url, params: xhr });
}
