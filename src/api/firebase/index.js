import "firebase/storage";
import { Observable } from "rxjs";

import initFirebase from "./config";

const firebase = initFirebase();
const storageRef = firebase.storage().ref();

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
        uploadTask = storageRef.child(refPath).put(file, metadata);
      } else {
        uploadTask = storageRef
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
  }
};
