import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {
  Observable, Subject, of,
  timer, merge,
} from 'rxjs';
import {
  map, debounce,
  switchMap, delay,
  tap, takeUntil,
  distinctUntilChanged,
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
export class AppComponent implements OnInit, OnDestroy {
  inputCountry = new FormControl();
  countriesArr: MySource[];
  resetClick$ = new Subject<string>();
  inputSource$ = new Observable<string>();
  combinedStream$ = new Observable<string>();
  filteredCountries: MySource[] = [];
  isLoading = false;
  private componentDestroyed = new Subject();

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
      map(() => this.inputCountry.value),
      debounce(() => timer(500)),
      distinctUntilChanged(),
      tap(() => {
        this.filteredCountries = [];
        this.isLoading = true;
      }),
      switchMap(country => {
        if (this.inputCountry.value === '') {
          return of([]);
        }
        return this.filterCountries(country);
      }),
      tap(() => this.isLoading = false),
      takeUntil(this.componentDestroyed),
    ).subscribe(event => console.log(event));

  }

  resetInputValue() {
    this.inputCountry.setValue('');
    this.resetClick$
      .next(this.inputCountry.value);
  }

  filterCountries(value: string) {
    const filterValue = value.toLowerCase();
    return of([])
      .pipe(
        delay(500),
        map(() => this.filteredCountries = this.countriesArr.filter(country => {
          return country.title.toLowerCase().indexOf(filterValue) === 0;
        })),
      );
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }
}
