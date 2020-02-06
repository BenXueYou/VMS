const video = {
  state: {
    iccSignalRule: {},
    iccMediaRule: {}
  },
  getters: {
    jSignal(state) {
      return state.iccSignalRule;
    },
    jMedia(state) {
      return state.iccMediaRule;
    }
  },
  mutations: {
    setIccSignalRule(state, res) {
      window.sessionStorage.setItem("iccSignalRule", JSON.stringify(res));
      state.iccSignalRule = res;
    },
    setIccMediaRule(state, res) {
      window.sessionStorage.setItem("iccMediaRule", JSON.stringify(res));
      state.iccMediaRule = res;
    }
  }
};
export default video;
