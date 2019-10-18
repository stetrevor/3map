import Vue from "vue";
import Vuex from "vuex";
import files from "./modules/files";
import editor from "./modules/editor";

import { Subject } from "rxjs";

import { getSaveIndicator } from "./utils";
import api from "@/api/local-storage";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    files,
    editor
  },
  strict: process.env.NODE_ENV !== "production"
});

const input$ = new Subject();

store.subscribeAction((action, state) => {
  /**
   * Using store.subscribeAction ensures that the calculated layout
   * gets saved to database. It's not necessary, but it's nice to have.
   */
  const saveOperations = [
    "addChild",
    "removeChild",
    "reorderNodes",
    "moveNode",
    "doneResize",
    "updateText"
  ];
  if (saveOperations.includes(action.type)) {
    input$.next({ mt: action.type, state });
  }
});

const saveChanges = ({ state }) => {
  console.log("request got", state);
  return api.updateContent({
    id: state.editor.contentId,
    tree: state.editor.treeData
  });
};

const indicator$ = getSaveIndicator(input$, saveChanges, "saving", "saved");
indicator$.subscribe(status => {
  console.log("changing saving status", status);
  store.commit("CHANGE_SAVING_STATUS", { status });
});

export default store;
