import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var SearchFaceHttp = {
  /**
   * 初始化小区
   */
  searchFace(holder) {
    let api = `${RestApi.faceModuleAPi.searchFace}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
   * 临时布控
   */
  tempMonitor(holder) {
    let api = `${RestApi.faceModuleAPi.tempMonitor}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
};

function install(Vue) {
  Vue.prototype.$searchFaceHttp = SearchFaceHttp;
}

export default install;
