import {AppComponent, MySource} from './app.component';
import {MockApiService} from './services/api.service.mock';
import {
  TestBed, async, ComponentFixture,
  tick, inject, fakeAsync
} from '@angular/core/testing';
import {
  MatInputModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApiService} from './services/api.service';
import {DebugElement} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';

const expectedData: MySource[] = [
  {userId: '1', id: '11', title: 'First', completed: true},
  {userId: '2', id: '22', title: 'Second', completed: true},
  {userId: '3', id: '33', title: 'Third', completed: true},
];

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let de: DebugElement;
  let apiUrl: string;
  let apiService: ApiService;
  let hostElement;
  let input: HTMLInputElement;

  TestBed.overrideComponent(
    AppComponent,
    {set: {providers: [{provide: ApiService, useClass: MockApiService}]}}
  );
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        HttpClientTestingModule,
      ],
      providers: [{provide: ApiService, useClass: MockApiService}],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      hostElement = fixture.nativeElement;
      de = fixture.debugElement;
      apiService = TestBed.get(ApiService);
      fixture.detectChanges();
      apiUrl = 'https://jsonplaceholder.typicode.com/posts';
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });
  }));

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should get isEmpty, isLoading, noMatches are default false', () => {
    expect(component.isEmpty).toBeFalsy();
    expect(component.isLoading).toBeFalsy();
    expect(component.noMatches).toBeFalsy();
  });

  it('Service injected via inject(...) and TestBed.get(...) should be the same instance',
    inject([ApiService], (injectService: ApiService) => {
      expect(injectService).toBe(apiService);
    })
  );

  it(`should set reset to true`, () => {
    component.resetInputValue();
    expect(component.resetClick$).toBeTruthy();
  });

  it(`should call the reset method`, () => {
    spyOn(component, 'resetInputValue').and.callThrough();
    const resetButton = de.query(By.css('button'));
    resetButton.triggerEventHandler('click', null);
    expect(component.resetInputValue).toHaveBeenCalled();
  });

  it('should find the input', () => {
    expect(input.textContent).toBe('');
  });

  it('should input text', () => {
    const nameOption: HTMLSpanElement = hostElement.querySelector('span');
    expect(nameOption.textContent).toContain('Enter country');
  });

  it('should get filterCountries method', fakeAsync(() => {
    fixture.detectChanges();
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
    input.value = 'f';
    expect(component.filteredCountries).toEqual([]);
    tick(500);
    fixture.detectChanges();
    expect(component.filteredCountries).toEqual([]);
    input.value = 's';
    input.dispatchEvent(new Event('input'));
    component.countriesArr = expectedData;
    component.filterCountries(input.value);
    tick(1000);
    fixture.detectChanges();
    expect(component.filteredCountries[0].title).toContain(expectedData[1].title);
  }));

});
