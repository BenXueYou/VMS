import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
// import store from "@/store/store.js";

let cbUrl = RestApi.communityBoard;
// var projectUuid = store.state.home.projectUuid;

export function getInfrastructureStaticsApi(data) {
  let url = cbUrl.infrastructureApi.getInfrastructureStaticsApi;
  return axios({
    method: 'GET',
    url,
    params: data
  });
}

export function getInfrastructureAccessTopApi(data) {
  let url = cbUrl.infrastructureApi.getInfrastructureAccessTopApi;
  return axios({
    method: 'GET',
    url,
    params: data
  });
}
