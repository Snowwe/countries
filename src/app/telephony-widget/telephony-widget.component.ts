import {Component, OnInit} from '@angular/core';
import {Call, CallService} from '../services/call/call.service';
import {Observable} from 'rxjs/internal/Observable';

@Component({
  selector: 'app-telephony-widget',
  templateUrl: './telephony-widget.component.html',
  styleUrls: ['./telephony-widget.component.css']
})
export class TelephonyWidgetComponent implements OnInit {
  isCall = true;
  currentCall$: Observable<Call>;

  constructor(private callService: CallService) {
  }

  ngOnInit() {
    this.currentCall$ = this.callService.getCurrentCall$();
  }

  onCall() {
    this.isCall = !this.isCall;
    if (!this.isCall) {
      const phone = Math.floor(Math.random() * 1000000000);
      this.callService.makeCall({phone});
    } else {
      this.callService.completeCall();
    }
  }
}
