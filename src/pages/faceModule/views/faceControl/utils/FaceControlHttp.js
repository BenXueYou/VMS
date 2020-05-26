import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var FaceControlHttp = {
  /**
   * 布控任务列表查询
   */
  getMonitoringTaskList(holder) {
    let api = `${RestApi.faceModuleAPi.getMonitoringTaskList}`;
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
    let api = `${RestApi.faceModuleAPi.getMonitoringTaskDetails(holder.taskUuid)}`;
    return axios.get(api);
  },
  /**
   * 报警列表查询
   */
  getAlarmList(holder) {
    let api = `${RestApi.faceModuleAPi.getAlarmList}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
   * 修改布控任务
   */
  editMonitoringTask(holder) {
    let api = `${RestApi.faceModuleAPi.editMonitoringTask}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.put(api, data);
  },
  /**
   * 修改布控任务
   */
  editMonitoringTaskStatus(holder) {
    let api = `${RestApi.faceModuleAPi.editMonitoringTaskStatus}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.put(api, data);
  },
  /**
   * 新增布控任务
   */
  addMonitoringTask(holder) {
    let api = `${RestApi.faceModuleAPi.addMonitoringTask}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
   * 删除布控任务
   */
  deleteMonitoringTask(holder) {
    let api = `${RestApi.faceModuleAPi.deleteMonitoringTask(holder.taskUuid)}`;
    return axios.delete(api);
  },
  getFacedbList(holder) {
    let api = `${RestApi.faceModuleAPi.getFacedbList}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  getDevList(holder) {
    let api = `${RestApi.faceModuleAPi.getDevList}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  getTagList(holder) {
    let api = `${RestApi.faceModuleAPi.getTagList}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  getTagDev(holder) {
    let api = `${RestApi.faceModuleAPi.getTagDev}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  getDevChannelList(deviceUuid, holder) {
    let api = `${RestApi.faceModuleAPi.getDevChannelList(deviceUuid)}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  getAlarmSound() {
    let api = `${RestApi.faceModuleAPi.getAlarmSound}`;
    return axios.get(api);
  },
  getDeviceChannelList(holder) {
    let api = `${RestApi.faceModuleAPi.baseDataApi.getDeviceChannelList(holder.projectUuid)}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
};

function install(Vue) {
  Vue.prototype.$faceControlHttp = FaceControlHttp;
}

export default install;
