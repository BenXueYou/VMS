import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
import store from "@/store/store.js";
let BDFUrl = RestApi.buildingHouseFile;

export function roomDetail(uuid) {
  let url = BDFUrl.roomApi(uuid);
  let params = {
    projectUuid: store.state.home.projectUuid,
    infrastructureUuid: uuid
  };
  console.log(url);
  return axios({
    method: "get",
    url,
    params
  });
}

export function roomStaffListApi(params) {
  let url = BDFUrl.roomStaffListApi(params.infrastructureUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function roomDoorRecordApi(params) {
  let url = BDFUrl.roomDoorRecordApi(params.infrastructureUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function roomCaptureRecordApi(params) {
  let url = BDFUrl.roomCaptureRecordApi(params.infrastructureUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function roomCarListApi(params) {
  let url = BDFUrl.roomCarListApi(params.infrastructureUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function roomVisitorListApi(params) {
  let url = BDFUrl.roomVisitorListApi(params.infrastructureUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function roomBayonetRecordApi(params) {
  let url = BDFUrl.roomBayonetRecordApi(params.infrastructureUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function roomCarRecordApi(params) {
  let url = BDFUrl.roomCarRecordApi(params.infrastructureUuid);
  return axios({
    method: "get",
    url,
    params
  });
}

export function putRoomAlarmState(data) {
  let url = BDFUrl.putRoomAlarmState(data.infrastructureUuid);
  return axios({
    method: 'put',
    url,
    data
  });
}
