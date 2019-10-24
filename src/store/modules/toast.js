const SET_TOAST_MESSAGE = "SET_TOAST_MESSAGE";
const SET_TOAST_DISPLAY = "SET_TOAST_DISPLAY";

const state = {
  toast: { message: "", show: false }
};

const getters = {
  toast(state) {
    return state.toast;
  }
};

const mutations = {
  [SET_TOAST_MESSAGE](state, message) {
    state.toast.message = message;
  },
  [SET_TOAST_DISPLAY](state, show) {
    state.toast.show = show;
  }
};

const actions = {
  showToast({ commit }, message) {
    commit(SET_TOAST_MESSAGE, message);
    commit(SET_TOAST_DISPLAY, true);

    setTimeout(() => {
      commit(SET_TOAST_DISPLAY, false);
      commit(SET_TOAST_MESSAGE, "");
    }, 2000);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
