import { Layout, BoundingBox } from "non-layered-tidy-tree-layout";

import api from "@/api/local-storage";
import * as mt from "../mutation-types";

const generateId = (() => {
  let count = 0;

  function id() {
    count += 1;
    return count;
  }

  return id;
})();

const createNewNode = () => {
  const id = generateId();
  return {
    id,
    text: `New node ${id}`,
    ...NODE_SIZE_DEFAULT,
    x: 0,
    y: 0,
    children: []
  };
};

const NODE_BOUNDING_BOX = { gap: 20, bottomPadding: 40 };
const NODE_SIZE_DEFAULT = { width: 100, height: 50 };
const layout = new Layout(
  new BoundingBox(NODE_BOUNDING_BOX.gap, NODE_BOUNDING_BOX.bottomPadding)
);

const state = {
  contentId: null,
  treeData: null,
  treeBoundingBox: { left: 0, right: 0, top: 0, bottom: 0 },
  savingStatus: ""
};

const mutations = {
  [mt.ADD_CHILD](state, { parent }) {
    const node = createNewNode();

    if (parent) {
      parent.children.push(node);
    } else {
      state.treeData = node;
    }
  },

  [mt.REMOVE_NODE](state, { parent, index, child, reparent }) {
    if (reparent) {
      parent.children.splice(index, 1, ...child.children);
    } else {
      parent.children.splice(index, 1);
    }
  },

  [mt.MOVE_NODE](state, { from, to, node }) {
    const index = from.children.indexOf(node);
    from.children.splice(index, 1);
    to.children.push(node);
  },

  [mt.REORDER_NODES](state, { parent, orders }) {
    const nodes = parent.children;
    const sorted = orders
      .map((order, i) => [order, nodes[i]])
      .sort((a, b) => a[0] - b[0]);
    parent.children = sorted.map(sc => sc[1]);
  },

  [mt.RESIZE_NODE](state, { node, delta }) {
    const { deltaX, deltaY } = delta;
    const { width, height } = node;
    const minWidth = NODE_SIZE_DEFAULT.width;
    const minHeight = NODE_SIZE_DEFAULT.height;
    node.width = Math.max(width + deltaX, minWidth);
    node.height = Math.max(height + deltaY, minHeight);
  },

  [mt.UPDATE_TEXT](state, { item, text }) {
    item.text = text;
  },

  [mt.UPDATE_LAYOUT](state) {
    const { boundingBox } = layout.layout(state.treeData);
    state.treeBoundingBox = boundingBox;
  },

  [mt.SET_CONTENT](state, { id, tree }) {
    state.contentId = id;
    state.treeData = tree;
  },

  [mt.CHANGE_SAVING_STATUS](state, { status }) {
    state.savingStatus = status;
  }
};

const actions = {
  addChild({ commit }, payload) {
    commit(mt.ADD_CHILD, payload);
    commit(mt.UPDATE_LAYOUT);
  },

  removeChild({ commit }, payload) {
    commit(mt.REMOVE_NODE, payload);
    commit(mt.UPDATE_LAYOUT);
  },

  reorderNodes({ commit }, payload) {
    commit(mt.REORDER_NODES, payload);
    commit(mt.UPDATE_LAYOUT);
  },

  moveNode({ commit }, payload) {
    commit(mt.MOVE_NODE, payload);
    commit(mt.UPDATE_LAYOUT);
  },

  resizeNode({ commit }, payload) {
    commit(mt.RESIZE_NODE, payload);
    commit(mt.UPDATE_LAYOUT);
  },

  updateText({ commit }, payload) {
    commit(mt.UPDATE_TEXT, payload);
  },

  setContent({ commit }, payload) {
    commit(mt.SET_CONTENT, payload);
    commit(mt.UPDATE_LAYOUT);
  },

  async getMap({ dispatch }, payload) {
    const f = await api.getFile(payload);
    let content;
    if (f.contentId) {
      content = await api.getContent({ id: f.contentId });
    } else {
      content = { tree: createNewNode() };
      const c = await api.newContent(content);
      await api.updateFile(Object.assign(f, { contentId: c }));
    }
    dispatch("setContent", content);
  }
};

export default {
  state,
  mutations,
  actions
};
