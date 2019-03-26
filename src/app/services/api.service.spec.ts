import {ApiService} from './api.service';
import {MySource} from '../app.component';
import {of} from 'rxjs/internal/observable/of';
import {inject, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

const expectedData: MySource[] = [
  {userId: '1', id: '11', title: 'First', completed: true},
  {userId: '2', id: '22', title: 'Second', completed: true},
  {userId: '3', id: '33', title: 'Third', completed: true},
];
describe('ApiService', () => {
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

  it('should be created', inject([ApiService], (service: ApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should return expected data (HttpClient called once)', () => {
    httpClientSpy.get.and.returnValue(of(expectedData));
    apiService.get(apiUrl).subscribe(
      data => expect(data).toEqual(expectedData, 'expected data'),
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should get data', inject([ApiService, HttpTestingController],
    (service: ApiService, backend: HttpTestingController) => {
       service.get(apiUrl).subscribe((data: MySource[]) => {
        expect(data).toEqual(expectedData);
      });
      backend.expectOne({
        method: 'GET',
        url: apiUrl
      }).flush(expectedData);
    }));
});
