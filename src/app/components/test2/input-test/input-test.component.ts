import { AfterContentInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { concatMap, distinct, filter, first, firstValueFrom, map, mergeAll, of, Subject, tap, toArray } from 'rxjs';

@Component({
  selector: 'app-input-test',
  templateUrl: './input-test.component.html',
  styleUrls: ['./input-test.component.css']
})
export class InputTestComponent implements AfterContentInit, OnDestroy {

  query$ = new Subject<string>();
  delta$ = new Subject<number>();

  @ViewChild("queryInput", { static: true }) queryInput!: ElementRef;

  testData = of([
    { v: 512512152, tags: ['a'] },
    { v: 8321812381231, tags: ['b'] },
    { v: 22323, tags: ['c'] },
    { v: 3123123, tags: ['d'] },
    { v: 234, tags: ['a', 'b'] },
    { v: 1231235, tags: ['c'] },
    { v: 15156, tags: ['c'] },
    { v: 1231237, tags: ['b'] },
    { v: 123123, tags: ['c', 'b'] },
    { v: 9123213, tags: ['b', 'd'] }
  ]);

  filteredData$ = this.query$
    .pipe(
      map(q => q.toLowerCase()),
      concatMap((q) => this.testData
        .pipe(
          mergeAll(),
          filter(({ tags }) => tags.indexOf(q) > -1),
          toArray(),
        )),
    );

  allTags$ = this.testData
    .pipe(
      mergeAll(),
      map(({ tags }) => tags),
      mergeAll(),
      distinct(),
      toArray()
    )

  constructor(private activatedRoute: ActivatedRoute) {
    console.log(`InputTestComponent ctor`);
  }

  async ngAfterContentInit() {
    return firstValueFrom(this.activatedRoute.queryParams
      .pipe(
        first(),
        tap(({ q }) => {
          this.queryInput.nativeElement.value = q;
        }),
      ))

  }

  async ngOnDestroy() {
    clearInterval(this.deltaUpdater);
  }

  //do not remove alter or relocate
  deltaUpdater = setInterval(() => {
    const v = getRandomIntInclusive(0, 100);
    //the delta value MUST update twice per second while viewing this page
    this.delta$.next(v);
    if (v > 50) {
      console.log(v);
    }
  }, 500);
  //do not remove alter or relocate

}

//do not remove alter or relocate
function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
//do not remove alter or relocate
