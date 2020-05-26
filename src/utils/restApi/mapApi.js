import store from "@/store/store.js";

let ip = window.config.ip,
  protocolHeader = window.config.protocolHeader,
  projectUuid = store.state.home.projectUuid;
let baseDataHeader = `${protocolHeader}${ip}/basedata-v1/project/${projectUuid}`;
let mapBaseDataHeader = `${protocolHeader}${ip}/map-basedata-server/project/${projectUuid}`;
let mapBusinessHeader = `${protocolHeader}${ip}/map-business/project/${projectUuid}`;
export default {
  mapConfigApi: {
    getTree: `${baseDataHeader}/auth/organization/tree`,
    getResTree: `${mapBusinessHeader}/map/config/resourceTree`,
    getMapInfo: `${mapBaseDataHeader}/mapBase/mapInfo`,
    saveMapInfo: `${mapBaseDataHeader}/mapBase/mapInfo`,
    updateMapInfo: `${mapBaseDataHeader}/mapBase/mapInfo`,
    deleteMapInfo: `${mapBaseDataHeader}/mapBase/mapInfo`,
    getMapElements: `${mapBusinessHeader}/map/config/element/list`,
    addMapElement: `${mapBaseDataHeader}/mapBase/element`,
    editMapElement: `${mapBaseDataHeader}/mapBase/element`,
    deleteMapElement: `${mapBaseDataHeader}/mapBase/element`,
  },
  mapOperateApi: {
    getOperaMapElements: `${mapBusinessHeader}/map/operation/element/list`,
    addHistory: `${mapBaseDataHeader}/mapBase/search/history`,
    getHistory: `${mapBaseDataHeader}/mapBase/search/history`,
    deleteHistory: `${mapBaseDataHeader}/mapBase/search/history`,
    addCollection: `${mapBaseDataHeader}/mapBase/elementCollection`,
    cancelCollection: `${mapBaseDataHeader}/mapBase/elementCollection`,
    getCollection: `${mapBusinessHeader}/map/elementCollection/list`,
    getAreaPoints: `${baseDataHeader}/areaBoundPoints`,
    getUpLevelMapElements: `${mapBusinessHeader}/map/platLevelTwo/element/list`,
  },
  setMapSysLog: `${mapBusinessHeader}/map/configAndOperaLog`
};