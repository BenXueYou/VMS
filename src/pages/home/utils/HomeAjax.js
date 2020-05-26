import axios from '@/utils/Request';
import RestApi from '@/utils/RestApi';

// let ip = window.config.ip;
export var HomeAjax = {

  /**
   * 类型翻译接口
   */
  queryBaseTypeByGroup() {
    let api = RestApi.api.queryBaseTypeByGroup;
    return axios.get(api);
  },
  /**
   * 地图获取接口
   */
  getMapStyle() {
    let api = RestApi.api.getMapStyle;
    return axios.get(api);
  },
  /**
   * 区域行政边界获取接口
   */
  getAreaMapBorder() {
    let api = RestApi.api.getAreaMapBorder;
    return axios.get(api);
  },
};

function install(Vue) {
  Vue.prototype.$homeAjax = HomeAjax;
};

export default install;
