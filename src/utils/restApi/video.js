import store from "@/store/store.js";

let ip = window.config.ip,
  // projectUuid = window.config.projectUuid;
  projectUuid = store.state.home.projectUuid;
let urlPrefix = `${
  window.config.protocolHeader
}${ip}/video/project/${projectUuid}`;

export default {
  // 获取视频预览信息
  getPreviewInfoUrl: `${urlPrefix}/view/previewInfo`,
  // 云台控制视角
  ctrlUrl: `${urlPrefix}/video/ptz/ctrl`,
  // 云台控制预置
  presetUrl: `${urlPrefix}/video/ptz/preset`,
  //  云台巡航操作
  cruizeUrl: `${urlPrefix}/video/ptz/preset`,
  // 录像查询
  recordsUrl: `${urlPrefix}/video/playback/records`,
  // 获取视频回放信息
  backupUrl: `${urlPrefix}/video/playback/rtsp`,
  // 查询视图
  getViewUrl: `${urlPrefix}/video/view/list`,
  // 添加视图
  addViewUrl: `${urlPrefix}/video/view`
};
