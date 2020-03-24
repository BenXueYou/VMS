// import Cookies from 'js-cookie'
import { Storage } from "@/utils/Storage";

const home = {
  state: {
    // localTag: Cookies.get('localTag') || 'Home',
    tagViewArr: Storage.readSession("tagViewArr") || [],
    localTag: Storage.readSession("localTag") || "Home",
    localEnums: Storage.readSession("localEnums") || {},
    CapturePhotoArr: Storage.readSession("CapturePhotoArr") || [],
    RecognizationArr: Storage.readSession("RecognizationArr") || [],
    Authorization: Storage.readSession("Authorization") || "",
    projectUuid: Storage.readSession("projectUuid") || "",
    account: Storage.readSession("account") || "",
    userUuid: Storage.readSession("userUuid") || "",
    accountType: Storage.readSession("accountType") || "",
    projectList: Storage.readSession("projectList") || []
    // username: sessionStorage.getItem("username") || ""
  },
  mutations: {
    SET_TAG_VIEW_ARR: (state, tagViewArr) => {
      state.tagViewArr = tagViewArr;
      // Cookies.set('localTag', localTag);
      Storage.saveSession("tagViewArr", tagViewArr);
    },
    ADD_TAG_VIEW_ITEM: (state, compomentItem) => {
      if (state.tagViewArr.some(v => v.name === compomentItem.name)) return;
      state.tagViewArr.push(compomentItem);
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
    SET_CAPTURE_PHOTO_ARR: (state, CapturePhotoArr) => {
      state.CapturePhotoArr = CapturePhotoArr;
      Storage.saveSession("CapturePhotoArr", CapturePhotoArr);
    },
    SET_RECOGNIZATION_ARR: (state, RecognizationArr) => {
      state.RecognizationArr = RecognizationArr;
      Storage.saveSession("RecognizationArr", RecognizationArr);
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
    SET_USERUUID: (state, userUuid) => {
      state.userUuid = userUuid;
      Storage.saveSession("userUuid", userUuid);
    },
    SET_ACCOUNTTYPE: (state, accountType) => {
      state.accountType = accountType;
      Storage.save("accountType", accountType);
    }
  },
  actions: {
    setTagViewArr({ commit }, tagViewArr) {
      commit("SET_TAG_VIEW_ARR", tagViewArr);
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
    setCapturePhotoArr({ commit }, CapturePhotoArr) {
      commit("SET_CAPTURE_PHOTO_ARR", CapturePhotoArr);
    },
    setRecognizationArr({ commit }, RecognizationArr) {
      commit("SET_RECOGNIZATION_ARR", RecognizationArr);
    },
    setAuthorization({ commit }, Authorization) {
      commit("SET_AUTHORIZATION", Authorization);
    },
    setProjectUuid({ commit }, projectUuid) {
      commit("SET_PROJECT_UUID", projectUuid);
    },
    setAccount({ commit }, account) {
      commit("SET_ACCOUNT", account);
    },
    SET_USERUUID({ commit }, userUuid) {
      commit("SET_USERUUID", userUuid);
    },
    setAccountType({ commit }, accountType) {
      commit("SET_ACCOUNTTYPE", accountType);
    },
  }
};

export default home;
