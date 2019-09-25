import store from "@/store/store.js";

let ip = window.config.ip,
  protocolHeader = window.config.protocolHeader,
  projectUuid = store.state.home.projectUuid;
let URLHeader = `${protocolHeader}${ip}/faceconfig-v1/project`;
export default {
  // @pengxueyou
  homeApi:{
    // 获取布控任务
    getTaskListApi:projectUuid => `${URLHeader}/${projectUuid}/monitoringTask/info/list`,
  },
  // 日志查询
  faceComparison1v1: projectUuid => `${URLHeader}/${projectUuid}/faceComparison/1v1`,
  getSnapshotList: projectUuid => `${URLHeader}/${projectUuid}/snapshot/list`,
  getRecognizeList: projectUuid => `${URLHeader}/${projectUuid}/recognize/list`,
  getRecognizeInfo: projectUuid => `${URLHeader}/${projectUuid}/recognize/info`,
  getAlarmList: projectUuid => `${URLHeader}/${projectUuid}/alarm/list`,

  // 文件中转接口
  uploadFileApi:`${protocolHeader}${ip}/fileforward-server-v1/project/${projectUuid}/fileforward/forwardFileToFileSystem`,
  
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
  searchFace: `${URLHeader}/${projectUuid}/searchFace/list`,
  getJudgeList: `${URLHeader}/${projectUuid}/judged/info/list`,
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
  editMonitoringTask: `${URLHeader}/${projectUuid}/monitoringTask/info`,
  getIntelModelList: `${URLHeader}/${projectUuid}/IntelligentModel/info/list`,
  getIntelModelDetails: (modelUuid) => `${URLHeader}/${projectUuid}/IntelligentModel/info/${modelUuid}`,
  getJudgedList: `${URLHeader}/${projectUuid}/judged/info/list`,
  deleteIntelModel: (modelUuid) => `${URLHeader}/${projectUuid}/IntelligentModel/info/${modelUuid}`,
  editIntelModel: `${URLHeader}/${projectUuid}/IntelligentModel/info`,
};