import { Subject, of, concat, empty, defer, merge } from "rxjs";
import {
  share,
  mapTo,
  tap,
  concatMap,
  filter,
  delay,
  switchAll
} from "rxjs/operators";

import api from "@/api";
import { CHANGE_SAVE_STATUS } from "../mutation-types";

/**
 * Return an Observable, with status message as the output.
 */
function getSaveIndicator(input$, request, savingText, savedText) {
  let savesInProgress = 0;

  const source$ = input$.pipe(share());
  const savesInProgress$ = source$.pipe(
    mapTo(of(savingText)),
    tap(() => savesInProgress++)
  );
  const savesCompleted$ = source$.pipe(
    concatMap(request),
    tap(() => savesInProgress--),
    filter(() => !savesInProgress),
    mapTo(
      concat(
        of(savedText),
        empty().pipe(delay(2000)),
        defer(() => of(Date.now()))
      )
    )
  );

  return merge(savesInProgress$, savesCompleted$).pipe(switchAll());
}

export default function createSaveStatusPlugin() {
  return store => {
    const input$ = new Subject();

    const saveChanges = item => api.local.stageMap(item);

    const indicator$ = getSaveIndicator(input$, saveChanges, "saving", "saved");
    indicator$.subscribe(status => {
      store.commit(CHANGE_SAVE_STATUS, { status });
    });

    store.subscribeAction((action, state) => {
      /**
       * Using store.subscribeAction ensures that the calculated layout
       * gets saved to database. It's not necessary, but it's nice to have.
       */
      const saveOperations = [
        "addChild",
        "removeChild",
        "reorderNodes",
        "moveNode",
        "doneResize",
        "updateText"
      ];
      if (saveOperations.includes(action.type)) {
        const { id, filename } = state.editor.mapFile;
        const content = { tree: state.editor.treeData };
        input$.next({ id, filename, content });
      }
    });
  };
}
