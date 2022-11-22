import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { concatMap, filter, first, map, tap } from 'rxjs/operators';
import { LoadingSpinnerOverlayService } from '../services/loading-spinner-overlay.service';

@Injectable({
  providedIn: 'root'
})
export class CustomRouteDataResolver2 implements Resolve<string> {
  completionNotifier$ = new BehaviorSubject<boolean>(true);

  constructor(
    private loadingSpinner: LoadingSpinnerOverlayService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<string> {
    return of([route.params, route.queryParams])
      .pipe(
        tap(() => {
          console.log(`loadingSpinner2.show`)
          this.loadingSpinner.show()
        }),
        concatMap(([{ id }, { j }]) => forkJoin([
          this.completionNotifier$
            .pipe(first()),
            // .pipe(filter(v => {
            //   return v === true
            // })),
          of(`${id}-${j}`)
        ])),
        tap(() => {
          console.log(`loadingSpinner2.hide`)
          this.loadingSpinner.hide()
        }),
        map(([a, x]) => x)
      );
  }
}
