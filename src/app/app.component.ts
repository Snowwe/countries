import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject, of, timer, merge} from 'rxjs';
import {
  map, debounce,
  switchMap, delay,
  tap, takeUntil,
  distinctUntilChanged,
} from 'rxjs/operators';
import {ApiService} from './services/api.service';

export interface MySource {
  userId;
  id?;
  title?: string;
  completed?;
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
  filteredCountries: MySource[] = [];
  isLoading = false;
  isEmpty = false;
  noMatches = false;
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

    const combinedStream$ = merge(
      this.inputCountry.valueChanges,
      this.resetClick$,
    );

    combinedStream$.pipe(
      tap(() => {
        if (this.inputCountry.value === '') {
          this.filteredCountries = [];
          this.isEmpty = true;
        }
        this.noMatches = false;
      }),
      debounce(() => timer(500)),
      map(() => this.inputCountry.value),
      distinctUntilChanged(),
      tap(() => {
        this.noMatches = false;
        this.isLoading = true;
      }),
      switchMap(country => {
        if (this.inputCountry.value === '') {
          return of([]);
        }
        this.isEmpty = false;
        return this.filterCountries(country);
      }),
      tap(event => {
        this.filteredCountries = event;
        if (this.inputCountry.value !== '' && this.filteredCountries[0] === undefined) {
          this.noMatches = true;
        }
        this.isLoading = false;
      }),
      takeUntil(this.componentDestroyed),
    ).subscribe(event => console.log(event));

  }

  resetInputValue() {
    this.inputCountry.setValue('');
    this.resetClick$
      .pipe(tap(() => {
        this.inputCountry.reset('');
      }));
  }

  filterCountries(value: string) {
    const filterValue = value.toLowerCase();
    return of([])
      .pipe(
        delay(500),
        map(() => this.countriesArr.filter(country => {
          return country.title.toLowerCase().indexOf(filterValue) === 0;
        })),
      );
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }
}
