import Vue from "vue";
import Vuex from "vuex";
import files from "./modules/files";
import editor from "./modules/editor";
import * as mt from "./mutation-types";

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

store.subscribe((mutation, state) => {
  /**
   * The reason we don't need to wait for UPDATE_LAYOUT mutation is,
   * the document only cares about node width and height, not x, y.
   * As those will be calculated by the layout algorithm upon drawing.
   * The x, y saved shouldn't be used directly to draw the tree.
   */
  const {
    ADD_CHILD,
    REMOVE_NODE,
    REORDER_NODES,
    MOVE_NODE,
    RESIZE_NODE,
    UPDATE_TEXT
  } = mt;
  const saveOperations = [
    ADD_CHILD,
    REMOVE_NODE,
    REORDER_NODES,
    MOVE_NODE,
    RESIZE_NODE,
    UPDATE_TEXT
  ];
  if (saveOperations.includes(mutation.type)) {
    input$.next({ mt: mutation.type, state });
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

// (state.editor.savingStatus = message)
indicator$.subscribe(status => {
  console.log("changing saving status", status);
  store.commit("CHANGE_SAVING_STATUS", { status });
});

export default store;
