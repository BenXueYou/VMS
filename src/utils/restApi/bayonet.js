import store from "@/store/store.js";

let ip = window.config.ip,
  protocolHeader = window.config.protocolHeader,
  projectUuid = store.state.home.projectUuid;

// 测试网关接口
let httpHeader = `${
  window.config.protocolHeader
  }${ip}/sppc-dashboard-v1/project/${projectUuid}`;
// 测试本地接口
// ip = '192.168.9.59:15015/';
// httpHeader = `${protocolHeader}${ip}/project/${projectUuid}`;

export default {
  // 车辆抓拍入库查询
  getBayonetRecordList: `${httpHeader}/vehicle/vehicle/snapshot`,
  // 车辆抓拍统计查询
  getBayonetRecordStatics: `${httpHeader}/vehicle/vehicle/statistics`,
};
