import {ApiService} from './api.service';
import {MySource} from '../app.component';
import {of} from 'rxjs/internal/observable/of';

describe('ApiService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let apiService: ApiService;
  let apiUrl: string;
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    apiService = new ApiService(<any>httpClientSpy);
    apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  });

  it('should return expected data (HttpClient called once)', () => {
    const expectedData: MySource[] = [
      {userId: '1', id: '11', title: 'First', completed: true},
      {userId: '2', id: '22', title: 'Second', completed: true},
      {userId: '3', id: '33', title: 'Third', completed: true},
    ];

    httpClientSpy.get.and.returnValue(of(expectedData));

    apiService.get(apiUrl).subscribe(
      data => expect(data).toEqual(expectedData, 'expected data'),
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

});
