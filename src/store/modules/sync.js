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
  ongoingUploads: 0,
  pagination: { done: false, nextPageToken: "" },
  mapFileList: []
};

const getters = {
  progressAll(state) {
    return Object.values(state.status);
  },

  progress: state => refPath => state.status[refPath],

  pagination(state) {
    return state.pagination;
  },

  mapFileList(state) {
    // sort it here
    return state.mapFileList;
  }
};

const mutations = {
  [mt.UPDATE_UPLOAD_STATUS](state, status) {
    Vue.set(state.status, status.refPath, status);
  },

  [mt.UPDATE_UPLOADS_IN_PROGRESS_COUNT](state, { count }) {
    state.ongoingUploads = count;
  },

  [mt.UPDATE_NEXT_PAGE_TOKEN](state, { nextPageToken }) {
    if (!nextPageToken) {
      state.pagination.done = true;
    }
    state.pagination.nextPageToken = nextPageToken;
  },

  [mt.ADD_TO_MAP_FILE_LIST](state, metadata) {
    state.mapFileList.push(metadata);
  }
};

const actions = {
  uploadFiles() {
    /**
     * Sentinel action for sync status plugin.
     * So no action needs to be taken here.
     */
  },

  getNextPageMapFiles() {
    /**
     * Sentinel action for sync status plugin.
     * So no action needs to be taken here.
     */
  },

  addToMapFileList({ commit, dispatch }, payload) {
    commit(mt.ADD_TO_MAP_FILE_LIST, payload);
    dispatch("addToLocalMapFileList", payload);
  },

  addToLocalMapFileList() {
    //TODO: add to local db
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
