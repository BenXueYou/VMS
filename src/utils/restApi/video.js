import store from "@/store/store.js";
// let zhengyu = window.config.zhengyu;
let ip = window.config.ip,
  // projectUuid = window.config.projectUuid;
  projectUuid = store.state.home.projectUuid;
let zwUrlPrefix = `${window.config.protocolHeader}${ip}/basedata-v1/project`;
// ip = "192.168.9.141:15000";
let urlPrefix = `${window.config.protocolHeader}${ip}/video-v1/project`;
export default {
  // 获取视频预览信息
  getPreviewInfoUrl: (projectUuid) => `${urlPrefix}/${projectUuid}/video/previewInfo`,
  getFacePreviewInfoUrl:(projectUuid)=> `${urlPrefix}/${projectUuid}/face/previewInfo`,
  // 云台控制视角
  ctrlUrl: projectUuid => `${urlPrefix}/${projectUuid}/video/ptz/ctrl`,
  // 云台控制预置
  presetUrl: projectUuid => `${urlPrefix}/${projectUuid}/video/ptz/preset`,
  // 获取预置点
  getPresetUrl: (uuid = projectUuid) =>
    `${urlPrefix}/${uuid}/video/preset/position`,
  // 新增预置点
  addPresetUrl: `${urlPrefix}/${projectUuid}/video/preset/position`,
  // 获取云台控制
  getCloundUrl: `${urlPrefix}/${projectUuid}/video/ptz/info`,
  // 更新预置点
  updatePresetUrl: `${urlPrefix}/${projectUuid}/video/preset/position`,
  // 删除预置点
  deletePresetUrl: `${urlPrefix}/${projectUuid}/video/preset/position`,
  //  云台巡航操作
  cruizeUrl: projectUuid => `${urlPrefix}/${projectUuid}/video/ptz/preset`,
  // 录像查询
  recordsUrl: `${urlPrefix}/${projectUuid}/video/playback/records`,
  // 获取视频回放信息
  backupUrl: (uuid = projectUuid) =>
    `${urlPrefix}/${uuid}/video/playback/rtsp`,
  // 查询视图
  getViewUrl: `${urlPrefix}/${projectUuid}/video/view`,
  // 添加视图
  addViewUrl: `${urlPrefix}/${projectUuid}/video/view`,
  // 更新视图
  updateViewUrl: `${urlPrefix}/${projectUuid}/video/view`,
  deleteViewUrl: `${urlPrefix}/${projectUuid}/video/view`,
  // 获取摄像机信息
  getCameraInfoUrl: (uuid = projectUuid) =>  `${urlPrefix}/${uuid}/video/cameraInfo`,
  // 获取子节点及视频设备通道数据
  videoTreeUrl: `${zwUrlPrefix}/${projectUuid}/organization/video/children`,
  videoTreeByProjectUuidUrl: projectUuid =>
    `${
      window.config.protocolHeader
    }${ip}/basedata-v1/project/${projectUuid}/organization/video/children`,
  // h获取媒流体服务的信息
  getPreviewInfAAoUrl: `${
    window.config.protocolHeader
  }${ip}/media-stream/v1.0/media_stream_transfer/video/previewInfo`,
  // 获取视频通道树
  getPlayTreeUrl: `${zwUrlPrefix}/${projectUuid}/video/playback/tree`,
  getPlayTreeByProjectUuidUrl: projectUuid =>
    `${
      window.config.protocolHeader
    }${ip}/basedata-v1/project/${projectUuid}/video/playback/tree`,
  // 根据组织或者设备获取下面的在线通道
  getOnlineChannelUrl: projectUuid =>
    `${zwUrlPrefix}/${projectUuid}/open/video/channel/list`,
  downloadRecordLogUrl: `${urlPrefix}/${projectUuid}/video/download/log`,
  getPreviewTreeUrl: `${zwUrlPrefix}/${projectUuid}/auth/organization/tree`,
  // 先使用下面的url测试
  // videoTreeUrl: `http://192.168.9.164:9000/project/a2445ed3830b4a3d9607ef502e8333bf/organization/video/children`
  // 人脸预览切换通道日志
  log1Url: `${
    window.config.protocolHeader
  }${ip}/faceconfig-v1/project/${projectUuid}/monitoringTask/log/info`,
  log2Url: `${
    window.config.protocolHeader
  }${ip}/faceconfig-v1/project/${projectUuid}/faceInfo/capture/log`,
  log3Url: `${
    window.config.protocolHeader
  }${ip}/video-v1/project/${projectUuid}/video/view/log`
};
