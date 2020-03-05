import axios from "@/utils/Request";
// import RestApi from '@/utils/RestApi';
import RestApi from "@/utils/RestApi";
let ip = window.config.ip;
let protocolHeader = window.config.protocolHeader;
export let ResidentManageAjax = {
  /**
   * 获取居民列表
   * address string (query) 住址
   * cellphone string (query) 手机号码
   * createTimeOver string (query) 注册时间 止
   * createTimeStart string (query) 注册时间 启
   * gender string (query) 性别
   * limit integer($int32) (query) 每页显示行数
   * page integer($int32) (query) 当前页数
   * projectUuid string(path) 项目
   * UUIDqueryType string (query) 查询类型,infrastructure 基建；staffLabel按标签
   * queryTypeUuid string (query) 查询类型uuid
   * staffName string (query) 姓名
   * staffType string (query) 人员类型
   */
  getResidentListApi(xhr) {
    let url = `${protocolHeader}${ip}${RestApi.api.residentManage.getResidentListApi}`;
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
    let api = `${protocolHeader}${ip}${RestApi.api.residentManage.postResidentApi}`;
    return axios.post(api, xhr);
  },
  /**
   * 修改居民
   * limit 每页条数
   * page  当前页树
   */
  putResidentApi(xhr) {
    let api = `${protocolHeader}${ip}${RestApi.api.residentManage.putResidentApi}`;
    return axios.put(api, xhr);
  },
  /**
   * 删除居民
   * groupUuid
   */
  deleteResidentApi(groupUuidList) {
    let api = `${protocolHeader}${ip}${RestApi.api.residentManage.deleteResidentApi}`;
    return axios.delete(api, { data: groupUuidList });
    // return axios.delete(api, {params: {uuid: groupUuidList}});
  },
  /**
   * 获取居民详情信息
   * limit 每页条数
   * page  当前页树
   */
  getResidentDetailApi(xhr) {
    let api = `${protocolHeader}${ip}${RestApi.api.residentManage.getResidentDetailApi}${
      xhr.staffUuid
    }`;
    return axios.get(api);
  },
  /**
   * 初始化刷新树
   */
  getResidentTreeDataApi(xhr) {
    let api = `${protocolHeader}${ip}${
      RestApi.api.residentManage.getResidentTreeDataApi
    }`;
    return axios.get(api);
  },
  /**
   * 根据当前的节点id获取子节点
   */
  getResidentTreeNodeDataApi(xhr) {
    let api = `${protocolHeader}${ip}${
      RestApi.api.residentManage.getResidentTreeSubDataApi
    }?parentUuid=${xhr}`;
    return axios.get(api);
  },
  /**
   * 居民管理左侧菜单楼栋房屋，获取子节点
   */
  getResidentLeftMenuSubDataApi(xhr) {
    let api = `${protocolHeader}${ip}${
      RestApi.api.residentManage.getResidentLeftMenuSubDataApi
    }${xhr}/unit`;
    return axios.get(api);
  },
  /**
   * 获取门禁权限列表
   */
  getDoorAccessAuthListApi(groupType = 'normal') {
    let api = `${protocolHeader}${ip}${
      RestApi.api.residentManage.getDoorAccessAuthListApi
    }?limit=10000&page=1&groupType=${groupType}`;
    return axios.get(api);
  },
  /**
   * 根据子节点可以获取到底下的人员
   */
  getResidentTreeStaffNodeApi(parentUuid, type) {
    let api = `${protocolHeader}${ip}${
      RestApi.api.residentManage.getResidentTreeStaffNodeApi
    }?parentUuid=${parentUuid}&type=${type}`;
    return axios.get(api);
  },
  /**
   * 获取居民标签详情
   */
  getResidentTagDetail(xhr) {
    let api = `${protocolHeader}${ip}${
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
    let api = `${protocolHeader}${ip}${RestApi.api.residentManage.addElementToTag}`;
    let params = [];
    for (let i = 0; i < xhr.length; i++) {
      let element = xhr[i];
      let item = {
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
    let api = `${protocolHeader}${ip}${RestApi.api.residentManage.deleteElementFromTag}`;
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
    let api = `${protocolHeader}${ip}${RestApi.api.residentManage.putElementToTag}`;
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
   *
   */
  /**
 * id: (...)
label: (...)
nextCount: (...)
orgName: (...)
orgSn: (...)
orgType: (...)
orgUuid: (...)
treeName: ""
type: (...)
version: (...)
extInfo	string

扩展信息
resSn	integer($int32)
资源序号
resType	string
资源类型
resUuid	string
资源UUID
setUuid	string
集合UUID
version	integer($int32)
版本号
 */
  getResidentFromDevice(xhr) {
    let api = `${protocolHeader}${ip}${RestApi.api.residentManage.getResidentFromDevice}`;
    let params = [];
    for (let i = 0; i < xhr.length; i++) {
      let item = {};
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
    let api = `${protocolHeader}${ip}${RestApi.api.faceQualityDetection}`;
    return axios.post(api, xhr);
  },
  // 获取单元(楼栋)基建下的层与房屋展开信息
  getFloorAndHouse(infrastructureUuid) {
    let api = `${protocolHeader}${ip}${
      RestApi.api.residentManage.getFloorAndHouse
    }${infrastructureUuid}/floorAndHouse`;
    return axios.get(api);
  },
  // 统计居民管理信息
  getResidentStaticData() {
    let api = `${protocolHeader}${ip}${RestApi.api.residentManage.getResidentStaticData}`;
    return axios.get(api);
  },
  // 获取居民标签概要信息
  getResidentTagBriefDetail(tagUuid, needType) {
    let api = `${protocolHeader}${ip}${
      RestApi.api.residentManage.getResidentTagBriefDetail
    }${tagUuid}/tagElement/${needType}`;
    return axios.get(api);
  },

  // 居民导出
  downLoadResidentData() {
    let url = `${protocolHeader}${ip}${RestApi.api.residentManage.downLoadResidentApi}`;
    return axios({
      method: "get",
      responseType: 'blob', // 二进制流
      url,
    });
  },
};

function install(Vue) {
  Vue.prototype.$ResidentManageAjax = ResidentManageAjax;
}

export default install;
