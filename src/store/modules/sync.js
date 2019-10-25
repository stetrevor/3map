import Vue from "vue";

import api from "@/api";
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
  /**
   * key: refPath,
   * value: { refPath, filename, updated }
   */
  mapFiles: {}
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
    return Object.values(state.mapFiles).sort((a, b) => a.updated - b.updated);
  }
};

const mutations = {
  [mt.UPDATE_UPLOAD_STATUS](state, status) {
    Vue.set(state.status, status.refPath, status);
  },

  [mt.DELETE_UPLOAD_STATUS](state, { refPath }) {
    Vue.delete(state.status, refPath);
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

  [mt.ADD_TO_MAP_FILE_LIST](state, item) {
    Vue.set(state.mapFiles, item.refPath, item);
  },

  [mt.DELETE_FROM_MAP_FILE_LIST](state, { refPath }) {
    Vue.delete(state.mapFiles, refPath);
  }
};

const actions = {
  uploadFiles() {
    /**
     * Sentinel action for sync status plugin.
     * So no action needs to be taken here.
     * payload structure:
     * { refPath, file }, or
     * { refPath, string, metadata }
     * @param {String} refPath Required. The full path where the upload destination is.
     * @param {File, Blob, Uint8Array} file A file object like the one from <input> file.
     * @param {String} string Raw string content to put in refPath.
     * @param {Object} metadata Key value pairs containing metadata, like file name to be displayed.
     */
  },

  getNextPageMapFiles() {
    /**
     * Sentinel action for sync status plugin.
     * So no action needs to be taken here.
     */
  },

  addToMapFileList({ commit }, payload) {
    commit(mt.ADD_TO_MAP_FILE_LIST, payload);
  },

  async renameMapFile({ commit }, payload) {
    const updated = await api.cloud.updateMetadata(payload);
    commit(mt.ADD_TO_MAP_FILE_LIST, updated);
  },

  async deleteMapFile({ commit }, payload) {
    await api.cloud.deleteFile(payload);
    commit(mt.DELETE_FROM_MAP_FILE_LIST, payload);
  },

  updateUploadStatus({ commit }, payload) {
    commit(mt.UPDATE_UPLOAD_STATUS, payload);
    if (payload.progress === 1) {
      Vue.nextTick(() => commit(mt.DELETE_UPLOAD_STATUS, payload));
      Vue.nextTick(() => {
        if (payload.refPath.endsWith("/index.json")) {
          api.local.deleteStagedMap({
            id: payload.refPath.replace("/index.json", "")
          });
        }
      });
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
