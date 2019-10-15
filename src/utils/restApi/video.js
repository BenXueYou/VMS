import store from "@/store/store.js";

let ip = window.config.ip,
  // projectUuid = window.config.projectUuid;
  projectUuid = store.state.home.projectUuid;
ip = "192.168.9.105:15029";
let urlPrefix = `${
  window.config.protocolHeader
}${ip}/video/project/${projectUuid}`;
let zwUrlPrefix = `${
  window.config.protocolHeader
}${ip}/basedata-v1/project/${projectUuid}`;

export default {
  // 获取视频预览信息
  getPreviewInfoUrl: `${urlPrefix}/video/previewInfo`,
  // 云台控制视角
  ctrlUrl: `${urlPrefix}/video/ptz/ctrl`,
  // 云台控制预置
  presetUrl: `${urlPrefix}/video/ptz/preset`,
  // 获取预置点
  getPresetUrl: `${urlPrefix}/video/preset/position`,
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
  // 获取子节点及视频设备通道数据
  videoTreeUrl: `${zwUrlPrefix}/organization/video/children`
  // 先使用下面的url测试
  // videoTreeUrl: `http://192.168.9.164:9000/project/baefb892f4ab4cb495b0e1a4c2b2caad/organization/video/children`
};
