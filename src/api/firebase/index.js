import "firebase/storage";
import { Observable } from "rxjs";

import shortid from "shortid";

import initFirebase from "./config";

const firebase = initFirebase();
const storageRef = firebase.storage().ref();
const userRef = storageRef.child("users/testuser");

export default {
  /**
   * Return an Observable that emits upload progress and success status.
   *
   * If `file` is provided, `string` is ignored.
   *
   * @param {String} refPath Required. The full path where the upload destination is.
   * @param {File, Blob, Uint8Array} file A file object like the one from <input> file.
   * @param {String} string Raw string content to put in refPath.
   * @param {Object} metadata Key value pairs containing metadata, like file name to be displayed.
   */
  uploadFile({ file, string, metadata, refPath }) {
    return Observable.create(observer => {
      let uploadTask;
      if (file) {
        uploadTask = userRef.child(refPath).put(file, metadata);
      } else {
        uploadTask = userRef
          .child(refPath)
          .putString(btoa(string), "base64", metadata);
      }

      uploadTask.on(
        "state_changed",
        snapshot => {
          const progress = snapshot.bytesTransferred / snapshot.totalBytes;
          observer.next({ refPath, progress });
        },
        error => observer.error(error),
        async () => {
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          observer.next({ refPath, success: true, downloadURL });
          observer.complete();
        }
      );
    });
  },

  /**
   * Return refPaths used by a 3map file.
   * This includes a refPath for 3map file, if not provided,
   * and a resourceRefPath function that takes the resource name
   * and generate a refPath for the resource file.
   *
   * @param {string} refPath The refPath of a 3map file
   */
  generateRefPaths(refPath = null) {
    let dir;
    let mapRefPath;
    if (refPath) {
      dir = refPath.replace("index.json", "");
      mapRefPath = refPath;
    } else {
      dir = `users/testuser/${shortid.generate()}/`;
      mapRefPath = dir + "index.json";
    }
    const resourceRefPath = name => dir + name;

    return { mapRefPath, resourceRefPath };
  }
};
