import store from "@/store/store.js";
let zhengyu = window.config.zhengyu;
let ip = window.config.ip,
  // projectUuid = window.config.projectUuid;
  projectUuid = store.state.home.projectUuid;
let zwUrlPrefix = `${
  window.config.protocolHeader
}${ip}/basedata-v1/project/${projectUuid}`;
// ip = "192.168.9.141:15000";
let urlPrefix = `${
  window.config.protocolHeader
}${ip}/video-v1/project/${projectUuid}`;
let sbPrefix = `${
  window.config.protocolHeader
}${ip}/${zhengyu}/project/${projectUuid}/`;
export default {
  // 获取视频预览信息
  getPreviewInfoUrl: `${urlPrefix}/video/previewInfo`,
  getFacePreviewInfoUrl: `${urlPrefix}/face/previewInfo`,
  // 云台控制视角
  ctrlUrl: `${urlPrefix}/video/ptz/ctrl`,
  // 云台控制预置
  presetUrl: `${urlPrefix}/video/ptz/preset`,
  // 获取预置点
  getPresetUrl: `${urlPrefix}/video/preset/position`,
  // 新增预置点
  addPresetUrl: `${urlPrefix}/video/preset/position`,
  // 获取云台控制
  getCloundUrl: `${urlPrefix}/video/ptz/info`,
  // 更新预置点
  updatePresetUrl: `${urlPrefix}/video/preset/position`,
  // 删除预置点
  deletePresetUrl: `${urlPrefix}/video/preset/position`,
  //  云台巡航操作
  cruizeUrl: `${urlPrefix}/video/ptz/preset`,
  // 录像查询
  recordsUrl: `${urlPrefix}/video/playback/records`,
  // 获取视频回放信息
  backupUrl: `${urlPrefix}/video/playback/rtsp`,
  // 查询视图
  getViewUrl: `${urlPrefix}/video/view`,
  // 添加视图
  addViewUrl: `${urlPrefix}/video/view`,
  // 更新视图
  updateViewUrl: `${urlPrefix}/video/view`,
  deleteViewUrl: `${urlPrefix}/video/view`,
  // 获取摄像机信息
  getCameraInfoUrl: `${urlPrefix}/video/cameraInfo`,
  // 获取子节点及视频设备通道数据
  videoTreeUrl: `${zwUrlPrefix}/organization/video/children`,
  // h获取媒流体服务的信息
  getPreviewInfAAoUrl: `${
    window.config.protocolHeader
  }${ip}/media-stream/v1.0/media_stream_transfer/video/previewInfo`,
  // 获取视频通道树
  getPlayTreeUrl: `${zwUrlPrefix}/video/playback/tree`,
  // 根据组织或者设备获取下面的在线通道
  getOnlineChannelUrl: `${zwUrlPrefix}/open/video/channel/list`,
  getPreviewTreeUrl: `${zwUrlPrefix}/auth/organization/tree`
  // 先使用下面的url测试
  // videoTreeUrl: `http://192.168.9.164:9000/project/a2445ed3830b4a3d9607ef502e8333bf/organization/video/children`
};
