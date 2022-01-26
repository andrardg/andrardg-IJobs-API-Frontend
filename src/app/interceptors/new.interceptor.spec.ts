import { TestBed } from '@angular/core/testing';

import { NewInterceptor } from './new.interceptor';

describe('NewInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      NewInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: NewInterceptor = TestBed.inject(NewInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
