import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var ModuleCountHttp = {
  getModelList(holder) {
    let api = `${RestApi.faceModuleAPi.getModelList}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
};

function install(Vue) {
  Vue.prototype.$moduleCountHttp = ModuleCountHttp;
}

export default install;
