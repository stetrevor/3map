import { Subject } from "rxjs";
import { flatMap } from "rxjs/operators";

import api from "@/api";
import { UPDATE_NEXT_PAGE_TOKEN } from "../mutation-types";

export default function createListFilesPlugin() {
  return store => {
    const tokens$ = new Subject();

    const fileItems$ = tokens$.pipe(flatMap(api.cloud.nextPageMapFiles));

    fileItems$.subscribe(item => {
      if ("nextPageToken" in item) {
        store.commit(UPDATE_NEXT_PAGE_TOKEN, item);
      } else {
        store.dispatch("addToMapFileList", item);
      }
    });

    store.subscribeAction(action => {
      if (action.type === "getNextPageMapFiles") {
        tokens$.next(action.payload);
      }
    });
  };
}
