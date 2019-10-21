import api from "@/api";

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

  async new3MapFile() {
    const f = {
      name: "Untitled",
      refPath: api.generateFileId() + "/index.json"
    };
    await api.local.new3MapFile(f);
    return f;
  }
};

export default {
  state,
  mutations,
  actions
};
