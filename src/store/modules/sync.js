import Vue from "vue";

import * as mt from "../mutation-types";

const state = {
  /**
   * key: refFullPath,
   * value: {
   *   success: true, // sentinel value to calculate ongoing upload count
   *   progress: 0 - 1.0
   *   downloadURL: 'http://download.com/ref.name'
   * }
   */
  status: {},
  ongoingUploads: 0
};

const getters = {
  progress(state) {
    return Object.values(state.status);
  }
};

const mutations = {
  [mt.UPDATE_UPLOAD_STATUS](state, status) {
    Vue.set(state.status, status.refPath, status);
  },

  [mt.UPDATE_UPLOADS_IN_PROGRESS_COUNT](state, { count }) {
    state.ongoingUploads = count;
  }
};

const actions = {
  uploadFiles() {
    /**
     * Sentinel action for sync status plugin.
     * So no action needs to be taken here.
     */
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
