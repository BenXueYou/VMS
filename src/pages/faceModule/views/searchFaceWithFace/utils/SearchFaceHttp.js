import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var SearchFaceHttp = {
  /**
   * 初始化小区
   */
  searchFace(holder) {
    let api = `${window.config.protocolHeader}${window.config.ip}${RestApi.api.faceModule.searchFace}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
};

function install(Vue) {
  Vue.prototype.$searchFaceHttp = SearchFaceHttp;
}

export default install;
