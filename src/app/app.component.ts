import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, of, timer, merge, fromEvent} from 'rxjs';
import {
  map, debounce,
  switchMap, delay,
  tap, distinctUntilChanged,
} from 'rxjs/operators';
import {countriesArr} from './models/countries-arr.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  inputCountry = new FormControl();
  countriesArr: string[] = countriesArr;
  reset$: Observable<any> = new Observable<any>();
  inputSource$: Observable<any> = new Observable<any>();
  combinedStream$: Observable<any> = new Observable<any>();
  @ViewChild('buttonReset', {read: ElementRef}) buttonReset: ElementRef;

  constructor() {
  }

  ngOnInit() {
    this.inputSource$ = this.inputSource();
    this.reset();
    this.combinedStream$ = this.combinedStream();
    this.combinedStream$
      .pipe(
        distinctUntilChanged(),
        tap(() => console.log('Before')),
        switchMap(country => {
          if (country.cancelRequest) {
            return of([]);
          }
          return this.filterCountriesNew(country);
        }),
        tap(() => console.log('After')),
      ).subscribe(event => console.log(event));
  }

  reset() {
    return this.reset$ = fromEvent(this.buttonReset.nativeElement, 'click')
      .pipe(
        tap(() => {
          this.inputCountry.setValue('');
          console.log('click reset');
        }),
        map(() => {
          return {cancelRequest: true};
        })
      );
  }

  inputSource() {
    return this.inputCountry.valueChanges
      .pipe(
        debounce(() => timer(2000)),
        tap(() => console.log(this.inputCountry.valueChanges)),
        map(() => this.inputCountry.value),
      );
  }

  combinedStream() {
    return merge(
      this.inputSource$,
      this.reset$,
    );
  }

  filterCountriesNew(value: string) {
    return of([])
      .pipe(
        delay(2000),
        map(() => this.countriesArr.filter(country =>
          country.toLowerCase().includes(value.toLowerCase())))
      );
  }
}
