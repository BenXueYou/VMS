import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
import store from "@/store/store";
import Vue from 'vue';

let ip = window.config.ip;
export var houseHttp = {
  /**
   * 初始化小区
   */
  initArea(holder) {
    let api = `${window.config.protocolHeader}${ip}${
      RestApi.api.buildingHouse.initArea
    }`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
   * 获取小区结构信息
   */
  getAreaStruct(holder) {
    let api = `${window.config.protocolHeader}${ip}${
      RestApi.api.buildingHouse.getAreaStruct
    }`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 获取小区结构信息
   */
  getAreaStructByProjectUuid(projectUuid, holder) {
    let api = `${
      window.config.protocolHeader
    }${ip}${RestApi.api.buildingHouse.getAreaStructByProjectUuid(projectUuid)}`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },

  /**
   * 获取基建下一子节点
   */
  getInfrastructure(holder) {
    let api = `${window.config.protocolHeader}${ip}${
      RestApi.api.buildingHouse.getInfrastructure
    }`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 获取基建下一子节点根据projectUuid
   */
  getInfrastructureByProjectUuid(projectUuid, holder) {
    let api = `${window.config.protocolHeader}${ip}${
      RestApi.api.buildingHouse.getInfrastructureByProjectUuid(projectUuid)
    }`;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  /**
   * 获取基建下一子节点到房屋
   */
  getInfrastructureToHouse(holder) {
    let api = `${window.config.protocolHeader}${ip}${
      RestApi.api.buildingHouse.getInfrastructureToHouse
    }`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  getInfrastructureToUnit(uuid) {
    let api =
      `${window.config.protocolHeader}${ip}` +
      RestApi.api.buildingHouse.getInfrastructureToUnit(uuid);
    return axios.get(api);
  },
  /**
   * 获取基建下一子节点到设备
   */
  getInfrastructureToDevice(holder) {
    let api = `${
      window.config.protocolHeader
    }${ip}${RestApi.api.buildingHouse.getInfrastructureToDevice(
      holder.parentUuid
    )}`;

    return axios.get(api);
  },
  /**
   * 添加基建
   */
  addInfrastructure(holder) {
    let api = `${window.config.protocolHeader}${ip}${
      RestApi.api.buildingHouse.addInfrastructure
    }`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
   * 修改基建名称
   */
  editInfrastructureName(holder) {
    let api = `${
      window.config.protocolHeader
    }${ip}${RestApi.api.buildingHouse.editInfrastructureName(
      holder.infrastructureUuid
    )}?infrastructureName=${holder.infrastructureName}&infrastructureUri=${
      holder.infrastructureUri
    }`;

    return axios.put(api);
  },
  /**
   * 删除基建
   */
  deleteInfrastructure(holder) {
    let api = `${
      window.config.protocolHeader
    }${ip}${RestApi.api.buildingHouse.deleteInfrastructure(
      holder.infrastructureUuid
    )}?infrastructureType=${holder.infrastructureType}`;

    return axios.delete(api);
  },
  /**
   * 上移或下移基建节点
   */
  moveInfrastructure(holder) {
    let api = `${window.config.protocolHeader}${ip}${
      RestApi.api.buildingHouse.moveInfrastructure
    }`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
   * 获取房屋列表
   */
  getHouseList(holder) {
    let projectUuid = holder.projectUuid || store.state.home.projectUuid;
    let api = `${
      window.config.protocolHeader
    }${ip}${RestApi.api.buildingHouse.getHouseList(holder.infrastructureUuid, projectUuid)}`;

    let data = {};
    Object.assign(data, holder);
    // // 过滤入参的infrastructureUuid
    // for (let k in holder) {
    //   // if (k !== "infrastructureUuid") {
    //   data[k] = holder[k];
    //   // }
    // }
    data = Vue.prototype.$common.deleteEmptyString(data);
    // 过滤空字符串
    return axios.get(api, { params: data });
  },
  /**
   * 新增房屋
   */
  addHouse(holder) {
    let api = `${
      window.config.protocolHeader
    }${ip}${RestApi.api.buildingHouse.addHouse(holder.rootInfrastructureUuid)}`;

    let data = {};
    for (let k in holder) {
      if (
        k !== "rootInfrastructureUuid" &&
        holder[k] !== "" &&
        holder[k] !== null &&
        holder[k] !== undefined
      ) {
        data[k] = holder[k];
      }
    }
    return axios.post(api, data);
  },
  /**
   * 新增单元
   */
  addUnit(holder) {
    let api = `${window.config.protocolHeader}${ip}${
      RestApi.api.buildingHouse.addUnit
    }`;

    let data = {};
    for (let k in holder) {
      if (holder[k]) {
        data[k] = holder[k];
      }
    }
    return axios.post(api, data);
  },
  /**
   * 删除房屋
   */
  deleteHouse(holder) {
    let api = `${window.config.protocolHeader}${ip}${
      RestApi.api.buildingHouse.deleteHouse
    }`;

    let data = {};
    for (let k in holder) {
      if (holder[k]) {
        data[k] = holder[k];
      }
    }
    return axios.delete(api, {
      data: data["infrastructureList"]
    });
  },
  /**
   * 复制基建
   */
  copyInfrastructure(holder) {
    let api = `${
      window.config.protocolHeader
    }${ip}${RestApi.api.buildingHouse.copyInfrastructure(
      holder.infrastructureUuid
    )}?infrastructureName=${holder.infrastructureName}`;

    return axios.post(api);
  },
  // 查询房屋详情
  getDetailInfrastructure(holder) {
    let api = `${
      window.config.protocolHeader
    }${ip}${RestApi.api.buildingHouse.getBuildingDetail(
      holder.infrastructureUuid
    )}`;
    return axios.get(api);
  }
};

function install(Vue) {
  Vue.prototype.$houseHttp = houseHttp;
}

export default install;
