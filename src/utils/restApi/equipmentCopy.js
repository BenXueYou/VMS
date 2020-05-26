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
  }${ip}/${zhengyu}/project/`;

let xfPrefix = `${
  window.config.protocolHeader
  }${ip}/${wsh}/project/${projectUuid}/`;

let ycPrefix = `${window.config.protocolHeader}${ip}/${zhengyu}/`;

let zwzPrefix = `${window.config.protocolHeader}${ip}/${zhangwz}/`;

let wyfPrefix = `${window.config.protocolHeader}${ip}/${
  window.config.wyf
  }/project/${projectUuid}/`;
let fkPrefix = `${
  window.config.protocolHeader
  }${ip}/visitant-v1/project/${projectUuid}/`;
export default {
  // 区域管理页面
  getAreaOrgUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/areaOrg/children`,
  getAreaAllOrgUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/areaOrg/all/children`,
  getAreaProjectUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/areaManage/childProject/list`,
  setAreaProjectUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/areaManage/childProjectOrg/relation`,
  deleteAreaProjectUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/areaManage/childProjectOrg/relation`,
  getOrgUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/organization/children`,
  getOrgByProjectUuidUrl: uuid =>
    `${
    window.config.protocolHeader
    }${ip}/${zhengyu}/project/${uuid}/organization/children`,
  deleteOrgUrl: (orgUuid, projectUuid) => `${sbPrefix}/${projectUuid}/organization/${orgUuid}`,
  updateOrgUrl: projectUuid => `${sbPrefix}/${projectUuid}/organization`,
  operatorOrgUrl: projectUuid => `${sbPrefix}/${projectUuid}/organization/move`,
  addOrgUrl: projectUuid => `${sbPrefix}/${projectUuid}/organization`,
  getConfigIssue: `${xfPrefix}configIssue`,
  setConfigIssue: `${xfPrefix}configIssue`,
  stopConfigIssue: (deviceUuid, taskUuid) =>
    `${xfPrefix}dataIssueStop/${deviceUuid}/${taskUuid}`,
  setReConfigIssue: (deviceUuid, taskUuid) =>
    `${xfPrefix}restIssueData/${deviceUuid}/${taskUuid}`,
  getTagUrl: projectUuid => `${sbPrefix}/${projectUuid}/tag/list`,
  getTongDaoTypeUrl: (subViewType, projectUuid) =>
    `${ycPrefix}project/${projectUuid}/subViewType/${subViewType}`,
  getViewTypeListUrl: (viewType, projectUuid) =>
    `${ycPrefix}project/${projectUuid}/chnType/${viewType}/list`,

  addTagUrl: `${sbPrefix}/${projectUuid}/tag`,
  updateTagUrl: `${sbPrefix}/${projectUuid}/tag`,
  operatorTagUrl: `${sbPrefix}/${projectUuid}tag/move`,
  deleteTagUrl: tagUuid => `${sbPrefix}/${projectUuid}tag/${tagUuid}`,
  //
  deleteChannelTagUrl: (channelUuid, channelType) =>
    `${sbPrefix}/${projectUuid}/channel/${channelUuid}/channelType/${channelType}`,
  // 设备列表相关接口
  // 根据设备uuid来获取通道列表
  getTDByDUuidUrl: deviceUuid => `${sbPrefix}/${projectUuid}/deviceChannelList/${deviceUuid}`,
  // 根据组织uuid来获取通道
  getTDByOrgUuidUrl: (orgUuid, projectUuid) => `${sbPrefix}/${projectUuid}/orgChannelList/${orgUuid}`,
  // 根据资源UUID获取通道列表
  getTDByTypeUrl: (resUuid, resType) =>
    `${sbPrefix}/${projectUuid}/resChannelList/${resUuid}/resType/${resType}`,
  getDevListUrl: `${sbPrefix}/${projectUuid}/device/list`,
  deleteDeviceUrl: `${sbPrefix}/${projectUuid}/device`,
  deviceDetailUrl: deviceUuid => `${sbPrefix}/${projectUuid}/device/${deviceUuid}`,
  saveDeviceUrl: `${sbPrefix}/${projectUuid}/device`,
  addNewDeviceUrl: `${sbPrefix}/${projectUuid}/device/toMgr`,
  // 获取未管理设备列表
  getNoGuanLiUrl: `${sbPrefix}/${projectUuid}/deviceNotMgr`,
  // 获取权限组已添加的人资源下的具体的人员列表
  getResourceUrl: resourceUuid => `${sbPrefix}/${projectUuid}/resource/${resourceUuid}`,
  // 标签相关接口
  getChannelByTagUrl: `${sbPrefix}/${projectUuid}/tagElement/channelList`,
  importElementUrl: tagUuid => `${sbPrefix}/${projectUuid}/importElement/${tagUuid}`,
  removeTagUrl: `${sbPrefix}/${projectUuid}/tagElement/del`,
  importDeviceUrl: `${sbPrefix}/${projectUuid}/tagElement/add`,
  // 远程控制相关接口
  getDeivceInfoUrl: deviceUuid => `${ycPrefix}deviceinfo/${deviceUuid}`,
  // 获取基建树
  getIninfrastructureListUrl: infrastructureUuid =>
    `${sbPrefix}/${projectUuid}/infrastructure/${infrastructureUuid}`,
  //  远程管理工作状态
  getWorkStatusUrl: deviceUuid => `${ycPrefix}deviceStatus/${deviceUuid}`,
  getDoorUrl: uuid => `${ycPrefix}deviceDoor/${uuid}`,
  setDoorUrl: uuid => `${ycPrefix}deviceDoor/${uuid}`,
  getNetUrl: `${ycPrefix}deviceNet`,
  setNetUrl: `${sbPrefix}/${projectUuid}/deviceNet`,
  getJiaoXiaoUrl: deviceUuid => `${ycPrefix}deviceTime/${deviceUuid}`,
  setJiaoXiaoUrl: deviceUuid => `${sbPrefix}/${projectUuid}/deviceTime/${deviceUuid}`,
  getRelayUrl: deviceUuid => `${ycPrefix}deviceRelay/${deviceUuid}`,
  setRelayUrl: `${ycPrefix}deviceRelay`,
  getFaceUrl: deviceUuid => `${ycPrefix}deviceFaceRecognition/${deviceUuid}`,
  setFaceUrl: `${sbPrefix}/${projectUuid}/device/faceRecognitionConfig`,
  getDoorListUrl: deviceUuid => `${ycPrefix}deviceDoorList/${deviceUuid}/`,
  getDoorDutouUrl: channelUuid => `${ycPrefix}deviceDoor/${channelUuid}`,
  setDoorDutouUrl: channelUuid => `${sbPrefix}/${projectUuid}/deviceDoor/${channelUuid}`,
  getTempMeasure: channelUuid =>
    `${
    window.config.protocolHeader
    }${ip}/${zhengyu}/tempMeasure/${channelUuid}`,
  setTempMeasure: channelUuid => `${sbPrefix}/${projectUuid}/tempMeasure/${channelUuid}`,
  // 根据类型来获取耳机菜单
  getScondUrl: (viewType, projectUuid) =>
    `${ycPrefix}project/${projectUuid}/chnType/select/list`,
  getTongDaoTypeUrl: (subViewType, projectUuid) =>
    `${ycPrefix}project/${projectUuid}/subViewType/${subViewType}`,
  getViewTypeListUrl: (viewType, projectUuid) =>
    `${ycPrefix}project/${projectUuid}/chnType/${viewType}/list`,
  // 获取设备的时段列表
  getTimeUrl: `${ycPrefix}device/passthrough/periodList`,
  setTimeUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/device/passthrough/periodList`,
  // 根据设备来获取下面的通道
  getChnByDUrl: (projectUuid, deviceUuid) => `${sbPrefix}/${projectUuid}/deviceChannelTypeList/${deviceUuid}`,
  // 获取和设置报警配置
  getAlarmUrl: deviceUuid => `${ycPrefix}deviceAlarm/${deviceUuid}`,
  setAlarmUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/deviceAlarm`,
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
  fileByUrl: (projectUuid) => `${
    window.config.protocolHeader
    }${ip}/fileforward-server-v1/project/${projectUuid}/fileforward/fileByUrl`,
  // 备份还原
  huanyuanUrl: deviceUuid =>
    `${
    window.config.protocolHeader
    }${ip}/iacserv-v1/operation/operation/dataRestore/device/${deviceUuid}`,
  // 居民管理的导入
  staffExportUrl: type => `${wyfPrefix}staff/import/${type}`,
  // 下载模板
  downloadUrl: `${wyfPrefix}staff/import/exportTemplate`,
  // 获取导入结果
  importResultUrl: `${wyfPrefix}staff/import/importResult`,
  // 获取错误日志
  exportsErrorUrl: `${wyfPrefix}staff/import/exportErrors`,
  // 获取批量导入的进度
  exportProgressUrl: `${wyfPrefix}staff/import/progressBar`,
  // 下载基建的模板
  downloadBulidingUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/infrastructure/import/template`,
  // 批量导入基建 模板
  buildingExportUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/infrastructure/import`,
  // 获取错误文件
  buildingErrorUrl: (projectUuid, taskUuid) =>
    `${sbPrefix}/${projectUuid}/infrastructure/import/errorLog/download/${taskUuid}`,
  // 获取基建进度
  buildingProgressUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/infrastructure/import/progress`,
  // 获取基建是否有错误文件
  buildIsHaveErrorFileUrl: (projectUuid, taskUuid) =>
    `${sbPrefix}/${projectUuid}/infrastructure/batchImport/errorLog/${taskUuid}`,
  // 访客机配置
  visitorRegisterConfigUrl: `${fkPrefix}visitorRegisterConfig`,
  visitorReasonUrl: `${fkPrefix}visitorReason`,
  tokeGoodsUrl: `${fkPrefix}carryItem`,
  // 下发之前判断是否有下发任务了
  judgeTaskUrl: `${xfPrefix}checkConfigIssue`,
  // 根据通道来获取设备的信息
  getDeviceInfoByChannelUrl: (projectUuid, channelUuid) =>
    `${sbPrefix}/${projectUuid}/channel/${channelUuid}/deviceInfo`,
  // 获取本地服务列表
  serviceListUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/belong/server/list`,

  // 获取设备类型列表
  deviceTypeListUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/device/hand/view`,

  // 同步通道
  syncChannelUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/channel/hand`,
  // 手动添加设备
  manualEquipmentUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/device/hand`,
  // 获取设备类型
  DTypetUrl: (projectUuid) => `${sbPrefix}/${projectUuid}/device/hand/view`,
  judgeRepeatCardUrl: `${wyfPrefix}info/exist`,
  // 获取视频设备的设置
  getVideoDeviceSettingUrl: (deviceUuid, projectUuid) =>
    `${
    window.config.protocolHeader
    }${ip}/faceconfig-v1/project/${projectUuid}/face/${deviceUuid}/setting`,
  // 更新视频设备的设置(延迟下发)
  setDelaySyncSettingUrl: (deviceUuid, projectUuid) =>
    `${
    window.config.protocolHeader
    }${ip}/faceconfig-v1/project/${projectUuid}/face/${deviceUuid}/delaySync`,
  // 更新视频设备的设置(立即下发)
  setImmediateSyncSettingUrl: (deviceUuid, projectUuid) =>
    `${
    window.config.protocolHeader
    }${ip}/faceconfig-v1/project/${projectUuid}/face/${deviceUuid}/immediateSync`
};
