import store from "@/store/store.js";

let ip = window.config.ip,
  protocolHeader = window.config.protocolHeader,
  projectUuid = store.state.home.projectUuid;
let URLHeader = `${protocolHeader}${ip}/faceconfig-v1/project`;
let URLHeaderFaceLog = `${protocolHeader}${ip}/facelog-v1/project`;
let URLHeaderFaceServer = `${protocolHeader}${ip}/faceserver-v1/project`;
export default {
  // @pengxueyou
  // 获取人脸设备
  getFaceDeviceList: projectUuid => `${protocolHeader}${ip}/basedata-v1/project/${projectUuid}`,
  // 获取布控任务
  getTaskListApi: projectUuid => `${URLHeader}/${projectUuid}/monitoringTask/info/list`,

  // 根据布控任务查询关联的设备和人脸库
  getTaskDetailChannelAndLibs: (projectUuid, taskUuid) => `${URLHeader}/${projectUuid}/monitoringTask/info/${taskUuid}`,

  // 日志查询
  faceComparison1v1: projectUuid => `${URLHeaderFaceLog}/${projectUuid}/faceComparison/1v1?asgName=${projectUuid}`,
  getSnapshotList: projectUuid => `${URLHeaderFaceLog}/${projectUuid}/snapshot/list?asgName=${projectUuid}`,
  getRecognizeList: projectUuid => `${URLHeaderFaceLog}/${projectUuid}/recognize/list?asgName=${projectUuid}`,
  getRecognizeInfo: projectUuid => `${URLHeaderFaceLog}/${projectUuid}/recognize/info?asgName=${projectUuid}`,
  getAlarmInfoList: projectUuid => `${URLHeaderFaceLog}/${projectUuid}/alarm/list?asgName=${projectUuid}`,

  // 根据抓拍的UUid查找人脸ID 判断的是是否有人员轨迹
  getFaceUuidByFaceCaptureUuid: projectUuid => `${URLHeaderFaceLog}/${projectUuid}/snapshot/search_faceUuid`,

  // 文件中转接口
  uploadFileApi: `${protocolHeader}${ip}/fileforward-server-v1/project/${projectUuid}/fileforward/forwardFileToFileSystem`,

  // 声音上传的接口
  uploadAudioApi: (projectUuid) => `${URLHeader}/${projectUuid}/face/config/sound`,
  deleteAudioApi: (projectUuid) => `${URLHeader}/${projectUuid}/face/config/sound`,
  //基础设置的接口
  getFaceModuleConfigApi: (projectUuid) => `${URLHeader}/${projectUuid}/face/config`,
  postFaceModuleConfigApi: (projectUuid) => `${URLHeader}/${projectUuid}/face/config`,

  // 图片质量检测
  postImageQuantityVerify: (projectUuid) => `${URLHeaderFaceServer}/faceserver-v1/project/${projectUuid}/imageQualityVerify`,


  // @pengxueyou
  faceDBApi: {
    addStaffUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceInfo`,
    getStaffListUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceInfo/list`,
    getStaffDetailUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceInfo`,
    deleteStaffUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceInfo`,
    updateStaffUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceInfo`,

    addFaceLibUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib`,
    putFaceLibUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib`,
    deleteFaceLibUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib`,
    getFaceLibUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib/list`,
    getFaceLibDetailUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib`,
    getFaceLibOptionsUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib/select/list`,
    getFaceQualityUrl: (projectUuid, libraryuuid, faceUuid) => `${URLHeader}/${projectUuid}/faceInfo/${libraryuuid}/staff/${faceUuid}`,
  },

  // @fengyawen
  searchFace: `${URLHeaderFaceLog}/${projectUuid}/searchFace/list?asgName=${projectUuid}`,
  getJudgeList: `${URLHeaderFaceLog}/${projectUuid}/judged/info/list?asgName=${projectUuid}`,
  getModelList: `${URLHeader}/${projectUuid}/modelStatistics/list`,
  getFaceCaptureAll: `${URLHeader}/${projectUuid}/snapshotStatistics/all/list`,
  getFaceCaptureOne: `${URLHeader}/${projectUuid}/snapshotStatistics/one/list`,
  getCompareAll: `${URLHeader}/${projectUuid}/recognizeStatistics/all/list`,
  getCompareOne: `${URLHeader}/${projectUuid}/recognizeStatistics/one/list`,
  getCompanionList: `${URLHeader}/${projectUuid}/staff/travelTogether/list`,
  getFaceAnalysisTable: `${URLHeader}/${projectUuid}/staffFrequency/list`,
  getMonitoringTaskList: `${URLHeader}/${projectUuid}/monitoringTask/info/list`,
  getMonitoringTaskDetails: (taskUuid) => `${URLHeader}/${projectUuid}/monitoringTask/info/${taskUuid}`,
  deleteMonitoringTask: (taskUuid) => `${URLHeader}/${projectUuid}/monitoringTask/info/${taskUuid}`,
  getAlarmList: `${URLHeader}/${projectUuid}/alarm/list`,
  addMonitoringTask: `${URLHeader}/${projectUuid}/monitoringTask/info`,
  editMonitoringTask: `${URLHeader}/${projectUuid}/monitoringTask/info`,
  getIntelModelList: `${URLHeader}/${projectUuid}/IntelligentModel/info/list`,
  getIntelModelDetails: (modelUuid) => `${URLHeader}/${projectUuid}/IntelligentModel/info/${modelUuid}`,
  getJudgedList: `${URLHeaderFaceLog}/${projectUuid}/judged/info/list`,
  deleteIntelModel: (modelUuid) => `${URLHeader}/${projectUuid}/IntelligentModel/info/${modelUuid}`,
  addIntelModel: `${URLHeader}/${projectUuid}/IntelligentModel/info`,
  editIntelModel: `${URLHeader}/${projectUuid}/IntelligentModel/info`,
};