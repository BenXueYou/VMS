import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var statisticHttp = {
  /**
   * 抓拍统计（全部）
   */
  getFaceCaptureAll(holder) {
    let api = `${RestApi.api.faceModuleAPi.getFaceCaptureAll}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 抓拍统计（单一）
   */
  getFaceCaptureOne(holder) {
    let api = `${RestApi.api.faceModuleAPi.getFaceCaptureOne}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 对比统计（全部）
   */
  getCompareAll(holder) {
    let api = `${RestApi.api.faceModuleAPi.getCompareAll}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 对比统计（单一）
   */
  getCompareOne(holder) {
    let api = `${RestApi.api.faceModuleAPi.getCompareOne}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
};

function install(Vue) {
  Vue.prototype.$statisticHttp = statisticHttp;
}

export default install;
