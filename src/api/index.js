import shortid from "shortid";

import cloud from "./firebase";
// import local from "./local";

export default {
  cloud,
  // local,

  /**
   * Return a generated file identifier string for use in storage ref.
   */
  generateFileId() {
    return shortid.generate();
  }
};
