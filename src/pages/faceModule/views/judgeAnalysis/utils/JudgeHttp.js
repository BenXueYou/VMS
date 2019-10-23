import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var JudgeHttp = {
  getJudgeList(holder) {
    let api = `${RestApi.api.faceModuleAPi.getJudgeList}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  getModelDev(holder) {
    let api = `${RestApi.api.faceModuleAPi.getModelDev}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  getJudgeDetails(holder) {
    let api = `${RestApi.api.faceModuleAPi.getJudgeDetails}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  }
};

function install(Vue) {
  Vue.prototype.$judgeHttp = JudgeHttp;
}

export default install;
