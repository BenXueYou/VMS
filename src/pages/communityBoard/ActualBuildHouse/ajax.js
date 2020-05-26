import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
// import store from "@/store/store.js";

let cbUrl = RestApi.communityBoard;
// var projectUuid = store.state.home.projectUuid;

export function getInfrastructureStaticsApi(data = {}, logContent = {}) {
  let url = cbUrl.infrastructureApi.getInfrastructureStaticsApi(data);
  return axios({
    headers: {
      VIEW_MODULE_NAME: encodeURIComponent(logContent.modelName),
      VIEW_MODULE_DETAIL: encodeURIComponent(logContent.detailContent)
    },
    method: 'GET',
    url
    // params: params
  });
}

export function getInfrastructureAccessTopApi(data) {
  let url = cbUrl.infrastructureApi.getInfrastructureAccessTopApi(data.data2);
  return axios({
    method: 'GET',
    url,
    params: data.data1
  });
}
