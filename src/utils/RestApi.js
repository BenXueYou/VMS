// let projectUuid = window.config.projectUuid;
let hostname = window.location.hostname;
// let hostname = '127.0.0.1';
let port = "15009";
let version = "1.0";

import sbUrl from "@/utils/restApi/equipment";
import carManage from "@/utils/restApi/carManage";
import pmUrl from "@/utils/restApi/permission";
import videoUrl from "@/utils/restApi/video";
import userUrl from "@/utils/restApi/user";
import logAPi from "@/utils/restApi/logAPi";
import vistorManageApi from "@/utils/restApi/vistorManageApi";
import faceModuleAPi from "@/utils/restApi/faceModuleAPi";
import mapApi from "@/utils/restApi/mapApi";
import sysApi from "@/utils/restApi/sysApi";

import schoolBoardApi from "@/utils/restApi/schoolBoard"; import store from "@/store/store.js";
import bayonetAPi from "@/utils/restApi/bayonet";
import buildingHouseFile from "@/utils/restApi/buildHouseFile";
import communityBoard from "@/utils/restApi/communityBoard";
import dataBoard from "@/utils/restApi/dataBoard";
import equipmentMange from "@/utils/restApi/hardware";
export default {
  api: {
    carManage,
    /**
     * 图片下载地址
     */
    imageUrl:
      window.config.protocolHeader +
      window.config.ip +
      `/fileforward-server-v1/project/${store.state.home.projectUuid}/fileforward/fileByUrl?fileUrl=`,
    /**
     * 全部翻译获取接口
     */
    queryBaseTypeByGroup: process.env.LOCAL_ENUMS,
    /**
     * 地图样式配置获取接口
     */
    getMapStyle: process.env.MAP_STYLE,
    /**
     * 区域行政边界获取接口
     */
    getAreaMapBorder: process.env.AREA_MAP_BORDER,
    /**
     * 登录模块
     */
    login: {
      login: `oauth-v1/authentication/iac`,
      setLogUuid: (uuid = store.state.home.projectUuid) => `sysLog-v1/project/${uuid}/log`,
      setLogUuidByNoPrjectUuid: projectUuid =>
        `sysLog-v1/project/${projectUuid}/log`,
      loginOutApi: `oauth-v1/exit`,
      updatePasswordApi: `upms-v1/account/updatePwd`
    },

    /**
     * 门禁控制模块
     * 1、高级设置
     */
    doorAccessSet: {
      // 互锁
      getInterlockingApi: `/iacapp-v1/project/${
        store.state.home.projectUuid
        }/interlock`,
      getInterlockDetailApi: `/iacapp-v1/project/${
        store.state.home.projectUuid
        }/interlock/`,
      postInterlockApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/interlockingGroup/interlockingGroup`,
      putInterlockApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/interlockingGroup/interlockingGroup/`,
      deleteInterlockApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/interlockingGroup/interlockingGroup/`,
      operatorInterlockApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/interlockingGroup/interlockingGroup/`,
      // 反潜回
      getAntiBackApi: `/iacapp-v1/project/${
        store.state.home.projectUuid
        }/antisubmarine`,
      getAntiBackDetailApi: `/iacapp-v1/project/${
        store.state.home.projectUuid
        }/antisubmarine/`,
      postAntiBackApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/antisubmarineGroup/antisubmarineGroup`,
      putAntiBackApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/antisubmarineGroup/antisubmarineGroup/`,
      deleteAntiBackApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/antisubmarineGroup/antisubmarineGroup/`,
      operaAntiBackApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/antisubmarineGroup/antisubmarineGroup/`,
      // 首卡
      getFirstCardApi: `/iacapp-v1/project/${
        store.state.home.projectUuid
        }/firstcard`,
      getFirstCardDetailApi: `/iacapp-v1/project/${
        store.state.home.projectUuid
        }/firstcard/`,
      postFirstCardApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/firstCardDoorOpen/firstCardDoorOpen`,
      putFirstCardApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/firstCardDoorOpen/firstCardDoorOpen/`,
      deleteFirstCardApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/firstCardDoorOpen/firstCardDoorOpen/`,
      operaFirstCardApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/firstCardDoorOpen/firstCardDoorOpen/`,
      // 联动
      getLinkageActApi: `/iacapp-v1/project/${
        store.state.home.projectUuid
        }/linkageInfo`,
      getLinkageActDetailApi: `/iacapp-v1/project/${
        store.state.home.projectUuid
        }/linkageInfo/`,
      postLinkageActApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/linkageInfo/linkageInfo`,
      putLinkageActApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/linkageInfo/linkageInfo/`,
      deleteLinkageActApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/linkageInfo/linkageInfo/`,
      // 组合
      getManMakeUpApi: `/iacapp-v1/project/${
        store.state.home.projectUuid
        }/staffgroup`,
      getManMakeUpDetailApi: `/iacapp-v1/project/${
        store.state.home.projectUuid
        }/staffgroup/`,
      postManMakeUpApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/combinationDoorOpen/combinationDoorOpen`,
      putManMakeUpApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/combinationDoorOpen/combinationDoorOpen/`,
      deleteManMakeUpApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/combinationDoorOpen/combinationDoorOpen/`,
      // 多方式验证
      WayMakeUpApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/checkCombinationDoorOpen/channelInfo/`,
      // 发布公告
      getPublicMessageListApi: `/iacapp-v1/project/${
        store.state.home.projectUuid
        }/notice`,
      getPublicMessageApi: `/iacapp-v1/project/${
        store.state.home.projectUuid
        }/notice/`,
      postPublicMessageApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/notice/notice`,
      deletePublicMessageApi: `/iacconfig-v1/project/${
        store.state.home.projectUuid
        }/advancedConf/notice/notice/`,

      // 获取组织设备树下设备连接的读头（该读头关联门的开关状态）
      getDeviceReadingHeadApi: `/basedata-v1/project/${
        store.state.home.projectUuid
        }/deviceReadHeadList/`,

      // 获取基建树下的门的读头 （该读头关联门的进出方向）
      getDoorReadingHeadApi: `/basedata-v1/project/${
        store.state.home.projectUuid
        }/infrastructure/`,
      getDeviceDoorVO(deviceUuid) {
        return `/basedata-v1/project/${
          store.state.home.projectUuid
          }/device/${deviceUuid}/linkageChannelList`;
      }
    },

    /**
     * 居民管理
     */
    residentManage: {
      getResidentListApi: projectUuid =>
        `/sppc-iacapp-service-v1/project/${projectUuid}/sysStaff/info/list`,
      postResidentApi: `/sppc-iacapp-service-v1/project/${store.state.home.projectUuid}/sysStaff/info`,
      putResidentApi: `/sppc-iacapp-service-v1/project/${store.state.home.projectUuid}/sysStaff/info`,
      deleteResidentApi: `/sppc-iacapp-service-v1/project/${store.state.home.projectUuid}/sysStaff/info/`,
      getResidentDetailApi: projectUuid =>
        `/sppc-iacapp-service-v1/project/${projectUuid}/sysStaff/info/`,
      getResidentTreeDataApi: projectUuid =>
        `/basedata-v1/project/${projectUuid}/areaStruct`, //初始化居民组织

      getResidentTreeSubDataApi: projectUuid =>
        `/basedata-v1/project/${projectUuid}/infrastructure/house`, //点击树节点获取子节点
      getResidentLeftMenuSubDataApi: projectUuid =>
        `/basedata-v1/project/${projectUuid}/infrastructure/`, // 居民管理左侧菜单点击获取子节点
      getResidentTreeNodeDataApi: projectUuid =>
        `/basedata-v1/project/${projectUuid}/infrastructureList/`,
      getDoorAccessAuthListApi: `/iacapp-v1/project/${store.state.home.projectUuid}/permission/list`,
      getResidentTreeStaffNodeApi: (projectUuid = store.state.home.projectUuid) =>
        `/basedata-v1/project/${projectUuid}/infrastructure/staff`,
      getResidentTagDetailApi: projectUuid =>
        `/basedata-v1/project/${projectUuid}/tagElement/channelList`,
      addElementToTag: `/basedata-v1/project/${store.state.home.projectUuid}/tagElement/add`,
      putElementToTag: `/basedata-v1/project/${store.state.home.projectUuid}/tag/element`,
      deleteElementFromTag: `/basedata-v1/project/${store.state.home.projectUuid}/tagElement/del`,
      getResidentFromDevice: projectUuid =>
        `/iacserv-v1/project/${projectUuid}/personManage/deviceUploadPerson/deviceUploadPerson`,

      // 获取身份证信息
      getIcdIdCardApi: `${
        window.config.protocolHeader
        }${hostname}:${port}/${version}/icd/idcard`,

      // 获取单元(楼栋)基建下的层与房屋展开信息
      getFloorAndHouse: projectUuid =>
        `/basedata-v1/project/${projectUuid}/infrastructure/`,

      // 统计居民管理信息 /project/{store.state.home.projectUuid}/staff/statistics/resident
      getResidentStaticData: projectUuid =>
        `/iacapp-v1/project/${projectUuid}/staff/statistics/resident`,

      // 居民标签概要详情 /project/{store.state.home.projectUuid}/Resident/tagElement/tag/{tagUuid}
      getResidentTagBriefDetail: `/basedata-v1/project/${store.state.home.projectUuid}/tag/`,

      // 居民导出 API
      downLoadResidentApi: `/iacapp-v1/project/${store.state.home.projectUuid}/staff/import/resident`

    },

    /**
     * 记录查询/门禁控制模块
     */
    recordSearch: {
      // 门禁通行记录
      getDoorLog: (projectUuid = store.state.home.projectUuid) => `/iaclog-v1/project/${projectUuid}/ioclog/info/list`,
      // 张旭东 门禁通行记录 开门记录查询接口增加dashboard 2020-04-23
      getDoorLog_zxd: (projectUuid = store.state.home.projectUuid) => `/iaclog-v1/project/${projectUuid}/ioclog/dashboard/info/list`,
      // 门禁报警记录
      getAlarmLog: (projectUuid = store.state.home.projectUuid) => `/alarmlog-v1/project/${projectUuid}/alarm`,
      // 门禁报警详情
      getAlarmLogDetail: Uuid =>
        `/alarmlog-v1/project/${store.state.home.projectUuid}/alarm/${Uuid}`,
      // 查询报警处理
      getAlarmLogDeal: Uuid =>
        `/alarmlog-v1/project/${store.state.home.projectUuid}/alarmDeal/${Uuid}`,
      // 门禁报警新增处理
      postAlarmLogDeteal: `/alarmlog-v1/project/${store.state.home.projectUuid}/alarmDeal`,
      // 门禁报警修改处理
      putAlarmLogDeteal: Uuid =>
        `/alarmlog-v1/project/${store.state.home.projectUuid}/alarmDeal/${Uuid}`,

      // 通道状态
      getChannelStatusList: `/iaclog-v1/project/${store.state.home.projectUuid}/channelStatus`,

      // 设备树
      getOrgDevTree: `/basedata-v1/project/${store.state.home.projectUuid}/organization/children`,

      // 门状态操作
      handleDoorStatus: (channelUuid, action) =>
        `/iacserv-v1/project/${
        store.state.home.projectUuid
        }/operation/opendoor/channel/${channelUuid}/action/${action}`,
      // 门状态统计
      getStatistics: `/iacapp-v1/project/${
        store.state.home.projectUuid
        }/door/statistics`,
      // 门状态销警
      removeAlarm: channelUuid =>
        `/iacserv-v1/project/${store.state.home.projectUuid}/operation/removeAlarm/channel/${channelUuid}`,
      allOperation: `/iacserv-v1/project/${store.state.home.projectUuid}/operation/device/toMgr`,
      getWarningRecord: `/iaclog-v1/project/${store.state.home.projectUuid}/prewarning/record/list`,
      getThemeList: `/iaclog-v1/project/${store.state.home.projectUuid}/prewarning/plan/selectlist`
    },

    /**
     * 楼栋房屋模块
     */
    buildingHouse: {
      initArea: `/basedata-v1/project/${store.state.home.projectUuid}/initArea`,
      getAreaStruct: `/basedata-v1/project/${store.state.home.projectUuid}/areaStruct`,
      getAreaStructByProjectUuid: projectUuid =>
        `/basedata-v1/project/${projectUuid}/areaStruct`,
      getInfrastructure: `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure`,
      getInfrastructureByProjectUuid: projectUuid =>
        `/basedata-v1/project/${projectUuid}/infrastructure`,
      getInfrastructureToHouse: `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/house`,
      getInfrastructureToUnit: infrastructureUuid =>
        `/basedata-v1/project/${
        store.state.home.projectUuid
        }/infrastructure/${infrastructureUuid}/unit`,
      getInfrastructureToDevice(infrastructureUuid) {
        return `/basedata-v1/project/${
          store.state.home.projectUuid
          }/infrastructure/${infrastructureUuid}/device`;
      },
      addInfrastructure: `/basedata-v1/project/${
        store.state.home.projectUuid
        }/infrastructure`,
      editInfrastructureName(infrastructureUuid) {
        return `/basedata-v1/project/${
          store.state.home.projectUuid
          }/infrastructure/${infrastructureUuid}`;
      },
      deleteInfrastructure(infrastructureUuid) {
        return `/basedata-v1/project/${
          store.state.home.projectUuid
          }/infrastructure/${infrastructureUuid}`;
      },
      moveInfrastructure: `/basedata-v1/project/${
        store.state.home.projectUuid
        }/infrastructure/move`,
      getHouseList(infrastructureUuid, projectUuid) {
        return `/basedata-v1/project/${projectUuid}/infrastructure/${infrastructureUuid}/house`;
      },
      // 获取房屋详情
      getBuildingDetail: infrastructureUuid =>
        `/basedata-v1/project/${store.state.home.projectUuid}/infrastructure/${infrastructureUuid}/detail`,
      //添加房屋
      addHouse(infrastructureUuid) {
        return `/basedata-v1/project/${
          store.state.home.projectUuid
          }/infrastructure/${infrastructureUuid}/house`;
      },
      addUnit: `/basedata-v1/project/${
        store.state.home.projectUuid
        }/infrastructure/unit`,
      deleteHouse: `/basedata-v1/project/${
        store.state.home.projectUuid
        }/infrastructure`,
      copyInfrastructure(infrastructureUuid) {
        return `/basedata-v1/project/${
          store.state.home.projectUuid
          }/infrastructure/${infrastructureUuid}`;
      }
    },

    /**
     * 单位管理模块
     */
    unitMange: {
      getAllUnits: (projectUuid) => `/basedata-v1/${projectUuid}/units/allUnits`,
      getDetailUnits: (projectUuid) => `/basedata-v1/${projectUuid}/units/company`,
      delUnits: `/basedata-v1/${store.state.home.projectUuid}/units/delUnits`,
      addUnits: `/basedata-v1/${store.state.home.projectUuid}/units/addUnits`,
      updateUnits: `/basedata-v1/${
        store.state.home.projectUuid
        }/units/updateUnits`,
      selPeople: (projectUuid) => `/basedata-v1/${projectUuid}/units/selPeople`,
      getAllProjects: `/basedata-v1/project/${store.state.home.projectUuid}/areaManage/childProject/list`
    },
    /**
     * 实有装备
     */
    equipmentMange,
    /**
     * 实有人口
     */
    peopleMange: {
      getMapChart: (data) =>`/sppc-dashboard-v1/project/${data.projectUuid ||
          store.state.home.projectUuid}/resident/focus/count`,
      getHotMap: `/sppc-dashboard-v1/project/${store.state.home.projectUuid}/real/population/map`,
      residentPerception: (data) => `/sppc-dashboard-v1/project/${data.projectUuid ||
          store.state.home.projectUuid}/panel/resident/perception/list`,
      populationType: (data) => `/sppc-dashboard-v1/project/${data.projectUuid ||
          store.state.home.projectUuid}/real/population/type`,
      populationTotal: (data) => `/sppc-dashboard-v1/project/${data.projectUuid ||
          store.state.home.projectUuid}/real/population/total`,
      residentList(data) {
        return `/sppc-dashboard-v1/project/${data.projectUuid ||
          store.state.home.projectUuid}/infrastructure/${data.infrastructureUuid}/resident/list`;
      },
      residentStatistics(data) {
        return `/sppc-dashboard-v1/project/${data.projectUuid ||
          store.state.home.projectUuid}/infrastructure/${data.infrastructureUuid}/resident/statistics`;
      },
      getPowerMapChart(projectUuid) {
        return `/statistics-basedata-server/project/${projectUuid ||
          store.state.home.projectUuid}/staff/strength/count`;
      },
      getPowerList(data) {
        return `/sppc-dashboard-v1/project/${data.projectUuid ||
          store.state.home.projectUuid}/power/list`;

      },
      getEquipmentChart(projectUuid) {
        return `/statistics-basedata-server/project/${projectUuid ||
          store.state.home.projectUuid}/equipment/statistics`;
      },
      getEquipmentList(projectUuid) {
        return `/statistics-basedata-server/project/${projectUuid ||
          store.state.home.projectUuid}/equipment/list`;
      }
    },
  },
  // 设备
  sbUrl,
  // 用户管理
  userUrl,
  // 权限
  pmUrl,
  // 日志
  logAPi,
  // 视频
  videoUrl,
  // 访客管理
  vistorManageApi,
  //人脸图片质量检测
  faceQualityDetection: `/sppc-iacapp-service-v1/image/isQualified`,
  /**
   * 人脸模块（fengyw）
   */
  faceModuleAPi,
  mapApi,
  sysApi,
  // 卡口
  bayonetAPi,
  // 社区看板
  communityBoard,
  // 一房一档
  buildingHouseFile,
  // 数据看板
  dataBoard,
  schoolBoardApi
};
