import {AppComponent} from './app.component';
import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {
  MatButtonModule,
  MatInputModule,
  MatAutocompleteModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatIconModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule, By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApiService} from './services/api.service';
import {DebugElement} from '@angular/core';

describe('AppComponent', () => {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let elInput: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        HttpClientModule,
        MatProgressSpinnerModule,
        MatIconModule,
      ],
      providers: [ApiService],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      comp = fixture.componentInstance;
      de = fixture.debugElement;
      el = de.nativeElement;
      elInput = de.nativeElement;
      fixture.detectChanges();
    });
  }));

  it('should create the app', async(() => {
    expect(comp).toBeTruthy();
  }));


  it(`should set reset to true`, async(() => {
    comp.resetInputValue();
    expect(comp.resetClick$).toBeTruthy();
  }));

  it(`should call the reset method`, async(() => {
    spyOn(comp, 'resetInputValue').and.callThrough();
    const resetButton = de.query(By.css('button'));
    resetButton.triggerEventHandler('click', null);
    expect(comp.resetInputValue).toHaveBeenCalled();
  }));
});
