import {MySource} from '../app.component';
import {of} from 'rxjs/internal/observable/of';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ApiService} from './api.service';
import {MockApiService} from './api.service.mock';

const expectedData: MySource[] = [
  {userId: '1', id: '11', title: 'First', completed: true},
  {userId: '2', id: '22', title: 'Second', completed: true},
  {userId: '3', id: '33', title: 'Third', completed: true},
];

interface Data {
  userId: string;
  id?: string;
  title?: string;
  completed?: boolean;
}

const testUrl = 'https://jsonplaceholder.typicode.com/posts';
describe('Api testing', () => {
  describe('HttpClient testing', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });

      httpClient = TestBed.get(HttpClient);
      httpTestingController = TestBed.get(HttpTestingController);
    });
    afterEach(() => {
      httpTestingController.verify();
    });

    it('HttpClient.get and return data.title', () => {
      const testData: Data = {userId: '1', id: '11', title: 'First', completed: true};

      httpClient.get<Data>(testUrl)
        .subscribe(data =>
          expect(data.title).toEqual(testData.title)
        );
      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toContain('GET');
      req.flush(testData);
    });

    it('test multiple requests', () => {
      const testData: Data[] = [
        {userId: '1', id: '11', title: 'First', completed: true},
        {userId: '2', id: '22', title: 'Second', completed: true},
        {userId: '3', id: '33', title: 'Third', completed: true},
      ];
      httpClient.get<Data[]>(testUrl)
        .subscribe(d => expect(d.length).toEqual(0, 'should have no data'));

      httpClient.get<Data[]>(testUrl)
        .subscribe(d => expect(d).toEqual([testData[0]], 'should be one element array'));

      httpClient.get<Data[]>(testUrl)
        .subscribe(d => expect(d).toEqual(testData, 'should be expected data'));

      const requests = httpTestingController.match(testUrl);
      expect(requests.length).toEqual(3);

      requests[0].flush([]);
      requests[1].flush([testData[0]]);
      requests[2].flush(testData);
    });

    it('test for 404 error', () => {
      const errmsg = 'deliberate 404 error';

      httpClient.get<Data[]>(testUrl).subscribe(
        () => fail('should have failed with the 404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(404, 'status');
          expect(error.error).toEqual(errmsg, 'message');
        }
      );

      const req = httpTestingController.expectOne(testUrl);

      req.flush(errmsg, {status: 404, statusText: 'Not Found'});
    });

    it('test for network error', () => {
      const errmsg = 'simulated network error';

      httpClient.get<Data[]>(testUrl).subscribe(
        () => fail('should have failed with the network error'),
        (error: HttpErrorResponse) => {
          expect(error.error.message).toEqual(errmsg, 'message');
        }
      );

      const req = httpTestingController.expectOne(testUrl);
      const errorEvent = new ErrorEvent('so sad', {
        message: errmsg,
        filename: 'ApiService.ts',
        lineno: 42,
        colno: 21
      });
      req.error(errorEvent);
    });

    it('httpTestingController.verify should fail if HTTP response not simulated', () => {
      httpClient.get(testUrl).subscribe();
      expect(() => httpTestingController.verify()).toThrow();
      const req = httpTestingController.expectOne(testUrl);
      req.flush(null);
    });

  });

  describe('ApiService testing', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let apiService: ApiService;
    let apiUrl: string;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [ApiService]
      });
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      apiService = new ApiService(<any>httpClientSpy);
      apiUrl = 'https://jsonplaceholder.typicode.com/posts';
    });

    it('should be created service', inject([ApiService], (service: ApiService) => {
      expect(service).toBeTruthy();
    }));

    it('should return stream of expected data (HttpClient called once)', () => {
      httpClientSpy.get.and.returnValue(of(expectedData));
      apiService.get(apiUrl).subscribe(
        data => expect(data).toEqual(expectedData, 'expected data'),
        fail
      );
      expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    });

    it('should return stream of expected data (inject)', inject([ApiService, HttpTestingController],
      (service: MockApiService, backend: HttpTestingController) => {
        service.get(apiUrl).subscribe((data: MySource[]) => {
          expect(data).toEqual(expectedData);
        });
        backend.expectOne({
          method: 'GET',
          url: apiUrl
        }).flush(expectedData);
      }));

    it('method get() should return [] from observable',
      (done: DoneFn) => {
        const service: MockApiService = new MockApiService();
        service.get(apiUrl).subscribe(value => {
          expect(value).toEqual([]);
          done();
        });
      });

  });
});
