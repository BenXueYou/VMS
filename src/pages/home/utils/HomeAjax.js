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
  }
};

function install(Vue) {
  Vue.prototype.$homeAjax = HomeAjax;
};

export default install;
