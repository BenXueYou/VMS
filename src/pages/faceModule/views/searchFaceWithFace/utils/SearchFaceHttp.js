import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var SearchFaceHttp = {
  /**
   * 初始化小区
   */
  searchFace(holder) {
    let api = `${RestApi.api.faceModuleAPi.searchFace}`;
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
