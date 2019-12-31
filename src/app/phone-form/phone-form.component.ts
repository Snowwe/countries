import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../services/api/api.service';
import {Observable} from 'rxjs/internal/Observable';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Call, CallService} from '../services/call/call.service';

@Component({
  selector: 'app-phone-form',
  templateUrl: './phone-form.component.html',
  styleUrls: ['./phone-form.component.css']
})
export class PhoneFormComponent implements OnInit {
  isOpen = false;
  data: Observable<object>;
  apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  saveData = [];
  form: FormGroup = new FormGroup({
    id: new FormControl(),
    title: new FormControl(),
  });
  @Input() countrySave;
  currentCall$: Observable<Call>;

  constructor(private apiService: ApiService,
              private formBuilder: FormBuilder,
              private callService: CallService) {
  }

  ngOnInit() {
    this.data = this.apiService.get(this.apiUrl);
    this.form = this.formBuilder.group({
      id: [null],
      title: [null],
    });
    this.currentCall$ = this.callService.getCurrentCall$();
  }

  onOpen() {
    this.isOpen = !this.isOpen;
  }

  onClear() {
    this.saveData = [];
    // this.callService.completeCall();
    // this.form = this.formBuilder.group({
    //   id: [null],
    //   title: [null],
    // });
  }

  onSelectedSave() {
    this.saveData['id'] = this.form.value.id;
    this.saveData['title'] = this.form.value.title;
  }
}
