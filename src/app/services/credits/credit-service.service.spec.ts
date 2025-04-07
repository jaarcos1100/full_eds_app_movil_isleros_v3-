import { TestBed } from '@angular/core/testing';

import { CreditServiceService } from './credit-service.service';

describe('CreditServiceService', () => {
  let service: CreditServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
