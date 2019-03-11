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
  isLoading = false;

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
      tap(() => this.filteredCountries = []),
      tap(() => {
          if (this.inputCountry.value !== '') {
            return this.isLoading = true;
          }
        }
      ),
      debounce(() => timer(500)),
      map(() => this.inputCountry.value),
      distinctUntilChanged(),
      switchMap(country => {
        if (this.inputCountry.value === '') {
          return of([]);
        }
        return this.filterCountries(country);
      }),
      tap(() => this.isLoading = false),
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
        delay(500),
        map(() => this.filteredCountries = this.countriesArr.filter(country => {
          return country.title.toLowerCase().indexOf(filterValue) === 0;
        }))
      );
  }
}
