import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

let bayonetUrl = RestApi.bayonetAPi;

export function getBayonetRecordList(params = {}, logContent = {}) {
  let { getBayonetRecordList: url } = bayonetUrl;
  if (!params.order) {
    params.order = 'createTime';
  }
  if (!params.sort) {
    params.sort = 'desc';
  }
  let headers;
  if (logContent.modelName) {
    headers = {
      VIEW_MODULE_NAME: encodeURIComponent(logContent.modelName),
      VIEW_MODULE_TYPE: encodeURIComponent(logContent.type),
      VIEW_MODULE_DETAIL: encodeURIComponent(logContent.detailContent)
    };
  }
  return axios({
    method: "get",
    headers: headers,
    url,
    params
  });
}

export function getBayonetRecordStatics(params = {}, logContent = {}) {
  let { getBayonetRecordStatics: url } = bayonetUrl;
  let headers = {};
  if (logContent.modelName) {
    headers = {
      VIEW_MODULE_NAME: encodeURIComponent(logContent.modelName),
      VIEW_MODULE_TYPE: encodeURIComponent(logContent.type),
      VIEW_MODULE_DETAIL: encodeURIComponent(logContent.detailContent)
    };
  }
  return axios({
    headers: headers,
    method: "get",
    url,
    params
  });
}
