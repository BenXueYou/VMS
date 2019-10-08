import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var IntelModelHttp = {
  /**
   * 智能模型列表查询
   */
  getIntelModelList(holder) {
    let api = `${RestApi.api.faceModuleAPi.getIntelModelList}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 智能模型详情查询
   */
  getIntelModelDetails(holder) {
    let api = `${RestApi.api.faceModuleAPi.getIntelModelDetails(holder.modelUuid)}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 报警列表查询
   */
  getJudgedList(holder) {
    let api = `${RestApi.api.faceModuleAPi.getJudgedList}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 修改智能模型
   */
  editIntelModel(holder) {
    let api = `${RestApi.api.faceModuleAPi.editIntelModel}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.put(api, data);
  },
  /**
   * 新增智能模型
   */
  addIntelModel(holder) {
    let api = `${RestApi.api.faceModuleAPi.addIntelModel}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
   * 删除智能模型
   */
  deleteIntelModel(holder) {
    let api = `${RestApi.api.faceModuleAPi.deleteIntelModel(holder.modelUuid)}`;
    return axios.delete(api);
  },
};

function install(Vue) {
  Vue.prototype.$intelModelHttp = IntelModelHttp;
}

export default install;
