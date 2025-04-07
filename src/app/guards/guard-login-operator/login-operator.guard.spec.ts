import { TestBed } from '@angular/core/testing';

import { GuardLoginOperator } from './guard-login-operator-guard.service';

describe('LoginOperatorGuard', () => {
  let guard: GuardLoginOperator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardLoginOperator);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
