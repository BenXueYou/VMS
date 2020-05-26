import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var defanceDevHttp = {
  /**
   * 获取小区结构信息
   */
  getDefanceDevList(holder) {
    let api = `${RestApi.communityBoard.oneSixApi.getDefanceDevList}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
};

function install(Vue) {
  Vue.prototype.$DefanceDevHttp = defanceDevHttp;
}

export default install;
