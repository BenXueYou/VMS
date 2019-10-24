// import Cookies from 'js-cookie'
import { Storage } from "@/utils/Storage";

const home = {
  state: {
    // localTag: Cookies.get('localTag') || 'Home',
    tagViewArr: Storage.readSession("tagViewArr") || [],
    localTag: Storage.readSession("localTag") || "Home",
    localEnums: Storage.read("localEnums") || {},
    CapturePhotoArr: Storage.read("CapturePhotoArr") || [],
    RecognizationArr: Storage.read("RecognizationArr") || [],
    Authorization: Storage.readSession("Authorization") || "",
    projectUuid: Storage.readSession("projectUuid") || "",
    account: Storage.read("account") || "",
    userUuid: Storage.read("userUuid") || "",
    projectList: Storage.read("projectList") || []
    // username: localStorage.getItem("username") || ""
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
      Storage.save("localEnums", localEnums);
    },
    SET_CAPTURE_PHOTO_ARR: (state, CapturePhotoArr) => {
      state.CapturePhotoArr = CapturePhotoArr;
      Storage.save("CapturePhotoArr", CapturePhotoArr);
    },
    SET_RECOGNIZATION_ARR: (state, RecognizationArr) => {
      state.RecognizationArr = RecognizationArr;
      Storage.save("RecognizationArr", RecognizationArr);
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
      Storage.save("projectList", projectList);
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account;
      Storage.save("account", account);
    },
    SET_USERUUID: (state, userUuid) => {
      state.userUuid = userUuid;
      Storage.save("userUuid", userUuid);
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
    // setUserName({ commit }, username) {
    //   commit("SET_UserName", username);
    // },
    setProjectUuid({ commit }, projectUuid) {
      commit("SET_PROJECT_UUID", projectUuid);
    },
    setAccount({ commit }, account) {
      commit("SET_ACCOUNT", account);
    },
    SET_USERUUID({ commit }, userUuid) {
      commit("SET_USERUUID", userUuid);
    }
  }
};

export default home;
