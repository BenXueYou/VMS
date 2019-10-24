import store from "@/store/store.js";

let ip = window.config.ip,
    protocolHeader = window.config.protocolHeader,
    projectUuid = store.state.home.projectUuid;
let URLHeader = `${protocolHeader}${ip}/zuul/visitant-v1/project`;
let BlacklistURLHeader = `${protocolHeader}${ip}/blacklist-v1/project/`;
let BlacklistArlarmURLHeader = `${protocolHeader}${ip}/alarmlog-v1/project/`
export default {
    // 访客日志记录
    getVistorRecordUrl: projectUuid => `${URLHeader}/${projectUuid}/visitorRecord/list`,
    getVistorRecordDetailUrl: projectUuid => `${URLHeader}/${projectUuid}/visitorRecord/detail`,

    // 访客签离
    putPlatformVistorSignOffUrl:projectUuid=>`${URLHeader}/${projectUuid}/visitors/records/signoff/platform`,
    // 访客回收权限
    putPlatVistorForBiddenUrl:projectUuid=>`${URLHeader}/${projectUuid}/visitors/platform/prohibit`,

    // 访客预约邀请记录
    getVistorAIRecordDetailUrl: projectUuid => `${URLHeader}/${projectUuid}/visitor/reservationRecord/detail`,
    getVistorAIRecordListUrl: projectUuid => `${URLHeader}/${projectUuid}/visitor/reservationRecord/list`,
    
    // 预约邀请记录的签离和回收通信权限
    putVistorAISignoffUrl:projectUuid=>`${URLHeader}/${projectUuid}/visitors/reservation/signoff/platform`,
    putVistorAIForbiddenUrl:projectUuid=>`${URLHeader}/${projectUuid}/visitors/reservation/platform/prohibit`,
    
    // 访客人员信息记录
    getVistorListUrl: projectUuid => `${URLHeader}/${projectUuid}/visitor/list`,
    getVistorDetailUrl: projectUuid => `${URLHeader}/${projectUuid}/visitor/detail`,

    // 访客开门记录
    getVistorOpenRecordUrl: projectUuid => `${URLHeader}/${projectUuid}/openDoorRecord`,
    getVistorOpenRecordDetailUrl: projectUuid => `${URLHeader}/${projectUuid}/openDoorRecord/detail`,

    // 访客预约设置
    getVistorAIConfigUrl: projectUuid => `${URLHeader}/${projectUuid}/reservationConfig`,
    putVistorAIConfigUrl: projectUuid => `${URLHeader}/${projectUuid}/reservationConfig`,
    getShortMsgOptionsUrl:projectUuid => `${URLHeader}/${projectUuid}/mssageTemplate`,

    // 访客签离设置
    getVistorSignOffUrl: projectUuid => `${URLHeader}/${projectUuid}/signoffConfig`,
    putVistorSignOffUrl: projectUuid => `${URLHeader}/${projectUuid}/signoffConfig`,

    // 黑名单管理
    postBlacklistUrl: projectUuid => `${BlacklistURLHeader}${projectUuid}/blacklist`,
    getBlacklistUrl: projectUuid => `${BlacklistURLHeader}${projectUuid}/blacklist`,
    getBlacklistDetailUrl: projectUuid => `${BlacklistURLHeader}${projectUuid}/blacklist/`,
    deleteBlacklistUrl: projectUuid => `${BlacklistURLHeader}${projectUuid}/blacklist`,
    putBlacklistUrl: projectUuid => `${BlacklistURLHeader}${projectUuid}/blacklist/`,
    // 删除设备内黑名单
    deleteBlackListUrl: `${BlacklistURLHeader}/device/blacklist`,

    // 黑名单报警
    getBlacklistAlarmListUrl: projectUuid => `${BlacklistArlarmURLHeader}${projectUuid}/alarm`,
    getBlacklistAlarmDetailUrl: projectUuid => `${BlacklistArlarmURLHeader}${projectUuid}/alarm/`,
    putBlacklistAlarmDetailUrl: projectUuid => `${BlacklistArlarmURLHeader}${projectUuid}/alarm`,
    postBlacklistAlarmDealUrl: projectUuid => `${BlacklistArlarmURLHeader}${projectUuid}/alarmDeal`,
};