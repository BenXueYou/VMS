import store from "@/store/store.js";

let ip = window.config.ip,
    protocolHeader = window.config.protocolHeader,
    projectUuid = store.state.home.projectUuid;
let URLHeader = `${protocolHeader}${ip}/faceconfig-v1/project`;
export default {
    searchFace: `/facelog-v1/project/${store.state.home.projectUuid}/searchFace/list`,
    faceComparison1v1:projectUuid=> `${URLHeader}/${projectUuid}/faceComparison/1v1`,
    getSnapshotList:projectUuid=> `${URLHeader}/${projectUuid}/snapshot/list`,
    getRecognizeList:projectUuid=> `${URLHeader}/${projectUuid}/recognize/list`,
    getRecognizeInfo:projectUuid=> `${URLHeader}/${projectUuid}/recognize/info`,
    getAlarmList:projectUuid=> `${URLHeader}/${projectUuid}/alarm/list`,
};