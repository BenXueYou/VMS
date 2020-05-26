import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
import store from "@/store/store.js";

let vistorManageApi = RestApi.vistorManageApi;
// 访客日志记录
export function getVistorRecord(data) {
  let url = vistorManageApi.getVistorRecordUrl(store.state.home.projectUuid);
  return axios({
    method: "get",
    url,
    params: data
  });
}
export function getVistorRecordDetail(data) {
  let url = vistorManageApi.getVistorRecordDetailUrl(
    store.state.home.projectUuid
  );
  return axios({
    method: "get",
    url,
    params: data
  });
}

// 访客签离
export function putPlatformVistorSignOffUrl(data) {
  let url = vistorManageApi.putPlatformVistorSignOffUrl(
    store.state.home.projectUuid
  );
  return axios({
    method: "put",
    url,
    data
  });
}

// 预约邀请记录的签离
export function putVistorAISignoffUrl(data) {
  let url = vistorManageApi.putVistorAISignoffUrl(store.state.home.projectUuid);
  return axios({
    method: "put",
    url,
    data
  });
}
// 预约邀请记录的回收通行权限
export function putVistorAIForbiddenUrl(data) {
  let url = vistorManageApi.putVistorAIForbiddenUrl(
    store.state.home.projectUuid
  );
  return axios({
    method: "put",
    url,
    data
  });
}

// 访客回收通行权限
export function putVistorForBiddenUrl(data) {
  let url = vistorManageApi.putPlatVistorForBiddenUrl(
    store.state.home.projectUuid
  );
  return axios({
    method: "put",
    url,
    data
  });
}

// 访客预约邀请记录
export function getVistorAIRecordDetailUrl(data) {
  let url = vistorManageApi.getVistorAIRecordDetailUrl(
    store.state.home.projectUuid
  );
  return axios({
    method: "get",
    url,
    params: data
  });
}
export function getVistorAIRecordListUrl(data) {
  let url = vistorManageApi.getVistorAIRecordListUrl(
    store.state.home.projectUuid
  );
  return axios({
    method: "get",
    url,
    params: data
  });
}

// 访客人员信息记录
export function getVistorListUrl(data) {
  let url = vistorManageApi.getVistorListUrl(store.state.home.projectUuid);
  return axios({
    method: "get",
    url,
    params: data
  });
}
export function getVistorDetailUrl(data) {
  let url = vistorManageApi.getVistorDetailUrl(store.state.home.projectUuid);
  return axios({
    method: "get",
    url,
    params: data
  });
}

//  访客开门记录
export function getVistorOpenRecordUrl(data) {
  let url = vistorManageApi.getVistorOpenRecordUrl(
    store.state.home.projectUuid
  );
  return axios({
    method: "get",
    url,
    params: data
  });
}
export function getVistorOpenRecordDetailUrl(data) {
  let url = vistorManageApi.getVistorOpenRecordDetailUrl(
    store.state.home.projectUuid
  );
  return axios({
    method: "get",
    url,
    params: data
  });
}

// 访客预约设置
export function getVistorAIConfigUrl(data) {
  let url = vistorManageApi.getVistorAIConfigUrl(store.state.home.projectUuid);
  return axios({
    method: "get",
    url,
    params: data
  });
}
export function putVistorAIConfigUrl(data) {
  let url = vistorManageApi.putVistorAIConfigUrl(store.state.home.projectUuid);
  return axios({
    method: "put",
    url,
    data
  });
}
export function getShortMsgOptionsUrl(data) {
  let url = vistorManageApi.getShortMsgOptionsUrl(store.state.home.projectUuid);
  return axios({
    method: "get",
    url
  });
}

// 访客签离设置
export function getVistorSignOffUrl(data) {
  let url = vistorManageApi.getVistorSignOffUrl(store.state.home.projectUuid);
  return axios({
    method: "get",
    url,
    params: data
  });
}
export function putVistorSignOffUrl(data) {
  let url = vistorManageApi.putVistorSignOffUrl(store.state.home.projectUuid);
  return axios({
    method: "put",
    url,
    data
  });
}

// 黑名单管理
export function getBlacklistUrl(data) {
  // if (!COMMON.getAuthIsOwn('黑名单列表', 'isShow')) return promise;
  let url = vistorManageApi.getBlacklistUrl(store.state.home.projectUuid);
  return axios({
    method: "get",
    url,
    params: data
  });
}
export function getBlacklistDetailUrl(resUuid) {
  // if (!COMMON.getAuthIsOwn('黑名单列表', 'isOwn')) return promise;
  let url = vistorManageApi.getBlacklistDetailUrl(store.state.home.projectUuid);
  url += resUuid;
  return axios({
    method: "get",
    url
  });
}

export function postBlacklistUrl(data) {
  let url = vistorManageApi.postBlacklistUrl(store.state.home.projectUuid);
  data.userName = store.state.home.account;
  return axios({
    method: "post",
    url,
    data
  });
}
export function deleteBlacklistUrl(data) {
  let url = vistorManageApi.deleteBlacklistUrl(store.state.home.projectUuid);
  return axios({
    method: "delete",
    url,
    params: data
  });
}
export function putBlacklistUrl(data) {
  let url = vistorManageApi.putBlacklistUrl(store.state.home.projectUuid);
  url += data.blacklistUuid;
  return axios({
    method: "put",
    url,
    data
  });
}

// 黑名单报警记录
export function getBlacklistAlarmListUrl(data) {
  let url = vistorManageApi.getBlacklistAlarmListUrl(
    store.state.home.projectUuid
  );
  data.subtype = "blacklist";
  return axios({
    method: "get",
    url,
    params: data
  });
}
export function getBlacklistAlarmDetailUrl(alarmUuid) {
  let url = vistorManageApi.getBlacklistAlarmDetailUrl(
    store.state.home.projectUuid
  );
  url += alarmUuid;
  return axios({
    method: "get",
    url
  });
}
export function putBlacklistAlarmDetailUrl(data) {
  let url = vistorManageApi.putBlacklistAlarmDetailUrl(
    store.state.home.projectUuid
  );
  url += data.alarmUuid;
  return axios({
    method: "put",
    url,
    data
  });
}
// 黑名单报警处理
export function postBlacklistAlarmDealUrl(data) {
  let url = vistorManageApi.postBlacklistAlarmDealUrl(
    store.state.home.projectUuid
  );
  data.userName = store.state.home.account;
  data.userUuid = store.state.home.userUuid;
  return axios({
    method: "post",
    url,
    data
  });
}
