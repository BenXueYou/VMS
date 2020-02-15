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

export function downloadLog(params) {
  let { downloadLogUrl: url } = logUrl;
  url += "?";
  for (var k in params) {
    if (params[k]) {
      url += `${k}=${params[k] || ""}&`;
    }
  }
  url = url.slice(0, url.length - 1);
  return url;
  // return axios({
  //   method: "get",
  //   url,
  //   params
  // });
}
