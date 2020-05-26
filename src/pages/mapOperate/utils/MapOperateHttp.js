import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

export var MapOperateHttp = {
  /**
   * 获取地图元素
   */
  getOperaMapElements(holder) {
    let api = `${RestApi.mapApi.mapOperateApi.getOperaMapElements}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 添加搜索历史
   */
  addHistory(holder) {
    let api = `${RestApi.mapApi.mapOperateApi.addHistory}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
   * 获取搜索历史
   */
  getHistory(holder) {
    let api = `${RestApi.mapApi.mapOperateApi.getHistory}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 删除历史
   */
  deleteHistory(historyRecordType) {
    let api = `${RestApi.mapApi.mapOperateApi.deleteHistory}?historyRecordType=${historyRecordType}`;
    return axios.delete(api);
  },
  /**
   * 获取收藏列表
   */
  getCollection(holder) {
    let api = `${RestApi.mapApi.mapOperateApi.getCollection}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 添加收藏
   */
  addCollection(holder) {
    let api = `${RestApi.mapApi.mapOperateApi.addCollection}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
   * 取消收藏
   */
  cancelCollection(holder) {
    let api = `${RestApi.mapApi.mapOperateApi.cancelCollection}?elementUuid=${holder.elementUuid}`;
    return axios.delete(api);
  },
  /**
   * 获取区域坐标
   */
  getAreaPoints(holder) {
    let api = `${RestApi.mapApi.mapOperateApi.getAreaPoints}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 获取上级平台元素
   */
  getUpLevelMapElements(holder) {
    let api = `${RestApi.mapApi.mapOperateApi.getUpLevelMapElements}`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
};

function install(Vue) {
  Vue.prototype.$mapOperateHttp = MapOperateHttp;
}

export default install;
