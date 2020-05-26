import axios from '@/utils/Request';
import RestApi from '@/utils/RestApi';

let ip = window.config.ip;
export var equipmentHttp = {

  /**
   * 查询装备列表
   */
  getAllequipments(holder) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.equipmentMange.getAllequipments}`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, {params: data});
  },
  /**
   * 删除装备
   */
  delequipments(holder = {}, logContent = {}) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.equipmentMange.delequipments}`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    let headers;
    if (logContent.modelName) {
      headers = {
        VIEW_MODULE_NAME: encodeURIComponent(logContent.modelName),
        VIEW_MODULE_TYPE: encodeURIComponent(logContent.type),
        VIEW_MODULE_DETAIL: encodeURIComponent(logContent.detailContent)
      };
    }
    return axios.delete(api, {
      data: data,
      headers: headers
    });
  },
  /**
   * 新增装备
   */
  addequipments(holder = {}, logContent = {}) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.equipmentMange.addequipments}`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    let headers;
    if (logContent.modelName) {
      headers = {
        VIEW_MODULE_NAME: encodeURIComponent(logContent.modelName),
        VIEW_MODULE_TYPE: encodeURIComponent(logContent.type),
        VIEW_MODULE_DETAIL: encodeURIComponent(logContent.detailContent)
      };
    }
    return axios.post(api, data, {headers: headers});
  },
  /**
   * 修改装备
   */
  updateequipments(holder = {}, logContent = {}) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.equipmentMange.updateequipments}`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    let headers;
    if (logContent.modelName) {
      headers = {
        VIEW_MODULE_NAME: encodeURIComponent(logContent.modelName),
        VIEW_MODULE_TYPE: encodeURIComponent(logContent.type),
        VIEW_MODULE_DETAIL: encodeURIComponent(logContent.detailContent)
      };
    }
    return axios.put(api, data, {headers: headers});
  },
  /**
   * 查看装备详情
   */
  selPeople(holder) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.equipmentMange.selPeople}`;

    let data = {};
    for (let k in holder) {
      if (holder[k]) {
        data[k] = holder[k];
      }
    }
    return axios.get(api, {params: data});
  },
};

function install(Vue) {
  Vue.prototype.$equipmentHttp = equipmentHttp;
};

export default install;
