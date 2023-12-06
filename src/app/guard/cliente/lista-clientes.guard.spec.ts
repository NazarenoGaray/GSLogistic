import { TestBed } from '@angular/core/testing';

import { ListaClientesGuard } from './lista-clientes.guard';

describe('ListaClientesGuard', () => {
  let guard: ListaClientesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ListaClientesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
 