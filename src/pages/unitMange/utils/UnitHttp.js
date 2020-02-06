import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

let ip = window.config.ip;
export var unitHttp = {
  /**
   * 查询单位列表
   */
  getAllUnits(holder) {
    let api = `${window.config.protocolHeader}${ip}${
      RestApi.api.unitMange.getAllUnits
    }`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 删除单位
   */
  delUnits(holder) {
    let api = `${window.config.protocolHeader}${ip}${
      RestApi.api.unitMange.delUnits
    }?unitName=${holder['unitName']}`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios({
      url: api,
      method: "delete",
      data: data["unitsUuids"]
    });
  },
  /**
   * 新增单位
   */
  addUnits(holder) {
    let api = `${window.config.protocolHeader}${ip}${
      RestApi.api.unitMange.addUnits
    }`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
   * 修改单位
   */
  updateUnits(holder) {
    let api = `${window.config.protocolHeader}${ip}${
      RestApi.api.unitMange.updateUnits
    }`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.put(api, data);
  },
  /**
   * 查看单位从业人员详情
   */
  selPeople(holder) {
    let api = `${window.config.protocolHeader}${ip}${
      RestApi.api.unitMange.selPeople
    }`;

    let data = {};
    for (let k in holder) {
      if (holder[k]) {
        data[k] = holder[k];
      }
    }
    return axios.get(api, { params: data });
  }
};

function install(Vue) {
  Vue.prototype.$unitHttp = unitHttp;
}

export default install;
