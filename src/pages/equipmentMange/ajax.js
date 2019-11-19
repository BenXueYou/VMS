import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
// import store from "@/store/store.js";

let sbUrl = RestApi.api.sbUrl;
// var projectUuid = store.state.home.projectUuid;

// 获取组织架构树
export function getOrgTree(params, orgType) {
  params.orgType = orgType;
  let url = sbUrl.getOrgUrl;
  // console.log(param);
  // if (param.length) {
  //   url += `?orgUuidArr=${param.toString()}`;
  // }
  return axios({
    method: "get",
    url,
    params
  });
}
// 操作组织架构树
export function operatorOrgTree(data) {
  let url = sbUrl.operatorOrgUrl;
  return axios({
    method: "post",
    url,
    data
  });
}
export function getScond(viewType) {
  let url = sbUrl.getScondUrl(viewType);
  return axios({
    method: "get",
    url
  });
}
// 操作标签 上下移动
export function opeartorTag(data) {
  let url = sbUrl.operatorTagUrl;
  return axios({
    method: "put",
    url,
    data: data
  });
}
// 编辑权限组接口
export function getTDByType(resUuid, resType) {
  let url = sbUrl.getTDByTypeUrl(resUuid, resType);
  return axios({
    method: "get",
    url
  });
}
// 添加组织树节点
export function addOrgTree(param) {
  let url = sbUrl.addOrgUrl;
  return axios({
    method: "post",
    url,
    data: param
  });
}
// 添加标签节点
export function addTag(param) {
  let url = sbUrl.addTagUrl;
  return axios({
    method: "post",
    url,
    data: param
  });
}
// 删除节点
export function deleteOrgTree(uuid) {
  let url = sbUrl.deleteOrgUrl(uuid);
  return axios({
    method: "delete",
    url
  });
}
// 删除标签
export function deleteTag(tagUuid) {
  let url = sbUrl.deleteTagUrl(tagUuid);
  return axios({
    method: "delete",
    url
  });
}
// 更新节点数据
export function updateOrg(param) {
  let url = sbUrl.updateOrgUrl;
  return axios({
    method: "put",
    url,
    data: param
  });
}
// 获取基建树
export function getIninfrastructureList(uuid) {
  let url = sbUrl.getIninfrastructureListUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
// 数据备份
export function dataBackup(uuid) {
  let url = sbUrl.dataBackupUrl(uuid);
  return axios({
    method: "put",
    url
  });
}
// 更新标签数据
export function updateTagUrl(param) {
  let url = sbUrl.updateTagUrl;
  return axios({
    method: "put",
    url,
    data: param
  });
}
// 获取下发数据的进度
export function getconfigissue() {
  let url = sbUrl.getConfigIssue;
  return axios({
    method: "get",
    url
  });
}
// 让某个机器开始下发
export function setConfigIssue(param) {
  let url = sbUrl.setConfigIssue;
  return axios({
    method: "POST",
    url,
    data: param
  });
}

// 重新下发数据
export function setReConfigIssue(deviceUuid, taskUuid) {
  let url = sbUrl.setReConfigIssue(deviceUuid, taskUuid);
  return axios({
    method: "POST",
    url
  });
}

// 终止数据下发
export function stopConfigIssue(deviceUuid, taskUuid) {
  let url = sbUrl.stopConfigIssue(deviceUuid, taskUuid);
  return axios({
    method: "POST",
    url
  });
}
// 获取标签列表
export function getTagList(params) {
  let url = sbUrl.getTagUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
// ---------------------------------设备列表相关接口---------------
// 删除通道标签
export function deleteChannelTagUrl(data, channelUuid, channelType) {
  let url = sbUrl.deleteChannelTagUrl(channelUuid, channelType);
  return axios({
    method: "delete",
    url,
    data
  });
}
// 获取设备列表
export function getDevList(params) {
  let url = sbUrl.getDevListUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
//  根据设备拿到通道
export function getTDByDUuid(uuid) {
  let url = sbUrl.getTDByDUuidUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
// 根据组织拿到通道
export function getTDByOrgUuid(uuid, params = {}) {
  let url = sbUrl.getTDByOrgUuidUrl(uuid);
  return axios({
    method: "get",
    url,
    params
  });
}
// 获取设备列表的详情
export function getDeviceDetail(uuid) {
  let url = sbUrl.deviceDetailUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
// 保存设备的信息
export function saveDevice(data) {
  let url = sbUrl.saveDeviceUrl;
  return axios({
    method: "put",
    data,
    url
  });
}
// 删除已管理的设备
export function deleteDevice(data) {
  let url = sbUrl.deleteDeviceUrl;
  return axios({
    method: "delete",
    url,
    data
  });
}
// 添加未管理的设备到管理设备中去
export function addNewDevice(data) {
  let url = sbUrl.addNewDeviceUrl;
  return axios({
    method: "post",
    url,
    data
  });
}
// 获取标签通道
export function getChannelByTag(params) {
  let url = sbUrl.getChannelByTagUrl;
  return axios({
    method: "get",
    url,
    params
  });
}

// 导入标签通道
export function importElement(data, uuid) {
  let url = sbUrl.importElementUrl(uuid);
  return axios({
    method: "post",
    url,
    data
  });
}

// 获取权限组已添加的人资源下的具体的人员列表
export function getResource(params, uuid) {
  let url = sbUrl.getResourceUrl(uuid);
  return axios({
    method: "get",
    url,
    params
  });
}
// 将标签通道移动出去
export function removeTag(data) {
  let url = sbUrl.removeTagUrl;
  return axios({
    method: "delete",
    url,
    data
  });
}
// 获取未管理列表
export function getNoGuanLi(params) {
  let url = sbUrl.getNoGuanLiUrl;
  // alert(url);
  // 添加参数
  // Object.assign(params, { 'projectUuid': projectUuid });
  return axios({
    method: "get",
    url,
    params
  });
}
// 添加标签通道
export function importDevice(data) {
  let url = sbUrl.importDeviceUrl;
  return axios({
    method: "post",
    url,
    data
  });
}
// ---------------------------------远程控制相关接口---------------
export function getDeivceInfo(uuid) {
  let url = sbUrl.getDeivceInfoUrl(uuid);
  return axios({
    method: "get",
    url
  });
}

export function getDeivceWorkStatus(uuid) {
  let url = sbUrl.getWorkStatusUrl(uuid);
  return axios({
    method: "get",
    url
  });
}

export function getDoor(uuid) {
  let url = sbUrl.getDoorUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
export function setDoor(data, uuid) {
  let url = sbUrl.setDoorUrl(uuid);
  return axios({
    method: "get",
    url,
    data
  });
}
// 获取校时的接口
export function getJiaoXiao(uuid) {
  let url = sbUrl.getJiaoXiaoUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
// 设置校时的接口
export function setJiaoXiao(data, uuid) {
  let url = sbUrl.setJiaoXiaoUrl(uuid);
  return axios({
    method: "put",
    url,
    data
  });
}
export function getRelay(uuid) {
  let url = sbUrl.getRelayUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
export function setRelay(data) {
  let url = sbUrl.setRelayUrl;
  return axios({
    method: "put",
    url,
    data
  });
}
export function getFace(uuid) {
  let url = sbUrl.getFaceUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
export function setFace(data, uuid) {
  let url = sbUrl.setFaceUrl + `?deviceUuid=${uuid}`;
  return axios({
    method: "put",
    url,
    data
  });
}
// 获取门的列表
export function getDoorList(uuid) {
  let url = sbUrl.getDoorListUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
// 根据门的channelUuid来获取数据
export function getDoorDutou(uuid) {
  let url = sbUrl.getDoorDutouUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
export function getChnByD(uuid) {
  let url = sbUrl.getChnByDUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
// 设置门读头的数据
export function setDoorDutou(data, uuid, deviceUuid) {
  let url = sbUrl.setDoorDutouUrl(uuid) + `/device/${deviceUuid}`;
  return axios({
    method: "put",
    url,
    data
  });
}
// 设置网路参数
export function setNet(data) {
  let url = sbUrl.setNetUrl;
  return axios({
    method: "put",
    url,
    data
  });
}
export function getTime(params) {
  let url = sbUrl.getTimeUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
export function setTime(data, uuid) {
  let url = sbUrl.setTimeUrl + `?deviceUuid=${uuid}`;
  return axios({
    method: "put",
    url,
    data
  });
}
export function getAlarm(uuid) {
  let url = sbUrl.getAlarmUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
export function setAlarm(data, uuid) {
  let url = sbUrl.setAlarmUrl + `?deviceUuid=${uuid}`;
  return axios({
    method: "put",
    url,
    data
  });
}
export function deleteFailTask(data) {
  let url = sbUrl.deleteFailTaskUrl;
  return axios({
    method: "delete",
    url,
    data
  });
}
// 获取设备升级进度
export function upgradeProgress(uuid) {
  let url = sbUrl.upgradeProgressUrl + `?deviceUuids=${uuid}`;
  return axios({
    method: "get",
    url
  });
}
export function getUpgradeUrl(data) {
  let url =
    sbUrl.upgradeDeviceUrl +
    `?fileUrl=${data.fileUrl}&deviceUuidArr=${data.deviceUuidArr}`;
  return axios({
    method: "post",
    url
  });
}
export function getNewUpgradeUrl() {
  return sbUrl.newUpgradeDeviceUrl;
}
// 设备升级
export function upgradeDevice(data) {
  let url = sbUrl.upgradeDeviceUrl;
  return axios({
    method: "post",
    url,
    data
  });
}
// 重启设备
export function restartDevice(uuid) {
  let url = sbUrl.restartDeviceUrl(uuid);
  return axios({
    method: "put",
    url
  });
}
// 恢复出厂设置
export function dataReset(initializeType, uuid) {
  let url = sbUrl.dataResetUrl(uuid) + `/type/${initializeType}`;
  return axios({
    method: "put",
    url
  });
}
// 文件转发
export function fileByUrl(url) {
  return sbUrl.fileByUrl + `?fileUrl=${url}`;
}
// 备份还原
export function huanyuanUrl(uuid) {
  return sbUrl.huanyuanUrl(uuid);
}
// 居民导入
export function staffExportUrl(type) {
  return sbUrl.staffExportUrl(type);
}
// 下载模板
export function downloadTempalte(type) {
  let url = sbUrl.downloadUrl + `?template=${type}`;
  return url;
}
// 导入结果
export function importResult(params) {
  let url = sbUrl.importResultUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
// 导出错误日志
export function exportsError(uuid) {
  let url = sbUrl.exportsErrorUrl + `?importTaksUuid=${uuid}`;
  return url;
}
// 导入的进度
export function exportProgress(params) {
  let url = sbUrl.exportProgressUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
// 下载基建模板
export function downloadBuliding() {
  let url = sbUrl.downloadBulidingUrl;
  return url;
}
// 下载基建模板之前的请求，判断返回的是不是文件流
export function beforeDownloadJugde() {
  let url = sbUrl.downloadBulidingUrl;
  return axios({
    url,
    method: "get"
  });
}
// 导入基建文件
export function buildingExportUrl() {
  let url = sbUrl.buildingExportUrl;
  return url;
}
// 获取基建进度
export function buildingProgressUrl(params = {}) {
  let url = sbUrl.buildingProgressUrl + `/${params.importTaksUuid}`;
  return axios({
    method: "get",
    url
  });
}
// buildIsHaveErrorFileUrl
export function buildIsHaveErrorFile(uuid) {
  let url = sbUrl.buildIsHaveErrorFileUrl(uuid.importTaksUuid);
  return axios({
    url,
    method: "get"
  });
}
// 获取错误日志之前的判断
export function beforeErrorlogDownload(uuid) {
  let url = sbUrl.buildingErrorUrl(uuid);
  return axios({
    url,
    method: "get"
  });
}
// 获取错误日志
export function buildingErrorUrl(uuid) {
  let url = sbUrl.buildingErrorUrl(uuid);
  return url;
}
// 获取访客机登记配置
export function visitorRegisterConfig(params) {
  let url = sbUrl.visitorRegisterConfigUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
// 修改更新访客机登记配置
export function UpdatevisitorRegisterConfig(deviceUuid, data) {
  let url = sbUrl.visitorRegisterConfigUrl + `?deviceUuid=${deviceUuid}`;
  return axios({
    method: "put",
    url,
    data
  });
}
// 获取拜访理由
export function visitorReasonUrl(params) {
  let url = sbUrl.visitorReasonUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
// 修改拜访理由
export function UpdatevisitorReason(data, uuid) {
  let url = sbUrl.visitorReasonUrl + "?deviceUuid=" + uuid;
  return axios({
    method: "put",
    url,
    data
  });
}
// 获取携带物品
export function tokeGoods(params) {
  let url = sbUrl.tokeGoodsUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
// 修改携带物品
export function UpdatetokeGoodl(data, uuid) {
  let url = sbUrl.tokeGoodsUrl + "?deviceUuid=" + uuid;
  return axios({
    method: "put",
    url,
    data
  });
}
// 判断是否有下发任务
export function judgeTask(params) {
  let url = sbUrl.judgeTaskUrl;
  return axios({
    method: "GET",
    url,
    params
  });
}
// 获取本地服务列表
export function serviceList(viewType) {
  let url = sbUrl.serviceListUrl + "/" + viewType;
  return axios({
    method: "get",
    url
  });
}
export function DType(viewType) {
  let url = sbUrl.DTypetUrl + "/" + viewType;
  return axios({
    method: "get",
    url
  });
}
// 获取设备类型列表
export function deviceTypeListUrl(viewType) {
  let url = sbUrl.deviceTypeListUrl + "/" + viewType;
  return axios({
    method: "get",
    url
  });
}
// 同步通道
export function syncChannel(deviceUuid) {
  let url = sbUrl.syncChannelUrl + `?deviceUuid=${deviceUuid}`;
  return axios({
    method: "PUT",
    url
  });
}
// 手动添加设备
export function manualEquipment(data) {
  let url = sbUrl.manualEquipmentUrl;
  return axios({
    method: "POST",
    url,
    data
  });
}
// 手动编辑设备
export function editManualEquipment(data) {
  let url = sbUrl.manualEquipmentUrl;
  return axios({
    method: "PUT",
    url,
    data
  });
}
// 判断卡号是否有重复
export function judgeRepeatCard(params) {
  let url = sbUrl.judgeRepeatCardUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
// 获取设备人脸库配置
export function getVideoDeviceSetting(uuid) {
  let url = sbUrl.getVideoDeviceSettingUrl(uuid);
  return axios({
    method: "get",
    url
  });
}
export function setDelaySyncSetting(uuid, data) {
  let url = sbUrl.setDelaySyncSettingUrl(uuid);
  return axios({
    method: "put",
    url,
    data
  });
}
export function setImmediateSyncSettingl(uuid, data) {
  let url = sbUrl.setImmediateSyncSettingUrl(uuid);
  return axios({
    method: "put",
    url,
    data
  });
}
