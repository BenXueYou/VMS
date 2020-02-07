import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
import store from "@/store/store.js";
let vUrl = RestApi.api.videoUrl;

export function getPreviewInfo(params = {}) {
  let url = vUrl.getPreviewInfoUrl;
  return axios({
    method: "GET",
    url,
    params
  });
}
export function getFacePreviewInfo(params = {}) {
  let url = vUrl.getFacePreviewInfoUrl;
  return axios({
    method: "GET",
    url,
    params
  });
}
export function getPreviewInfoAA(params = {}) {
  let url = vUrl.getPreviewInfAAoUrl;
  params.asgName = store.state.home.projectUuid;
  return axios({
    method: "GET",
    url,
    params
  });
}
export function log1(data) {
  let url = vUrl.log1Url;
  return axios({
    method: "POST",
    url,
    data
  });
}
export function log2(data) {
  let url = vUrl.log2Url;
  return axios({
    method: "POST",
    url,
    data
  });
}
export function log3(viewName) {
  let url = vUrl.log3Url + `?viewName=${viewName}`;
  return axios({
    method: "POST",
    url
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
export function getClound(channelUuid) {
  let url = vUrl.getCloundUrl + "?channelUuid=" + channelUuid;
  return axios({
    method: "GET",
    url
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
export function getPreviewTree(data) {
  let url = vUrl.getPreviewTreeUrl;
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
export function addPreset(data) {
  let url = vUrl.addPresetUrl;
  return axios({
    method: "POST",
    url,
    data
  });
}
export function updatePreset(data) {
  let url = vUrl.updatePresetUrl;
  return axios({
    method: "PUT",
    url,
    data
  });
}
export function deletePreset(presetPositionUuid) {
  let url = vUrl.deletePresetUrl + `?presetPositionUuid=${presetPositionUuid}`;
  return axios({
    method: "delete",
    url
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
export function getPlayTree(params = {}) {
  let url = vUrl.getPlayTreeUrl;
  return axios({
    method: "GET",
    url,
    params
  });
}
export function getOnlineChannel(params = {}) {
  let url = vUrl.getOnlineChannelUrl;
  return axios({
    methods: "get",
    url,
    params
  });
}
