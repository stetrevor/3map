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
  treeData: null,
  treeBoundingBox: { left: 0, right: 0, top: 0, bottom: 0 },
  saveStatus: "",
  mapFile: { id: "", filename: "" },
  /**
   * { refPath, downloadURL }
   */
  resources: []
};

const getters = {
  tree(state) {
    return state.treeData;
  },

  boundingBox() {
    return state.treeBoundingBox;
  }
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

  [mt.SET_MAP_FILE](state, { id, filename }) {
    state.mapFile.id = id;
    state.mapFile.filename = filename;
  },

  [mt.CHANGE_SAVE_STATUS](state, { status }) {
    state.saveStatus = status;
  },

  [mt.RESET_SAVE_STATUS](state) {
    state.saveStatus = "";
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

  async getMapContent({ commit }, { id, filename }) {
    let content;
    if (id === "new") {
      content = { tree: createNewNode() };
      id = shortid.generate();
    } else {
      // See if a staging copy is found.
      const staging = await api.local.getStagedMap({ id });
      if (staging) {
        content = staging.content;
      } else {
        const url = await api.cloud.getDownloadURL({
          refPath: id + "/index.json"
        });
        const resp = await fetch(url);
        const tree = await resp.json();
        content = { tree };
      }
    }

    commit(mt.RESET_SAVE_STATUS);
    commit(mt.SET_MAP_FILE, { id, filename });
    commit(mt.SET_CONTENT, content);
    commit(mt.UPDATE_LAYOUT);

    await api.local.stageMap({ id, filename, content });
  },

  uploadMapFile({ state, dispatch }, { id, filename }) {
    // Check to see if there's any change.
    // If not, delete the staged map.
    if (state.saveStatus === "") {
      return api.local.deleteStagedMap({ id });
    }

    const fileId = id === "new" ? shortid.generate() : id;
    const refPath = fileId + "/index.json";
    const metadata = { customMetadata: { filename } };
    const string = JSON.stringify(state.treeData);
    dispatch("uploadFiles", [{ refPath, metadata, string }]);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
