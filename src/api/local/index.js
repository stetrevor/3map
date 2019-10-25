import { openDB } from "idb";

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
   * Save the current state of map locally.
   * This includes map file id and filename for uploading convenience.
   * It's used as a staging area for editing map files.
   *
   * item structure:
   * { id, filename, content: { tree: Object } }
   *
   */
  async stageMap(item) {
    return (await dbPromise).put("staging", item);
  },

  /**
   * Return a staged map by id.
   */
  async getStagedMap({ id }) {
    return (await dbPromise).get("staging", id);
  },

  /**
   * Delete a staged map by id.
   */
  async deleteStagedMap({ id }) {
    return (await dbPromise).delete("staging", id);
  }
};
