import {Injectable} from '@angular/core';
import {of} from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {

  get(apiUrl: string) {
    return of([]);
  }
}
