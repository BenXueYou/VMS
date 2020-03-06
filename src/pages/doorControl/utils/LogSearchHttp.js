import axios from '@/utils/Request';
import RestApi from '@/utils/RestApi';

let ip = window.config.ip;
let protocolHeader = window.config.protocolHeader;
export var LogSearchHttp = {

  /**
   * 门禁记录列表查询
   */
  getDoorLog(holder) {
    let api = `${protocolHeader}${ip}${RestApi.api.recordSearch.getDoorLog}`;
    let params = {};
    for (let k in holder) {
      if (holder[k] !== "" && holder[k] !== null && holder[k] !== undefined) {
        params[k] = holder[k];
      }
    }
    return axios.get(api, {params: params});
  },
  /**
   * 报警记录列表查询
   */
  getAlarmLog(holder) {
    let api = `${protocolHeader}${ip}${RestApi.api.recordSearch.getAlarmLog}`;

    let params = {};
    for (let k in holder) {
      if (holder[k]) {
        params[k] = holder[k];
      }
    }
    return axios.get(api, {params: params});
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
    let logDetail = RestApi.api.recordSearch.putAlarmLogDeteal(holder.alarmUuid);
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
  handleDoorStatus(holder) {
    let api = `${protocolHeader}${ip}${RestApi.api.recordSearch.handleDoorStatus(holder.channelUuid, holder.action)}`;

    return axios.put(api);
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
};

function install(Vue) {
  Vue.prototype.$logSearchHttp = LogSearchHttp;
};

export default install;
