import store from "@/store/store.js";
let ip = window.config.ip,
  // projectUuid = window.config.projectUuid;
  projectUuid = store.state.home.projectUuid;

// let zhengyu = "sppc-basedata-service-v1";
// let zhengyu = window.config.zhengyu;
// let wsh = window.config.wsh;
// let wyf = window.config.wyf;
const BaseDataPrefix = `${
  window.config.protocolHeader
}${ip}/basedata-v1/project/${projectUuid}`;
const IacConfigPrefix = `${
  window.config.protocolHeader
}${ip}/iacconfig-v1/project/${projectUuid}`;
const IaCappPrefix = `${
  window.config.protocolHeader
}${ip}/iacapp-v1/project/${projectUuid}`;
let temporary = `${
  window.config.protocolHeader
}192.168.9.175:15005/project/${projectUuid}`;

export default {
  addNewDateUrl: `${IacConfigPrefix}/doorAuthGroup/holidayGroup/holidayGroup`,
  editDateUrl: holidayUuid =>
    `${IacConfigPrefix}/doorAuthGroup/holidayGroup/holidayGroup/${holidayUuid}`,
  deleteDateUrl: holidayUuid =>
    `${IacConfigPrefix}/doorAuthGroup/holidayGroup/holidayGroup/${holidayUuid}`,
  addNewPermissionUrl: `${IacConfigPrefix}/doorAuthGroup/doorAuthGroup/doorAuthGroup`,
  editPermissionUrl: groupUuid =>
    `${IacConfigPrefix}/doorAuthGroup/doorAuthGroup/doorAuthGroup/${groupUuid}`,
  deletePermissionUrl: groupUuid =>
    `${IacConfigPrefix}/doorAuthGroup/doorAuthGroup/doorAuthGroup/${groupUuid}`,
  editPMUrl: groupUuid => `${IaCappPrefix}/permission/${groupUuid}/edit`,
  addNewTimeUrl: `${IacConfigPrefix}/doorAuthGroup/periodMgr/periodMgr`,
  editTimeUrl: periodUuid =>
    `${IacConfigPrefix}/doorAuthGroup/periodMgr/periodMgr/${periodUuid}`,
  deleteTimeUrl: periodUuid =>
    `${IacConfigPrefix}/doorAuthGroup/periodMgr/periodMgr/${periodUuid}`,
  qxListUrl: `${IaCappPrefix}/permission`,
  qxDetailUrl: groupUuid => `${IaCappPrefix}/permission/${groupUuid}`,
  dateListUrl: `${IaCappPrefix}/holiday`,
  dateListAllUrl: `${IaCappPrefix}/holiday/all`,
  dateDatailUrl: holidayUuid => `${IaCappPrefix}/holiday/${holidayUuid}`,
  timeListUrl: `${IaCappPrefix}/period`,
  timeListAllUrl: `${IaCappPrefix}/period/all`,
  timeDetailUrl: periodUuid => `${IaCappPrefix}/period/${periodUuid}`,
  // 数据下发
  xifaUrl: `${IacConfigPrefix}/issueAuthData`,
  // 获取人员的详情接口
  staffDetailUrl: `${
    window.config.protocolHeader
  }${ip}/basedata-v1/base/staffInfo/staff`,
  // 多人组合开门的接口
  // addDRZHUrl: `${temporary}/advancedConf/combinationDoorOpen/combinationDoorOpen`,
  // updateDRZHUrl: groupUuid =>
  //   `${temporary}/advancedConf/combinationDoorOpen/combinationDoorOpen/${groupUuid}`,
  // deleteDRZHUrl: groupUuid =>
  //   `${temporary}/advancedConf/combinationDoorOpen/combinationDoorOpen/${groupUuid}`,
  addDRZHUrl: `${IacConfigPrefix}/advancedConf/combinationDoorOpen/combinationDoorOpen`,
  updateDRZHUrl: groupUuid =>
    `${IacConfigPrefix}/advancedConf/combinationDoorOpen/combinationDoorOpen/${groupUuid}`,
  deleteDRZHUrl: groupUuid =>
    `${IacConfigPrefix}/advancedConf/combinationDoorOpen/combinationDoorOpen/${groupUuid}`,
  // 获取多人组合的列表
  getDRZHUrl: `${IaCappPrefix}/staffgroup`,
  detailDRZHUrl: groupUuid => `${IaCappPrefix}/staffgroup/${groupUuid}`,
  // 反潜回操作API
  addAntiUrl: `${IacConfigPrefix}/advancedConf/antisubmarineGroup/antisubmarineGroup`,
  updateAntiUrl: groupUuid =>
    `${IacConfigPrefix}/advancedConf/antisubmarineGroup/antisubmarineGroup/${groupUuid}`,
  deleteAntiUrl: groupUuid =>
    `${IacConfigPrefix}/advancedConf/antisubmarineGroup/antisubmarineGroup/${groupUuid}`,
  switchAntiUrl: (groupUuid, enabled) =>
    `${IacConfigPrefix}/advancedConf/antisubmarineGroup/antisubmarineGroup/${groupUuid}/enabled/${enabled}`,
  // 互锁操作API
  addITUrl: `${IacConfigPrefix}/advancedConf/interlockingGroup/interlockingGroup`,
  detailITUrl: groupUuid => `${IaCappPrefix}/interlock/${groupUuid}`,
  deleteITUrl: groupUuid =>
    `${IacConfigPrefix}/advancedConf/interlockingGroup/interlockingGroup/${groupUuid}`,
  updateITUrl: groupUuid =>
    `${IacConfigPrefix}/advancedConf/interlockingGroup/interlockingGroup/${groupUuid}`,
  switchITUrl: (groupUuid, enabled) =>
    `${IacConfigPrefix}/advancedConf/interlockingGroup/interlockingGroup/${groupUuid}/enabled/${enabled}`,

  getAccessList: `${
    window.config.protocolHeader
  }${ip}/iacconfig-v1/project/${projectUuid}/prewarning/plan/list`,

  getAccessDetail: warningPlanUuid =>
    `${
      window.config.protocolHeader
    }${ip}/iacconfig-v1/project/${projectUuid}/prewarning/plan/info/${warningPlanUuid}`,
  addAccessRecord: `${
    window.config.protocolHeader
  }${ip}/iacconfig-v1/project/${projectUuid}/prewarning/plan/info`,
  updateAccessRecord: `${
    window.config.protocolHeader
  }${ip}/iacconfig-v1/project/${projectUuid}/prewarning/plan/info`,
  deleteAccessRecord: `${
    window.config.protocolHeader
  }${ip}/iacconfig-v1/project/${projectUuid}/prewarning/plan`,
  updateAccessRecordStatus: `${
    window.config.protocolHeader
  }${ip}/iacconfig-v1/project/${projectUuid}/prewarning/plan/enable`, // 是否启用和禁用人员预警进出记录
  uploadSound: `${
    window.config.protocolHeader
  }${ip}/iacconfig-v1/project/${projectUuid}/prewarning/plan/config/sound`,
  getOranizition: `${
    window.config.protocolHeader
  }${ip}/sppc-iacapp-service-v1/project/${projectUuid}/sysStaff/info/list`,
  getPersonnel: `${
    window.config.protocolHeader
  }${ip}/sppc-iacapp-service-v1/project/${projectUuid}/personnel/info/list`
};
