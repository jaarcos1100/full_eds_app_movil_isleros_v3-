import { TestBed } from '@angular/core/testing';

import { RestrictionsService } from './restrictions.service';

describe('RestrictionsService', () => {
  let service: RestrictionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestrictionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
