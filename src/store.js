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
const REMOVE_NODE = "REMOVE_NODE";
const REORDER_NODES = "REORDER_NODES";
const MOVE_NODE = "MOVE_NODE";
const UPDATE_TEXT = "UPDATE_TEXT";
const UPDATE_LAYOUT = "UPDATE_LAYOUT";

const store = new Vuex.Store({
  state: {
    treeData: {},
    treeBoundingBox: { left: 0, right: 0, top: 0, bottom: 0 }
  },
  mutations: {
    [ADD_CHILD](state, { parent }) {
      const id = generateId();
      const node = {
        id,
        text: `New node ${id}`,
        ...NODE_SIZE_DEFAULT,
        x: 0,
        y: 0,
        children: []
      };

      if (parent) {
        parent.children.push(node);
      } else {
        state.treeData = node;
      }
    },

    [REMOVE_NODE](state, { parent, index, child, reparent }) {
      if (reparent) {
        parent.children.splice(index, 1, ...child.children);
      } else {
        parent.children.splice(index, 1);
      }
    },

    [MOVE_NODE](state, { from, to, node }) {
      const index = from.children.indexOf(node);
      from.children.splice(index, 1);
      to.children.push(node);
    },

    [REORDER_NODES](state, { parent, orders }) {
      const nodes = parent.children;
      const sorted = orders
        .map((order, i) => [order, nodes[i]])
        .sort((a, b) => a[0] - b[0]);
      parent.children = sorted.map(sc => sc[1]);
    },

    [UPDATE_TEXT](state, { item, text }) {
      item.text = text;
    },

    [UPDATE_LAYOUT](state) {
      layout.layout(state.treeData);
    }
  },
  actions: {
    addChild({ commit }, payload) {
      commit(ADD_CHILD, payload);
      commit(UPDATE_LAYOUT);
    },

    removeChild({ commit }, payload) {
      commit(REMOVE_NODE, payload);
      commit(UPDATE_LAYOUT);
    },

    reorderNodes({ commit }, payload) {
      commit(REORDER_NODES, payload);
      commit(UPDATE_LAYOUT);
    },

    moveNode({ commit }, payload) {
      commit(MOVE_NODE, payload);
      commit(UPDATE_LAYOUT);
    },

    updateText({ commit }, payload) {
      commit(UPDATE_TEXT, payload);
    }
  },
  strict: process.env.NODE_ENV !== "production"
});

export default store;
