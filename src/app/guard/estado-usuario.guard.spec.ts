import { TestBed } from '@angular/core/testing';

import { EstadoUsuarioGuard } from './estado-usuario.guard';

describe('EstadoUsuarioGuard', () => {
  let guard: EstadoUsuarioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EstadoUsuarioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
