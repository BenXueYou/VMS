import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

let ip = window.config.ip;
export var ProjectManageAjax = {
  /**
   * 登录
   */
  setLogUuid(holder, projectUuid) {
    let api = `${window.location.protocol}//${ip}/${
      RestApi.api.login.setLogUuid(projectUuid)
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
  Vue.prototype.$ProjectManageAjax = ProjectManageAjax;
}

export default install;
