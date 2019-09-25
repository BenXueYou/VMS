import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var FaceControlHttp = {
  /**
   * 布控任务列表查询
   */
  getMonitoringTaskList(holder) {
    let api = `${RestApi.api.faceModuleAPi.getMonitoringTaskList}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 布控任务详情查询
   */
  getMonitoringTaskDetails(holder) {
    let api = `${RestApi.api.faceModuleAPi.getMonitoringTaskDetails(holder.taskUuid)}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 报警列表查询
   */
  getAlarmList(holder) {
    let api = `${RestApi.api.faceModuleAPi.getAlarmList}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 修改布控任务
   */
  editMonitoringTask(holder) {
    let api = `${RestApi.api.faceModuleAPi.editMonitoringTask}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.put(api, data);
  },
  /**
   * 删除布控任务
   */
  deleteMonitoringTask(holder) {
    let api = `${RestApi.api.faceModuleAPi.deleteMonitoringTask(holder.taskUuid)}`;
    return axios.delete(api);
  },
};

function install(Vue) {
  Vue.prototype.$faceControlHttp = FaceControlHttp;
}

export default install;
