import { TestBed } from '@angular/core/testing';

import { ListaProductosGuard } from './lista-productos.guard';

describe('ListaProductosGuard', () => {
  let guard: ListaProductosGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ListaProductosGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
