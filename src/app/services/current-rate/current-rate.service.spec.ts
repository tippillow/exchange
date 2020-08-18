import { TestBed } from '@angular/core/testing';

import { CurrentRateService } from './current-rate.service';

describe('CurrentRateService', () => {
  let service: CurrentRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
