import { TestBed } from '@angular/core/testing';

import { LocalStorageIpPortService } from './local-storage-ip-port.service';

describe('OperatorService', () => {
  let service: LocalStorageIpPortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageIpPortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
