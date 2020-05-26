import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
import store from "@/store/store";

let cbUrl = RestApi.communityBoard;

export function getStaffDetail(data, logcontent = {}) {
  let projectUuid = data.projectUuid || store.state.home.projectUuid;
  let url = cbUrl.getStaffDetail(data.uuid, projectUuid);
  console.log(url, logcontent);
  return axios({
    method: "get",
    headers: {
      VIEW_MODULE_NAME: encodeURIComponent(logcontent.modelName),
      VIEW_MODULE_DETAIL: encodeURIComponent(logcontent.detailContent)
    },
    url
  });
}

export function getDoorRecord(params) {
  let projectUuid = params.projectUuid || store.state.home.projectUuid;
  let url = cbUrl.getDoorRecord(projectUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function getSnapshot(params) {
  let projectUuid = params.projectUuid || store.state.home.projectUuid;
  let url = cbUrl.getSnapshot(projectUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function getVehicle(params) {
  let projectUuid = params.projectUuid || store.state.home.projectUuid;
  let url = cbUrl.getVehicle(projectUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function getVehicleSnapshot(params) {
  let projectUuid = params.projectUuid || store.state.home.projectUuid;
  let url = cbUrl.getVehicleSnapshot(projectUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function getResident(params) {
  let projectUuid = params.projectUuid || store.state.home.projectUuid;
  let url = cbUrl.getResident(projectUuid);
  return axios({
    method: "get",
    url,
    params
  });
}
