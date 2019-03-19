import {TestBed} from '@angular/core/testing';
import {ApiService} from './api.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('ApiService', () => {
  let http: HttpTestingController;
  let service: ApiService;

  const expectedData = [
    {userId: '1', id: '11', title: 'First', completed: true},
    {userId: '2', id: '22', title: 'Second', completed: true},
    {userId: '3', id: '33', title: 'Third', completed: true},
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [ApiService]
    });

    service = TestBed.get(ApiService);
    http = TestBed.get(HttpTestingController);

  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have made one request to GET data from expected URL', () => {

    service.get().subscribe((data: object) => {
      expect(data).toEqual(expectedData);
    });
    const req = http.expectOne(service.apiUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
  });

  it('get should return stubbed value from a spy', () => {
    // create `get` spy on an object representing the ValueService
    const valueServiceSpy =
      jasmine.createSpyObj('ApiService', ['get']);

    // set the value to return when the `get` spy is called.
    const stubValue = 'stub value';
    valueServiceSpy.get.and.returnValue(stubValue);

    service = new ApiService(valueServiceSpy);

    expect(service.get())
      .toBe(stubValue, 'service returned stub value');
    expect(valueServiceSpy.get.calls.count())
      .toBe(1, 'spy method was called once');
    expect(valueServiceSpy.get.calls.mostRecent().returnValue)
      .toBe(stubValue);
  });
});
