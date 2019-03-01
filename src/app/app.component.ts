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
  resetClick$: Subject<any> = new Subject<any>();
  inputSource$: Observable<any> = new Observable<any>();
  combinedStream$: Observable<any> = new Observable<any>();
  filteredCountries: string[] = countriesArr;

  ngOnInit() {
    this.inputSource$ = this.inputSource();
    // this.resetClick$.next(this.resetButtonClick());
    this.resetClick$ = this.resetButtonClick();
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

  resetButtonClick() {
    return this.resetClick$
      .pipe(
        tap(() => {
          this.inputCountry.setValue('');
          this.inputCountry.value = '*';
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
        tap(() => console.log(this.inputCountry.value)),
        map(() => this.inputCountry.value),
      );
  }

  combinedStream() {
    return merge(
      this.inputSource$,
      this.resetClick$,
    );
  }

  filterCountriesNew(value: string) {
    return of([])
      .pipe(
        delay(2000),
        map(() => this.filteredCountries = this.countriesArr.filter(country =>
          country.toLowerCase().includes(value.toLowerCase())))
      );
  }
}
