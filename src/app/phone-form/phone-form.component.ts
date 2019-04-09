import {Component} from '@angular/core';

@Component({
  selector: 'app-phone-form',
  templateUrl: './phone-form.component.html',
  styleUrls: ['./phone-form.component.css']
})
export class PhoneFormComponent {
  isOpen = true;

  onOpen() {
    this.isOpen = !this.isOpen;
  }

}
