import Vue from "vue";
import Vuex from "vuex";

import editor from "./modules/editor";
import sync from "./modules/sync";
import toast from "./modules/toast";
import createListFilesPlugin from "./plugins/list-files";
import createSyncStatusPlugin from "./plugins/sync-status";
import createSaveStatusPlugin from "./plugins/save-status";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    editor,
    sync,
    toast
  },

  plugins: [
    createListFilesPlugin(),
    createSyncStatusPlugin(),
    createSaveStatusPlugin()
  ],

  strict: process.env.NODE_ENV !== "production"
});

export default store;
