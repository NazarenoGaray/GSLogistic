import { TestBed } from '@angular/core/testing';

import { ModificarPedidoGuard } from './modificar-pedido.guard';

describe('ModificarPedidoGuard', () => {
  let guard: ModificarPedidoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ModificarPedidoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
