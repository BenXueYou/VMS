import axios from "@/utils/Request";
import store from "@/store/store.js";
export var defanceDevHttp = {
  /**
   * 获取小区结构信息
   */
  getDefanceDevList(holder) {
    let api = `${window.config.protocolHeader}${window.config.ip}/sppc-dashboard-v1/project/${store.state.home.projectUuid}/panel/security/facility/list`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  }
};

function install(Vue) {
  Vue.prototype.$DefanceDevHttp = defanceDevHttp;
}

export default install;
