import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var FactTragicHttp = {
  /**
   * 获取同行人列表
   */
  getCompanionList(holder) {
    let api = `${RestApi.api.faceModuleAPi.getCompanionList}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 获取频次分析列表
   */
  getFaceAnalysisTable(holder) {
    let api = `${RestApi.api.faceModuleAPi.getFaceAnalysisTable}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
};

function install(Vue) {
  Vue.prototype.$factTragicHttp = FactTragicHttp;
}

export default install;
