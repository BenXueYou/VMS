import axios from '@/utils/Request';
import RestApi from '@/utils/RestApi';

let ip = window.config.ip;
let protocolHeader = window.config.protocolHeader;
export var LogSearchHttp = {

  /**
   * 门禁记录列表查询
   */
  getDoorLog(holder, moduleHead) {
    let api = `${protocolHeader}${ip}${RestApi.api.recordSearch.getDoorLog(holder.projectUuid)}`;
    let params = {};
    for (let k in holder) {
      if (holder[k] !== "" && holder[k] !== null && holder[k] !== undefined) {
        params[k] = holder[k];
      }
    }
    return moduleHead ? axios.get(api, {headers: moduleHead.headers, params: params}) : axios.get(api, {params: params});
  },
  // 张旭东  开门记录查询接口增加dashboard 2020-04-23
  getDoorLog_zxd(holder, moduleHead) {
    let api = `${protocolHeader}${ip}${RestApi.api.recordSearch.getDoorLog_zxd(holder.projectUuid)}`;
    let params = {};
    for (let k in holder) {
      if (holder[k] !== "" && holder[k] !== null && holder[k] !== undefined) {
        params[k] = holder[k];
      }
    }
    return moduleHead ? axios.get(api, {headers: moduleHead.headers, params: params}) : axios.get(api, {params: params});
  },

  /**
   * 报警记录列表查询
   */
  getAlarmLog(holder, moduleHead) {
    let api = `${protocolHeader}${ip}${RestApi.api.recordSearch.getAlarmLog(holder.projectUuid)}`;

    let params = {};
    for (let k in holder) {
      if (holder[k]) {
        params[k] = holder[k];
      }
    }
    return moduleHead ? axios.get(api, {headers: moduleHead.headers, params: params}) : axios.get(api, {params: params});
  },
  // 报警记录详情
  getAlarmLogDetail(holder) {
    let logDetail = RestApi.api.recordSearch.getAlarmLogDetail(holder.alarmUuid);
    let api = `${protocolHeader}${ip}${logDetail}`;

    let params = {};
    for (let k in holder) {
      if (holder[k]) {
        params[k] = holder[k];
      }
    }
    return axios.get(api, {params: params});
  },
  // 报警记录处理
  getAlarmLogDeal(holder) {
    let logDetail = RestApi.api.recordSearch.getAlarmLogDeal(holder.alarmUuid);
    let api = `${protocolHeader}${ip}${logDetail}`;

    let params = {};
    for (let k in holder) {
      if (holder[k]) {
        params[k] = holder[k];
      }
    }
    return axios.get(api, {params: params});
  },
  // 新增报警记录处理
  postAlarmLogDeteal(holder) {
    let logDetail = RestApi.api.recordSearch.postAlarmLogDeteal;
    let api = `${protocolHeader}${ip}${logDetail}`;

    let params = {};
    for (let k in holder) {
      if (holder[k]) {
        params[k] = holder[k];
      }
    }
    return axios.post(api, params);
  },
  // 修改报警记录处理
  putAlarmLogDeteal(holder) {
    let logDetail = RestApi.api.recordSearch.putAlarmLogDeteal(holder.dealUuid);
    let api = `${protocolHeader}${ip}${logDetail}`;

    let params = {};
    for (let k in holder) {
      if (holder[k]) {
        params[k] = holder[k];
      }
    }
    return axios.put(api, params);
  },
  /**
   * 获取门状态列表
   */
  getChannelStatusList(holder) {
    let api = `${protocolHeader}${ip}${RestApi.api.recordSearch.getChannelStatusList}`;

    let params = {};
    for (let k in holder) {
      params[k] = holder[k];
    }
    return axios.get(api, {params: params});
  },
  /**
   * 获取组织设备树
   */
  getOrgDevTree(holder) {
    let api = `${protocolHeader}${ip}${RestApi.api.recordSearch.getOrgDevTree}`;

    let params = {};
    for (let k in holder) {
      params[k] = holder[k];
    }
    return axios.get(api, {params: params});
  },
  /**
   * 远程控制门状态
   */
  handleDoorStatus(holder, moduleHead) {
    let api = `${protocolHeader}${ip}${RestApi.api.recordSearch.handleDoorStatus(holder.channelUuid, holder.action)}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return moduleHead ? axios.put(api, data, moduleHead) : axios.put(api);
  },
  /**
   * 获取门状态统计
   */
  getStatistics() {
    let api = `${protocolHeader}${ip}${RestApi.api.recordSearch.getStatistics}`;

    return axios.get(api);
  },
  /**
   * 消警
   */
  removeAlarm(holder) {
    let api = `${protocolHeader}${ip}${RestApi.api.recordSearch.removeAlarm(holder.channelUuid)}`;

    return axios.put(api);
  },
  /**
   * 全部开门、关门、消警
   */
  allOperation(holder) {
    let api = `${protocolHeader}${ip}${RestApi.api.recordSearch.allOperation}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
   * 查询人员预警记录
   */
  getWarningRecord(holder) {
    let api = `${protocolHeader}${ip}${RestApi.api.recordSearch.getWarningRecord}`;

    let params = {};
    for (let k in holder) {
      if (holder[k]) {
        params[k] = holder[k];
      }
    }
    return axios.get(api, {params: params});
  },
  /**
   * 查询预警主题
   */
  getThemeList(holder) {
    let api = `${protocolHeader}${ip}${RestApi.api.recordSearch.getThemeList}`;

    let params = {};
    for (let k in holder) {
      if (holder[k]) {
        params[k] = holder[k];
      }
    }
    return axios.get(api, {params: params});
  },
};

function install(Vue) {
  Vue.prototype.$logSearchHttp = LogSearchHttp;
};

export default install;
