import Vue from "vue";
import Vuex from "vuex";
import files from "./modules/files";
import editor from "./modules/editor";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    files,
    editor
  },
  strict: process.env.NODE_ENV !== "production"
});
