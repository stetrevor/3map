import "firebase/storage";
import { Observable, from, concat } from "rxjs";
import { pluck, flatMap, map } from "rxjs/operators";

import shortid from "shortid";

import initFirebase from "./config";

const firebase = initFirebase();
const storageRef = firebase.storage().ref();
const userRef = storageRef.child("users/testuser");

/**
 * Return an Observable that emit the metadata of a Firebase storage object.
 *
 * @param {Object} ref The ref to the object
 */
function getMetadata(ref) {
  return from(ref.getMetadata());
}

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
        () => observer.complete()
      );
    });
  },

  /**
   * Return an Observable that emit each map file item like this:
   * {
   *   refPath: 'file/refpath',
   *   filename: 'pic.png', and other fields.
   * }
   * On complete, it emits an object { nextPageToke: 'nextpagetoken' }.
   *
   * @param {string} nextPageToken Token used by firebase list() API.
   */
  nextPageMapFiles({ nextPageToken }) {
    const page$ = from(
      userRef.list({
        maxResults: 2,
        pageToken: nextPageToken
      })
    );
    const metadata$ = page$.pipe(
      pluck("prefixes"),
      flatMap(prefixes => from(prefixes)),
      flatMap(prefix => getMetadata(prefix.child("index.json"))),
      map(({ fullPath, customMetadata, updated }) => {
        const refPath = fullPath.replace("users/testuser/", "");
        const id = refPath.replace("/index.json", "");
        return { id, refPath, filename: customMetadata.filename, updated };
      })
    );
    const token$ = page$.pipe(
      pluck("nextPageToken"),
      map(nextPageToken => ({ nextPageToken }))
    );
    return concat(metadata$, token$);
  },

  /**
   * Update map file metadata, mostly customMetadata.filename.
   *
   * @param {string} refPath The path relative to current user
   * @param {object} metadata an object of custom metadata to update
   */
  async updateMetadata({ refPath, ...metadata }) {
    const ref = userRef.child(refPath);
    const data = await ref.updateMetadata({ customMetadata: metadata });
    return {
      refPath,
      filename: data.customMetadata.filename,
      updated: data.updated
    };
  },

  /**
   * Return the downloadURL of a refPath.
   *
   * @param {string} refPath The refPath relative to current user
   */
  getDownloadURL({ refPath }) {
    return userRef.child(refPath).getDownloadURL();
  },

  /**
   * Delete a file by refPath.
   *
   * @param {string} refPath The refPath of the file to be deleted
   */
  deleteFile({ refPath }) {
    return userRef.child(refPath).delete();
  }
};
