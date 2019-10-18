import { of, concat, empty, defer, merge } from "rxjs";
import {
  share,
  mapTo,
  tap,
  concatMap,
  filter,
  delay,
  switchAll
} from "rxjs/operators";

/**
 * Return an Observable, with status message as the output.
 */
export function getSaveIndicator(input$, request, savingText, savedText) {
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
