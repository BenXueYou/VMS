import store from "@/store/store.js";

let ip = window.config.ip,
  protocolHeader = window.config.protocolHeader,
  projectUuid = store.state.home.projectUuid;

// 测试网关接口
let httpHeader = `${
  window.config.protocolHeader
  }${ip}/sppc-dashboard-v1/project`;
// 测试本地接口
// ip = '192.168.9.59:15015/';
// httpHeader = `${protocolHeader}${ip}/project/${projectUuid}`;

export default {
  // 基本房屋信息
  roomApi: (infrastructureUuid, projectUuid) => `${httpHeader}/${projectUuid}/room/${infrastructureUuid}`,
  // 一房一档同住人
  roomStaffListApi: (infrastructureUuid, projectUuid) => `${httpHeader}/${projectUuid}/room/${infrastructureUuid}/staffList`,
  // 门禁记录
  roomDoorRecordApi: (infrastructureUuid, projectUuid) => `${httpHeader}/${projectUuid}/room/${infrastructureUuid}/doorRecord`,
  // 抓拍记录
  roomCaptureRecordApi: (infrastructureUuid, projectUuid) => `${httpHeader}/${projectUuid}/room/${infrastructureUuid}/captureRecord`,
  // 人车关联
  roomCarListApi: (infrastructureUuid, projectUuid) => `${httpHeader}/${projectUuid}/room/${infrastructureUuid}/carList`,
  // 车辆抓拍记录
  roomBayonetRecordApi: (projectUuid) => `${httpHeader}/${projectUuid}/vehicle/snapshot/recordList`,
  // 过车记录
  roomCarRecordApi: (infrastructureUuid, projectUuid) => `${httpHeader}/${projectUuid}/room/${infrastructureUuid}/carRecord`,
  // 访客列表
  roomVisitorListApi: (infrastructureUuid, projectUuid) => `${httpHeader}/${projectUuid}/room/${infrastructureUuid}/visitorList`,

  // 清除报警
  putRoomAlarmState: (infrastructureUuid, projectUuid) => `${httpHeader}/${projectUuid}/room/${infrastructureUuid}`
};
