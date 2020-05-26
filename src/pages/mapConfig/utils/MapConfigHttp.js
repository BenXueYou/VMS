import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var MapConfigHttp = {
  /**
   * 获取组织树
   */
  getTree(holder) {
    let api = `${RestApi.mapApi.mapConfigApi.getTree}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
   * 获取配置资源树
   */
  getResTree(holder) {
    let api = `${RestApi.mapApi.mapConfigApi.getResTree}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
   * 获取地图信息
   */
  getMapInfo(holder) {
    let api = `${RestApi.mapApi.mapConfigApi.getMapInfo}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 保存地图信息
   */
  saveMapInfo(holder) {
    let api = `${RestApi.mapApi.mapConfigApi.saveMapInfo}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
   * 修改地图信息
   */
  updateMapInfo(holder) {
    let api = `${RestApi.mapApi.mapConfigApi.updateMapInfo}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.put(api, data);
  },
  /**
   * 删除地图信息
   */
  deleteMapInfo(holder) {
    let api = `${RestApi.mapApi.mapConfigApi.deleteMapInfo}?mapUuid=${holder.mapUuid}`;
    return axios.delete(api);
  },
  /**
   * 获取地图元素
   */
  getMapElements(holder) {
    let api = `${RestApi.mapApi.mapConfigApi.getMapElements}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 新增地图元素
   */
  addMapElement(holder) {
    let api = `${RestApi.mapApi.mapConfigApi.addMapElement}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
   * 修改地图元素
   */
  editMapElement(holder) {
    let api = `${RestApi.mapApi.mapConfigApi.editMapElement}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.put(api, data);
  },
  /**
   * 删除地图元素
   */
  deleteMapElement(holder) {
    let api = `${RestApi.mapApi.mapConfigApi.deleteMapElement}?elementUuidList=${holder.elementUuidList}`;
    return axios.delete(api);
  },
  /**
   * 添加地图操作日志
   */
  setMapSysLog(holder) {
    let api = `${RestApi.mapApi.setMapSysLog}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
};

function install(Vue) {
  Vue.prototype.$mapConfigHttp = MapConfigHttp;
}

export default install;
