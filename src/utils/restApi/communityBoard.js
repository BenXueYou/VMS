import store from "@/store/store.js";

let ip = window.config.ip;
let projectUuid = store.state.home.projectUuid;
let httpHeader = `${window.config.protocolHeader}${ip}/sppc-dashboard-v1/project`;
let httpIACAppHeader = `${window.config.protocolHeader}${ip}/sppc-iacapp-service-v1/project`;

export default {
  getStaffDetail: (uuid, projectUuid) =>
    `${httpIACAppHeader}/${projectUuid}/sysStaff/info/${uuid}`,
  getDoorRecord: (projectUuid) => `${httpHeader}/${projectUuid}/personData/access`, // 门禁查询
  getSnapshot: (projectUuid) => `${httpHeader}/${projectUuid}/personData/snapshot`, // 抓拍查询
  getVehicle: (projectUuid) => `${httpHeader}/${projectUuid}/personData/vehicle`, // 车辆查询
  getVehicleSnapshot: (projectUuid) => `${httpHeader}/${projectUuid}/personData/vehicle/snapshot`, // 卡口抓拍统计查询
  getResident: (projectUuid) => `${httpHeader}/${projectUuid}/personData/resident`, // 居民查询
  getFocusPeople: (projectUuid) => `${httpHeader}/${projectUuid}/resident/focus/count`,
  oneSixApi: {
    getStaticsDataApi: (projectUuid) => `${httpHeader}/${projectUuid}/panel/system/resources`,
    getAlarmDataApi: `${httpHeader}/${projectUuid}/panel/alarm/list`,
    getFaceRecoginizedDataApi: `${httpHeader}/${projectUuid}/panel/face/recognition/statistics`,
    getBayonetDataApi: `${httpHeader}/${projectUuid}/panel/vehicle/recognition/statistics`,
    getDoorRecordDataApi: `${httpHeader}/${projectUuid}/panel/door/open/statistics`,
    getDefanceDevList: `${httpHeader}/${projectUuid}/panel/security/facility/list`
  },

  // 获取基建下的统计数据
  infrastructureApi: {
    getInfrastructureStaticsApi: (data) =>
      `${httpHeader}/${data.projectUuid ||
          store.state.home.projectUuid}/realHouse/${data.uuid}`,
    getInfrastructureAccessTopApi: (data) => `${httpHeader}/${data.projectUuid ||
          store.state.home.projectUuid}/statistics/opendoor/top`,
  },
};
