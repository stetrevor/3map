import { Layout, BoundingBox } from "non-layered-tidy-tree-layout";

import api from "@/api/local-storage";

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

const ADD_CHILD = "ADD_CHILD";
const REMOVE_NODE = "REMOVE_NODE";
const REORDER_NODES = "REORDER_NODES";
const MOVE_NODE = "MOVE_NODE";
const RESIZE_NODE = "RESIZE_NODE";
const UPDATE_TEXT = "UPDATE_TEXT";
const UPDATE_LAYOUT = "UPDATE_LAYOUT";
const SET_TREE = "SET_TREE";

const state = {
  treeData: null,
  treeBoundingBox: { left: 0, right: 0, top: 0, bottom: 0 }
};

const mutations = {
  [ADD_CHILD](state, { parent }) {
    const node = createNewNode();

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

  [RESIZE_NODE](state, { node, delta }) {
    const { deltaX, deltaY } = delta;
    const { width, height } = node;
    const minWidth = NODE_SIZE_DEFAULT.width;
    const minHeight = NODE_SIZE_DEFAULT.height;
    node.width = Math.max(width + deltaX, minWidth);
    node.height = Math.max(height + deltaY, minHeight);
  },

  [UPDATE_TEXT](state, { item, text }) {
    item.text = text;
  },

  [UPDATE_LAYOUT](state) {
    const { boundingBox } = layout.layout(state.treeData);
    state.treeBoundingBox = boundingBox;
  },

  [SET_TREE](state, { tree }) {
    state.treeData = tree;
  }
};

const actions = {
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

  resizeNode({ commit }, payload) {
    commit(RESIZE_NODE, payload);
    commit(UPDATE_LAYOUT);
  },

  updateText({ commit }, payload) {
    commit(UPDATE_TEXT, payload);
  },

  setTree({ commit }, payload) {
    commit(SET_TREE, payload);
    commit(UPDATE_LAYOUT);
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
    dispatch("setTree", content);
  }
};

export default {
  state,
  mutations,
  actions
};
