import { TestBed } from '@angular/core/testing';

import { ModificarProductosGuard } from './modificar-productos.guard';

describe('ModificarProductosGuard', () => {
  let guard: ModificarProductosGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ModificarProductosGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
