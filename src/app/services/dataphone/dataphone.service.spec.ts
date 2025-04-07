import { TestBed } from '@angular/core/testing';

import { DataphoneService } from './dataphone.service';

describe('DataphoneService', () => {
  let service: DataphoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataphoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
