import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var SysConfigHttp = {
  /**
   * 获取地图设置
   */
  getMapSet(projectUuid) {
    let api = `${RestApi.sysApi.mapSetApi.getMapSet(projectUuid)}`;
    return axios.get(api);
  },
  /**
   * 更新地图设置
   */
  updateMapSet(holder) {
    let api = `${RestApi.sysApi.mapSetApi.updateMapSet}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.put(api, data);
  },
};

function install(Vue) {
  Vue.prototype.$sysConfigHttp = SysConfigHttp;
}

export default install;
