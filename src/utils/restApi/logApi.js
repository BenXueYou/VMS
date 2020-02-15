import store from "@/store/store.js";

let ip = window.config.ip,
  projectUuid = store.state.home.projectUuid;
let httpHeader = `${
  window.config.protocolHeader
}${ip}/sysLog-v1/project/${projectUuid}`;
export default {
  //  日志列表查询
  getLogListUrl: `${httpHeader}/log/`,
  downloadLogUrl: `${httpHeader}/downloadLog` // 导出日志接口
};
