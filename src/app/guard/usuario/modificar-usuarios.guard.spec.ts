import { TestBed } from '@angular/core/testing';

import { ModificarUsuariosGuard } from './modificar-usuarios.guard';

describe('ModificarUsuariosGuard', () => {
  let guard: ModificarUsuariosGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ModificarUsuariosGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
