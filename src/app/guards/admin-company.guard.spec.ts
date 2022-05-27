import { TestBed } from '@angular/core/testing';

import { AdminCompanyGuard } from './admin-company.guard';

describe('AdminCompanyGuard', () => {
  let guard: AdminCompanyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminCompanyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
