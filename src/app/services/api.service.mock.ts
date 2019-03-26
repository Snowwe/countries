import {Injectable} from '@angular/core';
import {MySource} from '../app.component';
import {of} from 'rxjs/internal/observable/of';
import {Observable} from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {

  public get(apiUrl: string): Observable<MySource[]> {
    return of([]);
  }
}
