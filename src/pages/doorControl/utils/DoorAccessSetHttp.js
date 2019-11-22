import axios from '@/utils/Request';
import RestApi from '@/utils/RestApi';
let ip = window.config.ip;
export var DoorAccessSetAjax = {
  /**
     * 获取互锁组列表
     * limit 每页条数
     * page  当前页树
     */
  getInterlockingApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.getInterlockingApi}?limit=${xhr.pageSize}&page=${xhr.currentPage}`;
    return axios.get(api);
  },
  /**
     * 获取互锁组详情
     * groupUuid
     */
  getInterlockDetailApi(groupUuid) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.getInterlockDetailApi}${groupUuid}`;
    return axios.get(api);
  },
  /**
     * 启动/关闭互锁组
     * groupUuid
     * version
     * enabled
     */
  operatorInterlockApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.operatorInterlockApi}${xhr.groupUuid}/enabled/${xhr.enabled}`;
    return axios.put(api, xhr);
  },
  /**
     * 增加互锁组
     * groupUuid
     * {
            "enabled": 0,
            "extInfo": {
                "additionalProp1": {},
                "additionalProp2": {},
                "additionalProp3": {}
            },
            "groupName": "string",
            "groupUuid": "string",
            "remarks": "string",
            "resourceSet": [
                {
                "extInfo": {
                    "additionalProp1": {},
                    "additionalProp2": {},
                    "additionalProp3": {}
                },
                "resSn": 0,
                "resType": "string",
                "resUuid": "string",
                "setUuid": "string",
                "version": 0
                }
            ],
            "setUuid": "string",
            "version": 0
        }
     */
  postInterlockApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.postInterlockApi}${xhr.groupUuid}`;
    return axios.post(api, xhr);
  },
  /**
     * 修改互锁组详情
     * groupUuid
     */
  putInterlockApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.putInterlockApi}${xhr.groupUuid}`;
    return axios.put(api, xhr);
  },
  /**
     * 获取互锁组详情
     * groupUuid
     */
  deleteInterlockApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.deleteInterlockApi}${xhr.groupUuid}`;
    return axios.delete(api, xhr);
  },
  /**
   * ************************************************************************************************************************************* */
  /**
    * 获取反潜回列表
    * limit 每页条数
    * page  当前页树
    */
  getAntiBackApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.getAntiBackApi}?limit=${xhr.pageSize}&page=${xhr.currentPage}`;
    return axios.get(api);
  },
  /**
     * 获取反潜回详情
     * groupUuid
     */
  getAntiBackDetailApi(groupUuid) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.getAntiBackDetailApi}${groupUuid}`;
    return axios.get(api);
  },
  /**
    * 增加反潜回列表
    * limit 每页条数
    * page  当前页树
    */
  postAntiBackApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.postAntiBackApi}`;
    return axios.post(api, xhr);
  },
  /**
    * 修改反潜回列表
    * limit 每页条数
    * page  当前页树
    */
  putAntiBackApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.putAntiBackApi}${xhr.groupUuid}`;
    return axios.put(api, xhr);
  },
  /**
    * 删除反潜回
    * limit 每页条数
    * page  当前页树
    */
  deleteAntiBackApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.deleteAntiBackApi}${xhr.groupUuid}`;
    return axios.delete(api);
  },
  /**
    * 关闭/开启反潜回列表
    * limit 每页条数
    * page  当前页树
    */
  operaAntiBackApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.operaAntiBackApi}${xhr.groupUuid}/enabled/${xhr.enabled}`;
    return axios.put(api, xhr);
  },

  /** ************************************************************************************************************************************* */
  /**
    * 获取首卡开门列表
    * limit 每页条数
    * page  当前页树
    */
  getFirstCardApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.getFirstCardApi}?limit=${xhr.pageSize}&page=${xhr.currentPage}`;
    return axios.get(api);
  },
  /**
     * 获取首卡开门详情
     * groupUuid
     */
  getFirstCardDetailApi(groupUuid) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.getFirstCardDetailApi}${groupUuid}`;
    return axios.get(api);
  },
  /**
  * 删除首卡开门配置
  * limit 每页条数
  * page  当前页树
  */
  deleteFirstCardApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.deleteFirstCardApi}${xhr}`;
    return axios.delete(api);
  },
  /**
      * 关闭/开启首卡开门
      * limit 每页条数
      * page  当前页树
      */
  operaFirstCardApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.operaFirstCardApi}${xhr.groupUuid}/enabled/${xhr.enabled}`;
    return axios.put(api);
  },
  /**
      * 增加首卡开门配置
      * limit 每页条数
      * page  当前页树
      */
  postFirstCardApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.postFirstCardApi}`;
    return axios.post(api, xhr);
  },
  /**
      * 修改首卡开门配置
      * limit 每页条数
      * page  当前页树
      */
  putFirstCardApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.putFirstCardApi}${xhr.infoUuid}`;
    return axios.put(api, xhr);
  },

  /** ************************************************************************************************************************************* */

  /**
    * 获取联动列表
    * limit 每页条数
    * page  当前页树
    */
  getLinkageAct(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.getLinkageActApi}?limit=${xhr.limit}&page=${xhr.page}`;
    return axios.get(api);
  },
  /**
     * 获取联动详情
     * groupUuid
     */
  getLinkageActDetailApi(planUuid) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.getLinkageActDetailApi}${planUuid}`;
    return axios.get(api);
  },
  /**
 * 增加联动配置
 * limit 每页条数
 * page  当前页树
 */
  postLinkageAct(holder) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.postLinkageActApi}`;

    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.post(api, data);
  },
  /**
     * 修改联动信息
     * limit 每页条数
     * page  当前页树
     */
  putLinkageActApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.putLinkageActApi}${xhr.planUuid}`;
    return axios.put(api, xhr);
  },
  /**
     * 删除联动动作
     * limit 每页条数
     * page  当前页树
     */
  deleteLinkageActApi(planUuid) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.deleteLinkageActApi}${planUuid}`;
    return axios.delete(api);
  },
  /** ************************************************************************************************************************************* */

  /**
    * 获取多人组合列表
    * limit 每页条数
    * page  当前页树
    */
  getManMakeUpApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.getManMakeUpApi}?limit=${xhr.pageSize}&page=${xhr.currentPage}`;
    return axios.get(api);
  },
  /**
     * 获取多人组合详情
     * groupUuid
     */
  getManMakeUpDetailApi(groupUuid) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.getManMakeUpDetailApi}${groupUuid}`;
    return axios.get(api);
  },

  postManMakeUpApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.postManMakeUpApi}`;
    return axios.post(api, xhr);
  },
  putManMakeUpApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.putManMakeUpApi}${xhr.groupUuid}`;
    return axios.put(api, xhr);
  },
  deleteManMakeUpApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.deleteManMakeUpApi}${xhr.groupUuid}`;
    return axios.delete(api);
  },
  /** ************************************************************************************************************************************* */

  /**
     * 获取发布公告的列表
     */
  getPublicMessageListApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.getPublicMessageListApi}?limit=${xhr.limit}&page=${xhr.page}`;
    return axios.get(api);
  },
  /**
     * 获取发布公告的详情
     * noticeUuid
     */
  getPublicMessageApi(noticeUuid) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.getPublicMessageApi}${noticeUuid}`;
    return axios.get(api);
  },
  postPublicMessageApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.postPublicMessageApi}`;
    return axios.post(api, xhr);
  },
  deletePublicMessageApi(noticeUuid) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.deletePublicMessageApi}${noticeUuid}`;
    return axios.delete(api);
  },

  /**
     * 多验证方式
     * groupUuid
     */
  WayMakeUpApi(xhr) {
    let api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.WayMakeUpApi}${xhr.channelUuid}`;
    return axios.put(api, xhr);
  },

  // 获取组织设备树下设备连接的读头（该读头关联门的开关状态）
  getDeviceReadingHeadApi(deviceUuid) {
    var api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.getDeviceReadingHeadApi}${deviceUuid}`;
    return axios.get(api);
  },

  // 获取基建树下的门的读头 （该读头关联门的进出方向）
  getDoorReadingHeadApi(infrastructureUuid) {
    var api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.getDoorReadingHeadApi}${infrastructureUuid}/readHead`;
    return axios.get(api);
  },
  /**
   * 获取联动预案通道数据
   */
  getDeviceDoorVO(deviceUuid) {
    var api = `${window.config.protocolHeader}${ip}${RestApi.api.doorAccessSet.getDeviceDoorVO(deviceUuid)}`;
    return axios.get(api);
  }

};

function install(Vue) {
  Vue.prototype.$DoorSetAjax = DoorAccessSetAjax;
};

export default install;
