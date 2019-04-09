import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TelephonyWidgetComponent} from './telephony-widget.component';

describe('TelephonyWidgetComponent', () => {
  let component: TelephonyWidgetComponent;
  let fixture: ComponentFixture<TelephonyWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TelephonyWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelephonyWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
