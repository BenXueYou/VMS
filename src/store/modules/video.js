import { Storage } from "@/utils/Storage";
const video = {
  state: {
    jDescription: Storage.readSession("jDescription") || {}
  },
  getters: {
    jDescription(state) {
      return state.jDescription;
    },
  },
  mutations: {
    setJDescription(state, res) {
      state.jDescription = res;
      Storage.saveSession("jDescription", res);
    },
  }
};
export default video;
