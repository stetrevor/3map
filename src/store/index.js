import Vue from "vue";
import Vuex from "vuex";
import files from "./modules/files";
import editor from "./modules/editor";
import sync from "./modules/sync";
import createSyncStatusPlugin from "./plugins/sync-status";
import createSaveStatusPlugin from "./plugins/save-status";
import createListFilesPlugin from "./plugins/list-files";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    files,
    editor,
    sync
  },
  plugins: [
    createSyncStatusPlugin(),
    createSaveStatusPlugin(),
    createListFilesPlugin()
  ],
  strict: process.env.NODE_ENV !== "production"
});

export default store;
