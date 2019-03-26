import {ApiService} from './api.service';
import {MySource} from '../app.component';
import {of} from 'rxjs/internal/observable/of';
import {inject, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

const expectedData: MySource[] = [
  {userId: '1', id: '11', title: 'First', completed: true},
  {userId: '2', id: '22', title: 'Second', completed: true},
  {userId: '3', id: '33', title: 'Third', completed: true},
];
describe('ApiService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let apiServiceSpy: ApiService;
  let apiUrl: string;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    apiServiceSpy = new ApiService(<any>httpClientSpy);
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  });

  it('_01_ should be created service', inject([ApiService], (service: ApiService) => {
    expect(service).toBeTruthy();
  }));

  it('_02_ should return stream of expected data (HttpClient called once)', () => {
    httpClientSpy.get.and.returnValue(of(expectedData));
    apiServiceSpy.get(apiUrl).subscribe(
      data => expect(data).toEqual(expectedData, 'expected data'),
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('_03_ should return stream of expected data (inject)', inject([ApiService, HttpTestingController],
    (service: ApiService, backend: HttpTestingController) => {
      service.get(apiUrl).subscribe((data: MySource[]) => {
        expect(data).toEqual(expectedData);
      });
      backend.expectOne({
        method: 'GET',
        url: apiUrl
      }).flush(expectedData);
    }));

  it('_04_ test for 404 error', () => {
    const errmsg = 'deliberate 404 error';

    httpClient.get<MySource[]>(apiUrl).subscribe(
      () => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404, 'status');
        expect(error.error).toEqual(errmsg, 'message');
      }
    );

    const req = httpTestingController.expectOne(apiUrl);
    req.flush(errmsg, {status: 404, statusText: 'Not Found'});
  });

});
