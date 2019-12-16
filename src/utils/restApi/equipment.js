import store from "@/store/store.js";

let ip = window.config.ip,
  // projectUuid = window.config.projectUuid;
  projectUuid = store.state.home.projectUuid;

// let zhengyu = "sppc-basedata-service-v1";
let zhengyu = window.config.zhengyu;
let wsh = window.config.wsh;
let zhangwz = window.config.zhangwz;
let sbPrefix = `${
  window.config.protocolHeader
}${ip}/${zhengyu}/project/${projectUuid}/`;
let xfPrefix = `${
  window.config.protocolHeader
}${ip}/${wsh}/project/${projectUuid}/`;
let ycPrefix = `${window.config.protocolHeader}${ip}/${zhengyu}/`;
let zwzPrefix = `${window.config.protocolHeader}${ip}/${zhangwz}/`;
let wyfPrefix = `${window.config.protocolHeader}${ip}/${
  window.config.wyf
}/project/${projectUuid}/`;
let wyfPrefix2 = `${window.config.protocolHeader}${ip}/zuul/${
  window.config.wyf
}/project/${projectUuid}/`;
let fkPrefix = `${
  window.config.protocolHeader
}${ip}/visitant-v1/project/${projectUuid}/`;
export default {
  getOrgUrl: `${sbPrefix}organization/children`,
  deleteOrgUrl: orgUuid => `${sbPrefix}organization/${orgUuid}`,
  updateOrgUrl: `${sbPrefix}organization`,
  // operatorOrgUrl: (rankOrder, orgType, direction) =>
  //   `${sbPrefix}organization/${rankOrder}/type/${orgType}/move/${direction}`,
  operatorOrgUrl: `${sbPrefix}organization/move`,
  addOrgUrl: `${sbPrefix}organization`,
  getConfigIssue: `${xfPrefix}configIssue`,
  setConfigIssue: `${xfPrefix}configIssue`,
  stopConfigIssue: (deviceUuid, taskUuid) =>
    `${xfPrefix}dataIssueStop/${deviceUuid}/${taskUuid}`,
  setReConfigIssue: (deviceUuid, taskUuid) =>
    `${xfPrefix}restIssueData/${deviceUuid}/${taskUuid}`,
  getTagUrl: `${sbPrefix}tag/list`,
  getTongDaoTypeUrl: subViewType =>
    `${ycPrefix}project/${projectUuid}/subViewType/${subViewType}`,
  getViewTypeListUrl: viewType =>
    `${ycPrefix}project/${projectUuid}/chnType/${viewType}/list`,

  addTagUrl: `${sbPrefix}tag`,
  updateTagUrl: `${sbPrefix}tag`,
  operatorTagUrl: `${sbPrefix}tag/move`,
  deleteTagUrl: tagUuid => `${sbPrefix}tag/${tagUuid}`,
  //
  deleteChannelTagUrl: (channelUuid, channelType) =>
    `${sbPrefix}channel/${channelUuid}/channelType/${channelType}`,
  // 设备列表相关接口
  // 根据设备uuid来获取通道列表
  getTDByDUuidUrl: deviceUuid => `${sbPrefix}deviceChannelList/${deviceUuid}`,
  // 根据组织uuid来获取通道
  getTDByOrgUuidUrl: orgUuid => `${sbPrefix}orgChannelList/${orgUuid}`,
  // 根据资源UUID获取通道列表
  getTDByTypeUrl: (resUuid, resType) =>
    `${sbPrefix}resChannelList/${resUuid}/resType/${resType}`,
  getDevListUrl: `${sbPrefix}device/list`,
  deleteDeviceUrl: `${sbPrefix}device`,
  deviceDetailUrl: deviceUuid => `${sbPrefix}device/${deviceUuid}`,
  saveDeviceUrl: `${sbPrefix}device`,
  addNewDeviceUrl: `${sbPrefix}device/toMgr`,
  // 获取未管理设备列表
  getNoGuanLiUrl: `${sbPrefix}deviceNotMgr`,
  // 获取权限组已添加的人资源下的具体的人员列表
  getResourceUrl: resourceUuid => `${sbPrefix}resource/${resourceUuid}`,
  // 标签相关接口
  getChannelByTagUrl: `${sbPrefix}tagElement/channelList`,
  importElementUrl: tagUuid => `${sbPrefix}importElement/${tagUuid}`,
  removeTagUrl: `${sbPrefix}tagElement/del`,
  importDeviceUrl: `${sbPrefix}tagElement/add`,
  // 远程控制相关接口
  getDeivceInfoUrl: deviceUuid => `${ycPrefix}deviceinfo/${deviceUuid}`,
  // 获取基建树
  getIninfrastructureListUrl: infrastructureUuid =>
    `${sbPrefix}infrastructure/${infrastructureUuid}`,
  //  远程管理工作状态
  getWorkStatusUrl: deviceUuid => `${ycPrefix}deviceStatus/${deviceUuid}`,
  getDoorUrl: uuid => `${ycPrefix}deviceDoor/${uuid}`,
  setDoorUrl: uuid => `${ycPrefix}deviceDoor/${uuid}`,
  getNetUrl: `${ycPrefix}deviceNet`,
  setNetUrl: `${sbPrefix}deviceNet`,
  getJiaoXiaoUrl: deviceUuid => `${ycPrefix}deviceTime/${deviceUuid}`,
  setJiaoXiaoUrl: deviceUuid => `${sbPrefix}deviceTime/${deviceUuid}`,
  getRelayUrl: deviceUuid => `${ycPrefix}deviceRelay/${deviceUuid}`,
  setRelayUrl: `${ycPrefix}deviceRelay`,
  getFaceUrl: deviceUuid => `${ycPrefix}deviceFaceRecognition/${deviceUuid}`,
  setFaceUrl: `${sbPrefix}device/faceRecognitionConfig`,
  getDoorListUrl: deviceUuid => `${ycPrefix}deviceDoorList/${deviceUuid}/`,
  getDoorDutouUrl: channelUuid => `${ycPrefix}deviceDoor/${channelUuid}`,
  setDoorDutouUrl: channelUuid => `${sbPrefix}deviceDoor/${channelUuid}`,
  // 根据类型来获取耳机菜单
  getScondUrl: viewType =>
    `${ycPrefix}project/${projectUuid}/chnType/select/list`,
  // 获取设备的时段列表
  getTimeUrl: `${ycPrefix}device/passthrough/periodList`,
  setTimeUrl: `${sbPrefix}device/passthrough/periodList`,
  // 根据设备来获取下面的通道
  getChnByDUrl: deviceUuid => `${sbPrefix}deviceChannelTypeList/${deviceUuid}`,
  // 获取和设置报警配置
  getAlarmUrl: deviceUuid => `${ycPrefix}deviceAlarm/${deviceUuid}`,
  setAlarmUrl: `${sbPrefix}deviceAlarm`,
  deleteFailTaskUrl: `${xfPrefix}issueTask`,
  // 远程控制 设备升级那块
  upgradeDeviceUrl: `${zwzPrefix}operation/operation/upgrade`,
  // 远程控制 新的接口
  newUpgradeDeviceUrl: `${
    window.config.protocolHeader
  }${ip}/zuul/fileforward-server-v1/project/system/fileforward/forwardFileToFileSystem`,
  // 数据备份
  dataBackupUrl: deviceUuid =>
    `${zwzPrefix}operation/operation/dataBackup/device/${deviceUuid}`,
  // `${zwzPrefix}operation/operation/dataBackup/device/${deviceUuid}`,
  // 获取设备升级进度
  upgradeProgressUrl: `${zwzPrefix}operation/operation/upgrade`,
  // 重启设备
  restartDeviceUrl: deviceUuid =>
    `${zwzPrefix}operation/operation/restart/device/${deviceUuid}`,
  // 恢复出厂设置
  dataResetUrl: deviceUuid =>
    `${zwzPrefix}operation/operation/initialize/device/${deviceUuid}`,
  // 文件转发
  fileByUrl: `${
    window.config.protocolHeader
  }${ip}/fileforward-server-v1/project/${projectUuid}/fileforward/fileByUrl`,
  // 备份还原
  huanyuanUrl: deviceUuid =>
    `${
      window.config.protocolHeader
    }${ip}/iacserv-v1/operation/operation/dataRestore/device/${deviceUuid}`,
  staffExportUrl: type => `${wyfPrefix2}staff/import/${type}`,
  // 下载模板
  downloadUrl: `${wyfPrefix}staff/import/exportTemplate`,
  // 获取导入结果
  importResultUrl: `${wyfPrefix}staff/import/importResult`,
  // 获取错误日志
  exportsErrorUrl: `${wyfPrefix}staff/import/exportErrors`,
  // 获取批量导入的进度
  exportProgressUrl: `${wyfPrefix}staff/import/progressBar`,
  // 下载基建的模板
  downloadBulidingUrl: `${sbPrefix}infrastructure/import/template`,
  // 批量导入基建 模板
  buildingExportUrl: `${sbPrefix}infrastructure/import`,
  // 获取错误文件
  buildingErrorUrl: taskUuid =>
    `${sbPrefix}infrastructure/import/errorLog/download/${taskUuid}`,
  // 获取基建进度
  buildingProgressUrl: `${sbPrefix}infrastructure/import/progress`,
  // 获取基建是否有错误文件
  buildIsHaveErrorFileUrl: taskUuid =>
    `${sbPrefix}infrastructure/batchImport/errorLog/${taskUuid}`,
  // 访客机配置
  visitorRegisterConfigUrl: `${fkPrefix}visitorRegisterConfig`,
  visitorReasonUrl: `${fkPrefix}visitorReason`,
  tokeGoodsUrl: `${fkPrefix}carryItem`,
  // 下发之前判断是否有下发任务了
  judgeTaskUrl: `${xfPrefix}checkConfigIssue`,
  // 根据通道来获取设备的信息
  getDeviceInfoByChannelUrl: channelUuid =>
    `${sbPrefix}channel/${channelUuid}/deviceInfo`,
  // 获取本地服务列表
  serviceListUrl: `${sbPrefix}belong/server/list`,

  // 获取设备类型列表
  deviceTypeListUrl: `${sbPrefix}device/hand/view`,

  // 同步通道
  syncChannelUrl: `${sbPrefix}channel/hand`,
  // 手动添加设备
  manualEquipmentUrl: `${sbPrefix}device/hand`,
  // 获取设备类型
  DTypetUrl: `${sbPrefix}device/hand/view`,
  judgeRepeatCardUrl: `${wyfPrefix}info/exist`,
  // 获取视频设备的设置
  getVideoDeviceSettingUrl: deviceUuid =>
    `${
      window.config.protocolHeader
    }${ip}/faceconfig-v1/project/${projectUuid}/face/${deviceUuid}/setting`,
  // 更新视频设备的设置(延迟下发)
  setDelaySyncSettingUrl: deviceUuid =>
    `${
      window.config.protocolHeader
    }${ip}/faceconfig-v1/project/${projectUuid}/face/${deviceUuid}/delaySync`,
  // 更新视频设备的设置(立即下发)
  setImmediateSyncSettingUrl: deviceUuid =>
    `${
      window.config.protocolHeader
    }${ip}/faceconfig-v1/project/${projectUuid}/face/${deviceUuid}/immediateSync`
};
