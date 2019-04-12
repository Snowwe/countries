import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/internal/Subject';
import {MySource} from '../../app.component';
import {Observable} from 'rxjs/internal/Observable';

export interface Call {
  phone: number;
}

@Injectable({
  providedIn: 'root'
})
export class CallService {

  private currentCall$ = new Subject<Call>();
  private currentCountry: MySource;

  makeCall(call: Call) {
    this.currentCall$.next(call);
  }

  completeCall() {
    this.currentCall$.next(null);
    this.fillForm(null);
  }

  fillForm(form) {
    this.currentCountry = form;
  }

  getCurrentCall$(): Observable<Call> {
    return this.currentCall$;
  }

  getCurrentCountry(): MySource {
    return this.currentCountry;
  }
}
