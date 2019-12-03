import axios from '@/utils/Request';
import RestApi from '@/utils/RestApi';

let ip = window.config.ip;
export var LoginAjax = {

  /**
   * 登录
   */
  login(holder) {
    let api = `${window.location.protocol}//${ip}/${RestApi.api.login.login}`;
    return axios.post(api, `username=${holder.username}&password=${holder.password}&grant_type=password`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // "Authorization": "Basic d2ViOjEyMzQ1Ng=="
      }
    });
  },
   setLogUuid(holder) {
    let api = `${window.location.protocol}//${ip}/${
      RestApi.api.login.setLogUuid
    }`;
    return axios.post(api, `logUuid=${holder.logUuid}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
        // "Authorization": "Basic d2ViOjEyMzQ1Ng=="
      }
    });
  }
};

function install(Vue) {
  Vue.prototype.$loginAjax = LoginAjax;
};

export default install;
