import { openDB } from "idb";
import shortid from "shortid";

const dbPromise = openDB("3map-app", 1, {
  upgrade(db) {
    db.createObjectStore("staging", {
      keyPath: "id"
    });
  }
});

/**
 * Return a promise that resolve to an arraybuffer from file.
 *
 * @param {file} file A file object like one from <input>
 */
function fileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loaded", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsArrayBuffer(file);
  });
}

export default {
  /**
   * Return created new map file.
   */
  async newMapFile() {
    const refPath = shortid.generate() + "/index.json";
    const filename = "Untitled";
    const content = {};
    const item = { refPath, filename, content };
    await (await dbPromise).put("files", item);
    return item;
  },

  /**
   * Return a URL of the resource file that can be used in <img> src.
   *
   * @param {string} mapRefPath The refPath of the map file this resource belong to
   * @param {object} file Most likely a file object from <input>
   */
  async addMapResource({ mapRefPath, file }) {
    const refPath = mapRefPath.replace("index.json", file.name);
    const content = await fileToArrayBuffer(file);
    const contentType = file.contentType;
    const item = { mapRefPath, refPath, content, contentType };
    await (await dbPromise).put("resources", item);
    return URL.createObjectURL(file);
  },

  /**
   * Return the updated map file record.
   *
   * @param {string} refPath The refPath of the file
   * @param {object} updates The rest of the update object
   */
  async updateMapFile({ refPath, ...updates }) {
    const db = await dbPromise;
    const file = db.get("files", refPath);
    const updated = Object.assign(file, updates);
    await db.put("files", updated);
    return updated;
  },

  /**
   * Delete a file record.
   *
   * @param {string} refPath The refPath of the file to be deleted
   */
  async removeMapFile({ refPath }) {
    (await dbPromise).delete("files", refPath);
  },

  /**
   * Delete a resource file record.
   *
   * @param {string} refPath The refPath of the resource to be deleted
   */
  async removeMapResource({ refPath }) {
    (await dbPromise).delete("resources", refPath);
  },

  /**
   * Save the current state of map locally.
   * This includes map file id and filename for uploading convenience.
   * It's used as a staging area for editing map files.
   */
  async stageMap(item) {
    return (await dbPromise).put("staging", item);
  },

  /**
   * Return a staged map by id.
   */
  async getStagedMap({ id }) {
    return (await dbPromise).get("staging", id);
  }
};
