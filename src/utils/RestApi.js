// let projectUuid = window.config.projectUuid;
let hostname = window.location.hostname;
// let hostname = '127.0.0.1';
let port = "15009";
let version = "1.0";

import sbUrl from "@/utils/restApi/equipment";
import pmUrl from "@/utils/restApi/permission";
import vistorManageApi from "@/utils/restApi/vistorManageApi";
import store from '@/store/store.js';
export default {
  api: {
    /**
     * 图片下载地址
     */
    imageUrl:window.config.protocolHeader+window.config.ip+`/fileforward-server-v1/project/${store.state.home.projectUuid}/fileforward/fileByUrl?fileUrl=`,
    /**
     * 全部翻译获取接口
     */
    queryBaseTypeByGroup: process.env.LOCAL_ENUMS,
    /**
     * 登录模块
     */
    login: {
      login: `oauth-v1/authentication/iac`,
    },

    /**
     * 门禁控制模块
     * 1、高级设置
     */
    doorAccessSet: {
      // 互锁
      getInterlockingApi: `/iacapp-v1/project/${store.state.home.projectUuid}/interlock`,
      getInterlockDetailApi: `/iacapp-v1/project/${store.state.home.projectUuid}/interlock/`,
      postInterlockApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/interlockingGroup/interlockingGroup`,
      putInterlockApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/interlockingGroup/interlockingGroup/`,
      deleteInterlockApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/interlockingGroup/interlockingGroup/`,
      operatorInterlockApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/interlockingGroup/interlockingGroup/`,
      // 反潜回
      getAntiBackApi: `/iacapp-v1/project/${store.state.home.projectUuid}/antisubmarine`,
      getAntiBackDetailApi: `/iacapp-v1/project/${store.state.home.projectUuid}/antisubmarine/`,
      postAntiBackApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/antisubmarineGroup/antisubmarineGroup`,
      putAntiBackApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/antisubmarineGroup/antisubmarineGroup/`,
      deleteAntiBackApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/antisubmarineGroup/antisubmarineGroup/`,
      operaAntiBackApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/antisubmarineGroup/antisubmarineGroup/`,
      // 首卡
      getFirstCardApi: `/iacapp-v1/project/${store.state.home.projectUuid}/firstcard`,
      getFirstCardDetailApi: `/iacapp-v1/project/${store.state.home.projectUuid}/firstcard/`,
      postFirstCardApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/firstCardDoorOpen/firstCardDoorOpen`,
      putFirstCardApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/firstCardDoorOpen/firstCardDoorOpen/`,
      deleteFirstCardApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/firstCardDoorOpen/firstCardDoorOpen/`,
      operaFirstCardApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/firstCardDoorOpen/firstCardDoorOpen/`,
      // 联动
      getLinkageActApi: `/iacapp-v1/project/${store.state.home.projectUuid}/linkageInfo`,
      getLinkageActDetailApi: `/iacapp-v1/project/${store.state.home.projectUuid}/linkageInfo/`,
      postLinkageActApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/linkageInfo/linkageInfo`,
      putLinkageActApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/linkageInfo/linkageInfo/`,
      deleteLinkageActApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/linkageInfo/linkageInfo/`,
      // 组合
      getManMakeUpApi: `/iacapp-v1/project/${store.state.home.projectUuid}/staffgroup`,
      getManMakeUpDetailApi: `/iacapp-v1/project/${store.state.home.projectUuid}/staffgroup/`,
      postManMakeUpApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/combinationDoorOpen/combinationDoorOpen`,
      putManMakeUpApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/combinationDoorOpen/combinationDoorOpen/`,
      deleteManMakeUpApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/combinationDoorOpen/combinationDoorOpen/`,
      // 多方式验证
      WayMakeUpApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/checkCombinationDoorOpen/channelInfo/`,
      // 发布公告
      getPublicMessageListApi: `/iacapp-v1/project/${store.state.home.projectUuid}/notice`,
      getPublicMessageApi: `/iacapp-v1/project/${store.state.home.projectUuid}/notice/`,
      postPublicMessageApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/notice/notice`,
      deletePublicMessageApi: `/iacconfig-v1/project/${store.state.home.projectUuid}/advancedConf/notice/notice/`,

      // 获取组织设备树下设备连接的读头（该读头关联门的开关状态）
      getDeviceReadingHeadApi: `/basedata-v1/project/${store.state.home.projectUuid}/deviceReadHeadList/`,

      // 获取基建树下的门的读头 （该读头关联门的进出方向）
      getDoorReadingHeadApi: `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/`,
      getDeviceDoorVO(deviceUuid) {
        return `/basedata-v1/project/${store.state.home.projectUuid}/device/${deviceUuid}/linkageChannelList`;
      }
    },

    /**
     * 居民管理
     */
    residentManage: {
      getResidentListApi: `/sppc-iacapp-service-v1/project/${store.state.home.projectUuid}/sysStaff/info/list`,
      postResidentApi: `/sppc-iacapp-service-v1/project/${store.state.home.projectUuid}/sysStaff/info`,
      putResidentApi: `/sppc-iacapp-service-v1/project/${store.state.home.projectUuid}/sysStaff/info`,
      deleteResidentApi: `/sppc-iacapp-service-v1/project/${store.state.home.projectUuid}/sysStaff/info/`,
      getResidentDetailApi: `/sppc-iacapp-service-v1/project/${store.state.home.projectUuid}/sysStaff/info/`,
      getResidentTreeDataApi: `/basedata-v1/project/${store.state.home.projectUuid}/areaStruct`, //初始化居民组织

      getResidentTreeSubDataApi: `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/house`, //点击树节点获取子节点
      getResidentLeftMenuSubDataApi: `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/`, // 居民管理左侧菜单点击获取子节点
      getResidentTreeNodeDataApi: `/basedata-v1/project/${store.state.home.projectUuid}/infrastructureList/`,
      getDoorAccessAuthListApi: `/iacapp-v1/project/${store.state.home.projectUuid}/permission/list`,
      getResidentTreeStaffNodeApi: `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/staff`,
      getResidentTagDetailApi: `/basedata-v1/project/${store.state.home.projectUuid}/tagElement/channelList`,
      addElementToTag: `/basedata-v1/project/${store.state.home.projectUuid}/tagElement/add`,
      putElementToTag: `/basedata-v1/project/${store.state.home.projectUuid}/tag/element`,
      deleteElementFromTag: `/basedata-v1/project/${store.state.home.projectUuid}/tagElement/del`,
      getResidentFromDevice: `/iacserv-v1/project/${store.state.home.projectUuid}/personManage/deviceUploadPerson/deviceUploadPerson`,

      // 获取身份证信息
      getIcdIdCardApi: `${window.config.protocolHeader}${hostname}:${port}/${version}/icd/idcard`,

      // 获取单元(楼栋)基建下的层与房屋展开信息
      getFloorAndHouse: `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/`,

      // 统计居民管理信息 /project/{store.state.home.projectUuid}/staff/statistics/resident
      getResidentStaticData: `/iacapp-v1/project/${store.state.home.projectUuid}/staff/statistics/resident`,

      // 居民标签概要详情 /project/{store.state.home.projectUuid}/Resident/tagElement/tag/{tagUuid}
      getResidentTagBriefDetail: `/basedata-v1/project/${store.state.home.projectUuid}/tag/`
    },

    /**
     * 记录查询/门禁控制模块
     */
    recordSearch: {
      getDoorLog: `/iaclog-v1/project/${store.state.home.projectUuid}/ioclog/info/list`,
      getAlarmLog: `/alarmlog-v1/project/${store.state.home.projectUuid}/alarm`,
      getChannelStatusList: `/iaclog-v1/project/${store.state.home.projectUuid}/channelStatus`,
      getOrgDevTree: `/basedata-v1/project/${store.state.home.projectUuid}/organization/children`,
      handleDoorStatus: (channelUuid, action) =>
        `/iacserv-v1/operation/operation/opendoor/channel/${channelUuid}/action/${action}`,
      getStatistics: `/iacapp-v1/project/${store.state.home.projectUuid}/door/statistics`,
      removeAlarm: channelUuid =>
        `/iacserv-v1/operation/operation/removeAlarm/channel/${channelUuid}`,
      allOperation: `/iacserv-v1/operation/project/${store.state.home.projectUuid}/device/toMgr`
    },

    /**
     * 楼栋房屋模块
     */
    buildingHouse: {
      initArea: `/basedata-v1/project/${store.state.home.projectUuid}/initArea`,
      getAreaStruct: `/basedata-v1/project/${store.state.home.projectUuid}/areaStruct`,
      getInfrastructure: `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure`,
      getInfrastructureToHouse: `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/house`,
      getInfrastructureToUnit: infrastructureUuid =>
        `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/${infrastructureUuid}/unit`,
      getInfrastructureToDevice(infrastructureUuid) {
        return `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/${infrastructureUuid}/device`;
      },
      addInfrastructure: `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure`,
      editInfrastructureName(infrastructureUuid) {
        return `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/${infrastructureUuid}`;
      },
      deleteInfrastructure(infrastructureUuid) {
        return `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/${infrastructureUuid}`;
      },
      moveInfrastructure: `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/move`,
      getHouseList(infrastructureUuid) {
        return `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/${infrastructureUuid}/house`;
      },
      addHouse(infrastructureUuid) {
        return `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/${infrastructureUuid}/house`;
      },
      addUnit: `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/unit`,
      deleteHouse: `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure`,
      copyInfrastructure(infrastructureUuid) {
        return `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/${infrastructureUuid}`;
      }
    },

    /**
     * 单位管理模块
     */
    unitMange: {
      getAllUnits: `/basedata-v1/${store.state.home.projectUuid}/units/allUnits`,
      delUnits: `/basedata-v1/${store.state.home.projectUuid}/units/delUnits`,
      addUnits: `/basedata-v1/${store.state.home.projectUuid}/units/addUnits`,
      updateUnits: `/basedata-v1/${store.state.home.projectUuid}/units/updateUnits`,
      selPeople: `/basedata-v1/${store.state.home.projectUuid}/units/selPeople`
    },
    sbUrl,
    pmUrl,
    vistorManageApi,
    //人脸图片质量检测
    faceQualityDetection: `/sppc-iacapp-service-v1/image/isQualified`
  }
};
