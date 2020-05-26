import axios from "@/utils/Request";
import store from '@/store/store';
import RestApi from "@/utils/RestApi";
let ip = window.config.ip,
  protocolHeader = window.config.protocolHeader,
  httpRsidentHeader = `${protocolHeader}${ip}`;
export var ResidentManageAjax = {
  /**
   * 获取居民列表
   */
  getResidentListApi(xhr) {
    let projectUuid = store.state.home.projectUuid;
    if (xhr.projectUuid) projectUuid = xhr.projectUuid;
    let url = `${httpRsidentHeader}${RestApi.api.residentManage.getResidentListApi(projectUuid)}`;
    return axios({
      method: "get",
      url,
      params: xhr
    });
  },
  /**
   * 增加居民
   * groupUuid
   */
  postResidentApi(xhr) {
    let api = `${httpRsidentHeader}${RestApi.api.residentManage.postResidentApi}`;
    return axios.post(api, xhr);
  },
  /**
   * 修改居民
   * limit 每页条数
   * page  当前页树
   */
  putResidentApi(xhr) {
    let api = `${httpRsidentHeader}${RestApi.api.residentManage.putResidentApi}`;
    return axios.put(api, xhr);
  },
  /**
   * 删除居民
   * groupUuid
   */
  deleteResidentApi(groupUuidList) {
    let api = `${httpRsidentHeader}${RestApi.api.residentManage.deleteResidentApi}`;
    return axios.delete(api, { data: groupUuidList });
    // return axios.delete(api, {params: {uuid: groupUuidList}});
  },
  /**
   * 获取居民详情信息
   * limit 每页条数
   * page  当前页树
   */
  getResidentDetailApi(xhr, logcontent = {}) {
    let projectUuid = '';
    if (xhr && xhr.projectUuid) {
      projectUuid = xhr.projectUuid;
    } else {
      projectUuid = store.state.home.projectUuid;
    }
    let api = `${httpRsidentHeader}${RestApi.api.residentManage.getResidentDetailApi(projectUuid)}${
      xhr.staffUuid
    }`;
    let headers;
    if (logcontent.modelName) {
      headers = {
        VIEW_MODULE_NAME: encodeURIComponent(logcontent.modelName),
        VIEW_MODULE_DETAIL: encodeURIComponent(logcontent.detailContent)
      };
    }
    return axios.get(api, {
      headers: headers
    });
  },
  /**
   * 初始化刷新树
   */
  getResidentTreeDataApi(xhr) {
    let api = '';
    if (xhr && xhr.projectUuid) {
      api = `${httpRsidentHeader}${
        RestApi.api.residentManage.getResidentTreeDataApi(xhr.projectUuid)
      }`;
    } else {
      api = `${httpRsidentHeader}${
        RestApi.api.residentManage.getResidentTreeDataApi(store.state.home.projectUuid)
      }`;
    }
    return axios.get(api);
  },
  /**
   * 根据当前的节点id获取子节点
   */
  getResidentTreeNodeDataApi(xhr) {
    let api = `${httpRsidentHeader}${
      RestApi.api.residentManage.getResidentTreeSubDataApi(store.state.home.projectUuid)
    }?parentUuid=${xhr}`;
    return axios.get(api);
  },
  /**
   * 居民管理左侧菜单楼栋房屋，获取子节点
   */
  getResidentLeftMenuSubDataApi(xhr) {
    let projectUuid = xhr.projectUuid || store.state.home.projectUuid;
    let api = `${httpRsidentHeader}${
      RestApi.api.residentManage.getResidentLeftMenuSubDataApi(projectUuid)
    }${xhr.id}/unit`;
    return axios.get(api);
  },
  /**
   * 获取门禁权限列表
   */
  getDoorAccessAuthListApi(groupType = 'normal') {
    let api = `${httpRsidentHeader}${
      RestApi.api.residentManage.getDoorAccessAuthListApi
    }?limit=10000&page=1&groupType=${groupType}`;
    return axios.get(api);
  },
  /**
   * 根据子节点可以获取到底下的人员
   */
  getResidentTreeStaffNodeApi(parentUuid, type) {
    let api = `${httpRsidentHeader}${
      RestApi.api.residentManage.getResidentTreeStaffNodeApi()
    }?parentUuid=${parentUuid}&type=${type}`;
    return axios.get(api);
  },
  /**
   * 获取居民标签详情
   */
  getResidentTagDetail(xhr) {
    let api = `${httpRsidentHeader}${
      RestApi.api.residentManage.getResidentTagDetailApi
    }`;
    xhr.tagType = "resident";
    return axios({
      method: "get",
      url: api,
      params: xhr
    });
  },
  /**
   * 居民标签内添元素
   */
  addElementToTag(xhr, tagObj) {
    console.log(xhr, tagObj);
    let api = `${httpRsidentHeader}${RestApi.api.residentManage.addElementToTag}`;
    var params = [];
    for (let i = 0; i < xhr.length; i++) {
      let element = xhr[i];
      var item = {
        elementSn: i,
        elementUuid: element.id,
        elementType: element.type,
        tagUuid: tagObj.tagUuid,
        version: tagObj.version
      };
      params.push(item);
    }
    return axios.post(api, params);
  },
  /**
   * 删除居民标签内元素
   */
  deleteElementFromTag(xhr, tagObj) {
    console.log(tagObj);
    let api = `${httpRsidentHeader}${RestApi.api.residentManage.deleteElementFromTag}`;
    for (let i = 0; i < xhr.length; i++) {
      let element = xhr[i];
      element.elementSn = i;
      element.elementUuid = element.staffUuid;
      element.elementType = tagObj.type;
      element.tagUuid = tagObj.tagUuid;
      element.tagType = null;
      element.version = tagObj.version;
    }
    console.log(xhr);
    return axios.delete(api, { data: xhr });
  },
  /**
   * 修改居民内标签元素
   * @param {*} xhr
   */
  putElementForResidentTag(xhr, tagObj) {
    console.log(tagObj);
    let api = `${httpRsidentHeader}${RestApi.api.residentManage.putElementToTag}`;
    for (let i = 0; i < xhr.length; i++) {
      let element = xhr[i];
      element.elementSn = i;
      element.elementUuid = element.id;
      element.elementType = element.type;
      element.extInfo = null;
      element.tagUuid = tagObj.tagUuid;
      element.tagType = null;
      element.version = tagObj.version;
    }
    return axios.put(api, xhr);
  },
  /**
   * getResidentFromDevice
   */
  getResidentFromDevice(xhr) {
    let api = `${httpRsidentHeader}${RestApi.api.residentManage.getResidentFromDevice}`;
    var params = [];
    for (var i = 0; i < xhr.length; i++) {
      var item = {};
      item.resSn = i;
      item.resType = xhr[i].type;
      item.resUuid = xhr[i].id;
      params.push(item);
    }
    return axios.post(api, params);
  },
  getIcdIdCardApi(xhr) {
    let api = `${RestApi.api.residentManage.getIcdIdCardApi}?repeat=${xhr}`;
    return axios.get(api);
  },

  // 人脸图片质量检测
  // { “imageBase64” ：“string” }
  getFaceQualityDetection(xhr) {
    let api = `${httpRsidentHeader}${RestApi.faceQualityDetection}`;
    return axios.post(api, xhr);
  },
  // 获取单元(楼栋)基建下的层与房屋展开信息
  getFloorAndHouse(xhr) {
    let projectUuid = xhr.projectUuid || store.state.home.projectUuid;
    var api = `${httpRsidentHeader}${
      RestApi.api.residentManage.getFloorAndHouse(projectUuid)
    }${xhr.id}/floorAndHouse`;
    return axios.get(api);
  },
  // 统计居民管理信息
  getResidentStaticData() {
    var api = `${httpRsidentHeader}${RestApi.api.residentManage.getResidentStaticData(store.state.home.projectUuid)}`;
    return axios.get(api);
  },
  // 获取居民标签概要信息
  getResidentTagBriefDetail(tagUuid, needType) {
    var api = `${httpRsidentHeader}${
      RestApi.api.residentManage.getResidentTagBriefDetail
    }${tagUuid}/tagElement/${needType}`;
    return axios.get(api);
  }
};

function install(Vue) {
  Vue.prototype.$ResidentManageAjax = ResidentManageAjax;
}

export default install;
