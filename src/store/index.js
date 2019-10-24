import Vue from "vue";
import Vuex from "vuex";

import files from "./modules/files";
import editor from "./modules/editor";
import sync from "./modules/sync";
import toast from "./modules/toast";
import createListFilesPlugin from "./plugins/list-files";
import createSyncStatusPlugin from "./plugins/sync-status";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    files,
    editor,
    sync,
    toast
  },

  plugins: [createListFilesPlugin(), createSyncStatusPlugin()],

  strict: process.env.NODE_ENV !== "production"
});

export default store;
