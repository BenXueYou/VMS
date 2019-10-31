import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var ModuleCountHttp = {
  getModelList(holder) {
    let api = `${RestApi.api.faceModuleAPi.getModelList}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
};

function install(Vue) {
  Vue.prototype.$moduleCountHttp = ModuleCountHttp;
}

export default install;
