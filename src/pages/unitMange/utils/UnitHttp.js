import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
import store from "@/store/store.js";
import Vue from 'vue';
let ip = window.config.ip;
export var unitHttp = {
  /**
   * 查询单位列表
   */
  getAllUnits(holder) {
    let projectUuid = holder.projectUuid || store.state.home.projectUuid;
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.unitMange.getAllUnits(projectUuid)}`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    data = Vue.prototype.$common.deleteEmptyString(data);
    return axios.get(api, { params: data });
  },
  getDataBoardAllUnits(holder, logcontent = {}) {
    let api = `${
      window.config.protocolHeader
    }${ip}/basedata-v1/${holder.projectUuid ||
      store.state.home.projectUuid}/units/allUnits`;
    let data = {};
    for (let k in holder) {
      if (k !== "projectUuid") {
        data[k] = holder[k];
      }
    }
    data = Vue.prototype.$common.deleteEmptyString(data);
    let headers;
    if (logcontent.modelName) {
      headers = {
        VIEW_MODULE_NAME: encodeURIComponent(logcontent.modelName),
        VIEW_MODULE_TYPE: encodeURIComponent(logcontent.type),
        VIEW_MODULE_DETAIL: encodeURIComponent(logcontent.detailContent)
      };
    }
    console.log(headers);
    return axios.get(api, {params: data, headers: headers});
  },
  getAllProjects(holder) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.unitMange.getAllProjects}`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 查询单位详情
   */
  getDetailUnits(holder) {
    let projectUuid = holder.projectUuid || store.state.home.projectUuid;
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.unitMange.getDetailUnits(projectUuid)}`;
    let data = { companyUuid: holder.companyUuid };
    return axios.get(api, { params: data });
  },
  /**
   * 删除单位
   */
  delUnits(holder = {}, logContent = {}) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.unitMange.delUnits}?unitName=${holder["unitName"]}`;

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
    return axios({
      headers: headers,
      url: api,
      method: "delete",
      data: data["unitsUuids"]
    });
  },
  /**
   * 新增单位
   */
  addUnits(holder = {}, logContent = {}) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.unitMange.addUnits}`;

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
   * 修改单位
   */
  updateUnits(holder = {}, logContent = {}) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.unitMange.updateUnits}`;

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
   * 查看单位从业人员详情
   */
  selPeople(holder, logcontent) {
    let projectUuid = holder.projectUuid || store.state.home.projectUuid;
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.unitMange.selPeople(projectUuid)}`;
    let data = {};
    for (let k in holder) {
      if (holder[k]) {
        data[k] = holder[k];
      }
    }
    data = Vue.prototype.$common.deleteEmptyString(data);
    let headers;
    if (logcontent.modelName) {
      headers = {
        VIEW_MODULE_NAME: encodeURIComponent(logcontent.modelName),
        VIEW_MODULE_TYPE: encodeURIComponent(logcontent.type),
        VIEW_MODULE_DETAIL: encodeURIComponent(logcontent.detailContent)
      };
    }
    return axios.get(api, {params: data, headers: headers});
  }
};

function install(Vue) {
  Vue.prototype.$unitHttp = unitHttp;
}

export default install;
