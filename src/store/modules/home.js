// import Cookies from 'js-cookie'
import { Storage } from "@/utils/Storage";

const home = {
  state: {
    // localTag: Cookies.get('localTag') || 'Home',
    tagViewArr: Storage.readSession("tagViewArr") || [],
    localTag: Storage.readSession("localTag") || "Home",
    localEnums: Storage.read("localEnums") || {},
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
      // if (state.tagViewArr.length === 0) {
      //   state.tagViewArr.push(compomentItem);
      // } else {
      //   for (let index in state.tagViewArr) {
      //     if (compomentItem.name === state.tagViewArr[index].name) {
      //       break;
      //     }
      //     if (parseInt(index) === state.tagViewArr.length - 1) {
      //       state.tagViewArr.push(compomentItem);
      //     }
      //   }
      // }
      if (state.tagViewArr.some(v => v.name === compomentItem.name)) return;
      state.tagViewArr.push(compomentItem);

      console.log(state.tagViewArr);
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
      // Cookies.set('localTag', localTag);
      Storage.saveSession("localTag", localTag);
    },
    SET_LOCAL_ENUMS: (state, localEnums) => {
      state.localEnums = localEnums;

      Storage.save("localEnums", localEnums);
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
