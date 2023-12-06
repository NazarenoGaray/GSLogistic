import { TestBed } from '@angular/core/testing';

import { DetallesUsuarioGuard } from './detalles-usuario.guard';

describe('DetallesUsuarioGuard', () => {
  let guard: DetallesUsuarioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DetallesUsuarioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
