import { Subject, merge } from "rxjs";
import { flatMap, map, filter, groupBy, switchMap } from "rxjs/operators";

import api from "@/api";
import {
  UPDATE_UPLOADS_IN_PROGRESS_COUNT,
  UPDATE_UPLOAD_STATUS
} from "../mutation-types";

export default function createSyncStatusPlugin() {
  return store => {
    let ongoing = 0;

    const uploads$ = new Subject().pipe(groupBy(fileInfo => fileInfo.refPath));
    const inProgress$ = uploads$.pipe(map(() => ++ongoing));
    const tasks$ = uploads$.pipe(
      flatMap(group$ =>
        group$.pipe(switchMap(fileInfo => api.cloud.uploadFile(fileInfo)))
      )
    );
    const completed$ = tasks$.pipe(
      filter(state => state.progress === 1),
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
        // Intercept and construct api.uploadFile parameters.
        for (const fileInfo of action.payload) {
          uploads$.next(fileInfo);
        }
      }
    });
  };
}
