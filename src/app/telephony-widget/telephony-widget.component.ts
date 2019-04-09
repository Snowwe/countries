import {Component} from '@angular/core';

@Component({
  selector: 'app-telephony-widget',
  templateUrl: './telephony-widget.component.html',
  styleUrls: ['./telephony-widget.component.css']
})
export class TelephonyWidgetComponent {
  isCall = true;

  onCall() {
    this.isCall = !this.isCall;
  }

}
