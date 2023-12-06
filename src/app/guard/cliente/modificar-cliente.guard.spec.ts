import { TestBed } from '@angular/core/testing';

import { ModificarClienteGuard } from './modificar-cliente.guard';

describe('ModificarClienteGuard', () => {
  let guard: ModificarClienteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ModificarClienteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
