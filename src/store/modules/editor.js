import { Layout, BoundingBox } from "non-layered-tidy-tree-layout";
import shortid from "shortid";

import api from "@/api";
import * as mt from "../mutation-types";

const createNewNode = () => {
  const id = shortid.generate();
  return {
    id,
    text: `New node ${id}`,
    ...NODE_SIZE_DEFAULT,
    x: 0,
    y: 0,
    children: []
  };
};

const NODE_BOUNDING_BOX = { gap: 32, bottomPadding: 64 };
const NODE_SIZE_DEFAULT = { width: 100, height: 50 };
const layout = new Layout(
  new BoundingBox(NODE_BOUNDING_BOX.gap, NODE_BOUNDING_BOX.bottomPadding)
);

const state = {
  contentId: null,
  treeData: null,
  treeBoundingBox: { left: 0, right: 0, top: 0, bottom: 0 },
  savingStatus: "",
  mapFile: { refPath: shortid.generate(), filename: "" },
  /**
   * { refPath, downloadURL }
   */
  resources: []
};

const getters = {
  resourceStatus: (state, _, rootState) => resource =>
    Object.assign({}, resource, rootState.sync.status[resource.refPath])
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

  [mt.SET_CONTENT](state, { tree }) {
    state.treeData = tree;
  },

  [mt.SET_FILE](state, { refPath, name }) {
    state.file.refPath = refPath;
    state.file.name = name;
  },

  [mt.CHANGE_SAVING_STATUS](state, { status }) {
    state.savingStatus = status;
  },

  [mt.ADD_RESOURCE](state, { refPath, file }) {
    state.resources.push({
      refPath,
      downloadURL: URL.createObjectURL(file)
    });
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

  doneResize() {
    /**
     * This signals a serial of resize events has happened.
     * store.subscribeAction can use this to throttle resize events,
     * so that there are less database write involved.
     */
  },

  updateText({ commit }, payload) {
    commit(mt.UPDATE_TEXT, payload);
  },

  async getMapContent({ commit }, { id }) {
    if (id === "new") {
      const content = { tree: createNewNode() };
      commit(mt.SET_CONTENT, content);
      commit(mt.UPDATE_LAYOUT);
    } else {
      const url = await api.cloud.getDownloadURL({
        refPath: id + "/index.json"
      });
      const resp = await fetch(url);
      const tree = await resp.json();
      console.log("got tree", tree);
      commit(mt.SET_CONTENT, { tree });
      commit(mt.UPDATE_LAYOUT);
    }
  },

  uploadMapFile({ state, dispatch }, { id, filename }) {
    if (id === "new") {
      const refPath = shortid.generate() + "/index.json";
      const metadata = { customMetadata: { filename } };
      const string = JSON.stringify(state.treeData);
      dispatch("uploadFiles", [{ refPath, metadata, string }]);
    } else {
      const refPath = id + "/index.json";
      const string = JSON.stringify(state.treeData);
      const metadata = { customMetadata: { filename } };
      dispatch("uploadFiles", [{ refPath, metadata, string }]);
    }
  },

  addResource({ commit, dispatch, state }, { file }) {
    const refPath = `${state.mapFile.refPath}/${file.name}`;
    commit("ADD_RESOURCE", { refPath, file });
    dispatch("uploadFiles", [{ refPath, file }]);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
