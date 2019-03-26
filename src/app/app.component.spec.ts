import {AppComponent, MySource} from './app.component';
import {MockApiService} from './services/api.service.mock';
import {TestBed, async, ComponentFixture, tick, inject, fakeAsync} from '@angular/core/testing';
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
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

const expectedData: MySource[] = [
  {userId: '1', id: '11', title: 'First', completed: true},
  {userId: '2', id: '22', title: 'Second', completed: true},
  {userId: '3', id: '33', title: 'Third', completed: true},
];

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let de: DebugElement;
  // let el: HTMLElement;
  let apiUrl: string;
  let apiService: ApiService;
  let hostElement;

  TestBed.overrideComponent(
    AppComponent,
    {set: {providers: [{provide: ApiService, useClass: MockApiService}]}}
  );
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
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [{provide: ApiService, useClass: MockApiService}],
    }).compileComponents().then(() => {

      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      hostElement = fixture.nativeElement;
      de = fixture.debugElement;
      // el = de.nativeElement;
      apiService = TestBed.get(ApiService);
      fixture.detectChanges();
      apiUrl = 'https://jsonplaceholder.typicode.com/posts';
    });
  }));

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should get isEmpty, isLoading, noMatches are default false', async(() => {
    expect(component.isEmpty).toBeFalsy();
    expect(component.isLoading).toBeFalsy();
    expect(component.noMatches).toBeFalsy();
  }));

  it('Service injected via inject(...) and TestBed.get(...) should be the same instance',
    inject([ApiService], (injectService: ApiService) => {
      expect(injectService).toBe(apiService);
    })
  );

  it(`should set reset to true`, async(() => {
    component.resetInputValue();
    expect(component.resetClick$).toBeTruthy();
  }));

  it(`should call the reset method`, async(() => {
    spyOn(component, 'resetInputValue').and.callThrough();
    const resetButton = de.query(By.css('button'));
    resetButton.triggerEventHandler('click', null);
    expect(component.resetInputValue).toHaveBeenCalled();
  }));

  it('should find the input', () => {
    const input: HTMLInputElement = de.query(By.css('input')).nativeElement;
    expect(input.textContent).toEqual('');
  });

  it('should input text', () => {
    const nameOption: HTMLElement = hostElement.querySelector('span');
    expect(nameOption.textContent).toContain('Enter country');
  });

  it('should get filterCountries method', fakeAsync(() => {
    fixture.detectChanges();
    const input: HTMLInputElement = hostElement.querySelector('input');
    input.value = 'f';
    input.dispatchEvent(new Event('input'));
    component.countriesArr = expectedData;
    component.filterCountries(input.value);
    tick(1000);
    fixture.detectChanges();
    expect(component.filteredCountries[0].title).toContain(expectedData[0].title);
  }));

  it('should get filterCountries method enter \'f\' then \'s\'', fakeAsync(() => {
    fixture.detectChanges();
    const input: HTMLInputElement = hostElement.querySelector('input');
    input.value = 'f';
    tick(500);
    input.value = 's';
    input.dispatchEvent(new Event('input'));
    component.countriesArr = expectedData;
    component.filterCountries(input.value);
    tick(1000);
    fixture.detectChanges();
    expect(component.filteredCountries[0].title).toContain(expectedData[1].title);
  }));

});