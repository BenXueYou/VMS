import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

let vUrl = RestApi.api.videoUrl;

export function getPreviewInfo(params = {}) {
  let url = vUrl.getPreviewInfoUrl;
  return axios({
    method: "GET",
    url,
    params
  });
}
export function ctrl(deviceUuid, data) {
  let url = vUrl.ctrlUrl + "?channelUuid=" + deviceUuid;
  return axios({
    method: "POST",
    url,
    data
  });
}
export function preset(uuid, data) {
  let url = vUrl.presetUrl + `?channelUuid=${uuid}`;
  return axios({
    method: "POST",
    url,
    data
  });
}
export function getPreset(params) {
  let url = vUrl.getPresetUrl;
  return axios({
    method: "GET",
    url,
    params
  });
}
export function cruize(data) {
  let url = vUrl.cruizeUrl;
  return axios({
    method: "POST",
    url,
    data
  });
}
export function records(params = {}) {
  let url = vUrl.recordsUrl;
  return axios({
    method: "GET",
    url,
    params
  });
}
export function backup(params = {}) {
  let url = vUrl.backupUrl;
  return axios({
    method: "GET",
    url,
    params
  });
}
export function getView(params = {}) {
  let url = vUrl.getViewUrl;
  return axios({
    method: "GET",
    url,
    params
  });
}
export function deleteView(uuid) {
  let url = vUrl.deleteViewUrl + `?viewUuid=${uuid}`;
  return axios({
    method: "DELETE",
    url
  });
}
export function addView(data) {
  let url = vUrl.addViewUrl;
  return axios({
    method: "POST",
    url,
    data
  });
}
export function updateView(data) {
  let url = vUrl.updateViewUrl;
  return axios({
    method: "PUT",
    url,
    data
  });
}
export function videoTree(params = {}) {
  let url = vUrl.videoTreeUrl;
  return axios({
    method: "GET",
    url,
    params
  });
}
export function getCameraInfo(params = {}) {
  let url = vUrl.getCameraInfoUrl;
  return axios({
    method: "GET",
    url,
    params
  });
}
