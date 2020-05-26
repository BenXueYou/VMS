import store from "@/store/store.js";

let ip = window.config.ip,
  protocolHeader = window.config.protocolHeader,
  projectUuid = store.state.home.projectUuid;
let mapBaseDataHeader = `${protocolHeader}${ip}/map-basedata-server`;
let mapEngineHeader = `${protocolHeader}${ip}/map-engine/project/${projectUuid}`;
export default {
  mapSetApi: {
    getMapSet: (uuid = projectUuid) => `${mapBaseDataHeader}/project/${uuid}/mapBase/mapsystemconfig`,
    updateMapSet: `${mapBaseDataHeader}/project/${projectUuid}/mapBase/mapsystemconfig`,
    uploadMap: `${mapEngineHeader}/mapEngine/upload/mapPicture`,
    searchMap: `${mapEngineHeader}/mapEngine/mapPicture`,
    mapStyleApi: `${mapEngineHeader}/mapEngine/baiDuMapStyle`,
    getMapInitStyleApi: `${mapEngineHeader}/custom/v2/mapstyle`,
    // getMapInitStyleApi: `http://api.map.baidu.com/custom/v2/mapstyle`,
  }
};