import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, Subject, of, timer, merge} from 'rxjs';
import {
  map, debounce,
  switchMap, delay,
  tap, distinctUntilChanged,
} from 'rxjs/operators';
import {ApiService} from './services/api.service';

export interface MySource {
  userId: number;
  id?: number;
  title?: string;
  completed?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ApiService],
})
export class AppComponent implements OnInit {
  inputCountry = new FormControl();
  countriesArr: MySource[];
  resetClick$ = new Subject<string>();
  inputSource$ = new Observable<string>();
  combinedStream$ = new Observable<string>();
  filteredCountries: MySource[] = [];

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.get('https://jsonplaceholder.typicode.com/posts')
      .subscribe((value: MySource[]) => {
          this.countriesArr = value;
        },
        error => {
          console.log(error);
        });

    this.inputSource$ = this.inputCountry.valueChanges;

    this.combinedStream$ = merge(
      this.inputSource$,
      this.resetClick$,
    );

    this.combinedStream$.pipe(
      debounce(() => timer(1000)),
      map(() => this.inputCountry.value),
      distinctUntilChanged(),
      tap(() => console.log('Before')),
      switchMap(country => {
        if (this.inputCountry.value === '') {
          return of([]);
        }
        return this.filterCountries(country);
      }),
      tap(() => console.log('After')),
    ).subscribe(event => console.log(event));

  }

  resetInputValue() {
    this.inputCountry.setValue('');
    this.resetClick$.next();
  }

  filterCountries(value: string) {
    const filterValue = value.toLowerCase();
    return of([])
      .pipe(
        delay(1000),
        map(() => this.filteredCountries = this.countriesArr.filter(country => {
          return country.title.toLowerCase().indexOf(filterValue) === 0;
        }))
      );
  }
}
