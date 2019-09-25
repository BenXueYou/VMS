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
export function ctrl(data) {
  let url = vUrl.ctrlUrl;
  return axios({
    method: "POST",
    url,
    data
  });
}
export function preset(data) {
  let url = vUrl.presetUrl;
  return axios({
    method: "POST",
    url,
    data
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
export function addView(data) {
  let url = vUrl.addViewUrl;
  return axios({
    method: "POST",
    url,
    data
  });
}
