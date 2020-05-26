import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
let carManageUrl = RestApi.api.carManage;
export function getNewCarList(params) {
  let url = carManageUrl.getNewCarListUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
export function addNewCar(data = {}, logContent = {}) {
  let url = carManageUrl.addNewCarUrl;
  let headers;
  if (logContent.modelName) {
    headers = {
      VIEW_MODULE_NAME: encodeURIComponent(logContent.modelName),
      VIEW_MODULE_TYPE: encodeURIComponent(logContent.type),
      VIEW_MODULE_DETAIL: encodeURIComponent(logContent.detailContent)
    };
  }
  return axios({
    headers: headers,
    method: "post",
    url,
    data
  });
}
export function getCarDetail(uuid, params = {}) {
  let url = carManageUrl.getCarDetailUrl(uuid);
  return axios({
    method: "get",
    url,
    params
  });
}
export function deleteCar(data = {}, logContent = {}) {
  let url = carManageUrl.deleteCarUrl;
  let headers;
  if (logContent.modelName) {
    headers = {
      VIEW_MODULE_NAME: encodeURIComponent(logContent.modelName),
      VIEW_MODULE_TYPE: encodeURIComponent(logContent.type),
      VIEW_MODULE_DETAIL: encodeURIComponent(logContent.detailContent)
    };
  }
  return axios({
    headers: headers,
    method: "delete",
    url,
    data
  });
}
export function updateCar(data = {}, logContent = {}) {
  let url = carManageUrl.updateCarUrl;
  let headers;
  if (logContent.modelName) {
    headers = {
      VIEW_MODULE_NAME: encodeURIComponent(logContent.modelName),
      VIEW_MODULE_TYPE: encodeURIComponent(logContent.type),
      VIEW_MODULE_DETAIL: encodeURIComponent(logContent.detailContent)
    };
  }
  return axios({
    headers: headers,
    method: "put",
    url,
    data
  });
}
