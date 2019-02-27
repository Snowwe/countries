import { TestBed } from '@angular/core/testing';

import { CountriesArrService } from './countries-arr.service';

describe('CountriesArrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CountriesArrService = TestBed.get(CountriesArrService);
    expect(service).toBeTruthy();
  });
});
