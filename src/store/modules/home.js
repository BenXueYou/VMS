// import Cookies from 'js-cookie'
import { Storage } from "@/utils/Storage";

const home = {
  state: {
    // localTag: Cookies.get('localTag') || 'Home',
    tagViewArr: Storage.readSession("tagViewArr") || [],
    localTag: Storage.readSession("localTag") || "Home",
    localEnums: Storage.readSession("localEnums") || {},
    mapStyle: Storage.readSession("mapStyle") || [],
    areaMapBorder: Storage.readSession("areaMapBorder") || [],
    CapturePhotoArr: Storage.readSession("CapturePhotoArr") || [],
    RecognizationArr: Storage.readSession("RecognizationArr") || [],
    Authorization: Storage.readSession("Authorization") || "",
    projectUuid: Storage.readSession("projectUuid") || "",
    projectList: Storage.readSession("projectList") || [],
    account: Storage.readSession("account") || "",
    accountName: Storage.read("accountName") || "",
    userUuid: Storage.readSession("userUuid") || "",
    accountType: Storage.readSession("accountType") || "",
    projectType: Storage.readSession("projectType") || {},
    platformLevel: Storage.readSession("platformLevel") || true,
    routerData: Storage.readSession("routerData") || [],
    GlobalAlarm: Storage.readSession("GlobalAlarm") || [],
    tagHoldNum: Storage.readSession("tagHoldNum") || 13,
    mapSetData: Storage.readSession("mapSetData") || {
      returnVal: "",
      supplier: "baidu"
    },
    // username: sessionStorage.getItem("username") || ""
  },
  mutations: {
    SET_TAG_VIEW_ARR: (state, tagViewArr) => {
      state.tagViewArr = tagViewArr;
      // Cookies.set('localTag', localTag);
      Storage.saveSession("tagViewArr", tagViewArr);
    },
    CLEAR_TAG_VIEW: (state) => {
      state.tagViewArr = [];
      Storage.saveSession("tagViewArr", null);
    },
    ADD_TAG_VIEW_ITEM: (state, compomentItem) => {
      if (state.tagViewArr.some(v => v.name === compomentItem.name)) return;
      if (state.tagViewArr.length < state.tagHoldNum - 1) {
        state.tagViewArr.push(compomentItem);
      } else {
        state.tagViewArr.unshift(compomentItem);
      }
      Storage.saveSession("tagViewArr", state.tagViewArr);
    },
    DEL_TAG_VIEW_ITEM: (state, compomentItem) => {
      for (const [i, v] of state.tagViewArr.entries()) {
        if (v.path === compomentItem.path || v.name === compomentItem.name) {
          state.tagViewArr.splice(i, 1);
          break;
        }
      }
      Storage.saveSession("tagViewArr", state.tagViewArr);
    },
    SET_LOCAL_TAG: (state, localTag) => {
      state.localTag = localTag;
      Storage.saveSession("localTag", localTag);
    },
    SET_LOCAL_ENUMS: (state, localEnums) => {
      state.localEnums = localEnums;
      console.log(typeof localEnums);
      Storage.saveSession("localEnums", localEnums);
    },
    SET_MAP_STYLE: (state, mapStyle) => {
      state.mapStyle = mapStyle;
      Storage.saveSession("mapStyle", mapStyle);
    },
    SET_AREA_MAP_BORDER: (state, areaMapBorder) => {
      state.areaMapBorder = areaMapBorder;
      Storage.saveSession("areaMapBorder", areaMapBorder);
    },
    SET_CAPTURE_PHOTO_ARR: (state, CapturePhotoArr) => {
      state.CapturePhotoArr = CapturePhotoArr;
      Storage.saveSession("CapturePhotoArr", CapturePhotoArr);
    },
    SET_RECOGNIZATION_ARR: (state, RecognizationArr) => {
      state.RecognizationArr = RecognizationArr;
      Storage.saveSession("RecognizationArr", RecognizationArr);
    },
    SET_GLOBAL_ALARM: (state, GlobalAlarm) => {
      state.GlobalAlarm = GlobalAlarm;
      Storage.saveSession("GlobalAlarm", GlobalAlarm);
    },
    SET_AUTHORIZATION: (state, Authorization) => {
      state.Authorization = Authorization;
      Storage.saveSession("Authorization", Authorization);
    },
    // SET_UserName: (state, username) => {
    //   state.username = username;
    //   Storage.saveSession("username", username);
    // },
    SET_PROJECT_UUID: (state, projectUuid) => {
      state.projectUuid = projectUuid;
      Storage.saveSession("projectUuid", projectUuid);
    },
    SET_PROJECT_LIST: (state, projectList) => {
      state.projectList = projectList;
      Storage.saveSession("projectList", projectList);
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account;
      Storage.saveSession("account", account);
    },
    SET_ACCOUNT_NAME: (state, accountName) => {
      state.accountName = accountName;
      Storage.save("accountName", accountName);
    },
    SET_USERUUID: (state, userUuid) => {
      state.userUuid = userUuid;
      Storage.saveSession("userUuid", userUuid);
    },
    SET_PLAT_FORMLEVEL: (state, platformLevel) => {
      state.platformLevel = platformLevel;
      Storage.saveSession("platformLevel", platformLevel);
    },
    SET_ROUTER_DATA: (state, routerData) => {
      state.routerData = routerData;
      Storage.saveSession("routerData", routerData);
    },
    SET_ACCOUNTTYPE: (state, accountType) => {
      state.accountType = accountType;
      Storage.saveSession("accountType", accountType);
    },
    SET_PROJECTTYPE: (state, projectType) => {
      state.projectType = projectType;
      Storage.saveSession("projectType", projectType);
    },
    SET_TAG_HOLD_NUM: (state, tagHoldNum) => {
      state.tagHoldNum = tagHoldNum;
      Storage.saveSession("tagHoldNum", tagHoldNum);
    },
    SET_MAP_SET_DATA: (state, mapSetData) => {
      state.mapSetData = mapSetData;
      Storage.saveSession("mapSetData", mapSetData);
    },
  },
  actions: {
    setTagViewArr({ commit }, tagViewArr) {
      commit("SET_TAG_VIEW_ARR", tagViewArr);
    },
    clearTagView({ commit }) {
      commit("CLEAR_TAG_VIEW");
    },
    setLocalTag({ commit }, localTag) {
      commit("SET_LOCAL_TAG", localTag);
    },
    addTagViewItem({ commit }, compomentItem) {
      commit("ADD_TAG_VIEW_ITEM", compomentItem);
    },
    delTagViewItem({ commit }, compomentItem) {
      commit("DEL_TAG_VIEW_ITEM", compomentItem);
    },
    setLocalEnums({ commit }, localEnums) {
      commit("SET_LOCAL_ENUMS", localEnums);
    },
    setMapStyle({ commit }, mapStyle) {
      commit("SET_MAP_STYLE", mapStyle);
    },
    setAreaMapBorder({ commit }, areaMapBorder) {
      commit("SET_AREA_MAP_BORDER", areaMapBorder);
    },
    setCapturePhotoArr({ commit }, CapturePhotoArr) {
      commit("SET_CAPTURE_PHOTO_ARR", CapturePhotoArr);
    },
    setRecognizationArr({ commit }, RecognizationArr) {
      commit("SET_RECOGNIZATION_ARR", RecognizationArr);
    },
    setGlobalAlarm({ commit }, GlobalAlarm) {
      commit("SET_GLOBAL_ALARM", GlobalAlarm);
    },
    setAuthorization({ commit }, Authorization) {
      commit("SET_AUTHORIZATION", Authorization);
    },
    setProjectUuid({ commit }, projectUuid) {
      commit("SET_PROJECT_UUID", projectUuid);
    },
    setPlatformLevel({ commit }, platformLevel) {
      commit("SET_PLAT_FORMLEVEL", platformLevel);
    },
    setAccount({ commit }, account) {
      commit("SET_ACCOUNT", account);
    },
    setAccountName({ commit }, accountName) {
      commit("SET_ACCOUNT_NAME", accountName);
    },
    SET_USERUUID({ commit }, userUuid) {
      commit("SET_USERUUID", userUuid);
    },
    setAccountType({ commit }, accountType) {
      commit("SET_ACCOUNTTYPE", accountType);
    },
    setProjectType({ commit }, projectType) {
      commit("SET_PROJECTTYPE", projectType);
    },
    setRouterData({ commit }, routerData) {
      commit("SET_ROUTER_DATA", routerData);
    },
    setTagHoldNum({ commit }, tagHoldNum) {
      commit("SET_TAG_HOLD_NUM", tagHoldNum);
    },
    setMapSetData({ commit }, mapSetData) {
      commit("SET_MAP_SET_DATA", mapSetData);
    },
  }
};

export default home;
