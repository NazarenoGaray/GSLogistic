import { TestBed } from '@angular/core/testing';

import { ListaUsuariosGuard } from './lista-usuarios.guard';

describe('ListaUsuariosGuard', () => {
  let guard: ListaUsuariosGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ListaUsuariosGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
 