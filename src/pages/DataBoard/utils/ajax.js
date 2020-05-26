import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

let cbUrl = RestApi.communityBoard;

export function getStaffDetail(uuid) {
  let url = cbUrl.getStaffDetail(uuid);
  console.log(url);
  return axios({
    method: "get",
    url
  });
}

export function getDoorRecord(params) {
  let url = cbUrl.getDoorRecord;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getSnapshot(params) {
  let url = cbUrl.getSnapshot;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getVehicle(params) {
  let url = cbUrl.getVehicle;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getVehicleSnapshot(params) {
  let url = cbUrl.getVehicleSnapshot;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getResident(params) {
  let url = cbUrl.getResident;
  return axios({
    method: "get",
    url,
    params
  });
}
