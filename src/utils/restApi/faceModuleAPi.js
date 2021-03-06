import store from "@/store/store.js";

let ip = window.config.ip,
  protocolHeader = window.config.protocolHeader,
  projectUuid = store.state.home.projectUuid;
let URLHeader = `${protocolHeader}${ip}/faceconfig-v1/project`;
let URLHeaderFaceLog = `${protocolHeader}${ip}/facelog-v1/project`;
let URLHeaderFaceServer = `${protocolHeader}${ip}/faceserver-v1/project`;
let URLHeaderVideoServer = `${protocolHeader}${ip}/video-v1/project`;
export default {
  // @pengxueyou
  baseDataApi: {
    // 获取人脸设备
    getFaceDeviceList: projectUuid => `${protocolHeader}${ip}/basedata-v1/project/${projectUuid}/organization/children`,
    getDeviceChannelList: projectUuid => `${protocolHeader}${ip}/basedata-v1/project/${projectUuid}/organization/video/channel`,
    // 根据布控任务查询关联的设备和人脸库
    getTaskDetailChannelAndLibs: (projectUuid, taskUuid) => `${URLHeader}/${projectUuid}/monitoringTask/info/${taskUuid}`,
    // 获取布控任务
    getTaskListApi: projectUuid => `${URLHeader}/${projectUuid}/monitoringTask/info/list`,
    
    // 根据通道ID获取rtspUrl
    getRtspUrlByChannelUuidApi: projectUuid => `${URLHeaderVideoServer}/${projectUuid}/video/previewInfo`,

    // 人流量统计
    getStaticsPeopleApi:projectUuid=>`${URLHeaderFaceLog}/${projectUuid}/traffic/statistical/list`
  },

  baseConfigApi: {
    // 声音上传的接口
    uploadAudioApi: (projectUuid) => `${URLHeader}/${projectUuid}/face/config/sound`,
    deleteAudioApi: (projectUuid) => `${URLHeader}/${projectUuid}/face/config/sound`,
    //基础设置的接口
    getFaceModuleConfigApi: (projectUuid) => `${URLHeader}/${projectUuid}/face/config`,
    postFaceModuleConfigApi: (projectUuid) => `${URLHeader}/${projectUuid}/face/config`,

    // 文件中转接口
    uploadFileApi: `${protocolHeader}${ip}/fileforward-server-v1/project/${projectUuid}/fileforward/forwardFileToFileSystem`,
    // 图片质量检测
    postImageQuantityVerify: (projectUuid) => `${URLHeaderFaceServer}/faceserver-v1/project/${projectUuid}/imageQualityVerify`,
  },

  // @pengxueyou
  faceDBApi: {
    // 人脸库人员
    addStaffUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceInfo`,
    getStaffListUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceInfo/list`,
    getStaffDetailUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceInfo`,
    deleteStaffUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceInfo`,
    updateStaffUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceInfo`,
    // 人脸库
    addFaceLibUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib`,
    putFaceLibUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib`,
    deleteFaceLibUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib`,
    getFaceLibUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib/list`,
    getFaceLibDetailUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib`,
    getFaceLibOptionsUrl: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib/select/list`,
    getFaceQualityUrl: (projectUuid, libraryuuid, faceUuid) => `${URLHeader}/${projectUuid}/faceInfo/${libraryuuid}/staff/${faceUuid}`,
    addDaoKuTask: (projectUuid, faceLibUuid) => `${URLHeader}/${projectUuid}/faceLib/import/faceLib/${faceLibUuid}`,
    getTaskList: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib/import/task/list`,
    getTaskErrorList: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib/import/task/error/list`,
    deleteTask: (projectUuid, importTaskUuid) => `${URLHeader}/${projectUuid}/faceLib/import/task/${importTaskUuid}`,
    downloadDBTemp: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib/download/templateType`,
    downloadErrTemp: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib/download/errorInfo`,
    downloadFace: (projectUuid) => `${URLHeader}/${projectUuid}/faceLib/download/faceInfo`,
  },

  searchLogApi: {
    // 日志查询
    faceComparison1v1: projectUuid => `${URLHeaderFaceLog}/${projectUuid}/faceComparison/1v1?asgName=${projectUuid}`,
    getSnapshotList: projectUuid => `${URLHeaderFaceLog}/${projectUuid}/snapshot/list?asgName=${projectUuid}`,
    // TODO zxd 增加新接口 前缀增加/dashboard
    getRecognizeList: projectUuid => `${URLHeaderFaceLog}/${projectUuid}/recognize/list?asgName=${projectUuid}`,
    getRecognizeList_zxd: projectUuid => `${URLHeaderFaceLog}/${projectUuid}/dashboard/recognize/list?asgName=${projectUuid}`,
    getRecognizeInfo: projectUuid => `${URLHeaderFaceLog}/${projectUuid}/recognize/info?asgName=${projectUuid}`,
    getAlarmInfoList: projectUuid => `${URLHeaderFaceLog}/${projectUuid}/alarm/list?asgName=${projectUuid}`,
    // 根据抓拍的UUid查找人脸ID 判断的是是否有人员轨迹
    getFaceUuidByFaceCaptureUuid: projectUuid => `${URLHeaderFaceLog}/${projectUuid}/snapshot/search_faceUuid`,
    // 临时布控
    addTempContrlTask: projectUuid => `${URLHeader}/${projectUuid}/monitoringTask/temp/info`,
    // 抓拍到同行人分析
    photoRecordToAnalysis:projectUuid =>`${URLHeaderFaceLog}/${projectUuid}/faceUuid/faceCaptureRecord?asgName=${projectUuid}`
  },
  // @fengyawen
  getJudgeList: `${URLHeaderFaceLog}/${projectUuid}/judged/info/list?asgName=${projectUuid}`,
  handleJudgeDetail: `${URLHeaderFaceLog}/${projectUuid}/judged/info?asgName=${projectUuid}`,
  getModelDev: `${URLHeader}/${projectUuid}/IntelligentModel/channel/list`,
  getJudgeDetails: `${URLHeaderFaceLog}/${projectUuid}/judged/info/recognition/list?asgName=${projectUuid}`,
  searchFace: `${URLHeaderFaceLog}/${projectUuid}/searchFace/list?asgName=${projectUuid}`,
  getJudgedList: `${URLHeaderFaceLog}/${projectUuid}/judged/info/list?asgName=${projectUuid}`,
  getModelList: `${URLHeaderFaceLog}/${projectUuid}/modelStatistics/list?asgName=${projectUuid}`,
  getFaceCaptureAll: `${URLHeaderFaceLog}/${projectUuid}/snapshotStatistics/all/list?asgName=${projectUuid}`,
  getFaceCaptureOne: `${URLHeaderFaceLog}/${projectUuid}/snapshotStatistics/one/list?asgName=${projectUuid}`,
  getCompareAll: `${URLHeaderFaceLog}/${projectUuid}/recognizeStatistics/all/list?asgName=${projectUuid}`,
  getCompareOne: `${URLHeaderFaceLog}/${projectUuid}/recognizeStatistics/one/list?asgName=${projectUuid}`,
  getCompanionList: `${URLHeaderFaceLog}/${projectUuid}/staff/travelTogether/list?asgName=${projectUuid}`,
  getFaceAnalysisTable: `${URLHeaderFaceLog}/${projectUuid}/staffFrequency/list?asgName=${projectUuid}`,
  getMonitoringTaskList: `${URLHeader}/${projectUuid}/monitoringTask/info/list`,
  getMonitoringTaskDetails: (taskUuid) => `${URLHeader}/${projectUuid}/monitoringTask/info/${taskUuid}`,
  deleteMonitoringTask: (taskUuid) => `${URLHeader}/${projectUuid}/monitoringTask/info/${taskUuid}`,
  getAlarmList: `${URLHeaderFaceLog}/${projectUuid}/alarm/list?asgName=${projectUuid}`,
  addMonitoringTask: `${URLHeader}/${projectUuid}/monitoringTask/info`,
  editMonitoringTask: `${URLHeader}/${projectUuid}/monitoringTask/info`,
  editMonitoringTaskStatus: `${URLHeader}/${projectUuid}/monitoringTask/status`,
  getIntelModelList: `${URLHeader}/${projectUuid}/IntelligentModel/info/list`,
  getIntelModelDetails: (modelUuid) => `${URLHeader}/${projectUuid}/IntelligentModel/info/${modelUuid}`,
  deleteIntelModel: (modelUuid) => `${URLHeader}/${projectUuid}/IntelligentModel/info/${modelUuid}`,
  addIntelModel: `${URLHeader}/${projectUuid}/IntelligentModel/info`,
  editIntelModel: `${URLHeader}/${projectUuid}/IntelligentModel/info`,
  editIntelModelStatus: `${URLHeader}/${projectUuid}/IntelligentModel/status`,
  getFacedbList: `${URLHeader}/${projectUuid}/faceLib/select/list`,
  getDevList: `${protocolHeader}${ip}/basedata-v1/project/${projectUuid}/organization/children`,
  getTagList: `${protocolHeader}${ip}/basedata-v1/project/${projectUuid}/tag/list`,
  getTagDev: `${protocolHeader}${ip}/basedata-v1/project/${projectUuid}/tagElement/channelList`,
  getDevChannelList: (deviceUuid) => `${protocolHeader}${ip}/basedata-v1/project/${projectUuid}/deviceChannelTypeList/${deviceUuid}`,
  getAlarmSound: `${URLHeader}/${projectUuid}/face/config/alarmSound`,
  tempMonitor: `${URLHeader}/${projectUuid}/monitoringTask/temp/info`,
  getCompareDetail: `${URLHeaderFaceLog}/${projectUuid}/recognize/info?asgName=${projectUuid}`,
  getTragicList: `${URLHeaderFaceLog}/${projectUuid}/staffTrajectory/list?asgName=${projectUuid}`,
  getTragicItemList: `${URLHeaderFaceLog}/${projectUuid}/staffTrajectory/singleFace/list?asgName=${projectUuid}`,
};