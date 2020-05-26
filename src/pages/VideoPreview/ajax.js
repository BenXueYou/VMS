import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
import store from "@/store/store.js";
let vUrl = RestApi.videoUrl;

export function getPreviewInfo(params = {}, logContent = "") {
  // isMap代表是否是地图那边的操作
  let projectUuid = params.projectUuid || store.state.home.projectUuid;
  let url = vUrl.getPreviewInfoUrl(projectUuid);
  if (logContent) {
    let headers = {
      VIEW_MODULE_NAME: "",
      VIEW_MODULE_TYPE: "",
      VIEW_MODULE_DETAIL: ""
    };
    if (logContent.modelName) {
      headers = {
        VIEW_MODULE_NAME: encodeURIComponent(logContent.modelName),
        VIEW_MODULE_TYPE: encodeURIComponent(logContent.type),
        VIEW_MODULE_DETAIL: encodeURIComponent(logContent.detailContent)
      };
    }
    return axios({
      headers,
      method: "GET",
      url,
      params
    });
  } else {
    return axios({
      method: "GET",
      url,
      params
    });
  }
}
export function getFacePreviewInfo(params = {}, logContent = {}) {
  console.log(params);
  let projectUuid = params.projectUuid || store.state.home.projectUuid;
  let url = vUrl.getFacePreviewInfoUrl(projectUuid);
  if (logContent.modelName) {
    return axios({
      method: "GET",
      headers: {
        VIEW_MODULE_NAME: encodeURIComponent(logContent.modelName),
        VIEW_MODULE_DETAIL: encodeURIComponent(logContent.detailContent)
      },
      url,
      params
    });
  } else {
    return axios({
      method: "GET",
      url,
      params
    });
  }
}
export function getPreviewInfoAA(params = {}) {
  let url = vUrl.getPreviewInfAAoUrl;
  if (!params.asgName) {
    params.asgName = store.state.home.projectUuid;
  }
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
export function log3(viewName, logEvent) {
  let url = vUrl.log3Url + `?viewName=${viewName}&logEvent=${logEvent}`;
  return axios({
    method: "POST",
    url
  });
}
export function ctrl(deviceUuid, data, logContent = "") {
  let projectUuid = data.projectUuid || store.state.home.projectUuid;
  let url = vUrl.ctrlUrl(projectUuid) + "?channelUuid=" + deviceUuid;
  if (logContent) {
    let headers = {
      VIEW_MODULE_NAME: "",
      VIEW_MODULE_TYPE: "",
      VIEW_MODULE_DETAIL: ""
    };
    if (logContent.modelName) {
      headers = {
        VIEW_MODULE_NAME: encodeURIComponent(logContent.modelName),
        VIEW_MODULE_TYPE: encodeURIComponent(logContent.type),
        VIEW_MODULE_DETAIL: encodeURIComponent(logContent.detailContent)
      };
    }
    return axios({
      headers,
      method: "POST",
      url,
      data
    });
  } else {
    return axios({
      method: "POST",
      url,
      data
    });
  }
}
export function getClound(channelUuid) {
  let url = vUrl.getCloundUrl + "?channelUuid=" + channelUuid;
  return axios({
    method: "GET",
    url
  });
}
export function preset(uuid, data) {
  let projectUuid = data.projectUuid || store.state.home.projectUuid;
  let url = vUrl.presetUrl(projectUuid) + `?channelUuid=${uuid}`;
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
export function getPreset(params, id) {
  let url = vUrl.getPresetUrl(id);
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
  let projectUuid = data.projectUuid || store.state.home.projectUuid;
  let url = vUrl.updatePresetUrl(projectUuid);
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
export function backup(params = {}, logContent = "") {
  let url = vUrl.backupUrl(params.projectUuid);
  delete params.projectUuid;
  if (logContent) {
    let headers = {
      VIEW_MODULE_NAME: "",
      VIEW_MODULE_TYPE: "",
      VIEW_MODULE_DETAIL: ""
    };
    if (logContent.modelName) {
      headers = {
        VIEW_MODULE_NAME: encodeURIComponent(logContent.modelName),
        VIEW_MODULE_TYPE: encodeURIComponent(logContent.type),
        VIEW_MODULE_DETAIL: encodeURIComponent(logContent.detailContent)
      };
    }
    return axios({
      headers,
      method: "GET",
      url,
      params
    });
  } else {
    return axios({
      method: "GET",
      url,
      params
    });
  }
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
export function videoTreeByProjectUuid(projectUuid, params = {}) {
  let url = vUrl.videoTreeByProjectUuidUrl(projectUuid);
  return axios({
    method: "GET",
    url,
    params
  });
}
export function getCameraInfo(projectUuid, params = {}) {
  let url = vUrl.getCameraInfoUrl(projectUuid);
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
export function getPlayTreeByProjectUuid(projectUuid, params = {}) {
  let url = vUrl.getPlayTreeByProjectUuidUrl(projectUuid);
  console.log(url);
  return axios({
    method: "GET",
    url,
    params
  });
}
export function getOnlineChannel(params = {}) {
  let projectUuid = params.projectUuid || store.state.home.projectUuid;
  let url = vUrl.getOnlineChannelUrl(projectUuid);
  return axios({
    methods: "get",
    url,
    params
  });
}
