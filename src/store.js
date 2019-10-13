import Vue from "vue";
import Vuex from "vuex";

import { Layout, BoundingBox } from "non-layered-tidy-tree-layout";

Vue.use(Vuex);

const generateId = (() => {
  let count = 0;

  function id() {
    count += 1;
    return count;
  }

  return id;
})();

const NODE_BOUNDING_BOX = { gap: 20, bottomPadding: 40 };
const NODE_SIZE_DEFAULT = { width: 100, height: 50 };
const layout = new Layout(
  new BoundingBox(NODE_BOUNDING_BOX.gap, NODE_BOUNDING_BOX.bottomPadding)
);

const ADD_CHILD = "ADD_CHILD";
const UPDATE_LAYOUT = "UPDATE_LAYOUT";

const store = new Vuex.Store({
  state: {
    treeData: {
      id: generateId(),
      text: "Root",
      ...NODE_SIZE_DEFAULT,
      x: 0,
      y: 0,
      children: []
    }
  },
  mutations: {
    ADD_CHILD(state, parent) {
      parent.children.push({
        id: generateId(),
        text: `New node`,
        ...NODE_SIZE_DEFAULT,
        x: 0,
        y: 0,
        children: []
      });
    },
    UPDATE_LAYOUT(state) {
      layout.layout(state.treeData);
    }
  },
  actions: {
    addChild({ commit }, parent) {
      commit(ADD_CHILD, parent);
      commit(UPDATE_LAYOUT);
    }
  },
  strict: process.env.NODE_ENV !== "production"
});

export default store;
