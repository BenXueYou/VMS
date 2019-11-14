const video = {
  state: {
    iccSignalRule: JSON.parse(
      window.localStorage.getItem("iccSignalRule") || "{}"
    ),
    iccMediaRule: JSON.parse(
      window.localStorage.getItem("iccMediaRule") || "{}"
    )
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
      window.localStorage.setItem("iccSignalRule", JSON.stringify(res));
      state.iccSignalRule = res;
    },
    setIccMediaRule(state, res) {
      window.localStorage.setItem("iccMediaRule", JSON.stringify(res));
      state.iccMediaRule = res;
    }
  }
};
export default video;
