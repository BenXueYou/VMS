import store from "@/store/store.js";

let ip = window.config.ip,
  // projectUuid = window.config.projectUuid;
  projectUuid = store.state.home.projectUuid;

// let zhengyu = "sppc-basedata-service-v1";
// let zhengyu = window.config.zhengyu;
// let wsh = window.config.wsh;
// let zhangwz = window.config.zhangwz;
// let sbPrefix = `${
//   window.config.protocolHeader
//   }${ip}/basedata-v1/project/${projectUuid}/`;
const BaseDataPrefix = `${window.config.protocolHeader}${ip}/basedata-v1/`;
const IacConfigPrefix = `${
  window.config.protocolHeader
  }${ip}/iacconfig-v1/project/${projectUuid}/`;
const IacServPrefix = `${window.config.protocolHeader}${ip}/iacserv-v1/`;
const IacAppPrefix = `${window.config.protocolHeader}${ip}/iacapp-v1/project/${projectUuid}/`;
const VisitAntPrefix = `${
  window.config.protocolHeader
  }${ip}/visitant-v1/project/${projectUuid}/`;
export default {
  // 区域管理页面
  getAreaOrgUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/areaOrg/children`,
  getAreaAllOrgUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/areaOrg/all/children`,
  getAreaProjectUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/areaManage/childProject/list`,
  setAreaProjectUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/areaManage/childProjectOrg/relation`,
  deleteAreaProjectUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/areaManage/childProjectOrg/relation`,
  getOrgUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/organization/children`,
  getOrgByProjectUuidUrl: uuid =>
    `${BaseDataPrefix}project/${uuid}/organization/children`,
  deleteOrgUrl: (orgUuid, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/organization/${orgUuid}`,
  updateOrgUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/organization`,
  operatorOrgUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/organization/move`,
  addOrgUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/organization`,
  getConfigIssue: `${IacConfigPrefix}configIssue`,
  setConfigIssue: `${IacConfigPrefix}configIssue`,
  stopConfigIssue: (deviceUuid, taskUuid) =>
    `${IacConfigPrefix}dataIssueStop/${deviceUuid}/${taskUuid}`,
  setReConfigIssue: (deviceUuid, taskUuid) =>
    `${IacConfigPrefix}restIssueData/${deviceUuid}/${taskUuid}`,
  getTagUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/tag/list`,
  getTongDaoTypeUrl: subViewType =>
    `${BaseDataPrefix}project/${projectUuid}/subViewType/${subViewType}`,
  getViewTypeListUrl: viewType =>
    `${BaseDataPrefix}project/${projectUuid}/chnType/${viewType}/list`,

  addTagUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/tag`,
  updateTagUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/tag`,
  operatorTagUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/tag/move`,
  deleteTagUrl: (tagUuid, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/tag/${tagUuid}`,
  //
  deleteChannelTagUrl: (channelUuid, channelType, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/channel/${channelUuid}/channelType/${channelType}`,
  // 设备列表相关接口
  // 根据设备uuid来获取通道列表
  getTDByDUuidUrl: (deviceUuid, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/deviceChannelList/${deviceUuid}`,
  // 根据组织uuid来获取通道
  getTDByOrgUuidUrl: (orgUuid, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/orgChannelList/${orgUuid}`,
  // 根据资源UUID获取通道列表
  getTDByTypeUrl: (resUuid, resType, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/resChannelList/${resUuid}/resType/${resType}`,
  /**
   * 得到设备列表
   */
  getDevListUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/device/list`,
  deleteDeviceUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/device`,
  deviceDetailUrl: (deviceUuid, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/device/${deviceUuid}`,
  saveDeviceUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/device`,
  addNewDeviceUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/device/toMgr`,
  // 获取未管理设备列表
  getNoGuanLiUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/deviceNotMgr`,
  // 获取权限组已添加的人资源下的具体的人员列表
  getResourceUrl: (resourceUuid, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/resource/${resourceUuid}`,
  // 标签相关接口
  getChannelByTagUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/tagElement/channelList`,
  importElementUrl: (tagUuid, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/importElement/${tagUuid}`,
  removeTagUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/tagElement/del`,
  importDeviceUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/tagElement/add`,
  // 远程控制相关接口
  getDeivceInfoUrl: deviceUuid => `${BaseDataPrefix}deviceinfo/${deviceUuid}`,
  // 获取基建树
  getIninfrastructureListUrl: (infrastructureUuid, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/infrastructure/${infrastructureUuid}`,
  //  远程管理工作状态
  getWorkStatusUrl: deviceUuid => `${BaseDataPrefix}deviceStatus/${deviceUuid}`,
  getDoorUrl: uuid => `${BaseDataPrefix}deviceDoor/${uuid}`,
  setDoorUrl: uuid => `${BaseDataPrefix}deviceDoor/${uuid}`,
  getNetUrl: `${BaseDataPrefix}deviceNet`,
  setNetUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/deviceNet`,
  getJiaoXiaoUrl: deviceUuid => `${BaseDataPrefix}deviceTime/${deviceUuid}`,
  setJiaoXiaoUrl: (deviceUuid, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/deviceTime/${deviceUuid}`,
  getRelayUrl: deviceUuid => `${BaseDataPrefix}deviceRelay/${deviceUuid}`,
  setRelayUrl: `${BaseDataPrefix}deviceRelay`,
  getFaceUrl: deviceUuid => `${BaseDataPrefix}deviceFaceRecognition/${deviceUuid}`,
  setFaceUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/device/faceRecognitionConfig`,
  getDoorListUrl: deviceUuid => `${BaseDataPrefix}deviceDoorList/${deviceUuid}/`,
  getDoorDutouUrl: channelUuid => `${BaseDataPrefix}deviceDoor/${channelUuid}`,
  setDoorDutouUrl: (channelUuid, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/deviceDoor/${channelUuid}`,
  getTempMeasure: channelUuid =>
    `${BaseDataPrefix}tempMeasure/${channelUuid}`,
  setTempMeasure: channelUuid => `${BaseDataPrefix}/project/${projectUuid}/tempMeasure/${channelUuid}`,
  // 根据类型来获取二级菜单
  getScondUrl: viewType =>
    `${BaseDataPrefix}project/${projectUuid}/chnType/select/list?viewType=${viewType}`,
  // 获取设备的时段列表
  getTimeUrl: `${BaseDataPrefix}device/passthrough/periodList`,
  setTimeUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/device/passthrough/periodList`,
  // 根据设备来获取下面的通道
  getChnByDUrl: (deviceUuid, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/deviceChannelTypeList/${deviceUuid}`,
  // 获取和设置报警配置
  getAlarmUrl: deviceUuid => `${BaseDataPrefix}deviceAlarm/${deviceUuid}`,
  setAlarmUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/deviceAlarm`,
  deleteFailTaskUrl: `${IacConfigPrefix}issueTask`,
  // 远程控制 设备升级那块
  upgradeDeviceUrl: `${IacServPrefix}operation/upgrade`,
  // 远程控制 新的接口
  newUpgradeDeviceUrl: `${
    window.config.protocolHeader
    }${ip}/zuul/fileforward-server-v1/project/system/fileforward/forwardFileToFileSystem`,
  // 数据备份
  dataBackupUrl: deviceUuid =>
    `${IacServPrefix}operation/dataBackup/device/${deviceUuid}`,
  // `${IacServPrefix}operation/dataBackup/device/${deviceUuid}`,
  // 获取设备升级进度
  upgradeProgressUrl: `${IacServPrefix}operation/upgrade`,
  // 重启设备
  restartDeviceUrl: deviceUuid =>
    `${IacServPrefix}operation/restart/device/${deviceUuid}`,
  // 恢复出厂设置
  dataResetUrl: deviceUuid =>
    `${IacServPrefix}operation/initialize/device/${deviceUuid}`,
  // 文件转发
  fileByUrl: `${
    window.config.protocolHeader
    }${ip}/fileforward-server-v1/project/${projectUuid}/fileforward/fileByUrl`,
  // 备份还原
  huanyuanUrl: deviceUuid =>
    `${IacServPrefix}operation/dataRestore/device/${deviceUuid}`,
  staffExportUrl: type => `${IacAppPrefix}staff/import/${type}`,

  // 室内机通话参数
  getRoomMachineCallParamUrl:`${IacServPrefix}/project/${projectUuid}/device/passthrough/roomMachine/callParams`,
  putRoomMachineCallParamUrl:`${IacServPrefix}/project/${projectUuid}/device/passthrough/roomMachine/callParams`,

  /*********************人员导入的API*********************/
  // 下载模板
  downloadUrl: `${IacAppPrefix}staff/import/exportTemplate`,
  // 获取导入结果
  importResultUrl: `${IacAppPrefix}staff/import/importResult`,
  // 获取错误日志
  exportsErrorUrl: `${IacAppPrefix}staff/import/exportErrors`,
  // 获取批量导入的进度
  exportProgressUrl: `${IacAppPrefix}staff/import/progressBar`,

  /*********************基建导入的API*********************/
  // 下载基建的模板
  downloadBulidingUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/infrastructure/import/template`,
  // 批量导入基建 模板
  buildingExportUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/infrastructure/import`,
  // 获取错误文件
  buildingErrorUrl: (taskUuid, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/infrastructure/import/errorLog/download/${taskUuid}`,
  // 获取基建进度
  buildingProgressUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/infrastructure/import/progress`,
  // 获取基建导入结果的接口
  getBuildgingImportResApi: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/infrastructure/import/result`,
  // 获取基建是否有错误文件
  buildIsHaveErrorFileUrl: (taskUuid, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/infrastructure/batchImport/errorLog/${taskUuid}`,


  // 访客机配置
  visitorRegisterConfigUrl: `${VisitAntPrefix}visitorRegisterConfig`,
  visitorReasonUrl: `${VisitAntPrefix}visitorReason`,
  tokeGoodsUrl: `${VisitAntPrefix}carryItem`,
  // 下发之前判断是否有下发任务了
  judgeTaskUrl: `${IacConfigPrefix}checkConfigIssue`,
  // 根据通道来获取设备的信息
  getDeviceInfoByChannelUrl: (channelUuid, uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/channel/${channelUuid}/deviceInfo`,
  // 获取本地服务列表
  serviceListUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/belong/server/list`,

  // 获取设备类型列表
  deviceTypeListUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/device/hand/view`,

  // 同步通道
  syncChannelUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/channel/hand`,
  // 手动添加设备
  manualEquipmentUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/device/hand`,
  // 获取设备类型
  DTypetUrl: (uuid = projectUuid) =>
    `${BaseDataPrefix}project/${uuid}/device/hand/view`,
  judgeRepeatCardUrl: `${IacAppPrefix}info/exist`,
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
