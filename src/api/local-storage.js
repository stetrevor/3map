import { openDB } from "idb";

const dbPromise = openDB("3map", 1, {
  upgrade(db) {
    const files = db.createObjectStore("files", {
      keyPath: "id",
      autoIncrement: true
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
  async newFile(item) {
    item.lastModified = new Date();
    return (await dbPromise).add("files", item);
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

  async updateContent({ id, ...updates }) {
    const db = await dbPromise;
    const content = await db.get("contents", id);
    Object.assign(content, updates);
    await db.put("contents", content);
    const file = await db.getFromIndex("files", "contentId", id);
    file.lastModified = new Date();
    return db.put("files", file);
  }
};
