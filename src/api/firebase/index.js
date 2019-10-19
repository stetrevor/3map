import "firebase/storage";
import { Observable } from "rxjs";

import initFirebase from "./config";

const firebase = initFirebase();
const storageRef = firebase.storage().ref();

export default {
  uploadFile(file) {
    return Observable.create(observer => {
      const refPath = file.name;
      const uploadTask = storageRef.child(refPath).put(file);

      uploadTask.on(
        "state_changed",
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
