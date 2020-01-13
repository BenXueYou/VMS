import { Storage } from "@/utils/Storage";
const equipment = {
  state: {
    orgUuid: null, // 组织架构树左边的ID 便于右边的table来更新数据
    tagUuid: null, // 设备的标签列表，便于右边的列表显示
    tagData: {}, // 标签所有的数据
    username: "",
    DeviceOnOffArr: Storage.read("DeviceOnOffArr") || [],
  },
  mutations: {
    setOrgUuid(state, id) {
      state.orgUuid = id;
    },
    setTagUuid(state, id) {
      state.tagUuid = id;
    },
    setTag(state, data) {
      state.tagData = data;
    },
    setUserName(state, username) {
      state.username = username;
    },
    SET_DEVICEONOFFARR(state, DeviceOnOffArr) {
      state.DeviceOnOffArr = DeviceOnOffArr;
      Storage.saveSession("DeviceOnOffArr", DeviceOnOffArr);
    }
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    }
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit("increment");
      }, 1000);
    },
    setDeviceOnOffArr({ commit }, DeviceOnOffArr) {
      commit("SET_DEVICEONOFFARR", DeviceOnOffArr);
    },
  }
};

export default equipment;
