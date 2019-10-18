import api from "@/api/local-storage.js";

const GET_ALL_FILES = "GET_ALL_FILES";

const state = {
  fileList: []
};

const mutations = {
  [GET_ALL_FILES](state, { files }) {
    state.fileList = files;
  }
};

const actions = {
  async getAllFiles({ commit }) {
    const files = await api.getAllFiles();
    files.sort((a, b) => b.lastModified - a.lastModified);
    commit(GET_ALL_FILES, { files });
  },

  async updateFile({ dispatch }, payload) {
    await api.updateFile(payload);
    return dispatch("getAllFiles");
  },

  async deleteFile({ dispatch }, payload) {
    await api.deleteFile(payload);
    return dispatch("getAllFiles");
  },

  async newFile() {
    return api.newFile({ name: "Untitled" });
  }
};

export default {
  state,
  mutations,
  actions
};
