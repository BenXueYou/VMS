import store from '@/store/store.js';
let ip = window.config.ip,
  // projectUuid = window.config.projectUuid;
  projectUuid = store.state.home.projectUuid;

// let zhengyu = "sppc-basedata-service-v1";
let zhengyu = window.config.zhengyu;
let wsh = window.config.wsh;
let wyf = window.config.wyf;
let sbPrefix = `${window.config.protocolHeader}${ip}/${zhengyu}/project/${projectUuid}`;
let xfPrefix = `${window.config.protocolHeader}${ip}/${wsh}/project/${projectUuid}`;
let listPrefix = `${window.config.protocolHeader}${ip}/${wyf}/project/${projectUuid}`;
let temporary = `${window.config.protocolHeader}192.168.9.175:15005/project/${projectUuid}`;
export default {
  addNewDateUrl: `${xfPrefix}/doorAuthGroup/holidayGroup/holidayGroup`,
  editDateUrl: holidayUuid =>
    `${xfPrefix}/doorAuthGroup/holidayGroup/holidayGroup/${holidayUuid}`,
  deleteDateUrl: holidayUuid =>
    `${xfPrefix}/doorAuthGroup/holidayGroup/holidayGroup/${holidayUuid}`,
  addNewPermissionUrl: `${xfPrefix}/doorAuthGroup/doorAuthGroup/doorAuthGroup`,
  editPermissionUrl: groupUuid =>
    `${xfPrefix}/doorAuthGroup/doorAuthGroup/doorAuthGroup/${groupUuid}`,
  deletePermissionUrl: groupUuid =>
    `${xfPrefix}/doorAuthGroup/doorAuthGroup/doorAuthGroup/${groupUuid}`,
  editPMUrl: groupUuid => `${listPrefix}/permission/${groupUuid}/edit`,
  addNewTimeUrl: `${xfPrefix}/doorAuthGroup/periodMgr/periodMgr`,
  editTimeUrl: periodUuid =>
    `${xfPrefix}/doorAuthGroup/periodMgr/periodMgr/${periodUuid}`,
  deleteTimeUrl: periodUuid =>
    `${xfPrefix}/doorAuthGroup/periodMgr/periodMgr/${periodUuid}`,
  qxListUrl: `${listPrefix}/permission`,
  qxDetailUrl: groupUuid => `${listPrefix}/permission/${groupUuid}`,
  dateListUrl: `${listPrefix}/holiday`,
  dateListAllUrl: `${listPrefix}/holiday/all`,
  dateDatailUrl: holidayUuid => `${listPrefix}/holiday/${holidayUuid}`,
  timeListUrl: `${listPrefix}/period`,
  timeListAllUrl: `${listPrefix}/period/all`,
  timeDetailUrl: periodUuid => `${listPrefix}/period/${periodUuid}`,
  // 数据下发
  xifaUrl: `${xfPrefix}/issueAuthData`,
  // 获取人员的详情接口
  staffDetailUrl: `${window.config.protocolHeader}${ip}/${zhengyu}/base/staffInfo/staff`,
  // 多人组合开门的接口
  // addDRZHUrl: `${temporary}/advancedConf/combinationDoorOpen/combinationDoorOpen`,
  // updateDRZHUrl: groupUuid =>
  //   `${temporary}/advancedConf/combinationDoorOpen/combinationDoorOpen/${groupUuid}`,
  // deleteDRZHUrl: groupUuid =>
  //   `${temporary}/advancedConf/combinationDoorOpen/combinationDoorOpen/${groupUuid}`,
  addDRZHUrl: `${xfPrefix}/advancedConf/combinationDoorOpen/combinationDoorOpen`,
  updateDRZHUrl: groupUuid =>
    `${xfPrefix}/advancedConf/combinationDoorOpen/combinationDoorOpen/${groupUuid}`,
  deleteDRZHUrl: groupUuid =>
    `${xfPrefix}/advancedConf/combinationDoorOpen/combinationDoorOpen/${groupUuid}`,
  // 获取多人组合的列表
  getDRZHUrl: `${listPrefix}/staffgroup`,
  detailDRZHUrl: groupUuid => `${listPrefix}/staffgroup/${groupUuid}`,
  // 反潜回操作API
  addAntiUrl: `${xfPrefix}/advancedConf/antisubmarineGroup/antisubmarineGroup`,
  updateAntiUrl: groupUuid =>
    `${xfPrefix}/advancedConf/antisubmarineGroup/antisubmarineGroup/${groupUuid}`,
  deleteAntiUrl: groupUuid =>
    `${xfPrefix}/advancedConf/antisubmarineGroup/antisubmarineGroup/${groupUuid}`,
  switchAntiUrl: (groupUuid, enabled) =>
    `${xfPrefix}/advancedConf/antisubmarineGroup/antisubmarineGroup/${groupUuid}/enabled/${enabled}`,
  // 互锁操作API
  addITUrl: `${xfPrefix}/advancedConf/interlockingGroup/interlockingGroup`,
  detailITUrl: groupUuid => `${listPrefix}/interlock/${groupUuid}`,
  deleteITUrl: groupUuid =>
    `${xfPrefix}/advancedConf/interlockingGroup/interlockingGroup/${groupUuid}`,
  updateITUrl:(groupUuid)=>`${xfPrefix}/advancedConf/interlockingGroup/interlockingGroup/${groupUuid}`,
  switchITUrl: (groupUuid, enabled) =>
    `${xfPrefix}/advancedConf/interlockingGroup/interlockingGroup/${groupUuid}/enabled/${enabled}`
};
