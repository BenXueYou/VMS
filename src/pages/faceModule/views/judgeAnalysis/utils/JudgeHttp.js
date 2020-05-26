import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var JudgeHttp = {
  getJudgeList(holder) {
    let api = `${RestApi.faceModuleAPi.getJudgeList}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  handleJudgeDetail(holder) {
    let api = `${RestApi.faceModuleAPi.handleJudgeDetail}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.put(api, data);
  },
  getModelDev(holder) {
    let api = `${RestApi.faceModuleAPi.getModelDev}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  getJudgeDetails(holder) {
    let api = `${RestApi.faceModuleAPi.getJudgeDetails}`;
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
