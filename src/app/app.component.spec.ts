import {AppComponent, MySource} from './app.component';
import {MockApiService} from './services/api.service.mock';
import {
  TestBed, async, ComponentFixture,
  tick, inject, fakeAsync
} from '@angular/core/testing';
import {MatAutocompleteModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {ApiService} from './services/api.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';

const expectedData: MySource[] = [
  {userId: '1', id: '11', title: 'First', completed: true},
  {userId: '2', id: '22', title: 'Second', completed: true},
  {userId: '3', id: '33', title: 'Third', completed: true},
];

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: ApiService;
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
        MatAutocompleteModule,
        HttpClientTestingModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{provide: ApiService, useClass: MockApiService}],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      apiService = TestBed.get(ApiService);
      fixture.detectChanges();
    });
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

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
    const resetButton = fixture.debugElement.query(By.css('button'));
    resetButton.triggerEventHandler('click', null);
    expect(component.resetInputValue).toHaveBeenCalled();
  });

  it('should find the input', () => {
    input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.textContent).toBe('');
  });

  it('should input text', () => {
    input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.placeholder).toBe('Enter country');
  });

  it('should get filterCountries method', fakeAsync(() => {
    input = fixture.debugElement.query(By.css('input')).nativeElement;
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
    input = fixture.debugElement.query(By.css('input')).nativeElement;
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
