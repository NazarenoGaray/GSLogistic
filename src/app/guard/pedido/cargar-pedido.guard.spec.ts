import { TestBed } from '@angular/core/testing';

import { CargarPedidoGuard } from './cargar-pedido.guard';

describe('CargarPedidoGuard', () => {
  let guard: CargarPedidoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CargarPedidoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
