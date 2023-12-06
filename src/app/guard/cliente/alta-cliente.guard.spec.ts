import { TestBed } from '@angular/core/testing';

import { AltaClienteGuard } from './alta-cliente.guard';

describe('AltaClienteGuard', () => {
  let guard: AltaClienteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AltaClienteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
