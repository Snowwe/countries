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
  userId;
  id?;
  title?: string;
  completed?;
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

    it('_01_ test HttpClient.get data.title', () => {
      const testData: Data = {userId: '1', id: '11', title: 'First', completed: true};

      httpClient.get<Data>(testUrl)
        .subscribe(data =>
          expect(data.title).toEqual(testData.title)
        );
      const req = httpTestingController.expectOne(testUrl);
      expect(req.request.method).toContain('GET');
      req.flush(testData);
      httpTestingController.verify();
    });

    it('_03_ test multiple requests', () => {
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

    it('_04_ test for 404 error', () => {
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

    it('_05_ can test for network error', () => {
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

    it('_06_ httpTestingController.verify should fail if HTTP response not simulated', () => {
      httpClient.get(testUrl).subscribe();
      expect(() => httpTestingController.verify()).toThrow();
      const req = httpTestingController.expectOne(testUrl);
      req.flush(null);
    });

  });

  describe('ApiService testing', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let apiServiceSpy: ApiService;
    let apiUrl: string;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [ApiService]
      });
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      apiServiceSpy = new ApiService(<any>httpClientSpy);
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
      (service: MockApiService, backend: HttpTestingController) => {
        service.get(apiUrl).subscribe((data: MySource[]) => {
          expect(data).toEqual(expectedData);
        });
        backend.expectOne({
          method: 'GET',
          url: apiUrl
        }).flush(expectedData);
      }));

    it('_04_ getObservableValue should return value from observable',
      (done: DoneFn) => {
        const service: MockApiService = new MockApiService();
        service.getObservableValue().subscribe(value => {
          expect(value).toBe('observable value');
          done();
        });
      });
  });
});
