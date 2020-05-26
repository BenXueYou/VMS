import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
import store from "@/store/store.js";
let BDFUrl = RestApi.buildingHouseFile;

export function roomDetail(data, logcontent = {}) {
  let projectUuid = data.projectUuid || store.state.home.projectUuid;
  let url = BDFUrl.roomApi(data.uuid, projectUuid);
  let params = {
    projectUuid: store.state.home.projectUuid,
    infrastructureUuid: data.uuid
  };
  console.log(url);
  return axios({
    headers: {
      VIEW_MODULE_NAME: encodeURIComponent(logcontent.modelName),
      VIEW_MODULE_DETAIL: encodeURIComponent(logcontent.detailContent)
    },
    method: "get",
    url,
    params
  });
}

export function roomStaffListApi(params) {
  let projectUuid = params.projectUuid || store.state.home.projectUuid;
  let url = BDFUrl.roomStaffListApi(params.infrastructureUuid, projectUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function roomDoorRecordApi(params) {
  let projectUuid = params.projectUuid || store.state.home.projectUuid;
  let url = BDFUrl.roomDoorRecordApi(params.infrastructureUuid, projectUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function roomCaptureRecordApi(params) {
  let projectUuid = params.projectUuid || store.state.home.projectUuid;
  let url = BDFUrl.roomCaptureRecordApi(params.infrastructureUuid, projectUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function roomCarListApi(params) {
  let projectUuid = params.projectUuid || store.state.home.projectUuid;
  let url = BDFUrl.roomCarListApi(params.infrastructureUuid, projectUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function roomVisitorListApi(params) {
  let projectUuid = params.projectUuid || store.state.home.projectUuid;
  let url = BDFUrl.roomVisitorListApi(params.infrastructureUuid, projectUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function roomBayonetRecordApi(params) {
  let projectUuid = params.projectUuid || store.state.home.projectUuid;

  let url = BDFUrl.roomBayonetRecordApi(params.infrastructureUuid, projectUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function roomCarRecordApi(params) {
  let projectUuid = params.projectUuid || store.state.home.projectUuid;
  let url = BDFUrl.roomCarRecordApi(params.infrastructureUuid, projectUuid);
  return axios({
    method: "get",
    url,
    params
  });
}

export function putRoomAlarmState(data) {
  let projectUuid = data.projectUuid || store.state.home.projectUuid;
  let url = BDFUrl.putRoomAlarmState(data.infrastructureUuid, projectUuid);
  return axios({
    method: 'put',
    url,
    data
  });
}
