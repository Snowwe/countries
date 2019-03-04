import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, Subject, of, timer, merge} from 'rxjs';
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
  resetClick$ = new Subject<string[]>();
  inputSource$ = new Observable<string[]>();
  combinedStream$ = new Observable<string[]>();
  filteredCountries: string[] = [];

  ngOnInit() {
    this.inputSource$ = this.inputCountry.valueChanges
      .pipe(
        debounce(() => timer(1000)),
        tap(() => console.log(this.inputCountry.value)),
        map(() => this.inputCountry.value),
        distinctUntilChanged(),
        tap(() => console.log('Before')),
        switchMap(country => {
          return this.filterCountries(country);
        }),
        tap(() => console.log('After')),
      );

    this.resetClick$ = this.resetClick$
      .pipe(
        tap(() => {
          this.inputCountry.setValue('');
        }),
        map(() => {
          return {cancelRequest: true};
        }),
        switchMap(() => {
          return of([]);
        }),
      );

    this.combinedStream$ = merge(
      this.inputSource$,
      this.resetClick$,
    );

    this.combinedStream$.subscribe(event => console.log(event));

  }

  filterCountries(value: string) {
    return of([])
      .pipe(
        delay(1000),
        map(() => this.filteredCountries = this.countriesArr.filter(country =>
          country.toLowerCase().includes(value.toLowerCase())))
      );
  }
}
