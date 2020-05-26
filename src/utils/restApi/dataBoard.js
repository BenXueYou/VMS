import store from "@/store/store.js";

let ip = window.config.ip;
let projectUuid = store.state.home.projectUuid;
let townHeader = `${window.config.protocolHeader}${ip}/sppc-dashboard-v1/project/${projectUuid}/town`;
let townHeaderA = `${window.config.protocolHeader}${ip}/sppc-dashboard-v1/project/${projectUuid}`;
let townHeaderB = `${window.config.protocolHeader}${ip}/facelog-v1/project/${projectUuid}`;
export default {
  getOneSixData: `${townHeaderA}/panel/system/resources`,
  getGridArea: `${townHeader}/grid/area`,
  getDevices: `${townHeader}/device/statistics`,
  getFocus(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid ||
      projectUuid}/town/focus/statistics`;
  },
  getActPower(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid ||
      projectUuid}/panel/staff/strength`;
  },
  getAlarmCount: `${townHeader}/judged/count`,
  getAlarmList: `${townHeader}/judged/staffInfo`,
  getActHouseCount(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid || projectUuid}/realHouse`;
  },
  getActHouseChart(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid ||
      projectUuid}/realHouse/detail`;
  },
  getActHouseRank(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid ||
      projectUuid}/realHouse/rank`;
  },
  getDataBoardperception: `${townHeaderA}/panel/perception`,
  getPopulationTotal(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid ||
      projectUuid}/real/population/total`;
  },
  getRealPopTypes(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid ||
      projectUuid}/real/population/type`;
  },
  getHousePassTop(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid ||
      projectUuid}/town/house/pass`;
  },
  getBoardFocus: `${townHeaderA}/resident/focus/count`,
  getFocusActive(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid ||
      projectUuid}/town/focus/activity/order`;
  },
  getSunData: `${townHeader}/ashiChart`,
  //人脸感知
  getFacePtByGrid(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid ||
      projectUuid}/panel/face/perception`;
  },
  getFacePtByStreet(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid ||
      projectUuid}/panel/face/perception/byArea`;
  },
  //车辆感知
  getCarPtByGrid(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid ||
      projectUuid}/panel/car/perception`;
  },
  getCarPtByStreet(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid ||
      projectUuid}/panel/car/perception/byArea`;
  },
  //开门记录
  getDoorPtByGrid(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid ||
      projectUuid}/panel/door/perception`;
  },
  getDoorPtByStreet(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid ||
      projectUuid}/panel/door/perception/byArea`;
  },
  getStreetList: `${window.config.protocolHeader}${ip}/backstage-v1/projectManage/projectRelation/childrenlist?projectUuid=${projectUuid}`,
  getDataAlarmList: `${window.config.protocolHeader}${ip}/facelog-v1/project/${projectUuid}/alarm/list?asgName=${projectUuid}`,
  getPeoAlarmList(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/facelog-v1/project/${newProUuid ||
      projectUuid}/alarm/list?asgName=${newProUuid || projectUuid}`;
  },
  // 张旭东 2.0新增接口 实有人口-布控报警
  getPeoAlarmListZxd(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/facelog-v1/project/${newProUuid ||
      projectUuid}/monitorAlarm/modeAnalysis/list?asgName=${newProUuid || projectUuid}`;
  },
  getHotMap(newProUuid) {
    return `${
      window.config.protocolHeader
    }${ip}/sppc-dashboard-v1/project/${newProUuid ||
      projectUuid}/real/population/map`;
  },
  getDefanceDev: `${window.config.protocolHeader}${ip}/sppc-dashboard-v1/project/${projectUuid}/panel/security/facility/list`
};
