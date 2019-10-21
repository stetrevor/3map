import { openDB } from "idb";

const dbPromise = openDB("3map", 1, {
  upgrade(db) {
    const files = db.createObjectStore("files", {
      keyPath: "refPath"
    });
    files.createIndex("lastModified", "lastModified");
    files.createIndex("contentId", "contentId");

    db.createObjectStore("contents", {
      keyPath: "id",
      autoIncrement: "true"
    });
  }
});

export default {
  async new3MapFile(item) {
    return (await dbPromise).add("files", item);
  },

  async getFile({ id }) {
    return (await dbPromise).get("files", id);
  },

  async updateFile({ id, ...updates }) {
    const db = await dbPromise;
    const file = await db.get("files", id);
    Object.assign(file, updates);
    return db.put("files", file);
  },

  async deleteFile({ id }) {
    const db = await dbPromise;
    const file = await db.get("files", id);
    await db.delete("files", id);
    return db.delete("contents", file.contentId);
  },

  async getAllFiles() {
    return (await dbPromise).getAllFromIndex("files", "lastModified");
  },

  async newContent(item) {
    return (await dbPromise).add("contents", item);
  },

  async getContent({ id }) {
    return (await dbPromise).get("contents", id);
  },

  async updateContent(updates) {
    const db = await dbPromise;
    await db.put("contents", updates);
    const file = await db.getFromIndex("files", "contentId", updates.id);
    file.lastModified = new Date();
    return db.put("files", file);
  }
};
