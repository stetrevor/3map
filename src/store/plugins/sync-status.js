import { Subject, merge } from "rxjs";
import { flatMap, map, filter } from "rxjs/operators";

import api from "@/api/firebase";
import {
  UPDATE_UPLOADS_IN_PROGRESS_COUNT,
  UPDATE_UPLOAD_STATUS
} from "../mutation-types";

export default function createSyncStatusPlugin() {
  return store => {
    let ongoing = 0;

    const uploads$ = new Subject();
    const inProgress$ = uploads$.pipe(map(() => ++ongoing));
    const tasks$ = uploads$.pipe(flatMap(file => api.uploadFile(file)));
    const completed$ = tasks$.pipe(
      filter(state => state.success),
      map(() => --ongoing)
    );
    const ongoing$ = merge(inProgress$, completed$);

    ongoing$.subscribe(ongoing => {
      store.commit(UPDATE_UPLOADS_IN_PROGRESS_COUNT, { count: ongoing });
    });
    tasks$.subscribe(state => {
      store.commit(UPDATE_UPLOAD_STATUS, state);
    });

    store.subscribeAction(action => {
      if (action.type === "uploadFiles") {
        console.log("got files to upload", action.payload);
        for (const file of action.payload) {
          uploads$.next(file);
        }
      }
    });
  };
}
