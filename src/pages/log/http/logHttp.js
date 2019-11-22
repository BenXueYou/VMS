import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
// import store from "@/store/store.js";

let logUrl = RestApi.api.logAPi;

export function getLogList(params) {
  let { getLogListUrl: url } = logUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
