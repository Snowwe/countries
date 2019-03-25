import {Injectable} from '@angular/core';
// import {HttpClient} from '@angular/common/http';
import {MySource} from '../app.component';
import {of} from 'rxjs/internal/observable/of';
import {Observable} from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {

  public get(): Observable<MySource[]> {
    return of([]);
  }
}
