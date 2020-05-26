import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

let cbHomeUrl = RestApi.communityBoard;

export function getStaticsDataApi(params, projectUuid) {
  let url = cbHomeUrl.oneSixApi.getStaticsDataApi(projectUuid);
  console.log(url);
  return axios({
    method: "get",
    url,
    params
  });
}

export function getAlarmDataApi(params) {
  let url = cbHomeUrl.oneSixApi.getAlarmDataApi;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getFaceRecoginizedDataApi(params) {
  let url = cbHomeUrl.oneSixApi.getFaceRecoginizedDataApi;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getBayonetDataApi(params) {
  let url = cbHomeUrl.oneSixApi.getBayonetDataApi;
  return axios({
    method: "get",
    url,
    params
  });
}
export function getDoorRecordDataApi(params) {
  let url = cbHomeUrl.oneSixApi.getDoorRecordDataApi;
  return axios({
    method: "get",
    url,
    params
  });
}
